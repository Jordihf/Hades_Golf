// Comprobación de las reglas del configurador y de las cifras publicadas: npm run check
import fs from 'node:fs';
import path from 'node:path';
import {
  canRemove, decode, decodeStep, diagnostico, EMPTY, encode, hashFor, normalize, piecesFor, planName, price, Selection, summary,
  togglePiece,
} from '../src/lib/plan';
import { PRICES } from '../src/lib/prices';
import { cleanPath, findRoute, NOT_FOUND } from '../src/routes';
import { EVIDENCE } from '../src/content';

const mk = (type: string, booking: string, objectives: string[]): Selection => {
  const s = { ...EMPTY, type, booking, objectives };
  return { ...s, pieces: piecesFor(s) };
};

let fails = 0;
const ok = (label: string, cond: boolean, detail = '') => {
  if (!cond) fails++;
  console.log(cond ? 'OK ' : 'MAL', label, cond ? '' : detail);
};

/**
 * Importe esperado, leído de prices.json (nunca escrito aquí: este archivo es público).
 * Suma de las piezas mensuales, o el precio cerrado del Plan Comunicación completo.
 */
type Want = { monthly: number | null; setup: number } | undefined;
const sum = (...ids: string[]) => ids.reduce((t, id) => t + (PRICES!.pieces[id]?.monthly ?? 0), 0);
const want = (f: () => { monthly: number | null; setup: 'inicio' | 'incluido' }): Want => {
  if (!PRICES) return undefined;
  const w = f();
  return { monthly: w.monthly, setup: w.setup === 'inicio' ? PRICES.diagnosticoSetup : 0 };
};

/** Piezas, nombre y Diagnóstico siempre; importes solo si prices.json está cargado. */
const expect = (label: string, s: Selection, pieces: string, name: string | null, diag: string | null, w?: Want) => {
  const got: unknown[] = [s.pieces.join(','), planName(s), diagnostico(s)];
  const exp: unknown[] = [pieces, name, diag];
  const p = price(s);
  if (p && w) {
    got.push(p.monthly, p.setup);
    exp.push(w.monthly, w.setup);
  }
  ok(label, JSON.stringify(got) === JSON.stringify(exp), `→ ${JSON.stringify(got)} (esperado ${JSON.stringify(exp)})`);
};

if (!PRICES) console.log('(sin prices.json cargado: se comprueban reglas, no importes)');

const completo = () => PRICES!.comunicacionCompleto;
const datos = mk('comercial', 'golfmanager', ['franjas']);
expect('Plan Datos', datos, 'analiza,monitor', 'Plan Datos', 'inicio', want(() => ({ monthly: sum('analiza', 'monitor'), setup: 'inicio' })));
expect('Plan Visibilidad (hotel, sin Ocupación)', mk('hotel', '', ['ia', 'franjas']), 'monitor', 'Plan Visibilidad', 'inicio', want(() => ({ monthly: sum('monitor'), setup: 'inicio' })));
const com = mk('socios', '', ['posicionar']);
expect('Plan Comunicación básico', com, 'linkedin,monitor', 'Plan Comunicación', 'incluido', want(() => ({ monthly: sum('linkedin', 'monitor'), setup: 'incluido' })));
const full = mk('socios', '', ['posicionar', 'medios']);
expect('Plan Comunicación completo', full, 'linkedin,monitor,nota', 'Plan Comunicación completo', 'incluido', want(() => ({ monthly: completo(), setup: 'incluido' })));
expect('Programa «otro»: Ocupación fuera del plan → Plan Visibilidad', mk('comercial', 'otro', ['franjas']), 'monitor', 'Plan Visibilidad', 'inicio', want(() => ({ monthly: sum('monitor'), setup: 'inicio' })));
expect('«No lo sé»: Ocupación cuenta', mk('mixto', 'nose', ['franjas']), 'analiza,monitor', 'Plan Datos', 'inicio', want(() => ({ monthly: sum('analiza', 'monitor'), setup: 'inicio' })));
expect('Competitiva sustituye a Monitor', togglePiece(datos, 'competitiva'), 'analiza,competitiva', 'Plan Datos', 'inicio', want(() => ({ monthly: sum('analiza', 'competitiva'), setup: 'inicio' })));
expect('Nota con Competitiva: precio en propuesta', togglePiece(full, 'competitiva'), 'linkedin,nota,competitiva', 'Plan Comunicación completo', 'incluido', want(() => ({ monthly: null, setup: 'incluido' })));
expect('Sin LinkedIn no hay nota → Plan Visibilidad', togglePiece(full, 'linkedin'), 'monitor', 'Plan Visibilidad', 'inicio', want(() => ({ monthly: sum('monitor'), setup: 'inicio' })));
expect('Añadir nota arrastra LinkedIn', togglePiece(mk('mixto', 'teeone', ['ia']), 'nota'), 'monitor,nota,linkedin', 'Plan Comunicación completo', 'incluido', want(() => ({ monthly: completo(), setup: 'incluido' })));
expect('Mercados + posicionar → Plan Comunicación', mk('comercial', 'nose', ['mercados', 'posicionar']), 'mercados,linkedin,monitor', 'Plan Comunicación', 'incluido', want(() => ({ monthly: sum('linkedin', 'monitor'), setup: 'incluido' })));
expect('Hotel IA + posicionar → Plan Comunicación (no Visibilidad)', mk('hotel', '', ['ia', 'posicionar']), 'monitor,linkedin', 'Plan Comunicación', 'incluido', want(() => ({ monthly: sum('linkedin', 'monitor'), setup: 'incluido' })));
expect('Datos y Comunicación: decide el primer objetivo', mk('comercial', 'golfmanager', ['posicionar', 'franjas']), 'linkedin,monitor,analiza', 'Plan Comunicación', 'incluido');
expect('Solo mercados → el informe, sin plan mensual', mk('comercial', 'golfmanager', ['mercados']), 'mercados', 'Informe de mercados emisores', null, want(() => ({ monthly: null, setup: 'incluido' })));
expect('Solo próximamente → sin plan', { ...EMPTY, type: 'socios', interests: ['redes'] }, '', null, null, want(() => ({ monthly: null, setup: 'incluido' })));

// «Ocupación con mi programa de reservas» solo con «Otro»: al cambiar de programa desaparece.
const otro = { ...mk('comercial', 'otro', ['franjas']), interests: ['ocupacion', 'redes'] };
ok('Con «Otro» se guarda el interés en Ocupación', normalize(otro).interests.join(',') === 'ocupacion,redes');
ok('De «Otro» a GolfManager se quita el interés en Ocupación', normalize({ ...otro, booking: 'golfmanager' }).interests.join(',') === 'redes');
ok('Un enlace con GolfManager e interés en Ocupación lo ignora', decode('#plan=t=comercial&r=golfmanager&o=franjas&i=ocupacion')?.interests.length === 0);

// Composición mínima: nunca una pieza mensual suelta sin visibilidad en IA.
ok('No se puede quitar la última visibilidad con Ocupación', !canRemove(datos, 'monitor'));
ok('No se puede quitar la última visibilidad con LinkedIn', !canRemove(com, 'monitor'));
ok('Sí se puede quitar Ocupación', canRemove(datos, 'analiza'));
ok('Un enlace con solo LinkedIn recupera la visibilidad', decode('#plan=t=socios&p=linkedin')?.pieces.join(',') === 'linkedin,monitor');
for (const s of [datos, com, full, togglePiece(datos, 'analiza'), togglePiece(com, 'linkedin')]) {
  const solo = s.pieces.filter((p) => p !== 'mercados' && p !== 'nota');
  ok(`Sin pieza mensual suelta: ${s.pieces.join(',')}`, !(solo.length === 1 && ['analiza', 'linkedin'].includes(solo[0])));
}

// Enlaces.
const enc = encode({ ...full, interests: ['redes'] });
ok('Enlace ida y vuelta', JSON.stringify(decode(`#${enc}`)) === JSON.stringify({ ...full, interests: ['redes'] }), enc);
ok('Enlace roto se ignora', decode('#plan=%ZZ') === null);
ok('Duplicados fuera', decode('#plan=t=hotel&o=ia,ia,ia&p=monitor,monitor')?.objectives.join(',') === 'ia');
ok('Objetivo sin tipo (páginas de plan)', decode('#plan=o=franjas')?.objectives.join(',') === 'franjas');
ok('Paso del enlace', decodeStep(hashFor(full, 4), full) === 4 && decodeStep(hashFor(full, 2), full) === 2);
ok('Paso imposible se corrige', decodeStep('#plan=t=hotel&s=2', decode('#plan=t=hotel')!) === 3);
ok('Empezar de nuevo limpia el enlace', hashFor(EMPTY, 1) === '#configurador');

// Resumen copiado («Copiar mi plan»).
const sum1 = summary(mk('comercial', 'nose', ['franjas']), 'https://hadesgolf.com/#plan=x');
ok('Resumen: condición de Ocupación con «No lo sé»', sum1.includes('Ocupación por franjas (solo con GolfManager o TeeOne; lo comprobamos contigo)'), sum1);
ok('Resumen: sin «Precio: Precio…»', !/Precio: Precio/.test(sum1), sum1);
if (!PRICES) ok('Resumen: Diagnóstico en tu propuesta', sum1.includes('pago de inicio (en tu propuesta)'), sum1);

// Rutas.
ok('/index.html es la portada', findRoute('/index.html').path === '/');
ok('/plan-datos/index.html es el Plan Datos', findRoute('/plan-datos/index.html').path === '/plan-datos/');
ok('Ruta desconocida → 404', findRoute('/blog/x/') === NOT_FOUND);
ok('cleanPath', cleanPath('/radiografia/index.html') === '/radiografia/');

// Cifras con caducidad.
const today = new Date().toISOString().slice(0, 10);
EVIDENCE.filter((e) => e.expires).forEach((e) => ok(`Cifra vigente hasta ${e.expires}`, e.expires! >= today, '→ caducada: retírala o actualízala en src/content.ts'));

// Repositorio público: ni importes ni referencias internas en lo que se sube.
// Los patrones se arman por partes para que este archivo no se detecte a sí mismo.
const FORBIDDEN: [RegExp, string][] = [
  [new RegExp('\\d\\s?' + '€'), 'importe en €'],
  [new RegExp('EV' + '-I'), 'referencia interna del banco de pruebas'],
  [new RegExp('\\bBo' + 'ard\\b'), 'referencia interna'],
];
const SKIP_DIRS = new Set(['node_modules', 'dist', 'dist-ssr', '.check', '.git']);
const SKIP_FILES = new Set([path.join('src', 'data', 'prices.json')]); // no versionado (.gitignore)
const scan = (dir: string): string[] =>
  fs.readdirSync(dir, { withFileTypes: true }).flatMap((e) => {
    const f = path.join(dir, e.name);
    if (e.isDirectory()) return SKIP_DIRS.has(e.name) ? [] : scan(f);
    return /\.(tsx?|mjs|js|json|css|html|md|yml|py|svg|txt)$/.test(e.name) || e.name.startsWith('.') ? [f] : [];
  });
const repo = process.cwd();
const hits: string[] = [];
for (const f of scan(repo)) {
  const rel = path.relative(repo, f);
  if (SKIP_FILES.has(rel) || rel === 'package-lock.json') continue;
  const txt = fs.readFileSync(f, 'utf8');
  for (const [re, what] of FORBIDDEN) if (re.test(txt)) hits.push(`${rel}: ${what} («${txt.match(re)![0]}»)`);
}
ok('Repositorio sin importes ni referencias internas', !hits.length, `\n  · ${hits.join('\n  · ')}`);

process.exit(fails ? 1 : 0);

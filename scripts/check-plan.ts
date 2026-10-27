// Comprobación de la tienda: precios, descuentos, dependencias, URL, resumen, rutas y textos. npm run check
import fs from 'node:fs';
import path from 'node:path';
import prices from '../src/data/prices.json';
import site from '../src/data/site.json';
import images from '../src/data/images.json';
import { PRODUCTS, SHELVES, productById } from '../src/data/catalog';
import {
  Cart, EMPTY, add, clear, decode, encode, has, headline, lineOf, planLink, remove, sellerName, setPay, setQty, summary, toggle, totals,
} from '../src/lib/cart';
import { euros } from '../src/lib/money';
import { FAQ, MEDIO_SAVING_PCT, STATS } from '../src/content';
import { cleanPath, findRoute, NOT_FOUND, ROUTES } from '../src/routes';

let fails = 0;
let n = 0;
const ok = (label: string, cond: boolean, detail: unknown = '') => {
  n++;
  if (!cond) fails++;
  console.log(cond ? 'OK ' : 'MAL', label, cond ? '' : `→ ${typeof detail === 'string' ? detail : JSON.stringify(detail)}`);
};
const eq = (label: string, got: unknown, want: unknown) => ok(label, JSON.stringify(got) === JSON.stringify(want), { got, want });

const P = prices.products;
const c = (euros: number) => Math.round(euros * 100);
const build = (...steps: ((x: Cart) => Cart)[]) => steps.reduce((acc, f) => f(acc), EMPTY);
const A = (id: Parameters<typeof add>[1], v?: string) => (x: Cart) => add(x, id, v).cart;
const R = (id: Parameters<typeof remove>[1]) => (x: Cart) => remove(x, id).cart;
const ids = (x: Cart) => x.lines.map((l) => l.id).join(',');

// ── Catálogo
eq('Catálogo: 12 productos (con la Radiografía)', PRODUCTS.length, 12);
eq('Catálogo: 3 escaparates', SHELVES.map((s) => s.id), ['conocer', 'llena', 'fuera']);
ok('Catálogo: sin LinkedIn ni torneos', !PRODUCTS.some((p) => /linkedin|torneo/i.test(p.id + p.name)));
ok('Catálogo: solo dos estados (Disponible y Reserva)', PRODUCTS.every((p) => p.status === 'disponible' || p.status === 'reserva'));
eq('Catálogo: solo Campañas en Reserva', PRODUCTS.filter((p) => p.status === 'reserva').map((p) => p.id), ['campanas']);
ok('Catálogo: cada producto tiene precio en prices.json', PRODUCTS.every((p) => p.id in P && p.variants.every((v) => Number.isFinite(v.price))));
ok('Catálogo: cada producto en un escaparate válido', PRODUCTS.every((p) => p.shelf === 'gratis' || SHELVES.some((s) => s.id === p.shelf)));
eq('Medio xGolf: anual 77 €/mes, mensual 199 €, puntual 99 € pago único', productById('medio')!.variants.map((v) => [v.id, v.price, v.billing]), [
  ['anual', 77, 'mensual'], ['mensual', 199, 'mensual'], ['puntual', 99, 'unico'],
]);
eq('Medio xGolf: ahorro anual 61 %', MEDIO_SAVING_PCT, 61);
ok('Medio xGolf: nota «924 € al año»', productById('medio')!.variants[0].note === `${euros(92400)} al año`, productById('medio')!.variants[0].note);
eq('Apariciones en redes: 99/149/349 pagos únicos', productById('redes')!.variants.map((v) => [v.price, v.billing]), [[99, 'unico'], [149, 'unico'], [349, 'unico']]);
eq('Precios sueltos', ['nota', 'visibilidad', 'competitiva', 'diagnostico', 'ocupacion', 'campanas', 'golfy', 'turoperadores', 'mercados'].map((id) => productById(id)!.variants[0].price), [238, 71, 179, 300, 69, 149, 99, 249, 390]);
eq('Golfy: cuota mensual con descuentos', [productById('golfy')!.variants[0].billing, productById('golfy')!.variants[0].discountable], ['mensual', true]);
eq('Turoperadores: pago único por envío, sin descuentos', [productById('turoperadores')!.variants[0].billing, productById('turoperadores')!.variants[0].discountable, productById('turoperadores')!.variants[0].unit?.one], ['unico', false, 'envío']);
ok('Medio xGolf y pagos únicos: sin descuentos', PRODUCTS.flatMap((p) => p.variants).filter((v) => v.billing !== 'mensual' || v.name.startsWith('Medio')).every((v) => !v.discountable));
eq('Etiquetas: Requiere Ocupación y Golfy', [productById('campanas')!.smallNote, productById('golfy')!.smallNote, productById('ocupacion')!.smallNote], [
  'Requiere Ocupación', 'Para campos que están en Golfy', 'Para campos con GolfManager o TeeOne',
]);

// ── Formato de importes
eq('Formato: 1.234 €', euros(123400), '1.234 €');
eq('Formato: 66,74 €', euros(6674), '66,74 €');
eq('Formato: −5 €', euros(-500), '−5 €');
eq('Formato: 12.345.678 €', euros(1234567800), '12.345.678 €');

// ── Combinaciones del carrito (≥ 8)
const t1 = totals(build(A('radiografia')));
eq('1. Solo Radiografía: 0 € gratis', [t1.count, t1.monthly, t1.once, headline(t1).unit], [1, 0, 0, 'gratis']);

const x2 = build(A('diagnostico'), A('redes', 'pack4'));
const t2 = totals(x2);
eq('2. Solo pagos únicos: 649 € (no «0 €/mes»)', [t2.monthly, t2.once, headline(t2).value, headline(t2).unit, headline(t2).label], [0, c(649), euros(c(649)), '', 'Total en pagos únicos']);

const x3 = build(A('campanas'));
eq('3. Campañas añade Ocupación', ids(x3), 'ocupacion,campanas');
ok('3. Aviso al añadir Ocupación', /Añadimos Ocupación/.test(add(EMPTY, 'campanas').notice?.msg ?? ''));
const t3 = totals(x3);
eq('3. Campañas en reserva: cobra solo Ocupación', [t3.monthly, t3.reservedMonthly], [c(69), c(149)]);

const r4 = remove(x3, 'ocupacion');
eq('4. Quitar Ocupación quita Campañas', ids(r4.cart), '');
ok('4. Aviso con Deshacer', Boolean(r4.notice?.undo) && /Campañas según ocupación/.test(r4.notice!.msg));
eq('4. Deshacer recupera las dos', ids(r4.notice!.undo!), 'ocupacion,campanas');
eq('4b. Quitar Campañas deja Ocupación', ids(remove(x3, 'campanas').cart), 'ocupacion');

const x5 = build(A('visibilidad'), A('competitiva'));
eq('5. Competitiva sustituye a Visibilidad en IA', ids(x5), 'competitiva');
ok('5. Aviso de sustitución con Deshacer', /sustituye/.test(add(build(A('visibilidad')), 'competitiva').notice?.msg ?? '') && Boolean(add(build(A('visibilidad')), 'competitiva').notice?.undo));
eq('5b. Y al revés', ids(build(A('competitiva'), A('visibilidad'))), 'visibilidad');

const x6 = build(A('nota'), A('visibilidad'), A('golfy'));
const t6 = totals(x6);
const base6 = c(238 + 71 + 99);
eq('6. Pack −5 % con 3 cuotas (Golfy cuenta)', [t6.packApplies, t6.packDiscount, t6.monthly], [true, Math.round(base6 * 0.05), base6 - Math.round(base6 * 0.05)]);
const t6a = totals(setPay(x6, 'anual'));
const ann6 = Math.round(base6 * 0.06);
const pack6 = Math.round((base6 - ann6) * 0.05);
eq('6. Anual −6 % y después pack −5 %', [t6a.annualDiscount, t6a.packDiscount, t6a.monthly], [ann6, pack6, base6 - ann6 - pack6]);
const monthly6 = base6 - Math.round(base6 * 0.05);
eq('6. Facturado al año y ahorro real frente a mensual', [t6a.yearBilled, t6a.yearSaving, t6.annualSavingIfSwitch], [(base6 - ann6 - pack6) * 12, (monthly6 - (base6 - ann6 - pack6)) * 12, (monthly6 - (base6 - ann6 - pack6)) * 12]);

const x7 = setPay(build(A('medio', 'anual'), A('nota'), A('ocupacion')), 'anual');
const t7 = totals(x7);
const base7 = c(238 + 69);
eq('7. Medio xGolf sin descuentos ni pack (2 cuotas con descuento)', [t7.fixedMonthly, t7.packApplies, t7.annualDiscount, t7.monthly], [c(77), false, Math.round(base7 * 0.06), base7 - Math.round(base7 * 0.06) + c(77)]);

const x8 = setQty(build(A('turoperadores'), A('mercados'), A('ocupacion')), 'turoperadores', 3);
const t8 = totals(x8);
eq('8. Mixto: 3 envíos a turoperadores + informe + Ocupación', [t8.once, t8.monthly, headline(t8).label], [c(249 * 3 + 390), c(69), 'Total al mes']);
eq('8. Cantidad limitada a 1-20', [lineOf(setQty(x8, 'turoperadores', 0), 'turoperadores')!.q, lineOf(setQty(x8, 'turoperadores', 99), 'turoperadores')!.q], [1, 20]);

const x9 = build(A('medio', 'mensual'), A('medio', 'puntual'));
eq('9. Cambiar de opción no duplica el producto', [x9.lines.length, lineOf(x9, 'medio')!.v], [1, 'puntual']);
const t9 = totals(x9);
eq('9. Medio puntual pasa a pagos únicos', [t9.monthly, t9.once], [0, c(99)]);

const x10 = build(A('nota'), A('diagnostico'), A('golfy'), A('competitiva'), A('ocupacion'), A('campanas'));
const t10 = totals(x10);
eq('10. Plan grande: pack con 4 cuotas que cobran (Campañas en reserva no cuenta)', [t10.packCount, t10.packApplies, t10.reservedLines.length], [4, true, 1]);
eq('10. Vaciar con Deshacer', [clear(x10).cart.lines.length, clear(x10).notice?.undo?.lines.length], [0, 6]);
eq('10. toggle añade y quita', [has(toggle(EMPTY, 'nota').cart, 'nota'), has(toggle(toggle(EMPTY, 'nota').cart, 'nota').cart, 'nota')], [true, false]);

// ── URL (#plan=…)
const big = setPay(setQty(build(A('radiografia'), A('medio', 'anual'), A('redes', 'recomendacion'), A('competitiva'), A('turoperadores'), A('campanas')), 'turoperadores', 2), 'anual');
eq('URL: ida y vuelta', decode(`#${encode(big)}`), big);
eq('URL: forma legible', encode(build(A('medio', 'anual'), A('nota'))), 'plan=medio:anual,nota');
eq('URL: vacío', encode(EMPTY), '');
eq('URL: ignora basura y reaplica reglas', ids(decode('#plan=campanas,xx,visibilidad,competitiva,<script>')!), 'competitiva,ocupacion,campanas');
eq('URL: hash ajeno no es un plan', decode('#tienda'), null);
eq('URL: opción desconocida → la primera', lineOf(decode('#plan=medio:zzz')!, 'medio')!.v, 'anual');

// ── Resumen y comercial
const link = planLink(site.siteUrl, big, '?comercial=fran');
ok('Enlace con comercial', link.startsWith('https://hadesgolf.com/?comercial=fran#plan='), link);
ok('Enlace sin comercial desconocido', !planLink(site.siteUrl, big, '?comercial=pepe').includes('comercial'));
eq('Comercial: fran → Fran Martos', [sellerName('?comercial=fran'), sellerName('?comercial=FRAN'), sellerName('')], ['Fran Martos', 'Fran Martos', null]);
const sum = summary(big, link, 'Fran Martos');
ok('Resumen: línea del comercial', sum.includes('Propuesta preparada con Fran Martos (Hades Golf)'));
ok('Resumen: Radiografía la prepara el comercial', sum.includes('Radiografía de mi campo: la prepara mi comercial en la visita'));
ok('Resumen: secciones', ['Cuotas mensuales', 'Pagos únicos', 'Reserva (sin cargo hasta el lanzamiento)', 'Facturado una vez al año', 'Ahorras al año'].every((k) => sum.includes(k)), sum);
ok('Resumen: envíos', sum.includes('× 2 envíos'));
ok('Resumen: enlace al final', sum.trim().endsWith(link));
const sumOnce = summary(x2, 'L');
ok('Resumen solo pagos únicos: sin «/mes»', !sumOnce.includes('/mes') && sumOnce.includes('Total pagos únicos: 649'), sumOnce);
ok('Resumen: sin «0 €/mes» en ningún caso', [x2, x3, big, EMPTY, build(A('radiografia'))].every((x) => !summary(x, 'L').includes('0 €/mes')));

// ── Rutas
eq('Rutas publicadas', ROUTES.map((r) => r.path), ['/', '/radiografia/', '/aviso-legal/', '/privacidad/', '/cookies/']);
eq('Páginas de plan retiradas → 404 en cliente (el build las redirige)', ['/plan-datos/', '/plan-visibilidad/', '/plan-comunicacion/'].map((p) => findRoute(p) === NOT_FOUND), [true, true, true]);
eq('cleanPath quita index.html', cleanPath('/radiografia/index.html'), '/radiografia/');
ok('Descripciones ≤ 160 caracteres', ROUTES.every((r) => r.description.length <= 160), ROUTES.map((r) => r.description.length));
const prer = fs.readFileSync(path.resolve('scripts/prerender.mjs'), 'utf8');
ok('Prerender redirige las páginas de plan', ['plan-datos', 'plan-visibilidad', 'plan-comunicacion'].every((p) => prer.includes(`'${p}'`)));

// ── Interruptores
eq('Interruptores: precios sí, contacto y titular no', [site.flags.SHOW_PRICES, site.flags.CONTACT_ENABLED, site.flags.LEGAL_ENTITY_READY], [true, false, false]);
eq('Correos preparados', [site.contactEmail, (site as { contactCc?: string }).contactCc], ['info@hadesgolf.com', 'hello@stellarisgolf.com']);
ok('Titular sin inventar', Object.values(site.legal).every((v) => v === ''));

// ── Imágenes
eq('Huecos de imagen', images.slots.map((s) => `${s.name}:${s.w}x${s.h}`), [
  'hero:2400x1350', 'hero-movil:1080x1350', 'escaparate-conocer:1600x1000', 'escaparate-llenar:1600x1000', 'escaparate-fuera:1600x1000', 'visita:1200x1500', 'cierre:2400x1000',
]);
const imgDir = path.resolve('static/img');
const files = fs.existsSync(imgDir) ? fs.readdirSync(imgDir) : [];
ok('static/img solo contiene huecos (nada de fotos de xGolf ni Creators Masters)', files.every((f) => images.slots.some((s) => f.startsWith(s.name))), files);
ok('WebP de los huecos < 250 KB', files.filter((f) => f.endsWith('.webp')).every((f) => fs.statSync(path.join(imgDir, f)).size < 250_000));

// ── Honestidad del texto publicado
const texts = [
  ...PRODUCTS.flatMap((p) => [p.name, p.line, p.smallNote ?? '', p.badge ?? '', ...p.variants.map((v) => `${v.name} ${v.note ?? ''}`)]),
  ...SHELVES.flatMap((s) => [s.title, s.sub]),
  ...FAQ.flatMap((f) => [f.q, f.a]),
  ...STATS.flatMap((s) => [s.big, s.label]),
  ...['src/content.ts', 'src/pages/Home.tsx', 'src/components/Shop.tsx', 'src/pages/Radiografia.tsx', 'src/components/RadiografiaCard.tsx'].map((f) =>
    fs.readFileSync(path.resolve(f), 'utf8').replace(/^\s*(\/\/|\*|\/\*\*).*$/gm, ''),
  ),
].join('\n');
const banned: [RegExp, string][] = [
  [/tiempo real/i, '«tiempo real»'],
  [/ChatGPT|Google|Perplexity|Gemini/, 'buscadores con nombre'],
  [/medios nacionales/i, '«medios nacionales»'],
  [/testimoni/i, 'testimonios'],
  [/últimas plazas|solo quedan|plazas limitadas/i, 'escasez falsa'],
  [/\busted\b/i, '«usted»'],
  [/Costa Daurada|Creators Masters/i, 'referencias de clientes o torneos'],
];
for (const [re, label] of banned) ok(`Honestidad: sin ${label}`, !re.test(texts), texts.match(re)?.[0]);
ok('Cifras: solo 18.000+, 70+ y el ahorro del anual', STATS.map((s) => s.big).join('|') === `18.000+|70+|${MEDIO_SAVING_PCT} %`);

console.log(`\n${n} comprobaciones, ${fails} fallos.`);
if (fails) process.exit(1);

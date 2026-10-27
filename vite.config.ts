import fs from 'node:fs';
import path from 'node:path';
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

// Sin variables de entorno ni claves: la web es estática y no llama a ningún servicio externo.
const root = path.dirname(new URL(import.meta.url).pathname);
const site = JSON.parse(fs.readFileSync(path.join(root, 'src/data/site.json'), 'utf8'));
const pricesFile = path.join(root, 'src/data/prices.json');

/** Salvaguardas de los interruptores de site.json: el build falla antes de publicar algo a medias. */
function checkFlags() {
  const errors: string[] = [];
  const { flags, legal, contactEmail } = site;
  const pending = (v: unknown) => typeof v !== 'string' || !v.trim() || /PENDIENTE/i.test(v);
  if (flags.LEGAL_ENTITY_READY) {
    for (const k of ['holder', 'taxId', 'registryName', 'address', 'email', 'brandNote']) {
      if (pending(legal[k])) errors.push(`LEGAL_ENTITY_READY=true pero legal.${k} está vacío o PENDIENTE.`);
    }
  }
  if (flags.CONTACT_ENABLED && pending(contactEmail)) errors.push('CONTACT_ENABLED=true pero contactEmail está vacío o PENDIENTE.');
  // Quien recoge datos tiene que decir quién es el responsable (art. 13.1.a del RGPD).
  if (flags.CONTACT_ENABLED && !flags.LEGAL_ENTITY_READY) errors.push('CONTACT_ENABLED=true exige LEGAL_ENTITY_READY=true (titular publicado).');
  if (!fs.existsSync(pricesFile)) errors.push('Falta src/data/prices.json (catálogo de precios, versionado).');
  if (errors.length) throw new Error(`\n${errors.map((e) => `  · ${e}`).join('\n')}\n`);
}
checkFlags();

/**
 * Huecos de imagen (src/data/images.json): qué archivos hay en static/img. Sin archivo, la web pone el marcador
 * de marca (degradado + trama + «H»), así que el build no falla por una foto que aún no existe.
 */
function scanImages() {
  const slots: { name: string; w: number; h: number }[] = JSON.parse(fs.readFileSync(path.join(root, 'src/data/images.json'), 'utf8')).slots;
  const dir = path.join(root, 'static/img');
  const has = (f: string) => fs.existsSync(path.join(dir, f));
  return Object.fromEntries(
    slots.map((s) => [
      s.name,
      {
        webp: has(`${s.name}.webp`),
        webp2x: has(`${s.name}@2x.webp`),
        orig: ['jpg', 'jpeg', 'png'].map((e) => `${s.name}.${e}`).find(has) ?? null,
        w: s.w,
        h: s.h,
      },
    ]),
  );
}

export default defineConfig({
  base: '/',
  publicDir: 'static',
  server: {
    port: 3000,
    host: '0.0.0.0',
  },
  define: { __IMG__: JSON.stringify(scanImages()) },
  plugins: [react()],
});

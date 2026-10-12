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
  if (flags.SHOW_PRICES && !fs.existsSync(pricesFile)) errors.push('SHOW_PRICES=true pero no existe src/data/prices.json.');
  if (errors.length) throw new Error(`\n${errors.map((e) => `  · ${e}`).join('\n')}\n`);
}
checkFlags();

// Los importes solo entran en el JS si SHOW_PRICES=true. HADES_WITH_PRICES=1 los carga para `npm run check`.
const withPrices = site.flags.SHOW_PRICES || (process.env.HADES_WITH_PRICES === '1' && fs.existsSync(pricesFile));

export default defineConfig({
  base: '/',
  publicDir: 'static',
  resolve: {
    alias: { '@prices': withPrices ? pricesFile : path.join(root, 'src/data/prices.off.json') },
  },
  server: {
    port: 3000,
    host: '0.0.0.0',
  },
  plugins: [react()],
});

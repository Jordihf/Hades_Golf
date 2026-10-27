// Genera un HTML estático por URL a partir del build de cliente y del build SSR.
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath, pathToFileURL } from 'node:url';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const dist = path.join(root, 'dist');
const ssrDir = path.join(root, 'dist-ssr');
const site = JSON.parse(fs.readFileSync(path.join(root, 'src/data/site.json'), 'utf8'));

const { render, ROUTES, NOT_FOUND } = await import(pathToFileURL(path.join(ssrDir, 'entry-server.js')).href);

const template = fs.readFileSync(path.join(dist, 'index.html'), 'utf8');

const esc = (s) => s.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');
const json = (o) => JSON.stringify(o).replace(/</g, '\\u003c');

function page(route, html) {
  const url = `${site.siteUrl}${route.path}`;
  const head = [
    route.noindex
      ? '<meta name="robots" content="noindex">'
      : `<link rel="canonical" href="${url}">`,
    '<meta property="og:type" content="website">',
    '<meta property="og:locale" content="es_ES">',
    '<meta property="og:site_name" content="Hades Golf">',
    `<meta property="og:title" content="${esc(route.title)}">`,
    `<meta property="og:description" content="${esc(route.description)}">`,
    route.noindex ? '' : `<meta property="og:url" content="${url}">`,
    `<meta property="og:image" content="${site.siteUrl}/og-hades.png">`,
    '<meta property="og:image:width" content="1200">',
    '<meta property="og:image:height" content="630">',
    '<meta property="og:image:alt" content="Hades Golf: la tienda de IA para campos de golf">',
    '<meta name="twitter:card" content="summary_large_image">',
    ...(route.jsonLd ?? []).map((o) => `<script type="application/ld+json">${json(o)}</script>`),
  ]
    .filter(Boolean)
    .join('\n    ');
  // Reemplazos con función: así un «$&» o «$'» en los textos no se interpreta como patrón.
  return template
    .replace(/<title>[\s\S]*?<\/title>/, () => `<title>${esc(route.title)}</title>`)
    .replace(/<meta name="description"[^>]*>/, () => `<meta name="description" content="${esc(route.description)}">`)
    .replace('<!--head-->', () => head)
    .replace('<!--app-->', () => html);
}

function write(rel, content) {
  const file = path.join(dist, rel);
  fs.mkdirSync(path.dirname(file), { recursive: true });
  fs.writeFileSync(file, content);
}

for (const route of ROUTES) {
  write(path.join(route.path, 'index.html'), page(route, render(route.path)));
}
write('404.html', page(NOT_FOUND, render(NOT_FOUND.path)));

// El blog de marzo se retira: sus URL redirigen a la portada.
const redirect = `<!DOCTYPE html>
<html lang="es"><head><meta charset="UTF-8"><meta name="robots" content="noindex">
<meta http-equiv="refresh" content="0; url=/">
<title>Hades Golf</title></head>
<body><p><a href="/">Ir a la portada de Hades Golf</a></p></body></html>
`;
const oldPosts = [
  'presentacion-soluciones-hades-ia',
  'agente-comunicacion-socios-fidelizacion',
  'revolucion-b2b-agente-turoperadores',
  'atencion-al-cliente-24-7',
  'maximizando-ticket-agentes-paquetizacion',
];
write('blog/index.html', redirect);
oldPosts.forEach((id) => write(`blog/${id}/index.html`, redirect));

// Las páginas de plan del configurador por pasos (12/10) se retiran: la portada es la tienda.
const OLD_PLAN_PAGES = ['plan-datos', 'plan-visibilidad', 'plan-comunicacion'];
OLD_PLAN_PAGES.forEach((id) => write(`${id}/index.html`, redirect));

const sitemap = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${ROUTES.map((r) => `  <url><loc>${site.siteUrl}${r.path}</loc></url>`).join('\n')}
</urlset>
`;
write('sitemap.xml', sitemap);
write('robots.txt', `User-agent: *\nAllow: /\n\nSitemap: ${site.siteUrl}/sitemap.xml\n`);

fs.rmSync(ssrDir, { recursive: true, force: true });

// Salvaguardas finales sobre lo que se va a publicar.
const files = [];
const walk = (d) => fs.readdirSync(d, { withFileTypes: true }).forEach((e) => {
  const f = path.join(d, e.name);
  if (e.isDirectory()) walk(f);
  else if (/\.(html|js|css|xml|txt|json)$/.test(e.name)) files.push(f);
});
walk(dist);
const problems = [];
for (const f of files) {
  const txt = fs.readFileSync(f, 'utf8');
  const rel = path.relative(dist, f);
  if (/PENDIENTE/.test(txt)) problems.push(`${rel} contiene «PENDIENTE».`);
  if (!site.flags.SHOW_PRICES && /\d\s?€/.test(txt)) problems.push(`${rel} contiene un importe en € con SHOW_PRICES=false.`);
}
if (problems.length) {
  console.error(`El build no se puede publicar:\n${problems.map((p) => `  · ${p}`).join('\n')}`);
  process.exit(1);
}
console.log(`Prerenderizadas ${ROUTES.length} páginas + 404, redirecciones (blog y páginas de plan), sitemap.xml y robots.txt.`);

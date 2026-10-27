# hadesgolf.com

Tienda de soluciones de IA para clubes, campos y hoteles de golf. React + Vite, HTML prerenderizado por URL, sin cookies, sin analítica, sin scripts ni fuentes de terceros y sin claves. Se publica en GitHub Pages (`.github/workflows/deploy.yml`).

## Comandos

- `npm install`
- `npm run dev` — servidor local
- `npm run lint` — `tsc` estricto
- `npm run check` — reglas de la tienda (precios, descuentos, dependencias, URL del plan, resumen, rutas, huecos de imagen y textos prohibidos)
- `npm run build` — cliente + SSR + `scripts/prerender.mjs` (un `index.html` por URL, `404.html`, redirecciones del blog y de las antiguas páginas `/plan-*`, `sitemap.xml`, `robots.txt`)
- `npm run images:opt` — prepara las fotos de los huecos (ver «Fotos»)
- `npm run images` — regenera `og-hades.png`, `apple-touch-icon.png`, `icon-512.png` y favicons a partir del logo

## Dónde se cambia cada cosa

- `src/data/prices.json` — importes (públicos, versionados) y descuentos (anual −6 %, pack −5 % desde 3 cuotas).
- `src/data/catalog.ts` — productos, escaparates, estados (Disponible/Reserva), sustituciones y dependencias.
- `src/lib/cart.ts` — cálculo del plan, URL (`#plan=…`), resumen copiable y comercial (`?comercial=fran`).
- `src/content.ts` — portada: carrusel, cifras, pasos y preguntas.
- `src/data/site.json` — interruptores y correos.

## Fotos (huecos en `static/img/`)

Las medidas están en `src/data/images.json`: `hero` 2400x1350, `hero-movil` 1080x1350, `escaparate-conocer|llenar|fuera` 1600x1000, `visita` 1200x1500, `cierre` 2400x1000. Deja el original como `static/img/<hueco>.jpg` (o `.png`) y ejecuta `npm run images:opt`: valida la proporción y genera `<hueco>.webp` (1x) y `<hueco>@2x.webp` (< 250 KB). Si un hueco no tiene archivo, la web pinta el marcador de marca (degradado verde, trama de puntos y la «H»); el build no falla.

## Interruptores (`src/data/site.json`)

- `SHOW_PRICES: true` — precios públicos.
- `LEGAL_ENTITY_READY: true` exige rellenar todos los campos de `legal` (titular, NIF/EIN, registro, domicilio, correo, nota de marca). Mientras sea `false`, el aviso legal dice «Datos del titular en actualización».
- `CONTACT_ENABLED: true` exige `contactEmail` **y** `LEGAL_ENTITY_READY: true` (art. 13.1.a del RGPD). Con el contacto activo, el botón del plan pasa de «Copiar mi plan» a «Pedir propuesta» (correo a `contactEmail` con copia a `contactCc`).

El build falla si un interruptor se activa con datos vacíos o con «PENDIENTE», si el contacto se activa sin titular o si falta `prices.json`.

## Marca

`static/brand/` — la «H» y el logotipo recortados del original (sin redibujar), en color y en blanco. Fuente: Archivo variable (`static/fonts/`, SIL OFL 1.1).

# hadesgolf.com

Web estática de Hades Golf. React + Vite, HTML prerenderizado por URL, sin cookies, sin analítica, sin scripts ni fuentes de terceros y sin claves.

## Comandos

- `npm install`
- `npm run dev` — servidor local
- `npm run lint` — `tsc` básico (ver «Comprobaciones»)
- `npm run check` — reglas del configurador, resumen copiado, rutas, caducidad de las cifras publicadas y que el repositorio no contenga importes en € ni referencias internas
- `npm run build` — build de cliente + build SSR + `scripts/prerender.mjs` (un `index.html` por URL, `404.html`, redirecciones del blog retirado, `sitemap.xml` y `robots.txt`)
- `npm run images` — regenera `static/og-hades.png` y `static/apple-touch-icon.png` (Python + Pillow + fuentes URW P052 y DejaVu)

## Interruptores (`src/data/site.json`)

- **Titular**: `LEGAL_ENTITY_READY: true` exige rellenar todos los campos de `legal` (titular, NIF/EIN, registro, domicilio, correo, nota de marca).
- **Contacto**: `CONTACT_ENABLED: true` exige rellenar `contactEmail` **y** tener `LEGAL_ENTITY_READY: true`: quien recoge datos tiene que decir quién es el responsable (art. 13.1.a del RGPD). Los dos interruptores se activan juntos. Con el contacto activo aparecen el botón «Pide tu Radiografía gratuita y tu propuesta» (mailto con el resumen), el correo en el pie y los textos de privacidad del contacto. Antes de activarlo, que un profesional valide `/privacidad/`.
  - Con el contacto apagado, la web dice que la Radiografía y la propuesta las entrega el comercial en visita y que todavía no se pueden pedir desde la web; el siguiente paso para quien llega solo es armar y guardar su plan.
- **Precios**: ver «Precios».

El build **falla** si un interruptor se activa con datos vacíos o con «PENDIENTE», si el contacto se activa sin titular, si algún archivo publicado contiene «PENDIENTE» o si aparece un importe en € con `SHOW_PRICES=false`.

## Precios

Los importes viven en `src/data/prices.json`, que **no se versiona** (`.gitignore`): el repositorio es público. El archivo de precios se guarda en privado, fuera de este repositorio. Con `SHOW_PRICES: false` los importes no entran en el JS publicado; `npm run check` los usa si el archivo existe en local.

Para activarlos (`SHOW_PRICES: true`), elige una de dos:

1. **Secreto de GitHub (recomendado)**: en el repositorio, *Settings → Secrets and variables → Actions*, crea el secreto `PRICES_JSON` con el contenido completo de `prices.json`. El workflow lo escribe en `src/data/prices.json` antes de comprobar y construir. Después pon `SHOW_PRICES: true` y publica.
2. **Versionarlo**: quita `src/data/prices.json` de `.gitignore` y súbelo junto con `SHOW_PRICES: true`. Los importes pasan a ser públicos en el repositorio (en la web ya lo serían).

Sin el archivo, `SHOW_PRICES: true` hace fallar el build en vez de publicar a medias.

## Comprobaciones

- `npm run lint` ejecuta `tsc`, pero el proyecto aún no tiene `@types/react` ni `@types/react-dom`, así que **no comprueba el JSX** (los props de los componentes salen como `any`). Para que lo haga: `npm i -D @types/react @types/react-dom`, añadir `"strict": true` a `tsconfig.json` y corregir lo que salga.
- `npm run check` es la red de seguridad real hoy (reglas del configurador y contenido del repositorio).

## Dónde se cambia cada cosa

- `src/data/plans.json` — planes, piezas, etiquetas, reglas y textos del configurador (sin importes).
- `src/data/prices.json` — importes (no versionado; ver «Precios»).
- `src/content.ts` — textos de la portada; cada cifra con su caducidad. Las referencias internas de cada cifra se guardan fuera del repositorio.

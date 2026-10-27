import React from 'react';
import { PRODUCTS } from './data/catalog';
import { SHOW_PRICES } from './lib/flags';
import site from './data/site.json';
import { FAQ } from './content';
import Home from './pages/Home';
import Radiografia from './pages/Radiografia';
import { AvisoLegal, Cookies, NotFound, Privacidad } from './pages/Legal';

export interface Route {
  path: string;
  title: string;
  description: string;
  render: () => React.ReactElement;
  jsonLd?: object[];
  noindex?: boolean;
}

const ORG = {
  '@context': 'https://schema.org',
  '@type': 'Organization',
  name: site.brand,
  url: `${site.siteUrl}/`,
  description: site.seo.description,
};

/** Catálogo con precios públicos (SHOW_PRICES=true). */
const CATALOG = {
  '@context': 'https://schema.org',
  '@type': 'OfferCatalog',
  name: 'Tienda Hades Golf',
  url: `${site.siteUrl}/`,
  itemListElement: PRODUCTS.flatMap((p) =>
    p.variants.map((v) => ({
      '@type': 'Offer',
      name: p.variants.length > 1 ? v.name : p.name,
      description: p.line,
      price: v.price,
      priceCurrency: 'EUR',
      availability: p.status === 'reserva' ? 'https://schema.org/PreOrder' : 'https://schema.org/InStock',
      itemOffered: { '@type': 'Service', name: p.name, areaServed: { '@type': 'Country', name: 'España' }, provider: { '@type': 'Organization', name: site.brand } },
    })),
  ),
};

export const ROUTES: Route[] = [
  {
    path: '/',
    title: site.seo.title,
    description: site.seo.description,
    render: () => <Home />,
    jsonLd: [
      ORG,
      ...(SHOW_PRICES ? [CATALOG] : []),
      {
        '@context': 'https://schema.org',
        '@type': 'FAQPage',
        mainEntity: FAQ.map((f) => ({
          '@type': 'Question',
          name: f.q,
          acceptedAnswer: { '@type': 'Answer', text: f.a },
        })),
      },
    ],
  },
  {
    path: '/radiografia/',
    title: 'Radiografía de tu campo, gratis | Hades Golf',
    description:
      'Lo que se ve de tu campo desde fuera, en una página: preparación para la IA, idiomas, reservas y mercados extranjeros. Gratis y sin contraseñas.',
    render: () => <Radiografia />,
    jsonLd: [ORG],
  },
  { path: '/aviso-legal/', title: 'Aviso legal | Hades Golf', description: 'Aviso legal de hadesgolf.com.', render: () => <AvisoLegal /> },
  { path: '/privacidad/', title: 'Privacidad | Hades Golf', description: 'Política de privacidad de hadesgolf.com.', render: () => <Privacidad /> },
  { path: '/cookies/', title: 'Cookies | Hades Golf', description: 'hadesgolf.com no usa cookies.', render: () => <Cookies /> },
];

export const NOT_FOUND: Route = {
  path: '/404',
  title: 'Página no encontrada | Hades Golf',
  description: site.seo.description,
  render: () => <NotFound />,
  noindex: true,
};

/** Quita un «index.html» final: GitHub Pages sirve /index.html y /<ruta>/index.html. */
export const cleanPath = (pathname: string) => pathname.replace(/index\.html$/, '');

export function findRoute(pathname: string): Route {
  const clean = cleanPath(pathname);
  const p = clean.endsWith('/') ? clean : `${clean}/`;
  return ROUTES.find((r) => r.path === p) ?? NOT_FOUND;
}

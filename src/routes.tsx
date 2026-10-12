import React from 'react';
import plans from './data/plans.json';
import site from './data/site.json';
import { FAQ } from './content';
import Home from './pages/Home';
import PlanPage from './pages/PlanPage';
import Radiografia from './pages/Radiografia';
import { AvisoLegal, Cookies, NotFound, Privacidad } from './pages/Legal';
import type { PlanId } from './lib/plan';

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

const service = (id: PlanId) => {
  const p = plans.plans[id];
  return {
    '@context': 'https://schema.org',
    '@type': 'Service',
    name: `${p.name} · ${p.tagline}`,
    serviceType: 'Datos y automatización para campos de golf',
    areaServed: { '@type': 'Country', name: 'España' },
    provider: { '@type': 'Organization', name: site.brand, url: `${site.siteUrl}/` },
    url: `${site.siteUrl}${p.path}`,
    description: `${p.forWho} ${p.measure.join(' ')}`,
  };
};

const planRoute = (id: PlanId): Route => {
  const p = plans.plans[id];
  return {
    path: p.path,
    title: `${p.name} · ${p.tagline} | Hades Golf`,
    description: p.seoDescription,
    render: () => <PlanPage id={id} />,
    jsonLd: [ORG, service(id)],
  };
};

export const ROUTES: Route[] = [
  {
    path: '/',
    title: site.seo.title,
    description: site.seo.description,
    render: () => <Home />,
    jsonLd: [
      ORG,
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
  planRoute('datos'),
  planRoute('visibilidad'),
  planRoute('comunicacion'),
  {
    path: '/radiografia/',
    title: 'Radiografía de tu campo, gratis | Hades Golf',
    description:
      'Una página con lo que se ve de tu campo desde fuera: preparación para la IA, idiomas, medición de anuncios, sistema de reservas y mercados extranjeros. Gratis.',
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

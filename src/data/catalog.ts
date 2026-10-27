// Catálogo de la tienda: qué se vende, cómo se cobra y sus reglas. Los importes viven en prices.json.
import prices from './prices.json';
import { eur } from '../lib/money';

/** Cómo se cobra una opción. */
export type Billing = 'gratis' | 'mensual' | 'unico';
export type Status = 'disponible' | 'reserva';
export type ShelfId = 'conocer' | 'llena' | 'fuera';
export type ProductId = keyof typeof prices.products;

export interface Variant {
  id: string;
  /** Texto del selector (corto). */
  label: string;
  /** Nombre en el plan y en el resumen. */
  name: string;
  billing: Billing;
  /** Euros (enteros). */
  price: number;
  /** Entra en los descuentos anual (−6 %) y pack (−5 %). */
  discountable: boolean;
  /** Línea pequeña bajo el precio. */
  note?: string;
  /** Se compra por unidades (p. ej. «envío»): el plan deja elegir cuántas. */
  unit?: { one: string; many: string };
}

export interface Product {
  id: ProductId;
  shelf: ShelfId | 'gratis';
  name: string;
  line: string;
  status: Status;
  icon: string;
  variants: Variant[];
  /** Al añadir este producto entra también el requerido; al quitar el requerido sale este. */
  requires?: ProductId;
  /** No pueden ir juntos: al añadir uno sale el otro. */
  replaces?: ProductId;
  badge?: string;
  smallNote?: string;
  /** Nombre corto para avisos («Ocupación»). */
  short?: string;
}

export interface Shelf {
  id: ShelfId;
  photo: 'escaparate-conocer' | 'escaparate-llenar' | 'escaparate-fuera';
  kicker: string;
  title: string;
  sub: string;
  tone: 'granate' | 'marino' | 'azulado' | 'golf';
}

const P = prices.products;

const v = (id: string, label: string, name: string, billing: Billing, price: number, discountable: boolean, note?: string, unit?: Variant['unit']): Variant => ({
  id, label, name, billing, price, discountable, note, unit,
});

export const SHELVES: Shelf[] = [
  { id: 'conocer', photo: 'escaparate-conocer', kicker: 'Escaparate 1', title: 'Que te conozcan', sub: 'Más golfistas hablando de tu campo: en xGolf, en la prensa digital y en los buscadores con IA.', tone: 'granate' },
  { id: 'llena', photo: 'escaparate-llenar', kicker: 'Escaparate 2', title: 'Llena tu campo', sub: 'Mira qué salidas se quedan vacías y llénalas con tu propia base de clientes.', tone: 'golf' },
  { id: 'fuera', photo: 'escaparate-fuera', kicker: 'Escaparate 3', title: 'Vende fuera', sub: 'Golfistas de Francia y de toda Europa. Paquetes, turoperadores y los datos para elegir bien.', tone: 'marino' },
];

export const PRODUCTS: Product[] = [
  {
    id: 'radiografia',
    shelf: 'gratis',
    name: 'Radiografía de tu campo',
    short: 'Radiografía',
    line: 'Lo que se ve de tu campo desde fuera, en una página. Te la prepara tu comercial para la visita.',
    status: 'disponible',
    icon: 'doc',
    variants: [v('gratis', 'Gratis', 'Radiografía de mi campo', 'gratis', P.radiografia.gratis, false)],
  },
  // ── Que te conozcan
  {
    id: 'medio',
    shelf: 'conocer',
    name: 'Medio xGolf',
    line: 'Tu campo en xgolf.es: ficha en la guía, noticias y turno en «Campo de la semana». Más de 18.000 seguidores en Instagram.',
    status: 'disponible',
    icon: 'news',
    badge: 'Ahorras un 61 % con el anual',
    variants: [
      v('anual', 'Anual', 'Medio xGolf · Anual', 'mensual', P.medio.anual, false, `${eur(P.medio.anual * 12)} al año`),
      v('mensual', 'Mensual', 'Medio xGolf · Mensual', 'mensual', P.medio.mensual, false, 'Sin permanencia'),
      v('puntual', 'Puntual', 'Medio xGolf · Puntual', 'unico', P.medio.puntual, false, 'Una noticia + una semana destacado'),
    ],
  },
  {
    id: 'redes',
    shelf: 'conocer',
    name: 'Apariciones en redes de xGolf',
    short: 'Apariciones en redes',
    line: 'Tu campo en el Instagram y el Facebook de xGolf, delante de su comunidad golfista.',
    status: 'disponible',
    icon: 'camera',
    variants: [
      v('noticia', 'Noticia', 'Apariciones en redes de xGolf · Noticia', 'unico', P.redes.noticia, false),
      v('recomendacion', 'Recomendación', 'Apariciones en redes de xGolf · Recomendación', 'unico', P.redes.recomendacion, false),
      v('pack4', 'Pack de 4', 'Apariciones en redes de xGolf · Pack de 4', 'unico', P.redes.pack4, false, '4 apariciones'),
    ],
  },
  {
    id: 'nota',
    shelf: 'conocer',
    name: 'Nota de prensa',
    line: 'Tu noticia difundida en una red de más de 70 portales digitales.',
    status: 'disponible',
    icon: 'megaphone',
    variants: [v('mes', 'Mensual', 'Nota de prensa difundida', 'mensual', P.nota.mes, true, 'Más de 70 portales')],
  },
  {
    id: 'visibilidad',
    shelf: 'conocer',
    name: 'Visibilidad en IA',
    line: 'Cada mes preguntamos a los buscadores con IA por campos como el tuyo. Te decimos si sales y qué mejorar.',
    status: 'disponible',
    icon: 'spark',
    replaces: 'competitiva',
    variants: [v('mes', 'Mensual', 'Visibilidad en IA', 'mensual', P.visibilidad.mes, true, 'Informe cada mes')],
  },
  {
    id: 'competitiva',
    shelf: 'conocer',
    name: 'Visibilidad competitiva',
    line: 'Lo mismo, frente a tus competidores: quién sale antes que tú y por qué.',
    status: 'disponible',
    icon: 'target',
    replaces: 'visibilidad',
    smallNote: 'Sustituye a Visibilidad en IA',
    variants: [v('mes', 'Mensual', 'Visibilidad competitiva', 'mensual', P.competitiva.mes, true, 'Con tus competidores')],
  },
  {
    id: 'diagnostico',
    shelf: 'conocer',
    name: 'Diagnóstico de visibilidad',
    line: 'El análisis a fondo de dónde estás hoy en la IA, con tu hoja de ruta.',
    status: 'disponible',
    icon: 'eye',
    variants: [v('unico', 'Pago único', 'Diagnóstico de visibilidad', 'unico', P.diagnostico.unico, false, 'Pago único')],
  },
  // ── Llena tu campo
  {
    id: 'ocupacion',
    shelf: 'llena',
    name: 'Ocupación',
    short: 'Ocupación',
    line: 'Qué salidas se quedan vacías, por día y por franja. Datos al día.',
    status: 'disponible',
    icon: 'chart',
    smallNote: 'Para campos con GolfManager o TeeOne',
    variants: [v('mes', 'Mensual', 'Ocupación', 'mensual', P.ocupacion.mes, true, 'Por día y franja')],
  },
  {
    id: 'campanas',
    shelf: 'llena',
    name: 'Campañas según ocupación',
    short: 'Campañas según ocupación',
    line: 'Segmentamos tu base de clientes y socios y lanzamos preventa y last minute a las franjas que se quedan vacías, desde el correo del club.',
    status: 'reserva',
    icon: 'mail',
    requires: 'ocupacion',
    smallNote: 'Requiere Ocupación',
    variants: [v('mes', 'Mensual', 'Campañas según ocupación', 'mensual', P.campanas.mes, true, 'Segmentación incluida')],
  },
  // ── Vende fuera
  {
    id: 'golfy',
    shelf: 'fuera',
    name: 'Paquetes automáticos Golfy',
    short: 'Paquetes Golfy',
    line: 'Creamos y publicamos solos los paquetes de tu campo en Golfy, pensados para los festivos y puentes de Francia.',
    status: 'disponible',
    icon: 'calendar',
    smallNote: 'Para campos que están en Golfy',
    variants: [v('mes', 'Mensual', 'Paquetes automáticos Golfy', 'mensual', P.golfy.mes, true, 'Mercado francés')],
  },
  {
    id: 'turoperadores',
    shelf: 'fuera',
    name: 'Ofertas a turoperadores de Europa',
    short: 'Ofertas a turoperadores',
    line: 'Enviamos por correo tus ofertas o paquetes ya montados a turoperadores de golf de toda Europa.',
    status: 'disponible',
    icon: 'send',
    variants: [v('envio', 'Por envío', 'Ofertas a turoperadores de Europa', 'unico', P.turoperadores.envio, false, 'Pago único por envío', { one: 'envío', many: 'envíos' })],
  },
  {
    id: 'mercados',
    shelf: 'fuera',
    name: 'Informe de mercados emisores',
    short: 'Informe de mercados',
    line: 'Para hoteles y resorts: qué nacionalidades gastan más, cuándo llegan y qué venden los turoperadores.',
    status: 'disponible',
    icon: 'globe',
    variants: [v('unico', 'Pago único', 'Informe de mercados emisores', 'unico', P.mercados.unico, false, 'Pago único')],
  },
];

export const DISCOUNTS = prices.discounts;

export const productById = (id: string): Product | undefined => PRODUCTS.find((p) => p.id === id);

export const variantOf = (p: Product, vid?: string): Variant => p.variants.find((x) => x.id === vid) ?? p.variants[0];

/** Comerciales que pueden firmar una propuesta (?comercial=…). Solo nombre: ni teléfono ni correo. */
export const SELLERS: Record<string, string> = {
  fran: 'Fran Martos',
};

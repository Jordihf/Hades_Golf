// Textos de la portada. Cifras publicables: solo las del catálogo (18.000 seguidores de xGolf en Instagram,
// red de más de 70 portales, ahorro del Medio xGolf anual). Nada de testimonios, logos de clientes ni escasez.
import prices from './data/prices.json';
import { NBSP } from './lib/money';

const M = prices.products.medio;
/** Ahorro del Medio xGolf anual frente a pagar 12 meses sueltos, redondeado hacia abajo. */
export const MEDIO_SAVING_PCT = Math.floor((1 - (M.anual * 12) / (M.mensual * 12)) * 100);

export interface Slide {
  slot: 'hero' | 'escaparate-conocer' | 'escaparate-fuera';
  mobile?: 'hero-movil';
  /** Las fotos de los huecos son ambiente: el titular lleva el mensaje. */
  alt: string;
  kicker: string;
  title: string;
  sub: string;
  cta: { href: string; label: string };
}

export const SLIDES: Slide[] = [
  {
    slot: 'hero',
    mobile: 'hero-movil',
    alt: '',
    kicker: 'La tienda de IA para el golf',
    title: 'La IA que llena tu campo',
    sub: 'Elige tus productos, mira el total al momento y tu comercial te lo presenta en la visita.',
    cta: { href: '/#tienda', label: 'Ver la tienda' },
  },
  {
    slot: 'escaparate-conocer',
    alt: '',
    kicker: 'Que te conozcan',
    title: 'Más de 18.000 seguidores te esperan',
    sub: 'Tu campo en xGolf: guía, noticias y «Campo de la semana». Y tu nota en más de 70 portales.',
    cta: { href: '/#conocer', label: 'Que te conozcan' },
  },
  {
    slot: 'escaparate-fuera',
    alt: '',
    kicker: 'Vende fuera',
    title: 'Que Europa juegue en tu campo',
    sub: 'Paquetes automáticos para los puentes de Francia y tus ofertas en el correo de turoperadores de toda Europa.',
    cta: { href: '/#fuera', label: 'Vende fuera' },
  },
];

export const STATS = [
  { tone: 'granate', big: '18.000+', unit: 'seguidores', label: 'en el Instagram de xGolf, donde sale tu campo', rank: 'xGolf' },
  { tone: 'marino', big: '70+', unit: 'portales', label: 'digitales para difundir tu nota de prensa', rank: 'Prensa' },
  { tone: 'azulado', big: `${MEDIO_SAVING_PCT}${NBSP}%`, unit: 'de ahorro', label: 'con el Medio xGolf anual frente al mensual', rank: 'Anual' },
] as const;

export const STEPS = [
  { n: '01', t: 'Eliges', d: 'Añade productos a tu plan. El total se calcula al momento, con tus descuentos.' },
  { n: '02', t: 'Tu comercial te lo presenta', d: 'Copia tu plan. Tu comercial de Hades te lo trae a la visita, con la Radiografía de tu campo.' },
  { n: '03', t: 'Lo activamos', d: 'Damos de alta lo que elijas y nos ponemos a trabajar. Tú sigues con tu campo.' },
] as const;

export const FAQ = [
  {
    q: '¿Cómo compro?',
    a: 'Arma tu plan en la tienda y cópialo. Tu comercial de Hades te lo presenta en la visita y, cuando digas que sí, lo damos de alta. No hay cobros en la web.',
  },
  {
    q: '¿Qué es la Radiografía y cuánto cuesta?',
    a: 'Es gratis. Una página con lo que se ve de tu campo desde fuera: si tu web está preparada para la IA, idiomas, sistema de reservas y mercados que más gastan. Te la prepara tu comercial para la visita.',
  },
  {
    q: '¿Qué descuentos hay?',
    a: `Con pago anual, −${prices.discounts.annualPct}${NBSP}% en las cuotas mensuales. Con ${prices.discounts.packMin} cuotas mensuales o más, otro −${prices.discounts.packPct}${NBSP}% de pack. El Medio xGolf ya tiene su precio anual (ahorras un ${MEDIO_SAVING_PCT}${NBSP}%) y los pagos únicos van aparte.`,
  },
  {
    q: '¿Qué quiere decir «Reserva»?',
    a: 'Es un producto a punto de salir. Lo dejas reservado en tu plan sin cargo y empiezas a pagarlo cuando se lance.',
  },
  {
    q: '¿Ocupación funciona con mi programa de reservas?',
    a: 'Funciona con GolfManager y TeeOne, y siempre con tu autorización. Si usas otro programa, tu comercial te lo confirma en la visita.',
  },
  {
    q: '¿Para quién son los Paquetes automáticos Golfy?',
    a: 'Para campos que ya están en la plataforma Golfy. Creamos y publicamos tus paquetes pensando en los festivos y puentes de Francia, sin que tengas que hacer nada.',
  },
] as const;

// Lógica del carrito «Tu plan»: sin React, para poder comprobarla con `npm run check`.
import { DISCOUNTS, PRODUCTS, Product, ProductId, SELLERS, Variant, productById, variantOf } from '../data/catalog';
import { euros } from './money';

export type Pay = 'mensual' | 'anual';

export interface Line {
  id: ProductId;
  v: string;
  /** Unidades (solo opciones con `unit`, p. ej. envíos a turoperadores). */
  q: number;
}

export interface Cart {
  lines: Line[];
  pay: Pay;
}

export const EMPTY: Cart = { lines: [], pay: 'mensual' };
export const MAX_QTY = 20;

export interface Notice {
  msg: string;
  /** Plan anterior, para «Deshacer». */
  undo?: Cart;
}

export interface Result {
  cart: Cart;
  notice?: Notice;
}

const sortLines = (lines: Line[]) =>
  [...lines].sort((a, b) => PRODUCTS.findIndex((p) => p.id === a.id) - PRODUCTS.findIndex((p) => p.id === b.id));

export const has = (c: Cart, id: string) => c.lines.some((l) => l.id === id);
export const lineOf = (c: Cart, id: string) => c.lines.find((l) => l.id === id);
const short = (p: Product) => p.short ?? p.name;

/** Añade un producto (o cambia su opción si ya está), aplicando sustituciones y dependencias. */
export function add(c: Cart, id: ProductId, vid?: string): Result {
  const p = productById(id);
  if (!p) return { cart: c };
  const variant = variantOf(p, vid).id;
  const existing = lineOf(c, id);
  if (existing) {
    if (existing.v === variant) return { cart: c };
    return { cart: { ...c, lines: c.lines.map((l) => (l.id === id ? { ...l, v: variant } : l)) } };
  }
  let lines = [...c.lines, { id, v: variant, q: 1 }];
  const msgs: string[] = [];
  if (p.replaces && has(c, p.replaces)) {
    const other = productById(p.replaces)!;
    lines = lines.filter((l) => l.id !== p.replaces);
    msgs.push(`${p.name} sustituye a ${other.name}.`);
  }
  if (p.requires && !lines.some((l) => l.id === p.requires)) {
    const dep = productById(p.requires)!;
    lines.push({ id: dep.id, v: dep.variants[0].id, q: 1 });
    msgs.push(`Añadimos ${short(dep)}: es la base de las campañas.`);
  }
  const cart = { ...c, lines: sortLines(lines) };
  return msgs.length ? { cart, notice: { msg: msgs.join(' '), undo: c } } : { cart, notice: { msg: `${p.name}: en tu plan.` } };
}

/** Quita un producto y lo que depende de él. */
export function remove(c: Cart, id: ProductId): Result {
  const p = productById(id);
  if (!p || !has(c, id)) return { cart: c };
  const dependents = PRODUCTS.filter((x) => x.requires === id && has(c, x.id));
  const drop = new Set<string>([id, ...dependents.map((d) => d.id)]);
  const cart = { ...c, lines: c.lines.filter((l) => !drop.has(l.id)) };
  if (dependents.length) {
    const names = dependents.map((d) => d.name).join(' y ');
    return { cart, notice: { msg: `Quitamos ${short(p)} y también ${names}: necesita ${short(p)}.`, undo: c } };
  }
  return { cart, notice: { msg: `${p.name}: fuera de tu plan.`, undo: c } };
}

export const toggle = (c: Cart, id: ProductId, vid?: string): Result => (has(c, id) ? remove(c, id) : add(c, id, vid));

export function setQty(c: Cart, id: ProductId, q: number): Cart {
  const n = Math.max(1, Math.min(MAX_QTY, Math.round(q) || 1));
  return { ...c, lines: c.lines.map((l) => (l.id === id ? { ...l, q: n } : l)) };
}

export const setPay = (c: Cart, pay: Pay): Cart => ({ ...c, pay });
export const clear = (c: Cart): Result => ({ cart: { ...c, lines: [] }, notice: { msg: 'Plan vacío.', undo: c } });

// ── Importes (en céntimos)

export interface PricedLine {
  line: Line;
  product: Product;
  variant: Variant;
  /** Céntimos: por mes o pago único (precio × unidades). */
  amount: number;
  reserved: boolean;
}

export interface Totals {
  monthlyLines: PricedLine[];
  onceLines: PricedLine[];
  reservedLines: PricedLine[];
  freeLines: PricedLine[];
  /** Cuotas con descuento posible (sin descuento aplicado). */
  discountableBase: number;
  /** Cuotas sin descuento (Medio xGolf). */
  fixedMonthly: number;
  annualDiscount: number;
  packDiscount: number;
  packApplies: boolean;
  /** Productos de cuota mensual que cuentan para el pack. */
  packCount: number;
  /** Lo que pagas cada mes desde hoy. */
  monthly: number;
  /** Con pago anual: lo que se factura una vez al año. */
  yearBilled: number;
  /** Con pago anual: lo que te ahorras al año frente a pagar mes a mes (con el pack recalculado). */
  yearSaving: number;
  /** Lo que ahorrarías al año pasándote a anual (para el aviso con pago mensual). */
  annualSavingIfSwitch: number;
  once: number;
  /** Cuotas de productos en reserva, sin cargo hasta el lanzamiento. */
  reservedMonthly: number;
  count: number;
}

const pct = (cents: number, p: number) => Math.round((cents * p) / 100);

export function priced(c: Cart): PricedLine[] {
  return c.lines
    .map((line) => {
      const product = productById(line.id);
      if (!product) return null;
      const variant = variantOf(product, line.v);
      const unit = variant.price * 100;
      return {
        line,
        product,
        variant,
        amount: variant.unit ? unit * line.q : unit,
        reserved: product.status === 'reserva',
      };
    })
    .filter((x): x is PricedLine => x !== null);
}

export function totals(c: Cart): Totals {
  const all = priced(c);
  const reservedLines = all.filter((l) => l.reserved);
  const live = all.filter((l) => !l.reserved);
  const monthlyLines = live.filter((l) => l.variant.billing === 'mensual');
  const disc = monthlyLines.filter((l) => l.variant.discountable);
  const discountableBase = disc.reduce((t, l) => t + l.amount, 0);
  const fixedMonthly = monthlyLines.filter((l) => !l.variant.discountable).reduce((t, l) => t + l.amount, 0);
  const annualDiscount = c.pay === 'anual' ? pct(discountableBase, DISCOUNTS.annualPct) : 0;
  const packCount = disc.length;
  const packApplies = packCount >= DISCOUNTS.packMin;
  const packDiscount = packApplies ? pct(discountableBase - annualDiscount, DISCOUNTS.packPct) : 0;
  const monthly = discountableBase - annualDiscount - packDiscount + fixedMonthly;
  // Lo mismo pagando mes a mes, para el ahorro real del pago anual (el pack también cambia de base).
  const monthlyIfMonthly = discountableBase - (packApplies ? pct(discountableBase, DISCOUNTS.packPct) : 0) + fixedMonthly;
  const annualCut = pct(discountableBase, DISCOUNTS.annualPct);
  const monthlyIfAnnual = discountableBase - annualCut - (packApplies ? pct(discountableBase - annualCut, DISCOUNTS.packPct) : 0) + fixedMonthly;
  const annualSavingIfSwitch = (monthlyIfMonthly - monthlyIfAnnual) * 12;
  const onceLines = live.filter((l) => l.variant.billing === 'unico');
  return {
    monthlyLines,
    onceLines,
    reservedLines,
    freeLines: live.filter((l) => l.variant.billing === 'gratis'),
    discountableBase,
    fixedMonthly,
    annualDiscount,
    packDiscount,
    packApplies,
    packCount,
    monthly,
    yearBilled: c.pay === 'anual' ? monthly * 12 : 0,
    yearSaving: c.pay === 'anual' ? annualSavingIfSwitch : 0,
    annualSavingIfSwitch,
    once: onceLines.reduce((t, l) => t + l.amount, 0),
    reservedMonthly: reservedLines.reduce((t, l) => t + l.amount, 0),
    count: all.length,
  };
}

/** Cifra grande del panel: cambia de título según lo que haya en el plan (nunca «0 €/mes» con pagos únicos). */
export function headline(t: Totals): { label: string; value: string; unit: string } {
  if (t.monthly > 0) return { label: 'Total al mes', value: euros(t.monthly), unit: '/mes' };
  if (t.once > 0) return { label: 'Total en pagos únicos', value: euros(t.once), unit: '' };
  if (t.reservedMonthly > 0) return { label: 'Hoy', value: euros(0), unit: 'sin cargo' };
  if (t.count > 0) return { label: 'Total', value: euros(0), unit: 'gratis' };
  return { label: 'Total', value: euros(0), unit: '' };
}

// ── URL: #plan=medio:anual,nota,turoperadores*2&pago=anual

export function encode(c: Cart): string {
  if (!c.lines.length) return '';
  const items = c.lines.map((l) => {
    const p = productById(l.id)!;
    const vpart = p.variants.length > 1 ? `:${l.v}` : '';
    const qpart = l.q > 1 ? `*${l.q}` : '';
    return `${l.id}${vpart}${qpart}`;
  });
  return `plan=${items.join(',')}${c.pay === 'anual' ? '&pago=anual' : ''}`;
}

/** Lee un plan de la URL. Ignora lo que no entiende y vuelve a aplicar las reglas (sustitución y dependencias). */
export function decode(hash: string): Cart | null {
  const h = hash.replace(/^#/, '');
  if (!h.startsWith('plan=')) return null;
  const params = new URLSearchParams(h);
  const pay: Pay = params.get('pago') === 'anual' ? 'anual' : 'mensual';
  let cart: Cart = { lines: [], pay };
  for (const raw of (params.get('plan') ?? '').split(',')) {
    const m = /^([a-z0-9-]+)(?::([a-z0-9-]+))?(?:\*(\d{1,2}))?$/.exec(raw.trim());
    if (!m) continue;
    const p = productById(m[1]);
    if (!p || has(cart, p.id)) continue;
    const vid = p.variants.some((x) => x.id === m[2]) ? m[2] : undefined;
    cart = add(cart, p.id, vid).cart;
    if (m[3]) cart = setQty(cart, p.id, Number(m[3]));
  }
  return cart;
}

export const sellerName = (search: string): string | null => {
  const id = new URLSearchParams(search).get('comercial')?.toLowerCase() ?? '';
  return SELLERS[id] ?? null;
};

/** Enlace que reabre el plan (con el comercial, si viene en la URL). */
export function planLink(siteUrl: string, c: Cart, search = ''): string {
  const seller = new URLSearchParams(search).get('comercial')?.toLowerCase();
  const q = seller && SELLERS[seller] ? `?comercial=${seller}` : '';
  const h = encode(c);
  return `${siteUrl}/${q}${h ? `#${h}` : ''}`;
}

/** Resumen legible del plan (para copiar o enviar por correo). */
export function summary(c: Cart, link: string, seller: string | null = null): string {
  const t = totals(c);
  const out: string[] = ['MI PLAN · HADES GOLF', ''];
  out.push(c.pay === 'anual' ? `Modalidad: pago anual (−${DISCOUNTS.annualPct} % en las cuotas mensuales)` : 'Modalidad: pago mensual');
  const sec = (title: string, rows: string[]) => {
    if (!rows.length) return;
    out.push('', title, ...rows);
  };
  const lineName = (l: PricedLine) => (l.product.variants.length > 1 ? l.variant.name : l.product.name);
  sec(
    'Cuotas mensuales',
    t.monthlyLines.map((l) => `· ${lineName(l)}: ${euros(l.amount)}/mes${l.variant.discountable ? '' : ' (sin descuentos)'}`),
  );
  if (t.monthlyLines.length) {
    if (t.annualDiscount) out.push(`Descuento pago anual −${DISCOUNTS.annualPct} %: ${euros(-t.annualDiscount)}/mes`);
    if (t.packDiscount) out.push(`Descuento pack −${DISCOUNTS.packPct} %: ${euros(-t.packDiscount)}/mes`);
    out.push(`Total cuotas: ${euros(t.monthly)}/mes`);
    if (c.pay === 'anual') {
      out.push(`Facturado una vez al año: ${euros(t.yearBilled)}`);
      if (t.yearSaving) out.push(`Ahorras al año: ${euros(t.yearSaving)}`);
    }
  }
  sec(
    'Pagos únicos',
    t.onceLines.map((l) =>
      l.variant.unit
        ? `· ${lineName(l)} × ${l.line.q} ${l.line.q === 1 ? l.variant.unit.one : l.variant.unit.many}: ${euros(l.amount)} (${euros(l.variant.price * 100)} por ${l.variant.unit.one})`
        : `· ${lineName(l)}: ${euros(l.amount)}`,
    ),
  );
  if (t.onceLines.length) out.push(`Total pagos únicos: ${euros(t.once)}`);
  sec(
    'Reserva (sin cargo hasta el lanzamiento)',
    t.reservedLines.map((l) => `· ${l.product.name}: ${euros(l.amount)}/mes desde el lanzamiento`),
  );
  sec('Gratis', t.freeLines.map(() => '· Radiografía de mi campo: la prepara mi comercial en la visita'));
  if (!t.count) out.push('', 'Todavía no hay productos en el plan.');
  if (seller) out.push('', `Propuesta preparada con ${seller} (Hades Golf)`);
  out.push('', `Abrir mi plan: ${link}`);
  return out.join('\n');
}

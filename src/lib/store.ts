// Estado compartido del plan (tienda, panel y botón «Tu plan (n)» de la cabecera). Vive en memoria y en la URL (#plan=…).
import { useSyncExternalStore } from 'react';
import { Cart, EMPTY, Notice, Result, decode, encode } from './cart';

interface State {
  cart: Cart;
  notice: (Notice & { id: number }) | null;
  /** Último producto añadido (para la animación del panel). */
  pulse: number;
}

let state: State = { cart: EMPTY, notice: null, pulse: 0 };
const SERVER: State = state;
const subs = new Set<() => void>();
let noticeId = 0;

const emit = () => subs.forEach((f) => f());

const isHome = () => typeof window !== 'undefined' && window.location.pathname === '/';

function writeUrl(cart: Cart) {
  if (!isHome()) return;
  const h = encode(cart);
  const { pathname, search } = window.location;
  // replaceState: cada cambio no crea una entrada nueva en el historial; «atrás» sale de la página como siempre.
  window.history.replaceState(window.history.state, '', `${pathname}${search}${h ? `#${h}` : ''}`);
}

export const planStore = {
  subscribe(f: () => void) {
    subs.add(f);
    return () => subs.delete(f);
  },
  get: () => state,
  apply(r: Result) {
    const grew = r.cart.lines.length > state.cart.lines.length;
    state = {
      cart: r.cart,
      notice: r.notice ? { ...r.notice, id: ++noticeId } : state.notice,
      pulse: grew ? state.pulse + 1 : state.pulse,
    };
    writeUrl(r.cart);
    emit();
  },
  setCart(cart: Cart) {
    state = { ...state, cart };
    writeUrl(cart);
    emit();
  },
  dismiss() {
    state = { ...state, notice: null };
    emit();
  },
  /** Lee el plan de la URL (al cargar y si alguien pega otro enlace con #plan=…). */
  load() {
    if (typeof window === 'undefined') return;
    const c = decode(window.location.hash);
    if (!c) return;
    state = { ...state, cart: c };
    writeUrl(c);
    emit();
  },
};

export const usePlan = () => useSyncExternalStore(planStore.subscribe, planStore.get, () => SERVER);

/** Abre el panel «Tu plan» (en móvil, a pantalla completa). */
export const OPEN_PLAN = 'hades:abrir-plan';
export const openPlan = () => window.dispatchEvent(new Event(OPEN_PLAN));

/** Desplazamiento suave a una sección de la portada sin tocar el #plan de la URL. */
export function goTo(id: string, e?: { preventDefault: () => void }) {
  if (typeof window === 'undefined' || !isHome()) return;
  const el = document.getElementById(id);
  if (!el) return;
  e?.preventDefault();
  const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  el.scrollIntoView({ behavior: reduce ? 'auto' : 'smooth', block: 'start' });
  if (el.tabIndex < 0 && !/^(A|BUTTON|INPUT)$/.test(el.tagName)) el.setAttribute('tabindex', '-1');
  el.focus({ preventScroll: true });
}

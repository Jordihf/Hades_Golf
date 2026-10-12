import plans from '../data/plans.json';
import { PRICES, SHOW_PRICES } from './prices';
import { CONTACT_ON } from './flags';

export type PieceId = keyof typeof plans.pieces;
export type PlanId = keyof typeof plans.plans;
export type Status = 'disponible' | 'matiz' | 'proximamente';

export interface Selection {
  type: string;
  booking: string;
  objectives: string[];
  pieces: PieceId[];
  interests: string[];
}

export const EMPTY: Selection = { type: '', booking: '', objectives: [], pieces: [], interests: [] };

export const PIECE_IDS = Object.keys(plans.pieces) as PieceId[];
/** Piezas de visibilidad en IA: todo plan mensual lleva una. */
export const VIS_AI: PieceId[] = ['monitor', 'competitiva'];
const OBJ_IDS = plans.objectives.map((o) => o.id);
const INTEREST_IDS = [...plans.comingSoon.map((s) => s.id), plans.ocupacionOtro.id];

export const piece = (id: PieceId) => plans.pieces[id] as {
  name: string; status: string; visibilityPiece: boolean; oneOff?: boolean; text: string; matiz?: string;
  measure: string; agents: string; human: string; excludes?: string[]; requires?: string[];
};

export const pieceNames = (ids: PieceId[]) => ids.map((p) => piece(p).name).join(', ');

export const isHotel = (s: Selection) => s.type === 'hotel';
/** Con «Otro» programa de reservas no sabemos estimar la ocupación: la pieza no entra en el plan. */
export const analizaUnavailable = (s: Selection) => isHotel(s) || s.booking === 'otro';

export function orderedObjectives(type: string) {
  const order = (plans.objectiveOrder as Record<string, string[]>)[type] ?? OBJ_IDS;
  return order.map((id) => plans.objectives.find((o) => o.id === id)!).filter(Boolean);
}

/** Etiqueta de Ocupación por franjas según el sistema de reservas. */
export function analizaState(s: Selection): { status: Status; label: string } {
  if (s.booking === 'nose') return { status: 'matiz', label: plans.rules.analizaUnknown };
  return { status: 'matiz', label: 'Con matiz' };
}

const hasVis = (p: PieceId[]) => VIS_AI.some((v) => p.includes(v));

export function normalize(s: Selection): Selection {
  let pieces = [...new Set(s.pieces)].filter((p) => PIECE_IDS.includes(p));
  if (analizaUnavailable(s)) pieces = pieces.filter((p) => p !== 'analiza');
  if (pieces.includes('competitiva')) pieces = pieces.filter((p) => p !== 'monitor');
  // LinkedIn y Ocupación solo van dentro de un plan con una pieza de visibilidad en IA.
  if (!hasVis(pieces) && pieces.some((p) => p === 'linkedin' || p === 'analiza' || p === 'nota')) pieces.push('monitor');
  if (pieces.includes('nota') && !pieces.includes('linkedin')) pieces = pieces.filter((p) => p !== 'nota');
  // «Ocupación con mi programa de reservas» solo tiene sentido con «Otro» programa.
  const interests = s.booking === 'otro' ? s.interests : s.interests.filter((i) => i !== plans.ocupacionOtro.id);
  return { ...s, pieces, interests };
}

/** Une sin repetir las piezas de los objetivos elegidos y aplica las exclusiones. */
export function piecesFor(s: Selection): PieceId[] {
  const out: PieceId[] = [];
  for (const id of s.objectives) {
    plans.objectives.find((o) => o.id === id)?.pieces.forEach((p) => {
      if (!out.includes(p as PieceId)) out.push(p as PieceId);
    });
  }
  return normalize({ ...s, pieces: out }).pieces;
}

export function togglePiece(s: Selection, id: PieceId): Selection {
  if (s.pieces.includes(id)) return normalize({ ...s, pieces: s.pieces.filter((p) => p !== id) });
  const excl = piece(id).excludes ?? [];
  const pieces = [...s.pieces.filter((p) => !excl.includes(p)), id];
  // La nota solo existe dentro del Plan Comunicación completo.
  if (id === 'nota' && !pieces.includes('linkedin')) pieces.push('linkedin');
  return normalize({ ...s, pieces });
}

/** Piezas que una acción ha añadido o quitado además de la que se ha pulsado. */
export function sideEffects(prev: Selection, next: Selection, id: PieceId) {
  return {
    added: next.pieces.filter((p) => p !== id && !prev.pieces.includes(p)),
    removed: prev.pieces.filter((p) => p !== id && !next.pieces.includes(p)),
  };
}

/** No se puede quitar la última pieza de visibilidad en IA si quedan piezas que dependen de ella. */
export function canRemove(s: Selection, id: PieceId): boolean {
  if (!VIS_AI.includes(id)) return true;
  const others = s.pieces.filter((p) => p !== id);
  return hasVis(others) || !others.some((p) => p === 'linkedin' || p === 'analiza' || p === 'nota');
}

export function availablePieces(s: Selection): PieceId[] {
  return PIECE_IDS.filter((p) => !(p === 'analiza' && analizaUnavailable(s)));
}

const satisfied = (id: PlanId, p: PieceId[]) =>
  hasVis(p) && (id === 'visibilidad' || (id === 'datos' ? p.includes('analiza') : p.includes('linkedin')));

/**
 * Plan al que corresponden las piezas. La nota solo existe en el Plan Comunicación completo.
 * Visibilidad solo si no cabe un plan mayor; entre Datos y Comunicación decide el primer objetivo.
 */
export function planId(s: Selection): PlanId | null {
  const p = s.pieces;
  if (!hasVis(p)) return null;
  if (p.includes('nota')) return 'comunicacion';
  const big = (['datos', 'comunicacion'] as PlanId[]).filter((id) => satisfied(id, p));
  if (!big.length) return 'visibilidad';
  const byObjective = s.objectives
    .map((o) => plans.objectives.find((x) => x.id === o)?.plan as PlanId | undefined)
    .find((id) => id && big.includes(id));
  return byObjective ?? big[0];
}

export function planName(s: Selection): string | null {
  const id = planId(s);
  if (id) return `${plans.plans[id].name}${s.pieces.includes('nota') ? ' completo' : ''}`;
  if (s.pieces.length === 1 && s.pieces[0] === 'mercados') return piece('mercados').name;
  return null;
}

/** Objetivos elegidos que no tienen hoy ninguna pieza en el plan. */
export function uncoveredObjectives(s: Selection) {
  return s.objectives
    .map((id) => plans.objectives.find((o) => o.id === id)!)
    .filter((o) => o && !o.core.some((p) => s.pieces.includes(p as PieceId)));
}

export function visibilityCount(s: Selection) {
  return s.pieces.filter((p) => piece(p).visibilityPiece).length;
}

export function diagnostico(s: Selection): 'incluido' | 'inicio' | null {
  const n = visibilityCount(s);
  if (n === 0) return null;
  return n >= 2 ? 'incluido' : 'inicio';
}

/** Precio orientativo (solo con precios cargados). null en `monthly` = el precio va en la propuesta. */
export function price(s: Selection): { monthly: number | null; from: boolean; setup: number; oneOff: boolean } | null {
  if (!PRICES) return null;
  const pp = PRICES.pieces;
  const p = s.pieces;
  let monthly: number | null = 0;
  let from = false;
  if (!planId(s)) monthly = null;
  else if (p.includes('nota')) {
    // Plan Comunicación completo: precio cerrado solo con LinkedIn + Visibilidad en IA + nota.
    monthly = p.includes('monitor') ? PRICES.comunicacionCompleto : null;
    if (monthly !== null) p.filter((id) => !['nota', 'linkedin', 'monitor'].includes(id)).forEach((id) => (monthly! += pp[id]?.monthly ?? 0));
  } else {
    p.forEach((id) => {
      monthly! += pp[id]?.monthly ?? 0;
      if (pp[id]?.monthly && pp[id].from) from = true;
    });
  }
  return { monthly, from, setup: diagnostico(s) === 'inicio' ? PRICES.diagnosticoSetup : 0, oneOff: p.includes('mercados') };
}

export function priceText(s: Selection): string {
  const pr = SHOW_PRICES ? price(s) : null;
  if (!pr || pr.monthly === null) return plans.rules.priceHidden;
  const parts: string[] = [];
  if (pr.monthly > 0) parts.push(`${pr.from ? 'desde ' : ''}${pr.monthly} €/mes`);
  if (pr.setup > 0) parts.push(`${pr.setup} € de inicio`);
  let txt = parts.join(' + ');
  if (pr.oneOff) txt += `${txt ? ', más el ' : ''}Informe de mercados (pago único, en tu propuesta)`;
  return `${txt || plans.rules.priceHidden}${parts.length ? ', impuestos no incluidos' : ''}`;
}

export const pieceNote = (id: PieceId) => (SHOW_PRICES ? PRICES!.pieces[id]?.priceNote ?? '' : '');

/* ---------- Enlace del plan (/#plan=…&s=paso) ---------- */

export function encode(s: Selection): string {
  const q = new URLSearchParams();
  if (s.type) q.set('t', s.type);
  if (s.booking) q.set('r', s.booking);
  if (s.objectives.length) q.set('o', s.objectives.join(','));
  if (s.pieces.length) q.set('p', s.pieces.join(','));
  if (s.interests.length) q.set('i', s.interests.join(','));
  return `plan=${q.toString()}`;
}

const isEmpty = (s: Selection) => !s.type && !s.objectives.length && !s.interests.length;

/** Hash que representa el estado del configurador. */
export function hashFor(s: Selection, step: number): string {
  return isEmpty(s) && step === 1 ? '#configurador' : `#${encode(s)}&s=${step}`;
}

export function decode(hash: string): Selection | null {
  const m = hash.match(/^#?plan=(.*)$/);
  if (!m) return null;
  let q: URLSearchParams;
  try {
    q = new URLSearchParams(m[1]);
  } catch {
    return null;
  }
  const list = (k: string) => [...new Set((q.get(k) ?? '').split(',').filter(Boolean))];
  const type = plans.courseTypes.some((t) => t.id === q.get('t')) ? q.get('t')! : '';
  const booking = type !== 'hotel' && plans.bookingSystems.some((b) => b.id === q.get('r')) ? q.get('r')! : '';
  const objectives = list('o')
    .filter((o) => OBJ_IDS.includes(o) && !(type === 'hotel' && o === 'franjas'))
    .slice(0, plans.maxObjectives);
  const pieces = list('p').filter((p) => PIECE_IDS.includes(p as PieceId)) as PieceId[];
  const interests = list('i').filter((i) => INTEREST_IDS.includes(i));
  const s = normalize({ type, booking, objectives, pieces, interests });
  return isEmpty(s) ? null : s;
}

/** Paso guardado en el enlace, corregido si no encaja con lo elegido. */
export function decodeStep(hash: string, s: Selection): number {
  const raw = Number(hash.match(/[#&]s=(\d)/)?.[1] ?? 0);
  const max = !s.type ? 1 : s.objectives.length || s.interests.length ? 4 : 3;
  if (!raw) return max;
  if (raw === 2 && (isHotel(s) || !s.type)) return Math.min(max, 3);
  return Math.min(raw, max);
}

export function label(list: { id: string; label: string }[], id: string) {
  return list.find((x) => x.id === id)?.label ?? '';
}

export const interestLabel = (id: string) =>
  id === plans.ocupacionOtro.id ? plans.ocupacionOtro.label : label(plans.comingSoon, id);

/** Resumen legible del plan: lo que se copia con «Copiar mi plan» y el cuerpo del correo. */
export function summary(s: Selection, link: string): string {
  const lines: string[] = [];
  const name = planName(s);
  lines.push(name ? `Mi plan en Hades Golf: ${name}` : 'Mi plan en Hades Golf');
  if (s.type) lines.push(`Tipo de campo: ${label(plans.courseTypes, s.type)}`);
  if (s.booking) lines.push(`Sistema de reservas: ${label(plans.bookingSystems, s.booking)}`);
  if (s.objectives.length) lines.push(`Objetivos: ${s.objectives.map((o) => label(plans.objectives, o)).join('; ')}`);
  if (s.pieces.length) lines.push(`Piezas: ${s.pieces.map((p) => `${piece(p).name}${pieceCondition(s, p)}`).join(', ')}`);
  const d = diagnostico(s);
  const setup = SHOW_PRICES && PRICES ? `${PRICES.diagnosticoSetup} €` : 'en tu propuesta';
  if (d) lines.push(`Diagnóstico de visibilidad: ${d === 'incluido' ? 'incluido' : `pago de inicio (${setup})`}`);
  if (s.interests.length) lines.push(`Me interesa (aún no disponible): ${s.interests.map(interestLabel).join(', ')}`);
  if (s.pieces.length) {
    const pr = priceText(s);
    lines.push(`Precio: ${pr === plans.rules.priceHidden ? 'en tu propuesta' : pr}`);
  }
  lines.push('', `Enlace de mi plan: ${link}`);
  if (!CONTACT_ON) lines.push('', 'Envíaselo a tu comercial de Hades.');
  return lines.join('\n');
}

/** Condición que acompaña a una pieza en el resumen copiado, la misma que se ve en pantalla. */
function pieceCondition(s: Selection, p: PieceId): string {
  if (p === 'analiza' && s.booking === 'nose') return ' (solo con GolfManager o TeeOne; lo comprobamos contigo)';
  return piece(p).status === 'matiz' ? ' (con matiz)' : '';
}

// Textos de la portada. Cada cifra publicada lleva su fecha de caducidad en `evidence` si la tiene:
// `npm run check` falla cuando una cifra ha caducado. La referencia interna de cada cifra se guarda
// fuera de este repositorio público.

export interface Evidence {
  expires?: string; // AAAA-MM-DD
}

/** Espacio de no separación entre la cifra y el signo: «86 %» no se parte de línea. */
const NB = ' ';

export const HERO = {
  eyebrow: 'Para la gerencia de campos de golf',
  title: 'Datos y automatización para la gerencia de tu campo de golf',
  subtitle:
    'Tú eliges el objetivo. Tu comercial de Hades se ocupa de la relación y nuestros agentes de IA hacen el trabajo repetitivo. Te damos los datos y el trabajo hecho para activar ventas; vender depende de tu precio, tu competencia y tu producto.',
};

export const PROBLEMS = [
  {
    icon: 'clock',
    q: '¿Sabes qué franjas se te quedan vacías?',
    a: 'Podemos estimar la ocupación de tu campo por franjas y días a partir de tu sistema de reservas. Antes revisamos las condiciones de uso de tu programa y nos das tu autorización por escrito.',
    data: `Ejemplo medido entre el 25/09 y el 11/10/2026 en 3 campos (sin nombres): en uno, las tardes quedaron vacías en un 86${NB}% y las mañanas en un 18${NB}%. En conjunto, los tres estuvieron ocupados un 67,9${NB}% (estimación).`,
    evidence: { expires: '2026-12-31' } as Evidence,
  },
  {
    icon: 'spark',
    q: '¿Te cita la IA cuando alguien pregunta por campos de tu zona?',
    a: 'Cada mes hacemos preguntas reales a un buscador con IA (hoy Perplexity) y te decimos si tu campo aparece o se cita. Además puntuamos de 0 a 100 lo preparada que está tu web para la IA y te decimos qué mejorar primero.',
    note: 'En tu Radiografía vemos lo preparada que está tu web para la IA (35 puntos medidos). Si la IA te cita o no, lo mide el Plan Visibilidad.',
    link: { href: '/radiografia/', label: 'Qué incluye tu Radiografía' },
  },
  {
    icon: 'megaphone',
    q: '¿Alguien habla de tu club fuera de tu web?',
    a: 'Difundimos tu nota de prensa en portales digitales y publicamos en el LinkedIn de tu club.',
    data: 'Una nota de prensa que difundimos (agosto de 2026): 83 publicaciones en 81 medios digitales y 580.630 impresiones estimadas. Algunas salen en secciones de notas de empresa.',
    evidence: {} as Evidence,
  },
] as const;

/** Cifra grande de la sección de agentes: solo lo que hacen los agentes. */
export const STATS = [
  {
    value: '12.234',
    label: 'tareas ejecutadas por 8 agentes de IA',
    context: 'Para un cliente del sector turístico en España, del 31/03 al 10/10/2026. Cada tarea es una llamada de un agente a la IA, no una gestión completa.',
    evidence: {} as Evidence,
  },
];

export const STEPS = [
  { icon: 'doc', t: 'Tu Radiografía', d: 'En la visita, tu comercial de Hades te enseña la Radiografía de tu campo: lo que se ve desde fuera. Gratis y sin contraseñas.' },
  { icon: 'flag', t: 'Tu objetivo', d: 'Eliges un plan según lo que quieres conseguir.' },
  { icon: 'handshake', t: 'Tu propuesta', d: 'Tu comercial de Hades te prepara la propuesta por escrito. Sin cobro online.' },
  { icon: 'layers', t: 'El trabajo', d: 'Nuestros agentes de IA hacen el trabajo y te enviamos los datos en un informe.' },
  { icon: 'chart', t: 'El siguiente paso', d: 'Cuando un dato lo justifica, te proponemos el siguiente paso.' },
] as const;

export const AGENT_TASKS = [
  'Revisar cada mañana la disponibilidad de tu sistema de reservas, con tu autorización.',
  'Preparar y programar las publicaciones de tu LinkedIn.',
  'Preguntar cada mes a un buscador con IA si te cita, y prepararte el informe.',
  'Redactar el borrador de tu nota de prensa (lo revisa una persona antes de difundirla).',
  'Preparar la propuesta y los recordatorios de tu comercial.',
];

/** Compromisos permanentes. */
export const NOT_DOING = [
  'No te prometemos ocupación: te damos los datos para decidir.',
  'No gestionamos anuncios de Google ni de Meta.',
  'No cambiamos tu web: te decimos qué mejorar y lo haces tú o tu agencia.',
  'No comparamos tu ocupación con la de otros campos: tu informe de ocupación solo lleva tus datos.',
  'Tu nota sale en portales digitales, no en grandes diarios.',
];

/** Lo que hoy no hacemos y podría cambiar. */
export const NOT_YET = [
  'Todavía no publicamos en el Instagram ni en el Facebook de clubes: necesitamos un permiso de Meta que aún no hemos pedido.',
];

export const FAQ = [
  {
    q: '¿Funciona con mi sistema de reservas?',
    a: 'Hoy solo podemos estimar la ocupación de campos que usan GolfManager o TeeOne, y todavía no la activamos: antes revisamos las condiciones de uso de tu programa, comprobamos contigo tu caso y nos das tu autorización por escrito. El resto de piezas no dependen de tu sistema de reservas.',
  },
  { q: '¿Qué IA medís?', a: 'Hoy, Perplexity. No medimos ChatGPT ni Google.' },
  {
    q: '¿Quién publica en mi LinkedIn?',
    a: 'Tus publicaciones se preparan y programan solas según la estrategia acordada contigo; puedes revisarlas o cambiarlas cuando quieras.',
  },
  { q: '¿Puedo pagar online?', a: 'No. El precio va en la propuesta por escrito que te prepara tu comercial de Hades.' },
  {
    q: '¿Comparáis mi ocupación con la de otros campos?',
    a: 'No. Tu informe de ocupación solo lleva tus datos. En visibilidad en IA sí te comparamos con hasta 5 competidores si eliges Visibilidad competitiva.',
  },
  {
    q: '¿Me vais a llenar el campo?',
    a: 'No lo prometemos: vender depende de tu precio, tu competencia y tu producto.',
  },
];

/** Todas las cifras con caducidad, para la comprobación de `npm run check`. */
export const EVIDENCE: Evidence[] = [
  ...PROBLEMS.flatMap((p) => ('evidence' in p ? [p.evidence] : [])),
  ...STATS.map((s) => s.evidence),
];

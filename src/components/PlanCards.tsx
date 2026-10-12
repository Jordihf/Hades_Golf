import React from 'react';
import plans from '../data/plans.json';
import { piece, PieceId, PlanId } from '../lib/plan';
import { PRICES, SHOW_PRICES } from '../lib/prices';
import { NO_ONLINE } from '../lib/flags';
import { Tag } from './Layout';
import Icon, { IconName } from './Icon';

export const PLAN_IDS = Object.keys(plans.plans) as PlanId[];
export const PLAN_ICON: Record<PlanId, IconName> = { datos: 'clock', visibilidad: 'spark', comunicacion: 'megaphone' };

/** Enlace al configurador con el objetivo del plan ya marcado. */
export const planHref = (id: PlanId) => `/#plan=o=${plans.plans[id].objective}`;

export const PlanPrice: React.FC<{ id: PlanId }> = ({ id }) =>
  SHOW_PRICES ? <p className="price">{PRICES!.plans[id].price}</p> : <p className="price price--hidden">{plans.rules.priceHidden}</p>;

export const Breakdown: React.FC<{ id: PlanId }> = ({ id }) => {
  const p = plans.plans[id];
  const ids = [...p.pieces, ...p.optional] as PieceId[];
  return (
    <details className="disclosure">
      <summary>Desglose por piezas</summary>
      <ul>
        {SHOW_PRICES
          ? PRICES!.plans[id].breakdown.map((b) => <li key={b}>{b}</li>)
          : ids.map((pid) => (
              <li key={pid}>
                {piece(pid).name}
                {p.optional.includes(pid) ? ' (opcional)' : ''} <Tag status={piece(pid).status} />
              </li>
            ))}
        {!SHOW_PRICES && <li>Diagnóstico de visibilidad: {id === 'comunicacion' ? 'incluido' : 'pago de inicio, en tu propuesta'}</li>}
      </ul>
    </details>
  );
};

export const PriceNote: React.FC = () => (
  <p className="small muted">
    {SHOW_PRICES ? `${plans.rules.taxes} ` : ''}
    {NO_ONLINE}
  </p>
);

const PlanCards: React.FC = () => (
  <section id="planes" className="section" aria-labelledby="planes-title">
    <div className="wrap">
      <p className="eyebrow">Planes por objetivo</p>
      <h2 id="planes-title">Empieza por lo que quieres conseguir</h2>
      <div className="plan-grid">
        {PLAN_IDS.map((id) => {
          const p = plans.plans[id];
          return (
            <article key={id} className="card plan-card">
              <span className="icon-badge">
                <Icon name={PLAN_ICON[id]} />
              </span>
              <h3>{p.name}</h3>
              <p className="tagline">{p.tagline}</p>
              {p.badge && (
                <p className="matiz-note">
                  <Tag status="matiz">{p.badge}</Tag> {p.badgeNote}
                </p>
              )}
              <h4 className="measure-open">Qué medimos</h4>
              <ul className="ticks measure-open">
                {p.measure.map((m) => (
                  <li key={m}>
                    <Icon name="check" size={18} />
                    {m}
                  </li>
                ))}
              </ul>
              <details className="disclosure measure-disclosure">
                <summary>Qué medimos</summary>
                <ul className="ticks">
                  {p.measure.map((m) => (
                    <li key={m}>
                      <Icon name="check" size={18} />
                      {m}
                    </li>
                  ))}
                </ul>
              </details>
              <div className="plan-foot">
                <PlanPrice id={id} />
                <Breakdown id={id} />
                <a href={planHref(id)} className="btn btn--block">
                  Arma este plan
                </a>
                <a href={p.path} className="btn btn--ghost btn--block">
                  Ver el detalle <span className="sr-only">del {p.name}</span>
                </a>
              </div>
            </article>
          );
        })}
      </div>
      <PriceNote />
    </div>
  </section>
);

export default PlanCards;

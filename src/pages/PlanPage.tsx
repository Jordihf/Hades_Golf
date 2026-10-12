import React from 'react';
import plans from '../data/plans.json';
import { piece, PieceId, PlanId } from '../lib/plan';
import { Breakdown, PLAN_ICON, PlanPrice, planHref, PriceNote } from '../components/PlanCards';
import { Tag } from '../components/Layout';
import Icon from '../components/Icon';
import HeroChart from '../components/HeroChart';
import { VisibilitySample } from '../components/RadiografiaCard';

const PlanPage: React.FC<{ id: PlanId }> = ({ id }) => {
  const p = plans.plans[id];
  const ids = [...p.pieces, ...p.optional] as PieceId[];
  return (
    <>
      <section className="page-hero" aria-labelledby="plan-title">
        <div className="wrap narrow">
          <nav aria-label="Migas" className="crumbs">
            <a href="/#planes">Planes</a> <span aria-hidden="true">/</span> <span>{p.name}</span>
          </nav>
          <span className="icon-badge icon-badge--light">
            <Icon name={PLAN_ICON[id]} />
          </span>
          <h1 id="plan-title">
            {p.name} <span className="h1-sub">{p.tagline}</span>
          </h1>
          <p className="lead">Para quién: {p.forWho}</p>
          {p.badge && (
            <p className="matiz-note">
              <Tag status="matiz">{p.badge}</Tag> {p.badgeNote}
            </p>
          )}
          <div className="btn-row">
            <a href={planHref(id)} className="btn btn--big">Arma tu {p.name}</a>
            <a href="/radiografia/" className="btn btn--big btn--light">¿Qué es la Radiografía?</a>
          </div>
        </div>
      </section>

      <section className="section" aria-label="Detalle del plan">
        <div className="wrap narrow">
          <div className="two-col">
            <div>
              <h2 className="h3">Qué medimos</h2>
              <ul className="ticks">
                {p.measure.map((m) => (
                  <li key={m}>
                    <Icon name="check" size={18} />
                    {m}
                  </li>
                ))}
              </ul>
            </div>
            <div>
              <h2 className="h3">Qué hacen los agentes</h2>
              <ul className="ticks">
                {p.agents.map((m) => (
                  <li key={m}>
                    <Icon name="check" size={18} />
                    {m}
                  </li>
                ))}
              </ul>
            </div>
          </div>

          {id === 'datos' && (
            <div className="plan-sample">
              <h2 className="h3">Así se ve tu informe</h2>
              <HeroChart />
            </div>
          )}
          {id === 'visibilidad' && (
            <div className="plan-sample">
              <h2 className="h3">Así se ve tu informe</h2>
              <VisibilitySample />
            </div>
          )}

          <h2 className="h3">Las piezas</h2>
          <ul className="pieces">
            {ids.map((pid) => (
              <li key={pid} className="piece">
                <div className="piece-head">
                  <strong>
                    {piece(pid).name}
                    {p.optional.includes(pid) ? ' (opcional)' : ''}
                  </strong>
                  <Tag status={piece(pid).status} />
                </div>
                <p className="small">{piece(pid).text}</p>
                {piece(pid).matiz && <p className="small muted">{piece(pid).matiz}</p>}
              </li>
            ))}
            <li className="piece">
              <div className="piece-head">
                <strong>{plans.diagnostico.name}</strong>
                <Tag status={plans.diagnostico.status} />
              </div>
              <p className="small">{plans.diagnostico.text}</p>
              <p className="small muted">{plans.diagnostico.matiz}</p>
            </li>
          </ul>

          <h2 className="h3">Cómo sabrás si funciona</h2>
          <p>{p.metric}</p>

          <div className="price-box">
            <PlanPrice id={id} />
            <Breakdown id={id} />
            <PriceNote />
          </div>

          <div className="btn-row">
            <a href={planHref(id)} className="btn btn--big">Arma tu {p.name}</a>
          </div>
        </div>
      </section>
    </>
  );
};

export default PlanPage;

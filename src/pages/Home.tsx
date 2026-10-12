import React from 'react';
import plans from '../data/plans.json';
import site from '../data/site.json';
import HeroChart from '../components/HeroChart';
import PlanCards from '../components/PlanCards';
import Configurator from '../components/Configurator';
import RadiografiaCard, { RADIO_DIFF, RADIO_TEXT } from '../components/RadiografiaCard';
import Icon, { IconName } from '../components/Icon';
import { AGENT_TASKS, FAQ, HERO, NOT_DOING, NOT_YET, PROBLEMS, STATS, STEPS } from '../content';
import { CONTACT_ON, LEGAL_ON } from '../lib/flags';
import { useSelection } from '../lib/useSelection';

/** Curvas de nivel de un green: ilustración decorativa propia. */
const Contours: React.FC = () => (
  <svg className="contours" viewBox="0 0 600 400" aria-hidden="true" focusable="false" preserveAspectRatio="xMidYMid slice">
    {[0, 1, 2, 3, 4, 5, 6].map((i) => (
      <ellipse key={i} cx="430" cy="210" rx={60 + i * 42} ry={38 + i * 27} transform={`rotate(-14 430 210)`} />
    ))}
  </svg>
);

const Home: React.FC = () => {
  const state = useSelection();
  const { sel, toggleInterest } = state;

  return (
    <>
      <section className="hero" aria-labelledby="hero-title">
        <Contours />
        <div className="wrap hero-grid">
          <div>
            <p className="eyebrow">{HERO.eyebrow}</p>
            <h1 id="hero-title">{HERO.title}</h1>
            <p className="lead">{HERO.subtitle}</p>
            <div className="btn-row">
              <a href="#configurador" className="btn btn--big">Arma tu plan</a>
              <a href="/radiografia/" className="btn btn--big btn--ghost">¿Qué es la Radiografía?</a>
            </div>
            {!CONTACT_ON && <p className="small muted hero-note">{plans.configuratorTexts.visitOnly}</p>}
          </div>
          <HeroChart />
        </div>
      </section>

      <section id="problemas" className="section" aria-labelledby="problemas-title">
        <div className="wrap">
          <p className="eyebrow">Lo que medimos</p>
          <h2 id="problemas-title">Tres preguntas que se hace la gerencia</h2>
          <div className="grid-3">
            {PROBLEMS.map((p) => (
              <article key={p.q} className="card problem-card">
                <span className="icon-badge">
                  <Icon name={p.icon as IconName} />
                </span>
                <h3>{p.q}</h3>
                <p>{p.a}</p>
                {'data' in p && <p className="data">{p.data}</p>}
                {'note' in p && (
                  <p className="small muted">
                    {p.note}{' '}
                    <br />
                    <a href={p.link.href} className="arrow-link">
                      {p.link.label} <Icon name="arrow" size={16} />
                    </a>
                  </p>
                )}
              </article>
            ))}
          </div>
        </div>
      </section>

      <section id="como-trabajamos" className="section section--sand" aria-labelledby="como-title">
        <div className="wrap">
          <p className="eyebrow">Cómo trabajamos</p>
          <h2 id="como-title">Cinco pasos, sin letra pequeña</h2>
          <ol className="steps">
            {STEPS.map((s, i) => (
              <li key={s.t}>
                <span className="step-num" aria-hidden="true">{String(i + 1).padStart(2, '0')}</span>
                <Icon name={s.icon as IconName} size={28} className="step-icon" />
                <strong>{s.t}</strong>
                <span className="small">{s.d}</span>
              </li>
            ))}
          </ol>
        </div>
      </section>

      <PlanCards />

      <Configurator state={state} />

      <section id="radiografia" className="section" aria-labelledby="radio-title">
        <div className="wrap radio-layout">
          <div>
            <p className="eyebrow">El primer paso, gratis</p>
            <h2 id="radio-title">Qué incluye tu Radiografía</h2>
            <p>{RADIO_TEXT}</p>
            <p className="muted">{RADIO_DIFF}</p>
            <a href="/radiografia/" className="btn btn--ghost">
              Ver un ejemplo de Radiografía <Icon name="arrow" size={18} />
            </a>
          </div>
          {/* En móvil el ejemplo se ve en /radiografia/, justo después del titular: la portada no se alarga. */}
          <div className="home-report">
            <RadiografiaCard />
          </div>
        </div>
      </section>

      <section id="agentes" className="section section--dark" aria-labelledby="agentes-title">
        <div className="wrap">
          <p className="eyebrow eyebrow--light">Lo que ya hacen</p>
          <h2 id="agentes-title">Agentes de IA trabajando, no promesas</h2>
          <dl className="stats stats--single">
            {STATS.map((s) => (
              <div key={s.label} className="stat">
                <dt className="stat-label">{s.label}</dt>
                <dd className="stat-value">{s.value}</dd>
                <dd className="stat-context">{s.context}</dd>
              </div>
            ))}
          </dl>
          <h3>Lo que harían por tu campo</h3>
          <ul className="ticks ticks--light two-col-list">
            {AGENT_TASKS.map((t) => (
              <li key={t}>
                <Icon name="check" size={18} />
                {t}
              </li>
            ))}
          </ul>
        </div>
      </section>

      <section id="lo-que-no-hacemos" className="section" aria-labelledby="no-title">
        <div className="wrap narrow">
          <p className="eyebrow">Sin letra pequeña</p>
          <h2 id="no-title">Lo que no hacemos</h2>
          <ul className="no-list">
            {NOT_DOING.map((t) => (
              <li key={t}>
                <Icon name="minus" size={20} />
                {t}
              </li>
            ))}
          </ul>
          <h3 className="h4">Lo que aún no hacemos</h3>
          <ul className="no-list">
            {NOT_YET.map((t) => (
              <li key={t}>
                <Icon name="clock" size={20} />
                {t}
              </li>
            ))}
          </ul>
        </div>
      </section>

      <section id="te-interesa" className="section section--sand" aria-labelledby="prox-title">
        <div className="wrap">
          <h2 id="prox-title">Aún no lo hacemos: ¿te interesa?</h2>
          <p>{CONTACT_ON ? plans.configuratorTexts.soonOn : plans.configuratorTexts.soonOff}</p>
          <fieldset className="soon-strip">
            <legend className="sr-only">Marca lo que te interesa</legend>
            {plans.comingSoon.map((c) => (
              <label key={c.id} className="soon-chip">
                <input type="checkbox" checked={sel.interests.includes(c.id)} onChange={() => toggleInterest(c.id)} />
                <span>
                  <strong>{c.label}</strong>
                  <span className="small muted block">{c.text}</span>
                </span>
              </label>
            ))}
          </fieldset>
          <p className="small muted">
            Para guardarlo, <a href="#configurador">arma tu plan</a> y cópialo al final.
          </p>
        </div>
      </section>

      <section id="quien-esta-detras" className="section" aria-labelledby="quien-title">
        <div className="wrap narrow">
          <h2 id="quien-title">Quién está detrás</h2>
          <p>
            Hades Golf une la relación directa con tu comercial, que conoce el sector del golf, con la tecnología de un grupo que ya
            opera agentes de IA para un cliente del sector turístico en España.
          </p>
          {LEGAL_ON && site.legal.brandNote && <p className="muted">{site.legal.brandNote}</p>}
        </div>
      </section>

      <section id="faq" className="section section--sand" aria-labelledby="faq-title">
        <div className="wrap narrow">
          <h2 id="faq-title">Preguntas frecuentes</h2>
          <div className="faq-list">
            {FAQ.map((f) => (
              <details key={f.q} className="disclosure faq">
                <summary>{f.q}</summary>
                <p>{f.a}</p>
              </details>
            ))}
          </div>
        </div>
      </section>
    </>
  );
};

export default Home;

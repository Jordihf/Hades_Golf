import React, { useRef, useState } from 'react';
import Shop, { AddButton } from '../components/Shop';
import Icon from '../components/Icon';
import Photo from '../components/Photo';
import { FAQ, SLIDES, STATS, STEPS } from '../content';
import { goTo, planStore, usePlan } from '../lib/store';
import { add, has, remove } from '../lib/cart';

// ── Hero: carrusel de fotos propias con titular enorme

const Hero: React.FC = () => {
  const [i, setI] = useState(0);
  const n = SLIDES.length;
  const go = (k: number) => setI((k + n) % n);
  const startX = useRef<number | null>(null);

  return (
    <section
      className="hero"
      aria-roledescription="carrusel"
      aria-label="Lo más destacado de Hades Golf"
      onKeyDown={(e) => {
        if (e.key === 'ArrowRight') go(i + 1);
        if (e.key === 'ArrowLeft') go(i - 1);
      }}
      onTouchStart={(e) => (startX.current = e.touches[0].clientX)}
      onTouchEnd={(e) => {
        if (startX.current === null) return;
        const dx = e.changedTouches[0].clientX - startX.current;
        if (Math.abs(dx) > 50) go(dx < 0 ? i + 1 : i - 1);
        startX.current = null;
      }}
    >
      <div className="wrap hero-wrap">
        <div className="hero-track" style={{ transform: `translateX(calc(${-i} * (100% + var(--hero-gap))))` }}>
          {SLIDES.map((s, k) => (
            <div
              key={s.slot}
              className={k === i ? 'slide slide--on' : 'slide'}
              role="group"
              aria-roledescription="diapositiva"
              aria-label={`${k + 1} de ${n}`}
              aria-hidden={k !== i}
              onClick={() => k !== i && go(k)}
            >
              <Photo slot={s.slot} mobile={s.mobile} fallback={s.slot === 'hero' ? 'cierre' : undefined} alt={s.alt} className="fill" priority={k === 0} />
              <div className="slide-shade" aria-hidden="true" />
              <div className="dots dots--hero" aria-hidden="true" />
              <div className="slide-copy">
                <p className="kicker kicker--lime">{s.kicker}</p>
                {k === 0 ? <h1 className="display display--hero">{s.title}</h1> : <p className="display display--hero">{s.title}</p>}
                <p className="slide-sub">{s.sub}</p>
                <div className="btn-row">
                  <a
                    href={s.cta.href}
                    className="pill pill--lime pill--big"
                    tabIndex={k === i ? 0 : -1}
                    onClick={(e) => goTo(s.cta.href.replace('/#', ''), e)}
                  >
                    {s.cta.label} <Icon name="arrow" size={18} />
                  </a>
                  <a href="/radiografia/" className="pill pill--glass pill--big" tabIndex={k === i ? 0 : -1}>
                    Radiografía gratis
                  </a>
                </div>
              </div>
            </div>
          ))}
        </div>
        <div className="hero-ctrl">
          <div className="hero-dots" aria-label="Elegir diapositiva" role="group">
            {SLIDES.map((s, k) => (
              <button key={s.slot} type="button" aria-label={`Diapositiva ${k + 1}`} aria-current={k === i} onClick={() => go(k)}>
                <span />
              </button>
            ))}
          </div>
          <div className="hero-arrows">
            <button type="button" className="round" aria-label="Anterior" onClick={() => go(i - 1)}>
              <Icon name="chevL" size={20} />
            </button>
            <button type="button" className="round" aria-label="Siguiente" onClick={() => go(i + 1)}>
              <Icon name="chevR" size={20} />
            </button>
          </div>
        </div>
      </div>
    </section>
  );
};

// ── Cifras en tarjetas de color

const Stats: React.FC = () => {
  const { cart } = usePlan();
  const inPlan = has(cart, 'radiografia');
  return (
    <section className="stats" aria-labelledby="cifras-title">
      <div className="wrap">
        <div className="stats-card">
          <div className="dots dots--tl" aria-hidden="true" />
          <div className="dots dots--br" aria-hidden="true" />
          <div className="stats-head">
            <h2 id="cifras-title" className="display display--lg">
              Golf, datos e IA.
              <br />
              <span className="hl">Para tu campo.</span>
            </h2>
            <p>Productos concretos, con precio a la vista. Elige lo que necesitas y empieza.</p>
          </div>
          <div className="stats-grid">
            {STATS.map((s, k) => (
              <div key={s.big} className={`stat tone-${s.tone}${k === 0 ? ' stat--big' : ''}`}>
                <div className="dots dots--stat" aria-hidden="true" />
                <span className="stat-rank">{s.rank}</span>
                <div className="stat-box">
                  <span className="stat-unit">{s.unit}</span>
                  <span className="stat-num">{s.big}</span>
                </div>
                <p className="stat-label">{s.label}</p>
                {k === 0 && <img className="stat-h" src="/brand/hades-h-blanco.webp" alt="" width={400} height={452} />}
              </div>
            ))}
            <div className="stat tone-golf stat--free">
              <div className="dots dots--stat" aria-hidden="true" />
              <span className="stat-rank">Gratis</span>
              <div className="stat-box">
                <span className="stat-unit">Radiografía</span>
                <span className="stat-num">0{' '}€</span>
              </div>
              <p className="stat-label">Lo que se ve de tu campo desde fuera, en una página. Para tu visita.</p>
              <button
                type="button"
                className={inPlan ? 'pill pill--outline-light' : 'pill pill--lime'}
                aria-pressed={inPlan}
                onClick={() => planStore.apply(inPlan ? remove(cart, 'radiografia') : add(cart, 'radiografia'))}
              >
                {inPlan ? <Icon name="check" size={18} /> : <Icon name="plus" size={18} />}
                {inPlan ? 'En tu plan' : 'Añadir gratis'}
              </button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

// ── Destacado: Llena tu campo (con ejemplo ilustrativo de ocupación)

const DAYS = ['L', 'M', 'X', 'J', 'V', 'S', 'D'];
const SLOTS = ['8-11', '11-14', '14-17', '17-20'];
// Valores inventados (0-4) solo para enseñar el formato: no son de ningún campo.
const GRID = [
  [3, 3, 3, 4, 4, 4, 4],
  [2, 2, 3, 3, 3, 4, 4],
  [1, 0, 1, 1, 2, 4, 3],
  [0, 1, 0, 1, 2, 3, 2],
];

const Spotlight: React.FC = () => (
  <section className="spot" aria-labelledby="spot-title">
    <div className="wrap">
      <div className="spot-card">
        <div className="dots dots--tr" aria-hidden="true" />
        <div className="spot-text">
        <p className="kicker kicker--golf">Llena tu campo</p>
        <h2 id="spot-title" className="display display--lg">
          Mira tus huecos.
          <br />
          <span className="hl">Llénalos.</span>
        </h2>
        <p>
          Ocupación te dice qué salidas se quedan vacías, por día y por franja. Campañas según ocupación segmenta tu base y lanza preventa
          y last minute justo ahí, desde el correo del club.
        </p>
        <div className="btn-row">
          <AddButton id="ocupacion" />
          <AddButton id="campanas" />
        </div>
        </div>
        <figure className="heat" aria-labelledby="heat-cap">
          <div className="heat-grid" role="img" aria-label="Ejemplo ilustrativo: las tardes de lunes a jueves son las franjas más vacías">
            <span />
            {DAYS.map((d) => (
              <span key={d} className="heat-h">
                {d}
              </span>
            ))}
            {GRID.map((row, r) => (
              <React.Fragment key={SLOTS[r]}>
                <span className="heat-h heat-h--row">{SLOTS[r]}</span>
                {row.map((v, c) => (
                  <span key={c} className={`cell c${v}`} />
                ))}
              </React.Fragment>
            ))}
          </div>
          <figcaption id="heat-cap" className="heat-cap">
            <span className="heat-legend">
              <i className="cell c0" /> Vacía <i className="cell c4" /> Llena
            </span>
            Ejemplo ilustrativo, no es un campo real.
          </figcaption>
        </figure>
      </div>
    </div>
  </section>
);

// ── Cómo funciona

const Steps: React.FC = () => (
  <section className="steps" aria-labelledby="pasos-title">
    <div className="wrap steps-grid">
      <div className="steps-photo">
        <Photo slot="visita" alt="" className="fill" sizes="(min-width: 900px) 40vw, 100vw" />
        <div className="slide-shade" aria-hidden="true" />
        <p className="steps-photo-txt display display--md">
          Tu comercial
          <br />
          te lo presenta.
        </p>
      </div>
      <div className="steps-side">
        <p className="kicker">Cómo funciona</p>
        <h2 id="pasos-title" className="display display--lg">
          Tres pasos. <span className="hl">Cero líos.</span>
        </h2>
        <ol className="steps-row">
          {STEPS.map((s, k) => (
            <li key={s.n} className={`step tone-${['granate', 'marino', 'azulado'][k]}`}>
              <div className="dots dots--stat" aria-hidden="true" />
              <span className="step-n" aria-hidden="true">
                {s.n}
              </span>
              <div>
                <h3 className="display display--sm">{s.t}</h3>
                <p>{s.d}</p>
              </div>
            </li>
          ))}
        </ol>
      </div>
    </div>
  </section>
);

// ── Banda final

const Closing: React.FC = () => (
  <section className="closing" aria-labelledby="cierre-title">
    <div className="wrap">
      <div className="closing-card">
        <Photo slot="cierre" alt="" className="fill" />
        <div className="slide-shade" aria-hidden="true" />
        <div className="dots dots--hero" aria-hidden="true" />
        <div className="closing-copy">
          <p className="kicker kicker--lime">Tu plan, en un minuto</p>
          <h2 id="cierre-title" className="display display--hero">
            Arma tu plan.
            <br />
            Llena tu campo.
          </h2>
          <div className="btn-row">
            <a href="/#tienda" className="pill pill--lime pill--big" onClick={(e) => goTo('tienda', e)}>
              Ir a la tienda <Icon name="arrow" size={18} />
            </a>
            <a href="/radiografia/" className="pill pill--glass pill--big">
              Radiografía gratis
            </a>
          </div>
        </div>
      </div>
    </div>
  </section>
);

// ── Preguntas

const Faq: React.FC = () => (
  <section className="faq" id="faq" aria-labelledby="faq-title" tabIndex={-1}>
    <div className="wrap faq-grid">
      <div>
        <p className="kicker">Preguntas</p>
        <h2 id="faq-title" className="display display--lg">
          Lo que te
          <br />
          <span className="hl">preguntas.</span>
        </h2>
        <a href="/#tienda" className="pill pill--green pill--big" onClick={(e) => goTo('tienda', e)}>
          Ir a la tienda <Icon name="arrow" size={18} />
        </a>
      </div>
      <div className="faq-list">
        {FAQ.map((f) => (
          <details key={f.q}>
            <summary>
              {f.q}
              <span className="faq-ico" aria-hidden="true" />
            </summary>
            <p>{f.a}</p>
          </details>
        ))}
      </div>
    </div>
  </section>
);

const Home: React.FC = () => (
  <>
    <Hero />
    <Stats />
    <Shop />
    <Spotlight />
    <Steps />
    <Faq />
    <Closing />
  </>
);

export default Home;

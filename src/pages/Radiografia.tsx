import React from 'react';
import RadiografiaCard, { RADIO_DIFF, RADIO_TEXT } from '../components/RadiografiaCard';
import Icon from '../components/Icon';
import Photo from '../components/Photo';
import { add, encode, has, remove } from '../lib/cart';
import { planStore, usePlan } from '../lib/store';

const SIGNALS: { icon: string; k: string; v: string }[] = [
  { icon: 'spark', k: 'Tu web, lista para la IA', v: 'Revisamos 35 puntos de tu web que deciden si un buscador con IA la puede citar.' },
  { icon: 'globe', k: 'Idiomas', v: 'En qué idiomas está tu web y cuáles te faltan para tus mercados.' },
  { icon: 'eye', k: 'Medición de anuncios', v: 'Si tu web mide los anuncios que pagas.' },
  { icon: 'calendar', k: 'Sistema de reservas', v: 'Qué programa de reservas se ve. Con GolfManager o TeeOne, encaja con Ocupación.' },
  { icon: 'chart', k: 'Mercados extranjeros', v: 'Qué mercados gastan más por viaje, con datos nacionales públicos.' },
];

const AddRadio: React.FC = () => {
  const { cart } = usePlan();
  const inPlan = has(cart, 'radiografia');
  return inPlan ? (
    <>
      <button type="button" className="pill pill--outline pill--big" aria-pressed onClick={() => planStore.apply(remove(cart, 'radiografia'))}>
        <Icon name="check" size={18} /> En tu plan · Quitar
      </button>
      <a href={`/#${encode(cart)}`} className="pill pill--green pill--big">
        Ver la tienda <Icon name="arrow" size={18} />
      </a>
    </>
  ) : (
    <>
      <button type="button" className="pill pill--lime pill--big" aria-pressed={false} onClick={() => planStore.apply(add(cart, 'radiografia'))}>
        <Icon name="plus" size={18} /> Añadir a mi plan, gratis
      </button>
      <a href="/#tienda" className="pill pill--soft pill--big">
        Ver la tienda <Icon name="arrow" size={18} />
      </a>
    </>
  );
};

// El ejemplo va pronto en el HTML: en móvil se ve justo después del titular.
const Radiografia: React.FC = () => (
  <>
    <section className="page-hero" aria-labelledby="radio-page-title">
      <div className="wrap">
        <div className="page-hero-card">
          <Photo slot="hero" mobile="hero-movil" fallback="cierre" alt="" className="fill" priority />
          <div className="slide-shade" aria-hidden="true" />
          <div className="dots dots--hero" aria-hidden="true" />
          <div className="page-hero-copy">
            <p className="kicker kicker--lime">Gratis · Sin contraseñas</p>
            <h1 id="radio-page-title" className="display display--hero">
              La Radiografía de tu campo
            </h1>
            <p className="slide-sub">{RADIO_TEXT}</p>
          </div>
        </div>
      </div>
    </section>

    <section className="section" aria-labelledby="radio-que">
      <div className="wrap radio-layout">
        <RadiografiaCard />
        <div className="radio-side">
          <div className="soft-card">
            <h2 id="radio-que" className="display display--sm">
              Qué miramos
            </h2>
            <ul className="signal-list">
              {SIGNALS.map((s) => (
                <li key={s.k}>
                  <span className="icon-badge">
                    <Icon name={s.icon} size={20} />
                  </span>
                  <div>
                    <strong>{s.k}</strong>
                    <p>{s.v}</p>
                  </div>
                </li>
              ))}
            </ul>
          </div>
          <div className="soft-card soft-card--green">
            <div className="dots dots--tr" aria-hidden="true" />
            <h2 className="display display--sm">Cómo te llega</h2>
            <p>En la visita, tu comercial de Hades te la enseña desde el móvil o la tableta. Añádela a tu plan y la tendrá preparada.</p>
            <p className="small">{RADIO_DIFF}</p>
            <div className="btn-row">
              <AddRadio />
            </div>
          </div>
        </div>
      </div>
    </section>
  </>
);

export default Radiografia;

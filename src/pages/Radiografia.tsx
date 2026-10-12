import React from 'react';
import plans from '../data/plans.json';
import RadiografiaCard, { RADIO_DIFF, RADIO_TEXT } from '../components/RadiografiaCard';
import Icon, { IconName } from '../components/Icon';
import { CONTACT_ON } from '../lib/flags';

const SIGNALS: { icon: IconName; k: string; v: string }[] = [
  { icon: 'spark', k: 'Preparación de tu web para la IA', v: 'Revisamos los 35 puntos que se pueden medir de tu web para saber si está preparada para que un buscador con IA la cite. Si te cita o no, lo mide el Plan Visibilidad.' },
  { icon: 'globe', k: 'Idiomas', v: 'En qué idiomas está tu web. Si no está en los idiomas de tus mercados, te lo decimos.' },
  { icon: 'eye', k: 'Medición de anuncios', v: 'Si tu web mide los anuncios. Si no lo hace, te lo decimos, aunque nosotros no gestionamos anuncios.' },
  { icon: 'calendar', k: 'Sistema de reservas', v: 'Qué programa de reservas se ve en tu web. Si usas GolfManager o TeeOne, podríamos estimar tu ocupación con el Plan Datos (con matiz).' },
  { icon: 'chart', k: 'Mercados extranjeros', v: 'Qué mercados extranjeros gastan más por viaje, con datos nacionales públicos (IE/AECG/RFEG, datos de 2022). El detalle va en el Informe de mercados emisores.' },
];

// El ejemplo va primero en el HTML: en móvil y tableta se ve justo después del titular.
const Radiografia: React.FC = () => (
  <>
    <section className="page-hero" aria-labelledby="radio-page-title">
      <div className="wrap narrow">
        <p className="eyebrow eyebrow--light">Gratis y sin contraseñas</p>
        <h1 id="radio-page-title">La Radiografía de tu campo</h1>
        <p className="lead">{RADIO_TEXT}</p>
        {!CONTACT_ON && <p className="hero-note">{plans.configuratorTexts.visitOnly}</p>}
      </div>
    </section>

    <section className="section" aria-labelledby="radio-que">
      <div className="wrap radio-layout radio-layout--card-first">
        <RadiografiaCard />
        <div>
          <h2 id="radio-que" className="h3">Qué miramos</h2>
          <ul className="signal-list">
            {SIGNALS.map((s) => (
              <li key={s.k}>
                <span className="icon-badge icon-badge--sm">
                  <Icon name={s.icon} size={20} />
                </span>
                <div>
                  <strong>{s.k}</strong>
                  <p className="small">{s.v}</p>
                </div>
              </li>
            ))}
          </ul>

          <h2 className="h3">Radiografía y Diagnóstico no son lo mismo</h2>
          <p>{RADIO_DIFF}</p>

          <h2 className="h3">Cómo te llega</h2>
          <p>
            En la visita, tu comercial de Hades te la enseña desde el móvil o la tableta.
            {CONTACT_ON
              ? ' También puedes pedirla desde esta web: arma tu plan y envíanoslo.'
              : ' Mientras, arma tu plan y guárdalo para enseñárselo.'}
          </p>
          <div className="btn-row">
            <a href="/#configurador" className="btn btn--big">Arma tu plan</a>
          </div>
        </div>
      </div>
    </section>
  </>
);

export default Radiografia;

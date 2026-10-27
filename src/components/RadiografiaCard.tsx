import React from 'react';
import Icon, { IconName } from './Icon';

export const RADIO_TEXT =
  'Lo que se ve de tu campo desde fuera, en una página: si tu web está lista para que la IA la cite, sus idiomas, si mide los anuncios, qué sistema de reservas usa y qué mercados extranjeros gastan más. Gratis y sin contraseñas.';

export const RADIO_DIFF =
  'La Radiografía es una foto rápida con señales públicas. El Diagnóstico de visibilidad es el análisis a fondo de tu presencia en la IA, con tu hoja de ruta.';

type Level = 'bajo' | 'medio' | 'ok' | 'info';
const LEVEL_TXT: Record<Level, string> = { bajo: 'Por mejorar', medio: 'A revisar', ok: 'Bien', info: 'Dato' };

// Campo ficticio: todos los valores del club son inventados y se marcan como ejemplo. La web usa un
// dominio reservado (.example) para no señalar a ningún club real.
const SCORE = { got: 14, max: 35 };
const SAMPLE_WEB = 'clubdegolfejemplo.example';
const SAMPLE_DATE = '12/10/2026';
const LANGS = [
  { code: 'ES', on: true },
  { code: 'EN', on: false },
  { code: 'DE', on: false },
  { code: 'FR', on: false },
];

const ROWS: { icon: IconName; k: string; v: React.ReactNode; level: Level; next: string }[] = [
  {
    icon: 'globe',
    k: 'Idiomas de tu web',
    v: (
      <span className="lang-chips">
        <span className="sr-only">Solo en español; faltan inglés, alemán y francés</span>
        {LANGS.filter((l) => l.on).map((l) => (
          <span key={l.code} className="lang lang--on" aria-hidden="true">
            {l.code}
          </span>
        ))}
        <span className="lang-missing" aria-hidden="true">
          falta
          {LANGS.filter((l) => !l.on).map((l) => (
            <s key={l.code} className="lang lang--off">
              {l.code}
            </s>
          ))}
        </span>
      </span>
    ),
    level: 'bajo',
    next: 'Qué idiomas priorizar según tus mercados',
  },
  { icon: 'eye', k: '¿Tu web mide los anuncios?', v: 'No vemos ninguna etiqueta de medición', level: 'medio', next: 'Te lo señalamos' },
  { icon: 'calendar', k: 'Sistema de reservas que se ve', v: 'GolfManager', level: 'ok', next: 'Encaja con Ocupación' },
  {
    icon: 'chart',
    k: 'Mercados que más gastan por viaje',
    v: (
      <>
        Irlanda · Países Bajos · nórdicos
        <span className="report-src">Dato nacional, igual para todos los campos. Fuente: IE/AECG/RFEG, datos de 2022.</span>
      </>
    ),
    level: 'info',
    next: 'Informe de mercados emisores',
  },
];

const RadiografiaCard: React.FC = () => (
  <figure className="report" aria-labelledby="radio-ejemplo">
    <div className="report-head">
      <div>
        <span className="report-kicker">Radiografía · Ejemplo</span>
        <h3 id="radio-ejemplo" className="report-title">Club de Golf Ejemplo</h3>
        <span className="report-sub">
          {SAMPLE_WEB} · {SAMPLE_DATE} · campo ficticio
        </span>
      </div>
      <span className="sample-label">Datos de ejemplo</span>
    </div>

    <div className="report-score">
      <div className="report-score-num">
        <strong>{SCORE.got}</strong>
        <span>de {SCORE.max} puntos</span>
      </div>
      <div className="report-score-bar">
        <span className="report-score-lbl">Preparación de tu web para la IA</span>
        <div
          className="meter"
          role="meter"
          aria-valuemin={0}
          aria-valuemax={SCORE.max}
          aria-valuenow={SCORE.got}
          aria-label={`Preparación de la web para la IA: ${SCORE.got} de ${SCORE.max} puntos (ejemplo)`}
        >
          <span style={{ width: `${(SCORE.got / SCORE.max) * 100}%` }} />
        </div>
        <span className="report-next">
          <Icon name="arrow" size={16} /> Qué te proponemos: Diagnóstico de visibilidad y Visibilidad en IA
        </span>
      </div>
    </div>

    <dl className="report-rows">
      {ROWS.map((r) => (
        <div key={r.k} className="report-row">
          <dt>
            <Icon name={r.icon} size={20} />
            {r.k}
          </dt>
          <dd>
            <span className="report-val">{r.v}</span>
            <span className={`light light--${r.level}`}>{LEVEL_TXT[r.level]}</span>
            <span className="report-next">
              <Icon name="arrow" size={16} /> {r.next}
            </span>
          </dd>
        </div>
      ))}
    </dl>
    <figcaption className="small report-foot">
      <span className="report-brand">Hades Golf · Radiografía</span>
      Campo inventado para enseñarte el formato. Salvo los mercados (dato nacional), los valores no corresponden a ningún club real.
    </figcaption>
  </figure>
);

export default RadiografiaCard;

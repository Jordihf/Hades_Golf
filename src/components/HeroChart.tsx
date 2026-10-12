import React from 'react';

// Ilustración propia con datos inventados: no representa ningún campo real.
// Rejilla en HTML (no SVG) para que las etiquetas tengan su tamaño real y crezcan con la letra del navegador.
const DAYS = ['L', 'M', 'X', 'J', 'V', 'S', 'D'];
const SLOTS = ['Mañana', 'Mediodía', 'Tarde'];
const LEVEL = [
  [3, 3, 3, 3, 3, 4, 4],
  [2, 2, 3, 2, 3, 4, 4],
  [1, 1, 1, 1, 2, 3, 2],
];
const FILL = ['#efe7d6', '#cfdcc8', '#93b59a', '#4f8466', '#1a5240'];

const HeroChart: React.FC = () => (
  <figure className="hero-chart">
    <div className="hero-chart-head">
      <span className="sample-label">Ejemplo · campo ficticio</span>
      <span className="hero-chart-title">Ocupación estimada por franja</span>
    </div>
    <div
      className="heat"
      role="img"
      aria-label="Ilustración con datos de ejemplo de un campo ficticio: ocupación estimada por franja y día de la semana. Las tardes entre semana aparecen más vacías."
    >
      <span />
      {DAYS.map((d) => (
        <span key={d} className="heat-day">
          {d}
        </span>
      ))}
      {SLOTS.map((s, r) => (
        <React.Fragment key={s}>
          <span className="heat-slot">{s}</span>
          {LEVEL[r].map((v, c) => (
            <span key={c} className="heat-cell" style={{ background: FILL[v] }} />
          ))}
        </React.Fragment>
      ))}
    </div>
    <div className="heat-legend" aria-hidden="true">
      <span>Más vacío</span>
      {FILL.map((f) => (
        <span key={f} className="heat-swatch" style={{ background: f }} />
      ))}
      <span>Más lleno</span>
    </div>
    <figcaption className="small">Datos inventados para enseñarte el formato del informe.</figcaption>
  </figure>
);

export default HeroChart;

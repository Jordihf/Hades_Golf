import React, { useState } from 'react';
import { CONTACT_ON, LEGAL_ON } from '../lib/flags';
import site from '../data/site.json';

export const Tag: React.FC<{ status: string; children?: React.ReactNode }> = ({ status, children }) => {
  const cls = status === 'disponible' ? 'tag tag--ok' : status === 'matiz' ? 'tag tag--warn' : 'tag tag--soon';
  const text = children ?? (status === 'disponible' ? 'Disponible' : status === 'matiz' ? 'Con matiz' : 'Aún no disponible');
  return <span className={cls}>{text}</span>;
};

/** Marca: bandera de green (banderín relleno, mástil, green y bola), la misma del favicon. */
export const Mark: React.FC<{ size?: number }> = ({ size = 34 }) => (
  <svg className="mark" width={size} height={size} viewBox="0 0 32 32" aria-hidden="true" focusable="false">
    <rect width="32" height="32" rx="8" fill="currentColor" />
    <ellipse cx="15.5" cy="25" rx="10" ry="2.8" fill="#4f8466" />
    <path d="M12 25V5.5" stroke="#efe7d6" strokeWidth="2" strokeLinecap="round" />
    <path d="M12.5 5.5l11 4.25-11 4.25z" fill="#d9b77e" />
    <circle cx="20.5" cy="24.2" r="1.7" fill="#fff" />
  </svg>
);

export const Logo: React.FC = () => (
  <a href="/" className="logo" aria-label="Hades Golf, ir a la portada">
    <Mark />
    <span className="logo-word">
      Hades <em>Golf</em>
    </span>
  </a>
);

const NAV = [
  { href: '/#planes', label: 'Planes' },
  { href: '/radiografia/', label: 'Radiografía' },
  { href: '/#faq', label: 'Preguntas' },
];

export const Header: React.FC = () => {
  const [open, setOpen] = useState(false);
  return (
    <header className="site-header">
      <div className="wrap header-row">
        <Logo />
        <button
          type="button"
          className="menu-btn"
          aria-expanded={open}
          aria-controls="menu-principal"
          onClick={() => setOpen(!open)}
        >
          {open ? 'Cerrar' : 'Menú'}
        </button>
        <nav id="menu-principal" aria-label="Principal" className={open ? 'nav nav--open' : 'nav'}>
          {NAV.map((n) => (
            <a key={n.href} href={n.href} onClick={() => setOpen(false)}>
              {n.label}
            </a>
          ))}
          <a href="/#configurador" className="btn btn--nav" onClick={() => setOpen(false)}>
            Arma tu plan
          </a>
        </nav>
      </div>
    </header>
  );
};

export const Footer: React.FC = () => {
  const { legal } = site;
  return (
    <footer className="site-footer">
      <div className="wrap footer-row">
        <div className="footer-brand">
          <Logo />
          <p className="small">Datos y automatización para la gerencia de tu campo de golf.</p>
          {LEGAL_ON && (
            <p className="small">
              {legal.brandNote} Titular: {legal.holder}. Contacto: <a href={`mailto:${legal.email}`}>{legal.email}</a>
            </p>
          )}
          {CONTACT_ON && !LEGAL_ON && (
            <p className="small">
              Contacto: <a href={`mailto:${site.contactEmail}`}>{site.contactEmail}</a>
            </p>
          )}
        </div>
        <nav aria-label="Legal" className="footer-links">
          <a href="/aviso-legal/">Aviso legal</a>
          <a href="/privacidad/">Privacidad</a>
          <a href="/cookies/">Cookies</a>
        </nav>
      </div>
      <div className="wrap">
        <p className="small footer-copy">© 2026 Hades Golf</p>
      </div>
    </footer>
  );
};

export const Shell: React.FC<{ children: React.ReactNode }> = ({ children }) => (
  <>
    <a href="#contenido" className="skip">
      Saltar al contenido
    </a>
    <Header />
    <main id="contenido">{children}</main>
    <Footer />
  </>
);

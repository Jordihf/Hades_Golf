import React, { useEffect, useState } from 'react';
import { CONTACT_ON, LEGAL_ON } from '../lib/flags';
import { goTo, openPlan, planStore, usePlan } from '../lib/store';
import site from '../data/site.json';
import Icon from './Icon';

/** Logotipo oficial (la «H» de cintas + «HADES GOLF»), recortado del original sin redibujarlo. */
export const Logo: React.FC<{ light?: boolean }> = ({ light }) => (
  <a href="/" className={light ? 'logo logo--light' : 'logo'} aria-label="Hades Golf, ir a la portada">
    <img className="logo-h" src={light ? '/brand/hades-h-blanco.webp' : '/brand/hades-h.webp'} width={400} height={452} alt="" />
    <img
      className="logo-word"
      src={light ? '/brand/hades-wordmark-blanco.webp' : '/brand/hades-wordmark.webp'}
      width={700}
      height={164}
      alt="Hades Golf"
    />
  </a>
);

const NAV = [
  { id: 'tienda', label: 'Tienda' },
  { id: 'conocer', label: 'Que te conozcan' },
  { id: 'llena', label: 'Llena tu campo' },
  { id: 'fuera', label: 'Vende fuera' },
  { id: 'faq', label: 'Preguntas' },
];

export const Header: React.FC = () => {
  const [open, setOpen] = useState(false);
  const { cart } = usePlan();
  const n = cart.lines.length;
  const close = () => setOpen(false);

  // Cierra el menú con Escape.
  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => e.key === 'Escape' && setOpen(false);
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [open]);

  return (
    <header className="site-header">
      <div className="nav-pill">
        <Logo />
        <nav id="menu-principal" aria-label="Principal" className={open ? 'nav nav--open' : 'nav'}>
          {NAV.map((l) => (
            <a
              key={l.id}
              href={`/#${l.id}`}
              onClick={(e) => {
                close();
                goTo(l.id, e);
              }}
            >
              {l.label}
            </a>
          ))}
          <a href="/radiografia/" onClick={close}>
            Radiografía
          </a>
        </nav>
        <div className="nav-actions">
          <a href="/radiografia/" className="pill pill--soft nav-radio">
            <Icon name="doc" size={18} /> Gratis
          </a>
          <a
            href="/#tienda"
            className="pill pill--green nav-plan"
            onClick={(e) => {
              if (window.location.pathname !== '/') return;
              e.preventDefault();
              openPlan();
            }}
          >
            <Icon name="bag" size={18} />
            <span>
              Tu plan <span className="nav-count" aria-label={`${n} productos`}>({n})</span>
            </span>
          </a>
          <button
            type="button"
            className="pill pill--soft menu-btn"
            aria-expanded={open}
            aria-controls="menu-principal"
            onClick={() => setOpen(!open)}
          >
            <Icon name={open ? 'x' : 'menu'} size={20} />
            <span className="sr-only">{open ? 'Cerrar menú' : 'Abrir menú'}</span>
          </button>
        </div>
      </div>
    </header>
  );
};

export const Footer: React.FC = () => {
  const { legal } = site;
  return (
    <footer className="site-footer">
      <div className="wrap">
        <div className="footer-card">
          <div className="dots dots--tr" aria-hidden="true" />
          <div className="footer-top">
            <div>
              <a href="/" className="footer-logo" aria-label="Hades Golf, ir a la portada">
                <img src="/brand/hades-logo-blanco.webp" width={900} height={778} alt="Hades Golf" />
              </a>
              <p className="footer-claim">La tienda de IA para clubes, campos y hoteles de golf de España.</p>
            </div>
            <a
              href="/#tienda"
              className="pill pill--lime pill--big"
              onClick={(e) => goTo('tienda', e)}
            >
              Arma tu plan <Icon name="arrow" size={18} />
            </a>
          </div>
          <p className="footer-word" aria-hidden="true">
            Llena tu campo
          </p>
          <div className="footer-bottom">
            <nav aria-label="Legal" className="footer-links">
              <a href="/radiografia/">Radiografía gratis</a>
              <a href="/aviso-legal/">Aviso legal</a>
              <a href="/privacidad/">Privacidad</a>
              <a href="/cookies/">Cookies</a>
            </nav>
            <p className="small">
              © 2026 Hades Golf
              {LEGAL_ON && ` · ${legal.holder}`}
              {CONTACT_ON && (
                <>
                  {' · '}
                  <a href={`mailto:${site.contactEmail}`}>{site.contactEmail}</a>
                </>
              )}
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
};

export const Shell: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  // Si alguien llega o pega un enlace con #plan=…, se carga el plan.
  useEffect(() => {
    planStore.load();
    const onHash = () => planStore.load();
    window.addEventListener('hashchange', onHash);
    return () => window.removeEventListener('hashchange', onHash);
  }, []);
  return (
    <>
      <a href="#contenido" className="skip">
        Saltar al contenido
      </a>
      <Header />
      <main id="contenido">{children}</main>
      <Footer />
    </>
  );
};

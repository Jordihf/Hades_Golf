import React from 'react';
import { createRoot, hydrateRoot } from 'react-dom/client';
import App from './App';
import { cleanPath } from './routes';
import './styles.css';

// La ruta se fija antes de tocar la URL: el HTML servido es el de esta ruta.
const path = cleanPath(window.location.pathname);
// Las URL del antiguo HashRouter (/#/blog/…) pierden el hash; /index.html pasa a su URL limpia.
const hash = window.location.hash.startsWith('#/') ? '' : window.location.hash;
if (path !== window.location.pathname || hash !== window.location.hash) {
  window.history.replaceState(null, '', `${path}${window.location.search}${hash}`);
}

const root = document.getElementById('root')!;
const app = (
  <React.StrictMode>
    <App path={path} />
  </React.StrictMode>
);

// En desarrollo #root solo trae el comentario <!--app-->: entonces se renderiza en vez de hidratar.
if (root.firstElementChild) hydrateRoot(root, app);
else createRoot(root).render(app);

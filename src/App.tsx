import React from 'react';
import { Shell } from './components/Layout';
import { findRoute } from './routes';

// Sin router en cliente: cada URL se sirve como HTML prerenderizado y los enlaces son normales.
const App: React.FC<{ path: string }> = ({ path }) => <Shell>{findRoute(path).render()}</Shell>;

export default App;

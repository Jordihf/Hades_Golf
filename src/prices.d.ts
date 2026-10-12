// «@prices» lo resuelve vite.config.ts: prices.json si SHOW_PRICES=true, prices.off.json (null) si no.
declare module '@prices' {
  const data: import('./lib/prices').PricesData | null;
  export default data;
}

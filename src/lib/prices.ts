import data from '@prices';
import site from '../data/site.json';

export interface PricesData {
  pieces: Record<string, { monthly?: number; from?: boolean; priceNote: string }>;
  diagnosticoSetup: number;
  comunicacionCompleto: number;
  plans: Record<string, { price: string; breakdown: string[] }>;
  discounts: string;
}

/** null mientras SHOW_PRICES=false: en ese caso ningún importe llega al JS publicado. */
export const PRICES: PricesData | null = data;
export const SHOW_PRICES = Boolean(site.flags.SHOW_PRICES && PRICES);

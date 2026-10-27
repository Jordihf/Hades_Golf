import site from '../data/site.json';

// Los interruptores de site.json. El build falla (vite.config.ts) si se activan con datos incompletos.
export const CONTACT_ON = Boolean(site.flags.CONTACT_ENABLED && site.contactEmail);
export const LEGAL_ON = Boolean(site.flags.LEGAL_ENTITY_READY);
export const SHOW_PRICES = Boolean(site.flags.SHOW_PRICES);

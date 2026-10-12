import plans from '../data/plans.json';
import site from '../data/site.json';

// Los interruptores de site.json. El build falla (vite.config.ts) si se activan con datos incompletos.
export const CONTACT_ON = Boolean(site.flags.CONTACT_ENABLED && site.contactEmail);
export const LEGAL_ON = Boolean(site.flags.LEGAL_ENTITY_READY);

/** Sin contacto en la web, la propuesta solo la prepara el comercial en visita. */
export const NO_ONLINE = CONTACT_ON ? plans.rules.noOnlineContact : plans.rules.noOnline;

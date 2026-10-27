/** Espacio de no separación: «1.234 €» no se parte de línea. */
export const NBSP = ' ';

/**
 * Importe en euros a la española: miles con punto (también en 4 cifras: «1.234 €»), decimales con coma
 * solo si los hay. Recibe céntimos enteros.
 */
export function euros(cents: number, opts: { sign?: boolean } = {}): string {
  const neg = cents < 0;
  const abs = Math.abs(Math.round(cents));
  const int = Math.floor(abs / 100);
  const dec = abs % 100;
  const intTxt = String(int).replace(/\B(?=(\d{3})+(?!\d))/g, '.');
  const txt = dec ? `${intTxt},${String(dec).padStart(2, '0')}` : intTxt;
  const sign = neg ? '−' : opts.sign ? '+' : '';
  return `${sign}${txt}${NBSP}€`;
}

/** Euros enteros → «1.234 €». */
export const eur = (e: number) => euros(e * 100);

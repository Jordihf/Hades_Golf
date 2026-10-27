import React from 'react';

type Slot = 'hero' | 'hero-movil' | 'escaparate-conocer' | 'escaparate-llenar' | 'escaparate-fuera' | 'visita' | 'cierre';

const IMG = typeof __IMG__ === 'undefined' ? {} : __IMG__;

export const hasPhoto = (slot: Slot) => {
  const s = IMG[slot];
  return Boolean(s && (s.webp || s.orig));
};

/**
 * Foto de un hueco (src/data/images.json) con <picture> WebP 1x/2x y el original como respaldo.
 * Si el hueco aún no tiene archivo, pinta el marcador de marca: degradado verde, trama de puntos y la «H» en marca de agua.
 */
const Photo: React.FC<{
  slot: Slot;
  /** Hueco alternativo para móvil (≤ 640 px). */
  mobile?: Slot;
  alt: string;
  className?: string;
  sizes?: string;
  priority?: boolean;
  position?: string;
  /** Hueco que se usa mientras este no tenga archivo (p. ej. «cierre» para el hero de escritorio). */
  fallback?: Slot;
}> = ({ slot: wanted, mobile, alt, className, sizes = '100vw', priority, position, fallback }) => {
  const slot = !hasPhoto(wanted) && fallback && hasPhoto(fallback) ? fallback : wanted;
  const s = IMG[slot];
  if (!s || (!s.webp && !s.orig)) {
    return (
      <div className={`ph ph--${wanted}${className ? ` ${className}` : ''}`} aria-hidden="true">
        <span className="ph-dots" />
        <img className="ph-h" src="/brand/hades-h-blanco.webp" alt="" width={400} height={452} />
      </div>
    );
  }
  const m = mobile ? IMG[mobile] : undefined;
  const srcset = (name: string, w: number, x: { webp: boolean; webp2x: boolean }) =>
    [x.webp && `/img/${name}.webp ${Math.round(w / 2)}w`, x.webp2x && `/img/${name}@2x.webp ${w}w`].filter(Boolean).join(', ');
  const src = s.orig ? `/img/${s.orig}` : `/img/${slot}.webp`;
  return (
    <picture className={className}>
      {mobile && m && m.webp && <source media="(max-width: 640px)" type="image/webp" srcSet={srcset(mobile, m.w, m)} sizes="100vw" />}
      {mobile && m && !m.webp && m.orig && <source media="(max-width: 640px)" srcSet={`/img/${m.orig}`} />}
      {s.webp && <source type="image/webp" srcSet={srcset(slot, s.w, s)} sizes={sizes} />}
      <img
        src={src}
        alt={alt}
        width={s.w}
        height={s.h}
        loading={priority ? 'eager' : 'lazy'}
        fetchPriority={priority ? 'high' : undefined}
        decoding="async"
        style={position ? { objectPosition: position } : undefined}
      />
    </picture>
  );
};

export default Photo;

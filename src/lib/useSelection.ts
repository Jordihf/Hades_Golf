import { useCallback, useEffect, useRef, useState } from 'react';
import { decode, decodeStep, EMPTY, hashFor, normalize, Selection } from './plan';

/**
 * Estado compartido del configurador y de la franja «¿Te interesa?». Solo vive en la URL:
 * cada paso es una entrada del historial (el botón «atrás» vuelve al paso anterior) y cada
 * cambio de elecciones actualiza el enlace de la barra de direcciones.
 *
 * Solo se vacía con «Empezar de nuevo», al cargar sin plan en el enlace o al volver con «atrás» a
 * una entrada vacía. Los enlaces «Arma tu plan» (#configurador) de la propia página solo llevan
 * hasta el configurador: no borran lo marcado.
 */
export function useSelection() {
  const [state, setState] = useState<{ sel: Selection; step: number }>({ sel: EMPTY, step: 1 });
  const current = useRef(state);
  current.current = state;
  /** Cada incremento pide al configurador que se muestre y enfoque su título. */
  const [focusSeq, setFocusSeq] = useState(0);
  const requestFocus = useCallback(() => setFocusSeq((n) => n + 1), []);

  useEffect(() => {
    const load = (fromLink: boolean) => {
      const hash = window.location.hash;
      const s = decode(hash);
      if (s) {
        setState({ sel: s, step: decodeStep(hash, s) });
        if (fromLink) requestFocus();
      } else if (hash === '' || hash === '#configurador') {
        setState({ sel: EMPTY, step: 1 });
      }
    };
    load(true);
    const onPop = () => load(false);
    // hashchange cubre los enlaces /#plan=… pulsados dentro de la página (p. ej. «Arma este plan»).
    const onHash = () => load(true);
    // «Arma tu plan» (#configurador) en la misma página: desplazarse sin tocar el enlace ni el estado.
    const onClick = (e: MouseEvent) => {
      if (e.defaultPrevented || e.button !== 0 || e.metaKey || e.ctrlKey || e.shiftKey || e.altKey) return;
      const a = (e.target as Element | null)?.closest?.('a[href]') as HTMLAnchorElement | null;
      if (!a || a.target) return;
      const url = new URL(a.href, window.location.href);
      if (url.origin !== window.location.origin || url.pathname !== window.location.pathname || url.hash !== '#configurador') return;
      e.preventDefault();
      requestFocus();
    };
    window.addEventListener('popstate', onPop);
    window.addEventListener('hashchange', onHash);
    document.addEventListener('click', onClick);
    return () => {
      window.removeEventListener('popstate', onPop);
      window.removeEventListener('hashchange', onHash);
      document.removeEventListener('click', onClick);
    };
  }, [requestFocus]);

  /** push = nueva entrada del historial (cambio de paso); replace = mismo paso, otras elecciones. */
  const update = useCallback((raw: Selection, step: number, mode: 'push' | 'replace') => {
    const sel = normalize(raw);
    const next = { sel, step };
    current.current = next;
    setState(next);
    const url = `${window.location.pathname}${hashFor(sel, step)}`;
    if (mode === 'push') window.history.pushState(null, '', url);
    else window.history.replaceState(null, '', url);
  }, []);

  const setSel = useCallback((sel: Selection) => update(sel, current.current.step, 'replace'), [update]);
  const go = useCallback((step: number, sel?: Selection) => update(sel ?? current.current.sel, step, 'push'), [update]);

  const toggleInterest = useCallback(
    (id: string) => {
      const s = current.current.sel;
      setSel({ ...s, interests: s.interests.includes(id) ? s.interests.filter((i) => i !== id) : [...s.interests, id] });
    },
    [setSel],
  );

  return { sel: state.sel, step: state.step, setSel, go, toggleInterest, focusSeq };
}

export type SelectionState = ReturnType<typeof useSelection>;

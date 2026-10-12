import React, { useEffect, useRef, useState } from 'react';
import plans from '../data/plans.json';
import site from '../data/site.json';
import { Tag } from './Layout';
import Icon from './Icon';
import { CONTACT_ON, NO_ONLINE } from '../lib/flags';
import { PRICES, SHOW_PRICES } from '../lib/prices';
import {
  analizaState, availablePieces, canRemove, diagnostico, encode, EMPTY, interestLabel, isHotel, label, orderedObjectives,
  piece, pieceNames, pieceNote, PieceId, piecesFor, planName, priceText, Selection, sideEffects, summary, togglePiece,
  uncoveredObjectives,
} from '../lib/plan';
import type { SelectionState } from '../lib/useSelection';

const T = plans.configuratorTexts;
const OCU = plans.ocupacionOtro;

type TipCtl = { open: string; setOpen: (id: string) => void };

/** Aviso «i» de un matiz: se abre y se cierra solo con el botón, Escape, al salir con el foco o al tocar fuera. */
const Tip: React.FC<{ id: string; name: string; text: string; ctl: TipCtl }> = ({ id, name, text, ctl }) => {
  const open = ctl.open === id;
  const btn = useRef<HTMLButtonElement>(null);
  return (
    <span
      className="tip"
      data-tip={id}
      onKeyDown={(e) => {
        if (e.key === 'Escape' && open) {
          ctl.setOpen('');
          btn.current?.focus();
        }
      }}
      onBlur={(e) => {
        if (open && !e.currentTarget.contains(e.relatedTarget as Node | null)) ctl.setOpen('');
      }}
    >
      <button
        ref={btn}
        type="button"
        className="tip-btn"
        aria-expanded={open}
        aria-controls={id}
        aria-label={`Qué significa el matiz de ${name}`}
        onClick={() => ctl.setOpen(open ? '' : id)}
      >
        <span aria-hidden="true">i</span>
      </button>
      <span id={id} role="note" className={open ? 'tip-text tip-text--open' : 'tip-text'}>
        {text}
      </span>
    </span>
  );
};

/** Etiqueta de una pieza dentro del plan, teniendo en cuenta el sistema de reservas. */
const PieceTag: React.FC<{ id: PieceId; sel: Selection; ctl: TipCtl; scope: string }> = ({ id, sel, ctl, scope }) => {
  const pc = piece(id);
  const tag = id === 'analiza' ? analizaState(sel) : { status: pc.status, label: undefined };
  return (
    <span className="piece-tags">
      <Tag status={tag.status}>{tag.label}</Tag>
      {pc.matiz && <Tip id={`tip-${scope}-${id}`} name={pc.name} text={pc.matiz} ctl={ctl} />}
    </span>
  );
};

const Choice: React.FC<{ pressed: boolean; onClick: () => void; children: React.ReactNode }> = ({ pressed, onClick, children }) => (
  <button type="button" className={pressed ? 'choice choice--on' : 'choice'} aria-pressed={pressed} onClick={onClick}>
    {children}
    {pressed && <Icon name="check" size={20} />}
  </button>
);

const SoonList: React.FC<{ sel: Selection; toggle: (id: string) => void }> = ({ sel, toggle }) => (
  <fieldset className="checks soon-checks">
    <legend className="h4">Aún no lo hacemos: ¿te interesa?</legend>
    <p className="small muted">{CONTACT_ON ? T.soonOn : T.soonOff}</p>
    {plans.comingSoon.map((c) => (
      <label key={c.id} className="check check--soon">
        <input type="checkbox" checked={sel.interests.includes(c.id)} onChange={() => toggle(c.id)} />
        <span>
          <strong>{c.label}</strong>
          <span className="small muted block">{c.text}</span>
        </span>
      </label>
    ))}
  </fieldset>
);

const Configurator: React.FC<{ state: SelectionState }> = ({ state }) => {
  const { sel, setSel, step, go, toggleInterest, focusSeq } = state;
  const sectionRef = useRef<HTMLElement>(null);
  const headingRef = useRef<HTMLHeadingElement>(null);
  const adjustRef = useRef<HTMLHeadingElement>(null);
  const interacted = useRef(false);
  const [copied, setCopied] = useState<'' | 'ok' | 'manual'>('');
  const [shared, setShared] = useState({ text: '', link: '' });
  const [club, setClub] = useState('');
  const [contact, setContact] = useState('');
  const [openTip, setOpenTip] = useState('');
  const [notice, setNotice] = useState<{ msg: string; undo: Selection | null }>({ msg: '', undo: null });
  // «Ajusta tu plan» abierto o cerrado lo decide quien lo usa: no se cierra solo al aparecer el nombre del plan.
  const [adjustOpen, setAdjustOpen] = useState(false);
  const ctl: TipCtl = { open: openTip, setOpen: setOpenTip };

  const hotel = isHotel(sel);
  const steps = hotel ? [1, 3, 4] : [1, 2, 3, 4];
  const pos = steps.indexOf(step) + 1;
  const progressText = sel.type ? `Paso ${pos} de ${steps.length}` : 'Paso 1';

  useEffect(() => {
    if (interacted.current) headingRef.current?.focus();
    setCopied('');
    setOpenTip('');
    setNotice({ msg: '', undo: null });
    // Sin plan al llegar al paso 4 (solo «próximamente»), las piezas disponibles se enseñan abiertas.
    setAdjustOpen(step === 4 && !planName(sel));
  }, [step]);

  // Un enlace de la página ha traído hasta aquí: se muestra el configurador y se enfoca su título.
  useEffect(() => {
    if (!focusSeq) return;
    sectionRef.current?.scrollIntoView();
    headingRef.current?.focus({ preventScroll: true });
  }, [focusSeq]);

  // Cerrar el aviso «i» al tocar fuera.
  useEffect(() => {
    if (!openTip) return;
    const onDown = (e: PointerEvent) => {
      if (!(e.target as Element).closest?.(`[data-tip="${openTip}"]`)) setOpenTip('');
    };
    document.addEventListener('pointerdown', onDown);
    return () => document.removeEventListener('pointerdown', onDown);
  }, [openTip]);

  const goStep = (n: number, s?: Selection) => {
    interacted.current = true;
    go(n, s);
  };

  const pickType = (id: string) => {
    const objectives = id === 'hotel' ? sel.objectives.filter((o) => o !== 'franjas') : sel.objectives;
    goStep(id === 'hotel' ? 3 : 2, { ...sel, type: id, booking: id === 'hotel' ? '' : sel.booking, objectives });
  };

  const toggleObjective = (id: string) => {
    const on = sel.objectives.includes(id);
    if (!on && sel.objectives.length >= plans.maxObjectives) return;
    setSel({ ...sel, objectives: on ? sel.objectives.filter((o) => o !== id) : [...sel.objectives, id] });
  };

  const showPlan = () => goStep(4, { ...sel, pieces: piecesFor(sel) });

  /** Añade o quita una pieza, avisa de los cambios que arrastra y deja el foco en un sitio estable. */
  const toggle = (p: PieceId) => {
    const next = togglePiece(sel, p);
    const had = sel.pieces.includes(p);
    const { added, removed } = sideEffects(sel, next, p);
    let msg = `${piece(p).name}: ${had ? 'quitada de' : 'añadida a'} tu plan.`;
    if (removed.length) msg += ` También sale ${pieceNames(removed)}${p === 'linkedin' ? ': la difusión de tu nota solo va en el Plan Comunicación completo' : ''}.`;
    if (added.length) msg += ` También entra ${pieceNames(added)}${p === 'nota' ? ': la difusión de tu nota solo va con el LinkedIn del club' : ''}.`;
    setNotice({ msg, undo: sel });
    setSel(next);
    setAdjustOpen(true);
    adjustRef.current?.focus();
  };

  const link = () => `${site.siteUrl}/#${encode(sel)}`;

  const copy = async () => {
    const url = link();
    const text = summary(sel, url);
    setShared({ text, link: url });
    try {
      await navigator.clipboard.writeText(text);
      setCopied('ok');
      return;
    } catch {
      // Sin portapapeles moderno (http o navegador antiguo): probamos el método clásico.
    }
    const ta = document.createElement('textarea');
    ta.value = text;
    ta.setAttribute('readonly', '');
    ta.style.position = 'fixed';
    ta.style.opacity = '0';
    document.body.appendChild(ta);
    ta.select();
    let ok = false;
    try {
      ok = document.execCommand('copy');
    } catch {
      ok = false;
    }
    ta.remove();
    setCopied(ok ? 'ok' : 'manual');
  };

  const typeLabel = label(plans.courseTypes, sel.type);
  const name = planName(sel);
  const diag = diagnostico(sel);
  const otroFranjas = sel.booking === 'otro' && sel.objectives.includes('franjas');
  const uncovered = uncoveredObjectives(sel).filter((o) => !(otroFranjas && o.id === 'franjas'));

  const mailto = () => {
    const extra = [club && `Club: ${club}`, contact && `Contacto: ${contact}`].filter(Boolean).join('\n');
    const body = `${extra ? `${extra}\n\n` : ''}${summary(sel, link())}\n\nPolítica de privacidad: ${site.siteUrl}/privacidad/`;
    return `mailto:${site.contactEmail}?subject=${encodeURIComponent(T.mailSubject + typeLabel)}&body=${encodeURIComponent(body)}`;
  };

  const measure = new Set<string>();
  const agents = new Set<string>();
  const human = new Set<string>();
  sel.pieces.forEach((p) => {
    const pc = piece(p);
    measure.add(pc.measure);
    if (pc.agents) agents.add(pc.agents);
    if (pc.human) human.add(pc.human);
  });
  if (diag) measure.add(plans.diagnostico.measure);
  agents.add('Preparan la propuesta y los recordatorios de tu comercial.');
  human.add('Tu comercial de Hades se ocupa de la relación contigo y te propone el siguiente paso cuando un dato lo justifica.');

  const addable = availablePieces(sel).filter((p) => !sel.pieces.includes(p));
  const allRemoved = !sel.pieces.length && piecesFor(sel).length > 0;
  const heading = name ?? (allRemoved ? 'Tu plan está vacío' : CONTACT_ON ? 'Tu Radiografía gratuita' : 'Lo que te interesa');

  const ctaBox = (
    <div className="cta-box">
      <h4>{CONTACT_ON ? T.ctaOn : T.ctaOff}</h4>
      {CONTACT_ON ? (
        <>
          <div className="form-row">
            <label htmlFor="cfg-club">Nombre del club (opcional)</label>
            <input id="cfg-club" type="text" value={club} onChange={(e) => setClub(e.target.value)} autoComplete="organization" />
          </div>
          <div className="form-row">
            <label htmlFor="cfg-contacto">Persona de contacto y teléfono (opcional)</label>
            <input id="cfg-contacto" type="text" value={contact} onChange={(e) => setContact(e.target.value)} autoComplete="name" />
          </div>
          <a className="btn btn--big btn--block" href={mailto()}>{T.ctaOn}</a>
          <p className="small">
            Se abre tu programa de correo con el resumen ya escrito, dirigido a <strong>{site.contactEmail}</strong>. Nada se envía
            hasta que tú lo mandes. <a href="/privacidad/">Política de privacidad</a>.
          </p>
        </>
      ) : (
        <>
          <p className="small">{T.visitOnly}</p>
          <p className="small">{T.ctaOffHelp}</p>
          <button type="button" className="btn btn--big btn--block" onClick={copy}>
            <Icon name="copy" size={20} /> {T.copy}
          </button>
        </>
      )}
      <p className={copied ? 'small copy-status' : 'small'} role="status" aria-live="polite">
        {copied === 'ok' && (
          <>
            <Icon name="check" size={18} /> Plan copiado: el resumen y el enlace. Pégalo donde quieras.
          </>
        )}
        {copied === 'manual' && 'No hemos podido copiarlo solo: selecciona el texto de abajo y cópialo.'}
      </p>
      {copied === 'manual' && (
        <div className="form-row">
          <label htmlFor="cfg-text">Resumen de tu plan</label>
          <textarea id="cfg-text" readOnly rows={7} value={shared.text} onFocus={(e) => e.currentTarget.select()} />
        </div>
      )}
      {copied && (
        <details className="disclosure link-disclosure" open={copied === 'manual' ? true : undefined}>
          <summary>Ver enlace</summary>
          <div className="form-row">
            <label htmlFor="cfg-link">Enlace de tu plan</label>
            <input id="cfg-link" type="text" readOnly value={shared.link} onFocus={(e) => e.currentTarget.select()} />
          </div>
        </details>
      )}
    </div>
  );

  return (
    <section id="configurador" ref={sectionRef} className="section section--sand" aria-labelledby="configurador-title">
      <div className="wrap narrow">
        <p className="eyebrow">Configurador</p>
        <h2 id="configurador-title">Arma tu plan según tu objetivo</h2>
        <p className="lead">{T.intro}</p>

        <div className="config">
          <div className="progress-wrap">
            <p className="small muted" id="progreso-txt">{progressText}</p>
            <div
              className="progress"
              role="progressbar"
              aria-labelledby="progreso-txt"
              aria-valuemin={1}
              aria-valuemax={steps.length}
              aria-valuenow={pos}
              aria-valuetext={progressText}
            >
              <span style={{ width: `${(pos / steps.length) * 100}%` }} />
            </div>
          </div>

          {step === 1 && (
            <div>
              <h3 ref={headingRef} tabIndex={-1}>¿Qué tipo de campo es?</h3>
              {sel.objectives.length > 0 && !sel.type && (
                <p className="small muted">
                  Ya tienes marcado: {sel.objectives.map((o) => label(plans.objectives, o)).join(' · ')}.
                </p>
              )}
              <div className="choices">
                {plans.courseTypes.map((t) => (
                  <Choice key={t.id} pressed={sel.type === t.id} onClick={() => pickType(t.id)}>
                    {t.label}
                  </Choice>
                ))}
              </div>
            </div>
          )}

          {step === 2 && (
            <div>
              <h3 ref={headingRef} tabIndex={-1}>¿Qué sistema de reservas usas?</h3>
              <div className="choices">
                {plans.bookingSystems.map((b) => (
                  <Choice key={b.id} pressed={sel.booking === b.id} onClick={() => goStep(3, { ...sel, booking: b.id })}>
                    {b.label}
                  </Choice>
                ))}
              </div>
              <div className="config-nav">
                <button type="button" className="btn btn--ghost" onClick={() => goStep(1)}>Atrás</button>
              </div>
            </div>
          )}

          {step === 3 && (
            <div>
              <h3 ref={headingRef} tabIndex={-1}>¿Qué quieres conseguir? (hasta 3)</h3>
              <fieldset className="checks">
                <legend className="sr-only">Objetivos disponibles, elige hasta 3</legend>
                {orderedObjectives(sel.type).map((o) => {
                  const on = sel.objectives.includes(o.id);
                  const full = !on && sel.objectives.length >= plans.maxObjectives;
                  return (
                    <label key={o.id} className={full ? 'check check--off' : 'check'}>
                      <input type="checkbox" checked={on} disabled={full} onChange={() => toggleObjective(o.id)} />
                      <span>
                        {o.label}
                        {o.id === 'franjas' && sel.booking === 'otro' && (
                          <span className="small muted block">{OCU.text} Te enseñamos lo que sí podemos hacer.</span>
                        )}
                      </span>
                    </label>
                  );
                })}
              </fieldset>
              <p className="small muted" aria-live="polite">
                {sel.objectives.length >= plans.maxObjectives ? 'Ya tienes 3 objetivos. Quita uno para elegir otro.' : ''}
              </p>
              <SoonList sel={sel} toggle={toggleInterest} />
              <div className="config-nav">
                <button type="button" className="btn btn--ghost" onClick={() => goStep(hotel ? 1 : 2)}>Atrás</button>
                <button type="button" className="btn" disabled={!sel.objectives.length && !sel.interests.length} onClick={showPlan}>
                  Ver mi plan
                </button>
              </div>
            </div>
          )}

          {step === 4 && (
            <div>
              <p className="small muted plan-context">
                {typeLabel}
                {sel.booking && ` · ${label(plans.bookingSystems, sel.booking)}`}
              </p>
              <h3 ref={headingRef} tabIndex={-1}>{heading}</h3>

              {!name && !allRemoved && <p>{plans.rules.onlySoon}</p>}
              {allRemoved && (
                <>
                  <p>{plans.rules.allRemoved}</p>
                  <button
                    type="button"
                    className="btn"
                    onClick={() => {
                      setSel({ ...sel, pieces: piecesFor(sel) });
                      setNotice({ msg: 'Plan recuperado.', undo: null });
                      headingRef.current?.focus();
                    }}
                  >
                    Recuperar mi plan
                  </button>
                </>
              )}

              {sel.pieces.length > 0 && (
                <div className="plan-summary">
                  <ul className="chips" aria-label="Piezas de tu plan">
                    {sel.pieces.map((p) => (
                      <li key={p} className="chip">{piece(p).name}</li>
                    ))}
                    {diag && <li className="chip chip--soft">{plans.diagnostico.name}{diag === 'incluido' ? ' (incluido)' : ''}</li>}
                  </ul>
                  <p className={SHOW_PRICES ? 'price' : 'price price--hidden'}>{priceText(sel)}</p>
                  <p className="small muted">
                    {SHOW_PRICES && PRICES ? `${PRICES.discounts} ` : ''}
                    {NO_ONLINE}
                  </p>
                </div>
              )}

              {otroFranjas && (
                <div className="soft-note">
                  <p className="small">
                    <strong>Ocupación por franjas.</strong> {OCU.text}
                  </p>
                  <label className="check check--inline">
                    <input type="checkbox" checked={sel.interests.includes(OCU.id)} onChange={() => toggleInterest(OCU.id)} />
                    <span>Me interesa para mi programa de reservas</span>
                  </label>
                </div>
              )}

              {uncovered.length > 0 && sel.pieces.length > 0 && (
                <p className="small muted">
                  Sin pieza en tu plan ahora mismo: {uncovered.map((o) => o.label).join(' · ')}.
                </p>
              )}

              {sel.interests.length > 0 && (
                <p className="small">
                  Te interesa (aún no disponible): {sel.interests.map(interestLabel).join(' · ')}.{' '}
                  <button type="button" className="text-btn" onClick={() => goStep(3)}>Cambiar</button>
                </p>
              )}

              {ctaBox}

              {sel.pieces.length > 0 && (
                <details className="disclosure">
                  <summary>Qué incluye tu plan</summary>
                  <ul className="pieces">
                    {sel.pieces.map((p) => (
                      <li key={p} className="piece">
                        <div className="piece-head">
                          <strong>{piece(p).name}</strong>
                          <PieceTag id={p} sel={sel} ctl={ctl} scope="plan" />
                        </div>
                        <p className="small">{piece(p).text}</p>
                        {pieceNote(p) && <p className="small muted">{pieceNote(p)}</p>}
                      </li>
                    ))}
                    {diag && (
                      <li className="piece">
                        <div className="piece-head">
                          <strong>{plans.diagnostico.name}</strong>
                          <span className="piece-tags">
                            <Tag status={plans.diagnostico.status} />
                            <Tip id="tip-plan-diagnostico" name={plans.diagnostico.name} text={plans.diagnostico.matiz} ctl={ctl} />
                          </span>
                        </div>
                        <p className="small">{diag === 'incluido' ? plans.diagnostico.includedText : plans.diagnostico.setupText}</p>
                        {SHOW_PRICES && diag === 'inicio' && <p className="small muted">{PRICES!.diagnosticoSetup} € de inicio</p>}
                      </li>
                    )}
                  </ul>
                  <div className="grid-3 tight">
                    <div>
                      <h4>Qué medimos</h4>
                      <ul>{[...measure].map((m) => <li key={m}>{m}</li>)}</ul>
                    </div>
                    <div>
                      <h4>Qué hacen los agentes</h4>
                      <ul>{[...agents].map((m) => <li key={m}>{m}</li>)}</ul>
                    </div>
                    <div>
                      <h4>Qué hace una persona</h4>
                      <ul>{[...human].map((m) => <li key={m}>{m}</li>)}</ul>
                    </div>
                  </div>
                </details>
              )}

              <details className="disclosure" open={adjustOpen} onToggle={(e) => setAdjustOpen(e.currentTarget.open)}>
                <summary>{name ? 'Ajusta tu plan' : 'Empieza con una pieza disponible'}</summary>
                <h4 ref={adjustRef} tabIndex={-1} className="adjust-title">Piezas</h4>
                <p className="small" role="status" aria-live="polite">
                  {notice.msg}
                  {notice.undo && (
                    <>
                      {' '}
                      <button
                        type="button"
                        className="text-btn"
                        onClick={() => {
                          setSel(notice.undo!);
                          setNotice({ msg: 'Cambio deshecho.', undo: null });
                          adjustRef.current?.focus();
                        }}
                      >
                        Deshacer
                      </button>
                    </>
                  )}
                </p>
                {sel.pieces.length > 0 && (
                  <ul className="add-list">
                    {sel.pieces.map((p) => (
                      <li key={p}>
                        <span className="add-name">
                          <Icon name="check" size={18} /> {piece(p).name}
                        </span>
                        {canRemove(sel, p) ? (
                          <button type="button" className="btn btn--small btn--quiet" onClick={() => toggle(p)}>
                            Quitar <span className="sr-only">{piece(p).name}</span>
                          </button>
                        ) : (
                          <span className="small muted">{plans.rules.lastVisibility}</span>
                        )}
                      </li>
                    ))}
                  </ul>
                )}
                {addable.length > 0 && (
                  <ul className="add-list">
                    {addable.map((p) => (
                      <li key={p}>
                        <span className="add-name">
                          {piece(p).name} <PieceTag id={p} sel={sel} ctl={ctl} scope="add" />
                        </span>
                        <button type="button" className="btn btn--small btn--ghost" onClick={() => toggle(p)}>
                          Añadir <span className="sr-only">{piece(p).name}</span>
                        </button>
                      </li>
                    ))}
                  </ul>
                )}
                <p className="small muted">
                  Visibilidad competitiva sustituye a Visibilidad en IA. La difusión de tu nota solo va dentro del Plan Comunicación
                  completo, con el LinkedIn del club.
                </p>
              </details>

              <div className="config-nav">
                <button type="button" className="btn btn--ghost" onClick={() => goStep(3)}>Cambiar objetivos</button>
                <button
                  type="button"
                  className="btn btn--ghost"
                  onClick={() => {
                    setShared({ text: '', link: '' });
                    goStep(1, EMPTY);
                  }}
                >
                  Empezar de nuevo
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </section>
  );
};

export default Configurator;

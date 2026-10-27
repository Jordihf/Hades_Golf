import React, { useEffect, useRef, useState } from 'react';
import { DISCOUNTS, PRODUCTS, Product, ProductId, SHELVES, Variant, variantOf } from '../data/catalog';
import { MAX_QTY, PricedLine, add, clear, has, headline, lineOf, planLink, remove, sellerName, setPay, setQty, summary, totals } from '../lib/cart';
import { euros, eur } from '../lib/money';
import { CONTACT_ON } from '../lib/flags';
import { OPEN_PLAN, planStore, usePlan } from '../lib/store';
import site from '../data/site.json';
import Icon from './Icon';
import Photo from './Photo';

const unitText = (v: Variant) =>
  v.billing === 'mensual' ? '/mes' : v.billing === 'gratis' ? '' : v.unit ? `por ${v.unit.one}` : 'pago único';

// ── Ficha de producto

export const ProductCard: React.FC<{ p: Product; tone: string }> = ({ p, tone }) => {
  const { cart } = usePlan();
  const inPlan = has(cart, p.id);
  const [localV, setLocalV] = useState(p.variants[0].id);
  const current = variantOf(p, lineOf(cart, p.id)?.v ?? localV);

  const choose = (vid: string) => {
    setLocalV(vid);
    if (inPlan) planStore.apply(add(cart, p.id, vid));
  };
  const toggle = () => planStore.apply(inPlan ? remove(cart, p.id) : add(cart, p.id, current.id));
  const titleId = `p-${p.id}`;

  return (
    <article className={`card tone-${tone}${inPlan ? ' card--in' : ''}`} aria-labelledby={titleId}>
      <div className="card-top">
        <div className="dots dots--card" aria-hidden="true" />
        <div className="card-tags">
          <span className={p.status === 'reserva' ? 'status status--reserva' : 'status'}>
            {p.status === 'reserva' ? 'Reserva' : 'Disponible'}
          </span>
        </div>
        <span className="card-icon" aria-hidden="true">
          <Icon name={p.icon} size={30} />
        </span>
        <h3 id={titleId} className="card-title">
          {p.name}
        </h3>
        {inPlan && (
          <span className="stamp" aria-hidden="true">
            En tu plan
          </span>
        )}
      </div>
      <div className="card-body">
        <p className="card-line">{p.line}</p>
        {p.variants.length > 1 && (
          <div className="seg seg--card" role="group" aria-label={`Opciones de ${p.name}`}>
            {p.variants.map((v) => (
              <button key={v.id} type="button" aria-pressed={current.id === v.id} onClick={() => choose(v.id)}>
                {v.label}
              </button>
            ))}
          </div>
        )}
        <div className="card-buy">
          {p.badge && <span className="badge badge--body">{p.badge}</span>}
          <div className="price">
            <span className="price-num">{eur(current.price)}</span>
            <span className="price-unit">{unitText(current)}</span>
            {current.note && <span className="price-note">{current.note}</span>}
          </div>
          {(p.smallNote || p.status === 'reserva') && (
            <p className="card-mini">
              {p.smallNote}
              {p.smallNote && p.status === 'reserva' ? ' · ' : ''}
              {p.status === 'reserva' && 'Sin cargo hasta el lanzamiento'}
            </p>
          )}
          <button
            type="button"
            className={inPlan ? 'pill pill--block pill--outline' : 'pill pill--block pill--green'}
            onClick={toggle}
            aria-pressed={inPlan}
            aria-label={inPlan ? `Quitar ${p.name} de tu plan` : `Añadir ${p.name} a tu plan`}
          >
            {inPlan ? (
              <>
                <Icon name="check" size={18} /> En tu plan · Quitar
              </>
            ) : (
              <>
                {p.status === 'reserva' ? 'Reservar' : 'Añadir al plan'} <Icon name="plus" size={18} />
              </>
            )}
          </button>
        </div>
      </div>
    </article>
  );
};

// ── Gancho gratis

export const FreeCard: React.FC = () => {
  const { cart } = usePlan();
  const p = PRODUCTS[0];
  const inPlan = has(cart, p.id);
  return (
    <div className={`free${inPlan ? ' free--in' : ''}`}>
      <div className="dots dots--free" aria-hidden="true" />
      <div className="free-num" aria-hidden="true">
        0<span>€</span>
      </div>
      <div className="free-text">
        <p className="kicker kicker--lime">Gratis · Empieza aquí</p>
        <h3 className="free-title">{p.name}</h3>
        <p>{p.line}</p>
      </div>
      <div className="free-actions">
        <button
          type="button"
          className={inPlan ? 'pill pill--outline-light' : 'pill pill--lime'}
          aria-pressed={inPlan}
          onClick={() => planStore.apply(inPlan ? remove(cart, p.id) : add(cart, p.id))}
        >
          {inPlan ? (
            <>
              <Icon name="check" size={18} /> En tu plan · Quitar
            </>
          ) : (
            <>
              Añadir gratis <Icon name="plus" size={18} />
            </>
          )}
        </button>
        <a className="link-light" href="/radiografia/">
          Ver un ejemplo <Icon name="arrow" size={16} />
        </a>
      </div>
    </div>
  );
};

// ── Panel «Tu plan»

const PlanLine: React.FC<{ l: PricedLine }> = ({ l }) => {
  const { cart } = usePlan();
  const { product: p, variant: v } = l;
  const multi = p.variants.length > 1;
  return (
    <li className="pl">
      <div className="pl-main">
        <span className="pl-name">{p.name}</span>
        {multi && <span className="pl-var">{v.label}</span>}
        {v.unit && (
          <span className="qty" role="group" aria-label={`Número de ${v.unit.many}`}>
            <button
              type="button"
              aria-label={`Un ${v.unit.one} menos`}
              disabled={l.line.q <= 1}
              onClick={() => planStore.setCart(setQty(cart, p.id, l.line.q - 1))}
            >
              <Icon name="minus" size={16} />
            </button>
            <span aria-live="polite">
              {l.line.q} {l.line.q === 1 ? v.unit.one : v.unit.many}
            </span>
            <button
              type="button"
              aria-label={`Un ${v.unit.one} más`}
              disabled={l.line.q >= MAX_QTY}
              onClick={() => planStore.setCart(setQty(cart, p.id, l.line.q + 1))}
            >
              <Icon name="plus" size={16} />
            </button>
          </span>
        )}
      </div>
      <span className="pl-price">
        {v.billing === 'gratis' ? 'Gratis' : euros(l.amount)}
        {v.billing === 'mensual' && <small>/mes</small>}
      </span>
      <button type="button" className="pl-x" aria-label={`Quitar ${p.name}`} onClick={() => planStore.apply(remove(cart, p.id))}>
        <Icon name="x" size={18} />
      </button>
    </li>
  );
};

const Group: React.FC<{ title: string; lines: PricedLine[]; note?: string }> = ({ title, lines, note }) =>
  lines.length ? (
    <div className="pg">
      <p className="pg-title">
        {title}
        {note && <span>{note}</span>}
      </p>
      <ul>
        {lines.map((l) => (
          <PlanLine key={l.line.id} l={l} />
        ))}
      </ul>
    </div>
  ) : null;

type Copied = 'idle' | 'ok' | 'manual';

export const PlanPanel: React.FC = () => {
  const { cart, pulse } = usePlan();
  const t = totals(cart);
  const h = headline(t);
  const [open, setOpen] = useState(false);
  const [copied, setCopied] = useState<Copied>('idle');
  const [manual, setManual] = useState('');
  const [seller, setSeller] = useState<string | null>(null);
  const [search, setSearch] = useState('');
  const panelRef = useRef<HTMLElement>(null);
  const closeRef = useRef<HTMLButtonElement>(null);
  const headRef = useRef<HTMLHeadingElement>(null);

  useEffect(() => {
    setSeller(sellerName(window.location.search));
    setSearch(window.location.search);
    const onOpen = () => {
      if (window.matchMedia('(min-width: 1080px)').matches) {
        document.getElementById('tienda')?.scrollIntoView({ behavior: 'smooth', block: 'start' });
        headRef.current?.focus({ preventScroll: true });
      } else {
        setOpen(true);
      }
    };
    window.addEventListener(OPEN_PLAN, onOpen);
    return () => window.removeEventListener(OPEN_PLAN, onOpen);
  }, []);

  // Panel a pantalla completa en móvil: Escape cierra, el fondo no se desplaza y el foco vuelve.
  useEffect(() => {
    if (!open) return;
    const prev = document.activeElement as HTMLElement | null;
    document.documentElement.classList.add('lock');
    closeRef.current?.focus();
    const onKey = (e: KeyboardEvent) => e.key === 'Escape' && setOpen(false);
    window.addEventListener('keydown', onKey);
    return () => {
      document.documentElement.classList.remove('lock');
      window.removeEventListener('keydown', onKey);
      prev?.focus?.();
    };
  }, [open]);

  useEffect(() => setCopied('idle'), [cart]);

  const link = planLink(site.siteUrl, cart, search);
  const text = summary(cart, link, seller);

  const copy = async () => {
    try {
      await navigator.clipboard.writeText(text);
      setCopied('ok');
      return;
    } catch {
      // Sin portapapeles moderno: probamos el método clásico y, si falla, enseñamos el texto para copiarlo a mano.
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
    setManual(ok ? '' : text);
    setCopied(ok ? 'ok' : 'manual');
  };

  const mailto = () => {
    const cc = (site as { contactCc?: string }).contactCc;
    const q = [`subject=${encodeURIComponent('Propuesta Hades Golf')}`, cc ? `cc=${encodeURIComponent(cc)}` : '', `body=${encodeURIComponent(text)}`]
      .filter(Boolean)
      .join('&');
    return `mailto:${site.contactEmail}?${q}`;
  };

  const missingForPack = DISCOUNTS.packMin - t.packCount;

  return (
    <>
      <aside
        ref={panelRef}
        id="plan"
        className={`plan${open ? ' plan--open' : ''}`}
        aria-labelledby="plan-title"
        role={open ? 'dialog' : undefined}
        aria-modal={open ? true : undefined}
      >
        <div className="plan-head">
          <h2 id="plan-title" className="plan-title" tabIndex={-1} ref={headRef}>
            Tu plan <span className="plan-count" key={pulse}>{t.count}</span>
          </h2>
          {t.count > 0 && (
            <button type="button" className="text-btn" onClick={() => planStore.apply(clear(cart))}>
              Vaciar
            </button>
          )}
          <button type="button" className="plan-close" ref={closeRef} onClick={() => setOpen(false)}>
            <Icon name="x" size={20} /> <span>Cerrar</span>
          </button>
        </div>

        <div className="seg seg--pay" role="group" aria-label="Modalidad de pago">
          {(['mensual', 'anual'] as const).map((p) => (
            <button key={p} type="button" aria-pressed={cart.pay === p} onClick={() => planStore.setCart(setPay(cart, p))}>
              {p === 'mensual' ? 'Mensual' : (
                <>
                  Anual <em>−{DISCOUNTS.annualPct}{' '}%</em>
                </>
              )}
            </button>
          ))}
        </div>

        <div className="plan-body">
          {t.count === 0 ? (
            <div className="plan-empty">
              <Icon name="bag" size={34} />
              <p>
                <strong>Tu plan está vacío.</strong> Añade productos y verás el total al momento.
              </p>
            </div>
          ) : (
            <>
              <Group title="Cuotas mensuales" lines={t.monthlyLines} />
              <Group title="Pagos únicos" lines={t.onceLines} />
              <Group title="Reserva" note="sin cargo hasta el lanzamiento" lines={t.reservedLines} />
              <Group title="Gratis" lines={t.freeLines} />
            </>
          )}
        </div>

        <div className="plan-foot">
          <div className="dots dots--foot" aria-hidden="true" />
          <dl className="plan-rows">
            {t.annualDiscount > 0 && (
              <div>
                <dt>Descuento anual −{DISCOUNTS.annualPct}{' '}%</dt>
                <dd>{euros(-t.annualDiscount)}/mes</dd>
              </div>
            )}
            {t.packApplies ? (
              <div>
                <dt>Descuento pack −{DISCOUNTS.packPct}{' '}%</dt>
                <dd>{euros(-t.packDiscount)}/mes</dd>
              </div>
            ) : (
              t.packCount > 0 && (
                <div className="hint">
                  <dt>
                    Añade {missingForPack} {missingForPack === 1 ? 'cuota mensual más' : 'cuotas mensuales más'} y ahorra un{' '}
                    {DISCOUNTS.packPct}{' '}%
                  </dt>
                </div>
              )
            )}
            {t.monthly > 0 && t.once > 0 && (
              <div>
                <dt>Pagos únicos</dt>
                <dd>{euros(t.once)}</dd>
              </div>
            )}
            {t.reservedMonthly > 0 && (
              <div>
                <dt>Reserva, desde el lanzamiento</dt>
                <dd>{euros(t.reservedMonthly)}/mes</dd>
              </div>
            )}
          </dl>
          <div className="plan-total" aria-live="polite" aria-atomic="true">
            <span className="plan-total-label">{h.label}</span>
            <span className="plan-total-num" key={h.value}>
              {h.value}
              {h.unit && <small>{h.unit}</small>}
            </span>
            {cart.pay === 'anual' && t.yearBilled > 0 && (
              <span className="plan-year">{euros(t.yearBilled)} facturado una vez al año</span>
            )}
          </div>
          {t.yearSaving > 0 && <p className="save">Ahorras al año {euros(t.yearSaving)}</p>}
          {cart.pay === 'mensual' && t.discountableBase > 0 && (
            <button type="button" className="save save--btn" onClick={() => planStore.setCart(setPay(cart, 'anual'))}>
              Pásate a anual y ahorra {euros(t.annualSavingIfSwitch)} al año
            </button>
          )}
          {CONTACT_ON ? (
            <a className="pill pill--lime pill--block pill--big" href={mailto()}>
              Pedir propuesta <Icon name="arrow" size={18} />
            </a>
          ) : (
            <button type="button" className="pill pill--lime pill--block pill--big" onClick={copy} disabled={t.count === 0}>
              <Icon name={copied === 'ok' ? 'check' : 'copy'} size={18} /> {copied === 'ok' ? 'Plan copiado' : 'Copiar mi plan'}
            </button>
          )}
          <p className="plan-help" aria-live="polite">
            {copied === 'ok'
              ? 'Pégalo en un correo o en WhatsApp para tu comercial. El enlace reabre tu plan.'
              : seller
                ? `Propuesta preparada con ${seller} (Hades Golf).`
                : 'Tu comercial de Hades te lo presenta en la visita.'}
          </p>
          {copied === 'manual' && (
            <label className="manual">
              <span>Tu navegador no deja copiar solo. Selecciona y copia este texto:</span>
              <textarea readOnly value={manual} rows={6} onFocus={(e) => e.currentTarget.select()} />
            </label>
          )}
        </div>
      </aside>

      <MobileBar total={h} count={t.count} onOpen={() => setOpen(true)} open={open} />
    </>
  );
};

const MobileBar: React.FC<{ total: ReturnType<typeof headline>; count: number; onOpen: () => void; open: boolean }> = ({
  total,
  count,
  onOpen,
  open,
}) => (
  <div className={`mbar${count > 0 && !open ? ' mbar--on' : ''}`} aria-hidden={count === 0 || open}>
    <button type="button" className="mbar-btn" onClick={onOpen} tabIndex={count === 0 || open ? -1 : 0}>
      <span className="mbar-l">
        <span className="mbar-k">
          Tu plan · {count} {count === 1 ? 'producto' : 'productos'}
        </span>
        <span className="mbar-v">
          {total.value}
          {total.unit && <small> {total.unit}</small>}
        </span>
      </span>
      <span className="mbar-cta">
        Ver plan <Icon name="arrow" size={18} />
      </span>
    </button>
  </div>
);

// ── Aviso (sustituciones, dependencias, deshacer)

export const Toast: React.FC = () => {
  const { notice } = usePlan();
  const [shown, setShown] = useState<number | null>(null);
  useEffect(() => {
    if (!notice) return;
    setShown(notice.id);
    const ms = notice.undo && notice.msg.includes(':') ? 7000 : 3200;
    const id = window.setTimeout(() => setShown((s) => (s === notice.id ? null : s)), notice.undo ? Math.max(ms, 6000) : ms);
    return () => window.clearTimeout(id);
  }, [notice]);
  const visible = notice && shown === notice.id;
  return (
    <div className={`toast${visible ? ' toast--on' : ''}`} role="status" aria-live="polite" aria-atomic="true">
      {visible && notice && (
        <>
          <span>{notice.msg}</span>
          {notice.undo && (
            <button
              type="button"
              onClick={() => {
                planStore.setCart(notice.undo!);
                planStore.dismiss();
              }}
            >
              Deshacer
            </button>
          )}
        </>
      )}
    </div>
  );
};

// ── Tienda completa

const Shop: React.FC = () => (
  <section className="shop" id="tienda" aria-labelledby="tienda-title" tabIndex={-1}>
    <div className="wrap">
      <div className="shop-head">
        <div>
          <p className="kicker">La tienda</p>
          <h2 id="tienda-title" className="display display--xl">
            Elige. Suma.
            <br />
            <span className="hl">Vende más.</span>
          </h2>
        </div>
        <p className="shop-intro">
          Añade productos a tu plan y mira el total al momento. Con pago anual, −{DISCOUNTS.annualPct}{' '}%. Con 3 cuotas o más, −{DISCOUNTS.packPct}{' '}% extra.
        </p>
      </div>
      <div className="shop-grid">
        <div className="shop-main">
          <FreeCard />
          {SHELVES.map((s) => (
            <section key={s.id} className="shelf" id={s.id} aria-labelledby={`shelf-${s.id}`} tabIndex={-1}>
              <div className="shelf-banner">
                <Photo slot={s.photo} alt="" className="fill" sizes="(min-width: 1080px) 62vw, 100vw" />
                <div className="slide-shade" aria-hidden="true" />
                <div className="shelf-copy">
                  <p className="kicker kicker--lime">{s.kicker}</p>
                  <h3 id={`shelf-${s.id}`} className="display display--lg">
                    {s.title}
                  </h3>
                  <p className="shelf-sub">{s.sub}</p>
                </div>
              </div>
              <div className="cards">
                {PRODUCTS.filter((p) => p.shelf === s.id).map((p) => (
                  <ProductCard key={p.id} p={p} tone={s.tone} />
                ))}
              </div>
            </section>
          ))}
        </div>
        <PlanPanel />
      </div>
    </div>
    <Toast />
  </section>
);

export const AddButton: React.FC<{ id: ProductId; light?: boolean }> = ({ id, light }) => {
  const { cart } = usePlan();
  const p = PRODUCTS.find((x) => x.id === id)!;
  const inPlan = has(cart, id);
  return (
    <button
      type="button"
      className={inPlan ? `pill ${light ? 'pill--outline-light' : 'pill--outline'}` : 'pill pill--lime'}
      aria-pressed={inPlan}
      onClick={() => planStore.apply(inPlan ? remove(cart, id) : add(cart, id))}
    >
      {inPlan ? <Icon name="check" size={18} /> : <Icon name="plus" size={18} />}
      {p.short ?? p.name} · {eur(p.variants[0].price)}
      {p.variants[0].billing === 'mensual' ? '/mes' : ''}
    </button>
  );
};

export default Shop;

"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { ledgerFonts } from "@/app/fonts";
import { VersionBar } from "@/components/VersionBar";
import { categories, formatPrice, hawker, hawkerVersions, type MenuItem } from "@/content/hawker";
import { formatTime, openStatus } from "@/lib/openingHours";
import { whatsAppUrl } from "@/lib/orderLinks";
import {
  buildOrderMessage,
  itemCount,
  lineTotal,
  orderTotal,
  type FulfilmentMethod,
  type OrderLine,
} from "@/lib/orderMessage";
import { cx } from "@/lib/utils";
import { DemoBar } from "../DemoBar";
import s from "./advanced.module.css";

type Lang = "en" | "zh";
type CategoryKey = (typeof categories)[number]["key"];
type Cart = Record<string, number>;

const CART_KEY = "hawker-demo-cart";
const LANG_KEY = "hawker-demo-lang";

const en = {
  langToggle: "中文",
  openNow: "Open now",
  closed: "Closed",
  closesAt: "closes",
  opensAt: "opens",
  checking: "Checking hours…",
  hours: "Hours",
  rating: "Rated",
  price: "Spend",
  share: "Share",
  linkCopied: "Link copied",
  directions: "Directions",
  orderGrab: "Order on GrabFood",
  menu: "Menu",
  menuHint: "Add what you want, then send the chit to us on WhatsApp.",
  add: "Add",
  remove: "Remove one",
  yourOrder: "Your chit",
  empty: "Nothing on the chit yet.",
  total: "Total",
  pickup: "Self pick-up",
  delivery: "Delivery",
  noteLabel: "Pick-up time, address or notes",
  notePlaceholder: "e.g. Pick up at 8 pm, less spicy",
  send: "Send order on WhatsApp",
  whatsappMissing: "WhatsApp number not set",
  orGrab: "Prefer Grab delivery?",
  clear: "Clear chit",
  review: "Review chit",
  items: (n: number) => `${n} item${n === 1 ? "" : "s"}`,
  findUs: "Find us",
  messageIntro: "Hi! I'd like to order from {shop}:",
  messageNote: "Note",
};

const zh: typeof en = {
  langToggle: "EN",
  openNow: "营业中",
  closed: "休息中",
  closesAt: "打烊",
  opensAt: "开档",
  checking: "查看营业时间…",
  hours: "营业时间",
  rating: "评分",
  price: "人均",
  share: "分享",
  linkCopied: "链接已复制",
  directions: "导航",
  orderGrab: "GrabFood 下单",
  menu: "菜单",
  menuHint: "选好餐点，再通过 WhatsApp 把单子发给我们。",
  add: "加入",
  remove: "减少一份",
  yourOrder: "我的单子",
  empty: "单子还是空的。",
  total: "总计",
  pickup: "自取",
  delivery: "外送",
  noteLabel: "自取时间、地址或备注",
  notePlaceholder: "例：晚上8点自取，少辣",
  send: "通过 WhatsApp 发送订单",
  whatsappMissing: "尚未设置 WhatsApp 号码",
  orGrab: "想用 Grab 外送？",
  clear: "清空单子",
  review: "查看单子",
  items: (n: number) => `${n} 份`,
  findUs: "店铺位置",
  messageIntro: "你好！我想在 {shop} 点餐：",
  messageNote: "备注",
};

const copy = { en, zh };

function readStorage<T>(key: string, fallback: T): T {
  try {
    const raw = localStorage.getItem(key);
    return raw ? (JSON.parse(raw) as T) : fallback;
  } catch {
    return fallback;
  }
}

function writeStorage(key: string, value: unknown) {
  try {
    localStorage.setItem(key, JSON.stringify(value));
  } catch {}
}

// Advanced demo, "order chit" edition: the menu is a ruled bill, the order panel is a receipt.
export function HawkerAdvanced() {
  const [lang, setLang] = useState<Lang>("en");
  const [category, setCategory] = useState<CategoryKey>("all");
  const [cart, setCart] = useState<Cart>({});
  const [method, setMethod] = useState<FulfilmentMethod>("pickup");
  const [note, setNote] = useState("");
  const [loaded, setLoaded] = useState(false);
  const [status, setStatus] = useState<ReturnType<typeof openStatus> | null>(null);
  const [toast, setToast] = useState<string | null>(null);
  const toastTimer = useRef<number | undefined>(undefined);
  const t = copy[lang];

  useEffect(() => {
    setLang(readStorage<Lang>(LANG_KEY, "en"));
    setCart(readStorage<Cart>(CART_KEY, {}));
    setLoaded(true);
  }, []);
  useEffect(() => {
    if (loaded) writeStorage(LANG_KEY, lang);
  }, [lang, loaded]);
  useEffect(() => {
    if (loaded) writeStorage(CART_KEY, cart);
  }, [cart, loaded]);

  useEffect(() => {
    const update = () => setStatus(openStatus(hawker.openingHours, new Date(), hawker.timeZone));
    update();
    const timer = window.setInterval(update, 60_000);
    return () => window.clearInterval(timer);
  }, []);

  const showToast = useCallback((message: string) => {
    setToast(message);
    window.clearTimeout(toastTimer.current);
    toastTimer.current = window.setTimeout(() => setToast(null), 2000);
  }, []);

  const changeQty = (id: string, delta: number) =>
    setCart((current) => {
      const qty = Math.max(0, Math.min(99, (current[id] ?? 0) + delta));
      const next = { ...current };
      if (qty === 0) delete next[id];
      else next[id] = qty;
      return next;
    });

  const lines: OrderLine[] = useMemo(
    () =>
      hawker.menu
        .filter((item) => cart[item.id])
        .map((item) => ({ name: item.name, nameZh: item.nameZh, price: item.price, qty: cart[item.id] })),
    [cart],
  );
  const count = itemCount(lines);
  const total = orderTotal(lines);

  const orderUrl = useMemo(() => {
    if (!lines.length) return null;
    const message = buildOrderMessage({
      shopName: hawker.name,
      lines,
      method,
      note,
      labels: { intro: t.messageIntro, total: t.total, pickup: t.pickup, delivery: t.delivery, note: t.messageNote },
    });
    return whatsAppUrl(hawker.order.whatsapp.phone, message);
  }, [lines, method, note, t]);
  const whatsappConfigured = Boolean(whatsAppUrl(hawker.order.whatsapp.phone));

  const share = async () => {
    const url = window.location.href;
    try {
      if (navigator.share) {
        await navigator.share({ title: hawker.name, url });
        return;
      }
      await navigator.clipboard.writeText(url);
      showToast(t.linkCopied);
    } catch {
      // Share sheet dismissed or clipboard blocked: nothing to do.
    }
  };

  const visibleItems = hawker.menu.filter((item) => category === "all" || item.category === category);
  const primaryName = (item: MenuItem) => (lang === "zh" ? item.nameZh : item.name);
  const secondaryName = (item: MenuItem) => (lang === "zh" ? item.name : item.nameZh);

  return (
    <div className={cx(s.root, ledgerFonts)} lang={lang === "zh" ? "zh" : "en"}>
      <VersionBar versions={hawkerVersions} current="advanced" label="Demo version" ariaLabel="Demo versions" />
      <DemoBar />

      <header className={s.header}>
        <div className={s.shell}>
          <div className={s.headerTop}>
            <span className={cx(s.status, status && (status.isOpen ? s.open : s.shut))} role="status" aria-live="polite">
              <i aria-hidden="true" />
              {status
                ? status.isOpen
                  ? `${t.openNow} · ${t.closesAt} ${formatTime(status.changeAt ?? "")}`
                  : `${t.closed} · ${t.opensAt} ${status.changeAt ? formatTime(status.changeAt) : ""}`
                : t.checking}
            </span>
            <div className={s.headerTools}>
              <button type="button" className={s.tool} onClick={() => setLang(lang === "en" ? "zh" : "en")}>
                {t.langToggle}
              </button>
              <button type="button" className={s.tool} onClick={share}>
                {t.share}
              </button>
            </div>
          </div>

          <div className={s.identity}>
            <span className={s.seal} aria-hidden="true">
              臭豆腐
            </span>
            <div>
              <h1>{lang === "zh" ? hawker.nameZh : hawker.name}</h1>
              <p className={s.altName}>{lang === "zh" ? hawker.name : hawker.nameZh}</p>
              <p className={s.tagline}>{lang === "zh" ? hawker.taglineZh : hawker.tagline}</p>
            </div>
          </div>

          <dl className={s.vitals}>
            <div>
              <dt>{t.rating}</dt>
              <dd>{hawker.rating} / 5</dd>
            </div>
            <div>
              <dt>{t.hours}</dt>
              <dd>{hawker.hours}</dd>
            </div>
            <div>
              <dt>{t.price}</dt>
              <dd>{hawker.priceRange}</dd>
            </div>
          </dl>

          <div className={s.headerActions}>
            <a className={s.primary} href={hawker.order.grabUrl} target="_blank" rel="noopener noreferrer">
              {t.orderGrab}
            </a>
            <a className={s.secondary} href={hawker.mapsUrl} target="_blank" rel="noopener noreferrer">
              {t.directions}
            </a>
          </div>
        </div>
      </header>

      <div className={cx(s.shell, s.layout)}>
        <main className={s.menu} aria-labelledby="menu-heading">
          <div className={s.menuHead}>
            <h2 id="menu-heading">{t.menu}</h2>
            <p>{t.menuHint}</p>
          </div>

          <div className={s.filters} role="group" aria-label={t.menu}>
            {categories.map((c) => (
              <button
                key={c.key}
                type="button"
                aria-pressed={category === c.key}
                className={cx(s.filter, category === c.key && s.filterOn)}
                onClick={() => setCategory(c.key)}
              >
                {lang === "zh" ? c.labelZh : c.label}
              </button>
            ))}
          </div>

          <ul className={s.bill}>
            {visibleItems.map((item) => {
              const qty = cart[item.id] ?? 0;
              const description = lang === "zh" ? item.descriptionZh : item.description;
              return (
                <li key={item.id} className={cx(s.billRow, qty > 0 && s.billRowOn)}>
                  <div className={s.dish}>
                    <h3>
                      {primaryName(item)}
                      {item.tag && <span className={s.tag}>{lang === "zh" ? item.tagZh : item.tag}</span>}
                    </h3>
                    <p className={s.altName}>{secondaryName(item)}</p>
                    {description && <p className={s.dishNote}>{description}</p>}
                  </div>
                  <span className={s.leader} aria-hidden="true" />
                  <span className={s.amount}>{formatPrice(item.price)}</span>
                  <span className={s.stepper}>
                    {qty > 0 && (
                      <>
                        <button type="button" onClick={() => changeQty(item.id, -1)} aria-label={`${t.remove}: ${primaryName(item)}`}>
                          −
                        </button>
                        <span className={s.qty} aria-live="polite">
                          {qty}
                        </span>
                      </>
                    )}
                    <button
                      type="button"
                      className={s.addButton}
                      onClick={() => changeQty(item.id, 1)}
                      aria-label={`${t.add}: ${primaryName(item)}`}
                    >
                      +
                    </button>
                  </span>
                </li>
              );
            })}
          </ul>

          <p className={s.sourceNote}>{lang === "zh" ? hawker.sourceNoteZh : hawker.sourceNote}</p>
        </main>

        <aside id="order" className={s.chit} aria-labelledby="chit-heading">
          <div className={s.chitTop}>
            <h2 id="chit-heading">{t.yourOrder}</h2>
            <span className={s.chitShop}>{hawker.branch}</span>
          </div>

          {lines.length === 0 ? (
            <p className={s.empty}>{t.empty}</p>
          ) : (
            <>
              <ul className={s.chitLines}>
                {hawker.menu
                  .filter((item) => cart[item.id])
                  .map((item) => (
                    <li key={item.id}>
                      <span className={s.chitQty}>{cart[item.id]}×</span>
                      <span className={s.chitName}>{primaryName(item)}</span>
                      <span className={s.amount}>
                        {formatPrice(lineTotal({ name: item.name, price: item.price, qty: cart[item.id] }))}
                      </span>
                      <span className={s.stepper}>
                        <button type="button" onClick={() => changeQty(item.id, -1)} aria-label={`${t.remove}: ${primaryName(item)}`}>
                          −
                        </button>
                        <button type="button" onClick={() => changeQty(item.id, 1)} aria-label={`${t.add}: ${primaryName(item)}`}>
                          +
                        </button>
                      </span>
                    </li>
                  ))}
              </ul>

              <p className={s.chitTotal}>
                <span>
                  {t.total} · {t.items(count)}
                </span>
                <strong>{formatPrice(total)}</strong>
              </p>

              <div className={s.methods} role="radiogroup" aria-label={`${t.pickup} / ${t.delivery}`}>
                {(["pickup", "delivery"] as const).map((m) => (
                  <button
                    key={m}
                    type="button"
                    role="radio"
                    aria-checked={method === m}
                    className={cx(s.method, method === m && s.methodOn)}
                    onClick={() => setMethod(m)}
                  >
                    {m === "pickup" ? t.pickup : t.delivery}
                  </button>
                ))}
              </div>

              <label className={s.noteField}>
                {t.noteLabel}
                <textarea rows={2} value={note} placeholder={t.notePlaceholder} onChange={(e) => setNote(e.target.value)} />
              </label>
            </>
          )}

          {orderUrl ? (
            <a className={s.send} href={orderUrl} target="_blank" rel="noopener noreferrer">
              {t.send}
            </a>
          ) : (
            <span className={cx(s.send, s.sendOff)} aria-disabled="true">
              {whatsappConfigured ? t.send : t.whatsappMissing}
            </span>
          )}

          {lines.length > 0 && (
            <button type="button" className={s.clear} onClick={() => setCart({})}>
              {t.clear}
            </button>
          )}

          <p className={s.orGrab}>
            {t.orGrab}{" "}
            <a href={hawker.order.grabUrl} target="_blank" rel="noopener noreferrer">
              {t.orderGrab}
            </a>
          </p>
        </aside>
      </div>

      <section className={s.findUs} aria-labelledby="find-heading">
        <div className={cx(s.shell, s.findUsInner)}>
          <div>
            <h2 id="find-heading">{t.findUs}</h2>
            <p className={s.address}>{hawker.address}</p>
            <p className={s.addressHours}>
              {t.hours}: {hawker.hours}
            </p>
          </div>
          <a className={s.secondary} href={hawker.mapsUrl} target="_blank" rel="noopener noreferrer">
            {t.directions}
          </a>
        </div>
      </section>

      <footer className={s.footer}>
        <div className={s.shell}>
          Demo page by <a href="/">Tam Kok Yan</a>. GrabFood and WhatsApp are trademarks of their respective owners.
        </div>
      </footer>

      <nav className={s.mobileBar} aria-label={t.yourOrder}>
        {count > 0 ? (
          <>
            <span className={s.mobileTotal}>
              {t.items(count)} · <strong>{formatPrice(total)}</strong>
            </span>
            <a className={s.mobileReview} href="#order">
              {t.review}
            </a>
          </>
        ) : (
          <>
            <a className={s.mobileGrab} href={hawker.order.grabUrl} target="_blank" rel="noopener noreferrer">
              GrabFood
            </a>
            <a className={s.mobileMenu} href="#menu-heading">
              {t.menu}
            </a>
          </>
        )}
      </nav>

      <div className={cx(s.toast, toast && s.toastOn)} role="status" aria-live="polite">
        {toast}
      </div>
    </div>
  );
}

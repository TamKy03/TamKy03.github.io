"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
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
  closesAt: "Closes at",
  opensAt: "Opens at",
  checking: "Checking opening hours…",
  usualHours: "Usual hours",
  onGrab: "on GrabFood",
  share: "Share",
  linkCopied: "Link copied",
  directions: "Directions",
  orderGrab: "Order on GrabFood",
  menu: "Menu",
  menuHint: "Tap + to build your order, then send it to us on WhatsApp.",
  add: "Add",
  remove: "Remove one",
  yourOrder: "Your order",
  empty: "Your order is empty. Tap + on a dish to start.",
  total: "Total",
  pickup: "Self pick-up",
  delivery: "Delivery",
  noteLabel: "Pick-up time, address or notes",
  notePlaceholder: "e.g. Pick up at 8 pm, less spicy",
  send: "Send order on WhatsApp",
  whatsappMissing: "WhatsApp number not set",
  orGrab: "Prefer delivery by Grab?",
  clear: "Clear order",
  review: "Review order",
  items: (n: number) => `${n} item${n === 1 ? "" : "s"}`,
  findUs: "Find us",
  hoursLabel: "Opening hours",
  messageIntro: "Hi! I'd like to order from {shop}:",
  messageNote: "Note",
};

const zh: typeof en = {
  langToggle: "EN",
  openNow: "营业中",
  closed: "休息中",
  closesAt: "打烊时间",
  opensAt: "营业时间",
  checking: "正在查看营业时间…",
  usualHours: "一般营业时间",
  onGrab: "GrabFood 评分",
  share: "分享",
  linkCopied: "链接已复制",
  directions: "导航",
  orderGrab: "GrabFood 下单",
  menu: "菜单",
  menuHint: "点 + 选好餐点，再通过 WhatsApp 发送订单。",
  add: "加入",
  remove: "减少一份",
  yourOrder: "我的订单",
  empty: "订单是空的，点菜品上的 + 开始点餐。",
  total: "总计",
  pickup: "自取",
  delivery: "外送",
  noteLabel: "自取时间、地址或备注",
  notePlaceholder: "例：晚上8点自取，少辣",
  send: "通过 WhatsApp 发送订单",
  whatsappMissing: "尚未设置 WhatsApp 号码",
  orGrab: "想用 Grab 外送？",
  clear: "清空订单",
  review: "查看订单",
  items: (n: number) => `${n} 份`,
  findUs: "店铺位置",
  hoursLabel: "营业时间",
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

// Advanced version: live open/closed status, EN/中文, category filter, and a WhatsApp order builder.
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

  // Restore the visitor's language and cart, then keep them saved.
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

  // Open/closed is computed in the browser (Malaysia time) and refreshed every minute.
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
    <div className={s.root} lang={lang === "zh" ? "zh" : "en"}>
      <VersionBar versions={hawkerVersions} current="advanced" label="Demo version" ariaLabel="Demo versions" />
      <DemoBar />

      <header className={s.hero}>
        <div className={cx(s.container, s.heroInner)}>
          <div className={s.badge} aria-hidden="true">
            臭豆腐
          </div>
          <div className={s.heroText}>
            <div className={s.statusRow}>
              <span
                className={cx(s.status, status && (status.isOpen ? s.open : s.closedStatus))}
                role="status"
                aria-live="polite"
              >
                <i aria-hidden="true" />
                {status
                  ? status.isOpen
                    ? `${t.openNow} · ${t.closesAt} ${formatTime(status.changeAt ?? "")}`
                    : `${t.closed} · ${t.opensAt} ${status.changeAt ? formatTime(status.changeAt) : ""}`
                  : t.checking}
              </span>
              <div className={s.tools}>
                <button type="button" className={s.toolButton} onClick={() => setLang(lang === "en" ? "zh" : "en")}>
                  {t.langToggle}
                </button>
                <button type="button" className={s.toolButton} onClick={share}>
                  {t.share}
                </button>
              </div>
            </div>
            <h1>
              {lang === "zh" ? hawker.nameZh : hawker.name}
              <span className={s.nameAlt}>{lang === "zh" ? hawker.name : hawker.nameZh}</span>
            </h1>
            <p className={s.tagline}>{lang === "zh" ? hawker.taglineZh : hawker.tagline}</p>
            <ul className={s.facts}>
              <li>
                ⭐ {hawker.rating} {t.onGrab}
              </li>
              <li>
                🕔 {t.usualHours}: {hawker.hours}
              </li>
              <li>💰 {hawker.priceRange}</li>
              {(lang === "zh" ? hawker.cuisinesZh : hawker.cuisines).map((cuisine) => (
                <li key={cuisine} className={s.cuisine}>
                  {cuisine}
                </li>
              ))}
            </ul>
            <div className={s.heroActions}>
              <a className={s.grabButton} href={hawker.order.grabUrl} target="_blank" rel="noopener noreferrer">
                {t.orderGrab}
              </a>
              <a className={s.ghostButton} href={hawker.mapsUrl} target="_blank" rel="noopener noreferrer">
                📍 {t.directions}
              </a>
            </div>
          </div>
        </div>
      </header>

      <div className={cx(s.container, s.layout)}>
        <main className={s.menuSection} aria-labelledby="menu-heading">
          <h2 id="menu-heading">{t.menu}</h2>
          <p className={s.hint}>{t.menuHint}</p>
          <div className={s.chips} role="group" aria-label={t.menu}>
            {categories.map((c) => (
              <button
                key={c.key}
                type="button"
                aria-pressed={category === c.key}
                className={cx(s.chip, category === c.key && s.chipActive)}
                onClick={() => setCategory(c.key)}
              >
                {lang === "zh" ? c.labelZh : c.label}
              </button>
            ))}
          </div>

          <ul className={s.grid}>
            {visibleItems.map((item) => {
              const qty = cart[item.id] ?? 0;
              const description = lang === "zh" ? item.descriptionZh : item.description;
              return (
                <li key={item.id} className={cx(s.dish, qty > 0 && s.dishSelected)}>
                  <div className={s.thumb} aria-hidden="true">
                    {item.glyph}
                  </div>
                  <div className={s.dishBody}>
                    <div className={s.dishHead}>
                      <h3>
                        {primaryName(item)}
                        <span>{secondaryName(item)}</span>
                      </h3>
                      {item.tag && <span className={s.tag}>{lang === "zh" ? item.tagZh : item.tag}</span>}
                    </div>
                    {description && <p>{description}</p>}
                    <div className={s.dishFoot}>
                      <strong className={s.price}>{formatPrice(item.price)}</strong>
                      <div className={s.stepper}>
                        {qty > 0 && (
                          <>
                            <button
                              type="button"
                              onClick={() => changeQty(item.id, -1)}
                              aria-label={`${t.remove}: ${primaryName(item)}`}
                            >
                              −
                            </button>
                            <span aria-live="polite">{qty}</span>
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
                      </div>
                    </div>
                  </div>
                </li>
              );
            })}
          </ul>
          <p className={s.note}>{lang === "zh" ? hawker.sourceNoteZh : hawker.sourceNote}</p>
        </main>

        <aside id="order" className={s.summary} aria-labelledby="order-heading">
          <h2 id="order-heading">{t.yourOrder}</h2>
          {lines.length === 0 ? (
            <p className={s.empty}>{t.empty}</p>
          ) : (
            <>
              <ul className={s.lines}>
                {hawker.menu
                  .filter((item) => cart[item.id])
                  .map((item) => (
                    <li key={item.id}>
                      <span className={s.lineName}>
                        {primaryName(item)}
                        <small>{formatPrice(lineTotal({ name: item.name, price: item.price, qty: cart[item.id] }))}</small>
                      </span>
                      <span className={s.stepper}>
                        <button type="button" onClick={() => changeQty(item.id, -1)} aria-label={`${t.remove}: ${primaryName(item)}`}>
                          −
                        </button>
                        <span>{cart[item.id]}</span>
                        <button type="button" onClick={() => changeQty(item.id, 1)} aria-label={`${t.add}: ${primaryName(item)}`}>
                          +
                        </button>
                      </span>
                    </li>
                  ))}
              </ul>
              <p className={s.total}>
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
                    className={cx(s.method, method === m && s.methodActive)}
                    onClick={() => setMethod(m)}
                  >
                    {m === "pickup" ? t.pickup : t.delivery}
                  </button>
                ))}
              </div>

              <label className={s.noteField}>
                {t.noteLabel}
                <textarea
                  rows={2}
                  value={note}
                  placeholder={t.notePlaceholder}
                  onChange={(e) => setNote(e.target.value)}
                />
              </label>
            </>
          )}

          {orderUrl ? (
            <a className={s.sendButton} href={orderUrl} target="_blank" rel="noopener noreferrer">
              {t.send}
            </a>
          ) : (
            <span className={cx(s.sendButton, s.sendDisabled)} aria-disabled="true">
              {whatsappConfigured ? t.send : t.whatsappMissing}
            </span>
          )}
          {lines.length > 0 && (
            <button type="button" className={s.clearButton} onClick={() => setCart({})}>
              {t.clear}
            </button>
          )}
          <p className={s.orGrab}>
            {t.orGrab}{" "}
            <a href={hawker.order.grabUrl} target="_blank" rel="noopener noreferrer">
              {t.orderGrab} →
            </a>
          </p>
        </aside>
      </div>

      <section className={s.visit} aria-labelledby="visit-heading">
        <div className={cx(s.container, s.visitInner)}>
          <div>
            <h2 id="visit-heading">{t.findUs}</h2>
            <p className={s.address}>{hawker.address}</p>
            <p>
              <strong>{t.hoursLabel}:</strong> {hawker.hours}
            </p>
          </div>
          <a className={s.ghostButton} href={hawker.mapsUrl} target="_blank" rel="noopener noreferrer">
            📍 {t.directions} ↗
          </a>
        </div>
      </section>

      <footer className={s.footer}>
        Demo page by <a href="/">Tam Kok Yan</a>. GrabFood and WhatsApp are trademarks of their respective owners.
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

      <div className={cx(s.toast, toast && s.toastShow)} role="status" aria-live="polite">
        {toast}
      </div>
    </div>
  );
}

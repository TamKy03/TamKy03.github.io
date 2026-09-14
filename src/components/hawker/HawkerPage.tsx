import { OrderButtons, StickyOrderBar } from "@/components/order/OrderButtons";
import { formatPrice, hawker } from "@/content/hawker";
import s from "./hawker.module.css";

export function HawkerPage() {
  const { order } = hawker;

  return (
    <div className={s.root}>
      <p className={s.demoBar}>
        Demo page — not the official website of this business. Built by <a href="/">Tam Kok Yan</a> to show one-tap
        GrabFood &amp; WhatsApp ordering.
      </p>

      <header className={s.hero}>
        <div className={s.heroInner}>
          <div className={s.badge} aria-hidden="true">
            臭豆腐
          </div>
          <div className={s.heroText}>
            <p className={s.cuisines}>
              {hawker.cuisines.map((cuisine) => (
                <span key={cuisine}>{cuisine}</span>
              ))}
            </p>
            <h1>
              {hawker.name}
              <span className={s.nameZh} lang="zh">
                {hawker.nameZh}
              </span>
            </h1>
            <p className={s.tagline}>{hawker.tagline}</p>
            <ul className={s.facts}>
              <li>
                <span aria-hidden="true">⭐</span> {hawker.rating} on GrabFood
              </li>
              <li>
                <span aria-hidden="true">🕔</span> {hawker.hours}
              </li>
              <li>
                <span aria-hidden="true">💰</span> {hawker.priceRange}
              </li>
            </ul>
            <OrderButtons grabUrl={order.grabUrl} whatsapp={order.whatsapp} className={s.heroButtons} />
          </div>
        </div>
      </header>

      <main>
        <section className={s.section} aria-labelledby="menu-title">
          <div className={s.container}>
            <h2 id="menu-title">Menu highlights</h2>
            <div className={s.menu}>
              {hawker.menu.map((item) => (
                <article key={item.name} className={s.dish}>
                  <div className={s.dishTop}>
                    {item.tag && <span className={s.tag}>{item.tag}</span>}
                    <span className={s.price}>{formatPrice(item.price)}</span>
                  </div>
                  <h3>
                    {item.name}
                    {item.nameZh && (
                      <span className={s.dishZh} lang="zh">
                        {item.nameZh}
                      </span>
                    )}
                  </h3>
                  <p>{item.description}</p>
                  <a className={s.dishOrder} href={order.grabUrl} target="_blank" rel="noopener noreferrer">
                    Order on GrabFood →
                  </a>
                </article>
              ))}
            </div>

            <div className={s.drinks}>
              <h3>Drinks</h3>
              <ul>
                {hawker.drinks.map((drink) => (
                  <li key={drink.name}>
                    <span>{drink.name}</span>
                    <span>{formatPrice(drink.price)}</span>
                  </li>
                ))}
              </ul>
            </div>
            <p className={s.note}>{hawker.sourceNote}</p>
          </div>
        </section>

        <section className={`${s.section} ${s.visit}`} aria-labelledby="visit-title">
          <div className={`${s.container} ${s.visitGrid}`}>
            <div>
              <h2 id="visit-title">Find us</h2>
              <p className={s.address}>{hawker.address}</p>
              <p>
                <strong>Opening hours:</strong> {hawker.hours}
              </p>
              <a className={s.mapLink} href={hawker.mapsUrl} target="_blank" rel="noopener noreferrer">
                Open in Google Maps ↗
              </a>
            </div>
            <div className={s.orderCard}>
              <h2>Craving now?</h2>
              <p>Order for delivery on GrabFood, or message us on WhatsApp to ask or pre-order.</p>
              <OrderButtons grabUrl={order.grabUrl} whatsapp={order.whatsapp} layout="stack" />
            </div>
          </div>
        </section>
      </main>

      <footer className={s.footer}>
        <p>
          {hawker.name} · {hawker.branch}
        </p>
        <p className={s.footerNote}>
          Demo page by <a href="/">Tam Kok Yan</a>. GrabFood and WhatsApp are trademarks of their respective owners.
        </p>
      </footer>

      <StickyOrderBar grabUrl={order.grabUrl} whatsapp={order.whatsapp} />
    </div>
  );
}

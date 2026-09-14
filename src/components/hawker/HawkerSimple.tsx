import { OrderButtons } from "@/components/order/OrderButtons";
import { VersionBar } from "@/components/VersionBar";
import { formatPrice, hawker, hawkerVersions } from "@/content/hawker";
import { DemoBar } from "./DemoBar";
import s from "./simple.module.css";

// Simple version: a single "link in bio" card — ideal for Instagram/TikTok bios and QR stickers.
export function HawkerSimple() {
  const { order } = hawker;

  return (
    <div className={s.root}>
      <VersionBar versions={hawkerVersions} current="simple" label="Demo version" ariaLabel="Demo versions" />
      <DemoBar />

      <main className={s.card}>
        <div className={s.badge} aria-hidden="true">
          臭豆腐
        </div>
        <h1>
          {hawker.name}
          <span lang="zh">{hawker.nameZh}</span>
        </h1>
        <p className={s.meta}>
          ⭐ {hawker.rating} · {hawker.hours} · {hawker.priceRange}
        </p>

        <OrderButtons grabUrl={order.grabUrl} whatsapp={order.whatsapp} layout="stack" />
        <a className={s.mapButton} href={hawker.mapsUrl} target="_blank" rel="noopener noreferrer">
          <span aria-hidden="true">📍</span> Get directions
        </a>

        <section className={s.menu} aria-labelledby="simple-menu">
          <h2 id="simple-menu">Menu</h2>
          <ul>
            {hawker.menu.map((item) => (
              <li key={item.id}>
                <span>
                  {item.name}
                  <small lang="zh">{item.nameZh}</small>
                </span>
                <strong>{formatPrice(item.price)}</strong>
              </li>
            ))}
          </ul>
        </section>

        <p className={s.address}>{hawker.address}</p>
        <p className={s.note}>{hawker.sourceNote}</p>
      </main>
    </div>
  );
}

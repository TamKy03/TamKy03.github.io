import { VersionBar } from "@/components/VersionBar";
import { pageMetadata } from "@/content/site";
import s from "./versions.module.css";

export const metadata = pageMetadata({
  title: "Tam Kok Yan — Site versions",
  path: "/versions/",
  description: "Three versions of Tam Kok Yan's personal site, from lightest to most interactive.",
});

const cards = [
  {
    href: "/lite/",
    tag: "V1 · Lite",
    title: "One-page resume",
    points: [
      "Server-rendered résumé with no interactive scripts",
      "System fonts only",
      "Print-ready layout (Ctrl+P gives a clean page)",
    ],
  },
  {
    href: "/standard/",
    tag: "V2 · Standard",
    title: "Personal portfolio",
    points: [
      "Sticky nav, mobile menu, section highlight",
      "Light / dark theme, scroll reveal",
      "Timeline, skill meters, back-to-top",
    ],
  },
  {
    href: "/",
    tag: "V3 · Interactive · Main site",
    title: "Interactive showcase",
    points: [
      "Animated data-network hero, typing roles",
      "Filterable timeline, animated stats",
      "Command palette (Ctrl/⌘ + K), contact form",
    ],
  },
];

const demos = [
  {
    href: "/demo/hawker/",
    tag: "Demo · F&B hawker",
    title: "One-tap ordering page",
    points: [
      "“Order on GrabFood” button that opens the Grab app",
      "WhatsApp chat button with a pre-filled message",
      "Menu highlights and an order bar fixed to the bottom on phones",
    ],
  },
];

export default function VersionsPage() {
  return (
    <div className={s.root}>
      <VersionBar current="versions" />
      <main className={s.main}>
        <h1>
          <span>Tam Kok Yan</span> — resume site
        </h1>
        <p className={s.lead}>Three versions of the same content, from lightest to most interactive.</p>
        <div className={s.grid}>
          {cards.map((card) => (
            <a key={card.href} className={s.card} href={card.href}>
              <span className={s.tag}>{card.tag}</span>
              <h2>{card.title}</h2>
              <ul>
                {card.points.map((point) => (
                  <li key={point}>{point}</li>
                ))}
              </ul>
              <span className={s.go}>Open →</span>
            </a>
          ))}
        </div>

        <h2 className={s.sectionTitle}>Demos</h2>
        <p className={s.lead}>Sample pages for other kinds of clients, built with the same stack.</p>
        <div className={s.grid}>
          {demos.map((demo) => (
            <a key={demo.href} className={s.card} href={demo.href}>
              <span className={`${s.tag} ${s.demoTag}`}>{demo.tag}</span>
              <h2>{demo.title}</h2>
              <ul>
                {demo.points.map((point) => (
                  <li key={point}>{point}</li>
                ))}
              </ul>
              <span className={s.go}>Open →</span>
            </a>
          ))}
        </div>
      </main>
    </div>
  );
}

import s from "@/components/portfolio/portfolio.module.css";
import a from "./labs.module.css";

const destinations = [
  { href: "/", rail: "Record", title: "The record", blurb: "Work, study and the code behind each piece." },
  {
    href: "/netsuite/",
    rail: "NetSuite",
    title: "Governance and script types",
    blurb: "Two tools for the decisions a NetSuite build turns on.",
  },
  {
    href: "/cs/",
    rail: "Computer science",
    title: "Thresholds and batches",
    blurb: "Where to draw a line, and how to fit a million rows in nine hours.",
  },
  {
    href: "/lab/",
    rail: "Puzzles",
    title: "Three SuiteScript cases",
    blurb: "Multi-step problems. The answers are not in the page source.",
  },
];

/** Links on to the other pages, minus the one you are reading. */
export function Onward({ current }: { current: string }) {
  return (
    <nav className={a.onward} aria-label="More">
      {destinations
        .filter((d) => d.href !== current)
        .map((d) => (
          <a key={d.href} href={d.href}>
            <span className={s.rail}>{d.rail}</span>
            <h3>{d.title}</h3>
            <p>{d.blurb}</p>
          </a>
        ))}
    </nav>
  );
}

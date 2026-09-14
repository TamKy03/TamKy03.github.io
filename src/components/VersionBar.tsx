import s from "./VersionBar.module.css";

const versions = [
  { key: "interactive", href: "/", label: "Interactive" },
  { key: "standard", href: "/standard/", label: "Standard" },
  { key: "lite", href: "/lite/", label: "Lite" },
  { key: "versions", href: "/versions/", label: "Compare all" },
] as const;

export type VersionKey = (typeof versions)[number]["key"];

// Plain links (not next/link): each version is a separate design, and the static export on
// GitHub Pages can't serve next/link's prefetch payloads.
export function VersionBar({ current, id }: { current: VersionKey; id?: string }) {
  return (
    <nav className={s.bar} id={id} aria-label="Site versions">
      <span className={s.label}>Site version</span>
      {versions.map((v) => (
        <a key={v.key} href={v.href} aria-current={v.key === current ? "page" : undefined}>
          {v.label}
        </a>
      ))}
    </nav>
  );
}

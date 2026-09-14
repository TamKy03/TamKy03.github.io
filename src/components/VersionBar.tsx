import s from "./VersionBar.module.css";

export type Version = { key: string; href: string; label: string };

export const profileVersions: Version[] = [
  { key: "interactive", href: "/", label: "Interactive" },
  { key: "standard", href: "/standard/", label: "Standard" },
  { key: "lite", href: "/lite/", label: "Lite" },
  { key: "versions", href: "/versions/", label: "Compare all" },
];

// Plain links (not next/link): each version is a separate design, and the static export on
// GitHub Pages can't serve next/link's prefetch payloads.
export function VersionBar({
  current,
  id,
  versions = profileVersions,
  label = "Site version",
  ariaLabel = "Site versions",
}: {
  current: string;
  id?: string;
  versions?: Version[];
  // Visible caption, and the name screen readers announce for the navigation
  label?: string;
  ariaLabel?: string;
}) {
  return (
    <nav className={s.bar} id={id} aria-label={ariaLabel}>
      <span className={s.label}>{label}</span>
      {versions.map((v) => (
        <a key={v.key} href={v.href} aria-current={v.key === current ? "page" : undefined}>
          {v.label}
        </a>
      ))}
    </nav>
  );
}

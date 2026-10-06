"use client";

import { useCallback, useEffect, useState, type ReactNode } from "react";
import { ledgerFonts } from "@/app/fonts";
import { profile } from "@/content/profile";
import { cx } from "@/lib/utils";
import s from "@/components/portfolio/portfolio.module.css";

type Theme = "light" | "dark";

// Applies the saved theme before first paint to avoid a flash of the wrong one.
const themeScript = `try{var t=localStorage.getItem("tky-theme");if(t==="light"||t==="dark")document.currentScript.parentElement.dataset.theme=t}catch(e){}`;

export const sections = [
  { href: "/", label: "Record" },
  { href: "/netsuite/", label: "NetSuite" },
  { href: "/cs/", label: "Computer science" },
  { href: "/lab/", label: "Puzzles" },
];

/** Masthead, ground and footer shared by every page outside the home record. */
export function Shell({ current, children }: { current: string; children: ReactNode }) {
  const [theme, setTheme] = useState<Theme>("light");
  const [year] = useState(() => new Date().getFullYear());

  useEffect(() => {
    try {
      const saved = localStorage.getItem("tky-theme");
      if (saved === "light" || saved === "dark") setTheme(saved);
    } catch {}
  }, []);

  const toggleTheme = useCallback(() => {
    setTheme((current) => {
      const next: Theme = current === "light" ? "dark" : "light";
      try {
        localStorage.setItem("tky-theme", next);
      } catch {}
      return next;
    });
  }, []);

  return (
    <div className={cx(s.root, ledgerFonts)} data-theme={theme} suppressHydrationWarning>
      <script dangerouslySetInnerHTML={{ __html: themeScript }} />
      <div className={s.progress} aria-hidden="true" />

      <header className={s.masthead}>
        <div className={s.shell}>
          <a className={s.brand} href="/">
            TKY
          </a>
          <nav className={s.nav} aria-label="Primary">
            {sections.map((link) => (
              <a key={link.href} href={link.href} aria-current={link.href === current ? "page" : undefined}>
                {link.label}
              </a>
            ))}
          </nav>
          <div className={s.tools}>
            <button type="button" className={s.tool} onClick={toggleTheme}>
              {theme === "light" ? "Ink" : "Paper"}
            </button>
          </div>
        </div>
      </header>

      <main>{children}</main>

      <footer className={s.footer}>
        <div className={s.shell}>
          <span>
            © <span suppressHydrationWarning>{year}</span> {profile.name}
          </span>
          <span>
            <a href="/">Back to the record</a>
          </span>
        </div>
      </footer>
    </div>
  );
}

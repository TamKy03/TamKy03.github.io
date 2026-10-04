"use client";

import {
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
  type CSSProperties,
  type FormEvent,
  type ReactNode,
} from "react";
import { flushSync } from "react-dom";
import { ledgerFonts } from "@/app/fonts";
import { useReducedMotion } from "@/components/hooks";
import { craft } from "@/content/craft";
import {
  codeInstructor,
  degree,
  foundation,
  integrationSkills,
  internship,
  netsuiteRole,
  netsuiteSkills,
  period,
  profile,
  programmeRep,
  spokenLanguages,
  university,
  weiqiClub,
} from "@/content/profile";
import { cx, monthsSince } from "@/lib/utils";
import { CommandPalette, type Command } from "./CommandPalette";
import s from "./portfolio.module.css";

type Theme = "light" | "dark";
type EntryType = "work" | "education" | "campus";
type Filter = "all" | EntryType;

type Entry = {
  id: string;
  type: EntryType;
  when: string;
  figure: string;
  title: string;
  where: string;
  body?: ReactNode;
};

const navLinks = [
  { id: "record", label: "Record" },
  { id: "craft", label: "Craft" },
  { id: "toolkit", label: "Toolkit" },
  { id: "contact", label: "Contact" },
];

const filters: { key: Filter; label: string }[] = [
  { key: "all", label: "Everything" },
  { key: "work", label: "Work" },
  { key: "education", label: "Study" },
  { key: "campus", label: "Campus" },
];

const toolkit = [
  { field: "NetSuite", detail: netsuiteSkills.join(", ") },
  { field: "Integration & engineering", detail: integrationSkills.join(", ") },
  { field: "Data & AI", detail: "Python, SQL, statistics, model evaluation — BCS (Hons) Data Science, TARUMT" },
  { field: "Web", detail: "TypeScript, React, Next.js, CSS scroll-driven animation, View Transitions, accessibility" },
  { field: "Languages", detail: spokenLanguages.join(", ") },
];

// Applies the saved theme before first paint to avoid a flash of the wrong one.
const themeScript = `try{var t=localStorage.getItem("tky-theme");if(t==="light"||t==="dark")document.currentScript.parentElement.dataset.theme=t}catch(e){}`;

function Bullets({ items }: { items: string[] }) {
  return (
    <ul className={s.bullets}>
      {items.map((item) => (
        <li key={item}>{item}</li>
      ))}
    </ul>
  );
}

export function PortfolioSite() {
  const reduced = useReducedMotion();
  const toastTimer = useRef<number | undefined>(undefined);

  const [theme, setTheme] = useState<Theme>("light");
  const [filter, setFilter] = useState<Filter>("all");
  const [photoOk, setPhotoOk] = useState(true);
  const [paletteOpen, setPaletteOpen] = useState(false);
  const [toastMessage, setToastMessage] = useState("");
  const [toastVisible, setToastVisible] = useState(false);
  const [year] = useState(() => new Date().getFullYear());
  const months = monthsSince(profile.blackoakStart);

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

  // The browser animates between list states; no measuring, no FLIP maths.
  const applyFilter = useCallback(
    (next: Filter) => {
      if (reduced || typeof document.startViewTransition !== "function") {
        setFilter(next);
        return;
      }
      document.startViewTransition(() => flushSync(() => setFilter(next)));
    },
    [reduced],
  );

  useEffect(() => {
    const onKeyDown = (e: KeyboardEvent) => {
      if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === "k") {
        e.preventDefault();
        setPaletteOpen((open) => !open);
      } else if (e.key === "Escape") {
        setPaletteOpen(false);
      }
    };
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, []);

  const showToast = useCallback((message: string) => {
    setToastMessage(message);
    setToastVisible(true);
    window.clearTimeout(toastTimer.current);
    toastTimer.current = window.setTimeout(() => setToastVisible(false), 2200);
  }, []);

  const copyEmail = useCallback(async () => {
    try {
      await navigator.clipboard.writeText(profile.email);
      showToast("Email copied");
    } catch {
      window.location.href = `mailto:${profile.email}`;
    }
  }, [showToast]);

  const goTo = useCallback(
    (id: string) => document.getElementById(id)?.scrollIntoView({ behavior: reduced ? "auto" : "smooth" }),
    [reduced],
  );

  const commands = useMemo<Command[]>(
    () => [
      { label: "Go to record", hint: "section", run: () => goTo("record") },
      { label: "Go to craft", hint: "section", run: () => goTo("craft") },
      { label: "Go to toolkit", hint: "section", run: () => goTo("toolkit") },
      { label: "Go to contact", hint: "section", run: () => goTo("contact") },
      ...craft.map((piece) => ({
        label: `Read: ${piece.title}`,
        hint: piece.kicker.toLowerCase(),
        run: () => goTo(piece.id),
      })),
      { label: "Show work only", hint: "filter", run: () => { applyFilter("work"); goTo("record"); } },
      { label: "Show study only", hint: "filter", run: () => { applyFilter("education"); goTo("record"); } },
      { label: "Show campus roles", hint: "filter", run: () => { applyFilter("campus"); goTo("record"); } },
      { label: "Copy email address", hint: "action", run: copyEmail },
      { label: "Open LinkedIn", hint: "link", run: () => window.open(profile.linkedin, "_blank", "noopener") },
      { label: "Switch paper / ink", hint: "action", run: toggleTheme },
      { label: "Back to top", hint: "section", run: () => goTo("home") },
    ],
    [applyFilter, copyEmail, goTo, toggleTheme],
  );

  const onContactSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const data = new FormData(e.currentTarget);
    const body = `${data.get("message")}\n\n— ${data.get("name")}`;
    window.location.href = `mailto:${profile.email}?subject=${encodeURIComponent(String(data.get("subject")))}&body=${encodeURIComponent(body)}`;
  };

  const entries: Entry[] = [
    {
      id: "blackoak",
      type: "work",
      when: period(netsuiteRole.period, " – "),
      figure: netsuiteRole.employment,
      title: netsuiteRole.title,
      where: `${netsuiteRole.org}, ${netsuiteRole.place}`,
      body: (
        <>
          <p className={s.summary}>{netsuiteRole.summary}</p>
          <div className={s.groups}>
            {netsuiteRole.groups.map((group, i) => (
              <details key={group.title} open={i === 0}>
                <summary>{group.title}</summary>
                <Bullets items={group.items} />
              </details>
            ))}
          </div>
        </>
      ),
    },
    {
      id: "degree",
      type: "education",
      when: period(degree.period, " – "),
      figure: `CGPA ${degree.cgpa}`,
      title: degree.title,
      where: `${university}, KL Main Campus`,
    },
    {
      id: "intern",
      type: "work",
      when: period(internship.period, " – "),
      figure: "Internship",
      title: internship.title,
      where: `${internship.org}, ${internship.place}`,
    },
    {
      id: "rep",
      type: "campus",
      when: period(programmeRep.period, " – "),
      figure: "Faculty",
      title: programmeRep.title,
      where: programmeRep.org,
      body: <Bullets items={programmeRep.bullets} />,
    },
    {
      id: "codekidz",
      type: "work",
      when: period(codeInstructor.period, " – "),
      figure: codeInstructor.employment,
      title: codeInstructor.title,
      where: `${codeInstructor.org}, ${codeInstructor.place}`,
      body: <Bullets items={codeInstructor.bullets} />,
    },
    {
      id: "weiqi",
      type: "campus",
      when: period(weiqiClub.period, " – "),
      figure: "Club",
      title: weiqiClub.title,
      where: weiqiClub.org,
      body: <Bullets items={weiqiClub.bullets} />,
    },
    {
      id: "foundation",
      type: "education",
      when: period(foundation.period, " – "),
      figure: `CGPA ${foundation.cgpa}`,
      title: foundation.title,
      where: `${university}, KL Main Campus`,
    },
  ];

  const visibleEntries = entries.filter((entry) => filter === "all" || entry.type === filter);

  return (
    <div className={cx(s.root, ledgerFonts)} data-theme={theme} suppressHydrationWarning>
      <script dangerouslySetInnerHTML={{ __html: themeScript }} />
      {/* Reading progress, driven by the document scroll timeline in CSS */}
      <div className={s.progress} aria-hidden="true" />

      <header className={s.masthead}>
        <div className={s.shell}>
          <a className={s.brand} href="#home">
            TKY
          </a>
          <nav className={s.nav} aria-label="Primary">
            {navLinks.map((link) => (
              <a key={link.id} href={`#${link.id}`}>
                {link.label}
              </a>
            ))}
          </nav>
          <div className={s.tools}>
            <button type="button" className={s.tool} onClick={() => setPaletteOpen(true)}>
              Search <kbd>Ctrl K</kbd>
            </button>
            <button type="button" className={s.tool} onClick={toggleTheme}>
              {theme === "light" ? "Ink" : "Paper"}
            </button>
          </div>
        </div>
      </header>

      <main>
        <section id="home" className={s.hero}>
          <div className={s.shell}>
            <div className={s.heroTop}>
              <div className={s.heroName}>
                <h1>
                  Tam
                  <br />
                  Kok&nbsp;Yan
                </h1>
                <span className={s.highlight} aria-hidden="true" />
                <p className={s.lede}>
                  NetSuite technical consultant with a data science degree. I write the SuiteScript behind
                  Order-to-Cash and Procure-to-Pay, build integrations that move a million records a night, and build
                  for the web in my own time — this page included.
                </p>
              </div>

              <figure className={cx(s.portrait, !photoOk && s.portraitEmpty)}>
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={profile.photo}
                  alt="Portrait of Tam Kok Yan"
                  width={280}
                  height={321}
                  onError={() => setPhotoOk(false)}
                />
                <figcaption>{profile.location}</figcaption>
              </figure>
            </div>

            <dl className={s.statement}>
              <div className={s.statementRow}>
                <dt>Role</dt>
                <dd>{profile.title}</dd>
                <span className={s.figure}>since May 2025</span>
              </div>
              <div className={s.statementRow}>
                <dt>Company</dt>
                <dd>
                  {netsuiteRole.org}, {netsuiteRole.place}
                </dd>
                <span className={s.figure}>{months} months</span>
              </div>
              <div className={s.statementRow}>
                <dt>Platform</dt>
                <dd>Oracle NetSuite — SuiteScript 2.1, SuiteQL, Map/Reduce</dd>
                <span className={s.figure}>1M+ records</span>
              </div>
              <div className={s.statementRow}>
                <dt>Study</dt>
                <dd>{degree.title}, TARUMT</dd>
                <span className={s.figure}>CGPA {degree.cgpa}</span>
              </div>
            </dl>
          </div>
        </section>

        <section id="record" className={s.section}>
          <div className={s.shell}>
            <div className={s.sectionHead}>
              <h2>The record</h2>
              <div className={s.filters} role="group" aria-label="Filter the record">
                {filters.map((f) => (
                  <button
                    key={f.key}
                    type="button"
                    aria-pressed={filter === f.key}
                    className={cx(s.chip, filter === f.key && s.chipOn)}
                    onClick={() => applyFilter(f.key)}
                  >
                    {f.label}
                  </button>
                ))}
              </div>
            </div>

            <ol className={s.ledger}>
              {visibleEntries.map((entry) => (
                <li
                  key={entry.id}
                  className={cx(s.entry, s.reveal)}
                  style={{ "--vt": `row-${entry.id}` } as CSSProperties}
                >
                  <div className={s.when}>{entry.when}</div>
                  <div className={s.entryBody}>
                    <h3>{entry.title}</h3>
                    <p className={s.where}>{entry.where}</p>
                    {entry.body}
                  </div>
                  <div className={s.entryFigure}>{entry.figure}</div>
                </li>
              ))}
            </ol>
          </div>
        </section>

        <section id="craft" className={s.section}>
          <div className={s.shell}>
            <div className={s.sectionHead}>
              <h2>Craft</h2>
              <p className={s.sectionNote}>What I care about technically, and the code behind each piece.</p>
            </div>

            {craft.map((piece) => (
              <article key={piece.id} id={piece.id} className={cx(s.piece, s.reveal)}>
                <div className={s.pieceHead}>
                  <span className={s.kicker}>{piece.kicker}</span>
                  <h3>{piece.title}</h3>
                </div>
                <div className={s.pieceBody}>
                  <p className={s.lead}>{piece.lead}</p>
                  <ul className={s.checks}>
                    {piece.points.map((point) => (
                      <li key={point}>{point}</li>
                    ))}
                  </ul>

                  {piece.id === "motion" && (
                    <div className={s.demo}>
                      <p className={s.demoLabel}>This bar fills with your scroll position — CSS only, no JavaScript</p>
                      <div className={s.demoTrack}>
                        <span className={s.demoFill} />
                      </div>
                    </div>
                  )}

                  {piece.sample && (
                    <figure className={s.sample}>
                      <figcaption>
                        <span>{piece.sample.caption}</span>
                        <span className={s.lang}>{piece.sample.language}</span>
                      </figcaption>
                      <pre>
                        <code>{piece.sample.body}</code>
                      </pre>
                    </figure>
                  )}
                </div>
              </article>
            ))}
          </div>
        </section>

        <section id="toolkit" className={s.section}>
          <div className={s.shell}>
            <div className={s.sectionHead}>
              <h2>What I work with</h2>
            </div>
            <dl className={s.index}>
              {toolkit.map((row) => (
                <div key={row.field} className={cx(s.indexRow, s.reveal)}>
                  <dt>{row.field}</dt>
                  <dd>{row.detail}</dd>
                </div>
              ))}
            </dl>
          </div>
        </section>

        <section id="contact" className={s.section}>
          <div className={s.shell}>
            <div className={s.signoff}>
              <div>
                <h2>Say hello</h2>
                <p className={s.lede}>
                  Open to NetSuite work, data projects and interesting web problems. I read every message.
                </p>
                <div className={s.actions}>
                  <button type="button" className={s.primary} onClick={copyEmail}>
                    Copy email
                  </button>
                  <a className={s.secondary} href={profile.linkedin} target="_blank" rel="noopener noreferrer">
                    LinkedIn
                  </a>
                </div>
                <p className={s.fineprint}>{profile.email}</p>
              </div>

              <form className={s.form} onSubmit={onContactSubmit}>
                <label>
                  Your name
                  <input name="name" required autoComplete="name" />
                </label>
                <label>
                  Subject
                  <input name="subject" required placeholder="What it is about…" />
                </label>
                <label>
                  Message
                  <textarea name="message" rows={4} required />
                </label>
                <button className={s.primary} type="submit">
                  Write the email
                </button>
              </form>
            </div>
          </div>
        </section>
      </main>

      <footer className={s.footer}>
        <div className={s.shell}>
          <span>
            © <span suppressHydrationWarning>{year}</span> {profile.name}
          </span>
          <span>Built with Next.js, TypeScript and CSS scroll-driven animation</span>
        </div>
      </footer>

      <CommandPalette open={paletteOpen} onClose={() => setPaletteOpen(false)} commands={commands} />
      <div className={cx(s.toast, toastVisible && s.toastOn)} role="status" aria-live="polite">
        {toastMessage}
      </div>
    </div>
  );
}

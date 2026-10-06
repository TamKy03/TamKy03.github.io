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
import { Onward } from "@/components/labs/Onward";
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
  { href: "#record", label: "Record" },
  { href: "#craft", label: "Craft" },
  { href: "/netsuite/", label: "NetSuite" },
  { href: "/cs/", label: "Computer science" },
  { href: "/lab/", label: "Puzzles" },
  { href: "#contact", label: "Contact" },
];

const filters: { key: Filter; label: string }[] = [
  { key: "all", label: "Everything" },
  { key: "work", label: "Work" },
  { key: "education", label: "Study" },
  { key: "campus", label: "Campus" },
];

// Two columns that have to agree: a requirement on the left, what it becomes on the right.
const reconcile = [
  { in: "A requirement written in business language", out: "SuiteScript 2.1 that validates, routes and posts" },
  { in: "A million rows waiting in a saved search", out: "An export delivered inside the overnight window" },
  { in: "A degree in data science", out: "Thresholds set from what each kind of mistake costs" },
];

const toolkit = [
  { field: "NetSuite", detail: netsuiteSkills.join(", ") },
  { field: "Integration & engineering", detail: integrationSkills.join(", ") },
  { field: "Data & AI", detail: "Python, SQL, statistics and model evaluation, from a BCS (Hons) in Data Science at TARUMT" },
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
      { label: "Open the NetSuite tools", hint: "page", run: () => { window.location.href = "/netsuite/"; } },
      { label: "Open the computer science page", hint: "page", run: () => { window.location.href = "/cs/"; } },
      { label: "Open the SuiteScript puzzles", hint: "page", run: () => { window.location.href = "/lab/"; } },
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
              <a key={link.href} href={link.href}>
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
                <p className={s.recordLine}>
                  <span>Rec · {profile.title}</span>
                  <span>{profile.location}</span>
                  <span>Since Nov 2024</span>
                </p>
                <p className={s.lede}>
                  I am a NetSuite technical consultant with a data science degree. At work I write the SuiteScript
                  behind Order-to-Cash and Procure-to-Pay, and the integrations that move about a million records a
                  night. I build for the web in my own time, including this page.
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

            {/* Reconciliation: pick what comes in, the column on the right shows what comes out.
                The radio is the entire mechanism — the CSS reads :checked, nothing else runs. */}
            <div className={s.reconcile} role="group" aria-label="What comes in, what goes out">
              {reconcile.map((pair, i) => (
                <input
                  key={pair.in}
                  type="radio"
                  name="reconcile"
                  id={`rec-${i}`}
                  defaultChecked={i === 0}
                />
              ))}
              <div className={s.recGrid}>
                <div className={s.recSide}>
                  <p className={s.rail}>What comes in</p>
                  {reconcile.map((pair, i) => (
                    <label key={pair.in} htmlFor={`rec-${i}`} data-k={i}>
                      {pair.in}
                    </label>
                  ))}
                </div>
                <div className={cx(s.recSide, s.recOut)}>
                  <p className={s.rail}>What goes out</p>
                  {reconcile.map((pair, i) => (
                    <p key={pair.out} data-k={i}>
                      {pair.out}
                    </p>
                  ))}
                </div>
              </div>
              <p className={s.recFoot}>
                <span>
                  Overnight batch <span className={s.tally} aria-hidden="true" />
                </span>
                <span>1,000,000 records</span>
                <span>17:00 – 02:00</span>
              </p>
            </div>
          </div>
        </section>

        <section id="record" className={s.section}>
          <div className={s.shell}>
            <div className={s.sectionHead}>
              <p className={s.rail}>§ 01 / Record</p>
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
              {visibleEntries.map((entry, i) => (
                <li
                  key={entry.id}
                  className={cx(s.entry, s.reveal)}
                  style={{ "--vt": `row-${entry.id}` } as CSSProperties}
                >
                  <div className={s.when}>
                    <span className={s.railId}>Rec {String(i + 1).padStart(2, "0")}</span>
                    {entry.when}
                  </div>
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

        {/* The night ground: this is the work that runs while the office is closed */}
        <section id="craft" className={cx(s.section, s.night)}>
          <div className={s.shell}>
            <div className={s.sectionHead}>
              <p className={s.rail}>§ 02 / Craft</p>
              <h2>Craft</h2>
              <p className={s.sectionNote}>Open a record to read the code behind it.</p>
            </div>

            {craft.map((piece, i) => (
              <details
                key={piece.id}
                id={piece.id}
                className={cx(s.piece, s.reveal)}
                open={i === 0}
              >
                <summary className={s.pieceHead}>
                  <span className={s.rail}>
                    {String(i + 1).padStart(2, "0")} / {piece.kicker}
                    {piece.flag && <span className={s.flag}> · {piece.flag}</span>}
                  </span>
                  <h3>{piece.title}</h3>
                  <span className={s.pieceState} aria-hidden="true" />
                </summary>
                <div className={s.pieceBody}>
                  <p className={s.lead}>{piece.lead}</p>
                  <ul className={s.checks}>
                    {piece.points.map((point) => (
                      <li key={point}>{point}</li>
                    ))}
                  </ul>

                  {piece.shift && (
                    <div className={s.shift}>
                      <p className={s.was}>{piece.shift.was}</p>
                      <p className={s.now}>{piece.shift.now}</p>
                    </div>
                  )}

                  {piece.id === "motion" && (
                    <div className={s.demo}>
                      <p className={s.demoLabel}>This bar fills with your scroll position. CSS only, no JavaScript.</p>
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
              </details>
            ))}
          </div>
        </section>

        <section id="toolkit" className={s.section}>
          <div className={s.shell}>
            <div className={s.sectionHead}>
              <p className={s.rail}>§ 03 / Toolkit</p>
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
                <p className={s.rail}>§ 04 / Contact</p>
                <h2>Say hello</h2>
                <p className={s.lede}>
                  Open to NetSuite work, data projects and web problems. I read everything that comes in.
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
        <div className={s.shell}>
          <Onward current="/" />
        </div>
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

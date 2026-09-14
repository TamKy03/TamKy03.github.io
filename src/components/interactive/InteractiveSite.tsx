"use client";

import {
  Fragment,
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
  type FormEvent,
  type PointerEvent,
  type ReactNode,
} from "react";
import { Reveal } from "@/components/Reveal";
import { VersionBar } from "@/components/VersionBar";
import { useInView, useMediaQuery, useReducedMotion } from "@/components/hooks";
import {
  codeInstructor,
  degree,
  foundation,
  internship,
  netsuiteRole,
  period,
  profile,
  programmeRep,
  university,
  weiqiClub,
} from "@/content/profile";
import { cx, monthsSince } from "@/lib/utils";
import { CommandPalette, type Command } from "./CommandPalette";
import { NetworkCanvas } from "./NetworkCanvas";
import s from "./interactive.module.css";

type Theme = "dark" | "light";
type EntryType = "work" | "education" | "leadership";
type Filter = "all" | EntryType;

const rv = { reveal: s.reveal, visible: s.visible };
const dash = " — ";

const roles = [profile.title, "SuiteScript 2.1 developer", "Integration builder", "Data Science graduate"];

const navLinks = [
  { id: "about", label: "About" },
  { id: "journey", label: "Journey" },
  { id: "skills", label: "Skills" },
  { id: "contact", label: "Contact" },
];
const sectionIds = ["home", ...navLinks.map((link) => link.id)];

const filters: { key: Filter; label: string }[] = [
  { key: "all", label: "All" },
  { key: "work", label: "Work" },
  { key: "education", label: "Education" },
  { key: "leadership", label: "Leadership" },
];

const badgeClass: Record<EntryType, string> = {
  work: s.work,
  education: s.education,
  leadership: s.leadership,
};

const skillCards: { glyph: string; title: string; text: string; level?: number }[] = [
  { glyph: "ss", title: "SuiteScript 2.1", text: "User Event, Client, Suitelet, Scheduled and Map/Reduce scripts on Oracle NetSuite." },
  { glyph: "⚙", title: "Business Process Automation", text: "Order-to-Cash and Procure-to-Pay validation, approval workflows and downstream logic." },
  { glyph: "⇄", title: "System Integration", text: "Bank EFT Host-to-Host, SFTP, PGP encryption and REST Web Services." },
  { glyph: "sq", title: "SuiteQL & Saved Searches", text: "Operational and management reporting, tuned for large datasets." },
  { glyph: "</>", title: "Advanced PDF/HTML & FreeMarker", text: "Transaction document templates and bank file templating." },
  { glyph: "git", title: "SDF, Git & CI/CD", text: "Multi-developer workflows with a structured branching strategy." },
  { glyph: "py", title: "Python · Java · SQL", text: "Intermediate, from my Data Science degree.", level: 3 },
  { glyph: "中", title: "English · Chinese", text: "Spoken & written.", level: 3 },
];

const profileJson: [string, string | string[]][] = [
  ["name", profile.name],
  ["role", profile.title],
  ["company", profile.company],
  ["platform", "Oracle NetSuite"],
  ["processes", ["O2C", "P2P"]],
  ["stack", ["SuiteScript 2.1", "SuiteQL", "Python", "SQL"]],
  ["degree", "BCS (Hons) Data Science"],
  ["based_in", "Greater Kuala Lumpur, MY"],
  ["plays", "Weiqi (Go)"],
];

// Applies the saved theme before first paint to avoid a dark/light flash.
const themeScript = `try{var t=localStorage.getItem("v3-theme");if(t==="light"||t==="dark")document.currentScript.parentElement.dataset.theme=t}catch(e){}`;

function TypedRoles({ reduced }: { reduced: boolean }) {
  const [text, setText] = useState(roles[0]);

  useEffect(() => {
    if (reduced) {
      setText(roles[0]);
      return;
    }
    let roleIndex = 0;
    let charIndex = roles[0].length;
    let deleting = true;
    let timer: number;

    const tick = () => {
      const word = roles[roleIndex];
      charIndex += deleting ? -1 : 1;
      setText(word.slice(0, charIndex));
      let delay = deleting ? 35 : 70;
      if (!deleting && charIndex === word.length) {
        deleting = true;
        delay = 1800;
      } else if (deleting && charIndex === 0) {
        deleting = false;
        roleIndex = (roleIndex + 1) % roles.length;
        delay = 300;
      }
      timer = window.setTimeout(tick, delay);
    };

    timer = window.setTimeout(tick, 2000);
    return () => window.clearTimeout(timer);
  }, [reduced]);

  return <span className={s.typed}>{text}</span>;
}

function CountStat({
  label,
  value = 0,
  since,
  decimals = 0,
  suffix = "",
  reduced,
}: {
  label: string;
  value?: number;
  since?: string;
  decimals?: number;
  suffix?: string;
  reduced: boolean;
}) {
  const [ref, inView] = useInView<HTMLDivElement>();
  const [shown, setShown] = useState("0");

  useEffect(() => {
    if (!inView) return;
    const target = since ? monthsSince(since) : value;
    if (reduced) {
      setShown(target.toFixed(decimals) + suffix);
      return;
    }
    const start = performance.now();
    const duration = 1400;
    let frame = 0;
    const step = (now: number) => {
      const t = Math.min((now - start) / duration, 1);
      const eased = 1 - Math.pow(1 - t, 3);
      setShown((target * eased).toFixed(decimals) + suffix);
      if (t < 1) frame = requestAnimationFrame(step);
    };
    frame = requestAnimationFrame(step);
    return () => cancelAnimationFrame(frame);
  }, [inView, since, value, decimals, suffix, reduced]);

  return (
    <div ref={ref} className={s.stat}>
      <strong>{shown}</strong>
      <span>{label}</span>
    </div>
  );
}

function JourneyEntry({
  when,
  type,
  badge,
  title,
  where,
  children,
}: {
  when: string;
  type: EntryType;
  badge: string;
  title: string;
  where: string;
  children?: ReactNode;
}) {
  return (
    <Reveal as="li" className={s.entry} classes={rv}>
      <div className={cx(s.when, s.mono)}>{when}</div>
      <div className={s.body}>
        <span className={cx(s.badge, badgeClass[type])}>{badge}</span>
        <h3>{title}</h3>
        <p className={s.where}>{where}</p>
        {children}
      </div>
    </Reveal>
  );
}

function Bullets({ items }: { items: string[] }) {
  return (
    <ul>
      {items.map((item) => (
        <li key={item}>{item}</li>
      ))}
    </ul>
  );
}

function Tags({ items }: { items: string[] }) {
  return (
    <div className={s.tags}>
      {items.map((item) => (
        <span key={item}>{item}</span>
      ))}
    </div>
  );
}

export function InteractiveSite() {
  const rootRef = useRef<HTMLDivElement>(null);
  const progressRef = useRef<HTMLDivElement>(null);
  const toastTimer = useRef<number | undefined>(undefined);
  const reduced = useReducedMotion();
  const canHover = useMediaQuery("(hover: hover)");

  const [theme, setTheme] = useState<Theme>("dark");
  const [active, setActive] = useState("home");
  const [filter, setFilter] = useState<Filter>("all");
  const [photoOk, setPhotoOk] = useState(true);
  const [paletteOpen, setPaletteOpen] = useState(false);
  const [toastMessage, setToastMessage] = useState("");
  const [toastVisible, setToastVisible] = useState(false);
  const [year] = useState(() => new Date().getFullYear());

  useEffect(() => {
    try {
      const saved = localStorage.getItem("v3-theme");
      if (saved === "light" || saved === "dark") setTheme(saved);
    } catch {}
  }, []);

  const toggleTheme = useCallback(() => {
    setTheme((current) => {
      const next: Theme = current === "light" ? "dark" : "light";
      try {
        localStorage.setItem("v3-theme", next);
      } catch {}
      return next;
    });
  }, []);

  // Scroll progress bar and active nav link
  useEffect(() => {
    const onScroll = () => {
      const max = document.documentElement.scrollHeight - window.innerHeight;
      if (progressRef.current) progressRef.current.style.transform = `scaleX(${max > 0 ? window.scrollY / max : 0})`;
      let current = sectionIds[0];
      for (const id of sectionIds) {
        const el = document.getElementById(id);
        if (el && el.getBoundingClientRect().top < window.innerHeight * 0.4) current = id;
      }
      setActive(current);
    };
    window.addEventListener("scroll", onScroll, { passive: true });
    onScroll();
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  // Ctrl/⌘ + K toggles the command palette
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
      showToast("Email copied to clipboard");
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
      { label: "Go to About", hint: "section", run: () => goTo("about") },
      { label: "Go to Journey", hint: "section", run: () => goTo("journey") },
      { label: "Go to Skills", hint: "section", run: () => goTo("skills") },
      { label: "Go to Contact", hint: "section", run: () => goTo("contact") },
      { label: "Show work experience", hint: "filter", run: () => { setFilter("work"); goTo("journey"); } },
      { label: "Show education", hint: "filter", run: () => { setFilter("education"); goTo("journey"); } },
      { label: "Show leadership", hint: "filter", run: () => { setFilter("leadership"); goTo("journey"); } },
      { label: "Copy email address", hint: "action", run: copyEmail },
      { label: "Open LinkedIn", hint: "link", run: () => window.open(profile.linkedin, "_blank", "noopener") },
      { label: "Toggle light / dark theme", hint: "action", run: toggleTheme },
      { label: "Back to top", hint: "section", run: () => goTo("home") },
      { label: "View other site versions", hint: "link", run: () => { window.location.href = "/versions/"; } },
    ],
    [copyEmail, goTo, toggleTheme],
  );

  const onTiltMove = (e: PointerEvent<HTMLElement>) => {
    if (reduced || !canHover) return;
    const card = e.currentTarget;
    const rect = card.getBoundingClientRect();
    const x = (e.clientX - rect.left) / rect.width;
    const y = (e.clientY - rect.top) / rect.height;
    card.style.setProperty("--mx", `${x * 100}%`);
    card.style.setProperty("--my", `${y * 100}%`);
    card.style.transform = `perspective(700px) rotateX(${(0.5 - y) * 8}deg) rotateY(${(x - 0.5) * 8}deg)`;
  };
  const onTiltLeave = (e: PointerEvent<HTMLElement>) => {
    e.currentTarget.style.transform = "";
  };

  const onContactSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const data = new FormData(e.currentTarget);
    const body = `${data.get("message")}\n\n— ${data.get("name")}`;
    window.location.href = `mailto:${profile.email}?subject=${encodeURIComponent(String(data.get("subject")))}&body=${encodeURIComponent(body)}`;
  };

  const show = (type: EntryType) => filter === "all" || filter === type;

  return (
    <div ref={rootRef} className={s.root} data-theme={theme} suppressHydrationWarning>
      <script dangerouslySetInnerHTML={{ __html: themeScript }} />
      <div ref={progressRef} className={s.progress} />

      <VersionBar current="interactive" />

      <header className={s.nav}>
        <div className={cx(s.container, s.navInner)}>
          <a className={s.brand} href="#home">
            <span className={s.mono}>&lt;</span>TKY<span className={s.mono}>/&gt;</span>
          </a>
          <nav className={s.links} aria-label="Primary">
            {navLinks.map((link) => (
              <a key={link.id} href={`#${link.id}`} className={active === link.id ? s.active : undefined}>
                {link.label}
              </a>
            ))}
          </nav>
          <div className={s.actions}>
            <button type="button" className={s.kbdBtn} onClick={() => setPaletteOpen(true)} aria-label="Open command palette">
              <span className={s.mono}>⌘K</span>
            </button>
            <button type="button" className={s.iconBtn} onClick={toggleTheme} aria-label="Toggle colour theme">
              ◐
            </button>
          </div>
        </div>
      </header>

      <main>
        {/* HERO */}
        <section className={s.hero} id="home">
          <NetworkCanvas className={s.net} themeRoot={rootRef} reduced={reduced} />
          <div className={cx(s.container, s.heroInner)}>
            <div>
              <p className={cx(s.mono, s.prompt)}>&gt; print(hello_world)</p>
              <h1>{profile.name}</h1>
              <p className={s.typedLine}>
                <TypedRoles reduced={reduced} />
                <span className={s.caret} aria-hidden="true" />
              </p>
              <p className={s.lede}>
                I build customisation, automation and integration solutions on Oracle NetSuite at BlackOak Consulting,
                turning Order-to-Cash and Procure-to-Pay requirements into working system logic.
              </p>
              <div className={s.cta}>
                <a className={cx(s.btn, s.primary)} href="#journey">
                  Explore my journey
                </a>
                <a className={cx(s.btn, s.ghost)} href={profile.linkedin} target="_blank" rel="noopener">
                  LinkedIn ↗
                </a>
              </div>
            </div>
            <div className={cx(s.avatar, !photoOk && s.noPhoto)}>
              <div className={s.ring} />
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={profile.photo}
                alt="Portrait of Tam Kok Yan"
                width={280}
                height={321}
                onError={() => setPhotoOk(false)}
              />
              <span className={s.initials} aria-hidden="true">
                TKY
              </span>
            </div>
          </div>

          <div className={cx(s.container, s.stats)}>
            <CountStat label="Months at BlackOak" since={profile.blackoakStart} reduced={reduced} />
            <CountStat label="Records per SFTP export" value={1} suffix="M+" reduced={reduced} />
            <div className={s.stat}>
              <strong>REST API</strong>
              <span>Web Services for custom record workflows</span>
            </div>
            <CountStat label="Bachelor's CGPA" value={3.81} decimals={2} reduced={reduced} />
          </div>
        </section>

        {/* ABOUT */}
        <section className={s.section} id="about">
          <div className={cx(s.container, s.split)}>
            <Reveal classes={rv}>
              <p className={cx(s.kicker, s.mono)}>01 · about</p>
              <h2>From data science to enterprise systems.</h2>
              <p>
                I&apos;m a {profile.title} at {profile.company} in Subang Jaya. I develop SuiteScript 2.1
                customisations, approval workflows and high-volume integrations, and translate Order-to-Cash and
                Procure-to-Pay requirements into working system logic. I joined as a student intern in November 2024 and
                moved into the consultant role in May 2025.
              </p>
              <p>
                I graduated from TARUMT with a {degree.title} and a CGPA of {degree.cgpa}. While studying, I taught
                Scratch and Python to young students at Codekidz and served as a Programme Representative for my
                faculty.
              </p>
            </Reveal>
            <Reveal as="pre" className={s.code} classes={rv} aria-label="Profile summary">
              <code>
                <span className={s.comment}>{"// profile.json"}</span>
                {"\n{\n"}
                {profileJson.map(([key, value], i) => (
                  <Fragment key={key}>
                    {"  "}
                    <span className={s.key}>&quot;{key}&quot;</span>
                    {": "}
                    {Array.isArray(value) ? (
                      <>
                        [
                        {value.map((item, j) => (
                          <Fragment key={item}>
                            {j > 0 && ", "}
                            <span className={s.str}>&quot;{item}&quot;</span>
                          </Fragment>
                        ))}
                        ]
                      </>
                    ) : (
                      <span className={s.str}>&quot;{value}&quot;</span>
                    )}
                    {i < profileJson.length - 1 ? "," : ""}
                    {"\n"}
                  </Fragment>
                ))}
                {"}"}
              </code>
            </Reveal>
          </div>
        </section>

        {/* JOURNEY */}
        <section className={cx(s.section, s.alt)} id="journey">
          <div className={s.container}>
            <Reveal as="p" className={cx(s.kicker, s.mono)} classes={rv}>
              02 · journey
            </Reveal>
            <Reveal as="h2" classes={rv}>
              Experience, education &amp; leadership
            </Reveal>

            <Reveal className={s.filters} classes={rv} role="tablist" aria-label="Filter journey">
              {filters.map((f) => (
                <button
                  key={f.key}
                  type="button"
                  role="tab"
                  aria-selected={filter === f.key}
                  className={cx(s.chip, filter === f.key && s.active)}
                  onClick={() => setFilter(f.key)}
                >
                  {f.label}
                </button>
              ))}
            </Reveal>

            <ol className={s.journey}>
              {show("work") && (
                <JourneyEntry
                  type="work"
                  when={period(netsuiteRole.period, dash)}
                  badge={`Work · ${netsuiteRole.employment}`}
                  title={netsuiteRole.title}
                  where={`${netsuiteRole.org} · ${netsuiteRole.place}`}
                >
                  <p className={s.summary}>{netsuiteRole.summary}</p>
                  <div className={s.groups}>
                    {netsuiteRole.groups.map((group, i) => (
                      <details key={group.title} open={i === 0}>
                        <summary>{group.title}</summary>
                        <Bullets items={group.items} />
                      </details>
                    ))}
                  </div>
                  <Tags items={netsuiteRole.tags} />
                </JourneyEntry>
              )}
              {show("education") && (
                <JourneyEntry
                  type="education"
                  when={period(degree.period, dash)}
                  badge="Education"
                  title={degree.title}
                  where={`${university} · KL Main Campus`}
                >
                  <p className={s.gpa}>
                    CGPA <strong>{degree.cgpa}</strong>
                  </p>
                </JourneyEntry>
              )}
              {show("work") && (
                <JourneyEntry
                  type="work"
                  when={period(internship.period, dash)}
                  badge="Work"
                  title={internship.title}
                  where={`${internship.org} · ${internship.place}`}
                >
                  <Tags items={internship.tags} />
                </JourneyEntry>
              )}
              {show("leadership") && (
                <JourneyEntry
                  type="leadership"
                  when={period(programmeRep.period, dash)}
                  badge="Leadership"
                  title={programmeRep.title}
                  where={programmeRep.org}
                >
                  <Bullets items={programmeRep.bullets} />
                </JourneyEntry>
              )}
              {show("work") && (
                <JourneyEntry
                  type="work"
                  when={period(codeInstructor.period, dash)}
                  badge="Work"
                  title={`${codeInstructor.title} (${codeInstructor.employment})`}
                  where={`${codeInstructor.org} · Kuchai Exchange, ${codeInstructor.place}`}
                >
                  <Bullets items={codeInstructor.bullets} />
                  <Tags items={codeInstructor.tags} />
                </JourneyEntry>
              )}
              {show("leadership") && (
                <JourneyEntry
                  type="leadership"
                  when={period(weiqiClub.period, dash)}
                  badge="Leadership"
                  title={weiqiClub.title}
                  where={weiqiClub.org}
                >
                  <Bullets items={weiqiClub.bullets} />
                </JourneyEntry>
              )}
              {show("education") && (
                <JourneyEntry
                  type="education"
                  when={period(foundation.period, dash)}
                  badge="Education"
                  title={foundation.title}
                  where={`${university} · KL Main Campus`}
                >
                  <p className={s.gpa}>
                    CGPA <strong>{foundation.cgpa}</strong>
                  </p>
                </JourneyEntry>
              )}
            </ol>
          </div>
        </section>

        {/* SKILLS */}
        <section className={s.section} id="skills">
          <div className={s.container}>
            <Reveal as="p" className={cx(s.kicker, s.mono)} classes={rv}>
              03 · skills
            </Reveal>
            <Reveal as="h2" classes={rv}>
              Toolbox
            </Reveal>
            <div className={s.skillGrid}>
              {skillCards.map((card) => (
                <Reveal
                  as="article"
                  key={card.title}
                  className={s.skill}
                  classes={rv}
                  onPointerMove={onTiltMove}
                  onPointerLeave={onTiltLeave}
                >
                  <span className={cx(s.glyph, s.mono)}>{card.glyph}</span>
                  <h3>{card.title}</h3>
                  <p>{card.text}</p>
                  {card.level ? (
                    <div className={s.dots} aria-label="Intermediate">
                      {Array.from({ length: 5 }, (_, k) => (
                        <i key={k} className={k < (card.level ?? 0) ? s.on : undefined} />
                      ))}
                    </div>
                  ) : null}
                </Reveal>
              ))}
            </div>
          </div>
        </section>

        {/* CONTACT */}
        <section className={cx(s.section, s.alt)} id="contact">
          <div className={cx(s.container, s.split)}>
            <Reveal classes={rv}>
              <p className={cx(s.kicker, s.mono)}>04 · contact</p>
              <h2>Let&apos;s connect.</h2>
              <p>Happy to talk about Oracle NetSuite, SuiteScript, integrations, data and technology.</p>
              <div className={s.contactLinks}>
                <button type="button" className={cx(s.btn, s.primary)} onClick={copyEmail}>
                  Copy email
                </button>
                <a className={cx(s.btn, s.ghost)} href={profile.linkedin} target="_blank" rel="noopener">
                  LinkedIn ↗
                </a>
              </div>
              <p className={cx(s.muted, s.small)}>References available on request.</p>
            </Reveal>
            <Reveal as="form" className={s.form} classes={rv} onSubmit={onContactSubmit}>
              <label>
                Your name
                <input name="name" required autoComplete="name" />
              </label>
              <label>
                Subject
                <input name="subject" required placeholder="Let's talk about…" />
              </label>
              <label>
                Message
                <textarea name="message" rows={5} required />
              </label>
              <button className={cx(s.btn, s.primary)} type="submit">
                Open in email app →
              </button>
            </Reveal>
          </div>
        </section>
      </main>

      <footer className={s.footer}>
        <div className={cx(s.container, s.footerInner)}>
          <span>
            © <span suppressHydrationWarning>{year}</span> {profile.name}
          </span>
          <span className={cx(s.muted, s.mono)}>
            Press <kbd className={s.kbd}>Ctrl</kbd> + <kbd className={s.kbd}>K</kbd> to navigate ·{" "}
            <a href="/versions/">Other versions</a>
          </span>
        </div>
      </footer>

      <CommandPalette open={paletteOpen} onClose={() => setPaletteOpen(false)} commands={commands} />
      <div className={cx(s.toast, toastVisible && s.show)} role="status" aria-live="polite">
        {toastMessage}
      </div>
    </div>
  );
}

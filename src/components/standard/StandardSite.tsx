"use client";

import { useEffect, useState, type CSSProperties } from "react";
import { Reveal } from "@/components/Reveal";
import { VersionBar } from "@/components/VersionBar";
import { useInView } from "@/components/hooks";
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
  programmingLanguages,
  spokenLanguages,
  university,
  weiqiClub,
} from "@/content/profile";
import { cx } from "@/lib/utils";
import s from "./standard.module.css";

type Theme = "light" | "dark";

const rv = { reveal: s.reveal, visible: s.visible };

const sections = [
  { id: "about", label: "About" },
  { id: "experience", label: "Experience" },
  { id: "education", label: "Education" },
  { id: "skills", label: "Skills" },
  { id: "contact", label: "Contact" },
];

// Applies the saved theme before first paint to avoid a light/dark flash.
const themeScript = `try{var t=localStorage.getItem("theme");if(t==="light"||t==="dark")document.currentScript.parentElement.dataset.theme=t}catch(e){}`;

function Bullets({ items }: { items: string[] }) {
  return (
    <ul>
      {items.map((item) => (
        <li key={item}>{item}</li>
      ))}
    </ul>
  );
}

function MeterCard({ title, items }: { title: string; items: string[] }) {
  const [ref, inView] = useInView<HTMLDivElement>();
  return (
    <div ref={ref} className={cx(s.card, s.reveal, inView && s.visible)}>
      <h3>{title}</h3>
      <ul className={cx(s.meters, inView && s.filled)}>
        {items.map((name) => (
          <li key={name}>
            <span>{name}</span>
            <span className={s.lvl}>Intermediate</span>
            <i style={{ "--v": "60%" } as CSSProperties} />
          </li>
        ))}
      </ul>
    </div>
  );
}

function PillCard({ title, items, wide }: { title: string; items: string[]; wide?: boolean }) {
  return (
    <Reveal className={cx(s.card, wide && s.wide)} classes={rv}>
      <h3>{title}</h3>
      <ul className={s.pills}>
        {items.map((item) => (
          <li key={item}>{item}</li>
        ))}
      </ul>
    </Reveal>
  );
}

export function StandardSite() {
  const [theme, setTheme] = useState<Theme | null>(null);
  const [menuOpen, setMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [showTop, setShowTop] = useState(false);
  const [active, setActive] = useState<string | null>(null);
  const [photoOk, setPhotoOk] = useState(true);
  const [year] = useState(() => new Date().getFullYear());

  useEffect(() => {
    try {
      const saved = localStorage.getItem("theme");
      if (saved === "light" || saved === "dark") setTheme(saved);
    } catch {}
  }, []);

  useEffect(() => {
    const onScroll = () => {
      setScrolled(scrollY > 10);
      setShowTop(scrollY > 600);
    };
    addEventListener("scroll", onScroll, { passive: true });
    onScroll();
    return () => removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) setActive(entry.target.id);
        });
      },
      { rootMargin: "-45% 0px -50% 0px" },
    );
    sections.forEach(({ id }) => {
      const el = document.getElementById(id);
      if (el) observer.observe(el);
    });
    return () => observer.disconnect();
  }, []);

  const toggleTheme = () => {
    const dark = theme ? theme === "dark" : matchMedia("(prefers-color-scheme: dark)").matches;
    const next: Theme = dark ? "light" : "dark";
    setTheme(next);
    try {
      localStorage.setItem("theme", next);
    } catch {}
  };

  return (
    <div className={s.root} data-theme={theme ?? undefined} suppressHydrationWarning>
      <script dangerouslySetInnerHTML={{ __html: themeScript }} />
      <a className={s.skip} href="#main">
        Skip to content
      </a>

      {/* The #top anchor sits on the non-sticky bar so back-to-top scrolls all the way up */}
      <VersionBar current="standard" id="top" />

      <header className={cx(s.nav, scrolled && s.scrolled)}>
        <div className={cx(s.container, s.navInner)}>
          <a className={s.brand} href="#top">
            TKY<span>.</span>
          </a>
          <nav id="menu" className={cx(s.menu, menuOpen && s.open)} aria-label="Primary">
            {sections.map((section) => (
              <a
                key={section.id}
                href={`#${section.id}`}
                className={active === section.id ? s.active : undefined}
                onClick={() => setMenuOpen(false)}
              >
                {section.label}
              </a>
            ))}
          </nav>
          <div className={s.navActions}>
            <button type="button" className={s.iconBtn} onClick={toggleTheme} aria-label="Toggle dark mode">
              ◐
            </button>
            <button
              type="button"
              className={cx(s.iconBtn, s.menuBtn)}
              onClick={() => setMenuOpen((open) => !open)}
              aria-label="Open menu"
              aria-expanded={menuOpen}
              aria-controls="menu"
            >
              {menuOpen ? "✕" : "☰"}
            </button>
          </div>
        </div>
      </header>

      <main id="main">
        <section className={s.hero}>
          <div className={cx(s.container, s.heroInner)}>
            <Reveal classes={rv}>
              <p className={s.eyebrow}>Hello, I&apos;m</p>
              <h1>{profile.name}</h1>
              <p className={s.role}>
                <strong>{profile.title}</strong> at <strong>{profile.company}</strong>. Data Science graduate of TARUMT.
              </p>
              <div className={s.cta}>
                <a className={cx(s.btn, s.primary)} href="#contact">
                  Get in touch
                </a>
                <a className={cx(s.btn, s.ghost)} href={profile.linkedin} target="_blank" rel="noopener">
                  LinkedIn
                </a>
              </div>
            </Reveal>
            {photoOk && (
              <Reveal className={s.heroPhoto} classes={rv}>
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={profile.photo}
                  alt="Portrait of Tam Kok Yan"
                  width={320}
                  height={400}
                  onError={() => setPhotoOk(false)}
                />
              </Reveal>
            )}
          </div>
        </section>

        <section id="about" className={s.section}>
          <Reveal className={cx(s.container, s.narrow)} classes={rv}>
            <h2 className={s.title}>About</h2>
            <p>
              I&apos;m a {profile.title} at {profile.company} in Subang Jaya. I deliver technical customisation,
              automation and integration solutions, working across Order-to-Cash and Procure-to-Pay processes to
              translate business requirements into working system logic. I joined as a student intern in November 2024
              and moved into the consultant role in May 2025.
            </p>
            <p>
              I hold a Bachelor of Computer Science (Honours) in Data Science from TARUMT. While studying, I taught
              coding to primary and secondary school students and served as a Programme Representative for my faculty.
            </p>
          </Reveal>
        </section>

        <section id="experience" className={cx(s.section, s.alt)}>
          <div className={cx(s.container, s.narrow)}>
            <Reveal as="h2" className={s.title} classes={rv}>
              Experience &amp; Leadership
            </Reveal>
            <ol className={s.timeline}>
              <Reveal as="li" classes={rv}>
                <span className={s.date}>
                  {period(netsuiteRole.period)} · {netsuiteRole.employment}
                </span>
                <h3>{netsuiteRole.title}</h3>
                <p className={s.org}>
                  {netsuiteRole.org} · {netsuiteRole.place}
                </p>
                <p className={s.leadIn}>{netsuiteRole.summary}</p>
                {netsuiteRole.groups.map((group) => (
                  <div key={group.title}>
                    <h4>{group.title}</h4>
                    <Bullets items={group.items} />
                  </div>
                ))}
              </Reveal>
              <Reveal as="li" classes={rv}>
                <span className={s.date}>{period(internship.period)}</span>
                <h3>{internship.title}</h3>
                <p className={s.org}>
                  {internship.org} · {internship.place}
                </p>
              </Reveal>
              <Reveal as="li" classes={rv}>
                <span className={s.date}>{period(codeInstructor.period)}</span>
                <h3>
                  {codeInstructor.title} <small>({codeInstructor.employment})</small>
                </h3>
                <p className={s.org}>
                  {codeInstructor.org} · {codeInstructor.place}
                </p>
                <Bullets items={codeInstructor.bullets} />
              </Reveal>
              <Reveal as="li" classes={rv}>
                <span className={s.date}>{period(programmeRep.period)}</span>
                <h3>{programmeRep.title}</h3>
                <p className={s.org}>{programmeRep.org}</p>
                <Bullets items={programmeRep.bullets} />
              </Reveal>
              <Reveal as="li" classes={rv}>
                <span className={s.date}>{period(weiqiClub.period)}</span>
                <h3>{weiqiClub.title}</h3>
                <p className={s.org}>{weiqiClub.org}</p>
                <Bullets items={weiqiClub.bullets} />
              </Reveal>
            </ol>
          </div>
        </section>

        <section id="education" className={s.section}>
          <div className={s.container}>
            <Reveal as="h2" className={s.title} classes={rv}>
              Education
            </Reveal>
            <div className={s.cards}>
              {[degree, foundation].map((item) => (
                <Reveal as="article" key={item.title} className={s.card} classes={rv}>
                  <span className={s.date}>{period(item.period)}</span>
                  <h3>{item.title}</h3>
                  <p>{university}, KL Main Campus</p>
                  <p className={s.gpa}>
                    CGPA <strong>{item.cgpa}</strong>
                  </p>
                </Reveal>
              ))}
            </div>
          </div>
        </section>

        <section id="skills" className={cx(s.section, s.alt)}>
          <div className={s.container}>
            <Reveal as="h2" className={s.title} classes={rv}>
              Skills
            </Reveal>
            <div className={s.cards}>
              <PillCard title="Oracle NetSuite" items={netsuiteSkills} wide />
              <PillCard title="Integration & Engineering" items={integrationSkills} />
              <MeterCard title="Programming" items={programmingLanguages} />
              <MeterCard title="Languages" items={spokenLanguages} />
            </div>
          </div>
        </section>

        <section id="contact" className={s.section}>
          <Reveal className={cx(s.container, s.narrow, s.center)} classes={rv}>
            <h2 className={s.title}>Let&apos;s connect</h2>
            <p>Happy to talk about Oracle NetSuite, SuiteScript, integrations, data and technology.</p>
            <div className={s.cta}>
              <a className={cx(s.btn, s.primary)} href={`mailto:${profile.email}`}>
                {profile.email}
              </a>
              <a className={cx(s.btn, s.ghost)} href={profile.linkedin} target="_blank" rel="noopener">
                LinkedIn
              </a>
            </div>
            <p className={cx(s.muted, s.small)}>References available on request.</p>
          </Reveal>
        </section>
      </main>

      <footer className={s.footer}>
        <div className={s.container}>
          © <span suppressHydrationWarning>{year}</span> {profile.name} · {profile.location}
        </div>
      </footer>

      <a href="#top" className={cx(s.toTop, showTop && s.show)} aria-label="Back to top">
        ↑
      </a>
    </div>
  );
}

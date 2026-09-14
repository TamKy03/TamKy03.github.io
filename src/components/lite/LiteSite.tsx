import { VersionBar } from "@/components/VersionBar";
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
import s from "./lite.module.css";

function Bullets({ items }: { items: string[] }) {
  return (
    <ul>
      {items.map((item) => (
        <li key={item}>{item}</li>
      ))}
    </ul>
  );
}

function LevelList({ items }: { items: string[] }) {
  return (
    <ul>
      {items.map((item) => (
        <li key={item} className={s.skill}>
          {item} <em>Intermediate</em>
        </li>
      ))}
    </ul>
  );
}

export function LiteSite() {
  return (
    <div className={s.root}>
      <VersionBar current="lite" />

      <div className={s.page}>
        <aside className={s.side}>
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img className={s.photo} src={profile.photo} alt="Portrait of Tam Kok Yan" width={244} height={305} />

          <h2>Contact</h2>
          <ul>
            <li>
              <a href={`mailto:${profile.email}`}>{profile.email}</a>
            </li>
            <li>
              <a href={profile.linkedin}>linkedin.com/in/kytam0330</a>
            </li>
            <li>{profile.location}</li>
          </ul>

          <h2>Education</h2>
          <div className={s.edu}>
            <strong>{degree.title}</strong>
            <span>{university} (TARUMT), KL Main Campus</span>
            <span>
              {period(degree.period)} · CGPA {degree.cgpa}
            </span>
          </div>
          <div className={s.edu}>
            <strong>{foundation.title}</strong>
            <span>TARUMT, KL Main Campus</span>
            <span>
              {period(foundation.period)} · CGPA {foundation.cgpa}
            </span>
          </div>

          <h2>Oracle NetSuite</h2>
          <ul className={s.chips}>
            {netsuiteSkills.map((skill) => (
              <li key={skill}>{skill}</li>
            ))}
          </ul>

          <h2>Integration &amp; Tools</h2>
          <ul className={s.chips}>
            {integrationSkills.map((skill) => (
              <li key={skill}>{skill}</li>
            ))}
          </ul>

          <h2>Programming</h2>
          <LevelList items={programmingLanguages} />

          <h2>Languages</h2>
          <LevelList items={spokenLanguages} />
        </aside>

        <main className={s.main}>
          <header className={s.banner}>
            <h1>TAM KOK YAN</h1>
            <p>
              {profile.title} @ {profile.company} · Data Science Graduate
            </p>
          </header>

          <section className={s.section}>
            <h2>Experience</h2>
            <p className={s.company}>
              {netsuiteRole.org} · {netsuiteRole.place}
            </p>
            <div className={s.item}>
              <h3>{netsuiteRole.title}</h3>
              <p className={s.meta}>
                {netsuiteRole.employment} · {period(netsuiteRole.period)}
              </p>
              <p className={s.summary}>{netsuiteRole.summary}</p>
              {netsuiteRole.groups.map((group) => (
                <div key={group.title}>
                  <h4>{group.title}</h4>
                  <Bullets items={group.items} />
                </div>
              ))}
            </div>
            <div className={s.item}>
              <h3>{internship.title}</h3>
              <p className={s.meta}>{period(internship.period)}</p>
            </div>

            <p className={s.company}>
              {codeInstructor.org} · {codeInstructor.place}
            </p>
            <div className={s.item}>
              <h3>
                {codeInstructor.title} ({codeInstructor.employment})
              </h3>
              <p className={s.meta}>{period(codeInstructor.period)}</p>
              <Bullets items={codeInstructor.bullets} />
            </div>
          </section>

          <section className={s.section}>
            <h2>Activities &amp; Associations</h2>
            <div className={s.item}>
              <h3>{programmeRep.title}</h3>
              <p className={s.meta}>
                {programmeRep.org} · {period(programmeRep.period)}
              </p>
              <Bullets items={programmeRep.bullets} />
            </div>
            <div className={s.item}>
              <h3>{weiqiClub.title}</h3>
              <p className={s.meta}>
                {weiqiClub.org} · {period(weiqiClub.period)}
              </p>
              <Bullets items={weiqiClub.bullets} />
            </div>
          </section>

          <section className={s.section}>
            <h2>References</h2>
            <p>Available on request.</p>
          </section>
        </main>
      </div>
    </div>
  );
}

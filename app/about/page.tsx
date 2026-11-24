import type { Metadata } from "next";
import Image from "next/image";
import type { ReactNode } from "react";
import {
  FaDownload,
  FaEnvelope,
  FaGlobe,
  FaGithub,
  FaLinkedinIn,
  FaLocationDot,
  FaPhone,
} from "react-icons/fa6";
import PageShell from "@/components/PageShell";
import { CV, type CvEntry, type CvProjectGroup } from "@/lib/cv";
import { SKILL_CATEGORIES } from "@/lib/skills";
import { ACCENT_BG } from "@/lib/navigation";

export const metadata: Metadata = {
  title: "About me",
  description:
    "CV of Danylo Kalynovskyi: education, experience, skills and contact.",
};

export default function AboutPage() {
  return (
    <PageShell current="about" eyebrow="01 · curriculum vitae" title="about me">
      <div className="mx-auto grid max-w-6xl gap-10 px-5 py-12 sm:px-8 sm:py-16 lg:grid-cols-[minmax(0,20rem)_minmax(0,1fr)] lg:gap-14">
        <ProfileColumn />

        <div className="flex min-w-0 flex-col gap-10">
          <CvBlock label="profile">
            <div className="p-5 sm:p-6">
              {/* normal capitalisation on purpose: the rest of the site is lowercase,
                  but a CV should show the name the way it's written */}
              <p className="break-words font-display text-4xl font-semibold leading-none text-ink sm:text-5xl">
                {CV.name}
              </p>
              <p className="mb-4 mt-2 font-display text-xl leading-tight text-ink/80 sm:text-2xl">
                {CV.headline}
              </p>
              <p className="font-body text-lg leading-relaxed text-ink/90">
                {CV.profile}
              </p>
              <ul className="mt-5 flex flex-wrap gap-2">
                {CV.focus.map((tag, i) => (
                  <li
                    key={tag}
                    className={`border-[3px] border-ink px-3 py-1 font-body text-sm font-semibold text-ink ${
                      [ACCENT_BG.yellow, ACCENT_BG.blue, ACCENT_BG.orange, "bg-cream"][i % 4]
                    }`}
                  >
                    {tag}
                  </li>
                ))}
              </ul>
            </div>
          </CvBlock>

          {CV.experience.length > 0 && (
            <CvBlock label="experience">
              <EntryRows entries={CV.experience} />
            </CvBlock>
          )}

          <CvBlock label="skills">
            <dl>
              {SKILL_CATEGORIES.map((cat, i) => (
                <Row key={cat.title} first={i === 0}>
                  <dt className="flex items-start gap-2 font-body text-sm font-bold uppercase tracking-wide">
                    <span
                      aria-hidden="true"
                      className={`mt-1 h-3 w-3 shrink-0 border-2 border-ink ${ACCENT_BG[cat.accent]}`}
                    />
                    {cat.title}
                  </dt>
                  <dd>
                    <ul className="flex flex-wrap gap-2">
                      {cat.items.map(({ name, icon: Icon }) => (
                        <li
                          key={name}
                          className="inline-flex items-center gap-2 border-2 border-ink bg-cream px-2.5 py-1 font-body text-sm font-semibold"
                        >
                          <Icon aria-hidden="true" className="h-4 w-4" />
                          {name}
                        </li>
                      ))}
                    </ul>
                  </dd>
                </Row>
              ))}
            </dl>
          </CvBlock>

          <CvBlock label="industry & client projects">
            <ProjectRows group={CV.industryProjects} />
          </CvBlock>

          <CvBlock label="personal projects">
            <ProjectRows group={CV.personalProjects} />
          </CvBlock>

          <CvBlock label="education">
            <EntryRows entries={CV.education} />
          </CvBlock>

          <CvBlock label="languages">
            <dl>
              {CV.languages.map((lang, i) => (
                <Row key={lang.name} first={i === 0} compact>
                  <dt className="font-body text-sm font-bold uppercase tracking-wide">
                    {lang.name}
                  </dt>
                  <dd className="font-body text-base text-ink/85">{lang.level}</dd>
                </Row>
              ))}
            </dl>
          </CvBlock>
        </div>
      </div>
    </PageShell>
  );
}

/**
 * Left column: portrait, contact, CV download. Scrolls together with the CV.
 * (It used to be sticky, but at ~840px it's taller than most screens, so its
 * bottom was cut off while the right column kept moving.)
 */
function ProfileColumn() {
  const { email, phone, website, github, linkedin, location, nationality } = CV.contact;

  return (
    <aside className="flex flex-col gap-8 lg:self-start">
      <div className="relative mx-auto w-full max-w-xs lg:max-w-none">
        <span aria-hidden="true" className="absolute -bottom-4 -left-4 h-full w-full bg-blue" />
        <div className="relative aspect-[4/5] w-full overflow-hidden border-[3px] border-ink bg-cream shadow-bauhaus">
          <Image
            src="/portfolio-pic.jpg"
            alt="Portrait of Danylo Kalynovskyi"
            fill
            priority
            sizes="(max-width: 1024px) 80vw, 320px"
            className="object-cover"
          />
        </div>
        <span
          aria-hidden="true"
          className="absolute -right-3 -top-3 h-10 w-10 rounded-full border-[3px] border-ink bg-orange"
        />
      </div>

      <section aria-labelledby="contact-heading" className="border-[3px] border-ink bg-cream shadow-bauhaus-sm">
        <h2
          id="contact-heading"
          className="border-b-[3px] border-ink bg-ink px-4 py-2 font-display text-xl font-semibold lowercase text-cream"
        >
          contact
        </h2>
        <ul className="divide-y-2 divide-ink/15 font-body text-sm">
          <ContactRow icon={<FaEnvelope />}>
            <a href={`mailto:${email}`} className="focus-bauhaus break-all underline-offset-4 hover:underline">
              {email}
            </a>
          </ContactRow>
          <ContactRow icon={<FaPhone />}>
            {/* tel: link — tapping it on a phone starts a call; spaces are stripped for the URI */}
            <a href={`tel:${phone.replace(/\s/g, "")}`} className="focus-bauhaus underline-offset-4 hover:underline">
              {phone}
            </a>
          </ContactRow>
          <ContactRow icon={<FaGlobe />}>
            <a href={website} target="_blank" rel="noopener noreferrer" className="focus-bauhaus underline-offset-4 hover:underline">
              {website.replace(/^https?:\/\//, "")}
            </a>
          </ContactRow>
          <ContactRow icon={<FaGithub />}>
            <a href={github} target="_blank" rel="noopener noreferrer" className="focus-bauhaus underline-offset-4 hover:underline">
              github.com/electromalina
            </a>
          </ContactRow>
          <ContactRow icon={<FaLinkedinIn />}>
            <a href={linkedin} target="_blank" rel="noopener noreferrer" className="focus-bauhaus underline-offset-4 hover:underline">
              linkedin.com/in/electromalina
            </a>
          </ContactRow>
          <ContactRow icon={<FaLocationDot />}>
            {location} · {nationality}
          </ContactRow>
        </ul>
      </section>

      {CV.cvPdfUrl ? (
        <a
          href={CV.cvPdfUrl}
          download
          className="focus-bauhaus inline-flex items-center justify-center gap-2 border-[3px] border-ink bg-orange px-6 py-3 font-body text-sm font-bold text-cream shadow-bauhaus-sm transition-transform hover:-translate-y-0.5"
        >
          <FaDownload aria-hidden="true" className="h-4 w-4" />
          Download CV
        </a>
      ) : (
        // placeholder until a PDF exists: a disabled button is announced as unavailable
        <button
          type="button"
          disabled
          className="inline-flex cursor-not-allowed items-center justify-center gap-2 border-[3px] border-dashed border-ink bg-cream px-6 py-3 font-body text-sm font-bold text-ink/70"
        >
          <FaDownload aria-hidden="true" className="h-4 w-4" />
          Download CV · coming soon
        </button>
      )}
    </aside>
  );
}

function ContactRow({ icon, children }: { icon: ReactNode; children: ReactNode }) {
  return (
    <li className="flex items-center gap-3 px-4 py-3">
      <span aria-hidden="true" className="shrink-0 text-base">
        {icon}
      </span>
      <span className="min-w-0">{children}</span>
    </li>
  );
}

/** A CV section: yellow tab label sitting on an ink-bordered table. */
function CvBlock({ label, children }: { label: string; children: ReactNode }) {
  // ids can't contain spaces: aria-labelledby reads a space-separated list of ids
  const id = `cv-${label.toLowerCase().replace(/[^a-z0-9]+/g, "-")}`;
  return (
    <section aria-labelledby={id}>
      <h2 id={id} className="section-tab relative z-10 -mb-[3px] lowercase">
        {label}
      </h2>
      <div className="border-[3px] border-ink bg-cream shadow-bauhaus">{children}</div>
    </section>
  );
}

/** Two-column table row: label/period cell | content cell. Stacks on phones. */
function Row({
  first,
  compact = false,
  children,
}: {
  first: boolean;
  /** tighter rows for one-line content (languages) */
  compact?: boolean;
  children: ReactNode;
}) {
  return (
    <div
      className={`grid px-5 sm:grid-cols-[10rem_minmax(0,1fr)] sm:px-6 ${
        compact ? "gap-1 py-2.5 sm:items-baseline sm:gap-6" : "gap-2 py-4 sm:gap-6"
      } ${first ? "" : "border-t-[3px] border-ink"}`}
    >
      {children}
    </div>
  );
}

/**
 * Project list: an intro line, then one full-width row per project with the
 * name on the left, facts (semester · team · year) on the right, bullets below.
 */
function ProjectRows({ group }: { group: CvProjectGroup }) {
  return (
    <div>
      <p className="border-b-[3px] border-ink px-5 py-4 font-body text-base leading-relaxed text-ink/85 sm:px-6">
        {group.intro}
      </p>
      {group.items.map((p, i) => (
        <article
          key={`${p.name}-${i}`}
          className={`px-5 py-4 sm:px-6 ${i === 0 ? "" : "border-t-[3px] border-ink"} ${
            p.placeholder ? "opacity-55" : ""
          }`}
        >
          <div className="flex flex-wrap items-baseline justify-between gap-x-4 gap-y-2">
            <h3 className="font-display text-xl font-semibold leading-tight">
              {p.name}
            </h3>
            <ul className="flex flex-wrap gap-1.5" aria-label="Project facts">
              {p.meta.map((m) => (
                <li
                  key={m}
                  className="border-2 border-ink bg-cream px-2 py-0.5 font-body text-xs font-bold uppercase tracking-wide"
                >
                  {m}
                </li>
              ))}
            </ul>
          </div>
          <ul className="mt-3 space-y-2">
            {p.bullets.map((b) => (
              <li key={b} className="flex gap-3 font-body text-base leading-relaxed text-ink/85">
                <span aria-hidden="true" className="mt-2.5 h-2 w-2 shrink-0 bg-orange" />
                {b}
              </li>
            ))}
          </ul>
        </article>
      ))}
    </div>
  );
}

function EntryRows({ entries }: { entries: CvEntry[] }) {
  return (
    <dl>
      {entries.map((e, i) => (
        <Row key={`${e.period}-${e.title}`} first={i === 0}>
          <dt className="font-body text-sm font-bold uppercase tracking-wide text-ink/80">
            {e.period}
          </dt>
          <dd>
            <p className="font-display text-xl font-semibold leading-tight">{e.title}</p>
            <p className="mt-0.5 font-body text-sm font-semibold text-ink/75">{e.place}</p>
            {e.description && (
              <p className="mt-2 font-body text-base leading-relaxed text-ink/85">
                {e.description}
              </p>
            )}
            {e.bullets && e.bullets.length > 0 && (
              <ul className="mt-3 space-y-2">
                {e.bullets.map((b) => (
                  <li key={b} className="flex gap-3 font-body text-base leading-relaxed text-ink/85">
                    <span aria-hidden="true" className="mt-2.5 h-2 w-2 shrink-0 bg-orange" />
                    {b}
                  </li>
                ))}
              </ul>
            )}
          </dd>
        </Row>
      ))}
    </dl>
  );
}

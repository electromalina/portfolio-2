import type { Metadata } from "next";
import { notFound } from "next/navigation";
import type { ReactNode } from "react";
import {
  FaArrowLeftLong,
  FaArrowRightLong,
  FaArrowUpRightFromSquare,
  FaGithub,
} from "react-icons/fa6";
import PageShell from "@/components/PageShell";
import ProjectCover from "@/components/projects/ProjectCover";
import TransitionLink from "@/components/transition/TransitionLink";
import { getPublishedProjects } from "@/lib/projects";
import { ACCENT_NAME_CYCLE, cssVar } from "@/lib/design-tokens";
import { ACCENT_BG } from "@/lib/navigation";
import { PROJECT_SECTIONS } from "@/lib/project-sections";

export const revalidate = 60;

type Params = { slug: string };

// pre-render every published project at build time; new slugs render on demand
export async function generateStaticParams(): Promise<Params[]> {
  const projects = await getPublishedProjects();
  return projects.map((p) => ({ slug: p.slug }));
}

async function findProject(slug: string) {
  const projects = await getPublishedProjects();
  const index = projects.findIndex((p) => p.slug === slug);
  if (index === -1) return null;

  const total = projects.length;
  return {
    project: projects[index],
    index,
    accent: ACCENT_NAME_CYCLE[index % ACCENT_NAME_CYCLE.length],
    // no wrap-around at the ends; null hides the link
    prev: index > 0 ? { p: projects[index - 1], i: index - 1 } : null,
    next: index < total - 1 ? { p: projects[index + 1], i: index + 1 } : null,
  };
}

export async function generateMetadata({
  params,
}: {
  params: Promise<Params>;
}): Promise<Metadata> {
  const { slug } = await params;
  const found = await findProject(slug);
  if (!found) return { title: "Project not found" };
  return {
    title: found.project.title,
    description: found.project.summary ?? undefined,
  };
}

export default async function ProjectPage({
  params,
}: {
  params: Promise<Params>;
}) {
  const { slug } = await params;
  const found = await findProject(slug);
  if (!found) notFound();

  const { project, index, accent, prev, next } = found;
  const hasDemo = project.show_demo_button && project.demo_url;

  return (
    <PageShell
      current="projects"
      eyebrow={`project ${String(index + 1).padStart(2, "0")}`}
      title={project.title}
      back={{ href: "/projects", label: "All projects" }}
      bandColorClass={ACCENT_BG[accent]}
    >
      <div className="mx-auto grid max-w-6xl gap-10 px-5 py-12 sm:px-8 sm:py-16 lg:grid-cols-[minmax(0,1.6fr)_minmax(0,1fr)] lg:gap-14">
        {/* left: summary + cover + story sections */}
        <div className="flex min-w-0 flex-col gap-8">
          {project.summary && (
            <p className="break-words font-body text-xl leading-relaxed text-ink">
              {project.summary}
            </p>
          )}

          <div
            className={`border-[3px] border-ink p-3 shadow-bauhaus sm:p-5 ${ACCENT_BG[accent]}`}
          >
            <ProjectCover src={project.cover_url} alt={`${project.title} cover`} />
          </div>

          {PROJECT_SECTIONS.map(({ key, label }) => {
            const text = project[key];
            if (!text) return null;
            return (
              <section key={key}>
                <Label>{label}</Label>
                <div className="whitespace-pre-line break-words font-body text-base leading-relaxed text-ink/85 sm:text-lg">
                  {text}
                </div>
              </section>
            );
          })}
        </div>

        {/* right: facts column, sticky on desktop. It's short (tags + 2 buttons),
            so it always fits on screen. top = --nav-offset keeps it below the
            sticky nav bar instead of sliding under it. */}
        <aside className="flex flex-col gap-8 lg:sticky lg:top-(--nav-offset) lg:self-start">
          {project.tags && project.tags.length > 0 && (
            <section className="border-[3px] border-ink bg-cream p-5 shadow-bauhaus-sm">
              <Label>Built with</Label>
              <ul className="flex flex-wrap gap-2">
                {project.tags.map((tag) => (
                  <li
                    key={tag}
                    className="border-[3px] border-ink bg-cream px-3 py-1 font-body text-xs font-bold uppercase tracking-wide text-ink"
                  >
                    {tag}
                  </li>
                ))}
              </ul>
            </section>
          )}

          {(hasDemo || project.github_url) && (
            <div className="flex flex-col gap-3">
              {hasDemo && (
                <a
                  href={project.demo_url!}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="focus-bauhaus inline-flex items-center justify-center gap-2 border-[3px] border-ink bg-orange px-6 py-3 font-body text-sm font-bold text-cream shadow-bauhaus-sm transition-transform hover:-translate-y-0.5"
                >
                  Live demo
                  <FaArrowUpRightFromSquare className="h-3.5 w-3.5" aria-hidden="true" />
                </a>
              )}
              {project.github_url && (
                <a
                  href={project.github_url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="focus-bauhaus inline-flex items-center justify-center gap-2 border-[3px] border-ink bg-cream px-6 py-3 font-body text-sm font-bold text-ink shadow-bauhaus-sm transition-transform hover:-translate-y-0.5"
                >
                  <FaGithub className="h-4 w-4" aria-hidden="true" />
                  View code
                </a>
              )}
            </div>
          )}
        </aside>
      </div>

      {(prev || next) && (
        <nav
          aria-label="More projects"
          // minmax(0,1fr): a grid column may not grow past the screen, so long
          // titles wrap instead of pushing the page into horizontal scroll
          className="mx-auto grid max-w-6xl grid-cols-[minmax(0,1fr)] gap-4 px-5 pb-16 sm:grid-cols-2 sm:px-8"
        >
          {prev ? (
            <SiblingLink
              href={`/projects/${prev.p.slug}`}
              accent={ACCENT_NAME_CYCLE[prev.i % ACCENT_NAME_CYCLE.length]}
              direction="Previous"
              title={prev.p.title}
            />
          ) : (
            <span className="hidden sm:block" />
          )}
          {next && (
            <SiblingLink
              href={`/projects/${next.p.slug}`}
              accent={ACCENT_NAME_CYCLE[next.i % ACCENT_NAME_CYCLE.length]}
              direction="Next"
              title={next.p.title}
            />
          )}
        </nav>
      )}
    </PageShell>
  );
}

function SiblingLink({
  href,
  accent,
  direction,
  title,
}: {
  href: string;
  accent: (typeof ACCENT_NAME_CYCLE)[number];
  direction: "Previous" | "Next";
  title: string;
}) {
  const isNext = direction === "Next";
  return (
    <TransitionLink
      href={href}
      color={cssVar[accent]}
      className={`focus-bauhaus group flex min-w-0 items-center gap-4 border-[3px] border-ink bg-cream p-4 text-ink shadow-bauhaus-sm transition-transform hover:-translate-y-0.5 sm:p-5 ${
        isNext ? "justify-end text-right" : ""
      }`}
    >
      {!isNext && <FaArrowLeftLong className="h-5 w-5 shrink-0" aria-hidden="true" />}
      {/* flex-1 + min-w-0 lets the text shrink; titles wrap to max 2 lines */}
      <span className="min-w-0 flex-1">
        <span className="block font-body text-xs font-bold uppercase tracking-[0.25em] text-ink/70">
          {direction} project
        </span>
        <span className="mt-0.5 line-clamp-2 break-words font-display text-xl font-semibold leading-tight sm:text-2xl">
          {title}
        </span>
      </span>
      {isNext && <FaArrowRightLong className="h-5 w-5 shrink-0" aria-hidden="true" />}
    </TransitionLink>
  );
}

function Label({ children }: { children: ReactNode }) {
  return (
    <h2 className="mb-3 flex items-center gap-3 font-body text-xs font-bold uppercase tracking-[0.25em] text-ink/70">
      <span aria-hidden="true" className="h-3 w-3 bg-orange" />
      {children}
    </h2>
  );
}

import type { Metadata } from "next";
import PageShell from "@/components/PageShell";
import ProjectCard from "@/components/projects/ProjectCard";
import { getPublishedProjects } from "@/lib/projects";
import { ACCENT_NAME_CYCLE } from "@/lib/design-tokens";

export const revalidate = 60;

export const metadata: Metadata = {
  title: "Projects",
  description: "Selected web development and UI/UX projects by Danylo Kalynovskyi.",
};

export default async function ProjectsPage() {
  const projects = await getPublishedProjects();

  return (
    <PageShell
      current="projects"
      eyebrow={`02 · ${projects.length} ${projects.length === 1 ? "project" : "projects"}`}
      title="projects"
    >
      <div className="mx-auto max-w-6xl px-5 py-12 sm:px-8 sm:py-16">
        {projects.length === 0 ? (
          <div className="border-[3px] border-dashed border-ink bg-cream p-16 text-center shadow-bauhaus">
            <p className="font-display text-4xl font-semibold lowercase text-ink">
              projects coming soon
            </p>
            <p className="mt-2 font-body text-ink/70">
              Add projects from the admin panel and they&apos;ll appear here.
            </p>
          </div>
        ) : (
          <ul className="grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
            {projects.map((project, i) => (
              <li key={project.id}>
                <ProjectCard
                  project={project}
                  index={i}
                  accent={ACCENT_NAME_CYCLE[i % ACCENT_NAME_CYCLE.length]}
                />
              </li>
            ))}
          </ul>
        )}
      </div>
    </PageShell>
  );
}

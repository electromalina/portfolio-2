"use client";

import { useState } from "react";
import Reveal from "@/components/Reveal";
import ProjectModal from "@/components/ProjectModal";
import type { Project } from "@/app/actions/projects";
import { FaArrowRightLong } from "react-icons/fa6";

// lighter tones so the dark title stays readable on every band
const HEADER_COLORS = ["#E45815", "#7FA1BC", "#F5BE5D"];

export default function Projects({ projects }: { projects: Project[] }) {
  const [active, setActive] = useState<{
    project: Project;
    accent: string;
  } | null>(null);

  return (
    <section id="work" className="relative bg-yellow px-5 py-24 sm:px-8 lg:py-32">
      <div className="mx-auto max-w-6xl">
        <div className="mb-14 flex flex-wrap items-end justify-between gap-4">
          <span className="section-tab font-display text-2xl lowercase">
            featured projects
          </span>
          {projects.length > 1 && (
            <p className="font-body text-sm font-medium text-ink/60">
              scroll for more →
            </p>
          )}
        </div>

        {projects.length === 0 ? (
          <div className="border-[3px] border-dashed border-ink bg-cream p-16 text-center shadow-bauhaus">
            <p className="font-display text-3xl lowercase text-ink">
              projects coming soon
            </p>
            <p className="mt-2 font-body text-ink/70">
              Add projects from the admin panel and they&apos;ll appear here.
            </p>
          </div>
        ) : (
          <Reveal>
            <div className="-mx-1 flex snap-x snap-mandatory gap-6 overflow-x-auto px-1 pb-4 [scrollbar-color:#302E2F_transparent]">
              {projects.map((project, i) => {
                const accent = HEADER_COLORS[i % HEADER_COLORS.length];
                return (
                  <button
                    key={project.id}
                    type="button"
                    onClick={() => setActive({ project, accent })}
                    aria-label={`View details for ${project.title}`}
                    className="group flex w-[300px] shrink-0 snap-start flex-col self-stretch border-[3px] border-ink bg-cream text-left shadow-bauhaus transition-shadow focus:outline-none focus-visible:shadow-bauhaus-orange hover:shadow-bauhaus-orange sm:w-[360px]"
                  >
                    {/* colored header band with a geometric mark */}
                    <div
                      className="relative flex h-28 items-end overflow-hidden border-b-[3px] border-ink p-4"
                      style={{ backgroundColor: accent }}
                    >
                      <span className="absolute -right-6 -top-6 h-20 w-20 rounded-full border-[6px] border-ink/25" />
                      <h3 className="relative z-10 font-display text-3xl leading-tight text-ink">
                        {project.title}
                      </h3>
                    </div>

                    <div className="flex flex-1 flex-col gap-4 p-5">
                      {project.summary && (
                        <p className="font-body text-base leading-relaxed text-ink/85">
                          {project.summary}
                        </p>
                      )}

                      {project.tags && project.tags.length > 0 && (
                        <div className="flex flex-wrap gap-2">
                          {project.tags.map((tag) => (
                            <span
                              key={tag}
                              className="border-2 border-ink bg-cream px-2.5 py-1 font-body text-xs font-bold uppercase tracking-wide text-ink"
                            >
                              {tag}
                            </span>
                          ))}
                        </div>
                      )}

                      <span className="mt-auto inline-flex items-center gap-2 pt-2 font-body text-sm font-bold uppercase tracking-wide text-ink">
                        View details
                        <FaArrowRightLong className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-1.5" />
                      </span>
                    </div>
                  </button>
                );
              })}
            </div>
          </Reveal>
        )}
      </div>

      <ProjectModal
        project={active?.project ?? null}
        accent={active?.accent ?? HEADER_COLORS[0]}
        onClose={() => setActive(null)}
      />
    </section>
  );
}

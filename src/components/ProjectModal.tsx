"use client";

import { useEffect, useRef } from "react";
import type { Project } from "@/app/actions/projects";
import { FaArrowUpRightFromSquare, FaGithub, FaXmark } from "react-icons/fa6";

export default function ProjectModal({
  project,
  accent,
  onClose,
}: {
  project: Project | null;
  accent: string;
  onClose: () => void;
}) {
  const panelRef = useRef<HTMLDivElement>(null);
  const closeRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    if (!project) return;

    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        onClose();
        return;
      }
      if (e.key === "Tab" && panelRef.current) {
        const focusables = panelRef.current.querySelectorAll<HTMLElement>(
          'a[href], button:not([disabled]), [tabindex]:not([tabindex="-1"])'
        );
        if (focusables.length === 0) return;
        const first = focusables[0];
        const last = focusables[focusables.length - 1];
        if (e.shiftKey && document.activeElement === first) {
          e.preventDefault();
          last.focus();
        } else if (!e.shiftKey && document.activeElement === last) {
          e.preventDefault();
          first.focus();
        }
      }
    };

    document.addEventListener("keydown", onKey);
    const prevOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    closeRef.current?.focus();

    return () => {
      document.removeEventListener("keydown", onKey);
      document.body.style.overflow = prevOverflow;
    };
  }, [project, onClose]);

  if (!project) return null;

  const hasDemo = project.show_demo_button && project.demo_url;
  const hasLinks = hasDemo || project.github_url;

  return (
    <div
      role="presentation"
      onClick={onClose}
      className="modal-overlay fixed inset-0 z-[100] flex justify-center overflow-y-auto bg-ink/75 sm:p-6"
    >
      <div
        ref={panelRef}
        role="dialog"
        aria-modal="true"
        aria-labelledby="project-modal-title"
        onClick={(e) => e.stopPropagation()}
        className="modal-panel relative flex min-h-full w-full flex-col border-ink bg-cream shadow-bauhaus sm:my-auto sm:min-h-0 sm:max-w-3xl sm:border-[3px]"
      >
        <button
          ref={closeRef}
          type="button"
          onClick={onClose}
          aria-label="Close project details"
          className="absolute right-3 top-3 z-20 flex h-11 w-11 items-center justify-center border-[3px] border-ink bg-cream text-ink shadow-bauhaus-sm transition-colors hover:bg-ink hover:text-cream"
        >
          <FaXmark className="h-5 w-5" />
        </button>

        {/* image banner — identical 16:9 box for every project, never stretched */}
        <div
          className="relative w-full overflow-hidden border-b-[3px] border-ink"
          style={{ backgroundColor: accent }}
        >
          {project.cover_url ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img
              src={project.cover_url}
              alt={`${project.title} cover`}
              className="aspect-[16/9] w-full object-cover"
              loading="lazy"
            />
          ) : (
            <div className="flex aspect-[16/9] w-full items-center justify-center">
              <span className="h-24 w-24 rounded-full border-[10px] border-ink/25" />
            </div>
          )}
        </div>

        {/* content */}
        <div className="flex flex-col gap-6 p-6 sm:p-9">
          <div>
            <p className="mb-2 font-body text-xs font-bold uppercase tracking-[0.35em] text-ink/55">
              Project
            </p>
            <h2
              id="project-modal-title"
              className="font-display text-4xl leading-tight text-ink sm:text-5xl"
            >
              {project.title}
            </h2>
          </div>

          {project.summary && (
            <p className="font-body text-lg leading-relaxed text-ink">
              {project.summary}
            </p>
          )}

          {project.content && (
            <div>
              <SectionLabel>About this project</SectionLabel>
              <div className="whitespace-pre-line font-body text-base leading-relaxed text-ink/80">
                {project.content}
              </div>
            </div>
          )}

          {project.tags && project.tags.length > 0 && (
            <div>
              <SectionLabel>Built with</SectionLabel>
              <div className="flex flex-wrap gap-2">
                {project.tags.map((tag) => (
                  <span
                    key={tag}
                    className="border-[3px] border-ink bg-cream px-3 py-1 font-body text-xs font-bold uppercase tracking-wide text-ink"
                  >
                    {tag}
                  </span>
                ))}
              </div>
            </div>
          )}

          {hasLinks && (
            <div className="flex flex-wrap gap-3 pt-1">
              {hasDemo && (
                <a
                  href={project.demo_url!}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 border-[3px] border-ink bg-orange px-6 py-3 font-body text-sm font-bold text-cream shadow-bauhaus-sm transition-transform hover:-translate-y-0.5"
                >
                  Live Demo
                  <FaArrowUpRightFromSquare className="h-3.5 w-3.5" />
                </a>
              )}
              {project.github_url && (
                <a
                  href={project.github_url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 border-[3px] border-ink bg-cream px-6 py-3 font-body text-sm font-bold text-ink shadow-bauhaus-sm transition-transform hover:-translate-y-0.5"
                >
                  <FaGithub className="h-4 w-4" />
                  View Code
                </a>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

function SectionLabel({ children }: { children: React.ReactNode }) {
  return (
    <div className="mb-3 flex items-center gap-3">
      <span className="h-3 w-3 bg-orange" />
      <span className="font-body text-xs font-bold uppercase tracking-[0.25em] text-ink/60">
        {children}
      </span>
    </div>
  );
}

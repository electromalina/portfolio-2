"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import type { Project } from "@/app/actions/projects";
import { FaArrowUpRightFromSquare, FaGithub, FaXmark } from "react-icons/fa6";

export default function ProjectModal({
  project,
  accent,
  returnFocusRef,
  onClose,
}: {
  project: Project | null;
  accent: string;
  returnFocusRef?: React.RefObject<HTMLElement | null>;
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
      returnFocusRef?.current?.focus();
    };
  }, [project, onClose, returnFocusRef]);

  if (!project) return null;

  const hasDemo = project.show_demo_button && project.demo_url;
  const hasLinks = hasDemo || project.github_url;

  return (
    <div
      role="presentation"
      onClick={onClose}
      className="modal-overlay fixed inset-0 z-[100] flex justify-center overflow-y-auto overflow-x-hidden bg-ink/75 sm:p-6"
    >
      <div
        ref={panelRef}
        role="dialog"
        aria-modal="true"
        aria-labelledby="project-modal-title"
        onClick={(e) => e.stopPropagation()}
        className="modal-panel relative flex min-h-full w-full flex-col border-ink bg-cream sm:my-auto sm:min-h-0 sm:max-w-3xl sm:border-[3px] sm:shadow-bauhaus"
      >
        {/* sticky on phones so it stays reachable while scrolling; absolute from sm: up.
            -mb-14 cancels its own height + top margin so it overlaps the cover instead of pushing it down */}
        <button
          ref={closeRef}
          type="button"
          onClick={onClose}
          aria-label="Close project details"
          className="focus-bauhaus sticky top-3 z-20 mr-3 mt-3 -mb-14 flex h-11 w-11 shrink-0 items-center justify-center self-end border-[3px] border-ink bg-cream text-ink shadow-bauhaus-sm transition-colors hover:bg-ink hover:text-cream sm:absolute sm:right-3 sm:top-3 sm:m-0"
        >
          <FaXmark className="h-5 w-5" />
        </button>

        {/* cover — space is reserved up front so content doesn't jump when the image arrives */}
        <div
          className="flex w-full items-center justify-center border-b-[3px] border-ink px-3 py-3 sm:px-6 sm:py-4"
          style={{ backgroundColor: accent }}
        >
          <div className="relative aspect-video max-h-[min(50vh,28rem)] w-full">
            {project.cover_url ? (
              // key resets the loading state whenever another project opens
              <ModalCover
                key={project.id}
                src={project.cover_url}
                alt={`${project.title} cover`}
              />
            ) : (
              <CoverPlaceholder />
            )}
          </div>
        </div>

        {/* content */}
        <div className="flex flex-col gap-6 p-5 sm:p-9">
          <div>
            <p className="mb-2 font-body text-xs font-bold uppercase tracking-[0.35em] text-ink/70">
              Project
            </p>
            <h2
              id="project-modal-title"
              className="hyphens-auto break-words font-display text-4xl leading-tight text-ink sm:text-6xl"
            >
              {project.title}
            </h2>
          </div>

          {project.summary && (
            <p className="break-words font-body text-lg leading-relaxed text-ink">
              {project.summary}
            </p>
          )}

          {project.content && (
            <div>
              <SectionLabel>About this project</SectionLabel>
              <div className="whitespace-pre-line break-words font-body text-base leading-relaxed text-ink/80">
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
            <div className="flex flex-col gap-3 pt-1 sm:flex-row sm:flex-wrap">
              {hasDemo && (
                <a
                  href={project.demo_url!}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="focus-bauhaus inline-flex items-center justify-center gap-2 border-[3px] border-ink bg-orange px-6 py-3 font-body text-sm font-bold text-cream shadow-bauhaus-sm transition-transform hover:-translate-y-0.5"
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
                  className="focus-bauhaus inline-flex items-center justify-center gap-2 border-[3px] border-ink bg-cream px-6 py-3 font-body text-sm font-bold text-ink shadow-bauhaus-sm transition-transform hover:-translate-y-0.5"
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

type CoverStatus = "loading" | "loaded" | "error";

function ModalCover({ src, alt }: { src: string; alt: string }) {
  const [status, setStatus] = useState<CoverStatus>("loading");

  // an image that's already cached can be complete before onLoad is attached
  const imgRef = useCallback((img: HTMLImageElement | null) => {
    if (img?.complete && img.naturalWidth > 0) setStatus("loaded");
  }, []);

  return (
    <>
      {status !== "loaded" && <CoverPlaceholder pulse={status === "loading"} />}
      {status !== "error" && (
        // plain <img>: cover URLs can be any host, which next/image would reject
        // eslint-disable-next-line @next/next/no-img-element
        <img
          ref={imgRef}
          src={src}
          alt={alt}
          fetchPriority="high"
          decoding="async"
          onLoad={() => setStatus("loaded")}
          onError={() => setStatus("error")}
          className={`absolute inset-0 h-full w-full object-contain transition-opacity duration-300 motion-reduce:transition-none ${
            status === "loaded" ? "opacity-100" : "opacity-0"
          }`}
        />
      )}
    </>
  );
}

function CoverPlaceholder({ pulse = false }: { pulse?: boolean }) {
  return (
    <div className="absolute inset-0 flex items-center justify-center">
      <span
        className={`h-24 w-24 rounded-full border-[10px] border-ink/25 ${
          pulse ? "animate-pulse motion-reduce:animate-none" : ""
        }`}
      />
    </div>
  );
}

function SectionLabel({ children }: { children: React.ReactNode }) {
  return (
    <div className="mb-3 flex items-center gap-3">
      <span className="h-3 w-3 bg-orange" />
      <span className="font-body text-xs font-bold uppercase tracking-[0.25em] text-ink/70">
        {children}
      </span>
    </div>
  );
}

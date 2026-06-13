"use client";

import {
  useCallback,
  useEffect,
  useLayoutEffect,
  useRef,
  useState,
  type CSSProperties,
} from "react";
import Reveal from "@/components/Reveal";
import ProjectModal from "@/components/ProjectModal";
import SectionHeading from "@/components/SectionHeading";
import type { Project } from "@/app/actions/projects";
import { ACCENT_CYCLE } from "@/lib/design-tokens";
import { FaArrowRightLong, FaChevronLeft, FaChevronRight } from "react-icons/fa6";

function circularOffset(
  index: number,
  focused: number,
  total: number
): number {
  if (total <= 1) return 0;
  let offset = index - focused;
  while (offset > total / 2) offset -= total;
  while (offset < -total / 2) offset += total;
  return offset;
}

function usePrefersReducedMotion() {
  const [reduced, setReduced] = useState(false);

  useEffect(() => {
    const mq = window.matchMedia("(prefers-reduced-motion: reduce)");
    const sync = () => setReduced(mq.matches);
    sync();
    mq.addEventListener("change", sync);
    return () => mq.removeEventListener("change", sync);
  }, []);

  return reduced;
}

function cardStyle(offset: number, reduced: boolean): CSSProperties {
  const abs = Math.abs(offset);

  // beyond the immediate neighbours, fade out and disable
  if (abs > 1) {
    return {
      opacity: 0,
      pointerEvents: "none",
      transform: "scale(0.8)",
      zIndex: 1,
    };
  }

  if (offset === 0) {
    return { opacity: 1, transform: "scale(1)", zIndex: 30 };
  }

  // side cards: dimmed + smaller so the gap reads as breathing room
  return {
    opacity: reduced ? 0.6 : 0.4,
    transform: `scale(${reduced ? 0.94 : 0.88})`,
    zIndex: 10,
  };
}

export default function Projects({ projects }: { projects: Project[] }) {
  const [modal, setModal] = useState<{
    project: Project;
    accent: string;
  } | null>(null);
  const [focusedIndex, setFocusedIndex] = useState(0);
  const [trackX, setTrackX] = useState(0);

  const returnFocusRef = useRef<HTMLElement | null>(null);
  const viewportRef = useRef<HTMLDivElement>(null);
  const trackRef = useRef<HTMLDivElement>(null);
  const reducedMotion = usePrefersReducedMotion();

  const syncTrack = useCallback(() => {
    const viewport = viewportRef.current;
    const track = trackRef.current;
    if (!viewport || !track || projects.length === 0) return;

    const card = track.children[focusedIndex] as HTMLElement | undefined;
    if (!card) return;

    const viewportCenter = viewport.clientWidth / 2;
    const cardCenter = card.offsetLeft + card.offsetWidth / 2;
    setTrackX(viewportCenter - cardCenter);
  }, [focusedIndex, projects.length]);

  useLayoutEffect(() => {
    syncTrack();
    window.addEventListener("resize", syncTrack);
    return () => window.removeEventListener("resize", syncTrack);
  }, [syncTrack]);

  const openProject = (project: Project, accent: string) => {
    returnFocusRef.current = document.activeElement as HTMLElement;
    setModal({ project, accent });
  };

  const goPrev = () =>
    setFocusedIndex((i) =>
      projects.length === 0 ? 0 : (i - 1 + projects.length) % projects.length
    );
  const goNext = () =>
    setFocusedIndex((i) =>
      projects.length === 0 ? 0 : (i + 1) % projects.length
    );

  const onViewportKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "ArrowLeft") {
      e.preventDefault();
      goPrev();
    } else if (e.key === "ArrowRight") {
      e.preventDefault();
      goNext();
    }
  };

  const motionClass = reducedMotion
    ? ""
    : "transition-[transform,opacity] duration-[550ms] ease-[cubic-bezier(0.22,1,0.36,1)]";

  return (
    <section id="work" className="relative bg-yellow py-24 sm:py-32 lg:py-32">
      <div className="mx-auto mb-10 max-w-6xl px-5 sm:px-8">
        <SectionHeading>featured projects</SectionHeading>
      </div>

      {projects.length === 0 ? (
        <div className="mx-auto max-w-6xl px-5 sm:px-8">
          <div className="border-[3px] border-dashed border-ink bg-cream p-16 text-center shadow-bauhaus">
            <p className="font-display text-4xl lowercase text-ink">
              projects coming soon
            </p>
            <p className="mt-2 font-body text-ink/70">
              Add projects from the admin panel and they&apos;ll appear here.
            </p>
          </div>
        </div>
      ) : (
        <Reveal>
          <div className="flex w-full flex-col items-center gap-6">
            <div
              ref={viewportRef}
              tabIndex={projects.length > 1 ? 0 : undefined}
              role="region"
              aria-label="Featured projects carousel"
              aria-roledescription="carousel"
              onKeyDown={onViewportKeyDown}
              className="featured-projects__viewport w-full overflow-hidden py-6 outline-none"
            >
                <div
                  ref={trackRef}
                  className={`featured-projects__track flex w-max items-center gap-8 sm:gap-12 ${reducedMotion ? "" : "transition-transform duration-[550ms] ease-[cubic-bezier(0.22,1,0.36,1)]"}`}
                  style={{ transform: `translate3d(${trackX}px, 0, 0)` }}
                >
                  {projects.map((project, i) => {
                    const accent = ACCENT_CYCLE[i % ACCENT_CYCLE.length];
                    const offset = circularOffset(
                      i,
                      focusedIndex,
                      projects.length
                    );
                    const isFocused = offset === 0;

                    return (
                      <div
                        key={project.id}
                        className={`featured-projects__card shrink-0 ${motionClass}`}
                        style={cardStyle(offset, reducedMotion)}
                      >
                        <button
                          type="button"
                          onClick={() => {
                            if (isFocused) {
                              openProject(project, accent);
                            } else {
                              setFocusedIndex(i);
                            }
                          }}
                          aria-label={
                            isFocused
                              ? `View details for ${project.title}`
                              : `Show ${project.title} in carousel`
                          }
                          className={`focus-bauhaus group flex w-[280px] cursor-pointer flex-col border-[3px] border-ink bg-cream text-left shadow-bauhaus focus:outline-none sm:w-[340px] ${
                            isFocused
                              ? "focus-visible:shadow-bauhaus-orange hover:shadow-bauhaus-orange"
                              : "hover:shadow-bauhaus-sm"
                          }`}
                        >
                          <div
                            className="relative flex h-28 items-end overflow-hidden border-b-[3px] border-ink p-4"
                            style={{ backgroundColor: accent }}
                          >
                            <span className="absolute -right-6 -top-6 h-20 w-20 rounded-full border-[6px] border-ink/25" />
                            <h3 className="relative z-10 font-display text-4xl leading-tight text-ink">
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
                                {project.tags.slice(0, 4).map((tag) => (
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
                              {isFocused ? "View details" : "Select"}
                              <FaArrowRightLong className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-1.5" />
                            </span>
                          </div>
                        </button>
                      </div>
                    );
                  })}
                </div>
              </div>

              {projects.length > 1 && (
                <div className="flex items-center gap-4">
                  <button
                    type="button"
                    onClick={goPrev}
                    aria-label="Previous project"
                    className="focus-bauhaus flex h-11 w-11 cursor-pointer items-center justify-center border-[3px] border-ink bg-cream text-ink shadow-bauhaus-sm transition-colors hover:bg-ink hover:text-cream"
                  >
                    <FaChevronLeft className="h-4 w-4" />
                  </button>
                  <p className="min-w-[4.5rem] text-center font-body text-sm font-medium text-ink/70">
                    {focusedIndex + 1} / {projects.length}
                  </p>
                  <button
                    type="button"
                    onClick={goNext}
                    aria-label="Next project"
                    className="focus-bauhaus flex h-11 w-11 cursor-pointer items-center justify-center border-[3px] border-ink bg-cream text-ink shadow-bauhaus-sm transition-colors hover:bg-ink hover:text-cream"
                  >
                    <FaChevronRight className="h-4 w-4" />
                  </button>
                </div>
            )}
          </div>
        </Reveal>
      )}

      <ProjectModal
        project={modal?.project ?? null}
        accent={modal?.accent ?? ACCENT_CYCLE[0]}
        returnFocusRef={returnFocusRef}
        onClose={() => setModal(null)}
      />
    </section>
  );
}

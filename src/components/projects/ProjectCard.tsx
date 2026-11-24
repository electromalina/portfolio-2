import { FaArrowRightLong } from "react-icons/fa6";
import TransitionLink from "@/components/transition/TransitionLink";
import type { Project } from "@/app/actions/projects";
import type { AccentName } from "@/lib/design-tokens";
import { cssVar } from "@/lib/design-tokens";
import { ACCENT_BG } from "@/lib/navigation";

export default function ProjectCard({
  project,
  accent,
  index,
}: {
  project: Project;
  accent: AccentName;
  index: number;
}) {
  return (
    <TransitionLink
      href={`/projects/${project.slug}`}
      color={cssVar[accent]}
      className="focus-bauhaus group flex h-full flex-col border-[3px] border-ink bg-cream text-left text-ink shadow-bauhaus"
    >
      <span
        className={`relative flex h-32 flex-col justify-between overflow-hidden border-b-[3px] border-ink p-4 ${ACCENT_BG[accent]}`}
      >
        <span
          aria-hidden="true"
          className="absolute -right-6 -top-6 h-20 w-20 rounded-full border-[6px] border-ink/25"
        />
        <span className="relative font-body text-base font-extrabold leading-none tracking-wider">
          {String(index + 1).padStart(2, "0")}
        </span>
        <span className="relative font-display text-3xl font-semibold leading-tight sm:text-4xl">
          {project.title}
        </span>
      </span>

      <span className="flex flex-1 flex-col gap-4 p-5">
        {/* fall back to the summary for projects that have no subheading yet */}
        {(project.subheading ?? project.summary) && (
          <span className="line-clamp-2 font-body text-base leading-relaxed text-ink/85">
            {project.subheading ?? project.summary}
          </span>
        )}

        {project.tags && project.tags.length > 0 && (
          <span className="mt-auto flex flex-wrap gap-2">
            {project.tags.slice(0, 4).map((tag) => (
              <span
                key={tag}
                className="border-2 border-ink bg-cream px-2.5 py-1 font-body text-xs font-bold uppercase tracking-wide text-ink"
              >
                {tag}
              </span>
            ))}
          </span>
        )}
      </span>

      {/* CTA bar: ink sweeps in from the left (scaleX = GPU-composited, no repaint) */}
      <span className="relative flex items-center justify-between overflow-hidden border-t-[3px] border-ink px-5 py-3 font-body text-sm font-bold uppercase tracking-wide text-ink transition-colors duration-300 group-hover:text-cream group-focus-visible:text-cream">
        <span
          aria-hidden="true"
          className="absolute inset-0 origin-left scale-x-0 bg-ink transition-transform duration-400 ease-[cubic-bezier(0.22,1,0.36,1)] group-hover:scale-x-100 group-focus-visible:scale-x-100 motion-reduce:transition-none"
        />
        <span className="relative">View project</span>
        <FaArrowRightLong
          aria-hidden="true"
          className="relative h-4 w-4 transition-transform duration-300 group-hover:translate-x-1.5 group-focus-visible:translate-x-1.5 motion-reduce:transition-none"
        />
      </span>
    </TransitionLink>
  );
}

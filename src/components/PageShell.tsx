import type { ReactNode } from "react";
import { FaArrowLeftLong } from "react-icons/fa6";
import TransitionLink from "@/components/transition/TransitionLink";
import { ACCENT_BG, CATEGORIES, type Category } from "@/lib/navigation";
import { cssVar } from "@/lib/design-tokens";

type PageShellProps = {
  /** which category this page is — sets the band color and hides it from the switcher */
  current: Category["id"];
  title: string;
  /** small uppercase line above the title */
  eyebrow?: string;
  /** where the back button goes (defaults to home) */
  back?: { href: string; label: string };
  /** overrides the category color, e.g. per-project accents */
  bandColorClass?: string;
  children: ReactNode;
};

/**
 * Fullscreen page frame used by /about, /projects and /personality.
 * The colored band matches the wipe color, so the transition lands seamlessly.
 */
export default function PageShell({
  current,
  title,
  eyebrow,
  back = { href: "/", label: "Home" },
  bandColorClass,
  children,
}: PageShellProps) {
  const category = CATEGORIES.find((c) => c.id === current)!;
  const others = CATEGORIES.filter((c) => c.id !== current);

  return (
    <div className="flex min-h-screen flex-1 flex-col bg-cream font-body text-ink">
      <header
        className={`relative overflow-hidden border-b-[3px] border-ink ${bandColorClass ?? ACCENT_BG[category.accent]}`}
      >
        {/* decorative circle, echoes the hero motifs */}
        <span
          aria-hidden="true"
          className="pointer-events-none absolute -right-16 -top-16 h-56 w-56 rounded-full border-[14px] border-ink/15"
        />

        <div className="relative mx-auto flex max-w-6xl flex-wrap items-center justify-between gap-3 px-5 pt-5 sm:px-8">
          <TransitionLink
            href={back.href}
            color={cssVar.cream}
            className="focus-bauhaus inline-flex min-h-11 items-center gap-2 border-[3px] border-ink bg-cream px-4 font-body text-sm font-bold uppercase tracking-wide text-ink shadow-bauhaus-sm transition-transform hover:-translate-x-0.5"
          >
            <FaArrowLeftLong className="h-4 w-4" aria-hidden="true" />
            {back.label}
          </TransitionLink>

          <nav aria-label="Other sections" className="flex gap-2">
            {others.map((c) => (
              <TransitionLink
                key={c.id}
                href={c.href}
                color={cssVar[c.accent]}
                className={`focus-bauhaus inline-flex min-h-11 items-center gap-2 border-[3px] border-ink px-3 font-body text-xs font-bold uppercase tracking-wide text-ink transition-transform hover:-translate-y-0.5 sm:px-4 sm:text-sm ${ACCENT_BG[c.accent]}`}
              >
                <span className="font-extrabold">{c.number}</span>
                <span className="hidden sm:inline">{c.title}</span>
                <span className="sr-only sm:hidden">{c.title}</span>
              </TransitionLink>
            ))}
          </nav>
        </div>

        <div className="relative mx-auto max-w-6xl px-5 pt-10 pb-8 sm:px-8 sm:pt-14 sm:pb-10">
          {eyebrow && (
            <p className="mb-3 font-body text-xs font-bold uppercase tracking-[0.35em] text-ink/80">
              {eyebrow}
            </p>
          )}
          <h1 className="hyphens-auto break-words font-display text-5xl font-semibold leading-[0.95] text-ink sm:text-7xl lg:text-8xl">
            {title}
          </h1>
        </div>
      </header>

      <main id="main-content" className="page-enter flex-1">
        {children}
      </main>
    </div>
  );
}

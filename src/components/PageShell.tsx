import type { ReactNode } from "react";
import { FaArrowLeftLong, FaArrowRightLong } from "react-icons/fa6";
import StickyNav from "@/components/StickyNav";
import TransitionLink from "@/components/transition/TransitionLink";
import { ACCENT_BG, CATEGORIES, type Category } from "@/lib/navigation";
import InkSweep, { INK_SWEEP_TEXT } from "@/components/InkSweep";

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
  const band = bandColorClass ?? ACCENT_BG[category.accent];

  return (
    <div className="flex min-h-screen flex-1 flex-col bg-cream font-body text-ink">
      {/* sticky row: Home + switcher always in reach while scrolling */}
      <StickyNav
        titleId="page-title"
        title={title}
        bandClass={band}
        left={
          <TransitionLink
            href={back.href}
            className="focus-bauhaus inline-flex min-h-11 shrink-0 items-center gap-2 border-[3px] border-ink bg-cream px-4 font-body text-sm font-bold uppercase tracking-wide text-ink shadow-bauhaus-sm transition-transform hover:-translate-x-0.5"
          >
            <FaArrowLeftLong className="h-4 w-4" aria-hidden="true" />
            {back.label}
          </TransitionLink>
        }
        right={
          <nav aria-label="Other sections" className="flex shrink-0 gap-2">
            {others.map((c) => (
              <TransitionLink
                key={c.id}
                href={c.href}
                className={`focus-bauhaus group relative inline-flex min-h-11 items-center overflow-hidden border-[3px] border-ink px-3 font-body text-xs font-bold uppercase tracking-wide text-ink sm:px-4 sm:text-sm ${ACCENT_BG[c.accent]}`}
              >
                <InkSweep />
                <span className={`relative inline-flex items-center gap-2 ${INK_SWEEP_TEXT}`}>
                  <span className="font-extrabold">{c.number}</span>
                  <span>{c.title}</span>
                </span>
              </TransitionLink>
            ))}
          </nav>
        }
        menu={
          <nav aria-label="All sections">
            <ul>
              {CATEGORIES.map((c, i) => {
                const isCurrent = c.id === current;
                return (
                  <li key={c.id} className={i === 0 ? "" : "border-t-[3px] border-ink"}>
                    <TransitionLink
                      href={c.href}
                      aria-current={isCurrent ? "page" : undefined}
                      className={`focus-bauhaus flex min-h-14 items-center gap-3 px-5 text-ink ${ACCENT_BG[c.accent]}`}
                    >
                      <span className="font-body text-sm font-extrabold">{c.number}</span>
                      <span className="flex-1 font-display text-2xl font-semibold lowercase">
                        {c.title}
                      </span>
                      {isCurrent ? (
                        <span className="font-body text-xs font-bold uppercase tracking-wide">
                          You are here
                        </span>
                      ) : (
                        <FaArrowRightLong className="h-4 w-4" aria-hidden="true" />
                      )}
                    </TransitionLink>
                  </li>
                );
              })}
            </ul>
          </nav>
        }
      />

      {/* big poster title: scrolls away normally under the sticky row */}
      <header className={`relative overflow-hidden border-b-[3px] border-ink ${band}`}>
        {/* decorative circle, echoes the hero motifs. Anchored to the bottom
            edge: cut by the ink border it reads as intentional, whereas a cut at
            the top would show a hard seam against the sticky row above. */}
        <span
          aria-hidden="true"
          className="pointer-events-none absolute -bottom-28 -right-16 h-56 w-56 rounded-full border-[14px] border-ink/15"
        />

        <div className="relative mx-auto max-w-6xl px-5 pt-5 pb-8 sm:px-8 sm:pt-9 sm:pb-10">
          {eyebrow && (
            <p className="mb-3 font-body text-xs font-bold uppercase tracking-[0.35em] text-ink/80">
              {eyebrow}
            </p>
          )}
          <h1
            id="page-title"
            className="hyphens-auto break-words font-display text-5xl font-semibold leading-[0.95] text-ink sm:text-7xl lg:text-8xl"
          >
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

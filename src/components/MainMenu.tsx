import { FaArrowRightLong } from "react-icons/fa6";
import TransitionLink from "@/components/transition/TransitionLink";
import { ACCENT_BG, CATEGORIES, type Category } from "@/lib/navigation";
import { cssVar } from "@/lib/design-tokens";

/** One geometric motif per card, same vocabulary as the hero tiles. */
function Motif({ id }: { id: Category["id"] }) {
  const base =
    "pointer-events-none absolute transition-transform duration-700 ease-[cubic-bezier(0.22,1,0.36,1)] motion-reduce:transition-none";

  if (id === "about") {
    // quarter circle in the corner — grows from its corner on hover
    return (
      <span
        aria-hidden="true"
        className={`${base} -right-1 -top-1 h-28 w-28 rounded-tl-full bg-ink/15 group-hover:scale-125 group-focus-visible:scale-125 sm:h-36 sm:w-36`}
        style={{ transformOrigin: "100% 0" }}
      />
    );
  }
  if (id === "projects") {
    return (
      <span
        aria-hidden="true"
        className={`${base} right-4 top-4 h-24 w-24 bg-ink/15 group-hover:translate-x-2 group-hover:-translate-y-2 group-focus-visible:translate-x-2 group-focus-visible:-translate-y-2 sm:h-32 sm:w-32`}
        style={{ clipPath: "polygon(0 0, 100% 0, 100% 100%)" }}
      />
    );
  }
  return (
    <span
      aria-hidden="true"
      className={`${base} -right-6 -top-6 h-28 w-28 rounded-full border-[12px] border-ink/15 group-hover:scale-110 group-focus-visible:scale-110 sm:h-36 sm:w-36`}
    />
  );
}

export default function MainMenu() {
  return (
    <nav
      aria-label="Main sections"
      className="bg-cream px-3 pb-10 sm:px-5 sm:pb-14"
    >
      <ul className="mx-auto grid max-w-7xl gap-5 md:grid-cols-3 md:gap-6">
        {CATEGORIES.map((c) => (
          <li key={c.id} className="flex">
            <TransitionLink
              href={c.href}
              color={cssVar[c.accent]}
              // the card itself never moves on hover (moving it shifts its edge out from
              // under the cursor → flicker); only transforms inside it animate
              className="focus-bauhaus group flex w-full flex-col border-[3px] border-ink bg-cream text-ink shadow-bauhaus"
            >
              <span
                className={`relative flex min-h-40 flex-col justify-between overflow-hidden border-b-[3px] border-ink p-5 sm:min-h-52 sm:p-6 ${ACCENT_BG[c.accent]}`}
              >
                <Motif id={c.id} />
                <span className="relative font-body text-xl font-extrabold leading-none tracking-wider">
                  {c.number}
                </span>
                <span className="relative mt-8 font-display text-4xl font-semibold lowercase leading-[0.95] sm:text-5xl">
                  {c.title}
                </span>
              </span>

              <span className="relative flex flex-1 items-center justify-between gap-4 overflow-hidden px-5 py-4 transition-colors duration-300 group-hover:text-cream group-focus-visible:text-cream sm:px-6">
                {/* ink fill sweeping in from the left: scaleX is GPU-composited, no repaint */}
                <span
                  aria-hidden="true"
                  className="absolute inset-0 origin-left scale-x-0 bg-ink transition-transform duration-400 ease-[cubic-bezier(0.22,1,0.36,1)] group-hover:scale-x-100 group-focus-visible:scale-x-100 motion-reduce:transition-none"
                />
                <span className="relative font-body text-sm leading-snug sm:text-base">
                  {c.teaser}
                </span>
                <FaArrowRightLong
                  aria-hidden="true"
                  className="relative h-5 w-5 shrink-0 transition-transform duration-300 group-hover:translate-x-1.5 group-focus-visible:translate-x-1.5 motion-reduce:transition-none"
                />
              </span>
            </TransitionLink>
          </li>
        ))}
      </ul>
    </nav>
  );
}

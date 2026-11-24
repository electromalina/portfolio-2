import { FaArrowRightLong } from "react-icons/fa6";
import TransitionLink from "@/components/transition/TransitionLink";
import { ACCENT_BG, CATEGORIES, type Category } from "@/lib/navigation";
import { cssVar } from "@/lib/design-tokens";
import InkSweep, { INK_SWEEP_TEXT } from "@/components/InkSweep";

/** One static geometric motif per card, same vocabulary as the hero tiles. */
function Motif({ id }: { id: Category["id"] }) {
  const base = "pointer-events-none absolute";

  if (id === "about") {
    // quarter circle in the corner — grows from its corner on hover
    return (
      <span
        aria-hidden="true"
        className={`${base} -right-1 -top-1 h-28 w-28 rounded-tl-full bg-ink/15 sm:h-36 sm:w-36`}
      />
    );
  }
  if (id === "projects") {
    return (
      <span
        aria-hidden="true"
        className={`${base} right-4 top-4 h-24 w-24 bg-ink/15 sm:h-32 sm:w-32`}
        style={{ clipPath: "polygon(0 0, 100% 0, 100% 100%)" }}
      />
    );
  }
  return (
    <span
      aria-hidden="true"
      className={`${base} -right-6 -top-6 h-28 w-28 rounded-full border-[12px] border-ink/15 sm:h-36 sm:w-36`}
    />
  );
}

export default function MainMenu() {
  return (
    <nav
      aria-label="Main sections"
      className="bg-cream px-3 pb-6 sm:px-5 lg:pb-5"
    >
      <ul className="mx-auto grid max-w-7xl gap-5 md:grid-cols-3 md:gap-6">
        {CATEGORIES.map((c) => (
          // @container: the title is sized by the card's own width (cqi), since the
          // layout width follows the viewport height, not just the viewport width
          <li key={c.id} className="@container flex">
            <TransitionLink
              href={c.href}
              color={cssVar[c.accent]}
              // the card itself never moves on hover (moving it shifts its edge out from
              // under the cursor → flicker); only transforms inside it animate
              className="focus-bauhaus group flex w-full flex-col border-[3px] border-ink bg-cream text-ink shadow-bauhaus"
            >
              <span
                className={`relative flex min-h-36 flex-col justify-between overflow-hidden border-b-[3px] border-ink p-5 sm:min-h-40 sm:p-6 ${ACCENT_BG[c.accent]}`}
              >
                <Motif id={c.id} />
                <span className="relative font-body text-xl font-extrabold leading-none tracking-wider">
                  {c.number}
                </span>
                <span className="relative mt-5 font-display text-[clamp(2rem,14cqi,3rem)] font-semibold lowercase leading-[1.1]">
                  {/* ink underline growing from the left, same timing as the bottom sweep.
                      Painted as a background on the inline text (cloned per line), so each
                      wrapped line gets its own underline exactly as wide as its text. */}
                  <span className="box-decoration-clone bg-[linear-gradient(var(--color-ink),var(--color-ink))] bg-[length:0%_3px] bg-[position:0_100%] bg-no-repeat pb-0.5 transition-[background-size] duration-400 ease-[cubic-bezier(0.22,1,0.36,1)] group-hover:bg-[length:100%_3px] group-focus-visible:bg-[length:100%_3px] motion-reduce:transition-none">
                    {c.title}
                  </span>
                </span>
              </span>

              <span
                className={`relative flex flex-1 items-center justify-between gap-4 overflow-hidden px-5 py-4 sm:px-6 ${INK_SWEEP_TEXT}`}
              >
                <InkSweep />
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

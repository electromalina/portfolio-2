import StickerBoard from "@/components/personality/StickerBoard";
import { STICKER_BOARD_COLOR } from "@/lib/design-tokens";
import type { Brand } from "@/lib/personality";

type BrandsSectionProps = {
  brands: readonly Brand[];
  eyebrow: string;
  title: string;
  intro: string;
  hint: string;
};

/**
 * Full-width blue band with the sticker board, built like the ink music band
 * above it. Ink text on blue (cream would be too low-contrast); the eyebrow
 * chip borrows the board's Midnight with cream text.
 */
export default function BrandsSection({ brands, eyebrow, title, intro, hint }: BrandsSectionProps) {
  return (
    <section aria-labelledby="brands-heading" className="overflow-hidden bg-blue text-ink">
      <div className="mx-auto max-w-6xl px-5 py-12 sm:px-8 lg:py-10">
        <div className="flex flex-wrap items-end justify-between gap-x-10 gap-y-4">
          <div>
            {/* same Midnight as the board below, so the label reads as part of it */}
            <p
              style={{ backgroundColor: STICKER_BOARD_COLOR }}
              className="inline-block px-2 py-0.5 font-body text-xs font-bold uppercase tracking-[0.35em] text-cream"
            >
              {eyebrow}
            </p>
            <h2
              id="brands-heading"
              className="mt-3 font-display text-4xl font-semibold lowercase leading-[1.05] text-balance sm:text-5xl"
            >
              {title}
            </h2>
            <p className="mt-3 max-w-3xl font-body text-base leading-relaxed text-ink/85">
              {intro}
            </p>
          </div>
          <p className="font-body text-sm font-bold">
            <span aria-hidden="true">✦ </span>
            {hint}
          </p>
        </div>

        <StickerBoard brands={brands} />
      </div>
    </section>
  );
}

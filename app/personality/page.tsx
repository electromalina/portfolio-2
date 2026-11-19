import type { Metadata } from "next";
import PageShell from "@/components/PageShell";
import AlbumShowcase from "@/components/personality/AlbumShowcase";
import BrandTile from "@/components/personality/BrandTile";
import { ALBUMS, MUSIC_SECTION } from "@/lib/albums";
import { BRANDS } from "@/lib/personality";

export const metadata: Metadata = {
  title: "Personality",
  description: "The records and brands behind Danylo Kalynovskyi's work.",
};

// small fixed tilts give the board a hand-made feel without randomness (SSR-safe)
const TILTS = [-6, 4, -3, 7, -5, 3, -7, 5, -4, 6, -2];

export default function PersonalityPage() {
  return (
    <PageShell current="personality" eyebrow="03 · off the clock" title="personality">
      {/* full-width ink band, outside the max-width container */}
      <AlbumShowcase albums={ALBUMS} {...MUSIC_SECTION} />

      <div className="mx-auto max-w-6xl px-5 py-12 sm:px-8 sm:py-16">
        <section aria-labelledby="brands-heading">
          <div className="mb-8 flex flex-wrap items-end justify-between gap-4">
            <h2 id="brands-heading" className="section-tab lowercase">
              my favorite brands
            </h2>
            <p className="font-body text-sm font-medium text-ink/70">
              ✦ tap a sticker for the story
            </p>
          </div>
          <ul className="grid grid-cols-2 gap-5 sm:grid-cols-3 sm:gap-6 lg:grid-cols-4">
            {BRANDS.map((brand, i) => (
              <li key={brand.id}>
                <BrandTile brand={brand} tilt={TILTS[i % TILTS.length]} />
              </li>
            ))}
          </ul>
        </section>
      </div>
    </PageShell>
  );
}

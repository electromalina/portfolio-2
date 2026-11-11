import type { Metadata } from "next";
import PageShell from "@/components/PageShell";
import BrandTile from "@/components/personality/BrandTile";
import { BRANDS, FACTS, MUSIC } from "@/lib/personality";

export const metadata: Metadata = {
  title: "Personality",
  description: "The music, brands and habits behind Danylo Kalynovskyi's work.",
};

// small fixed tilts give the board a hand-made feel without randomness (SSR-safe)
const TILTS = [-6, 4, -3, 7, -5, 3, -7, 5, -4, 6, -2];

export default function PersonalityPage() {
  return (
    <PageShell current="personality" eyebrow="03 · off the clock" title="personality">
      <div className="mx-auto max-w-6xl px-5 py-12 sm:px-8 sm:py-16">
        <div className="grid grid-cols-2 gap-5 sm:gap-6 lg:grid-cols-4">
          {/* music: the biggest tile */}
          <section
            aria-labelledby="music-heading"
            className="col-span-2 flex flex-col gap-6 border-[3px] border-ink bg-blue p-5 shadow-bauhaus sm:p-7 lg:row-span-2"
          >
            <h2 id="music-heading" className="section-tab self-start lowercase">
              passion
            </h2>
            <p className="font-body text-lg leading-relaxed text-ink">{MUSIC.text}</p>
            {/* the Spotify embed has ~12px rounded corners — match them on the frame */}
            <div className="mt-auto overflow-hidden rounded-xl border-[3px] border-ink bg-cream">
              <iframe
                src={MUSIC.spotifyEmbed}
                title="Spotify playlist"
                loading="lazy"
                allow="autoplay; clipboard-write; encrypted-media; fullscreen; picture-in-picture"
                className="h-[352px] w-full"
              />
            </div>
          </section>

          {/* now vibing */}
          <div className="relative col-span-2 overflow-hidden border-[3px] border-ink bg-yellow p-5 shadow-bauhaus sm:p-7">
            <span
              aria-hidden="true"
              className="anim-spin-slow absolute -right-10 -bottom-10 h-36 w-36 rounded-full border-[14px] border-dashed border-ink/20"
            />
            <p className="font-body text-xs font-bold uppercase tracking-[0.35em] text-ink/80">
              now vibing to
            </p>
            <p className="relative mt-3 font-display text-4xl font-semibold lowercase leading-none sm:text-5xl">
              {MUSIC.nowPlaying}
            </p>
          </div>

          {/* quick facts */}
          <section
            aria-labelledby="facts-heading"
            className="col-span-2 flex flex-col border-[3px] border-ink bg-cream shadow-bauhaus"
          >
            <h2
              id="facts-heading"
              className="border-b-[3px] border-ink bg-orange px-5 py-2 font-display text-xl font-semibold lowercase text-ink"
            >
              quick facts
            </h2>
            {/* rows share the leftover height so the tile never looks half-empty */}
            <dl className="grid flex-1 auto-rows-fr">
              {FACTS.map((f, i) => (
                <div
                  key={f.label}
                  className={`grid grid-cols-[8.5rem_minmax(0,1fr)] items-center gap-4 px-5 py-3 ${
                    i > 0 ? "border-t-2 border-ink/20" : ""
                  }`}
                >
                  <dt className="font-body text-xs font-bold uppercase tracking-wide text-ink/75">
                    {f.label}
                  </dt>
                  <dd className={`font-display text-2xl lowercase leading-tight ${f.placeholder ? "text-ink/50 italic" : ""}`}>
                    {f.value}
                  </dd>
                </div>
              ))}
            </dl>
          </section>
        </div>

        {/* brands */}
        <section aria-labelledby="brands-heading" className="mt-16">
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

"use client";

import { useFadeInLeft, useFadeInRight } from "@/app/hooks/useScrollAnimation";

export default function Passion() {
  const textRef = useFadeInLeft(0, 1, "top 80%");
  const spotifyRef = useFadeInRight(0.3, 1, "top 80%");

  return (
    <section
      id="passion"
      className="min-h-screen flex items-center px-4 sm:px-6 lg:px-8 snap-section"
    >
      <div className="max-w-7xl mx-auto w-full">
        <div className="grid gap-12 lg:gap-16 xl:gap-20 lg:grid-cols-[minmax(0,0.95fr)_minmax(0,0.85fr)] items-center">
          <div ref={textRef as React.RefObject<HTMLDivElement>} className="space-y-8 lg:space-y-10">
            <div className="space-y-4">
              <h2 className="text-4xl md:text-5xl font-bold text-primary">
                Passion
              </h2>
              <p className="text-base md:text-lg leading-relaxed text-foreground/80 max-w-xl">
                Music is my background code. It keeps my brain in sync, fuels late-night
                design sprints, and sets the tone for every idea I bring to life. My
                playlist is a peek into my creative chaos – a mix of focus beats,
                dopamine drops, and pure vibes. Hit play and you’ll probably
                understand me better than any bio could.
              </p>
            </div>

            <div className="flex items-center gap-6 text-primary">
              <span className="flex-1 h-[2px] bg-primary/70" aria-hidden="true" />
              <span className="text-sm tracking-[0.4em] uppercase">★</span>
              <span className="flex-1 h-[2px] bg-primary/70" aria-hidden="true" />
            </div>

            <p className="text-sm md:text-base text-foreground/70">
              Now vibing to: <span className="font-mono text-foreground"> Minimal House</span>
            </p>
          </div>

          <div ref={spotifyRef as React.RefObject<HTMLDivElement>} className="glass-card rounded-3xl overflow-hidden w-full max-w-xl lg:max-w-md xl:max-w-lg mx-auto shadow-lg">
            <iframe
              src="https://open.spotify.com/embed/playlist/2FlK0lSTgJMojzUpEK89D5?utm_source=generator"
              title="Spotify playlist: Keep Going"
              loading="lazy"
              allow="autoplay; clipboard-write; encrypted-media; fullscreen; picture-in-picture"
              className="w-full h-[380px] md:h-[420px]"
            />
          </div>
        </div>
      </div>
    </section>
  );
}


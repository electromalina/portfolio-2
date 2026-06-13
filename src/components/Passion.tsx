import Reveal from "@/components/Reveal";
import SectionHeading from "@/components/SectionHeading";

export default function Passion() {
  return (
    <section
      id="passion"
      className="relative overflow-hidden bg-blue px-5 py-24 sm:px-8 lg:py-32"
    >
      {/* decorative stripes */}
      <span className="pointer-events-none absolute -right-10 top-10 h-40 w-40 rounded-full border-[10px] border-ink/30" />
      <span className="pointer-events-none absolute bottom-8 left-6 h-0 w-0 border-x-[40px] border-b-[70px] border-x-transparent border-b-ink/20" />

      <div className="mx-auto grid max-w-6xl items-center gap-12 lg:grid-cols-[minmax(0,1fr)_minmax(0,0.95fr)] lg:gap-16">
        <Reveal className="space-y-7">
          <SectionHeading>passion</SectionHeading>
          <p className="font-body text-lg leading-relaxed text-ink sm:text-xl">
            Music is my background code. It keeps my brain in sync, fuels
            late-night design sprints, and sets the tone for every idea I bring
            to life. My playlist is a peek into my creative chaos: a mix of
            focus beats, dopamine drops, and pure vibes. Hit play and you&apos;ll
            probably understand me better than any bio could.
          </p>

          <div className="flex items-center gap-4 text-ink">
            <span className="h-[3px] flex-1 bg-ink" aria-hidden="true" />
            <span className="font-display text-2xl">★</span>
            <span className="h-[3px] flex-1 bg-ink" aria-hidden="true" />
          </div>

          <p className="font-body text-base text-ink">
            Now vibing to:{" "}
            <span className="bg-yellow px-2 py-0.5 font-semibold">
              Minimal House
            </span>
          </p>
        </Reveal>

        <Reveal delay={150} className="relative">
          {/* the Spotify embed has ~12px rounded corners — match them on the frame */}
          <span className="absolute -bottom-4 -right-4 -z-0 h-full w-full rounded-xl bg-orange" />
          <div className="relative z-10 overflow-hidden rounded-xl border-[3px] border-ink bg-cream shadow-bauhaus">
            <iframe
              src="https://open.spotify.com/embed/playlist/2FlK0lSTgJMojzUpEK89D5?utm_source=generator"
              title="Spotify playlist"
              loading="lazy"
              allow="autoplay; clipboard-write; encrypted-media; fullscreen; picture-in-picture"
              className="h-[420px] w-full"
            />
          </div>
        </Reveal>
      </div>
    </section>
  );
}

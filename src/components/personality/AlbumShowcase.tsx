"use client";

import Image from "next/image";
import {
  useEffect,
  useId,
  useRef,
  useState,
  type CSSProperties,
  type KeyboardEvent,
  type PointerEvent,
  type ReactNode,
} from "react";
import {
  FaArrowLeftLong,
  FaArrowRightLong,
  FaArrowUpRightFromSquare,
  FaChevronDown,
  FaSpotify,
} from "react-icons/fa6";
import type { Album } from "@/lib/albums";

type AlbumShowcaseProps = {
  albums: readonly Album[];
  eyebrow: string;
  title: string;
  intro: string;
};

/** "3" → "03" */
const pad = (n: number) => String(n).padStart(2, "0");

/** horizontal distance (px) a pointer must travel on the cover to count as a swipe */
const SWIPE_THRESHOLD = 40;

const EASE = "ease-[cubic-bezier(0.22,1,0.36,1)]";

/**
 * Album carousel on an ink band: cover with a slowly spinning vinyl, details
 * and track list beside it, a strip of mini covers to jump around.
 *
 * Client component because it holds the selected album in state; the album
 * data itself is passed in from the (server) page.
 */
export default function AlbumShowcase({
  albums,
  eyebrow,
  title,
  intro,
}: AlbumShowcaseProps) {
  const [index, setIndex] = useState(0);
  const [tracksOpen, setTracksOpen] = useState(false);
  // cover/vinyl animations only run after the first switch, not on page load
  const [switched, setSwitched] = useState(false);
  const total = albums.length;
  const album = albums[index];

  const headingId = useId();
  const tracksId = useId();

  // wrap around: going "next" from the last album lands on the first
  const go = (i: number) => {
    setIndex(((i % total) + total) % total);
    setSwitched(true);
  };
  const prev = () => go(index - 1);
  const next = () => go(index + 1);

  // keep the active thumbnail visible in the scrollable strip (phones).
  // scrollTo on the strip itself, not scrollIntoView, so the page never jumps.
  const stripRef = useRef<HTMLUListElement>(null);
  const isFirstRender = useRef(true);
  useEffect(() => {
    if (isFirstRender.current) {
      isFirstRender.current = false;
      return;
    }
    const strip = stripRef.current;
    const thumb = strip?.children[index] as HTMLElement | undefined;
    if (!strip || !thumb) return;
    const reduce = window.matchMedia(
      "(prefers-reduced-motion: reduce)",
    ).matches;
    strip.scrollTo({
      left: thumb.offsetLeft - (strip.clientWidth - thumb.clientWidth) / 2,
      behavior: reduce ? "auto" : "smooth",
    });
  }, [index]);

  // swipe on the cover: compare where the pointer went down and came up
  const swipeStart = useRef<{ x: number; y: number } | null>(null);
  const onPointerDown = (e: PointerEvent) => {
    swipeStart.current = { x: e.clientX, y: e.clientY };
  };
  const onPointerUp = (e: PointerEvent) => {
    const start = swipeStart.current;
    swipeStart.current = null;
    if (!start) return;
    const dx = e.clientX - start.x;
    const dy = e.clientY - start.y;
    // mostly horizontal, far enough → swipe; otherwise it was a tap or a scroll
    if (Math.abs(dx) > SWIPE_THRESHOLD && Math.abs(dx) > Math.abs(dy)) {
      if (dx < 0) next();
      else prev();
    }
  };

  const onKeyDown = (e: KeyboardEvent) => {
    if (e.key === "ArrowRight") {
      e.preventDefault();
      next();
    } else if (e.key === "ArrowLeft") {
      e.preventDefault();
      prev();
    }
  };

  return (
    <section
      aria-labelledby={headingId}
      aria-roledescription="carousel"
      onKeyDown={onKeyDown}
      className="overflow-hidden bg-ink text-cream"
    >
      <div className="mx-auto max-w-6xl px-5 py-12 sm:px-8 lg:py-10">
        {/* header */}
        {/* chip in the band's highlight colour, like the sticker board's label */}
        <p className="inline-block bg-yellow px-2 py-0.5 font-body text-xs font-bold uppercase tracking-[0.35em] text-ink">
          {eyebrow}
        </p>
        <h2
          id={headingId}
          className="mt-2 font-display text-4xl font-semibold lowercase leading-[1.05] text-balance sm:text-5xl"
        >
          {title}
        </h2>
        <p className="mt-3 max-w-3xl font-body text-base leading-relaxed text-cream/75">
          {intro}
        </p>

        {/* mobile: cover → controls → thumbs → info; desktop: cover | info, thumbs below */}
        <div className="mt-8 grid gap-x-14 gap-y-8 [grid-template-areas:'cover'_'thumbs'_'info'] lg:grid-cols-[minmax(0,5fr)_minmax(0,7fr)] lg:[grid-template-areas:'cover_info'_'thumbs_thumbs']">
          {/* cover + vinyl. Top-aligned with the details: the details cell is sized
              for the tallest album, so centring would leave the cover floating
              below a short album's title. */}
          <div className="[grid-area:cover]">
            <div
              className="relative w-full max-w-md touch-pan-y select-none lg:max-w-none"
              onPointerDown={onPointerDown}
              onPointerUp={onPointerUp}
              onPointerCancel={() => (swipeStart.current = null)}
            >
              {/* the cover takes 78% of the width; the disc (same size) sits
                  behind it shifted right by 28% of its own width → fills the rest */}
              <div className="relative w-[78%]">
                <Vinyl key={album.id} animate={switched} />
                <div className="relative aspect-square bg-ink">
                  <Image
                    key={album.id}
                    src={album.cover}
                    alt={`Cover of ${album.title} by ${album.artist}`}
                    placeholder="blur"
                    sizes="(min-width: 1024px) 350px, 75vw"
                    draggable={false}
                    className={`h-full w-full object-cover ${
                      switched
                        ? "motion-safe:animate-[cover-in_0.45s_cubic-bezier(0.22,1,0.36,1)]"
                        : ""
                    }`}
                  />
                </div>
              </div>
            </div>

            {/* desktop controls: under the cover, where there's spare height */}
            <div className="mt-7 hidden items-center gap-6 lg:flex">
              <div className="flex gap-3">
                <NavButton direction="prev" onClick={prev} />
                <NavButton direction="next" onClick={next} />
              </div>
              <SpotifyLink href={album.spotifyUrl} />
            </div>

            {/* phone controls: prev · counter · next */}
            <div className="mt-8 flex items-center justify-between lg:hidden">
              <NavButton direction="prev" onClick={prev} />
              <Counter index={index} total={total} small />
              <NavButton direction="next" onClick={next} />
            </div>
          </div>

          {/* details */}
          <div className="min-w-0 [grid-area:info]">
            {/*
              Every album's details are rendered on top of each other in ONE grid
              cell; only the active one is visible. The cell is therefore always as
              tall as the tallest album, so switching records never changes the
              section's height (no jumping). Hidden ones use `invisible`, which also
              removes them from keyboard focus and screen readers.
            */}
            <div className="relative">
              <Stack albums={albums} index={index}>
                {(a) => (
                  <>
                    <AlbumMeta album={a} />
                    {/* desktop: track list always open, part of the stacked cell */}
                    <div className="mt-5 hidden lg:block">
                      <Label>track list</Label>
                      <TrackList album={a} />
                    </div>
                  </>
                )}
              </Stack>
              {/* desktop counter, top-right next to artist + title (which get
                  right padding to make room). Fixed-width digits, so "01" and
                  "08" take the same space and nothing re-wraps. */}
              <Counter
                index={index}
                total={total}
                className="pointer-events-none absolute top-0 right-0 hidden lg:flex"
              />
            </div>

            {/* phone: collapsible track list for the active album only */}
            <div className="mt-6 border-t-[3px] border-cream/20 lg:hidden">
              <button
                type="button"
                aria-expanded={tracksOpen}
                aria-controls={tracksId}
                onClick={() => setTracksOpen((o) => !o)}
                className="focus-bauhaus flex min-h-12 w-full items-center justify-between font-body text-sm font-bold uppercase tracking-[0.2em]"
              >
                track list · {album.tracks.length} tracks
                <FaChevronDown
                  aria-hidden="true"
                  className={`h-4 w-4 transition-transform duration-300 motion-reduce:transition-none ${
                    tracksOpen ? "rotate-180" : ""
                  }`}
                />
              </button>
              {/* same drop-down / pull-up as the nav menu: the grid row animates
                  0fr ↔ 1fr, which (unlike height: auto) the browser can transition */}
              <div
                id={tracksId}
                inert={!tracksOpen}
                className={`grid transition-[grid-template-rows] duration-300 ${EASE} motion-reduce:transition-none ${
                  tracksOpen ? "grid-rows-[1fr]" : "grid-rows-[0fr]"
                }`}
              >
                <div className="overflow-hidden">
                  <TrackList album={album} />
                </div>
              </div>
            </div>

            {/* phone: Spotify link at the end of the details */}
            <div className="mt-6 lg:hidden">
              <SpotifyLink href={album.spotifyUrl} />
            </div>
          </div>

          {/* thumbnail strip: scrolls sideways on phones, one fixed-size row on desktop */}
          <ul
            ref={stripRef}
            aria-label="Choose an album"
            className="-mx-5 flex snap-x snap-mandatory gap-3 overflow-x-auto px-5 pt-2 pb-4 [grid-area:thumbs] [scrollbar-width:thin] sm:-mx-8 sm:px-8 lg:mx-0 lg:overflow-visible lg:px-0 lg:pb-0"
          >
            {albums.map((a, i) => {
              const active = i === index;
              return (
                <li key={a.id} className="shrink-0 snap-center">
                  <button
                    type="button"
                    onClick={() => go(i)}
                    aria-label={`${pad(i + 1)}: ${a.title} by ${a.artist}`}
                    aria-current={active ? "true" : undefined}
                    className={`focus-bauhaus relative block aspect-square w-20 border-[3px] transition-[translate,opacity,box-shadow] duration-300 motion-reduce:transition-none sm:w-[4.5rem] lg:w-16 ${
                      active
                        ? "-translate-y-1 border-cream opacity-100 shadow-[5px_5px_0_0_var(--color-orange)]"
                        : "border-cream/30 opacity-60 hover:-translate-y-1 hover:opacity-100"
                    }`}
                  >
                    <Image
                      src={a.cover}
                      alt=""
                      sizes="80px"
                      className="h-full w-full object-cover"
                    />
                    <span
                      aria-hidden="true"
                      className="absolute bottom-0 left-0 bg-ink px-1.5 py-0.5 font-body text-xs font-extrabold text-cream"
                    >
                      {pad(i + 1)}
                    </span>
                  </button>
                </li>
              );
            })}
          </ul>
        </div>

        {/* screen readers: announce the album that's now showing */}
        <p aria-live="polite" className="sr-only">
          Album {index + 1} of {total}: {album.title} by {album.artist}
        </p>
      </div>
    </section>
  );
}

/** Renders `children` for every album in one grid cell; only `index` is visible. */
function Stack({
  albums,
  index,
  className = "",
  children,
}: {
  albums: readonly Album[];
  index: number;
  className?: string;
  children: (album: Album) => ReactNode;
}) {
  return (
    <div className={`grid ${className}`}>
      {albums.map((a, i) => (
        <div
          key={a.id}
          // only the incoming album fades in; the outgoing one disappears at
          // once, so two albums' text never overlaps mid-transition
          className={`[grid-area:1/1] ${
            i === index
              ? "visible opacity-100 transition-opacity duration-300 motion-reduce:transition-none"
              : "invisible opacity-0"
          }`}
        >
          {children(a)}
        </div>
      ))}
    </div>
  );
}

/** Small yellow caps label ("why it stuck", "track list"). */
function Label({ children }: { children: string }) {
  return (
    <p className="font-body text-xs font-bold uppercase tracking-[0.25em] text-yellow">
      {children}
    </p>
  );
}

/** Artist · year, title, and the "why it stuck" text. */
function AlbumMeta({ album }: { album: Album }) {
  return (
    <>
      {/* lg:pr-36 keeps artist + title clear of the counter in the corner */}
      <div className="lg:pr-36">
        <p className="font-body text-sm font-bold uppercase tracking-[0.2em] text-cream/65">
          {album.artist}
          {album.artistOriginal && ` (${album.artistOriginal})`} · {album.year}
        </p>
        <h3 className="mt-1.5 font-display text-3xl font-semibold leading-[1.05] text-balance break-words lg:text-4xl">
          {album.title}
        </h3>
        {album.titleOriginal && (
          <p lang="ru" className="mt-1 font-body text-sm text-cream/65">
            {album.titleOriginal}
          </p>
        )}
      </div>
      <div className="mt-5">
        <Label>why it stuck</Label>
        <p className="mt-1.5 font-body text-base leading-relaxed">
          {album.whyItStuck}
        </p>
      </div>
    </>
  );
}

/**
 * Numbered tracks. On desktop: two columns filled top-to-bottom (01–08 left,
 * 09–15 right) via grid-auto-flow: column with a fixed row count.
 */
function TrackList({ album }: { album: Album }) {
  const rows = Math.ceil(album.tracks.length / 2);
  return (
    <ol
      style={{ "--rows": rows } as CSSProperties}
      className="grid lg:mt-1.5 lg:grid-flow-col lg:grid-cols-2 lg:grid-rows-[repeat(var(--rows),auto)] lg:gap-x-8"
    >
      {album.tracks.map((t, i) => (
        <li
          key={i}
          className="flex gap-3 border-b border-cream/15 py-1 font-body text-sm leading-snug"
        >
          <span className="w-5 shrink-0 tabular-nums text-cream/50">
            {pad(i + 1)}
          </span>
          <span className="min-w-0">
            <span className="font-semibold">{t.title}</span>
            {t.translation && (
              <span className="text-cream/55"> · {t.translation}</span>
            )}
          </span>
        </li>
      ))}
    </ol>
  );
}

function SpotifyLink({ href }: { href: string }) {
  return (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      className="focus-bauhaus inline-flex min-h-11 items-center gap-2 font-body font-bold text-yellow underline decoration-2 underline-offset-4 transition-colors hover:text-cream"
    >
      <FaSpotify aria-hidden="true" className="h-5 w-5" />
      Listen on Spotify
      <FaArrowUpRightFromSquare aria-hidden="true" className="h-3 w-3" />
      <span className="sr-only">(opens in a new tab)</span>
    </a>
  );
}

/** "03 / 10" */
function Counter({
  index,
  total,
  small = false,
  className = "",
}: {
  index: number;
  total: number;
  small?: boolean;
  className?: string;
}) {
  return (
    <p
      aria-hidden="true"
      className={`flex items-baseline gap-2 font-display tabular-nums ${className}`}
    >
      <span
        className={`font-semibold leading-none ${small ? "text-4xl" : "text-6xl"}`}
      >
        {pad(index + 1)}
      </span>
      <span className={`text-cream/50 ${small ? "text-lg" : "text-2xl"}`}>
        / {pad(total)}
      </span>
    </p>
  );
}

/** Square prev/next button; "next" is the primary (orange) one. */
function NavButton({
  direction,
  onClick,
}: {
  direction: "prev" | "next";
  onClick: () => void;
}) {
  const isNext = direction === "next";
  const Icon = isNext ? FaArrowRightLong : FaArrowLeftLong;
  return (
    <button
      type="button"
      onClick={onClick}
      aria-label={isNext ? "Next album" : "Previous album"}
      className={`focus-bauhaus inline-flex h-12 w-12 items-center justify-center border-[3px] border-cream shadow-[4px_4px_0_0_var(--color-cream)] transition-[translate,box-shadow] duration-150 hover:-translate-y-0.5 active:translate-x-[2px] active:translate-y-[2px] active:shadow-[2px_2px_0_0_var(--color-cream)] motion-reduce:transition-none ${
        isNext ? "bg-orange text-ink" : "bg-ink text-cream"
      }`}
    >
      <Icon aria-hidden="true" className="h-5 w-5" />
    </button>
  );
}

/**
 * Record peeking out from behind the cover. Outer span: slides out when the
 * album changes (re-keyed; skipped on first load). Inner span: grooves
 * (repeating radial gradient) plus two faint light wedges (conic gradient).
 * The grooves are perfectly round, so spinning them alone would look static;
 * the wedges are what make the slow rotation visible. Both animations are off
 * under prefers-reduced-motion.
 */
function Vinyl({ animate }: { animate: boolean }) {
  return (
    <span
      aria-hidden="true"
      className={`pointer-events-none absolute inset-0 translate-x-[28%] ${
        animate
          ? "motion-safe:animate-[vinyl-out_0.7s_cubic-bezier(0.22,1,0.36,1)]"
          : ""
      }`}
    >
      <span
        className="absolute inset-0 rounded-full motion-safe:animate-[spin-slow_14s_linear_infinite]"
        style={{
          background: [
            "conic-gradient(from 0deg, transparent 0deg 30deg, rgb(238 223 191 / 0.12) 50deg, transparent 70deg 210deg, rgb(238 223 191 / 0.08) 230deg, transparent 250deg)",
            "repeating-radial-gradient(circle, #1b1a1a 0 3px, #262425 3px 5px)",
          ].join(", "),
        }}
      />
    </span>
  );
}

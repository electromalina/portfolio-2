"use client";

import Image from "next/image";
import { useState } from "react";

// same rule as images.remotePatterns in next.config.ts
const SUPABASE_HOST = process.env.NEXT_PUBLIC_SUPABASE_URL
  ? new URL(process.env.NEXT_PUBLIC_SUPABASE_URL).hostname
  : null;

// cover column: ~640px next to the sidebar on desktop, full width below lg
const SIZES = "(min-width: 1024px) 640px, 100vw";

type CoverKind = "video" | "optimized" | "plain";

function coverKind(src: string): CoverKind {
  // pathname, so a ?query after the extension doesn't matter
  let url: URL;
  try {
    url = new URL(src);
  } catch {
    return "plain";
  }
  if (/\.(mp4|webm)$/i.test(url.pathname)) return "video";
  // GIFs pass through the optimizer unchanged anyway, so don't spend quota on them
  if (url.hostname === SUPABASE_HOST && !/\.gif$/i.test(url.pathname)) return "optimized";
  return "plain";
}

/**
 * Project cover that is never cropped: full width, height follows the media's
 * own aspect ratio. The media is visible while it loads (no hiding until it's
 * fully downloaded); a 16:9 box with a placeholder sits behind it meanwhile.
 *
 * - .mp4/.webm → muted looping <video> (an animated GIF is ~5-10x bigger)
 * - our Supabase Storage → next/image: resized + WebP/AVIF, cached on Vercel's CDN
 * - anything else → plain <img>
 */
export default function ProjectCover({
  src,
  alt,
}: {
  src: string | null;
  alt: string;
}) {
  if (!src) return <PlaceholderBox />;
  // key resets the state when navigating between projects
  return <CoverMedia key={src} src={src} alt={alt} />;
}

function CoverMedia({ src, alt }: { src: string; alt: string }) {
  const [failed, setFailed] = useState(false);
  // hides the placeholder behind the media (it would show through transparent PNGs)
  const [loaded, setLoaded] = useState(false);
  if (failed) return <PlaceholderBox />;

  const onError = () => setFailed(true);
  const onLoad = () => setLoaded(true);
  const kind = coverKind(src);
  // h-auto + width/height attributes: the browser reserves a 16:9 box until
  // the real size is known, then the element takes the media's own ratio
  const mediaClass = "relative block h-auto w-full";

  return (
    <div className="relative">
      {!loaded && <Placeholder pulse />}
      {kind === "video" ? (
        <video
          src={src}
          width={1600}
          height={900}
          // muted + playsInline are required for autoplay on mobile
          autoPlay
          muted
          loop
          playsInline
          preload="auto"
          // it's a cover, not a player: no picture-in-picture button / casting
          disablePictureInPicture
          disableRemotePlayback
          aria-label={alt}
          // first frame is ready (with faststart this comes long before the full file)
          onLoadedData={onLoad}
          onError={onError}
          className={mediaClass}
        />
      ) : kind === "optimized" ? (
        <Image
          src={src}
          alt={alt}
          width={1600}
          height={900}
          sizes={SIZES}
          priority
          onLoad={onLoad}
          onError={onError}
          className={mediaClass}
        />
      ) : (
        // plain <img>: unknown hosts aren't allowed through the image optimizer
        // eslint-disable-next-line @next/next/no-img-element
        <img
          src={src}
          alt={alt}
          width={1600}
          height={900}
          fetchPriority="high"
          decoding="async"
          onLoad={onLoad}
          onError={onError}
          className={mediaClass}
        />
      )}
    </div>
  );
}

function PlaceholderBox() {
  return (
    <div className="relative aspect-video w-full">
      <Placeholder />
    </div>
  );
}

function Placeholder({ pulse = false }: { pulse?: boolean }) {
  return (
    <div aria-hidden="true" className="absolute inset-0 flex items-center justify-center">
      <span
        className={`h-24 w-24 rounded-full border-[10px] border-ink/25 ${
          pulse ? "animate-pulse motion-reduce:animate-none" : ""
        }`}
      />
    </div>
  );
}

"use client";

import { useCallback, useState } from "react";

type CoverStatus = "loading" | "loaded" | "error";

/**
 * Project cover that is never cropped: once loaded, the frame takes the image's
 * own aspect ratio (always full width, height follows the image).
 * Until then a 16:9 placeholder box reserves space so the layout doesn't collapse.
 */
export default function ProjectCover({
  src,
  alt,
}: {
  src: string | null;
  alt: string;
}) {
  if (!src) return <PlaceholderBox />;
  // key resets the loading state when navigating between projects
  return <CoverImage key={src} src={src} alt={alt} />;
}

function CoverImage({ src, alt }: { src: string; alt: string }) {
  const [status, setStatus] = useState<CoverStatus>("loading");

  // an image that's already cached can be complete before onLoad is attached
  const imgRef = useCallback((img: HTMLImageElement | null) => {
    if (img?.complete && img.naturalWidth > 0) setStatus("loaded");
  }, []);

  if (status === "error") return <PlaceholderBox />;

  const loaded = status === "loaded";

  return (
    <div className={loaded ? "" : "relative aspect-video w-full"}>
      {!loaded && <Placeholder pulse />}
      {/* plain <img>: cover URLs can be any host, which next/image would reject */}
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        ref={imgRef}
        src={src}
        alt={alt}
        fetchPriority="high"
        decoding="async"
        onLoad={() => setStatus("loaded")}
        onError={() => setStatus("error")}
        // loading: stacked invisibly over the placeholder.
        // loaded: in normal flow, full width, natural height (no crop, no bars).
        className={
          loaded
            ? "block h-auto w-full"
            : "absolute inset-0 h-full w-full opacity-0"
        }
      />
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
    <div className="absolute inset-0 flex items-center justify-center">
      <span
        className={`h-24 w-24 rounded-full border-[10px] border-ink/25 ${
          pulse ? "animate-pulse motion-reduce:animate-none" : ""
        }`}
      />
    </div>
  );
}

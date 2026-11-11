"use client";

import { useCallback, useState } from "react";

type CoverStatus = "loading" | "loaded" | "error";

/** Project cover with a reserved box + placeholder, so nothing jumps while it loads. */
export default function ProjectCover({
  src,
  alt,
}: {
  src: string | null;
  alt: string;
}) {
  return (
    <div className="relative aspect-video max-h-[min(60vh,34rem)] w-full">
      {src ? (
        // key resets the loading state when navigating between projects
        <CoverImage key={src} src={src} alt={alt} />
      ) : (
        <CoverPlaceholder />
      )}
    </div>
  );
}

function CoverImage({ src, alt }: { src: string; alt: string }) {
  const [status, setStatus] = useState<CoverStatus>("loading");

  // an image that's already cached can be complete before onLoad is attached
  const imgRef = useCallback((img: HTMLImageElement | null) => {
    if (img?.complete && img.naturalWidth > 0) setStatus("loaded");
  }, []);

  return (
    <>
      {status !== "loaded" && <CoverPlaceholder pulse={status === "loading"} />}
      {status !== "error" && (
        // plain <img>: cover URLs can be any host, which next/image would reject
        // eslint-disable-next-line @next/next/no-img-element
        <img
          ref={imgRef}
          src={src}
          alt={alt}
          fetchPriority="high"
          decoding="async"
          onLoad={() => setStatus("loaded")}
          onError={() => setStatus("error")}
          className={`absolute inset-0 h-full w-full object-contain transition-opacity duration-300 motion-reduce:transition-none ${
            status === "loaded" ? "opacity-100" : "opacity-0"
          }`}
        />
      )}
    </>
  );
}

function CoverPlaceholder({ pulse = false }: { pulse?: boolean }) {
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

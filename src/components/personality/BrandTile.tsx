"use client";

import { useState } from "react";
import type { Brand } from "@/lib/personality";

/**
 * Square tile that flips (3D, CSS only) to show why I like the brand.
 * Both faces stay in the DOM, so screen readers always get name + story;
 * aria-pressed tells them which side is showing.
 */
export default function BrandTile({ brand, tilt }: { brand: Brand; tilt: number }) {
  const [flipped, setFlipped] = useState(false);

  return (
    <button
      type="button"
      aria-pressed={flipped}
      onClick={() => setFlipped((f) => !f)}
      className="focus-bauhaus group block aspect-square w-full cursor-pointer perspective-[900px]"
    >
      <span
        className={`relative block h-full w-full transition-transform duration-500 ease-[cubic-bezier(0.22,1,0.36,1)] transform-3d motion-reduce:transition-none ${
          flipped ? "rotate-y-180" : ""
        }`}
      >
        {/* front: logo */}
        <span className="absolute inset-0 flex flex-col items-center justify-center gap-3 border-[3px] border-ink bg-cream p-5 shadow-bauhaus-sm backface-hidden">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={brand.src}
            alt=""
            draggable={false}
            className="h-1/2 w-3/4 object-contain"
            style={{ transform: `rotate(${tilt}deg)` }}
          />
          <span className="font-body text-xs font-bold uppercase tracking-[0.2em] text-ink/70">
            {brand.name}
          </span>
        </span>

        {/* back: the story */}
        <span className="absolute inset-0 flex flex-col justify-between border-[3px] border-ink bg-ink p-4 text-left text-cream shadow-bauhaus-sm backface-hidden rotate-y-180 sm:p-5">
          <span className="font-display text-xl font-semibold lowercase leading-none text-yellow">
            {brand.name}
          </span>
          <span className="font-body text-sm leading-snug text-cream/90">
            {brand.blurb}
          </span>
        </span>
      </span>
    </button>
  );
}

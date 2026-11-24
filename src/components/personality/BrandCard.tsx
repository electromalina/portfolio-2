"use client";

import { useState } from "react";
import type { Brand } from "@/lib/personality";

/**
 * The card for the sticker you're holding. It always sits in the board's
 * top-right corner (one fixed spot is easier to follow than one that moves):
 * stuck stickers go under it, the one you're holding floats over it. It stays put while you drag (a finger
 * never covers it) and keeps the last brand while it fades out.
 */
export default function BrandCard({ brand }: { brand: Brand | null }) {
  // remember the last brand, so the text doesn't vanish halfway through the fade
  const [shown, setShown] = useState(brand);
  if (brand && brand !== shown) setShown(brand);
  const visible = brand !== null;

  return (
    <div
      aria-live="polite"
      className={`pointer-events-none absolute top-3 z-[45] w-max max-w-[min(24rem,calc(100%-1.5rem))] border-[3px] border-ink bg-ink px-4 py-2.5 shadow-bauhaus-sm transition-[opacity,translate] duration-200 ease-out motion-reduce:transition-opacity sm:top-4 sm:max-w-[min(24rem,calc(100%-2rem))] right-3 sm:right-4 ${visible ? "translate-y-0 opacity-100" : "-translate-y-1.5 opacity-0 motion-reduce:translate-y-0"}`}
    >
      {shown && (
        // keyed, so switching brands fades the new text in
        <div key={shown.id} className="transition-opacity duration-200 starting:opacity-0">
          <p className="font-display text-xl font-semibold lowercase leading-tight text-yellow">
            {shown.name}
          </p>
          <p className="mt-1 font-body text-sm leading-snug text-cream">{shown.blurb}</p>
        </div>
      )}
    </div>
  );
}

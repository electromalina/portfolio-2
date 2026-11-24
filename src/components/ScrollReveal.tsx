"use client";

import { useLayoutEffect } from "react";
import { usePathname } from "next/navigation";

/**
 * Slides `.reveal` elements in (styles in globals.css) the first time they
 * scroll into view. Mounted once in the root layout; re-scans on every route
 * change, so pages only need to add the `reveal` class (Server Components too).
 */
export default function ScrollReveal() {
  const pathname = usePathname();

  // useLayoutEffect: runs before the new page is painted, so on-screen
  // sections are shown in their first frame instead of sliding in
  useLayoutEffect(() => {
    const items = Array.from(
      document.querySelectorAll<HTMLElement>(".reveal:not(.is-visible)")
    );

    // already on screen when the page loads: show instantly. Only sections
    // further down slide in, once you scroll to them.
    const offscreen = items.filter((el) => {
      const r = el.getBoundingClientRect();
      const onScreen = r.top < window.innerHeight && r.bottom > 0;
      if (onScreen) showWithoutTransition(el);
      return !onScreen;
    });

    // from now on .reveal hides content (see globals.css)
    document.documentElement.classList.add("reveal-ready");

    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (!entry.isIntersecting) continue;
          entry.target.classList.add("is-visible");
          observer.unobserve(entry.target); // reveal once, not on every scroll
        }
      },
      // trigger a bit before the element's top reaches the bottom edge
      { rootMargin: "0px 0px -10% 0px" }
    );
    offscreen.forEach((el) => observer.observe(el));

    return () => observer.disconnect();
  }, [pathname]);

  return null;
}

/** add .is-visible with the CSS transition switched off for that one change */
function showWithoutTransition(el: HTMLElement) {
  el.style.transition = "none";
  el.classList.add("is-visible");
  void el.offsetHeight; // force the browser to apply the change now
  el.style.transition = "";
}

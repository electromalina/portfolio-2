import Hero from "@/components/Hero";
import MainMenu from "@/components/MainMenu";

// The homepage is fully static: no DB fetch, so it's served from the CDN instantly.
//
// On desktop everything should fit on one screen. The hero's height follows its
// width (square tiles, 12×4 → height = width × 4/12), so we cap the width by the
// viewport height instead: width ≤ (100dvh − ~21rem for the menu + padding) × 12/4.
// Short laptop screens get a slightly narrower layout instead of a scrollbar.
// Floor of 56rem: on very short viewports (e.g. DevTools docked at the bottom)
// it stops shrinking and the page scrolls instead of collapsing.
export default function Home() {
  return (
    <div className="flex flex-1 flex-col bg-cream font-body text-ink">
      <main
        id="main-content"
        className="flex w-full flex-1 flex-col lg:mx-auto lg:justify-center lg:max-w-[max(56rem,min(82.5rem,calc((100dvh_-_21rem)*3)))]"
      >
        <Hero />
        <MainMenu />
      </main>
    </div>
  );
}

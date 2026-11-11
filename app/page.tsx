import Hero from "@/components/Hero";
import MainMenu from "@/components/MainMenu";

// The homepage is now fully static: no DB fetch, so it's served from the CDN instantly.
export default function Home() {
  return (
    <div className="flex flex-1 flex-col bg-cream font-body text-ink">
      <main id="main-content" className="flex flex-1 flex-col">
        <Hero />
        <MainMenu />
      </main>
      <footer className="border-t-[3px] border-ink bg-ink px-5 py-4 text-cream sm:px-8">
        <div className="mx-auto flex max-w-7xl flex-wrap items-center justify-between gap-2 font-body text-xs text-cream/70">
          <p>© {new Date().getFullYear()} Danylo Kalynovskyi</p>
          <a
            href="mailto:kalinovskiydan@gmail.com"
            className="focus-bauhaus underline-offset-4 hover:text-cream hover:underline"
          >
            kalinovskiydan@gmail.com
          </a>
        </div>
      </footer>
    </div>
  );
}

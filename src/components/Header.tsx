const NAV = [
  { label: "Home", href: "#home" },
  { label: "About Me", href: "#about" },
  { label: "Work", href: "#work" },
  { label: "Contact", href: "#contact" },
];

export default function Header() {
  return (
    <header className="sticky top-0 z-50 border-b-[3px] border-ink bg-ink">
      <div className="mx-auto flex max-w-7xl items-center justify-between gap-3 px-4 sm:px-6">
        <a
          href="#home"
          className="focus-bauhaus shrink-0 py-3 font-display text-2xl lowercase leading-none text-cream sm:text-4xl"
        >
          kalynovskyi danylo
        </a>
        <nav aria-label="Primary" className="flex items-stretch">
          {NAV.map((item) => (
            <a
              key={item.href}
              href={item.href}
              className="focus-bauhaus min-h-11 px-3 py-3 font-body text-xs font-medium text-cream transition-colors hover:bg-orange sm:px-5 sm:py-4 sm:text-base"
            >
              {item.label}
            </a>
          ))}
        </nav>
      </div>
    </header>
  );
}

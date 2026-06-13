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
          className="shrink-0 py-3 font-display text-xl lowercase leading-none text-cream sm:text-3xl"
        >
          kalynovskyi danylo
        </a>
        <nav className="flex items-stretch">
          {NAV.map((item) => (
            <a
              key={item.href}
              href={item.href}
              className="px-2.5 py-4 font-body text-xs font-medium text-cream transition-colors hover:bg-orange sm:px-5 sm:text-base"
            >
              {item.label}
            </a>
          ))}
        </nav>
      </div>
    </header>
  );
}

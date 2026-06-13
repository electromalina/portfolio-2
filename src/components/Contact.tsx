import { FaGithub, FaLinkedinIn } from "react-icons/fa6";

export default function Contact() {
  return (
    <footer
      id="contact"
      className="relative overflow-hidden bg-ink px-5 py-20 text-cream sm:px-8"
    >
      <span className="pointer-events-none absolute -left-10 -top-10 h-40 w-40 rounded-full border-[10px] border-orange/60" />
      <span className="pointer-events-none absolute bottom-6 right-10 h-0 w-0 border-x-[45px] border-b-[80px] border-x-transparent border-b-blue/50" />

      <div className="relative mx-auto max-w-4xl text-center">
        <p className="font-body text-sm uppercase tracking-[0.4em] text-cream/70">
          let&apos;s build something
        </p>
        <h2 className="mt-4 font-display text-6xl lowercase leading-none sm:text-8xl">
          get in touch
        </h2>

        <a
          href="mailto:kalinovskiydan@gmail.com"
          className="focus-bauhaus mt-8 inline-block border-[3px] border-cream bg-orange px-7 py-3 font-display text-3xl lowercase text-cream shadow-[6px_6px_0_0_var(--color-blue)] transition-transform hover:-translate-y-1"
        >
          kalinovskiydan@gmail.com
        </a>

        <div className="mt-10 flex justify-center gap-4">
          <a
            href="https://github.com/electromalina"
            target="_blank"
            rel="noopener noreferrer"
            aria-label="GitHub"
            className="focus-bauhaus flex h-12 w-12 items-center justify-center border-[3px] border-cream text-cream transition-colors hover:bg-cream hover:text-ink"
          >
            <FaGithub className="h-5 w-5" />
          </a>
          <a
            href="https://www.linkedin.com/in/electromalina/"
            target="_blank"
            rel="noopener noreferrer"
            aria-label="LinkedIn"
            className="focus-bauhaus flex h-12 w-12 items-center justify-center border-[3px] border-cream text-cream transition-colors hover:bg-cream hover:text-ink"
          >
            <FaLinkedinIn className="h-5 w-5" />
          </a>
        </div>

        <p className="mt-12 font-body text-xs text-cream/70">
          © {new Date().getFullYear()} Danylo Kalynovskyi
        </p>
      </div>
    </footer>
  );
}

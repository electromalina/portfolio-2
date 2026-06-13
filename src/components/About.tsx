import Image from "next/image";
import Reveal from "@/components/Reveal";
import SectionHeading from "@/components/SectionHeading";

const TAG_CLASSES = ["bg-yellow", "bg-blue", "bg-orange", "bg-cream"] as const;

export default function About() {
  return (
    <section
      id="about"
      className="bauhaus-grid relative bg-cream px-5 py-24 sm:px-8 lg:py-32"
    >
      <div className="relative mx-auto grid max-w-6xl items-center gap-12 lg:grid-cols-[minmax(0,0.85fr)_minmax(0,1fr)] lg:gap-20">
        <Reveal className="relative mx-auto w-full max-w-sm">
          <span className="absolute -bottom-5 -left-5 -z-0 h-full w-full bg-blue" />
          <div className="relative z-10 aspect-[4/5] w-full overflow-hidden border-[3px] border-ink bg-cream shadow-bauhaus">
            <Image
              src="/portfolio-pic.jpg"
              alt="Portrait of Danylo Kalynovskyi"
              fill
              sizes="(max-width: 1024px) 90vw, 380px"
              className="object-cover"
            />
          </div>
          <span className="absolute -right-4 -top-4 z-20 h-12 w-12 rounded-full border-[3px] border-ink bg-orange" />
        </Reveal>

        <Reveal delay={120} className="space-y-7">
          <SectionHeading>about me</SectionHeading>
          <p className="font-body text-lg leading-relaxed text-ink/85 sm:text-xl">
            Passionate media design student specializing mainly in front-end web
            development and UI/UX design. Experienced in developing brandings,
            creating high-fidelity prototypes, conducting project research, and
            designing logos. Additionally basic skilled in photography. An
            excellent collaborator, with a positive attitude and a willingness to
            learn.
          </p>
          <div className="flex flex-wrap gap-3 pt-1">
            {["Front-end", "UI/UX", "Branding", "Photography"].map((tag, i) => (
              <span
                key={tag}
                className={`border-[3px] border-ink px-4 py-1.5 font-body text-sm font-semibold text-ink ${TAG_CLASSES[i % TAG_CLASSES.length]}`}
              >
                {tag}
              </span>
            ))}
          </div>
        </Reveal>
      </div>
    </section>
  );
}

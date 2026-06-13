import Header from "@/components/Header";
import Hero from "@/components/Hero";
import About from "@/components/About";
import Passion from "@/components/Passion";
import Brands from "@/components/Brands";
import Skills from "@/components/Skills";
import Projects from "@/components/Projects";
import Contact from "@/components/Contact";
import { getPublishedProjects } from "@/lib/projects";

// Always reflect the live project list from Supabase.
export const dynamic = "force-dynamic";

export default async function Home() {
  const projects = await getPublishedProjects();

  return (
    <div className="flex flex-1 flex-col bg-cream font-body text-ink">
      <Header />
      <Hero />
      <About />
      <Passion />
      <Brands />
      <Skills />
      <Projects projects={projects} />
      <Contact />
    </div>
  );
}

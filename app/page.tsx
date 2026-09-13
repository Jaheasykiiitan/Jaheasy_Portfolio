import { About } from "@/components/sections/about";
import { Contact } from "@/components/sections/contact";
import { Footer } from "@/components/sections/footer";
import { Hero } from "@/components/sections/hero";
import { Process } from "@/components/sections/process";
import {
  Experience,
  Services,
  Toolkit,
} from "@/components/sections/services-and-co";
import { SelectedWork } from "@/components/sections/selected-work";
import { Showreel } from "@/components/sections/showreel";
import { Marquee } from "@/components/marquee";
import { getProjectsContent, getSiteContent } from "@/lib/content";

export default function Home() {
  const { site, heroBackdrop } = getSiteContent();
  const projects = getProjectsContent();

  return (
    <>
      <Hero site={site} heroBackdrop={heroBackdrop} />
      <Marquee />
      <Showreel site={site} />
      <SelectedWork site={site} projects={projects} />
      <About />
      <Services />
      <Toolkit />
      <Experience />
      <Process />
      <Contact />
      <Footer />
    </>
  );
}
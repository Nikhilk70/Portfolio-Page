import Hero from '@/components/sections/Hero';
import TechMarquee from '@/components/sections/TechMarquee';
import About from '@/components/sections/About';
import Skills from '@/components/sections/Skills';
import Services from '@/components/sections/Services';
import Experience from '@/components/sections/Experience';
import Projects from '@/components/sections/Projects';
import Education from '@/components/sections/Education';
import Contact from '@/components/sections/Contact';

export default function Home() {
  return (
    <>
      <Hero />
      <TechMarquee />
      <About />
      <Skills />
      <Services />
      <Experience />
      <Projects />
      <Education />
      <Contact />
    </>
  );
}

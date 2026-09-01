import { useRef } from "react";
import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

import { projects } from "../constants";
import TitleHeader from "../components/TitleHeader";

gsap.registerPlugin(ScrollTrigger);

const CardLink = ({ href, label }) => (
  <a
    href={href}
    target="_blank"
    rel="noopener noreferrer"
    className="font-mono text-[11px] tracking-[0.18em] uppercase text-white/65
               border-b border-white/25 pb-1
               hover:text-white hover:border-white/60 transition-colors duration-200"
  >
    {label} →
  </a>
);

const ProjectCard = ({ project }) => (
  <article
    className="project-card flex flex-col rounded-lg overflow-hidden
               border border-white/[0.10] bg-white/[0.02]
               transition-colors duration-300 hover:border-white/25"
  >
    {project.image && (
      <div className="aspect-video w-full overflow-hidden border-b border-white/[0.10]">
        <img
          src={project.image}
          alt={`${project.title} screenshot`}
          loading="lazy"
          className="w-full h-full object-cover"
        />
      </div>
    )}

    <div className="flex flex-col flex-1 p-6 md:p-7">
      <h3 className="font-mono text-white text-lg md:text-xl leading-snug mb-5">
        {project.title}
      </h3>

      {/* Always visible — the previous grid hid this behind :hover, which meant
          phones never saw a single project description. */}
      <p className="font-mono text-sm text-white/65 leading-[1.75] mb-8">
        {project.description}
      </p>

      <div className="mt-auto flex flex-wrap items-center gap-6">
        {project.liveUrl && <CardLink href={project.liveUrl} label="Website" />}
        {project.repoUrl && <CardLink href={project.repoUrl} label="GitHub" />}
      </div>
    </div>
  </article>
);

const Projects = () => {
  const sectionRef = useRef(null);

  useGSAP(() => {
    gsap.fromTo(
      ".project-card",
      { opacity: 0, y: 30 },
      {
        opacity: 1, y: 0, stagger: 0.09, duration: 0.65, ease: "power2.out",
        scrollTrigger: { trigger: sectionRef.current, start: "top 78%" },
      }
    );
  }, []);

  return (
    <section id="projects" ref={sectionRef} className="py-12 md:py-16 px-5 md:px-20">
      <TitleHeader title="Projects" sub="Things I have built" />

      <div className="mt-12 max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {projects.map((project) => (
          <ProjectCard key={project.title} project={project} />
        ))}
      </div>
    </section>
  );
};

export default Projects;

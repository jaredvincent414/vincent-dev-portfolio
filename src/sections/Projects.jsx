import { useRef } from "react";
import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

import { projects } from "../constants";
import TitleHeader from "../components/TitleHeader";

gsap.registerPlugin(ScrollTrigger);

const ProjectCard = ({ project }) => {
  const handleClick = () => {
    const url = project.liveUrl || project.repoUrl;
    if (url) window.open(url, "_blank", "noopener,noreferrer");
  };

  return (
    <div
      onClick={handleClick}
      className="group relative rounded-2xl overflow-hidden cursor-pointer border border-white/[0.08]
                 bg-[#0f0e24] transition-all duration-300 hover:border-purple-500/30
                 hover:shadow-[0_0_32px_rgba(168,85,247,0.12)] project-card"
    >
      {/* Image / gradient background */}
      <div className="aspect-video w-full overflow-hidden">
        {project.image ? (
          <img
            src={project.image}
            alt={project.title}
            className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
          />
        ) : (
          <div
            className="w-full h-full transition-transform duration-500 group-hover:scale-105"
            style={{ background: project.gradient }}
          />
        )}
      </div>

      {/* Hover overlay with description + links */}
      <div className="absolute inset-0 flex flex-col justify-center items-center p-6 text-center
                      bg-[#0d0d2b]/92 opacity-0 group-hover:opacity-100
                      transition-opacity duration-300 pointer-events-none group-hover:pointer-events-auto">
        <p className="text-white/80 text-sm leading-relaxed mb-6 max-w-xs">
          {project.description}
        </p>
        <div className="flex gap-3" onClick={(e) => e.stopPropagation()}>
          {project.liveUrl && (
            <a
              href={project.liveUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="px-4 py-2 rounded-lg bg-purple-500/20 border border-purple-500/40
                         text-white text-xs font-semibold tracking-wide
                         hover:bg-purple-500/35 hover:border-purple-500/70 transition-all duration-200"
            >
              Live Site →
            </a>
          )}
          {project.repoUrl && (
            <a
              href={project.repoUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="px-4 py-2 rounded-lg bg-white/[0.06] border border-white/[0.12]
                         text-white text-xs font-semibold tracking-wide
                         hover:bg-white/[0.12] hover:border-white/25 transition-all duration-200"
            >
              GitHub →
            </a>
          )}
        </div>
      </div>

      {/* Footer — always visible */}
      <div className="p-4 flex items-center justify-between gap-3">
        <h3 className="text-white font-bold text-sm leading-snug">{project.title}</h3>
        <div className="flex flex-wrap gap-1.5 justify-end">
          {project.tags.map((tag) => (
            <span
              key={tag}
              className="text-[10px] font-semibold px-2 py-0.5 rounded-full
                         bg-purple-500/10 border border-purple-500/20 text-purple-300/80"
            >
              {tag}
            </span>
          ))}
        </div>
      </div>
    </div>
  );
};

const Projects = () => {
  const sectionRef = useRef(null);

  useGSAP(() => {
    gsap.fromTo(
      ".project-card",
      { opacity: 0, y: 40 },
      {
        opacity: 1,
        y: 0,
        stagger: 0.12,
        duration: 0.7,
        ease: "power2.out",
        scrollTrigger: { trigger: sectionRef.current, start: "top 78%" },
      }
    );
  }, []);

  return (
    <section id="projects" ref={sectionRef} className="py-20 md:py-32 px-5 md:px-20">
      <TitleHeader title="Projects" sub="Things I have built" />
      <div className="mt-16 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5 max-w-6xl mx-auto">
        {projects.map((project) => (
          <ProjectCard key={project.title} project={project} />
        ))}
      </div>
    </section>
  );
};

export default Projects;

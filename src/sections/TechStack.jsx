import { useRef } from "react";
import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

import TitleHeader from "../components/TitleHeader";

gsap.registerPlugin(ScrollTrigger);

const skillCategories = [
  {
    title: "Programming Languages",
    skills: [
      { name: "Rust",       pct: 88 },
      { name: "TypeScript", pct: 87 },
      { name: "Python",     pct: 100 },
      { name: "Java",       pct: 100 },
      { name: "Swift",      pct: 75 },
      { name: "C / C++",   pct: 70 },
    ],
  },
  {
    title: "Systems & Infrastructure",
    skills: [
      { name: "Linux / Unix",              pct: 85 },
      { name: "Multithreading & Concurrency", pct: 88 },
      { name: "Microservices",             pct: 85 },
      { name: "Docker & Terraform",        pct: 78 },
      { name: "CI / CD",                   pct: 80 },
    ],
  },
  {
    title: "Backend & APIs",
    skills: [
      { name: "Node.js",      pct: 85 },
      { name: "Spring Boot",  pct: 72 },
      { name: "REST APIs",    pct: 90 },
      { name: "Async / Await & Fault Tolerance", pct: 85 },
      { name: ".NET",         pct: 65 },
    ],
  },
  {
    title: "Databases & Cloud",
    skills: [
      { name: "PostgreSQL / MySQL", pct: 83 },
      { name: "MongoDB",            pct: 78 },
      { name: "Supabase",           pct: 80 },
      { name: "AWS (EC2, S3, RDS, Aurora)", pct: 75 },
      { name: "Microsoft Azure",    pct: 65 },
    ],
  },
  {
    title: "AI / ML",
    skills: [
      { name: "LLM Pipelines & RAG", pct: 82 },
      { name: "Distributed Preprocessing", pct: 80 },
      { name: "Context Window Optimization", pct: 75 },
    ],
  },
  {
    title: "Mobile & Design",
    skills: [
      { name: "Swift / SwiftUI", pct: 78 },
      { name: "Xcode",           pct: 75 },
      { name: "Figma",           pct: 72 },
    ],
  },
];

const SkillBar = ({ name, pct }) => (
  <div className="mb-4">
    <p className="text-white/70 text-sm mb-1">{name}</p>
    <div className="w-full h-2 rounded-full bg-white/10 overflow-hidden">
      <div
        className="skill-bar h-full rounded-full origin-left scale-x-0"
        style={{
          width: `${pct}%`,
          background: "linear-gradient(90deg, #a855f7, #3b82f6)",
        }}
      />
    </div>
  </div>
);

const TechStack = () => {
  const sectionRef = useRef(null);

  useGSAP(() => {
    sectionRef.current.querySelectorAll(".skill-bar").forEach((bar) => {
      gsap.fromTo(
        bar,
        { scaleX: 0 },
        {
          scaleX: 1,
          duration: 1,
          ease: "power2.out",
          scrollTrigger: { trigger: bar, start: "top 88%" },
        }
      );
    });

    gsap.fromTo(
      ".skill-category",
      { opacity: 0, y: 30 },
      {
        opacity: 1,
        y: 0,
        stagger: 0.1,
        duration: 0.6,
        ease: "power2.out",
        scrollTrigger: { trigger: sectionRef.current, start: "top 80%" },
      }
    );
  }, []);

  return (
    <section id="skills" ref={sectionRef} className="py-20 md:py-32 px-5 md:px-20">
      <TitleHeader title="Skills" sub="What I work with" />

      <div className="mt-16 grid grid-cols-1 md:grid-cols-2 gap-8 max-w-5xl mx-auto">
        {skillCategories.map((cat) => (
          <div
            key={cat.title}
            className="skill-category opacity-0 rounded-2xl bg-[#0f0e24] border border-white/[0.08] px-7 py-6"
          >
            <h3 className="text-white font-bold text-base mb-5 tracking-wide">{cat.title}</h3>
            {cat.skills.map((s) => (
              <SkillBar key={s.name} name={s.name} pct={s.pct} />
            ))}
          </div>
        ))}
      </div>
    </section>
  );
};

export default TechStack;

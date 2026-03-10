import { useRef } from "react";
import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

import TitleHeader from "../components/TitleHeader";

gsap.registerPlugin(ScrollTrigger);

const skillCategories = [
  {
    title: "Programming Languages",
    icon: "⌨️",
    accent: "#a855f7",
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
    icon: "🖥️",
    accent: "#3b82f6",
    skills: [
      { name: "Linux / Unix",                pct: 85 },
      { name: "Multithreading & Concurrency", pct: 88 },
      { name: "Microservices",               pct: 85 },
      { name: "Docker & Terraform",          pct: 78 },
      { name: "CI / CD",                     pct: 80 },
    ],
  },
  {
    title: "Backend & APIs",
    icon: "⚙️",
    accent: "#06b6d4",
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
    icon: "☁️",
    accent: "#10b981",
    skills: [
      { name: "PostgreSQL / MySQL",         pct: 83 },
      { name: "MongoDB",                    pct: 78 },
      { name: "Supabase",                   pct: 80 },
      { name: "AWS (EC2, S3, RDS, Aurora)", pct: 75 },
      { name: "Microsoft Azure",            pct: 65 },
    ],
  },
  {
    title: "AI / ML",
    icon: "🤖",
    accent: "#f59e0b",
    skills: [
      { name: "LLM Pipelines & RAG",        pct: 82 },
      { name: "Distributed Preprocessing",  pct: 80 },
      { name: "Context Window Optimization", pct: 75 },
    ],
  },
  {
    title: "Mobile & Design",
    icon: "📱",
    accent: "#ec4899",
    skills: [
      { name: "Swift / SwiftUI", pct: 78 },
      { name: "Xcode",           pct: 75 },
      { name: "Figma",           pct: 72 },
    ],
  },
];

const BAR_COLOR = "#a855f7";
const PCT_COLOR = "rgba(168, 85, 247, 0.55)";

const SkillBar = ({ name, pct }) => (
  <div className="mb-5 group/bar">
    <div className="flex justify-between items-center mb-1.5">
      <p className="text-white/70 text-sm group-hover/bar:text-white transition-colors duration-200">
        {name}
      </p>
      <span
        className="text-xs font-bold tabular-nums"
        style={{ color: PCT_COLOR }}
        data-pct={pct}
      >
        0%
      </span>
    </div>
    <div className="w-full h-[5px] rounded-full bg-white/[0.07] overflow-hidden">
      <div
        className="skill-bar h-full rounded-full"
        style={{
          width: `${pct}%`,
          background: `linear-gradient(90deg, ${BAR_COLOR}99, ${BAR_COLOR})`,
          boxShadow: `0 0 8px ${BAR_COLOR}66`,
          transformOrigin: "left",
          transform: "scaleX(0)",
        }}
      />
    </div>
  </div>
);

const TechStack = () => {
  const sectionRef = useRef(null);

  useGSAP(() => {
    // Animate skill bars + counters together
    sectionRef.current.querySelectorAll(".skill-bar").forEach((bar) => {
      const counterEl = bar.closest(".group\\/bar")?.querySelector("[data-pct]");
      const target = counterEl ? parseInt(counterEl.dataset.pct, 10) : 0;

      ScrollTrigger.create({
        trigger: bar,
        start: "top 90%",
        once: true,
        onEnter() {
          gsap.to(bar, { scaleX: 1, duration: 1.2, ease: "power3.out" });
          if (counterEl) {
            gsap.to({ val: 0 }, {
              val: target,
              duration: 1.2,
              ease: "power2.out",
              onUpdate() {
                counterEl.textContent = `${Math.round(this.targets()[0].val)}%`;
              },
            });
          }
        },
      });
    });

    // Cards stagger in
    gsap.fromTo(
      ".skill-category",
      { opacity: 0, y: 40, scale: 0.97 },
      {
        opacity: 1, y: 0, scale: 1,
        stagger: 0.1,
        duration: 0.7,
        ease: "power2.out",
        scrollTrigger: { trigger: sectionRef.current, start: "top 78%" },
      }
    );
  }, []);

  return (
    <section id="skills" ref={sectionRef} className="py-20 md:py-32 px-5 md:px-20">
      <TitleHeader title="Skills" sub="What I work with" />

      <div className="mt-16 grid grid-cols-1 md:grid-cols-2 gap-6 max-w-5xl mx-auto">
        {skillCategories.map((cat) => (
          <div
            key={cat.title}
            className="skill-category opacity-0 rounded-2xl px-7 py-6
                       border border-white/[0.08] bg-[#0f0e24]
                       relative overflow-hidden
                       transition-all duration-300
                       hover:border-white/20 hover:-translate-y-1
                       group"
            style={{ boxShadow: `0 0 0 0 ${cat.accent}00` }}
            onMouseEnter={(e) => {
              e.currentTarget.style.boxShadow = `0 0 32px ${cat.accent}22, inset 0 0 32px ${cat.accent}08`;
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.boxShadow = "none";
            }}
          >
            {/* Subtle corner glow */}
            <div
              className="absolute -top-10 -right-10 w-32 h-32 rounded-full opacity-[0.12] pointer-events-none
                          transition-opacity duration-300 group-hover:opacity-[0.22]"
              style={{ background: `radial-gradient(circle, ${cat.accent}, transparent 70%)`, filter: "blur(20px)" }}
            />

            {/* Header */}
            <div className="flex items-center gap-3 mb-6">
              <span className="text-xl">{cat.icon}</span>
              <h3 className="text-white font-bold text-base tracking-wide">{cat.title}</h3>
            </div>

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

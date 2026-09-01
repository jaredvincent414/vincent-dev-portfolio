import { useRef } from "react";
import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

import TitleHeader from "../components/TitleHeader";

gsap.registerPlugin(ScrollTrigger);

// A 4-3-3. Position says what a tool does and how it relates to the rest —
// which is honest in a way a self-assigned percentage never was.
const formation = [
  {
    line: "Attack",
    abbr: "ATT",
    players: [
      { name: "Rust", note: "state sync, structural diffing" },
      { name: "Go", note: "sandboxed subprocess services" },
      { name: "Event-driven systems", note: "event sourcing, microservices" },
    ],
  },
  {
    line: "Midfield",
    abbr: "MID",
    players: [
      { name: "Python", note: "pipelines, parsing, data work" },
      { name: "TypeScript / Node.js", note: "APIs and services" },
      { name: "C# / ASP.NET Core", note: "containerized backends" },
    ],
  },
  {
    line: "Defence",
    abbr: "DEF",
    players: [
      { name: "Docker & Kubernetes", note: "reproducible environments" },
      { name: "AWS", note: "Lambda, ECS" },
      { name: "Terraform & CI/CD", note: "ship it the same way twice" },
      { name: "Prometheus & Grafana", note: "SLOs you can actually measure" },
    ],
  },
  {
    line: "Keeper",
    abbr: "GK",
    players: [
      { name: "PostgreSQL & Redis", note: "everything ends up here" },
    ],
  },
];

// The long tail — real experience, just not the first eleven.
const bench = [
  "Java", "Spring Boot", "SQL Server", "MongoDB", "GraphQL", "FastAPI",
  "pgvector", "LLM APIs", "Linux", "Bash", "Git", "JUnit",
];

// Faint pitch markings. Decorative only — the layout reads correctly without it.
const Pitch = () => (
  <svg
    className="absolute inset-0 w-full h-full hidden md:block pointer-events-none"
    viewBox="0 0 100 130"
    preserveAspectRatio="none"
    aria-hidden="true"
  >
    <g fill="none" stroke="rgba(255,255,255,0.07)" strokeWidth="0.35">
      <rect x="1" y="1" width="98" height="128" rx="1" />
      <line x1="1" y1="65" x2="99" y2="65" />
      <circle cx="50" cy="65" r="13" />
      {/* Penalty areas */}
      <rect x="24" y="1" width="52" height="18" />
      <rect x="24" y="111" width="52" height="18" />
      {/* Six-yard boxes */}
      <rect x="38" y="1" width="24" height="7" />
      <rect x="38" y="122" width="24" height="7" />
    </g>
  </svg>
);

const Player = ({ player }) => (
  <div
    className="player-chip rounded-xl border border-white/[0.10] bg-white/[0.03]
               px-4 py-3 w-full sm:w-44 text-center
               transition-all duration-300
               hover:border-grana-500/45 hover:bg-grana-500/[0.07] hover:-translate-y-1"
  >
    <p className="text-white text-sm font-bold leading-snug">{player.name}</p>
    <p className="text-white/65 text-[11px] leading-snug mt-1">{player.note}</p>
  </div>
);

const TechStack = () => {
  const pitchRef = useRef(null);

  useGSAP(() => {
    gsap.fromTo(
      ".player-chip",
      { y: 24, opacity: 0 },
      {
        y: 0, opacity: 1, stagger: 0.06, duration: 0.6, ease: "power2.out",
        scrollTrigger: { trigger: pitchRef.current, start: "top 80%" },
      }
    );
  }, []);

  return (
    <section id="skills" className="relative z-10 py-12 md:py-16 px-5 md:px-20">
      <TitleHeader title="Skills" sub="What I work with" />

      <div ref={pitchRef} className="relative mt-10 md:mt-12 max-w-4xl mx-auto">
        <Pitch />

        <div className="relative flex flex-col gap-10 md:gap-12 py-2 md:py-8 md:px-8">
          {formation.map((row) => (
            <div key={row.line} className="flex flex-col gap-3">
              <p className="text-grana-300 text-[11px] font-semibold tracking-[0.25em] uppercase
                            text-center md:text-left md:pl-1">
                {row.abbr} · {row.line}
              </p>

              <div className="flex flex-col sm:flex-row sm:flex-wrap justify-center items-stretch gap-3 md:gap-4">
                {row.players.map((player) => (
                  <Player key={player.name} player={player} />
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>

      <p className="text-center text-white/60 text-sm mt-8 md:mt-10 italic">
        A 4-3-3. The midfield does the work.
      </p>

      {/* Bench */}
      <div className="max-w-4xl mx-auto mt-10 pt-8 border-t border-white/[0.08]">
        <p className="text-white/65 text-[10px] font-semibold tracking-[0.25em] uppercase text-center mb-5">
          On the bench
        </p>
        <div className="flex flex-wrap justify-center gap-2">
          {bench.map((item) => (
            <span
              key={item}
              className="text-xs px-3 py-1.5 rounded-full border border-white/[0.10]
                         bg-white/[0.02] text-white/55
                         transition-colors duration-200 hover:text-white/85 hover:border-white/25"
            >
              {item}
            </span>
          ))}
        </div>
      </div>
    </section>
  );
};

export default TechStack;

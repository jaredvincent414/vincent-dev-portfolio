import { useState, useEffect } from "react";
import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

import HeroExperience from "../components/models/hero_models/HeroExperience";

gsap.registerPlugin(ScrollTrigger);

// ── Typewriter hook ─────────────────────────────────────────────────────────
const useTypewriter = (words, typeSpeed = 75, deleteSpeed = 40, pause = 1800) => {
  const [index, setIndex]       = useState(0);
  const [displayed, setDisplayed] = useState("");
  const [deleting, setDeleting]   = useState(false);

  useEffect(() => {
    const target = words[index];
    let t;
    if (!deleting) {
      if (displayed.length < target.length) {
        t = setTimeout(() => setDisplayed(target.slice(0, displayed.length + 1)), typeSpeed);
      } else {
        t = setTimeout(() => setDeleting(true), pause);
      }
    } else {
      if (displayed.length > 0) {
        t = setTimeout(() => setDisplayed(displayed.slice(0, -1)), deleteSpeed);
      } else {
        setDeleting(false);
        setIndex((i) => (i + 1) % words.length);
      }
    }
    return () => clearTimeout(t);
  }, [displayed, deleting, index, words, typeSpeed, deleteSpeed, pause]);

  return { displayed, index };
};

// ── Data ────────────────────────────────────────────────────────────────────
const GREETINGS = [
  { greeting: "Hi, I'm",           sub: "Let's connect!" },
  { greeting: "Bonjour, je suis",   sub: "Connectons-nous !" },
  { greeting: "Hola, soy",          sub: "¡Conectémonos!" },
  { greeting: "Ciao, sono",         sub: "Connettiamoci!" },
  { greeting: "Olá, eu sou",        sub: "Vamos nos conectar!" },
  { greeting: "Hallo, ich bin",     sub: "Lass uns verbinden!" },
  { greeting: "こんにちは、私は",     sub: "つながりましょう！" },
  { greeting: "안녕하세요, 저는",    sub: "연결해요!" },
  { greeting: "Jambo, mimi ni",     sub: "Tuungane!" },
];

// V        i         n         c         e         n         t
// blue → cyan → pink → orange-pink → orange → deep-orange → golden
const NAME_COLORS = ["#4facfe", "#00d2ff", "#ff6fa5", "#ff8c42", "#ff9f1c", "#f77f00", "#fcbf49"];

// ── Gem icon ────────────────────────────────────────────────────────────────
const GemIcon = ({ color1, color2, uid }) => (
  <svg width="56" height="56" viewBox="0 0 60 60" fill="none" aria-hidden="true">
    <defs>
      <linearGradient id={`g-${uid}`} x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" stopColor={color1} />
        <stop offset="100%" stopColor={color2} />
      </linearGradient>
    </defs>
    <polygon points="30,3 53,16.5 53,43.5 30,57 7,43.5 7,16.5" fill={`url(#g-${uid})`} />
    <polygon points="30,3 53,16.5 30,30"  fill="white" fillOpacity="0.20" />
    <polygon points="7,16.5 30,30 30,3"   fill="white" fillOpacity="0.09" />
    <polygon points="30,30 53,43.5 30,57" fill="black" fillOpacity="0.20" />
    <polygon points="30,57 7,43.5 30,30"  fill="black" fillOpacity="0.11" />
    <polygon points="7,16.5 30,30 7,43.5" fill="white" fillOpacity="0.05" />
    <polygon points="53,16.5 53,43.5 30,30" fill="black" fillOpacity="0.07" />
    <circle cx="36" cy="18" r="3" fill="white" fillOpacity="0.30" />
  </svg>
);

const roles = [
  { uid: "intern",  title: "Software Engineering Intern", color1: "#4facfe", color2: "#00f2fe", border: "linear-gradient(135deg,#4facfe,#00c6fb)" },
  { uid: "swe",     title: "Software Engineer",           color1: "#43e97b", color2: "#38f9d7", border: "linear-gradient(135deg,#43e97b,#38f9d7)" },
  { uid: "backend", title: "Backend Developer",           color1: "#667eea", color2: "#764ba2", border: "linear-gradient(135deg,#667eea,#764ba2)" },
  { uid: "it",      title: "IT Support Specialist",       color1: "#a855f7", color2: "#7c3aed", border: "linear-gradient(135deg,#a855f7,#c084fc)" },
];

// ── Component ────────────────────────────────────────────────────────────────
const Hero = () => {
  const greetingWords              = GREETINGS.map((g) => g.greeting);
  const { displayed, index: gIdx } = useTypewriter(greetingWords);
  const currentSub                 = GREETINGS[gIdx].sub;

  useGSAP(() => {
    // Role cards stagger in on scroll
    gsap.fromTo(".role-card", { y: 60, opacity: 0, scale: 0.92 }, {
      y: 0, opacity: 1, scale: 1, stagger: 0.15, duration: 0.8,
      ease: "back.out(1.4)",
      scrollTrigger: { trigger: ".role-cards-grid", start: "top 82%" },
    });

    // Overview heading slides in from left
    gsap.fromTo(".overview-heading", { x: -40, opacity: 0 }, {
      x: 0, opacity: 1, duration: 0.9, ease: "power2.out",
      scrollTrigger: { trigger: ".overview-heading", start: "top 85%" },
    });
  });

  return (
    <section id="hero" className="relative overflow-hidden">

      {/* ── Full-screen 3D scene ── */}
      <div className="relative w-full h-screen">
        <HeroExperience />

        {/* ── Scroll indicator — sits at bottom of the 3D viewport, above Overview ── */}
        <div className="absolute bottom-8 left-1/2 -translate-x-1/2 z-10 pointer-events-none
                        flex flex-col items-center gap-2">
          <div className="scroll-mouse">
            <div className="scroll-dot" />
          </div>
        </div>
      </div>

      {/* ── Text overlay — pointer-events-none so 3D stays interactive ── */}
      <div className="absolute top-0 left-0 w-full h-screen z-10 flex items-start
                      pointer-events-none"
           style={{ paddingTop: "15vh", paddingLeft: "clamp(1.5rem, 20%, 280px)" }}>
        <div className="flex items-start gap-3 md:gap-4">

          {/* Accent: purple dot + fading gradient line */}
          <div className="flex flex-col items-center flex-none mt-1">
            <div className="w-3 h-3 md:w-4 md:h-4 rounded-full bg-purple-500 shadow-[0_0_8px_2px_rgba(168,85,247,0.6)]" />
            <div className="w-[2px] h-20 md:h-28 mt-1 bg-gradient-to-b from-purple-500 via-blue-400 to-transparent rounded-full" />
          </div>

          {/* Text stack */}
          <div className="flex flex-col gap-1 md:gap-2">
            {/* Greeting + name on ONE line */}
            <h1 className="text-3xl md:text-5xl lg:text-6xl font-black leading-tight tracking-tight drop-shadow-xl">
              <span className="text-white">
                {displayed}
                <span className="hero-cursor" aria-hidden="true">|</span>
                {" "}
              </span>
              {"Vincent".split("").map((letter, i) => (
                <span key={i} style={{ color: NAME_COLORS[i % NAME_COLORS.length] }}>
                  {letter}
                </span>
              ))}
            </h1>

            {/* Tagline — changes with language */}
            <p className="text-white-50 text-sm md:text-lg font-medium mt-1 drop-shadow-md">
              {currentSub}
            </p>
          </div>
        </div>
      </div>

      {/* ── About / Overview ── */}
      <section id="about" className="py-24">
        <div className="container mx-auto px-6 md:px-20">

          {/* Header */}
          <div className="mb-14 overview-heading">
            <p className="text-[#839CB5] text-xs uppercase tracking-[0.3em] mb-4">
              Introduction
            </p>
            <h2 className="text-5xl md:text-7xl font-bold text-white mb-6 leading-none">
              Overview.
            </h2>
            <p className="text-gray-300 max-w-2xl leading-relaxed text-base md:text-lg">
              Hi, I am Vincent. I am currently a sophomore at Brandeis University
              studying Computer Science. I aspire to a technically challenging and
              cutting-edge career that allows me to contribute to the progress of
              technology and use it to help people, especially the marginalized.
              My interests include software design &amp; development, machine learning,
              natural language processing, and artificial intelligence.
            </p>
          </div>

          {/* Role cards */}
          <div className="role-cards-grid grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-5">
            {roles.map((role) => (
              <div
                key={role.uid}
                className="role-card opacity-0 p-px rounded-2xl group
                           transition-transform duration-300 hover:-translate-y-2 hover:scale-[1.03]"
                style={{ background: role.border }}
              >
                <div className="bg-[#0d0d1a] rounded-2xl p-6 md:p-8 h-full flex flex-col
                                items-center justify-center gap-5 text-center
                                min-h-[190px] md:min-h-[210px]
                                transition-colors duration-300 group-hover:bg-[#12122a]">
                  <div className="transition-transform duration-300 group-hover:scale-110 group-hover:drop-shadow-[0_0_12px_rgba(168,85,247,0.5)]">
                    <GemIcon color1={role.color1} color2={role.color2} uid={role.uid} />
                  </div>
                  <h3 className="text-white font-bold text-sm md:text-base leading-snug
                                 transition-colors duration-300 group-hover:text-white">
                    {role.title}
                  </h3>
                </div>
              </div>
            ))}
          </div>

        </div>
      </section>

    </section>
  );
};

export default Hero;

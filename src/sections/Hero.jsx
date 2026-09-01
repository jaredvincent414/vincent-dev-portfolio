import { useState, useEffect } from "react";
import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";



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
  "Hi, I'm", "Bonjour, je suis", "Hola, soy", "Ciao, sono", "Olá, eu sou",
  "Hallo, ich bin", "こんにちは、私は", "안녕하세요, 저는", "Jambo, mimi ni",
];

// ── Component ────────────────────────────────────────────────────────────────
const Hero = () => {
  const { displayed } = useTypewriter(GREETINGS);
  const [photoOk, setPhotoOk] = useState(false);

  useGSAP(() => {
    gsap.fromTo(".intro-block", { y: 40, opacity: 0 }, {
      y: 0, opacity: 1, duration: 0.9, ease: "power2.out",
    });
  });

  return (
    <section id="hero" className="relative overflow-hidden px-6 md:px-20 pt-28 pb-16 md:pt-32 md:pb-20">

      {/* Static blaugrana glow — pure CSS, no render loop */}
      <div className="absolute inset-0 pointer-events-none" aria-hidden="true">
        <div className="absolute top-[12%] left-[8%] w-[620px] h-[620px] max-w-[90vw] rounded-full opacity-[0.10]"
             style={{ background: "radial-gradient(circle, #a50044, transparent 70%)", filter: "blur(90px)" }} />
        <div className="absolute bottom-[10%] right-[6%] w-[520px] h-[520px] max-w-[90vw] rounded-full opacity-[0.10]"
             style={{ background: "radial-gradient(circle, #004d98, transparent 70%)", filter: "blur(100px)" }} />
      </div>

      <div className={`relative mx-auto grid gap-12 lg:gap-16 items-start
                       ${photoOk ? "max-w-6xl grid-cols-1 lg:grid-cols-2" : "max-w-3xl grid-cols-1"}`}>

        {/* Left — eyebrow, name, role, then the short version of who I am */}
        <div className="intro-block flex flex-col">

          {/* Greeting sits above the name so its changing width can never shove
              it sideways. min-h holds the line while it deletes back to empty. */}
          <div className="flex items-center gap-3 mb-8">
            <span className="w-10 h-px bg-grana-500 flex-none" aria-hidden="true" />
            <p className="font-mono text-[11px] md:text-xs tracking-[0.2em] uppercase text-white/65 min-h-[1.5em]">
              {displayed}
              <span className="hero-cursor" aria-hidden="true">|</span>
            </p>
          </div>

          {/* Name carries the section on its own: two lines, the surname dropped
              back so the eye lands on the given name first. */}
          <h1 className="font-mono font-bold leading-[0.95] tracking-tighter mb-7">
            <span className="block text-white text-5xl md:text-7xl">Vincent</span>
            <span className="block text-white/45 text-5xl md:text-7xl">Jared</span>
          </h1>

          <p className="font-mono text-sm md:text-base text-white/75 mb-8">
            <span className="text-grana-300" aria-hidden="true">— </span>
            Software Engineer · Brandeis University
          </p>

          <div className="font-mono text-sm leading-[1.85] text-white/65 space-y-4 max-w-lg mb-10">
            <p>
              Computer Science and Quantitative Economics, oriented toward
              backend systems, event-driven architecture, and the unglamorous
              infrastructure that everything else runs on.
            </p>
            <p>
              Outside of software I play soccer, watch Pedri orchestrate
              Barcelona&apos;s midfield, and write about what I learn building things.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-4">
            <a href="#projects"
               className="px-7 py-3.5 rounded-lg bg-grana-500 text-white font-mono text-xs
                          tracking-[0.15em] uppercase hover:bg-grana-400
                          transition-colors duration-200">
              See my work
            </a>
            <a href="#blogs"
               className="px-7 py-3.5 rounded-lg border border-white/25 text-white/80 font-mono text-xs
                          tracking-[0.15em] uppercase hover:border-white/50 hover:text-white
                          transition-colors duration-200">
              Read the blog
            </a>
          </div>
        </div>

        {/* Right — portrait (when there is one) above the numbers */}
        <div className="flex flex-col gap-6">

          {/* The frame only appears once the photo loads, so a missing file
              leaves no empty box. Drop one at public/images/vincent.jpg.
              Not lazy: a lazy image inside a display:none box is never fetched. */}
          <div className={`relative w-full aspect-square max-w-[340px] lg:ml-auto rounded-2xl overflow-hidden
                           border border-white/[0.10] bg-white/[0.03] ${photoOk ? "" : "hidden"}`}>
            <img
              src="/images/vincent.jpg"
              alt="Vincent Jared"
              className="w-full h-full object-cover"
              onLoad={() => setPhotoOk(true)}
              onError={() => setPhotoOk(false)}
            />
          </div>

          {/* gap-px over a light background draws the hairlines */}
        </div>

      </div>
    </section>
  );
};

export default Hero;

import { useState } from "react";
import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

import HeroEventStream from "../components/HeroEventStream";
import HeroLattice from "../components/HeroLattice";
import { posts } from "../lib/posts";
import { events as heroEvents } from "virtual:hero-events";



gsap.registerPlugin(ScrollTrigger);

// ── Registry ────────────────────────────────────────────────────────────────
// The role block, as tabular output rather than a sentence. Rows 2-4 are the
// three places the work actually lives, so each one links there.

// Drafts are already dropped from production builds, but they are present in
// dev — filtering here means the count means the same thing in both.
const PUBLISHED_POSTS = posts.filter((post) => !post.draft).length;

// Below three, a count reads as a thin archive rather than as a body of work.
// The column stays empty instead, which says nothing rather than something bad.
const POST_COUNT_FLOOR = 3;

const REGISTRY = [
  { key: "role", value: "Software Engineer", note: "Brandeis '27" },
  {
    key: "research",
    value: "computational biology",
    note: "Kadener Lab",
    href: "#experience",
  },
  {
    key: "writing",
    value: "distributed systems",
    note: PUBLISHED_POSTS >= POST_COUNT_FLOOR ? `${PUBLISHED_POSTS} posts` : "",
    href: "#blogs",
  },
  {
    key: "source",
    value: "open contributions",
    note: "github",
    href: "https://github.com/jaredvincent414",
  },
];

// Fixed tracks rather than auto: every row is its own grid, so only identical
// column widths make the three columns line up down the block.
const ROW = "grid grid-cols-[5rem_11.5rem_auto] gap-x-4 items-baseline";

// ── Component ────────────────────────────────────────────────────────────────
const Hero = () => {
  const [photoOk, setPhotoOk] = useState(false);

  useGSAP(() => {
    gsap.fromTo(".intro-block", { y: 40, opacity: 0 }, {
      y: 0, opacity: 1, duration: 0.9, ease: "power2.out",
    });
  });

  return (
    <section id="hero"
             className="relative overflow-hidden flex items-center px-6 md:px-20
                        pt-28 pb-24 md:pt-32 md:pb-28 lg:min-h-[92vh]">

      {/* The background is the system the intro describes: services on the left,
          the event bus down the middle, partitions on the right.

          It only appears at the breakpoint where the hero splits into two
          columns. Narrower than that there is no left and right to divide, and
          the same drawing collapses into noise behind the text — so phones and
          tablets keep the plain glow instead. */}
      <div className="hidden lg:block absolute inset-0 z-0 pointer-events-none" aria-hidden="true">
        <HeroLattice />

        {/* Everything below is scrim. The picture only works if the words in
            front of it stay readable.

            Darkest over the intro column, opening up toward the grid so the
            right half keeps its depth instead of being flattened out. */}
        <div className="absolute inset-0" style={{
          background:
            "linear-gradient(to right, rgba(14,22,40,0.42) 0%, rgba(14,22,40,0.30) 34%," +
            " rgba(14,22,40,0.14) 54%, rgba(14,22,40,0.06) 78%, rgba(14,22,40,0.02) 100%)",
        }} />

        {/* Shaped to the two text blocks rather than to the half — a scrim over
            the whole left side erased the graph along with the glare. */}
        <div className="absolute inset-0" style={{
          background:
            "radial-gradient(34% 44% at 22% 52%, rgba(14,22,40,0.92) 0%," +
            " rgba(14,22,40,0.70) 60%, transparent 100%)," +
            "radial-gradient(30% 26% at 76% 21%, rgba(14,22,40,0.86) 0%, transparent 100%)",
        }} />

        {/* Meets the navbar at the top and the next section at the bottom
            without a visible edge on either. */}
        <div className="absolute inset-0" style={{
          background:
            "linear-gradient(to bottom, #0e1628 0%, transparent 14%," +
            " transparent 82%, #0e1628 100%)",
        }} />

        <div className="absolute top-[14%] left-[4%] w-[520px] h-[520px] max-w-[90vw] rounded-full opacity-[0.10]"
             style={{ background: "radial-gradient(circle, #a50044, transparent 70%)", filter: "blur(100px)" }} />
      </div>

      {/* Below the split: the blaugrana glow the hero had before, unchanged. */}
      <div className="lg:hidden absolute inset-0 z-0 pointer-events-none" aria-hidden="true">
        <div className="absolute top-[12%] left-[8%] w-[620px] h-[620px] max-w-[90vw] rounded-full opacity-[0.10]"
             style={{ background: "radial-gradient(circle, #a50044, transparent 70%)", filter: "blur(90px)" }} />
        <div className="absolute bottom-[10%] right-[6%] w-[520px] h-[520px] max-w-[90vw] rounded-full opacity-[0.10]"
             style={{ background: "radial-gradient(circle, #004d98, transparent 70%)", filter: "blur(100px)" }} />
      </div>

      {/* Legend. Small enough to be texture, specific enough to be read. */}
      <div className="hidden lg:flex absolute bottom-7 left-0 right-0 z-0 px-6 md:px-20 justify-between
                      font-mono text-[9px] tracking-[0.3em] uppercase pointer-events-none"
           aria-hidden="true">
        <span className="text-blau-300/30">Services</span>
        <span className="text-gold-400/30">Event bus</span>
        <span className="text-grana-300/30">Partitions</span>
      </div>

      {/* The second column exists only when something fills it — the portrait,
          the event stream, or both. With neither, the hero closes back to a
          single centred column and looks deliberate rather than lopsided. */}
      <div className={`relative z-10 mx-auto grid gap-12 lg:gap-16 items-start
                       ${photoOk || heroEvents.length > 0
                         ? "max-w-6xl grid-cols-1 lg:grid-cols-2"
                         : "max-w-3xl grid-cols-1"}`}>

        {/* Left — eyebrow, name, role, then the short version of who I am */}
        <div className="intro-block flex flex-col">

          <div className="flex items-center gap-3 mb-8">
            <span className="w-10 h-px bg-grana-500 flex-none" aria-hidden="true" />
            <p className="font-mono text-[11px] md:text-xs tracking-[0.2em] uppercase text-white/65">
              Available · May 2027
            </p>
          </div>

          {/* Name carries the section on its own: two lines, the surname dropped
              back so the eye lands on the given name first. */}
          <h1 className="font-mono font-bold leading-[0.95] tracking-tighter mb-7">
            <span className="block text-white text-5xl md:text-7xl">Vincent</span>
            <span className="block text-white/45 text-5xl md:text-7xl">Jared</span>
          </h1>

          {/* Sized between the intro paragraph above it and the event feed
              across from it, so it reads as output without pulling attention
              off the name. */}
          <div className="font-mono text-[13px] leading-[2] mb-8">
            {REGISTRY.map(({ key, value, note, href }) => {
              const columns = (
                <>
                  <span className="text-white/40 transition-colors duration-200
                                   group-hover:text-grana-300">
                    {key}
                  </span>
                  <span className="text-white/75">{value}</span>
                  <span className="text-white/35 text-[11px]">{note}</span>
                </>
              );

              if (!href) return <div key={key} className={ROW}>{columns}</div>;

              const external = href.startsWith("http");
              return (
                <a
                  key={key}
                  href={href}
                  className={`${ROW} group`}
                  {...(external ? { target: "_blank", rel: "noreferrer" } : {})}
                >
                  {columns}
                </a>
              );
            })}
          </div>

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

        {/* Right — portrait (when there is one) above the event stream */}
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

          <HeroEventStream />
        </div>

      </div>
    </section>
  );
};

export default Hero;

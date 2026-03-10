import gsap from "gsap";
import { useGSAP } from "@gsap/react";
import { ScrollTrigger } from "gsap/ScrollTrigger";

import { expCards } from "../constants";
import TitleHeader from "../components/TitleHeader";

gsap.registerPlugin(ScrollTrigger);

const Experience = () => {
  useGSAP(() => {
    gsap.utils.toArray(".exp-card").forEach((card, i) => {
      const fromLeft = i % 2 === 0;
      gsap.fromTo(
        card,
        { x: fromLeft ? -50 : 50, opacity: 0 },
        {
          x: 0, opacity: 1, duration: 0.8, ease: "power2.out",
          scrollTrigger: { trigger: card, start: "top 84%" },
        }
      );
    });

    gsap.fromTo(
      ".exp-timeline-line",
      { scaleY: 0 },
      {
        scaleY: 1,
        transformOrigin: "top center",
        ease: "none",
        scrollTrigger: {
          trigger: ".exp-timeline-line",
          start: "top 60%",
          end: "bottom 40%",
          scrub: true,
        },
      }
    );
  }, []);

  return (
    <section id="experience" className="py-20 md:py-32 px-5 md:px-20">
      <TitleHeader title="Experience" sub="What I have done so far" />

      {/* ── DESKTOP layout (md+) ── */}
      <div className="hidden md:block relative mt-20 max-w-5xl mx-auto">
        <div className="absolute left-1/2 -translate-x-1/2 top-0 bottom-0 w-[3px] bg-white/[0.06] rounded-full" />
        <div
          className="exp-timeline-line absolute left-1/2 -translate-x-1/2 top-0 bottom-0 w-[3px] rounded-full origin-top"
          style={{ background: "linear-gradient(to bottom, #a855f7 0%, #3b82f6 60%, transparent 100%)" }}
        />

        <div className="flex flex-col gap-16">
          {expCards.map((card, index) => {
            const isLeft = index % 2 === 0;
            return (
              <div key={card.title} className="relative flex items-center justify-center min-h-[140px]">

                {/* Left slot */}
                <div className="w-1/2 pr-12 flex justify-end">
                  {isLeft ? (
                    <div className="exp-card w-full max-w-md rounded-2xl p-6
                                    bg-[#0d0d2b] border border-white/10
                                    shadow-[0_0_30px_rgba(168,85,247,0.08)] relative">
                      <div className="absolute right-[-8px] top-8 w-4 h-4 rotate-45
                                      bg-[#0d0d2b] border-r border-t border-white/10" />
                      <h3 className="text-white font-bold text-lg leading-snug">{card.title}</h3>
                      <p className="text-white/40 text-sm mt-0.5 mb-4">{card.company}</p>
                      <ul className="flex flex-col gap-2.5">
                        {card.responsibilities.map((r) => (
                          <li key={r} className="flex gap-2.5 text-white/60 text-sm leading-relaxed">
                            <span className="mt-2 w-1 h-1 rounded-full bg-purple-400/70 flex-none" />
                            {r}
                          </li>
                        ))}
                      </ul>
                    </div>
                  ) : (
                    <p className="text-white/40 text-sm font-medium whitespace-nowrap self-center">
                      {card.date}
                    </p>
                  )}
                </div>

                {/* Center node */}
                <div className="absolute left-1/2 -translate-x-1/2 z-10">
                  <div className="w-14 h-14 rounded-full border-2 border-white/25 bg-[#0b0f1e]
                                  flex items-center justify-center
                                  shadow-[0_0_0_4px_rgba(168,85,247,0.12),0_0_20px_rgba(168,85,247,0.2)]">
                    <img src={card.logoPath} alt={card.company} className="w-8 h-8 object-contain rounded-full" />
                  </div>
                </div>

                {/* Right slot */}
                <div className="w-1/2 pl-12 flex justify-start">
                  {!isLeft ? (
                    <div className="exp-card w-full max-w-md rounded-2xl p-6
                                    bg-[#0d0d2b] border border-white/10
                                    shadow-[0_0_30px_rgba(168,85,247,0.08)] relative">
                      <div className="absolute left-[-8px] top-8 w-4 h-4 rotate-45
                                      bg-[#0d0d2b] border-l border-b border-white/10" />
                      <h3 className="text-white font-bold text-lg leading-snug">{card.title}</h3>
                      <p className="text-white/40 text-sm mt-0.5 mb-4">{card.company}</p>
                      <ul className="flex flex-col gap-2.5">
                        {card.responsibilities.map((r) => (
                          <li key={r} className="flex gap-2.5 text-white/60 text-sm leading-relaxed">
                            <span className="mt-2 w-1 h-1 rounded-full bg-purple-400/70 flex-none" />
                            {r}
                          </li>
                        ))}
                      </ul>
                    </div>
                  ) : (
                    <p className="text-white/40 text-sm font-medium whitespace-nowrap self-center">
                      {card.date}
                    </p>
                  )}
                </div>

              </div>
            );
          })}
        </div>
      </div>

      {/* ── MOBILE layout (< md) ── */}
      <div className="md:hidden relative mt-16 pl-10">
        {/* Left timeline track */}
        <div className="absolute left-4 top-0 bottom-0 w-[2px] bg-white/[0.06] rounded-full" />
        <div
          className="exp-timeline-line absolute left-4 top-0 bottom-0 w-[2px] rounded-full origin-top"
          style={{ background: "linear-gradient(to bottom, #a855f7 0%, #3b82f6 60%, transparent 100%)" }}
        />

        <div className="flex flex-col gap-10">
          {expCards.map((card) => (
            <div key={card.title} className="relative">
              {/* Node on the left line */}
              <div className="absolute -left-[34px] top-4 z-10">
                <div className="w-10 h-10 rounded-full border-2 border-white/25 bg-[#0b0f1e]
                                flex items-center justify-center
                                shadow-[0_0_0_3px_rgba(168,85,247,0.12),0_0_14px_rgba(168,85,247,0.2)]">
                  <img src={card.logoPath} alt={card.company} className="w-6 h-6 object-contain rounded-full" />
                </div>
              </div>

              {/* Card — full width */}
              <div className="exp-card rounded-2xl p-5 bg-[#0d0d2b] border border-white/10
                              shadow-[0_0_24px_rgba(168,85,247,0.07)]">
                <div className="flex items-start justify-between gap-3 mb-3">
                  <div>
                    <h3 className="text-white font-bold text-base leading-snug">{card.title}</h3>
                    <p className="text-white/40 text-sm mt-0.5">{card.company}</p>
                  </div>
                  <p className="text-white/35 text-xs font-medium whitespace-nowrap pt-0.5 text-right">{card.date}</p>
                </div>
                <ul className="flex flex-col gap-2">
                  {card.responsibilities.map((r) => (
                    <li key={r} className="flex gap-2 text-white/55 text-sm leading-relaxed">
                      <span className="mt-2 w-1 h-1 rounded-full bg-purple-400/70 flex-none" />
                      {r}
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          ))}
        </div>
      </div>

    </section>
  );
};

export default Experience;

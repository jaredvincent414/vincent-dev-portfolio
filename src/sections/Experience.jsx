import gsap from "gsap";
import { useGSAP } from "@gsap/react";
import { ScrollTrigger } from "gsap/ScrollTrigger";

import { expCards } from "../constants";
import TitleHeader from "../components/TitleHeader";

gsap.registerPlugin(ScrollTrigger);

const Experience = () => {
  useGSAP(() => {
    // Animate each card sliding in from its side
    gsap.utils.toArray(".exp-card").forEach((card, i) => {
      const fromLeft = i % 2 === 0;
      gsap.fromTo(
        card,
        { x: fromLeft ? -60 : 60, opacity: 0 },
        {
          x: 0,
          opacity: 1,
          duration: 0.8,
          ease: "power2.out",
          scrollTrigger: { trigger: card, start: "top 82%" },
        }
      );
    });

    // Draw the timeline line as you scroll
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

      <div className="relative mt-20 max-w-5xl mx-auto">

        {/* Center vertical line */}
        <div className="absolute left-1/2 -translate-x-1/2 top-0 bottom-0 w-px bg-white/10" />
        <div
          className="exp-timeline-line absolute left-1/2 -translate-x-1/2 top-0 bottom-0 w-px origin-top"
          style={{ background: "linear-gradient(to bottom, #a855f7, #3b82f6, transparent)" }}
        />

        <div className="flex flex-col gap-20">
          {expCards.map((card, index) => {
            const isLeft = index % 2 === 0; // even → card on left, odd → card on right

            return (
              <div key={card.title} className="relative flex items-start justify-center">

                {/* Left slot */}
                <div className="w-1/2 pr-10 flex justify-end">
                  {isLeft && (
                    <div
                      className="exp-card w-full max-w-sm rounded-2xl p-6
                                 bg-[#0d0d2b] border border-white/10
                                 shadow-[0_0_30px_rgba(168,85,247,0.08)]"
                    >
                      <h3 className="text-white font-bold text-lg md:text-xl leading-snug mb-1">
                        {card.title}
                      </h3>
                      <p className="text-[#839CB5] text-xs mb-4">{card.date}</p>
                      <ul className="flex flex-col gap-3">
                        {card.responsibilities.map((r) => (
                          <li key={r} className="flex gap-2 text-white/70 text-sm leading-relaxed">
                            <span className="mt-1.5 w-1.5 h-1.5 rounded-full bg-purple-400 flex-none" />
                            {r}
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}
                </div>

                {/* Center node */}
                <div className="absolute left-1/2 -translate-x-1/2 flex flex-col items-center z-10">
                  <div className="w-12 h-12 rounded-full border border-white/20 bg-[#0d0d2b]
                                  flex items-center justify-center
                                  shadow-[0_0_16px_rgba(168,85,247,0.3)]">
                    <img
                      src={card.logoPath}
                      alt={card.title}
                      className="w-7 h-7 object-contain rounded-full"
                    />
                  </div>
                  {/* Date label — right of node for left cards, left for right cards */}
                  <span
                    className={`absolute top-3 text-white/60 text-xs whitespace-nowrap
                                ${isLeft ? "left-14" : "right-14 text-right"}`}
                  >
                    {card.date}
                  </span>
                </div>

                {/* Right slot */}
                <div className="w-1/2 pl-10 flex justify-start">
                  {!isLeft && (
                    <div
                      className="exp-card w-full max-w-sm rounded-2xl p-6
                                 bg-[#0d0d2b] border border-white/10
                                 shadow-[0_0_30px_rgba(168,85,247,0.08)]"
                    >
                      <h3 className="text-white font-bold text-lg md:text-xl leading-snug mb-1">
                        {card.title}
                      </h3>
                      <p className="text-[#839CB5] text-xs mb-4">{card.date}</p>
                      <ul className="flex flex-col gap-3">
                        {card.responsibilities.map((r) => (
                          <li key={r} className="flex gap-2 text-white/70 text-sm leading-relaxed">
                            <span className="mt-1.5 w-1.5 h-1.5 rounded-full bg-purple-400 flex-none" />
                            {r}
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}
                </div>

              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
};

export default Experience;

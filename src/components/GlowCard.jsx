import { useRef } from "react";

const GlowCard = ({ card, index, children }) => {
  const cardRefs = useRef([]);

  const updateGlow = (index, e) => {
    const card = cardRefs.current[index];
    if (!card) return;
    const rect = card.getBoundingClientRect();
    const mouseX = (e.clientX ?? rect.left + rect.width / 2) - rect.left - rect.width / 2;
    const mouseY = (e.clientY ?? rect.top + rect.height / 2) - rect.top - rect.height / 2;
    let angle = Math.atan2(mouseY, mouseX) * (180 / Math.PI);
    angle = (angle + 360) % 360;
    card.style.setProperty("--start", angle + 60);
  };

  return (
    <div
      ref={(el) => (cardRefs.current[index] = el)}
      onMouseMove={(e) => updateGlow(index, e)}
      onFocus={(e) => updateGlow(index, e)}
      tabIndex={0}
      role="article"
      className="card card-border timeline-card rounded-xl p-10 mb-5 break-inside-avoid-column focus:outline-none focus-visible:ring-2 focus-visible:ring-white/40"
    >
      <div className="glow" />
      <div className="flex items-center gap-1 mb-5" />
      <div className="mb-5">
        <p className="text-white-50 text-lg">{card.review}</p>
      </div>
      {children}
    </div>
  );
};

export default GlowCard;

import { useRef, useEffect } from "react";

const NUM_STARS = 280;
const NUM_SHOOTING = 4;

const rand = (a, b) => Math.random() * (b - a) + a;

// Blaugrana starfield — mostly pale white, tinted toward club blue and claret
const STAR_COLORS = [
  "#f5f7ff",  // near-white
  "#e8eef8",  // cool white
  "#dbe6f5",  // pale blue-white
  "#b9cde8",  // soft blau
  "#8fb0d8",  // blau, light
  "#5b87c4",  // blau, mid
  "#2b6cb8",  // blau-400
  "#e8b8c6",  // pale grana
  "#d98da5",  // grana, soft
  "#edbb00",  // gold, rare warm accent
];

const makeShootingStar = (initialDelay = true) => ({
  x: rand(0.05, 0.85),
  y: rand(0.0, 0.35),
  angle: rand(25, 45) * (Math.PI / 180),
  speed: rand(0.0025, 0.005),
  tailLen: rand(0.08, 0.18),
  life: 0,
  maxLife: rand(70, 140),
  delay: initialDelay ? rand(0, 400) : rand(20, 200),
});

const GalaxyLayer = () => {
  const canvasRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");

    const resize = () => {
      canvas.width  = canvas.offsetWidth;
      canvas.height = canvas.offsetHeight;
    };
    resize();
    const ro = new ResizeObserver(resize);
    ro.observe(canvas);

    // Moving stars — each has a slow drift velocity
    const stars = Array.from({ length: NUM_STARS }, () => ({
      x: rand(0, 1),
      y: rand(0, 1),
      r: rand(0.2, 1.6),
      baseAlpha: rand(0.2, 0.85),
      twinkleSpeed: rand(0.003, 0.018),
      phase: rand(0, Math.PI * 2),
      color: STAR_COLORS[Math.floor(Math.random() * STAR_COLORS.length)],
      // Drift velocity (normalized, very slow)
      vx: (Math.random() - 0.5) * 0.00012,
      vy: (Math.random() - 0.5) * 0.00012,
    }));

    let shooting = Array.from({ length: NUM_SHOOTING }, () => makeShootingStar(true));
    let t = 0;
    let raf;

    const draw = () => {
      const W = canvas.width, H = canvas.height;
      if (!W || !H) { raf = requestAnimationFrame(draw); return; }

      ctx.clearRect(0, 0, W, H);

      // ── Moving + twinkling stars ─────────────────────────────────────────────
      stars.forEach((s) => {
        // Drift position, wrap around edges
        s.x += s.vx;
        s.y += s.vy;
        if (s.x < 0) s.x = 1;
        if (s.x > 1) s.x = 0;
        if (s.y < 0) s.y = 1;
        if (s.y > 1) s.y = 0;

        const alpha = s.baseAlpha * (0.45 + 0.55 * Math.sin(t * s.twinkleSpeed + s.phase));
        const px = s.x * W, py = s.y * H;

        ctx.globalAlpha = alpha;

        // Larger stars get a violet glow halo
        if (s.r > 1.0) {
          const grd = ctx.createRadialGradient(px, py, 0, px, py, s.r * 4);
          grd.addColorStop(0, s.color);
          grd.addColorStop(1, "transparent");
          ctx.fillStyle = grd;
          ctx.beginPath();
          ctx.arc(px, py, s.r * 4, 0, Math.PI * 2);
          ctx.fill();
        }

        ctx.fillStyle = s.color;
        ctx.beginPath();
        ctx.arc(px, py, s.r, 0, Math.PI * 2);
        ctx.fill();
      });

      // ── Shooting stars ───────────────────────────────────────────────────────
      shooting = shooting.map((ss) => {
        if (ss.delay > 0) { return { ...ss, delay: ss.delay - 1 }; }

        ss.life++;
        const progress = ss.life / ss.maxLife;
        const alpha = progress < 0.15
          ? progress / 0.15
          : progress > 0.65
            ? (1 - progress) / 0.35
            : 1;

        const x1 = ss.x * W;
        const y1 = ss.y * H;
        const x0 = x1 - Math.cos(ss.angle) * ss.tailLen * W;
        const y0 = y1 - Math.sin(ss.angle) * ss.tailLen * W;

        const grd = ctx.createLinearGradient(x0, y0, x1, y1);
        grd.addColorStop(0, "rgba(196,181,253,0)");
        grd.addColorStop(0.6, `rgba(167,139,250,${alpha * 0.6})`);
        grd.addColorStop(1, `rgba(237,233,254,${alpha})`);

        ctx.globalAlpha = 1;
        ctx.strokeStyle = grd;
        ctx.lineWidth = 1.5;
        ctx.beginPath();
        ctx.moveTo(x0, y0);
        ctx.lineTo(x1, y1);
        ctx.stroke();

        // Bright violet tip
        ctx.globalAlpha = alpha * 0.95;
        ctx.fillStyle = "#ede9fe";
        ctx.beginPath();
        ctx.arc(x1, y1, 1.4, 0, Math.PI * 2);
        ctx.fill();

        const nx = ss.x + Math.cos(ss.angle) * ss.speed;
        const ny = ss.y + Math.sin(ss.angle) * ss.speed;

        if (ss.life >= ss.maxLife || nx > 1.05 || ny > 1.05) {
          return makeShootingStar(false);
        }
        return { ...ss, x: nx, y: ny };
      });

      ctx.globalAlpha = 1;
      t++;
      raf = requestAnimationFrame(draw);
    };

    draw();
    return () => { cancelAnimationFrame(raf); ro.disconnect(); };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      className="absolute inset-0 w-full h-full pointer-events-none"
      style={{ zIndex: 0 }}
    />
  );
};

export default GalaxyLayer;

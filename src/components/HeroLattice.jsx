import { useEffect, useRef } from "react";

// The hero background: a service graph on the left, a partitioned grid on the
// right, and the event bus that joins them running down the middle. It is the
// same picture the intro text describes — event-driven backend systems — drawn
// rather than claimed.
//
// One canvas, one requestAnimationFrame loop, no library. It pauses when the
// hero scrolls out of view or the tab is hidden, and renders a single static
// frame for anyone who asked for reduced motion.

// Colours as "r, g, b" strings so alpha can vary per draw call. The values are
// the theme tokens from index.css — the background has to belong to the same
// palette as everything drawn on top of it.
const BLAU = "43, 108, 184";
const BLAU_PALE = "127, 178, 232";
const GRANA = "196, 24, 92";
const GRANA_PALE = "232, 90, 134";
const GOLD = "237, 187, 0";
const PAGE = "14, 22, 40";

const rgba = (rgb, alpha) => `rgba(${rgb}, ${alpha})`;

// ── Left panel: the service graph ───────────────────────────────────────────
// Positions are normalised inside the left panel, hand-placed rather than
// force-laid: a solver would re-arrange the constellation on every resize, and
// the shape is doing design work here, not conveying topology.
const NODES = [
  { x: 0.42, y: 0.04, label: "Gateway" },
  { x: 0.11, y: 0.17, label: "Auth" },
  { x: 0.75, y: 0.10, label: "WebSocket" },
  { x: 0.93, y: 0.31, label: "Queue", hub: true },
  { x: 0.04, y: 0.40, label: "Redis" },
  { x: 0.86, y: 0.59, label: "Workers", hub: true },
  { x: 0.03, y: 0.82, label: "Postgres" },
  { x: 0.88, y: 0.97, label: "Scheduler" },
  { x: 0.99, y: 0.74, label: "Storage" },
];

const EDGES = [
  [0, 1], [0, 3], [0, 2], [2, 3], [1, 4], [3, 4],
  [3, 5], [4, 6], [6, 7], [7, 5], [5, 8], [7, 8],
];

// ── Right panel: consumer routes across the grid ────────────────────────────
// Rectilinear by construction — consecutive points share an axis — so the paths
// read as traversals of the grid rather than lines laid over it.
const ROUTES = [
  { points: [[0.06, 0.44], [0.34, 0.44], [0.34, 0.17], [0.58, 0.17]], colour: BLAU_PALE },
  { points: [[0.46, 0.08], [0.46, 0.38], [0.78, 0.38], [0.78, 0.62]], colour: GRANA_PALE },
  { points: [[0.22, 0.90], [0.52, 0.90], [0.52, 0.66], [0.84, 0.66]], colour: GOLD },
];

// Where load lands, in right-panel normalised coords. Two centres, one clearly
// dominant — an evenly heated field has nothing to look at.
const HOTSPOTS = [
  { x: 0.46, y: 0.27, radius: 0.26, weight: 1.0 },
  { x: 0.74, y: 0.71, radius: 0.20, weight: 0.65 },
];

// Deterministic stand-in for random: the grid has to be the same map on every
// reload and every resize, so a redraw restores the field instead of dealing a
// new one.
const hash = (a, b) => {
  const n = Math.sin(a * 127.1 + b * 311.7) * 43758.5453;
  return n - Math.floor(n);
};

const HeroLattice = () => {
  const canvasRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");

    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    let width = 0;
    let height = 0;
    let hexes = [];

    // ── Layout ───────────────────────────────────────────────────────────────
    // Everything is derived from the canvas box on resize, so the composition
    // holds its proportions from a phone to an ultrawide.
    const layout = () => {
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      width = canvas.offsetWidth;
      height = canvas.offsetHeight;
      canvas.width = Math.round(width * dpr);
      canvas.height = Math.round(height * dpr);
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);

      // The grid bleeds off the right edge rather than sitting in a box —
      // a field that continues past the viewport, not a diagram of one.
      const gridLeft = width * 0.53;
      const gridWidth = width - gridLeft;
      const radius = gridWidth / 9 / Math.sqrt(3);
      const stepX = Math.sqrt(3) * radius;
      const stepY = 1.5 * radius;

      hexes = [];
      const rows = Math.ceil(height / stepY) + 2;
      const cols = Math.ceil(gridWidth / stepX) + 2;

      for (let row = -1; row < rows; row++) {
        for (let col = -1; col < cols; col++) {
          const cx = gridLeft + col * stepX + (row % 2 ? stepX / 2 : 0);
          const cy = row * stepY;
          const weight = hash(col, row);

          // Gaussian falloff from each centre, so the cluster has an edge that
          // thins out instead of a border.
          const nx = (cx - gridLeft) / gridWidth;
          const ny = cy / height;
          let heat = 0;
          for (const spot of HOTSPOTS) {
            const d = Math.hypot(nx - spot.x, (ny - spot.y) * 0.8);
            heat = Math.max(heat, spot.weight * Math.exp(-(d * d) / (spot.radius * spot.radius)));
          }

          // A cell lights up only where its own weight and the field agree, so
          // the same map yields a dense core and a sparse fringe.
          const lit = weight * 0.55 + heat * 0.75;
          hexes.push({
            cx,
            cy,
            radius,
            weight,
            heat,
            // Gold at the core, claret at the fringe — the cluster reads as
            // having a centre rather than as one flat patch of colour.
            hot: lit > 0.82 ? (heat > 0.55 ? GOLD : GRANA) : null,
            // Each cell pulses on its own clock; a field breathing in unison
            // reads as a screensaver rather than as load.
            phase: hash(col * 3.3, row * 7.7) * Math.PI * 2,
          });
        }
      }
    };

    // ── Moving parts ─────────────────────────────────────────────────────────
    // Packets ride the graph edges; each retargets to a new edge on arrival, so
    // traffic keeps moving without a queue of objects being created.
    const packets = Array.from({ length: 7 }, (_, i) => ({
      edge: Math.floor(hash(i, 11) * EDGES.length),
      t: hash(i, 23),
      speed: 0.0022 + hash(i, 31) * 0.0035,
      colour: i % 3 === 0 ? GOLD : GRANA_PALE,
    }));

    // Route markers carry their own position along the polyline, measured in
    // fraction-of-total-length so speed stays even across the corners.
    const markers = ROUTES.map((_, i) => ({ t: hash(i, 41), speed: 0.0011 + hash(i, 53) * 0.0012 }));

    // ── Drawing ──────────────────────────────────────────────────────────────
    const drawHexes = (time) => {
      for (const hex of hexes) {
        const { cx, cy, radius } = hex;
        if (cx + radius < width * 0.5) continue;

        ctx.beginPath();
        for (let i = 0; i < 6; i++) {
          const angle = (Math.PI / 3) * i + Math.PI / 6;
          const vx = cx + radius * Math.cos(angle);
          const vy = cy + radius * Math.sin(angle);
          if (i === 0) ctx.moveTo(vx, vy);
          else ctx.lineTo(vx, vy);
        }
        ctx.closePath();

        if (hex.hot) {
          const pulse = 0.5 + 0.5 * Math.sin(time * 0.012 + hex.phase);
          ctx.fillStyle = rgba(hex.hot, (0.05 + pulse * 0.13) * (0.45 + hex.heat));
        } else {
          // Cubed rather than linear: most cells should be barely there, so the
          // grid is a texture the lit cells sit in, not a chart of its own.
          ctx.fillStyle = rgba(BLAU, hex.weight ** 3 * 0.10);
        }
        ctx.fill();

        ctx.strokeStyle = rgba(BLAU_PALE, 0.075 + hex.heat * 0.06);
        ctx.lineWidth = 1;
        ctx.stroke();
      }
    };

    // Points of a route in canvas space, plus the cumulative lengths the marker
    // walks along.
    const routeGeometry = (route) => {
      const gridLeft = width * 0.53;
      const gridWidth = width - gridLeft;
      const points = route.points.map(([x, y]) => [gridLeft + x * gridWidth, y * height]);
      const lengths = [];
      let total = 0;
      for (let i = 1; i < points.length; i++) {
        total += Math.hypot(points[i][0] - points[i - 1][0], points[i][1] - points[i - 1][1]);
        lengths.push(total);
      }
      return { points, lengths, total };
    };

    const drawRoutes = (time) => {
      ROUTES.forEach((route, index) => {
        const { points, lengths, total } = routeGeometry(route);

        ctx.save();
        ctx.setLineDash([4, 6]);
        ctx.lineDashOffset = -time * 0.35;
        ctx.strokeStyle = rgba(route.colour, 0.45);
        ctx.lineWidth = 1;
        ctx.beginPath();
        points.forEach(([x, y], i) => (i ? ctx.lineTo(x, y) : ctx.moveTo(x, y)));
        ctx.stroke();
        ctx.restore();

        // Endpoints: a filled ring with the page colour punched out of the
        // middle, which is what keeps them legible over a lit hex.
        [points[0], points[points.length - 1]].forEach(([x, y]) => {
          ctx.fillStyle = rgba(route.colour, 0.55);
          ctx.beginPath();
          ctx.arc(x, y, 4, 0, Math.PI * 2);
          ctx.fill();
          ctx.fillStyle = rgba(PAGE, 1);
          ctx.beginPath();
          ctx.arc(x, y, 1.8, 0, Math.PI * 2);
          ctx.fill();
        });

        const marker = markers[index];
        const distance = marker.t * total;
        let segment = lengths.findIndex((l) => l >= distance);
        if (segment === -1) segment = lengths.length - 1;
        const start = segment === 0 ? 0 : lengths[segment - 1];
        const along = (distance - start) / (lengths[segment] - start || 1);
        const [x0, y0] = points[segment];
        const [x1, y1] = points[segment + 1];
        const mx = x0 + (x1 - x0) * along;
        const my = y0 + (y1 - y0) * along;

        const glow = ctx.createRadialGradient(mx, my, 0, mx, my, 12);
        glow.addColorStop(0, rgba(route.colour, 0.45));
        glow.addColorStop(1, rgba(route.colour, 0));
        ctx.fillStyle = glow;
        ctx.beginPath();
        ctx.arc(mx, my, 12, 0, Math.PI * 2);
        ctx.fill();

        ctx.fillStyle = rgba(route.colour, 0.95);
        ctx.beginPath();
        ctx.arc(mx, my, 2.6, 0, Math.PI * 2);
        ctx.fill();
      });
    };

    const drawSeam = (time) => {
      const seamX = width * 0.495;

      // The wide wash is what reads as a glow; the hairline on top is what
      // gives it an edge to be a seam at all.
      const wash = ctx.createLinearGradient(seamX - 60, 0, seamX + 60, 0);
      wash.addColorStop(0, rgba(GRANA, 0));
      wash.addColorStop(0.5, rgba(GRANA, 0.22));
      wash.addColorStop(1, rgba(GRANA, 0));
      ctx.fillStyle = wash;
      ctx.fillRect(seamX - 60, 0, 120, height);

      const core = ctx.createLinearGradient(0, 0, 0, height);
      core.addColorStop(0, rgba(GOLD, 0));
      core.addColorStop(0.22, rgba(GOLD, 0.62));
      core.addColorStop(0.60, rgba(GRANA_PALE, 0.68));
      core.addColorStop(1, rgba(GRANA, 0));
      ctx.strokeStyle = core;
      ctx.lineWidth = 1.75;
      ctx.beginPath();
      for (let y = 0; y <= height; y += 6) {
        const x = seamX + Math.sin(y * 0.009 + time * 0.006) * 3.5;
        if (y === 0) ctx.moveTo(x, y);
        else ctx.lineTo(x, y);
      }
      ctx.stroke();

      // Three pulses running the length of the bus, offset so the seam never
      // looks empty and never looks busy.
      for (let i = 0; i < 3; i++) {
        const progress = (time * 0.0016 + i / 3) % 1;
        const y = height * (1 - progress);
        const x = seamX + Math.sin(y * 0.009 + time * 0.006) * 3.5;
        const fade = Math.sin(progress * Math.PI);
        const glow = ctx.createRadialGradient(x, y, 0, x, y, 16);
        glow.addColorStop(0, rgba(GOLD, 0.5 * fade));
        glow.addColorStop(1, rgba(GOLD, 0));
        ctx.fillStyle = glow;
        ctx.beginPath();
        ctx.arc(x, y, 16, 0, Math.PI * 2);
        ctx.fill();
      }
    };

    const drawGraph = (time) => {
      const left = width * 0.025;
      const panelWidth = width * 0.435;
      const top = height * 0.09;
      const panelHeight = height * 0.82;

      // Each node breathes on its own phase. It is not a simulation — it just
      // stops the constellation from looking printed on.
      const scale = Math.min(1.5, Math.max(0.85, panelWidth / 520));

      const positions = NODES.map((node, i) => {
        const drift = Math.sin(time * 0.005 + i * 1.7) * 3;
        const driftY = Math.cos(time * 0.004 + i * 2.3) * 3;
        return [left + node.x * panelWidth + drift, top + node.y * panelHeight + driftY];
      });

      ctx.lineWidth = 1;
      for (const [a, b] of EDGES) {
        ctx.strokeStyle = rgba(BLAU, 0.55);
        ctx.beginPath();
        ctx.moveTo(positions[a][0], positions[a][1]);
        ctx.lineTo(positions[b][0], positions[b][1]);
        ctx.stroke();
      }

      for (const packet of packets) {
        const [a, b] = EDGES[packet.edge];
        const px = positions[a][0] + (positions[b][0] - positions[a][0]) * packet.t;
        const py = positions[a][1] + (positions[b][1] - positions[a][1]) * packet.t;
        const glow = ctx.createRadialGradient(px, py, 0, px, py, 9);
        glow.addColorStop(0, rgba(packet.colour, 0.5));
        glow.addColorStop(1, rgba(packet.colour, 0));
        ctx.fillStyle = glow;
        ctx.beginPath();
        ctx.arc(px, py, 9, 0, Math.PI * 2);
        ctx.fill();
        ctx.fillStyle = rgba(packet.colour, 0.9);
        ctx.beginPath();
        ctx.arc(px, py, 1.8, 0, Math.PI * 2);
        ctx.fill();
      }

      NODES.forEach((node, i) => {
        const [x, y] = positions[i];
        const colour = node.hub ? GRANA : BLAU_PALE;
        const pulse = 0.5 + 0.5 * Math.sin(time * 0.02 + i);

        const halo = (node.hub ? 24 : 16) * scale;
        const ring = (node.hub ? 10 : 7) * scale;

        const glow = ctx.createRadialGradient(x, y, 0, x, y, halo);
        glow.addColorStop(0, rgba(colour, node.hub ? 0.55 : 0.32));
        glow.addColorStop(1, rgba(colour, 0));
        ctx.fillStyle = glow;
        ctx.beginPath();
        ctx.arc(x, y, halo, 0, Math.PI * 2);
        ctx.fill();

        ctx.strokeStyle = rgba(colour, 0.75);
        ctx.lineWidth = 1;
        ctx.beginPath();
        ctx.arc(x, y, ring, 0, Math.PI * 2);
        ctx.stroke();

        ctx.fillStyle = rgba(node.hub ? GOLD : colour, 0.6 + pulse * 0.4);
        ctx.beginPath();
        ctx.arc(x, y, (node.hub ? 3.2 : 2.4) * scale, 0, Math.PI * 2);
        ctx.fill();

        ctx.font = "11px ui-monospace, SFMono-Regular, Menlo, monospace";
        ctx.textAlign = "center";
        ctx.fillStyle = rgba(BLAU_PALE, 0.62);
        ctx.fillText(node.label, x, node.y > 0.78 ? y - ring - 8 : y + ring + 15);
      });
    };

    let frame = 0;
    let raf = 0;
    let running = true;

    const render = () => {
      if (!width || !height) return;
      ctx.clearRect(0, 0, width, height);
      drawHexes(frame);
      drawRoutes(frame);
      drawSeam(frame);
      drawGraph(frame);
    };

    const tick = () => {
      render();
      frame++;
      for (const packet of packets) {
        packet.t += packet.speed;
        if (packet.t >= 1) {
          packet.t = 0;
          packet.edge = (packet.edge + 1 + Math.floor(Math.random() * 3)) % EDGES.length;
        }
      }
      for (const marker of markers) marker.t = (marker.t + marker.speed) % 1;
      raf = requestAnimationFrame(tick);
    };

    const start = () => {
      if (reduced || raf) return;
      raf = requestAnimationFrame(tick);
    };
    const stop = () => {
      cancelAnimationFrame(raf);
      raf = 0;
    };

    layout();
    render();
    if (!reduced) start();

    const observer = new ResizeObserver(() => {
      layout();
      render();
    });
    observer.observe(canvas);

    // Off-screen and background tabs get nothing: the hero is the top of a long
    // page, and this should not keep painting once it has been scrolled past.
    const visibility = new IntersectionObserver(
      ([entry]) => {
        running = entry.isIntersecting;
        if (running && !document.hidden) start();
        else stop();
      },
      { threshold: 0 },
    );
    visibility.observe(canvas);

    const onVisibility = () => {
      if (document.hidden || !running) stop();
      else start();
    };
    document.addEventListener("visibilitychange", onVisibility);

    return () => {
      stop();
      observer.disconnect();
      visibility.disconnect();
      document.removeEventListener("visibilitychange", onVisibility);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      className="absolute inset-0 w-full h-full pointer-events-none"
      aria-hidden="true"
    />
  );
};

export default HeroLattice;

import { Canvas, useFrame, useThree } from "@react-three/fiber";
import { Suspense, useMemo, useRef, useState, useEffect } from "react";
import * as THREE from "three";

const INITIAL_COUNT    = 55;
const MAX_NODES        = 80;
const SPAWN_PER_CLICK  = 3;
const BASE_SPEED       = 0.045;
const CURSOR_RADIUS    = 18;  // world-space radius around cursor that gets nudged
const CURSOR_STRENGTH  = 0.018;
const REPULSION_DIST   = 12;  // min distance before nodes push each other apart
const REPULSION_FORCE  = 0.003;

// Camera z=60, fov=75 → visible half-width≈82, half-height≈46 at z=0
const SPREAD_X = 170;
const SPREAD_Y = 96;

const makeNode = (x, y) => ({
  position: new THREE.Vector3(x, y, 0),
  velocity: new THREE.Vector3(
    (Math.random() - 0.5) * BASE_SPEED,
    (Math.random() - 0.5) * BASE_SPEED,
    0,
  ),
});

const generatePoints = (count, cx = 0, cy = 0, sx = SPREAD_X, sy = SPREAD_Y) => {
  const pts = [];
  for (let i = 0; i < count; i++) {
    pts.push(makeNode(
      cx + (Math.random() - 0.5) * sx,
      cy + (Math.random() - 0.5) * sy,
    ));
  }
  return pts;
};

// Tracks mouse position in world space via a ref
const CursorTracker = ({ cursorRef }) => {
  const { camera, size } = useThree();

  useEffect(() => {
    const handle = (e) => {
      const nx = (e.clientX / size.width)  *  2 - 1;
      const ny = (e.clientY / size.height) * -2 + 1;
      const vec = new THREE.Vector3(nx, ny, 0.5);
      vec.unproject(camera);
      const dir = vec.sub(camera.position).normalize();
      const dist = -camera.position.z / dir.z;
      const world = camera.position.clone().add(dir.multiplyScalar(dist));
      cursorRef.current = world;
    };
    window.addEventListener("mousemove", handle);
    return () => window.removeEventListener("mousemove", handle);
  }, [camera, size, cursorRef]);

  return null;
};

const Nodes = ({ nodes, speedBoostRef, cursorRef }) => {
  const ref = useRef();
  const prevCursor = useRef(null);

  useFrame(() => {
    const boost = 1 + speedBoostRef.current * 6;

    // Cursor delta this frame (world space)
    let cdx = 0, cdy = 0;
    if (cursorRef.current && prevCursor.current) {
      cdx = cursorRef.current.x - prevCursor.current.x;
      cdy = cursorRef.current.y - prevCursor.current.y;
    }
    if (cursorRef.current) {
      prevCursor.current = cursorRef.current.clone();
    }

    // Node-to-node repulsion — keeps nodes from entangling
    for (let i = 0; i < nodes.length; i++) {
      for (let j = i + 1; j < nodes.length; j++) {
        const dx = nodes[i].position.x - nodes[j].position.x;
        const dy = nodes[i].position.y - nodes[j].position.y;
        const dist = Math.sqrt(dx * dx + dy * dy) || 0.001;
        if (dist < REPULSION_DIST) {
          const force = (REPULSION_DIST - dist) / REPULSION_DIST * REPULSION_FORCE;
          const nx = dx / dist, ny = dy / dist;
          nodes[i].velocity.x += nx * force;
          nodes[i].velocity.y += ny * force;
          nodes[j].velocity.x -= nx * force;
          nodes[j].velocity.y -= ny * force;
        }
      }
    }

    nodes.forEach((n) => {
      // Cursor nudge — only for nodes within CURSOR_RADIUS of cursor
      if (cursorRef.current) {
        const ddx = n.position.x - cursorRef.current.x;
        const ddy = n.position.y - cursorRef.current.y;
        const distToCursor = Math.sqrt(ddx * ddx + ddy * ddy);
        if (distToCursor < CURSOR_RADIUS) {
          const falloff = 1 - distToCursor / CURSOR_RADIUS;
          n.velocity.x += cdx * CURSOR_STRENGTH * falloff;
          n.velocity.y += cdy * CURSOR_STRENGTH * falloff;
        }
      }

      // Clamp + gentle damping so velocity stays natural
      const maxV = BASE_SPEED * 5;
      n.velocity.x = Math.max(-maxV, Math.min(maxV, n.velocity.x)) * 0.994;
      n.velocity.y = Math.max(-maxV, Math.min(maxV, n.velocity.y)) * 0.994;

      n.position.x += n.velocity.x * boost;
      n.position.y += n.velocity.y * boost;
      if (Math.abs(n.position.x) > 86) n.velocity.x *= -1;
      if (Math.abs(n.position.y) > 49) n.velocity.y *= -1;
    });

    speedBoostRef.current *= 0.88;

    if (ref.current) {
      const arr = ref.current.geometry.attributes.position.array;
      for (let i = 0; i < nodes.length; i++) {
        arr[i * 3]     = nodes[i].position.x;
        arr[i * 3 + 1] = nodes[i].position.y;
        arr[i * 3 + 2] = nodes[i].position.z;
      }
      ref.current.geometry.attributes.position.needsUpdate = true;
    }
  });

  const positions = useMemo(() => {
    const arr = new Float32Array(MAX_NODES * 3);
    nodes.forEach((n, i) => {
      arr[i * 3]     = n.position.x;
      arr[i * 3 + 1] = n.position.y;
      arr[i * 3 + 2] = n.position.z;
    });
    return arr;
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <points ref={ref}>
      <bufferGeometry>
        <bufferAttribute
          attach="attributes-position"
          count={nodes.length}
          array={positions}
          itemSize={3}
        />
      </bufferGeometry>
      <pointsMaterial size={1.2} color="#ffffff" sizeAttenuation depthWrite={false} />
    </points>
  );
};

const Lines = ({ nodes, maxDistance = 20 }) => {
  const geom = useMemo(() => new THREE.BufferGeometry(), []);
  const material = useMemo(
    () => new THREE.LineBasicMaterial({ color: "#ffffff", transparent: true, opacity: 0.55 }),
    []
  );

  useFrame(() => {
    const positions = [];
    for (let i = 0; i < nodes.length; i++) {
      for (let j = i + 1; j < nodes.length; j++) {
        if (nodes[i].position.distanceTo(nodes[j].position) <= maxDistance) {
          const a = nodes[i].position, b = nodes[j].position;
          positions.push(a.x, a.y, a.z, b.x, b.y, b.z);
        }
      }
    }
    geom.setAttribute("position", new THREE.BufferAttribute(new Float32Array(positions), 3));
    geom.computeBoundingSphere();
  });

  return <lineSegments geometry={geom} material={material} />;
};

const ClickSpawner = ({ onSpawn }) => {
  const { camera, size } = useThree();

  useEffect(() => {
    const handle = (e) => {
      const nx = (e.clientX / size.width)  *  2 - 1;
      const ny = (e.clientY / size.height) * -2 + 1;
      const vec = new THREE.Vector3(nx, ny, 0.5);
      vec.unproject(camera);
      const dir = vec.sub(camera.position).normalize();
      const dist = -camera.position.z / dir.z;
      const worldPos = camera.position.clone().add(dir.multiplyScalar(dist));
      onSpawn(worldPos.x, worldPos.y);
    };
    window.addEventListener("click", handle);
    return () => window.removeEventListener("click", handle);
  }, [camera, size, onSpawn]);

  return null;
};

const WebScene = () => {
  const [nodes, setNodes] = useState(() => generatePoints(INITIAL_COUNT));
  const nodesRef = useRef(nodes);
  const speedBoostRef = useRef(0);
  const cursorRef = useRef(null);

  useEffect(() => {
    const handle = (e) => {
      const delta = Math.abs(e.deltaY) / 800;
      speedBoostRef.current = Math.min(speedBoostRef.current + delta, 1);
    };
    window.addEventListener("wheel", handle, { passive: true });
    return () => window.removeEventListener("wheel", handle);
  }, []);

  const handleSpawn = (cx, cy) => {
    setNodes((prev) => {
      if (prev.length >= MAX_NODES) return prev;
      const toAdd = Math.min(SPAWN_PER_CLICK, MAX_NODES - prev.length);
      const next = [...prev, ...generatePoints(toAdd, cx, cy, 12, 12)];
      nodesRef.current = next;
      return next;
    });
  };

  return (
    <>
      <CursorTracker cursorRef={cursorRef} />
      <ClickSpawner onSpawn={handleSpawn} />
      <Nodes nodes={nodes} speedBoostRef={speedBoostRef} cursorRef={cursorRef} />
      <Lines nodes={nodes} />
    </>
  );
};

const BackgroundWeb = () => (
  <div className="fixed inset-0 z-0 pointer-events-none">
    <Canvas camera={{ fov: 75, position: [0, 0, 60] }} gl={{ antialias: true, alpha: true }}>
      <Suspense fallback={null}>
        <WebScene />
      </Suspense>
    </Canvas>
  </div>
);

export default BackgroundWeb;

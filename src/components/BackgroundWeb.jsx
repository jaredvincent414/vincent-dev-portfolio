import { Canvas, useFrame, useThree } from "@react-three/fiber";
import { Suspense, useMemo, useRef, useState, useEffect } from "react";
import * as THREE from "three";

const INITIAL_COUNT   = 55;
const MAX_NODES       = 400;
const SPAWN_PER_CLICK = 15;

// Camera z=60, fov=75 → visible half-width≈82, half-height≈46 at z=0
const SPREAD_X = 170;
const SPREAD_Y = 96;

const makeNode = (x, y) => ({
  position: new THREE.Vector3(x, y, 0),
  velocity: new THREE.Vector3(
    (Math.random() - 0.5) * 0.045,
    (Math.random() - 0.5) * 0.045,
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

const Nodes = ({ nodes }) => {
  const ref = useRef();

  useFrame(() => {
    nodes.forEach((n) => {
      n.position.add(n.velocity);
      ["x", "y", "z"].forEach((axis) => {
        const limit = axis === "x" ? 86 : 49;
        if (Math.abs(n.position[axis]) > limit) n.velocity[axis] *= -1;
      });
    });
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
  }, []); // fixed-size buffer; frame loop mutates it directly

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
      <pointsMaterial size={0.55} color="#ffffff" sizeAttenuation depthWrite={false} />
    </points>
  );
};

const Lines = ({ nodes, maxDistance = 20 }) => {
  const geom = useMemo(() => new THREE.BufferGeometry(), []);
  const material = useMemo(
    () => new THREE.LineBasicMaterial({ color: "#ffffff", transparent: true, opacity: 0.35 }),
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

// Listens to window clicks and converts screen coords → 3D world coords
const ClickSpawner = ({ onSpawn }) => {
  const { camera, size } = useThree();

  useEffect(() => {
    const handle = (e) => {
      // NDC
      const nx = (e.clientX / size.width)  *  2 - 1;
      const ny = (e.clientY / size.height) * -2 + 1;

      // Unproject to world at z=0
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
      <ClickSpawner onSpawn={handleSpawn} />
      <Nodes nodes={nodes} />
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

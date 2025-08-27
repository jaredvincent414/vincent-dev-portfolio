import { Canvas, useFrame } from "@react-three/fiber";
import { Suspense, useMemo, useRef, useState, useCallback } from "react";
import * as THREE from "three";

const generatePoints = (count, spread = 40) => {
  const pts = [];
  for (let i = 0; i < count; i++) {
    pts.push({
      position: new THREE.Vector3(
        (Math.random() - 0.5) * spread,
        (Math.random() - 0.5) * spread,
        (Math.random() - 0.5) * spread
      ),
      velocity: new THREE.Vector3(
        (Math.random() - 0.5) * 0.12,
        (Math.random() - 0.5) * 0.12,
        (Math.random() - 0.5) * 0.12
      ),
    });
  }
  return pts;
};

const Nodes = ({ nodes, bounds = 45 }) => {
  const ref = useRef();
  useFrame(() => {
    nodes.forEach((n) => {
      n.position.add(n.velocity);
      ["x", "y", "z"].forEach((axis) => {
        if (n.position[axis] > bounds || n.position[axis] < -bounds) {
          n.velocity[axis] *= -1;
        }
      });
    });
    if (ref.current) {
      const positions = ref.current.geometry.attributes.position.array;
      for (let i = 0; i < nodes.length; i++) {
        const idx = i * 3;
        positions[idx] = nodes[i].position.x;
        positions[idx + 1] = nodes[i].position.y;
        positions[idx + 2] = nodes[i].position.z;
      }
      ref.current.geometry.attributes.position.needsUpdate = true;
    }
  });

  const positions = useMemo(() => {
    const arr = new Float32Array(nodes.length * 3);
    nodes.forEach((n, i) => {
      const idx = i * 3;
      arr[idx] = n.position.x;
      arr[idx + 1] = n.position.y;
      arr[idx + 2] = n.position.z;
    });
    return arr;
  }, [nodes]);

  return (
    <points ref={ref}>
      <bufferGeometry>
        <bufferAttribute
          attach="attributes-position"
          count={positions.length / 3}
          array={positions}
          itemSize={3}
        />
      </bufferGeometry>
      <pointsMaterial size={0.6} color="#9fb7ff" sizeAttenuation depthWrite={false} />
    </points>
  );
};

const Lines = ({ nodes, maxDistance = 12 }) => {
  const ref = useRef();
  const geom = useMemo(() => new THREE.BufferGeometry(), []);
  const material = useMemo(
    () => new THREE.LineBasicMaterial({ color: new THREE.Color("#6ea8ff"), transparent: true, opacity: 0.25 }),
    []
  );

  useFrame(() => {
    const positions = [];
    for (let i = 0; i < nodes.length; i++) {
      for (let j = i + 1; j < nodes.length; j++) {
        const a = nodes[i].position;
        const b = nodes[j].position;
        const d = a.distanceTo(b);
        if (d <= maxDistance) {
          positions.push(a.x, a.y, a.z, b.x, b.y, b.z);
        }
      }
    }
    const arr = new Float32Array(positions);
    geom.setAttribute("position", new THREE.BufferAttribute(arr, 3));
    geom.computeBoundingSphere();
  });

  return <lineSegments ref={ref} geometry={geom} material={material} />;
};

const WebScene = () => {
  const [nodes, setNodes] = useState(() => generatePoints(140));

  const onClick = useCallback(() => {
    setNodes((prev) => [...prev, ...generatePoints(15)]);
  }, []);

  return (
    <group onPointerDown={onClick}>
      <Nodes nodes={nodes} />
      <Lines nodes={nodes} />
    </group>
  );
};

const BackgroundWeb = () => {
  return (
    <div className="fixed inset-0 z-0 pointer-events-auto">
      <Canvas camera={{ fov: 60, position: [0, 0, 60] }} gl={{ antialias: true, alpha: true }}>
        <Suspense fallback={null}>
          <WebScene />
        </Suspense>
      </Canvas>
    </div>
  );
};

export default BackgroundWeb;



import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useRef, useMemo, Suspense } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { useTexture } from "@react-three/drei";
import * as THREE from "three";

import { organisations } from "../constants";
import TitleHeader from "../components/TitleHeader";

gsap.registerPlugin(ScrollTrigger);

// ── Gem: box with logo on front/back, silver on all other faces ───────────────
const GemMesh = ({ logoPath, index }) => {
  const groupRef = useRef();
  const spinRef  = useRef(0);
  const scaleRef = useRef(1);
  const hoverRef = useRef(false);
  const phase    = index * 0.9;

  const texture = useTexture(logoPath);

  const silverMat = useMemo(
    () =>
      new THREE.MeshStandardMaterial({
        color: "#c8d4dc",
        metalness: 0.88,
        roughness: 0.14,
      }),
    []
  );

  const faceMat = useMemo(
    () => new THREE.MeshBasicMaterial({ map: texture }),
    [texture]
  );

  // BoxGeometry face groups: 0=right, 1=left, 2=top, 3=bottom, 4=front, 5=back
  const materials = useMemo(
    () => [silverMat, silverMat, silverMat, silverMat, faceMat, faceMat],
    [silverMat, faceMat]
  );

  const geo = useMemo(() => new THREE.BoxGeometry(1.6, 1.6, 1.6), []);

  const handleClick = () => {
    spinRef.current = 0.25;
    scaleRef.current = 1.2;
  };

  useFrame(({ clock }) => {
    const t = clock.getElapsedTime();
    if (!groupRef.current) return;
    // Gentle bob — always active
    groupRef.current.position.y = Math.sin(t * 0.7 + phase) * 0.08;
    // Rotate only on hover or click spin
    if (hoverRef.current) {
      groupRef.current.rotation.y += 0.018;
    } else if (spinRef.current > 0.001) {
      groupRef.current.rotation.y += spinRef.current;
    }
    spinRef.current *= 0.9;
    scaleRef.current += (1 - scaleRef.current) * 0.1;
    groupRef.current.scale.setScalar(scaleRef.current);
  });

  return (
    <group
      ref={groupRef}
      onClick={handleClick}
      onPointerEnter={() => { hoverRef.current = true; }}
      onPointerLeave={() => { hoverRef.current = false; }}
    >
      <mesh geometry={geo} material={materials} />
    </group>
  );
};

const OrgCard = ({ org, index }) => (
  <div className="org-card opacity-0 flex flex-col items-center gap-2 cursor-pointer group">
    <div className="w-28 h-28 md:w-32 md:h-32 transition-transform duration-300 group-hover:-translate-y-1">
      <Canvas
        camera={{ position: [0, 0, 3.5], fov: 45 }}
        gl={{ antialias: true, alpha: true }}
        style={{ background: "transparent" }}
      >
        <ambientLight intensity={0.7} color="#ffffff" />
        <directionalLight position={[2, 4, 3]}  intensity={2.0} color="#ffffff" />
        <directionalLight position={[-2, 1, 2]} intensity={0.8} color="#d0e0ff" />
        <directionalLight position={[0, -3, 2]} intensity={0.4} color="#ffffff" />
        <Suspense fallback={null}>
          <GemMesh logoPath={org.logoPath} index={index} />
        </Suspense>
      </Canvas>
    </div>
    <p className="text-white/65 text-xs font-semibold text-center leading-snug max-w-[90px]">
      {org.name}
    </p>
  </div>
);

// ── Section ───────────────────────────────────────────────────────────────────
const Organisations = () => {
  useGSAP(() => {
    gsap.fromTo(
      ".org-card",
      { y: 40, opacity: 0 },
      {
        y: 0, opacity: 1, stagger: 0.1, duration: 0.7, ease: "power2.out",
        scrollTrigger: { trigger: ".org-grid", start: "top 82%" },
      }
    );
  }, []);

  return (
    <section id="organisations" className="py-20 md:py-32 px-5 md:px-20">
      <TitleHeader title="Organisations" sub="Communities I'm part of" />

      <div className="org-grid mt-16 flex flex-wrap justify-center gap-10 md:gap-14 max-w-5xl mx-auto">
        {organisations.map((org, i) => (
          <OrgCard key={org.name} org={org} index={i} />
        ))}
      </div>
    </section>
  );
};

export default Organisations;

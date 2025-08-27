import { Float, OrbitControls, useGLTF } from "@react-three/drei";
import { Canvas } from "@react-three/fiber";
import { useEffect } from "react";
import * as THREE from "three";

const TechIconCardExperience = ({ model }) => {
  const scene = useGLTF(model.modelPath);

  useEffect(() => {
    if (model.name === "Interactive Developer") {
      scene.scene.traverse((child) => {
        if (child.isMesh) {
          if (child.name === "Object_5") {
            child.material = new THREE.MeshStandardMaterial({ color: "white" });
          }
        }
      });
    }
  }, [scene]);

  const CoffeeCup = () => {
    return (
      <group>
        {/* Cup body */}
        <mesh position={[0, -0.2, 0]} castShadow receiveShadow>
          <cylinderGeometry args={[0.35, 0.4, 0.5, 32]} />
          <meshStandardMaterial color="#ffffff" metalness={0.1} roughness={0.3} />
        </mesh>

        {/* Cup rim (slightly larger thin ring on top) */}
        <mesh position={[0, 0.05, 0]} castShadow receiveShadow>
          <torusGeometry args={[0.36, 0.03, 16, 64]} />
          <meshStandardMaterial color="#f2f2f2" metalness={0.1} roughness={0.4} />
        </mesh>

        {/* Handle */}
        <mesh position={[0.42, -0.05, 0]} rotation={[0, Math.PI / 2, 0]} castShadow>
          <torusGeometry args={[0.18, 0.05, 16, 64]} />
          <meshStandardMaterial color="#ffffff" metalness={0.1} roughness={0.3} />
        </mesh>

        {/* Coffee surface */}
        <mesh position={[0, 0.3, 0]} rotation={[Math.PI / 2, 0, 0]} receiveShadow>
          <circleGeometry args={[0.3, 32]} />
          <meshStandardMaterial color="#4b2e2b" roughness={0.8} />
        </mesh>

        {/* Steam lines */}
        <mesh position={[-0.1, 0.55, 0]} rotation={[Math.PI / 2, 0, 0]}>
          <torusGeometry args={[0.08, 0.01, 12, 32, Math.PI]} />
          <meshStandardMaterial color="#ff4d4d" emissive="#330000" emissiveIntensity={0.2} />
        </mesh>
        <mesh position={[0.1, 0.65, 0]} rotation={[Math.PI / 2, 0, 0]}>
          <torusGeometry args={[0.07, 0.01, 12, 32, Math.PI]} />
          <meshStandardMaterial color="#ff4d4d" emissive="#330000" emissiveIntensity={0.2} />
        </mesh>
      </group>
    );
  };

  // removed temporary primitives added in the last step

  return (
    <Canvas>
      <ambientLight intensity={0.3} />
      <directionalLight position={[5, 5, 5]} intensity={1} />
      <spotLight
        position={[10, 15, 10]}
        angle={0.3}
        penumbra={1}
        intensity={2}
      />
      {/* No environment background; keep scene minimal */}

      {/* 
        The Float component from @react-three/drei is used to 
        create a simple animation of the model floating in space.
        The rotationIntensity and floatIntensity props control the
        speed of the rotation and float animations respectively.

        The group component is used to scale and rotate the model.
        The rotation is set to the value of the model.rotation property,
        which is an array of three values representing the rotation in
        degrees around the x, y and z axes respectively.

        The primitive component is used to render the 3D model.
        The object prop is set to the scene object returned by the
        useGLTF hook, which is an instance of THREE.Group. The
        THREE.Group object contains all the objects (meshes, lights, etc)
        that make up the 3D model.
      */}
      <Float speed={5.5} rotationIntensity={0.5} floatIntensity={0.9}>
        <group scale={model.scale} rotation={model.rotation}>
          <primitive object={scene.scene} />
        </group>
      </Float>

      <OrbitControls enableZoom={false} />
    </Canvas>
  );
};

export default TechIconCardExperience;

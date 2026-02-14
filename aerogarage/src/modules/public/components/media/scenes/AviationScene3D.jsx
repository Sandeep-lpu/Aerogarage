import { useRef } from "react";
import { Canvas, useFrame } from "@react-three/fiber";

const variantColors = {
  hero: { base: "#0c3f73", accent: "#2d8eff", glow: "#87bfff", seed: 0.9 },
  service: { base: "#1f3b5c", accent: "#0070f3", glow: "#9ecbff", seed: 1.8 },
  training: { base: "#12324f", accent: "#3f9bff", glow: "#b7dcff", seed: 2.6 },
};

function SceneCore({ variant }) {
  const ringRef = useRef(null);
  const cubeRef = useRef(null);
  const colors = variantColors[variant] || variantColors.hero;

  useFrame((state, delta) => {
    const t = state.clock.elapsedTime + colors.seed;

    if (ringRef.current) ringRef.current.rotation.y += delta * 0.25;

    if (cubeRef.current) {
      cubeRef.current.rotation.x += delta * 0.18;
      cubeRef.current.position.y = Math.sin(t * 0.7) * 0.18;
    }
  });

  return (
    <>
      <ambientLight intensity={0.65} />
      <directionalLight position={[2.2, 2.2, 2]} intensity={1.1} color={colors.glow} />
      <pointLight position={[-2, -1, 1.5]} intensity={0.7} color={colors.accent} />

      <mesh ref={cubeRef} position={[0, 0, 0]}>
        <boxGeometry args={[1.1, 1.1, 1.1]} />
        <meshStandardMaterial color={colors.base} metalness={0.55} roughness={0.35} />
      </mesh>

      <mesh ref={ringRef} rotation={[1.57, 0.3, 0]}>
        <torusGeometry args={[1.7, 0.07, 14, 48]} />
        <meshStandardMaterial color={colors.accent} metalness={0.9} roughness={0.2} />
      </mesh>

      <mesh position={[0, -1.45, 0]} rotation={[-1.57, 0, 0]}>
        <circleGeometry args={[3.4, 20]} />
        <meshStandardMaterial color={colors.glow} transparent opacity={0.16} />
      </mesh>
    </>
  );
}

export default function AviationScene3D({ variant = "hero" }) {
  return (
    <Canvas dpr={[1, 1.25]} camera={{ position: [0, 1.1, 4.2], fov: 45 }}>
      <SceneCore variant={variant} />
    </Canvas>
  );
}

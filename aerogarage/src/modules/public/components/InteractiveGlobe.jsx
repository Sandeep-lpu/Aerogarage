import { useRef, useMemo } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';

export default function InteractiveGlobe(props) {
  const ref = useRef();
  
  // Create a sphere of dense particles
  const [positions] = useMemo(() => {
    const count = 4000;
    const positions = new Float32Array(count * 3);
    
    for (let i = 0; i < count; i++) {
      const radius = 2.4;
      // Distribute particles evenly on sphere using golden ratio
      const phi = Math.acos(-1 + (2 * i) / count);
      const theta = Math.sqrt(count * Math.PI) * phi;
      
      const x = radius * Math.sin(phi) * Math.cos(theta);
      const y = radius * Math.sin(phi) * Math.sin(theta);
      const z = radius * Math.cos(phi);
      
      positions[i * 3] = x;
      positions[i * 3 + 1] = y;
      positions[i * 3 + 2] = z;
    }
    
    return [positions];
  }, []);

  useFrame((state) => {
    if (!ref.current) return;
    
    // Constant slow drift
    ref.current.rotation.y = state.clock.elapsedTime * 0.05;
    
    // Interactive mouse rotation tracking
    const targetX = (state.pointer.x * Math.PI) / 6;
    const targetY = (state.pointer.y * Math.PI) / 6;
    
    ref.current.rotation.y += (targetX - ref.current.rotation.y) * 0.05;
    ref.current.rotation.x += (targetY - ref.current.rotation.x) * 0.05;
  });

  return (
    <group rotation={[0, 0, Math.PI / 6]} {...props}>
      <points ref={ref}>
        <bufferGeometry>
            <bufferAttribute
                attach="attributes-position"
                count={positions.length / 3}
                array={positions}
                itemSize={3}
            />
        </bufferGeometry>
        <pointsMaterial 
            transparent 
            color="#3b82f6" 
            size={0.015} 
            sizeAttenuation={true} 
            depthWrite={false}
            blending={THREE.AdditiveBlending}
        />
      </points>
    </group>
  );
}

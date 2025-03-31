import { useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import { Sphere } from '@react-three/drei';
import * as THREE from 'three';

export const Scene = () => {
  const sphereRef = useRef<THREE.Mesh>(null);

  useFrame(({ clock, mouse }) => {
    if (!sphereRef.current) return;
    
    sphereRef.current.rotation.x = Math.sin(clock.getElapsedTime()) * 0.3;
    sphereRef.current.rotation.y = Math.cos(clock.getElapsedTime()) * 0.3;
    
    // Mouse interaction
    sphereRef.current.position.x = (mouse.x * 0.5);
    sphereRef.current.position.y = (mouse.y * 0.5);
  });

  return (
    <Sphere ref={sphereRef} args={[1, 64, 64]}>
      <meshStandardMaterial
        metalness={0.9}
        roughness={0.1}
        color={0x444444}
      />
    </Sphere>
  );
};

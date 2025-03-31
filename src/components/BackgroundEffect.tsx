import { useRef, useEffect } from 'react';
import * as THREE from 'three';
import { extend, useFrame, useThree } from '@react-three/fiber';
import { shaderMaterial } from '@react-three/drei';

const BackgroundMaterial = shaderMaterial(
  {
    uTime: 0,
    uMouse: new THREE.Vector2(0, 0),
    uResolution: new THREE.Vector2(0, 0),
  },
  // Vertex Shader
  `
    varying vec2 vUv;
    void main() {
      vUv = uv;
      gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
    }
  `,
  // Fragment Shader
  `
    uniform float uTime;
    uniform vec2 uMouse;
    uniform vec2 uResolution;
    varying vec2 vUv;

    void main() {
      vec2 uv = vUv;
      vec2 mouse = uMouse / uResolution;
      
      float dist = length(uv - mouse);
      float strength = 0.15 / (dist + 0.1);
      
      vec3 color = vec3(0.05, 0.05, 0.1);
      color += strength * vec3(0.2, 0.2, 0.4);
      
      float noise = fract(sin(dot(uv, vec2(12.9898, 78.233))) * 43758.5453);
      color += noise * 0.02;
      
      gl_FragColor = vec4(color, 1.0);
    }
  `
);

extend({ BackgroundMaterial });

export const BackgroundEffect = () => {
  const materialRef = useRef<any>();
  const { viewport, size } = useThree();
  const mouse = useRef([0, 0]);

  useEffect(() => {
    const onMouseMove = (e: MouseEvent) => {
      mouse.current = [
        e.clientX / size.width,
        1 - e.clientY / size.height
      ];
    };

    window.addEventListener('mousemove', onMouseMove);
    return () => window.removeEventListener('mousemove', onMouseMove);
  }, [size]);

  useFrame(({ clock }) => {
    if (materialRef.current) {
      materialRef.current.uTime = clock.getElapsedTime();
      materialRef.current.uMouse.set(mouse.current[0], mouse.current[1]);
      materialRef.current.uResolution.set(size.width, size.height);
    }
  });

  return (
    <mesh scale={[viewport.width, viewport.height, 1]}>
      <planeGeometry args={[1, 1]} />
      {/* @ts-ignore */}
      <backgroundMaterial ref={materialRef} />
    </mesh>
  );
};

import React, { useRef, useMemo } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { Center } from '@react-three/drei';
import * as THREE from 'three';

// 3D Particles Sparkle Field Component
function SparklesField() {
  const count = 40;
  const points = useMemo(() => {
    const p = new Float32Array(count * 3);
    for (let i = 0; i < count; i++) {
      p[i * 3] = (Math.random() - 0.5) * 3.5;       // x
      p[i * 3 + 1] = (Math.random() - 0.5) * 3.5;   // y
      p[i * 3 + 2] = (Math.random() - 0.5) * 3.5;   // z
    }
    return p;
  }, []);

  const ref = useRef<THREE.Points>(null);
  useFrame((state) => {
    if (ref.current) {
      ref.current.rotation.y = state.clock.getElapsedTime() * 0.03;
      ref.current.rotation.x = state.clock.getElapsedTime() * 0.015;
    }
  });

  return (
    <points ref={ref}>
      <bufferGeometry>
        <bufferAttribute
          attach="attributes-position"
          count={count}
          array={points}
          itemSize={3}
        />
      </bufferGeometry>
      <pointsMaterial
        size={0.03}
        color="#ff3333"
        transparent
        opacity={0.6}
        sizeAttenuation
      />
    </points>
  );
}

// Inner Trophy Mesh components & animation logic
function TrophyInner() {
  const groupRef = useRef<THREE.Group>(null);

  // Stylized polygonal representation of Tanzania map outline
  const tzShape = useMemo(() => {
    const s = new THREE.Shape();
    s.moveTo(-0.4, 0.4);
    s.lineTo(-0.1, 0.45);
    s.lineTo(0.15, 0.4);
    s.lineTo(0.35, 0.3);
    s.lineTo(0.48, 0.05);
    s.lineTo(0.45, -0.4);
    s.lineTo(0.2, -0.55);
    s.lineTo(-0.15, -0.4);
    s.lineTo(-0.5, -0.25);
    s.lineTo(-0.55, 0.1);
    s.lineTo(-0.4, 0.4);
    return s;
  }, []);

  // 5-point Star Outline
  const starShape = useMemo(() => {
    const s = new THREE.Shape();
    const points = 5;
    const outerRadius = 0.11;
    const innerRadius = 0.045;
    for (let i = 0; i < points * 2; i++) {
      const angle = (i * Math.PI) / points - Math.PI / 2;
      const radius = i % 2 === 0 ? outerRadius : innerRadius;
      const x = Math.cos(angle) * radius;
      const y = Math.sin(angle) * radius;
      if (i === 0) s.moveTo(x, y);
      else s.lineTo(x, y);
    }
    s.closePath();
    return s;
  }, []);

  // Left Collar Half Shape (left half of split V-shield)
  const leftCollarShape = useMemo(() => {
    const s = new THREE.Shape();
    s.moveTo(-0.9, 0.9);
    s.lineTo(-0.06, 0.7);
    s.lineTo(-0.03, -0.6);
    s.lineTo(-0.1, -0.65);
    s.lineTo(-0.9, 0.9);
    return s;
  }, []);

  // Right Collar Half Shape (right half of split V-shield)
  const rightCollarShape = useMemo(() => {
    const s = new THREE.Shape();
    s.moveTo(0.9, 0.9);
    s.lineTo(0.06, 0.7);
    s.lineTo(0.03, -0.6);
    s.lineTo(0.1, -0.65);
    s.lineTo(0.9, 0.9);
    return s;
  }, []);

  useFrame((state) => {
    if (groupRef.current) {
      // Rotation spinning over time
      groupRef.current.rotation.y = state.clock.getElapsedTime() * 0.28;
      // Slight vertical hover float
      groupRef.current.position.y = Math.sin(state.clock.getElapsedTime() * 1.6) * 0.06 + 0.1;

      // Mouse pointer coordinate tracking tilt (smooth lerp transition)
      groupRef.current.rotation.x = THREE.MathUtils.lerp(groupRef.current.rotation.x, state.pointer.y * 0.22, 0.06);
      groupRef.current.rotation.z = THREE.MathUtils.lerp(groupRef.current.rotation.z, -state.pointer.x * 0.12, 0.06);
    }
  });

  return (
    <group ref={groupRef} scale={[1.45, 1.45, 1.45]}>
      {/* 1. Pedestal Base */}
      <mesh position={[0, -0.95, 0]}>
        <cylinderGeometry args={[1.0, 1.1, 0.26, 64]} />
        <meshStandardMaterial color="#0d0d0d" metalness={0.9} roughness={0.16} />
      </mesh>

      {/* Red Glowing Pedestal Rings */}
      <mesh position={[0, -0.86, 0]} rotation={[Math.PI / 2, 0, 0]}>
        <torusGeometry args={[0.99, 0.015, 16, 64]} />
        <meshBasicMaterial color="#ff2222" />
      </mesh>
      <mesh position={[0, -0.99, 0]} rotation={[Math.PI / 2, 0, 0]}>
        <torusGeometry args={[1.04, 0.015, 16, 64]} />
        <meshBasicMaterial color="#ff2222" />
      </mesh>

      {/* 2. Glowing Semi-Transparent Red Crystal Collar (V-Shield) */}
      <group position={[0, -0.1, 0]}>
        {/* Left half */}
        <mesh position={[0, 0, 0]}>
          <extrudeGeometry args={[leftCollarShape, { depth: 0.09, bevelEnabled: true, bevelThickness: 0.03, bevelSize: 0.015, bevelSegments: 3 }]} />
          <meshPhysicalMaterial
            color="#ff0c0c"
            emissive="#380000"
            roughness={0.08}
            metalness={0.1}
            transmission={0.82}
            ior={1.48}
            thickness={0.28}
            clearcoat={1.0}
            transparent
            opacity={0.88}
          />
        </mesh>

        {/* Right half */}
        <mesh position={[0, 0, 0]}>
          <extrudeGeometry args={[rightCollarShape, { depth: 0.09, bevelEnabled: true, bevelThickness: 0.03, bevelSize: 0.015, bevelSegments: 3 }]} />
          <meshPhysicalMaterial
            color="#ff0c0c"
            emissive="#380000"
            roughness={0.08}
            metalness={0.1}
            transmission={0.82}
            ior={1.48}
            thickness={0.28}
            clearcoat={1.0}
            transparent
            opacity={0.88}
          />
        </mesh>
      </group>

      {/* 3. Tanzania Silver Map Shape */}
      <group position={[0, 0, 0.11]}>
        <mesh scale={[1.15, 1.15, 0.8]}>
          <extrudeGeometry args={[tzShape, { depth: 0.05, bevelEnabled: true, bevelThickness: 0.01, bevelSize: 0.008, bevelSegments: 2 }]} />
          <meshStandardMaterial color="#fcfcfc" metalness={0.92} roughness={0.14} />
        </mesh>

        {/* 4. Red Cross Element inside Tanzania Map */}
        <group position={[0, 0.02, 0.068]}>
          {/* Vertical Crossbar */}
          <mesh>
            <boxGeometry args={[0.075, 0.20, 0.025]} />
            <meshBasicMaterial color="#ff2222" />
          </mesh>
          {/* Horizontal Crossbar */}
          <mesh>
            <boxGeometry args={[0.20, 0.075, 0.025]} />
            <meshBasicMaterial color="#ff2222" />
          </mesh>
        </group>
      </group>

      {/* 5. Trio of Floating Stars Above */}
      <group position={[0, 1.05, 0.04]}>
        {/* Main Center Star */}
        <mesh position={[0, 0.08, 0]}>
          <extrudeGeometry args={[starShape, { depth: 0.025, bevelEnabled: true, bevelThickness: 0.008, bevelSize: 0.004, bevelSegments: 2 }]} />
          <meshPhysicalMaterial color="#ff2222" emissive="#440000" metalness={0.8} roughness={0.12} />
        </mesh>

        {/* Left Sub-Star */}
        <mesh position={[-0.4, -0.06, 0]} rotation={[0, 0, -0.38]} scale={0.72}>
          <extrudeGeometry args={[starShape, { depth: 0.025, bevelEnabled: true, bevelThickness: 0.008, bevelSize: 0.004, bevelSegments: 2 }]} />
          <meshPhysicalMaterial color="#ff2222" emissive="#440000" metalness={0.8} roughness={0.12} />
        </mesh>

        {/* Right Sub-Star */}
        <mesh position={[0.4, -0.06, 0]} rotation={[0, 0, 0.38]} scale={0.72}>
          <extrudeGeometry args={[starShape, { depth: 0.025, bevelEnabled: true, bevelThickness: 0.008, bevelSize: 0.004, bevelSegments: 2 }]} />
          <meshPhysicalMaterial color="#ff2222" emissive="#440000" metalness={0.8} roughness={0.12} />
        </mesh>
      </group>
    </group>
  );
}

export default function Trophy3D() {
  return (
    <div className="w-full h-full relative" style={{ minHeight: '380px' }}>
      {/* Absolute canvas stage */}
      <Canvas
        gl={{ antialias: true, alpha: true }}
        style={{ background: 'transparent' }}
      >
        <ambientLight intensity={0.4} />

        {/* Directional front spotlighting */}
        <directionalLight position={[4, 8, 4]} intensity={1.6} />

        {/* Red side highlight */}
        <directionalLight position={[-4, 2, 2]} intensity={1.1} color="#ff3333" />

        {/* Bottom Red backlight creating glowing edge reflection */}
        <pointLight position={[0, -0.4, -0.8]} intensity={4.5} distance={6} color="#ff1111" />

        {/* Top focusing spot highlights */}
        <spotLight
          position={[0, 6, 2]}
          intensity={2.2}
          angle={0.5}
          penumbra={0.4}
        />

        <Center>
          <TrophyInner />
        </Center>

        <SparklesField />
      </Canvas>
    </div>
  );
}

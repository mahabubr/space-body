import React, { useMemo, useRef } from "react";
import * as THREE from "three";
import { useFrame } from "@react-three/fiber";
import { getBrainTexture } from "./textures";

interface SystemProps {
  isSelected: boolean;
  isHovered: boolean;
  isFaded: boolean;
  onClick: (e: any) => void;
  onPointerOver: (e: any) => void;
  onPointerOut: (e: any) => void;
}

export const BrainSystem: React.FC<SystemProps> = ({
  isSelected,
  isHovered,
  isFaded,
  onClick,
  onPointerOver,
  onPointerOut,
}) => {
  const pulseGroupRef = useRef<THREE.Group>(null);
  const ringRef = useRef<THREE.Mesh>(null);

  // Brain convolution texture
  const brainTexture = useMemo(() => getBrainTexture(), []);

  // Anatomical coral / rose brain material
  const brainMat = useMemo(
    () =>
      new THREE.MeshStandardMaterial({
        map: brainTexture,
        color: new THREE.Color("#f472b6"),
        roughness: 0.32,
        metalness: 0.05,
        emissive: new THREE.Color("#ec4899"),
        emissiveIntensity: 0.0,
      }),
    [brainTexture]
  );

  // Cerebellum material (fine folia texture)
  const cerebellumMat = useMemo(
    () =>
      new THREE.MeshStandardMaterial({
        map: brainTexture,
        color: new THREE.Color("#fb7185"),
        roughness: 0.36,
        metalness: 0.04,
        emissive: new THREE.Color("#f43f5e"),
        emissiveIntensity: 0.0,
      }),
    [brainTexture]
  );

  // Brainstem ivory / flesh material
  const stemMat = useMemo(
    () =>
      new THREE.MeshStandardMaterial({
        color: new THREE.Color("#fed7aa"),
        roughness: 0.4,
      }),
    []
  );

  useFrame((state) => {
    const time = state.clock.getElapsedTime();

    if (isSelected) {
      // Rhythmic neural synaptic pulse
      const wave = Math.sin(time * 3.5);
      const pulseScale = 1.0 + wave * 0.035;
      if (pulseGroupRef.current) {
        pulseGroupRef.current.scale.set(pulseScale, pulseScale, pulseScale);
      }
      brainMat.emissiveIntensity = 0.5 + wave * 0.35;
      cerebellumMat.emissiveIntensity = 0.45 + wave * 0.3;

      if (ringRef.current) {
        ringRef.current.rotation.z = time * 0.9;
        ringRef.current.visible = true;
      }
    } else if (isHovered) {
      brainMat.emissiveIntensity = 0.4;
      cerebellumMat.emissiveIntensity = 0.35;
      if (ringRef.current) ringRef.current.visible = false;
      if (pulseGroupRef.current) pulseGroupRef.current.scale.set(1, 1, 1);
    } else if (isFaded) {
      brainMat.emissiveIntensity = 0.0;
      cerebellumMat.emissiveIntensity = 0.0;
      if (ringRef.current) ringRef.current.visible = false;
      if (pulseGroupRef.current) pulseGroupRef.current.scale.set(1, 1, 1);
    } else {
      brainMat.emissiveIntensity = 0.0;
      cerebellumMat.emissiveIntensity = 0.0;
      if (ringRef.current) ringRef.current.visible = false;
      if (pulseGroupRef.current) pulseGroupRef.current.scale.set(1, 1, 1);
    }
  });

  return (
    <group
      name="BrainSystem"
      position={[0, 0.74, 0]}
      onClick={onClick}
      onPointerOver={onPointerOver}
      onPointerOut={onPointerOut}
    >
      {/* Neural Energy Ring (selected state) */}
      <mesh
        ref={ringRef}
        position={[-0.035, 0.045, -0.01]}
        rotation={[Math.PI / 2, 0, 0]}
        visible={false}
      >
        <ringGeometry args={[0.078, 0.086, 48]} />
        <meshBasicMaterial
          color="#ec4899"
          side={THREE.DoubleSide}
          transparent={true}
          opacity={0.8}
          blending={THREE.AdditiveBlending}
        />
      </mesh>

      <group ref={pulseGroupRef}>
        {/* Exposed Brain Cerebrum - Frontal & Parietal Lobes (cutaway visible on top-left) */}
        <mesh
          position={[-0.032, 0.042, -0.005]}
          material={brainMat}
          scale={[0.92, 1.08, 1.12]}
        >
          <sphereGeometry args={[0.068, 28, 24]} />
        </mesh>

        {/* Temporal Lobe (lateral bulge) */}
        <mesh
          position={[-0.045, 0.01, 0.008]}
          material={brainMat}
          scale={[0.85, 0.9, 1.15]}
        >
          <sphereGeometry args={[0.042, 20, 16]} />
        </mesh>

        {/* Occipital Lobe (posterior pole) */}
        <mesh
          position={[-0.028, 0.025, -0.045]}
          material={brainMat}
          scale={[0.9, 0.95, 1.0]}
        >
          <sphereGeometry args={[0.045, 20, 16]} />
        </mesh>

        {/* Cerebellum (posterior inferior cauliflower texture) */}
        <mesh
          position={[-0.028, -0.025, -0.042]}
          material={cerebellumMat}
          scale={[1.1, 0.75, 0.95]}
        >
          <sphereGeometry args={[0.038, 22, 18]} />
        </mesh>

        {/* Brainstem (Pons & Medulla connecting to spinal cord) */}
        <mesh
          position={[-0.005, -0.055, -0.018]}
          rotation={[0.1, 0, 0]}
          material={stemMat}
        >
          <cylinderGeometry args={[0.014, 0.016, 0.065, 14]} />
        </mesh>
      </group>
    </group>
  );
};

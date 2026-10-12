import React, { useMemo, useRef } from "react";
import * as THREE from "three";
import { useFrame } from "@react-three/fiber";
import { getIrisTexture } from "./textures";

interface SystemProps {
  isSelected: boolean;
  isHovered: boolean;
  isFaded: boolean;
  onClick: (e: any) => void;
  onPointerOver: (e: any) => void;
  onPointerOut: (e: any) => void;
}

export const EyesSystem: React.FC<SystemProps> = ({
  isSelected,
  isHovered,
  isFaded,
  onClick,
  onPointerOver,
  onPointerOut,
}) => {
  const eyeGroupRef = useRef<THREE.Group>(null);
  const targetRingRef = useRef<THREE.Mesh>(null);

  // High-resolution blue iris texture
  const irisTexture = useMemo(() => getIrisTexture(), []);

  // Sclera Material (pearl white eyeball)
  const scleraMat = useMemo(
    () =>
      new THREE.MeshStandardMaterial({
        color: new THREE.Color("#f8fafc"),
        roughness: 0.12,
        metalness: 0.02,
      }),
    []
  );

  // Cornea & Iris Material (glossy blue eye front)
  const irisMat = useMemo(
    () =>
      new THREE.MeshStandardMaterial({
        map: irisTexture,
        roughness: 0.08,
        metalness: 0.05,
        emissive: new THREE.Color("#0284c7"),
        emissiveIntensity: 0.0,
      }),
    [irisTexture]
  );

  // Optic Nerve Material
  const nerveMat = useMemo(
    () =>
      new THREE.MeshStandardMaterial({
        color: new THREE.Color("#fbcfe8"),
        roughness: 0.35,
      }),
    []
  );

  // Skin tone for eyelid frame
  const eyelidSkinMat = useMemo(
    () =>
      new THREE.MeshStandardMaterial({
        color: new THREE.Color("#fed7aa"),
        roughness: 0.45,
      }),
    []
  );

  useFrame((state) => {
    const time = state.clock.getElapsedTime();

    if (isSelected) {
      // Diagnostic focus reticle glow
      irisMat.emissiveIntensity = 0.55 + Math.sin(time * 4.0) * 0.25;
      if (targetRingRef.current) {
        targetRingRef.current.rotation.z = time * 1.5;
        targetRingRef.current.visible = true;
      }
    } else if (isHovered) {
      irisMat.emissiveIntensity = 0.35;
      if (targetRingRef.current) targetRingRef.current.visible = false;
    } else if (isFaded) {
      irisMat.emissiveIntensity = 0.0;
      if (targetRingRef.current) targetRingRef.current.visible = false;
    } else {
      irisMat.emissiveIntensity = 0.0;
      if (targetRingRef.current) targetRingRef.current.visible = false;
    }
  });

  return (
    <group
      ref={eyeGroupRef}
      name="VisualSystem"
      position={[0, 0.74, 0]}
      onClick={onClick}
      onPointerOver={onPointerOver}
      onPointerOut={onPointerOut}
    >
      {/* Reticle Focus Ring (Visible on SANS diagnostic focus) */}
      <mesh
        ref={targetRingRef}
        position={[0.038, -0.015, 0.075]}
        visible={false}
      >
        <ringGeometry args={[0.024, 0.028, 36]} />
        <meshBasicMaterial
          color="#38bdf8"
          side={THREE.DoubleSide}
          transparent={true}
          opacity={0.85}
          blending={THREE.AdditiveBlending}
        />
      </mesh>

      {/* ---------------- RIGHT EYE (Viewer's Right X > 0) ---------------- */}
      <group position={[0.038, -0.015, 0.046]}>
        {/* Eyeball Sclera Globe */}
        <mesh material={scleraMat} scale={[1.0, 1.0, 1.0]}>
          <sphereGeometry args={[0.0175, 24, 20]} />
        </mesh>

        {/* Detailed Iris & Pupil disk with specular cornea shine */}
        <mesh position={[0, 0, 0.0155]} material={irisMat}>
          <circleGeometry args={[0.009, 32]} />
        </mesh>

        {/* Cornea Curvature Glass Layer */}
        <mesh position={[0, 0, 0.016]}>
          <sphereGeometry args={[0.0095, 20, 16, 0, Math.PI * 2, 0, Math.PI / 2.2]} />
          <meshPhysicalMaterial
            roughness={0.05}
            transmission={0.9}
            transparent={true}
            opacity={0.4}
            ior={1.38}
          />
        </mesh>

        {/* Optic Nerve routing backward to brainstem */}
        <mesh position={[0, 0, -0.032]} rotation={[Math.PI / 2, 0, 0]} material={nerveMat}>
          <cylinderGeometry args={[0.004, 0.0048, 0.045, 10]} />
        </mesh>

        {/* Upper Eyelid Frame */}
        <mesh
          position={[0, 0.009, 0.012]}
          rotation={[0.35, 0, 0]}
          material={eyelidSkinMat}
          scale={[1.15, 0.5, 0.8]}
        >
          <capsuleGeometry args={[0.006, 0.02, 8, 12]} />
        </mesh>

        {/* Lower Eyelid Frame */}
        <mesh
          position={[0, -0.009, 0.01]}
          rotation={[-0.2, 0, 0]}
          material={eyelidSkinMat}
          scale={[1.1, 0.45, 0.8]}
        >
          <capsuleGeometry args={[0.0055, 0.018, 8, 12]} />
        </mesh>

        {/* Natural Eyebrow Arch */}
        <mesh
          position={[0, 0.022, 0.014]}
          rotation={[0.1, 0, -0.1]}
          scale={[1.2, 0.4, 0.6]}
        >
          <capsuleGeometry args={[0.0055, 0.026, 6, 10]} />
          <meshStandardMaterial color="#78350f" roughness={0.8} />
        </mesh>
      </group>
    </group>
  );
};

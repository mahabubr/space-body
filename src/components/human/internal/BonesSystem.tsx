import React, { useMemo, useRef } from "react";
import * as THREE from "three";
import { useFrame } from "@react-three/fiber";
import { getBoneTexture, getTendonTexture } from "./textures";

interface SystemProps {
  isSelected: boolean;
  isHovered: boolean;
  isFaded: boolean;
  onClick: (e: any) => void;
  onPointerOver: (e: any) => void;
  onPointerOut: (e: any) => void;
}

export const BonesSystem: React.FC<SystemProps> = ({
  isSelected,
  isHovered,
  isFaded,
  onClick,
  onPointerOver,
  onPointerOut,
}) => {
  const groupRef = useRef<THREE.Group>(null);
  const scanLineRef = useRef<THREE.Mesh>(null);

  // Textures
  const boneTexture = useMemo(() => getBoneTexture(), []);
  const cartilageTexture = useMemo(() => getTendonTexture(), []);

  // Realistic ivory bone material
  const boneMat = useMemo(
    () =>
      new THREE.MeshStandardMaterial({
        map: boneTexture,
        color: new THREE.Color("#fbf7ee"),
        roughness: 0.38,
        metalness: 0.04,
        emissive: new THREE.Color("#0284c7"),
        emissiveIntensity: 0.0,
      }),
    [boneTexture]
  );

  // Pearlescent costal cartilage material
  const cartilageMat = useMemo(
    () =>
      new THREE.MeshStandardMaterial({
        map: cartilageTexture,
        color: new THREE.Color("#e2e8f0"),
        roughness: 0.25,
        transparent: true,
        opacity: 0.92,
      }),
    [cartilageTexture]
  );

  // Procedural Ribcage Curves (Left side of viewer / Model's right side, X < 0)
  const ribsData = useMemo(() => {
    const ribs: { curve: THREE.TubeGeometry; cartilage: THREE.TubeGeometry }[] = [];
    const ribHeights = [0.49, 0.45, 0.41, 0.37, 0.33, 0.29, 0.25, 0.21, 0.17];
    const ribWidths = [0.12, 0.15, 0.165, 0.162, 0.155, 0.145, 0.13, 0.11, 0.09];

    ribHeights.forEach((y, i) => {
      const w = ribWidths[i];
      // Bone rib curve from spine around to front
      const ribCurve = new THREE.QuadraticBezierCurve3(
        new THREE.Vector3(0, y, -0.05),
        new THREE.Vector3(-w, y - 0.01, -0.01),
        new THREE.Vector3(-w * 0.55, y - 0.025, 0.055)
      );
      // Cartilage extension connecting to sternum
      const cartCurve = new THREE.QuadraticBezierCurve3(
        new THREE.Vector3(-w * 0.55, y - 0.025, 0.055),
        new THREE.Vector3(-w * 0.2, y - 0.03, 0.065),
        new THREE.Vector3(0, y - 0.035, 0.068)
      );

      ribs.push({
        curve: new THREE.TubeGeometry(ribCurve, 18, 0.0075, 8, false),
        cartilage: new THREE.TubeGeometry(cartCurve, 12, 0.0065, 8, false),
      });
    });
    return ribs;
  }, []);

  // Vertebrae segments (Spine)
  const vertebrae = useMemo(() => {
    const segments = [];
    for (let y = 0.62; y >= 0.02; y -= 0.026) {
      segments.push(y);
    }
    return segments;
  }, []);

  // Pulse & Scan Animation
  useFrame((state) => {
    const time = state.clock.getElapsedTime();
    if (isSelected) {
      const pulse = Math.sin(time * 3.5) * 0.25 + 0.75;
      boneMat.emissiveIntensity = 0.45 * pulse;
      if (scanLineRef.current) {
        scanLineRef.current.position.y = -0.42 + Math.sin(time * 2.5) * 0.35;
        scanLineRef.current.visible = true;
      }
    } else if (isHovered) {
      boneMat.emissiveIntensity = 0.3;
      if (scanLineRef.current) scanLineRef.current.visible = false;
    } else if (isFaded) {
      boneMat.emissiveIntensity = 0.0;
      if (scanLineRef.current) scanLineRef.current.visible = false;
    } else {
      boneMat.emissiveIntensity = 0.0;
      if (scanLineRef.current) scanLineRef.current.visible = false;
    }
  });

  return (
    <group
      ref={groupRef}
      name="SkeletalSystem"
      onClick={onClick}
      onPointerOver={onPointerOver}
      onPointerOut={onPointerOut}
    >
      {/* Active Scan Laser Beam on Knee / Bones when selected */}
      <mesh ref={scanLineRef} rotation={[Math.PI / 2, 0, 0]} visible={false}>
        <ringGeometry args={[0.02, 0.25, 36]} />
        <meshBasicMaterial
          color="#38bdf8"
          side={THREE.DoubleSide}
          transparent={true}
          opacity={0.7}
          blending={THREE.AdditiveBlending}
        />
      </mesh>

      {/* ---------------- 1. SKULL / CRANIUM (Left half X < 0) ---------------- */}
      <group position={[-0.005, 0.74, 0]}>
        {/* Cranial vault half */}
        <mesh position={[-0.04, 0.02, -0.012]} material={boneMat} scale={[0.85, 1.05, 1.05]}>
          <sphereGeometry args={[0.076, 20, 16]} />
        </mesh>
        {/* Orbital Eye Socket */}
        <mesh position={[-0.038, -0.015, 0.048]} material={boneMat} rotation={[0, 0.1, 0]}>
          <torusGeometry args={[0.018, 0.0055, 12, 24]} />
        </mesh>
        {/* Zygomatic cheekbone arch */}
        <mesh position={[-0.046, -0.03, 0.038]} material={boneMat} rotation={[0.2, -0.1, 0]}>
          <capsuleGeometry args={[0.007, 0.038, 8, 12]} />
        </mesh>
        {/* Nasal bone half */}
        <mesh position={[-0.01, -0.025, 0.062]} material={boneMat} rotation={[0.25, 0, 0]}>
          <capsuleGeometry args={[0.005, 0.026, 6, 10]} />
        </mesh>
        {/* Maxilla & Upper Teeth half */}
        <mesh position={[-0.022, -0.055, 0.048]} material={boneMat} scale={[0.9, 0.75, 1.0]}>
          <boxGeometry args={[0.038, 0.018, 0.035]} />
        </mesh>
        {/* Mandible Jawbone half */}
        <mesh position={[-0.026, -0.082, 0.032]} material={boneMat} rotation={[0.15, -0.08, 0]}>
          <capsuleGeometry args={[0.009, 0.045, 8, 12]} />
        </mesh>
      </group>

      {/* ---------------- 2. SPINE / VERTEBRAL COLUMN ---------------- */}
      {vertebrae.map((y, idx) => (
        <mesh
          key={idx}
          position={[0, y, -0.028 - (y > 0.4 ? 0.015 : 0)]}
          material={boneMat}
          scale={[1.1, 0.82, 1.0]}
        >
          <cylinderGeometry args={[0.014, 0.015, 0.018, 12]} />
        </mesh>
      ))}

      {/* ---------------- 3. THORAX / RIBS & STERNUM (Left side) ---------------- */}
      {/* Sternum (Chest bone center) */}
      <mesh position={[0, 0.38, 0.068]} material={boneMat} scale={[0.55, 1.0, 0.4]}>
        <capsuleGeometry args={[0.018, 0.17, 8, 12]} />
      </mesh>
      {/* Sternal angle / Manubrium */}
      <mesh position={[0, 0.485, 0.06]} material={boneMat} scale={[0.8, 0.6, 0.4]}>
        <boxGeometry args={[0.035, 0.035, 0.018]} />
      </mesh>

      {/* Clavicle (Collar bone) */}
      <mesh
        position={[-0.085, 0.518, 0.025]}
        rotation={[0.05, 0.1, -0.12]}
        material={boneMat}
      >
        <capsuleGeometry args={[0.0095, 0.135, 8, 12]} />
      </mesh>

      {/* Scapula (Shoulder blade back) */}
      <mesh
        position={[-0.105, 0.44, -0.048]}
        rotation={[0.1, -0.15, 0.2]}
        material={boneMat}
        scale={[1.1, 1.3, 0.35]}
      >
        <boxGeometry args={[0.065, 0.09, 0.012]} />
      </mesh>

      {/* Rib Arches with Costal Cartilages */}
      {ribsData.map((rib, idx) => (
        <group key={`rib-${idx}`}>
          <mesh geometry={rib.curve} material={boneMat} />
          <mesh geometry={rib.cartilage} material={cartilageMat} />
        </group>
      ))}

      {/* ---------------- 4. PELVIS (Left side) ---------------- */}
      <group position={[0, 0.04, 0]}>
        {/* Iliac crest wing */}
        <mesh
          position={[-0.088, 0.025, 0.005]}
          rotation={[0.1, 0.25, 0.22]}
          material={boneMat}
          scale={[1.25, 0.95, 0.65]}
        >
          <sphereGeometry args={[0.054, 18, 14]} />
        </mesh>
        {/* Pubis and Ischium loop */}
        <mesh
          position={[-0.042, -0.045, 0.025]}
          rotation={[-0.2, 0.1, 0.1]}
          material={boneMat}
        >
          <torusGeometry args={[0.022, 0.007, 10, 16]} />
        </mesh>
        {/* Acetabulum (Hip Socket) */}
        <mesh position={[-0.092, -0.03, 0.01]} material={boneMat}>
          <sphereGeometry args={[0.022, 12, 10]} />
        </mesh>
      </group>

      {/* ---------------- 5. LEFT ARM BONES (Viewer's Left / Body's Right) ---------------- */}
      <group position={[-0.175, 0.505, 0]}>
        {/* Shoulder Joint Ball */}
        <mesh position={[0, 0, 0]} material={boneMat}>
          <sphereGeometry args={[0.022, 16, 14]} />
        </mesh>

        {/* Humerus (Upper arm bone) */}
        <mesh position={[-0.045, -0.12, 0]} rotation={[0, 0, 0.28]} material={boneMat}>
          <cylinderGeometry args={[0.0135, 0.015, 0.24, 14]} />
        </mesh>
        {/* Distal Humerus Condyles (Elbow joint) */}
        <mesh position={[-0.082, -0.245, 0]} rotation={[0, 0, 0.28]} material={boneMat}>
          <capsuleGeometry args={[0.017, 0.022, 8, 12]} />
        </mesh>

        {/* Forearm (Radius & Ulna) */}
        <group position={[-0.082, -0.245, 0]} rotation={[0, 0, 0.15]}>
          {/* Radius bone */}
          <mesh position={[-0.025, -0.12, 0.008]} material={boneMat}>
            <cylinderGeometry args={[0.009, 0.011, 0.22, 12]} />
          </mesh>
          {/* Ulna bone */}
          <mesh position={[-0.005, -0.12, -0.008]} material={boneMat}>
            <cylinderGeometry args={[0.01, 0.008, 0.23, 12]} />
          </mesh>
          {/* Wrist Carpals */}
          <mesh position={[-0.015, -0.235, 0]} material={boneMat} scale={[1.2, 0.7, 0.9]}>
            <boxGeometry args={[0.032, 0.018, 0.02]} />
          </mesh>
          {/* Hand Metacarpals & Phalanges */}
          <mesh position={[-0.018, -0.3, 0.005]} material={boneMat} scale={[1.1, 1.4, 0.5]}>
            <capsuleGeometry args={[0.012, 0.07, 8, 12]} />
          </mesh>
        </group>
      </group>

      {/* ---------------- 6. LEFT LEG BONES (Femur, Knee, Tibia/Fibula, Foot) ---------------- */}
      <group position={[-0.105, -0.02, 0]}>
        {/* Femoral Head (Ball in hip socket) */}
        <mesh position={[0.015, 0, 0.01]} material={boneMat}>
          <sphereGeometry args={[0.021, 14, 12]} />
        </mesh>
        {/* Greater Trochanter */}
        <mesh position={[-0.022, -0.018, 0]} material={boneMat}>
          <boxGeometry args={[0.022, 0.025, 0.025]} />
        </mesh>
        {/* Femur Shaft */}
        <mesh position={[-0.008, -0.19, 0.005]} rotation={[0, 0, -0.04]} material={boneMat}>
          <cylinderGeometry args={[0.018, 0.019, 0.35, 16]} />
        </mesh>

        {/* Distal Femur Condyles (Knee top) */}
        <mesh position={[-0.015, -0.37, 0]} material={boneMat}>
          <capsuleGeometry args={[0.024, 0.028, 10, 14]} />
        </mesh>

        {/* Patella (Kneecap) */}
        <mesh position={[-0.015, -0.375, 0.028]} material={boneMat} scale={[1.0, 1.15, 0.6]}>
          <sphereGeometry args={[0.017, 14, 12]} />
        </mesh>

        {/* Meniscus / Joint Cartilage Cushion */}
        <mesh position={[-0.015, -0.395, 0]} material={cartilageMat} scale={[1.2, 0.4, 1.1]}>
          <cylinderGeometry args={[0.026, 0.026, 0.015, 16]} />
        </mesh>

        {/* Lower Leg (Tibia & Fibula) */}
        <group position={[-0.015, -0.4, 0]}>
          {/* Tibia (Main weight-bearing shin bone) */}
          <mesh position={[0.005, -0.18, 0.005]} material={boneMat}>
            <cylinderGeometry args={[0.02, 0.016, 0.34, 16]} />
          </mesh>
          {/* Fibula (Slender lateral bone) */}
          <mesh position={[-0.028, -0.18, -0.005]} material={boneMat}>
            <cylinderGeometry args={[0.0075, 0.007, 0.33, 12]} />
          </mesh>
          {/* Ankle Malleoli */}
          <mesh position={[-0.008, -0.355, 0]} material={boneMat}>
            <capsuleGeometry args={[0.02, 0.024, 8, 12]} />
          </mesh>

          {/* Foot Bones (Tarsals, Metatarsals, Phalanges) */}
          <group position={[0, -0.375, 0]}>
            {/* Calcaneus Heel */}
            <mesh position={[-0.005, -0.03, -0.045]} material={boneMat} scale={[0.9, 1.0, 1.3]}>
              <boxGeometry args={[0.028, 0.035, 0.045]} />
            </mesh>
            {/* Midfoot & Metatarsals */}
            <mesh
              position={[0, -0.04, 0.035]}
              rotation={[Math.PI / 2, 0, 0]}
              material={boneMat}
              scale={[1.1, 0.75, 1.0]}
            >
              <capsuleGeometry args={[0.016, 0.065, 8, 12]} />
            </mesh>
            {/* Toes / Phalanges */}
            <mesh
              position={[0.002, -0.05, 0.1]}
              rotation={[Math.PI / 2, 0, 0]}
              material={boneMat}
              scale={[1.2, 0.6, 1.0]}
            >
              <boxGeometry args={[0.04, 0.045, 0.014]} />
            </mesh>
          </group>
        </group>
      </group>
    </group>
  );
};

import React, { useMemo, useRef } from "react";
import * as THREE from "three";
import { useFrame } from "@react-three/fiber";
import { getMuscleTexture, getTendonTexture } from "./textures";

interface SystemProps {
  isSelected: boolean;
  isHovered: boolean;
  isFaded: boolean;
  onClick: (e: any) => void;
  onPointerOver: (e: any) => void;
  onPointerOut: (e: any) => void;
}

export const MusclesSystem: React.FC<SystemProps> = ({
  isSelected,
  isHovered,
  isFaded,
  onClick,
  onPointerOver,
  onPointerOut,
}) => {
  const groupRef = useRef<THREE.Group>(null);
  const breathGroupRef = useRef<THREE.Group>(null);
  const scanLineRef = useRef<THREE.Mesh>(null);

  // Textures
  const muscleTexture = useMemo(() => getMuscleTexture(), []);
  const tendonTexture = useMemo(() => getTendonTexture(), []);

  // Striated deep crimson muscle material
  const muscleMat = useMemo(
    () =>
      new THREE.MeshStandardMaterial({
        map: muscleTexture,
        color: new THREE.Color("#be185d"),
        roughness: 0.38,
        metalness: 0.08,
        emissive: new THREE.Color("#f97316"),
        emissiveIntensity: 0.0,
      }),
    [muscleTexture]
  );

  // Glistening white tendon & fascia material
  const tendonMat = useMemo(
    () =>
      new THREE.MeshStandardMaterial({
        map: tendonTexture,
        color: new THREE.Color("#f8fafc"),
        roughness: 0.22,
        metalness: 0.05,
      }),
    [tendonTexture]
  );

  useFrame((state) => {
    const time = state.clock.getElapsedTime();

    if (isSelected) {
      // Subtle muscular contraction and breath rhythm
      const breath = Math.sin(time * 3.0) * 0.015 + 1.0;
      if (breathGroupRef.current) {
        breathGroupRef.current.scale.set(breath, breath, breath);
      }
      const wave = Math.sin(time * 3.5) * 0.25 + 0.75;
      muscleMat.emissiveIntensity = 0.5 * wave;
      if (scanLineRef.current) {
        scanLineRef.current.position.y = -0.22 + Math.sin(time * 2.5) * 0.35;
        scanLineRef.current.visible = true;
      }
    } else if (isHovered) {
      muscleMat.emissiveIntensity = 0.35;
      if (scanLineRef.current) scanLineRef.current.visible = false;
      if (breathGroupRef.current) breathGroupRef.current.scale.set(1, 1, 1);
    } else if (isFaded) {
      muscleMat.emissiveIntensity = 0.0;
      if (scanLineRef.current) scanLineRef.current.visible = false;
      if (breathGroupRef.current) breathGroupRef.current.scale.set(1, 1, 1);
    } else {
      muscleMat.emissiveIntensity = 0.0;
      if (scanLineRef.current) scanLineRef.current.visible = false;
      if (breathGroupRef.current) breathGroupRef.current.scale.set(1, 1, 1);
    }
  });

  return (
    <group
      ref={groupRef}
      name="MuscularSystem"
      onClick={onClick}
      onPointerOver={onPointerOver}
      onPointerOut={onPointerOut}
    >
      {/* Scanner laser on quadriceps / thigh when muscles selected */}
      <mesh ref={scanLineRef} rotation={[Math.PI / 2, 0, 0]} visible={false}>
        <ringGeometry args={[0.02, 0.25, 36]} />
        <meshBasicMaterial
          color="#f97316"
          side={THREE.DoubleSide}
          transparent={true}
          opacity={0.7}
          blending={THREE.AdditiveBlending}
        />
      </mesh>

      <group ref={breathGroupRef}>
        {/* ---------------- 1. NECK & TRAPEZIUS (Right side X > 0) ---------------- */}
        <group position={[0.035, 0.6, 0]}>
          {/* Sternocleidomastoid muscle */}
          <mesh
            position={[0.012, 0.015, 0.022]}
            rotation={[-0.2, 0.15, -0.25]}
            material={muscleMat}
          >
            <capsuleGeometry args={[0.014, 0.11, 8, 14]} />
          </mesh>
          {/* Trapezius ridge */}
          <mesh
            position={[0.045, -0.015, -0.025]}
            rotation={[0.1, -0.2, 0.4]}
            material={muscleMat}
            scale={[1.1, 0.9, 0.8]}
          >
            <capsuleGeometry args={[0.02, 0.1, 8, 12]} />
          </mesh>
        </group>

        {/* ---------------- 2. TORSO MUSCLES (Pectoralis, Abs, Obliques) ---------------- */}
        <group position={[0, 0, 0]}>
          {/* Pectoralis Major (Chest muscle fan) */}
          <mesh
            position={[0.078, 0.435, 0.065]}
            rotation={[0.08, -0.15, -0.12]}
            material={muscleMat}
            scale={[1.25, 0.95, 0.7]}
          >
            <sphereGeometry args={[0.072, 22, 16]} />
          </mesh>
          {/* Tendinous insertion of pec into arm */}
          <mesh
            position={[0.13, 0.45, 0.04]}
            rotation={[0, 0, -0.3]}
            material={tendonMat}
            scale={[0.8, 0.3, 0.5]}
          >
            <boxGeometry args={[0.04, 0.015, 0.02]} />
          </mesh>

          {/* Serratus Anterior (Rib muscle slips) */}
          {[0.36, 0.31, 0.26].map((y, i) => (
            <mesh
              key={`serratus-${i}`}
              position={[0.138 - i * 0.008, y, 0.02]}
              rotation={[0.1, -0.35, -0.2]}
              material={muscleMat}
            >
              <capsuleGeometry args={[0.009, 0.04, 6, 10]} />
            </mesh>
          ))}

          {/* Rectus Abdominis (6-Pack muscle segments on X > 0) */}
          {/* Upper Ab */}
          <mesh
            position={[0.038, 0.32, 0.07]}
            material={muscleMat}
            scale={[1.05, 0.9, 0.55]}
          >
            <boxGeometry args={[0.06, 0.062, 0.03]} />
          </mesh>
          {/* Mid Ab */}
          <mesh
            position={[0.038, 0.245, 0.068]}
            material={muscleMat}
            scale={[1.02, 0.9, 0.55]}
          >
            <boxGeometry args={[0.058, 0.062, 0.03]} />
          </mesh>
          {/* Lower Ab */}
          <mesh
            position={[0.036, 0.17, 0.064]}
            material={muscleMat}
            scale={[0.95, 0.9, 0.55]}
          >
            <boxGeometry args={[0.054, 0.062, 0.03]} />
          </mesh>

          {/* Tendinous Intersections (White connective lines separating abs) */}
          {[0.355, 0.282, 0.208, 0.135].map((y, idx) => (
            <mesh
              key={`ab-tendon-${idx}`}
              position={[0.038, y, 0.072]}
              material={tendonMat}
              scale={[1.0, 0.4, 0.4]}
            >
              <boxGeometry args={[0.065, 0.008, 0.015]} />
            </mesh>
          ))}

          {/* Linea Alba (White vertical center tendon dividing the body at midline) */}
          <mesh position={[0.002, 0.24, 0.072]} material={tendonMat}>
            <boxGeometry args={[0.006, 0.26, 0.015]} />
          </mesh>

          {/* External Abdominal Obliques (Waist contour) */}
          <mesh
            position={[0.118, 0.21, 0.028]}
            rotation={[0, 0.2, -0.1]}
            material={muscleMat}
            scale={[0.9, 1.35, 0.7]}
          >
            <capsuleGeometry args={[0.035, 0.12, 10, 14]} />
          </mesh>

          {/* Lower Abdominal V-taper / Inguinal ligament */}
          <mesh
            position={[0.045, 0.075, 0.05]}
            rotation={[0, 0, -0.45]}
            material={tendonMat}
          >
            <capsuleGeometry args={[0.006, 0.09, 6, 10]} />
          </mesh>
        </group>

        {/* ---------------- 3. RIGHT ARM MUSCLES (Viewer's Right X > 0) ---------------- */}
        <group position={[0.175, 0.505, 0]}>
          {/* Deltoid Muscle (Shoulder cap) */}
          <mesh
            position={[0.035, -0.025, 0.005]}
            rotation={[0.1, 0, -0.22]}
            material={muscleMat}
            scale={[1.0, 1.25, 1.05]}
          >
            <sphereGeometry args={[0.055, 18, 16]} />
          </mesh>

          {/* Biceps Brachii (Upper arm front) */}
          <mesh
            position={[0.052, -0.12, 0.018]}
            rotation={[0, 0, -0.28]}
            material={muscleMat}
            scale={[0.9, 1.25, 0.9]}
          >
            <capsuleGeometry args={[0.028, 0.14, 12, 16]} />
          </mesh>
          {/* Biceps Tendon insertion */}
          <mesh
            position={[0.078, -0.225, 0.01]}
            rotation={[0, 0, -0.28]}
            material={tendonMat}
          >
            <cylinderGeometry args={[0.007, 0.008, 0.05, 8]} />
          </mesh>

          {/* Triceps (Upper arm back) */}
          <mesh
            position={[0.048, -0.125, -0.02]}
            rotation={[0, 0, -0.28]}
            material={muscleMat}
            scale={[0.95, 1.2, 0.85]}
          >
            <capsuleGeometry args={[0.026, 0.13, 10, 14]} />
          </mesh>

          {/* Forearm (Brachioradialis, flexors, and extensors) */}
          <group position={[0.082, -0.245, 0]} rotation={[0, 0, -0.15]}>
            {/* Brachioradialis (Upper forearm muscle bulge) */}
            <mesh position={[0.022, -0.09, 0.012]} material={muscleMat} scale={[1.1, 1.3, 0.95]}>
              <capsuleGeometry args={[0.024, 0.12, 12, 14]} />
            </mesh>
            {/* Forearm flexor bellies */}
            <mesh position={[0.008, -0.12, -0.008]} material={muscleMat}>
              <capsuleGeometry args={[0.018, 0.11, 10, 12]} />
            </mesh>
            {/* Wrist Flexor Tendons */}
            <mesh position={[0.012, -0.21, 0]} material={tendonMat} scale={[1.1, 0.8, 0.7]}>
              <boxGeometry args={[0.028, 0.045, 0.016]} />
            </mesh>
            {/* Hand Thenar muscles (Palm cushion) */}
            <mesh position={[0.015, -0.275, 0.008]} material={muscleMat} scale={[1.1, 1.2, 0.6]}>
              <sphereGeometry args={[0.022, 14, 12]} />
            </mesh>
            {/* Finger Tendons */}
            <mesh position={[0.016, -0.32, 0.005]} material={tendonMat} scale={[1.0, 1.4, 0.4]}>
              <capsuleGeometry args={[0.012, 0.05, 8, 10]} />
            </mesh>
          </group>
        </group>

        {/* ---------------- 4. RIGHT HIP & PELVIS MUSCLES ---------------- */}
        <group position={[0.092, 0.03, 0]}>
          {/* Gluteus medius & Tensor Fasciae Latae */}
          <mesh
            position={[0.032, -0.015, -0.01]}
            rotation={[0.1, -0.2, -0.15]}
            material={muscleMat}
            scale={[1.1, 1.15, 0.9]}
          >
            <sphereGeometry args={[0.052, 16, 14]} />
          </mesh>
          {/* Adductor longus & Pectineus */}
          <mesh
            position={[-0.032, -0.038, 0.02]}
            rotation={[0, 0, 0.25]}
            material={muscleMat}
          >
            <capsuleGeometry args={[0.018, 0.065, 8, 12]} />
          </mesh>
        </group>

        {/* ---------------- 5. RIGHT LEG MUSCLES (Quads, Calves, Tendons) ---------------- */}
        <group position={[0.105, -0.02, 0]}>
          {/* Rectus Femoris (Central powerful quad muscle) */}
          <mesh
            position={[0.008, -0.175, 0.035]}
            rotation={[-0.05, 0, 0.03]}
            material={muscleMat}
            scale={[0.95, 1.35, 0.95]}
          >
            <capsuleGeometry args={[0.032, 0.17, 14, 16]} />
          </mesh>

          {/* Vastus Lateralis (Outer quad muscle bulge) */}
          <mesh
            position={[0.045, -0.165, 0.012]}
            rotation={[0, 0, -0.08]}
            material={muscleMat}
            scale={[1.1, 1.35, 0.95]}
          >
            <capsuleGeometry args={[0.034, 0.18, 14, 16]} />
          </mesh>

          {/* Vastus Medialis (Inner teardrop muscle above knee) */}
          <mesh
            position={[-0.028, -0.24, 0.028]}
            rotation={[0.1, 0, 0.18]}
            material={muscleMat}
            scale={[1.05, 1.2, 1.0]}
          >
            <sphereGeometry args={[0.032, 16, 14]} />
          </mesh>

          {/* Hamstring muscles (Back of thigh) */}
          <mesh
            position={[0.012, -0.17, -0.03]}
            material={muscleMat}
            scale={[1.0, 1.3, 0.95]}
          >
            <capsuleGeometry args={[0.036, 0.19, 12, 14]} />
          </mesh>

          {/* Quadriceps Tendon (Broad white tendon band crossing the knee) */}
          <mesh position={[0.006, -0.34, 0.032]} material={tendonMat}>
            <boxGeometry args={[0.042, 0.06, 0.012]} />
          </mesh>

          {/* Patellar Ligament (Connecting kneecap to tibia) */}
          <mesh position={[0.006, -0.405, 0.028]} material={tendonMat}>
            <cylinderGeometry args={[0.012, 0.014, 0.06, 10]} />
          </mesh>

          {/* Lower Leg (Gastrocnemius calf bellies, Soleus, Tibialis anterior) */}
          <group position={[0.012, -0.4, 0]}>
            {/* Gastrocnemius Medial Head (Inner teardrop calf belly) */}
            <mesh
              position={[-0.018, -0.11, -0.024]}
              material={muscleMat}
              scale={[0.95, 1.25, 1.05]}
            >
              <sphereGeometry args={[0.032, 16, 14]} />
            </mesh>
            {/* Gastrocnemius Lateral Head (Outer calf belly) */}
            <mesh
              position={[0.024, -0.105, -0.022]}
              material={muscleMat}
              scale={[0.95, 1.2, 1.0]}
            >
              <sphereGeometry args={[0.03, 16, 14]} />
            </mesh>

            {/* Soleus muscle */}
            <mesh position={[0.005, -0.17, -0.018]} material={muscleMat}>
              <capsuleGeometry args={[0.024, 0.13, 12, 14]} />
            </mesh>

            {/* Tibialis Anterior (Front shin muscle) */}
            <mesh position={[-0.01, -0.14, 0.022]} material={muscleMat}>
              <capsuleGeometry args={[0.018, 0.17, 10, 12]} />
            </mesh>

            {/* Achilles Tendon (Thick white tendon cord inserting into heel) */}
            <mesh position={[0.005, -0.275, -0.03]} material={tendonMat}>
              <cylinderGeometry args={[0.009, 0.012, 0.12, 10]} />
            </mesh>

            {/* Foot Extensor Tendons & Dorsal Muscles */}
            <group position={[0, -0.375, 0]}>
              <mesh
                position={[0.002, -0.042, 0.04]}
                rotation={[Math.PI / 2, 0, 0]}
                material={tendonMat}
                scale={[1.1, 0.8, 1.0]}
              >
                <capsuleGeometry args={[0.018, 0.07, 8, 12]} />
              </mesh>
              {/* Toe flexors & tendons */}
              <mesh
                position={[0.002, -0.052, 0.105]}
                rotation={[Math.PI / 2, 0, 0]}
                material={tendonMat}
                scale={[1.2, 0.65, 1.0]}
              >
                <boxGeometry args={[0.042, 0.048, 0.014]} />
              </mesh>
            </group>
          </group>
        </group>
      </group>
    </group>
  );
};

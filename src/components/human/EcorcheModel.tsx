import React, { useMemo, useRef, useEffect } from "react";
import * as THREE from "three";
import { useFrame } from "@react-three/fiber";
import { useGLTF } from "@react-three/drei";
import type { SystemId } from "./internal/system-data";
import { getBrainTexture, getIrisTexture } from "./internal/textures";
import type { HealthMetrics } from "../../../health-data";

useGLTF.preload("/models/skeleton.glb");
useGLTF.preload("/models/anatomy.glb");

export type ViewMode = "split" | "muscles" | "skeleton" | "layered";

export interface EcorcheModelProps {
  selectedSystem?: SystemId | null;
  hoveredSystem?: SystemId | null;
  viewMode?: ViewMode;
  onSelectSystem?: (id: SystemId | null) => void;
  onHoverSystem?: (id: SystemId | null) => void;
  disableFloat?: boolean;
  healthValues?: HealthMetrics | null;
}

export const EcorcheModel: React.FC<EcorcheModelProps> = ({
  selectedSystem = null,
  hoveredSystem = null,
  viewMode = "split",
  onSelectSystem,
  onHoverSystem,
  disableFloat = false,
  healthValues = null,
}) => {
  const groupRef = useRef<THREE.Group>(null);
  const breathGroupRef = useRef<THREE.Group>(null);
  const brainPulseRef = useRef<THREE.Group>(null);
  const eyeGlobeRef = useRef<THREE.Group>(null);
  const eyeReticleRef = useRef<THREE.Mesh>(null);

  // Smooth real-time animated health metrics for interval changes
  const animatedHealth = useRef<{
    eye: number;
    muscle: number;
    bones: number;
    brain: number;
  }>({
    eye: healthValues ? healthValues.eye : 100,
    muscle: healthValues ? healthValues.muscle : 100,
    bones: healthValues ? healthValues.bones : 100,
    brain: healthValues ? healthValues.brain : 100,
  });

  const skeletonGLTF = useGLTF("/models/skeleton.glb");
  const anatomyGLTF = useGLTF("/models/anatomy.glb");

  // Sagittal Split Planes in World Space:
  // skeletonClipPlane: normal [-1, 0, 0] -> keeps x <= 0.002 (left side: skeleton)
  // muscleClipPlane: normal [1, 0, 0] -> keeps x >= -0.002 (right side: musculature)
  const skeletonClipPlane = useMemo(
    () => new THREE.Plane(new THREE.Vector3(-1, 0, 0), 0.002),
    []
  );
  const muscleClipPlane = useMemo(
    () => new THREE.Plane(new THREE.Vector3(1, 0, 0), 0.002),
    []
  );

  const brainTexture = useMemo(() => getBrainTexture(), []);
  const irisTexture = useMemo(() => getIrisTexture(), []);

  const materials = useRef<{
    boneMat: THREE.MeshStandardMaterial;
    skullCapMat: THREE.MeshPhysicalMaterial;
    muscleMat: THREE.MeshStandardMaterial;
    tendonMat: THREE.MeshStandardMaterial;
    brainMat: THREE.MeshStandardMaterial;
    irisMat: THREE.MeshStandardMaterial;
  } | null>(null);

  if (!materials.current) {
    materials.current = {
      boneMat: new THREE.MeshStandardMaterial({
        color: new THREE.Color("#fbf7ee"),
        roughness: 0.38,
        metalness: 0.02,
        side: THREE.DoubleSide,
        clippingPlanes: viewMode === "split" ? [skeletonClipPlane] : [],
        clipShadows: true,
        emissive: new THREE.Color("#fbbf24"),
        emissiveIntensity: 0.0,
      }),
      // Anatomical translucent calvarial skull window revealing the brain clearly inside the skull
      skullCapMat: new THREE.MeshPhysicalMaterial({
        color: new THREE.Color("#fbf7ee"),
        roughness: 0.28,
        metalness: 0.05,
        transmission: 0.82,
        transparent: true,
        opacity: 0.28,
        side: THREE.DoubleSide,
        clippingPlanes: viewMode === "split" ? [skeletonClipPlane] : [],
        clipShadows: true,
        emissive: new THREE.Color("#fbbf24"),
        emissiveIntensity: 0.0,
      }),
      muscleMat: new THREE.MeshStandardMaterial({
        color: new THREE.Color("#c02626"),
        roughness: 0.38,
        metalness: 0.02,
        side: THREE.DoubleSide,
        clippingPlanes: viewMode === "split" ? [muscleClipPlane] : [],
        clipShadows: true,
        emissive: new THREE.Color("#f43f5e"),
        emissiveIntensity: 0.0,
      }),
      tendonMat: new THREE.MeshStandardMaterial({
        color: new THREE.Color("#f8fafc"),
        roughness: 0.26,
        metalness: 0.03,
        side: THREE.DoubleSide,
        clippingPlanes: viewMode === "split" ? [muscleClipPlane] : [],
        clipShadows: true,
        emissive: new THREE.Color("#f43f5e"),
        emissiveIntensity: 0.0,
      }),
      brainMat: new THREE.MeshStandardMaterial({
        map: brainTexture,
        color: new THREE.Color("#fca5a5"),
        roughness: 0.30,
        metalness: 0.04,
        emissive: new THREE.Color("#ec4899"),
        emissiveIntensity: 0.06,
      }),
      irisMat: new THREE.MeshStandardMaterial({
        map: irisTexture,
        roughness: 0.06,
        metalness: 0.04,
        emissive: new THREE.Color("#0284c7"),
        emissiveIntensity: 0.0,
      }),
    };
  }

  const {
    boneMat,
    skullCapMat,
    muscleMat,
    tendonMat,
    brainMat,
    irisMat,
  } = materials.current;

  useEffect(() => {
    if (viewMode === "split") {
      boneMat.clippingPlanes = [skeletonClipPlane];
      skullCapMat.clippingPlanes = [skeletonClipPlane];
      muscleMat.clippingPlanes = [muscleClipPlane];
      tendonMat.clippingPlanes = [muscleClipPlane];
      boneMat.transparent = false;
      boneMat.opacity = 1.0;
      muscleMat.transparent = false;
      muscleMat.opacity = 1.0;
      tendonMat.transparent = false;
      tendonMat.opacity = 1.0;
    } else if (viewMode === "muscles") {
      boneMat.clippingPlanes = [];
      skullCapMat.clippingPlanes = [];
      muscleMat.clippingPlanes = [];
      tendonMat.clippingPlanes = [];
      muscleMat.transparent = false;
      muscleMat.opacity = 1.0;
      tendonMat.transparent = false;
      tendonMat.opacity = 1.0;
    } else if (viewMode === "skeleton") {
      boneMat.clippingPlanes = [];
      skullCapMat.clippingPlanes = [];
      muscleMat.clippingPlanes = [];
      tendonMat.clippingPlanes = [];
      boneMat.transparent = false;
      boneMat.opacity = 1.0;
    } else if (viewMode === "layered") {
      boneMat.clippingPlanes = [];
      skullCapMat.clippingPlanes = [];
      muscleMat.clippingPlanes = [];
      tendonMat.clippingPlanes = [];
      boneMat.transparent = false;
      boneMat.opacity = 1.0;
      muscleMat.transparent = true;
      muscleMat.opacity = 0.58;
      tendonMat.transparent = true;
      tendonMat.opacity = 0.58;
    }
    boneMat.needsUpdate = true;
    skullCapMat.needsUpdate = true;
    muscleMat.needsUpdate = true;
    tendonMat.needsUpdate = true;
  }, [viewMode, skeletonClipPlane, muscleClipPlane, boneMat, skullCapMat, muscleMat, tendonMat]);

  const skeletonScene = useMemo(() => {
    const clone = skeletonGLTF.scene.clone(true);
    clone.traverse((child: THREE.Object3D) => {
      if ((child as THREE.Mesh).isMesh) {
        const name = (child.name || "").toLowerCase();
        // Give parietal calvaria bone a translucent anatomical window to expose the brain inside
        const isParietal = name.includes("parietal");
        (child as THREE.Mesh).material = isParietal ? skullCapMat : boneMat;
        child.castShadow = true;
        child.receiveShadow = true;
      }
    });
    return clone;
  }, [skeletonGLTF.scene, boneMat, skullCapMat]);

  const anatomyScene = useMemo(() => {
    const clone = anatomyGLTF.scene.clone(true);
    clone.traverse((child: THREE.Object3D) => {
      if ((child as THREE.Mesh).isMesh) {
        const name = (child.name || "").toLowerCase();

        // Clear the closed eyelid mesh so the eyeball, iris, and cornea are 100% visible
        if (name.includes("palpebral_part_of_orbicularis_oculi")) {
          child.visible = false;
          return;
        }

        const isTendon =
          name.includes("tendon") ||
          name.includes("ligament") ||
          name.includes("aponeurosis") ||
          name.includes("retinaculum") ||
          name.includes("membrane") ||
          name.includes("fascia");

        (child as THREE.Mesh).material = isTendon ? tendonMat : muscleMat;
        child.castShadow = true;
        child.receiveShadow = true;
      }
    });
    return clone;
  }, [anatomyGLTF.scene, muscleMat, tendonMat]);

  const groundShadowTexture = useMemo(() => {
    const canvas = document.createElement("canvas");
    canvas.width = 256;
    canvas.height = 256;
    const ctx = canvas.getContext("2d")!;
    const grad = ctx.createRadialGradient(128, 128, 10, 128, 128, 120);
    grad.addColorStop(0, "rgba(15, 23, 42, 0.45)");
    grad.addColorStop(0.5, "rgba(30, 41, 59, 0.2)");
    grad.addColorStop(1, "rgba(0, 0, 0, 0)");
    ctx.fillStyle = grad;
    ctx.fillRect(0, 0, 256, 256);
    return new THREE.CanvasTexture(canvas);
  }, []);

  useFrame((state, delta) => {
    const time = state.clock.getElapsedTime();

    if (!disableFloat && groupRef.current) {
      groupRef.current.position.y = Math.sin(time * 0.8) * 0.006;
    }

    const isBonesActive = selectedSystem === "bones" || hoveredSystem === "bones";
    const isMusclesActive = selectedSystem === "muscles" || hoveredSystem === "muscles";
    const isBrainActive = selectedSystem === "brain" || hoveredSystem === "brain";
    const isEyesActive = selectedSystem === "eyes" || hoveredSystem === "eyes";

    const targetBone = healthValues ? healthValues.bones : 100;
    const targetMuscle = healthValues ? healthValues.muscle : 100;
    const targetBrain = healthValues ? healthValues.brain : 100;
    const targetEye = healthValues ? healthValues.eye : 100;

    // Smooth real-time animated lerp on interval changes so the user visibly watches degradation
    const lerpFactor = 1.0 - Math.exp(-delta * 5.0);
    animatedHealth.current.bones = THREE.MathUtils.lerp(
      animatedHealth.current.bones,
      targetBone,
      lerpFactor
    );
    animatedHealth.current.muscle = THREE.MathUtils.lerp(
      animatedHealth.current.muscle,
      targetMuscle,
      lerpFactor
    );
    animatedHealth.current.brain = THREE.MathUtils.lerp(
      animatedHealth.current.brain,
      targetBrain,
      lerpFactor
    );
    animatedHealth.current.eye = THREE.MathUtils.lerp(
      animatedHealth.current.eye,
      targetEye,
      lerpFactor
    );

    const boneVal = animatedHealth.current.bones;
    const muscleVal = animatedHealth.current.muscle;
    const brainVal = animatedHealth.current.brain;
    const eyeVal = animatedHealth.current.eye;

    const boneLoss = Math.max(0, 100 - boneVal);
    const muscleLoss = Math.max(0, 100 - muscleVal);
    const brainLoss = Math.max(0, 100 - brainVal);
    const eyeLoss = Math.max(0, 100 - eyeVal);

    // 1. SKELETAL SYSTEM (Bone Decalcification & Porosity)
    const normBoneLoss = Math.min(1.0, boneLoss / 5.0);
    if (isBonesActive) {
      boneMat.emissive.set("#fbbf24");
      boneMat.emissiveIntensity = 0.65 + Math.sin(time * 3.6) * 0.25;
      skullCapMat.emissive.set("#fbbf24");
      skullCapMat.emissiveIntensity = 0.45;
    } else if (normBoneLoss > 0.02) {
      boneMat.roughness = 0.38 + normBoneLoss * 0.32;
      boneMat.color.lerpColors(
        new THREE.Color("#fbf7ee"),
        new THREE.Color("#dcd4c4"),
        normBoneLoss
      );
      boneMat.emissive.set("#fbbf24");
      boneMat.emissiveIntensity =
        normBoneLoss * 0.35 * (0.8 + Math.sin(time * 2.0) * 0.2);

      skullCapMat.roughness = boneMat.roughness;
      skullCapMat.color.copy(boneMat.color);
      skullCapMat.emissive.set("#fbbf24");
      skullCapMat.emissiveIntensity = boneMat.emissiveIntensity * 0.6;
    } else {
      boneMat.roughness = 0.38;
      boneMat.color.set("#fbf7ee");
      boneMat.emissiveIntensity = 0.0;
      skullCapMat.roughness = 0.28;
      skullCapMat.color.set("#fbf7ee");
      skullCapMat.emissiveIntensity = 0.0;
    }

    // 2. MUSCULAR SYSTEM (Postural Atrophy - mass reduction & tone loss)
    const normMuscleLoss = Math.min(1.0, muscleLoss / 14.0);
    const atrophyScale = 1.0 - normMuscleLoss * 0.18;

    if (isMusclesActive) {
      const breath = 1.0 + Math.sin(time * 3.0) * 0.012;
      if (breathGroupRef.current) {
        breathGroupRef.current.scale.set(
          atrophyScale * breath,
          atrophyScale * breath,
          1.0
        );
      }
      muscleMat.emissive.set("#f43f5e");
      muscleMat.emissiveIntensity = 0.65 + Math.sin(time * 4.0) * 0.25;
      tendonMat.emissive.set("#f43f5e");
      tendonMat.emissiveIntensity = 0.35;
    } else {
      if (breathGroupRef.current) {
        breathGroupRef.current.scale.set(atrophyScale, atrophyScale, 1.0);
      }
      if (normMuscleLoss > 0.02) {
        muscleMat.color.lerpColors(
          new THREE.Color("#c02626"),
          new THREE.Color("#78350f"),
          normMuscleLoss * 0.85
        );
        muscleMat.roughness = 0.38 + normMuscleLoss * 0.24;
        muscleMat.emissive.set("#ea580c");
        muscleMat.emissiveIntensity =
          normMuscleLoss * 0.38 * (0.8 + Math.sin(time * 2.2) * 0.2);
        tendonMat.emissive.set("#ea580c");
        tendonMat.emissiveIntensity = normMuscleLoss * 0.15;
      } else {
        muscleMat.color.set("#c02626");
        muscleMat.roughness = 0.38;
        muscleMat.emissiveIntensity = 0.0;
        tendonMat.emissiveIntensity = 0.0;
      }
    }

    // 3. CENTRAL NERVOUS SYSTEM (Brain Cephalic Fluid Shift & ICP Pulsation)
    const normBrainLoss = Math.min(1.0, brainLoss / 4.0);
    const fluidShiftRate = 2.4 + normBrainLoss * 2.5;
    const icpWave = Math.sin(time * fluidShiftRate);
    const fluidExpansion = normBrainLoss * 0.055;
    const pulseDilation =
      fluidExpansion + icpWave * (0.015 + normBrainLoss * 0.025);

    if (brainPulseRef.current) {
      const s = 1.0 + pulseDilation;
      brainPulseRef.current.scale.set(s, s, s);
    }

    if (isBrainActive) {
      skullCapMat.opacity = 0.15;
      brainMat.emissive.set("#ec4899");
      brainMat.emissiveIntensity = 0.85 + icpWave * 0.28;
    } else {
      skullCapMat.opacity = 0.28;
      brainMat.emissive.set("#ec4899");
      brainMat.emissiveIntensity =
        0.06 + normBrainLoss * 0.38 * (0.85 + icpWave * 0.15);
    }

    // 4. VISUAL SYSTEM & SANS (Optic Disc Edema & Globe Flattening)
    const normEyeLoss = Math.min(1.0, eyeLoss / 5.0);

    if (eyeGlobeRef.current) {
      const flatZ = 1.0 - normEyeLoss * 0.10;
      const flatXY = 1.0 + normEyeLoss * 0.035;
      eyeGlobeRef.current.scale.set(flatXY, flatXY, flatZ);
    }

    if (isEyesActive) {
      irisMat.emissive.set("#0284c7");
      irisMat.emissiveIntensity = 0.80 + Math.sin(time * 4.0) * 0.25;
      if (eyeReticleRef.current) {
        eyeReticleRef.current.visible = true;
        eyeReticleRef.current.rotation.z = time * 2.2;
        const s = 1.0 + Math.sin(time * 3.0) * 0.06;
        eyeReticleRef.current.scale.set(s, s, s);
      }
    } else {
      irisMat.emissive.set("#0284c7");
      irisMat.emissiveIntensity =
        normEyeLoss > 0.02 ? normEyeLoss * 0.35 : 0.0;
      if (eyeReticleRef.current) {
        if (normEyeLoss > 0.05) {
          eyeReticleRef.current.visible = true;
          eyeReticleRef.current.rotation.z = time * 1.4;
          const s = 1.0 + Math.sin(time * 2.0) * 0.05;
          eyeReticleRef.current.scale.set(s, s, s);
        } else {
          eyeReticleRef.current.visible = false;
        }
      }
    }
  });

  const handleClick = (id: SystemId) => (e: { stopPropagation: () => void }) => {
    e.stopPropagation();
    onSelectSystem?.(selectedSystem === id ? null : id);
  };

  const handlePointerOver = (id: SystemId) => (e: { stopPropagation: () => void }) => {
    e.stopPropagation();
    document.body.style.cursor = "pointer";
    onHoverSystem?.(id);
  };

  const handlePointerOut = () => (e: { stopPropagation: () => void }) => {
    e.stopPropagation();
    document.body.style.cursor = "default";
    onHoverSystem?.(null);
  };

  return (
    <group ref={groupRef} name="PhotorealisticEcorcheAnatomy">
      {/* Ground Contact Shadow */}
      <mesh
        position={[0, -0.915, 0.02]}
        rotation={[-Math.PI / 2, 0, 0]}
        scale={[0.85, 0.45, 1.0]}
      >
        <planeGeometry args={[1.2, 1.2]} />
        <meshBasicMaterial
          map={groundShadowTexture}
          transparent={true}
          opacity={0.85}
          depthWrite={false}
        />
      </mesh>

      {/* Main 3D Skeleton & Muscle Anatomical Assemblies */}
      <group
        rotation={[-Math.PI / 2, 0, 0]}
        scale={[0.0010546, 0.0010546, 0.0010546]}
      >
        <group position={[0, 109.02, -782.9]}>
          {viewMode !== "muscles" && (
            <primitive
              object={skeletonScene}
              onClick={handleClick("bones")}
              onPointerOver={handlePointerOver("bones")}
              onPointerOut={handlePointerOut()}
            />
          )}

          {viewMode !== "skeleton" && (
            /* Centered Pivot Group: Scales radially inward around the torso center [0, -101, 763] */
            <group
              ref={breathGroupRef}
              position={[0, -101, 763]}
            >
              <primitive
                object={anatomyScene}
                position={[0, 101, -763]}
                onClick={handleClick("muscles")}
                onPointerOver={handlePointerOver("muscles")}
                onPointerOut={handlePointerOut()}
              />
            </group>
          )}
        </group>
      </group>

      {/* Anatomical Central Nervous System (Brain Vault: Cerebrum, Cerebellum, Brainstem) */}
      <group
        ref={brainPulseRef}
        position={[0.0, 0.816, -0.016]}
        onClick={handleClick("brain")}
        onPointerOver={handlePointerOver("brain")}
        onPointerOut={handlePointerOut()}
      >
        {/* Left Cerebral Hemisphere */}
        <mesh
          position={[0.021, 0.004, 0.002]}
          material={brainMat}
          scale={[1.0, 1.10, 1.30]}
        >
          <sphereGeometry args={[0.030, 28, 24]} />
        </mesh>

        {/* Right Cerebral Hemisphere */}
        <mesh
          position={[-0.021, 0.004, 0.002]}
          material={brainMat}
          scale={[1.0, 1.10, 1.30]}
        >
          <sphereGeometry args={[0.030, 28, 24]} />
        </mesh>

        {/* Cerebellum (Postero-inferior Bilateral Lobes) */}
        <mesh
          position={[0.016, -0.034, -0.028]}
          material={brainMat}
          scale={[1.1, 0.82, 0.95]}
        >
          <sphereGeometry args={[0.018, 22, 18]} />
        </mesh>
        <mesh
          position={[-0.016, -0.034, -0.028]}
          material={brainMat}
          scale={[1.1, 0.82, 0.95]}
        >
          <sphereGeometry args={[0.018, 22, 18]} />
        </mesh>

        {/* Brainstem (Pons & Medulla Oblongata) */}
        <mesh
          position={[0.0, -0.048, -0.015]}
          rotation={[0.1, 0, 0]}
          material={brainMat}
        >
          <cylinderGeometry args={[0.0085, 0.0065, 0.028, 18]} />
        </mesh>
      </group>

      {/* Anatomical Visual System & SANS Globe (Centered in right orbital socket) */}
      <group
        position={[0.0265, 0.776, 0.046]}
        onClick={handleClick("eyes")}
        onPointerOver={handlePointerOver("eyes")}
        onPointerOut={handlePointerOut()}
      >
        {/* SANS Diagnostic HUD Reticle */}
        <mesh ref={eyeReticleRef} position={[0, 0, 0.016]} visible={false}>
          <ringGeometry args={[0.014, 0.0165, 32]} />
          <meshBasicMaterial
            color="#38bdf8"
            side={THREE.DoubleSide}
            transparent={true}
            opacity={0.85}
          />
        </mesh>

        <group ref={eyeGlobeRef}>
          {/* Sclera (Eyeball Globe) */}
          <mesh>
            <sphereGeometry args={[0.0125, 28, 24]} />
            <meshStandardMaterial
              color="#f8fafc"
              roughness={0.10}
              metalness={0.02}
            />
          </mesh>

          {/* Iris */}
          <mesh position={[0, 0, 0.0114]} material={irisMat}>
            <circleGeometry args={[0.0064, 32]} />
          </mesh>

          {/* Refractive Transparent Cornea Dome */}
          <mesh position={[0, 0, 0.0118]}>
            <sphereGeometry
              args={[0.0070, 24, 20, 0, Math.PI * 2, 0, Math.PI / 2.2]}
            />
            <meshPhysicalMaterial
              roughness={0.02}
              transmission={0.96}
              transparent={true}
              opacity={0.35}
              ior={1.376}
            />
          </mesh>

          {/* Optic Nerve Sheath (Posterior Pole extending toward optic canal) */}
          <mesh position={[0, 0, -0.014]} rotation={[Math.PI / 2, 0, 0]}>
            <cylinderGeometry args={[0.0034, 0.0042, 0.018, 16]} />
            <meshStandardMaterial
              color="#fbcfe8"
              roughness={0.4}
              metalness={0.02}
            />
          </mesh>
        </group>
      </group>
    </group>
  );
};

export default EcorcheModel;

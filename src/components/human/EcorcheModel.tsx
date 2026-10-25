import React, { useMemo, useRef, useEffect } from "react";
import * as THREE from "three";
import { useFrame } from "@react-three/fiber";
import { useGLTF } from "@react-three/drei";
import type { SystemId } from "./internal/system-data";
import {
  getBrainTexture,
  getIrisTexture,
  getScleraTexture,
} from "./internal/textures";
import type { HealthMetrics } from "../../../health-data";

useGLTF.preload("/models/skeleton.glb");
useGLTF.preload("/models/anatomy.glb");
useGLTF.preload("/models/brain.glb");

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
  hoveredSystem: _hoveredSystem = null,
  viewMode = "split",
  onSelectSystem,
  onHoverSystem,
  disableFloat = false,
  healthValues = null,
}) => {
  const groupRef = useRef<THREE.Group>(null);
  const brainPulseRef = useRef<THREE.Group>(null);
  const brainRingRef = useRef<THREE.Mesh>(null);
  const eyeGlobeRef = useRef<THREE.Group>(null);
  const eyeReticleRef = useRef<THREE.Group>(null);
  const opticNerveRef = useRef<THREE.Group>(null);

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
  const brainGLTF = useGLTF("/models/brain.glb");

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
  const scleraTexture = useMemo(() => getScleraTexture(), []);

  const materials = useRef<{
    boneMat: THREE.MeshStandardMaterial;
    skullCapMat: THREE.MeshPhysicalMaterial;
    muscleMat: THREE.MeshStandardMaterial;
    tendonMat: THREE.MeshStandardMaterial;
    cortexMat: THREE.MeshStandardMaterial;
    arteryMat: THREE.MeshStandardMaterial;
    cerebellumMat: THREE.MeshStandardMaterial;
    stemMat: THREE.MeshStandardMaterial;
    nerveMat: THREE.MeshStandardMaterial;
    irisMat: THREE.MeshStandardMaterial;
    scleraMat: THREE.MeshStandardMaterial;
    lensMat: THREE.MeshPhysicalMaterial;
    opticNerveMat: THREE.MeshStandardMaterial;
  } | null>(null);

  if (!materials.current) {
    materials.current = {
      boneMat: new THREE.MeshStandardMaterial({
        color: new THREE.Color("#faf6ee"),
        roughness: 0.35,
        metalness: 0.02,
        side: THREE.DoubleSide,
        clippingPlanes: viewMode === "split" ? [skeletonClipPlane] : [],
        clipShadows: true,
        emissive: new THREE.Color("#fbbf24"),
        emissiveIntensity: 0.0,
      }),
      skullCapMat: new THREE.MeshPhysicalMaterial({
        color: new THREE.Color("#faf6ee"),
        roughness: 0.18,
        metalness: 0.04,
        transparent: true,
        opacity: 0.26,
        depthWrite: false,
        side: THREE.DoubleSide,
        clippingPlanes: viewMode === "split" ? [skeletonClipPlane] : [],
        clipShadows: true,
        emissive: new THREE.Color("#fbbf24"),
        emissiveIntensity: 0.0,
      }),
      muscleMat: new THREE.MeshStandardMaterial({
        color: new THREE.Color("#b91c1c"),
        roughness: 0.35,
        metalness: 0.02,
        side: THREE.DoubleSide,
        clippingPlanes: viewMode === "split" ? [muscleClipPlane] : [],
        clipShadows: true,
        emissive: new THREE.Color("#dc2626"),
        emissiveIntensity: 0.0,
      }),
      tendonMat: new THREE.MeshStandardMaterial({
        color: new THREE.Color("#f8fafc"),
        roughness: 0.28,
        metalness: 0.03,
        side: THREE.DoubleSide,
        clippingPlanes: viewMode === "split" ? [muscleClipPlane] : [],
        clipShadows: true,
        emissive: new THREE.Color("#dc2626"),
        emissiveIntensity: 0.0,
      }),
      cortexMat: new THREE.MeshStandardMaterial({
        map: brainTexture,
        color: new THREE.Color("#fca5a5"),
        roughness: 0.32,
        metalness: 0.04,
        side: THREE.DoubleSide,
        clippingPlanes: viewMode === "split" ? [skeletonClipPlane] : [],
        emissive: new THREE.Color("#ec4899"),
        emissiveIntensity: 0.04,
      }),
      arteryMat: new THREE.MeshStandardMaterial({
        color: new THREE.Color("#dc2626"),
        roughness: 0.24,
        metalness: 0.06,
        side: THREE.DoubleSide,
        clippingPlanes: viewMode === "split" ? [skeletonClipPlane] : [],
        emissive: new THREE.Color("#ef4444"),
        emissiveIntensity: 0.12,
      }),
      cerebellumMat: new THREE.MeshStandardMaterial({
        color: new THREE.Color("#fb7185"),
        roughness: 0.35,
        metalness: 0.04,
        side: THREE.DoubleSide,
        clippingPlanes: viewMode === "split" ? [skeletonClipPlane] : [],
        emissive: new THREE.Color("#ec4899"),
        emissiveIntensity: 0.04,
      }),
      stemMat: new THREE.MeshStandardMaterial({
        color: new THREE.Color("#fed7aa"),
        roughness: 0.38,
        metalness: 0.02,
        side: THREE.DoubleSide,
        clippingPlanes: viewMode === "split" ? [skeletonClipPlane] : [],
        emissive: new THREE.Color("#f59e0b"),
        emissiveIntensity: 0.02,
      }),
      nerveMat: new THREE.MeshStandardMaterial({
        color: new THREE.Color("#fef08a"),
        roughness: 0.30,
        metalness: 0.02,
        side: THREE.DoubleSide,
        clippingPlanes: viewMode === "split" ? [skeletonClipPlane] : [],
        emissive: new THREE.Color("#eab308"),
        emissiveIntensity: 0.05,
      }),
      irisMat: new THREE.MeshStandardMaterial({
        map: irisTexture,
        roughness: 0.12,
        metalness: 0.04,
        transparent: true,
        emissive: new THREE.Color("#0284c7"),
        emissiveIntensity: 0.0,
      }),
      scleraMat: new THREE.MeshStandardMaterial({
        map: scleraTexture,
        roughness: 0.20,
        metalness: 0.02,
      }),
      lensMat: new THREE.MeshPhysicalMaterial({
        color: new THREE.Color("#e0f2fe"),
        roughness: 0.06,
        transmission: 0.94,
        transparent: true,
        opacity: 0.85,
        ior: 1.413,
      }),
      opticNerveMat: new THREE.MeshStandardMaterial({
        color: new THREE.Color("#fbcfe8"),
        roughness: 0.38,
        metalness: 0.02,
        emissive: new THREE.Color("#ec4899"),
        emissiveIntensity: 0.02,
      }),
    };
  }

  const {
    boneMat,
    skullCapMat,
    muscleMat,
    tendonMat,
    cortexMat,
    arteryMat,
    cerebellumMat,
    stemMat,
    nerveMat,
    irisMat,
    scleraMat,
    lensMat,
    opticNerveMat,
  } = materials.current;

  useEffect(() => {
    const brainMats = [cortexMat, arteryMat, cerebellumMat, stemMat, nerveMat];

    if (viewMode === "split") {
      boneMat.clippingPlanes = [skeletonClipPlane];
      skullCapMat.clippingPlanes = [skeletonClipPlane];
      muscleMat.clippingPlanes = [muscleClipPlane];
      tendonMat.clippingPlanes = [muscleClipPlane];
      brainMats.forEach((m) => {
        m.clippingPlanes = [skeletonClipPlane];
      });
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
      brainMats.forEach((m) => {
        m.clippingPlanes = [];
      });
      muscleMat.transparent = false;
      muscleMat.opacity = 1.0;
      tendonMat.transparent = false;
      tendonMat.opacity = 1.0;
    } else if (viewMode === "skeleton") {
      boneMat.clippingPlanes = [];
      skullCapMat.clippingPlanes = [];
      muscleMat.clippingPlanes = [];
      tendonMat.clippingPlanes = [];
      brainMats.forEach((m) => {
        m.clippingPlanes = [];
      });
      boneMat.transparent = false;
      boneMat.opacity = 1.0;
    } else if (viewMode === "layered") {
      boneMat.clippingPlanes = [];
      skullCapMat.clippingPlanes = [];
      muscleMat.clippingPlanes = [];
      tendonMat.clippingPlanes = [];
      brainMats.forEach((m) => {
        m.clippingPlanes = [];
      });
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
    brainMats.forEach((m) => {
      m.needsUpdate = true;
    });
  }, [
    viewMode,
    skeletonClipPlane,
    muscleClipPlane,
    boneMat,
    skullCapMat,
    muscleMat,
    tendonMat,
    cortexMat,
    arteryMat,
    cerebellumMat,
    stemMat,
    nerveMat,
  ]);

  const skeletonScene = useMemo(() => {
    const clone = skeletonGLTF.scene.clone(true);
    clone.traverse((child: THREE.Object3D) => {
      if ((child as THREE.Mesh).isMesh) {
        const name = (child.name || "").toLowerCase();
        // Calvarial bones (parietal and frontal calvaria) receive a translucent window to expose the brain inside
        const isCalvaria =
          name.includes("parietal") || name.includes("frontal");
        (child as THREE.Mesh).material = isCalvaria ? skullCapMat : boneMat;
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

  const brainScene = useMemo(() => {
    const clone = brainGLTF.scene.clone(true);
    clone.traverse((child: THREE.Object3D) => {
      if ((child as THREE.Mesh).isMesh) {
        const name = (child.name || "").toLowerCase();
        let mat: THREE.Material = cortexMat;

        if (
          name.includes("artery") ||
          name.includes("sinus") ||
          name.includes("vein") ||
          name.includes("plexus")
        ) {
          mat = arteryMat;
        } else if (name.includes("cerebell")) {
          mat = cerebellumMat;
        } else if (
          name.includes("stem") ||
          name.includes("pons") ||
          name.includes("medulla") ||
          name.includes("tract") ||
          name.includes("peduncle") ||
          name.includes("chiasm") ||
          name.includes("thalam")
        ) {
          mat = stemMat;
        } else if (name.includes("nerve")) {
          mat = nerveMat;
        } else {
          mat = cortexMat;
        }

        (child as THREE.Mesh).material = mat;
        child.castShadow = true;
        child.receiveShadow = true;
      }
    });
    return clone;
  }, [brainGLTF.scene, cortexMat, arteryMat, cerebellumMat, stemMat, nerveMat]);

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

    // Selection state driving focused anatomical highlights
    const isBonesSelected = selectedSystem === "bones";
    const isMusclesSelected = selectedSystem === "muscles";
    const isBrainSelected = selectedSystem === "brain";
    const isEyesSelected = selectedSystem === "eyes";

    const targetBone = healthValues ? healthValues.bones : 100;
    const targetMuscle = healthValues ? healthValues.muscle : 100;
    const targetBrain = healthValues ? healthValues.brain : 100;
    const targetEye = healthValues ? healthValues.eye : 100;

    // Responsive real-time lerp when interval changes so the user visibly watches transition
    const lerpFactor = 1.0 - Math.exp(-delta * 6.5);
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

    // Normalized loss values (0.0 = 100% High/Nominal, 1.0 = Maximum Mission Loss)
    const boneLoss = Math.max(0, 100 - boneVal);
    const muscleLoss = Math.max(0, 100 - muscleVal);
    const brainLoss = Math.max(0, 100 - brainVal);
    const eyeLoss = Math.max(0, 100 - eyeVal);

    // 1. SKELETAL SYSTEM (Bone Demineralization & Osteopenia)
    // NASA ISS data: ~1.0%/month bone mineral loss in hips/spine -> 5.0% by Day 180
    const normBoneLoss = Math.min(1.0, boneLoss / 5.0);

    if (normBoneLoss > 0.01) {
      // Chalky porous demineralization visible on bone surface
      boneMat.color.lerpColors(
        new THREE.Color("#faf6ee"),
        new THREE.Color("#9c9484"),
        normBoneLoss
      );
      boneMat.roughness = 0.35 + normBoneLoss * 0.28;
      skullCapMat.color.copy(boneMat.color);
      skullCapMat.roughness = boneMat.roughness;
    } else {
      // 100% High Health / Nominal Earth Baseline
      boneMat.color.set("#faf6ee");
      boneMat.roughness = 0.35;
      skullCapMat.color.set("#faf6ee");
      skullCapMat.roughness = 0.18;
    }

    // Calm emissive: NO emissive glow on hover! Only gentle highlight on explicit selection
    const boneSelectionEmissive = isBonesSelected ? 0.22 : 0.0;
    boneMat.emissive.set(isBonesSelected ? "#fbbf24" : "#000000");
    boneMat.emissiveIntensity = boneSelectionEmissive;
    skullCapMat.emissive.copy(boneMat.emissive);
    skullCapMat.emissiveIntensity = boneSelectionEmissive * 0.5;

    // 2. MUSCULAR SYSTEM (Postural Atrophy & Microgravity Tone Loss)
    // NASA ISS data: Up to 14.0% postural muscle mass/tone loss by Day 180
    const normMuscleLoss = Math.min(1.0, muscleLoss / 14.0);

    if (normMuscleLoss > 0.01) {
      // Transition from oxygenated crimson to atrophic deeper microgravity tone
      muscleMat.color.lerpColors(
        new THREE.Color("#b91c1c"),
        new THREE.Color("#441616"),
        normMuscleLoss
      );
      muscleMat.roughness = 0.35 + normMuscleLoss * 0.30;
    } else {
      // 100% High Health / Nominal Earth Baseline
      muscleMat.color.set("#b91c1c");
      muscleMat.roughness = 0.35;
    }

    // Calm emissive: NO emissive glow on hover! Only gentle highlight on explicit selection
    const muscleSelectionEmissive = isMusclesSelected ? 0.22 : 0.0;
    muscleMat.emissive.set(isMusclesSelected ? "#f43f5e" : "#000000");
    muscleMat.emissiveIntensity = muscleSelectionEmissive;
    tendonMat.emissive.copy(muscleMat.emissive);
    tendonMat.emissiveIntensity = muscleSelectionEmissive * 0.4;

    // 3. CENTRAL NERVOUS SYSTEM (Brain Cephalic Fluid Shift & ICP Pulsation)
    const normBrainLoss = Math.min(1.0, brainLoss / 4.0);
    const fluidShiftRate = 1.6 + normBrainLoss * 1.4;
    const icpWave = Math.sin(time * fluidShiftRate);
    const fluidExpansion = normBrainLoss * 0.038;
    const pulseDilation =
      fluidExpansion + icpWave * (0.006 + normBrainLoss * 0.010);

    if (brainPulseRef.current) {
      const s = 1.0 + pulseDilation;
      brainPulseRef.current.scale.set(s, s, s);
    }

    // Dynamic brain clipping: in split view, brain is clipped to skeleton side unless selected
    const brainMats = [cortexMat, arteryMat, cerebellumMat, stemMat, nerveMat];
    if (viewMode === "split") {
      const activeClipping = isBrainSelected ? [] : [skeletonClipPlane];
      if (cortexMat.clippingPlanes !== activeClipping) {
        brainMats.forEach((m) => {
          m.clippingPlanes = activeClipping;
          m.needsUpdate = true;
        });
      }
    }

    // Calm neural ring: only activates when explicitly selected
    if (brainRingRef.current) {
      if (isBrainSelected) {
        brainRingRef.current.visible = true;
        brainRingRef.current.rotation.z = time * 0.8;
      } else {
        brainRingRef.current.visible = false;
      }
    }

    // Skull cap and face muscle opacity: only softens on explicit selection, never on hover
    if (isBrainSelected) {
      skullCapMat.opacity = 0.08;
      if (viewMode === "split") {
        muscleMat.opacity = 0.38;
        muscleMat.transparent = true;
        tendonMat.opacity = 0.38;
        tendonMat.transparent = true;
      }
      cortexMat.emissive.set("#ec4899");
      cortexMat.emissiveIntensity = 0.35;
      arteryMat.emissive.set("#ef4444");
      arteryMat.emissiveIntensity = 0.30;
      cerebellumMat.emissiveIntensity = 0.25;
      stemMat.emissiveIntensity = 0.18;
    } else {
      skullCapMat.opacity = 0.26;
      if (viewMode === "split") {
        muscleMat.opacity = 1.0;
        muscleMat.transparent = false;
        tendonMat.opacity = 1.0;
        tendonMat.transparent = false;
      }
      // Calm emissive: subtle natural cerebral luminescence without hover spikes
      cortexMat.emissive.set("#ec4899");
      cortexMat.emissiveIntensity = 0.04 + normBrainLoss * 0.12;
      arteryMat.emissive.set("#ef4444");
      arteryMat.emissiveIntensity = 0.08 + normBrainLoss * 0.16;
      cerebellumMat.emissiveIntensity = 0.03 + normBrainLoss * 0.10;
      stemMat.emissiveIntensity = 0.02;
    }

    // 4. VISUAL SYSTEM & SANS (Globe Flattening & Optic Nerve Sheath Dilation)
    const normEyeLoss = Math.min(1.0, eyeLoss / 5.0);

    if (eyeGlobeRef.current) {
      // SANS posterior globe flattening from retrobulbar pressure
      const flatZ = 1.0 - normEyeLoss * 0.15;
      const flatXY = 1.0 + normEyeLoss * 0.05;
      eyeGlobeRef.current.scale.set(flatXY, flatXY, flatZ);
    }

    if (opticNerveRef.current) {
      // SANS Optic Nerve Sheath Diameter (ONSD) dilation from cephalic fluid pooling
      const onsdDilation = 1.0 + normEyeLoss * 0.38;
      opticNerveRef.current.scale.set(onsdDilation, onsdDilation, 1.0);
    }

    // Eye reticle: only displays when selected, never on casual hover
    if (isEyesSelected) {
      irisMat.emissive.set("#0284c7");
      irisMat.emissiveIntensity = 0.30;
      opticNerveMat.emissive.set("#38bdf8");
      opticNerveMat.emissiveIntensity = 0.30;
      if (eyeReticleRef.current) {
        eyeReticleRef.current.visible = true;
        eyeReticleRef.current.rotation.z = time * 0.9;
      }
    } else {
      irisMat.emissive.set("#0284c7");
      irisMat.emissiveIntensity = 0.0;
      opticNerveMat.emissive.set("#ec4899");
      opticNerveMat.emissiveIntensity = normEyeLoss * 0.16;
      if (eyeReticleRef.current) {
        eyeReticleRef.current.visible = false;
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

      {/* Main 3D Skeleton & Muscle Anatomical Assemblies (100% Locked Alignment) */}
      <group
        rotation={[-Math.PI / 2, 0, 0]}
        scale={[0.0010546, 0.0010546, 0.0010546]}
      >
        <group position={[0, 109.02, -782.9]}>
          {viewMode !== "muscles" && (
            <primitive
              object={skeletonScene}
              position={[0, 0, 0]}
              onClick={handleClick("bones")}
              onPointerOver={handlePointerOver("bones")}
              onPointerOut={handlePointerOut()}
            />
          )}

          {viewMode !== "skeleton" && (
            <primitive
              object={anatomyScene}
              position={[0, 0, 0]}
              onClick={handleClick("muscles")}
              onPointerOver={handlePointerOver("muscles")}
              onPointerOut={handlePointerOut()}
            />
          )}
        </group>
      </group>

      {/* Anatomical Central Nervous System (Brain Vault: Real 3D Cerebrum, Cerebellum, Brainstem & Vasculature) */}
      <group
        ref={brainPulseRef}
        position={[0.0, 0.816, -0.016]}
        onClick={handleClick("brain")}
        onPointerOver={handlePointerOver("brain")}
        onPointerOut={handlePointerOut()}
      >
        {/* Synaptic Neural Energy Ring (Calm, visible only when selected) */}
        <mesh
          ref={brainRingRef}
          rotation={[Math.PI / 2, 0, 0]}
          position={[0, 0.02, 0]}
          visible={false}
        >
          <ringGeometry args={[0.076, 0.082, 48]} />
          <meshBasicMaterial
            color="#c084fc"
            side={THREE.DoubleSide}
            transparent={true}
            opacity={0.75}
          />
        </mesh>

        {viewMode !== "muscles" && (
          <primitive
            object={brainScene}
            position={[0.0, -1.633, -0.006]}
          />
        )}
      </group>

      {/* Anatomical Visual System & SANS Globe (Centered in orbital socket) */}
      {(viewMode !== "skeleton" || selectedSystem === "eyes") && (
        <group
          position={[0.0265, 0.776, 0.046]}
          rotation={[0, -0.03, 0]}
          onClick={handleClick("eyes")}
          onPointerOver={handlePointerOver("eyes")}
          onPointerOut={handlePointerOut()}
        >
          {/* SANS Ophthalmic Diagnostic Telemetry HUD Reticle (Active on selection) */}
          <group ref={eyeReticleRef} position={[0, 0, 0.0165]} visible={false}>
            {/* Outer Target Arcs */}
            <mesh>
              <ringGeometry args={[0.0145, 0.016, 48]} />
              <meshBasicMaterial
                color="#38bdf8"
                side={THREE.DoubleSide}
                transparent={true}
                opacity={0.75}
              />
            </mesh>
            {/* Inner Optic Caliber Ring */}
            <mesh>
              <ringGeometry args={[0.0078, 0.0086, 32]} />
              <meshBasicMaterial
                color="#0284c7"
                side={THREE.DoubleSide}
                transparent={true}
                opacity={0.65}
              />
            </mesh>
            {/* Retinal Crosshairs */}
            <mesh position={[0, 0, 0]}>
              <planeGeometry args={[0.036, 0.0006]} />
              <meshBasicMaterial color="#38bdf8" transparent opacity={0.6} />
            </mesh>
            <mesh position={[0, 0, 0]}>
              <planeGeometry args={[0.0006, 0.036]} />
              <meshBasicMaterial color="#38bdf8" transparent opacity={0.6} />
            </mesh>
          </group>

          <group ref={eyeGlobeRef}>
            {/* 1. Sclera (Eyeball Globe with Procedural Episcleral Microvasculature) */}
            <mesh rotation={[0, -Math.PI / 2, 0]}>
              <sphereGeometry args={[0.0125, 36, 32]} />
              <primitive object={scleraMat} attach="material" />
            </mesh>

            {/* 2. Crystalline Biconvex Lens (Posterior Chamber) */}
            <mesh position={[0, 0, 0.0092]} scale={[1.0, 1.0, 0.6]}>
              <sphereGeometry args={[0.0048, 24, 20]} />
              <primitive object={lensMat} attach="material" />
            </mesh>

            {/* 3. Iris (Striated Stroma & Collarette) */}
            <mesh position={[0, 0, 0.0116]}>
              <circleGeometry args={[0.0062, 48]} />
              <primitive object={irisMat} attach="material" />
            </mesh>

            {/* 4. Velvet-Black Pupil Aperture */}
            <mesh position={[0, 0, 0.0118]}>
              <circleGeometry args={[0.0022, 32]} />
              <meshBasicMaterial color="#020408" />
            </mesh>

            {/* 5. Refractive Curved Cornea Dome (Anterior Chamber with Authentic Tear Film IOR) */}
            <mesh position={[0, 0, 0.0112]}>
              <sphereGeometry
                args={[0.0072, 32, 24, 0, Math.PI * 2, 0, Math.PI / 2.15]}
              />
              <meshPhysicalMaterial
                roughness={0.02}
                transmission={0.98}
                transparent={true}
                opacity={0.35}
                ior={1.376}
                clearcoat={1.0}
                clearcoatRoughness={0.02}
              />
            </mesh>

            {/* 6. Optic Nerve Sheath (Posterior Pole extending toward optic canal with SANS dilation) */}
            <group ref={opticNerveRef} position={[0, 0, -0.014]}>
              <mesh rotation={[Math.PI / 2, 0, 0]}>
                <cylinderGeometry args={[0.0036, 0.0044, 0.018, 20]} />
                <primitive object={opticNerveMat} attach="material" />
              </mesh>
            </group>
          </group>
        </group>
      )}
    </group>
  );
};

export default EcorcheModel;

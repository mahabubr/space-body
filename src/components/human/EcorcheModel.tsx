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
  hoveredSystem = null,
  viewMode = "split",
  onSelectSystem,
  onHoverSystem,
  disableFloat = false,
  healthValues = null,
}) => {
  const groupRef = useRef<THREE.Group>(null);
  const breathingAssemblyRef = useRef<THREE.Group>(null);
  const holoScannerRef = useRef<THREE.Group>(null);
  const brainPulseRef = useRef<THREE.Group>(null);
  const brainRingRef = useRef<THREE.Mesh>(null);
  const eyeGlobeRef = useRef<THREE.Group>(null);
  const eyeReticleRef = useRef<THREE.Group>(null);
  const opticNerveRef = useRef<THREE.Group>(null);

  // Day-based diagnostic transition sweep & recalibration
  const prevTargetHealth = useRef<number>(100);
  const transitionWave = useRef<number>(1.0);

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
    boneMat: THREE.MeshPhysicalMaterial;
    weightBearingBoneMat: THREE.MeshPhysicalMaterial;
    skullCapMat: THREE.MeshPhysicalMaterial;
    muscleMat: THREE.MeshPhysicalMaterial;
    posturalMuscleMat: THREE.MeshPhysicalMaterial;
    tendonMat: THREE.MeshPhysicalMaterial;
    cortexMat: THREE.MeshPhysicalMaterial;
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
      // Non-weight-bearing bones (cranium, ribs, upper limbs) - maintain baseline density
      boneMat: new THREE.MeshPhysicalMaterial({
        color: new THREE.Color("#faf6ee"),
        roughness: 0.28,
        metalness: 0.04,
        clearcoat: 0.3,
        clearcoatRoughness: 0.25,
        sheen: 0.22,
        sheenColor: new THREE.Color("#f1f5f9"),
        side: THREE.DoubleSide,
        clippingPlanes: viewMode === "split" ? [skeletonClipPlane] : [],
        clipShadows: true,
        emissive: new THREE.Color("#fbbf24"),
        emissiveIntensity: 0.0,
      }),
      // Weight-bearing bones (femur, pelvis, lumbar spine, calcaneus) - undergo space osteopenia
      weightBearingBoneMat: new THREE.MeshPhysicalMaterial({
        color: new THREE.Color("#faf6ee"),
        roughness: 0.28,
        metalness: 0.04,
        clearcoat: 0.32,
        clearcoatRoughness: 0.25,
        sheen: 0.25,
        sheenColor: new THREE.Color("#f1f5f9"),
        side: THREE.DoubleSide,
        clippingPlanes: viewMode === "split" ? [skeletonClipPlane] : [],
        clipShadows: true,
        emissive: new THREE.Color("#fbbf24"),
        emissiveIntensity: 0.0,
      }),
      skullCapMat: new THREE.MeshPhysicalMaterial({
        color: new THREE.Color("#faf6ee"),
        roughness: 0.14,
        metalness: 0.02,
        transmission: 0.88,
        transparent: true,
        opacity: 0.28,
        ior: 1.48,
        thickness: 0.5,
        depthWrite: false,
        side: THREE.DoubleSide,
        clippingPlanes: viewMode === "split" ? [skeletonClipPlane] : [],
        clipShadows: true,
        emissive: new THREE.Color("#fbbf24"),
        emissiveIntensity: 0.0,
      }),
      // Upper-body non-postural muscles (deltoids, pectorals, arms) - preserve tone
      muscleMat: new THREE.MeshPhysicalMaterial({
        color: new THREE.Color("#b91c1c"),
        roughness: 0.26,
        metalness: 0.06,
        clearcoat: 0.45,
        clearcoatRoughness: 0.2,
        sheen: 0.65,
        sheenColor: new THREE.Color("#fb7185"),
        side: THREE.DoubleSide,
        clippingPlanes: viewMode === "split" ? [muscleClipPlane] : [],
        clipShadows: true,
        emissive: new THREE.Color("#dc2626"),
        emissiveIntensity: 0.0,
      }),
      // Antigravity postural muscles (calves, thighs, gluteals, erector spinae) - suffer rapid disuse atrophy
      posturalMuscleMat: new THREE.MeshPhysicalMaterial({
        color: new THREE.Color("#b91c1c"),
        roughness: 0.26,
        metalness: 0.06,
        clearcoat: 0.45,
        clearcoatRoughness: 0.2,
        sheen: 0.65,
        sheenColor: new THREE.Color("#fb7185"),
        side: THREE.DoubleSide,
        clippingPlanes: viewMode === "split" ? [muscleClipPlane] : [],
        clipShadows: true,
        emissive: new THREE.Color("#dc2626"),
        emissiveIntensity: 0.0,
      }),
      tendonMat: new THREE.MeshPhysicalMaterial({
        color: new THREE.Color("#f8fafc"),
        roughness: 0.22,
        metalness: 0.03,
        clearcoat: 0.55,
        clearcoatRoughness: 0.2,
        sheen: 0.4,
        sheenColor: new THREE.Color("#ffffff"),
        side: THREE.DoubleSide,
        clippingPlanes: viewMode === "split" ? [muscleClipPlane] : [],
        clipShadows: true,
        emissive: new THREE.Color("#dc2626"),
        emissiveIntensity: 0.0,
      }),
      cortexMat: new THREE.MeshPhysicalMaterial({
        map: brainTexture,
        color: new THREE.Color("#fca5a5"),
        roughness: 0.3,
        metalness: 0.04,
        clearcoat: 0.35,
        clearcoatRoughness: 0.25,
        sheen: 0.35,
        sheenColor: new THREE.Color("#f472b6"),
        side: THREE.DoubleSide,
        clippingPlanes: viewMode === "split" ? [skeletonClipPlane] : [],
        emissive: new THREE.Color("#ec4899"),
        emissiveIntensity: 0.04,
      }),
      arteryMat: new THREE.MeshStandardMaterial({
        color: new THREE.Color("#dc2626"),
        roughness: 0.22,
        metalness: 0.08,
        side: THREE.DoubleSide,
        clippingPlanes: viewMode === "split" ? [skeletonClipPlane] : [],
        emissive: new THREE.Color("#ef4444"),
        emissiveIntensity: 0.12,
      }),
      cerebellumMat: new THREE.MeshStandardMaterial({
        color: new THREE.Color("#fb7185"),
        roughness: 0.34,
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
        roughness: 0.3,
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
        roughness: 0.2,
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
    weightBearingBoneMat,
    skullCapMat,
    muscleMat,
    posturalMuscleMat,
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
      weightBearingBoneMat.clippingPlanes = [skeletonClipPlane];
      skullCapMat.clippingPlanes = [skeletonClipPlane];
      muscleMat.clippingPlanes = [muscleClipPlane];
      posturalMuscleMat.clippingPlanes = [muscleClipPlane];
      tendonMat.clippingPlanes = [muscleClipPlane];
      brainMats.forEach((m) => {
        m.clippingPlanes = [skeletonClipPlane];
      });
      boneMat.transparent = false;
      boneMat.opacity = 1.0;
      weightBearingBoneMat.transparent = false;
      weightBearingBoneMat.opacity = 1.0;
      muscleMat.transparent = false;
      muscleMat.opacity = 1.0;
      posturalMuscleMat.transparent = false;
      posturalMuscleMat.opacity = 1.0;
      tendonMat.transparent = false;
      tendonMat.opacity = 1.0;
    } else if (viewMode === "muscles") {
      boneMat.clippingPlanes = [];
      weightBearingBoneMat.clippingPlanes = [];
      skullCapMat.clippingPlanes = [];
      muscleMat.clippingPlanes = [];
      posturalMuscleMat.clippingPlanes = [];
      tendonMat.clippingPlanes = [];
      brainMats.forEach((m) => {
        m.clippingPlanes = [];
      });
      muscleMat.transparent = false;
      muscleMat.opacity = 1.0;
      posturalMuscleMat.transparent = false;
      posturalMuscleMat.opacity = 1.0;
      tendonMat.transparent = false;
      tendonMat.opacity = 1.0;
    } else if (viewMode === "skeleton") {
      boneMat.clippingPlanes = [];
      weightBearingBoneMat.clippingPlanes = [];
      skullCapMat.clippingPlanes = [];
      muscleMat.clippingPlanes = [];
      posturalMuscleMat.clippingPlanes = [];
      tendonMat.clippingPlanes = [];
      brainMats.forEach((m) => {
        m.clippingPlanes = [];
      });
      boneMat.transparent = false;
      boneMat.opacity = 1.0;
      weightBearingBoneMat.transparent = false;
      weightBearingBoneMat.opacity = 1.0;
    } else if (viewMode === "layered") {
      boneMat.clippingPlanes = [];
      weightBearingBoneMat.clippingPlanes = [];
      skullCapMat.clippingPlanes = [];
      muscleMat.clippingPlanes = [];
      posturalMuscleMat.clippingPlanes = [];
      tendonMat.clippingPlanes = [];
      brainMats.forEach((m) => {
        m.clippingPlanes = [];
      });
      boneMat.transparent = false;
      boneMat.opacity = 1.0;
      weightBearingBoneMat.transparent = false;
      weightBearingBoneMat.opacity = 1.0;
      muscleMat.transparent = true;
      muscleMat.opacity = 0.58;
      posturalMuscleMat.transparent = true;
      posturalMuscleMat.opacity = 0.58;
      tendonMat.transparent = true;
      tendonMat.opacity = 0.58;
    }

    boneMat.needsUpdate = true;
    weightBearingBoneMat.needsUpdate = true;
    skullCapMat.needsUpdate = true;
    muscleMat.needsUpdate = true;
    posturalMuscleMat.needsUpdate = true;
    tendonMat.needsUpdate = true;
    brainMats.forEach((m) => {
      m.needsUpdate = true;
    });
  }, [
    viewMode,
    skeletonClipPlane,
    muscleClipPlane,
    boneMat,
    weightBearingBoneMat,
    skullCapMat,
    muscleMat,
    posturalMuscleMat,
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
        const isCalvaria =
          name.includes("parietal") || name.includes("frontal");
        const isWeightBearing =
          name.includes("femur") ||
          name.includes("tibia") ||
          name.includes("calcaneus") ||
          name.includes("hip") ||
          name.includes("pelvis") ||
          name.includes("ilium") ||
          name.includes("ischium") ||
          name.includes("sacrum") ||
          name.includes("vertebra") ||
          name.includes("lumbar");
        const isSpine =
          name.includes("vertebra") ||
          name.includes("lumbar") ||
          name.includes("thoracic");

        if (isCalvaria) {
          (child as THREE.Mesh).material = skullCapMat;
        } else if (isWeightBearing) {
          (child as THREE.Mesh).material = weightBearingBoneMat;
          if (isSpine) {
            child.userData.isSpine = true;
            child.userData.baseScale = child.scale.clone();
          }
        } else {
          (child as THREE.Mesh).material = boneMat;
        }

        child.castShadow = true;
        child.receiveShadow = true;
      }
    });
    return clone;
  }, [skeletonGLTF.scene, boneMat, weightBearingBoneMat, skullCapMat]);

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

        const isPostural =
          name.includes("soleus") ||
          name.includes("gastrocnemius") ||
          name.includes("rectus femoris") ||
          name.includes("vastus") ||
          name.includes("quadriceps") ||
          name.includes("gluteus") ||
          name.includes("longissimus") ||
          name.includes("iliocostalis") ||
          name.includes("erector") ||
          name.includes("semitendinosus") ||
          name.includes("biceps femoris");

        if (isTendon) {
          (child as THREE.Mesh).material = tendonMat;
        } else if (isPostural) {
          (child as THREE.Mesh).material = posturalMuscleMat;
          child.userData.isPostural = true;
          child.userData.baseScale = child.scale.clone();
        } else {
          (child as THREE.Mesh).material = muscleMat;
        }

        child.castShadow = true;
        child.receiveShadow = true;
      }
    });
    return clone;
  }, [anatomyGLTF.scene, muscleMat, posturalMuscleMat, tendonMat]);

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

    // Damped microgravity weightless drift (steadies when zoomed into specific system)
    if (!disableFloat && groupRef.current) {
      const floatDamp = selectedSystem ? 0.2 : 1.0;
      groupRef.current.position.y = Math.sin(time * 0.75) * 0.007 * floatDamp;
      groupRef.current.rotation.y = Math.sin(time * 0.32) * 0.005 * floatDamp;
      groupRef.current.rotation.z = Math.cos(time * 0.45) * 0.0025 * floatDamp;
    }

    // Subtle organic thoracic respiratory cycle (~15 breaths per minute)
    if (breathingAssemblyRef.current) {
      const breath = 1.0 + Math.sin(time * 1.57) * 0.0035;
      breathingAssemblyRef.current.scale.set(breath, 1.0, breath);
    }

    const targetBone = healthValues ? healthValues.bones : 100;
    const targetMuscle = healthValues ? healthValues.muscle : 100;
    const targetBrain = healthValues ? healthValues.brain : 100;
    const targetEye = healthValues ? healthValues.eye : 100;

    // Day change transition detection: trigger upward diagnostic laser scan wave
    const currentSum = targetBone + targetMuscle + targetBrain + targetEye;
    if (Math.abs(currentSum - prevTargetHealth.current) > 0.05) {
      prevTargetHealth.current = currentSum;
      transitionWave.current = 0.0;
    }

    if (transitionWave.current < 1.0) {
      transitionWave.current = Math.min(1.0, transitionWave.current + delta * 2.2);
    }

    // Holographic bio-telemetry vertical scanner beam
    if (holoScannerRef.current) {
      if (transitionWave.current < 1.0) {
        // Diagnostic recalibration sweep on day change
        const scanY = -0.92 + transitionWave.current * 1.84;
        holoScannerRef.current.position.y = scanY;
        holoScannerRef.current.rotation.y = time * 2.0;
      } else {
        // Continuous ambient space scan
        const scanY = Math.sin(time * 0.85) * 0.88;
        holoScannerRef.current.position.y = scanY;
        holoScannerRef.current.rotation.y = time * 0.25;
      }
    }

    // Selection and hover states driving focused anatomical highlights
    const isBonesSelected = selectedSystem === "bones";
    const isMusclesSelected = selectedSystem === "muscles";
    const isBrainSelected = selectedSystem === "brain";
    const isEyesSelected = selectedSystem === "eyes";

    const isBonesHovered = hoveredSystem === "bones";
    const isMusclesHovered = hoveredSystem === "muscles";
    const isBrainHovered = hoveredSystem === "brain";
    const isEyesHovered = hoveredSystem === "eyes";

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

    // 1. SKELETAL SYSTEM (Region-specific Bone Demineralization & Osteopenia)
    // Non-weight-bearing bones (cranium, ribs, arms, clavicle) preserve ivory density!
    boneMat.color.set("#faf6ee");
    boneMat.roughness = 0.28;
    boneMat.clearcoat = 0.30;
    const boneSelectionEmissive = isBonesSelected ? 0.25 : isBonesHovered ? 0.08 : 0.0;
    boneMat.emissive.set(isBonesSelected || isBonesHovered ? "#fbbf24" : "#000000");
    boneMat.emissiveIntensity = boneSelectionEmissive;

    // Weight-bearing bones (pelvis, hips, femur, tibia, spine) suffer space osteopenia:
    const normBoneLoss = Math.min(1.0, boneLoss / 5.0);

    if (normBoneLoss > 0.01) {
      // Chalky calcium leaching (preserves bone ivory appearance, never muddy/dark)
      weightBearingBoneMat.color.lerpColors(
        new THREE.Color("#faf6ee"),
        new THREE.Color("#ede7dc"),
        normBoneLoss
      );
      // Trabecular micro-porosity develops
      weightBearingBoneMat.roughness = 0.28 + normBoneLoss * 0.32;
      weightBearingBoneMat.clearcoat = 0.32 * (1.0 - normBoneLoss * 0.8);
    } else {
      weightBearingBoneMat.color.set("#faf6ee");
      weightBearingBoneMat.roughness = 0.28;
      weightBearingBoneMat.clearcoat = 0.32;
    }

    // Demineralization stress heatmap: weight-bearing skeletal areas radiate subtle amber luminescence
    const bmdStressGlow = normBoneLoss * 0.16;
    const weightBoneEmissive = isBonesSelected ? 0.28 : isBonesHovered ? 0.10 : bmdStressGlow;
    weightBearingBoneMat.emissive.set(isBonesSelected || isBonesHovered || normBoneLoss > 0.03 ? "#fbbf24" : "#000000");
    weightBearingBoneMat.emissiveIntensity = weightBoneEmissive;
    skullCapMat.emissive.copy(weightBearingBoneMat.emissive);
    skullCapMat.emissiveIntensity = weightBoneEmissive * 0.4;

    // Physical Spinal Disc Decompression (Microgravity Spinal Elongation)
    skeletonScene.traverse((child) => {
      if (child.userData.isSpine && child.userData.baseScale) {
        const spineElongation = 1.0 + normBoneLoss * 0.018; // up to 1.8% vertical elongation
        child.scale.set(
          child.userData.baseScale.x,
          child.userData.baseScale.y * spineElongation,
          child.userData.baseScale.z
        );
      }
    });

    // 2. MUSCULAR SYSTEM (Region-specific Postural Antigravity Atrophy)
    // Upper-body muscles (deltoids, pectorals, arms) remain oxygenated firm baseline crimson!
    muscleMat.color.set("#b91c1c");
    muscleMat.roughness = 0.26;
    muscleMat.clearcoat = 0.45;
    muscleMat.sheenColor.set("#fb7185");
    const muscleSelectionEmissive = isMusclesSelected ? 0.25 : isMusclesHovered ? 0.08 : 0.0;
    muscleMat.emissive.set(isMusclesSelected || isMusclesHovered ? "#f43f5e" : "#000000");
    muscleMat.emissiveIntensity = muscleSelectionEmissive;

    // Postural antigravity muscles (calves, thighs, gluteals, erector spinae) suffer disuse atrophy:
    const normMuscleLoss = Math.min(1.0, muscleLoss / 14.0);

    if (normMuscleLoss > 0.01) {
      // Oxygenated crimson shifts to atrophic desaturated tissue tone
      posturalMuscleMat.color.lerpColors(
        new THREE.Color("#b91c1c"),
        new THREE.Color("#98343c"),
        normMuscleLoss
      );
      // Loss of muscle tone firmness and hydration gloss
      posturalMuscleMat.roughness = 0.26 + normMuscleLoss * 0.22;
      posturalMuscleMat.clearcoat = 0.45 * (1.0 - normMuscleLoss * 0.65);
      posturalMuscleMat.sheenColor.lerpColors(
        new THREE.Color("#fb7185"),
        new THREE.Color("#fca5a5"),
        normMuscleLoss
      );
    } else {
      posturalMuscleMat.color.set("#b91c1c");
      posturalMuscleMat.roughness = 0.26;
      posturalMuscleMat.clearcoat = 0.45;
      posturalMuscleMat.sheenColor.set("#fb7185");
    }

    // Atrophy strain diagnostic glow
    const muscleAtrophyGlow = normMuscleLoss * 0.14;
    const posturalMuscleEmissive = isMusclesSelected ? 0.28 : isMusclesHovered ? 0.10 : muscleAtrophyGlow;
    posturalMuscleMat.emissive.set(isMusclesSelected || isMusclesHovered || normMuscleLoss > 0.03 ? "#f43f5e" : "#000000");
    posturalMuscleMat.emissiveIntensity = posturalMuscleEmissive;
    tendonMat.emissive.copy(posturalMuscleMat.emissive);
    tendonMat.emissiveIntensity = posturalMuscleEmissive * 0.35;

    // Physical Muscular Atrophy Volume Morphing (Cross-Sectional Area Loss in legs/back)
    anatomyScene.traverse((child) => {
      if (child.userData.isPostural && child.userData.baseScale) {
        const shrinkXZ = 1.0 - normMuscleLoss * 0.085; // up to ~8.5% cross-sectional narrowing
        child.scale.set(
          child.userData.baseScale.x * shrinkXZ,
          child.userData.baseScale.y,
          child.userData.baseScale.z * shrinkXZ
        );
      }
    });

    // 3. CENTRAL NERVOUS SYSTEM (Brain Cephalic Fluid Shift & ICP Pulsation)
    const normBrainLoss = Math.min(1.0, brainLoss / 4.0);
    const fluidShiftRate = 1.6 + normBrainLoss * 1.5;
    const icpWave = Math.sin(time * fluidShiftRate);
    const fluidExpansion = normBrainLoss * 0.045; // Real 3D cranial expansion!
    const pulseDilation =
      fluidExpansion + icpWave * (0.006 + normBrainLoss * 0.012);

    if (brainPulseRef.current) {
      const s = 1.0 + pulseDilation;
      brainPulseRef.current.scale.set(s, s, s);
      // Subtle upward cephalic shift toward vertex
      brainPulseRef.current.position.y = 0.816 + normBrainLoss * 0.0035;
    }

    // Cardiac arterial pulse cycle (72 bpm systolic pulse with heightened stroke volume under high ICP)
    const heartPulse = Math.pow(Math.max(0, Math.sin(time * 3.8)), 8) * (0.22 + normBrainLoss * 0.25);

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

    if (brainRingRef.current) {
      if (isBrainSelected) {
        brainRingRef.current.visible = true;
        brainRingRef.current.rotation.z = time * 0.8;
      } else {
        brainRingRef.current.visible = false;
      }
    }

    if (isBrainSelected) {
      skullCapMat.opacity = 0.08;
      if (viewMode === "split") {
        muscleMat.opacity = 0.38;
        muscleMat.transparent = true;
        posturalMuscleMat.opacity = 0.38;
        posturalMuscleMat.transparent = true;
        tendonMat.opacity = 0.38;
        tendonMat.transparent = true;
      }
      cortexMat.emissive.set("#ec4899");
      cortexMat.emissiveIntensity = 0.35;
      arteryMat.emissive.set("#ef4444");
      arteryMat.emissiveIntensity = 0.35 + heartPulse;
      cerebellumMat.emissiveIntensity = 0.25;
      stemMat.emissiveIntensity = 0.18;
    } else {
      skullCapMat.opacity = 0.28;
      if (viewMode === "split") {
        muscleMat.opacity = 1.0;
        muscleMat.transparent = false;
        posturalMuscleMat.opacity = 1.0;
        posturalMuscleMat.transparent = false;
        tendonMat.opacity = 1.0;
        tendonMat.transparent = false;
      }
      const brainHoverEmissive = isBrainHovered ? 0.12 : 0.0;
      cortexMat.emissive.set("#ec4899");
      cortexMat.emissiveIntensity = 0.04 + normBrainLoss * 0.12 + brainHoverEmissive;
      arteryMat.emissive.set("#ef4444");
      arteryMat.emissiveIntensity = 0.08 + normBrainLoss * 0.18 + heartPulse;
      cerebellumMat.emissiveIntensity = 0.03 + normBrainLoss * 0.10 + brainHoverEmissive;
      stemMat.emissiveIntensity = 0.02;
    }

    // 4. VISUAL SYSTEM & SANS (Globe Flattening & Optic Nerve Sheath Dilation)
    const normEyeLoss = Math.min(1.0, eyeLoss / 5.0);

    if (eyeGlobeRef.current) {
      // SANS posterior globe flattening from retrobulbar pressure
      const flatZ = 1.0 - normEyeLoss * 0.16;
      const flatXY = 1.0 + normEyeLoss * 0.06;
      eyeGlobeRef.current.scale.set(flatXY, flatXY, flatZ);
    }

    if (opticNerveRef.current) {
      // SANS Optic Nerve Sheath Diameter (ONSD) dilation from cephalic fluid pooling
      const onsdDilation = 1.0 + normEyeLoss * 0.38;
      opticNerveRef.current.scale.set(onsdDilation, onsdDilation, 1.0);
    }

    if (isEyesSelected) {
      irisMat.emissive.set("#0284c7");
      irisMat.emissiveIntensity = 0.32;
      opticNerveMat.emissive.set("#38bdf8");
      opticNerveMat.emissiveIntensity = 0.32;
      if (eyeReticleRef.current) {
        eyeReticleRef.current.visible = true;
        eyeReticleRef.current.rotation.z = time * 0.9;
      }
    } else {
      const eyeHoverEmissive = isEyesHovered ? 0.12 : 0.0;
      irisMat.emissive.set("#0284c7");
      irisMat.emissiveIntensity = eyeHoverEmissive;
      opticNerveMat.emissive.set("#ec4899");
      opticNerveMat.emissiveIntensity = normEyeLoss * 0.18 + eyeHoverEmissive;
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

      {/* Main 3D Skeleton & Muscle Anatomical Assemblies (with subtle respiratory dynamics) */}
      <group ref={breathingAssemblyRef}>
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
      </group>

      {/* Holographic Bio-Scanning Wave & Emitter Slice */}
      <group ref={holoScannerRef} position={[0, 0, 0]}>
        <mesh rotation={[-Math.PI / 2, 0, 0]}>
          <planeGeometry args={[0.75, 0.38]} />
          <meshBasicMaterial
            color="#22d3ee"
            transparent
            opacity={0.08}
            side={THREE.DoubleSide}
            blending={THREE.AdditiveBlending}
            depthWrite={false}
          />
        </mesh>
        <mesh rotation={[-Math.PI / 2, 0, 0]}>
          <ringGeometry args={[0.31, 0.316, 64]} />
          <meshBasicMaterial
            color="#38bdf8"
            transparent
            opacity={0.55}
            side={THREE.DoubleSide}
            blending={THREE.AdditiveBlending}
            depthWrite={false}
          />
        </mesh>
        <mesh rotation={[-Math.PI / 2, 0, 0]}>
          <ringGeometry args={[0.15, 0.154, 48]} />
          <meshBasicMaterial
            color="#06b6d4"
            transparent
            opacity={0.3}
            side={THREE.DoubleSide}
            blending={THREE.AdditiveBlending}
            depthWrite={false}
          />
        </mesh>
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

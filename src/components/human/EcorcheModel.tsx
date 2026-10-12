import React, { useMemo, useRef, useEffect } from "react";
import * as THREE from "three";
import { useFrame } from "@react-three/fiber";
import { useGLTF } from "@react-three/drei";
import type { SystemId } from "./internal/system-data";
import { getBrainTexture, getIrisTexture } from "./internal/textures";

// Preload the GLBs so they load immediately
useGLTF.preload("/models/skeleton.glb");
useGLTF.preload("/models/anatomy.glb");

export type ViewMode = "split" | "muscles" | "skeleton" | "layered";

interface EcorcheModelProps {
  selectedSystem?: SystemId | null;
  hoveredSystem?: SystemId | null;
  viewMode?: ViewMode;
  onSelectSystem?: (id: SystemId | null) => void;
  onHoverSystem?: (id: SystemId | null) => void;
  disableFloat?: boolean;
}

/**
 * Photorealistic 3D Écorché Anatomical Human Model
 * Built from MRI-based BodyParts3D & Z-Anatomy datasets (201 bones + 467 muscles)
 * Features 4 View Modes (Split Anatomy, Muscles, Skeleton, Layered)
 * with precise anatomical alignment for Brain and Eyes inside the cranial & orbital cavities.
 */
export const EcorcheModel: React.FC<EcorcheModelProps> = ({
  selectedSystem = null,
  hoveredSystem = null,
  viewMode = "split",
  onSelectSystem,
  onHoverSystem,
  disableFloat = false,
}) => {
  const groupRef = useRef<THREE.Group>(null);
  const breathGroupRef = useRef<THREE.Group>(null);
  const brainPulseRef = useRef<THREE.Group>(null);
  const eyeReticleRef = useRef<THREE.Mesh>(null);

  // Load the 201-bone skeleton and 467-muscle anatomy models
  const skeletonGLTF = useGLTF("/models/skeleton.glb");
  const anatomyGLTF = useGLTF("/models/anatomy.glb");

  // Midline Hardware Clipping Planes
  // Viewer's Left (Figure's Right): x <= 0 (Skeletal side)
  // Viewer's Right (Figure's Left): x >= 0 (Muscular side)
  const leftClipPlane = useMemo(
    () => new THREE.Plane(new THREE.Vector3(1, 0, 0), 0.003),
    []
  );
  const rightClipPlane = useMemo(
    () => new THREE.Plane(new THREE.Vector3(-1, 0, 0), 0.003),
    []
  );

  // ───────────── Shared Materials ─────────────

  // 1. Authentic Warm Ivory Bone Material
  const boneMat = useMemo(() => {
    return new THREE.MeshStandardMaterial({
      color: new THREE.Color("#f6f1e6"),
      roughness: 0.42,
      metalness: 0.02,
      side: THREE.DoubleSide,
      clippingPlanes: viewMode === "split" ? [leftClipPlane] : [],
      clipShadows: true,
      emissive: new THREE.Color("#0284c7"),
      emissiveIntensity: 0.0,
    });
  }, [viewMode, leftClipPlane]);

  // 2. Authentic Écorché Crimson Muscle Material
  const muscleMat = useMemo(() => {
    return new THREE.MeshStandardMaterial({
      color: new THREE.Color("#a81d1d"),
      roughness: 0.42,
      metalness: 0.02,
      side: THREE.DoubleSide,
      clippingPlanes: viewMode === "split" ? [rightClipPlane] : [],
      clipShadows: true,
      emissive: new THREE.Color("#ea580c"),
      emissiveIntensity: 0.0,
    });
  }, [viewMode, rightClipPlane]);

  // 3. Pearlescent White Tendon / Connective Tissue Material
  const tendonMat = useMemo(() => {
    return new THREE.MeshStandardMaterial({
      color: new THREE.Color("#f8fafc"),
      roughness: 0.28,
      metalness: 0.03,
      side: THREE.DoubleSide,
      clippingPlanes: viewMode === "split" ? [rightClipPlane] : [],
      clipShadows: true,
      emissive: new THREE.Color("#ea580c"),
      emissiveIntensity: 0.0,
    });
  }, [viewMode, rightClipPlane]);

  // 4. Brain & Eye Materials
  const brainTexture = useMemo(() => getBrainTexture(), []);
  const irisTexture = useMemo(() => getIrisTexture(), []);

  const brainMat = useMemo(
    () =>
      new THREE.MeshStandardMaterial({
        map: brainTexture,
        color: new THREE.Color("#f472b6"),
        roughness: 0.35,
        metalness: 0.04,
        emissive: new THREE.Color("#ec4899"),
        emissiveIntensity: 0.0,
      }),
    [brainTexture]
  );

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

  // Update clipping planes & transparency when viewMode changes
  useEffect(() => {
    if (viewMode === "split") {
      boneMat.clippingPlanes = [leftClipPlane];
      muscleMat.clippingPlanes = [rightClipPlane];
      tendonMat.clippingPlanes = [rightClipPlane];
      boneMat.transparent = false;
      boneMat.opacity = 1.0;
      muscleMat.transparent = false;
      muscleMat.opacity = 1.0;
      tendonMat.transparent = false;
      tendonMat.opacity = 1.0;
    } else if (viewMode === "muscles") {
      boneMat.clippingPlanes = [];
      muscleMat.clippingPlanes = [];
      tendonMat.clippingPlanes = [];
      muscleMat.transparent = false;
      muscleMat.opacity = 1.0;
      tendonMat.transparent = false;
      tendonMat.opacity = 1.0;
    } else if (viewMode === "skeleton") {
      boneMat.clippingPlanes = [];
      muscleMat.clippingPlanes = [];
      tendonMat.clippingPlanes = [];
      boneMat.transparent = false;
      boneMat.opacity = 1.0;
    } else if (viewMode === "layered") {
      // Layered View: Whole skeleton with semi-transparent muscles over top
      boneMat.clippingPlanes = [];
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
    muscleMat.needsUpdate = true;
    tendonMat.needsUpdate = true;
  }, [viewMode, leftClipPlane, rightClipPlane, boneMat, muscleMat, tendonMat]);

  // Clone and assign materials to skeleton scene
  const skeletonScene = useMemo(() => {
    const clone = skeletonGLTF.scene.clone(true);
    clone.traverse((child: any) => {
      if (child.isMesh) {
        child.material = boneMat;
        child.castShadow = true;
        child.receiveShadow = true;
      }
    });
    return clone;
  }, [skeletonGLTF.scene, boneMat]);

  // Clone and assign materials to anatomy scene (muscles & tendons)
  const anatomyScene = useMemo(() => {
    const clone = anatomyGLTF.scene.clone(true);
    clone.traverse((child: any) => {
      if (child.isMesh) {
        const name = (child.name || "").toLowerCase();
        const isTendon =
          name.includes("tendon") ||
          name.includes("ligament") ||
          name.includes("aponeurosis") ||
          name.includes("retinaculum") ||
          name.includes("membrane") ||
          name.includes("fascia");

        child.material = isTendon ? tendonMat : muscleMat;
        child.castShadow = true;
        child.receiveShadow = true;
      }
    });
    return clone;
  }, [anatomyGLTF.scene, muscleMat, tendonMat]);

  // Soft Floor Contact Shadow Texture
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

  // Subtle breathing rhythm & dynamic highlighting when selected or hovered
  useFrame((state) => {
    const time = state.clock.getElapsedTime();

    if (!disableFloat && groupRef.current) {
      groupRef.current.position.y = Math.sin(time * 0.8) * 0.006;
    }

    const isBonesActive = selectedSystem === "bones" || hoveredSystem === "bones";
    const isMusclesActive = selectedSystem === "muscles" || hoveredSystem === "muscles";
    const isBrainActive = selectedSystem === "brain" || hoveredSystem === "brain";
    const isEyesActive = selectedSystem === "eyes" || hoveredSystem === "eyes";

    // Bones highlight
    if (isBonesActive) {
      boneMat.emissiveIntensity = 0.55 + Math.sin(time * 4.0) * 0.25;
    } else {
      boneMat.emissiveIntensity = 0.0;
    }

    // Muscles highlight
    if (isMusclesActive) {
      const breath = Math.sin(time * 3.0) * 0.015 + 1.0;
      if (breathGroupRef.current) {
        breathGroupRef.current.scale.set(breath, breath, breath);
      }
      muscleMat.emissiveIntensity = 0.55 + Math.sin(time * 4.0) * 0.25;
      tendonMat.emissiveIntensity = 0.35;
    } else {
      if (breathGroupRef.current) breathGroupRef.current.scale.set(1, 1, 1);
      muscleMat.emissiveIntensity = 0.0;
      tendonMat.emissiveIntensity = 0.0;
    }

    // Brain highlight
    if (isBrainActive) {
      const wave = Math.sin(time * 4.0);
      brainMat.emissiveIntensity = 0.85 + wave * 0.3;
      if (brainPulseRef.current) {
        const s = 1.0 + wave * 0.04;
        brainPulseRef.current.scale.set(s, s, s);
      }
    } else {
      brainMat.emissiveIntensity = 0.05;
      if (brainPulseRef.current) brainPulseRef.current.scale.set(1, 1, 1);
    }

    // Eye highlight
    if (isEyesActive) {
      irisMat.emissiveIntensity = 0.85 + Math.sin(time * 4.0) * 0.3;
      if (eyeReticleRef.current) {
        eyeReticleRef.current.rotation.z = time * 2.5;
        eyeReticleRef.current.visible = true;
      }
    } else {
      irisMat.emissiveIntensity = 0.0;
      if (eyeReticleRef.current) eyeReticleRef.current.visible = false;
    }
  });

  const handleClick = (id: SystemId) => (e: any) => {
    e.stopPropagation();
    onSelectSystem?.(selectedSystem === id ? null : id);
  };

  const handlePointerOver = (id: SystemId) => (e: any) => {
    e.stopPropagation();
    document.body.style.cursor = "pointer";
    onHoverSystem?.(id);
  };

  const handlePointerOut = () => (e: any) => {
    e.stopPropagation();
    document.body.style.cursor = "default";
    onHoverSystem?.(null);
  };

  return (
    <group ref={groupRef} name="PhotorealisticEcorcheAnatomy">
      {/* ---------------- 1. GROUND CONTACT SHADOW ---------------- */}
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

      {/* ---------------- 2. MAIN ANATOMICAL MESH HIERARCHY ---------------- */}
      <group
        rotation={[-Math.PI / 2, 0, 0]}
        scale={[0.0010546, 0.0010546, 0.0010546]}
      >
        <group position={[0, 109.02, -782.9]}>
          {/* SKELETON MODEL (201 real bones) */}
          {viewMode !== "muscles" && (
            <primitive
              object={skeletonScene}
              onClick={handleClick("bones")}
              onPointerOver={handlePointerOver("bones")}
              onPointerOut={handlePointerOut()}
            />
          )}

          {/* MUSCULAR SYSTEM MODEL (467 real muscles & tendons) */}
          {viewMode !== "skeleton" && (
            <group ref={breathGroupRef}>
              <primitive
                object={anatomyScene}
                onClick={handleClick("muscles")}
                onPointerOver={handlePointerOver("muscles")}
                onPointerOut={handlePointerOut()}
              />
            </group>
          )}
        </group>
      </group>

      {/* ---------------- 3. BRAIN ORGAN (Anatomically placed in cranial vault: y=0.820, z=-0.046) ---------------- */}
      <group
        ref={brainPulseRef}
        position={[-0.015, 0.820, -0.046]}
        onClick={handleClick("brain")}
        onPointerOver={handlePointerOver("brain")}
        onPointerOut={handlePointerOut()}
      >
        {/* Main Cerebrum Hemispheres */}
        <mesh material={brainMat} scale={[1.0, 0.92, 1.15]}>
          <sphereGeometry args={[0.052, 28, 24]} />
        </mesh>
        {/* Cerebellum (Posterior-Inferior) */}
        <mesh position={[0, -0.038, -0.032]} material={brainMat} scale={[1.05, 0.65, 0.85]}>
          <sphereGeometry args={[0.028, 20, 16]} />
        </mesh>
      </group>

      {/* ---------------- 4. EYE ORGAN (Anatomically placed in right orbit socket: x=0.0325, y=0.7689, z=0.048) ---------------- */}
      <group
        position={[0.0325, 0.7689, 0.048]}
        onClick={handleClick("eyes")}
        onPointerOver={handlePointerOver("eyes")}
        onPointerOut={handlePointerOut()}
      >
        {/* Reticle Focus Ring (Visible when selected) */}
        <mesh ref={eyeReticleRef} position={[0, 0, 0.015]} visible={false}>
          <ringGeometry args={[0.014, 0.017, 32]} />
          <meshBasicMaterial
            color="#38bdf8"
            side={THREE.DoubleSide}
            transparent={true}
            opacity={0.85}
          />
        </mesh>

        {/* Anatomical 24mm Eyeball Globe */}
        <mesh>
          <sphereGeometry args={[0.0125, 24, 20]} />
          <meshStandardMaterial color="#f8fafc" roughness={0.12} metalness={0.02} />
        </mesh>

        {/* Iris & Pupil Disk */}
        <mesh position={[0, 0, 0.0118]} material={irisMat}>
          <circleGeometry args={[0.0068, 32]} />
        </mesh>

        {/* Glossy Cornea Layer */}
        <mesh position={[0, 0, 0.012]}>
          <sphereGeometry args={[0.0072, 20, 16, 0, Math.PI * 2, 0, Math.PI / 2.2]} />
          <meshPhysicalMaterial
            roughness={0.04}
            transmission={0.92}
            transparent={true}
            opacity={0.4}
            ior={1.38}
          />
        </mesh>
      </group>

      {/* ---------------- 5. TRANSLUCENT SILHOUETTE (Skeletal side X < 0) ---------------- */}
      {viewMode === "split" && (
        <group position={[-0.08, 0.32, 0]}>
          <mesh scale={[1.1, 1.25, 0.9]}>
            <capsuleGeometry args={[0.09, 0.22, 14, 18]} />
            <meshPhysicalMaterial
              color="#fed7aa"
              roughness={0.35}
              transmission={0.82}
              transparent={true}
              opacity={0.18}
              side={THREE.DoubleSide}
            />
          </mesh>
        </group>
      )}
    </group>
  );
};

export default EcorcheModel;

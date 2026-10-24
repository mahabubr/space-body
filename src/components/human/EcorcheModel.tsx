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
  const eyeReticleRef = useRef<THREE.Mesh>(null);

  const skeletonGLTF = useGLTF("/models/skeleton.glb");
  const anatomyGLTF = useGLTF("/models/anatomy.glb");

  const leftClipPlane = useMemo(
    () => new THREE.Plane(new THREE.Vector3(1, 0, 0), 0.003),
    []
  );
  const rightClipPlane = useMemo(
    () => new THREE.Plane(new THREE.Vector3(-1, 0, 0), 0.003),
    []
  );

  const brainTexture = useMemo(() => getBrainTexture(), []);
  const irisTexture = useMemo(() => getIrisTexture(), []);

  const materials = useRef<{
    boneMat: THREE.MeshStandardMaterial;
    muscleMat: THREE.MeshStandardMaterial;
    tendonMat: THREE.MeshStandardMaterial;
    brainMat: THREE.MeshStandardMaterial;
    irisMat: THREE.MeshStandardMaterial;
  } | null>(null);

  if (!materials.current) {
    materials.current = {
      boneMat: new THREE.MeshStandardMaterial({
        color: new THREE.Color("#f6f1e6"),
        roughness: 0.42,
        metalness: 0.02,
        side: THREE.DoubleSide,
        clippingPlanes: viewMode === "split" ? [leftClipPlane] : [],
        clipShadows: true,
        emissive: new THREE.Color("#0284c7"),
        emissiveIntensity: 0.0,
      }),
      muscleMat: new THREE.MeshStandardMaterial({
        color: new THREE.Color("#a81d1d"),
        roughness: 0.42,
        metalness: 0.02,
        side: THREE.DoubleSide,
        clippingPlanes: viewMode === "split" ? [rightClipPlane] : [],
        clipShadows: true,
        emissive: new THREE.Color("#ea580c"),
        emissiveIntensity: 0.0,
      }),
      tendonMat: new THREE.MeshStandardMaterial({
        color: new THREE.Color("#f8fafc"),
        roughness: 0.28,
        metalness: 0.03,
        side: THREE.DoubleSide,
        clippingPlanes: viewMode === "split" ? [rightClipPlane] : [],
        clipShadows: true,
        emissive: new THREE.Color("#ea580c"),
        emissiveIntensity: 0.0,
      }),
      brainMat: new THREE.MeshStandardMaterial({
        map: brainTexture,
        color: new THREE.Color("#f472b6"),
        roughness: 0.35,
        metalness: 0.04,
        emissive: new THREE.Color("#ec4899"),
        emissiveIntensity: 0.0,
      }),
      irisMat: new THREE.MeshStandardMaterial({
        map: irisTexture,
        roughness: 0.08,
        metalness: 0.05,
        emissive: new THREE.Color("#0284c7"),
        emissiveIntensity: 0.0,
      }),
    };
  }

  const { boneMat, muscleMat, tendonMat, brainMat, irisMat } = materials.current;

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

  const skeletonScene = useMemo(() => {
    const clone = skeletonGLTF.scene.clone(true);
    clone.traverse((child: THREE.Object3D) => {
      if ((child as THREE.Mesh).isMesh) {
        (child as THREE.Mesh).material = boneMat;
        child.castShadow = true;
        child.receiveShadow = true;
      }
    });
    return clone;
  }, [skeletonGLTF.scene, boneMat]);

  const anatomyScene = useMemo(() => {
    const clone = anatomyGLTF.scene.clone(true);
    clone.traverse((child: THREE.Object3D) => {
      if ((child as THREE.Mesh).isMesh) {
        const name = (child.name || "").toLowerCase();
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

  useFrame((state) => {
    const time = state.clock.getElapsedTime();

    if (!disableFloat && groupRef.current) {
      groupRef.current.position.y = Math.sin(time * 0.8) * 0.006;
    }

    const isBonesActive = selectedSystem === "bones" || hoveredSystem === "bones";
    const isMusclesActive = selectedSystem === "muscles" || hoveredSystem === "muscles";
    const isBrainActive = selectedSystem === "brain" || hoveredSystem === "brain";
    const isEyesActive = selectedSystem === "eyes" || hoveredSystem === "eyes";

    const boneVal = healthValues ? healthValues.bones : 100;
    const muscleVal = healthValues ? healthValues.muscle : 100;
    const brainVal = healthValues ? healthValues.brain : 100;
    const eyeVal = healthValues ? healthValues.eye : 100;

    const boneLoss = Math.max(0, 100 - boneVal);
    const muscleLoss = Math.max(0, 100 - muscleVal);
    const brainLoss = Math.max(0, 100 - brainVal);
    const eyeLoss = Math.max(0, 100 - eyeVal);

    if (isBonesActive) {
      boneMat.emissiveIntensity = 0.55 + Math.sin(time * 4.0) * 0.25;
    } else if (boneLoss > 0.5) {
      boneMat.emissiveIntensity = Math.min(0.35, (boneLoss / 8) * (0.15 + Math.sin(time * 2.5) * 0.1));
    } else {
      boneMat.emissiveIntensity = 0.0;
    }

    const atrophyScale = Math.max(0.97, 1.0 - (muscleLoss / 100) * 0.12);
    if (isMusclesActive) {
      const breath = Math.sin(time * 3.0) * 0.015 + 1.0;
      if (breathGroupRef.current) {
        const currentScale = breath * atrophyScale;
        breathGroupRef.current.scale.set(currentScale, currentScale, currentScale);
      }
      muscleMat.emissiveIntensity = 0.55 + Math.sin(time * 4.0) * 0.25;
      tendonMat.emissiveIntensity = 0.35;
    } else {
      if (breathGroupRef.current) {
        breathGroupRef.current.scale.set(atrophyScale, atrophyScale, atrophyScale);
      }
      if (muscleLoss > 2.0) {
        muscleMat.emissiveIntensity = (muscleLoss / 20) * (0.16 + Math.sin(time * 3.0) * 0.1);
        tendonMat.emissiveIntensity = (muscleLoss / 20) * 0.08;
      } else {
        muscleMat.emissiveIntensity = 0.0;
        tendonMat.emissiveIntensity = 0.0;
      }
    }

    const fluidShiftRate = 3.6 + (brainLoss / 10) * 3.5;
    const wave = Math.sin(time * fluidShiftRate);
    const dilation = (brainLoss / 10) * 0.035;

    if (isBrainActive) {
      brainMat.emissiveIntensity = 0.85 + wave * 0.3;
      if (brainPulseRef.current) {
        const s = 1.0 + wave * 0.04 + Math.sin(time * fluidShiftRate) * dilation;
        brainPulseRef.current.scale.set(s, s, s);
      }
    } else {
      brainMat.emissiveIntensity = brainLoss > 0.5 ? 0.05 + (brainLoss / 10) * 0.3 : 0.05;
      if (brainPulseRef.current) {
        const s = 1.0 + Math.sin(time * fluidShiftRate) * dilation;
        brainPulseRef.current.scale.set(s, s, s);
      }
    }

    if (isEyesActive) {
      irisMat.emissiveIntensity = 0.85 + Math.sin(time * 4.0) * 0.3;
      if (eyeReticleRef.current) {
        eyeReticleRef.current.rotation.z = time * 2.5;
        eyeReticleRef.current.visible = true;
        const s = 1.0 + Math.sin(time * 3.0) * 0.06;
        eyeReticleRef.current.scale.set(s, s, s);
      }
    } else {
      irisMat.emissiveIntensity = eyeLoss > 1.0 ? (eyeLoss / 10) * 0.35 : 0.0;
      if (eyeReticleRef.current) {
        if (eyeLoss > 1.5) {
          eyeReticleRef.current.visible = true;
          eyeReticleRef.current.rotation.z = time * 1.5;
          const s = 1.0 + Math.sin(time * 2.0) * 0.08;
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

      <group
        ref={brainPulseRef}
        position={[-0.015, 0.820, -0.046]}
        onClick={handleClick("brain")}
        onPointerOver={handlePointerOver("brain")}
        onPointerOut={handlePointerOut()}
      >
        <mesh material={brainMat} scale={[1.0, 0.92, 1.15]}>
          <sphereGeometry args={[0.052, 28, 24]} />
        </mesh>
        <mesh position={[0, -0.038, -0.032]} material={brainMat} scale={[1.05, 0.65, 0.85]}>
          <sphereGeometry args={[0.028, 20, 16]} />
        </mesh>
      </group>

      <group
        position={[0.0325, 0.7689, 0.048]}
        onClick={handleClick("eyes")}
        onPointerOver={handlePointerOver("eyes")}
        onPointerOut={handlePointerOut()}
      >
        <mesh ref={eyeReticleRef} position={[0, 0, 0.015]} visible={false}>
          <ringGeometry args={[0.014, 0.017, 32]} />
          <meshBasicMaterial
            color="#38bdf8"
            side={THREE.DoubleSide}
            transparent={true}
            opacity={0.85}
          />
        </mesh>

        <mesh>
          <sphereGeometry args={[0.0125, 24, 20]} />
          <meshStandardMaterial color="#f8fafc" roughness={0.12} metalness={0.02} />
        </mesh>

        <mesh position={[0, 0, 0.0118]} material={irisMat}>
          <circleGeometry args={[0.0068, 32]} />
        </mesh>

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

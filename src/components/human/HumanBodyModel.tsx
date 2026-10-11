import React, { useMemo } from "react";
import * as THREE from "three";
import {
  createTorsoGeometryPair,
  createHeadGeometryPair,
  createNeckGeometryPair,
  createEyeGeometryPair,
  createEarGeometryPair,
  createArmGeometryPair,
  createHandGroups,
  createLegGeometryPair,
  createFootGroups,
} from "./humanGeometry";
import {
  createSkinMaterial,
  createWireBaseMaterial,
  createWireLineMaterial,
} from "./skinMaterial";

interface HumanBodyModelProps {
  wireframe?: boolean;
}

export const HumanBodyModel: React.FC<HumanBodyModelProps> = ({
  wireframe = true,
}) => {
  // 1. Procedural Anatomical Geometry Pairs (Solid Mesh + Clean Quad Wire)
  const torso = useMemo(() => createTorsoGeometryPair(), []);
  const head = useMemo(() => createHeadGeometryPair(), []);
  const neck = useMemo(() => createNeckGeometryPair(), []);
  const eye = useMemo(() => createEyeGeometryPair(), []);
  const leftEar = useMemo(() => createEarGeometryPair(true), []);
  const rightEar = useMemo(() => createEarGeometryPair(false), []);

  const leftArm = useMemo(() => createArmGeometryPair(true), []);
  const rightArm = useMemo(() => createArmGeometryPair(false), []);

  const leftLeg = useMemo(() => createLegGeometryPair(true), []);
  const rightLeg = useMemo(() => createLegGeometryPair(false), []);

  // Hand groups (solid mesh + quad wireframe lines)
  const leftHand = useMemo(() => createHandGroups(true), []);
  const rightHand = useMemo(() => createHandGroups(false), []);

  // Foot groups (solid mesh + quad wireframe lines)
  const leftFoot = useMemo(() => createFootGroups(true), []);
  const rightFoot = useMemo(() => createFootGroups(false), []);

  // 2. High-End Materials
  const baseMaterial = useMemo(() => {
    return wireframe ? createWireBaseMaterial() : createSkinMaterial("natural");
  }, [wireframe]);

  const lineMaterial = useMemo(() => {
    return createWireLineMaterial();
  }, []);

  // Pre-instantiated LineSegments for high-performance 60FPS rendering
  const torsoLines = useMemo(
    () => new THREE.LineSegments(torso.wire, lineMaterial),
    [torso, lineMaterial]
  );
  const headLines = useMemo(
    () => new THREE.LineSegments(head.wire, lineMaterial),
    [head, lineMaterial]
  );
  const neckLines = useMemo(
    () => new THREE.LineSegments(neck.wire, lineMaterial),
    [neck, lineMaterial]
  );
  const leftArmLines = useMemo(
    () => new THREE.LineSegments(leftArm.wire, lineMaterial),
    [leftArm, lineMaterial]
  );
  const rightArmLines = useMemo(
    () => new THREE.LineSegments(rightArm.wire, lineMaterial),
    [rightArm, lineMaterial]
  );
  const leftLegLines = useMemo(
    () => new THREE.LineSegments(leftLeg.wire, lineMaterial),
    [leftLeg, lineMaterial]
  );
  const rightLegLines = useMemo(
    () => new THREE.LineSegments(rightLeg.wire, lineMaterial),
    [rightLeg, lineMaterial]
  );

  const leftEarLines = useMemo(
    () => new THREE.LineSegments(leftEar.wire, lineMaterial),
    [leftEar, lineMaterial]
  );
  const rightEarLines = useMemo(
    () => new THREE.LineSegments(rightEar.wire, lineMaterial),
    [rightEar, lineMaterial]
  );

  // Apply materials to hand and foot child meshes
  useMemo(() => {
    leftHand.solidGroup.traverse((child) => {
      if ((child as THREE.Mesh).isMesh) {
        (child as THREE.Mesh).material = baseMaterial;
      }
    });
    rightHand.solidGroup.traverse((child) => {
      if ((child as THREE.Mesh).isMesh) {
        (child as THREE.Mesh).material = baseMaterial;
      }
    });

    leftHand.wireGroup.traverse((child) => {
      if ((child as THREE.LineSegments).isLineSegments) {
        (child as THREE.LineSegments).material = lineMaterial;
      }
    });
    rightHand.wireGroup.traverse((child) => {
      if ((child as THREE.LineSegments).isLineSegments) {
        (child as THREE.LineSegments).material = lineMaterial;
      }
    });
  }, [leftHand, rightHand, baseMaterial, lineMaterial]);

  useMemo(() => {
    leftFoot.solidGroup.traverse((child) => {
      if ((child as THREE.Mesh).isMesh) {
        (child as THREE.Mesh).material = baseMaterial;
      }
    });
    rightFoot.solidGroup.traverse((child) => {
      if ((child as THREE.Mesh).isMesh) {
        (child as THREE.Mesh).material = baseMaterial;
      }
    });

    leftFoot.wireGroup.traverse((child) => {
      if ((child as THREE.LineSegments).isLineSegments) {
        (child as THREE.LineSegments).material = lineMaterial;
      }
    });
    rightFoot.wireGroup.traverse((child) => {
      if ((child as THREE.LineSegments).isLineSegments) {
        (child as THREE.LineSegments).material = lineMaterial;
      }
    });
  }, [leftFoot, rightFoot, baseMaterial, lineMaterial]);

  // Natural neutral standing posture:
  // Arms hang comfortably with mild natural abduction (~10 deg) and subtle forward relaxation
  const armRotZ = 0.12;
  const armRotX = 0.03;

  return (
    <group>
      {/* 1. TORSO & PELVIS */}
      <mesh
        geometry={torso.mesh}
        material={baseMaterial}
        castShadow
        receiveShadow
      />
      {wireframe && <primitive object={torsoLines} />}

      {/* 2. NECK */}
      <mesh
        geometry={neck.mesh}
        material={baseMaterial}
        castShadow
        receiveShadow
      />
      {wireframe && <primitive object={neckLines} />}

      {/* 3. HEAD, EYES & EARS */}
      <group>
        <mesh
          geometry={head.mesh}
          material={baseMaterial}
          castShadow
          receiveShadow
        />
        {wireframe && <primitive object={headLines} />}

        {/* Eyes */}
        <mesh
          geometry={eye.mesh}
          material={baseMaterial}
          position={[0.033, 1.632, 0.076]}
          castShadow
          receiveShadow
        />
        <mesh
          geometry={eye.mesh}
          material={baseMaterial}
          position={[-0.033, 1.632, 0.076]}
          castShadow
          receiveShadow
        />

        {/* Ears */}
        <mesh
          geometry={leftEar.mesh}
          material={baseMaterial}
          position={[0.076, 1.60, -0.015]}
          castShadow
          receiveShadow
        />
        <mesh
          geometry={rightEar.mesh}
          material={baseMaterial}
          position={[-0.076, 1.60, -0.015]}
          castShadow
          receiveShadow
        />
        {wireframe && (
          <group position={[0.076, 1.60, -0.015]}>
            <primitive object={leftEarLines} />
          </group>
        )}
        {wireframe && (
          <group position={[-0.076, 1.60, -0.015]}>
            <primitive object={rightEarLines} />
          </group>
        )}
      </group>

      {/* 4. UPPER EXTREMITIES (ARMS & HANDS) */}
      {/* Left Arm & Hand */}
      <group
        position={[0.195, 1.38, 0]}
        rotation={[armRotX, 0, armRotZ]}
      >
        <mesh
          geometry={leftArm.mesh}
          material={baseMaterial}
          castShadow
          receiveShadow
        />
        {wireframe && <primitive object={leftArmLines} />}

        <primitive object={leftHand.solidGroup} />
        {wireframe && <primitive object={leftHand.wireGroup} />}
      </group>

      {/* Right Arm & Hand */}
      <group
        position={[-0.195, 1.38, 0]}
        rotation={[armRotX, 0, -armRotZ]}
      >
        <mesh
          geometry={rightArm.mesh}
          material={baseMaterial}
          castShadow
          receiveShadow
        />
        {wireframe && <primitive object={rightArmLines} />}

        <primitive object={rightHand.solidGroup} />
        {wireframe && <primitive object={rightHand.wireGroup} />}
      </group>

      {/* 5. LOWER EXTREMITIES (LEGS) */}
      <group>
        <mesh
          geometry={leftLeg.mesh}
          material={baseMaterial}
          castShadow
          receiveShadow
        />
        <mesh
          geometry={rightLeg.mesh}
          material={baseMaterial}
          castShadow
          receiveShadow
        />
        {wireframe && (
          <>
            <primitive object={leftLegLines} />
            <primitive object={rightLegLines} />
          </>
        )}
      </group>

      {/* 6. FEET */}
      <group>
        <primitive object={leftFoot.solidGroup} />
        <primitive object={rightFoot.solidGroup} />
        {wireframe && (
          <>
            <primitive object={leftFoot.wireGroup} />
            <primitive object={rightFoot.wireGroup} />
          </>
        )}
      </group>
    </group>
  );
};

import React, { useState } from "react";
import { Canvas } from "@react-three/fiber";
import { OrbitControls, ContactShadows } from "@react-three/drei";
import * as THREE from "three";
import { HumanBodyModel } from "../../components/human/HumanBodyModel";

// Futuristic NASA Bio-Astronautic Studio Pedestal
function StudioPedestal() {
  return (
    <group position={[0, -0.001, 0]}>
      {/* Concentric telemetry rings */}
      {[0.35, 0.7, 1.1, 1.5, 1.9].map((r, i) => (
        <mesh key={i} rotation={[-Math.PI / 2, 0, 0]}>
          <ringGeometry args={[r - 0.003, r, 72]} />
          <meshBasicMaterial
            color="#38bdf8"
            transparent
            opacity={0.18 - i * 0.03}
            side={THREE.DoubleSide}
          />
        </mesh>
      ))}

      {/* Axis alignment grid lines */}
      <mesh rotation={[-Math.PI / 2, 0, 0]}>
        <planeGeometry args={[0.003, 3.8]} />
        <meshBasicMaterial color="#00f0ff" transparent opacity={0.22} />
      </mesh>
      <mesh rotation={[-Math.PI / 2, 0, Math.PI / 2]}>
        <planeGeometry args={[0.003, 3.8]} />
        <meshBasicMaterial color="#00f0ff" transparent opacity={0.22} />
      </mesh>

      {/* Degree compass markers */}
      {[0, Math.PI / 4, Math.PI / 2, (3 * Math.PI) / 4].map((ang, idx) => (
        <mesh key={idx} rotation={[-Math.PI / 2, 0, ang]}>
          <planeGeometry args={[0.002, 3.2]} />
          <meshBasicMaterial color="#0284c7" transparent opacity={0.12} />
        </mesh>
      ))}

      {/* Center pedestal floor disc */}
      <mesh rotation={[-Math.PI / 2, 0, 0]}>
        <circleGeometry args={[0.9, 64]} />
        <meshBasicMaterial color="#050d1a" transparent opacity={0.88} />
      </mesh>
    </group>
  );
}

// Vertical NASA Height / Metric Scale Indicator in 3D space
function BiometricElevationScale() {
  const ticks = [0.0, 0.25, 0.5, 0.75, 1.0, 1.25, 1.5, 1.78];

  return (
    <group position={[-0.48, 0, 0]}>
      {/* Vertical spine guide line */}
      <mesh position={[0, 0.89, 0]}>
        <cylinderGeometry args={[0.0012, 0.0012, 1.78, 8]} />
        <meshBasicMaterial color="#00f0ff" transparent opacity={0.35} />
      </mesh>

      {/* Horizontal metric tick marks */}
      {ticks.map((h, i) => (
        <mesh key={i} position={[0.02, h, 0]}>
          <boxGeometry args={[0.04, 0.0018, 0.0018]} />
          <meshBasicMaterial color="#38bdf8" transparent opacity={0.5} />
        </mesh>
      ))}
    </group>
  );
}

const Simulator: React.FC = () => {
  // The Single User Option: Wireframe Mode
  const [wireframe, setWireframe] = useState<boolean>(true);

  return (
    <div className="relative w-screen h-screen overflow-hidden bg-[#020611] select-none font-mono">
      {/* 1. NASA / Bio-Astronautic Scientific Telemetry HUD (Top-Left) */}
      <div className="absolute top-6 left-6 z-20 pointer-events-none space-y-1 text-slate-300">
        <div className="flex items-center space-x-2">
          <span className="w-2 h-2 rounded-full bg-cyan-400 animate-pulse shadow-[0_0_8px_#00f0ff]" />
          <span className="text-[11px] font-bold tracking-widest text-cyan-400 uppercase">
            NASA / BIO-ASTRONAUTIC CAD-01
          </span>
        </div>
        <div className="text-xs font-semibold text-white tracking-wide">
          HOMO SAPIENS • 3D ANATOMICAL RECONSTRUCTION
        </div>
        <div className="flex items-center space-x-3 text-[10px] text-slate-400 pt-0.5">
          <span>STATURE: 1.78 M</span>
          <span className="text-slate-600">•</span>
          <span>TOPOLOGY: QUAD CONTOUR</span>
          <span className="text-slate-600">•</span>
          <span className="text-cyan-300">SYSTEM: NOMINAL</span>
        </div>
      </div>

      {/* 2. The Single Wireframe Toggle Option (Top-Right) */}
      <div className="absolute top-6 right-6 z-20">
        <button
          id="wireframe-toggle-btn"
          onClick={() => setWireframe((prev) => !prev)}
          className={`px-4 py-2 rounded-xl text-xs font-mono font-medium tracking-wider uppercase transition-all backdrop-blur-xl border flex items-center space-x-2.5 shadow-2xl cursor-pointer ${
            wireframe
              ? "bg-slate-900/90 text-cyan-400 border-cyan-500/50 shadow-cyan-500/25 scale-105"
              : "bg-slate-900/80 hover:bg-slate-850 text-slate-300 hover:text-white border-slate-700/80 hover:border-slate-600"
          }`}
        >
          <span
            className={`w-2 h-2 rounded-full transition-all ${
              wireframe
                ? "bg-cyan-400 shadow-[0_0_10px_#00f0ff]"
                : "bg-slate-500"
            }`}
          />
          <span>{wireframe ? "Wireframe" : "Shaded"}</span>
        </button>
      </div>

      {/* 3. 3D WebGL Canvas Viewport */}
      <Canvas
        shadows
        gl={{
          antialias: true,
          alpha: false,
          powerPreference: "high-performance",
          toneMapping: THREE.ACESFilmicToneMapping,
          toneMappingExposure: 1.15,
        }}
        camera={{
          position: [0, 1.12, 2.75],
          fov: 38,
          near: 0.1,
          far: 30,
        }}
      >
        {/* Deep Space Background */}
        <color attach="background" args={["#020611"]} />
        <fog attach="fog" args={["#020611", 5.0, 14]} />

        {/* High-End Scientific Studio Lighting */}
        {/* Key Directional Light */}
        <directionalLight
          position={[3.0, 4.2, 3.2]}
          intensity={2.6}
          color="#ffffff"
          castShadow
          shadow-mapSize={[2048, 2048]}
          shadow-bias={-0.0001}
        />

        {/* Soft Cool Sky Fill Light */}
        <directionalLight
          position={[-3.0, 2.8, 2.0]}
          intensity={1.3}
          color="#93c5fd"
        />

        {/* Primary Cyan Rim Silhouette Backlight */}
        <directionalLight
          position={[0.0, 3.6, -3.2]}
          intensity={3.0}
          color="#00f0ff"
        />

        {/* Lateral Contour Rim Light */}
        <directionalLight
          position={[-2.8, 1.8, -1.8]}
          intensity={1.6}
          color="#0284c7"
        />

        {/* Ground & Sky Ambient */}
        <hemisphereLight args={["#f8fafc", "#020611", 0.7]} />

        {/* Procedural Realistic 3D Human Body Model (Quad Wireframe + Obsidian Depth Shell) */}
        <HumanBodyModel wireframe={wireframe} />

        {/* Metric Height Scale in 3D Space */}
        <BiometricElevationScale />

        {/* Soft Ground Contact Shadows */}
        <ContactShadows
          position={[0, 0.001, 0]}
          opacity={0.68}
          scale={2.6}
          blur={1.8}
          far={1.2}
          resolution={1024}
          color="#000000"
        />

        {/* Studio Hologram Floor Pedestal */}
        <StudioPedestal />

        {/* Full 360° Smooth OrbitControls */}
        <OrbitControls
          target={[0, 0.92, 0]}
          minDistance={0.5}
          maxDistance={5.5}
          maxPolarAngle={Math.PI / 2 + 0.05}
          enableDamping
          dampingFactor={0.06}
        />
      </Canvas>

      {/* 4. Minimalist HUD Interaction Hints (Bottom-Center) */}
      <div className="absolute bottom-5 left-1/2 -translate-x-1/2 z-20 pointer-events-none px-4 py-1.5 bg-slate-900/60 backdrop-blur-sm rounded-full border border-slate-800/60 text-[10px] text-slate-400 tracking-wider uppercase">
        Left-click + drag to rotate • Scroll to zoom • Right-click to pan
      </div>
    </div>
  );
};

export default Simulator;

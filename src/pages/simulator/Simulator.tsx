import React, { useState, useRef, useMemo } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { OrbitControls } from "@react-three/drei";
import type { OrbitControls as OrbitControlsImpl } from "three-stdlib";
import * as THREE from "three";
import { Link } from "react-router-dom";
import HumanBody from "../../components/human/HumanBody";
import type { ViewMode } from "../../components/human/EcorcheModel";
import {
  SYSTEMS_DATA,
  type SystemId,
} from "../../components/human/internal/system-data";

// -------------------------------------------------------------------
// CAMERA CONTROLLER
// Smoothly glides the camera and OrbitControls target to focus on the selected system
// -------------------------------------------------------------------
interface CameraControllerProps {
  selectedSystem: SystemId | null;
  controlsRef: React.RefObject<OrbitControlsImpl | null>;
}

const CameraController: React.FC<CameraControllerProps> = ({
  selectedSystem,
  controlsRef,
}) => {
  const defaultPos = useMemo(() => new THREE.Vector3(0, 0.05, 2.65), []);
  const defaultTarget = useMemo(() => new THREE.Vector3(0, 0.0, 0), []);

  useFrame((state, delta) => {
    if (!controlsRef.current) return;

    let targetPos = defaultPos;
    let targetLook = defaultTarget;

    if (selectedSystem && SYSTEMS_DATA[selectedSystem]) {
      const info = SYSTEMS_DATA[selectedSystem];
      targetPos = new THREE.Vector3(...info.cameraPosition);
      targetLook = new THREE.Vector3(...info.cameraTarget);
    }

    // Smooth exponential decay interpolation
    const factor = 1 - Math.exp(-delta * 4.2);
    state.camera.position.lerp(targetPos, factor);
    controlsRef.current.target.lerp(targetLook, factor);
    controlsRef.current.update();
  });

  return null;
};

// -------------------------------------------------------------------
// SIMULATOR COMPONENT
// 5 Dropdown Options: Full Body, Bones, Muscle, Brain, Eye
// 4 Top-Right View Modes: Split Anatomy, Muscles, Skeleton, Layered
// -------------------------------------------------------------------
const Simulator: React.FC = () => {
  const [selectedSystem, setSelectedSystem] = useState<SystemId | null>(null);
  const [hoveredSystem, setHoveredSystem] = useState<SystemId | null>(null);
  const [viewMode, setViewMode] = useState<ViewMode>("split");
  const [theme, setTheme] = useState<"studio" | "dark">("studio");
  const controlsRef = useRef<OrbitControlsImpl | null>(null);

  const selectedData = selectedSystem ? SYSTEMS_DATA[selectedSystem] : null;

  return (
    <div
      className={`w-screen h-screen overflow-hidden relative select-none transition-colors duration-500 ${
        theme === "studio"
          ? "bg-gradient-to-b from-white via-slate-50 to-slate-200 text-slate-800"
          : "bg-[#030712] text-white"
      }`}
    >
      {/* ----------------- TOP NAVBAR & CONTROLS ----------------- */}
      <div className="absolute top-4 left-5 right-5 z-20 flex flex-wrap items-center justify-between gap-3 pointer-events-none">
        {/* Left: Home & 5-Option System Dropdown */}
        <div className="flex items-center gap-3 pointer-events-auto">
          <Link
            to="/"
            className={`px-3 py-2 rounded-xl text-xs font-semibold backdrop-blur-md border transition-all flex items-center gap-1.5 shadow-sm ${
              theme === "studio"
                ? "bg-white/90 text-slate-700 border-slate-300 hover:bg-slate-100"
                : "bg-slate-900/80 text-cyan-300 border-cyan-500/30 hover:bg-slate-800"
            }`}
          >
            <svg
              className="w-3.5 h-3.5"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M10 19l-7-7m0 0l7-7m-7 7h18"
              />
            </svg>
            Home
          </Link>

          {/* 5-Option Dropdown: Full Body, Bones, Muscle, Brain, Eye */}
          <select
            value={selectedSystem || ""}
            onChange={(e) =>
              setSelectedSystem(
                e.target.value ? (e.target.value as SystemId) : null
              )
            }
            className={`rounded-xl px-4 py-2 text-xs font-semibold tracking-wide backdrop-blur-md border outline-none cursor-pointer pr-8 shadow-sm transition-all ${
              theme === "studio"
                ? "bg-white/95 text-slate-800 border-slate-300 hover:border-sky-500 focus:border-sky-600 focus:ring-1 focus:ring-sky-500"
                : "bg-slate-950/85 text-cyan-300 border-cyan-500/40 hover:border-cyan-400 focus:border-cyan-300 focus:ring-1 focus:ring-cyan-400"
            }`}
            style={{
              backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 24 24' stroke='%230284c7'%3E%3Cpath stroke-linecap='round' stroke-linejoin='round' stroke-width='2' d='M19 9l-7 7-7-7'%3E%3C/path%3E%3C/svg%3E")`,
              backgroundRepeat: "no-repeat",
              backgroundPosition: "right 0.65rem center",
              backgroundSize: "0.9rem 0.9rem",
            }}
          >
            <option value="">Full Body</option>
            <option value="bones">Bones</option>
            <option value="muscles">Muscle</option>
            <option value="brain">Brain</option>
            <option value="eyes">Eye</option>
          </select>

          {selectedSystem && (
            <button
              onClick={() => setSelectedSystem(null)}
              className="px-3 py-2 bg-sky-600 hover:bg-sky-500 text-white text-xs font-semibold rounded-xl shadow-md transition-colors"
            >
              Reset View
            </button>
          )}
        </div>

        {/* Top-Right: Exactly 4 View Mode Options + Theme Toggle */}
        <div className="flex items-center gap-2 pointer-events-auto">
          {/* 4 View Mode Buttons */}
          <div
            className={`flex items-center rounded-xl p-0.5 border shadow-sm backdrop-blur-md ${
              theme === "studio"
                ? "bg-white/90 border-slate-300 text-slate-700"
                : "bg-slate-900/80 border-slate-700 text-slate-300"
            }`}
          >
            {(
              [
                { id: "split", label: "Split Anatomy" },
                { id: "muscles", label: "Muscles" },
                { id: "skeleton", label: "Skeleton" },
                { id: "layered", label: "Layered" },
              ] as const
            ).map((mode) => (
              <button
                key={mode.id}
                onClick={() => setViewMode(mode.id)}
                className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${
                  viewMode === mode.id
                    ? "bg-sky-600 text-white font-semibold shadow-sm"
                    : "hover:bg-slate-200/60 dark:hover:bg-slate-800 text-slate-600 dark:text-slate-300"
                }`}
              >
                {mode.label}
              </button>
            ))}
          </div>

          {/* Theme Toggle */}
          <button
            onClick={() => setTheme(theme === "studio" ? "dark" : "studio")}
            className={`px-3 py-2 rounded-xl text-xs font-medium backdrop-blur-md border transition-all flex items-center gap-1.5 shadow-sm ${
              theme === "studio"
                ? "bg-white/90 text-slate-700 border-slate-300 hover:bg-slate-100"
                : "bg-slate-900/80 text-slate-200 border-slate-700 hover:bg-slate-800"
            }`}
          >
            {theme === "studio" ? (
              <>
                <span className="w-2.5 h-2.5 rounded-full bg-amber-500 inline-block shadow-sm" />
                Studio
              </>
            ) : (
              <>
                <span className="w-2.5 h-2.5 rounded-full bg-cyan-400 inline-block shadow-[0_0_8px_#22d3ee]" />
                Dark
              </>
            )}
          </button>
        </div>
      </div>

      {/* ----------------- MISSION MEDICINE TELEMETRY CARD ----------------- */}
      {selectedData && (
        <div
          className={`absolute bottom-6 left-1/2 -translate-x-1/2 z-30 max-w-lg w-[90%] md:w-full p-4 rounded-2xl backdrop-blur-xl border shadow-2xl transition-all duration-300 animate-in fade-in slide-in-from-bottom-4 ${
            theme === "studio"
              ? "bg-white/95 border-slate-200/80 text-slate-800 shadow-slate-400/30"
              : "bg-slate-950/90 border-cyan-500/40 text-slate-100 shadow-cyan-950/80"
          }`}
        >
          <div className="flex items-start justify-between mb-2">
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-sm font-bold tracking-tight text-sky-600 dark:text-cyan-400">
                  {selectedData.name}
                </h3>
                <span
                  className={`text-[10px] font-mono px-2 py-0.5 rounded-full font-semibold ${
                    selectedData.missionRisk === "CRITICAL"
                      ? "bg-red-500/15 text-red-600 border border-red-500/30"
                      : "bg-amber-500/15 text-amber-600 border border-amber-500/30"
                  }`}
                >
                  {selectedData.badge}
                </span>
              </div>
              <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                {selectedData.shortDescription}
              </p>
            </div>
            <button
              onClick={() => setSelectedSystem(null)}
              className="text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 p-1"
            >
              ✕
            </button>
          </div>

          <div className="text-xs space-y-1.5 mt-2 pt-2 border-t border-slate-200 dark:border-slate-800">
            <div>
              <span className="font-semibold text-rose-600 dark:text-rose-400 mr-1">
                Space Impact:
              </span>
              <span className="text-slate-600 dark:text-slate-300">
                {selectedData.problemInSpace}
              </span>
            </div>
            <div>
              <span className="font-semibold text-emerald-600 dark:text-emerald-400 mr-1">
                Countermeasure:
              </span>
              <span className="text-slate-600 dark:text-slate-300">
                {selectedData.nasaSolution}
              </span>
            </div>
          </div>
        </div>
      )}

      {/* ----------------- THREE.JS 3D CANVAS VIEWPORT ----------------- */}
      <Canvas
        camera={{
          position: [0, 0.05, 2.65],
          fov: 42,
          near: 0.1,
          far: 100,
        }}
        gl={{
          antialias: true,
          alpha: true,
          localClippingEnabled: true, // Enables hardware clipping for Split Anatomy
          toneMapping: THREE.ACESFilmicToneMapping,
          toneMappingExposure: theme === "studio" ? 1.05 : 1.25,
        }}
        onPointerMissed={() => setSelectedSystem(null)}
      >
        {/* Background color based on mode */}
        <color
          attach="background"
          args={[theme === "studio" ? "#f8fafc" : "#030712"]}
        />

        {/* ----------------- STUDIO LIGHTING SETUP ----------------- */}
        {theme === "studio" ? (
          <>
            <ambientLight intensity={0.85} color="#ffffff" />
            <directionalLight
              position={[2.8, 3.8, 2.8]}
              intensity={1.8}
              color="#fffcf5"
            />
            <directionalLight
              position={[-2.8, 1.8, 2.2]}
              intensity={1.2}
              color="#e0f2fe"
            />
            <directionalLight
              position={[0, 3.5, -3.2]}
              intensity={1.4}
              color="#ffffff"
            />
            <directionalLight
              position={[0, -2.5, 1.2]}
              intensity={0.4}
              color="#cbd5e1"
            />
          </>
        ) : (
          <>
            <ambientLight intensity={0.5} color="#0c192c" />
            <directionalLight
              position={[3.2, 3.5, 3.2]}
              intensity={1.5}
              color="#38bdf8"
            />
            <directionalLight
              position={[-3.0, 1.2, 2.5]}
              intensity={0.9}
              color="#06b6d4"
            />
            <directionalLight
              position={[0, 4.0, -3.6]}
              intensity={2.2}
              color="#67e8f9"
            />
            <directionalLight
              position={[0, -3.0, 1.2]}
              intensity={0.4}
              color="#083344"
            />
          </>
        )}

        {/* Smooth Camera Focus Controller */}
        <CameraController
          selectedSystem={selectedSystem}
          controlsRef={controlsRef}
        />

        {/* ----------------- PHOTOREALISTIC 3D ÉCORCHÉ HUMAN MODEL ----------------- */}
        <HumanBody
          position={[0, 0, 0]}
          selectedSystem={selectedSystem}
          hoveredSystem={hoveredSystem}
          viewMode={viewMode}
          onSelectSystem={setSelectedSystem}
          onHoverSystem={setHoveredSystem}
        />

        {/* Orbit Controls (Full 360 Rotation, Zoom, Pan) */}
        <OrbitControls
          ref={controlsRef}
          enableDamping={true}
          dampingFactor={0.06}
          minDistance={0.4}
          maxDistance={5.5}
          target={[0, 0.0, 0]}
        />
      </Canvas>
    </div>
  );
};

export default Simulator;

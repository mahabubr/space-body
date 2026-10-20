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
import {
  HEALTH_DATA,
  getHealthForDay,
  type MissionData,
} from "../../../health-data";
import MissionHeader from "./components/MissionHeader";
import HealthIndicatorsPanel from "./components/HealthIndicatorsPanel";
import TimelineSlider from "./components/TimelineSlider";
import HealthTelemetryChart from "./components/HealthTelemetryChart";

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
// Clean, dynamic 3D Human Health Simulation powered by NASA Mission Datasets
// -------------------------------------------------------------------
const Simulator: React.FC = () => {
  // Mission & Timeline State
  const [selectedMission, setSelectedMission] = useState<MissionData>(
    HEALTH_DATA[0]
  );
  const [currentDay, setCurrentDay] = useState<number>(0);
  const [isPlaying, setIsPlaying] = useState<boolean>(false);
  const [showChart, setShowChart] = useState<boolean>(false);
  const [showHud, setShowHud] = useState<boolean>(true);

  // 3D Anatomy State
  const [selectedSystem, setSelectedSystem] = useState<SystemId | null>(null);
  const [hoveredSystem, setHoveredSystem] = useState<SystemId | null>(null);
  const [viewMode, setViewMode] = useState<ViewMode>("split");
  const [theme, setTheme] = useState<"studio" | "dark">("dark");
  const controlsRef = useRef<OrbitControlsImpl | null>(null);

  // When selected mission changes, reset day and pause playback
  const handleSelectMission = (mission: MissionData) => {
    setSelectedMission(mission);
    setCurrentDay(0);
    setIsPlaying(false);
  };

  // Dynamically calculate live health percentages for current day
  const currentHealthValues = useMemo(() => {
    return getHealthForDay(selectedMission, currentDay);
  }, [selectedMission, currentDay]);

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
        {/* Left: Home, Mission Selector & System Dropdown */}
        <div className="flex flex-wrap items-center gap-2.5 pointer-events-auto">
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

          {/* Mission Selection Component */}
          <MissionHeader
            missions={HEALTH_DATA}
            selectedMission={selectedMission}
            onSelectMission={handleSelectMission}
            theme={theme}
          />

          {/* 5-Option Dropdown: Full Body, Bones, Muscle, Brain, Eye */}
          <select
            value={selectedSystem || ""}
            onChange={(e) =>
              setSelectedSystem(
                e.target.value ? (e.target.value as SystemId) : null
              )
            }
            className={`rounded-xl px-3.5 py-2 text-xs font-semibold tracking-wide backdrop-blur-md border outline-none cursor-pointer pr-8 shadow-sm transition-all ${
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

        {/* Top-Right: View Mode Options, Telemetry Toggle & Theme Toggle */}
        <div className="flex items-center gap-2 pointer-events-auto">
          {/* Toggle HUD Panel */}
          <button
            onClick={() => setShowHud(!showHud)}
            className={`px-3 py-2 rounded-xl text-xs font-medium backdrop-blur-md border transition-all flex items-center gap-1.5 shadow-sm ${
              showHud
                ? "bg-sky-600 text-white border-sky-600"
                : theme === "studio"
                ? "bg-white/90 text-slate-700 border-slate-300 hover:bg-slate-100"
                : "bg-slate-900/80 text-slate-200 border-slate-700 hover:bg-slate-800"
            }`}
            title="Toggle health indicators"
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
                d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"
              />
            </svg>
            <span className="hidden sm:inline">Telemetry</span>
          </button>

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
                className={`px-2.5 sm:px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${
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
                <span className="hidden sm:inline">Studio</span>
              </>
            ) : (
              <>
                <span className="w-2.5 h-2.5 rounded-full bg-cyan-400 inline-block shadow-[0_0_8px_#22d3ee]" />
                <span className="hidden sm:inline">Dark</span>
              </>
            )}
          </button>
        </div>
      </div>

      {/* ----------------- LEFT FLOATING HUD: HEALTH SYSTEMS INDICATORS ----------------- */}
      {showHud && (
        <div className="absolute top-20 left-5 z-20 pointer-events-auto animate-in fade-in slide-in-from-left-4 duration-300">
          <HealthIndicatorsPanel
            healthValues={currentHealthValues}
            selectedSystem={selectedSystem}
            onSelectSystem={setSelectedSystem}
            hoveredSystem={hoveredSystem}
            onHoverSystem={setHoveredSystem}
            theme={theme}
          />
        </div>
      )}

      {/* ----------------- BOTTOM CONTROLS: TIMELINE SLIDER & DEGRADATION CHART ----------------- */}
      <div className="absolute bottom-5 left-1/2 -translate-x-1/2 z-20 flex flex-col items-center gap-2.5 w-[92%] max-w-xl pointer-events-auto">
        {/* Degradation Line Chart (Expandable) */}
        {showChart && (
          <div
            className={`w-full p-3 rounded-2xl backdrop-blur-xl border shadow-2xl animate-in fade-in slide-in-from-bottom-3 duration-300 ${
              theme === "studio"
                ? "bg-white/95 border-slate-200 text-slate-800 shadow-slate-300/60"
                : "bg-slate-950/90 border-slate-800 text-slate-100 shadow-cyan-950/40"
            }`}
          >
            <HealthTelemetryChart
              mission={selectedMission}
              currentDay={currentDay}
              onSelectDay={setCurrentDay}
              selectedSystem={selectedSystem}
              onSelectSystem={setSelectedSystem}
              theme={theme}
            />
          </div>
        )}

        {/* Timeline Slider & Navigation */}
        <TimelineSlider
          mission={selectedMission}
          currentDay={currentDay}
          onSelectDay={setCurrentDay}
          isPlaying={isPlaying}
          onTogglePlay={() => setIsPlaying(!isPlaying)}
          showChart={showChart}
          onToggleChart={() => setShowChart(!showChart)}
          theme={theme}
        />
      </div>

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
          healthValues={currentHealthValues}
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

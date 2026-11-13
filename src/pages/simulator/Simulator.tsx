import React, { useState, useRef, useMemo, useEffect } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { OrbitControls, Stars } from "@react-three/drei";
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
  validateNASAHealthDataset,
  getObservationsForStudy,
  getObservationsForSystem,
  getOSDRDatasetsForSystem,
  formatObservationValue,
  getObservationMetricName,
  type MissionData,
  type HealthMetrics,
  type StudySource,
  type OSDRDatasetItem,
} from "../../../health-data";
import HealthIndicatorsPanel from "./components/HealthIndicatorsPanel";
import TimelineSlider from "./components/TimelineSlider";
import HealthTelemetryChart from "./components/HealthTelemetryChart";
import SystemTelemetryIndicator from "./components/SystemTelemetryIndicator";

interface CameraPreset {
  label: string;
  pos: [number, number, number];
  target: [number, number, number];
}

const CAMERA_PRESETS: CameraPreset[] = [
  { label: "Whole Body", pos: [0, 0.0, 2.75], target: [0, -0.05, 0] },
  { label: "Head & CNS", pos: [0, 0.82, 0.68], target: [0, 0.816, -0.016] },
  { label: "Cardio & Torso", pos: [0.035, 0.44, 0.82], target: [0.035, 0.44, 0.04] },
  { label: "Spine & Pelvis", pos: [-0.08, -0.18, 1.15], target: [-0.095, -0.19, -0.03] },
  { label: "Muscles & Legs", pos: [0.08, -0.12, 1.15], target: [0.095, -0.1, 0.03] },
];

const VIEW_MODES: { id: ViewMode; label: string }[] = [
  { id: "split", label: "Split Anatomy" },
  { id: "muscles", label: "Musculature" },
  { id: "skeleton", label: "Skeleton" },
  { id: "layered", label: "X-Ray Layered" },
];

interface CameraControllerProps {
  selectedSystem: SystemId | null;
  cameraPreset: CameraPreset | null;
  resetTrigger: number;
  controlsRef: React.RefObject<OrbitControlsImpl | null>;
}

const CameraController: React.FC<CameraControllerProps> = ({
  selectedSystem,
  cameraPreset,
  resetTrigger,
  controlsRef,
}) => {
  const isTransitioning = useRef<boolean>(false);
  const targetPos = useRef<THREE.Vector3>(new THREE.Vector3(0, 0.0, 2.75));
  const targetLook = useRef<THREE.Vector3>(new THREE.Vector3(0, -0.05, 0));
  const userInteracting = useRef<boolean>(false);

  useEffect(() => {
    userInteracting.current = false;
    if (selectedSystem && SYSTEMS_DATA[selectedSystem]) {
      const info = SYSTEMS_DATA[selectedSystem];
      targetPos.current.set(...info.cameraPosition);
      targetLook.current.set(...info.cameraTarget);
      isTransitioning.current = true;
    } else if (cameraPreset) {
      targetPos.current.set(...cameraPreset.pos);
      targetLook.current.set(...cameraPreset.target);
      isTransitioning.current = true;
    } else {
      targetPos.current.set(0, 0.0, 2.75);
      targetLook.current.set(0, -0.05, 0);
      isTransitioning.current = true;
    }
  }, [selectedSystem, cameraPreset, resetTrigger]);

  useEffect(() => {
    const controls = controlsRef.current;
    if (!controls) return;

    const onStart = () => {
      userInteracting.current = true;
      isTransitioning.current = false;
    };
    const onEnd = () => {
      userInteracting.current = false;
    };

    controls.addEventListener("start", onStart);
    controls.addEventListener("end", onEnd);
    return () => {
      controls.removeEventListener("start", onStart);
      controls.removeEventListener("end", onEnd);
    };
  }, [controlsRef.current]);

  useFrame((state, delta) => {
    if (!controlsRef.current || userInteracting.current || !isTransitioning.current) return;

    const factor = 1 - Math.exp(-delta * 5.0);
    state.camera.position.lerp(targetPos.current, factor);
    controlsRef.current.target.lerp(targetLook.current, factor);
    controlsRef.current.update();

    if (
      state.camera.position.distanceTo(targetPos.current) < 0.005 &&
      controlsRef.current.target.distanceTo(targetLook.current) < 0.005
    ) {
      state.camera.position.copy(targetPos.current);
      controlsRef.current.target.copy(targetLook.current);
      controlsRef.current.update();
      isTransitioning.current = false;
    }
  });

  return null;
};

// All 11 NASA Body Regions
const ALL_11_REGIONS: { id: SystemId; label: string; code: string; color: string }[] = [
  { id: "heart", label: "Cardiovascular", code: "CARDIO-01", color: "#ef4444" },
  { id: "brain", label: "Brain & Cognition", code: "CNS-02", color: "#c084fc" },
  { id: "eyes", label: "Visual (SANS)", code: "SANS-03", color: "#0284c7" },
  { id: "blood", label: "Blood & CBC", code: "HEMA-04", color: "#f43f5e" },
  { id: "immune_system", label: "Immune System", code: "IMM-05", color: "#10b981" },
  { id: "bones", label: "Skeletal System", code: "SKL-06", color: "#fbbf24" },
  { id: "muscles", label: "Muscular System", code: "MUS-07", color: "#be185d" },
  { id: "digestive_system", label: "Gut Microbiome", code: "GI-08", color: "#fb923c" },
  { id: "skin", label: "Skin & Dermal", code: "DERM-09", color: "#a78bfa" },
  { id: "whole_body", label: "Radiation Exposure", code: "SYS-10", color: "#38bdf8" },
  { id: "spacecraft_environment", label: "Spacecraft Cabin", code: "ENV-11", color: "#2dd4bf" },
];

const getStudyPillLabel = (id: string, name: string): string => {
  if (id === "NASA_TWINS_STUDY_2019") return "🛰️ Twins Study";
  if (id === "SPACEX_INSPIRATION4_2024") return "🧬 Inspiration4";
  if (id === "LONG_DURATION_BMD_COHORT_2007") return "🦴 BMD (N=45)";
  if (id === "NASA_BEDREST_ANALOGUE_2017") return "🛏️ Bedrest";
  return name.slice(0, 16);
};

const Simulator: React.FC = () => {
  const [selectedMission, setSelectedMission] = useState<MissionData>(HEALTH_DATA[0]);
  const [currentDay, setCurrentDay] = useState<number>(0);
  const [selectedSystem, setSelectedSystem] = useState<SystemId | null>(null);
  const [hoveredSystem, setHoveredSystem] = useState<SystemId | null>(null);
  const [viewMode, setViewMode] = useState<ViewMode>("split");
  const [cameraPreset, setCameraPreset] = useState<CameraPreset | null>(null);
  const [resetTrigger, setResetTrigger] = useState<number>(0);
  const [showMarkers, setShowMarkers] = useState<boolean>(true);

  // Modals & Panels
  const [showChart, setShowChart] = useState<boolean>(false);
  const [showCatalogueModal, setShowCatalogueModal] = useState<boolean>(false);
  const [showAboutModal, setShowAboutModal] = useState<boolean>(false);
  const [leftNavOpen, setLeftNavOpen] = useState<boolean>(true);
  const [rightPanelOpen, setRightPanelOpen] = useState<boolean>(true);

  const controlsRef = useRef<OrbitControlsImpl | null>(null);
  const datasetValidation = useMemo(() => validateNASAHealthDataset(), []);

  // Universal Reset Event: Restores whole-body camera framing and clears active selection
  const handleResetView = () => {
    setSelectedSystem(null);
    setCameraPreset(null);
    setResetTrigger((prev) => prev + 1);
  };

  const handleSelectMission = (mission: MissionData) => {
    setSelectedMission(mission);
    setCurrentDay(mission.intervals?.[0]?.day ?? 0);
    handleResetView();
  };

  const handleSelectSystem = (id: SystemId | null) => {
    // If clicking the currently active region or explicitly requesting overview, trigger clean reset
    if (id === null || selectedSystem === id) {
      handleResetView();
      return;
    }
    setSelectedSystem(id);
    setCameraPreset(null);
    setResetTrigger((prev) => prev + 1);
    if (!rightPanelOpen) {
      setRightPanelOpen(true);
    }
  };

  const handleSelectPreset = (preset: CameraPreset) => {
    setSelectedSystem(null);
    setCameraPreset(preset);
    setResetTrigger((prev) => prev + 1);
  };

  // Global Keyboard Navigation & Escape Reset Handler
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        if (showChart) {
          setShowChart(false);
        } else if (showAboutModal) {
          setShowAboutModal(false);
        } else if (showCatalogueModal) {
          setShowCatalogueModal(false);
        } else {
          handleResetView();
        }
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [showChart, showAboutModal, showCatalogueModal, selectedSystem]);

  const currentHealthValues = useMemo<HealthMetrics>(() => {
    const intervals = selectedMission.intervals;
    if (!intervals || intervals.length === 0) {
      return { eye: 100, muscle: 100, bones: 100, brain: 100 };
    }
    const match = intervals.find((int) => int.day === currentDay);
    if (match) return match.health;
    return intervals[0].health;
  }, [selectedMission, currentDay]);

  const studyObservations = useMemo(
    () => getObservationsForStudy(selectedMission.id),
    [selectedMission.id]
  );

  return (
    <div className="w-screen h-screen flex flex-col bg-[#020617] text-white font-sans overflow-hidden select-none">
      {/* 1. TOP APP BAR: NASA Navigation & Global Controls */}
      <header className="h-14 border-b border-slate-800/80 bg-slate-950/85 backdrop-blur-xl px-3 sm:px-4 flex items-center justify-between gap-3 shrink-0 z-30">
        {/* Left: Brand Logo & Mission Badge */}
        <div className="flex items-center gap-3">
          <Link
            to="/"
            className="flex items-center gap-2 group transition-transform hover:scale-[1.02]"
            title="Return to SpaceBody Overview"
          >
            <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-cyan-500 to-blue-600 flex items-center justify-center font-mono font-bold text-slate-950 text-sm shadow-[0_0_15px_rgba(6,182,212,0.35)]">
              SB
            </div>
            <div className="hidden lg:block">
              <div className="flex items-center gap-1.5 leading-none">
                <span className="font-mono text-xs font-bold text-white tracking-wider">
                  SPACEBODY
                </span>
                <span className="text-xs font-mono px-1.5 py-0.5 rounded bg-cyan-500/20 text-cyan-300 border border-cyan-500/30">
                  NASA HRP
                </span>
              </div>
              <span className="text-xs font-mono text-slate-400">
                Astronaut Bio-Explorer
              </span>
            </div>
          </Link>

          {/* Toggle Left System Rail */}
          <button
            onClick={() => setLeftNavOpen(!leftNavOpen)}
            className={`px-2.5 py-1.5 rounded-lg border text-xs font-mono transition-colors ${
              leftNavOpen
                ? "bg-slate-800 border-cyan-500/40 text-cyan-300"
                : "bg-slate-900 border-slate-800 text-slate-400 hover:text-white"
            }`}
            title="Toggle Anatomical Systems Rail"
          >
            {leftNavOpen ? "◧ Systems" : "◫ Systems"}
          </button>
        </div>

        {/* Center: 4 Authentic NASA Studies Tabs */}
        <div className="hidden xl:flex items-center gap-1.5 p-1 rounded-xl bg-slate-900/90 border border-slate-800">
          {HEALTH_DATA.map((m) => {
            const isSelected = selectedMission.id === m.id;
            return (
              <button
                key={m.id}
                onClick={() => handleSelectMission(m)}
                title={m.name}
                className={`px-3 py-1.5 rounded-lg text-xs font-mono font-medium transition-all ${
                  isSelected
                    ? "bg-cyan-500 text-slate-950 font-bold shadow-[0_0_12px_rgba(6,182,212,0.35)]"
                    : "text-slate-300 hover:bg-slate-800 hover:text-white"
                }`}
              >
                {getStudyPillLabel(m.id, m.name)}
              </button>
            );
          })}
        </div>

        {/* Right: View Mode, Empirical Charts, About, & Dossier Toggle */}
        <div className="flex items-center gap-2">
          {/* Mobile & Tablet Study Selector */}
          <div className="xl:hidden">
            <select
              value={selectedMission.id}
              onChange={(e) => {
                const target = HEALTH_DATA.find((m) => m.id === e.target.value);
                if (target) handleSelectMission(target);
              }}
              className="px-2.5 py-1.5 rounded-lg text-xs font-mono bg-slate-900 border border-slate-700 text-cyan-300 max-w-[135px] sm:max-w-[170px] truncate"
            >
              {HEALTH_DATA.map((m) => (
                <option key={m.id} value={m.id}>
                  {getStudyPillLabel(m.id, m.name)}
                </option>
              ))}
            </select>
          </div>

          {/* Research Charts Trigger */}
          <button
            onClick={() => setShowChart(!showChart)}
            className={`px-2.5 py-1.5 rounded-xl text-xs font-mono font-medium transition-all flex items-center gap-1.5 border ${
              showChart
                ? "bg-cyan-500 text-slate-950 font-bold border-cyan-400 shadow-[0_0_12px_rgba(6,182,212,0.35)]"
                : "bg-slate-900 border-slate-800 text-cyan-300 hover:bg-slate-800 hover:text-white"
            }`}
            title="Open Scientific Data Charts"
          >
            <span>📊</span>
            <span className="hidden sm:inline">Research Charts</span>
          </button>

          {/* About Challenge Modal Trigger */}
          <button
            onClick={() => setShowAboutModal(true)}
            className="px-2.5 py-1.5 rounded-xl text-xs font-mono border border-slate-800 bg-slate-900/90 text-slate-300 hover:text-white hover:bg-slate-800 transition-colors hidden sm:block"
          >
            About
          </button>

          {/* Dataset Provenance Modal Trigger */}
          <button
            onClick={() => setShowCatalogueModal(true)}
            className="px-2.5 py-1.5 rounded-xl text-xs font-mono border border-slate-800 bg-slate-900/90 text-slate-300 hover:text-white hover:bg-slate-800 transition-colors hidden xl:block"
          >
            Citations ({datasetValidation.counts.sources})
          </button>

          {/* Toggle Right Inspector Panel */}
          <button
            onClick={() => setRightPanelOpen(!rightPanelOpen)}
            className={`px-2.5 py-1.5 rounded-xl text-xs font-mono font-medium border transition-colors ${
              rightPanelOpen
                ? "bg-slate-800 border-cyan-500/40 text-cyan-300"
                : "bg-slate-900 border-slate-800 text-slate-400 hover:text-white"
            }`}
            title="Toggle Right Inspector Panel"
          >
            {rightPanelOpen ? "Dossier ▤" : "Dossier ✕"}
          </button>
        </div>
      </header>

      {/* 2. MAIN WORKSPACE: 3-Column Cockpit Layout */}
      <div className="flex-1 flex overflow-hidden relative">
        {/* LEFT COLUMN: 11 Anatomical Systems Rail */}
        {leftNavOpen && (
          <>
            {/* Mobile/Tablet Backdrop */}
            <div
              className="fixed inset-0 top-14 bg-black/60 z-20 lg:hidden backdrop-blur-sm"
              onClick={() => setLeftNavOpen(false)}
            />
            <aside className="fixed lg:relative inset-y-14 lg:inset-y-0 left-0 w-64 border-r border-slate-800/80 bg-slate-950/95 backdrop-blur-xl flex flex-col shrink-0 z-30 lg:z-20 overflow-hidden select-none shadow-2xl lg:shadow-none">
            {/* Rail Header */}
            <div className="p-3 border-b border-slate-800/80 flex items-center justify-between">
              <span className="text-xs font-mono font-bold uppercase tracking-wider text-slate-400">
                11 Anatomical Regions
              </span>
              <button
                onClick={handleResetView}
                className={`text-xs font-mono px-2.5 py-1 rounded transition-all ${
                  selectedSystem === null
                    ? "bg-cyan-500/20 text-cyan-300 border border-cyan-500/40 font-bold"
                    : "text-slate-400 hover:text-white"
                }`}
              >
                Overview
              </button>
            </div>

            {/* Systems List */}
            <div className="flex-1 overflow-y-auto p-2 space-y-1 scrollbar-none">
              {ALL_11_REGIONS.map((region) => {
                const isSelected = selectedSystem === region.id;
                const isHovered = hoveredSystem === region.id;
                const obsCount = getObservationsForSystem(region.id).length;
                const osdrCount = getOSDRDatasetsForSystem(region.id).length;

                return (
                  <button
                    key={region.id}
                    onClick={() => handleSelectSystem(isSelected ? null : region.id)}
                    onMouseEnter={() => setHoveredSystem(region.id)}
                    onMouseLeave={() => setHoveredSystem(null)}
                    className={`w-full text-left p-2.5 rounded-xl transition-all border flex items-center justify-between gap-2 ${
                      isSelected
                        ? "bg-slate-900 border-cyan-400 text-cyan-300 shadow-[0_0_12px_rgba(6,182,212,0.25)] ring-1 ring-cyan-400/40"
                        : isHovered
                        ? "bg-slate-900/60 border-slate-700 text-white"
                        : "bg-transparent border-transparent text-slate-300 hover:bg-slate-900/40 hover:text-white"
                    }`}
                  >
                    <div className="flex items-center gap-2.5 min-w-0">
                      <span
                        className="w-2.5 h-2.5 rounded-full shrink-0"
                        style={{ backgroundColor: region.color }}
                      />
                      <div className="truncate">
                        <div className="font-mono text-xs sm:text-sm font-semibold leading-tight truncate">
                          {region.label}
                        </div>
                        <div className="text-xs font-mono text-slate-400">
                          {region.code}
                        </div>
                      </div>
                    </div>

                    <div className="flex items-center gap-1 shrink-0 font-mono text-xs">
                      {obsCount > 0 && (
                        <span className="px-2 py-0.5 rounded bg-slate-900 text-cyan-300 border border-slate-800 font-medium">
                          {obsCount}
                        </span>
                      )}
                      {osdrCount > 0 && (
                        <span className="px-2 py-0.5 rounded bg-emerald-950/60 text-emerald-300 border border-emerald-500/20 font-medium">
                          {osdrCount} OSD
                        </span>
                      )}
                    </div>
                  </button>
                );
              })}
            </div>

            {/* Quick Status Pill */}
            <div className="p-3 border-t border-slate-800/80 text-xs font-mono text-slate-400 flex items-center justify-between">
              <span>Raycast Active</span>
              <span className="text-emerald-400 flex items-center gap-1.5 font-medium">
                <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                NASA Verified
              </span>
            </div>
          </aside>
        </>
      )}

        {/* CENTER COLUMN: 3D Bio-Viewport & Scrubber Dock */}
        <main className="flex-1 relative h-full overflow-hidden bg-gradient-to-b from-[#020617] via-[#040f24] to-[#020617] flex flex-col">
          {/* Top Canvas Floating HUD Bar: Responsive Presets & Anatomy Modes */}
          <div className="absolute top-3 inset-x-3 z-10 flex flex-wrap items-center justify-between gap-2 pointer-events-none">
            {/* Camera Presets & Reset Button */}
            <div className="flex flex-wrap items-center gap-1 pointer-events-auto bg-slate-950/85 border border-slate-800 rounded-xl p-1 backdrop-blur-md shadow-lg">
              <span className="text-xs font-mono font-medium text-slate-400 px-2 py-1 hidden sm:inline">
                Focus:
              </span>
              {CAMERA_PRESETS.map((p) => {
                const isActive = cameraPreset?.label === p.label && selectedSystem === null;
                return (
                  <button
                    key={p.label}
                    onClick={() => handleSelectPreset(p)}
                    className={`px-2.5 py-1 rounded-lg text-xs font-mono transition-all border ${
                      isActive
                        ? "bg-cyan-500 text-slate-950 font-bold border-cyan-400 shadow-[0_0_10px_rgba(6,182,212,0.3)]"
                        : "bg-transparent border-transparent text-slate-300 hover:bg-slate-900 hover:text-white"
                    }`}
                  >
                    {p.label}
                  </button>
                );
              })}
              <div className="h-4 w-px bg-slate-800 mx-0.5" />
              <button
                onClick={handleResetView}
                title="Reset Camera & Selection (Esc / Double-Click Canvas)"
                className="px-2.5 py-1 rounded-lg text-xs font-mono transition-all border border-cyan-500/30 bg-cyan-950/40 text-cyan-300 hover:bg-cyan-500/20 hover:text-white flex items-center gap-1 font-semibold shadow-sm"
              >
                <span>↺</span>
                <span>Reset View</span>
              </button>
              <div className="h-4 w-px bg-slate-800 mx-0.5" />
              <button
                onClick={() => setShowMarkers((prev) => !prev)}
                title="Toggle 3D anatomical indicator pins on/off"
                className={`px-2.5 py-1 rounded-lg text-xs font-mono transition-all border flex items-center gap-1.5 font-semibold shadow-sm ${
                  showMarkers
                    ? "border-cyan-500/40 bg-cyan-950/60 text-cyan-300 hover:bg-cyan-500/20"
                    : "border-slate-800 bg-slate-900/60 text-slate-400 hover:text-white hover:bg-slate-800"
                }`}
              >
                <span
                  className={`w-1.5 h-1.5 rounded-full ${
                    showMarkers ? "bg-cyan-400 shadow-[0_0_8px_rgba(6,182,212,0.8)]" : "bg-slate-600"
                  }`}
                />
                <span>Markers: {showMarkers ? "ON" : "OFF"}</span>
              </button>
            </div>

            {/* View Modes (Split / Muscles / Skeleton / Layered) */}
            <div className="flex items-center gap-1 p-1 rounded-xl bg-slate-950/85 border border-slate-800 backdrop-blur-md pointer-events-auto shadow-lg">
              {VIEW_MODES.map((mode) => (
                <button
                  key={mode.id}
                  onClick={() => setViewMode(mode.id)}
                  className={`px-3 py-1 rounded-lg text-xs font-mono transition-all ${
                    viewMode === mode.id
                      ? "bg-slate-800 text-cyan-300 font-bold border border-cyan-500/40 shadow-sm"
                      : "text-slate-400 hover:text-white"
                  }`}
                >
                  {mode.label}
                </button>
              ))}
            </div>
          </div>

          {/* 3D WebGL Canvas Viewport */}
          <div className="flex-1 w-full h-full relative cursor-grab active:cursor-grabbing">
            <Canvas
              camera={{ position: [0, 0.0, 2.75], fov: 42, near: 0.1, far: 100 }}
              onDoubleClick={handleResetView}
              gl={{
                antialias: true,
                alpha: true,
                localClippingEnabled: true,
                toneMapping: THREE.ACESFilmicToneMapping,
                toneMappingExposure: 1.25,
              }}
            >
              <color attach="background" args={["#020617"]} />

              <Stars radius={60} depth={45} count={1400} factor={2.8} saturation={0} fade speed={0.3} />
              <Stars radius={85} depth={60} count={1800} factor={3.2} saturation={0} fade speed={0.2} />

              <ambientLight intensity={0.55} color="#081220" />
              <directionalLight position={[3.5, 4.5, 3.2]} intensity={2.2} color="#fffdfa" />
              <directionalLight position={[0, -3.5, 2.0]} intensity={0.95} color="#0ea5e9" />
              <directionalLight position={[-3.8, 1.8, -2.8]} intensity={2.2} color="#22d3ee" />
              <directionalLight position={[3.2, 2.2, -3.2]} intensity={1.8} color="#38bdf8" />

              <CameraController
                selectedSystem={selectedSystem}
                cameraPreset={cameraPreset}
                resetTrigger={resetTrigger}
                controlsRef={controlsRef}
              />

              <HumanBody
                position={[0, 0, 0]}
                selectedSystem={selectedSystem}
                hoveredSystem={hoveredSystem}
                viewMode={viewMode}
                onSelectSystem={handleSelectSystem}
                onHoverSystem={setHoveredSystem}
                healthValues={currentHealthValues}
                disableFloat={selectedSystem !== null}
              />

              {showMarkers && (
                <HealthIndicatorsPanel
                  selectedSystem={selectedSystem}
                  onSelectSystem={handleSelectSystem}
                  hoveredSystem={hoveredSystem}
                  onHoverSystem={setHoveredSystem}
                />
              )}

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

          {/* Bottom Milestone Dock */}
          <div className="absolute bottom-2 sm:bottom-3 inset-x-2 sm:inset-x-4 z-10 flex justify-center pointer-events-none">
            <div className="w-full max-w-xl pointer-events-auto">
              <TimelineSlider
                mission={selectedMission}
                currentDay={currentDay}
                onSelectDay={setCurrentDay}
                showChart={showChart}
                onToggleChart={() => setShowChart(!showChart)}
              />
            </div>
          </div>
        </main>

        {/* RIGHT COLUMN: Scientific Dossier Inspector */}
        {rightPanelOpen && (
          <>
            {/* Mobile/Tablet Backdrop */}
            <div
              className="fixed inset-0 top-14 bg-black/60 z-20 lg:hidden backdrop-blur-sm"
              onClick={() => setRightPanelOpen(false)}
            />
            <aside className="fixed lg:relative inset-y-14 lg:inset-y-0 right-0 w-full sm:w-96 border-l border-slate-800/80 bg-slate-950/95 backdrop-blur-xl flex flex-col shrink-0 z-30 lg:z-20 overflow-hidden p-4 select-none shadow-2xl lg:shadow-none">
            {selectedSystem && SYSTEMS_DATA[selectedSystem] ? (
              <SystemTelemetryIndicator
                systemInfo={SYSTEMS_DATA[selectedSystem]}
                healthValue={currentHealthValues[SYSTEMS_DATA[selectedSystem].id] ?? 100}
                currentDay={currentDay}
                isSelected={true}
                onSelectSystem={handleSelectSystem}
                onClose={handleResetView}
              />
            ) : (
              /* Overview Dossier when no specific region is active */
              <div className="flex-1 flex flex-col overflow-y-auto space-y-3.5 pr-1 text-slate-100">
                {/* Active Study Banner */}
                <div className="pb-3 border-b border-slate-800">
                  <div className="flex items-center gap-2 mb-1">
                    <span className="w-2 h-2 rounded-full bg-cyan-400 animate-pulse" />
                    <span className="text-xs font-mono font-bold uppercase tracking-wider text-cyan-300">
                      NASA Research Study Dossier
                    </span>
                  </div>
                  <h2 className="text-base font-bold font-mono text-white leading-tight">
                    {selectedMission.study_title || selectedMission.name}
                  </h2>
                  <div className="flex items-center gap-2 mt-1.5 text-xs font-mono text-slate-400">
                    <span className="text-amber-400 font-semibold">{selectedMission.destination}</span>
                    <span>•</span>
                    <span>{selectedMission.durationDays} Flight Days</span>
                  </div>
                </div>

                {/* Key Study Stats */}
                <div className="grid grid-cols-2 gap-2 text-xs font-mono">
                  <div className="p-2.5 rounded-xl bg-slate-900/60 border border-slate-800">
                    <span className="text-slate-400 block mb-0.5">Flight Subject:</span>
                    <span className="font-bold text-slate-200">
                      {selectedMission.flightSubjectCode || selectedMission.astronaut || "Cohort"}
                    </span>
                  </div>
                  <div className="p-2.5 rounded-xl bg-slate-900/60 border border-slate-800">
                    <span className="text-slate-400 block mb-0.5">Control Design:</span>
                    <span className="font-bold text-slate-200 truncate block">
                      {selectedMission.groundControlCode || selectedMission.earthBasedControl || "Pre-flight Baseline"}
                    </span>
                  </div>
                  <div className="p-2.5 rounded-xl bg-slate-900/60 border border-slate-800">
                    <span className="text-slate-400 block mb-0.5">Numerical Findings:</span>
                    <span className="font-bold text-cyan-400">
                      {studyObservations.length} Published
                    </span>
                  </div>
                  <div className="p-2.5 rounded-xl bg-slate-900/60 border border-slate-800">
                    <span className="text-slate-400 block mb-0.5">Evidence Class:</span>
                    <span className="font-bold text-purple-300 truncate block">
                      {selectedMission.id === "NASA_TWINS_STUDY_2019"
                        ? "N-of-1 Long-Duration"
                        : selectedMission.id === "LONG_DURATION_BMD_COHORT_2007"
                        ? "Cohort Mean (N=45)"
                        : "NASA OSDR Multi-Omics"}
                    </span>
                  </div>
                </div>

                {/* Interactive Directive Note */}
                <div className="p-3 rounded-xl bg-cyan-950/20 border border-cyan-500/20 text-xs text-cyan-200/90 leading-relaxed font-mono">
                  Select any of the 11 anatomical regions from the left rail or click directly on the 3D model to inspect empirical findings, biochemical adaptations, and NASA flight countermeasures.
                </div>

                {/* Highlights of Findings for this study */}
                <div className="flex-1 flex flex-col min-h-0">
                  <span className="text-xs font-mono font-bold text-slate-400 uppercase tracking-wider block mb-2">
                    Published Empirical Highlights ({studyObservations.length})
                  </span>

                  <div className="space-y-1.5 overflow-y-auto pr-1 flex-1">
                    {studyObservations.slice(0, 8).map((obs) => {
                      const metricName = getObservationMetricName(obs);
                      const formattedVal = formatObservationValue(obs);

                      return (
                        <div
                          key={obs.observation_id}
                          onClick={() => {
                            const matched = ALL_11_REGIONS.find((r) =>
                              getObservationsForSystem(r.id).some(
                                (o) => o.observation_id === obs.observation_id
                              )
                            );
                            if (matched) handleSelectSystem(matched.id);
                          }}
                          className="p-2.5 rounded-xl bg-slate-900/50 border border-slate-800/80 hover:border-cyan-500/40 cursor-pointer transition-colors text-xs"
                        >
                          <div className="flex items-center justify-between gap-1 mb-0.5">
                            <span className="font-mono text-xs font-bold text-cyan-300 truncate">
                              {metricName}
                            </span>
                            <span className="font-mono text-xs font-bold text-amber-300 shrink-0">
                              {formattedVal}
                            </span>
                          </div>
                          <p className="text-xs text-slate-400 line-clamp-1">
                            {obs.measurement_context || obs.interpretation}
                          </p>
                        </div>
                      );
                    })}
                  </div>
                </div>

                {/* Primary Source Verification */}
                {selectedMission.primary_source_url && (
                  <div className="pt-2.5 border-t border-slate-800 flex items-center justify-between text-xs font-mono shrink-0">
                    <span className="text-slate-400">Primary Literature:</span>
                    <a
                      href={selectedMission.primary_source_url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="font-bold text-cyan-400 hover:text-cyan-300 underline flex items-center gap-1"
                    >
                      <span>View Paper</span>
                      <span>↗</span>
                    </a>
                  </div>
                )}
              </div>
            )}
          </aside>
        </>
      )}
      </div>

      {/* 3. MODALS: Research Charts, About Challenge, & Dataset Citations */}

      {/* Modal 1: Research Charts & Empirical Visualizations */}
      {showChart && (
        <div
          className="fixed inset-0 z-50 bg-black/80 backdrop-blur-md flex items-center justify-center p-4 pointer-events-auto"
          onClick={() => setShowChart(false)}
        >
          <div
            onClick={(e) => e.stopPropagation()}
            className="w-full max-w-3xl max-h-[85vh] overflow-y-auto rounded-3xl bg-slate-950 border border-cyan-500/40 p-5 shadow-[0_0_50px_rgba(6,182,212,0.3)] text-slate-100 space-y-4"
          >
            <div className="flex items-center justify-between pb-2 border-b border-slate-800">
              <div className="flex items-center gap-2">
                <span className="w-2.5 h-2.5 rounded-full bg-cyan-400 shadow-[0_0_8px_#22d3ee]" />
                <h3 className="text-base font-bold font-mono text-white">
                  NASA Empirical Biomedical Visualizer
                </h3>
              </div>
              <button
                onClick={() => setShowChart(false)}
                className="text-slate-400 hover:text-white px-2 py-1 rounded-lg hover:bg-slate-800 text-xs font-mono"
              >
                ✕ Close
              </button>
            </div>

            <HealthTelemetryChart
              mission={selectedMission}
              currentDay={currentDay}
              onSelectDay={setCurrentDay}
              selectedSystem={selectedSystem}
              onSelectSystem={handleSelectSystem}
            />
          </div>
        </div>
      )}

      {/* Modal 2: About NASA Space Apps Challenge Project */}
      {showAboutModal && (
        <div
          className="fixed inset-0 z-50 bg-black/85 backdrop-blur-md flex items-center justify-center p-4 pointer-events-auto"
          onClick={() => setShowAboutModal(false)}
        >
          <div
            onClick={(e) => e.stopPropagation()}
            className="w-full max-w-3xl max-h-[85vh] overflow-y-auto rounded-3xl bg-slate-950 border border-cyan-500/40 p-6 shadow-[0_0_50px_rgba(6,182,212,0.3)] text-slate-100 space-y-5"
          >
            <div className="flex items-start justify-between pb-3 border-b border-slate-800">
              <div>
                <div className="inline-flex items-center gap-2 px-2.5 py-1 rounded-full bg-cyan-950/60 border border-cyan-500/30 text-cyan-300 text-xs font-mono mb-2">
                  <span className="w-2 h-2 rounded-full bg-cyan-400 animate-pulse" />
                  <span>NASA SPACE APPS CHALLENGE 2026</span>
                </div>
                <h2 className="text-xl font-bold font-mono text-white tracking-tight">
                  SpaceBody: 3D Astronaut Health Explorer
                </h2>
                <p className="text-xs text-slate-400 font-mono mt-0.5">
                  Scientific Anatomy & Multi-Omics Atlas for Human Spaceflight
                </p>
              </div>
              <button
                onClick={() => setShowAboutModal(false)}
                className="text-slate-400 hover:text-white p-1.5 rounded-xl hover:bg-slate-800 border border-slate-800 text-sm font-mono"
              >
                ✕ Close
              </button>
            </div>

            {/* Challenge Core Purpose */}
            <div className="space-y-2 text-xs text-slate-300 leading-relaxed font-sans">
              <h3 className="text-sm font-bold font-mono text-cyan-300">
                1. Project Purpose & Challenge Vision
              </h3>
              <p>
                As humanity prepares for long-duration expeditions to the Moon and Mars, understanding human physiological adaptation in microgravity and deep-space radiation is critical. However, NASA biomedical literature is often locked inside dense research papers, static tables, and complex multi-omics repositories.
              </p>
              <p>
                <strong>SpaceBody</strong> bridges this gap by mapping authentic NASA research findings directly onto an interactive, photorealistic 3D human anatomical model across <strong>11 anatomical domains</strong>.
              </p>
            </div>

            {/* Integrated NASA Research Programs */}
            <div className="space-y-2 text-xs">
              <h3 className="text-sm font-bold font-mono text-cyan-300">
                2. Integrated Authentic NASA Research Programs
              </h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                <div className="p-3 rounded-xl bg-slate-900/60 border border-slate-800">
                  <span className="font-mono text-xs font-bold text-white block mb-1">
                    NASA Twins Study (2019)
                  </span>
                  <p className="text-xs text-slate-300 leading-relaxed">
                    Scott Kelly (340 days aboard ISS) vs monozygotic twin Mark Kelly on Earth. Published in <em>Science</em>. Covers radiation (146.34 mSv), telomere dynamics, cognitive metrics, and 91.3% genomic baseline recovery.
                  </p>
                </div>

                <div className="p-3 rounded-xl bg-slate-900/60 border border-slate-800">
                  <span className="font-mono text-xs font-bold text-white block mb-1">
                    SpaceX Inspiration4 (2024)
                  </span>
                  <p className="text-xs text-slate-300 leading-relaxed">
                    First commercial astronaut multi-omics package published in <em>Nature</em>, linked to 10 NASA Open Science Data Repository accessions (OSD-569 to OSD-687) including single-cell RNA-seq and cfDNA.
                  </p>
                </div>

                <div className="p-3 rounded-xl bg-slate-900/60 border border-slate-800">
                  <span className="font-mono text-xs font-bold text-white block mb-1">
                    Mir/ISS Bone Loss Cohort (2007)
                  </span>
                  <p className="text-xs text-slate-300 leading-relaxed">
                    45 astronauts across 56 pre/post-flight DXA scans (LeBlanc et al.). Quantifies monthly bone mineral loss (-1.56%/mo in trochanter) and exponential recovery half-times (~9 months).
                  </p>
                </div>

                <div className="p-3 rounded-xl bg-slate-900/60 border border-slate-800">
                  <span className="font-mono text-xs font-bold text-white block mb-1">
                    UTMB Bedrest Analogue (2017)
                  </span>
                  <p className="text-xs text-slate-300 leading-relaxed">
                    NASA Flight Analogue Research Center study evaluating 70-day -6° head-down tilt bed rest. Investigates circadian disruption, sleep latency, and cephalic fluid redistribution.
                  </p>
                </div>
              </div>
            </div>

            {/* Scientific Ethics & Data Boundaries */}
            <div className="p-3.5 rounded-2xl bg-cyan-950/20 border border-cyan-500/30 text-xs space-y-1.5">
              <span className="font-mono text-xs font-bold text-cyan-300 uppercase tracking-wider block">
                3. Scientific Boundaries & NASA Integrity Rules
              </span>
              <ul className="list-disc list-inside space-y-1 text-slate-300 text-xs leading-relaxed">
                <li><strong>No Synthetic Data:</strong> 0 fabricated measurements and 0 synthetic clinical alert thresholds.</li>
                <li><strong>Research Data, Not Live Telemetry:</strong> All findings are strictly historical, peer-reviewed research observations.</li>
                <li><strong>N-of-1 Transparency:</strong> Clearly separates single-astronaut findings (Twins Study) from 45-astronaut cohort statistics (BMD).</li>
                <li><strong>Verifiable Citations:</strong> Every observation provides a direct clickable link to the primary publication on Science, Nature, PMC, or NASA NTRS.</li>
              </ul>
            </div>
          </div>
        </div>
      )}

      {/* Modal 3: Full-Screen NASA Dataset Catalogue & Provenance Modal */}
      {showCatalogueModal && (
        <div
          className="fixed inset-0 z-50 bg-black/85 backdrop-blur-md flex items-center justify-center p-4 pointer-events-auto"
          onClick={() => setShowCatalogueModal(false)}
        >
          <div
            onClick={(e) => e.stopPropagation()}
            className="w-full max-w-3xl max-h-[85vh] overflow-y-auto rounded-3xl bg-slate-950 border border-cyan-500/40 p-6 shadow-[0_0_50px_rgba(6,182,212,0.3)] text-slate-100 space-y-5"
          >
            <div className="flex items-start justify-between pb-3 border-b border-slate-800">
              <div>
                <div className="flex items-center gap-2">
                  <span className="w-2.5 h-2.5 rounded-full bg-cyan-400 shadow-[0_0_8px_#22d3ee]" />
                  <h2 className="text-lg font-bold font-mono text-cyan-300 tracking-tight">
                    NASA Human Spaceflight Health Research Dataset
                  </h2>
                </div>
                <p className="text-xs text-slate-400 font-mono mt-1">
                  Version 2.0.0 • Verified Primary NASA Research Literature & OSDR
                </p>
              </div>
              <button
                onClick={() => setShowCatalogueModal(false)}
                className="text-slate-400 hover:text-white p-1.5 rounded-xl hover:bg-slate-800 border border-slate-800 text-sm font-mono"
              >
                ✕ Close
              </button>
            </div>

            {/* Verification Stats */}
            <div className="p-3.5 rounded-2xl bg-cyan-950/20 border border-cyan-500/30">
              <span className="text-xs font-mono font-bold text-cyan-300 uppercase tracking-wider block mb-1">
                Data Provenance & Integrity Status
              </span>
              <p className="text-xs text-slate-300 leading-relaxed font-mono">
                {datasetValidation.report}
              </p>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 mt-3 text-center">
                <div className="p-2.5 rounded-xl bg-slate-900/80 border border-slate-800">
                  <span className="text-base font-bold font-mono text-cyan-400">
                    {datasetValidation.counts.missions}
                  </span>
                  <span className="text-xs text-slate-400 block font-mono">Studies</span>
                </div>
                <div className="p-2.5 rounded-xl bg-slate-900/80 border border-slate-800">
                  <span className="text-base font-bold font-mono text-cyan-400">
                    {datasetValidation.counts.observations}
                  </span>
                  <span className="text-xs text-slate-400 block font-mono">Findings</span>
                </div>
                <div className="p-2.5 rounded-xl bg-slate-900/80 border border-slate-800">
                  <span className="text-base font-bold font-mono text-cyan-400">
                    {datasetValidation.counts.osdrDatasets}
                  </span>
                  <span className="text-xs text-slate-400 block font-mono">OSDR Datasets</span>
                </div>
                <div className="p-2.5 rounded-xl bg-slate-900/80 border border-slate-800">
                  <span className="text-base font-bold font-mono text-cyan-400">
                    {datasetValidation.counts.sources}
                  </span>
                  <span className="text-xs text-slate-400 block font-mono">Citations</span>
                </div>
              </div>
            </div>

            {/* OSDR Inspiration4 Studies */}
            <div>
              <h3 className="text-sm font-bold font-mono text-slate-200 mb-2">
                NASA Open Science Data Repository (Inspiration4 OSD-569 to OSD-687)
              </h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                {(HEALTH_DATA.nasa_osdr_inspiration4_datasets as OSDRDatasetItem[] || []).map((ds) => (
                  <div
                    key={ds.accession}
                    className="p-3 rounded-xl bg-slate-900/60 border border-slate-800 hover:border-cyan-500/40 transition-colors"
                  >
                    <div className="flex items-center justify-between mb-1">
                      <a
                        href={ds.study_url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="font-mono text-xs font-bold text-cyan-300 hover:underline flex items-center gap-1"
                      >
                        <span>{ds.accession}</span>
                        <span className="text-xs">↗</span>
                      </a>
                      <span className="text-xs font-mono px-2 py-0.5 rounded bg-slate-800 text-slate-300">
                        {ds.sample_material}
                      </span>
                    </div>
                    <p className="text-xs text-slate-300 font-medium leading-snug mb-1.5">
                      {ds.title}
                    </p>
                    <div className="text-xs text-slate-400 font-mono flex flex-wrap gap-1">
                      {(ds.assays || []).slice(0, 3).map((a) => (
                        <span key={a} className="px-2 py-0.5 rounded bg-slate-950 border border-slate-800">
                          {a}
                        </span>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Primary Sources with Clickable URLs */}
            <div>
              <h3 className="text-sm font-bold font-mono text-slate-200 mb-2">
                Primary Scientific Source Citations & DOIs ({datasetValidation.counts.sources})
              </h3>
              <div className="space-y-1.5 max-h-48 overflow-y-auto pr-1">
                {(HEALTH_DATA.sources as StudySource[] || []).map((src) => (
                  <div
                    key={src.source_id}
                    className="p-2.5 rounded-lg bg-slate-900/40 border border-slate-800/80 flex items-center justify-between gap-3 text-xs"
                  >
                    <div className="min-w-0">
                      <span className="font-mono text-xs text-cyan-400 block truncate">
                        {src.source_id}
                      </span>
                      <p className="text-xs text-slate-300 truncate">{src.title}</p>
                    </div>
                    {src.url && (
                      <a
                        href={src.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="shrink-0 px-2.5 py-1 rounded-lg bg-cyan-500/10 border border-cyan-500/30 text-cyan-300 hover:bg-cyan-500/20 text-xs font-mono"
                      >
                        Source ↗
                      </a>
                    )}
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Simulator;

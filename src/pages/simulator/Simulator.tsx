import React, { useState, useRef, useMemo } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { OrbitControls, Stars, Sparkles } from "@react-three/drei";
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
  type MissionData,
} from "../../../health-data";
import HealthIndicatorsPanel from "./components/HealthIndicatorsPanel";
import TimelineSlider from "./components/TimelineSlider";
import HealthTelemetryChart from "./components/HealthTelemetryChart";

interface CameraControllerProps {
  selectedSystem: SystemId | null;
  controlsRef: React.RefObject<OrbitControlsImpl | null>;
}

const CameraController: React.FC<CameraControllerProps> = ({
  selectedSystem,
  controlsRef,
}) => {
  const defaultPos = useMemo(() => new THREE.Vector3(0, 0.0, 2.85), []);
  const defaultTarget = useMemo(() => new THREE.Vector3(0, -0.05, 0), []);

  useFrame((state, delta) => {
    if (!controlsRef.current) return;

    let targetPos = defaultPos;
    let targetLook = defaultTarget;

    if (selectedSystem && SYSTEMS_DATA[selectedSystem]) {
      const info = SYSTEMS_DATA[selectedSystem];
      targetPos = new THREE.Vector3(...info.cameraPosition);
      targetLook = new THREE.Vector3(...info.cameraTarget);
    }

    const factor = 1 - Math.exp(-delta * 4.2);
    state.camera.position.lerp(targetPos, factor);
    controlsRef.current.target.lerp(targetLook, factor);
    controlsRef.current.update();
  });

  return null;
};

const Simulator: React.FC = () => {
  const [selectedMission, setSelectedMission] = useState<MissionData>(
    HEALTH_DATA[0]
  );
  const [currentDay, setCurrentDay] = useState<number>(0);
  const [isPlaying, setIsPlaying] = useState<boolean>(false);
  const [showChart, setShowChart] = useState<boolean>(false);

  const [selectedSystem, setSelectedSystem] = useState<SystemId | null>(null);
  const [hoveredSystem, setHoveredSystem] = useState<SystemId | null>(null);
  const viewMode: ViewMode = "split";
  const [theme, setTheme] = useState<"studio" | "dark">("dark");
  const controlsRef = useRef<OrbitControlsImpl | null>(null);

  const handleSelectMission = (mission: MissionData) => {
    setSelectedMission(mission);
    setCurrentDay(0);
    setIsPlaying(false);
  };

  const currentHealthValues = useMemo(() => {
    const intervals = selectedMission.intervals;
    if (!intervals || intervals.length === 0) {
      return { eye: 100, muscle: 100, bones: 100, brain: 100 };
    }
    const match = intervals.find((int) => int.day === currentDay);
    if (match) return match.health;

    const sorted = [...intervals].sort((a, b) => a.day - b.day);
    if (currentDay <= sorted[0].day) return sorted[0].health;
    if (currentDay >= sorted[sorted.length - 1].day) {
      return sorted[sorted.length - 1].health;
    }

    for (let i = 0; i < sorted.length - 1; i++) {
      const p1 = sorted[i];
      const p2 = sorted[i + 1];
      if (currentDay >= p1.day && currentDay <= p2.day) {
        const span = p2.day - p1.day;
        const t = span === 0 ? 0 : (currentDay - p1.day) / span;
        return {
          eye: p1.health.eye + (p2.health.eye - p1.health.eye) * t,
          muscle: p1.health.muscle + (p2.health.muscle - p1.health.muscle) * t,
          bones: p1.health.bones + (p2.health.bones - p1.health.bones) * t,
          brain: p1.health.brain + (p2.health.brain - p1.health.brain) * t,
        };
      }
    }
    return sorted[0].health;
  }, [selectedMission, currentDay]);

  return (
    <div
      className={`w-screen h-screen overflow-hidden relative select-none transition-colors duration-500 ${
        theme === "studio"
          ? "bg-gradient-to-b from-white via-slate-50 to-slate-200 text-slate-800"
          : "bg-[#020617] text-white"
      }`}
    >
      {/* NASA Space Apps Minimalist Cosmic Background Ambient Gradients */}
      {theme === "dark" && (
        <div className="absolute inset-0 pointer-events-none overflow-hidden z-0">
          <div className="absolute -top-40 -left-40 w-[32rem] h-[32rem] rounded-full bg-cyan-600/8 blur-[130px]" />
          <div className="absolute -bottom-40 -right-40 w-[34rem] h-[34rem] rounded-full bg-indigo-600/7 blur-[140px]" />
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[48rem] h-[48rem] rounded-full bg-sky-500/4 blur-[160px]" />
        </div>
      )}

      {/* NASA Mission Control Minimalist Corner Reticles & Coordinate Readouts */}
      {theme === "dark" && (
        <div className="absolute inset-0 pointer-events-none z-10 select-none overflow-hidden">
          {/* 4 Viewport Corner Reticle Brackets */}
          <span className="absolute top-3 left-3 text-cyan-500/25 font-mono text-sm leading-none font-light">
            +
          </span>
          <span className="absolute top-3 right-3 text-cyan-500/25 font-mono text-sm leading-none font-light">
            +
          </span>
          <span className="absolute bottom-3 left-3 text-cyan-500/25 font-mono text-sm leading-none font-light">
            +
          </span>
          <span className="absolute bottom-3 right-3 text-cyan-500/25 font-mono text-sm leading-none font-light">
            +
          </span>

          {/* Bottom Left Orbit Status Readout */}
          <div className="absolute bottom-3.5 left-6 hidden lg:flex items-center gap-2 text-[9px] font-mono text-cyan-500/35 tracking-wider uppercase">
            <span className="w-1 h-1 rounded-full bg-cyan-400/40" />
            <span>LEO 418 KM • INCL: 51.6° • PERIOD: 92.9 MIN</span>
          </div>

          {/* Bottom Right Bio-Telemetry Status */}
          <div className="absolute bottom-3.5 right-6 hidden lg:flex items-center gap-2 text-[9px] font-mono text-cyan-500/35 tracking-wider uppercase">
            <span>NASA-HRP BIO-SIMULATION</span>
            <span className="w-1 h-1 rounded-full bg-emerald-400/40" />
          </div>
        </div>
      )}
      <div className="absolute top-4 left-5 right-5 z-20 flex flex-wrap items-start justify-between gap-3 pointer-events-none">
        <div className="flex flex-col items-start gap-2.5 pointer-events-auto w-52 max-w-[90vw]">
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

          <div
            className={`w-full rounded-2xl backdrop-blur-xl border p-2.5 shadow-xl transition-all ${
              theme === "studio"
                ? "bg-white/90 border-slate-200 text-slate-800 shadow-slate-300/40"
                : "bg-slate-950/85 border-slate-800 text-slate-100 shadow-cyan-950/30"
            }`}
          >
            <div className="pb-2 mb-2 border-b border-slate-200/60 dark:border-slate-800/80">
              <span className="text-[10px] font-mono font-bold uppercase tracking-wider text-slate-400 block mb-1.5 px-1">
                Mission Dataset
              </span>
              <ul className="space-y-1">
                {HEALTH_DATA.map((m) => {
                  const isSelected = selectedMission.id === m.id;
                  return (
                    <li key={m.id}>
                      <button
                        onClick={() => handleSelectMission(m)}
                        className={`w-full text-left px-2.5 py-1.5 rounded-xl text-xs font-semibold transition-all border ${
                          isSelected
                            ? theme === "studio"
                              ? "bg-sky-50 border-sky-400 text-sky-700 shadow-sm"
                              : "bg-slate-800/90 border-cyan-400 text-cyan-300 shadow-sm ring-1 ring-cyan-400/40"
                            : theme === "studio"
                            ? "bg-slate-50/70 border-slate-200/60 hover:border-slate-300 text-slate-700"
                            : "bg-slate-900/40 border-slate-800/60 hover:border-slate-700 text-slate-300"
                        }`}
                      >
                        <div className="flex items-center justify-between">
                          <span className="truncate">{m.name}</span>
                          {isSelected && (
                            <span className="w-1.5 h-1.5 rounded-full bg-cyan-400 shrink-0" />
                          )}
                        </div>
                        <div className="text-[10px] text-slate-400 font-mono mt-0.5 font-normal">
                          {m.destination} • {m.durationDays}d
                        </div>
                      </button>
                    </li>
                  );
                })}
              </ul>
            </div>

            <div>
              <div className="flex items-center justify-between px-1 mb-1.5">
                <span className="text-[10px] font-mono font-bold uppercase tracking-wider text-slate-400">
                  Anatomy Focus
                </span>
                {selectedSystem && (
                  <button
                    onClick={() => setSelectedSystem(null)}
                    className="text-[10px] font-mono text-sky-600 dark:text-cyan-400 hover:underline"
                  >
                    Reset
                  </button>
                )}
              </div>

              <ul className="space-y-1">
                {(
                  [
                    { id: null, label: "Full Body", color: "#64748b" },
                    { id: "bones", label: "Bones", color: "#d97706" },
                    { id: "muscles", label: "Muscle", color: "#be185d" },
                    { id: "brain", label: "Brain", color: "#9333ea" },
                    { id: "eyes", label: "Eye", color: "#0284c7" },
                  ] as const
                ).map((item) => {
                  const isSelected = selectedSystem === item.id;
                  const isHovered = hoveredSystem === item.id;

                  return (
                    <li key={item.label}>
                      <button
                        onClick={() =>
                          setSelectedSystem(
                            isSelected && item.id !== null ? null : item.id
                          )
                        }
                        onMouseEnter={() =>
                          item.id && setHoveredSystem(item.id)
                        }
                        onMouseLeave={() =>
                          item.id && setHoveredSystem(null)
                        }
                        className={`w-full text-left px-2.5 py-1.5 rounded-xl text-xs font-semibold transition-all flex items-center justify-between border ${
                          isSelected
                            ? theme === "studio"
                              ? "bg-sky-50 border-sky-400 text-sky-700 shadow-sm"
                              : "bg-slate-800/90 border-cyan-400 text-cyan-300 shadow-sm ring-1 ring-cyan-400/40"
                            : isHovered
                            ? theme === "studio"
                              ? "bg-slate-100 border-slate-300 text-slate-900"
                              : "bg-slate-900 border-slate-700 text-slate-200"
                            : theme === "studio"
                            ? "bg-slate-50/70 border-slate-200/60 hover:border-slate-300 text-slate-700"
                            : "bg-slate-900/40 border-slate-800/60 hover:border-slate-700 text-slate-300"
                        }`}
                      >
                        <div className="flex items-center gap-2">
                          <span
                            className="w-2 h-2 rounded-full shrink-0"
                            style={{ backgroundColor: item.color }}
                          />
                          <span>{item.label}</span>
                        </div>
                        {isSelected && (
                          <span className="text-[9px] font-mono font-bold uppercase tracking-wider text-sky-600 dark:text-cyan-400">
                            Active
                          </span>
                        )}
                      </button>
                    </li>
                  );
                })}
              </ul>
            </div>
          </div>
        </div>

        <div className="flex items-center gap-2 pointer-events-auto">
          <div
            className={`px-3 py-2 rounded-xl text-xs font-semibold backdrop-blur-md border transition-all flex items-center gap-1.5 shadow-sm ${
              theme === "studio"
                ? "bg-white/90 text-sky-700 border-slate-300"
                : "bg-slate-900/80 text-cyan-300 border-cyan-500/30"
            }`}
          >
            <span className="w-2 h-2 rounded-full bg-cyan-400 inline-block shadow-[0_0_6px_#22d3ee]" />
            <span>Split Anatomy</span>
          </div>

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
                <span className="hidden sm:inline">Lab Light</span>
              </>
            ) : (
              <>
                <span className="w-2.5 h-2.5 rounded-full bg-cyan-400 inline-block shadow-[0_0_8px_#22d3ee]" />
                <span className="hidden sm:inline">Cosmic Void</span>
              </>
            )}
          </button>
        </div>
      </div>

      <div className="absolute bottom-5 left-1/2 -translate-x-1/2 z-20 flex flex-col items-center gap-2.5 w-[92%] max-w-xl pointer-events-auto">
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

      <Canvas
        camera={{
          position: [0, 0.0, 2.85],
          fov: 42,
          near: 0.1,
          far: 100,
        }}
        gl={{
          antialias: true,
          alpha: true,
          localClippingEnabled: true,
          toneMapping: THREE.ACESFilmicToneMapping,
          toneMappingExposure: theme === "studio" ? 1.05 : 1.25,
        }}
        onPointerMissed={() => setSelectedSystem(null)}
      >
        <color
          attach="background"
          args={[theme === "studio" ? "#f8fafc" : "#020617"]}
        />

        {theme === "studio" ? (
          <>
            <ambientLight intensity={0.9} color="#ffffff" />
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
            {/* Minimalist NASA Cosmic Starfield */}
            <Stars
              radius={60}
              depth={45}
              count={1600}
              factor={3.0}
              saturation={0}
              fade
              speed={0.4}
            />

            {/* Microgravity Space Ambient Floating Particles */}
            <Sparkles
              count={55}
              scale={[2.6, 3.4, 2.6]}
              size={1.6}
              speed={0.25}
              opacity={0.32}
              color="#38bdf8"
            />

            {/* Distant Earth Horizon Atmospheric Rim (Low Earth Orbit view) */}
            <group position={[0, -23.4, -6.0]}>
              <mesh>
                <sphereGeometry args={[22, 64, 48]} />
                <meshStandardMaterial
                  color="#051329"
                  roughness={0.92}
                  metalness={0.05}
                />
              </mesh>
              {/* Earth Atmospheric Glow Arc */}
              <mesh scale={[1.004, 1.004, 1.004]}>
                <sphereGeometry args={[22, 64, 48]} />
                <meshBasicMaterial
                  color="#0284c7"
                  transparent
                  opacity={0.15}
                  side={THREE.BackSide}
                />
              </mesh>
            </group>

            {/* Minimalist Holographic Telemetry Orbital Platform */}
            <group position={[0, -0.918, 0]}>
              <mesh rotation={[-Math.PI / 2, 0, 0]}>
                <ringGeometry args={[0.26, 0.262, 64]} />
                <meshBasicMaterial color="#38bdf8" transparent opacity={0.25} />
              </mesh>
              <mesh rotation={[-Math.PI / 2, 0, 0]}>
                <ringGeometry args={[0.54, 0.542, 64]} />
                <meshBasicMaterial color="#0284c7" transparent opacity={0.16} />
              </mesh>
              <mesh rotation={[-Math.PI / 2, 0, 0]}>
                <ringGeometry args={[0.82, 0.822, 64]} />
                <meshBasicMaterial color="#0369a1" transparent opacity={0.10} />
              </mesh>
              <mesh rotation={[-Math.PI / 2, 0, 0]}>
                <planeGeometry args={[1.7, 0.0012]} />
                <meshBasicMaterial color="#0284c7" transparent opacity={0.12} />
              </mesh>
              <mesh rotation={[-Math.PI / 2, 0, Math.PI / 2]}>
                <planeGeometry args={[1.7, 0.0012]} />
                <meshBasicMaterial color="#0284c7" transparent opacity={0.12} />
              </mesh>
            </group>

            {/* Space Lighting: Direct Space Sunlight + Oceanic Earth-Shine Fill */}
            <ambientLight intensity={0.55} color="#0c1728" />
            <directionalLight
              position={[3.2, 4.2, 3.0]}
              intensity={1.9}
              color="#fffef7"
            />
            <directionalLight
              position={[-3.0, 1.2, 2.2]}
              intensity={1.1}
              color="#38bdf8"
            />
            <directionalLight
              position={[0, 4.0, -3.8]}
              intensity={2.0}
              color="#67e8f9"
            />
            <directionalLight
              position={[0, -3.0, 1.2]}
              intensity={0.35}
              color="#082f49"
            />
          </>
        )}

        <CameraController
          selectedSystem={selectedSystem}
          controlsRef={controlsRef}
        />

        <HumanBody
          position={[0, 0, 0]}
          selectedSystem={selectedSystem}
          hoveredSystem={hoveredSystem}
          viewMode={viewMode}
          onSelectSystem={setSelectedSystem}
          onHoverSystem={setHoveredSystem}
          healthValues={currentHealthValues}
        />

        <HealthIndicatorsPanel
          healthValues={currentHealthValues}
          selectedMission={selectedMission}
          currentDay={currentDay}
          selectedSystem={selectedSystem}
          onSelectSystem={setSelectedSystem}
          hoveredSystem={hoveredSystem}
          onHoverSystem={setHoveredSystem}
          theme={theme}
        />

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

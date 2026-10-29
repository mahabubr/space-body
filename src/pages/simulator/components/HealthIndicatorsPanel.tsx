import React from "react";
import * as THREE from "three";
import { Html } from "@react-three/drei";
import type { HealthMetrics, MissionData } from "../../../../health-data";
import type { SystemId } from "../../../components/human/internal/system-data";
import { SYSTEMS_DATA } from "../../../components/human/internal/system-data";
import SystemTelemetryIndicator from "./SystemTelemetryIndicator";

interface HealthIndicatorsPanelProps {
  healthValues: HealthMetrics;
  selectedMission: MissionData;
  currentDay: number;
  selectedSystem: SystemId | null;
  onSelectSystem: (system: SystemId | null) => void;
  hoveredSystem: SystemId | null;
  onHoverSystem: (system: SystemId | null) => void;
}

interface SystemIndicatorConfig {
  id: SystemId;
  key: keyof HealthMetrics;
  label: string;
  code: string;
  color: string;
  darkColor: string;
  anchor: [number, number, number];
  line: {
    side: "left" | "right";
    elbowX: number;
    elbowY: number;
    endX: number;
    endY: number;
  };
}

const SYSTEMS_CONFIG: SystemIndicatorConfig[] = [
  {
    id: "brain",
    key: "brain",
    label: "Brain / CNS",
    code: "CNS-01",
    color: "#9333ea",
    darkColor: "#c084fc",
    anchor: [0.0, 0.816, -0.016],
    line: {
      side: "left",
      elbowX: -50,
      elbowY: 18,
      endX: -130,
      endY: 18,
    },
  },
  {
    id: "eyes",
    key: "eye",
    label: "Visual System (SANS)",
    code: "SANS-02",
    color: "#0284c7",
    darkColor: "#38bdf8",
    anchor: [0.0265, 0.776, 0.046],
    line: {
      side: "right",
      elbowX: 50,
      elbowY: 22,
      endX: 130,
      endY: 22,
    },
  },
  {
    id: "bones",
    key: "bones",
    label: "Skeletal System",
    code: "SKL-03",
    color: "#d97706",
    darkColor: "#fbbf24",
    anchor: [-0.095, -0.19, -0.03],
    line: {
      side: "left",
      elbowX: -45,
      elbowY: 0,
      endX: -125,
      endY: 0,
    },
  },
  {
    id: "muscles",
    key: "muscle",
    label: "Muscular System",
    code: "MUS-04",
    color: "#be185d",
    darkColor: "#f43f5e",
    anchor: [0.095, -0.1, 0.03],
    line: {
      side: "right",
      elbowX: 45,
      elbowY: 0,
      endX: 125,
      endY: 0,
    },
  },
];

export const HealthIndicatorsPanel: React.FC<HealthIndicatorsPanelProps> = ({
  healthValues,
  selectedMission,
  currentDay,
  selectedSystem,
  onSelectSystem,
  hoveredSystem,
  onHoverSystem,
}) => {
  return (
    <group name="health-indicators-group">
      {SYSTEMS_CONFIG.map((sys) => {
        const systemInfo = SYSTEMS_DATA[sys.id];
        const val = healthValues[sys.key] ?? 100;
        const isSelected = selectedSystem === sys.id;
        const isHovered = hoveredSystem === sys.id;

        const description = selectedMission.description
          ? sys.id === "eyes"
            ? selectedMission.description.eye
            : sys.id === "muscles"
            ? selectedMission.description.muscle
            : sys.id === "bones"
            ? selectedMission.description.bones
            : selectedMission.description.brain
          : null;

        const isOptimal = val >= 98;
        const isAdapting = val >= 93 && val < 98;
        const statusColor = isOptimal
          ? "#10b981" // Emerald: 100% High Health / Nominal
          : isAdapting
          ? "#f59e0b" // Amber: Adapting
          : "#f43f5e"; // Rose: Critical Loss

        const strokeColor = isSelected
          ? statusColor
          : isHovered
          ? "rgba(56, 189, 248, 0.85)"
          : "rgba(148, 163, 184, 0.35)";

        return (
          <group key={sys.id} position={sys.anchor}>
            {/* 3D Anchor Glow Nodes */}
            <mesh>
              <sphereGeometry args={[0.0075, 16, 16]} />
              <meshBasicMaterial
                color={statusColor}
                transparent
                opacity={isSelected ? 1.0 : isHovered ? 0.95 : 0.82}
              />
            </mesh>
            {isSelected && (
              <mesh>
                <ringGeometry args={[0.012, 0.0145, 24]} />
                <meshBasicMaterial
                  color={statusColor}
                  transparent
                  opacity={0.85}
                  side={THREE.DoubleSide}
                />
              </mesh>
            )}

            <Html center style={{ pointerEvents: "none" }} zIndexRange={[20, 0]}>
              <div
                className={`relative pointer-events-none select-none transition-opacity duration-300 ${
                  selectedSystem && !isSelected && !isHovered
                    ? "opacity-30 hover:opacity-100"
                    : "opacity-100"
                }`}
                onMouseEnter={() => onHoverSystem(sys.id)}
                onMouseLeave={() => onHoverSystem(null)}
              >
                {/* 2D Anchor beacon on body */}
                <div
                  className={`absolute -translate-x-1/2 -translate-y-1/2 rounded-full transition-all duration-300 ${
                    isSelected ? "w-3 h-3 ring-2 ring-white/90" : "w-2.5 h-2.5 opacity-90"
                  }`}
                  style={{
                    backgroundColor: statusColor,
                    boxShadow: isSelected
                      ? `0 0 12px ${statusColor}`
                      : `0 0 6px ${statusColor}aa`,
                  }}
                />
                {/* Sonar beacon ripple */}
                <div
                  className="absolute -translate-x-1/2 -translate-y-1/2 w-4 h-4 rounded-full border animate-ping pointer-events-none opacity-40"
                  style={{ borderColor: statusColor }}
                />

                {/* Cybernetic Telemetry Laser Conduit & Data Stream */}
                <svg
                  className="absolute overflow-visible pointer-events-none"
                  style={{ left: 0, top: 0, width: 1, height: 1 }}
                >
                  <defs>
                    <filter id={`laser-glow-${sys.id}`} x="-20%" y="-20%" width="140%" height="140%">
                      <feDropShadow dx="0" dy="0" stdDeviation="3" floodColor={statusColor} floodOpacity={0.6} />
                    </filter>
                  </defs>

                  {/* Base Conduit Path */}
                  <path
                    d={`M 0 0 L ${sys.line.elbowX} ${sys.line.elbowY} L ${sys.line.endX} ${sys.line.endY}`}
                    fill="none"
                    stroke={strokeColor}
                    strokeWidth={isSelected ? 2.0 : isHovered ? 1.6 : 1.2}
                    strokeOpacity={isSelected ? 0.95 : isHovered ? 0.85 : 0.4}
                    style={{
                      transition: "all 0.3s ease",
                    }}
                  />

                  {/* Streaming Telemetry Energy Packets */}
                  <path
                    d={`M 0 0 L ${sys.line.elbowX} ${sys.line.elbowY} L ${sys.line.endX} ${sys.line.endY}`}
                    fill="none"
                    stroke={statusColor}
                    strokeWidth={isSelected ? 2.5 : 1.8}
                    strokeDasharray={isSelected ? "8 20" : "5 25"}
                    className="animate-energy-flow"
                    filter={`url(#laser-glow-${sys.id})`}
                    style={{
                      opacity: isSelected ? 1.0 : isHovered ? 0.85 : 0.5,
                      transition: "all 0.3s ease",
                    }}
                  />

                  {/* Chamfered Elbow Joint Node */}
                  <circle
                    cx={sys.line.elbowX}
                    cy={sys.line.elbowY}
                    r={isSelected ? 3.0 : 2.0}
                    fill={statusColor}
                    stroke="rgba(255,255,255,0.8)"
                    strokeWidth={0.75}
                  />

                  {/* Card Dock Terminal Pin */}
                  <circle
                    cx={sys.line.endX}
                    cy={sys.line.endY}
                    r={isSelected ? 3.5 : 2.5}
                    fill={statusColor}
                    filter={`drop-shadow(0 0 5px ${statusColor})`}
                  />

                  {/* Coordinate System Identification Tag */}
                  <text
                    x={sys.line.elbowX + (sys.line.side === "left" ? -4 : 4)}
                    y={sys.line.elbowY - 5}
                    textAnchor={sys.line.side === "left" ? "end" : "start"}
                    fill={isSelected ? statusColor : "rgba(148, 163, 184, 0.75)"}
                    fontSize="8.5"
                    fontFamily="JetBrains Mono, monospace"
                    fontWeight="600"
                    letterSpacing="0.05em"
                  >
                    {sys.code}
                  </text>
                </svg>

                {/* Floating Telemetry Card Container */}
                <div
                  style={{
                    position: "absolute",
                    left: `${sys.line.endX}px`,
                    top: `${sys.line.endY}px`,
                    transform:
                      sys.line.side === "left"
                        ? "translate(-100%, -50%)"
                        : "translate(0%, -50%)",
                  }}
                  className="pointer-events-auto"
                >
                  <SystemTelemetryIndicator
                    systemInfo={systemInfo}
                    healthValue={val}
                    currentDay={currentDay}
                    description={description}
                    isSelected={isSelected}
                    isHovered={isHovered}
                    onSelectSystem={(id) =>
                      onSelectSystem(isSelected ? null : id)
                    }
                    onClose={() => onSelectSystem(null)}
                  />
                </div>
              </div>
            </Html>
          </group>
        );
      })}
    </group>
  );
};

export default HealthIndicatorsPanel;

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
  theme: "studio" | "dark";
}

interface SystemIndicatorConfig {
  id: SystemId;
  key: keyof HealthMetrics;
  label: string;
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
    color: "#9333ea",
    darkColor: "#c084fc",
    anchor: [-0.015, 0.825, -0.02],
    line: {
      side: "left",
      elbowX: -36,
      elbowY: -45,
      endX: -115,
      endY: -45,
    },
  },
  {
    id: "eyes",
    key: "eye",
    label: "Visual System (SANS)",
    color: "#0284c7",
    darkColor: "#38bdf8",
    anchor: [0.0325, 0.7689, 0.048],
    line: {
      side: "right",
      elbowX: 36,
      elbowY: -35,
      endX: 115,
      endY: -35,
    },
  },
  {
    id: "bones",
    key: "bones",
    label: "Skeletal System",
    color: "#d97706",
    darkColor: "#fbbf24",
    anchor: [-0.09, -0.16, 0.0],
    line: {
      side: "left",
      elbowX: -40,
      elbowY: -15,
      endX: -120,
      endY: -15,
    },
  },
  {
    id: "muscles",
    key: "muscle",
    label: "Muscular System",
    color: "#be185d",
    darkColor: "#f43f5e",
    anchor: [0.1, 0.06, 0.04],
    line: {
      side: "right",
      elbowX: 40,
      elbowY: 25,
      endX: 120,
      endY: 25,
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
  theme,
}) => {
  const isDark = theme === "dark";

  return (
    <group name="health-indicators-group">
      {SYSTEMS_CONFIG.map((sys) => {
        const systemInfo = SYSTEMS_DATA[sys.id];
        const val = healthValues[sys.key] ?? 100;
        const isSelected = selectedSystem === sys.id;
        const isHovered = hoveredSystem === sys.id;
        const isActive = isSelected || isHovered;

        const description = selectedMission.description
          ? sys.id === "eyes"
            ? selectedMission.description.eye
            : sys.id === "muscles"
            ? selectedMission.description.muscle
            : sys.id === "bones"
            ? selectedMission.description.bones
            : selectedMission.description.brain
          : null;

        const strokeColor = isActive
          ? isDark
            ? sys.darkColor
            : sys.color
          : isDark
          ? "rgba(148, 163, 184, 0.45)"
          : "rgba(100, 116, 139, 0.45)";

        const accentColor = isDark ? sys.darkColor : sys.color;

        return (
          <group key={sys.id} position={sys.anchor}>
            {/* 3D Anchor Glow Marker on anatomical organ */}
            <mesh>
              <sphereGeometry args={[0.007, 16, 16]} />
              <meshBasicMaterial
                color={accentColor}
                transparent
                opacity={isActive ? 1.0 : 0.75}
              />
            </mesh>
            {isActive && (
              <mesh>
                <ringGeometry args={[0.012, 0.015, 24]} />
                <meshBasicMaterial
                  color={accentColor}
                  transparent
                  opacity={0.8}
                  side={THREE.DoubleSide}
                />
              </mesh>
            )}

            {/* 2D Connected Callout HUD with integrated SystemTelemetryIndicator */}
            <Html center style={{ pointerEvents: "none" }} zIndexRange={[20, 0]}>
              <div
                className={`relative pointer-events-none select-none transition-opacity duration-300 ${
                  selectedSystem && !isSelected && !isHovered
                    ? "opacity-40 hover:opacity-100"
                    : "opacity-100"
                }`}
                onMouseEnter={() => onHoverSystem(sys.id)}
                onMouseLeave={() => onHoverSystem(null)}
              >
                {/* Glowing Anchor Beacon on the body */}
                <div
                  className={`absolute -translate-x-1/2 -translate-y-1/2 rounded-full transition-all ${
                    isActive ? "w-3 h-3 ring-2" : "w-2 h-2 opacity-80"
                  }`}
                  style={{
                    backgroundColor: accentColor,
                    boxShadow: isActive ? `0 0 10px ${accentColor}` : undefined,
                  }}
                />
                {isActive && (
                  <div
                    className="absolute -translate-x-1/2 -translate-y-1/2 w-5 h-5 rounded-full border animate-ping opacity-60"
                    style={{ borderColor: accentColor }}
                  />
                )}

                {/* Angled SVG Leader Line */}
                <svg
                  className="absolute overflow-visible pointer-events-none"
                  style={{ left: 0, top: 0, width: 1, height: 1 }}
                >
                  <path
                    d={`M 0 0 L ${sys.line.elbowX} ${sys.line.elbowY} L ${sys.line.endX} ${sys.line.endY}`}
                    fill="none"
                    stroke={strokeColor}
                    strokeWidth={isActive ? 2 : 1.25}
                    strokeDasharray={isActive ? "none" : "3 2"}
                    style={{
                      filter: isActive
                        ? `drop-shadow(0 0 4px ${accentColor})`
                        : "none",
                      transition: "all 0.3s ease",
                    }}
                  />
                  <circle
                    cx={sys.line.elbowX}
                    cy={sys.line.elbowY}
                    r={isActive ? 2.5 : 2}
                    fill={strokeColor}
                  />
                  <circle
                    cx={sys.line.endX}
                    cy={sys.line.endY}
                    r={isActive ? 3 : 2}
                    fill={accentColor}
                  />
                </svg>

                {/* Floating Telemetry Card connecting directly to SystemTelemetryIndicator */}
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
                    theme={theme}
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

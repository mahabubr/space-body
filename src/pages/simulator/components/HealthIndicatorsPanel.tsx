import React from "react";
import * as THREE from "three";
import { Html } from "@react-three/drei";
import type { SystemId } from "../../../components/human/internal/system-data";
import { SYSTEMS_DATA } from "../../../components/human/internal/system-data";
import {
  getObservationsForSystem,
  getOSDRDatasetsForSystem,
} from "../../../../health-data";

interface HealthIndicatorsPanelProps {
  selectedSystem: SystemId | null;
  onSelectSystem: (system: SystemId | null) => void;
  hoveredSystem: SystemId | null;
  onHoverSystem: (system: SystemId | null) => void;
}

interface SystemPinConfig {
  id: SystemId;
  label: string;
  code: string;
  color: string;
  anchor: [number, number, number];
}

const SYSTEMS_PINS: SystemPinConfig[] = [
  {
    id: "brain",
    label: "Brain & Cognition",
    code: "CNS-02",
    color: "#c084fc",
    anchor: [0.0, 0.816, -0.016],
  },
  {
    id: "eyes",
    label: "Visual (SANS)",
    code: "SANS-03",
    color: "#38bdf8",
    anchor: [0.0265, 0.776, 0.046],
  },
  {
    id: "heart",
    label: "Cardiovascular",
    code: "CARDIO-01",
    color: "#ef4444",
    anchor: [0.035, 0.44, 0.04],
  },
  {
    id: "blood",
    label: "Blood & CBC",
    code: "HEMA-04",
    color: "#f43f5e",
    anchor: [-0.18, 0.28, 0.04],
  },
  {
    id: "immune_system",
    label: "Immune System",
    code: "IMM-05",
    color: "#10b981",
    anchor: [-0.04, 0.42, 0.03],
  },
  {
    id: "bones",
    label: "Skeletal System",
    code: "SKL-06",
    color: "#fbbf24",
    anchor: [-0.095, -0.19, -0.03],
  },
  {
    id: "muscles",
    label: "Muscular System",
    code: "MUS-07",
    color: "#be185d",
    anchor: [0.095, -0.1, 0.03],
  },
  {
    id: "digestive_system",
    label: "Gut Microbiome",
    code: "GI-08",
    color: "#fb923c",
    anchor: [0.0, 0.22, 0.04],
  },
  {
    id: "skin",
    label: "Skin & Dermal",
    code: "DERM-09",
    color: "#a78bfa",
    anchor: [0.24, 0.52, 0.02],
  },
  {
    id: "whole_body",
    label: "Whole-Body Radiation",
    code: "SYS-10",
    color: "#06b6d4",
    anchor: [0.0, 0.0, 0.0],
  },
  {
    id: "spacecraft_environment",
    label: "Spacecraft Cabin",
    code: "ENV-11",
    color: "#2dd4bf",
    anchor: [0.42, -0.68, 0.22],
  },
];

export const HealthIndicatorsPanel: React.FC<HealthIndicatorsPanelProps> = ({
  selectedSystem,
  onSelectSystem,
  hoveredSystem,
  onHoverSystem,
}) => {
  return (
    <group name="health-indicators-3d-pins">
      {SYSTEMS_PINS.map((pin) => {
        const systemInfo = SYSTEMS_DATA[pin.id];
        const isSelected = selectedSystem === pin.id;
        const isHovered = hoveredSystem === pin.id;
        const obsCount = getObservationsForSystem(pin.id).length;
        const osdrCount = getOSDRDatasetsForSystem(pin.id).length;

        return (
          <group key={pin.id} position={pin.anchor}>
            {/* 3D Glowing Anchor Sphere */}
            <mesh
              onClick={(e) => {
                e.stopPropagation();
                onSelectSystem(isSelected ? null : pin.id);
              }}
              onPointerOver={(e) => {
                e.stopPropagation();
                document.body.style.cursor = "pointer";
                onHoverSystem(pin.id);
              }}
              onPointerOut={(e) => {
                e.stopPropagation();
                document.body.style.cursor = "default";
                onHoverSystem(null);
              }}
            >
              <sphereGeometry args={[isSelected ? 0.012 : isHovered ? 0.01 : 0.007, 16, 16]} />
              <meshBasicMaterial
                color={pin.color}
                transparent
                opacity={isSelected ? 1.0 : isHovered ? 0.95 : 0.65}
              />
            </mesh>

            {/* Selection Pulse Ring */}
            {isSelected && (
              <mesh>
                <ringGeometry args={[0.014, 0.017, 32]} />
                <meshBasicMaterial
                  color={pin.color}
                  transparent
                  opacity={0.85}
                  side={THREE.DoubleSide}
                />
              </mesh>
            )}

            {/* Clean HTML Badge ONLY shown when Hovered or Selected */}
            {(isHovered || isSelected) && (
              <Html center distanceFactor={2.0} style={{ pointerEvents: "none" }} zIndexRange={[20, 0]}>
                <div
                  className="whitespace-nowrap px-2.5 py-1.5 rounded-xl bg-slate-950/95 border backdrop-blur-xl shadow-2xl transition-all duration-200 pointer-events-auto flex items-center gap-2 select-none"
                  style={{
                    borderColor: pin.color,
                    boxShadow: `0 0 20px ${pin.color}40`,
                  }}
                  onPointerDown={(e) => e.stopPropagation()}
                  onClick={(e) => {
                    e.stopPropagation();
                    onSelectSystem(isSelected ? null : pin.id);
                  }}
                >
                  <span
                    className="w-2.5 h-2.5 rounded-full shrink-0 shadow-sm"
                    style={{ backgroundColor: pin.color }}
                  />
                  <div className="flex flex-col">
                    <div className="flex items-center gap-1.5">
                      <span className="font-mono text-xs sm:text-sm font-bold text-white">
                        {systemInfo.name}
                      </span>
                      <span
                        className="text-xs font-mono px-1.5 py-0.5 rounded font-bold"
                        style={{
                          backgroundColor: `${pin.color}22`,
                          color: pin.color,
                        }}
                      >
                        {pin.code}
                      </span>
                    </div>
                    <div className="flex items-center gap-1.5 text-xs font-mono text-slate-300">
                      {obsCount > 0 && <span>{obsCount} Findings</span>}
                      {osdrCount > 0 && <span>• {osdrCount} OSDR</span>}
                    </div>
                  </div>
                </div>
              </Html>
            )}
          </group>
        );
      })}
    </group>
  );
};

export default HealthIndicatorsPanel;

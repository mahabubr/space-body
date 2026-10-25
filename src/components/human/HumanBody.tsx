import React, { Suspense } from "react";
import { Html } from "@react-three/drei";
import type { ThreeElements } from "@react-three/fiber";
import EcorcheModel, { type ViewMode } from "./EcorcheModel";
import type { SystemId } from "./internal/system-data";
import type { HealthMetrics } from "../../../health-data";

export type HumanBodyProps = ThreeElements["group"] & {
  selectedSystem?: SystemId | null;
  hoveredSystem?: SystemId | null;
  viewMode?: ViewMode;
  onSelectSystem?: (id: SystemId | null) => void;
  onHoverSystem?: (id: SystemId | null) => void;
  disableFloat?: boolean;
  healthValues?: HealthMetrics | null;
};

const ModelLoader: React.FC = () => (
  <Html center>
    <div className="flex flex-col items-center justify-center p-6 bg-slate-900/90 backdrop-blur-xl border border-sky-500/30 rounded-2xl shadow-2xl text-white select-none min-w-[240px]">
      <div className="relative w-12 h-12 mb-3">
        <div className="absolute inset-0 rounded-full border-2 border-sky-500/20 animate-ping" />
        <div className="w-12 h-12 rounded-full border-2 border-sky-400 border-t-transparent animate-spin" />
      </div>
      <p className="text-xs font-semibold tracking-wider text-sky-300 font-mono">
        INITIALIZING 3D ANATOMY
      </p>
      <p className="text-[10px] text-slate-400 mt-1">
        Loading 201 Bones, 467 Muscles & 437 Brain Structures...
      </p>
    </div>
  </Html>
);

export const HumanBody: React.FC<HumanBodyProps> = ({
  selectedSystem = null,
  hoveredSystem = null,
  viewMode = "split",
  onSelectSystem,
  onHoverSystem,
  disableFloat = false,
  healthValues = null,
  ...props
}) => {
  return (
    <group {...props}>
      <Suspense fallback={<ModelLoader />}>
        <EcorcheModel
          selectedSystem={selectedSystem}
          hoveredSystem={hoveredSystem}
          viewMode={viewMode}
          onSelectSystem={onSelectSystem}
          onHoverSystem={onHoverSystem}
          disableFloat={disableFloat}
          healthValues={healthValues}
        />
      </Suspense>
    </group>
  );
};

export default HumanBody;
export { EcorcheModel };

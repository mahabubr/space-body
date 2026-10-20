import React from "react";
import type { HealthMetrics } from "../../../../health-data";
import type { SystemId } from "../../../components/human/internal/system-data";

interface HealthIndicatorsPanelProps {
  healthValues: HealthMetrics;
  selectedSystem: SystemId | null;
  onSelectSystem: (system: SystemId | null) => void;
  hoveredSystem: SystemId | null;
  onHoverSystem: (system: SystemId | null) => void;
  theme: "studio" | "dark";
}

const SYSTEMS: {
  id: SystemId;
  key: keyof HealthMetrics;
  label: string;
  color: string;
  darkColor: string;
  barColor: string;
}[] = [
  {
    id: "eyes",
    key: "eye",
    label: "Eye",
    color: "#0284c7",
    darkColor: "#38bdf8",
    barColor: "bg-sky-500",
  },
  {
    id: "muscles",
    key: "muscle",
    label: "Muscle",
    color: "#be185d",
    darkColor: "#f43f5e",
    barColor: "bg-rose-500",
  },
  {
    id: "bones",
    key: "bones",
    label: "Bones",
    color: "#d97706",
    darkColor: "#fbbf24",
    barColor: "bg-amber-500",
  },
  {
    id: "brain",
    key: "brain",
    label: "Brain",
    color: "#9333ea",
    darkColor: "#c084fc",
    barColor: "bg-purple-500",
  },
];

export const HealthIndicatorsPanel: React.FC<HealthIndicatorsPanelProps> = ({
  healthValues,
  selectedSystem,
  onSelectSystem,
  hoveredSystem,
  onHoverSystem,
  theme,
}) => {
  const isDark = theme === "dark";

  return (
    <div
      className={`rounded-2xl backdrop-blur-xl border p-3 shadow-xl transition-all duration-300 w-56 ${
        isDark
          ? "bg-slate-950/80 border-slate-800 text-slate-100 shadow-cyan-950/20"
          : "bg-white/90 border-slate-200 text-slate-800 shadow-slate-300/40"
      }`}
    >
      <div className="flex items-center justify-between pb-2 mb-2 border-b border-slate-200/60 dark:border-slate-800/80">
        <span className="text-[11px] font-mono font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-400">
          Health Systems
        </span>
        {selectedSystem && (
          <button
            onClick={() => onSelectSystem(null)}
            className="text-[10px] font-mono text-sky-600 dark:text-cyan-400 hover:underline"
          >
            Reset
          </button>
        )}
      </div>

      <div className="space-y-1.5">
        {SYSTEMS.map((sys) => {
          const val = healthValues[sys.key];
          const isSelected = selectedSystem === sys.id;
          const isHovered = hoveredSystem === sys.id;

          return (
            <button
              key={sys.id}
              onClick={() => onSelectSystem(isSelected ? null : sys.id)}
              onMouseEnter={() => onHoverSystem(sys.id)}
              onMouseLeave={() => onHoverSystem(null)}
              className={`w-full text-left p-2 rounded-xl border transition-all ${
                isSelected
                  ? isDark
                    ? "bg-slate-800/90 border-cyan-400 ring-1 ring-cyan-400/40 shadow-sm"
                    : "bg-sky-50 border-sky-500 ring-1 ring-sky-400/40 shadow-sm"
                  : isHovered
                  ? isDark
                    ? "bg-slate-900 border-slate-700"
                    : "bg-slate-100 border-slate-300"
                  : isDark
                  ? "bg-slate-900/40 border-slate-800/60 hover:border-slate-700"
                  : "bg-slate-50/60 border-slate-200/60 hover:border-slate-300"
              }`}
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <span
                    className="w-2 h-2 rounded-full inline-block shrink-0"
                    style={{
                      backgroundColor: isDark ? sys.darkColor : sys.color,
                    }}
                  />
                  <span className="text-xs font-semibold">{sys.label}</span>
                </div>
                <span className="text-xs font-bold font-mono">
                  {val.toFixed(1)}%
                </span>
              </div>

              {/* Clean proportional progress bar */}
              <div className="w-full bg-slate-200 dark:bg-slate-800 h-1.5 rounded-full overflow-hidden mt-1.5">
                <div
                  className={`h-full rounded-full transition-all duration-300 ${sys.barColor}`}
                  style={{ width: `${Math.max(0, Math.min(100, val))}%` }}
                />
              </div>
            </button>
          );
        })}
      </div>
    </div>
  );
};

export default HealthIndicatorsPanel;

import React, { useMemo } from "react";
import type { MissionData } from "../../../../health-data";
import type { SystemId } from "../../../components/human/internal/system-data";

interface HealthTelemetryChartProps {
  mission: MissionData;
  currentDay: number;
  onSelectDay: (day: number) => void;
  selectedSystem: SystemId | null;
  onSelectSystem: (system: SystemId | null) => void;
  theme: "studio" | "dark";
}

const SYSTEM_CONFIG: Record<
  string,
  { label: string; systemId: SystemId; color: string; darkColor: string }
> = {
  eye: {
    label: "Eye",
    systemId: "eyes",
    color: "#0284c7",
    darkColor: "#38bdf8",
  },
  muscle: {
    label: "Muscle",
    systemId: "muscles",
    color: "#be185d",
    darkColor: "#f43f5e",
  },
  bones: {
    label: "Bones",
    systemId: "bones",
    color: "#d97706",
    darkColor: "#fbbf24",
  },
  brain: {
    label: "Brain",
    systemId: "brain",
    color: "#a21caf",
    darkColor: "#e879f9",
  },
};

export const HealthTelemetryChart: React.FC<HealthTelemetryChartProps> = ({
  mission,
  currentDay,
  onSelectDay,
  selectedSystem,
  onSelectSystem,
  theme,
}) => {
  // SVG Dimensions
  const width = 520;
  const height = 140;
  const padding = { top: 15, right: 25, bottom: 25, left: 35 };

  const chartW = width - padding.left - padding.right;
  const chartH = height - padding.top - padding.bottom;

  const minDay = 0;
  const maxDay = Math.max(1, mission.durationDays);

  // Health Y bounds: usually between 84% and 100%
  const { minVal, maxVal } = useMemo(() => {
    let min = 100;
    let max = 100;
    mission.intervals.forEach((interval) => {
      Object.values(interval.health).forEach((val) => {
        if (val < min) min = val;
        if (val > max) max = val;
      });
    });
    return {
      minVal: Math.floor(Math.min(84, min - 2)),
      maxVal: 100,
    };
  }, [mission]);

  // Coordinate projection helpers
  const getX = (day: number) =>
    padding.left + ((day - minDay) / (maxDay - minDay)) * chartW;
  const getY = (val: number) =>
    padding.top + chartH - ((val - minVal) / (maxVal - minVal)) * chartH;

  const systems = ["eye", "muscle", "bones", "brain"] as const;

  // Generate SVG path for a system
  const paths = useMemo(() => {
    return systems.map((sys) => {
      const points = mission.intervals.map((int) => ({
        x: getX(int.day),
        y: getY(int.health[sys]),
        day: int.day,
        val: int.health[sys],
      }));

      const d = points.reduce(
        (acc, pt, idx) => `${acc} ${idx === 0 ? "M" : "L"} ${pt.x} ${pt.y}`,
        ""
      );

      return {
        sys,
        d,
        points,
        config: SYSTEM_CONFIG[sys],
      };
    });
  }, [mission, minVal, maxVal, chartW, chartH]);

  const currentX = getX(currentDay);

  const isDark = theme === "dark";

  return (
    <div className="w-full select-none">
      <div className="flex items-center justify-between mb-1.5 px-1">
        <span className="text-[11px] font-mono font-semibold tracking-wider uppercase opacity-75">
          Physiological Telemetry Degradation Over Mission
        </span>
        <span className="text-[10px] font-mono opacity-60">
          Day {currentDay} of {mission.durationDays}
        </span>
      </div>

      <div className="relative overflow-hidden rounded-xl bg-black/5 dark:bg-black/30 p-2 border border-slate-200/50 dark:border-slate-800/60">
        <svg
          viewBox={`0 0 ${width} ${height}`}
          className="w-full h-auto cursor-crosshair overflow-visible"
          onClick={(e) => {
            const rect = e.currentTarget.getBoundingClientRect();
            const clickX = e.clientX - rect.left;
            const normalizedX = (clickX / rect.width) * width;
            const boundedX = Math.max(
              padding.left,
              Math.min(width - padding.right, normalizedX)
            );
            const ratio = (boundedX - padding.left) / chartW;
            const targetDay = Math.round(ratio * maxDay);
            onSelectDay(targetDay);
          }}
        >
          {/* Y Axis Grid lines */}
          {[100, 95, 90, 85].map((yTick) => {
            if (yTick < minVal || yTick > maxVal) return null;
            const y = getY(yTick);
            return (
              <g key={yTick}>
                <line
                  x1={padding.left}
                  y1={y}
                  x2={width - padding.right}
                  y2={y}
                  stroke={isDark ? "#334155" : "#e2e8f0"}
                  strokeDasharray="3 3"
                  strokeWidth="1"
                />
                <text
                  x={padding.left - 6}
                  y={y + 3}
                  textAnchor="end"
                  fontSize="9"
                  fill={isDark ? "#94a3b8" : "#64748b"}
                  fontFamily="monospace"
                >
                  {yTick}%
                </text>
              </g>
            );
          })}

          {/* X Axis Interval Tick Marks */}
          {mission.intervals.map((int) => {
            const x = getX(int.day);
            return (
              <g key={int.day}>
                <line
                  x1={x}
                  y1={padding.top}
                  x2={x}
                  y2={height - padding.bottom}
                  stroke={isDark ? "#1e293b" : "#f1f5f9"}
                  strokeWidth="1"
                />
                <text
                  x={x}
                  y={height - padding.bottom + 14}
                  textAnchor="middle"
                  fontSize="9"
                  fill={isDark ? "#94a3b8" : "#64748b"}
                  fontFamily="monospace"
                >
                  D{int.day}
                </text>
              </g>
            );
          })}

          {/* System Degradation Curves */}
          {paths.map(({ sys, d, points, config }) => {
            const isSystemSelected =
              selectedSystem === config.systemId || selectedSystem === null;
            const strokeColor = isDark ? config.darkColor : config.color;

            return (
              <g
                key={sys}
                opacity={isSystemSelected ? 1 : 0.25}
                className="transition-opacity duration-200"
              >
                <path
                  d={d}
                  fill="none"
                  stroke={strokeColor}
                  strokeWidth={
                    selectedSystem === config.systemId ? "2.5" : "1.8"
                  }
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
                {/* Data Points */}
                {points.map((pt) => (
                  <circle
                    key={pt.day}
                    cx={pt.x}
                    cy={pt.y}
                    r={selectedSystem === config.systemId ? "3.5" : "2.5"}
                    fill={isDark ? "#0f172a" : "#ffffff"}
                    stroke={strokeColor}
                    strokeWidth="2"
                    className="cursor-pointer hover:scale-125 transition-transform"
                    onClick={(e) => {
                      e.stopPropagation();
                      onSelectDay(pt.day);
                      onSelectSystem(config.systemId);
                    }}
                  />
                ))}
              </g>
            );
          })}

          {/* Dynamic Scrub Cursor Line for Current Day */}
          <line
            x1={currentX}
            y1={padding.top - 4}
            x2={currentX}
            y2={height - padding.bottom + 4}
            stroke={isDark ? "#38bdf8" : "#0284c7"}
            strokeWidth="2"
            strokeDasharray="2 2"
          />
          <circle
            cx={currentX}
            cy={padding.top - 4}
            r="4"
            fill={isDark ? "#38bdf8" : "#0284c7"}
            className="animate-pulse"
          />
        </svg>

        {/* Legend / Filter Chips */}
        <div className="flex flex-wrap items-center justify-between gap-1.5 mt-2 pt-2 border-t border-slate-200/60 dark:border-slate-800/80">
          <div className="flex flex-wrap items-center gap-2">
            {systems.map((sys) => {
              const cfg = SYSTEM_CONFIG[sys];
              const isSelected = selectedSystem === cfg.systemId;
              const color = isDark ? cfg.darkColor : cfg.color;

              return (
                <button
                  key={sys}
                  onClick={() =>
                    onSelectSystem(isSelected ? null : cfg.systemId)
                  }
                  className={`flex items-center gap-1.5 px-2 py-0.5 rounded-md text-[10px] font-mono font-medium transition-all ${
                    isSelected
                      ? "bg-slate-200 dark:bg-slate-800 ring-1 ring-sky-500 shadow-sm"
                      : "hover:bg-slate-100 dark:hover:bg-slate-800/50 opacity-75"
                  }`}
                >
                  <span
                    className="w-2 h-2 rounded-full inline-block"
                    style={{ backgroundColor: color }}
                  />
                  <span>{cfg.label}</span>
                </button>
              );
            })}
          </div>

          {selectedSystem && (
            <button
              onClick={() => onSelectSystem(null)}
              className="text-[10px] font-mono text-sky-600 dark:text-cyan-400 hover:underline"
            >
              Reset Filter
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default HealthTelemetryChart;

import React, { useMemo, useCallback } from "react";
import type { MissionData } from "../../../../health-data";
import type { SystemId } from "../../../components/human/internal/system-data";

interface HealthTelemetryChartProps {
  mission: MissionData;
  currentDay: number;
  onSelectDay: (day: number) => void;
  selectedSystem: SystemId | null;
  onSelectSystem: (system: SystemId | null) => void;
}

const SYSTEMS = ["eye", "muscle", "bones", "brain"] as const;

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

const width = 520;
const height = 140;
const padding = { top: 15, right: 25, bottom: 25, left: 35 };
const chartW = width - padding.left - padding.right;
const chartH = height - padding.top - padding.bottom;
const minDay = 0;

export const HealthTelemetryChart: React.FC<HealthTelemetryChartProps> = ({
  mission,
  currentDay,
  onSelectDay,
  selectedSystem,
  onSelectSystem,
}) => {
  const maxDay = Math.max(1, mission.durationDays);

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

  const getX = useCallback(
    (day: number) => padding.left + ((day - minDay) / (maxDay - minDay)) * chartW,
    [maxDay]
  );

  const getY = useCallback(
    (val: number) =>
      padding.top + chartH - ((val - minVal) / (maxVal - minVal)) * chartH,
    [minVal, maxVal]
  );

  const paths = useMemo(() => {
    return SYSTEMS.map((sys) => {
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
  }, [mission, getX, getY]);

  const currentX = getX(currentDay);

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

      <div className="relative overflow-hidden rounded-xl bg-black/40 p-2 border border-slate-800/80">
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
            const targetDay = ratio * maxDay;
            if (mission.intervals && mission.intervals.length > 0) {
              const closestInterval = mission.intervals.reduce((prev, curr) =>
                Math.abs(curr.day - targetDay) < Math.abs(prev.day - targetDay)
                  ? curr
                  : prev
              );
              onSelectDay(closestInterval.day);
            }
          }}
        >
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
                  stroke="#334155"
                  strokeDasharray="3 3"
                  strokeWidth="1"
                />
                <text
                  x={padding.left - 6}
                  y={y + 3}
                  textAnchor="end"
                  fontSize="9"
                  fill="#94a3b8"
                  fontFamily="monospace"
                >
                  {yTick}%
                </text>
              </g>
            );
          })}

          {mission.intervals.map((int) => {
            const x = getX(int.day);
            return (
              <g key={int.day}>
                <line
                  x1={x}
                  y1={padding.top}
                  x2={x}
                  y2={height - padding.bottom}
                  stroke="#1e293b"
                  strokeWidth="1"
                />
                <text
                  x={x}
                  y={height - padding.bottom + 14}
                  textAnchor="middle"
                  fontSize="9"
                  fill="#94a3b8"
                  fontFamily="monospace"
                >
                  D{int.day}
                </text>
              </g>
            );
          })}

          {paths.map(({ sys, d, points, config }) => {
            const isSystemSelected =
              selectedSystem === config.systemId || selectedSystem === null;
            const strokeColor = config.darkColor;

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
                {points.map((pt) => (
                  <circle
                    key={pt.day}
                    cx={pt.x}
                    cy={pt.y}
                    r={selectedSystem === config.systemId ? "3.5" : "2.5"}
                    fill="#0f172a"
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

          <line
            x1={currentX}
            y1={padding.top - 4}
            x2={currentX}
            y2={height - padding.bottom + 4}
            stroke="#38bdf8"
            strokeWidth="2"
            strokeDasharray="2 2"
          />
          <circle
            cx={currentX}
            cy={padding.top - 4}
            r="4"
            fill="#38bdf8"
            className="animate-pulse"
          />
        </svg>

        <div className="flex flex-wrap items-center justify-between gap-1.5 mt-2 pt-2 border-t border-slate-800/80">
          <div className="flex flex-wrap items-center gap-2">
            {SYSTEMS.map((sys) => {
              const cfg = SYSTEM_CONFIG[sys];
              const isSelected = selectedSystem === cfg.systemId;
              const color = cfg.darkColor;

              return (
                <button
                  key={sys}
                  onClick={() =>
                    onSelectSystem(isSelected ? null : cfg.systemId)
                  }
                  className={`flex items-center gap-1.5 px-2 py-0.5 rounded-md text-[10px] font-mono font-medium transition-all ${
                    isSelected
                      ? "bg-slate-800 text-cyan-300 ring-1 ring-cyan-500 shadow-sm"
                      : "text-slate-300 hover:bg-slate-800/50 opacity-75"
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
              className="text-[10px] font-mono text-cyan-400 hover:underline"
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

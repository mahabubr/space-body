import React from "react";
import type { SystemInfo, SystemId } from "../../../components/human/internal/system-data";
import type { MissionDescription } from "../../../../health-data";

export interface SystemTelemetryIndicatorProps {
  systemInfo: SystemInfo;
  healthValue?: number | null;
  currentDay: number;
  description?: MissionDescription | null;
  isSelected?: boolean;
  isHovered?: boolean;
  onSelectSystem?: (id: SystemId) => void;
  onClose?: () => void;
  theme: "studio" | "dark";
}

export const SystemTelemetryIndicator: React.FC<SystemTelemetryIndicatorProps> = ({
  systemInfo,
  healthValue = 100,
  currentDay,
  description,
  isSelected = false,
  isHovered = false,
  onSelectSystem,
  onClose,
  theme,
}) => {
  const isDark = theme === "dark";
  const val = healthValue ?? 100;
  const accentColor = isDark ? systemInfo.glowColor : systemInfo.color;

  // COMPACT TELEMETRY PREVIEW (when not selected)
  if (!isSelected) {
    return (
      <div
        onClick={(e) => {
          e.stopPropagation();
          onSelectSystem?.(systemInfo.id);
        }}
        className={`cursor-pointer rounded-xl backdrop-blur-xl border px-3 py-2.5 transition-all duration-300 w-48 sm:w-52 shadow-xl ${
          isHovered
            ? isDark
              ? "bg-slate-900/95 border-cyan-400 shadow-cyan-950/60 scale-102 ring-1 ring-cyan-400/40"
              : "bg-white/95 border-sky-400 shadow-sky-200/60 scale-102 ring-1 ring-sky-300"
            : isDark
            ? "bg-slate-950/85 border-slate-800/90 hover:border-slate-700 hover:bg-slate-900/80"
            : "bg-white/90 border-slate-200/90 hover:border-slate-300 hover:bg-white"
        }`}
      >
        {/* Header: Name & Risk Badge */}
        <div className="flex items-center justify-between gap-1 mb-1">
          <div className="flex items-center gap-1.5 min-w-0">
            <span
              className="w-2 h-2 rounded-full shrink-0"
              style={{ backgroundColor: accentColor }}
            />
            <h4 className="text-xs font-bold tracking-tight truncate">
              {systemInfo.name}
            </h4>
          </div>
          <span
            className={`text-[8px] font-mono px-1.5 py-0.5 rounded font-bold border shrink-0 ${
              systemInfo.missionRisk === "CRITICAL"
                ? "bg-red-500/15 text-red-500 border-red-500/30"
                : "bg-amber-500/15 text-amber-500 border-amber-500/30"
            }`}
          >
            {systemInfo.missionRisk}
          </span>
        </div>

        {/* Short description snippet */}
        {description?.shortDescription && (
          <p className="text-[10px] text-slate-400 line-clamp-1 mb-1.5 leading-snug">
            {description.shortDescription}
          </p>
        )}

        {/* Live Telemetry Health Row */}
        <div className="flex items-baseline justify-between text-xs font-mono mb-1">
          <span className="text-[10px] text-slate-400 font-sans">Health:</span>
          <div className="flex items-baseline gap-1">
            <span
              className={`font-bold text-xs ${
                val >= 98
                  ? "text-emerald-500 dark:text-emerald-400"
                  : val >= 93
                  ? "text-amber-500 dark:text-amber-400"
                  : "text-rose-500 dark:text-rose-400"
              }`}
            >
              {val.toFixed(1)}%
            </span>
            <span className="text-[9px] text-slate-400">
              ({val >= 100 ? "±0" : (val - 100).toFixed(1)}%)
            </span>
          </div>
        </div>

        {/* Mini progress bar */}
        <div className="w-full bg-slate-200/70 dark:bg-slate-800/80 h-1 rounded-full overflow-hidden mb-1.5">
          <div
            className="h-full rounded-full transition-all duration-300"
            style={{
              width: `${Math.max(0, Math.min(100, val))}%`,
              backgroundColor: accentColor,
            }}
          />
        </div>

        {/* Action hint */}
        <div className="flex items-center justify-between text-[9px] font-mono text-sky-600 dark:text-cyan-400 font-medium pt-0.5">
          <span>Inspect Telemetry</span>
          <span>→</span>
        </div>
      </div>
    );
  }

  // FULL EXPANDED NASA TELEMETRY (when selected)
  return (
    <div
      onClick={(e) => e.stopPropagation()}
      className={`w-72 sm:w-80 max-w-[90vw] p-3.5 rounded-2xl backdrop-blur-xl border shadow-2xl transition-all duration-300 animate-in fade-in zoom-in-95 pointer-events-auto ${
        isDark
          ? "bg-slate-950/95 border-cyan-400 ring-2 ring-cyan-400/40 text-slate-100 shadow-cyan-950/70"
          : "bg-white/95 border-sky-500 ring-2 ring-sky-400/40 text-slate-800 shadow-sky-200/60"
      }`}
    >
      {/* Header */}
      <div className="flex items-start justify-between gap-2 pb-2 mb-2 border-b border-slate-200/70 dark:border-slate-800/80">
        <div>
          <div className="flex items-center gap-1.5 flex-wrap">
            <span
              className="w-2.5 h-2.5 rounded-full shrink-0 shadow-sm animate-pulse"
              style={{ backgroundColor: accentColor }}
            />
            <h3 className="text-xs sm:text-sm font-bold tracking-tight text-sky-600 dark:text-cyan-400">
              {systemInfo.name}
            </h3>
            <span
              className={`text-[8px] font-mono px-1.5 py-0.5 rounded font-bold border shrink-0 ${
                systemInfo.missionRisk === "CRITICAL"
                  ? "bg-red-500/15 text-red-600 dark:text-red-400 border-red-500/30"
                  : "bg-amber-500/15 text-amber-600 dark:text-amber-400 border-amber-500/30"
              }`}
            >
              {systemInfo.badge}
            </span>
          </div>
          {description?.shortDescription && (
            <p className="text-[10px] text-slate-500 dark:text-slate-400 mt-1 leading-snug">
              {description.shortDescription}
            </p>
          )}
        </div>

        {onClose && (
          <button
            onClick={onClose}
            className="text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 p-1 shrink-0 rounded-lg hover:bg-black/5 dark:hover:bg-white/5 transition-colors"
            title="Close telemetry"
          >
            ✕
          </button>
        )}
      </div>

      {/* Live Mission Day Health Telemetry */}
      {healthValue !== undefined && healthValue !== null && (
        <div className="mb-2 p-2 rounded-xl bg-black/5 dark:bg-black/30 border border-slate-200/60 dark:border-slate-800/80 flex items-center justify-between">
          <div>
            <span className="text-[9px] font-mono uppercase text-slate-400 block">
              Day {currentDay} Telemetry
            </span>
            <span className="text-[11px] font-semibold text-slate-700 dark:text-slate-200">
              {healthValue >= 98
                ? "Nominal Function"
                : healthValue >= 93
                ? "Microgravity Adaptation"
                : "Physiological Degradation"}
            </span>
          </div>
          <div className="text-right">
            <span
              className={`text-sm font-bold font-mono ${
                healthValue >= 98
                  ? "text-emerald-500"
                  : healthValue >= 93
                  ? "text-amber-500"
                  : "text-rose-500"
              }`}
            >
              {healthValue.toFixed(1)}%
            </span>
            <span className="text-[9px] font-mono text-slate-400 block">
              {(healthValue - 100).toFixed(1)}% baseline
            </span>
          </div>
        </div>
      )}

      {/* NASA Medical Insights: Space Impact, Astronaut Effects, Countermeasures */}
      {description && (
        <div className="text-xs space-y-1.5 max-h-48 overflow-y-auto pr-1">
          {description.problemInSpace && (
            <div className="rounded-lg p-1.5 bg-rose-500/5 border border-rose-500/10">
              <span className="font-semibold text-rose-600 dark:text-rose-400 block text-[9px] uppercase font-mono mb-0.5">
                Space Impact:
              </span>
              <p className="text-slate-600 dark:text-slate-300 leading-relaxed text-[10px]">
                {description.problemInSpace}
              </p>
            </div>
          )}

          {description.effectOnAstronauts && (
            <div className="rounded-lg p-1.5 bg-amber-500/5 border border-amber-500/10">
              <span className="font-semibold text-amber-600 dark:text-amber-400 block text-[9px] uppercase font-mono mb-0.5">
                Effect on Astronauts:
              </span>
              <p className="text-slate-600 dark:text-slate-300 leading-relaxed text-[10px]">
                {description.effectOnAstronauts}
              </p>
            </div>
          )}

          {description.nasaSolution && (
            <div className="rounded-lg p-1.5 bg-emerald-500/5 border border-emerald-500/10">
              <span className="font-semibold text-emerald-600 dark:text-emerald-400 block text-[9px] uppercase font-mono mb-0.5">
                NASA Countermeasure:
              </span>
              <p className="text-slate-600 dark:text-slate-300 leading-relaxed text-[10px]">
                {description.nasaSolution}
              </p>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default SystemTelemetryIndicator;

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
}) => {
  const val = healthValue ?? 100;

  // Dynamic clinical status reflecting interval health state (High vs Adapting vs Critical Loss)
  const isOptimal = val >= 98;
  const isAdapting = val >= 93 && val < 98;

  const statusBadge = isOptimal
    ? {
        label: "HIGH HEALTH",
        badgeClass:
          "bg-emerald-500/15 text-emerald-400 border-emerald-500/30",
        barColor: "#10b981",
        stateText: "Earth Baseline • 100% High Health",
        glowColor: "#10b981",
      }
    : isAdapting
    ? {
        label: "ADAPTING",
        badgeClass:
          "bg-amber-500/15 text-amber-400 border-amber-500/30",
        barColor: "#f59e0b",
        stateText: "Microgravity Adaptation",
        glowColor: "#f59e0b",
      }
    : {
        label: "CRITICAL LOSS",
        badgeClass:
          "bg-rose-500/15 text-rose-400 border-rose-500/30",
        barColor: "#f43f5e",
        stateText: "Severe Physiological Loss",
        glowColor: "#f43f5e",
      };

  if (!isSelected) {
    return (
      <div
        onClick={(e) => {
          e.stopPropagation();
          onSelectSystem?.(systemInfo.id);
        }}
        className={`cursor-pointer rounded-xl backdrop-blur-xl border px-3 py-2.5 transition-all duration-300 w-48 sm:w-52 shadow-xl ${
          isHovered
            ? "bg-slate-900/95 border-cyan-400/80 shadow-cyan-950/50 ring-1 ring-cyan-400/20"
            : "bg-slate-950/85 border-slate-800/90 hover:border-slate-700 hover:bg-slate-900/80"
        }`}
      >
        <div className="flex items-center justify-between gap-1 mb-1">
          <div className="flex items-center gap-1.5 min-w-0">
            <span
              className="w-2 h-2 rounded-full shrink-0 shadow-[0_0_6px_currentColor]"
              style={{ backgroundColor: statusBadge.barColor, color: statusBadge.barColor }}
            />
            <h4 className="text-xs font-bold tracking-tight text-slate-100 truncate">
              {systemInfo.name}
            </h4>
          </div>
          <span
            className={`text-[8px] font-mono px-1.5 py-0.5 rounded font-bold border shrink-0 transition-colors duration-300 ${statusBadge.badgeClass}`}
          >
            {statusBadge.label}
          </span>
        </div>

        {description?.shortDescription && (
          <p className="text-[10px] text-slate-400 line-clamp-1 mb-1.5 leading-snug font-sans">
            {description.shortDescription}
          </p>
        )}

        <div className="flex items-baseline justify-between text-xs font-mono mb-1">
          <span className="text-[10px] text-slate-400 font-sans">Health:</span>
          <div className="flex items-baseline gap-1">
            <span
              className={`font-bold text-xs ${
                val >= 98
                  ? "text-emerald-400"
                  : val >= 93
                  ? "text-amber-400"
                  : "text-rose-400"
              }`}
            >
              {val.toFixed(1)}%
            </span>
            <span
              className={`text-[9px] font-mono ${
                val >= 99.9
                  ? "text-emerald-400/80"
                  : val >= 93
                  ? "text-amber-400/80"
                  : "text-rose-400/90 font-bold"
              }`}
            >
              {val >= 99.9 ? "(High)" : `(${(val - 100).toFixed(1)}% Loss)`}
            </span>
          </div>
        </div>

        <div className="w-full bg-slate-800/80 h-1.5 rounded-full overflow-hidden mb-1.5">
          <div
            className="h-full rounded-full transition-all duration-500 shadow-sm"
            style={{
              width: `${Math.max(0, Math.min(100, val))}%`,
              backgroundColor: statusBadge.barColor,
            }}
          />
        </div>

        <div className="flex items-center justify-between text-[9px] font-mono text-cyan-400 font-medium pt-0.5">
          <span>Inspect Telemetry</span>
          <span>→</span>
        </div>
      </div>
    );
  }

  return (
    <div
      onClick={(e) => e.stopPropagation()}
      className="w-72 sm:w-80 max-w-[90vw] p-3.5 rounded-2xl backdrop-blur-xl border border-cyan-400/80 ring-1 ring-cyan-400/30 text-slate-100 shadow-[0_0_30px_rgba(6,182,212,0.2)] bg-slate-950/95 transition-all duration-300 animate-in fade-in zoom-in-95 pointer-events-auto"
    >
      <div className="flex items-start justify-between gap-2 pb-2 mb-2 border-b border-slate-800/80">
        <div>
          <div className="flex items-center gap-1.5 flex-wrap">
            <span
              className="w-2.5 h-2.5 rounded-full shrink-0 shadow-[0_0_8px_currentColor]"
              style={{ backgroundColor: statusBadge.barColor, color: statusBadge.barColor }}
            />
            <h3 className="text-xs sm:text-sm font-bold tracking-tight text-cyan-400 font-mono">
              {systemInfo.name}
            </h3>
            <span
              className={`text-[8px] font-mono px-1.5 py-0.5 rounded font-bold border shrink-0 transition-colors duration-300 ${statusBadge.badgeClass}`}
            >
              {statusBadge.label}
            </span>
          </div>
          {description?.shortDescription && (
            <p className="text-[10px] text-slate-400 mt-1 leading-snug">
              {description.shortDescription}
            </p>
          )}
        </div>

        {onClose && (
          <button
            onClick={onClose}
            className="text-slate-400 hover:text-slate-200 p-1 shrink-0 rounded-lg hover:bg-white/10 transition-colors"
            title="Close telemetry"
          >
            ✕
          </button>
        )}
      </div>

      {healthValue !== undefined && healthValue !== null && (
        <div className="mb-2 p-2 rounded-xl bg-black/40 border border-slate-800/80 flex items-center justify-between">
          <div>
            <span className="text-[9px] font-mono uppercase text-slate-400 block">
              Day {currentDay} Telemetry Status
            </span>
            <span className="text-[11px] font-semibold text-slate-200 font-sans">
              {statusBadge.stateText}
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
            <span
              className={`text-[9px] font-mono block ${
                healthValue >= 99.9
                  ? "text-emerald-500 font-semibold"
                  : healthValue >= 93
                  ? "text-amber-500/90 font-semibold"
                  : "text-rose-500 font-bold"
              }`}
            >
              {healthValue >= 99.9
                ? "100% High Health"
                : `${(healthValue - 100).toFixed(1)}% Mission Loss`}
            </span>
          </div>
        </div>
      )}

      {description && (
        <div className="text-xs space-y-1.5 max-h-48 overflow-y-auto pr-1">
          {description.problemInSpace && (
            <div className="rounded-lg p-1.5 bg-rose-500/10 border border-rose-500/20">
              <span className="font-semibold text-rose-400 block text-[9px] uppercase font-mono mb-0.5">
                Space Impact:
              </span>
              <p className="text-slate-300 leading-relaxed text-[10px]">
                {description.problemInSpace}
              </p>
            </div>
          )}

          {description.effectOnAstronauts && (
            <div className="rounded-lg p-1.5 bg-amber-500/10 border border-amber-500/20">
              <span className="font-semibold text-amber-400 block text-[9px] uppercase font-mono mb-0.5">
                Effect on Astronauts:
              </span>
              <p className="text-slate-300 leading-relaxed text-[10px]">
                {description.effectOnAstronauts}
              </p>
            </div>
          )}

          {description.nasaSolution && (
            <div className="rounded-lg p-1.5 bg-emerald-500/10 border border-emerald-500/20">
              <span className="font-semibold text-emerald-400 block text-[9px] uppercase font-mono mb-0.5">
                NASA Countermeasure:
              </span>
              <p className="text-slate-300 leading-relaxed text-[10px]">
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

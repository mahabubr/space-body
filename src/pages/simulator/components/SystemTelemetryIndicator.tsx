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

  // Dynamic clinical status reflecting interval health state
  const isOptimal = val >= 98;
  const isAdapting = val >= 93 && val < 98;

  const statusBadge = isOptimal
    ? {
        label: "NOMINAL",
        badgeClass:
          "bg-emerald-500/15 text-emerald-400 border-emerald-500/30",
        barColor: "#10b981",
        stateText: "Earth Baseline • 100% High Health",
        glowColor: "#10b981",
        code: "STATE 01",
      }
    : isAdapting
    ? {
        label: "ADAPTING",
        badgeClass:
          "bg-amber-500/15 text-amber-400 border-amber-500/30",
        barColor: "#f59e0b",
        stateText: "Microgravity Fluid & Tone Adaptation",
        glowColor: "#f59e0b",
        code: "STATE 02",
      }
    : {
        label: "CRITICAL LOSS",
        badgeClass:
          "bg-rose-500/15 text-rose-400 border-rose-500/30",
        barColor: "#f43f5e",
        stateText: "Severe Physiological Degradation",
        glowColor: "#f43f5e",
        code: "STATE 03",
      };

  if (!isSelected) {
    return (
      <div
        onClick={(e) => {
          e.stopPropagation();
          onSelectSystem?.(systemInfo.id);
        }}
        className={`group cursor-pointer rounded-2xl backdrop-blur-2xl border px-3.5 py-3 transition-all duration-300 w-52 sm:w-56 shadow-2xl relative overflow-hidden ${
          isHovered
            ? "bg-slate-950/95 border-cyan-400 shadow-[0_0_24px_rgba(34,211,238,0.25)] ring-1 ring-cyan-400/40 translate-y-[-2px]"
            : "bg-slate-950/85 border-slate-800/80 hover:border-slate-700 hover:bg-slate-900/90"
        }`}
      >
        {/* Top glowing accent line */}
        <div
          className="absolute top-0 left-0 right-0 h-[2px] opacity-80"
          style={{
            background: `linear-gradient(90deg, transparent, ${statusBadge.barColor}, transparent)`,
          }}
        />

        <div className="flex items-center justify-between gap-1 mb-1.5">
          <div className="flex items-center gap-1.5 min-w-0">
            <span
              className="w-2 h-2 rounded-full shrink-0 shadow-[0_0_6px_currentColor] animate-pulse"
              style={{ backgroundColor: statusBadge.barColor, color: statusBadge.barColor }}
            />
            <h4 className="text-xs font-bold tracking-tight text-slate-100 truncate font-mono">
              {systemInfo.name}
            </h4>
          </div>
          <span
            className={`text-[8px] font-mono px-1.5 py-0.5 rounded font-bold border shrink-0 transition-colors duration-300 tracking-wider ${statusBadge.badgeClass}`}
          >
            {statusBadge.label}
          </span>
        </div>

        {description?.shortDescription && (
          <p className="text-[10px] text-slate-400 line-clamp-1 mb-2 leading-snug">
            {description.shortDescription}
          </p>
        )}

        <div className="flex items-baseline justify-between text-xs font-mono mb-1.5">
          <div className="flex items-center gap-1 text-[10px] text-slate-400">
            {/* Animated mini ECG wave icon */}
            <svg className="w-3.5 h-3 text-cyan-400/80" fill="none" stroke="currentColor" viewBox="0 0 24 14">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M1 7h4l2-5 3 10 3-7 2 3h9" />
            </svg>
            <span className="text-[9px] uppercase tracking-wider text-slate-400">Status</span>
          </div>
          <div className="flex items-baseline gap-1.5">
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
              {val >= 99.9 ? "(100%)" : `(${(val - 100).toFixed(1)}%)`}
            </span>
          </div>
        </div>

        {/* Animated Telemetry Progress Bar with Glowing Head */}
        <div className="w-full bg-slate-900/90 h-1.5 rounded-full overflow-hidden mb-2 p-[1px] border border-slate-800">
          <div
            className="h-full rounded-full transition-all duration-500 relative"
            style={{
              width: `${Math.max(0, Math.min(100, val))}%`,
              background: `linear-gradient(90deg, #0284c7, ${statusBadge.barColor})`,
              boxShadow: `0 0 8px ${statusBadge.barColor}aa`,
            }}
          />
        </div>

        <div className="flex items-center justify-between text-[9px] font-mono text-cyan-400 font-semibold pt-1 border-t border-slate-900">
          <span className="flex items-center gap-1 group-hover:text-cyan-300 transition-colors">
            <span>NASA TELEMETRY</span>
          </span>
          <span className="group-hover:translate-x-0.5 transition-transform">→</span>
        </div>
      </div>
    );
  }

  return (
    <div
      onClick={(e) => e.stopPropagation()}
      className="w-80 sm:w-88 max-w-[92vw] p-4 rounded-2xl backdrop-blur-2xl border border-cyan-400/80 ring-1 ring-cyan-400/40 text-slate-100 shadow-[0_0_35px_rgba(6,182,212,0.25)] bg-slate-950/95 transition-all duration-300 animate-in fade-in zoom-in-95 pointer-events-auto relative select-none"
    >
      {/* Corner Tech Reticle Markers */}
      <span className="absolute top-2 left-2 text-[9px] font-mono text-cyan-400/40 select-none">+</span>
      <span className="absolute top-2 right-2 text-[9px] font-mono text-cyan-400/40 select-none">+</span>
      <span className="absolute bottom-2 left-2 text-[9px] font-mono text-cyan-400/30 select-none">+</span>
      <span className="absolute bottom-2 right-2 text-[9px] font-mono text-cyan-400/30 select-none">+</span>

      <div className="flex items-start justify-between gap-2 pb-2.5 mb-2.5 border-b border-slate-800/90">
        <div>
          <div className="flex items-center gap-2 flex-wrap mb-1">
            <span
              className="w-2.5 h-2.5 rounded-full shrink-0 shadow-[0_0_8px_currentColor] animate-pulse"
              style={{ backgroundColor: statusBadge.barColor, color: statusBadge.barColor }}
            />
            <h3 className="text-sm font-bold tracking-tight text-cyan-300 font-mono">
              {systemInfo.name}
            </h3>
            <span
              className={`text-[8px] font-mono px-1.5 py-0.5 rounded font-bold border shrink-0 transition-colors duration-300 tracking-wider ${statusBadge.badgeClass}`}
            >
              {statusBadge.label}
            </span>
          </div>
          <div className="flex items-center gap-2 text-[9px] font-mono text-slate-400">
            <span className="text-cyan-400">NASA-HRP</span>
            <span>•</span>
            <span className="text-amber-400/90">{systemInfo.badge}</span>
          </div>
        </div>

        {onClose && (
          <button
            onClick={onClose}
            className="text-slate-400 hover:text-white p-1 rounded-lg hover:bg-slate-800 border border-transparent hover:border-slate-700 transition-all text-xs font-mono"
            title="Close telemetry dossier"
          >
            ✕
          </button>
        )}
      </div>

      {healthValue !== undefined && healthValue !== null && (
        <div className="mb-2.5 p-2.5 rounded-xl bg-slate-900/60 border border-slate-800/90 flex items-center justify-between">
          <div>
            <span className="text-[9px] font-mono uppercase text-slate-400 block tracking-wider">
              DAY {currentDay} TELEMETRY STATUS
            </span>
            <span className="text-xs font-semibold text-slate-200">
              {statusBadge.stateText}
            </span>
          </div>
          <div className="text-right">
            <span
              className={`text-base font-bold font-mono ${
                healthValue >= 98
                  ? "text-emerald-400"
                  : healthValue >= 93
                  ? "text-amber-400"
                  : "text-rose-400"
              }`}
            >
              {healthValue.toFixed(1)}%
            </span>
            <span
              className={`text-[9px] font-mono block ${
                healthValue >= 99.9
                  ? "text-emerald-400 font-medium"
                  : healthValue >= 93
                  ? "text-amber-400/90 font-medium"
                  : "text-rose-400 font-bold"
              }`}
            >
              {healthValue >= 99.9
                ? "100% NOMINAL"
                : `${(healthValue - 100).toFixed(1)}% LOSS`}
            </span>
          </div>
        </div>
      )}

      {description && (
        <div className="text-xs space-y-2 max-h-52 overflow-y-auto pr-1">
          {description.problemInSpace && (
            <div className="rounded-xl p-2 bg-rose-500/10 border border-rose-500/25">
              <span className="font-semibold text-rose-400 block text-[9px] uppercase font-mono mb-1 tracking-wider flex items-center gap-1.5">
                <span className="w-1 h-1 rounded-full bg-rose-400" />
                Microgravity Space Stress:
              </span>
              <p className="text-slate-300 leading-relaxed text-[10px]">
                {description.problemInSpace}
              </p>
            </div>
          )}

          {description.effectOnAstronauts && (
            <div className="rounded-xl p-2 bg-amber-500/10 border border-amber-500/25">
              <span className="font-semibold text-amber-400 block text-[9px] uppercase font-mono mb-1 tracking-wider flex items-center gap-1.5">
                <span className="w-1 h-1 rounded-full bg-amber-400" />
                Astronaut Clinical Impact:
              </span>
              <p className="text-slate-300 leading-relaxed text-[10px]">
                {description.effectOnAstronauts}
              </p>
            </div>
          )}

          {description.nasaSolution && (
            <div className="rounded-xl p-2 bg-emerald-500/10 border border-emerald-500/25">
              <span className="font-semibold text-emerald-400 block text-[9px] uppercase font-mono mb-1 tracking-wider flex items-center gap-1.5">
                <span className="w-1 h-1 rounded-full bg-emerald-400" />
                NASA Flight Countermeasure:
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

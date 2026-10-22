import React from "react";
import type { SystemInfo, SystemId } from "../../../components/human/internal/system-data";
import { SYSTEMS_DATA } from "../../../components/human/internal/system-data";

interface SystemTelemetryIndicatorProps {
  systemInfo: SystemInfo | null;
  healthValue?: number | null;
  currentDay: number;
  onClose: () => void;
  onSelectSystem: (id: SystemId) => void;
  theme: "studio" | "dark";
}

export const SystemTelemetryIndicator: React.FC<SystemTelemetryIndicatorProps> = ({
  systemInfo,
  healthValue,
  currentDay,
  onClose,
  onSelectSystem,
  theme,
}) => {
  const isDark = theme === "dark";

  // If no system is selected, render a clean, inviting hint indicator card
  if (!systemInfo) {
    return (
      <div
        className={`w-72 p-3.5 rounded-2xl backdrop-blur-xl border shadow-xl transition-all duration-300 pointer-events-auto ${
          isDark
            ? "bg-slate-950/80 border-slate-800/90 text-slate-300 shadow-cyan-950/20"
            : "bg-white/90 border-slate-200 text-slate-700 shadow-slate-300/40"
        }`}
      >
        <div className="flex items-center gap-2 mb-2 pb-1.5 border-b border-slate-200/60 dark:border-slate-800/80">
          <span className="w-2 h-2 rounded-full bg-sky-500 animate-pulse" />
          <h3 className="text-xs font-mono font-bold uppercase tracking-wider text-sky-600 dark:text-cyan-400">
            System Telemetry
          </h3>
        </div>
        <p className="text-[11px] text-slate-500 dark:text-slate-400 leading-relaxed mb-2.5">
          Click an anatomical system or choose below to inspect NASA spaceflight impact & countermeasures:
        </p>

        {/* Quick select chips */}
        <div className="grid grid-cols-2 gap-1.5">
          {(["bones", "muscles", "brain", "eyes"] as SystemId[]).map((id) => {
            const sys = SYSTEMS_DATA[id];
            return (
              <button
                key={id}
                onClick={() => onSelectSystem(id)}
                className={`px-2 py-1.5 rounded-lg text-[10px] font-mono text-left border transition-all truncate ${
                  isDark
                    ? "bg-slate-900/60 border-slate-800 hover:border-cyan-500/50 text-slate-300 hover:text-cyan-300"
                    : "bg-slate-50 border-slate-200 hover:border-sky-400 text-slate-700 hover:text-sky-600"
                }`}
              >
                {sys.name}
              </button>
            );
          })}
        </div>
      </div>
    );
  }

  // When a system is selected or hovered, show rich NASA medical telemetry
  return (
    <div
      className={`w-80 max-w-[90vw] p-4 rounded-2xl backdrop-blur-xl border shadow-2xl transition-all duration-300 pointer-events-auto animate-in fade-in slide-in-from-right-3 ${
        isDark
          ? "bg-slate-950/90 border-cyan-500/40 text-slate-100 shadow-cyan-950/60"
          : "bg-white/95 border-slate-200 text-slate-800 shadow-slate-400/30"
      }`}
    >
      {/* Header */}
      <div className="flex items-start justify-between gap-2 pb-2 mb-2 border-b border-slate-200/70 dark:border-slate-800/80">
        <div>
          <div className="flex items-center gap-2">
            <h3 className="text-sm font-bold tracking-tight text-sky-600 dark:text-cyan-400">
              {systemInfo.name}
            </h3>
            <span
              className={`text-[9px] font-mono px-2 py-0.5 rounded-full font-semibold border ${
                systemInfo.missionRisk === "CRITICAL"
                  ? "bg-red-500/15 text-red-600 dark:text-red-400 border-red-500/30"
                  : "bg-amber-500/15 text-amber-600 dark:text-amber-400 border-amber-500/30"
              }`}
            >
              {systemInfo.badge}
            </span>
          </div>
          <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-1 leading-snug">
            {systemInfo.shortDescription}
          </p>
        </div>

        <button
          onClick={onClose}
          className="text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 p-1 shrink-0"
          title="Reset focus"
        >
          ✕
        </button>
      </div>

      {/* Live Mission Day Health Telemetry */}
      {healthValue !== undefined && healthValue !== null && (
        <div className="mb-2.5 p-2 rounded-xl bg-black/5 dark:bg-black/30 border border-slate-200/60 dark:border-slate-800/80 flex items-center justify-between">
          <div>
            <span className="text-[9px] font-mono uppercase text-slate-400 block">
              Mission Day {currentDay} Health
            </span>
            <span className="text-xs font-semibold text-slate-700 dark:text-slate-200">
              {healthValue >= 98
                ? "Nominal Function"
                : healthValue >= 93
                ? "Microgravity Adaptation"
                : "Physiological Degradation"}
            </span>
          </div>
          <div className="text-right">
            <span
              className={`text-base font-bold font-mono ${
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
              {(healthValue - 100).toFixed(1)}% from baseline
            </span>
          </div>
        </div>
      )}

      {/* NASA Medical Insights */}
      <div className="text-xs space-y-2 max-h-60 overflow-y-auto pr-1">
        <div>
          <span className="font-semibold text-rose-600 dark:text-rose-400 block text-[10px] uppercase font-mono mb-0.5">
            Space Impact:
          </span>
          <p className="text-slate-600 dark:text-slate-300 leading-relaxed text-[11px]">
            {systemInfo.problemInSpace}
          </p>
        </div>

        <div>
          <span className="font-semibold text-amber-600 dark:text-amber-400 block text-[10px] uppercase font-mono mb-0.5">
            Effect on Astronauts:
          </span>
          <p className="text-slate-600 dark:text-slate-300 leading-relaxed text-[11px]">
            {systemInfo.effectOnAstronauts}
          </p>
        </div>

        <div>
          <span className="font-semibold text-emerald-600 dark:text-emerald-400 block text-[10px] uppercase font-mono mb-0.5">
            NASA Countermeasure:
          </span>
          <p className="text-slate-600 dark:text-slate-300 leading-relaxed text-[11px]">
            {systemInfo.nasaSolution}
          </p>
        </div>
      </div>
    </div>
  );
};

export default SystemTelemetryIndicator;

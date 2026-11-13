import React from "react";
import type { MissionData } from "../../../../health-data";

interface TimelineSliderProps {
  mission: MissionData;
  currentDay: number;
  onSelectDay: (day: number) => void;
  showChart: boolean;
  onToggleChart: () => void;
}

export const TimelineSlider: React.FC<TimelineSliderProps> = ({
  mission,
  currentDay,
  onSelectDay,
  showChart,
  onToggleChart,
}) => {
  const intervals = mission.intervals || [];
  const currentIntervalIndex = intervals.findIndex((int) => int.day === currentDay);
  const activeInterval =
    currentIntervalIndex !== -1 ? intervals[currentIntervalIndex] : intervals[0];

  const handlePrev = () => {
    if (intervals.length === 0) return;
    const prevIdx =
      currentIntervalIndex > 0 ? currentIntervalIndex - 1 : intervals.length - 1;
    onSelectDay(intervals[prevIdx].day);
  };

  const handleNext = () => {
    if (intervals.length === 0) return;
    const nextIdx =
      currentIntervalIndex < intervals.length - 1 ? currentIntervalIndex + 1 : 0;
    onSelectDay(intervals[nextIdx].day);
  };

  return (
    <div className="rounded-2xl backdrop-blur-2xl border border-slate-800/90 bg-slate-950/90 text-slate-100 shadow-[0_0_35px_rgba(2,132,199,0.2)] p-3 transition-all duration-300 w-full max-w-xl mx-auto select-none">
      {/* Top Header: Phase Title & Chart Toggle */}
      <div className="flex items-center justify-between gap-2 mb-2 pb-2 border-b border-slate-800/80">
        <div className="flex items-center gap-2 min-w-0">
          <span className="text-sm font-mono font-bold text-cyan-300 shrink-0">
            {activeInterval ? activeInterval.label : `DAY D+${currentDay}`}
          </span>
          {activeInterval?.phase && (
            <span className="text-xs font-mono px-2.5 py-0.5 rounded-full bg-cyan-950/70 border border-cyan-500/30 text-cyan-300 uppercase tracking-wider font-semibold truncate">
              {activeInterval.phase}
            </span>
          )}
        </div>

        <button
          onClick={onToggleChart}
          className={`flex items-center gap-1.5 px-3 py-1 rounded-xl text-xs font-mono font-semibold border transition-all ${
            showChart
              ? "bg-cyan-500 text-slate-950 font-bold border-cyan-400 shadow-[0_0_12px_rgba(6,182,212,0.4)]"
              : "bg-slate-900 border-slate-800 text-slate-300 hover:bg-slate-800 hover:text-white"
          }`}
        >
          <span>📊</span>
          <span>Charts</span>
        </button>
      </div>

      {/* Milestone Navigation Pills */}
      <div className="flex items-center gap-2">
        <button
          onClick={handlePrev}
          className="w-8 h-8 rounded-xl bg-slate-900 hover:bg-slate-800 border border-slate-800 text-cyan-400 flex items-center justify-center shrink-0 transition-all font-mono font-bold text-base"
          title="Previous timepoint"
        >
          ‹
        </button>

        <div className="flex-1 flex items-center gap-2 overflow-x-auto py-1 scrollbar-none">
          {intervals.map((int) => {
            const isActive = currentDay === int.day;
            return (
              <button
                key={int.day}
                onClick={() => onSelectDay(int.day)}
                className={`px-3 py-1.5 rounded-xl text-xs font-mono font-semibold transition-all border shrink-0 flex items-center gap-1.5 ${
                  isActive
                    ? "bg-cyan-500 text-slate-950 font-bold border-cyan-400 shadow-[0_0_12px_rgba(6,182,212,0.35)]"
                    : "bg-slate-900/60 border-slate-800 text-slate-300 hover:border-slate-700 hover:text-white"
                }`}
              >
                <span>{int.label}</span>
              </button>
            );
          })}
        </div>

        <button
          onClick={handleNext}
          className="w-8 h-8 rounded-xl bg-slate-900 hover:bg-slate-800 border border-slate-800 text-cyan-400 flex items-center justify-center shrink-0 transition-all font-mono font-bold text-base"
          title="Next timepoint"
        >
          ›
        </button>
      </div>

      {/* Milestone Research Notes */}
      {activeInterval?.notes && (
        <div className="mt-2 pt-2 border-t border-slate-900 text-xs text-slate-200 leading-relaxed flex items-start gap-2 font-sans">
          <span className="w-1.5 h-1.5 rounded-full bg-cyan-400 shrink-0 mt-1.5" />
          <span>{activeInterval.notes}</span>
        </div>
      )}
    </div>
  );
};

export default TimelineSlider;

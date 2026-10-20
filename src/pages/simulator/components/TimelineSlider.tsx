import React, { useEffect, useRef } from "react";
import type { MissionData } from "../../../../health-data";

interface TimelineSliderProps {
  mission: MissionData;
  currentDay: number;
  onSelectDay: (day: number) => void;
  isPlaying: boolean;
  onTogglePlay: () => void;
  showChart: boolean;
  onToggleChart: () => void;
  theme: "studio" | "dark";
}

export const TimelineSlider: React.FC<TimelineSliderProps> = ({
  mission,
  currentDay,
  onSelectDay,
  isPlaying,
  onTogglePlay,
  showChart,
  onToggleChart,
  theme,
}) => {
  const isDark = theme === "dark";
  const timerRef = useRef<number | null>(null);

  const maxDay = Math.max(1, mission.durationDays);
  const intervals = mission.intervals;

  // Derive timePoint phase directly from mission.timePoints
  const currentTimePoint =
    currentDay === 0
      ? mission.timePoints[0] || "pre-flight"
      : currentDay >= maxDay
      ? mission.timePoints[2] || "post-flight"
      : mission.timePoints[1] || "in-flight";

  // Auto-playback simulation loop
  useEffect(() => {
    if (isPlaying) {
      const step = maxDay > 100 ? 2 : 1;
      const intervalMs = maxDay > 100 ? 50 : maxDay > 10 ? 90 : 350;

      timerRef.current = window.setInterval(() => {
        onSelectDay(
          currentDay >= maxDay ? 0 : Math.min(maxDay, currentDay + step)
        );
      }, intervalMs);
    } else if (timerRef.current) {
      clearInterval(timerRef.current);
      timerRef.current = null;
    }

    return () => {
      if (timerRef.current) {
        clearInterval(timerRef.current);
      }
    };
  }, [isPlaying, currentDay, maxDay, onSelectDay]);

  return (
    <div
      className={`rounded-2xl backdrop-blur-xl border p-3.5 shadow-2xl transition-all duration-300 w-full max-w-xl ${
        isDark
          ? "bg-slate-950/85 border-slate-800 text-slate-100 shadow-cyan-950/30"
          : "bg-white/95 border-slate-200 text-slate-800 shadow-slate-300/40"
      }`}
    >
      {/* Top Header: Current Day & TimePoint */}
      <div className="flex items-center justify-between gap-2 mb-2 pb-2 border-b border-slate-200/60 dark:border-slate-800/80">
        <div className="flex items-center gap-2">
          <span className="text-xs font-mono font-semibold text-sky-600 dark:text-cyan-400">
            Day {currentDay} of {maxDay}
          </span>
          <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-slate-100 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-slate-500 dark:text-slate-400 uppercase">
            {currentTimePoint}
          </span>
        </div>

        {/* Chart View Toggle */}
        <button
          onClick={onToggleChart}
          className={`flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-xs font-medium border transition-all ${
            showChart
              ? "bg-sky-600 text-white border-sky-600 shadow-sm"
              : isDark
              ? "bg-slate-900 border-slate-700 text-slate-300 hover:bg-slate-800"
              : "bg-white border-slate-300 text-slate-700 hover:bg-slate-100"
          }`}
        >
          <svg
            className="w-3.5 h-3.5"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M7 12l3-3 3 3 4-4M8 21l4-4 4 4M3 4h18M4 4h16v12a1 1 0 01-1 1H5a1 1 0 01-1-1V4z"
            />
          </svg>
          <span>Chart</span>
        </button>
      </div>

      {/* Play/Pause Button & Slider Track */}
      <div className="flex items-center gap-3">
        <button
          onClick={onTogglePlay}
          className={`w-8 h-8 rounded-xl flex items-center justify-center font-bold transition-all shadow-sm shrink-0 ${
            isPlaying
              ? "bg-amber-500 hover:bg-amber-400 text-slate-950"
              : "bg-sky-600 hover:bg-sky-500 text-white"
          }`}
          title={isPlaying ? "Pause simulation" : "Play timeline"}
        >
          {isPlaying ? (
            <svg className="w-3.5 h-3.5" fill="currentColor" viewBox="0 0 24 24">
              <path d="M6 19h4V5H6v14zm8-14v14h4V5h-4z" />
            </svg>
          ) : (
            <svg className="w-3.5 h-3.5 translate-x-0.5" fill="currentColor" viewBox="0 0 24 24">
              <path d="M8 5v14l11-7z" />
            </svg>
          )}
        </button>

        {/* Continuous Slider Track */}
        <input
          type="range"
          min={0}
          max={maxDay}
          step={1}
          value={currentDay}
          onChange={(e) => onSelectDay(Number(e.target.value))}
          className="w-full h-1.5 rounded-lg appearance-none cursor-pointer accent-sky-500 bg-slate-200 dark:bg-slate-800 focus:outline-none"
        />
      </div>

      {/* Discrete Mission Interval Buttons (From health-data.ts) */}
      <div className="flex items-center gap-1.5 mt-2.5 pt-2 border-t border-slate-200/60 dark:border-slate-800/80">
        <span className="text-[10px] font-mono text-slate-400 mr-1">
          Intervals:
        </span>
        <div className="flex flex-wrap items-center gap-1.5">
          {intervals.map((int) => {
            const isActive = currentDay === int.day;
            return (
              <button
                key={int.day}
                onClick={() => onSelectDay(int.day)}
                className={`px-2 py-0.5 rounded-md text-[10px] font-mono transition-all ${
                  isActive
                    ? "bg-sky-600 text-white font-bold shadow-sm"
                    : isDark
                    ? "bg-slate-900 border border-slate-800 text-slate-300 hover:border-slate-700"
                    : "bg-slate-100 border border-slate-200 text-slate-700 hover:bg-slate-200"
                }`}
              >
                Day {int.day}
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default TimelineSlider;

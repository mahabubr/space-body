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
}

export const TimelineSlider: React.FC<TimelineSliderProps> = ({
  mission,
  currentDay,
  onSelectDay,
  isPlaying,
  onTogglePlay,
  showChart,
  onToggleChart,
}) => {
  const timerRef = useRef<number | null>(null);
  const [playbackSpeed, setPlaybackSpeed] = React.useState<number>(1);

  const maxDay = Math.max(1, mission.durationDays);
  const intervals = mission.intervals;

  const currentTimePoint =
    currentDay === 0
      ? mission.timePoints[0] || "pre-flight"
      : currentDay >= maxDay
      ? mission.timePoints[2] || "post-flight"
      : mission.timePoints[1] || "in-flight";

  useEffect(() => {
    if (isPlaying && intervals && intervals.length > 0) {
      const stepDuration = Math.round(1600 / playbackSpeed);
      timerRef.current = window.setInterval(() => {
        const currentIndex = intervals.findIndex((int) => int.day === currentDay);
        if (currentIndex !== -1) {
          const nextIndex = (currentIndex + 1) % intervals.length;
          onSelectDay(intervals[nextIndex].day);
        } else {
          const nextInterval = intervals.find((int) => int.day > currentDay);
          if (nextInterval) {
            onSelectDay(nextInterval.day);
          } else {
            onSelectDay(intervals[0].day);
          }
        }
      }, stepDuration);
    } else if (timerRef.current) {
      clearInterval(timerRef.current);
      timerRef.current = null;
    }

    return () => {
      if (timerRef.current) {
        clearInterval(timerRef.current);
      }
    };
  }, [isPlaying, currentDay, intervals, onSelectDay, playbackSpeed]);

  const progressPercent = Math.min(100, Math.max(0, (currentDay / maxDay) * 100));

  return (
    <div className="rounded-2xl backdrop-blur-2xl border border-slate-800/90 bg-slate-950/90 text-slate-100 shadow-[0_0_35px_rgba(2,132,199,0.2)] p-3.5 transition-all duration-300 w-full max-w-xl select-none">
      <div className="flex items-center justify-between gap-2 mb-2 pb-2 border-b border-slate-800/80">
        <div className="flex items-center gap-2">
          <span className="text-xs font-mono font-bold text-cyan-300">
            MET: D+{currentDay} <span className="text-slate-500 font-normal">/ {maxDay}d</span>
          </span>
          <span className="text-[9px] font-mono px-2 py-0.5 rounded-full bg-slate-900 border border-slate-800 text-slate-300 uppercase tracking-wider font-semibold">
            {currentTimePoint}
          </span>
        </div>

        <div className="flex items-center gap-1.5">
          {/* Playback Speed Multiplier */}
          <button
            onClick={() => setPlaybackSpeed((s) => (s === 1 ? 2 : s === 2 ? 3 : 1))}
            className="px-2 py-0.5 rounded-lg text-[10px] font-mono border border-slate-800 bg-slate-900/90 hover:bg-slate-800 text-cyan-400 font-bold transition-all"
            title="Cycle simulation playback speed"
          >
            {playbackSpeed}x
          </button>

          <button
            onClick={onToggleChart}
            className={`flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-xs font-medium border transition-all ${
              showChart
                ? "bg-cyan-500 text-slate-950 font-bold border-cyan-400 shadow-[0_0_12px_rgba(6,182,212,0.4)]"
                : "bg-slate-900/90 border-slate-800 text-slate-300 hover:bg-slate-800 hover:text-white"
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
            <span>Telemetry</span>
          </button>
        </div>
      </div>

      <div className="flex items-center gap-3">
        <button
          onClick={onTogglePlay}
          className={`w-8 h-8 rounded-xl flex items-center justify-center font-bold transition-all shadow-md shrink-0 ${
            isPlaying
              ? "bg-amber-400 hover:bg-amber-300 text-slate-950 shadow-[0_0_14px_rgba(251,191,36,0.6)]"
              : "bg-cyan-400 hover:bg-cyan-300 text-slate-950 shadow-[0_0_14px_rgba(34,211,238,0.5)]"
          }`}
          title={isPlaying ? "Pause simulation timeline" : "Play mission timeline"}
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

        {/* Custom Mission Slider with Filled Gradient Track */}
        <div className="relative flex-1 flex flex-col justify-center">
          <div className="w-full h-1.5 rounded-full bg-slate-900 relative overflow-hidden pointer-events-none">
            <div
              className="h-full rounded-full transition-all duration-300"
              style={{
                width: `${progressPercent}%`,
                background: "linear-gradient(90deg, #0284c7, #22d3ee)",
                boxShadow: "0 0 8px rgba(34,211,238,0.5)",
              }}
            />
          </div>

          <input
            type="range"
            min={0}
            max={Math.max(0, intervals.length - 1)}
            step={1}
            value={Math.max(
              0,
              intervals.findIndex((int) => int.day === currentDay) !== -1
                ? intervals.findIndex((int) => int.day === currentDay)
                : 0
            )}
            onChange={(e) => {
              const index = Number(e.target.value);
              if (intervals[index]) {
                onSelectDay(intervals[index].day);
              }
            }}
            className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
          />
        </div>
      </div>

      {/* Mission Phases & Quick Interval Jumps */}
      <div className="flex items-center justify-between gap-1.5 mt-2.5 pt-2 border-t border-slate-800/80">
        <div className="flex items-center gap-1.5 overflow-x-auto py-0.5 pr-1">
          <span className="text-[9px] font-mono text-slate-500 uppercase font-bold tracking-wider shrink-0 mr-1">
            JUMP:
          </span>
          {intervals.map((int) => {
            const isActive = currentDay === int.day;
            return (
              <button
                key={int.day}
                onClick={() => onSelectDay(int.day)}
                className={`px-2 py-0.5 rounded-lg text-[10px] font-mono transition-all border shrink-0 ${
                  isActive
                    ? "bg-cyan-500 text-slate-950 font-bold border-cyan-400 shadow-[0_0_10px_rgba(6,182,212,0.4)]"
                    : "bg-slate-900/80 border-slate-800 text-slate-300 hover:border-slate-700 hover:text-white"
                }`}
              >
                D{int.day}
              </button>
            );
          })}
        </div>

        <div className="hidden sm:flex items-center gap-1 text-[9px] font-mono text-slate-500 uppercase tracking-widest shrink-0">
          <span>HRP-BIO</span>
        </div>
      </div>
    </div>
  );
};

export default TimelineSlider;

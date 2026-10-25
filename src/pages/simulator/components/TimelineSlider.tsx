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
      }, 1600);
    } else if (timerRef.current) {
      clearInterval(timerRef.current);
      timerRef.current = null;
    }

    return () => {
      if (timerRef.current) {
        clearInterval(timerRef.current);
      }
    };
  }, [isPlaying, currentDay, intervals, onSelectDay]);

  return (
    <div className="rounded-2xl backdrop-blur-xl border border-slate-800/90 bg-slate-950/85 text-slate-100 shadow-[0_0_30px_rgba(2,132,199,0.15)] p-3.5 transition-all duration-300 w-full max-w-xl">
      <div className="flex items-center justify-between gap-2 mb-2 pb-2 border-b border-slate-800/80">
        <div className="flex items-center gap-2">
          <span className="text-xs font-mono font-semibold text-cyan-400">
            Day {currentDay} of {maxDay}
          </span>
          <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-slate-900 border border-slate-800 text-slate-400 uppercase">
            {currentTimePoint}
          </span>
        </div>

        <button
          onClick={onToggleChart}
          className={`flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-xs font-medium border transition-all ${
            showChart
              ? "bg-cyan-500 text-slate-950 font-bold border-cyan-400 shadow-[0_0_12px_rgba(6,182,212,0.4)]"
              : "bg-slate-900/90 border-slate-700 text-slate-300 hover:bg-slate-800 hover:text-white"
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

      <div className="flex items-center gap-3">
        <button
          onClick={onTogglePlay}
          className={`w-8 h-8 rounded-xl flex items-center justify-center font-bold transition-all shadow-sm shrink-0 ${
            isPlaying
              ? "bg-amber-400 hover:bg-amber-300 text-slate-950 shadow-[0_0_10px_rgba(251,191,36,0.5)]"
              : "bg-cyan-500 hover:bg-cyan-400 text-slate-950 shadow-[0_0_10px_rgba(6,182,212,0.4)]"
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
          className="w-full h-1.5 rounded-lg appearance-none cursor-pointer accent-cyan-400 bg-slate-800 focus:outline-none"
        />
      </div>

      <div className="flex items-center gap-1.5 mt-2.5 pt-2 border-t border-slate-800/80">
        <span className="text-[10px] font-mono text-slate-400 mr-1 uppercase font-semibold">
          Intervals:
        </span>
        <div className="flex flex-wrap items-center gap-1.5">
          {intervals.map((int) => {
            const isActive = currentDay === int.day;
            return (
              <button
                key={int.day}
                onClick={() => onSelectDay(int.day)}
                className={`px-2.5 py-1 rounded-lg text-[10px] font-mono transition-all border ${
                  isActive
                    ? "bg-cyan-500 text-slate-950 font-bold border-cyan-400 shadow-[0_0_10px_rgba(6,182,212,0.4)]"
                    : "bg-slate-900 border border-slate-800 text-slate-300 hover:border-slate-700 hover:text-white"
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

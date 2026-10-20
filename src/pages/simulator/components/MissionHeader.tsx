import React from "react";
import type { MissionData } from "../../../../health-data";

interface MissionHeaderProps {
  missions: MissionData[];
  selectedMission: MissionData;
  onSelectMission: (mission: MissionData) => void;
  theme: "studio" | "dark";
}

export const MissionHeader: React.FC<MissionHeaderProps> = ({
  missions,
  selectedMission,
  onSelectMission,
  theme,
}) => {
  const isDark = theme === "dark";

  return (
    <div className="flex items-center gap-2 pointer-events-auto">
      {/* Mission Select Dropdown */}
      <select
        value={selectedMission.id}
        onChange={(e) => {
          const found = missions.find((m) => m.id === e.target.value);
          if (found) onSelectMission(found);
        }}
        className={`rounded-xl px-3 py-2 text-xs font-semibold tracking-wide border outline-none cursor-pointer pr-8 shadow-sm transition-all ${
          isDark
            ? "bg-slate-900 text-cyan-300 border-cyan-500/40 hover:border-cyan-400 focus:ring-1 focus:ring-cyan-400"
            : "bg-white text-slate-800 border-slate-300 hover:border-sky-500 focus:ring-1 focus:ring-sky-500"
        }`}
        style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 24 24' stroke='%230284c7'%3E%3Cpath stroke-linecap='round' stroke-linejoin='round' stroke-width='2' d='M19 9l-7 7-7-7'%3E%3C/path%3E%3C/svg%3E")`,
          backgroundRepeat: "no-repeat",
          backgroundPosition: "right 0.5rem center",
          backgroundSize: "0.8rem 0.8rem",
        }}
      >
        {missions.map((m) => (
          <option key={m.id} value={m.id}>
            {m.name}
          </option>
        ))}
      </select>

      {/* Clean Mission Info Pill (Only fields from health-data.ts) */}
      <div
        className={`hidden lg:flex items-center gap-2 px-3 py-2 rounded-xl border text-xs font-mono backdrop-blur-md shadow-sm ${
          isDark
            ? "bg-slate-900/80 border-slate-800 text-slate-300"
            : "bg-white/90 border-slate-300 text-slate-700"
        }`}
      >
        <span className="font-semibold text-sky-500 dark:text-cyan-400">
          {selectedMission.destination}
        </span>
        <span className="opacity-40">•</span>
        <span>{selectedMission.durationDays} Days</span>
        <span className="opacity-40">•</span>
        <span>{selectedMission.year || selectedMission.yearRange}</span>
        {selectedMission.crewSize && (
          <>
            <span className="opacity-40">•</span>
            <span>Crew: {selectedMission.crewSize}</span>
          </>
        )}
        {selectedMission.astronaut && (
          <>
            <span className="opacity-40">•</span>
            <span>Astronaut: {selectedMission.astronaut}</span>
          </>
        )}
        <span className="opacity-40">•</span>
        <a
          href={selectedMission.dataSource}
          target="_blank"
          rel="noopener noreferrer"
          className="text-sky-600 dark:text-cyan-400 hover:underline flex items-center gap-1 font-sans font-medium"
          title="Data source"
        >
          <span>Data Source</span>
          <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
          </svg>
        </a>
      </div>
    </div>
  );
};

export default MissionHeader;

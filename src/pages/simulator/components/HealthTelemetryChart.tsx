import React, { useState } from "react";
import type { MissionData } from "../../../../health-data";
import type { SystemId } from "../../../components/human/internal/system-data";
import {
  formatObservationValue,
  getObservationMetricName,
  getSourceById,
  type OSDRDatasetItem,
  type PublishedNumericalObservation,
  type StudySource,
} from "../../../../health-data";

interface HealthTelemetryChartProps {
  mission: MissionData;
  currentDay: number;
  onSelectDay: (day: number) => void;
  selectedSystem: SystemId | null;
  onSelectSystem: (system: SystemId | null) => void;
}

const DXA_SITES = [
  { site: "Trochanter", monthlyLoss: -1.56, totalLoss: -9.3, recovery: "Multi-year remodeling", color: "#f43f5e" },
  { site: "Pelvis", monthlyLoss: -1.35, totalLoss: -8.1, recovery: "Extended plateau", color: "#ec4899" },
  { site: "Femoral Neck", monthlyLoss: -1.15, totalLoss: -7.0, recovery: "Prolonged exponential", color: "#f59e0b" },
  { site: "Lumbar Spine", monthlyLoss: -1.06, totalLoss: -6.3, recovery: "~9 months half-time", color: "#fbbf24" },
  { site: "Calcaneus", monthlyLoss: -0.89, totalLoss: -5.3, recovery: "Rapid ambulatory response", color: "#38bdf8" },
  { site: "Cortical Bone", monthlyLoss: -0.34, totalLoss: -2.0, recovery: "Mild demineralization", color: "#a78bfa" },
];

export const HealthTelemetryChart: React.FC<HealthTelemetryChartProps> = ({
  mission,
  currentDay,
  onSelectDay,
  selectedSystem: _selectedSystem,
  onSelectSystem: _onSelectSystem,
}) => {
  const [activeTab, setActiveTab] = useState<"findings" | "milestones" | "bmd_sites" | "osdr">(
    mission.id === "LONG_DURATION_BMD_COHORT_2007" ? "bmd_sites" : "findings"
  );
  const [filterQuery, setFilterQuery] = useState<string>("");

  const missionObservations: PublishedNumericalObservation[] = mission.observations || [];
  const osdrDatasets: OSDRDatasetItem[] = (mission.osdr_datasets as OSDRDatasetItem[]) || [];

  const filteredObservations = missionObservations.filter((obs) => {
    if (!filterQuery) return true;
    const q = filterQuery.toLowerCase();
    const name = getObservationMetricName(obs).toLowerCase();
    const ctx = (obs.measurement_context || "").toLowerCase();
    const sub = (obs.subject_code || "").toLowerCase();
    return name.includes(q) || ctx.includes(q) || sub.includes(q);
  });

  return (
    <div className="w-full select-none text-slate-100 space-y-3">
      {/* Visualizer Mode Switcher */}
      <div className="flex flex-wrap items-center justify-between gap-2 pb-2.5 border-b border-slate-800">
        <div className="flex flex-wrap items-center gap-2">
          <button
            onClick={() => setActiveTab("findings")}
            className={`px-3 py-1.5 rounded-xl text-xs font-mono font-semibold transition-all ${
              activeTab === "findings"
                ? "bg-cyan-500 text-slate-950 font-bold shadow-md"
                : "text-slate-300 hover:text-white bg-slate-900 border border-slate-800"
            }`}
          >
            NASA Published Findings ({missionObservations.length})
          </button>

          <button
            onClick={() => setActiveTab("milestones")}
            className={`px-3 py-1.5 rounded-xl text-xs font-mono font-semibold transition-all ${
              activeTab === "milestones"
                ? "bg-cyan-500 text-slate-950 font-bold shadow-md"
                : "text-slate-300 hover:text-white bg-slate-900 border border-slate-800"
            }`}
          >
            Flight Phases ({mission.intervals?.length || 0})
          </button>

          <button
            onClick={() => setActiveTab("bmd_sites")}
            className={`px-3 py-1.5 rounded-xl text-xs font-mono font-semibold transition-all ${
              activeTab === "bmd_sites"
                ? "bg-amber-500 text-slate-950 font-bold shadow-md"
                : "text-slate-300 hover:text-white bg-slate-900 border border-slate-800"
            }`}
          >
            DXA Bone Loss (N=45)
          </button>

          {osdrDatasets.length > 0 && (
            <button
              onClick={() => setActiveTab("osdr")}
              className={`px-3 py-1.5 rounded-xl text-xs font-mono font-semibold transition-all ${
                activeTab === "osdr"
                  ? "bg-emerald-500 text-slate-950 font-bold shadow-md"
                  : "text-slate-300 hover:text-white bg-slate-900 border border-slate-800"
              }`}
            >
              NASA OSDR ({osdrDatasets.length})
            </button>
          )}
        </div>

        <div className="text-xs font-mono text-slate-300 shrink-0">
          Timeline: <span className="text-cyan-400 font-bold">Day D+{currentDay}</span>
        </div>
      </div>

      {/* Tab 1: NASA Published Numerical Findings */}
      {activeTab === "findings" && (
        <div className="space-y-3">
          {/* Filter Bar */}
          <div className="flex items-center justify-between gap-2">
            <input
              type="text"
              placeholder="Search findings by metric, organ, or keyword..."
              value={filterQuery}
              onChange={(e) => setFilterQuery(e.target.value)}
              className="w-full px-3.5 py-2 rounded-xl bg-slate-900 border border-slate-800 text-sm font-mono text-cyan-300 placeholder:text-slate-500 focus:outline-none focus:border-cyan-500/60"
            />
            {filterQuery && (
              <button
                onClick={() => setFilterQuery("")}
                className="text-xs font-mono text-slate-400 hover:text-white px-2.5 py-1.5 rounded-lg bg-slate-800 shrink-0"
              >
                Clear
              </button>
            )}
          </div>

          <div className="rounded-2xl bg-slate-950/80 p-3 border border-slate-800/80 max-h-[55vh] overflow-y-auto space-y-2.5 pr-1">
            {filteredObservations.length === 0 ? (
              <div className="p-4 text-center text-sm text-slate-400 font-mono">
                No matching findings for "{filterQuery}". Check the OSDR or DXA tabs.
              </div>
            ) : (
              filteredObservations.map((obs) => {
                const metricName = getObservationMetricName(obs);
                const formattedVal = formatObservationValue(obs);
                const isNOf1 =
                  obs.evidence_class === "published_individual_or_n_of_1_observation";

                return (
                  <div
                    key={obs.observation_id}
                    className="p-3 rounded-xl bg-slate-900/70 border border-slate-800/80 hover:border-cyan-500/40 transition-colors flex flex-col gap-2"
                  >
                    <div className="flex items-baseline justify-between gap-2">
                      <div className="flex items-center gap-2 min-w-0">
                        <span className="w-2 h-2 rounded-full bg-cyan-400 shrink-0" />
                        <span className="font-mono text-xs sm:text-sm font-bold text-cyan-300 truncate">
                          {metricName}
                        </span>
                      </div>
                      <span className="font-mono text-sm sm:text-base font-extrabold text-amber-300 shrink-0">
                        {formattedVal}
                      </span>
                    </div>

                    <p className="text-xs sm:text-[13px] text-slate-200 leading-relaxed font-sans">
                      {obs.measurement_context || obs.interpretation}
                    </p>

                    <div className="flex flex-wrap items-center justify-between gap-2 pt-1.5 border-t border-slate-800 text-xs font-mono text-slate-400">
                      <div className="flex items-center gap-2">
                        {obs.subject_code && (
                          <span className="px-2 py-0.5 rounded bg-slate-800 text-slate-200 font-semibold">
                            Subject: {obs.subject_code}
                          </span>
                        )}
                        <span
                          className={`px-2 py-0.5 rounded border ${
                            isNOf1
                              ? "bg-purple-500/15 text-purple-300 border-purple-500/30"
                              : "bg-blue-500/15 text-blue-300 border-blue-500/30"
                          }`}
                        >
                          {isNOf1 ? "N-of-1 Subject" : "Cohort Mean"}
                        </span>
                      </div>

                      <div className="flex items-center gap-1.5">
                        {obs.source_ids.map((srcId) => {
                          const src: StudySource | undefined = getSourceById(srcId);
                          if (!src?.url) return null;
                          return (
                            <a
                              key={srcId}
                              href={src.url || src.doi_url}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="text-cyan-400 hover:text-cyan-300 font-bold underline flex items-center gap-1 text-xs"
                              title={src.title}
                            >
                              <span>View Paper</span>
                              <span className="text-xs">↗</span>
                            </a>
                          );
                        })}
                      </div>
                    </div>
                  </div>
                );
              })
            )}
          </div>
        </div>
      )}

      {/* Tab 2: Authentic Mission Milestones & Timepoints */}
      {activeTab === "milestones" && (
        <div className="rounded-2xl bg-slate-950/80 p-3 border border-slate-800/80 max-h-[55vh] overflow-y-auto space-y-2.5 pr-1">
          {(mission.intervals || []).map((int) => {
            const isCurrent = currentDay === int.day;
            return (
              <div
                key={int.day}
                onClick={() => onSelectDay(int.day)}
                className={`p-3.5 rounded-xl border transition-all cursor-pointer ${
                  isCurrent
                    ? "bg-slate-900 border-cyan-400 shadow-[0_0_15px_rgba(6,182,212,0.2)] ring-1 ring-cyan-400/40"
                    : "bg-slate-900/40 border-slate-800 hover:border-slate-700"
                }`}
              >
                <div className="flex items-center justify-between gap-2 mb-1.5">
                  <div className="flex items-center gap-2">
                    <span
                      className={`w-2.5 h-2.5 rounded-full ${
                        isCurrent ? "bg-cyan-400 animate-pulse shadow-[0_0_6px_#22d3ee]" : "bg-slate-600"
                      }`}
                    />
                    <span className="font-mono text-sm font-bold text-cyan-300">
                      {int.label}
                    </span>
                    {int.phase && (
                      <span className="text-xs font-mono px-2 py-0.5 rounded bg-slate-800 text-slate-300 font-medium">
                        {int.phase}
                      </span>
                    )}
                  </div>
                  <span className="text-xs font-mono text-slate-400 font-semibold">
                    Day D+{int.day}
                  </span>
                </div>

                {int.notes && (
                  <p className="text-xs sm:text-[13px] text-slate-200 leading-relaxed font-sans mt-1">
                    {int.notes}
                  </p>
                )}

                {int.observedBiomarkers && int.observedBiomarkers.length > 0 && (
                  <div className="flex flex-wrap gap-1.5 mt-2 pt-2 border-t border-slate-800">
                    {int.observedBiomarkers.map((b) => (
                      <span
                        key={b}
                        className="text-xs font-mono px-2 py-0.5 rounded bg-slate-950 border border-slate-800 text-slate-300"
                      >
                        {b}
                      </span>
                    ))}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}

      {/* Tab 3: NASA 45-Astronaut DXA Skeletal Loss Rates (Mir & ISS) */}
      {activeTab === "bmd_sites" && (
        <div className="rounded-2xl bg-slate-950/80 p-4 border border-slate-800/80 max-h-[55vh] overflow-y-auto space-y-3.5">
          <div className="flex items-start justify-between gap-2 pb-2.5 border-b border-slate-800">
            <div>
              <h4 className="text-sm font-bold font-mono text-white">
                NASA Long-Duration Astronaut DXA Bone Loss (LeBlanc et al. 2007)
              </h4>
              <p className="text-xs text-slate-400 font-mono mt-0.5">
                45 Astronauts • 56 Pre/Post Flight Dual-Energy X-Ray Absorptiometry Sets
              </p>
            </div>
            <a
              href="https://ntrs.nasa.gov/archive/nasa/casi.ntrs.nasa.gov/20070032016.pdf"
              target="_blank"
              rel="noopener noreferrer"
              className="text-xs font-mono font-bold text-cyan-400 hover:underline shrink-0"
            >
              NASA NTRS ↗
            </a>
          </div>

          <div className="space-y-3">
            {DXA_SITES.map((site) => {
              const barPercent = Math.min(100, Math.round((Math.abs(site.monthlyLoss) / 1.6) * 100));
              return (
                <div key={site.site} className="p-3 rounded-xl bg-slate-900/60 border border-slate-800/80">
                  <div className="flex items-center justify-between text-xs sm:text-sm font-mono mb-1.5">
                    <span className="font-bold text-slate-200">{site.site}</span>
                    <span className="font-extrabold" style={{ color: site.color }}>
                      {site.monthlyLoss} % / month ({site.totalLoss}% total)
                    </span>
                  </div>
                  <div className="w-full h-2 rounded-full bg-slate-950 overflow-hidden mb-1.5">
                    <div
                      className="h-full rounded-full transition-all duration-500"
                      style={{
                        width: `${barPercent}%`,
                        backgroundColor: site.color,
                      }}
                    />
                  </div>
                  <div className="flex items-center justify-between text-xs font-mono text-slate-400">
                    <span>Recovery: {site.recovery}</span>
                    <span>Predicted 50% recovery: 9 mos</span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* Tab 4: NASA Inspiration4 OSDR Multi-Omics Datasets */}
      {activeTab === "osdr" && (
        <div className="rounded-2xl bg-slate-950/80 p-3 border border-slate-800/80 max-h-[55vh] overflow-y-auto space-y-2.5 pr-1">
          <div className="flex items-center justify-between pb-2 border-b border-slate-800 text-xs font-mono text-slate-400">
            <span>NASA OPEN SCIENCE DATA REPOSITORY</span>
            <span className="text-emerald-400 font-bold">Nature 2024 S-Omics Package</span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
            {osdrDatasets.map((ds) => (
              <div
                key={ds.accession}
                className="p-3 rounded-xl bg-slate-900/60 border border-slate-800 hover:border-emerald-500/40 transition-colors flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-center justify-between mb-1.5">
                    <a
                      href={ds.study_url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="font-mono text-sm font-bold text-emerald-400 hover:underline flex items-center gap-1"
                    >
                      <span>{ds.accession}</span>
                      <span className="text-xs">↗</span>
                    </a>
                    <span className="text-xs font-mono px-2 py-0.5 rounded bg-emerald-500/10 text-emerald-300 font-semibold">
                      {ds.sample_material}
                    </span>
                  </div>
                  <p className="text-xs text-slate-200 leading-relaxed line-clamp-2 font-sans mb-2">
                    {ds.title}
                  </p>
                </div>

                <div className="flex flex-wrap gap-1.5 pt-1.5 border-t border-slate-800">
                  {(ds.assays || []).slice(0, 3).map((a) => (
                    <span
                      key={a}
                      className="text-xs font-mono px-2 py-0.5 rounded bg-slate-950 text-slate-300 border border-slate-800"
                    >
                      {a}
                    </span>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default HealthTelemetryChart;

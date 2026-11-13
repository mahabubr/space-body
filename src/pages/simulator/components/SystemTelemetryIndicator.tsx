import React, { useState } from "react";
import type { SystemInfo, SystemId } from "../../../components/human/internal/system-data";
import {
  getObservationsForSystem,
  getOSDRDatasetsForSystem,
  getSourceById,
  formatObservationValue,
  getObservationMetricName,
  type PublishedNumericalObservation,
  type OSDRDatasetItem,
  type StudySource,
  type MissionDescription,
} from "../../../../health-data";

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
  description: _description,
  isSelected = false,
  isHovered = false,
  onSelectSystem,
  onClose,
}) => {
  const [activeTab, setActiveTab] = useState<"findings" | "osdr" | "countermeasures">("findings");
  const val = healthValue ?? 100;

  // Retrieve authentic NASA published findings and OSDR datasets
  const observations: PublishedNumericalObservation[] = getObservationsForSystem(systemInfo.id);
  const osdrDatasets: OSDRDatasetItem[] = getOSDRDatasetsForSystem(systemInfo.id);

  // Status badge styling
  const riskColor =
    systemInfo.missionRisk === "CRITICAL"
      ? { text: "text-rose-400", bg: "bg-rose-500/15", border: "border-rose-500/30", bar: "#f43f5e" }
      : systemInfo.missionRisk === "HIGH"
      ? { text: "text-amber-400", bg: "bg-amber-500/15", border: "border-amber-500/30", bar: "#f59e0b" }
      : { text: "text-cyan-400", bg: "bg-cyan-500/15", border: "border-cyan-500/30", bar: "#06b6d4" };

  if (!isSelected) {
    return (
      <div
        onClick={(e) => {
          e.stopPropagation();
          onSelectSystem?.(systemInfo.id);
        }}
        className={`group cursor-pointer rounded-2xl backdrop-blur-2xl border p-4 transition-all duration-300 w-full shadow-2xl relative overflow-hidden select-none ${
          isHovered
            ? "bg-slate-950/95 border-cyan-400 shadow-[0_0_24px_rgba(34,211,238,0.25)] ring-1 ring-cyan-400/40"
            : "bg-slate-950/85 border-slate-800 hover:border-slate-700 hover:bg-slate-900/90"
        }`}
      >
        <div
          className="absolute top-0 left-0 right-0 h-[2px] opacity-80"
          style={{
            background: `linear-gradient(90deg, transparent, ${riskColor.bar}, transparent)`,
          }}
        />

        <div className="flex items-center justify-between gap-2 mb-2">
          <div className="flex items-center gap-2 min-w-0">
            <span
              className="w-2.5 h-2.5 rounded-full shrink-0 shadow-[0_0_6px_currentColor] animate-pulse"
              style={{ backgroundColor: riskColor.bar, color: riskColor.bar }}
            />
            <h4 className="text-sm font-bold tracking-tight text-slate-100 truncate font-mono">
              {systemInfo.name}
            </h4>
          </div>
          <span
            className={`text-xs font-mono px-2 py-0.5 rounded font-bold border shrink-0 tracking-wider ${riskColor.bg} ${riskColor.text} ${riskColor.border}`}
          >
            {systemInfo.code}
          </span>
        </div>

        <p className="text-xs text-slate-300 line-clamp-2 mb-3 leading-relaxed font-sans">
          {systemInfo.shortDescription}
        </p>

        <div className="flex items-center justify-between text-xs font-mono text-slate-400 pt-2 border-t border-slate-900">
          <span className="flex items-center gap-1.5 text-cyan-400 font-semibold group-hover:text-cyan-300 transition-colors">
            <span>{observations.length} Published Findings</span>
            {osdrDatasets.length > 0 && (
              <span className="text-slate-500">• {osdrDatasets.length} OSDR</span>
            )}
          </span>
          <span className="group-hover:translate-x-0.5 transition-transform text-cyan-400 font-bold">
            EXPAND →
          </span>
        </div>
      </div>
    );
  }

  return (
    <div
      onClick={(e) => e.stopPropagation()}
      className="w-full flex-1 flex flex-col min-h-0 text-slate-100 select-none"
    >
      {/* Header */}
      <div className="flex items-start justify-between gap-2 pb-3 mb-3 border-b border-slate-800/90 shrink-0">
        <div>
          <div className="flex items-center gap-2 flex-wrap mb-1.5">
            <span
              className="w-2.5 h-2.5 rounded-full shrink-0 shadow-[0_0_8px_currentColor] animate-pulse"
              style={{ backgroundColor: riskColor.bar, color: riskColor.bar }}
            />
            <h3 className="text-base font-bold tracking-tight text-cyan-300 font-mono">
              {systemInfo.name}
            </h3>
            <span
              className={`text-xs font-mono px-2 py-0.5 rounded font-bold border shrink-0 tracking-wider ${riskColor.bg} ${riskColor.text} ${riskColor.border}`}
            >
              {systemInfo.missionRisk} RISK
            </span>
          </div>
          <div className="flex items-center gap-2 text-xs font-mono text-slate-400">
            <span className="text-cyan-400 font-bold">{systemInfo.code}</span>
            <span>•</span>
            <span className="text-amber-300 font-medium">{systemInfo.badge}</span>
          </div>
        </div>

        {onClose && (
          <button
            onClick={onClose}
            className="text-slate-300 hover:text-white px-2.5 py-1 rounded-lg hover:bg-slate-800 border border-slate-700 hover:border-slate-600 transition-all text-xs font-mono font-semibold"
            title="Return to Study Overview"
          >
            ✕ Overview
          </button>
        )}
      </div>

      {/* Mandatory NASA Scientific Rigor Notice */}
      <div className="mb-3 p-3 rounded-xl bg-cyan-950/30 border border-cyan-500/20 text-xs text-cyan-200 space-y-1.5 font-mono shrink-0">
        <div className="flex items-center gap-2 font-bold text-cyan-300 uppercase tracking-wider text-xs">
          <span className="w-2 h-2 rounded-full bg-cyan-400 shadow-[0_0_6px_#22d3ee]" />
          NASA Research Data Integrity Notice
        </div>
        <p className="text-xs leading-relaxed text-slate-300 font-sans">
          Historical human spaceflight research data. Not live astronaut telemetry. Per NASA protocols, research biomarkers do not constitute clinical diagnoses or alert thresholds.
        </p>
        <div className="flex items-center justify-between pt-1.5 border-t border-cyan-500/20 text-xs text-cyan-300 font-semibold">
          <span>TIMELINE MET: D+{currentDay}</span>
          <span>Baseline Model Index: {val.toFixed(1)}%</span>
        </div>
      </div>

      {/* Sub-Tabs: Published Findings / NASA OSDR / Countermeasures */}
      <div className="flex items-center gap-1.5 mb-3 p-1 rounded-xl bg-slate-900/90 border border-slate-800 shrink-0">
        <button
          onClick={() => setActiveTab("findings")}
          className={`flex-1 py-1.5 rounded-lg text-xs font-mono font-semibold transition-all ${
            activeTab === "findings"
              ? "bg-cyan-500 text-slate-950 font-bold shadow-md"
              : "text-slate-300 hover:text-white hover:bg-slate-800"
          }`}
        >
          Findings ({observations.length})
        </button>
        <button
          onClick={() => setActiveTab("osdr")}
          className={`flex-1 py-1.5 rounded-lg text-xs font-mono font-semibold transition-all ${
            activeTab === "osdr"
              ? "bg-cyan-500 text-slate-950 font-bold shadow-md"
              : "text-slate-300 hover:text-white hover:bg-slate-800"
          }`}
        >
          NASA OSDR ({osdrDatasets.length})
        </button>
        <button
          onClick={() => setActiveTab("countermeasures")}
          className={`flex-1 py-1.5 rounded-lg text-xs font-mono font-semibold transition-all ${
            activeTab === "countermeasures"
              ? "bg-cyan-500 text-slate-950 font-bold shadow-md"
              : "text-slate-300 hover:text-white hover:bg-slate-800"
          }`}
        >
          Protocols
        </button>
      </div>

      {/* Tab 1: Authentic Published Observations */}
      {activeTab === "findings" && (
        <div className="space-y-2.5 flex-1 overflow-y-auto pr-1">
          {observations.length === 0 ? (
            <div className="p-3.5 rounded-xl bg-slate-900/60 border border-slate-800 text-slate-300 text-xs leading-relaxed font-sans">
              <p className="font-semibold text-white mb-1 font-mono text-sm">Qualitative Monitoring Domain</p>
              This body system is monitored under NASA Spaceflight Standard Measures protocols (see the OSDR & Protocol tabs).
            </div>
          ) : (
            observations.map((obs) => {
              const evidenceLabel =
                obs.evidence_class === "published_individual_or_n_of_1_observation"
                  ? "N-of-1 Individual"
                  : obs.evidence_class === "published_cohort_aggregate"
                  ? "Cohort Aggregate (N=45)"
                  : "Dataset Metadata";

              const evidenceClassStyle =
                obs.evidence_class === "published_individual_or_n_of_1_observation"
                  ? "bg-purple-500/15 text-purple-300 border-purple-500/30"
                  : obs.evidence_class === "published_cohort_aggregate"
                  ? "bg-blue-500/15 text-blue-300 border-blue-500/30"
                  : "bg-emerald-500/15 text-emerald-300 border-emerald-500/30";

              const metricTitle = getObservationMetricName(obs);
              const formattedVal = formatObservationValue(obs);

              return (
                <div
                  key={obs.observation_id}
                  className="p-3 rounded-xl bg-slate-900/70 border border-slate-800/90 hover:border-cyan-500/40 transition-colors flex flex-col gap-2"
                >
                  <div className="flex items-baseline justify-between gap-2">
                    <span className="font-mono text-xs font-bold text-cyan-300">
                      {metricTitle}
                    </span>
                    <span className="font-mono text-sm font-extrabold text-amber-300 shrink-0">
                      {formattedVal}
                    </span>
                  </div>

                  <p className="text-xs text-slate-200 leading-relaxed font-sans">
                    {obs.measurement_context || obs.interpretation}
                  </p>

                  {/* Context & Subject Badges */}
                  <div className="flex flex-wrap items-center gap-1.5 text-xs font-mono text-slate-400">
                    {obs.subject_code && (
                      <span className="px-2 py-0.5 rounded bg-slate-800 text-slate-200 font-semibold">
                        Subject: {obs.subject_code}
                      </span>
                    )}
                    {obs.time_context && (
                      <span className="px-2 py-0.5 rounded bg-slate-800 text-slate-300">
                        {obs.time_context}
                      </span>
                    )}
                    {obs.statistical_result && (
                      <span className="px-2 py-0.5 rounded bg-cyan-950/60 border border-cyan-500/30 text-cyan-300">
                        {obs.statistical_result.method ? `${obs.statistical_result.method} ` : ""}
                        {obs.statistical_result.p_value !== undefined ? `p=${obs.statistical_result.p_value}` : ""}
                        {obs.statistical_result.q_value ? `q ${obs.statistical_result.q_value}` : ""}
                      </span>
                    )}
                  </div>

                  {obs.interpretation && (
                    <p className="text-xs text-slate-300 italic bg-black/40 p-2 rounded-lg border border-slate-800/90 leading-relaxed">
                      "{obs.interpretation}"
                    </p>
                  )}

                  <div className="flex items-center justify-between gap-2 pt-1.5 border-t border-slate-800 text-xs font-mono">
                    <span className={`px-2 py-0.5 rounded border ${evidenceClassStyle}`}>
                      {evidenceLabel}
                    </span>
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
                            className="text-cyan-400 hover:text-cyan-300 font-bold underline flex items-center gap-1"
                            title={src.title}
                          >
                            <span>Citation</span>
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
      )}

      {/* Tab 2: NASA Open Science Data Repository (OSDR) Datasets */}
      {activeTab === "osdr" && (
        <div className="space-y-2.5 flex-1 overflow-y-auto pr-1">
          {osdrDatasets.length === 0 ? (
            <p className="text-slate-300 text-xs font-mono py-2">
              No direct Inspiration4 OSDR datasets associated with this specific system; see Spaceflight Standard Measures.
            </p>
          ) : (
            osdrDatasets.map((ds) => (
              <div
                key={ds.accession}
                className="p-3 rounded-xl bg-slate-900/70 border border-slate-800 hover:border-emerald-500/40 transition-colors"
              >
                <div className="flex items-center justify-between gap-2 mb-1.5">
                  <a
                    href={ds.study_url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="font-mono text-sm font-bold text-emerald-400 hover:underline flex items-center gap-1"
                  >
                    <span>{ds.accession}</span>
                    <span className="text-xs">↗</span>
                  </a>
                  <span className="text-xs font-mono px-2 py-0.5 rounded bg-emerald-500/10 text-emerald-300 border border-emerald-500/20 font-semibold">
                    {ds.sample_material}
                  </span>
                </div>
                <p className="text-xs text-slate-200 font-medium leading-relaxed mb-2 font-sans">
                  {ds.title}
                </p>
                <div className="text-xs text-slate-300 font-mono flex flex-wrap gap-1.5">
                  {(ds.assays || []).map((assay) => (
                    <span
                      key={assay}
                      className="px-2 py-0.5 rounded bg-slate-950 border border-slate-800 text-slate-300"
                    >
                      {assay}
                    </span>
                  ))}
                </div>
              </div>
            ))
          )}
        </div>
      )}

      {/* Tab 3: Spaceflight Pathology & NASA Countermeasures */}
      {activeTab === "countermeasures" && (
        <div className="space-y-2.5 flex-1 overflow-y-auto pr-1">
          <div className="rounded-xl p-3 bg-rose-500/10 border border-rose-500/25">
            <span className="font-bold text-rose-400 block text-xs uppercase font-mono mb-1.5 tracking-wider flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-rose-400" />
              Microgravity Space Stress:
            </span>
            <p className="text-slate-200 leading-relaxed text-xs sm:text-[13px] font-sans">
              {systemInfo.problemInSpace}
            </p>
          </div>

          <div className="rounded-xl p-3 bg-amber-500/10 border border-amber-500/25">
            <span className="font-bold text-amber-400 block text-xs uppercase font-mono mb-1.5 tracking-wider flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-amber-400" />
              Astronaut Clinical Impact:
            </span>
            <p className="text-slate-200 leading-relaxed text-xs sm:text-[13px] font-sans">
              {systemInfo.effectOnAstronauts}
            </p>
          </div>

          <div className="rounded-xl p-3 bg-emerald-500/10 border border-emerald-500/25">
            <span className="font-bold text-emerald-400 block text-xs uppercase font-mono mb-1.5 tracking-wider flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-emerald-400" />
              NASA Flight Countermeasure:
            </span>
            <p className="text-slate-200 leading-relaxed text-xs sm:text-[13px] font-sans">
              {systemInfo.nasaSolution}
            </p>
          </div>
        </div>
      )}
    </div>
  );
};

export default SystemTelemetryIndicator;

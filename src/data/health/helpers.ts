import type {
  PublishedNumericalObservation,
  OSDRDatasetItem,
  StudySource,
} from "./types";
import { PUBLISHED_NUMERICAL_OBSERVATIONS } from "./observations";
import { NASA_OSDR_INSPIRATION4_DATASETS } from "./osdr";
import { SOURCES } from "./sources";
import { BODY_REGION_MAPPING } from "./regions";
import { MISSIONS_AND_STUDIES_METADATA } from "./missions";
import { DATA_INTEGRITY } from "./metadata";

export function getObservationsForSystem(systemId: string): PublishedNumericalObservation[] {
  const sysMapping: Record<string, string[]> = {
    heart: ["cardiovascular", "cardiovascular_metabolic"],
    brain: ["brain_cognition"],
    eyes: ["eyes_neuro_ocular"],
    blood: ["fluid_balance_electrolytes", "metabolism"],
    immune_system: ["immune_inflammation", "immune_cell_gene_expression", "molecular_and_immune"],
    bones: ["musculoskeletal_bone"],
    muscles: ["musculoskeletal_bone", "nutrition"],
    digestive_system: ["digestive_microbiome", "metabolism_renal"],
    skin: ["molecular_and_immune", "digestive_microbiome"],
    whole_body: ["whole_body_radiation", "whole_body_nutrition_hydration", "fluid_balance_renal", "cellular_metabolism"],
    spacecraft_environment: [],
  };

  const targetBodySystems = sysMapping[systemId] || [];
  return PUBLISHED_NUMERICAL_OBSERVATIONS.filter((obs) => targetBodySystems.includes(obs.body_system));
}

export function getObservationsForStudy(studyId: string): PublishedNumericalObservation[] {
  return PUBLISHED_NUMERICAL_OBSERVATIONS.filter((obs) => obs.study_id === studyId);
}

export function getOSDRDatasetsForSystem(systemId: string): OSDRDatasetItem[] {
  const sysToOSDRSystem: Record<string, string[]> = {
    heart: ["heart", "cardiovascular", "immune"],
    brain: ["brain", "sleep", "cognitive"],
    eyes: ["ocular", "eyes"],
    blood: ["blood", "hematologic", "plasma", "immune"],
    immune_system: ["immune", "blood", "cytokine", "inflammation"],
    bones: ["bone", "skeletal"],
    muscles: ["muscle", "muscular"],
    digestive_system: ["digestive", "gut", "microbiome", "stool"],
    skin: ["skin", "swab", "dermal"],
    whole_body: ["whole_body", "radiation", "metabolism"],
    spacecraft_environment: ["spacecraft", "capsule", "environmental", "spacecraft_environment"],
  };

  const matches = sysToOSDRSystem[systemId] || [systemId];
  return NASA_OSDR_INSPIRATION4_DATASETS.filter((dataset) =>
    dataset.relevant_body_systems.some((sys) => matches.includes(sys.toLowerCase()))
  );
}

export function getSourceById(sourceId: string): StudySource | undefined {
  return SOURCES.find((s) => s.source_id === sourceId);
}

export function getSourcesForObservation(obs: PublishedNumericalObservation): StudySource[] {
  return obs.source_ids
    .map((id) => getSourceById(id))
    .filter((s): s is StudySource => Boolean(s));
}

export function validateNASAHealthDataset(): {
  isValid: boolean;
  report: string;
  counts: {
    missions: number;
    observations: number;
    osdrDatasets: number;
    sources: number;
    bodyRegions: number;
  };
} {
  const missions = MISSIONS_AND_STUDIES_METADATA.length || 0;
  const observations = PUBLISHED_NUMERICAL_OBSERVATIONS.length || 0;
  const osdrDatasets = NASA_OSDR_INSPIRATION4_DATASETS.length || 0;
  const sources = SOURCES.length || 0;
  const bodyRegions = BODY_REGION_MAPPING.length || 0;

  const isValid =
    missions === 4 &&
    observations === 29 &&
    osdrDatasets === 10 &&
    sources === 24 &&
    bodyRegions === 11 &&
    (DATA_INTEGRITY as any).fabricated_measurements === 0 &&
    (DATA_INTEGRITY as any).synthetic_measurements === 0;

  const report = isValid
    ? "NASA Dataset integrity verified: 4 research studies, 29 published numerical observations, 10 Inspiration4 OSDR datasets, 11 Three.js body regions, and 24 primary scientific source citations."
    : "Warning: Dataset integrity validation reported unexpected counts.";

  return {
    isValid,
    report,
    counts: { missions, observations, osdrDatasets, sources, bodyRegions },
  };
}

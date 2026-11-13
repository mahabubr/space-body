export type EvidenceClass =
  | "published_individual_or_n_of_1_observation"
  | "published_cohort_aggregate"
  | "dataset_metadata"
  | "monitoring_method_reference";

export interface PublishedNumericalObservation {
  observation_id: string;
  evidence_class: EvidenceClass;
  study_id: string;
  body_system: string;
  metric?: string;
  metrics?: { metric: string; direction: string }[];
  value?: number | string | null;
  value_range?: { minimum: number; maximum: number };
  comparator?: string;
  value_before_mmol_per_litre?: number;
  value_after_mmol_per_litre?: number;
  value_before_ml?: number;
  value_after_ml?: number;
  direction?: string;
  statistical_result?: {
    p_value?: number | string;
    q_value?: string;
    method?: string;
    false_discovery_rate?: string;
    test?: string;
    [key: string]: unknown;
  };
  model_estimate?: {
    metric?: string;
    value?: number;
    unit?: string;
    meaning?: string;
    [key: string]: unknown;
  };
  population?: {
    crew_members?: number;
    pre_post_measurement_sets?: number;
    [key: string]: unknown;
  };
  skeletal_sites?: string[];
  unit?: string | null;
  measurement_context?: string;
  time_context?: string;
  subject_code?: string | null;
  clinical_threshold: null;
  interpretation?: string;
  source_ids: string[];
  [key: string]: unknown;
}

export interface StudySource {
  source_id: string;
  title: string;
  authors?: string;
  year?: number;
  doi?: string;
  publisher?: string;
  url?: string;
  doi_url?: string;
  source_type?: string;
  notes?: string;
  document_id?: string;
  [key: string]: unknown;
}

export interface BodyRegionMappingData {
  body_region_id: string;
  display_name: string;
  research_dataset_ids: string[];
  displayable_evidence: string[];
  do_not_label_as?: string[];
  data_classification_warning?: string;
  interpretation_warning?: string;
  [key: string]: unknown;
}

export interface OSDRDatasetItem {
  accession: string;
  title: string;
  repository_ids?: {
    gene_lab?: string;
    life_sciences?: string;
    [key: string]: unknown;
  };
  sample_material: string;
  assays: string[];
  assay?: string;
  relevant_body_systems: string[];
  clinical_data_priority?: string;
  omics_data_priority?: string;
  study_url: string;
  notes: string[];
  source_ids: string[];
  [key: string]: unknown;
}

export interface StandardMeasureDomainItem {
  domain: string;
  method: string;
  application_region: string;
  data_type: string;
  frequency?: string;
  note?: string;
  [key: string]: unknown;
}

export interface HealthMetrics {
  eye: number;
  muscle: number;
  bones: number;
  brain: number;
  heart?: number;
  blood?: number;
  immune_system?: number;
  digestive_system?: number;
  skin?: number;
  whole_body?: number;
  spacecraft_environment?: number;
  [key: string]: number | undefined;
}

export interface MissionInterval {
  day: number;
  label: string;
  phase: string;
  health: HealthMetrics;
  notes?: string;
  observedBiomarkers?: string[];
  [key: string]: unknown;
}

export interface MissionDescription {
  shortDescription: string;
  problemInSpace: string;
  effectOnAstronauts: string;
  nasaSolution: string;
  [key: string]: unknown;
}

export interface MissionData {
  id: string;
  name: string;
  yearRange?: string;
  year?: number;
  missionType: string;
  destination: string;
  crewSize: number | null;
  astronaut?: string;
  earthBasedControl?: string;
  dataSource: string;
  flightSubjectCode?: string;
  groundControlCode?: string;
  healthSystems: string[];
  timePoints: string[];
  durationDays: number;
  intervals: MissionInterval[];
  description?: Record<string, MissionDescription>;
  study_id: string;
  study_title: string;
  doi?: string;
  primary_source_url?: string;
  evidence_class_summary: string;
  observations: PublishedNumericalObservation[];
  osdr_datasets?: OSDRDatasetItem[];
  sources: StudySource[];
  [key: string]: unknown;
}

export interface RawHealthDataset {
  metadata: Record<string, unknown>;
  data_integrity: Record<string, unknown>;
  missions_and_studies: Record<string, unknown>[];
  published_numerical_observations: PublishedNumericalObservation[];
  nasa_osdr_inspiration4_datasets: OSDRDatasetItem[];
  nasa_standard_measures: Record<string, unknown>;
  body_region_mapping_for_threejs: BodyRegionMappingData[];
  nasa_osdr_api: Record<string, unknown>;
  data_import_schema: Record<string, unknown>;
  sources: StudySource[];
  competition_ready_recommendations: Record<string, unknown>;
  [key: string]: unknown;
}

export type NASAHealthDataset = RawHealthDataset & MissionData[];

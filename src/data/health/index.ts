import {
  METADATA,
  DATA_INTEGRITY,
  NASA_OSDR_API,
  DATA_IMPORT_SCHEMA,
  COMPETITION_READY_RECOMMENDATIONS,
} from "./metadata";
import { MISSIONS_AND_STUDIES_METADATA, MISSIONS_DATA } from "./missions";
import { PUBLISHED_NUMERICAL_OBSERVATIONS } from "./observations";
import { NASA_OSDR_INSPIRATION4_DATASETS, NASA_STANDARD_MEASURES } from "./osdr";
import { BODY_REGION_MAPPING } from "./regions";
import { SOURCES } from "./sources";
import type { NASAHealthDataset, RawHealthDataset } from "./types";

export * from "./types";
export * from "./metadata";
export * from "./sources";
export * from "./regions";
export * from "./observations";
export * from "./osdr";
export * from "./missions";
export * from "./formatters";
export * from "./helpers";

export const RAW_HEALTH_DATA: RawHealthDataset = {
  metadata: METADATA,
  data_integrity: DATA_INTEGRITY,
  missions_and_studies: MISSIONS_AND_STUDIES_METADATA,
  published_numerical_observations: PUBLISHED_NUMERICAL_OBSERVATIONS,
  nasa_osdr_inspiration4_datasets: NASA_OSDR_INSPIRATION4_DATASETS,
  nasa_standard_measures: NASA_STANDARD_MEASURES,
  body_region_mapping_for_threejs: BODY_REGION_MAPPING,
  nasa_osdr_api: NASA_OSDR_API,
  data_import_schema: DATA_IMPORT_SCHEMA,
  sources: SOURCES,
  competition_ready_recommendations: COMPETITION_READY_RECOMMENDATIONS,
};

export const HEALTH_DATA: NASAHealthDataset = Object.assign(
  [...MISSIONS_DATA],
  RAW_HEALTH_DATA
) as unknown as NASAHealthDataset;

export default HEALTH_DATA;

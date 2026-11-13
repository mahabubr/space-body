export const METADATA = {
    title: "NASA Human Spaceflight Health Research Data",
    version: "2.0.0",
    compiled_on: "2026-11-13",
    format: "JSON",
    language: "en",
    intended_use:
      "Research-backed reference data and dataset catalogue for an astronaut health-monitoring application using React and Three.js.",
    scope: [
      "Published numerical findings from the NASA Twins Study",
      "Published aggregate bone mineral density findings from long-duration spaceflight",
      "NASA OSDR Inspiration4 dataset catalogue",
      "NASA Spaceflight Standard Measures monitoring domains",
      "NASA Life Sciences Data Archive and actigraphy catalogue references",
      "Documented API routes for retrieving source files",
      "Additional published numerical findings from the NASA Twins Study, including fluid balance, microbiome, mitochondrial, epigenetic and metabolic results.",
      "Expanded NASA OSDR OSD-575 and OSD-656 sample and assay processing metadata.",
    ],
    important_scope_limit:
      "This file is not a complete raw-data export from NASA OSDR or the NASA Life Sciences Data Archive. It contains numerical findings explicitly reported in primary publications, verified study metadata, and source retrieval instructions. Individual raw observation rows from NASA CSV/XLSX files have not been imported into this file.",
};

export const DATA_INTEGRITY = {
    fabricated_measurements: 0,
    synthetic_measurements: 0,
    raw_nasa_observation_rows_imported: 0,
    published_numerical_findings_included: true,
    dataset_metadata_included: true,
    rules: [
      "Do not interpret a published cohort statistic as an individual astronaut reading.",
      "Do not interpret a biomarker change as a clinical diagnosis.",
      "Do not convert a sample count, assay replicate count, or library count into a participant count.",
      "Do not label historical research data as live or real-time astronaut telemetry.",
      "Do not combine measurements from different assays, matrices, or normalization schemes without a documented harmonization method.",
      "Preserve original units, timepoints, subject codes, sample identifiers, assay names, and source file names during future imports.",
      "A missing value must remain null; null does not mean zero, normal, negative, or absent.",
      "No medical alert threshold is defined in this file.",
    ],
    evidence_classes: {
      published_individual_or_n_of_1_observation:
        "A result reported for a named study subject or a single flight participant. It is not a population reference range.",
      published_cohort_aggregate:
        "A statistic reported across multiple participants or measurement sets.",
      dataset_metadata:
        "Information describing what NASA collected and which assay or sample type was used. It is not a measurement result.",
      monitoring_method_reference:
        "A NASA-described assessment method or monitoring domain. It does not imply that numerical observations are publicly downloadable.",
    },
};

export const NASA_OSDR_API = {
    api_documentation_url: "https://visualization.osdr.nasa.gov/biodata/api/",
    api_base_url: "https://visualization.osdr.nasa.gov/biodata/api",
    osdr_public_api_documentation_url: "https://api.nasa.gov/",
    endpoints: [
      {
        purpose: "Get dataset metadata",
        method: "GET",
        url_template:
          "https://visualization.osdr.nasa.gov/biodata/api/v2/dataset/{OSD_ACCESSION}/",
        example:
          "https://visualization.osdr.nasa.gov/biodata/api/v2/dataset/OSD-575/",
      },
      {
        purpose: "List assays in a dataset",
        method: "GET",
        url_template:
          "https://visualization.osdr.nasa.gov/biodata/api/v2/dataset/{OSD_ACCESSION}/assays/",
        example:
          "https://visualization.osdr.nasa.gov/biodata/api/v2/dataset/OSD-575/assays/",
      },
      {
        purpose: "List files for a dataset and obtain official download URLs",
        method: "GET",
        url_template:
          "https://visualization.osdr.nasa.gov/biodata/api/v2/dataset/{OSD_ACCESSION}/files/",
        example:
          "https://visualization.osdr.nasa.gov/biodata/api/v2/dataset/OSD-575/files/",
      },
      {
        purpose:
          "Query a tabular source file after confirming its exact name in the file listing",
        method: "GET",
        url_template:
          "https://visualization.osdr.nasa.gov/biodata/api/v2/query/data/?id.accession={OSD_ACCESSION}&file.file%20name={EXACT_FILE_NAME}&format=json.records",
        example:
          "https://visualization.osdr.nasa.gov/biodata/api/v2/query/data/?id.accession=OSD-575&file.file%20name=LSDS-8_Multiplex_serum_cardiovascular_EvePanel_TRANSFORMED.csv&format=json.records",
        warning:
          "This query pattern is based on NASA API documentation. Confirm the exact file name and file metadata first; do not assume every listed file is tabular or accessible through the same query.",
        format_note:
          "NASA documents json.records as an output format for query endpoints. One of file.data type or file.file name must be supplied to select the underlying file.",
      },
      {
        purpose: "Legacy OSDR file metadata API",
        method: "GET",
        url_template:
          "https://osdr.nasa.gov/osdr/data/osd/files/{NUMERIC_STUDY_ID}?page=0&size=25",
        example: "https://osdr.nasa.gov/osdr/data/osd/files/575?page=0&size=25",
      },
      {
        purpose: "Legacy OSDR study metadata API",
        method: "GET",
        url_template:
          "https://osdr.nasa.gov/osdr/data/osd/meta/{NUMERIC_STUDY_ID}",
        example: "https://osdr.nasa.gov/osdr/data/osd/meta/575",
      },
    ],
    api_documented_capabilities: [
      "Dataset, assay, sample and file metadata retrieval",
      "File listings with direct download URLs",
      "Tabular data queries",
      "CSV, TSV, JSON and raw file output options",
      "JSON null handling for missing values",
      "Query output formats include json.records, json.split and json.table; missing values are represented as JSON null.",
    ],
    recommended_import_sequence: [
      "Request dataset metadata.",
      "Request the dataset file listing.",
      "Identify the processed file and read its file-level metadata.",
      "Download the original file from the official URL returned by NASA.",
      "Preserve the original file and compute a SHA-256 checksum.",
      "Parse the file without changing source values.",
      "Store original column names, units, sample identifiers, subject codes, timepoints, assay names and normalization details.",
      "Validate row counts and missing values against the source file.",
      "Only then map variables to the Three.js body regions.",
    ],
    source_ids: ["SRC_OSDR_BIODATA_API", "SRC_OSDR_PUBLIC_API"],
};

export const DATA_IMPORT_SCHEMA = {
    required_observation_fields: [
      "observation_id",
      "dataset_accession",
      "source_file_name",
      "source_file_url",
      "source_file_sha256",
      "sample_id",
      "subject_code",
      "collection_timepoint",
      "analyte_or_variable",
      "value",
      "unit",
      "assay_name",
      "instrument_or_platform",
      "data_processing_status",
      "normalization_method",
      "evidence_class",
    ],
    field_rules: {
      value:
        "Store the source value as a number or string exactly as appropriate; use null only for a genuinely missing value.",
      unit: "Copy the unit from the source file or its data dictionary. Never infer units from the variable name.",
      collection_timepoint:
        "Copy the exact source label and optionally add a separately documented normalized timepoint.",
      subject_code:
        "Use only the de-identified subject code provided by the dataset.",
      normalization_method:
        "Record the source transformation and reference/baseline used by the assay provider.",
      source_file_sha256:
        "Calculate after downloading the file to provide reproducible provenance.",
    },
};

export const COMPETITION_READY_RECOMMENDATIONS = {
    best_research_story:
      "Use the NASA Twins Study to demonstrate why long-duration monitoring must track individual baselines and trends, and use Inspiration4 to demonstrate how multi-omics and clinical laboratory evidence can be linked to body systems.",
    best_live_demo_data: [
      {
        module: "Historical long-duration evidence",
        source: "NASA Twins Study",
        use: "Show published long-duration findings with their N-of-1 label and exact units, including radiation dose, body mass, energy intake, cardiovascular adaptation, bone turnover, cognition, immune and microbiome observations.",
        label: "Published historical research — one flight subject",
      },
      {
        module: "Laboratory research evidence",
        source: "OSD-575",
        use: "Import the actual processed serum CMP and assay outputs. Keep the Eve Technologies concentration values separate from Alamar NULISA NPQ values, and preserve the Eve pre-flight crew-average normalization.",
        label: "NASA OSDR processed research data",
      },
      {
        module: "CBC and immune-cell evidence",
        source: "OSD-569 and OSD-570",
        use: "Import CBC values and immune-cell profiles when the source files and access status permit.",
        label: "NASA OSDR processed research data",
      },
      {
        module: "Sleep analytics",
        source: "UTMB Bedrest Campaign 1 Actigraphy",
        use: "Demonstrate real sleep-duration, sleep-latency and sleep-efficiency trends, clearly labelled as ground-analogue data.",
        label: "NASA ground-analogue research data",
      },
    ],
    do_not_claim: [
      "NASA live astronaut medical data access",
      "A NASA-approved diagnosis engine",
      "A validated Mars-mission medical alert threshold system",
      "That Inspiration4 serum samples are continuous in-flight vital signs",
      "That a one-person Twins Study result is a population norm",
    ],
};

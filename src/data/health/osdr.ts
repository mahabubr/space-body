import type { OSDRDatasetItem } from "./types";

export const NASA_OSDR_INSPIRATION4_DATASETS: OSDRDatasetItem[] = [
    {
      accession: "OSD-569",
      title: "Whole Blood Measurements from the SpaceX Inspiration4 Mission",
      repository_ids: {
        gene_lab: "GLDS-561",
        life_sciences: "LSDS-7",
      },
      sample_material: "Whole blood",
      assays: [
        "Complete blood count (CBC)",
        "RNA sequencing",
        "Epitranscriptomics",
        "Whole-genome sequencing",
        "Clonal hematopoiesis analysis",
      ],
      relevant_body_systems: ["blood", "hematologic", "immune"],
      clinical_data_priority: "high_for_CBC",
      omics_data_priority: "high_for_research_context",
      study_url: "https://osdr.nasa.gov/bio/repo/data/studies/OSD-569",
      notes: [
        "CBC is the directly clinical laboratory component.",
        "RNA-seq, epitranscriptome and genome data are molecular research outputs, not vital signs.",
        "Check the current Files panel for exact processed file names and access conditions.",
      ],
      source_ids: ["SRC_I4_DATA_ACCESS_PAPER", "SRC_NASA_I4_DATASETS"],
    },
    {
      accession: "OSD-570",
      title: "SpaceX Inspiration4 PBMC Profiling",
      repository_ids: {
        gene_lab: "GLDS-562",
      },
      sample_material: "Peripheral blood mononuclear cells (PBMCs)",
      collection_timepoints: ["L-92", "L-44", "L-3", "R+1", "R+45", "R+82"],
      assays: [
        "Single-nucleus RNA sequencing",
        "Single-nucleus ATAC sequencing",
        "T-cell receptor repertoire profiling",
        "B-cell receptor repertoire profiling",
      ],
      relevant_body_systems: ["immune", "blood"],
      study_url: "https://osdr.nasa.gov/bio/repo/data/studies/OSD-570",
      current_access_note:
        "The study page reports that requests and access to restricted files have been temporarily disabled. Check the live page before planning a download.",
      notes: [
        "The samples were collected before and after the three-day flight, not continuously during flight.",
        "PBMC molecular profiles are not equivalent to a bedside immune-function test.",
      ],
      source_ids: ["SRC_OSD_570", "SRC_I4_DATA_ACCESS_PAPER"],
    },
    {
      accession: "OSD-571",
      title: "SpaceX Inspiration4 Plasma Profiling",
      repository_ids: {
        gene_lab: "GLDS-563",
      },
      sample_material: "Blood plasma",
      assays: [
        "Proteomics",
        "Extracellular-vesicle proteomics",
        "Metabolomics",
        "Cell-free DNA sequencing",
        "Cell-free RNA sequencing",
      ],
      relevant_body_systems: ["blood", "metabolism", "vascular_research"],
      study_url: "https://osdr.nasa.gov/bio/repo/data/studies/OSD-571",
      notes: [
        "These are plasma molecular profiles.",
        "Do not label these data as heart rate, ECG, blood pressure, or oxygen saturation.",
      ],
      source_ids: ["SRC_I4_DATA_ACCESS_PAPER", "SRC_NASA_I4_DATASETS"],
    },
    {
      accession: "OSD-572",
      title: "SpaceX Inspiration4 Oral, Nasal, and Skin Microbial Swabs",
      repository_ids: {
        gene_lab: "GLDS-564",
      },
      sample_material: "Oral, nasal, and skin swabs",
      sample_location_count: 10,
      sample_locations: [
        "oral",
        "nasal cavity",
        "post-auricular",
        "axillary vault",
        "volar forearm",
        "occiput",
        "umbilicus",
        "gluteal crease",
        "glabella",
        "toe web space",
      ],
      collection_timepoints: [
        "L-92",
        "L-44",
        "L-3",
        "FD2",
        "FD3",
        "R+1",
        "R+45",
        "R+82",
      ],
      assays: [
        "Whole-genome shotgun metagenomic sequencing",
        "Metatranscriptomic RNA sequencing",
      ],
      relevant_body_systems: ["skin", "oral", "nasal", "microbiome"],
      study_url: "https://osdr.nasa.gov/bio/repo/data/studies/OSD-572",
      notes: [
        "Microbiome composition is not a direct infection diagnosis.",
        "The study includes two in-flight collection timepoints, FD2 and FD3.",
      ],
      source_ids: ["SRC_NASA_I4_SWABS", "SRC_I4_DATA_ACCESS_PAPER"],
    },
    {
      accession: "OSD-573",
      title: "SpaceX Inspiration4 Dragon Capsule Microbial Swabs",
      repository_ids: {
        gene_lab: "GLDS-565",
      },
      sample_material:
        "Spacecraft surface swabs and environmental control sample",
      assays: [
        "Whole-genome shotgun metagenomic sequencing",
        "Metatranscriptomic RNA sequencing",
      ],
      relevant_body_systems: ["spacecraft_environment"],
      study_url: "https://osdr.nasa.gov/bio/repo/data/studies/OSD-573",
      notes: [
        "This is an environmental microbiology dataset, not a human body measurement.",
        "Use it in a separate cabin/environment panel.",
      ],
      source_ids: ["SRC_NASA_I4_DATASETS", "SRC_I4_DATA_ACCESS_PAPER"],
    },
    {
      accession: "OSD-574",
      title: "SpaceX Inspiration4 Deltoid Skin Biopsy and Microbiome Data",
      repository_ids: {
        gene_lab: "GLDS-566",
      },
      sample_material: "Deltoid skin biopsies and skin swabs",
      biopsy_timepoints: ["L-44", "R+1"],
      crew_profiled: {
        preflight: 4,
        postflight: 3,
      },
      biopsy_diameter_mm: {
        minimum: 3,
        maximum: 4,
      },
      skin_regions_profiled: [
        "outer epidermis",
        "inner epidermis",
        "outer dermis",
        "vasculature",
      ],
      assays: [
        "Spatial transcriptomics",
        "Whole-genome shotgun metagenomics",
        "Metatranscriptomics",
      ],
      relevant_body_systems: ["skin", "immune_research", "vascular_research"],
      study_url: "https://osdr.nasa.gov/bio/repo/data/studies/OSD-574",
      notes: [
        "Three crew members, not four, had post-flight biopsies.",
        "Spatial transcriptomics is research tissue profiling, not a wearable skin sensor.",
      ],
      source_ids: ["SRC_OSD_574", "SRC_I4_DATA_ACCESS_PAPER"],
    },
    {
      accession: "OSD-575",
      title:
        "SpaceX Inspiration4 Blood Serum Metabolic Panel and Immune/Cardiac Cytokine Arrays",
      repository_ids: {
        life_sciences: "LSDS-8",
      },
      doi: "10.26030/mc5d-p710",
      sample_material: "Blood serum",
      collection_timepoints: ["L-92", "L-44", "L-3", "R+1", "R+45", "R+82"],
      assays: [
        "Comprehensive metabolic panel",
        "Human Cytokine/Chemokine 71-Plex Discovery Assay",
        "Human Cardiovascular Disease Panel 3 9-Plex Discovery Assay",
        "Alamar Biosciences multiplex biomarker profiling",
        "NULISA-seq Inflammation Panel",
      ],
      assay_panels: [
        {
          name: "Comprehensive metabolic panel",
          provider: "Quest Diagnostics",
          type: "Clinical chemistry",
        },
        {
          name: "Human Cytokine/Chemokine 71-Plex Discovery Assay",
          provider: "Eve Technologies",
          panel_size: 71,
          type: "Multiplex immunoassay",
        },
        {
          name: "Human Cardiovascular Disease Panel 3 9-Plex Discovery Assay",
          provider: "Eve Technologies",
          panel_size: 9,
          type: "Multiplex immunoassay",
        },
        {
          name: "Alamar Biosciences multiplex biomarker profiling",
          provider: "Alamar Biosciences",
          type: "Immunoassay",
        },
        {
          name: "NULISA-seq Inflammation Panel",
          provider: "Alamar Biosciences",
          targets: {
            cytokines_and_chemokines: 124,
            other_immune_response_proteins: 80,
            total_targets_reported: 204,
          },
          output_unit: "NPQ units",
          normalization:
            "Intraplate internal-control and interplate-control normalization, followed by log2 transformation.",
        },
      ],
      normalization_warning:
        "The OSDR study description states that Eve Technologies HD71 and HDCVD9 measurements were normalized using the average of pre-flight values from all crew. Preserve the source file's transformation and normalization metadata.",
      relevant_body_systems: [
        "cardiovascular_research",
        "immune",
        "metabolic",
        "blood",
      ],
      study_url: "https://osdr.nasa.gov/bio/repo/data/studies/OSD-575",
      known_processed_file_names: [
        "LSDS-8_Multiplex_serum_cardiovascular_EvePanel_TRANSFORMED.csv",
        "LSDS-8_Multiplex_serum.cardiovascular.EvePanel_SUBMITTED.csv",
      ],
      notes: [
        "NASA reports 28 sample records for this study and four crew members.",
        "The comprehensive metabolic panel was run on a Beckman Coulter AU5800 after fresh serum was sent to Quest Diagnostics.",
        "Eve Technologies HD71 and HDCVD9 panel concentration values were extrapolated from a 4- or 5-parameter logistic standard curve and normalized to the average of pre-flight values from all crew.",
        "The Alamar NULISA-seq panel uses a different assay and normalization method; do not combine its NPQ values with Eve panel concentrations.",
        "These are serum laboratory and biomarker measurements, not continuous heart-rate, ECG, blood-pressure or oxygen-saturation telemetry.",
        "The sample narrative and sample table differ on R+194; verify the exact assay-specific sample records before analysis.",
      ],
      source_ids: [
        "SRC_OSD_575",
        "SRC_NASA_I4_DATASETS",
        "SRC_I4_DATA_ACCESS_PAPER",
      ],
      sample_record_count: 28,
      biological_crew_count: 4,
      sample_table_timepoint_note: {
        narrative_timepoints: ["L-92", "L-44", "L-3", "R+1", "R+45", "R+82"],
        sample_table_also_shows: ["R+194"],
        resolution:
          "The study narrative lists six timepoints, while the displayed sample table includes R+194 entries. Do not silently discard this discrepancy; use the assay-specific sample table and transformed file to determine which samples are present in each assay.",
      },
    },
    {
      accession: "OSD-630",
      title: "SpaceX Inspiration4 Stool Metagenome Profiling",
      repository_ids: {
        gene_lab: "GLDS-599",
      },
      sample_material: "Stool",
      collection_timepoints: ["L-92", "L-44", "R+45", "R+82"],
      assays: ["Whole-genome shotgun metagenomic sequencing"],
      relevant_body_systems: ["digestive", "gut_microbiome"],
      study_url: "https://osdr.nasa.gov/bio/repo/data/studies/OSD-630",
      notes: [
        "This study's listed stool samples are pre-flight and post-flight; do not assume an in-flight stool sample.",
        "Microbiome composition is not a direct gastrointestinal diagnosis.",
      ],
      source_ids: ["SRC_NASA_I4_STOOL", "SRC_I4_DATA_ACCESS_PAPER"],
    },
    {
      accession: "OSD-656",
      title: "SpaceX Inspiration4 Urine Inflammation Panel",
      repository_ids: {
        life_sciences: "LSDS-64",
      },
      sample_material: "Urine",
      assays: ["NULISAseq multiplex inflammation panel"],
      assay: "NULISAseq multiplex inflammation panel",
      reported_target_count: 203,
      relevant_body_systems: [
        "immune_inflammation_research",
        "urinary_biomarkers",
      ],
      study_url: "https://osdr.nasa.gov/bio/repo/data/studies/OSD-656",
      known_processed_file_name:
        "LSDS-64_Multiplex_urine.immune.AlamarPanel_TRANSFORMED.csv",
      notes: [
        "The 22 count is the number of sample records shown in the NASA study sample table, not the number of astronauts.",
        "The 203 count refers to assay targets, not diagnoses.",
        "Samples are listed at pre-flight and post-flight/recovery timepoints; this study does not provide continuous in-flight measurements.",
        "NPQ values are normalized and log2-transformed assay outputs; preserve the normalization metadata and do not relabel them as raw concentrations.",
        "Urinary inflammatory-protein abundance is not equivalent to a routine urinalysis or a clinical diagnosis.",
      ],
      source_ids: [
        "SRC_OSD_656",
        "SRC_NASA_I4_DATASETS",
        "SRC_I4_DATA_ACCESS_PAPER",
      ],
      sample_record_count: 22,
      biological_crew_count: 4,
      collection_timepoints: ["L-92", "L-44", "L-3", "R+1", "R+45", "R+82"],
      inflight_samples_in_this_study: false,
      assay_details: {
        kit: "NULISA-seq 200plex v1 Inflammation Panel",
        provider: "Alamar Biosciences",
        target_count: 203,
        technical_replicates_per_sample: 2,
        sample_volume_per_technical_replicate_uL: 10,
        sample_preservation: "Aliquoted and frozen at -80 degrees Celsius",
        normalization: {
          intraplate:
            "Target counts for each sample well divided by that well's internal mCherry control counts.",
          interplate:
            "Counts divided by target-specific medians of three interplate-control wells, then rescaled by 10^4.",
          transformation:
            "IPC-normalized counts log2-transformed; reported as NULISA Protein Quantification (NPQ) units.",
        },
      },
      known_submitted_file_name:
        "LSDS-64_Multiplex_urine.immune.AlamarPanel_SUBMITTED.xlsx",
      target_information_file:
        "LSDS-64_Multiplex_200plex v1-Target Information.csv",
    },
    {
      accession: "OSD-687",
      title: "SpaceX Inspiration4 T-Cell Histone Modification Profiling",
      repository_ids: {
        gene_lab: "GLDS-618",
      },
      sample_material: "T cells isolated from whole blood",
      biological_subject_count: 1,
      subject_code: "C002",
      collection_timepoint: "R+194",
      sample_or_library_records: 42,
      assays: ["ChIC-seq / CUT&RUN", "H3K4me1", "H3K4me3", "H3K27ac"],
      relevant_body_systems: ["immune_research", "epigenetic_research"],
      study_url: "https://osdr.nasa.gov/bio/repo/data/studies/OSD-687",
      current_access_note:
        "The study page reports that requests and access to restricted files have been temporarily disabled. Check the live page before planning a download.",
      notes: [
        "This is a proof-of-concept post-flight study of one crew member.",
        "The 42 count refers to sample/library records, not 42 astronauts.",
      ],
      source_ids: ["SRC_OSD_687"],
    },
];

export const NASA_STANDARD_MEASURES = {
    programme: "Spaceflight Standard Measures",
    official_url: "https://www.nasa.gov/reference/standard-measures/",
    study_type: "Flight",
    measurement_domains: [
      {
        domain: "activity_and_light_exposure",
        method: "Wrist-worn sensor",
        application_region: "whole_body",
        data_type: "time_series",
      },
      {
        domain: "sleep",
        method: "Actigraphy and astronaut sleep reports",
        application_region: "brain_sleep",
        data_type: "time_series_and_questionnaire",
      },
      {
        domain: "nutrition_and_hydration",
        method: "Fluid and biological samples; diet-related assessment",
        application_region: "whole_body_digestive_renal",
        data_type: "laboratory_and_self_report",
      },
      {
        domain: "immune_function",
        method: "Saliva and blood-based measures",
        application_region: "immune_system",
        data_type: "laboratory",
      },
      {
        domain: "cognition",
        method: "Computerized cognitive tests",
        application_region: "brain",
        data_type: "task_scores",
      },
      {
        domain: "sensorimotor_and_vestibular",
        method: "Balance, movement, and sensorimotor tests",
        application_region: "brain_inner_ear_muscles",
        data_type: "test_scores_and_physiological_measurements",
      },
      {
        domain: "cardiovascular",
        method:
          "Heart rate, blood pressure, ultrasound and related cardiovascular assessments in defined protocols",
        application_region: "heart_and_vessels",
        data_type: "physiological_and_imaging",
      },
      {
        domain: "musculoskeletal_strength",
        method: "Total-body strength testing",
        application_region: "muscles_and_bones",
        data_type: "strength_measurements",
      },
      {
        domain: "microbiome",
        method: "Fecal sample analysis",
        application_region: "digestive_system",
        data_type: "sequencing_and_biomarker",
      },
    ],
    collection_timing:
      "Before, during, and after flight, with timing dependent on the specific measure and protocol.",
    important_note:
      "NASA Standard Measures is a standardized research programme and monitoring framework. The page describes the measures; it does not itself provide a public real-time astronaut telemetry feed.",
    source_ids: [
      "SRC_NASA_STANDARD_MEASURES",
      "SRC_NASA_STANDARD_MEASURES_DETAIL",
    ],
};

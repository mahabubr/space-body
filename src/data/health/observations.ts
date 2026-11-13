import type { PublishedNumericalObservation } from "./types";

export const PUBLISHED_NUMERICAL_OBSERVATIONS: PublishedNumericalObservation[] = [
    {
      observation_id: "TWINS_RADIATION_PHYSICAL_DOSE",
      evidence_class: "published_individual_or_n_of_1_observation",
      study_id: "NASA_TWINS_STUDY_2019",
      body_system: "whole_body_radiation",
      metric: "physical_dosimeter_dose",
      value: 76.18,
      unit: "mGy",
      measurement_context:
        "Physical dosimeter dose recorded by NASA for the flight subject during the 340-day mission.",
      time_context: "Mission-integrated",
      subject_code: "TW",
      clinical_threshold: null,
      interpretation:
        "A mission-specific physical absorbed-dose result. Do not compare directly with effective dose in mSv or use as an individual medical alert threshold.",
      source_ids: ["SRC_TWINS_SCIENCE_2019"],
    },
    {
      observation_id: "TWINS_RADIATION_EFFECTIVE_DOSE",
      evidence_class: "published_individual_or_n_of_1_observation",
      study_id: "NASA_TWINS_STUDY_2019",
      body_system: "whole_body_radiation",
      metric: "effective_radiation_dose",
      value: 146.34,
      unit: "mSv",
      measurement_context:
        "Effective dose recorded by NASA for the flight subject during the 340-day mission.",
      time_context: "Mission-integrated",
      subject_code: "TW",
      clinical_threshold: null,
      interpretation:
        "Effective dose is a radiation-protection quantity and is not interchangeable with absorbed dose in mGy.",
      source_ids: ["SRC_TWINS_SCIENCE_2019"],
    },
    {
      observation_id: "TWINS_BODY_MASS_CHANGE_FLIGHT",
      evidence_class: "published_individual_or_n_of_1_observation",
      study_id: "NASA_TWINS_STUDY_2019",
      body_system: "whole_body_nutrition_hydration",
      metric: "body_mass_change_from_preflight",
      value: -7,
      unit: "%",
      measurement_context:
        "The flight subject lost 7% of body mass during the mission.",
      time_context: "During the 340-day flight",
      subject_code: "TW",
      clinical_threshold: null,
      interpretation:
        "A single-subject observation. It is not a target, expected loss, or universal astronaut trajectory.",
      source_ids: ["SRC_TWINS_SCIENCE_2019"],
    },
    {
      observation_id: "TWINS_BODY_MASS_CHANGE_GROUND_CONTROL",
      evidence_class: "published_individual_or_n_of_1_observation",
      study_id: "NASA_TWINS_STUDY_2019",
      body_system: "whole_body_nutrition_hydration",
      metric: "body_mass_change_over_study",
      value: 4,
      unit: "%",
      measurement_context:
        "The ground-control twin gained approximately 4% body mass over the course of the study.",
      time_context: "Study period",
      subject_code: "HR",
      clinical_threshold: null,
      interpretation:
        "Approximate control-subject result over the study period; not a matched flight-duration body-mass comparison.",
      source_ids: ["SRC_TWINS_SCIENCE_2019"],
    },
    {
      observation_id: "TWINS_ENERGY_INTAKE",
      evidence_class: "published_individual_or_n_of_1_observation",
      study_id: "NASA_TWINS_STUDY_2019",
      body_system: "nutrition",
      metric: "energy_intake_as_percent_of_predicted_requirement",
      value: 66,
      unit: "%",
      measurement_context:
        "The flight subject's reported energy intake was about 66% of predicted requirements.",
      time_context: "During the mission",
      subject_code: "TW",
      clinical_threshold: null,
      interpretation:
        "Approximate reported energy-intake fraction for one participant. Not a recommended intake target.",
      source_ids: ["SRC_TWINS_SCIENCE_2019"],
    },
    {
      observation_id: "TWINS_CARDIAC_OUTPUT_CHANGE",
      evidence_class: "published_individual_or_n_of_1_observation",
      study_id: "NASA_TWINS_STUDY_2019",
      body_system: "cardiovascular",
      metric: "cardiac_output_change_during_spaceflight",
      value: 10,
      unit: "%",
      measurement_context:
        "The paper reports an average 10% increase in cardiac output across spaceflight measurements.",
      time_context:
        "During flight compared with the upright Earth posture reference",
      subject_code: "TW",
      clinical_threshold: null,
      interpretation:
        "Study-specific cardiovascular adaptation. It is not a real-time cardiac output reading or an alert threshold.",
      source_ids: ["SRC_TWINS_SCIENCE_2019"],
    },
    {
      observation_id: "TWINS_BONE_TURNOVER_MARKERS_EARLY_FLIGHT",
      evidence_class: "published_individual_or_n_of_1_observation",
      study_id: "NASA_TWINS_STUDY_2019",
      body_system: "musculoskeletal_bone",
      metric: "bone_turnover_marker_change",
      value_range: {
        minimum: 50,
        maximum: 60,
      },
      unit: "%",
      measured_markers: [
        "N-telopeptide (bone resorption marker)",
        "bone-specific alkaline phosphatase (bone formation marker)",
      ],
      measurement_context:
        "Both bone breakdown and bone formation markers increased by approximately 50% to 60% in the flight subject during the first six months.",
      time_context: "First six months of flight",
      subject_code: "TW",
      clinical_threshold: null,
      interpretation:
        "These are bone-turnover biomarker changes, not a 50% to 60% loss of bone mineral density. The paper reports that the markers decreased during the final six months.",
      source_ids: ["SRC_TWINS_SCIENCE_2019"],
    },
    {
      observation_id: "TWINS_PLASMA_SODIUM_LANDING",
      evidence_class: "published_individual_or_n_of_1_observation",
      study_id: "NASA_TWINS_STUDY_2019",
      body_system: "fluid_balance_electrolytes",
      metric: "plasma_sodium",
      value_before_mmol_per_litre: 146,
      value_after_mmol_per_litre: 138,
      unit: "mmol/L",
      measurement_context:
        "The paper describes plasma sodium decreasing from 146 to 138 mmol/L at return/landing (R+0) in the flight subject.",
      time_context: "Landing / R+0",
      subject_code: "TW",
      clinical_threshold: null,
      interpretation:
        "Retain the paper's stated context. This is not a normal range and must not be used to generate an alert threshold.",
      source_ids: ["SRC_TWINS_SCIENCE_2019"],
    },
    {
      observation_id: "TWINS_CYTOKINE_DIFFERENTIAL_COUNT",
      evidence_class: "published_individual_or_n_of_1_observation",
      study_id: "NASA_TWINS_STUDY_2019",
      body_system: "immune_inflammation",
      metric: "cytokines_differentially_abundant_across_pre_in_postflight",
      value: 50,
      unit: "cytokines",
      assayed_total: 62,
      measurement_context:
        "Fifty of the 62 assayed cytokines were differentially abundant across pre-flight, in-flight, and post-flight measurements in the flight subject.",
      time_context: "Pre-flight, in-flight, and post-flight",
      subject_code: "TW",
      clinical_threshold: null,
      interpretation:
        "Differential abundance does not mean all 50 cytokines increased, nor does it mean the subject had 50 inflammatory diseases.",
      source_ids: ["SRC_TWINS_SCIENCE_2019"],
    },
    {
      observation_id: "TWINS_POSTLANDING_INFLAMMATORY_FOLD_CHANGE",
      evidence_class: "published_individual_or_n_of_1_observation",
      study_id: "NASA_TWINS_STUDY_2019",
      body_system: "immune_inflammation",
      metric: "postlanding_inflammatory_marker_change",
      value: 8,
      unit: "fold_change_up_to",
      markers: [
        "CCL2 (MCP-1)",
        "C-reactive protein (CRP)",
        "IL1RN (IL-1 receptor antagonist)",
      ],
      measurement_context:
        "The paper reports up to eightfold changes in these markers immediately after landing, at R+0 and R+4.",
      time_context: "R+0 and R+4",
      subject_code: "TW",
      statistical_result: {
        method: "ANOVA",
        q_value: "<0.001",
      },
      clinical_threshold: null,
      interpretation:
        "The paper reports up to eightfold changes in these markers at R+0/R+4; all three returned to baseline by R+36. This is a post-landing research finding in one flight participant, not a general diagnostic threshold.",
      source_ids: ["SRC_TWINS_SCIENCE_2019"],
      return_to_baseline_by: "R+36",
    },
    {
      observation_id: "TWINS_METABOLOMICS_SIGNIFICANT_FEATURES",
      evidence_class: "published_individual_or_n_of_1_observation",
      study_id: "NASA_TWINS_STUDY_2019",
      body_system: "metabolism",
      metric: "significantly_different_high_confidence_plasma_metabolites",
      value: 245,
      unit: "metabolites",
      high_confidence_metabolites_assessed: 719,
      metabolic_features_initially_detected: 4162,
      statistical_result: {
        false_discovery_rate: "<0.05",
      },
      measurement_context:
        "The study reports 245 metabolites with significant differences among pre-flight, in-flight, and post-flight samples in comparisons between the flight and ground-control twins.",
      time_context: "Pre-flight, in-flight, and post-flight",
      clinical_threshold: null,
      interpretation:
        "These are counts of statistically significant metabolite variables, not concentrations or diagnoses.",
      source_ids: ["SRC_TWINS_SCIENCE_2019"],
    },
    {
      observation_id: "TWINS_URINARY_METABOLITES_SIGNIFICANT",
      evidence_class: "published_individual_or_n_of_1_observation",
      study_id: "NASA_TWINS_STUDY_2019",
      body_system: "metabolism_renal",
      metric: "urinary_metabolites_significantly_altered_inflight",
      value: 32,
      unit: "metabolites",
      assay_context: "Targeted GC-MS/MS metabolomics",
      time_context: "In-flight compared with pre-flight and post-flight",
      statistical_result: {
        false_discovery_rate: "<0.05",
      },
      clinical_threshold: null,
      interpretation:
        "This is a count of metabolite variables found to change significantly, not 32 clinical abnormalities.",
      source_ids: ["SRC_TWINS_SCIENCE_2019"],
    },
    {
      observation_id: "TWINS_PBMC_DIFFERENTIAL_GENE_EXPRESSION",
      evidence_class: "published_individual_or_n_of_1_observation",
      study_id: "NASA_TWINS_STUDY_2019",
      body_system: "immune_cell_gene_expression",
      metric: "differentially_expressed_genes_by_flight_period",
      early_flight_months_0_to_6: 1447,
      late_flight_months_6_to_12: 8564,
      unit: "genes",
      statistical_result: {
        method: "DESeq2 multivariate negative binomial model",
        q_value: "<0.01",
      },
      measurement_context:
        "The paper reports substantially more differentially expressed genes in the 6-to-12-month period than in the 0-to-6-month period in PBMCs.",
      clinical_threshold: null,
      interpretation:
        "Gene-expression differences are molecular research outputs and are not equivalent to a count of diseases or abnormal clinical tests.",
      source_ids: ["SRC_TWINS_SCIENCE_2019"],
    },
    {
      observation_id: "TWINS_GENES_RETURNED_TO_BASELINE",
      evidence_class: "published_individual_or_n_of_1_observation",
      study_id: "NASA_TWINS_STUDY_2019",
      body_system: "molecular_and_immune",
      metric: "flight_altered_gene_expression_returned_to_normal_ranges",
      value: 91.3,
      unit: "%",
      time_context: "Within six months after landing",
      measurement_context:
        "NASA's Twins Study summary reports that 91.3% of gene-expression levels that changed during spaceflight returned to baseline within six months after landing.",
      clinical_threshold: null,
      interpretation:
        "This is a study-level molecular recovery summary, not a clinical recovery percentage for the astronaut's whole body.",
      source_ids: ["SRC_NASA_TWINS_OVERVIEW", "SRC_TWINS_SCIENCE_2019"],
    },
    {
      observation_id: "TWINS_PERSISTENTLY_DISRUPTED_GENES",
      evidence_class: "published_individual_or_n_of_1_observation",
      study_id: "NASA_TWINS_STUDY_2019",
      body_system: "molecular_and_immune",
      metric: "genes_not_returned_to_preflight_expression_within_six_months",
      value: 811,
      unit: "genes",
      time_context: "Six months after return to Earth",
      measurement_context:
        "The paper reports 811 genes across different cell types that had not returned to pre-flight expression levels within six months after return.",
      clinical_threshold: null,
      interpretation:
        "A gene-expression research finding, not 811 clinical abnormalities.",
      source_ids: ["SRC_TWINS_SCIENCE_2019"],
    },
    {
      observation_id: "TWINS_COGNITIVE_ABSTRACT_MATCHING_LATE_FLIGHT",
      evidence_class: "published_individual_or_n_of_1_observation",
      study_id: "NASA_TWINS_STUDY_2019",
      body_system: "brain_cognition",
      metric: "abstract_matching_accuracy_difference_late_flight",
      value: null,
      unit: null,
      time_context: "Late flight, months 7 to 12",
      measurement_context:
        "The paper reports a decline greater than 2 SD in abstract-matching accuracy for the flight subject relative to the ground twin during late flight.",
      statistical_result: {
        p_value: 0.028,
        test: "Student's t test",
      },
      clinical_threshold: null,
      interpretation:
        "The paper reports a decline greater than 2 SD in abstract-matching accuracy for the flight subject relative to the ground twin during late flight. This is a task-specific comparison in one twin pair, not a general cognitive impairment cutoff.",
      source_ids: ["SRC_TWINS_SCIENCE_2019"],
      magnitude: {
        direction: "decrease",
        threshold: ">2",
        unit: "SD",
      },
    },
    {
      observation_id: "TWINS_POSTFLIGHT_COGNITIVE_EFFICIENCY",
      evidence_class: "published_individual_or_n_of_1_observation",
      study_id: "NASA_TWINS_STUDY_2019",
      body_system: "brain_cognition",
      metric: "postflight_cognitive_efficiency",
      direction:
        "significantly_lower_than_pre_and_inflight_relative_to_control",
      value: null,
      unit: null,
      statistical_result: {
        p_value: 0.0016,
        test: "Student's t test",
      },
      persistence:
        "The reported post-flight decline persisted up to six months post-flight in speed and accuracy domains.",
      clinical_threshold: null,
      interpretation:
        "No numeric effect size is inserted because the prose result reports significance and persistence, not a single clinical score.",
      source_ids: ["SRC_TWINS_SCIENCE_2019"],
    },
    {
      observation_id: "TWINS_CARDIOVASCULAR_VASCULAR_ADAPTATION",
      evidence_class: "published_individual_or_n_of_1_observation",
      study_id: "NASA_TWINS_STUDY_2019",
      body_system: "cardiovascular",
      metrics: [
        {
          metric: "carotid_artery_distension",
          direction: "increased_early_inflight_and_persisted",
        },
        {
          metric: "carotid_intima_media_thickness",
          direction: "increased_from_preflight_to_inflight",
        },
        {
          metric: "systolic_and_mean_arterial_pressure",
          direction: "moderately_decreased_relative_to_upright_earth_posture",
        },
      ],
      value: null,
      unit: null,
      measurement_methods: [
        "vascular ultrasound",
        "blood pressure measurement",
      ],
      clinical_threshold: null,
      interpretation:
        "Direction-of-change findings only. Numerical values should be extracted from the paper's cited supplementary tables before graphing.",
      source_ids: ["SRC_TWINS_SCIENCE_2019"],
    },
    {
      observation_id: "TWINS_OCULAR_STRUCTURAL_ADAPTATION",
      evidence_class: "published_individual_or_n_of_1_observation",
      study_id: "NASA_TWINS_STUDY_2019",
      body_system: "eyes_neuro_ocular",
      metrics: [
        {
          metric: "subfoveal_choroidal_thickness",
          direction: "increased",
        },
        {
          metric: "peripapillary_total_retinal_thickness",
          direction: "increased",
        },
        {
          metric: "choroidal_folds",
          direction: "severity_increased",
        },
      ],
      value: null,
      unit: null,
      measurement_methods: ["optical coherence tomography", "ocular imaging"],
      clinical_threshold: null,
      interpretation:
        "The publication reports structural changes but this JSON does not digitize graph values. Do not convert these findings into a SANS diagnosis.",
      source_ids: ["SRC_TWINS_SCIENCE_2019", "SRC_NASA_SANS_RISK"],
    },
    {
      observation_id: "LONG_DURATION_BMD_LOSS_COHORT",
      evidence_class: "published_cohort_aggregate",
      study_id: "LONG_DURATION_BMD_COHORT_2007",
      body_system: "musculoskeletal_bone",
      metric: "average_bone_mineral_density_loss",
      value_range: {
        minimum: 2,
        maximum: 9,
      },
      unit: "%",
      population: {
        crew_members: 45,
        pre_post_measurement_sets: 56,
      },
      measurement_method: "DXA",
      skeletal_sites: [
        "lumbar spine",
        "trochanter",
        "pelvis",
        "femoral neck",
        "calcaneus",
      ],
      model_estimate: {
        metric: "time_to_recover_50_percent_of_lost_bone_mineral",
        value: 9,
        unit: "months",
        meaning:
          "The fitted exponential model predicted 50% recovery of lost bone mineral within nine months for all evaluated sites.",
      },
      clinical_threshold: null,
      interpretation:
        "Historical aggregate range and model prediction. Not an individual reading, not a monthly loss rate, and not a clinical alert threshold.",
      source_ids: ["SRC_NASA_BMD_2007"],
    },
    {
      observation_id: "TWINS_URINE_SODIUM_EXCRETION_LANDING",
      evidence_class: "published_individual_or_n_of_1_observation",
      study_id: "NASA_TWINS_STUDY_2019",
      body_system: "fluid_balance_renal",
      metric: "urine_sodium_excretion",
      value: 47,
      unit: "mmol/day",
      time_context: "Return / landing day R+0",
      subject_code: "TW",
      measurement_context:
        "The paper reports urine sodium excretion decreased to 47 mmol/day on R+0 despite intravenous saline being provided.",
      clinical_threshold: null,
      interpretation:
        "A single-subject landing-period observation. It is not a normal range or a general threshold.",
      source_ids: ["SRC_TWINS_SCIENCE_2019"],
    },
    {
      observation_id: "TWINS_URINE_VOLUME_LANDING",
      evidence_class: "published_individual_or_n_of_1_observation",
      study_id: "NASA_TWINS_STUDY_2019",
      body_system: "fluid_balance_renal",
      metric: "urine_volume_after_landing_fluid_intake",
      value_before_ml: 1313,
      value_after_ml: 2999,
      unit: "mL",
      time_context: "Return / landing day R+0",
      subject_code: "TW",
      measurement_context:
        "The paper describes access to fluid intake that increased urine volume from 1313 mL to 2999 mL.",
      clinical_threshold: null,
      interpretation:
        "Context-specific post-landing fluid-management observation, not a prescribed fluid target.",
      source_ids: ["SRC_TWINS_SCIENCE_2019"],
    },
    {
      observation_id: "TWINS_URINE_SODIUM_EXCRETION_LATE_FLIGHT",
      evidence_class: "published_individual_or_n_of_1_observation",
      study_id: "NASA_TWINS_STUDY_2019",
      body_system: "fluid_balance_renal",
      metric: "average_urine_sodium_excretion",
      value: 147,
      unit: "mmol/day",
      time_context: "Flight days 300 through 334",
      subject_code: "TW",
      measurement_context:
        "The paper reports average urine sodium excretion for the flight subject from FD300 through FD334.",
      clinical_threshold: null,
      interpretation:
        "A mission-specific average from one subject, not a reference range.",
      source_ids: ["SRC_TWINS_SCIENCE_2019"],
    },
    {
      observation_id: "TWINS_URINE_LACTATE",
      evidence_class: "published_individual_or_n_of_1_observation",
      study_id: "NASA_TWINS_STUDY_2019",
      body_system: "metabolism",
      metric: "urinary_lactic_acid",
      value: null,
      unit: null,
      direction:
        "significantly_increased_inflight_and_returned_to_baseline_postflight",
      statistical_result: {
        p_value: 0.018,
        method: "ANOVA",
      },
      time_context: "In-flight compared with pre-flight and post-flight",
      subject_code: "TW",
      measurement_context:
        "The paper reports significantly increased urinary lactic acid during flight, with return to baseline after flight. The highest levels occurred during the first 15 days and final 14 days of the mission.",
      clinical_threshold: null,
      interpretation:
        "No absolute concentration is inserted because the main-text result reports direction and statistical significance; exact values are in supplementary data.",
      source_ids: ["SRC_TWINS_SCIENCE_2019"],
    },
    {
      observation_id: "TWINS_MICROBIOME_TAXA_DIFFERENTIAL",
      evidence_class: "published_individual_or_n_of_1_observation",
      study_id: "NASA_TWINS_STUDY_2019",
      body_system: "digestive_microbiome",
      metric: "detected_microbiome_taxa_differentially_abundant_inflight",
      value_range: {
        minimum: 0.5,
        maximum: 4.5,
      },
      unit: "% of detected microbial taxa",
      additional_counts: {
        species: 36,
        genera: 13,
        families: 8,
        orders: 4,
        classes: 3,
        phyla: 3,
      },
      comparison:
        "In-flight samples versus combined pre-flight and post-flight samples",
      statistical_result: {
        false_discovery_rate: "<0.05",
      },
      subject_code: "TW",
      clinical_threshold: null,
      interpretation:
        "A metagenomic differential-abundance result. It is not a microbiome disease score or a diagnosis of gastrointestinal illness.",
      source_ids: ["SRC_TWINS_SCIENCE_2019"],
    },
    {
      observation_id: "TWINS_MICROBIOME_TAXA_DETECTED",
      evidence_class: "published_individual_or_n_of_1_observation",
      study_id: "NASA_TWINS_STUDY_2019",
      body_system: "digestive_microbiome",
      metric: "genus_level_taxa_detected",
      value_range: {
        minimum: 1364,
        maximum: 1641,
      },
      unit: "taxa",
      measurement_context:
        "Range of genus-level taxa detected in microbiome samples from both subjects.",
      clinical_threshold: null,
      interpretation:
        "Descriptive sequencing richness range across samples, not a clinical healthy/unhealthy threshold.",
      source_ids: ["SRC_TWINS_SCIENCE_2019"],
    },
    {
      observation_id: "TWINS_MICROBIOME_FIRMICUTES_BACTEROIDETES",
      evidence_class: "published_individual_or_n_of_1_observation",
      study_id: "NASA_TWINS_STUDY_2019",
      body_system: "digestive_microbiome",
      metric: "firmicutes_plus_bacteroidetes_share_of_annotated_sequences",
      value: 96,
      unit: "%",
      measurement_context:
        "Firmicutes and Bacteroidetes together represented more than 96% of annotated sequences recovered in the study.",
      clinical_threshold: null,
      interpretation:
        "Study-specific taxonomic composition. Do not treat this as a universal healthy microbiome benchmark.",
      source_ids: ["SRC_TWINS_SCIENCE_2019"],
      comparator: ">",
    },
    {
      observation_id: "TWINS_MITOCHONDRIAL_RNA_TIME_ASSOCIATION",
      evidence_class: "published_individual_or_n_of_1_observation",
      study_id: "NASA_TWINS_STUDY_2019",
      body_system: "cellular_metabolism",
      metric: "mitochondrial_RNA_level_association_with_time_on_ISS",
      value: 0.84,
      unit: "R_squared",
      statistical_result: {
        p_value: 0.0000036,
        method: "ANOVA",
      },
      measurement_context:
        "The paper reports that time spent on the ISS was correlated with increased mitochondrial RNA levels during flight.",
      clinical_threshold: null,
      interpretation:
        "An association statistic for molecular research, not a clinical oxygenation or mitochondrial-function score.",
      source_ids: ["SRC_TWINS_SCIENCE_2019"],
    },
    {
      observation_id: "TWINS_APOB_APOA1_RATIO",
      evidence_class: "published_individual_or_n_of_1_observation",
      study_id: "NASA_TWINS_STUDY_2019",
      body_system: "cardiovascular_metabolic",
      metric: "plasma_APOB_to_APOA1_ratio",
      value: null,
      unit: null,
      direction:
        "increased_during_late_flight_and_returned_toward_preflight_after_landing",
      time_context: "Late flight after FD180",
      statistical_result: {
        p_value: 0.003,
        method: "ANOVA",
      },
      subject_code: "TW",
      clinical_threshold: null,
      interpretation:
        "The article reports a significant relative increase and post-flight decrease but no single numeric ratio in the main text. Retrieve Table S8 or the relevant source file before plotting a numeric series.",
      source_ids: ["SRC_TWINS_SCIENCE_2019"],
    },
];

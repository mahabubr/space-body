import type { BodyRegionMappingData } from "./types";

export const BODY_REGION_MAPPING: BodyRegionMappingData[] = [
    {
      body_region_id: "heart",
      display_name: "Cardiovascular System",
      research_dataset_ids: [
        "OSD-575",
        "NASA_TWINS_STUDY_2019",
        "NASA_STANDARD_MEASURES",
      ],
      displayable_evidence: [
        "Serum cardiovascular/immune biomarker assay metadata",
        "Published cardiac output and vascular adaptation findings from the Twins Study",
        "NASA-described cardiovascular monitoring methods",
      ],
      do_not_label_as: [
        "live heart rate from OSD-575",
        "live blood pressure from OSD-575",
        "continuous ECG from OSD-575",
      ],
    },
    {
      body_region_id: "brain",
      display_name: "Brain and Cognitive Function",
      research_dataset_ids: [
        "NASA_TWINS_STUDY_2019",
        "UTMB_BEDREST_CAMPAIGN_1_ACTIGRAPHY",
        "NASA_STANDARD_MEASURES",
      ],
      displayable_evidence: [
        "Published cognitive task findings from the Twins Study",
        "Sleep duration, latency and efficiency variables from a ground-based bed-rest actigraphy dataset",
        "NASA cognitive and sleep monitoring protocols",
      ],
      data_classification_warning:
        "Ground-analogue actigraphy must be labelled separately from spaceflight data.",
    },
    {
      body_region_id: "eyes",
      display_name: "Eyes and Neuro-Ocular System",
      research_dataset_ids: ["NASA_TWINS_STUDY_2019"],
      displayable_evidence: [
        "Published OCT-related retinal and choroidal structural findings",
        "NASA SANS monitoring methods including OCT, ocular ultrasound and vision testing",
      ],
      do_not_label_as: ["diagnosed SANS from a research trend alone"],
    },
    {
      body_region_id: "blood",
      display_name: "Blood and Hematologic System",
      research_dataset_ids: ["OSD-569", "OSD-570", "OSD-571", "OSD-575"],
      displayable_evidence: [
        "CBC assay metadata",
        "PBMC immune-cell profiling",
        "Plasma proteomics and metabolomics",
        "Serum comprehensive metabolic panel and cytokine assays",
      ],
    },
    {
      body_region_id: "immune_system",
      display_name: "Immune System",
      research_dataset_ids: [
        "OSD-569",
        "OSD-570",
        "OSD-575",
        "OSD-656",
        "OSD-687",
        "NASA_STANDARD_MEASURES",
        "NASA_TWINS_STUDY_2019",
      ],
      displayable_evidence: [
        "CBC and immune-cell profiling",
        "Cytokine and inflammatory biomarker research",
        "T-cell epigenetic research",
        "NASA saliva, blood and urine immune-monitoring methods",
      ],
      interpretation_warning:
        "Omics and cytokine differences are research evidence, not direct diagnoses of infection or immune deficiency.",
    },
    {
      body_region_id: "bones",
      display_name: "Skeletal System",
      research_dataset_ids: [
        "LONG_DURATION_BMD_COHORT_2007",
        "NASA_TWINS_STUDY_2019",
        "NASA_STANDARD_MEASURES",
      ],
      displayable_evidence: [
        "DXA-based cohort bone mineral density findings",
        "N-telopeptide and bone-specific alkaline phosphatase changes from the Twins Study",
        "NASA bone scan and strength assessment methods",
      ],
      interpretation_warning:
        "Bone turnover markers are not interchangeable with DXA bone mineral density.",
    },
    {
      body_region_id: "muscles",
      display_name: "Muscular System",
      research_dataset_ids: ["NASA_STANDARD_MEASURES", "NASA_TWINS_STUDY_2019"],
      displayable_evidence: [
        "NASA total-body strength assessment methods",
        "Published exercise and bone-marker relationship in the Twins Study",
      ],
      interpretation_warning:
        "Do not infer muscle mass or strength values from bone markers.",
    },
    {
      body_region_id: "digestive_system",
      display_name: "Digestive System",
      research_dataset_ids: [
        "OSD-630",
        "NASA_TWINS_STUDY_2019",
        "NASA_STANDARD_MEASURES",
      ],
      displayable_evidence: [
        "Stool metagenomic research",
        "Published gut microbiome observations",
        "NASA fecal-sample research methods",
      ],
      interpretation_warning:
        "Microbiome composition is not a direct digestive disease diagnosis.",
    },
    {
      body_region_id: "skin",
      display_name: "Skin and Surface Microbiome",
      research_dataset_ids: ["OSD-572", "OSD-574"],
      displayable_evidence: [
        "Skin-associated microbial sequencing",
        "Deltoid skin spatial transcriptomics",
      ],
    },
    {
      body_region_id: "whole_body",
      display_name: "Whole-Body Health and Mission Exposure",
      research_dataset_ids: [
        "NASA_TWINS_STUDY_2019",
        "LONG_DURATION_BMD_COHORT_2007",
        "NASA_STANDARD_MEASURES",
      ],
      displayable_evidence: [
        "Radiation dose reported in the Twins Study",
        "Body mass and energy-intake findings",
        "Bone density cohort findings",
        "Activity, nutrition, sleep and physiological monitoring domains",
      ],
    },
    {
      body_region_id: "spacecraft_environment",
      display_name: "Spacecraft Environment",
      research_dataset_ids: ["OSD-573"],
      displayable_evidence: [
        "Dragon capsule environmental microbiome research",
      ],
      interpretation_warning:
        "Environmental samples must not be displayed as astronaut body measurements.",
    },
];

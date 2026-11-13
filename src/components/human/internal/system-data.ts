export type SystemId =
  | "heart"
  | "brain"
  | "eyes"
  | "blood"
  | "immune_system"
  | "bones"
  | "muscles"
  | "digestive_system"
  | "skin"
  | "whole_body"
  | "spacecraft_environment";

export interface SystemInfo {
  id: SystemId;
  name: string;
  badge: string;
  code: string;
  color: string;
  glowColor: string;
  cameraTarget: [number, number, number];
  cameraPosition: [number, number, number];
  anchor: [number, number, number];
  lineSide: "left" | "right";
  missionRisk: "HIGH" | "CRITICAL" | "MODERATE";
  researchDatasetIds: string[];
  displayableEvidence: string[];
  doNotLabelAs: string[];
  shortDescription: string;
  problemInSpace: string;
  effectOnAstronauts: string;
  nasaSolution: string;
}

export const SYSTEMS_DATA: Record<SystemId, SystemInfo> = {
  heart: {
    id: "heart",
    name: "Cardiovascular System",
    badge: "CARDIOVASCULAR ADAPTATION",
    code: "CARDIO-01",
    color: "#ef4444",
    glowColor: "#f87171",
    cameraTarget: [0.035, 0.44, 0.04],
    cameraPosition: [0.035, 0.44, 0.82],
    anchor: [0.035, 0.44, 0.04],
    lineSide: "right",
    missionRisk: "HIGH",
    researchDatasetIds: ["OSD-575", "NASA_TWINS_STUDY_2019", "NASA_STANDARD_MEASURES"],
    displayableEvidence: [
      "Serum cardiovascular/immune biomarker assay metadata (OSD-575)",
      "Published cardiac output (+10%) and vascular adaptation findings from the Twins Study",
      "NASA-described cardiovascular monitoring methods (Standard Measures)",
    ],
    doNotLabelAs: [
      "live heart rate from OSD-575",
      "live blood pressure from OSD-575",
      "continuous ECG from OSD-575",
    ],
    shortDescription: "Fluid redistribution, ventricular deconditioning & arterial stiffening.",
    problemInSpace:
      "Cephalad fluid shift eliminates lower extremity hydrostatic pressure gradient, resulting in stroke volume and cardiac output alterations.",
    effectOnAstronauts:
      "Twins Study showed +10% cardiac output in flight, carotid artery intima-media thickening, and post-flight orthostatic intolerance.",
    nasaSolution:
      "Daily aerobic cycle ergometry, lower body negative pressure (Chibis/LBNP), fluid loading before re-entry, and anti-g suits.",
  },
  brain: {
    id: "brain",
    name: "Brain & Cognitive Function",
    badge: "CEPHALIC FLUID SHIFT",
    code: "CNS-02",
    color: "#c084fc",
    glowColor: "#ec4899",
    cameraTarget: [0.0, 0.816, -0.016],
    cameraPosition: [0.0, 0.82, 0.68],
    anchor: [0.0, 0.816, -0.016],
    lineSide: "left",
    missionRisk: "HIGH",
    researchDatasetIds: [
      "NASA_TWINS_STUDY_2019",
      "UTMB_BEDREST_CAMPAIGN_1_ACTIGRAPHY",
      "NASA_STANDARD_MEASURES",
    ],
    displayableEvidence: [
      "Published Twins Study cognitive test battery (accuracy maintained, abstract matching latency shift)",
      "Post-flight cognitive efficiency decline during re-adaptation",
      "UTMB 60-day bedrest actigraphy (circadian and sleep efficiency patterns)",
      "NASA Spaceflight Standard Measures neurocognitive protocol",
    ],
    doNotLabelAs: [
      "continuous EEG from bed-rest actigraphy",
      "real-time cognitive telemetry",
      "in-flight diagnosis of cognitive impairment",
    ],
    shortDescription: "Cranial fluid redistribution, ventricular enlargement & cognitive workload.",
    problemInSpace:
      "Loss of gravity drives approximately 2 liters of venous blood and interstitial fluid upward toward the cranial vault, altering intracranial pressure.",
    effectOnAstronauts:
      "Increased intracranial fluid volume; cognitive test accuracy is preserved in flight but response speed and post-landing cognitive efficiency decline.",
    nasaSolution:
      "High-fidelity sleep scheduling, Cognition test battery monitoring, carbon dioxide scrubbing, and blue-enriched circadian lighting.",
  },
  eyes: {
    id: "eyes",
    name: "Visual System (SANS)",
    badge: "NEURO-OCULAR SYNDROME",
    code: "SANS-03",
    color: "#0284c7",
    glowColor: "#38bdf8",
    cameraTarget: [0.0265, 0.776, 0.046],
    cameraPosition: [0.028, 0.78, 0.48],
    anchor: [0.0265, 0.776, 0.046],
    lineSide: "right",
    missionRisk: "CRITICAL",
    researchDatasetIds: ["NASA_TWINS_STUDY_2019"],
    displayableEvidence: [
      "Subfoveal choroidal thickness increase recorded across 340-day mission",
      "Optic nerve sheath diameter (ONSD) expansion and optic disc edema",
      "Posterior globe flattening and hyperopic refractive shift",
    ],
    doNotLabelAs: [
      "live intraocular pressure stream",
      "continuous retinal imaging",
      "automatic diagnostic verdict",
    ],
    shortDescription: "Posterior globe flattening, optic disc edema & hyperopic shift.",
    problemInSpace:
      "Persistent venous congestion in head and orbital veins raises retrobulbar pressure and impedes optic nerve lymphatic drainage.",
    effectOnAstronauts:
      "SANS (Spaceflight-Associated Neuro-ocular Syndrome): optic nerve sheath dilation, choroidal folds, cotton-wool spots, and loss of near visual acuity.",
    nasaSolution:
      "Adjustable Space Focals glasses, optical coherence tomography (OCT) in orbit, and lower-body negative pressure countermeasure research.",
  },
  blood: {
    id: "blood",
    name: "Blood & Hematologic System",
    badge: "HEMATOLOGIC & CBC PROFILES",
    code: "HEMA-04",
    color: "#f43f5e",
    glowColor: "#be185d",
    cameraTarget: [-0.18, 0.28, 0.04],
    cameraPosition: [-0.18, 0.28, 0.80],
    anchor: [-0.18, 0.28, 0.04],
    lineSide: "left",
    missionRisk: "MODERATE",
    researchDatasetIds: ["OSD-569", "OSD-570", "OSD-571", "OSD-575"],
    displayableEvidence: [
      "Inspiration4 whole blood complete blood count (CBC) assay metadata (OSD-569)",
      "PBMC and plasma omics profiling (OSD-570, OSD-571)",
      "Spaceflight hemolysis and reduced circulating red blood cell mass",
    ],
    doNotLabelAs: [
      "live hemoglobin sensor output",
      "continuous blood cell telemetry",
      "clinical laboratory diagnostic report",
    ],
    shortDescription: "Spaceflight anemia, erythrocyte hemolysis & circulating plasma contraction.",
    problemInSpace:
      "Destruction of newly formed erythrocytes (neocytolysis) accelerates in microgravity, contracting total circulating blood volume.",
    effectOnAstronauts:
      "Reduced red cell mass (spaceflight anemia), compensatory erythropoietin suppression, and decreased oxygen transport reserve upon return to 1G.",
    nasaSolution:
      "Dietary iron regulation, hydration protocols with electrolyte tablets prior to de-orbit, and scheduled venous blood sampling.",
  },
  immune_system: {
    id: "immune_system",
    name: "Immune System",
    badge: "IMMUNE & CYTOKINE REGULATION",
    code: "IMM-05",
    color: "#10b981",
    glowColor: "#34d399",
    cameraTarget: [-0.04, 0.42, 0.03],
    cameraPosition: [-0.04, 0.42, 0.80],
    anchor: [-0.04, 0.42, 0.03],
    lineSide: "left",
    missionRisk: "HIGH",
    researchDatasetIds: [
      "OSD-569",
      "OSD-570",
      "OSD-575",
      "OSD-656",
      "OSD-687",
      "NASA_STANDARD_MEASURES",
      "NASA_TWINS_STUDY_2019",
    ],
    displayableEvidence: [
      "Twins Study: 50 distinct cytokines elevated in-flight; up to 8-fold inflammatory surge immediately post-landing",
      "T-cell epigenetic alterations and histone modification profiling (OSD-687)",
      "Urine inflammation multi-protein panel (OSD-656)",
      "Latent viral reactivation (EBV, CMV, VZV) during prolonged confinement",
    ],
    doNotLabelAs: [
      "live cytokine level stream",
      "instantaneous infection detector",
      "clinical immunology diagnostic assay",
    ],
    shortDescription: "T-cell suppression, latent viral reactivation & systemic cytokine release.",
    problemInSpace:
      "Radiation exposure, microgravity, altered circadian rhythms, and confined habitat stress suppress cell-mediated immune function.",
    effectOnAstronauts:
      "Elevated inflammatory cytokines, decreased T-cell proliferation response, and periodic asymptomatic shedding of latent herpesviruses.",
    nasaSolution:
      "Nutritional immune countermeasures, onboard viral surveillance, barrier cleanliness protocols, and immunomodulatory exercise regimens.",
  },
  bones: {
    id: "bones",
    name: "Skeletal System",
    badge: "BONE DECALCIFICATION",
    code: "SKL-06",
    color: "#fbbf24",
    glowColor: "#f59e0b",
    cameraTarget: [-0.095, -0.19, -0.03],
    cameraPosition: [-0.12, -0.19, 1.15],
    anchor: [-0.095, -0.19, -0.03],
    lineSide: "left",
    missionRisk: "CRITICAL",
    researchDatasetIds: [
      "LONG_DURATION_BMD_COHORT_2007",
      "NASA_TWINS_STUDY_2019",
      "NASA_STANDARD_MEASURES",
    ],
    displayableEvidence: [
      "NASA 45-astronaut cohort DXA findings: ~1.0% monthly loss in lumbar spine, 1.2% in femoral neck, 1.5% in trochanter",
      "Twins Study early-flight bone resorption markers elevation (NTX, PYD)",
      "Published non-linear exponential recovery models showing multi-year remineralization half-times",
    ],
    doNotLabelAs: [
      "real-time bone density sensor",
      "individual fracture risk calculator without DXA",
      "continuous calcium excretion telemetry",
    ],
    shortDescription: "Accelerated osteoclastic osteopenia in load-bearing hips & lumbar spine.",
    problemInSpace:
      "Microgravity unloads the skeletal frame completely; osteoblasts downregulate while osteoclasts resorb bone mineral, leaching calcium into circulation.",
    effectOnAstronauts:
      "Loss of up to 1.0-1.5% bone mineral density per month in pelvis, hip, and lumbar spine; elevated risk of nephrolithiasis (kidney stones).",
    nasaSolution:
      "Advanced Resistive Exercise Device (ARED) loading up to 600 lbs, bisphosphonate pharmacological protocols, and dietary Vitamin D3.",
  },
  muscles: {
    id: "muscles",
    name: "Muscular System",
    badge: "POSTURAL ATROPHY",
    code: "MUS-07",
    color: "#be185d",
    glowColor: "#f43f5e",
    cameraTarget: [0.095, -0.1, 0.03],
    cameraPosition: [0.12, -0.12, 1.15],
    anchor: [0.095, -0.1, 0.03],
    lineSide: "right",
    missionRisk: "HIGH",
    researchDatasetIds: ["NASA_STANDARD_MEASURES", "NASA_TWINS_STUDY_2019"],
    displayableEvidence: [
      "Published rapid postural muscle volume loss (soleus, gastrocnemius, quadriceps)",
      "Slow-to-fast muscle fiber phenotypic transition (Type I to Type IIa/x)",
      "Neuromuscular activation decline and motor unit recruitment alterations",
    ],
    doNotLabelAs: [
      "live electromyogram (EMG) channel",
      "real-time muscle volume calculation",
      "clinical sarcopenia diagnosis",
    ],
    shortDescription: "Disuse muscle atrophy in antigravity postural soleus, gastrocnemius & quads.",
    problemInSpace:
      "Postural calf and thigh muscles are largely inactive in free fall, leading to swift disuse atrophy and negative nitrogen balance.",
    effectOnAstronauts:
      "Loss of up to 10-20% muscle volume in calf and thigh without vigorous countermeasures, with peak power output dropping markedly.",
    nasaSolution:
      "Daily 2.5-hour countermeasure regimen split between T2 Colbert Treadmill and Cycle Ergometer with Vibration Isolation (CEVIS).",
  },
  digestive_system: {
    id: "digestive_system",
    name: "Digestive & Microbiome",
    badge: "GUT MICROBIOME & METABOLOMICS",
    code: "GI-08",
    color: "#fb923c",
    glowColor: "#ea580c",
    cameraTarget: [0.0, 0.22, 0.04],
    cameraPosition: [0.0, 0.22, 0.88],
    anchor: [0.0, 0.22, 0.04],
    lineSide: "right",
    missionRisk: "MODERATE",
    researchDatasetIds: ["OSD-630", "NASA_TWINS_STUDY_2019", "NASA_STANDARD_MEASURES"],
    displayableEvidence: [
      "Twins Study: 96% shift in Firmicutes-to-Bacteroidetes ratio during spaceflight",
      "245 plasma metabolic features significantly altered during 340-day mission",
      "Inspiration4 stool metagenome sequencing (OSD-630)",
      "Energy intake restriction (66% of estimated requirement in flight twin)",
    ],
    doNotLabelAs: [
      "real-time digestive motility readout",
      "continuous gut microbiome sensor",
      "clinical gastroenterology assessment",
    ],
    shortDescription: "Gut taxonomic shifts, altered short-chain fatty acids & metabolic remodeling.",
    problemInSpace:
      "Processed space diet, circadian desynchrony, radiation, and microgravity motility shifts reshape the human gut microbiome.",
    effectOnAstronauts:
      "Altered microbial diversity, temporary shift in Firmicutes/Bacteroidetes ratio, decreased calorie intake, and altered micronutrient metabolism.",
    nasaSolution:
      "Prebiotic/probiotic nutritional formulations, shelf-stable high-fiber menu items, and regular metabolic intake logging.",
  },
  skin: {
    id: "skin",
    name: "Skin & Surface Flora",
    badge: "DERMAL BIOPSY & SURFACE FLORA",
    code: "DERM-09",
    color: "#a78bfa",
    glowColor: "#8b5cf6",
    cameraTarget: [0.24, 0.52, 0.02],
    cameraPosition: [0.25, 0.52, 0.78],
    anchor: [0.24, 0.52, 0.02],
    lineSide: "right",
    missionRisk: "MODERATE",
    researchDatasetIds: ["OSD-572", "OSD-574"],
    displayableEvidence: [
      "Inspiration4 deltoid skin punch biopsy transcriptomic and histology data (OSD-574)",
      "Cutaneous, oral, and nasal microbial swab profiling across crew (OSD-572)",
      "Dermal thinning, delayed epidermal healing, and microgravity skin sensitivity",
    ],
    doNotLabelAs: [
      "continuous skin hydration readout",
      "live wound healing telemetry",
      "dermatologic diagnosis",
    ],
    shortDescription: "Epidermal thinning, altered stratum corneum flora & skin sensitivity.",
    problemInSpace:
      "Continuous contact with clothing without gravity, low cabin humidity, and altered skin cell proliferation weaken the epidermal barrier.",
    effectOnAstronauts:
      "Pruritus, cutaneous irritation, delayed superficial wound healing, and shifts in commensal skin microbial communities.",
    nasaSolution:
      "Hypoallergenic cleansing wipes, topical emollients, microbial air filtration, and skin barrier monitoring.",
  },
  whole_body: {
    id: "whole_body",
    name: "Whole-Body & Radiation Exposure",
    badge: "INTEGRATED SYSTEMIC & RADIATION",
    code: "SYS-10",
    color: "#38bdf8",
    glowColor: "#06b6d4",
    cameraTarget: [0.0, 0.0, 0.0],
    cameraPosition: [0.0, 0.0, 2.75],
    anchor: [0.0, 0.0, 0.0],
    lineSide: "left",
    missionRisk: "CRITICAL",
    researchDatasetIds: [
      "NASA_TWINS_STUDY_2019",
      "LONG_DURATION_BMD_COHORT_2007",
      "NASA_STANDARD_MEASURES",
    ],
    displayableEvidence: [
      "Twins Study physical dosimeter dose: 76.18 mGy across 340-day mission",
      "Twins Study effective radiation dose: 146.34 mSv",
      "Whole-body mass change: -7% in flight twin vs +4% in ground control",
      "Gene expression: 91.3% returned to baseline postflight, with 811 persistently disrupted genes",
      "Mitochondrial RNA correlation across mission timeline (R² = 0.84)",
    ],
    doNotLabelAs: [
      "real-time cosmic ray dosimeter alarm",
      "instantaneous cancer risk index",
      "live whole-body vitality score",
    ],
    shortDescription: "Cosmic galactic radiation, telomere elongation/shortening & multi-omic stress.",
    problemInSpace:
      "Galactic cosmic rays (GCR) and solar particle events (SPE) penetrate spacecraft hulls, causing double-strand DNA breaks and oxidative stress.",
    effectOnAstronauts:
      "Absorbed dose of ~76 mGy (146 mSv effective) over ~1 year on ISS; transient telomere lengthening followed by rapid post-return shortening.",
    nasaSolution:
      "Spacecraft polyethylene storm shelters, crew biodosimetry monitoring, antioxidant-rich nutrition, and active space weather shielding research.",
  },
  spacecraft_environment: {
    id: "spacecraft_environment",
    name: "Spacecraft Environment",
    badge: "HABITAT & VEHICLE MICROBIOME",
    code: "ENV-11",
    color: "#2dd4bf",
    glowColor: "#14b8a6",
    cameraTarget: [0.42, -0.68, 0.22],
    cameraPosition: [0.55, -0.60, 1.30],
    anchor: [0.42, -0.68, 0.22],
    lineSide: "right",
    missionRisk: "MODERATE",
    researchDatasetIds: ["OSD-573"],
    displayableEvidence: [
      "Inspiration4 Crew Dragon capsule cabin environmental surface swabs (OSD-573)",
      "High-efficiency particulate air (HEPA) filtration metagenomics",
      "Closed environmental life-support parameters (CO2, cabin atmospheric pressure, volatile organic compounds)",
    ],
    doNotLabelAs: [
      "continuous spacecraft life support sensor",
      "cabin pressure fault alert",
      "live atmospheric telemetry",
    ],
    shortDescription: "Closed-loop environmental control, cabin microbial ecology & life support.",
    problemInSpace:
      "Hermetically sealed spacecraft environments circulate air and water closed-loop; microbes exchange continuously between crew and surfaces.",
    effectOnAstronauts:
      "Risk of microbial biofilm formation on water processing systems and elevated ambient carbon dioxide (>2-3 mmHg) contributing to cephalic symptoms.",
    nasaSolution:
      "Regular disinfectant habitat wipedowns, HEPA charcoal catalytic filtration, automated trace contaminant control, and microbial swab sequencing.",
  },
};

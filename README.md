# SpaceBody: Interactive 3D Astronaut Health Explorer
### *A Scientific Anatomy & Multi-Omics Atlas for Human Spaceflight*

[![NASA Space Apps Challenge](https://img.shields.io/badge/NASA%20Space%20Apps-Challenge%202026-0284c7.svg?style=for-the-badge&logo=nasa)](https://www.spaceappschallenge.org/)
[![React](https://img.shields.io/badge/React-19.0-61dafb.svg?style=for-the-badge&logo=react)](https://react.dev/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.9-3178c6.svg?style=for-the-badge&logo=typescript)](https://www.typescriptlang.org/)
[![Three.js](https://img.shields.io/badge/Three.js-WebGL%203D-black.svg?style=for-the-badge&logo=three.js)](https://threejs.org/)
[![Vite](https://img.shields.io/badge/Vite-8.3-646cff.svg?style=for-the-badge&logo=vite)](https://vitejs.dev/)
[![TailwindCSS](https://img.shields.io/badge/Tailwind-4.1-38bdf8.svg?style=for-the-badge&logo=tailwindcss)](https://tailwindcss.com/)

---

## 🚀 Executive Summary

As humanity prepares for long-duration expeditions to the Moon (**Artemis**) and **Mars**, understanding human physiological adaptation in microgravity and deep-space cosmic radiation is humanity's most critical medical frontier. While NASA has amassed decades of peer-reviewed biomedical literature and multi-omics sequencing, these vital discoveries often remain locked behind complex academic publications, static tables, and fragmented open-data archives.

**SpaceBody** bridges this gap. It is an interactive, competition-level web platform that maps authentic NASA biomedical research directly onto an interactive **3D Écorché anatomical human body** across **11 distinct anatomical regions**. SpaceBody integrates data from the **NASA Twins Study**, the **SpaceX Inspiration4** multi-omics repository, the **NASA 45-Astronaut Bone Mineral Density Cohort**, and the **NASA UTMB Bedrest Ground Analogue Campaign**.

Every measurement, unit, biomarker, and citation in SpaceBody is scientifically authenticated against published literature—with **zero synthetic or fabricated telemetry**.

---

## 🎯 NASA Space Apps Challenge Alignment

| Evaluation Dimension | How SpaceBody Delivers |
| :--- | :--- |
| **Scientific Accuracy** | Built strictly from authentic NASA peer-reviewed papers (*Science* 2019, *Nature* 2024, NASA Technical Reports). Distinguishes individual findings from cohort aggregates and terrestrial analogues. |
| **Use of NASA Open Data** | Directly connects to **NASA OSDR** (Open Science Data Repository accessions OSD-569 through OSD-687), **NASA LSDA** (Life Sciences Data Archive), and **NASA Standard Measures**. |
| **Interactive 3D UX** | High-performance WebGL 3D Écorché anatomy with sagittal split-planes, 3D cranium brain, orbital visual globe, and dynamic camera framing. |
| **Real-World Impact** | Translates complex aerospace physiology into an accessible tool for researchers, educators, flight surgeons, and future astronauts. |
| **Engineering Rigor** | Clean modular architecture, TypeScript strict-typing, reactive state management, and 100% build verification. |

---

## 🌟 Key Features

### 1. Interactive 3D Écorché Anatomical Explorer
- **Photorealistic Dual-View Anatomy:** Displays a sagittal split showing the osteological skeleton on the left and the muscular anatomy on the right.
- **Dedicated Cranial Vault & Orbit:** Houses an authentic 3D brain model inside the skull and an anatomical ocular globe with cornea, lens, iris, and optic nerve sheath.
- **Anatomical Raycasting:** Click directly on any body part (chest, abdomen, arm, deltoid, hip, thigh, skull, or eyes) to trigger instant telemetry and camera focus.
- **Anatomical Markers Toggle:** Switch between a pure, unobstructed anatomical inspection mode (`Markers: OFF`) and a scientific beacon HUD mode (`Markers: ON`).
- **Cinematic Focus Presets:** Instant camera transitions to *Whole Body*, *Head & CNS*, *Cardio & Torso*, *Spine & Pelvis*, and *Muscles & Legs*.

### 2. Comprehensive 11-System Physiological Mapping
SpaceBody maps the full spectrum of spaceflight physiological adaptation across 11 body systems:
1. **Cardiovascular System (`CARDIO-01`):** Cephalad fluid shift, ventricular remodeling, stroke volume fluctuations, and arterial wall stiffening.
2. **Brain & Cognitive Function (`CNS-02`):** Cranial venous engorgement, ventricular expansion, cognitive test latency, and circadian rhythm disruption.
3. **Visual System - SANS (`SANS-03`):** Spaceflight-Associated Neuro-ocular Syndrome, choroidal thickening, optic nerve sheath diameter (ONSD) expansion, and hyperopic refractive shift.
4. **Blood & Hematologic System (`HEMA-04`):** Spaceflight anemia, red blood cell mass contraction (neocytolysis), erythropoietin downregulation, and complete blood count (CBC) profiles.
5. **Immune System (`IMM-05`):** T-cell function suppression, acute post-flight inflammatory cytokine surge (up to 8-fold increase), and latent herpesvirus reactivation (EBV, CMV, VZV).
6. **Skeletal System (`SKL-06`):** Microgravity-induced osteoclast resorption, loss of 1.0–1.5% bone mineral density per month in load-bearing hips and lumbar spine, and multi-year recovery curves.
7. **Muscular System (`MUS-07`):** Disuse muscle atrophy in postural antigravity muscles (soleus, gastrocnemius, quadriceps) and slow-to-fast muscle fiber transitions.
8. **Digestive & Gut Microbiome (`GI-08`):** 96% shift in Firmicutes-to-Bacteroidetes ratio, altered short-chain fatty acids, restricted caloric intake, and metabolomic remodeling.
9. **Skin & Surface Flora (`DERM-09`):** Dermal thinning, cutaneous swab microbiome transitions, delayed superficial wound healing, and deltoid punch biopsy spatial transcriptomics.
10. **Whole-Body & Radiation Exposure (`SYS-10`):** Absorbed physical dosimeter dose (76.18 mGy), effective biological dose (146.34 mSv), transient telomere elongation followed by rapid post-flight shortening, and 91.3% genomic baseline recovery.
11. **Spacecraft Environment (`ENV-11`):** Closed-loop life support parameters, elevated cabin CO₂ (>2–3 mmHg), HEPA particulate air metagenomics, and vehicle cabin surface swabs.

### 3. Integrated Authentic NASA Missions & Research Programs
Users can toggle between four milestone human spaceflight research programs:
- **NASA Twins Study (2019):** Astronaut Scott Kelly aboard the ISS for 340 days compared with his identical twin Mark Kelly on Earth. Published in *Science*.
- **SpaceX Inspiration4 Biospecimen Package (2024):** First commercial all-civilian orbital mission (590 km orbit, 3 days, 4 crew members). Processed multi-omics data hosted on NASA OSDR.
- **NASA Bone Loss Cohort (2007):** Long-duration DXA study across 45 astronauts with non-linear exponential remineralization modeling (LeBlanc et al., NASA NTRS 20070032016).
- **NASA UTMB Bedrest Campaign 1 (2017):** 60-day -6° head-down tilt ground analogue investigating cephalic fluid shifts and circadian sleep actigraphy (NASA LSDA).

### 4. Real-Time Dynamic Telemetry Rail & Milestone Scrubber
- **Interactive Longitudinal Timeline:** Scrub along mission flight days from pre-launch screening ($L-92$) to orbital flight ($FD120$, $FD240$) and long-term Earth re-adaptation ($R+180$, $R+520$).
- **Responsive Telemetry Rail:** Left sidebar automatically updates with dynamic health scores, animated progress bars, study-specific finding counts, and mission target badges (`TARGET` vs `REF`).
- **Comprehensive Research Dossier:** Right panel surfaces empirical values, statistical standard deviations, control baselines, operational countermeasures, and direct DOI research citations.

---

## 🔬 Data Integrity & Scientific Ethics

SpaceBody adheres to strict scientific communication standards:

1. **Zero Data Fabrication:** No telemetry values, clinical lab results, or thresholds are invented. All numbers originate from published peer-reviewed findings or NASA technical publications.
2. **Clear Evidence Classification:** Every data point is explicitly tagged with its evidence class:
   - `PUBLISHED_NUMERICAL_FINDING`: Quantitative findings published in peer-reviewed scientific literature.
   - `OSDR_DATASET_METADATA`: NASA Open Science Data Repository dataset metadata.
   - `COHORT_AGGREGATE_STATISTIC`: Multi-participant means across longitudinal astronaut cohorts.
   - `GROUND_ANALOGUE_RESEARCH`: Terrestrial simulated microgravity data (e.g., -6° head-down tilt bedrest).
3. **No False Telemetry:** Historical research measurements and longitudinal laboratory assays are explicitly labeled as research findings—never misrepresented as real-time in-flight astronaut biometric streams.

---

## 📂 System Architecture & Modular Data Design

```
space-body/
├── src/
│   ├── components/
│   │   └── human/
│   │       ├── EcorcheModel.tsx        # High-performance 3D WebGL human anatomy & raycasting
│   │       ├── HumanBody.tsx           # Suspense loader & model wrapper
│   │       └── internal/
│   │           ├── system-data.ts      # 11 anatomical camera targets, anchors & risk data
│   │           └── textures.ts         # Procedural shader textures (cortex, sclera, iris)
│   ├── data/
│   │   └── health/                     # Modular NASA Research Data Architecture
│   │       ├── types.ts                # TypeScript strict interfaces & evidence classes
│   │       ├── metadata.ts             # Data integrity rules, schemas & API metadata
│   │       ├── sources.ts              # 24 primary peer-reviewed citations & DOIs
│   │       ├── regions.ts              # 11 Three.js anatomical body region definitions
│   │       ├── observations.ts         # 29 published NASA empirical numerical findings
│   │       ├── osdr.ts                 # 10 NASA OSDR Inspiration4 datasets & Standard Measures
│   │       ├── missions.ts             # 4 mission/study profiles & longitudinal intervals
│   │       ├── formatters.ts           # Scientific value formatting & metric label resolution
│   │       ├── helpers.ts              # Query filters & validateNASAHealthDataset()
│   │       └── index.ts                # Assembled dataset entry point
│   ├── pages/
│   │   ├── home/                       # Landing portal & mission introduction
│   │   └── simulator/
│   │       ├── Simulator.tsx           # Cockpit controller, 3D canvas & layout orchestration
│   │       └── components/
│   │           ├── HealthIndicatorsPanel.tsx     # 3D glowing anchor beacons & HUD telemetry cards
│   │           ├── HealthTelemetryChart.tsx       # Longitudinal comparison modal & multi-omics
│   │           ├── SystemTelemetryIndicator.tsx  # Detailed research dossier & NASA citations
│   │           └── TimelineSlider.tsx            # Flight day scrubber & phase tracker
│   └── health-data.ts                  # Backwards-compatible root export
└── public/
    └── models/                         # Optimized GLTF anatomical assets (skeleton, anatomy, brain)
```

---

## 📊 Dataset Verification & Metrics

SpaceBody includes a runtime verification utility (`validateNASAHealthDataset()`) that validates all records:

| Entity | Verified Count | Primary Sources |
| :--- | :--- | :--- |
| **Research Studies** | **4** | Science (2019), Nature (2024), NASA NTRS, NASA LSDA |
| **Published Numerical Findings** | **29** | Peer-reviewed empirical measurements with units & sample sizes |
| **NASA OSDR Datasets** | **10** | OSD-569, OSD-570, OSD-571, OSD-572, OSD-573, OSD-574, OSD-575, OSD-630, OSD-656, OSD-687 |
| **Standard Measures Domains** | **7** | Spaceflight Standard Measures Protocol |
| **3D Anatomical Regions** | **11** | Full-body anatomical coverage |
| **Primary Scientific Citations** | **24** | Verified academic papers, DOIs, and NASA repositories |

---

## 🛠️ Technology Stack

- **Core Framework:** [React 19](https://react.dev/) + [TypeScript 5.9](https://www.typescriptlang.org/)
- **3D Graphics Engine:** [Three.js](https://threejs.org/) + [@react-three/fiber](https://docs.pmnd.rs/react-three-fiber) + [@react-three/drei](https://github.com/pmndrs/drei)
- **Routing:** [React Router v7](https://reactrouter.com/)
- **Styling & UI:** [Tailwind CSS v4](https://tailwindcss.com/) + CSS Grid / Flexbox
- **Icons & Visuals:** [Lucide React](https://lucide.dev/)
- **Build Tool:** [Vite 8.3](https://vitejs.dev/)

---

## ⚡ Quick Start & Installation

### Prerequisites
- [Node.js](https://nodejs.org/) (v18.0.0 or higher, v22+ recommended)
- `npm` or `pnpm` or `yarn`

### Installation Steps

1. **Clone the repository:**
   ```bash
   git clone https://github.com/mahabubr753/space-body.git
   cd space-body
   ```

2. **Install project dependencies:**
   ```bash
   npm install
   ```

3. **Start the local development server:**
   ```bash
   npm run dev
   ```
   Open your browser and navigate to `http://localhost:5173`.

4. **Build for production:**
   ```bash
   npm run build
   ```
   Generates an optimized production build in the `dist/` directory with full TypeScript compilation checks.

---

## 📖 NASA Source References & Primary Literature

1. **NASA Twins Study (2019):** Garrett-Bakelman, F. E., et al. *"The NASA Twins Study: A multidimensional analysis of a year-long human spaceflight."* *Science*, 364(6436), eaau8650. [DOI: 10.1126/science.aau8650](https://doi.org/10.1126/science.aau8650)
2. **Inspiration4 SANS & Space Omics (2024):** Overbey, E. G., et al. *"The Space Omics and Medical Atlas (SOMA) across orbits."* *Nature*, 632, 1165–1177. [DOI: 10.1038/s41586-024-07639-y](https://doi.org/10.1038/s41586-024-07639-y)
3. **NASA Bone Loss Cohort (2007):** LeBlanc, A., et al. *"Recovery of Spaceflight-induced Bone Loss: Bone Mineral Density after Long-Duration Missions as Fitted with an Exponential Function."* NASA Technical Report Server (NTRS), Document ID: 20070032016. [NTRS Link](https://ntrs.nasa.gov/citations/20070032016)
4. **NASA Open Science Data Repository (OSDR):** [https://osdr.nasa.gov/](https://osdr.nasa.gov/)
5. **NASA Life Sciences Data Archive (LSDA):** [https://nlsp.nasa.gov/](https://nlsp.nasa.gov/)
6. **NASA Human Research Program (HRP):** [https://www.nasa.gov/hrp/](https://www.nasa.gov/hrp/)
7. **NASA Spaceflight Standard Measures:** [https://www.nasa.gov/reference/standard-measures/](https://www.nasa.gov/reference/standard-measures/)

---

## 📄 License

This project is open-source under the [MIT License](LICENSE). Scientific data, publications, and mission descriptions belong to **NASA** and their respective authors in accordance with NASA's Open Science and Public Access policies.

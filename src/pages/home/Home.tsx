import React from "react";
import { Link } from "react-router-dom";

const Home: React.FC = () => {
  const systems = [
    {
      id: "01",
      title: "Skeletal System",
      loss: "-1.56% / mo",
      desc: "Microgravity eliminates mechanical strain. Cancellous bone demineralizes rapidly in the trochanter (-1.56%/mo) and lumbar spine (-1.06%/mo).",
      countermeasure: "ARED 600 lbs Load",
      color: "text-amber-400",
      border: "border-amber-500/25",
      badge: "bg-amber-500/10 text-amber-400 border-amber-500/20",
    },
    {
      id: "02",
      title: "Muscular System",
      loss: "Disuse Atrophy",
      desc: "Postural antigravity muscles (soleus, gastrocnemius, quadriceps) suffer rapid loss of tension, volume, and mitochondrial gene expression.",
      countermeasure: "2.5 hrs/day Training",
      color: "text-rose-400",
      border: "border-rose-500/25",
      badge: "bg-rose-500/10 text-rose-400 border-rose-500/20",
    },
    {
      id: "03",
      title: "Visual System (SANS)",
      loss: "+38% ONSD",
      desc: "Cephalic fluid pooling elevates intracranial pressure, causing posterior globe flattening, optic disc edema, and hyperopic refractive shifts.",
      countermeasure: "Space Focals & LBNP",
      color: "text-sky-400",
      border: "border-sky-500/25",
      badge: "bg-sky-500/10 text-sky-400 border-sky-500/20",
    },
    {
      id: "04",
      title: "Brain & Cognition",
      loss: "Cephalic Shift",
      desc: "Upward redistribution of ~2L interstitial fluid into the cranial vault increases ICP; WinSCAT testing demonstrates post-flight efficiency decreases.",
      countermeasure: "Chibis LBNP Suit",
      color: "text-purple-400",
      border: "border-purple-500/25",
      badge: "bg-purple-500/10 text-purple-400 border-purple-500/20",
    },
  ];

  const nasaStudies = [
    {
      id: "twins",
      badge: "N-of-1 Long-Duration",
      badgeColor: "bg-purple-500/15 text-purple-300 border-purple-500/30",
      title: "NASA Twins Study (2019)",
      journal: "Science • Garrett-Bakelman et al.",
      doi: "10.1126/science.aau8650",
      url: "https://pmc.ncbi.nlm.nih.gov/articles/PMC7580864/",
      desc: "A 340-day multidimensional comparison between astronaut Scott Kelly (ISS) and twin Mark Kelly (Earth). 28 published empirical findings including 146.34 mSv radiation, telomere elongation, cytokine shifts, and 91.3% genomic baseline recovery.",
    },
    {
      id: "inspiration4",
      badge: "NASA OSDR Multi-Omics",
      badgeColor: "bg-emerald-500/15 text-emerald-300 border-emerald-500/30",
      title: "SpaceX Inspiration4 (2024)",
      journal: "Nature Space Omics Package",
      doi: "10.26030/7cax-yj10",
      url: "https://osdr.nasa.gov/bio/repo/data/missions/SpaceX%20Inspiration4",
      desc: "First commercial astronaut biospecimen research program with 10 NASA OSDR datasets (OSD-569 to OSD-687). Evaluates cell-free DNA, single-cell RNA sequencing, skin punch biopsies, and capsule microbiome.",
    },
    {
      id: "bmd",
      badge: "Cohort Mean (N=45)",
      badgeColor: "bg-amber-500/15 text-amber-300 border-amber-500/30",
      title: "Mir & ISS Bone Loss Cohort (2007)",
      journal: "Bone • NASA Technical Report 20070032016",
      doi: "NASA NTRS 20070032016",
      url: "https://ntrs.nasa.gov/archive/nasa/casi.ntrs.nasa.gov/20070032016.pdf",
      desc: "Long-duration DXA bone mineral density across 45 astronauts and 56 measurement sets. Documents region-specific monthly bone loss (trochanter -1.56%/mo) and 9-month exponential recovery half-times.",
    },
    {
      id: "bedrest",
      badge: "Ground-Analogue Research",
      badgeColor: "bg-cyan-500/15 text-cyan-300 border-cyan-500/30",
      title: "UTMB 70-Day Microgravity Bedrest (2017)",
      journal: "NASA Life Sciences Data Archive",
      doi: "NASA LSDA BRSMACT",
      url: "https://nlsp.nasa.gov/search/data/details/e26501eb-7d7a-5012-8c8e-c5bdb3eecaf6",
      desc: "NASA Flight Analogue Research Center study evaluating 70-day -6° head-down tilt bed rest. Investigates cephalic fluid redistribution, sleep duration, sleep latency, and circadian fragmentation.",
    },
  ];

  const bodyRegions = [
    { name: "Cardiovascular", code: "CARDIO-01", color: "#ef4444" },
    { name: "Brain & Cognition", code: "CNS-02", color: "#c084fc" },
    { name: "Visual (SANS)", code: "SANS-03", color: "#0284c7" },
    { name: "Blood & CBC", code: "HEMA-04", color: "#f43f5e" },
    { name: "Immune System", code: "IMM-05", color: "#10b981" },
    { name: "Skeletal System", code: "SKL-06", color: "#fbbf24" },
    { name: "Muscular System", code: "MUS-07", color: "#be185d" },
    { name: "Gut Microbiome", code: "GI-08", color: "#fb923c" },
    { name: "Skin & Dermal", code: "DERM-09", color: "#a78bfa" },
    { name: "Whole-Body Radiation", code: "SYS-10", color: "#38bdf8" },
    { name: "Cabin Environment", code: "ENV-11", color: "#2dd4bf" },
  ];

  const team = [
    {
      name: "Raisa Jahan Riya",
      role: "Team Lead",
      focus:
        "managing the team, collecting data, and planning the overall workflow.",
      gradient: "from-cyan-500 to-blue-600",
      border: "border-cyan-500/30",
    },
    {
      name: "Mahabubur Rahman",
      role: "Developer",
      focus: "handles the coding and technical development of the project.",
      gradient: "from-purple-500 to-indigo-600",
      border: "border-purple-500/30",
    },
  ];

  return (
    <div className="min-h-screen bg-[#020617] text-white selection:bg-cyan-500 selection:text-slate-950 relative overflow-hidden font-sans">
      {/* Deep Space Atmosphere */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden z-0">
        <div className="absolute -top-32 -left-32 w-96 h-96 rounded-full bg-cyan-600/10 blur-[140px]" />
        <div className="absolute top-1/2 -right-32 w-96 h-96 rounded-full bg-indigo-600/10 blur-[150px]" />
      </div>

      {/* Grid Pattern */}
      <div
        className="fixed inset-0 pointer-events-none opacity-[0.025] z-0"
        style={{
          backgroundImage:
            "linear-gradient(to right, #38bdf8 1px, transparent 1px), linear-gradient(to bottom, #38bdf8 1px, transparent 1px)",
          backgroundSize: "44px 44px",
        }}
      />

      <div className="relative z-10 flex flex-col min-h-screen">
        {/* Minimalist Navbar */}
        <header className="border-b border-slate-800/80 bg-slate-950/70 backdrop-blur-xl sticky top-0 z-50">
          <div className="container mx-auto w-11/12 h-18 sm:h-20 flex items-center justify-between">
            <Link to="/" className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-cyan-500 to-blue-600 flex items-center justify-center font-mono font-bold text-slate-950 text-base shadow-[0_0_20px_rgba(6,182,212,0.35)]">
                SB
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <span className="font-mono text-xs font-bold uppercase tracking-widest text-cyan-400">
                    SpaceBody
                  </span>
                  <span className="text-xs font-mono px-2 py-0.5 rounded bg-cyan-500/15 text-cyan-300 border border-cyan-500/30">
                    NASA HRP
                  </span>
                </div>
                <p className="text-xs text-slate-400 font-medium hidden sm:block">
                  3D Astronaut Health Explorer
                </p>
              </div>
            </Link>

            <div className="flex items-center gap-3">
              <span className="hidden sm:inline-flex items-center gap-1.5 text-xs font-mono text-slate-400 px-3 py-1.5 rounded-lg bg-slate-900/80 border border-slate-800">
                <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                NASA SPACE APPS 2026
              </span>
              <Link
                to="/simulator"
                className="px-4 sm:px-5 py-2.5 rounded-xl font-semibold text-xs bg-cyan-500 hover:bg-cyan-400 text-slate-950 shadow-[0_0_20px_rgba(6,182,212,0.35)] transition-all flex items-center gap-2 font-mono"
              >
                <span>Launch 3D Simulator</span>
                <span className="font-bold">→</span>
              </Link>
            </div>
          </div>
        </header>

        {/* Hero Section */}
        <section className="pt-16 sm:pt-24 pb-16 text-center">
          <div className="container mx-auto w-11/12">
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-cyan-950/60 border border-cyan-500/30 text-cyan-300 text-xs font-mono mb-6">
              <span className="w-2 h-2 rounded-full bg-cyan-400 animate-pulse" />
              <span>
                NASA SPACE APPS CHALLENGE • 11 BODY SYSTEMS • VERIFIED RESEARCH
                DATASET v2.0
              </span>
            </div>

            <h1 className="text-3xl sm:text-5xl md:text-6xl font-extrabold tracking-tight text-white mb-6 leading-tight">
              Can the Human Body Endure{" "}
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 via-sky-300 to-indigo-400">
                Deep Space?
              </span>
            </h1>

            <p className="text-sm sm:text-base text-slate-300 leading-relaxed mb-8 font-normal max-w-2xl mx-auto font-sans">
              Weightlessness strips away Earth’s 1G gravity, triggering bone
              demineralization, muscle atrophy, fluid shift, and vision
              impairment (SANS). Explore authentic NASA biomedical telemetry on
              an interactive 3D anatomical model.
            </p>

            <div className="flex flex-wrap items-center justify-center gap-4">
              <Link
                to="/simulator"
                className="px-7 py-3.5 rounded-xl font-bold text-xs sm:text-sm bg-gradient-to-r from-cyan-500 to-sky-400 hover:from-cyan-400 hover:to-sky-300 text-slate-950 shadow-[0_0_25px_rgba(6,182,212,0.4)] transition-all flex items-center gap-2 font-mono"
              >
                <span>Launch 3D Bio-Explorer</span>
                <span className="font-bold">→</span>
              </Link>
            </div>
          </div>
        </section>

        {/* 11 Anatomical Regions Showcase */}
        <section className="py-12 border-t border-slate-800/80 bg-slate-950/30">
          <div className="container mx-auto w-11/12">
            <div className="mb-6 flex flex-wrap items-end justify-between gap-2">
              <div>
                <span className="text-xs font-mono text-cyan-400 font-bold uppercase tracking-widest block mb-1">
                  THREE.JS ANATOMICAL INTEGRATION
                </span>
                <h2 className="text-2xl sm:text-3xl font-bold text-white tracking-tight">
                  11 NASA Biomedical Body Regions
                </h2>
              </div>
              <p className="text-xs text-slate-400 font-mono">
                Clickable 3D beacon pins directly linked to empirical findings
              </p>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-2.5">
              {bodyRegions.map((r) => (
                <Link
                  key={r.code}
                  to="/simulator"
                  className="p-3 rounded-xl bg-slate-900/60 border border-slate-800 hover:border-cyan-500/40 transition-all group"
                >
                  <div className="flex items-center gap-2 mb-1.5">
                    <span
                      className="w-2 h-2 rounded-full shrink-0 group-hover:scale-125 transition-transform"
                      style={{ backgroundColor: r.color }}
                    />
                    <span className="text-xs font-mono text-slate-400 group-hover:text-cyan-300">
                      {r.code}
                    </span>
                  </div>
                  <h4 className="text-xs font-bold text-white truncate font-mono">
                    {r.name}
                  </h4>
                </Link>
              ))}
            </div>
          </div>
        </section>

        {/* 4 Core Physiological Challenges */}
        <section className="py-12 border-t border-slate-800/80">
          <div className="container mx-auto w-11/12">
            <div className="mb-8">
              <span className="text-xs font-mono text-cyan-400 font-bold uppercase tracking-widest block mb-1">
                PHYSIOLOGICAL IMPACT
              </span>
              <h2 className="text-2xl sm:text-3xl font-bold text-white tracking-tight">
                4 Critical Human Health Challenges
              </h2>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              {systems.map((s) => (
                <div
                  key={s.id}
                  className={`p-5 rounded-2xl bg-slate-950/80 border ${s.border} backdrop-blur-xl flex flex-col justify-between`}
                >
                  <div>
                    <div className="flex items-center justify-between mb-3">
                      <span
                        className={`text-xs font-mono font-bold px-2.5 py-1 rounded border ${s.badge}`}
                      >
                        {s.loss}
                      </span>
                      <span className="text-xs font-mono font-bold text-slate-400">
                        {s.id}
                      </span>
                    </div>

                    <h3
                      className={`text-base font-bold text-white mb-2 ${s.color}`}
                    >
                      {s.title}
                    </h3>
                    <p className="text-xs sm:text-sm text-slate-200 leading-relaxed mb-4">
                      {s.desc}
                    </p>
                  </div>

                  <div className="pt-3 border-t border-slate-800 text-xs font-mono text-slate-400 flex items-center justify-between">
                    <span>Countermeasure:</span>
                    <span className="text-slate-100 font-semibold">
                      {s.countermeasure}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* The 4 NASA Research Studies Showcase */}
        <section className="py-12 border-t border-slate-800/80 bg-slate-950/50">
          <div className="container mx-auto w-11/12">
            <div className="mb-8">
              <span className="text-xs font-mono text-cyan-400 font-bold uppercase tracking-widest block mb-1">
                DATASET PROVENANCE
              </span>
              <h2 className="text-2xl sm:text-3xl font-bold text-white tracking-tight">
                4 NASA Spaceflight & Analogue Studies
              </h2>
              <p className="text-xs text-slate-400 font-mono mt-1">
                Peer-reviewed literature • Zero fabricated telemetry • Primary
                source citations
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {nasaStudies.map((st) => (
                <div
                  key={st.id}
                  className="p-5 rounded-2xl bg-slate-900/60 border border-slate-800 hover:border-cyan-500/40 transition-all flex flex-col justify-between"
                >
                  <div>
                    <div className="flex items-center justify-between mb-2.5">
                      <span
                        className={`text-xs font-mono font-bold px-2.5 py-1 rounded border ${st.badgeColor}`}
                      >
                        {st.badge}
                      </span>
                      <a
                        href={st.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-xs font-mono font-bold text-cyan-400 hover:underline flex items-center gap-1"
                      >
                        <span>{st.doi}</span>
                        <span>↗</span>
                      </a>
                    </div>
                    <h3 className="text-base font-bold text-white mb-1.5 font-mono">
                      {st.title}
                    </h3>
                    <p className="text-xs text-slate-300 font-mono mb-2">
                      {st.journal}
                    </p>
                    <p className="text-xs sm:text-sm text-slate-200 leading-relaxed">
                      {st.desc}
                    </p>
                  </div>

                  <div className="pt-3 mt-3 border-t border-slate-800 flex items-center justify-between text-xs font-mono">
                    <span className="text-slate-400">Integration:</span>
                    <Link
                      to="/simulator"
                      className="text-cyan-400 hover:text-cyan-300 font-bold"
                    >
                      Explore in 3D →
                    </Link>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Team Section */}
        <section className="py-12 border-t border-slate-800/80 bg-slate-950/40">
          <div className="container mx-auto w-11/12">
            <div className="mb-8">
              <span className="text-xs font-mono text-cyan-400 font-bold uppercase tracking-widest block mb-1">
                SPACE APPS CREW
              </span>
              <h2 className="text-2xl sm:text-3xl font-bold text-white tracking-tight">
                Project Team (2 Members)
              </h2>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
              {team.map((member, idx) => (
                <div
                  key={idx}
                  className={`p-6 rounded-2xl bg-slate-950/80 border ${member.border} backdrop-blur-xl flex items-center gap-4`}
                >
                  <div
                    className={`w-12 h-12 rounded-xl bg-gradient-to-br ${member.gradient} flex items-center justify-center font-bold text-slate-950 text-base shrink-0 shadow-lg`}
                  >
                    {member.name.charAt(0)}
                  </div>
                  <div className="min-w-0">
                    <h3 className="text-base font-bold text-white truncate">
                      {member.name}
                    </h3>
                    <p className="text-xs text-cyan-400 font-mono mb-1 truncate">
                      {member.role}
                    </p>
                    <p className="text-[11px] text-slate-400 font-mono truncate">
                      {member.focus}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Minimalist Footer */}
        <footer className="mt-auto border-t border-slate-800/80 bg-slate-950 py-8 text-slate-500 text-xs font-mono">
          <div className="container mx-auto w-11/12 flex flex-col sm:flex-row items-center justify-between gap-4">
            <p>
              Developed for NASA Space Apps Challenge 2026 • Bio-Astronautics
            </p>
            <div className="flex items-center gap-4 text-slate-400">
              <Link to="/simulator" className="text-cyan-400 hover:underline">
                Enter 3D Simulator →
              </Link>
            </div>
          </div>
        </footer>
      </div>
    </div>
  );
};

export default Home;

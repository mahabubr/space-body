import React from "react";
import { Link } from "react-router-dom";

const Home: React.FC = () => {
  const systems = [
    {
      id: "01",
      title: "Skeletal System",
      loss: "-1.0% / month",
      desc: "Without mechanical loading in microgravity, bones demineralize rapidly in the hips and lumbar spine.",
      countermeasure: "ARED 600 lbs Load",
      color: "text-amber-400",
      border: "border-amber-500/25",
      badge: "bg-amber-500/10 text-amber-400 border-amber-500/20",
    },
    {
      id: "02",
      title: "Muscular System",
      loss: "-14% Volume Loss",
      desc: "Postural antigravity muscles (calves and quadriceps) experience immediate loss of tension and atrophy.",
      countermeasure: "2.5 hrs/day Training",
      color: "text-rose-400",
      border: "border-rose-500/25",
      badge: "bg-rose-500/10 text-rose-400 border-rose-500/20",
    },
    {
      id: "03",
      title: "Visual System (SANS)",
      loss: "+38% ONSD",
      desc: "Cephalic fluid pooling elevates retrobulbar pressure, flattening the posterior globe and causing hyperopic shift.",
      countermeasure: "Space Focals",
      color: "text-sky-400",
      border: "border-sky-500/25",
      badge: "bg-sky-500/10 text-sky-400 border-sky-500/20",
    },
    {
      id: "04",
      title: "Brain & Fluids",
      loss: "2L Fluid Shift",
      desc: "Hydrostatic pressure loss redistributes blood and cerebrospinal fluid upward into the cranial vault.",
      countermeasure: "Chibis LBNP Suit",
      color: "text-purple-400",
      border: "border-purple-500/25",
      badge: "bg-purple-500/10 text-purple-400 border-purple-500/20",
    },
  ];

  const team = [
    {
      name: "Team Lead",
      role: "Lead 3D WebGL & Systems Engineer",
      focus: "React Three Fiber • BodyParts3D Model • Telemetry Engine",
      gradient: "from-cyan-500 to-blue-600",
      border: "border-cyan-500/30",
    },
    {
      name: "Memeber",
      role: "Space Medicine & Bio-Astronautics Researcher",
      focus: "NASA HRP Telemetry • Spaceflight Pathology • UI/UX Design",
      gradient: "from-purple-500 to-indigo-600",
      border: "border-purple-500/30",
    },
  ];

  return (
    <div className="min-h-screen bg-[#020617] text-white selection:bg-cyan-500 selection:text-slate-950 relative overflow-hidden font-sans">
      {/* Subtle Deep Space Ambient Glows */}
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
                  <span className="text-[10px] font-mono px-1.5 py-0.5 rounded bg-cyan-500/15 text-cyan-300 border border-cyan-500/30">
                    NASA HRP
                  </span>
                </div>
                <p className="text-[11px] text-slate-400 font-medium hidden sm:block">
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
                className="px-4 sm:px-5 py-2.5 rounded-xl font-semibold text-xs bg-cyan-500 hover:bg-cyan-400 text-slate-950 shadow-[0_0_20px_rgba(6,182,212,0.35)] transition-all flex items-center gap-2"
              >
                <span>Launch 3D Simulator</span>
                <span className="font-bold">→</span>
              </Link>
            </div>
          </div>
        </header>

        {/* Minimalist Hero Section */}
        <section className="pt-16 sm:pt-24 pb-16 text-center">
          <div className="container mx-auto w-11/12">
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-cyan-950/60 border border-cyan-500/30 text-cyan-300 text-xs font-mono mb-6">
              <span className="w-2 h-2 rounded-full bg-cyan-400 animate-pulse" />
              <span>NASA SPACE APPS CHALLENGE 2026</span>
            </div>

            <h1 className="text-3xl sm:text-5xl md:text-6xl font-extrabold tracking-tight text-white mb-6 leading-tight">
              Can the Human Body Endure{" "}
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 via-sky-300 to-indigo-400">
                Deep Space?
              </span>
            </h1>

            <p className="text-sm sm:text-base text-slate-300 leading-relaxed mb-8 font-normal max-w-2xl mx-auto">
              Weightlessness strips away Earth’s 1G gravity, triggering bone
              demineralization, muscle atrophy, fluid shift, and vision
              impairment (SANS). Explore authentic NASA biomedical telemetry on
              an interactive 3D anatomical model.
            </p>

            <div className="flex flex-wrap items-center justify-center gap-4">
              <Link
                to="/simulator"
                className="px-7 py-3.5 rounded-xl font-bold text-xs sm:text-sm bg-gradient-to-r from-cyan-500 to-sky-400 hover:from-cyan-400 hover:to-sky-300 text-slate-950 shadow-[0_0_25px_rgba(6,182,212,0.4)] transition-all flex items-center gap-2"
              >
                <span>Launch 3D Bio-Explorer</span>
                <span className="font-bold">→</span>
              </Link>
            </div>
          </div>
        </section>

        {/* 4 Core Systems - Static & Minimalistic */}
        <section className="py-12 border-t border-slate-800/80">
          <div className="container mx-auto w-11/12">
            <div className="mb-8">
              <span className="text-xs font-mono text-cyan-400 font-bold uppercase tracking-widest block mb-1">
                PHYSIOLOGICAL IMPACT
              </span>
              <h2 className="text-2xl sm:text-3xl font-bold text-white tracking-tight">
                4 Critical Health Challenges
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
                        className={`text-[10px] font-mono font-bold px-2 py-0.5 rounded border ${s.badge}`}
                      >
                        {s.loss}
                      </span>
                      <span className="text-xs font-mono font-bold text-slate-500">
                        {s.id}
                      </span>
                    </div>

                    <h3
                      className={`text-base font-bold text-white mb-2 ${s.color}`}
                    >
                      {s.title}
                    </h3>
                    <p className="text-xs text-slate-300 leading-relaxed mb-4">
                      {s.desc}
                    </p>
                  </div>

                  <div className="pt-3 border-t border-slate-800/80 text-[11px] font-mono text-slate-400 flex items-center justify-between">
                    <span>Countermeasure:</span>
                    <span className="text-slate-200 font-semibold">
                      {s.countermeasure}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Minimalist 2-Member Team Section */}
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

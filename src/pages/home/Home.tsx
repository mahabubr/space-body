import React from "react";
import { Link } from "react-router-dom";

const Home: React.FC = () => {
  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col justify-between selection:bg-cyan-500 selection:text-black">
      {/* Top Navbar */}
      <nav className="flex items-center justify-between px-8 py-5 border-b border-slate-800/80 bg-slate-950/70 backdrop-blur-md">
        <div className="flex items-center space-x-3">
          <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-cyan-500 to-blue-600 flex items-center justify-center font-bold text-slate-950 shadow-lg shadow-cyan-500/20">
            SB
          </div>
          <span className="text-lg font-bold tracking-tight text-white">SpaceBody</span>
        </div>
        <Link
          to="/simulator"
          className="px-5 py-2.5 rounded-xl bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-semibold text-sm transition-all shadow-lg shadow-cyan-500/25 hover:shadow-cyan-400/40 hover:scale-105"
        >
          Launch 3D Simulator →
        </Link>
      </nav>

      {/* Hero Section */}
      <main className="max-w-5xl mx-auto px-6 py-16 text-center space-y-8 flex-1 flex flex-col justify-center items-center">
        <div className="inline-flex items-center space-x-2 px-4 py-1.5 rounded-full bg-cyan-500/10 border border-cyan-500/30 text-cyan-400 text-xs font-medium">
          <span className="w-2 h-2 rounded-full bg-cyan-400 animate-ping" />
          <span>Procedural 3D Human Anatomy Engine</span>
        </div>

        <h1 className="text-4xl sm:text-6xl font-extrabold tracking-tight text-white max-w-3xl leading-tight">
          Anatomically Correct <br />
          <span className="bg-gradient-to-r from-cyan-400 via-sky-300 to-blue-500 bg-clip-text text-transparent">
            3D Human Body Simulator
          </span>
        </h1>

        <p className="text-base sm:text-lg text-slate-400 max-w-2xl leading-relaxed">
          Full body human figure generated from scratch using basic 3D parametric geometry.
          Realistic anatomical proportions, smooth organic surfaces, physiological neutral standing pose,
          realistic skin material, and zero pre-made assets.
        </p>

        {/* Feature Cards Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 w-full pt-6 text-left">
          <div className="p-5 rounded-2xl bg-slate-900/60 border border-slate-800 space-y-2">
            <div className="text-cyan-400 text-xl">🧍</div>
            <h3 className="font-semibold text-sm text-white">Full Body Anatomy</h3>
            <p className="text-xs text-slate-400">
              Head with cranium, eyes, nose, lips, ears, neck with Adam&apos;s apple, torso with chest &amp; spine, arms, articulated hands, legs, and feet.
            </p>
          </div>

          <div className="p-5 rounded-2xl bg-slate-900/60 border border-slate-800 space-y-2">
            <div className="text-cyan-400 text-xl">✨</div>
            <h3 className="font-semibold text-sm text-white">Realistic Skin &amp; Lighting</h3>
            <p className="text-xs text-slate-400">
              Procedural micro-pore cellular texture, physical clearcoat &amp; sheen, studio 3-point illumination, and contact soft shadows.
            </p>
          </div>

          <div className="p-5 rounded-2xl bg-slate-900/60 border border-slate-800 space-y-2">
            <div className="text-cyan-400 text-xl">🔬</div>
            <h3 className="font-semibold text-sm text-white">Interactive 3D Studio</h3>
            <p className="text-xs text-slate-400">
              Orbit 360°, inspect anatomical body regions, switch between shaded skin, studio clay, wireframe, and X-ray scan modes.
            </p>
          </div>
        </div>

        {/* Action Button */}
        <div className="pt-6">
          <Link
            to="/simulator"
            className="inline-flex items-center space-x-3 px-8 py-4 rounded-2xl bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-slate-950 font-bold text-base transition-all shadow-xl shadow-cyan-500/30 hover:scale-105"
          >
            <span>Explore 3D Body Simulator</span>
            <span>→</span>
          </Link>
        </div>
      </main>

      {/* Footer */}
      <footer className="py-6 border-t border-slate-800/80 text-center text-xs text-slate-500">
        SpaceBody • Pure Procedural 3D Geometry • React Three Fiber &amp; Three.js
      </footer>
    </div>
  );
};

export default Home;

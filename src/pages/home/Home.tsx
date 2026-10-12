import { Link } from "react-router-dom";

const Home = () => {
  return (
    <div className="min-h-screen bg-[#070a12] text-white flex flex-col items-center justify-center p-6">
      <h1 className="text-3xl font-bold mb-4 text-cyan-400">SpaceBody Simulator</h1>
      <Link
        to="/simulator"
        className="px-6 py-2.5 bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-semibold rounded-lg transition-colors"
      >
        Open 3D Model Simulator
      </Link>
    </div>
  );
};

export default Home;

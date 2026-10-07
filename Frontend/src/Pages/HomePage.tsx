import { Link } from "react-router-dom";

const Home = () => {
  return (
    <div className="min-h-screen bg-slate-950 text-white flex items-center justify-center px-6">
      <div className="max-w-5xl mx-auto text-center">

        {/* Sub Badge */}
        <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full border border-white/10 bg-white/5 backdrop-blur-sm mb-6">
          <span className="w-2 h-2 rounded-full bg-indigo-500"></span>
          <p className="text-gray-300 text-sm">Welcome to Mercury</p>
        </div>

        {/* Heading */}
        <h1 className="text-5xl md:text-6xl font-bold leading-tight">
  Empowering{" "}
  <span className="text-indigo-500">
    Intelligence
  </span>
</h1>

        {/* Description */}
        <p className="text-gray-400 mt-4 text-lg max-w-3xl mx-auto">
          Research smarter, not harder. Mercury transforms your research into interactive notebooks,
          AI-assisted reasoning, and intelligent report generation — all in one seamless workspace.
        </p>

        {/* CTA Buttons */}
        <div className="flex justify-center gap-4 mt-8">
          <Link
            to="/signup"
            className="px-6 py-3 rounded-xl bg-indigo-600 hover:bg-indigo-700 transition-all duration-200 text-white font-semibold"
          >
            Get Started
          </Link>

          <Link
            to="/reports"
            className="px-6 py-3 rounded-xl border border-white/20 hover:border-indigo-500 hover:text-indigo-400 transition-all duration-200 font-medium"
          >
            View Reports
          </Link>
        </div>

        {/* Sub Visual Section */}
        <div className="mt-14 border border-white/10 rounded-2xl p-6 bg-linear-to-b from-white/5 to-transparent backdrop-blur-sm">
          <h3 className="text-xl font-semibold mb-2">Why Mercury?</h3>
          <p className="text-gray-400 max-w-2xl mx-auto">
            Each chat becomes a living research notebook. Generate structured insights, ask questions,
            and build knowledge—powered by intelligent automation.
          </p>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-6 text-left">
            <div className="p-4 border border-white/10 rounded-xl bg-white/5">
              <h4 className="font-semibold text-indigo-400">Agentic Notebooks</h4>
              <p className="text-gray-400 text-sm mt-1">
                Conversations that think, act, and refine research with you.
              </p>
            </div>

            <div className="p-4 border border-white/10 rounded-xl bg-white/5">
              <h4 className="font-semibold text-indigo-400">AI-Generated Reports</h4>
              <p className="text-gray-400 text-sm mt-1">
                Produce structured academic or business reports instantly.
              </p>
            </div>

            <div className="p-4 border border-white/10 rounded-xl bg-white/5">
              <h4 className="font-semibold text-indigo-400">Navigation</h4>
              <p className="text-gray-400 text-sm mt-1">
                Navigate your syllabus or study material through structured, AI-generated learning modules.
              </p>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
};

export default Home;

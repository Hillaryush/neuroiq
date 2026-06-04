import { Brain, ArrowRight } from "lucide-react";

export default function Hero() {
  return (
    <section className="relative overflow-hidden py-16 text-center">
      {/* Background Glow */}
      <div className="absolute inset-0 -z-10">
        <div className="mx-auto h-96 w-96 rounded-full bg-cyan-500/20 blur-[120px]" />
      </div>

      <div className="max-w-4xl mx-auto px-6">
        <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full border border-cyan-500/30 bg-cyan-500/10 text-cyan-300 mb-6">
          <Brain size={18} />
          AI Powered Cognitive Training
        </div>

        <h1 className="text-5xl md:text-7xl font-bold mb-6">
          Train Your Brain
          <br />
          <span className="bg-gradient-to-r from-cyan-400 to-purple-500 bg-clip-text text-transparent">
            Like an Elite Athlete
          </span>
        </h1>

        <p className="text-xl text-slate-400 max-w-2xl mx-auto mb-10">
          Improve memory, focus, reasoning, processing speed and attention
          through scientifically designed brain challenges.
        </p>

        <div className="flex flex-col sm:flex-row justify-center gap-4">
          <button className="px-8 py-4 rounded-xl bg-gradient-to-r from-cyan-500 to-purple-600 font-semibold hover:scale-105 transition">
            Start Training
          </button>

          <button className="px-8 py-4 rounded-xl border border-slate-700 hover:border-cyan-500 transition flex items-center justify-center gap-2">
            Brain Age Test
            <ArrowRight size={18} />
          </button>
        </div>

        <div className="mt-12 flex justify-center gap-10 text-center">
          <div>
            <h3 className="text-3xl font-bold text-cyan-400">14</h3>
            <p className="text-slate-400">Games</p>
          </div>

          <div>
            <h3 className="text-3xl font-bold text-purple-400">6</h3>
            <p className="text-slate-400">Brain Skills</p>
          </div>

          <div>
            <h3 className="text-3xl font-bold text-pink-400">∞</h3>
            <p className="text-slate-400">Potential</p>
          </div>
        </div>
      </div>
    </section>
  );
}

// Bracket_s5.tsx — Season 5 with Group Stage + Knockout bracket
import { useNavigate } from "react-router-dom"

const GOLD = "#f5c542"

export default function BracketS5() {
  const navigate = useNavigate()

  return (
    <div className="w-full min-h-screen flex items-center justify-center px-4 py-6"
      style={{ background: "linear-gradient(135deg,#0d0f14 0%,#111520 50%,#0d0f14 100%)" }}>
      
      {/* Navigation Buttons */}
      <button
        onClick={() => navigate('/seasons?season=5')}
        className="fixed left-6 top-24 z-50 px-3 sm:px-4 py-1.5 sm:py-2 rounded-full text-[0.65rem] sm:text-[0.72rem] font-semibold uppercase tracking-[0.12em] bg-gradient-to-tr from-white/90 via-zinc-200 to-zinc-300 text-[#050608] shadow-[0_8px_26px_rgba(2,6,23,0.55)] hover:brightness-105 transition-all duration-200 backdrop-blur-sm border border-white/10 cursor-pointer"
        type="button"
      >
        ← Back
      </button>

      <button
        onClick={() => navigate('/playoff/4')}
        className="fixed right-6 top-24 z-50 px-3 sm:px-4 py-1.5 sm:py-2 rounded-full text-[0.65rem] sm:text-[0.72rem] font-semibold uppercase tracking-[0.12em] bg-gradient-to-tr from-white/90 via-zinc-200 to-zinc-300 text-[#050608] shadow-[0_8px_26px_rgba(2,6,23,0.55)] hover:brightness-105 transition-all duration-200 backdrop-blur-sm border border-white/10 cursor-pointer"
        type="button"
      >
        ← Prev Season
      </button>

      <div style={{
        position: "relative", maxWidth: "fit-content",
        border: "2px solid rgba(255,255,255,0.15)", borderRadius: 16,
        background: "rgba(255,255,255,0.008)", boxShadow: "0 0 60px rgba(0,0,0,0.6)",
        overflow: "visible",
      }}>
        {/* Title */}
        <div className="flex items-center justify-center py-3 border-b border-white/10 px-4">
          <span className="text-sm font-black tracking-[0.28em] uppercase"
            style={{ color: GOLD, textShadow: "0 0 8px rgba(245,197,66,0.25)" }}>
            SEASON-Ⅴ
          </span>
        </div>

        {/* Content */}
        <div className="p-8">
          <div className="text-center">
            <h2 className="text-2xl font-bold text-white mb-4">Season 5 Bracket</h2>
            <p className="text-slate-400 mb-4">Group Stage + Playoff</p>
            
            <div className="flex flex-col gap-4 mt-8">
              <button
                onClick={() => navigate('/groupstage?season=5')}
                className="px-6 py-3 rounded-lg text-sm font-semibold uppercase tracking-wider bg-gradient-to-r from-blue-600 to-blue-700 text-white hover:from-blue-700 hover:to-blue-800 transition-all"
              >
                View Group Stage
              </button>
              
              <button
                onClick={() => navigate('/seasons?season=5')}
                className="px-6 py-3 rounded-lg text-sm font-semibold uppercase tracking-wider bg-gradient-to-r from-purple-600 to-purple-700 text-white hover:from-purple-700 hover:to-purple-800 transition-all"
              >
                View Season Overview
              </button>
            </div>

            <div className="mt-8 p-4 bg-amber-500/10 border border-amber-500/30 rounded-lg">
              <p className="text-amber-200 text-sm">
                <span className="font-bold">Coming Soon:</span> Full playoff bracket visualization is under construction.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

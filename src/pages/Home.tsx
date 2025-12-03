import { Link } from "react-router-dom";
import TrophyCanvas from "../components/3d/TrophyCanvas";
import { primaryTournament } from "./data/mockTournaments";

export default function Home() {
  const t = primaryTournament;

  return (
    <main className="relative flex-grow flex flex-col items-center justify-center w-full px-6 md:px-12 pt-[10vh] pb-[10vh]">
      {/* Background Ambient Glow */}
      <div className="absolute inset-0 z-0 pointer-events-none overflow-hidden">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-zinc-900/30 rounded-full blur-3xl opacity-50"></div>
      </div>

      <div className="w-full max-w-5xl z-10 flex flex-col gap-8 md:gap-12">
        {/* Title Section */}
        <div className="w-full text-center space-y-2">
          <h1 className="text-5xl md:text-5xl font-semibold tracking-tighter text-transparent bg-clip-text bg-gradient-to-b from-white via-zinc-200 to-zinc-500 pb-2">
            {t.descriptionContent}
          </h1>
        </div>

        {/* Middle Grid: Register | Trophy | Dates */}
        <div className="grid grid-cols-1 md:grid-cols-12 gap-4 md:gap-6 w-full items-stretch">
          {/* Left: Register Card */}
          <Link
            to="/admins"
            className="md:col-span-3 group relative overflow-hidden rounded-2xl border border-white/20 bg-white/5 p-6 md:p-8 flex flex-col items-center justify-center text-center transition-all duration-300 hover:bg-white/10 hover:border-zinc-700/50 hover:shadow-2xl hover:shadow-zinc-900/20"
          >
            <div className="absolute inset-0 bg-gradient-to-br from-white/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
            <div className="relative z-10 flex flex-col items-center gap-3">
              <span className="text-lg font-medium tracking-tight text-zinc-200 group-hover:text-white">
                Register
              </span>
            </div>
          </Link>

          {/* Center: Trophy Canvas */}
          <div className="md:col-span-6 relative h-64 md:h-80 flex items-center justify-center">
            <TrophyCanvas />
          </div>

          {/* Right: Dates Card */}
          <div className="md:col-span-3 rounded-2xl border border-white/20 bg-white/5 p-6 md:p-8 flex flex-col items-center justify-center text-center">
            <div className="flex flex-col gap-1">
              <span className="text-xs font-medium uppercase tracking-widest text-zinc-500">
                Event Dates
              </span>
              <div className="flex items-center gap-2 mt-2 justify-center text-zinc-200">
                <span className="text-lg font-medium tracking-tight">
                  {t.startDate} - {t.endDate}
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom: Prize Pool Card */}
        <div className="w-full">
          <div className="relative w-full rounded-2xl border border-white/20 bg-white/5 p-6 md:p-8 flex flex-col md:flex-row items-center justify-between gap-4 md:gap-8 group transition-all duration-300 hover:bg-white/10">
            <div className="flex flex-col md:flex-row items-center gap-4 md:gap-6 text-center md:text-left w-full justify-center">
              <div className="flex flex-col items-center gap-1">
                <span className="text-xs font-medium uppercase tracking-widest text-zinc-500">
                  Total Prize Pool
                </span>
                <span className="text-3xl md:text-4xl font-semibold tracking-tighter text-transparent bg-clip-text bg-gradient-to-r from-zinc-100 to-zinc-400">
                  ₹{t.prizePool.toLocaleString()}
                </span>
              </div>
            </div>
            {/* Subtle decorative accent */}
            <div className="absolute right-0 top-0 h-full w-1/3 bg-gradient-to-l from-white/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none rounded-r-2xl"></div>
          </div>
        </div>
      </div>
    </main>
  );
}

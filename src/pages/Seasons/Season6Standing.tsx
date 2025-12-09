// src/pages/seasons/Season6Standings.tsx
import { Link } from "react-router-dom";

export default function Season6Standings() {
  return (
    <main className="w-full flex justify-center pt-10 pb-4 bg-[#050608]">
      <div className="w-full max-w-[880px] px-6">
        {/* === CENTERED BRACKET BUTTON === */}
        <div className="flex justify-center mb-6">
          <Link
            to="/tournament"
            className="px-8 py-2 rounded-full text-[0.8rem] font-semibold uppercase tracking-[0.18em]
            bg-linear-to-tr from-[#f5f5f5] via-[#c0c0c0] to-[#9ca3af] text-[#050608]
            shadow-[0_0_25px_rgba(148,163,184,0.85)] hover:brightness-110 transition"
          >
            VIEW BRACKET
          </Link>
        </div>

        {/* === TBA CARD (same shell as table) === */}
        <div className="w-full overflow-hidden rounded-3xl border border-white/10 bg-[#050608] shadow-[0_18px_50px_rgba(0,0,0,0.8)]">
          <div className="flex items-center justify-center h-40">
            <span className="text-xl font-semibold tracking-[0.2em] text-gray-300 uppercase opacity-80">
              TBA
            </span>
          </div>
        </div>
      </div>
    </main>
  );
}

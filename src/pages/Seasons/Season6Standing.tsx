import { Link } from "react-router-dom";

export default function Season6Standings() {
  return (
    <main className="w-full flex justify-center pt-24 pb-4 bg-[#050608]">
      <div className="w-full max-w-[880px] px-6">
        {/* TITLE + CTA BLOCK */}
        <header className="mb-8">
          {/* FIRST ROW */}
          <div className="flex items-center justify-between mb-3">
            <h1
              className="text-[clamp(2rem,3vw,2.4rem)] leading-tight font-semibold tracking-[0.18em]
              bg-linear-to-b from-white to-[#c2c2c2] text-transparent bg-clip-text
              drop-shadow-[0_3px_6px_rgba(255,255,255,0.35)]"
            >
              Season Ⅵ
            </h1>

            <Link
              to="/tournament"
              className="px-6 py-2 rounded-full text-[0.8rem] font-semibold uppercase tracking-[0.18em]
              bg-linear-to-tr from-[#f5f5f5] via-[#c0c0c0] to-[#9ca3af] text-[#050608]
              shadow-[0_0_25px_rgba(148,163,184,0.85)] hover:brightness-110
              transition whitespace-nowrap"
            >
              VIEW BRACKET
            </Link>
          </div>

          {/* SEASON PILLS */}
          <div className="flex flex-wrap items-center gap-2 text-[0.7rem] font-semibold uppercase tracking-[0.18em]">
            <Link to="/seasons/1" className="px-3 py-1 rounded-full bg-white/5 hover:bg-white/10 transition">
              Season Ⅰ
            </Link>
            <Link to="/seasons/2" className="px-3 py-1 rounded-full bg-white/5 hover:bg-white/10 transition">
              Season Ⅱ
            </Link>
            <Link to="/seasons/3" className="px-3 py-1 rounded-full bg-white/5 hover:bg-white/10 transition">
              Season Ⅲ
            </Link>
            <Link to="/seasons/4" className="px-3 py-1 rounded-full bg-white/5 hover:bg-white/10 transition">
              Season Ⅳ
            </Link>
            <Link to="/seasons/5" className="px-3 py-1 rounded-full bg-white/5 hover:bg-white/10 transition">
              Season Ⅴ
            </Link>

            {/* ACTIVE → Season VI */}
            <Link
              to="/seasons/6"
              className="inline-flex items-center px-4 py-1 rounded-full
              bg-linear-to-r from-[#f5f5f5] via-[#d4d4d8] to-[#9ca3af]
              text-[#050608] shadow-[0_0_16px_rgba(148,163,184,0.85)] transition"
            >
              Season Ⅵ
            </Link>
          </div>
        </header>

        {/* TBA TABLE */}
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

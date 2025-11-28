// src/pages/TeamDetail.tsx
import { Link, useParams, useNavigate } from "react-router-dom";
import { getTeamById } from "./data/teams";
import { Crown } from "lucide-react";
import { dbNick } from "../../Dotabuff";

export default function TeamDetail() {
  const { teamId } = useParams<{ teamId: string }>();
  const navigate = useNavigate();

  const team = teamId ? getTeamById(teamId) : undefined;

  if (!team) {
    return (
      <main className="w-full flex justify-center pt-24 pb-16 bg-[#050608]">
        <div className="w-full max-w-[880px] px-6">
          <h1 className="text-2xl font-semibold mb-4">Team not found</h1>
          <button
            onClick={() => navigate("/seasons/1")}
            className="px-4 py-2 rounded-full border border-slate-600/80 bg-black/40 text-xs uppercase tracking-[0.16em] text-slate-100 hover:bg-white/5 transition"
          >
            Back to Season 1 Standings
          </button>
        </div>
      </main>
    );
  }

  const captain = team.players[0];

  return (
    <main className="w-full flex justify-center pt-24 pb-4 bg-[#050608]">
      <div className="w-full max-w-[880px] px-6">
        {/* TOP HEADER */}
        <header className="flex flex-col gap-5 mb-8">
          <div className="flex items-center justify-between gap-4">
            <button
              onClick={() => navigate(-1)}
              className="px-4 py-2 rounded-full text-[0.8rem] font-semibold uppercase tracking-[0.18em]
              bg-white/10 hover:bg-white/20 text-slate-200 transition shadow-[0_0_12px_rgba(148,163,184,0.5)]"
            >
              ← Back
            </button>

            <Link
              to="/tournament"
              className="px-5 py-2 rounded-full text-[0.8rem] font-semibold uppercase tracking-[0.18em]
              bg-linear-to-tr from-[#f5f5f5] via-[#c0c0c0] to-[#9ca3af] text-[#050608]
              shadow-[0_0_25px_rgba(148,163,184,0.85)] hover:brightness-110 transition whitespace-nowrap"
            >
              VIEW BRACKET
            </Link>
          </div>
        </header>

        {/* ROSTER CARD */}
        <section className="w-full flex justify-center">
          <div className="w-full max-w-[720px] rounded-2xl border border-slate-600/60 bg-[radial-gradient(circle_at_top,rgba(20,184,166,0.08),transparent_55%),radial-gradient(circle_at_bottom,rgba(37,99,235,0.08),transparent_65%),#020617] shadow-[0_18px_50px_rgba(0,0,0,0.9)] overflow-hidden">
            {/* Colored header inside card */}
            <div
              className="w-full px-6 py-6 border-b border-black/20 flex items-center justify-center"
              style={{
                background: team.logoColor,
                boxShadow: `0 0 25px ${team.logoColor}80 inset`,
              }}
            >
              <div className="flex flex-col items-center gap-1">
                <span
                  className="
                    inline-block
                    bg-linear-to-r from-[#111827] via-[#020617] to-[#0b1120]
                    bg-clip-text text-transparent
                    text-[clamp(1.4rem,3vw,1.9rem)]
                    font-bold uppercase tracking-[0.32em]
                    text-center
                  "
                  style={{
                    textShadow: `
                      0 0 10px rgba(0,0,0,0.6),
                      0 0 28px rgba(0,0,0,0.9)
                    `,
                  }}
                >
                  {team.name}
                </span>

                {captain && (
                  <div className="flex items-center gap-2 text-[0.8rem] uppercase tracking-[0.18em] text-[#000000]">
                    <span className="font-medium"><u>{captain.nickname}</u></span>
                    <span className="relative group">
                      <Crown
                        className="w-4 h-4 cursor-default"
                        style={{
                          color: "#facc15",
                          filter: `
                            drop-shadow(0 0 4px rgba(0,0,0,0.9))
                            drop-shadow(0 0 7px ${team.logoColor})
                          `,
                        }}
                      />
                      <span
                        className="
                          absolute left-1/2 -translate-x-1/2 mt-1
                          px-2 py-0.5 rounded-md text-[0.68rem]
                          bg-black/85 text-white whitespace-nowrap
                          opacity-0 pointer-events-none
                          group-hover:opacity-100 group-hover:pointer-events-auto
                          transition-opacity duration-200
                        "
                      >
                        Captain
                      </span>
                    </span>
                  </div>
                )}
              </div>
            </div>

            {/* Header row */}
            <div className="grid grid-cols-[2.7fr_1.2fr_1fr_1fr] px-6 py-3 text-[0.75rem] uppercase tracking-[0.16em] text-slate-400 border-b border-slate-700/80">
              <span className="text-left">Player</span>
              <span className="text-center">Dotabuff</span>
              <span className="text-right">MMR</span>
              <span className="text-right">Gold</span>
            </div>

            {/* Players */}
            <div>
              {team.players.map((p) => (
                <div
                  key={p.id}
                  className="
                    grid grid-cols-[2.7fr_1.2fr_1fr_1fr]
                    items-center
                    px-6 py-2.5
                    text-sm
                    odd:bg-slate-900/90
                    even:bg-slate-900/70
                    hover:bg-white/5
                    transition-colors
                  "
                >
                  {/* Player + avatar */}
                  <div className="flex items-center gap-3">
                    <Link to={`/players/${p.id}`} className="shrink-0">
                      <div
                        className="
                          w-10 h-10 rounded-full
                          border border-slate-500/80
                          bg-[radial-gradient(circle_at_30%_0%,#111827,#020617)]
                          flex items-center justify-center
                          text-[0.85rem] font-semibold tracking-[0.12em] uppercase text-slate-100
                          shadow-[0_0_14px_rgba(15,23,42,0.9)]
                        "
                      >
                        {p.nickname[0]}
                      </div>
                    </Link>
                    <span className="text-[0.9rem] font-medium text-slate-50">
  {p.nickname}
</span>
                  </div>

                  {/* Dotabuff icon */}
                  <div className="flex items-center justify-center">
                    <a
                      href={dbNick(p.nickname)}
                      target="_blank"
                      rel="noreferrer"
                      className="inline-flex"
                    >
                      <img
                        src="/icons/dotabuff.png"
                        alt="Dotabuff"
                        className="
                          w-[26px] h-[26px] rounded-md
                          shadow-[0_0_12px_rgba(248,113,113,0.85),0_0_26px_rgba(220,38,38,0.45)]
                        "
                      />
                    </a>
                  </div>

                  {/* MMR */}
                  <div className="text-right text-slate-100 tabular-nums text-[0.86rem]">
                    {p.mmr}
                  </div>

                  {/* Gold */}
                  <div className="text-right text-slate-100 tabular-nums text-[0.86rem]">
                    {p.gold}
                  </div>
                </div>
              ))}
            </div>

            {/* Footer: Average MMR */}
            <div className="flex items-center justify-between px-6 py-3 border-t border-slate-600/70 text-[0.86rem] text-slate-200">
              <span>Average MMR</span>
              <span className="tabular-nums">{team.averageMMR}</span>
            </div>
          </div>
        </section>
      </div>
    </main>
  );
}

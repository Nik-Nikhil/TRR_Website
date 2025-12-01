// src/pages/Players/PlayerDetailPage.tsx
import { useParams, useNavigate } from "react-router-dom";
import { getPlayerById } from "../data/players";
import { FaSteam } from "react-icons/fa";

// Reuse the same metallic/glossy circle styles as PlayerSummaryCard
const seasonMedalStyles: Record<number, string> = {
  1: "bg-gradient-to-br from-cyan-300 to-sky-600 border-cyan-200 shadow-[0_0_18px_rgba(56,189,248,0.9)]",
  2: "bg-gradient-to-br from-emerald-300 to-emerald-700 border-emerald-200 shadow-[0_0_18px_rgba(16,185,129,0.9)]",
  3: "bg-gradient-to-br from-fuchsia-300 to-violet-700 border-fuchsia-200 shadow-[0_0_18px_rgba(168,85,247,0.9)]",
  4: "bg-gradient-to-br from-rose-300 to-rose-700 border-rose-200 shadow-[0_0_18px_rgba(244,63,94,0.9)]",
  5: "bg-gradient-to-br from-amber-300 to-amber-600 border-amber-200 shadow-[0_0_18px_rgba(245,158,11,0.9)]",
  6: "bg-gradient-to-br from-slate-300 to-slate-700 border-slate-200 shadow-[0_0_18px_rgba(148,163,184,0.9)]",
};

// same CupRank setup as PlayerSummaryCard
type CupRank = "gold" | "silver" | "bronze";

const cupCircleStyles: Record<CupRank, string> = {
  gold:
    "bg-gradient-to-br from-amber-200 via-amber-400 to-amber-700 border-amber-100 shadow-[0_0_20px_rgba(251,191,36,0.95)]",
  silver:
    "bg-gradient-to-br from-zinc-100 via-slate-300 to-slate-600 border-slate-100 shadow-[0_0_20px_rgba(148,163,184,0.95)]",
  bronze:
    "bg-gradient-to-br from-orange-200 via-amber-500 to-amber-800 border-amber-200 shadow-[0_0_20px_rgba(234,179,8,0.95)]",
};

const cupIcons: Record<CupRank, string> = {
  gold: "🏆",
  silver: "🥈",
  bronze: "🥉",
};

export default function PlayerDetailPage() {
  const { playerId } = useParams<{ playerId: string }>();
  const navigate = useNavigate();

  const player = playerId ? getPlayerById(playerId) : undefined;

  if (!player) {
    return (
      <main className="w-full min-h-screen flex justify-center pt-24 pb-16 bg-[#020617]">
        <div className="w-full max-w-[1400px] px-6">
          <h1 className="text-2xl font-semibold mb-4 text-slate-100">
            Player not found
          </h1>
          <button
            onClick={() => navigate("/players")}
            className="px-4 py-2 rounded-full border border-slate-600/80 bg-black/40 text-xs uppercase tracking-[0.16em] text-slate-100 hover:bg-white/5 transition"
          >
            Back to Players
          </button>
        </div>
      </main>
    );
  }

  // Trophy effective rank (gold/silver/bronze) if they have won a cup
  const effectiveCupRank: CupRank | undefined = player.hasWonCup
    ? player.cupRank ?? "gold"
    : undefined;

  return (
    <main className="w-full min-h-screen flex justify-center pt-24 pb-16 bg-[#020617]">
      <div className="w-full max-w-[1400px] px-6">
        {/* Back button */}
        <button
          onClick={() => navigate(-1)}
          className="mb-6 px-6 py-2 rounded-full text-[0.8rem] font-semibold uppercase tracking-[0.18em]
                     bg-white/10 hover:bg-white/20 text-slate-200 transition shadow-[0_0_12px_rgba(148,163,184,0.5)]"
        >
          ← Back
        </button>

        {/* SINGLE big card */}
        <section className="w-full flex justify-center">
          <div
            className="w-full rounded-3xl border border-slate-700/70
                       bg-[radial-gradient(circle_at_top,rgba(56,189,248,0.12),transparent_55%),radial-gradient(circle_at_bottom,rgba(236,72,153,0.14),transparent_65%),#020617]
                       shadow-[0_28px_80px_rgba(0,0,0,0.9)] p-6"
          >
            {/* main layout */}
            <div className="flex flex-row gap-8 items-start">
              {/* Avatar + links LEFT */}
              <div className="shrink-0 flex flex-col items-center gap-3">
                <div className="relative w-28 h-28 rounded-2xl overflow-hidden border border-slate-600/70 bg-black/60 shadow-[0_0_30px_rgba(148,163,184,0.7)]">
                  {player.avatarUrl ? (
                    <img
                      src={player.avatarUrl}
                      alt={player.nickname}
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center text-2xl font-bold text-slate-200 bg-slate-800/60">
                      {player.nickname[0]?.toUpperCase()}
                    </div>
                  )}
                </div>

                {/* Dotabuff + Steam under PFP (icon-only with hover tooltip) */}
                <div className="flex gap-3">
                  {player.dotabuffUrl && (
                    <a
                      href={player.dotabuffUrl}
                      target="_blank"
                      rel="noreferrer"
                      className="group relative flex items-center justify-center w-10 h-10 rounded-full
                                 bg-[#1a0507] border border-red-500/70 shadow-[0_0_18px_rgba(248,113,113,0.55)]
                                 hover:shadow-[0_0_30px_rgba(248,113,113,0.85)] hover:border-red-400
                                 transition-transform duration-200 hover:-translate-y-0.5"
                    >
                      {/* Icon (D) */}
                      <span className="w-6 h-6 flex items-center justify-center rounded-full bg-red-600 text-[0.75rem] font-bold text-white">
                        D
                      </span>
                      {/* Tooltip */}
                      <span
                        className="pointer-events-none absolute -bottom-6 left-1/2 -translate-x-1/2
                                   px-2 py-0.5 rounded-full bg-black/80 border border-red-500/50
                                   text-[0.65rem] uppercase tracking-[0.18em] text-red-200
                                   opacity-0 group-hover:opacity-100 transition-opacity"
                      >
                        Dotabuff
                      </span>
                    </a>
                  )}

                  {player.steamUrl && (
                    <a
                      href={player.steamUrl}
                      target="_blank"
                      rel="noreferrer"
                      className="group relative flex items-center justify-center w-10 h-10 rounded-full
                                 bg-[#020617] border border-sky-500/70 shadow-[0_0_18px_rgba(56,189,248,0.5)]
                                 hover:shadow-[0_0_30px_rgba(56,189,248,0.9)] hover:border-sky-300
                                 transition-transform duration-200 hover:-translate-y-0.5"
                    >
                      {/* Steam icon */}
                      <FaSteam className="w-5 h-5 text-sky-300" />
                      {/* Tooltip */}
                      <span
                        className="pointer-events-none absolute -bottom-6 left-1/2 -translate-x-1/2
                                   px-2 py-0.5 rounded-full bg-black/80 border border-sky-500/50
                                   text-[0.65rem] uppercase tracking-[0.18em] text-sky-200
                                   opacity-0 group-hover:opacity-100 transition-opacity"
                      >
                        Steam
                      </span>
                    </a>
                  )}
                </div>
              </div>

              {/* RIGHT side: info + heroes + stats */}
              <div className="flex-1 flex flex-col gap-4">
                {/* TOP ROW: left info + right heroes */}
                <div className="flex flex-row gap-6 items-start">
                  {/* LEFT TOP: name / roles / bio */}
                  <div className="basis-[45%] flex flex-col gap-3 min-w-0">
                    {/* Name */}
                    <div>
                      <div className="text-xs uppercase tracking-[0.25em] text-slate-400 mb-1">
                        Player
                      </div>
                      <div className="flex flex-wrap items-center gap-3">
                        <h1 className="text-3xl font-semibold text-slate-50">
                          {player.nickname}
                        </h1>
                        {player.realName && (
                          <span className="text-sm text-slate-400">
                            ({player.realName})
                          </span>
                        )}
                      </div>
                    </div>

                    {/* Roles */}
                    {player.roles.length > 0 && (
                      <div>
                        <div className="text-[0.65rem] uppercase tracking-[0.22em] text-slate-500 mb-1">
                          Roles
                        </div>
                        <div className="flex flex-wrap gap-2">
                          {player.roles.map((role) => (
                            <div
                              key={role.label}
                              className="flex items-center gap-2 px-3 py-1.5 rounded-full
                                         bg-slate-900/70 border border-slate-600/70
                                         shadow-[0_0_10px_rgba(15,23,42,0.9)]"
                            >
                              {role.iconSrc && (
                                <img
                                  src={role.iconSrc}
                                  alt={role.label}
                                  className="w-4 h-4 object-contain"
                                />
                              )}
                              <span className="text-xs font-medium text-slate-100">
                                {role.label}
                              </span>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}

                    {/* Bio */}
                    <div>
                      <div className="text-[0.65rem] uppercase tracking-[0.22em] text-slate-500 mb-1">
                        Bio
                      </div>
                      <p className="text-sm text-slate-200/90 leading-relaxed">
                        {player.bio}
                      </p>
                    </div>
                  </div>

                  {/* RIGHT TOP: Signature heroes in ONE ROW, WIDER */}
                  {player.favoriteHeroes && player.favoriteHeroes.length > 0 && (
                    <div className="basis-[55%] flex flex-col gap-3 w-full min-w-0">
                      <div className="text-[0.65rem] uppercase tracking-[0.22em] text-slate-500">
                        Signature Heroes
                      </div>
                      <div className="grid grid-cols-3 gap-4 auto-rows-[180px]">
                        {player.favoriteHeroes.slice(0, 3).map((hero) => (
                          <div
                            key={hero.name}
                            className="relative group rounded-2xl overflow-hidden border border-slate-600/70 bg-black/60 shadow-[0_0_18px_rgba(15,23,42,0.8)]"
                            title={hero.name}
                          >
                            {hero.videoSrc.endsWith(".webm") ? (
                              <video
                                src={hero.videoSrc}
                                autoPlay
                                loop
                                muted
                                playsInline
                                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                              />
                            ) : (
                              <img
                                src={hero.videoSrc}
                                alt={hero.name}
                                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                              />
                            )}
                            <div className="absolute inset-x-0 bottom-0 bg-black/70 px-2 py-1">
                              <p className="text-[0.7rem] text-center text-slate-100 truncate">
                                {hero.name}
                              </p>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>

                {/* BOTTOM BLOCK: 2x2 grid – Current Rank, Peak Rank, Seasons, Trophy Cabinet */}
                <div className="mt-2 grid gap-3 sm:grid-cols-2">
                  {/* Current Rank */}
                  <div className="rounded-xl border border-slate-700 bg-black/40 px-4 py-3 flex items-center">
                    {player.currentMedalId ? (
                      <>
                        <img
                          src={`/medals/${player.currentMedalId}.png`}
                          alt={player.currentMedalLabel}
                          className="w-10 h-10 object-contain mr-3"
                        />
                        <div>
                          <div className="text-[0.6rem] uppercase tracking-[0.22em] text-slate-400">
                            Current Rank
                          </div>
                          <div className="text-sm font-semibold text-slate-100">
                            {player.currentMedalLabel}
                          </div>
                        </div>
                      </>
                    ) : (
                      <div>
                        <div className="text-[0.6rem] uppercase tracking-[0.22em] text-slate-400">
                          Current Rank
                        </div>
                        <div className="text-sm text-slate-400">Unranked</div>
                      </div>
                    )}
                  </div>

                  {/* Peak Rank */}
                  <div className="rounded-xl border border-slate-700 bg-black/40 px-4 py-3 flex items-center">
                    {player.peakMedalId ? (
                      <>
                        <img
                          src={`/medals/${player.peakMedalId}.png`}
                          alt={player.peakMedalLabel}
                          className="w-10 h-10 object-contain mr-3"
                        />
                        <div>
                          <div className="text-[0.6rem] uppercase tracking-[0.22em] text-slate-400">
                            Peak Rank
                          </div>
                          <div className="text-sm font-semibold text-slate-100">
                            {player.peakMedalLabel}
                          </div>
                        </div>
                      </>
                    ) : (
                      <div>
                        <div className="text-[0.6rem] uppercase tracking-[0.22em] text-slate-400">
                          Peak Rank
                        </div>
                        <div className="text-sm text-slate-400">—</div>
                      </div>
                    )}
                  </div>

                  {/* Seasons (bottom-left) */}
                  <div className="rounded-xl border border-slate-700 bg-black/40 px-4 py-3">
                    <div className="text-[0.65rem] uppercase tracking-[0.22em] text-slate-500 mb-1">
                      Seasons
                    </div>
                    {player.seasonBadges.length > 0 ? (
                      <div className="mt-2 flex flex-wrap gap-2">
                        {player.seasonBadges.slice(0, 6).map((s) => (
                          <div key={s} className="relative group">
                            <div
                              className={`relative flex items-center justify-center w-7 h-7 rounded-full border ${
                                seasonMedalStyles[s] ??
                                "bg-linear-to-br from-slate-400 to-slate-700 border-slate-200 shadow-[0_0_18px_rgba(148,163,184,0.9)]"
                              } after:content-[''] after:absolute after:inset-0 after:bg-[radial-gradient(circle_at_25%_25%,rgba(255,255,255,0.45),rgba(255,255,255,0)_55%)] after:pointer-events-none`}
                            >
                              <span className="text-[0.6rem] font-bold tracking-tight text-white drop-shadow-[0_1px_2px_rgba(0,0,0,0.7)]">
                                S{s}
                              </span>
                            </div>
                            <div className="pointer-events-none absolute -bottom-5 left-1/2 -translate-x-1/2 rounded-full bg-slate-900/95 px-2.5 py-0.5 text-[0.55rem] font-semibold tracking-[0.12em] uppercase text-slate-100 opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap">
                              Season {s}
                            </div>
                          </div>
                        ))}
                      </div>
                    ) : (
                      <div className="text-sm text-slate-400 mt-1">
                        No seasons recorded yet.
                      </div>
                    )}
                  </div>

                  {/* Trophy Cabinet (bottom-right) */}
                  <div className="rounded-xl border border-slate-700 bg-black/40 px-4 py-3">
                    <div className="text-[0.65rem] uppercase tracking-[0.22em] text-slate-500 mb-1">
                      Trophy Cabinet
                    </div>

                    {effectiveCupRank ? (
                      <div className="mt-2 flex items-center gap-3">
                        <div
                          className={`flex items-center justify-center w-9 h-9 rounded-full border text-[1.2rem] ${
                            cupCircleStyles[effectiveCupRank]
                          }`}
                        >
                          {cupIcons[effectiveCupRank]}
                        </div>
                        <div className="flex flex-col">
                          <span className="text-xs font-semibold text-slate-100 uppercase tracking-[0.14em]">
                            {player.cupTooltip ?? "TRR Cup Winner"}
                          </span>
                          {player.cupSeason && (
                            <span className="text-[0.7rem] text-slate-400 mt-0.5">
                              Season {player.cupSeason}
                            </span>
                          )}
                        </div>
                      </div>
                    ) : (
                      <div className="mt-2 text-sm text-slate-400">
                        No major trophies yet.
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>
      </div>
    </main>
  );
}

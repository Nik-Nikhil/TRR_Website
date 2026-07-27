// src/pages/TeamDeatail.tsx
import { useParams, useNavigate, Link } from "react-router-dom";
import { motion } from "framer-motion";
import { Crown, TrendingUp, Coins } from "lucide-react";
import { getTeamById } from "../data/teams";
import { dbNick } from "../data/dotabuffsteam";

const GOLD_COLOR = "#f5c542";

export default function TeamDetail() {
  const { teamId } = useParams<{ teamId: string }>();
  const navigate = useNavigate();
  const team = teamId ? getTeamById(teamId) : undefined;

  if (!team) {
    return (
      <div className="min-h-screen flex items-center justify-center" style={{ background: "#050608" }}>
        <div className="text-center">
          <p className="text-slate-500 text-sm mb-4">Team not found</p>
          <button onClick={() => navigate(-1)}
            className="px-3 sm:px-4 py-1.5 sm:py-2 rounded-full text-[0.65rem] sm:text-[0.72rem] font-semibold uppercase tracking-[0.12em] bg-gradient-to-tr from-white/90 via-zinc-200 to-zinc-300 text-[#050608] shadow-[0_8px_26px_rgba(2,6,23,0.55)] hover:brightness-105 transition-all duration-200 backdrop-blur-sm border border-white/10 cursor-pointer"
            type="button">Go Back</button>
        </div>
      </div>
    );
  }

  const captain = team.players[0];
  const totalGold = team.players.reduce((s, p) => s + p.gold, 0);

  return (
    <div className="relative min-h-screen overflow-hidden">
      {/* Background */}
      <div className="fixed inset-0 z-0">
        <div className="absolute inset-0 bg-cover bg-center bg-no-repeat"
          style={{ backgroundImage: "url(/bg_qop.jpg)" }} />
        <div className="absolute inset-0"
          style={{ background: "linear-gradient(135deg,rgba(4,6,10,0.88) 0%,rgba(4,8,14,0.80) 50%,rgba(4,6,10,0.88) 100%)" }} />
      </div>

      {/* Content */}
      <div className="relative z-10 min-h-screen flex flex-col items-center justify-center px-4 py-24">

        {/* Back */}
        <div className="w-full max-w-[560px] mb-3">
          <button onClick={() => navigate(-1)}
            className="px-3 sm:px-4 py-1.5 sm:py-2 rounded-full text-[0.65rem] sm:text-[0.72rem] font-semibold uppercase tracking-[0.12em] bg-gradient-to-tr from-white/90 via-zinc-200 to-zinc-300 text-[#050608] shadow-[0_8px_26px_rgba(2,6,23,0.55)] hover:brightness-105 transition-all duration-200 backdrop-blur-sm border border-white/10 cursor-pointer"
            type="button">← Back</button>
        </div>

        {/* Card */}
        <motion.div
          initial={{ opacity: 0, y: 14 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.35, ease: "easeOut" }}
          className="w-full max-w-[560px] rounded-xl overflow-hidden"
          style={{
            border: `1px solid ${team.logoColor}40`,
            background: "rgba(7,9,15,0.92)",
            boxShadow: `0 0 50px ${team.logoColor}14, 0 20px 50px rgba(0,0,0,0.9)`,
            backdropFilter: "blur(20px)",
          }}
        >
          {/* Header */}
          <div className="relative flex flex-col items-center gap-2 px-6 py-5 overflow-hidden"
            style={{
              background: `linear-gradient(160deg,${team.logoColor}22 0%,${team.logoColor}08 60%,transparent 100%)`,
              borderBottom: `1px solid ${team.logoColor}20`,
            }}>
            <div className="absolute inset-0 pointer-events-none"
              style={{ background: `radial-gradient(ellipse 70% 55% at 50% 0%,${team.logoColor}16 0%,transparent 70%)` }} />

            {/* Orb */}
            <div className="relative z-10 w-9 h-9 rounded-full flex items-center justify-center"
              style={{
                background: `radial-gradient(circle,${team.logoColor}44 0%,${team.logoColor}18 100%)`,
                border: `1.5px solid ${team.logoColor}66`,
                boxShadow: `0 0 18px ${team.logoColor}44`,
              }}>
              <span className="text-sm font-black uppercase" style={{ color: team.logoColor }}>
                {team.shortName?.[0] ?? team.name[0]}
              </span>
            </div>

            {/* Name */}
            <h1 className="relative z-10 text-[clamp(0.95rem,3vw,1.15rem)] font-black uppercase tracking-[0.26em] text-center leading-tight"
              style={{ color: "#f0ede6", textShadow: `0 0 16px ${team.logoColor}44` }}>
              {team.name}
            </h1>

            {/* Inline badges */}
            <div className="relative z-10 flex items-center gap-2 flex-wrap justify-center">
              {captain && (
                <div className="flex items-center gap-1 px-2 py-0.5 rounded-full text-[0.6rem] uppercase tracking-[0.1em]"
                  style={{ background: "rgba(0,0,0,0.45)", border: `1px solid ${team.logoColor}30` }}>
                  <Crown className="w-2.5 h-2.5 shrink-0" style={{ color: GOLD_COLOR }} />
                  <span style={{ color: GOLD_COLOR }}>{captain.nickname}</span>
                  <span className="text-slate-600">· Captain</span>
                </div>
              )}
              <div className="flex items-center gap-1 px-2 py-0.5 rounded-full text-[0.6rem] uppercase tracking-[0.1em]"
                style={{ background: "rgba(0,0,0,0.45)", border: "1px solid rgba(56,189,248,0.22)" }}>
                <TrendingUp className="w-2.5 h-2.5 text-sky-400" />
                <span className="text-sky-400">{team.averageMMR.toLocaleString()}</span>
                <span className="text-slate-600">avg mmr</span>
              </div>
              <div className="flex items-center gap-1 px-2 py-0.5 rounded-full text-[0.6rem] uppercase tracking-[0.1em]"
                style={{ background: "rgba(0,0,0,0.45)", border: `1px solid ${GOLD_COLOR}22` }}>
                <Coins className="w-2.5 h-2.5" style={{ color: `${GOLD_COLOR}bb` }} />
                <span style={{ color: GOLD_COLOR }}>{totalGold}</span>
                <span className="text-slate-600">gold</span>
              </div>
            </div>
          </div>

          {/* Table header */}
          <div className="grid grid-cols-[1fr_44px_68px_56px] px-4 py-2 text-[0.58rem] uppercase tracking-[0.16em]"
            style={{ color: "#3d4d60", borderBottom: "1px solid rgba(255,255,255,0.05)" }}>
            <span>Player</span>
            <span className="text-center">DB</span>
            <span className="text-right">MMR</span>
            <span className="text-right">Gold</span>
          </div>

          {/* Rows */}
          <div>
            {team.players.map((p, idx) => {
              const isCaptain = idx === 0;
              const dbUrl = dbNick(p.nickname);
              return (
                <motion.div
                  key={p.id}
                  initial={{ opacity: 0, x: -5 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: idx * 0.04, duration: 0.25 }}
                  className="grid grid-cols-[1fr_44px_68px_56px] items-center px-4 py-2 hover:bg-white/[0.022] transition-colors"
                  style={{
                    borderBottom: "1px solid rgba(255,255,255,0.035)",
                    background: isCaptain ? `linear-gradient(90deg,${team.logoColor}0e 0%,transparent 70%)` : undefined,
                  }}
                >
                  {/* Avatar + name — full cell is clickable */}
                  <Link to={`/players/${p.id}`} className="flex items-center gap-2 min-w-0 group/player">
                    <div className="w-6 h-6 rounded-full flex items-center justify-center text-[0.65rem] font-bold uppercase shrink-0 group-hover/player:brightness-125 transition-all"
                      style={{
                        background: isCaptain ? `linear-gradient(135deg,${team.logoColor}50,${team.logoColor}1a)` : "rgba(255,255,255,0.07)",
                        border: isCaptain ? `1.5px solid ${team.logoColor}70` : "1px solid rgba(255,255,255,0.1)",
                        color: isCaptain ? team.logoColor : "#56606e",
                        boxShadow: isCaptain ? `0 0 8px ${team.logoColor}35` : "none",
                      }}>
                      {p.nickname[0]}
                    </div>
                    <div className="min-w-0">
                      <p className="text-[0.78rem] font-medium truncate leading-none group-hover/player:text-white transition-colors"
                        style={{ color: isCaptain ? "#f0ede6" : "#b0aca6" }}>
                        {p.nickname}
                      </p>
                      {isCaptain && (
                        <p className="text-[0.55rem] uppercase tracking-[0.12em] mt-0.5"
                          style={{ color: `${team.logoColor}aa` }}>Captain</p>
                      )}
                    </div>
                  </Link>

                  {/* Dotabuff */}
                  <div className="flex items-center justify-center">
                    {dbUrl !== "#" ? (
                      <a href={dbUrl} target="_blank" rel="noreferrer"
                        className="inline-flex items-center justify-center w-6 h-6 rounded hover:scale-110 transition-transform"
                        style={{ background: "rgba(200,40,40,0.18)", border: "1px solid rgba(220,38,38,0.28)" }}>
                        <img src="/icons/dotabuff.png" alt="DB" className="w-3.5 h-3.5" />
                      </a>
                    ) : (
                      <span className="text-slate-700 text-xs">—</span>
                    )}
                  </div>

                  {/* MMR */}
                  <div className="text-right tabular-nums text-[0.76rem]"
                    style={{ color: isCaptain ? "#dde3ed" : "#6b7785" }}>
                    {p.mmr.toLocaleString()}
                  </div>

                  {/* Gold */}
                  <div className="text-right tabular-nums text-[0.76rem] font-semibold">
                    {p.gold > 0 ? (
                      <span style={{ color: GOLD_COLOR }}>🪙 {p.gold}</span>
                    ) : (
                      <span style={{ color: "#2e3740" }}>0</span>
                    )}
                  </div>
                </motion.div>
              );
            })}
          </div>

          {/* Footer */}
          <div className="grid grid-cols-[1fr_44px_68px_56px] items-center px-4 py-2"
            style={{ borderTop: "1px solid rgba(255,255,255,0.07)", background: "rgba(0,0,0,0.25)" }}>
            <span className="text-[0.58rem] uppercase tracking-[0.16em] text-slate-600">Average MMR</span>
            <span /><span className="text-right tabular-nums text-[0.8rem] font-black" style={{ color: "#38bdf8" }}>
              {team.averageMMR.toLocaleString()}
            </span>
            <span />
          </div>
        </motion.div>
      </div>
    </div>
  );
}

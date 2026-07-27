// src/pages/Players/PlayerSummaryCard.tsx
import { useState } from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";

interface PlayerSummaryCardProps {
  id: string;
  nickname: string;
  avatarUrl: string;
  seasonBadges: string[] | number[];
  hasWonCup: boolean;
  cupSeason?: number;
  cupRank?: "gold" | "silver" | "bronze";
  cupTooltip?: string;
  roles: { iconSrc?: string; label: string }[];
  currentMedalId?: string;
  currentMedalLabel?: string;
  currentMMR?: number;
}

function getInitials(name: string): string {
  if (!name) return "??";
  const words = name.trim().split(" ");
  if (words.length >= 2) return (words[0][0] + words[1][0]).toUpperCase();
  return name.slice(0, 2).toUpperCase();
}

function getColorFromName(name: string): string {
  const colors = [
    "from-blue-500 to-indigo-600",
    "from-purple-500 to-violet-600",
    "from-pink-500 to-rose-600",
    "from-red-500 to-orange-600",
    "from-amber-500 to-yellow-600",
    "from-green-500 to-emerald-600",
    "from-teal-500 to-cyan-600",
    "from-sky-500 to-blue-600",
    "from-indigo-500 to-purple-600",
    "from-fuchsia-500 to-pink-600",
  ];
  let hash = 0;
  for (let i = 0; i < name.length; i++) {
    hash = name.charCodeAt(i) + ((hash << 5) - hash);
  }
  return colors[Math.abs(hash) % colors.length];
}

const cupColors: Record<string, { color: string; icon: string }> = {
  gold:   { color: "#facc15", icon: "🏆" },
  silver: { color: "#cbd5e1", icon: "🥈" },
  bronze: { color: "#fb923c", icon: "🥉" },
};

// Diagonal corner cut clip-path (top-left & bottom-right)
const CLIP = "polygon(14px 0%, 100% 0%, 100% calc(100% - 14px), calc(100% - 14px) 100%, 0% 100%, 0% 14px)";

export default function PlayerSummaryCard({
  id,
  nickname,
  avatarUrl,
  hasWonCup,
  cupRank,
  roles,
  currentMedalId,
  currentMMR,
}: PlayerSummaryCardProps) {
  const [imageError, setImageError] = useState(false);
  const showFallback = !avatarUrl || imageError;
  const cup = hasWonCup && cupRank ? cupColors[cupRank] : null;
  const displayRoles = (roles || []).filter((r) => r && r.label).slice(0, 2);

  return (
    <Link to={`/players/${id}`} className="group block w-full">
      <motion.div
        whileHover={{ y: -5, scale: 1.03 }}
        whileTap={{ scale: 0.97 }}
        transition={{ duration: 0.18, ease: "easeOut" }}
        className="relative flex flex-col items-center cursor-pointer"
        style={{ clipPath: CLIP }}
      >
        {/* ── Border layer (sits behind everything) ── */}
        <div
          className="absolute inset-0 z-0"
          style={{
            clipPath: CLIP,
            background: "linear-gradient(135deg, rgba(126,200,245,0.45) 0%, rgba(90,180,232,0.12) 50%, rgba(126,200,245,0.3) 100%)",
          }}
        />

        {/* ── Card body ── */}
        <div
          className="relative z-10 w-full flex flex-col items-center overflow-hidden"
          style={{
            clipPath: CLIP,
            background: "linear-gradient(160deg, rgba(6,14,28,0.96) 0%, rgba(4,10,22,0.98) 100%)",
            margin: "1px",
          }}
        >
          {/* Top accent bar */}
          <div
            className="absolute top-0 left-0 right-0 h-[2px] z-20"
            style={{ background: "linear-gradient(90deg, transparent, rgba(126,200,245,0.8), transparent)" }}
          />

          {/* Cup badge */}
          {cup && (
            <div
              className="absolute top-2 right-2 z-30 w-5 h-5 rounded-full flex items-center justify-center text-xs"
              style={{
                background: "rgba(0,0,0,0.7)",
                border: `1px solid ${cup.color}`,
                boxShadow: `0 0 8px ${cup.color}55`,
              }}
              title={`${cupRank} cup winner`}
            >
              {cup.icon}
            </div>
          )}

          {/* Avatar */}
          <div className="w-full relative" style={{ paddingTop: "105%" }}>
            <div className="absolute inset-0">
              {showFallback ? (
                <div className={`w-full h-full bg-gradient-to-br ${getColorFromName(nickname)} flex items-center justify-center`}>
                  <span className="font-black text-white text-3xl drop-shadow-lg">{getInitials(nickname)}</span>
                </div>
              ) : (
                <>
                  <img
                    src={avatarUrl}
                    alt={nickname}
                    className="w-full h-full object-cover object-top group-hover:scale-105 transition-transform duration-500"
                    loading="lazy"
                    onError={() => setImageError(true)}
                  />
                  {/* Bottom fade */}
                  <div className="absolute inset-x-0 bottom-0 h-2/5"
                    style={{ background: "linear-gradient(to top, rgba(4,10,22,1) 0%, rgba(4,10,22,0.5) 60%, transparent 100%)" }} />
                </>
              )}
            </div>
          </div>

          {/* Info bar */}
          <div className="w-full px-2.5 pt-1.5 pb-2.5 flex flex-col gap-1">
            {/* Nickname */}
            <h3
              className="text-[13px] font-bold text-center truncate w-full leading-tight tracking-wide"
              style={{ color: "#c0e8ff" }}
            >
              {nickname}
            </h3>

            {/* Roles + MMR */}
            <div className="flex items-center justify-between w-full px-0.5">
              <div className="flex items-center gap-1">
                {displayRoles.map((role, i) =>
                  role.iconSrc ? (
                    <img key={i} src={role.iconSrc} alt={role.label} title={role.label}
                      className="w-3.5 h-3.5 object-contain opacity-70 group-hover:opacity-100 transition-opacity" />
                  ) : (
                    <span key={i} className="text-[8px] font-bold tracking-wider" style={{ color: "rgba(126,200,245,0.6)" }}>
                      {role.label.slice(0, 3).toUpperCase()}
                    </span>
                  )
                )}
              </div>
              <div className="flex items-center gap-1">
                {currentMedalId && (
                  <img src={`/medals/${currentMedalId}.png`} alt="medal"
                    className="w-4 h-4 object-contain"
                    onError={(e) => { (e.target as HTMLImageElement).style.display = "none"; }} />
                )}
                {currentMMR && (
                  <span className="text-[10px] font-bold" style={{ color: "rgba(126,200,245,0.75)" }}>
                    {currentMMR >= 1000 ? `${(currentMMR / 1000).toFixed(1)}k` : currentMMR}
                  </span>
                )}
              </div>
            </div>
          </div>

          {/* Hover inner glow */}
          <div
            className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none"
            style={{ background: "radial-gradient(ellipse at 50% 30%, rgba(126,200,245,0.06) 0%, transparent 70%)" }}
          />
        </div>

        {/* Corner cut accent dots */}
        <div className="absolute top-0 left-0 z-30 w-[14px] h-[14px] pointer-events-none"
          style={{ borderTop: "2px solid rgba(126,200,245,0.7)", borderLeft: "2px solid rgba(126,200,245,0.7)" }} />
        <div className="absolute bottom-0 right-0 z-30 w-[14px] h-[14px] pointer-events-none"
          style={{ borderBottom: "2px solid rgba(126,200,245,0.7)", borderRight: "2px solid rgba(126,200,245,0.7)" }} />
      </motion.div>
    </Link>
  );
}

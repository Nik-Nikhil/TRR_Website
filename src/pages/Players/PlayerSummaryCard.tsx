// src/components/PlayerSummaryCard.tsx
import { Link } from "react-router-dom";

type CupRank = "gold" | "silver" | "bronze";

interface PlayerRole {
  iconSrc: string;
  label: string;
}

interface PlayerSummaryCardProps {
  id: string;
  nickname: string;
  avatarUrl: string;
  seasonBadges: number[];
  hasWonCup: boolean;
  cupSeason?: number;
  cupRank?: CupRank;
  cupTooltip?: string;
  roles: PlayerRole[];
}

// Metallic + glossy circle styles per season
const seasonMedalStyles: Record<number, string> = {
  1: "bg-gradient-to-br from-cyan-300 to-sky-600 border-cyan-200 shadow-[0_0_18px_rgba(56,189,248,0.9)]",
  2: "bg-gradient-to-br from-emerald-300 to-emerald-700 border-emerald-200 shadow-[0_0_18px_rgba(16,185,129,0.9)]",
  3: "bg-gradient-to-br from-fuchsia-300 to-violet-700 border-fuchsia-200 shadow-[0_0_18px_rgba(168,85,247,0.9)]",
  4: "bg-gradient-to-br from-rose-300 to-rose-700 border-rose-200 shadow-[0_0_18px_rgba(244,63,94,0.9)]",
  5: "bg-gradient-to-br from-amber-300 to-amber-600 border-amber-200 shadow-[0_0_18px_rgba(245,158,11,0.9)]",
  6: "bg-gradient-to-br from-slate-300 to-slate-700 border-slate-200 shadow-[0_0_18px_rgba(148,163,184,0.9)]",
};

const roleCircleStyles: string[] = [
  "bg-gradient-to-br from-cyan-300 to-sky-700 border-cyan-200 shadow-[0_0_16px_rgba(56,189,248,0.9)]",
  "bg-gradient-to-br from-emerald-300 to-emerald-700 border-emerald-200 shadow-[0_0_16px_rgba(16,185,129,0.9)]",
  "bg-gradient-to-br from-violet-300 to-fuchsia-700 border-violet-200 shadow-[0_0_16px_rgba(167,139,250,0.9)]",
];

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

export default function PlayerSummaryCard({
  id,
  nickname,
  avatarUrl,
  seasonBadges,
  hasWonCup,
  cupRank,
  cupTooltip,
  roles,
}: PlayerSummaryCardProps) {
  const effectiveRank: CupRank | undefined = hasWonCup
    ? cupRank ?? "gold"
    : undefined;

  const nameLength = nickname.length;
  const nameSizeClass =
    nameLength > 24
      ? "text-[0.65rem]"
      : nameLength > 18
      ? "text-[0.72rem]"
      : "text-[0.8rem]";

  const topRoles = roles.slice(0, 3);

  return (
    <Link
      to={`/players/${id}`}
      className="group block w-full max-w-[300px] rounded-3xl border border-slate-700/70 shadow-[0_14px_35px_rgba(0,0,0,0.9)] overflow-hidden hover:border-slate-300/70 transition-colors bg-transparent"
    >
      {/* Avatar — shorter height */}
      <div className="relative w-full aspect-[4/2.9] overflow-hidden">

        <img
          src={avatarUrl}
          alt={nickname}
          className="absolute inset-0 w-full h-full object-cover"
          loading="lazy"
        />
        <div className="absolute inset-0 bg-linear-to-t from-black/85 via-black/45 to-black/10" />
      </div>

      {/* UI overlay content */}
      <div className="flex flex-col justify-end px-3 pb-1.5 pt-2 space-y-0.5">
        {/* Roles */}
        {topRoles.length > 0 && (
          <div className="flex justify-center mb-1 gap-1.5">
            {topRoles.map((role, idx) => (
              <div key={`${role.label}-${idx}`} className="relative group/role">
                <div
                  className={`relative flex items-center justify-center w-7 h-7 rounded-full border ${
                    roleCircleStyles[idx] ?? roleCircleStyles[0]
                  } after:content-[''] after:absolute after:inset-0 after:bg-[radial-gradient(circle_at_25%_25%,rgba(255,255,255,0.45),rgba(255,255,255,0)_55%)] after:pointer-events-none`}
                >
                  <img
                    src={role.iconSrc}
                    alt={role.label}
                    className="w-4 h-4 object-contain drop-shadow-[0_1px_2px_rgba(0,0,0,0.7)]"
                  />
                </div>

                <div className="pointer-events-none absolute -bottom-5 left-1/2 -translate-x-1/2 rounded-full bg-slate-900/95 px-2.5 py-0.5 text-[0.55rem] font-semibold tracking-[0.12em] uppercase text-slate-100 opacity-0 group-hover/role:opacity-100 transition-opacity whitespace-nowrap">
                  {role.label}
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Name */}
        <div className="flex items-center gap-2">
          <span className="text-[0.5rem] font-semibold uppercase tracking-[0.12em] text-slate-300/80">
            Name
          </span>
          <span
            className={`${nameSizeClass} font-semibold text-slate-50 truncate whitespace-nowrap drop-shadow-[0_1px_3px_rgba(0,0,0,0.9)]`}
          >
            {nickname}
          </span>
        </div>

        {/* Played (season medals) */}
        <div className="flex items-center gap-2">
          <span className="text-[0.5rem] font-semibold uppercase tracking-[0.12em] text-slate-300/80">
            Played
          </span>
          <div className="flex items-center gap-1.5">
            {seasonBadges.slice(0, 6).map((s) => (
              <div key={s} className="relative group/season">
                <div
                  className={`relative flex items-center justify-center w-6 h-6 rounded-full border ${
                    seasonMedalStyles[s]
                  } after:content-[''] after:absolute after:inset-0 after:bg-[radial-gradient(circle_at_25%_25%,rgba(255,255,255,0.45),rgba(255,255,255,0)_55%)] after:pointer-events-none`}
                >
                  <span className="text-[0.55rem] font-bold tracking-tight text-white drop-shadow-[0_1px_2px_rgba(0,0,0,0.7)]">
                    S{s}
                  </span>
                </div>
                <div className="pointer-events-none absolute -bottom-5 left-1/2 -translate-x-1/2 rounded-full bg-slate-900/95 px-2.5 py-0.5 text-[0.55rem] font-semibold tracking-[0.12em] uppercase text-slate-100 opacity-0 group-hover/season:opacity-100 transition-opacity whitespace-nowrap">
                  Season {s}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Standings (cup) */}
        <div className="flex items-center gap-2">
          <span className="text-[0.5rem] font-semibold uppercase tracking-[0.12em] text-slate-300/80">
            Standings
          </span>

          {effectiveRank ? (
            <div className="relative group/cup flex items-center">
              <div
                className={`flex items-center justify-center w-7 h-7 rounded-full border text-[1rem] ${
                  cupCircleStyles[effectiveRank]
                }`}
              >
                {cupIcons[effectiveRank]}
              </div>
              <div className="pointer-events-none absolute -bottom-6 left-1/2 -translate-x-1/2 rounded-full bg-slate-900/95 px-3 py-0.5 text-[0.55rem] font-semibold tracking-[0.12em] uppercase text-slate-100 opacity-0 group-hover/cup:opacity-100 transition-opacity whitespace-nowrap">
                {cupTooltip ?? "Cup Winner"}
              </div>
            </div>
          ) : (
            <span className="text-[0.7rem] text-slate-300/70">—</span>
          )}
        </div>
      </div>
    </Link>
  );
}

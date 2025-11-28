

type ActiveRole = "MID" | "CARRY" | "CAPTAIN";

interface PlayerCardProps {
  nickname: string;
  lane: string;
  realName?: string;      // optional: "Nikhil Singh"
  currentRank: string;
  peakRank: string;
  bio: string;
  activeRole: ActiveRole;
  dotabuffUrl: string;
}

const rolePills: ActiveRole[] = ["MID", "CARRY", "CAPTAIN"];

export default function PlayerCard({
  nickname,
  lane,
  realName,
  currentRank,
  peakRank,
  bio,
  activeRole,
  dotabuffUrl,
}: PlayerCardProps) {
  return (
    <div className="max-w-sm w-full rounded-3xl border border-slate-700/70 bg-[radial-gradient(circle_at_top,rgba(148,163,184,0.22),transparent_55%),#020617] p-5 shadow-[0_18px_45px_rgba(0,0,0,0.95)]">
      {/* Top: avatar + name */}
      <div className="flex items-center gap-4">
        {/* Avatar placeholder – swap with your icon later */}
        <div className="relative h-16 w-16 rounded-2xl border border-slate-500/80 bg-[radial-gradient(circle_at_30%_0%,#1f2937,#020617)] shadow-[0_0_20px_rgba(15,23,42,0.9)] flex items-center justify-center text-[0.8rem] font-semibold tracking-[0.14em] uppercase text-slate-300">
          {nickname[0]}
        </div>

        <div className="flex flex-col gap-0.5">
          <p className="text-[0.7rem] uppercase tracking-[0.2em] text-sky-300/80">
            {lane}
          </p>
          <h2 className="text-[1.1rem] font-semibold tracking-wide text-rose-400 drop-shadow-[0_0_10px_rgba(248,50,88,0.9)]">
            {nickname}
          </h2>
          {realName && (
            <p className="text-xs text-slate-300/90">{realName}</p>
          )}
        </div>
      </div>

      {/* Rank boxes */}
      <div className="mt-5 grid grid-cols-2 gap-3">
        <div className="rounded-2xl bg-linear-to-br from-amber-400 to-orange-600 px-3 py-2.5 shadow-[0_0_22px_rgba(250,204,21,0.85)]">
          <div className="flex items-center gap-1.5 text-[0.62rem] font-semibold uppercase tracking-[0.16em] text-slate-900/90">
            <span>🏆</span>
            <span>Current Rank</span>
          </div>
          <div className="mt-1 text-sm font-semibold text-slate-100">
            {currentRank}
          </div>
        </div>

        <div className="rounded-2xl bg-linear-to-br from-rose-500 to-red-600 px-3 py-2.5 shadow-[0_0_22px_rgba(248,50,88,0.9)]">
          <div className="flex items-center gap-1.5 text-[0.62rem] font-semibold uppercase tracking-[0.16em] text-slate-100/90">
            <span>⭐</span>
            <span>Peak Rank</span>
          </div>
          <div className="mt-1 text-sm font-semibold text-white">
            {peakRank}
          </div>
        </div>
      </div>

      {/* Bio */}
      <p className="mt-4 text-xs leading-relaxed text-slate-300/90">
        {bio}
      </p>

      {/* Role pills */}
      <div className="mt-4 flex gap-2">
        {rolePills.map((role) => {
          const isActive = role === activeRole;
          return (
            <button
              key={role}
              type="button"
              className={[
                "rounded-full px-4 py-1.5 text-[0.7rem] font-semibold tracking-[0.16em] uppercase transition",
                isActive
                  ? "bg-rose-600 text-slate-50 shadow-[0_0_16px_rgba(248,50,88,0.95)]"
                  : "bg-slate-800/80 text-slate-300 hover:bg-slate-700/90",
              ].join(" ")}
            >
              {role}
            </button>
          );
        })}
      </div>

      {/* Dotabuff button */}
      <a
        href={dotabuffUrl}
        target="_blank"
        rel="noreferrer"
        className="mt-5 inline-flex w-full items-center justify-center gap-2 rounded-2xl bg-rose-600 px-4 py-2.5 text-[0.7rem] font-semibold uppercase tracking-[0.24em] text-slate-50 shadow-[0_0_30px_rgba(248,50,88,0.95)] transition hover:bg-rose-500 hover:shadow-[0_0_40px_rgba(248,50,88,1)]"
      >
        <span className="inline-block w-3 h-3 rounded-full border border-white/60" />
        <span>View Dotabuff Profile</span>
      </a>
    </div>
  );
}

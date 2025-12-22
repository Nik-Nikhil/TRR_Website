/* ===================== TYPES ===================== */
export type TeamRow = {
  captain: string
  team: string
  wdl: string
  pts: number
  color?: string
  dq?: boolean
}

type GroupsData = {
  [groupName: string]: TeamRow[]
}

/* ===================== TABLE ===================== */
export default function GroupStageTable({
  groups = {},
}: {
  groups?: GroupsData
}) {
  const entries = Object.entries(groups)

  if (entries.length === 0) {
    return (
      <div className="flex items-center justify-center text-slate-400 py-40">
        No group data available
      </div>
    )
  }

  return (
    <>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-12 max-w-7xl mx-auto">
        {entries.map(([key, rows]) => (
          <GroupCard key={key} title={`Group ${key}`} rows={rows} />
        ))}
      </div>

      <Legend />
    </>
  )
}

/* ===================== GROUP CARD ===================== */
function GroupCard({ title, rows }: { title: string; rows: TeamRow[] }) {
  return (
    <div className="rounded-3xl overflow-hidden bg-linear-to-b from-[#0b1c26] to-[#050c12]
      border border-white/10 shadow-[0_40px_120px_rgba(0,0,0,0.85)]">

      {/* GROUP TITLE */}
      <div
        className="text-black text-center font-extrabold py-3 tracking-widest"
        style={{
          background: "linear-gradient(90deg, #a3ff12 0%, #f5f542 100%)",
          boxShadow:
            "0 0 40px rgba(163,255,18,0.55), 0 0 20px rgba(245,245,66,0.4)",
        }}
      >
        {title.toUpperCase()}
      </div>

      {/* HEADER */}
      <div className="grid grid-cols-[22%_40%_20%_10%]
        px-4 py-2 text-[11px] font-bold tracking-widest
        text-slate-300 border-b border-white/10 bg-black/40">
        <span>CAPTAIN</span>
        <span>TEAM NAME</span>
        <span className="text-center">W / L</span>
        <span className="text-right">PTS</span>
      </div>

      {/* ROWS */}
      <div className="p-4 space-y-3">
        {rows.map((r, i) => {
          const isDQ = r.dq === true
          const isWinner = !isDQ && i === 0
          const isQualified = !isDQ && (i === 1 || i === 2)
          const isEliminated = !isDQ && i >= rows.length - 3

          return (
            <div
              key={i}
              className={`
                grid grid-cols-[22%_40%_20%_10%]
                items-center px-4 py-3 rounded-xl
                transition-all duration-300
                hover:scale-[1.02]

                ${isDQ
                  ? "bg-red-900/40 hover:bg-red-950/50 hover:shadow-[0_0_24px_rgba(127,29,29,1)]"
                  : ""}
                ${isWinner ? "bg-[#a3ff12]/20 shadow-[0_0_25px_rgba(163,255,18,0.45)]" : ""}
                ${isQualified ? "bg-[#f5f542]/15" : ""}
                ${isEliminated
                  ? "bg-red-600/30 shadow-[0_0_30px_rgba(255,40,40,0.75)]"
                  : ""}
                ${!isDQ && !isWinner && !isQualified && !isEliminated ? "bg-white/5" : ""}
              `}
            >
              {/* CAPTAIN */}
              <span className="flex items-center gap-3 font-semibold text-white">
                <span
                  className="w-2.5 h-2.5 rounded-full"
                  style={{
                    backgroundColor: r.color ?? "#888",
                    boxShadow: r.color ? `0 0 10px ${r.color}` : "none",
                  }}
                />
                {r.captain}
              </span>

              {/* TEAM NAME + DQ BADGE */}
              <span className={`flex items-center gap-3 text-slate-200 ${isDQ ? "line-through opacity-80" : ""}`}>
                {r.team}

                {isDQ && (
                  <span className="relative group">
                    <span className="
                      px-2 py-0.5
                      text-[9px] font-bold tracking-widest
                      rounded-md
                      bg-red-600 text-white
                      shadow-[0_0_12px_rgba(255,0,0,0.85)]
                    ">
                      DQ
                    </span>

                    {/* TOOLTIP */}
                    <span className="
                      absolute left-1/2 -translate-x-1/2 top-full mt-2
                      px-3 py-1.5 rounded-md
                      text-[11px] text-white
                      bg-black/90 border border-red-500/40
                      shadow-[0_0_15px_rgba(255,0,0,0.6)]
                      opacity-0 group-hover:opacity-100
                      pointer-events-none transition-opacity
                      whitespace-nowrap
                    ">
                      Disqualified due to smurfing
                    </span>
                  </span>
                )}
              </span>

              {/* W/L */}
              <span className="text-center text-slate-300">
                {r.wdl}
              </span>

              {/* PTS */}
              <span className="text-right font-extrabold text-white">
                {r.pts}
              </span>
            </div>
          )
        })}
      </div>
    </div>
  )
}

/* ===================== LEGEND ===================== */
function Legend() {
  return (
    <div className="max-w-4xl mx-auto mt-16 rounded-xl border border-white/10
      bg-[#050c12] shadow-[0_20px_60px_rgba(0,0,0,0.8)] overflow-hidden">
      <div className="divide-y divide-white/10 text-sm">
        <LegendRow color="bg-[#a3ff12]" text="1ST PLACE ADVANCES DIRECTLY TO THE SEMI-FINALS" />
        <LegendRow color="bg-[#f5f542]" text="2ND & 3RD PLACE QUALIFY FOR THE QUARTER-FINALS" />
        <LegendRow color="bg-red-500" text="BOTTOM 3 TEAMS WERE ELIMINATED" />
      </div>
    </div>
  )
}

function LegendRow({ color, text }: { color: string; text: string }) {
  return (
    <div className="flex items-center gap-4 px-6 py-3">
      <span className={`w-3 h-3 rounded-full ${color}`} />
      <span className="text-slate-200 tracking-wide">{text}</span>
    </div>
  )
}

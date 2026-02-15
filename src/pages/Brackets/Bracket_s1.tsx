import { useMemo, useRef, useLayoutEffect, useState } from "react"
import { motion } from "framer-motion"
import { useNavigate } from "react-router-dom"


/* ===================== TYPES ===================== */
type Team = { id: string; name: string; color: string }

type Match = {
  id: string
  teams?: string[]
  winner?: string
  from?: string[]
}

type Round = { id: string; label: string; matches: Match[] }

export type BracketData = {
  teams: Team[]
  upperBracket: { rounds: Round[] }
  lowerBracket: { rounds: Round[] }
  grandFinal: Match
}




/* ===================== RESPONSIVE CONSTANTS ===================== */
const CARD_W = 220
const CARD_H = 80
const COL_GAP = 60
const ROW_GAP = 25

const GOLD = "#f5c542"
const FINAL_MERGE_ID = "__FINAL_MERGE__"
const ELBOW = 10


/* ===================== HELPERS ===================== */
const teamById = (teams: Team[], id?: string | null) =>
  teams.find(t => t.id === id) ?? null

/* ===================== Y POSITION RESOLVER ===================== */
function getMatchY(
  roundIndex: number,
  matchIndex: number,
  rounds: Round[],
  cache: Map<string, number>,
  STACK: number
): number {
  const match = rounds[roundIndex].matches[matchIndex]

  // Winner node → center of column
  if (match.teams?.length === 1) {
    const totalSlots = Math.max(...rounds.map(r => r.matches.length))
    const y = ((totalSlots - 1) * STACK) / 2
    cache.set(match.id, y)
    return y
  }

  // First round or no parents
  if (roundIndex === 0 || !match.from?.length) {
    const y = matchIndex * STACK
    cache.set(match.id, y)
    return y
  }

  const prevRounds = rounds.slice(0, roundIndex)

  const parents = match.from
    .map(pid =>
      prevRounds.flatMap(r => r.matches).find(m => m.id === pid)
    )
    .filter(Boolean) as Match[]

  const parentYs = parents.map(p => {
    if (cache.has(p.id)) return cache.get(p.id)!
    const rIdx = prevRounds.findIndex(r =>
      r.matches.some(m => m.id === p.id)
    )
    const mIdx = prevRounds[rIdx].matches.findIndex(m => m.id === p.id)
    return getMatchY(rIdx, mIdx, rounds, cache, STACK)
  })

  const y =
    parentYs.length === 1 ? parentYs[0] : (parentYs[0] + parentYs[1]) / 2

  cache.set(match.id, y)
  return y
}

function Tooltip({ text }: { text: string }) {
  return (
    <div
      className="absolute top-full mt-2 left-1/2 -translate-x-1/2
                 whitespace-nowrap px-3 py-1.5 rounded-md
                 text-[10px] font-medium
                 bg-black/90 text-white
                 shadow-[0_6px_18px_rgba(0,0,0,0.65)]
                 pointer-events-none z-50"
    >
      {text}
    </div>
  )
}






/* ===================== POSITION REGISTRY ===================== */
type Pos = { x: number; y: number }

function useNodePositions() {
  const map = useRef(new Map<string, HTMLElement>())
  const [pos, setPos] = useState<Record<string, Pos>>({})

  useLayoutEffect(() => {
    const calc = () => {
      const root = document.querySelector(".bracket-root")
      if (!root) return
      const rr = root.getBoundingClientRect()
      
      

      const next: Record<string, Pos> = {}
      map.current.forEach((el, id) => {
        const r = el.getBoundingClientRect()
        next[id] = {
          x: r.left - rr.left + r.width,
          y: r.top - rr.top + r.height / 2,
        }
      })
      setPos(next)
    }

    calc()
    window.addEventListener("resize", calc)
    return () => window.removeEventListener("resize", calc)
  }, [])

  return {
    pos,
    register: (id: string, el: HTMLElement | null) =>
      el ? map.current.set(id, el) : map.current.delete(id),
  }
}

/* ===================== UI ===================== */
function Header({
  title,
  background,
}: {
  title: string
  background: string
  glow?: string
}) {
  return (
    <div
      className="mb-6 py-3 px-6 text-center font-black rounded-lg text-base tracking-wide border border-slate-700/50 shadow-lg"
      style={{
        backgroundImage: background,
        color: "#0f172a",
        textShadow: "0 2px 4px rgba(0,0,0,0.3)"
      }}
    >
      {title}
    </div>
  )
}


function MatchNode({
  id,
  teams,
  winner,
  register,
  isGrandFinal,
}: {
  id: string
  teams: (Team | null)[]
  winner?: string
  isGrandFinal?: boolean
  register: (id: string, el: HTMLElement | null) => void
}) {

  return (
    <motion.div
      ref={el => register(id, el)}
      whileHover={{ scale: 1.03, boxShadow: "0 8px 30px rgba(0,0,0,0.5)" }}
      className="rounded-lg border border-slate-500/40 bg-slate-800 shadow-xl overflow-hidden"
      style={{ width: CARD_W, height: CARD_H }}
    >
      <div className="flex flex-col h-full divide-y divide-slate-600/30">
        {teams.map((t, i) => {
          const win = t?.id === winner
          const isSingle = teams.length === 1
          const isDQ = id === "UB_F_M1" && t?.id === "kolly"
          const isGFWinner = isGrandFinal && win

          return (
            <div
              key={i}
              className={`flex items-center gap-3 px-4 py-3 transition-all ${
                win || isSingle 
                  ? 'bg-slate-700/60' 
                  : 'bg-slate-800/80'
              }`}
            >
              {/* Team color bar */}
              <div
                className="w-1 h-8 rounded-full flex-shrink-0"
                style={{ background: t?.color ?? "#64748b" }}
              />

              {/* Team name */}
              <span className={`text-base font-bold flex-1 ${
                win || isSingle ? 'text-white' : 'text-slate-400'
              }`}>
                {t?.name ?? "TBD"}
              </span>

              {/* Winner badges */}
              {win && isGrandFinal && (
                <div className="relative group">
                  <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-yellow-400 to-yellow-600 shadow-lg shadow-yellow-500/50 flex items-center justify-center text-base">
                    🏆
                  </div>
                  <div className="hidden group-hover:block">
                    <Tooltip text="Champion" />
                  </div>
                </div>
              )}

              {isDQ && (
                <div className="relative group">
                  <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-red-800 to-red-950 shadow-lg shadow-red-900/50 flex items-center justify-center text-xs font-black text-white">
                    DQ
                  </div>
                  <div className="hidden group-hover:block">
                    <Tooltip text="Disqualified" />
                  </div>
                </div>
              )}
            </div>
          )
        })}
      </div>
    </motion.div>
  )
}



/* ===================== CONNECTORS ===================== */
type Flow = {
  from: string
  to: string
  color: string
  straight?: boolean
  merge?: boolean
  final?: boolean
  handoff?: boolean
}

function Connectors({ pos, flows }: { pos: Record<string, Pos>; flows: Flow[] }) {
  const STEP = COL_GAP / 2
  const MERGE_COLOR = "#6b7280"

  const incomingMap = useMemo(() => {
    const map = new Map<string, Flow[]>()
    flows.forEach(f => {
      const arr = map.get(f.to) ?? []
      arr.push(f)
      map.set(f.to, arr)
    })
    return map
  }, [flows])

  return (
    <svg className="absolute inset-0 w-full h-full pointer-events-none">
      {flows.map((f, i) => {
        const a = pos[f.from]
        const b = pos[f.to]
        if (!a || !b) return null

        // MERGE (used for UB/LB → merge point) — keep straight line
        if (f.merge) {
          return (
            <path
              key={i}
              d={`M ${a.x} ${a.y}
                  L ${b.x} ${b.y}`}
              fill="none"
              stroke={f.color}
              strokeWidth="3"
            />
          )
        }

        // FINAL GOLD — horizontal from merge to GF node
        if (f.final) {
          return (
            <path
              key={i}
              d={`M ${a.x} ${a.y} L ${b.x} ${a.y}`}
              fill="none"
              stroke={f.color}
              strokeWidth="4"
              strokeLinecap="round"
              style={{ filter: "drop-shadow(0 0 8px #f5c542)" }}
            />
          )
        }

        // STRAIGHT (simple horizontal)
        if (f.straight) {
          return (
            <path
              key={i}
              d={`M ${a.x} ${a.y} L ${b.x} ${a.y}`}
              fill="none"
              stroke={f.color}
              strokeWidth="3"
            />
          )
        }

        // DEFAULT BENT OR MERGE CASES
        const group = incomingMap.get(f.to) ?? []
        const isPartOfNormalMerge = group.filter(g => !g.straight && !g.merge && !g.final).length === 2

        if (isPartOfNormalMerge) {
          // midX is where both parents bring their colored horizontal to
          const midX = a.x + STEP

          return (
            <g key={i}>
              {/* left horizontal in team color (parent's colored bar) */}
              <path
                d={`M ${a.x} ${a.y} L ${midX} ${a.y}`}
                fill="none"
                stroke={f.color}
                strokeWidth="3"
                strokeLinejoin="round"
                strokeLinecap="round"
              />
              <path
                d={`M ${midX} ${a.y} L ${midX} ${b.y}`}
                fill="none"
                stroke={f.color}
                strokeWidth="3"
                strokeLinecap="round"
              />
              <path
                d={`M ${midX} ${b.y} L ${b.x} ${b.y}`}
                fill="none"
                stroke={MERGE_COLOR}
                strokeWidth="3"
                strokeLinecap="round"
              />
            </g>
          )
        }

        // fallback old behaviour for non-merge bent flows:
        return (
          <path
            key={i}
            d={`M ${a.x} ${a.y}
                L ${a.x + STEP} ${a.y}
                L ${a.x + STEP} ${b.y}
                L ${b.x} ${b.y}`}
            fill="none"
            stroke={f.color}
            strokeWidth="3"
          />
        )
      })}
    </svg>
  )
}

/* ===================== MAIN ===================== */
export default function BracketDotaStyle({ data }: { data: BracketData }) {
  const { pos, register } = useNodePositions()
  const navigate = useNavigate()

  const STACK = CARD_H + ROW_GAP
  const GF_HEADER_WIDTH = CARD_W * 1.3

  const HEADER_COLS = Math.max(
    data.upperBracket.rounds.length,
    data.lowerBracket.rounds.length
  )
  const FINAL_STAGE_GAP = COL_GAP * 1.2

  const FINAL_X =
    HEADER_COLS * CARD_W +
    (HEADER_COLS - 1) * COL_GAP +
    FINAL_STAGE_GAP

  const ubWinner = data.upperBracket.rounds
    .flatMap(r => r.matches)
    .find(m => m.id === "UB_WINNER_M1")

  const lbWinner = data.lowerBracket.rounds
    .flatMap(r => r.matches)
    .find(m => m.id === "LB_WINNER_M1")


  const mergePos = useMemo(() => {
    if (!ubWinner || !lbWinner) return null

    const ub = pos[ubWinner.id]
    const lb = pos[lbWinner.id]
    if (!ub || !lb) return null

    const mergeX = Math.max(ub.x, lb.x) + ELBOW

    return {
      x: mergeX,
      y: (ub.y + lb.y) / 2,
    }

  }, [pos, ubWinner, lbWinner])

  const elbowPos = useMemo<Record<string, Pos>>(() => {
    const res: Record<string, Pos> = {}

    if (ubWinner) {
      const ub = pos[ubWinner.id]
      if (ub) {
        res[`${ubWinner.id}_ELBOW`] = {
          x: ub.x + ELBOW,
          y: ub.y,
        }
      }
    }

    if (lbWinner) {
      const lb = pos[lbWinner.id]
      if (lb) {
        res[`${lbWinner.id}_ELBOW`] = {
          x: lb.x + ELBOW,
          y: lb.y,
        }
      }
    }

    return res
  }, [pos, ubWinner, lbWinner])


  const flows = useMemo<Flow[]>(() => {
    const f: Flow[] = []

    const walk = (rounds: Round[], bracket: "upper" | "lower") => {
      rounds.forEach((r, i) => {
        // ⛔ Skip Winner rounds
        if (r.id.includes("WINNER")) return

        const next = rounds[i + 1]
        if (!next) return

        r.matches.forEach((m, idx) => {
          if (!m.winner) return
          const w = teamById(data.teams, m.winner)
          if (!w) return

          const straight =
            i >= rounds.length - 2 ||
            (bracket === "lower" && i === 0)

          f.push({
            from: m.id,
            to: next.matches[Math.floor(idx / 2)]?.id,
            color: w.color,
            straight,
          })
        })
      })
    }

    walk(data.upperBracket.rounds, "upper")
    walk(data.lowerBracket.rounds, "lower")

    // UB winner short straight → elbow then merge line (merge flows are color-coded)
    if (ubWinner) {
      const team = teamById(data.teams, ubWinner.winner)
      if (team) {
        f.push({
          from: ubWinner.id,
          to: `${ubWinner.id}_ELBOW`,
          color: team.color,
          straight: true,
        })

        f.push({
          from: `${ubWinner.id}_ELBOW`,
          to: FINAL_MERGE_ID,
          color: team.color,
          merge: true,
        })
      }
    }

    // LB winner short straight → elbow then merge
    if (lbWinner) {
      const team = teamById(data.teams, lbWinner.winner)
      if (team) {
        f.push({
          from: lbWinner.id,
          to: `${lbWinner.id}_ELBOW`,
          color: team.color,
          straight: true,
        })

        f.push({
          from: `${lbWinner.id}_ELBOW`,
          to: FINAL_MERGE_ID,
          color: team.color,
          merge: true,
        })
      }
    }

    // MERGE → GRAND FINAL (gold horizontal)
    if (ubWinner && lbWinner) {
      f.push({
        from: FINAL_MERGE_ID,
        to: data.grandFinal.id,
        color: GOLD,
        final: true,
      })
    }

    return f
  }, [data, ubWinner, lbWinner])

  // position for grand final node:
  const gfLeft = FINAL_X + (GF_HEADER_WIDTH - CARD_W) / 2
  const GF_SCALE = 1.1

  const gfTop = mergePos
    ? mergePos.y - (CARD_H * GF_SCALE) / 2
    : 0


  return (
    <div className="min-h-screen w-full bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950 py-24 px-6">
      {/* Background effects */}
      <div className="fixed inset-0 pointer-events-none opacity-30">
        <div className="absolute top-20 left-20 w-96 h-96 bg-purple-500/20 rounded-full blur-3xl" />
        <div className="absolute bottom-20 right-20 w-96 h-96 bg-pink-500/20 rounded-full blur-3xl" />
      </div>

      {/* Back button */}
      <button
        onClick={() => navigate("/seasons")}
        className="fixed left-6 top-24 z-50 px-5 py-2 rounded-full text-[11px] font-semibold tracking-wider bg-gradient-to-r from-gray-200 to-gray-300 text-slate-900 shadow-lg hover:shadow-xl hover:scale-105 transition-all"
      >
        ← BACK
      </button>

      {/* Bracket container */}
      <div className="relative max-w-[1800px] mx-auto">
        <div className="bracket-root relative">
          <Connectors
            pos={{
              ...pos,
              ...elbowPos,
              ...(mergePos ? { [FINAL_MERGE_ID]: mergePos } : {}),
            }}
            flows={flows}
          />

      {/* HEADERS */}
      <div className="flex items-center relative mb-4">
        {/* Upper Bracket Header */}
        <div
          style={{
            width:
              HEADER_COLS * CARD_W +
              (HEADER_COLS - 1) * COL_GAP,
          }}
        >
          <Header
            title="Upper Bracket"
            background="linear-gradient(90deg, #a3ff12 0%, #f5f542 100%)"
          />
        </div>

        {/* Spacer to reach FINAL_X */}
        <div
          style={{
            width:
              FINAL_X -
              (HEADER_COLS * CARD_W + (HEADER_COLS - 1) * COL_GAP),
          }}
        />

        {/* Grand Final Header */}
        <div
          style={{
            position: "absolute",
            left: FINAL_X - CARD_W * 0.25,
            width: CARD_W * 1.5,
          }}
        >
          <Header
            title="Grand Final"
            background={`linear-gradient(90deg, ${GOLD}, ${GOLD})`}
          />
        </div>
      </div>

      {/* UPPER BRACKET */}
      <div className="flex">
        {data.upperBracket.rounds.map((r, ri) => {
          const cache = new Map<string, number>()
          return (
            <div key={r.id} style={{ marginLeft: ri ? COL_GAP : 0 }}>
              <p className="text-sm text-center mb-4 text-slate-300 font-bold uppercase tracking-wider">{r.label}</p>
              <div
                className="relative"
                style={{
                  width: CARD_W,
                  height:
                    Math.max(
                      ...data.upperBracket.rounds.map(r => r.matches.length)
                    ) * STACK,
                }}
              >
                {r.matches.map((m, mi) => (
                  <div
                    key={m.id}
                    style={{
                      position: "absolute",
                      top: getMatchY(
                        ri,
                        mi,
                        data.upperBracket.rounds,
                        cache,
                        STACK
                      ),
                    }}
                  >
                    <MatchNode
                      id={m.id}
                      teams={
                        m.teams?.map(t => teamById(data.teams, t)) ?? [
                          null,
                          null,
                        ]
                      }
                      winner={m.winner}
                      register={register}
                    />
                  </div>
                ))}
              </div>
            </div>
          )
        })}
      </div>

      {/* LOWER BRACKET */}
      <div style={{ marginTop: STACK * 1.5 }}>
        <div
          style={{
            width:
              data.lowerBracket.rounds.length * CARD_W +
              (data.lowerBracket.rounds.length - 1) * COL_GAP,
          }}
        >
          <Header
            title="Lower Bracket"
            background="linear-gradient(90deg, #ff007f 0%, #ffd84d 100%)"
          />
        </div>

        <div className="flex">
          {data.lowerBracket.rounds.map((r, ri) => {
            const cache = new Map<string, number>()
            return (
              <div key={r.id} style={{ marginLeft: ri ? COL_GAP : 0 }}>
                <p className="text-sm text-center mb-4 text-slate-300 font-bold uppercase tracking-wider">{r.label}</p>
                <div
                  className="relative"
                  style={{
                    width: CARD_W,
                    height:
                      Math.max(
                        ...data.lowerBracket.rounds.map(
                          r => r.matches.length
                        )
                      ) * STACK,
                  }}
                >
                  {r.matches.map((m, mi) => (
                    <div
                      key={m.id}
                      style={{
                        position: "absolute",
                        top: getMatchY(
                          ri,
                          mi,
                          data.lowerBracket.rounds,
                          cache,
                          STACK
                        ),
                      }}
                    >
                      <MatchNode
                        id={m.id}
                        teams={
                          m.teams?.map(t =>
                            teamById(data.teams, t)
                          ) ?? [null, null]
                        }
                        winner={m.winner}
                        register={register}
                      />
                    </div>
                  ))}
                </div>
              </div>
            )
          })}
        </div>
      </div>

      {/* GRAND FINAL */}
      <div
        style={{
          position: "absolute",
          left: gfLeft,
          top: gfTop,
          transform: `scale(${GF_SCALE})`,
          transformOrigin: "left center",
        }}
      >
        <MatchNode
          id={data.grandFinal.id}
          isGrandFinal
          teams={
            data.grandFinal.teams?.map(t =>
              teamById(data.teams, t)
            ) ?? [null, null]
          }
          winner={data.grandFinal.winner}
          register={register}
        />
      </div>

        </div>
      </div>
    </div>
  )
}
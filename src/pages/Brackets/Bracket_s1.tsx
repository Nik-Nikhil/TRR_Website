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
const getResponsiveConstants = () => {
  if (typeof window === 'undefined') {
    return { CARD_W: 180, CARD_H: 74, COL_GAP: 60, ROW_GAP: 28 }
  }
  
  const width = window.innerWidth
  if (width < 640) {
    return { CARD_W: 140, CARD_H: 65, COL_GAP: 45, ROW_GAP: 22 }
  } else if (width < 768) {
    return { CARD_W: 155, CARD_H: 68, COL_GAP: 50, ROW_GAP: 24 }
  } else if (width < 1024) {
    return { CARD_W: 165, CARD_H: 70, COL_GAP: 55, ROW_GAP: 26 }
  } else if (width < 1440) {
    return { CARD_W: 180, CARD_H: 74, COL_GAP: 60, ROW_GAP: 28 }
  } else {
    return { CARD_W: 190, CARD_H: 76, COL_GAP: 65, ROW_GAP: 30 }
  }
}

const GOLD = "#f5c542"
const FINAL_MERGE_ID = "__FINAL_MERGE__"
const ELBOW = 14
const HEADER_HEIGHT = 56


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
  glow,
}: {
  title: string
  background: string
  glow?: string
}) {
  return (
    <div
      className="mb-4 sm:mb-6 py-2 sm:py-3 text-center font-extrabold rounded-md text-xs sm:text-sm tracking-wide"
      style={{
        backgroundImage: background,
        color: "#06130a",
        boxShadow: glow ?? "none",
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
  dimensions,
}: {
  id: string
  teams: (Team | null)[]
  winner?: string
  isGrandFinal?: boolean
  register: (id: string, el: HTMLElement | null) => void
  dimensions: { CARD_W: number; CARD_H: number }
}) {

  return (
    <motion.div
      ref={el => register(id, el)}
      whileHover={{ scale: 1.04 }}
      className="rounded-md bg-linear-to-b from-[#2b2e36] to-[#1f2128] border border-white/10 shadow-lg"
      style={{ width: dimensions.CARD_W, height: dimensions.CARD_H }}
    >
      <div className="p-2 flex flex-col gap-1 justify-center h-full">
        {teams.map((t, i) => {
        const win = t?.id === winner
const hasWinner = !!winner
const isSingle = teams.length === 1
const isDQ = id === "UB_F_M1" && t?.id === "kolly"
const isLoser = hasWinner && !win
const isGFLoser = isGrandFinal && isLoser
const isGFWinner = isGrandFinal && win


          return (
            <div
              key={i}
              className={`flex items-center gap-2 px-2 py-1 rounded transition-all
  ${win || isSingle ? "bg-white/10" : "opacity-60"}

 ${(win || isSingle) && !isGrandFinal
  ? "hover:shadow-[0_0_18px_rgba(34,197,94,0.85)]"
  : ""
}

${isGFWinner
  ? "hover:shadow-[0_0_22px_rgba(245,197,66,0.95)]"
  : ""
}

${isGFLoser
  ? "hover:shadow-[0_0_18px_rgba(159,166,173,0.9)]"
  : ""
}

${isLoser && !isDQ && !isGrandFinal
  ? "hover:shadow-[0_0_18px_rgba(239,68,68,0.8)]"
  : ""
}


  ${isDQ
    ? "hover:bg-red-950/50 hover:shadow-[0_0_24px_rgba(127,29,29,1)]"
    : ""
  }
`}

            >
              {/* Team color bar */}
              <span
                className="w-1.5 h-5 rounded-full"
                style={{ background: t?.color ?? "#555" }}
              />

              {/* Team name */}
              <span className="text-xs truncate flex-1">
                {t?.name ?? "TBD"}
              </span>

              {/* 🏆 Grand Final Champion (Season-style medal) */}
             {win && isGrandFinal && (
  <div className="relative group cursor-pointer flex items-center">
    <div
      className="h-5 w-5 rounded-md
                 bg-[#facc15]
                 shadow-[0_0_12px_rgba(250,204,21,0.9)]
                 flex items-center justify-center
                 text-xs leading-none"
    >
      🏆
    </div>

    <div className="hidden group-hover:block">
      <Tooltip text="Champion" />
    </div>
  </div>
)}



              {/* 🔴 DQ medal (ONLY UB Final, darker red) */}
              {isDQ && (
  <div className="relative group cursor-pointer flex items-center">
    <div
      className="h-5 w-5 rounded-md
                 bg-[#7f1d1d]
                 shadow-[0_0_14px_rgba(127,29,29,1)]
                 flex items-center justify-center
                 text-[10px] font-bold leading-none text-white"
    >
      DQ
    </div>

    <div className="hidden group-hover:block">
      <Tooltip text="Disqualified due to smurfing" />
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

function Connectors({ pos, flows, COL_GAP }: { pos: Record<string, Pos>; flows: Flow[]; COL_GAP: number }) {
  const STEP = COL_GAP / 2
  const MERGE_SILVER = "#9fa6ad" // silver-ish for the short horizontal join

  // Group incoming flows by target (to) so we can detect merges (2 incoming)
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
              strokeWidth="2"
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
              strokeWidth="2"
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
                strokeWidth="2"
                strokeLinejoin="round"
                strokeLinecap="round"
              />
              {/* vertical from parent's Y down/up to child's Y in parent's color
                  (both parents will draw this; visually they'll overlap) */}
              <path
                d={`M ${midX} ${a.y} L ${midX} ${b.y}`}
                fill="none"
                stroke={f.color}
                strokeWidth="2"
                strokeLinecap="round"
              />
              {/* the short horizontal from midX at child Y to child X — silver */}
              <path
                d={`M ${midX} ${b.y} L ${b.x} ${b.y}`}
                fill="none"
                stroke={MERGE_SILVER}
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
            strokeWidth="2"
          />
        )
      })}
    </svg>
  )
}

/* ===================== MAIN ===================== */
export default function BracketDotaStyle({ data }: { data: BracketData }) {
  const [dimensions, setDimensions] = useState(getResponsiveConstants())
  const { pos, register } = useNodePositions()

  useLayoutEffect(() => {
    const handleResize = () => {
      setDimensions(getResponsiveConstants())
    }
    window.addEventListener('resize', handleResize)
    return () => window.removeEventListener('resize', handleResize)
  }, [])

  const { CARD_W, CARD_H, COL_GAP, ROW_GAP } = dimensions
  const STACK = CARD_H + ROW_GAP
  const GF_HEADER_WIDTH = CARD_W * 1.5

  const HEADER_COLS = Math.max(
    data.upperBracket.rounds.length,
    data.lowerBracket.rounds.length
  )
  const FINAL_STAGE_GAP = COL_GAP * 1.5

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
 const GF_SCALE = 1.15

const gfTop = mergePos
  ? mergePos.y - (CARD_H * GF_SCALE) / 2
  : HEADER_HEIGHT - (CARD_H * GF_SCALE) / 2
  const navigate = useNavigate()


  return (
    <div className="min-h-screen w-full relative overflow-hidden bg-gradient-to-br from-slate-950 via-indigo-950/20 to-slate-950">
      {/* Enhanced Background */}
      <div className="fixed inset-0 z-0 pointer-events-none">
        {/* Base gradient overlay */}
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-purple-900/20 via-slate-950/50 to-slate-950" />
        
        {/* Animated grid pattern */}
        <motion.div 
          className="absolute inset-0 opacity-[0.03]"
          animate={{
            backgroundPosition: ["0% 0%", "100% 100%"],
          }}
          transition={{
            duration: 30,
            repeat: Infinity,
            repeatType: "reverse",
            ease: "linear"
          }}
          style={{
            backgroundImage: `
              repeating-linear-gradient(0deg, transparent, transparent 49px, rgba(139, 92, 246, 0.1) 49px, rgba(139, 92, 246, 0.1) 50px),
              repeating-linear-gradient(90deg, transparent, transparent 49px, rgba(139, 92, 246, 0.1) 49px, rgba(139, 92, 246, 0.1) 50px)
            `,
            backgroundSize: "100px 100px",
          }}
        />

        {/* Glowing orbs */}
        <motion.div 
          className="absolute -top-40 -left-40 w-[600px] h-[600px] rounded-full blur-[120px]"
          style={{ background: "radial-gradient(circle, rgba(139, 92, 246, 0.15), transparent 70%)" }}
          animate={{
            scale: [1, 1.1, 1],
            opacity: [0.3, 0.5, 0.3],
          }}
          transition={{ duration: 10, repeat: Infinity, ease: "easeInOut" }}
        />
        <motion.div 
          className="absolute -bottom-40 -right-40 w-[600px] h-[600px] rounded-full blur-[120px]"
          style={{ background: "radial-gradient(circle, rgba(236, 72, 153, 0.15), transparent 70%)" }}
          animate={{
            scale: [1.1, 1, 1.1],
            opacity: [0.5, 0.3, 0.5],
          }}
          transition={{ duration: 12, repeat: Infinity, ease: "easeInOut" }}
        />

        {/* Floating particles */}
        <div className="absolute inset-0">
          {[...Array(15)].map((_, i) => (
            <motion.div
              key={i}
              className="absolute rounded-full"
              style={{
                width: Math.random() * 2 + 0.5,
                height: Math.random() * 2 + 0.5,
                left: `${Math.random() * 100}%`,
                top: `${Math.random() * 100}%`,
                background: `rgba(${Math.random() * 50 + 200}, ${Math.random() * 50 + 200}, 255, ${Math.random() * 0.3 + 0.2})`,
                boxShadow: `0 0 ${Math.random() * 10 + 5}px rgba(139, 92, 246, 0.3)`
              }}
              animate={{
                opacity: [0.2, 0.6, 0.2],
                scale: [1, 1.2, 1],
                y: [0, -20, 0]
              }}
              transition={{
                duration: Math.random() * 4 + 3,
                repeat: Infinity,
                delay: Math.random() * 2,
                ease: "easeInOut"
              }}
            />
          ))}
        </div>
      </div>

      <div className="bracket-root relative p-4 sm:p-6 lg:p-10 z-10">
          {/* Back button */}
    <button
  onClick={() => navigate("/seasons")}
  className="
    fixed
    left-4 sm:left-6
    top-20 sm:top-24
    z-50

    px-4 sm:px-5 py-1.5 sm:py-2
    rounded-full
    text-[10px] sm:text-[11px]
    font-semibold
    tracking-[0.2em]

    bg-gradient-to-tr from-zinc-200 via-zinc-100 to-zinc-300
    text-[#050608]
    shadow-[0_8px_26px_rgba(2,6,23,0.55)]

    hover:brightness-105
    transition-all
  "
>
  ← BACK
</button>


      <Connectors
        pos={{
          ...pos,
          ...elbowPos,
          ...(mergePos ? { [FINAL_MERGE_ID]: mergePos } : {}),
        }}
        flows={flows}
        COL_GAP={COL_GAP}
      />

      {/* HEADERS */}
      <div className="flex items-center relative">
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
  glow="0 0 40px rgba(163,255,18,0.55), 0 0 20px rgba(245,245,66,0.4)"
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
  glow="0 0 35px rgba(245,197,66,0.7)"
/>

</div>

      </div>

      {/* UPPER BRACKET */}
      <div className="flex overflow-x-auto pb-4">
        {data.upperBracket.rounds.map((r, ri) => {
          const cache = new Map<string, number>()
          return (
            <div key={r.id} style={{ marginLeft: ri ? COL_GAP : 0 }}>
              <p className="text-[10px] sm:text-xs text-center mb-3 sm:mb-4 text-gray-300">{r.label}</p>
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
                      dimensions={{ CARD_W, CARD_H }}
                    />
                  </div>
                ))}
              </div>
            </div>
          )
        })}
      </div>

      {/* LOWER BRACKET */}
      <div style={{ marginTop: STACK * 0.8 }}>
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
  glow="0 0 40px rgba(255,0,127,0.55), 0 0 20px rgba(255,216,77,0.45)"
/>

          </div>

        <div className="flex overflow-x-auto pb-4">
          {data.lowerBracket.rounds.map((r, ri) => {
            const cache = new Map<string, number>()
            return (
              <div key={r.id} style={{ marginLeft: ri ? COL_GAP : 0 }}>
                <p className="text-[10px] sm:text-xs text-center mb-3 sm:mb-4 text-gray-300">{r.label}</p>
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
                        dimensions={{ CARD_W, CARD_H }}
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
          transform: "scale(1.15)",
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
          dimensions={{ CARD_W, CARD_H }}
        />
      </div>

      </div>
    </div>
  )
}
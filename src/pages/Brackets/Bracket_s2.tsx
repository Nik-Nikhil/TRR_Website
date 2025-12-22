/* eslint-disable react-refresh/only-export-components */
import { useMemo, useRef, useLayoutEffect, useState } from "react"
import { motion } from "framer-motion"
import { useNavigate } from "react-router-dom"


/* ===================== TYPES ===================== */
type Team = { id: string; captain: string; color: string }

type Match = {
  id: string
  teams: string[]
  winner?: string
}

type Round = {
  id: string
  label: string
  matches: Match[]
}

 export type Season2Data = {
  teams: Team[]
  knockout: { rounds: Round[] }
  grandFinal: Match
}

/* ===================== CONSTANTS ===================== */
const CARD_W = 180
const CARD_H = 74
const COL_GAP = 60
const ROW_GAP = 28
const STACK = CARD_H + ROW_GAP

const GOLD = "#f5c542"
const ELBOW = 18
const MERGE_ELBOW = 16
const FINAL_MERGE_ID = "__FINAL_MERGE__"
const FINAL_STAGE_GAP = COL_GAP * 1.5


/* ===================== HELPERS ===================== */
const teamById = (teams: Team[], id?: string) =>
  teams.find(t => t.id === id) ?? null

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



/* ===================== CONNECTORS ===================== */
type Flow = {
  from: string
  to: string
  color: string
  merge?: boolean
  final?: boolean
}
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
      className="py-3 text-center font-extrabold rounded-md
                 text-xs sm:text-sm tracking-wide"
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
      whileHover={{ scale: 1.04 }}
      className="rounded-md bg-linear-to-b from-[#2b2e36] to-[#1f2128]
                 border border-white/10 shadow-lg"
      style={{ width: CARD_W, height: CARD_H }}
    >
      <div className="p-2 flex flex-col gap-1 justify-center h-full">
        {teams.map((t, i) => {
          const win = t?.id === winner
          const lose = winner && !win

          return (
            <div
              key={i}
              className={`
                flex items-center gap-2 px-2 py-1 rounded transition-all
                ${win ? "bg-white/10" : "opacity-60"}
                ${win && !isGrandFinal ? "hover:shadow-[0_0_18px_rgba(34,197,94,0.85)]" : ""}
                ${lose && !isGrandFinal ? "hover:shadow-[0_0_18px_rgba(239,68,68,0.8)]" : ""}
                ${isGrandFinal && win ? "hover:shadow-[0_0_22px_rgba(245,197,66,0.95)]" : ""}
                ${isGrandFinal && lose ? "hover:shadow-[0_0_18px_rgba(159,166,173,0.9)]" : ""}
              `}
            >
              <span
                className="w-1.5 h-5 rounded-full"
                style={{ background: t?.color ?? "#555" }}
              />
              <span className="text-xs truncate flex-1">
                {t?.captain ?? "TBD"}
              </span>

              {isGrandFinal && win && (
                <div className="h-5 w-5 rounded-md bg-[#facc15]
                                shadow-[0_0_12px_rgba(250,204,21,0.9)]
                                flex items-center justify-center text-xs">
                  🏆
                </div>
              )}
            </div>
          )
        })}
      </div>
    </motion.div>
  )
}
function Connectors({ pos, flows }: { pos: Record<string, Pos>; flows: Flow[] }) {
  return (
    <svg className="absolute inset-0 w-full h-full pointer-events-none">
      {flows.map((f, i) => {
        const a = pos[f.from]
        const b = pos[f.to]
        if (!a || !b) return null

        if (f.final) {
          return (
            <path
              key={i}
              d={`M ${a.x} ${a.y} L ${b.x} ${a.y}`}
              stroke={GOLD}
              strokeWidth="4"
              strokeLinecap="round"
              fill="none"
              style={{ filter: "drop-shadow(0 0 8px #f5c542)" }}
            />
          )
        }

        if (f.merge) {
  return (
    <path
      key={i}
      d={`M ${a.x} ${a.y}
          L ${a.x + MERGE_ELBOW} ${a.y}
          L ${a.x + MERGE_ELBOW} ${b.y}
          L ${b.x} ${b.y}`}
      stroke={f.color}
      strokeWidth="2"
      fill="none"
    />
  )
}


        return (
          <path
            key={i}
            d={`M ${a.x} ${a.y}
                L ${a.x + MERGE_ELBOW} ${a.y}
                L ${a.x + MERGE_ELBOW} ${b.y}
                L ${b.x} ${b.y}`}
            stroke={f.color}
            strokeWidth="2"
            fill="none"
          />
        )
      })}
    </svg>
  )
}



/* ===================== MAIN ===================== */
export default function Bracket_s2({ data }: { data: Season2Data }) {


  const navigate = useNavigate()
  const { pos, register } = useNodePositions()
  

  const rounds = data.knockout.rounds
 

const SEMI_FINAL_X =
  rounds.length * CARD_W +
  (rounds.length - 1) * COL_GAP
const FINAL_X = SEMI_FINAL_X + FINAL_STAGE_GAP











  

  const maxMatches = Math.max(...rounds.map(r => r.matches.length))

  const flows = useMemo<Flow[]>(() => {
    const f: Flow[] = []

    rounds[0].matches.forEach((m, i) => {
      if (!m.winner) return
      const t = teamById(data.teams, m.winner)
      if (!t) return

      f.push({
        from: m.id,
        to: rounds[1].matches[i].id,
        color: t.color,
      })
    })

    rounds[1].matches.forEach(m => {
      if (!m.winner) return
      const t = teamById(data.teams, m.winner)
      if (!t) return

      f.push({ from: m.id, to: `${m.id}_ELBOW`, color: t.color })
      f.push({
        from: `${m.id}_ELBOW`,
        to: FINAL_MERGE_ID,
        color: t.color,
        merge: true,
      })
    })

    f.push({
      from: FINAL_MERGE_ID,
      to: data.grandFinal.id,
      color: GOLD,
      final: true,
    })

    return f
  }, [rounds, data.grandFinal.id, data.teams])

  const totalWidth =
    rounds.length * CARD_W +
    (rounds.length - 1) * COL_GAP +
    COL_GAP * 2 +
    CARD_W

  return (
    <div className="w-full overflow-x-auto">
      <div className="min-h-[calc(100vh-160px)] flex items-start sm:items-center">

    <div className="min-w-max sm:flex sm:justify-center">

        <div className="bracket-root relative px-4 py-8 sm:p-10" style={{ width: totalWidth }}>

          
          
{/* HEADER ROW */}
<div className="relative mb-10 "  style={{ height: 44 }}> 

  {/* BACK */}
<button
  onClick={() => navigate("/seasons")}
  className="
    hidden sm:block
    fixed left-6 top-24 z-60
    px-5 py-2 rounded-full
    text-[11px] font-semibold tracking-[0.2em]
    bg-linear-to-tr from-zinc-200 via-zinc-100 to-zinc-300
    text-[#050608]
    shadow-[0_8px_26px_rgba(2,6,23,0.55)]
    hover:brightness-105 transition-all
  "
>
  ← BACK
</button>
<button
  onClick={() => navigate("/group-stage/2")}
  className="
    hidden sm:block
    fixed right-6 top-24 z-60
    px-5 py-2 rounded-full
    text-[11px] font-semibold tracking-[0.2em] uppercase
    bg-linear-to-tr from-zinc-200 via-zinc-100 to-zinc-300
    text-[#050608]
    shadow-[0_8px_26px_rgba(2,6,23,0.55)]
    hover:brightness-105 transition-all
  "
>
  GROUP STAGE →
</button>




  <div
    style={{
      position: "absolute",
    top: 0,
    left: 0,
      width: SEMI_FINAL_X,
    }}
  >
    <Header
      title="Knockout"
      background="linear-gradient(90deg,#a3ff12,#eaff3b)"
      glow="0 0 30px rgba(163,255,18,0.55)"
    />
  </div>

  {/* Grand Final Header — EXACTLY above GF match */}
  <div
    style={{
      position: "absolute",
      top: 0,
      left: FINAL_X,
      width: CARD_W,
    }}
  >
    <Header
      title="Grand Final"
      background="linear-gradient(90deg,#f5c542,#ffd36a)"
      glow="0 0 28px rgba(245,197,66,0.65)"
    />
  </div>
</div>




          <Connectors
            pos={{
              ...pos,
              ...rounds[1].matches.reduce((acc, m) => {
                const p = pos[m.id]
                if (!p) return acc
                acc[`${m.id}_ELBOW`] = { x: p.x + ELBOW, y: p.y }
                return acc
              }, {} as Record<string, Pos>),
              [FINAL_MERGE_ID]: {
                x: (pos[rounds[1].matches[0].id]?.x ?? 0) + ELBOW * 2,
                y:
                  ((pos[rounds[1].matches[0].id]?.y ?? 0) +
                    (pos[rounds[1].matches[1].id]?.y ?? 0)) /
                  2,
              },
            }}
            flows={flows}
          />

          {/* BRACKET */}
          <div className="flex items-center">
            <div className="flex" >

              {rounds.map((round, ri) => (
                <div key={round.id} style={{ marginLeft: ri ? COL_GAP : 0 }}>
                  <p className="text-xs text-center mb-4">{round.label}</p>
                  <div
                    className="relative"
                    style={{ width: CARD_W, height: maxMatches * STACK }}
                  >
                    {round.matches.map((m, mi) => (
                      <div key={m.id} style={{ position: "absolute", top: mi * STACK }}>
                        <MatchNode
                          id={m.id}
                          teams={m.teams.map(t => teamById(data.teams, t))}
                          winner={m.winner}
                          register={register}
                        />
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>

            <div
  
  style={{ marginLeft: COL_GAP * 1.5, transform: "scale(1.15)" }}
>

              <MatchNode
                id={data.grandFinal.id}
                isGrandFinal
                teams={data.grandFinal.teams.map(t =>
                  teamById(data.teams, t)
                )}
                winner={data.grandFinal.winner}
                register={register}
              />
            </div>
          </div>
        </div>
        {/* MOBILE STICKY NAV BAR */}
<div
  className="
    sm:hidden
    sticky bottom-4
    z-50
    w-full
    flex justify-center
    pointer-events-none
  "
>
  <div
    className="
      pointer-events-auto
      flex gap-3
      px-3 py-2
      rounded-full
      bg-black/40 backdrop-blur-md
      shadow-[0_10px_30px_rgba(0,0,0,0.6)]
    "
  >
    <button
      onClick={() => navigate("/seasons")}
      className="
        px-4 py-2 rounded-full
        text-[11px] font-semibold tracking-[0.2em]
        bg-linear-to-tr from-zinc-200 via-zinc-100 to-zinc-300
        text-[#050608]
        shadow-[0_6px_18px_rgba(2,6,23,0.45)]
        hover:brightness-105 transition-all
      "
    >
      ← BACK
    </button>

    <button
      onClick={() => navigate("/group-stage/2")}
      className="
        px-4 py-2 rounded-full
        text-[11px] font-semibold tracking-[0.2em] uppercase
        bg-linear-to-tr from-zinc-200 via-zinc-100 to-zinc-300
        text-[#050608]
        shadow-[0_6px_18px_rgba(2,6,23,0.45)]
        hover:brightness-105 transition-all
      "
    >
      GROUP STAGE →
    </button>
  </div>
</div>

      </div>
      </div>
    </div>
  )
}

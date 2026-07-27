import { useMemo, useRef, useLayoutEffect, useState, useEffect } from "react"
import { motion } from "framer-motion"


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
const CARD_W = 148
const CARD_H = 68
const WINNER_CARD_H = 40
const COL_GAP = 34
const ROW_GAP = 12

/* ---- Design tokens: "Roshan's Pit" — ember vs. moss, aged-gold finale ---- */
const GOLD = "#d4af37"
const GOLD_BRIGHT = "#f0d878"
const EMBER = "#e2572b"
const EMBER_DEEP = "#7a2410"
const MOSS = "#8fbf4f"
const VOID = "#090c09"
const STONE_PANEL = "#141a15"
const STONE_CARD = "#181f19"
const STONE_BORDER = "rgba(150,165,140,0.16)"
const BONE = "#eae6da"
const ASH = "#8b9188"

const FINAL_MERGE_ID = "__FINAL_MERGE__"
const ELBOW = 8

const FONT_LINK_ID = "bracket-font-import"


/* ===================== HELPERS ===================== */
const teamById = (teams: Team[], id?: string | null) =>
  teams.find(t => t.id === id) ?? null

function useInjectFonts() {
  useEffect(() => {
    if (document.getElementById(FONT_LINK_ID)) return
    const link = document.createElement("link")
    link.id = FONT_LINK_ID
    link.rel = "stylesheet"
    link.href =
      "https://fonts.googleapis.com/css2?family=Cinzel:wght@600;700;900&family=Inter:wght@400;500;600;700;800&family=JetBrains+Mono:wght@500;600&display=swap"
    document.head.appendChild(link)
  }, [])
}

/* ===================== Y POSITION RESOLVER ===================== */
function getMatchY(
  roundIndex: number,
  matchIndex: number,
  rounds: Round[],
  cache: Map<string, number>,
  STACK: number
): number {
  const match = rounds[roundIndex].matches[matchIndex]

  if (match.teams?.length === 1) {
    const totalSlots = Math.max(...rounds.map(r => r.matches.length))
    const y = ((totalSlots - 1) * STACK) / 2
    cache.set(match.id, y)
    return y
  }

  if (roundIndex === 0 || !match.from?.length) {
    const y = matchIndex * STACK
    cache.set(match.id, y)
    return y
  }

  const prevRounds = rounds.slice(0, roundIndex)

  const parents = match.from
    .map(pid => prevRounds.flatMap(r => r.matches).find(m => m.id === pid))
    .filter(Boolean) as Match[]

  const parentYs = parents.map(p => {
    if (cache.has(p.id)) return cache.get(p.id)!
    const rIdx = prevRounds.findIndex(r => r.matches.some(m => m.id === p.id))
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
      className="absolute top-full mt-1.5 left-1/2 -translate-x-1/2
                 whitespace-nowrap px-2 py-1 rounded
                 text-[9px] font-semibold tracking-wide uppercase
                 shadow-[0_8px_20px_rgba(0,0,0,0.7)]
                 pointer-events-none z-50"
      style={{
        background: "#0c0f0b",
        color: BONE,
        border: `1px solid ${STONE_BORDER}`,
        fontFamily: "'JetBrains Mono', monospace",
      }}
    >
      {text}
    </div>
  )
}


/* ===================== POSITION REGISTRY ===================== */
/*
 * FIX: the original hook measured positions exactly once, on mount, with an
 * empty dependency array. That snapshot is taken BEFORE the Google Fonts
 * finish loading (which reflows every card's text metrics) and is never
 * refreshed for anything except a browser `resize` event. Any other layout
 * shift — fonts landing, a data update, an animation settling — left the
 * cached `pos` map stale, which is why the merge point / Grand Final card
 * ended up floating in the wrong place with a disconnected connector line.
 *
 * This version:
 *  - re-measures after fonts are ready (`document.fonts.ready`)
 *  - re-measures via ResizeObserver on the bracket root (catches any reflow,
 *    not just window resizes)
 *  - re-measures on a couple of animation frames after mount, to catch
 *    layout that settles after the initial paint
 *  - re-measures whenever the `deps` you pass in change (e.g. bracket data)
 *  - exposes `ready` so the caller can avoid rendering connectors/merge
 *    nodes off of a zero/partial snapshot
 */
function useNodePositions(deps: React.DependencyList = []) {
  const map = useRef(new Map<string, HTMLElement>())
  const [pos, setPos] = useState<Record<string, Pos>>({})
  const [ready, setReady] = useState(false)

  useLayoutEffect(() => {
    const root = document.querySelector(".bracket-root")

    const calc = () => {
      const r = document.querySelector(".bracket-root")
      if (!r) return
      const rr = r.getBoundingClientRect()

      const next: Record<string, Pos> = {}
      map.current.forEach((el, id) => {
        const rect = el.getBoundingClientRect()
        next[id] = {
          x: rect.left - rr.left + rect.width,
          y: rect.top - rr.top + rect.height / 2,
        }
      })
      setPos(next)
      setReady(true)
    }

    calc()

    // catch layout that settles a frame or two after first paint
    const raf1 = requestAnimationFrame(() => {
      const raf2 = requestAnimationFrame(calc)
      cleanupRafs.push(raf2)
    })
    const cleanupRafs = [raf1]

    // catch the font swap reflow
    document.fonts?.ready?.then(calc).catch(() => {})

    // catch any other reflow of the bracket itself
    const ro = new ResizeObserver(() => calc())
    if (root) ro.observe(root)

    window.addEventListener("resize", calc)
    return () => {
      cleanupRafs.forEach(cancelAnimationFrame)
      ro.disconnect()
      window.removeEventListener("resize", calc)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, deps)

  return {
    pos,
    ready,
    register: (id: string, el: HTMLElement | null) =>
      el ? map.current.set(id, el) : map.current.delete(id),
  }
}

type Pos = { x: number; y: number }

/* ===================== UI ===================== */
function Header({
  title,
  accent,
  eyebrow,
}: {
  title: string
  accent: string
  eyebrow: string
}) {
  return (
    <div
      className="mb-3 relative py-2 px-4 rounded-md overflow-hidden"
      style={{
        background: `linear-gradient(180deg, ${STONE_PANEL} 0%, #0e120e 100%)`,
        border: `1px solid ${STONE_BORDER}`,
      }}
    >
      <div
        className="absolute left-0 top-0 bottom-0"
        style={{ width: 3, background: accent, boxShadow: `0 0 10px ${accent}` }}
      />
      <p
        className="text-[8px] tracking-[0.25em] uppercase mb-0.5"
        style={{ fontFamily: "'JetBrains Mono', monospace", color: accent }}
      >
        {eyebrow}
      </p>
      <h3
        className="text-sm tracking-wide uppercase"
        style={{
          fontFamily: "'Cinzel', serif",
          fontWeight: 700,
          color: BONE,
          textShadow: "0 2px 6px rgba(0,0,0,0.5)",
        }}
      >
        {title}
      </h3>
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
      whileHover={{ y: -1, boxShadow: "0 8px 20px rgba(0,0,0,0.5)" }}
      className="rounded-md overflow-hidden relative"
      style={{
        width: CARD_W,
        height: teams.length === 1 ? WINNER_CARD_H : CARD_H,
        background: STONE_CARD,
        border: isGrandFinal
          ? `1px solid rgba(212,175,55,0.5)`
          : `1px solid ${STONE_BORDER}`,
        boxShadow: isGrandFinal
          ? `0 0 0 1px rgba(212,175,55,0.15), 0 0 22px rgba(212,175,55,0.15)`
          : "0 3px 10px rgba(0,0,0,0.3)",
      }}
    >
      <div className="flex flex-col h-full divide-y" style={{ borderColor: STONE_BORDER }}>
        {teams.map((t, i) => {
          const hasTeam = Boolean(t?.name?.trim())
          const win = hasTeam && t?.id === winner
          const isSingle = teams.length === 1
          const isDQ = id === "UB_F_M1" && t?.id === "kolly"

          return (
            <div
              key={i}
              className="flex items-center gap-2 px-2.5 py-1.5 transition-colors"
              style={{
                background:
                  win || (isSingle && hasTeam) ? "rgba(212,175,55,0.06)" : "transparent",
                borderTop: i > 0 ? `1px solid ${STONE_BORDER}` : undefined,
              }}
            >
              {/* Team color bar */}
              <div
                className="w-[3px] h-5 rounded-full shrink-0"
                style={{
                  background: hasTeam ? t!.color : "#4b5249",
                  boxShadow:
                    win || (isSingle && hasTeam) ? `0 0 6px ${t?.color}` : "none",
                }}
              />

              {/* Team name */}
              <span
                className="text-[11px] flex-1 truncate"
                style={{
                  fontFamily: "'Inter', sans-serif",
                  fontWeight: win || (isSingle && hasTeam) ? 700 : 500,
                  color: win || (isSingle && hasTeam) ? BONE : ASH,
                  fontStyle: hasTeam ? "normal" : "italic",
                }}
              >
                {hasTeam ? t!.name : isDQ ? "Disqualified" : "TBD"}
              </span>

              {win && isGrandFinal && (
                <div className="relative group">
                  <div
                    className="w-5 h-5 rounded flex items-center justify-center text-[10px]"
                    style={{
                      background: `linear-gradient(135deg, ${GOLD_BRIGHT}, ${GOLD})`,
                      boxShadow: "0 0 10px rgba(212,175,55,0.6)",
                    }}
                  >
                    🛡️
                  </div>
                  <div className="hidden group-hover:block">
                    <Tooltip text="Champion" />
                  </div>
                </div>
              )}

              {isDQ && (
                <div className="relative group">
                  <div
                    className="w-5 h-5 rounded flex items-center justify-center text-[8px] font-black"
                    style={{
                      background: `linear-gradient(135deg, ${EMBER}, ${EMBER_DEEP})`,
                      color: BONE,
                      boxShadow: "0 0 8px rgba(226,87,43,0.5)",
                      fontFamily: "'JetBrains Mono', monospace",
                    }}
                  >
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
  riserMerge?: boolean // vertical rise + horizontal merge, for the LB winner's
                        // long trip up to the Grand Final row
}

function Connectors({ pos, flows }: { pos: Record<string, Pos>; flows: Flow[] }) {
  const STEP = COL_GAP / 2
  const MERGE_COLOR = "#5b6459"

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
    <svg className="absolute inset-0 w-full h-full pointer-events-none" style={{ overflow: "visible" }}>
      <defs>
        <filter id="glow-soft" x="-50%" y="-50%" width="200%" height="200%">
          <feGaussianBlur stdDeviation="1.6" result="blur" />
          <feMerge>
            <feMergeNode in="blur" />
            <feMergeNode in="SourceGraphic" />
          </feMerge>
        </filter>
      </defs>

      {flows.map((f, i) => {
        const a = pos[f.from]
        const b = pos[f.to]
        if (!a || !b) return null

        if (f.merge) {
          return (
            <path
              key={i}
              d={`M ${a.x} ${a.y} L ${b.x} ${b.y}`}
              fill="none"
              stroke={f.color}
              strokeWidth="2"
              strokeLinecap="round"
              filter="url(#glow-soft)"
              opacity={0.9}
            />
          )
        }

        if (f.riserMerge) {
          // LB winner is far below the merge row — rise straight up at the
          // elbow's x, then step across to the merge point. Two straight
          // segments instead of one long diagonal across empty space.
          return (
            <path
              key={i}
              d={`M ${a.x} ${a.y} L ${a.x} ${b.y} L ${b.x} ${b.y}`}
              fill="none"
              stroke={f.color}
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              filter="url(#glow-soft)"
              opacity={0.9}
            />
          )
        }

        if (f.final) {
          return (
            <g key={i}>
              <path
                d={`M ${a.x} ${a.y} L ${b.x} ${a.y}`}
                fill="none"
                stroke={GOLD}
                strokeWidth="2.5"
                strokeLinecap="round"
                style={{ filter: "drop-shadow(0 0 8px rgba(212,175,55,0.7))" }}
              />
              <path
                d={`M ${a.x} ${a.y} L ${b.x} ${a.y}`}
                fill="none"
                stroke={GOLD_BRIGHT}
                strokeWidth="1"
                strokeDasharray="4 6"
                strokeLinecap="round"
                className="bracket-flow-dash"
              />
            </g>
          )
        }

        if (f.straight) {
          return (
            <path
              key={i}
              d={`M ${a.x} ${a.y} L ${b.x} ${a.y}`}
              fill="none"
              stroke={f.color}
              strokeWidth="2"
              strokeLinecap="round"
              opacity={0.85}
            />
          )
        }

        const group = incomingMap.get(f.to) ?? []
        const isPartOfNormalMerge =
          group.filter(g => !g.straight && !g.merge && !g.final).length === 2

        if (isPartOfNormalMerge) {
          const midX = a.x + STEP
          return (
            <g key={i}>
              <path
                d={`M ${a.x} ${a.y} L ${midX} ${a.y}`}
                fill="none"
                stroke={f.color}
                strokeWidth="2"
                strokeLinejoin="round"
                strokeLinecap="round"
                opacity={0.85}
              />
              <path
                d={`M ${midX} ${a.y} L ${midX} ${b.y}`}
                fill="none"
                stroke={f.color}
                strokeWidth="2"
                strokeLinecap="round"
                opacity={0.85}
              />
              <path
                d={`M ${midX} ${b.y} L ${b.x} ${b.y}`}
                fill="none"
                stroke={MERGE_COLOR}
                strokeWidth="2"
                strokeLinecap="round"
              />
            </g>
          )
        }

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
            opacity={0.85}
          />
        )
      })}
    </svg>
  )
}

/* ===================== MAIN ===================== */
export default function BracketDotaStyle({ data, compact = false }: { data: BracketData; compact?: boolean }) {
  useInjectFonts()
  // Re-measure whenever `data` changes, not just once on mount.
  const { pos, ready, register } = useNodePositions([data])
  const navigate = useNavigate()

  const STACK = CARD_H + ROW_GAP
  const GF_HEADER_WIDTH = CARD_W * 1.3

  const HEADER_COLS = Math.max(
    data.upperBracket.rounds.length,
    data.lowerBracket.rounds.length
  )
  const FINAL_STAGE_GAP = COL_GAP * 1.2

  const FINAL_X =
    HEADER_COLS * CARD_W + (HEADER_COLS - 1) * COL_GAP + FINAL_STAGE_GAP

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
    // FIX: this used to be `(ub.y + lb.y) / 2`. The LB winner sits in a
    // totally separate section far below the UB winner, so averaging the
    // two produced a Y coordinate that lands in the empty gap BETWEEN the
    // two brackets — nowhere near either of them, and nowhere near the
    // "Grand Final" header (which is pinned up near the Upper Bracket row).
    // Anchor to the UB winner's row instead; the LB winner's connector
    // rises up to meet it (see the `riserMerge` flow below).
    return { x: mergeX, y: ub.y }
  }, [pos, ubWinner, lbWinner])

  const elbowPos = useMemo<Record<string, Pos>>(() => {
    const res: Record<string, Pos> = {}
    if (ubWinner) {
      const ub = pos[ubWinner.id]
      if (ub) res[`${ubWinner.id}_ELBOW`] = { x: ub.x + ELBOW, y: ub.y }
    }
    if (lbWinner) {
      const lb = pos[lbWinner.id]
      if (lb) res[`${lbWinner.id}_ELBOW`] = { x: lb.x + ELBOW, y: lb.y }
    }
    return res
  }, [pos, ubWinner, lbWinner])

  const flows = useMemo<Flow[]>(() => {
    const f: Flow[] = []

    const walk = (rounds: Round[], bracket: "upper" | "lower") => {
      rounds.forEach((r, i) => {
        if (r.id.includes("WINNER")) return
        const next = rounds[i + 1]
        if (!next) return

        r.matches.forEach((m, idx) => {
          if (!m.winner) return
          const w = teamById(data.teams, m.winner)
          if (!w) return

          const straight =
            i >= rounds.length - 2 || (bracket === "lower" && i === 0)

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

    if (ubWinner) {
      const team = teamById(data.teams, ubWinner.winner)
      if (team) {
        f.push({ from: ubWinner.id, to: `${ubWinner.id}_ELBOW`, color: team.color, straight: true })
        f.push({ from: `${ubWinner.id}_ELBOW`, to: FINAL_MERGE_ID, color: team.color, merge: true })
      }
    }

    if (lbWinner) {
      const team = teamById(data.teams, lbWinner.winner)
      if (team) {
        f.push({ from: lbWinner.id, to: `${lbWinner.id}_ELBOW`, color: team.color, straight: true })
        f.push({ from: `${lbWinner.id}_ELBOW`, to: FINAL_MERGE_ID, color: team.color, riserMerge: true })
      }
    }

    if (ubWinner && lbWinner) {
      f.push({ from: FINAL_MERGE_ID, to: data.grandFinal.id, color: GOLD, final: true })
    }

    return f
  }, [data, ubWinner, lbWinner])

  const gfLeft = FINAL_X + (GF_HEADER_WIDTH - CARD_W) / 2
  const GF_SCALE = 1.05
  // FIX: transform-origin is "left center", which anchors the scale around
  // the box's OWN vertical center (CARD_H / 2), not CARD_H * GF_SCALE / 2.
  // Using the scaled height here was nudging the final card off the true
  // merge point.
  const gfTop = mergePos ? mergePos.y - CARD_H / 2 : 0

  return (
    <div
      className={compact ? "w-full py-3 relative" : "min-h-screen w-full py-10 px-4 relative"}
      style={
        compact
          ? {}
          : {
              background: `radial-gradient(ellipse 80% 60% at 50% 0%, #10160f 0%, ${VOID} 55%)`,
            }
      }
    >
      <style>{`
        @keyframes bracket-dash-flow {
          to { stroke-dashoffset: -20; }
        }
        .bracket-flow-dash {
          animation: bracket-dash-flow 1.1s linear infinite;
        }
        @keyframes bracket-fade-in {
          from { opacity: 0; }
          to { opacity: 1; }
        }
        .bracket-settle {
          animation: bracket-fade-in 0.35s ease-out;
        }
      `}</style>

      {/* Ambient texture */}
      {!compact && (
        <div className="fixed inset-0 pointer-events-none opacity-[0.35]">
          <div
            className="absolute top-24 left-16 w-[320px] h-80 rounded-full blur-[100px]"
            style={{ background: "rgba(143,191,79,0.14)" }}
          />
          <div
            className="absolute bottom-16 right-16 w-[320px] h-[320px] rounded-full blur-[100px]"
            style={{ background: "rgba(226,87,43,0.14)" }}
          />
          <div
            className="absolute top-1/2 right-1/3 w-[220px] h-[220px] rounded-full blur-[90px]"
            style={{ background: "rgba(212,175,55,0.08)" }}
          />
        </div>
      )}


      <div className="relative max-w-[1400px] mx-auto overflow-x-auto">
        <div className="bracket-root relative" style={{ minWidth: FINAL_X + GF_HEADER_WIDTH }}>
          {/* Only draw connectors once we have a real measured snapshot —
              this is what stops the "floating disconnected card" flash. */}
          {ready && (
            <div className="bracket-settle">
              <Connectors
                pos={{
                  ...pos,
                  ...elbowPos,
                  ...(mergePos ? { [FINAL_MERGE_ID]: mergePos } : {}),
                }}
                flows={flows}
              />
            </div>
          )}

          {/* HEADERS */}
          <div className="flex items-center relative mb-2.5">
            <div style={{ width: HEADER_COLS * CARD_W + (HEADER_COLS - 1) * COL_GAP }}>
              <Header title="Upper Bracket" eyebrow="Winners' Path" accent={MOSS} />
            </div>

            <div
              style={{
                width: FINAL_X - (HEADER_COLS * CARD_W + (HEADER_COLS - 1) * COL_GAP),
              }}
            />

            <div style={{ position: "absolute", left: FINAL_X - CARD_W * 0.25, width: CARD_W * 1.5 }}>
              <Header title="Grand Final" eyebrow="The Aegis" accent={GOLD} />
            </div>
          </div>

          {/* UPPER BRACKET */}
          <div className="flex">
            {data.upperBracket.rounds.map((r, ri) => {
              const cache = new Map<string, number>()
              return (
                <div key={r.id} style={{ marginLeft: ri ? COL_GAP : 0 }}>
                  <p
                    className="text-[10px] text-center mb-2 uppercase"
                    style={{
                      fontFamily: "'JetBrains Mono', monospace",
                      letterSpacing: "0.15em",
                      color: ASH,
                      fontWeight: 600,
                    }}
                  >
                    {r.label}
                  </p>
                  <div
                    className="relative"
                    style={{
                      width: CARD_W,
                      height:
                        Math.max(...data.upperBracket.rounds.map(r => r.matches.length)) * STACK,
                    }}
                  >
                    {r.matches.map((m, mi) => (
                      <div
                        key={m.id}
                        style={{
                          position: "absolute",
                          top: getMatchY(ri, mi, data.upperBracket.rounds, cache, STACK),
                        }}
                      >
                        <MatchNode
                          id={m.id}
                          teams={m.teams?.map(t => teamById(data.teams, t)) ?? [null, null]}
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
          <div style={{ marginTop: STACK * 1.1 }}>
            <div
              style={{
                width:
                  data.lowerBracket.rounds.length * CARD_W +
                  (data.lowerBracket.rounds.length - 1) * COL_GAP,
              }}
            >
              <Header title="Lower Bracket" eyebrow="Last Chance" accent={EMBER} />
            </div>

            <div className="flex">
              {data.lowerBracket.rounds.map((r, ri) => {
                const cache = new Map<string, number>()
                return (
                  <div key={r.id} style={{ marginLeft: ri ? COL_GAP : 0 }}>
                    <p
                      className="text-[10px] text-center mb-2 uppercase"
                      style={{
                        fontFamily: "'JetBrains Mono', monospace",
                        letterSpacing: "0.15em",
                        color: ASH,
                        fontWeight: 600,
                      }}
                    >
                      {r.label}
                    </p>
                    <div
                      className="relative"
                      style={{
                        width: CARD_W,
                        height:
                          Math.max(...data.lowerBracket.rounds.map(r => r.matches.length)) * STACK,
                      }}
                    >
                      {r.matches.map((m, mi) => (
                        <div
                          key={m.id}
                          style={{
                            position: "absolute",
                            top: getMatchY(ri, mi, data.lowerBracket.rounds, cache, STACK),
                          }}
                        >
                          <MatchNode
                            id={m.id}
                            teams={m.teams?.map(t => teamById(data.teams, t)) ?? [null, null]}
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
          {ready && (
            <div
              className="bracket-settle"
              style={{
                position: "absolute",
                left: gfLeft,
                top: gfTop,
                transform: `scale(${GF_SCALE})`,
                transformOrigin: "left center",
              }}
            >
              {/* Aegis glow ring behind the final match */}
              <div
                className="absolute rounded-full pointer-events-none"
                style={{
                  width: CARD_W * 1.6,
                  height: CARD_W * 1.6,
                  left: CARD_W / 2 - (CARD_W * 1.6) / 2,
                  top: CARD_H / 2 - (CARD_W * 1.6) / 2,
                  background: "radial-gradient(circle, rgba(212,175,55,0.16) 0%, rgba(212,175,55,0) 70%)",
                }}
              />
              <MatchNode
                id={data.grandFinal.id}
                isGrandFinal
                teams={data.grandFinal.teams?.map(t => teamById(data.teams, t)) ?? [null, null]}
                winner={data.grandFinal.winner}
                register={register}
              />
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
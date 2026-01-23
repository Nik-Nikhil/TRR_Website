import { useMemo, useRef, useLayoutEffect, useState } from "react"
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
const getResponsiveConstants = () => {
  if (typeof window === 'undefined') {
    return { CARD_W: 200, CARD_H: 80, COL_GAP: 60, ROW_GAP: 30 }
  }
  
  const width = window.innerWidth
  if (width < 640) { // mobile
    return { CARD_W: 160, CARD_H: 70, COL_GAP: 40, ROW_GAP: 25 }
  } else if (width < 1024) { // tablet
    return { CARD_W: 180, CARD_H: 75, COL_GAP: 50, ROW_GAP: 30 }
  } else { // desktop
    return { CARD_W: 220, CARD_H: 90, COL_GAP: 80, ROW_GAP: 40 }
  }
}

const GOLD = "#f5c542"

/* ===================== HELPERS ===================== */
const teamById = (teams: Team[], id?: string | null) =>
  teams.find(t => t.id === id) ?? null

/* ===================== POSITION REGISTRY ===================== */
type Pos = { x: number; y: number; right: number; left: number }

function useNodePositions() {
  const map = useRef(new Map<string, HTMLElement>())
  const [pos, setPos] = useState<Record<string, Pos>>({})
  const [tick, setTick] = useState(0)

  useLayoutEffect(() => {
    const calc = () => {
      const root = document.querySelector(".bracket-container")
      if (!root) return
      const rr = root.getBoundingClientRect()

      const next: Record<string, Pos> = {}
      map.current.forEach((el, id) => {
        const r = el.getBoundingClientRect()
        next[id] = {
          x: r.left - rr.left + r.width / 2,
          y: r.top - rr.top + r.height / 2,
          right: r.right - rr.left,
          left: r.left - rr.left,
        }
      })
      setPos(next)
    }

    const timer = setTimeout(calc, 50)
    window.addEventListener("resize", calc)
    return () => {
      clearTimeout(timer)
      window.removeEventListener("resize", calc)
    }
  }, [tick])

  return {
    pos,
    register: (id: string, el: HTMLElement | null) => {
      if (el) {
        map.current.set(id, el)
        setTick(t => t + 1)
      } else {
        map.current.delete(id)
      }
    },
  }
}

/* ===================== Y POSITION CALCULATOR ===================== */
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

  const y = parentYs.length === 1 ? parentYs[0] : (parentYs[0] + parentYs[1]) / 2
  cache.set(match.id, y)
  return y
}

/* ===================== COMPONENTS ===================== */
function BracketHeader({ title, gradient }: { title: string; gradient: string }) {
  return (
    <div
      className="mb-4 sm:mb-6 lg:mb-8 py-3 sm:py-4 lg:py-5 px-4 sm:px-6 lg:px-8 text-center font-bold rounded-2xl sm:rounded-3xl text-base sm:text-lg lg:text-xl tracking-wider shadow-2xl border border-white/20 backdrop-blur-lg"
      style={{
        backgroundImage: gradient,
        color: "#ffffff",
        boxShadow: "0 12px 40px rgba(0,0,0,0.4), 0 0 0 1px rgba(255,255,255,0.15), inset 0 1px 0 rgba(255,255,255,0.2)",
      }}
    >
      {title}
    </div>
  )
}

function MatchCard({
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
      whileHover={{ scale: 1.08, y: -4 }}
      className="rounded-2xl sm:rounded-3xl bg-gradient-to-br from-slate-800/98 via-slate-900/95 to-slate-950/98 backdrop-blur-xl border-2 border-white/25 shadow-2xl hover:shadow-3xl transition-all duration-500 hover:border-white/40"
      style={{ 
        width: dimensions.CARD_W, 
        height: dimensions.CARD_H,
        boxShadow: isGrandFinal 
          ? "0 25px 50px rgba(245,197,66,0.5), 0 0 0 3px rgba(245,197,66,0.4), inset 0 1px 0 rgba(255,255,255,0.2)"
          : "0 12px 40px rgba(0,0,0,0.5), 0 0 0 2px rgba(255,255,255,0.15), inset 0 1px 0 rgba(255,255,255,0.1)"
      }}
    >
      <div className="p-3 sm:p-4 lg:p-5 flex flex-col gap-2 sm:gap-3 justify-center h-full">
        {teams.map((team, i) => {
          const isWinner = team?.id === winner
          const isSingle = teams.length === 1
          const isDQ = id === "UB_F_M1" && team?.id === "kolly"
          const isGFWinner = isGrandFinal && isWinner

          return (
            <div
              key={i}
              className={`flex items-center gap-3 sm:gap-4 px-3 sm:px-4 py-2 sm:py-3 rounded-xl sm:rounded-2xl transition-all duration-400 border
                ${isWinner || isSingle 
                  ? "bg-gradient-to-r from-white/25 via-white/15 to-white/20 shadow-xl border-white/30 backdrop-blur-lg" 
                  : "bg-white/8 opacity-75 hover:opacity-95 border-white/15 hover:border-white/25"}
                ${isGFWinner ? "ring-3 ring-yellow-400/60 bg-gradient-to-r from-yellow-400/20 via-white/20 to-yellow-400/15" : ""}
                ${isDQ ? "bg-gradient-to-r from-red-900/60 to-red-800/60 border-red-500/40" : ""}
              `}
            >
              {/* Team Color Indicator */}
              <div
                className="w-3 sm:w-4 h-5 sm:h-7 rounded-full shadow-xl border border-white/20"
                style={{ 
                  background: `linear-gradient(135deg, ${team?.color ?? "#64748b"}, ${team?.color ?? "#64748b"}dd)`,
                  boxShadow: `0 0 15px ${team?.color ?? "#64748b"}60, inset 0 1px 0 rgba(255,255,255,0.3)`
                }}
              />

              {/* Team Name */}
              <span className="text-sm sm:text-base font-bold text-white truncate flex-1 tracking-wide">
                {team?.name ?? "TBD"}
              </span>

              {/* Winner Indicators */}
              {isGFWinner && (
                <div className="w-5 sm:w-7 h-5 sm:h-7 rounded-xl bg-gradient-to-br from-yellow-300 via-yellow-400 to-yellow-600 shadow-xl flex items-center justify-center border border-yellow-200/30">
                  <span className="text-sm sm:text-base">👑</span>
                </div>
              )}

              {isDQ && (
                <div className="w-5 sm:w-7 h-5 sm:h-7 rounded-xl bg-gradient-to-br from-red-500 via-red-600 to-red-800 shadow-xl flex items-center justify-center text-sm font-bold text-white border border-red-400/30">
                  DQ
                </div>
              )}
            </div>
          )
        })}
      </div>
    </motion.div>
  )
}

function ConnectionLines({ pos, flows, COL_GAP }: { pos: Record<string, Pos>; flows: any[]; COL_GAP: number }) {
  const STEP = COL_GAP / 2

  return (
    <svg className="absolute inset-0 w-full h-full pointer-events-none">
      <defs>
        <filter id="glow" x="-50%" y="-50%" width="200%" height="200%">
          <feGaussianBlur stdDeviation="4" result="coloredBlur"/>
          <feMerge> 
            <feMergeNode in="coloredBlur"/>
            <feMergeNode in="SourceGraphic"/>
          </feMerge>
        </filter>
        <filter id="strongGlow" x="-50%" y="-50%" width="200%" height="200%">
          <feGaussianBlur stdDeviation="6" result="coloredBlur"/>
          <feMerge> 
            <feMergeNode in="coloredBlur"/>
            <feMergeNode in="SourceGraphic"/>
          </feMerge>
        </filter>
      </defs>
      
      {flows.map((flow, i) => {
        const start = pos[flow.from]
        const end = pos[flow.to]
        if (!start || !end) return null

        const startX = start.right
        const startY = start.y
        const endX = end.left
        const endY = end.y
        const midX = startX + STEP

        const strokeWidth = flow.isGrandFinal ? 5 : 4
        const color = flow.isGrandFinal ? GOLD : flow.color
        const filter = flow.isGrandFinal ? "url(#strongGlow)" : "url(#glow)"

        return (
          <g key={i}>
            {/* Background glow line */}
            <path
              d={`M ${startX} ${startY} L ${midX} ${startY} L ${midX} ${endY} L ${endX} ${endY}`}
              stroke={color}
              strokeWidth={strokeWidth + 2}
              fill="none"
              strokeLinecap="round"
              strokeLinejoin="round"
              opacity={0.3}
              filter={filter}
            />
            
            {/* Main Connection Path */}
            <path
              d={`M ${startX} ${startY} L ${midX} ${startY} L ${midX} ${endY} L ${endX} ${endY}`}
              stroke={color}
              strokeWidth={strokeWidth}
              fill="none"
              strokeLinecap="round"
              strokeLinejoin="round"
              filter={filter}
              opacity={0.95}
            />
            
            {/* Connection dots */}
            <circle
              cx={startX}
              cy={startY}
              r={strokeWidth + 1}
              fill={color}
              filter={filter}
              opacity={0.9}
            />
            <circle
              cx={endX}
              cy={endY}
              r={strokeWidth + 1}
              fill={color}
              filter={filter}
              opacity={0.9}
            />
          </g>
        )
      })}
    </svg>
  )
}

/* ===================== MAIN COMPONENT ===================== */
export default function BracketDotaStyle({ data }: { data: BracketData }) {
  const { pos, register } = useNodePositions()
  const [dimensions, setDimensions] = useState(getResponsiveConstants())

  useLayoutEffect(() => {
    const handleResize = () => {
      setDimensions(getResponsiveConstants())
    }

    window.addEventListener('resize', handleResize)
    return () => window.removeEventListener('resize', handleResize)
  }, [])

  const { CARD_W, CARD_H, COL_GAP, ROW_GAP } = dimensions
  const STACK = CARD_H + ROW_GAP

  const upperRounds = data.upperBracket.rounds
  const lowerRounds = data.lowerBracket.rounds

  const flows = useMemo(() => {
    const connections: any[] = []

    // Upper Bracket connections
    connections.push(
      { from: "UB_R1_M1", to: "UB_R2_M1", color: "#8B5CF6" },
      { from: "UB_R1_M2", to: "UB_R2_M1", color: "#F59E0B" },
      { from: "UB_R1_M3", to: "UB_R2_M2", color: "#EC4899" },
      { from: "UB_R1_M4", to: "UB_R2_M2", color: "#10B981" }
    )

    connections.push(
      { from: "UB_R2_M1", to: "UB_F_M1", color: "#8B5CF6" },
      { from: "UB_R2_M2", to: "UB_F_M1", color: "#EC4899" }
    )

    connections.push(
      { from: "UB_F_M1", to: "UB_WINNER_M1", color: "#8B5CF6" }
    )

    // Lower Bracket connections
    connections.push(
      { from: "LB_R1_M1", to: "LB_R2_M1", color: "#3B82F6" },
      { from: "LB_R1_M2", to: "LB_R2_M2", color: "#EAB308" }
    )

    connections.push(
      { from: "LB_R2_M1", to: "LB_R3_M1", color: "#3B82F6" },
      { from: "LB_R2_M2", to: "LB_R3_M1", color: "#F59E0B" }
    )

    connections.push(
      { from: "LB_R3_M1", to: "LB_WINNER_M1", color: "#F59E0B" }
    )

    // Grand Final connections
    connections.push(
      { from: "UB_WINNER_M1", to: "GF_M1", color: GOLD, isGrandFinal: true },
      { from: "LB_WINNER_M1", to: "GF_M1", color: GOLD, isGrandFinal: true }
    )

    return connections
  }, [data])

  const maxRounds = Math.max(upperRounds.length, lowerRounds.length)
  const grandFinalX = maxRounds * CARD_W + (maxRounds - 1) * COL_GAP + (CARD_W * 0.5)

  return (
    <div className="w-full min-h-screen" style={{ backgroundColor: '#0f172a' }}>
      {/* Background Pattern */}
      <div 
        className="fixed inset-0 opacity-5"
        style={{
          backgroundImage: `radial-gradient(circle at 25% 25%, #3B82F6 0%, transparent 50%), 
                           radial-gradient(circle at 75% 75%, #8B5CF6 0%, transparent 50%)`,
        }}
      />
      
      <div className="w-full overflow-x-auto">
        <div 
          className="bracket-container relative p-4 sm:p-6 lg:p-8 xl:p-12"
          style={{ 
            width: 'fit-content',
            minWidth: '100%'
          }}
        >
          {/* Connection Lines */}
          <ConnectionLines pos={pos} flows={flows} COL_GAP={COL_GAP} />

          {/* Headers */}
          <div className="flex items-start relative mb-4 sm:mb-6 lg:mb-8">
            {/* Upper Bracket Header */}
            <div style={{ width: maxRounds * CARD_W + (maxRounds - 1) * COL_GAP }}>
              <BracketHeader 
                title="Upper Bracket" 
                gradient="linear-gradient(135deg, #667eea 0%, #764ba2 100%)"
              />
            </div>

            {/* Spacer */}
            <div style={{ width: CARD_W + (COL_GAP * 0.5) }} />

            {/* Grand Final Header */}
            <div style={{ width: CARD_W }}>
              <BracketHeader 
                title="Grand Final" 
                gradient={`linear-gradient(135deg, ${GOLD}, #f39c12)`}
              />
            </div>
          </div>

          {/* Upper Bracket */}
          <div className="flex mb-8 sm:mb-12 lg:mb-16">
            {upperRounds.map((round, roundIndex) => {
              const cache = new Map<string, number>()
              return (
                <div key={round.id} style={{ marginLeft: roundIndex ? COL_GAP : 0 }}>
                  <p className="text-xs sm:text-sm text-center mb-3 sm:mb-4 lg:mb-6 text-gray-300 font-semibold">{round.label}</p>
                  <div 
                    className="relative"
                    style={{
                      width: CARD_W,
                      height: Math.max(...upperRounds.map(r => r.matches.length)) * STACK,
                    }}
                  >
                    {round.matches.map((match, matchIndex) => (
                      <div
                        key={match.id}
                        style={{
                          position: "absolute",
                          top: getMatchY(roundIndex, matchIndex, upperRounds, cache, STACK),
                        }}
                      >
                        <MatchCard
                          id={match.id}
                          teams={match.teams?.map(t => teamById(data.teams, t)) ?? [null, null]}
                          winner={match.winner}
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

          {/* Lower Bracket */}
          <div>
            <div style={{ width: maxRounds * CARD_W + (maxRounds - 1) * COL_GAP }}>
              <BracketHeader 
                title="Lower Bracket" 
                gradient="linear-gradient(135deg, #ff6b6b 0%, #feca57 100%)"
              />
            </div>

            <div className="flex">
              {lowerRounds.map((round, roundIndex) => {
                const cache = new Map<string, number>()
                const displayLabel = round.label === "Round 3" ? "LB Final" : round.label
                
                return (
                  <div key={round.id} style={{ marginLeft: roundIndex ? COL_GAP : 0 }}>
                    <p className="text-xs sm:text-sm text-center mb-3 sm:mb-4 lg:mb-6 text-gray-300 font-semibold">{displayLabel}</p>
                    <div 
                      className="relative"
                      style={{
                        width: CARD_W,
                        height: Math.max(...lowerRounds.map(r => r.matches.length)) * STACK,
                      }}
                    >
                      {round.matches.map((match, matchIndex) => (
                        <div
                          key={match.id}
                          style={{
                            position: "absolute",
                            top: getMatchY(roundIndex, matchIndex, lowerRounds, cache, STACK),
                          }}
                        >
                          <MatchCard
                            id={match.id}
                            teams={match.teams?.map(t => teamById(data.teams, t)) ?? [null, null]}
                            winner={match.winner}
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

          {/* Grand Final */}
          <div
            style={{
              position: "absolute",
              left: grandFinalX,
              top: 150 + (window.innerWidth < 640 ? 50 : window.innerWidth < 1024 ? 100 : 150),
              transform: window.innerWidth < 640 ? "scale(1)" : "scale(1.2)",
              transformOrigin: "left center",
            }}
          >
            <MatchCard
              id={data.grandFinal.id}
              teams={data.grandFinal.teams?.map(t => teamById(data.teams, t)) ?? [null, null]}
              winner={data.grandFinal.winner}
              register={register}
              isGrandFinal={true}
              dimensions={{ CARD_W, CARD_H }}
            />
          </div>
        </div>
      </div>
    </div>
  )
}
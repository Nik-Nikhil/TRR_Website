import React, { useMemo, useRef, useLayoutEffect, useState } from 'react'
import { motion } from 'framer-motion'

type Team = { id?: string; name?: string; color?: string }
type Match = { id: string; teams?: (string | null)[]; winner?: string; score?: string; from?: string[] }
type Round = { id?: string; label?: string; matches: Match[] }

// Responsive layout constants (match Bracket_s1)
const CARD_W = 220
const CARD_H = 80
const COL_GAP = 60
const ROW_GAP = 25

function teamById(teams: Team[] = [], id?: string | null) {
  return teams.find(t => t.id === id) ?? null
}

function getMatchY(roundIndex: number, matchIndex: number, rounds: Round[], cache: Map<string, number>, STACK: number) {
  const match = rounds[roundIndex].matches[matchIndex]

  // Winner node → center of column
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

type Pos = { x: number; y: number }

function useNodePositions() {
  const map = useRef(new Map<string, HTMLElement>())
  const [pos, setPos] = useState<Record<string, Pos>>({})

  useLayoutEffect(() => {
    const calc = () => {
      const root = document.querySelector('.bracket-root')
      if (!root) return
      const rr = root.getBoundingClientRect()

      const next: Record<string, Pos> = {}
      map.current.forEach((el, id) => {
        const r = el.getBoundingClientRect()
        next[id] = { x: r.left - rr.left + r.width, y: r.top - rr.top + r.height / 2 }
      })
      setPos(next)
    }

    calc()
    window.addEventListener('resize', calc)
    return () => window.removeEventListener('resize', calc)
  }, [])

  return {
    pos,
    register: (id: string, el: HTMLElement | null) => (el ? map.current.set(id, el) : map.current.delete(id)),
  }
}

function MatchNode({ id, teams, winner, register, isGrandFinal, teamsMeta }: { id: string; teams: (Team | null)[]; winner?: string; isGrandFinal?: boolean; register: (id: string, el: HTMLElement | null) => void; teamsMeta?: Team[] }) {
  return (
    <motion.div ref={el => register(id, el)} whileHover={{ scale: 1.03, boxShadow: '0 8px 30px rgba(0,0,0,0.5)' }} className="rounded-lg border border-slate-500/40 bg-slate-800 shadow-xl overflow-hidden" style={{ width: CARD_W, height: CARD_H }}>
      <div className="flex flex-col h-full divide-y divide-slate-600/30">
        {teams.map((t, i) => {
          const win = t?.id === winner
          const isSingle = teams.length === 1

          return (
            <div key={i} className={`flex items-center gap-3 px-4 py-3 transition-all ${win || isSingle ? 'bg-slate-700/60' : 'bg-slate-800/80'}`}>
              <div className="w-1 h-8 rounded-full shrink-0" style={{ background: t?.color ?? '#64748b' }} />
              <span className={`text-base font-bold flex-1 ${win || isSingle ? 'text-white' : 'text-slate-400'}`}>{t?.name ?? 'TBD'}</span>
              {win && isGrandFinal && (
                <div className="relative group">
                  <div className="w-8 h-8 rounded-lg bg-linear-to-br from-yellow-400 to-yellow-600 shadow-lg shadow-yellow-500/50 flex items-center justify-center text-base">🏆</div>
                </div>
              )}
            </div>
          )
        })}
      </div>
    </motion.div>
  )
}

type Flow = { from: string; to: string; color: string; straight?: boolean; merge?: boolean; final?: boolean }

function Connectors({ pos, flows }: { pos: Record<string, Pos>; flows: Flow[] }) {
  const STEP = COL_GAP / 2
  const MERGE_COLOR = '#6b7280'

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

        if (f.merge) {
          return <path key={i} d={`M ${a.x} ${a.y} L ${b.x} ${b.y}`} fill="none" stroke={f.color} strokeWidth="3" />
        }

        if (f.final) {
          return <path key={i} d={`M ${a.x} ${a.y} L ${b.x} ${a.y}`} fill="none" stroke={f.color} strokeWidth="4" strokeLinecap="round" style={{ filter: 'drop-shadow(0 0 8px #f5c542)' }} />
        }

        if (f.straight) {
          return <path key={i} d={`M ${a.x} ${a.y} L ${b.x} ${a.y}`} fill="none" stroke={f.color} strokeWidth="3" />
        }

        const group = incomingMap.get(f.to) ?? []
        const isPartOfNormalMerge = group.filter(g => !g.straight && !g.merge && !g.final).length === 2

        if (isPartOfNormalMerge) {
          const midX = a.x + STEP
          return (
            <g key={i}>
              <path d={`M ${a.x} ${a.y} L ${midX} ${a.y}`} fill="none" stroke={f.color} strokeWidth="3" strokeLinejoin="round" strokeLinecap="round" />
              <path d={`M ${midX} ${a.y} L ${midX} ${b.y}`} fill="none" stroke={f.color} strokeWidth="3" strokeLinecap="round" />
              <path d={`M ${midX} ${b.y} L ${b.x} ${b.y}`} fill="none" stroke={MERGE_COLOR} strokeWidth="3" strokeLinecap="round" />
            </g>
          )
        }

        return <path key={i} d={`M ${a.x} ${a.y} L ${a.x + STEP} ${a.y} L ${a.x + STEP} ${b.y} L ${b.x} ${b.y}`} fill="none" stroke={f.color} strokeWidth="3" />
      })}
    </svg>
  )
}

export default function InteractiveBracket({ data, compact = false }: { data: any; compact?: boolean }) {
  // Normalize data to rounds similar to Bracket_s1
  const rounds: Round[] = useMemo(() => {
    if (!data) return []
    if (data.upperBracket || data.lowerBracket) {
      const u = data.upperBracket?.rounds ?? []
      const l = data.lowerBracket?.rounds ?? []
      const combined: Round[] = []
      u.forEach((r: any) => combined.push({ id: r.id, label: r.label, matches: r.matches.map((m: any) => ({ id: m.id, teams: m.teams, winner: m.winner, from: m.from })) }))
      if (l.length) {
        combined.push({ id: '__lower__', label: 'Lower Bracket', matches: [] })
        l.forEach((r: any) => combined.push({ id: r.id, label: r.label, matches: r.matches.map((m: any) => ({ id: m.id, teams: m.teams, winner: m.winner, from: m.from })) }))
      }
      if (data.grandFinal) combined.push({ id: data.grandFinal.id, label: 'Grand Final', matches: [data.grandFinal] })
      return combined
    }
    if (Array.isArray(data.rounds)) return data.rounds.map((r: any) => ({ id: r.id, label: r.label, matches: r.matches }))
    if (Array.isArray(data)) return [{ id: 'r0', label: 'Bracket', matches: data }]
    return []
  }, [data])

  const teamsMeta: Team[] = data?.teams ?? []
  const { pos, register } = useNodePositions()

  const STACK = CARD_H + ROW_GAP

  // build flows similar to Bracket_s1
  const flows = useMemo(() => {
    const f: Flow[] = []
    rounds.forEach((r, ri) => {
      const next = rounds[ri + 1]
      if (!next) return
      r.matches.forEach((m, mi) => {
        if (!m.winner) return
        const team = teamById(teamsMeta as Team[], m.winner)
        const color = team?.color ?? '#6b7280'
        const to = next.matches[Math.floor(mi / 2)]?.id
        if (to) f.push({ from: m.id, to, color, straight: ri >= rounds.length - 2 })
      })
    })
    // grand final link if present
    const lastRound = rounds[rounds.length - 1]
    if (lastRound && lastRound.matches.length === 1 && rounds.length >= 2) {
      const prev = rounds[rounds.length - 2]
      const src = prev.matches[0]
      if (src) f.push({ from: src.id, to: lastRound.matches[0].id, color: '#f5c542', final: true })
    }
    return f
  }, [rounds, teamsMeta])

  const [selected, setSelected] = useState<Match | null>(null)

  return (
    <div className={compact ? "w-full py-6" : "min-h-screen w-full bg-linear-to-br from-slate-950 via-slate-900 to-slate-950 py-24 px-6"}>
      {!compact && (
        <div className="fixed inset-0 pointer-events-none opacity-30">
          <div className="absolute top-20 left-20 w-96 h-96 bg-purple-500/20 rounded-full blur-3xl" />
          <div className="absolute bottom-20 right-20 w-96 h-96 bg-pink-500/20 rounded-full blur-3xl" />
        </div>
      )}

      <div className="relative max-w-[1800px] mx-auto">
        <div className="bracket-root relative">
          <Connectors pos={pos} flows={flows} />

          <div className="flex">
            {rounds.map((r, ri) => {
              const cache = new Map<string, number>()
              const colHeight = Math.max(...rounds.map(rr => rr.matches.length)) * STACK
              return (
                <div key={r.id ?? ri} style={{ marginLeft: ri ? COL_GAP : 0 }}>
                  <p className="text-sm text-center mb-4 text-slate-300 font-bold uppercase tracking-wider">{r.label}</p>
                  <div className="relative" style={{ width: CARD_W, height: colHeight }}>
                    {r.matches.map((m, mi) => (
                      <div key={m.id} style={{ position: 'absolute', top: getMatchY(ri, mi, rounds, cache, STACK) }}>
                        <MatchNode id={m.id} teams={(m.teams ?? []).map((t: string | null) => teamById(teamsMeta, t))} winner={m.winner} register={register} teamsMeta={teamsMeta} />
                      </div>
                    ))}
                  </div>
                </div>
              )
            })}
          </div>

          {/* Modal */}
          {selected && (
            <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60">
              <div className="bg-[#06121a] border border-white/6 rounded-lg p-6 max-w-lg w-full">
                <div className="flex items-start justify-between">
                  <h3 className="text-lg font-bold">Match {selected.id}</h3>
                  <button onClick={() => setSelected(null)} className="text-slate-300">✕</button>
                </div>
                <div className="mt-4 space-y-3">
                  <div className="text-sm text-slate-200">Teams: {(selected.teams ?? []).filter(Boolean).join(' vs ') || 'TBD'}</div>
                  <div className="text-sm text-slate-200">Winner: {selected.winner ?? 'TBD'}</div>
                  <div className="text-sm text-slate-200">Score: {selected.score ?? '—'}</div>
                </div>
                <div className="mt-6 flex justify-end">
                  <button onClick={() => setSelected(null)} className="px-4 py-2 rounded-md bg-linear-to-br from-slate-700 to-slate-800 border border-white/6 text-sm text-white">Close</button>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

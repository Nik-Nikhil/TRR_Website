/* eslint-disable react-refresh/only-export-components */
import { useMemo, useRef, useLayoutEffect, useState, useCallback, useEffect } from "react"
import { createPortal } from "react-dom"
import { motion, AnimatePresence } from "framer-motion"
import { useNavigate } from "react-router-dom"

/* ===================== TYPES ===================== */
type Team = { id: string; captain: string; color: string }

/* ===================== HERO IMAGE HELPER ===================== */
function getHeroImageUrl(heroName: string): string {
  const nameMap: Record<string, string> = {
    "Anti-Mage": "antimage",
    "Axe": "axe",
    "Bane": "bane",
    "Bloodseeker": "bloodseeker",
    "Crystal Maiden": "crystal_maiden",
    "Drow Ranger": "drow_ranger",
    "Earthshaker": "earthshaker",
    "Juggernaut": "juggernaut",
    "Mirana": "mirana",
    "Morphling": "morphling",
    "Shadow Fiend": "nevermore",
    "Phantom Lancer": "phantom_lancer",
    "Puck": "puck",
    "Pudge": "pudge",
    "Razor": "razor",
    "Sand King": "sand_king",
    "Storm Spirit": "storm_spirit",
    "Sven": "sven",
    "Tiny": "tiny",
    "Vengeful Spirit": "vengefulspirit",
    "Windranger": "windrunner",
    "Zeus": "zuus",
    "Kunkka": "kunkka",
    "Lina": "lina",
    "Lion": "lion",
    "Shadow Shaman": "shadow_shaman",
    "Slardar": "slardar",
    "Tidehunter": "tidehunter",
    "Witch Doctor": "witch_doctor",
    "Lich": "lich",
    "Riki": "riki",
    "Enigma": "enigma",
    "Tinker": "tinker",
    "Sniper": "sniper",
    "Necrophos": "necrolyte",
    "Warlock": "warlock",
    "Beastmaster": "beastmaster",
    "Queen of Pain": "queenofpain",
    "Venomancer": "venomancer",
    "Faceless Void": "faceless_void",
    "Wraith King": "skeleton_king",
    "Death Prophet": "death_prophet",
    "Phantom Assassin": "phantom_assassin",
    "Pugna": "pugna",
    "Templar Assassin": "templar_assassin",
    "Viper": "viper",
    "Luna": "luna",
    "Dragon Knight": "dragon_knight",
    "Dazzle": "dazzle",
    "Clockwerk": "rattletrap",
    "Leshrac": "leshrac",
    "Nature's Prophet": "furion",
    "Lifestealer": "life_stealer",
    "Dark Seer": "dark_seer",
    "Clinkz": "clinkz",
    "Omniknight": "omniknight",
    "Enchantress": "enchantress",
    "Huskar": "huskar",
    "Night Stalker": "night_stalker",
    "Broodmother": "broodmother",
    "Bounty Hunter": "bounty_hunter",
    "Weaver": "weaver",
    "Jakiro": "jakiro",
    "Batrider": "batrider",
    "Chen": "chen",
    "Spectre": "spectre",
    "Ancient Apparition": "ancient_apparition",
    "Doom": "doom_bringer",
    "Ursa": "ursa",
    "Spirit Breaker": "spirit_breaker",
    "Gyrocopter": "gyrocopter",
    "Alchemist": "alchemist",
    "Invoker": "invoker",
    "Silencer": "silencer",
    "Outworld Destroyer": "obsidian_destroyer",
    "Lycan": "lycan",
    "Brewmaster": "brewmaster",
    "Shadow Demon": "shadow_demon",
    "Lone Druid": "lone_druid",
    "Chaos Knight": "chaos_knight",
    "Meepo": "meepo",
    "Treant Protector": "treant",
    "Ogre Magi": "ogre_magi",
    "Undying": "undying",
    "Rubick": "rubick",
    "Disruptor": "disruptor",
    "Nyx Assassin": "nyx_assassin",
    "Naga Siren": "naga_siren",
    "Keeper of the Light": "keeper_of_the_light",
    "Io": "wisp",
    "Visage": "visage",
    "Slark": "slark",
    "Medusa": "medusa",
    "Troll Warlord": "troll_warlord",
    "Centaur Warrunner": "centaur",
    "Magnus": "magnataur",
    "Timbersaw": "shredder",
    "Bristleback": "bristleback",
    "Tusk": "tusk",
    "Skywrath Mage": "skywrath_mage",
    "Abaddon": "abaddon",
    "Elder Titan": "elder_titan",
    "Legion Commander": "legion_commander",
    "Techies": "techies",
    "Ember Spirit": "ember_spirit",
    "Earth Spirit": "earth_spirit",
    "Underlord": "abyssal_underlord",
    "Terrorblade": "terrorblade",
    "Phoenix": "phoenix",
    "Oracle": "oracle",
    "Winter Wyvern": "winter_wyvern",
    "Arc Warden": "arc_warden",
    "Monkey King": "monkey_king",
    "Dark Willow": "dark_willow",
    "Pangolier": "pangolier",
    "Grimstroke": "grimstroke",
    "Hoodwink": "hoodwink",
    "Void Spirit": "void_spirit",
    "Snapfire": "snapfire",
    "Mars": "mars",
    "Dawnbreaker": "dawnbreaker",
    "Marci": "marci",
    "Primal Beast": "primal_beast",
    "Muerta": "muerta",
  }

  const key = nameMap[heroName] || heroName.toLowerCase().replace(/['\s]/g, '_')
  return `https://cdn.cloudflare.steamstatic.com/apps/dota2/images/dota_react/heroes/${key}.png`
}

type GameDetail = {
  game: number
  duration: string
  winner: string
  radiant: string
  dire: string
  radiantScore: number
  direScore: number
  radiantHeroes?: string[]
  direHeroes?: string[]
  dotabuffUrl?: string
}

type Match = {
  id: string
  teams: string[]
  winner?: string
  games?: GameDetail[]
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

/* ===================== LAYOUT CONSTANTS ===================== */
const GOLD = "#f5c542"
const CARD_W       = 148
const CARD_H       = 44
const COL_GAP      = 40
const COL_STRIDE   = CARD_W + COL_GAP
const STACK        = CARD_H + 18

/* ===================== HELPERS ===================== */
const teamById = (teams: Team[], id?: string) =>
  teams.find(t => t.id === id) ?? null

/* ===================== POSITION REGISTRY ===================== */
type Pos = { x: number; y: number; lx: number }

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
          x:  r.left - rr.left + r.width,
          lx: r.left - rr.left,
          y:  r.top  - rr.top  + r.height / 2,
        }
      })
      setPos(next)
    }

    // Initial calculation
    calc()
    
    // Multiple fallback calculations to ensure connectors are positioned correctly
    const raf = requestAnimationFrame(() => requestAnimationFrame(calc))
    const tid1 = window.setTimeout(calc, 50)
    const tid2 = window.setTimeout(calc, 100)
    const tid3 = window.setTimeout(calc, 200)
    const tid4 = window.setTimeout(calc, 400)
    
    document.fonts?.ready?.then(calc).catch(() => {})
    window.addEventListener("resize", calc)

    return () => {
      cancelAnimationFrame(raf)
      window.clearTimeout(tid1)
      window.clearTimeout(tid2)
      window.clearTimeout(tid3)
      window.clearTimeout(tid4)
      window.removeEventListener("resize", calc)
    }
  }, [])

  return {
    pos,
    register: (id: string, el: HTMLElement | null) =>
      el ? map.current.set(id, el) : map.current.delete(id),
  }
}

/* ===================== MATCH INFO TOOLTIP ===================== */
function HeroPill({ name, won }: { name: string; won: boolean }) {
  return (
    <div
      className="inline-flex items-center rounded shrink-0"
      style={{
        border: `2px solid ${won ? "#16a34a" : "#dc2626"}`,
        overflow: "hidden",
        height: 28,
        width: 28,
        opacity: 1,
      }}
      title={name}
    >
      <img
        src={getHeroImageUrl(name)}
        alt={name}
        className="w-full h-full object-cover"
        style={{ display: "block" }}
      />
    </div>
  )
}

function MatchInfoTooltip({
  games,
  teams,
}: {
  games: GameDetail[]
  teams: (Team | null)[]
}) {
  const [open, setOpen] = useState(false)
  const btnRef = useRef<HTMLButtonElement>(null)
  const [coords, setCoords] = useState({ top: 0, left: 0, openUp: false })

  useEffect(() => {
    if (!open || !btnRef.current) return
    const r = btnRef.current.getBoundingClientRect()
    const popH = games.length * 70
    const popW = 580
    const openUp = r.bottom + popH > window.innerHeight - 20
    
    let leftPos = r.left + window.scrollX - 10
    if (leftPos + popW > window.innerWidth) {
      leftPos = r.right + window.scrollX - popW + 10
    }
    
    setCoords({
      top: openUp ? r.top + window.scrollY - popH - 4 : r.bottom + window.scrollY + 4,
      left: leftPos,
      openUp,
    })
  }, [open, games.length])

  useEffect(() => {
    if (!open) return
    const handler = (e: MouseEvent) => {
      if (btnRef.current && !btnRef.current.contains(e.target as Node)) setOpen(false)
    }
    document.addEventListener("mousedown", handler)
    return () => document.removeEventListener("mousedown", handler)
  }, [open])

  const t0 = teams[0]; const t1 = teams[1]

  const popover = (
    <AnimatePresence>
      {open && (
        <motion.div
          initial={{ opacity: 0, y: coords.openUp ? 4 : -4, scale: 0.97 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, scale: 0.97 }}
          transition={{ duration: 0.12 }}
          onMouseDown={e => e.stopPropagation()}
          style={{
            position: "absolute",
            top: coords.top,
            left: coords.left,
            width: 580,
            background: "#0d1117",
            border: "1px solid rgba(255,255,255,0.1)",
            borderRadius: 8,
            boxShadow: "0 20px 60px rgba(0,0,0,0.95)",
            zIndex: 99999,
            pointerEvents: "auto",
            overflow: "hidden",
          }}
        >
          <div>
            {games.map(g => {
              const team0isRadiant = t0?.id === g.radiant
              const team0Score = team0isRadiant ? g.radiantScore : g.direScore
              const team1Score = team0isRadiant ? g.direScore : g.radiantScore
              const t0won = g.winner === t0?.id
              const t1won = g.winner === t1?.id
              const radiantHeroes = g.radiantHeroes ?? []
              const direHeroes = g.direHeroes ?? []
              const t0heroes = team0isRadiant ? radiantHeroes : direHeroes
              const t1heroes = team0isRadiant ? direHeroes : radiantHeroes

              return (
                <div key={g.game}
                  style={{ borderBottom: games.length > 1 ? "1px solid rgba(255,255,255,0.04)" : "none" }}>

                  <div className="flex items-center justify-between px-3 py-2"
                    style={{ background: "rgba(255,255,255,0.03)", borderBottom: "1px solid rgba(255,255,255,0.06)" }}>
                    <span className="text-[9px] text-slate-400 font-bold tracking-wider">GAME {g.game}</span>
                    {g.dotabuffUrl && (
                      <a
                        href={g.dotabuffUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center gap-1.5 text-[9px] font-semibold hover:opacity-80 transition-opacity"
                        style={{ color: "#6e90b0" }}
                        onClick={(e) => e.stopPropagation()}
                      >
                        <img
                          src="/icons/dotabuff.png"
                          alt="Dotabuff"
                          className="shrink-0"
                          style={{ width: 12, height: 12 }}
                        />
                        <span>Show Match</span>
                      </a>
                    )}
                  </div>

                  <div className="flex items-center justify-between px-3 pt-2 pb-1"
                    style={{ background: "rgba(255,255,255,0.02)" }}>
                    
                    <div className="flex-1 flex justify-center">
                      <span className="text-[11px] font-bold" style={{ color: t0?.color ?? "#888" }}>
                        {t0?.captain ?? "TBD"}
                      </span>
                    </div>

                    <div className="flex items-center gap-2 px-4">
                      <span className="text-[15px] font-black tabular-nums" style={{ color: "#f0ede6" }}>
                        {team0Score}
                      </span>
                      <span className="text-[11px] text-slate-500 font-bold">:</span>
                      <span className="text-[15px] font-black tabular-nums" style={{ color: "#f0ede6" }}>
                        {team1Score}
                      </span>
                    </div>

                    <div className="flex-1 flex justify-center">
                      <span className="text-[11px] font-bold" style={{ color: t1?.color ?? "#888" }}>
                        {t1?.captain ?? "TBD"}
                      </span>
                    </div>
                  </div>

                  <div className="flex items-center gap-2 px-3 py-2.5"
                    style={{ background: "rgba(255,255,255,0.02)" }}>
                    
                    <span className="text-[9px] font-black rounded px-1.5 shrink-0"
                      style={{
                        background: t0won ? "#16a34a" : "#dc2626",
                        color: "#fff", lineHeight: "20px", height: 20,
                        display: "inline-flex", alignItems: "center",
                      }}>
                      {t0won ? "W" : "L"}
                    </span>

                    <div className="shrink-0" title={team0isRadiant ? "Radiant" : "Dire"}>
                      <img
                        src={team0isRadiant ? "/Radiant_icon.webp" : "/Dire_icon.webp"}
                        alt={team0isRadiant ? "Radiant" : "Dire"}
                        style={{ width: 18, height: 18, display: "block" }}
                      />
                    </div>

                    <div className="flex items-center gap-1 shrink-0">
                      {t0heroes.map((h, hi) => <HeroPill key={hi} name={h} won={t0won} />)}
                    </div>

                    <span className="text-[10px] text-slate-400 font-mono shrink-0 px-2 mx-auto">
                      {g.duration}
                    </span>

                    <div className="flex items-center gap-1 shrink-0">
                      {t1heroes.map((h, hi) => <HeroPill key={hi} name={h} won={t1won} />)}
                    </div>

                    <div className="shrink-0" title={team0isRadiant ? "Dire" : "Radiant"}>
                      <img
                        src={team0isRadiant ? "/Dire_icon.webp" : "/Radiant_icon.webp"}
                        alt={team0isRadiant ? "Dire" : "Radiant"}
                        style={{ width: 18, height: 18, display: "block" }}
                      />
                    </div>

                    <span className="text-[9px] font-black rounded px-1.5 shrink-0"
                      style={{
                        background: t1won ? "#16a34a" : "#dc2626",
                        color: "#fff", lineHeight: "20px", height: 20,
                        display: "inline-flex", alignItems: "center",
                      }}>
                      {t1won ? "W" : "L"}
                    </span>

                  </div>

                </div>
              )
            })}
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  )

  return (
    <div className="relative" style={{ zIndex: 60 }}>
      <button
        ref={btnRef}
        onMouseDown={e => { e.preventDefault(); e.stopPropagation(); setOpen(v => !v) }}
        className="flex items-center justify-center rounded-full focus:outline-none"
        style={{
          width: 13, height: 13,
          background: open ? "rgba(245,197,66,0.2)" : "rgba(56,189,248,0.12)",
          color: open ? GOLD : "#38bdf8",
          border: `1px solid ${open ? "rgba(245,197,66,0.45)" : "rgba(56,189,248,0.45)"}`,
          fontSize: 8, fontWeight: 700, lineHeight: 1,
          flexShrink: 0,
        }}
      >i</button>
      {createPortal(popover, document.body)}
    </div>
  )
}

/* ===================== MATCH NODE ===================== */
function MatchNode({
  id, teams, winner, register, isGrandFinal, cardH, visualW, games,
}: {
  id: string
  teams: (Team | null)[]
  winner?: string
  isGrandFinal?: boolean
  cardH: number
  visualW: number
  register: (id: string, el: HTMLElement | null) => void
  games?: GameDetail[]
}) {
  const slotH = Math.floor((cardH - 12) / 2)
  const hasGames = (games?.length ?? 0) > 0

  const seriesWins = useMemo(() => {
    const map: Record<string, number> = {}
    games?.forEach(g => { map[g.winner] = (map[g.winner] ?? 0) + 1 })
    return map
  }, [games])

  return (
    <motion.div
      ref={el => register(id, el)}
      initial={{ opacity: 0, x: -8 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.35, ease: "easeOut" }}
      whileHover={{ scale: 1.03, y: -1 }}
      className="rounded-lg cursor-default relative"
      style={{
        width: visualW,
        height: cardH,
        background: "linear-gradient(160deg,#272b35 0%,#1a1d24 100%)",
        border: isGrandFinal ? "1px solid rgba(245,197,66,0.6)" : "1px solid rgba(255,255,255,0.09)",
        boxShadow: isGrandFinal
          ? "0 0 20px rgba(245,197,66,0.2), 0 0 6px rgba(245,197,66,0.1), 0 4px 12px rgba(0,0,0,0.5)"
          : "0 4px 14px rgba(0,0,0,0.55)",
        overflow: "visible",
      }}
    >
      <div className="flex flex-col h-full" style={{ paddingTop: 4, paddingBottom: 4, gap: 2, paddingRight: hasGames ? 20 : 4, paddingLeft: 4 }}>
        {teams.map((t, i) => {
          const win = Boolean(t?.id && t.id === winner)
          const lose = winner && !win
          const highlight = win
          const score = hasGames ? (seriesWins[t?.id ?? ""] ?? 0) : null

          return (
            <div
              key={i}
              className={`flex items-center gap-1 px-2 rounded-md transition-all ${
                win && !isGrandFinal ? "hover:shadow-[0_0_18px_rgba(34,197,94,0.85)]" : ""
              } ${
                lose && !isGrandFinal ? "hover:shadow-[0_0_18px_rgba(239,68,68,0.8)]" : ""
              } ${
                isGrandFinal && win ? "hover:shadow-[0_0_22px_rgba(245,197,66,0.95)]" : ""
              } ${
                isGrandFinal && lose ? "hover:shadow-[0_0_18px_rgba(159,166,173,0.9)]" : ""
              }`}
              style={{
                flex: 1,
                height: slotH,
                background: isGrandFinal && win
                  ? "linear-gradient(90deg, rgba(245,197,66,0.18) 0%, rgba(245,197,66,0.06) 100%)"
                  : highlight ? "rgba(255,255,255,0.07)" : "transparent",
                boxShadow: isGrandFinal && win
                  ? "inset 0 0 12px rgba(245,197,66,0.15)"
                  : win ? `0 0 8px ${t?.color ?? "#fff"}33` : "none",
              }}
            >
              <span className="rounded-full shrink-0" style={{
                width: 3, height: 13,
                background: t?.color ?? "#444",
              }} />

              <span
                className="text-[9px] flex-1 font-semibold truncate"
                style={{
                  color: isGrandFinal && win
                    ? GOLD
                    : isGrandFinal && !!lose
                    ? "#5a6270"
                    : highlight ? "#f0ede6" : "#8a9190",
                  textShadow: isGrandFinal && win
                    ? "0 0 6px rgba(245,197,66,0.6)"
                    : "none",
                }}
              >
                {t?.captain ?? "TBD"}
              </span>

              {score !== null && (
                <span
                  className="text-[11px] font-black shrink-0 ml-1 tabular-nums"
                  style={{
                    color: isGrandFinal && win
                      ? GOLD
                      : win ? "#f0ede6" : "#3d4755",
                    minWidth: 10,
                    textAlign: "right",
                    textShadow: isGrandFinal && win
                      ? "0 0 8px rgba(245,197,66,0.8)"
                      : "none",
                  }}
                >
                  {score}
                </span>
              )}
            </div>
          )
        })}
      </div>

      {hasGames && (
        <div className="absolute flex items-center justify-center"
          style={{ right: 4, top: 0, bottom: 0 }}>
          <MatchInfoTooltip games={games!} teams={teams} />
        </div>
      )}
    </motion.div>
  )
}

/* ===================== CONNECTORS ===================== */
type Flow = {
  from: string; to: string; color: string
  toGF?: boolean
}

function Connectors({ pos, flows }: { pos: Record<string, Pos>; flows: Flow[] }) {
  const STEP = COL_GAP / 2

  return (
    <svg className="absolute inset-0 pointer-events-none" style={{ width: "100%", height: "100%", overflow: "visible" }}>
      {flows.map((f, i) => {
        const a = pos[f.from], b = pos[f.to]
        if (!a || !b) return null

        if (f.toGF) {
          const midX = a.x + (b.lx - a.x) / 2
          const d = `M ${a.x} ${a.y} L ${midX} ${a.y} L ${midX} ${b.y} L ${b.lx} ${b.y}`
          return (
            <path
              key={i}
              d={d}
              fill="none"
              stroke={GOLD}
              strokeWidth={2}
              strokeLinecap="round"
              opacity={0.6}
            />
          )
        }

        if (Math.abs(a.y - b.y) < 2) {
          return (
            <path
              key={i}
              d={`M ${a.x} ${a.y} L ${b.lx} ${b.y}`}
              fill="none"
              stroke={f.color}
              strokeWidth={1.8}
              strokeLinecap="round"
              opacity={0.9}
            />
          )
        }

        const d = `M ${a.x} ${a.y} L ${a.x+STEP} ${a.y} L ${a.x+STEP} ${b.y} L ${b.lx} ${b.y}`
        return (
          <path
            key={i}
            d={d}
            fill="none"
            stroke={f.color}
            strokeWidth={1.8}
            strokeLinecap="round"
            opacity={0.9}
          />
        )
      })}
    </svg>
  )
}

/* ===================== MAIN COMPONENT ===================== */
export default function Bracket_s2({ data }: { data: Season2Data }) {
  const { pos, register } = useNodePositions()
  const navigate = useNavigate()

  const rounds = data.knockout.rounds
  const maxMatches = Math.max(...rounds.map(r => r.matches.length))

  // Layout dimensions
  const PANEL_W = rounds.length * COL_STRIDE + CARD_W + 24
  const PANEL_H = maxMatches * STACK + 80
  const GF_COL_GAP = 40
  const GF_CARD_H = Math.round(CARD_H * 1.15)
  const GF_CARD_W_VAL = Math.round(CARD_W * 1.15)
  const GF_PANEL_X = PANEL_W + GF_COL_GAP
  const GF_PANEL_W = GF_CARD_W_VAL + 32
  const GF_CARD_LEFT = GF_PANEL_X + 16
  const GF_CARD_TOP = Math.round((PANEL_H - GF_CARD_H) / 2)
  const TOTAL_W = GF_PANEL_X + GF_PANEL_W + 12
  const TOTAL_H = PANEL_H + 20

  const flows = useMemo<Flow[]>(() => {
    const f: Flow[] = []

    rounds.forEach((r, ri) => {
      const next = rounds[ri + 1]
      if (!next) return
      r.matches.forEach((m, mi) => {
        if (!m.winner) return
        const w = teamById(data.teams, m.winner)
        if (!w) return
        
        // For Season 2 knockout: QF_M1 → SF_M1, QF_M2 → SF_M2
        // Instead of Math.floor(mi / 2), we map directly by index
        const to = next.matches[mi] ?? next.matches[Math.floor(mi / 2)]
        if (to) {
          f.push({ from: m.id, to: to.id, color: w.color })
        }
      })
    })

    // Last round to GF
    const lastRound = rounds[rounds.length - 1]
    lastRound.matches.forEach(m => {
      if (!m.winner) return
      const w = teamById(data.teams, m.winner)
      if (w) {
        f.push({ from: m.id, to: data.grandFinal.id, color: w.color, toGF: true })
      }
    })

    return f
  }, [data, rounds])

  return (
    <div className="w-full min-h-screen flex items-center justify-center px-4 py-6"
      style={{ background: "linear-gradient(135deg,#0d0f14 0%,#111520 50%,#0d0f14 100%)" }}>
      
      {/* External Navigation Buttons */}
      <button
        onClick={() => navigate('/seasons?season=2')}
        className="fixed left-6 top-24 z-50 px-3 sm:px-4 py-1.5 sm:py-2 rounded-full text-[0.65rem] sm:text-[0.72rem] font-semibold uppercase tracking-[0.12em] bg-gradient-to-tr from-white/90 via-zinc-200 to-zinc-300 text-[#050608] shadow-[0_8px_26px_rgba(2,6,23,0.55)] hover:brightness-105 transition-all duration-200 backdrop-blur-sm border border-white/10 cursor-pointer"
        type="button"
      >
        ← Back
      </button>

      <button
        onClick={() => navigate('/group-stage/2')}
        className="fixed left-32 top-24 z-50 px-3 sm:px-4 py-1.5 sm:py-2 rounded-full text-[0.65rem] sm:text-[0.72rem] font-semibold uppercase tracking-[0.12em] bg-gradient-to-tr from-white/90 via-zinc-200 to-zinc-300 text-[#050608] shadow-[0_8px_26px_rgba(2,6,23,0.55)] hover:brightness-105 transition-all duration-200 backdrop-blur-sm border border-white/10 cursor-pointer"
        type="button"
      >
        Group Stage
      </button>

      <button
        onClick={() => navigate('/playoff/1')}
        className="fixed right-44 top-24 z-50 px-3 sm:px-4 py-1.5 sm:py-2 rounded-full text-[0.65rem] sm:text-[0.72rem] font-semibold uppercase tracking-[0.12em] bg-gradient-to-tr from-white/90 via-zinc-200 to-zinc-300 text-[#050608] shadow-[0_8px_26px_rgba(2,6,23,0.55)] hover:brightness-105 transition-all duration-200 backdrop-blur-sm border border-white/10 cursor-pointer"
        type="button"
      >
        ← Prev Season
      </button>

      <button
        onClick={() => navigate('/playoff/3')}
        className="fixed right-6 top-24 z-50 px-3 sm:px-4 py-1.5 sm:py-2 rounded-full text-[0.65rem] sm:text-[0.72rem] font-semibold uppercase tracking-[0.12em] bg-gradient-to-tr from-white/90 via-zinc-200 to-zinc-300 text-[#050608] shadow-[0_8px_26px_rgba(2,6,23,0.55)] hover:brightness-105 transition-all duration-200 backdrop-blur-sm border border-white/10 cursor-pointer"
        type="button"
      >
        Next Season →
      </button>

      <div style={{
        position: "relative", maxWidth: "fit-content",
        border: "2px solid rgba(255,255,255,0.15)", borderRadius: 16,
        background: "rgba(255,255,255,0.008)", boxShadow: "0 0 60px rgba(0,0,0,0.6)",
        overflow: "visible",
      }}>
        {/* Title */}
        <div className="flex items-center justify-center py-3 border-b border-white/10 px-4">
          <span className="text-sm font-black tracking-[0.28em] uppercase"
            style={{ color: GOLD, textShadow: "0 0 8px rgba(245,197,66,0.25)" }}>SEASON-Ⅱ (Playoff) </span>
        </div>

        <div className="overflow-visible p-4">
          <div className="bracket-root relative" style={{ width: TOTAL_W, height: TOTAL_H }}>
            <Connectors pos={pos} flows={flows} />

            {/* Knockout Panel */}
            <div style={{
              position: "absolute", top: 8, left: 0,
              width: PANEL_W, height: PANEL_H,
              border: "1px solid rgba(255,255,255,0.1)", borderRadius: 10,
              background: "rgba(255,255,255,0.015)",
            }}>
              <p className="text-[10px] font-bold text-slate-300 uppercase tracking-widest text-center mt-2">KNOCKOUT</p>
            </div>

            {/* Knockout Rounds */}
            {rounds.map((r, ri) => (
              <div key={r.id} style={{ position: "absolute", left: 12 + ri * COL_STRIDE, top: 38 }}>
                <p className="text-[9px] text-center text-slate-500 tracking-wider uppercase mb-1" style={{ width: CARD_W }}>{r.label}</p>
                <div style={{ position: "relative", width: CARD_W, height: maxMatches * STACK }}>
                  {r.matches.map((m, mi) => (
                    <div key={m.id} style={{ position: "absolute", top: mi * STACK }}>
                      <MatchNode
                        id={m.id}
                        teams={m.teams.map(t => teamById(data.teams, t))}
                        winner={m.winner}
                        register={register}
                        cardH={CARD_H}
                        visualW={CARD_W}
                        games={m.games}
                      />
                    </div>
                  ))}
                </div>
              </div>
            ))}

            {/* Grand Final Panel */}
            <div style={{
              position: "absolute", top: GF_CARD_TOP - 26, left: GF_PANEL_X,
              width: GF_PANEL_W, height: GF_CARD_H + 52,
              border: "1px solid rgba(245,197,66,0.25)", borderRadius: 12,
              background: "rgba(245,197,66,0.012)", boxShadow: "0 0 12px rgba(245,197,66,0.07)",
            }}>
              <p className="text-[10px] font-bold text-center uppercase tracking-widest mt-2" style={{ color: GOLD }}>GRAND FINAL (BO3)</p>
            </div>

            {/* Grand Final Card */}
            <AnimatePresence>
              <motion.div key="gf"
                initial={{ opacity: 0, scale: 0.85 }} animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.5, ease: "easeOut" }}
                style={{ position: "absolute", left: GF_CARD_LEFT, top: GF_CARD_TOP, zIndex: 30 }}>
                <div className="absolute rounded-full pointer-events-none" style={{
                  width: GF_CARD_W_VAL * 2, height: GF_CARD_W_VAL * 2,
                  left: -GF_CARD_W_VAL * 0.5, top: -GF_CARD_W_VAL * 0.5,
                  background: "radial-gradient(circle, rgba(245,197,66,0.08) 0%, transparent 70%)",
                }} />
                <MatchNode
                  id={data.grandFinal.id}
                  isGrandFinal
                  teams={data.grandFinal.teams.map(t => teamById(data.teams, t))}
                  winner={data.grandFinal.winner}
                  register={register}
                  cardH={GF_CARD_H}
                  visualW={GF_CARD_W_VAL}
                  games={data.grandFinal.games}
                />
              </motion.div>
            </AnimatePresence>

          </div>
        </div>
      </div>
    </div>
  )
}

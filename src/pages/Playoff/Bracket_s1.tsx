import { useMemo, useRef, useLayoutEffect, useState, useCallback, useEffect } from "react"
import { createPortal } from "react-dom"
import { motion, AnimatePresence } from "framer-motion"
import { useNavigate, useParams } from "react-router-dom"

/* ===================== TYPES ===================== */
type Team = { id: string; name: string; color: string }

/* ===================== HERO IMAGE HELPER ===================== */
// Convert hero name to OpenDota CDN URL
// Format: https://cdn.cloudflare.steamstatic.com/apps/dota2/images/dota_react/heroes/{hero_name}.png
function getHeroImageUrl(heroName: string): string {
  // Convert hero name to the format used by Steam CDN
  // Examples: "Anti-Mage" -> "antimage", "Shadow Fiend" -> "nevermore", "Nature's Prophet" -> "furion"
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

export type GameDetail = {
  game: number           // game number, e.g. 1, 2, 3
  duration: string       // e.g. "42:17"
  winner: string         // team id
  radiant: string        // team id
  dire: string           // team id
  radiantScore: number   // kills
  direScore: number      // kills
  radiantHeroes?: string[]  // hero names for radiant (up to 5)
  direHeroes?: string[]     // hero names for dire (up to 5)
  dotabuffUrl?: string      // optional dotabuff match link
  /** @deprecated use radiantHeroes/direHeroes */
  radiantHero?: string
  /** @deprecated use radiantHeroes/direHeroes */
  direHero?: string
}

type Match = {
  id: string
  teams?: string[]
  winner?: string
  from?: string[]
  dqTeamId?: string        // team id that was DQ'd in this match
  games?: GameDetail[]     // per-game breakdown
}
type Round = { id: string; label: string; matches: Match[] }

export type BracketData = {
  teams: Team[]
  upperBracket: { rounds: Round[] }
  lowerBracket: { rounds: Round[] }
  grandFinal: Match
}

/* ===================== LAYOUT CONSTANTS ===================== */
const GOLD = "#f5c542"
const CARD_W       = 148
const CARD_H       = 44
const COL_GAP      = 40
const COL_STRIDE   = CARD_W + COL_GAP
const STACK        = CARD_H + 18
const SECTION_GAP  = 28
const UB_HEADER_H  = 28
const LABEL_H      = 18
const LB_PAD_X     = 12
const LB_PAD_TOP   = 44
const LB_PAD_BOT   = 20
const GF_COL_GAP   = 40

/* ===================== HELPERS ===================== */
const teamById = (teams: Team[] | undefined, id?: string | null) =>
  teams?.find(t => t.id === id) ?? null

function getMatchY(
  roundIndex: number,
  matchIndex: number,
  rounds: Round[],
  cache: Map<string, number>,
  stack: number
): number {
  const match = rounds[roundIndex].matches[matchIndex]
  if ((match.teams?.length ?? 0) <= 1) {
    const y = ((Math.max(...rounds.map(r => r.matches.length)) - 1) * stack) / 2
    cache.set(match.id, y); return y
  }
  if (roundIndex === 0 || !match.from?.length) {
    const y = matchIndex * stack; cache.set(match.id, y); return y
  }
  const prevRounds = rounds.slice(0, roundIndex)
  const parents = match.from
    .map(pid => prevRounds.flatMap(r => r.matches).find(m => m.id === pid))
    .filter(Boolean) as Match[]
  const parentYs = parents.map(p => {
    if (cache.has(p.id)) return cache.get(p.id)!
    const rIdx = prevRounds.findIndex(r => r.matches.some(m => m.id === p.id))
    const mIdx = prevRounds[rIdx].matches.findIndex(m => m.id === p.id)
    return getMatchY(rIdx, mIdx, rounds, cache, stack)
  })
  const y = parentYs.length === 1 ? parentYs[0] : (parentYs[0] + parentYs[1]) / 2
  cache.set(match.id, y); return y
}

/* ===================== POSITION REGISTRY ===================== */
type Pos = { x: number; y: number; lx: number }   // x = right edge, lx = left edge

function useNodePositions() {
  const map = useRef(new Map<string, HTMLElement>())
  const [pos, setPos]     = useState<Record<string, Pos>>({})
  const [ready, setReady] = useState(false)

  useLayoutEffect(() => {
    const calc = () => {
      const root = document.querySelector(".bracket-root")
      if (!root) return
      const rr = root.getBoundingClientRect()
      const next: Record<string, Pos> = {}
      map.current.forEach((el, id) => {
        const r = el.getBoundingClientRect()
        next[id] = {
          x:  r.left - rr.left + r.width,   // right edge
          lx: r.left - rr.left,              // left edge
          y:  r.top  - rr.top  + r.height / 2,
        }
      })
      setPos(next); setReady(true)
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
    ready,
    register: (id: string, el: HTMLElement | null) =>
      el ? map.current.set(id, el) : map.current.delete(id),
  }
}

/* ===================== MATCH INFO TOOLTIP ===================== */
// Hero pill — small hero portrait
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
  allTeams: Team[]
}) {
  const [open, setOpen] = useState(false)
  const btnRef = useRef<HTMLButtonElement>(null)
  const [coords, setCoords] = useState({ top: 0, left: 0, openUp: false })

  useEffect(() => {
    if (!open || !btnRef.current) return
    const r = btnRef.current.getBoundingClientRect()
    const popH = games.length * 70 // approx height (header + single hero row per game) - adjusted for larger icons
    const popW = 580 // tooltip width - increased to prevent cutoff
    const openUp = r.bottom + popH > window.innerHeight - 20
    
    // Check if tooltip extends beyond right edge of viewport
    let leftPos = r.left + window.scrollX - 10
    if (leftPos + popW > window.innerWidth) {
      // Position tooltip to the left of the button instead
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
            width: 580, // wider to prevent content cutoff
            background: "#0d1117",
            border: "1px solid rgba(255,255,255,0.1)",
            borderRadius: 8,
            boxShadow: "0 20px 60px rgba(0,0,0,0.95)",
            zIndex: 99999,
            pointerEvents: "auto",
            overflow: "hidden",
          }}
        >
          {/* Game rows */}
          <div>
            {games.map(g => {
              const team0isRadiant = t0?.id === g.radiant
              const team0Score = team0isRadiant ? g.radiantScore : g.direScore
              const team1Score = team0isRadiant ? g.direScore : g.radiantScore
              const t0won = g.winner === t0?.id
              const t1won = g.winner === t1?.id
              const radiantHeroes = g.radiantHeroes ?? []
              const direHeroes    = g.direHeroes ?? []
              // heroes from team0 perspective
              const t0heroes = team0isRadiant ? radiantHeroes : direHeroes
              const t1heroes = team0isRadiant ? direHeroes : radiantHeroes

              return (
                <div key={g.game}
                  style={{ borderBottom: games.length > 1 ? "1px solid rgba(255,255,255,0.04)" : "none" }}>

                  {/* Game header with GAME # and centered Show Match button */}
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

                  {/* Team names row */}
                  <div className="flex items-center justify-between px-3 pt-2 pb-1"
                    style={{ background: "rgba(255,255,255,0.02)" }}>
                    
                    {/* Left team name - centered above heroes */}
                    <div className="flex-1 flex justify-center">
                      <span className="text-[11px] font-bold" style={{ color: t0?.color ?? "#888" }}>
                        {t0?.name ?? "TBD"}
                      </span>
                    </div>

                    {/* Score in the middle */}
                    <div className="flex items-center gap-2 px-4">
                      <span className="text-[15px] font-black tabular-nums" style={{ color: "#f0ede6" }}>
                        {team0Score}
                      </span>
                      <span className="text-[11px] text-slate-500 font-bold">:</span>
                      <span className="text-[15px] font-black tabular-nums" style={{ color: "#f0ede6" }}>
                        {team1Score}
                      </span>
                    </div>

                    {/* Right team name - centered above heroes */}
                    <div className="flex-1 flex justify-center">
                      <span className="text-[11px] font-bold" style={{ color: t1?.color ?? "#888" }}>
                        {t1?.name ?? "TBD"}
                      </span>
                    </div>
                  </div>

                  {/* Single row: W/L + Team0 heroes + duration + Team1 heroes + W/L */}
                  <div className="flex items-center gap-2 px-3 py-2.5"
                    style={{ background: "rgba(255,255,255,0.02)" }}>
                    
                    {/* Team 0 W/L badge */}
                    <span className="text-[9px] font-black rounded px-1.5 shrink-0"
                      style={{
                        background: t0won ? "#16a34a" : "#dc2626",
                        color: "#fff", lineHeight: "20px", height: 20,
                        display: "inline-flex", alignItems: "center",
                      }}>
                      {t0won ? "W" : "L"}
                    </span>

                    {/* Team 0 side icon (Radiant/Dire) */}
                    <div className="shrink-0" title={team0isRadiant ? "Radiant" : "Dire"}>
                      <img
                        src={team0isRadiant ? "/Radiant_icon.webp" : "/Dire_icon.webp"}
                        alt={team0isRadiant ? "Radiant" : "Dire"}
                        style={{ width: 18, height: 18, display: "block" }}
                      />
                    </div>

                    {/* Team 0 heroes */}
                    <div className="flex items-center gap-1 shrink-0">
                      {t0heroes.map((h, hi) => <HeroPill key={hi} name={h} won={t0won} />)}
                    </div>

                    {/* Duration */}
                    <span className="text-[10px] text-slate-400 font-mono shrink-0 px-2 mx-auto">
                      {g.duration}
                    </span>

                    {/* Team 1 heroes */}
                    <div className="flex items-center gap-1 shrink-0">
                      {t1heroes.map((h, hi) => <HeroPill key={hi} name={h} won={t1won} />)}
                    </div>

                    {/* Team 1 side icon (Radiant/Dire) */}
                    <div className="shrink-0" title={team0isRadiant ? "Dire" : "Radiant"}>
                      <img
                        src={team0isRadiant ? "/Dire_icon.webp" : "/Radiant_icon.webp"}
                        alt={team0isRadiant ? "Dire" : "Radiant"}
                        style={{ width: 18, height: 18, display: "block" }}
                      />
                    </div>

                    {/* Team 1 W/L badge */}
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
  id, teams, winner, register, isGrandFinal, cardH, visualW, onHover, dropTeamIds,
  dqTeamId, games, allTeams, advancedTeamId,
}: {
  id: string
  teams: (Team | null)[]
  winner?: string
  isGrandFinal?: boolean
  cardH: number
  visualW: number
  register: (id: string, el: HTMLElement | null) => void
  onHover?: (id: string | null) => void
  dropTeamIds?: Set<string>
  dqTeamId?: string
  games?: GameDetail[]
  allTeams: Team[]
  advancedTeamId?: string
}) {
  const slotH = Math.floor((cardH - 12) / 2)
  const hasGames = (games?.length ?? 0) > 0
  const isSingleTeam = teams.length === 1

  // Always show series wins on the card
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
      onHoverStart={() => onHover?.(id)}
      onHoverEnd={() => onHover?.(null)}
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
      {/* Main rows area — right-padded to leave room for ⓘ */}
      <div className="flex flex-col h-full" style={{ paddingTop: 4, paddingBottom: 4, gap: 2, paddingRight: hasGames ? 20 : 4, paddingLeft: 4 }}>
        {teams.map((t, i) => {
          const win      = Boolean(t?.id && t.id === winner)
          const isDQ     = Boolean(t?.id && t.id === dqTeamId)
          const isAdvanced = Boolean(t?.id && t.id === advancedTeamId)
          const highlight = win || isSingleTeam || isAdvanced
          const isDropped = Boolean(t?.id && dropTeamIds?.has(t.id))
          const score    = hasGames ? (seriesWins[t?.id ?? ""] ?? 0) : null

          const lose = winner && !win && !isAdvanced

          return (
            <div
              key={i}
              className={`flex items-center gap-1 px-2 rounded-md transition-all ${
                (win || isAdvanced) && !isGrandFinal ? "hover:shadow-[0_0_18px_rgba(34,197,94,0.85)]" : ""
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
                background: isDQ
                  ? "rgba(127,29,29,0.45)"
                  : isGrandFinal && win
                  ? "linear-gradient(90deg, rgba(245,197,66,0.18) 0%, rgba(245,197,66,0.06) 100%)"
                  : highlight ? "rgba(255,255,255,0.07)" : "transparent",
                boxShadow: isDQ
                  ? "inset 0 0 0 1px rgba(255,0,0,0.2)"
                  : isGrandFinal && win
                  ? "inset 0 0 12px rgba(245,197,66,0.15)"
                  : (win || isAdvanced) ? `0 0 8px ${t?.color ?? "#fff"}33` : "none",
              }}
            >
              {isDropped && (
                <span className="text-[8px] font-black leading-none shrink-0"
                  style={{ color: t?.color ?? "#888" }}
                  title="Dropped from Upper Bracket">↓</span>
              )}

              {/* Color bar */}
              <span className="rounded-full shrink-0" style={{
                width: 3, height: 13,
                background: isDQ ? "#7f1d1d" : (t?.color ?? "#444"),
              }} />

              {/* Team name */}
              <span
                className={`text-[9px] flex-1 font-semibold truncate ${isDQ ? "line-through opacity-70" : ""}`}
                style={{
                  color: isDQ
                    ? "#fca5a5"
                    : isGrandFinal && win
                    ? "#f5c542"
                    : isGrandFinal && !!lose
                    ? "#5a6270"
                    : highlight ? "#f0ede6" : "#8a9190",
                  textShadow: isGrandFinal && win ? "0 0 6px rgba(245,197,66,0.6)" : "none",
                }}
              >
                {t?.name ?? "TBD"}
              </span>

              {/* DQ badge */}
              {isDQ && (
                <span className="relative group shrink-0">
                  <span className="flex items-center justify-center rounded text-[7px] font-black text-white px-1"
                    style={{ background: "#dc2626", boxShadow: "0 0 6px rgba(255,0,0,0.6)", lineHeight: "13px", height: 13 }}>
                    DQ
                  </span>
                  <span className="absolute right-0 bottom-full mb-1.5 px-2 py-1 rounded text-[8px] text-white whitespace-nowrap
                    bg-black/90 border border-red-500/40 shadow-[0_0_8px_rgba(255,0,0,0.4)]
                    opacity-0 group-hover:opacity-100 pointer-events-none transition-opacity z-50">
                    Disqualified due to smurfing
                  </span>
                </span>
              )}

              {/* Advanced badge with tooltip */}
              {isAdvanced && (
                <span className="relative group shrink-0">
                  <span className="flex items-center justify-center rounded text-[9px] font-black px-1.5"
                    style={{ 
                      background: "#16a34a", 
                      color: "#fff",
                      boxShadow: "0 0 8px rgba(34,197,94,0.6)", 
                      lineHeight: "16px", 
                      height: 16,
                      minWidth: 16
                    }}>
                    Q
                  </span>
                  <span className="absolute right-0 bottom-full mb-1.5 px-2 py-1 rounded text-[8px] text-white whitespace-nowrap
                    bg-black/90 border border-green-500/40 shadow-[0_0_8px_rgba(34,197,94,0.4)]
                    opacity-0 group-hover:opacity-100 pointer-events-none transition-opacity z-50">
                    Advanced to Grand Final
                  </span>
                </span>
              )}

              {/* Score — kills for BO1, series wins for BO3+ */}
              {score !== null && !isDQ && !isAdvanced && (
                <span className="text-[11px] font-black shrink-0 ml-1 tabular-nums"
                  style={{
                    color: isGrandFinal && win
                      ? "#f5c542"
                      : win ? "#f0ede6" : "#3d4755",
                    minWidth: 10,
                    textAlign: "right",
                    textShadow: isGrandFinal && win ? "0 0 8px rgba(245,197,66,0.8)" : "none",
                  }}>
                  {score}
                </span>
              )}
            </div>
          )
        })}
      </div>

      {/* ⓘ button — centered vertically at the right edge, only when games data exists */}
      {hasGames && (
        <div className="absolute flex items-center justify-center"
          style={{ right: 4, top: 0, bottom: 0 }}>
          <MatchInfoTooltip games={games!} teams={teams} allTeams={allTeams} />
        </div>
      )}
    </motion.div>
  )
}

/* ===================== CONNECTORS ===================== */
type Flow = {
  from: string; to: string; color: string
  straight?: boolean; toGF?: "ub" | "lb"
  winnerPath?: boolean
}

function ConnectorsV2({ pos, flows }: { pos: Record<string, Pos>; flows: Flow[] }) {
  const STEP = COL_GAP / 2
  const SILVER = "#5a6880"

  const incomingMap = useMemo(() => {
    const map = new Map<string, Flow[]>()
    flows.forEach(f => {
      const arr = map.get(f.to) ?? []; arr.push(f); map.set(f.to, arr)
    })
    return map
  }, [flows])

  const renderPath = (key: string | number, d: string, f: Flow) => (
    <g key={key}>
      <path d={d} fill="none" stroke={f.color} strokeWidth={f.winnerPath ? 2 : 1.8}
        strokeLinecap="round" opacity={f.winnerPath ? 0.9 : 0.45} />
      {f.winnerPath && (
        <path d={d} fill="none" stroke={f.color} strokeWidth={5} strokeLinecap="round"
          opacity={0.1} style={{ filter: "blur(2px)" }} />
      )}
    </g>
  )

  return (
    <>
      <svg className="absolute inset-0 pointer-events-none" style={{ width: "100%", height: "100%", overflow: "visible" }}>
        {flows.map((f, i) => {
          const a = pos[f.from], b = pos[f.to]
          if (!a || !b) return null

          // GF connectors: elbow from winner right-edge → vertical → GF left-edge
          if (f.toGF) {
            const midX = a.x + (b.lx - a.x) / 2
            const d = `M ${a.x} ${a.y} L ${midX} ${a.y} L ${midX} ${b.y} L ${b.lx} ${b.y}`
            return (
              <g key={i}>
                <path d={d} fill="none" stroke={GOLD} strokeWidth={2} strokeLinecap="round"
                  opacity={0.6} />
              </g>
            )
          }

          // Straight: source right-edge → target left-edge, same Y
          if (f.straight) {
            return renderPath(i, `M ${a.x} ${a.y} L ${b.lx} ${a.y}`, f)
          }

          const group = (incomingMap.get(f.to) ?? []).filter(g => !g.straight && !g.toGF)
          if (group.length === 2) {
            // two parents merging: each goes right to midX, then vertical, then horizontal to target left
            const midX = a.x + STEP
            return (
              <g key={i}>
                {renderPath(`${i}a`, `M ${a.x} ${a.y} L ${midX} ${a.y}`, f)}
                {renderPath(`${i}b`, `M ${midX} ${a.y} L ${midX} ${b.y}`, f)}
                <path d={`M ${midX} ${b.y} L ${b.lx} ${b.y}`}
                  fill="none" stroke={SILVER} strokeWidth={2} strokeLinecap="round" opacity={0.7} />
              </g>
            )
          }

          // Single parent elbow: if same Y → straight line; otherwise elbow
          if (Math.abs(a.y - b.y) < 2) {
            return renderPath(i, `M ${a.x} ${a.y} L ${b.lx} ${b.y}`, f)
          }
          return renderPath(i, `M ${a.x} ${a.y} L ${a.x+STEP} ${a.y} L ${a.x+STEP} ${b.y} L ${b.lx} ${b.y}`, f)
        })}
      </svg>
    </>
  )
}

/* ===================== MAIN COMPONENT ===================== */
export default function BracketDotaStyle({ data }: { data: BracketData }) {
  const { pos, register } = useNodePositions()
  const [, setHoveredMatchId] = useState<string | null>(null)
  const handleMatchHover = useCallback((id: string | null) => setHoveredMatchId(id), [])
  const navigate = useNavigate()
  const { season } = useParams<{ season: string }>()

  const ubRounds = data.upperBracket.rounds.filter(r => !r.id.includes("WINNER"))
  const lbRounds = data.lowerBracket.rounds.filter(r => !r.id.includes("WINNER"))
  const lbR1 = lbRounds[0]

  const ubCardsH = Math.max(...ubRounds.map(r => r.matches.length)) * STACK
  const lbCardsH = Math.max(...lbRounds.map(r => r.matches.length)) * STACK

  // vertical layout
  const UB_LABEL_TOP   = UB_HEADER_H + 6
  const UB_CARDS_TOP   = UB_LABEL_TOP + LABEL_H
  const UB_PANEL_H     = UB_CARDS_TOP + ubCardsH + LB_PAD_BOT + 16
  const LB_PANEL_TOP   = 8 + UB_PANEL_H + SECTION_GAP
  const LB_CONTENT_TOP = LB_PANEL_TOP + LB_PAD_TOP
  const LB_PANEL_H     = LB_PAD_TOP + LABEL_H + lbCardsH + LB_PAD_BOT

  // horizontal layout — LB R1 starts at same X as UB R1 (no dropped column)
  const UB_COL_OFFSET  = LB_PAD_X
  const lbColX         = (ri: number) => UB_COL_OFFSET + ri * COL_STRIDE

  // UB has ubRounds + 1 winner column; LB has lbRounds columns
  const UB_PANEL_W_RAW = (ubRounds.length + 1) * COL_STRIDE - COL_GAP
  const LB_PANEL_W_RAW = lbColX(lbRounds.length - 1) + CARD_W + LB_PAD_X
  const SHARED_PANEL_W = Math.max(UB_PANEL_W_RAW, LB_PANEL_W_RAW) + LB_PAD_X * 2

  // Winner column X — same for UB Winner and LB Winner
  const WINNER_COL_X   = UB_COL_OFFSET + ubRounds.length * COL_STRIDE

  // GF: right of panels, vertically centered in the gap between UB and LB
  // Make GF card and panel slightly larger
  const GF_CARD_H     = Math.round(CARD_H * 1.15)  // 15% larger card
  const GF_CARD_W_VAL = Math.round(CARD_W * 1.15)  // 15% larger width
  const GAP_CENTER_Y  = 8 + UB_PANEL_H + SECTION_GAP / 2
  const GF_CARD_TOP   = Math.round(GAP_CENTER_Y - GF_CARD_H / 2)
  const GF_PANEL_TOP  = GF_CARD_TOP - 26
  const GF_PANEL_HT   = GF_CARD_H + 52
  const GF_PANEL_X    = SHARED_PANEL_W + GF_COL_GAP
  const GF_PANEL_W    = GF_CARD_W_VAL + LB_PAD_X * 2 + 12
  const GF_CARD_LEFT  = GF_PANEL_X + LB_PAD_X + 6

  // canvas — no extra width needed, fit exactly
  const TOTAL_W = GF_PANEL_X + GF_PANEL_W + 12
  const TOTAL_H = LB_PANEL_TOP + LB_PANEL_H + 20

  const ubWinner = data.upperBracket.rounds.flatMap(r => r.matches).find(m => m.id === "UB_WINNER_M1")
  const lbWinner = data.lowerBracket.rounds.flatMap(r => r.matches).find(m => m.id === "LB_WINNER_M1")

  // We still track dropout data for flow connectors (dropout → LB R1)
  const dropoutGroups = useMemo(() => {
    if (!lbR1) return []
    return lbR1.matches.map((lbMatch, lbIdx) => {
      const dropoutTeams: Team[] = []
      lbMatch.from?.forEach(ubId => {
        const ubM = data.upperBracket.rounds.flatMap(r => r.matches).find(m => m.id === ubId)
        if (!ubM) return
        const loser = ubM.teams?.find(tid => tid !== ubM.winner)
        const team = loser ? teamById(data.teams, loser) : null
        if (team) dropoutTeams.push(team)
      })
      return { groupId: `DROPOUT_GROUP_${lbIdx}`, teams: dropoutTeams, lbMatchId: lbMatch.id, lbMatchIndex: lbIdx }
    })
  }, [data, lbR1])

  const flows = useMemo<Flow[]>(() => {
    const f: Flow[] = []

    const walkBracket = (rounds: Round[]) => {
      const visible = rounds.filter(r => !r.id.includes("WINNER"))
      visible.forEach((r, vi) => {
        const next = visible[vi + 1]
        if (!next) return
        r.matches.forEach((m) => {
          if (!m.winner) return
          const w = teamById(data.teams, m.winner)
          if (!w) return
          // Find which next-round match this match feeds into via the `from` field
          // Fall back to Math.floor(idx/2) for brackets that don't specify `from`
          const idx = r.matches.indexOf(m)
          const to = next.matches.find(nm => nm.from?.includes(m.id))
            ?? next.matches[Math.floor(idx / 2)]
          if (!to) return
          f.push({ from: m.id, to: to.id, color: w.color, winnerPath: true })
        })
      })
      // Last visible round → winner placeholder (straight line, not rendered as card)
      const lastVisible = visible[visible.length - 1]
      const winnerRound = rounds.find(r => r.id.includes("WINNER"))
      if (lastVisible && winnerRound) {
        lastVisible.matches.forEach(m => {
          if (!m.winner) return
          const w = teamById(data.teams, m.winner)
          const to = winnerRound.matches[0]
          if (w && to) f.push({ from: m.id, to: to.id, color: w.color, straight: true, winnerPath: true })
        })
      }
    }

    walkBracket(data.upperBracket.rounds)
    walkBracket(data.lowerBracket.rounds)
    dropoutGroups.forEach(g => f.push({ from: g.groupId, to: g.lbMatchId, color: "#5a6b7a" }))

    // Direct elbow connectors from each winner to GF card
    if (ubWinner) {
      const t = teamById(data.teams, ubWinner.winner)
      if (t) f.push({ from: ubWinner.id, to: data.grandFinal.id, color: t.color, toGF: "ub", winnerPath: true })
    }
    if (lbWinner) {
      const t = teamById(data.teams, lbWinner.winner)
      if (t) f.push({ from: lbWinner.id, to: data.grandFinal.id, color: t.color, toGF: "lb", winnerPath: true })
    }

    return f
  }, [data, ubWinner, lbWinner, dropoutGroups])

  return (
    <div className="w-full min-h-screen flex items-center justify-center px-4 py-6"
      style={{ background: "linear-gradient(135deg,#0d0f14 0%,#111520 50%,#0d0f14 100%)" }}>
      
      {/* External Navigation Buttons */}
      <button
        onClick={() => navigate(`/seasons?season=${season ?? '1'}`)}
        className="fixed left-6 top-24 z-50 px-3 sm:px-4 py-1.5 sm:py-2 rounded-full text-[0.65rem] sm:text-[0.72rem] font-semibold uppercase tracking-[0.12em] bg-gradient-to-tr from-white/90 via-zinc-200 to-zinc-300 text-[#050608] shadow-[0_8px_26px_rgba(2,6,23,0.55)] hover:brightness-105 transition-all duration-200 backdrop-blur-sm border border-white/10 cursor-pointer"
        type="button"
      >
        ← Back
      </button>

      <button
        onClick={() => navigate('/playoff/2')}
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
            style={{ color: GOLD, textShadow: "0 0 8px rgba(245,197,66,0.25)" }}>SEASON-Ⅰ (Playoff)</span>
        </div>

        {/* Canvas — tooltip-safe: visible overflow */}
        <div className="overflow-visible p-4">
          <div className="bracket-root relative" style={{ width: TOTAL_W, height: TOTAL_H }}>
            <ConnectorsV2 pos={pos} flows={flows} />

            {/* ── UPPER BRACKET PANEL ── */}
            <div style={{
              position: "absolute", top: 8, left: 0,
              width: SHARED_PANEL_W, height: UB_PANEL_H,
              border: "1px solid rgba(255,255,255,0.1)", borderRadius: 10,
              background: "rgba(255,255,255,0.015)",
            }}>
              <p className="text-[10px] font-bold text-slate-300 uppercase tracking-widest text-center mt-2">UPPER BRACKET  (BO1)</p>
            </div>

            {ubRounds.map((r, ri) => {
              const riInFull = data.upperBracket.rounds.findIndex(rr => rr.id === r.id)
              const cache = new Map<string, number>()
              const isUBFinal = r.id === "UB_FINAL"
              return (
                <div key={r.id} style={{ position: "absolute", left: UB_COL_OFFSET + ri * COL_STRIDE, top: 8 + UB_LABEL_TOP }}>
                  <p className="text-[9px] text-center text-slate-500 tracking-wider uppercase mb-1" style={{ width: CARD_W }}>{r.label}</p>
                  <div style={{ position: "relative", width: CARD_W, height: ubCardsH }}>
                    {r.matches.map((m, mi) => (
                      <div key={m.id} style={{ position: "absolute", top: getMatchY(riInFull, mi, data.upperBracket.rounds, cache, STACK) }}>
                        <MatchNode id={m.id} teams={m.teams?.map(t => teamById(data.teams, t)) ?? [null, null]}
                          winner={m.winner} register={register} cardH={CARD_H} visualW={CARD_W}
                          onHover={handleMatchHover}
                          dqTeamId={m.dqTeamId}
                          games={m.games}
                          allTeams={data.teams}
                          advancedTeamId={isUBFinal && m.dqTeamId ? m.winner : undefined} />
                      </div>
                    ))}
                  </div>
                </div>
              )
            })}

            {/* UB Winner node */}
            {ubWinner && (() => {
              const ubFinalRoundIdx = data.upperBracket.rounds.findIndex(r => r.id === "UB_FINAL")
              const cache = new Map<string, number>()
              const winnerY = getMatchY(ubFinalRoundIdx, 0, data.upperBracket.rounds, cache, STACK)
              return (
                <div style={{ position: "absolute", left: WINNER_COL_X, top: 8 + UB_LABEL_TOP }}>
                  <p className="text-[9px] text-center tracking-wider uppercase mb-1"
                    style={{ width: CARD_W, color: GOLD }}>UB WINNER</p>
                  <div style={{ position: "relative", width: CARD_W, height: ubCardsH }}>
                    <div style={{ position: "absolute", top: winnerY }}>
                      <MatchNode id={ubWinner.id}
                        teams={ubWinner.teams?.map(t => teamById(data.teams, t)) ?? [null]}
                        winner={ubWinner.winner}
                        register={register} cardH={CARD_H} visualW={CARD_W}
                        onHover={handleMatchHover}
                        dqTeamId={ubWinner.dqTeamId}
                        games={ubWinner.games}
                        allTeams={data.teams}
                        advancedTeamId={undefined} />
                    </div>
                  </div>
                </div>
              )
            })()}

            {/* ── LOWER BRACKET PANEL ── */}
            <div style={{
              position: "absolute", top: LB_PANEL_TOP, left: 0,
              width: SHARED_PANEL_W, height: LB_PANEL_H + 8,
              border: "1px solid rgba(255,255,255,0.1)", borderRadius: 10,
              background: "rgba(255,255,255,0.015)",
            }}>
              <p className="text-[10px] font-bold text-slate-300 uppercase tracking-widest text-center mt-2">LOWER BRACKET (BO1)</p>
            </div>

            {/* LB rounds — R1 starts at same X as UB R1 */}
            {lbRounds.map((r, ri) => {
              const riInFull = data.lowerBracket.rounds.findIndex(rr => rr.id === r.id)
              const cache = new Map<string, number>()
              return (
                <div key={r.id} style={{ position: "absolute", left: lbColX(ri), top: LB_CONTENT_TOP + 12 }}>
                  <p className="text-[9px] text-center text-slate-500 tracking-wider uppercase mb-1" style={{ width: CARD_W }}>{r.label}</p>
                  <div style={{ position: "relative", width: CARD_W, height: LABEL_H + lbCardsH }}>
                    {r.matches.map((m, mi) => (
                      <div key={m.id} style={{ position: "absolute", top: LABEL_H + getMatchY(riInFull, mi, data.lowerBracket.rounds, cache, STACK) }}>
                        <MatchNode id={m.id} teams={m.teams?.map(t => teamById(data.teams, t)) ?? [null, null]}
                          winner={m.winner} register={register} cardH={CARD_H} visualW={CARD_W}
                          onHover={handleMatchHover}
                          dqTeamId={m.dqTeamId}
                          games={m.games}
                          allTeams={data.teams}
                          advancedTeamId={undefined} />
                      </div>
                    ))}
                  </div>
                </div>
              )
            })}

            {/* LB Winner node — below UB Winner at same column X */}
            {lbWinner && (() => {
              const lbFinalRoundIdx = data.lowerBracket.rounds.findIndex(r => r.id === "LB_WINNER")
              const lbFinalRound    = data.lowerBracket.rounds.find(r => r.id === "LB_WINNER")
              const cache = new Map<string, number>()
              const lbLastVisible   = data.lowerBracket.rounds.filter(r => !r.id.includes("WINNER"))
              const lbLastIdx       = data.lowerBracket.rounds.findIndex(r => r.id === lbLastVisible[lbLastVisible.length - 1].id)
              const winnerY         = lbFinalRound
                ? getMatchY(lbFinalRoundIdx >= 0 ? lbFinalRoundIdx : lbLastIdx, 0, data.lowerBracket.rounds, cache, STACK)
                : 0
              // Place at WINNER_COL_X but inside the LB panel
              const lbWinnerLeft = WINNER_COL_X
              return (
                <div style={{ position: "absolute", left: lbWinnerLeft, top: LB_CONTENT_TOP + 12 }}>
                  <p className="text-[9px] text-center tracking-wider uppercase mb-1"
                    style={{ width: CARD_W, color: GOLD }}>LB WINNER</p>
                  <div style={{ position: "relative", width: CARD_W, height: LABEL_H + lbCardsH }}>
                    <div style={{ position: "absolute", top: LABEL_H + winnerY }}>
                      <MatchNode id={lbWinner.id}
                        teams={lbWinner.teams?.map(t => teamById(data.teams, t)) ?? [null]}
                        winner={lbWinner.winner}
                        register={register} cardH={CARD_H} visualW={CARD_W}
                        onHover={handleMatchHover}
                        dqTeamId={lbWinner.dqTeamId}
                        games={lbWinner.games}
                        allTeams={data.teams}
                        advancedTeamId={undefined} />
                    </div>
                  </div>
                </div>
              )
            })()}

            {/* Grand Final Panel */}
            <div style={{
              position: "absolute", top: GF_PANEL_TOP, left: GF_PANEL_X,
              width: GF_PANEL_W, height: GF_PANEL_HT,
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
                <MatchNode id={data.grandFinal.id} isGrandFinal
                  teams={data.grandFinal.teams?.map(t => teamById(data.teams, t)) ?? [null, null]}
                  winner={data.grandFinal.winner} register={register}
                  cardH={GF_CARD_H} visualW={GF_CARD_W_VAL}
                  onHover={handleMatchHover}
                  dqTeamId={data.grandFinal.dqTeamId}
                  games={data.grandFinal.games}
                  allTeams={data.teams}
                  advancedTeamId={undefined} />
              </motion.div>
            </AnimatePresence>

          </div>
        </div>
      </div>
    </div>
  )
}
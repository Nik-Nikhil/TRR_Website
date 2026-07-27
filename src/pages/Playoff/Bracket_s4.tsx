// Bracket_s4.tsx — Season 4 double-elimination bracket, S3-style UI
import { useMemo, useRef, useLayoutEffect, useState, useCallback, useEffect } from "react"
import { createPortal } from "react-dom"
import { motion, AnimatePresence } from "framer-motion"
import { useNavigate } from "react-router-dom"

/* ===================== TYPES ===================== */
type Team = { id: string; name: string; color: string }

type GameDetail = {
  game: number; duration: string; winner: string
  radiant: string; dire: string
  radiantScore: number; direScore: number
  radiantHeroes?: string[]; direHeroes?: string[]
  dotabuffUrl?: string
}

type Match = {
  id: string; teams?: string[]; winner?: string
  from?: string[]; dqTeamId?: string; games?: GameDetail[]
  note?: string
}

type Round = { id: string; label: string; matches: Match[] }

export type BracketData4 = {
  season: number; type: string
  teams: Team[]
  upper: { rounds: Round[] }
  lower: { rounds: Round[] }
  grandFinal: Match
}

/* ===================== LAYOUT CONSTANTS ===================== */
const GOLD   = "#f5c542"
// Matched to S3's sizing so S4 reads at the same scale/legibility as S3.
// (S4 has more columns than S3, so the overall bracket will simply be
// wider/taller — same as S3, we don't auto-shrink to force it into one
// viewport; the page scrolls instead.)
const CARD_W = 115
const CARD_H = 34
const COL_GAP = 32
const STACK  = CARD_H + 12
const LABEL_H = 18
const SILVER = "#5a6880"

/* ===================== HELPERS ===================== */
const teamById = (teams: Team[] | undefined, id?: string | null) =>
  teams?.find(t => t.id === id) ?? null

const slotKey = (matchId: string, slotIndex: number) => `${matchId}::slot::${slotIndex}`

function getMatchY(
  roundIndex: number,
  matchIndex: number,
  rounds: Round[],
  cache: Map<string, number>,
  flatRoundIndices?: Set<number>,
  rowStack: number = STACK
): number {
  const match = rounds[roundIndex].matches[matchIndex]
  const maxMatches = Math.max(...rounds.map(r => r.matches.length))
  if ((match.teams?.length ?? 0) <= 1) {
    const y = ((maxMatches - 1) * rowStack) / 2
    cache.set(match.id, y); return y
  }
  if (roundIndex === 0) {
    const y = matchIndex * rowStack; cache.set(match.id, y); return y
  }
  if (flatRoundIndices?.has(roundIndex)) {
    const matchCount = rounds[roundIndex].matches.length
    const y = ((matchIndex + 0.5) * (maxMatches / matchCount) - 0.5) * rowStack
    cache.set(match.id, y); return y
  }
  if (!match.from?.length) {
    const y = matchIndex * rowStack; cache.set(match.id, y); return y
  }
  const prevRounds = rounds.slice(0, roundIndex)
  const parents = match.from
    .map(pid => prevRounds.flatMap(r => r.matches).find(m => m.id === pid))
    .filter(Boolean) as Match[]
  const parentYs = parents.map(p => {
    if (cache.has(p.id)) return cache.get(p.id)!
    const rIdx = prevRounds.findIndex(r => r.matches.some(m => m.id === p.id))
    const mIdx = prevRounds[rIdx].matches.findIndex(m => m.id === p.id)
    return getMatchY(rIdx, mIdx, rounds, cache, flatRoundIndices, rowStack)
  })
  const y = parentYs.length === 1 ? parentYs[0] : (parentYs[0] + parentYs[1]) / 2
  cache.set(match.id, y); return y
}

/* ===================== POSITION REGISTRY ===================== */
type Pos = { x: number; y: number; lx: number }

// S4 UB: R1(8) → spine → R2(8) → spine → R3(4) → spine → R4/Semis(2) → Final(1)
// All rounds use proportional flat spacing (no `from` arrays in JSON)
const UB_FLAT_ROUNDS_S4 = new Set([0, 1, 2, 3, 4])

function useNodePositions() {
  const map = useRef(new Map<string, HTMLElement>())
  const [pos, setPos] = useState<Record<string, Pos>>({})

  useLayoutEffect(() => {
    const calc = () => {
      const root = document.querySelector(".bracket-root-s4")
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
    calc()
    const raf = requestAnimationFrame(() => requestAnimationFrame(calc))
    const t1 = window.setTimeout(calc, 50)
    const t2 = window.setTimeout(calc, 150)
    const t3 = window.setTimeout(calc, 300)
    const t4 = window.setTimeout(calc, 500)
    document.fonts?.ready?.then(calc).catch(() => {})
    window.addEventListener("resize", calc)
    return () => {
      cancelAnimationFrame(raf)
      window.clearTimeout(t1); window.clearTimeout(t2)
      window.clearTimeout(t3); window.clearTimeout(t4)
      window.removeEventListener("resize", calc)
    }
  }, [])

  return {
    pos,
    register: (id: string, el: HTMLElement | null) =>
      el ? map.current.set(id, el) : map.current.delete(id),
  }
}

/* ===================== HERO IMAGE HELPER ===================== */
function getHeroImageUrl(heroName: string): string {
  const nameMap: Record<string, string> = {
    "Anti-Mage": "antimage", "Axe": "axe", "Bane": "bane", "Bloodseeker": "bloodseeker",
    "Crystal Maiden": "crystal_maiden", "Drow Ranger": "drow_ranger", "Earthshaker": "earthshaker",
    "Juggernaut": "juggernaut", "Mirana": "mirana", "Morphling": "morphling",
    "Shadow Fiend": "nevermore", "Phantom Lancer": "phantom_lancer", "Puck": "puck",
    "Pudge": "pudge", "Razor": "razor", "Sand King": "sand_king", "Storm Spirit": "storm_spirit",
    "Sven": "sven", "Tiny": "tiny", "Vengeful Spirit": "vengefulspirit",
    "Windranger": "windrunner", "Zeus": "zuus", "Kunkka": "kunkka", "Lina": "lina",
    "Lion": "lion", "Shadow Shaman": "shadow_shaman", "Tidehunter": "tidehunter",
    "Witch Doctor": "witch_doctor", "Lich": "lich", "Riki": "riki",
    "Enigma": "enigma", "Tinker": "tinker", "Sniper": "sniper", "Necrophos": "necrolyte",
    "Warlock": "warlock", "Beastmaster": "beastmaster", "Queen of Pain": "queenofpain",
    "Venomancer": "venomancer", "Faceless Void": "faceless_void", "Skeleton King": "skeleton_king",
    "Wraith King": "skeleton_king", "Death Prophet": "death_prophet",
    "Phantom Assassin": "phantom_assassin", "Pugna": "pugna", "Templar Assassin": "templar_assassin",
    "Viper": "viper", "Luna": "luna", "Dragon Knight": "dragon_knight",
    "Dazzle": "dazzle", "Clockwerk": "rattletrap", "Leshrac": "leshrac",
    "Nature's Prophet": "furion", "Lifestealer": "life_stealer", "Dark Seer": "dark_seer",
    "Clinkz": "clinkz", "Omniknight": "omniknight", "Enchantress": "enchantress",
    "Huskar": "huskar", "Night Stalker": "night_stalker", "Nightstalker": "night_stalker",
    "Broodmother": "broodmother", "Bounty Hunter": "bounty_hunter", "Weaver": "weaver",
    "Jakiro": "jakiro", "Batrider": "batrider", "Chen": "chen", "Spectre": "spectre",
    "Ancient Apparition": "ancient_apparition", "Doom": "doom_bringer",
    "Ursa": "ursa", "Spirit Breaker": "spirit_breaker", "Gyrocopter": "gyrocopter",
    "Alchemist": "alchemist", "Invoker": "invoker", "Silencer": "silencer",
    "Outworld Destroyer": "obsidian_destroyer", "Outworld Destryoyer": "obsidian_destroyer",
    "Lycan": "lycan", "Brew Master": "brewmaster", "Brewmaster": "brewmaster",
    "Shadow Demon": "shadow_demon", "Lone Druid": "lone_druid",
    "Chaos Knight": "chaos_knight", "Meepo": "meepo", "Treant Protector": "treant",
    "Ogre Magi": "ogre_magi", "Undying": "undying", "Rubick": "rubick",
    "Disruptor": "disruptor", "Nyx Assassin": "nyx_assassin", "Naga Siren": "naga_siren",
    "Keeper of the Light": "keeper_of_the_light", "Io": "wisp", "Visage": "visage",
    "Slark": "slark", "Medusa": "medusa", "Troll Warlord": "troll_warlord",
    "Centaur Warrunner": "centaur", "Magnus": "magnataur", "Timbersaw": "shredder",
    "Bristleback": "bristleback", "Tusk": "tusk", "Skywrath Mage": "skywrath_mage",
    "Abaddon": "abaddon", "Elder Titan": "elder_titan", "Legion Commander": "legion_commander",
    "Techies": "techies", "Ember Spirit": "ember_spirit", "Earth Spirit": "earth_spirit",
    "Underlord": "abyssal_underlord", "Terrorblade": "terrorblade", "Phoenix": "phoenix",
    "Oracle": "oracle", "Winter Wyvern": "winter_wyvern", "Arc Warden": "arc_warden",
    "Monkey King": "monkey_king", "Dark Willow": "dark_willow", "Pangolier": "pangolier",
    "Grimstroke": "grimstroke", "GrimStroke": "grimstroke", "Hoodwink": "hoodwink",
    "Void Spirit": "void_spirit", "Snapfire": "snapfire", "Mars": "mars",
    "Dawnbreaker": "dawnbreaker", "Marci": "marci", "Primal Beast": "primal_beast",
    "Muerta": "muerta",
  }
  const key = nameMap[heroName] ?? heroName.toLowerCase().replace(/[' ]/g, "_").replace(/[^a-z0-9_]/g, "")
  return `https://cdn.cloudflare.steamstatic.com/apps/dota2/images/dota_react/heroes/icons/${key}.png`
}

/* ===================== HERO PILL ===================== */
function HeroPill({ name, won }: { name: string; won: boolean }) {
  return (
    <div
      className="inline-flex items-center rounded shrink-0"
      style={{ border: `2px solid ${won ? "#16a34a" : "#dc2626"}`, overflow: "hidden", height: 28, width: 28 }}
      title={name}
    >
      <img src={getHeroImageUrl(name)} alt={name} className="w-full h-full object-cover" style={{ display: "block" }} />
    </div>
  )
}

/* ===================== MATCH INFO TOOLTIP ===================== */
function MatchInfoTooltip({ games, teams }: { games: GameDetail[]; teams: (Team | null)[] }) {
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
    if (leftPos + popW > window.innerWidth) leftPos = r.right + window.scrollX - popW + 10
    setCoords({ top: openUp ? r.top + window.scrollY - popH - 4 : r.bottom + window.scrollY + 4, left: leftPos, openUp })
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
            position: "absolute", top: coords.top, left: coords.left, width: 580,
            background: "#0d1117", border: "1px solid rgba(255,255,255,0.1)",
            borderRadius: 8, boxShadow: "0 20px 60px rgba(0,0,0,0.95)",
            zIndex: 99999, pointerEvents: "auto", overflow: "hidden",
          }}
        >
          <div>
            {games.map(g => {
              const team0isRadiant = t0?.id === g.radiant
              const team0Score = team0isRadiant ? g.radiantScore : g.direScore
              const team1Score = team0isRadiant ? g.direScore : g.radiantScore
              const t0won = g.winner === t0?.id
              const t1won = g.winner === t1?.id
              const t0heroes = (team0isRadiant ? g.radiantHeroes : g.direHeroes) ?? []
              const t1heroes = (team0isRadiant ? g.direHeroes : g.radiantHeroes) ?? []
              return (
                <div key={g.game} style={{ borderBottom: games.length > 1 ? "1px solid rgba(255,255,255,0.04)" : "none" }}>
                  <div className="flex items-center justify-between px-3 py-2"
                    style={{ background: "rgba(255,255,255,0.03)", borderBottom: "1px solid rgba(255,255,255,0.06)" }}>
                    <span className="text-[9px] text-slate-400 font-bold tracking-wider">GAME {g.game}</span>
                    {g.dotabuffUrl && (
                      <a href={g.dotabuffUrl} target="_blank" rel="noopener noreferrer"
                        className="flex items-center gap-1.5 text-[9px] font-semibold hover:opacity-80 transition-opacity"
                        style={{ color: "#6e90b0" }} onClick={e => e.stopPropagation()}>
                        <img src="/icons/dotabuff.png" alt="Dotabuff" className="shrink-0" style={{ width: 12, height: 12 }} />
                        <span>Show Match</span>
                      </a>
                    )}
                  </div>
                  <div className="flex items-center justify-between px-3 pt-2 pb-1" style={{ background: "rgba(255,255,255,0.02)" }}>
                    <div className="flex-1 flex justify-center">
                      <span className="text-[11px] font-bold" style={{ color: t0?.color ?? "#888" }}>{t0?.name ?? "TBD"}</span>
                    </div>
                    <div className="flex items-center gap-2 px-4">
                      <span className="text-[15px] font-black tabular-nums" style={{ color: "#f0ede6" }}>{team0Score}</span>
                      <span className="text-[11px] text-slate-500 font-bold">:</span>
                      <span className="text-[15px] font-black tabular-nums" style={{ color: "#f0ede6" }}>{team1Score}</span>
                    </div>
                    <div className="flex-1 flex justify-center">
                      <span className="text-[11px] font-bold" style={{ color: t1?.color ?? "#888" }}>{t1?.name ?? "TBD"}</span>
                    </div>
                  </div>
                  <div className="flex items-center gap-2 px-3 py-2.5" style={{ background: "rgba(255,255,255,0.02)" }}>
                    <span className="text-[9px] font-black rounded px-1.5 shrink-0"
                      style={{ background: t0won ? "#16a34a" : "#dc2626", color: "#fff", lineHeight: "20px", height: 20, display: "inline-flex", alignItems: "center" }}>
                      {t0won ? "W" : "L"}
                    </span>
                    <div className="shrink-0" title={team0isRadiant ? "Radiant" : "Dire"}>
                      <img src={team0isRadiant ? "/Radiant_icon.webp" : "/Dire_icon.webp"} alt={team0isRadiant ? "Radiant" : "Dire"} style={{ width: 18, height: 18, display: "block" }} />
                    </div>
                    <div className="flex items-center gap-1 shrink-0">
                      {t0heroes.map((h, hi) => <HeroPill key={hi} name={h} won={t0won} />)}
                    </div>
                    <span className="text-[10px] text-slate-400 font-mono shrink-0 px-2 mx-auto">{g.duration}</span>
                    <div className="flex items-center gap-1 shrink-0">
                      {t1heroes.map((h, hi) => <HeroPill key={hi} name={h} won={t1won} />)}
                    </div>
                    <div className="shrink-0" title={team0isRadiant ? "Dire" : "Radiant"}>
                      <img src={team0isRadiant ? "/Dire_icon.webp" : "/Radiant_icon.webp"} alt={team0isRadiant ? "Dire" : "Radiant"} style={{ width: 18, height: 18, display: "block" }} />
                    </div>
                    <span className="text-[9px] font-black rounded px-1.5 shrink-0"
                      style={{ background: t1won ? "#16a34a" : "#dc2626", color: "#fff", lineHeight: "20px", height: 20, display: "inline-flex", alignItems: "center" }}>
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
          fontSize: 8, fontWeight: 700, lineHeight: 1, flexShrink: 0,
        }}
      >i</button>
      {createPortal(popover, document.body)}
    </div>
  )
}

/* ===================== NOTE BADGE (portal tooltip) ===================== */
function NoteBadge({ note }: { note: string }) {
  const [open, setOpen] = useState(false)
  const btnRef = useRef<HTMLDivElement>(null)
  const [coords, setCoords] = useState({ top: 0, left: 0, openRight: false })

  useEffect(() => {
    if (!open || !btnRef.current) return
    const r = btnRef.current.getBoundingClientRect()
    const popW = 220
    const openRight = r.left - popW - 8 < 0
    const left = openRight
      ? r.right + window.scrollX + 8
      : r.left + window.scrollX - popW - 8
    const top = r.top + window.scrollY + r.height / 2
    setCoords({ top, left, openRight })
  }, [open])

  useEffect(() => {
    if (!open) return
    const handler = (e: MouseEvent) => {
      if (btnRef.current && !btnRef.current.contains(e.target as Node)) setOpen(false)
    }
    document.addEventListener("mousedown", handler)
    return () => document.removeEventListener("mousedown", handler)
  }, [open])

  const popover = (
    <AnimatePresence>
      {open && (
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.95 }}
          transition={{ duration: 0.1 }}
          onMouseDown={e => e.stopPropagation()}
          style={{
            position: "absolute", top: coords.top, left: coords.left,
            transform: "translateY(-50%)", width: 220,
            background: "#0d1117", border: "1px solid rgba(251,191,36,0.35)",
            borderRadius: 6, boxShadow: "0 8px 24px rgba(0,0,0,0.85), 0 0 0 1px rgba(251,191,36,0.1)",
            zIndex: 99999, pointerEvents: "auto", padding: "8px 10px",
          }}
        >
          <div style={{
            position: "absolute", top: "50%", transform: "translateY(-50%)",
            ...(coords.openRight
              ? { right: "100%", borderRight: "5px solid rgba(251,191,36,0.35)", borderTop: "4px solid transparent", borderBottom: "4px solid transparent" }
              : { left: "100%", borderLeft: "5px solid rgba(251,191,36,0.35)", borderTop: "4px solid transparent", borderBottom: "4px solid transparent" }),
          }} />
          <p className="text-[9px] font-medium leading-snug" style={{ color: "#f0ede6" }}>
            <span style={{ color: "#fbbf24", fontWeight: 700 }}>⚠ NOTE: </span>
            {note}
          </p>
        </motion.div>
      )}
    </AnimatePresence>
  )

  return (
    <div style={{ zIndex: 60 }}>
      <div
        ref={btnRef}
        onMouseEnter={() => setOpen(true)}
        onMouseLeave={() => setOpen(false)}
        onMouseDown={e => { e.preventDefault(); e.stopPropagation(); setOpen(v => !v) }}
        className="flex items-center justify-center rounded-full cursor-default"
        style={{
          width: 13, height: 13,
          background: open ? "rgba(251,191,36,0.25)" : "rgba(251,191,36,0.15)",
          color: "#fbbf24", border: "1px solid rgba(251,191,36,0.45)",
          fontSize: 8, fontWeight: 700, lineHeight: 1,
        }}
      >!</div>
      {createPortal(popover, document.body)}
    </div>
  )
}

/* ===================== MATCH NODE ===================== */
function MatchNode({
  id, teams, winner, register, isGrandFinal, cardH, visualW, dqTeamId, games, note,
}: {
  id: string; teams: (Team | null)[]; winner?: string; isGrandFinal?: boolean
  cardH: number; visualW: number
  register: (id: string, el: HTMLElement | null) => void
  dqTeamId?: string; games?: GameDetail[]; note?: string; allTeams?: Team[]
}) {
  const slotH = Math.floor((cardH - 12) / 2)
  const isSingle = teams.length === 1
  const hasGames = (games?.length ?? 0) > 0

  const seriesWins = useMemo(() => {
    const map: Record<string, number> = {}
    games?.forEach(g => { map[g.winner] = (map[g.winner] ?? 0) + 1 })
    return map
  }, [games])

  return (
    <motion.div
      ref={el => register(id, el)}
      initial={{ opacity: 0, x: -8 }} animate={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.35, ease: "easeOut" }}
      whileHover={{ scale: 1.03, y: -1 }}
      className="rounded-lg cursor-default relative"
      style={{
        width: visualW, height: cardH,
        background: "linear-gradient(160deg,#282c37 0%,#1b1e26 100%)",
        border: isGrandFinal ? "1px solid rgba(245,197,66,0.6)" : "1px solid rgba(255,255,255,0.12)",
        boxShadow: isGrandFinal
          ? "0 0 20px rgba(245,197,66,0.2),0 0 6px rgba(245,197,66,0.1),0 4px 12px rgba(0,0,0,0.5)"
          : "0 4px 14px rgba(0,0,0,0.55)",
        overflow: "visible",
      }}
    >
      <div className="flex flex-col h-full" style={{ paddingTop: 4, paddingBottom: 4, gap: 2, paddingLeft: 4, paddingRight: hasGames ? 20 : 4 }}>
        {teams.map((t, i) => {
          const win  = Boolean(t?.id && t.id === winner)
          const isDQ = Boolean(t?.id && t.id === dqTeamId)
          const highlight = win || isSingle
          const lose = winner && !win
          const score = hasGames ? (seriesWins[t?.id ?? ""] ?? 0) : null
          return (
            <div
              key={i}
              ref={el => register(slotKey(id, i), el)}
              className={`flex items-center gap-1 px-2 rounded-md transition-all ${
                win && !isGrandFinal ? "hover:shadow-[0_0_18px_rgba(34,197,94,0.85)]" : ""
              } ${lose && !isGrandFinal ? "hover:shadow-[0_0_18px_rgba(239,68,68,0.8)]" : ""
              } ${isGrandFinal && win ? "hover:shadow-[0_0_22px_rgba(245,197,66,0.95)]" : ""
              } ${isGrandFinal && lose ? "hover:shadow-[0_0_18px_rgba(159,166,173,0.9)]" : ""}`}
              style={{
                flex: 1, height: slotH,
                background: isDQ
                  ? "rgba(127,29,29,0.45)"
                  : isGrandFinal && win
                  ? "linear-gradient(90deg,rgba(245,197,66,0.18) 0%,rgba(245,197,66,0.06) 100%)"
                  : highlight ? "rgba(255,255,255,0.07)" : "transparent",
                boxShadow: isDQ
                  ? "inset 0 0 0 1px rgba(255,0,0,0.2)"
                  : isGrandFinal && win ? "inset 0 0 12px rgba(245,197,66,0.15)"
                  : win ? `0 0 8px ${t?.color ?? "#fff"}33` : "none",
              }}
            >
              <span className="rounded-full shrink-0" style={{ width: 3, height: 13, background: isDQ ? "#7f1d1d" : (t?.color ?? "#444") }} />
              <span
                className={`text-[9px] flex-1 font-semibold truncate ${isDQ ? "line-through opacity-70" : ""}`}
                style={{
                  color: isDQ ? "#fca5a5"
                    : isGrandFinal && win ? GOLD
                    : isGrandFinal && !!lose ? "#5a6270"
                    : highlight ? "#f0ede6" : "#8a9190",
                  textShadow: isGrandFinal && win ? "0 0 6px rgba(245,197,66,0.6)" : "none",
                }}
              >{t?.name ?? "TBD"}</span>
              {score !== null && !isDQ && (
                <span className="text-[11px] font-black shrink-0 ml-1 tabular-nums"
                  style={{
                    color: isGrandFinal && win ? "#f5c542" : win ? "#f0ede6" : "#3d4755",
                    minWidth: 10, textAlign: "right",
                    textShadow: isGrandFinal && win ? "0 0 8px rgba(245,197,66,0.8)" : "none",
                  }}>{score}</span>
              )}
            </div>
          )
        })}
      </div>
      {(() => {
        // Show NoteBadge if there's a note OR if games exist but lack hero data
        const hasHeroData = games?.some(g => (g.radiantHeroes?.length ?? 0) > 0 || (g.direHeroes?.length ?? 0) > 0)
        const shouldShowNote = note || (hasGames && !hasHeroData)
        
        if (shouldShowNote) {
          const displayNote = note || "In-game data not found — teams did not use the league ticket."
          return (
            <div className="absolute flex items-center justify-center" style={{ right: 4, top: 0, bottom: 0 }}>
              <NoteBadge note={displayNote} />
            </div>
          )
        }
        
        if (hasGames && hasHeroData) {
          return (
            <div className="absolute flex items-center justify-center" style={{ right: 4, top: 0, bottom: 0 }}>
              <MatchInfoTooltip games={games!} teams={teams} />
            </div>
          )
        }
        
        return null
      })()}
    </motion.div>
  )
}

/* ===================== CONNECTORS ===================== */
type FlowS4 = {
  from: string; to: string; color: string
  spine?: boolean; spineX?: number; spineKey?: string
  fromSpine?: boolean; fromSpineY?: number
  toGF?: "ub" | "lb"; straight?: boolean; stub?: boolean
}

function ConnectorsS4({ pos, flows }: { pos: Record<string, Pos>; flows: FlowS4[] }) {
  const STEP = COL_GAP / 2

  const incomingMap = useMemo(() => {
    const map = new Map<string, FlowS4[]>()
    flows.forEach(f => { const a = map.get(f.to) ?? []; a.push(f); map.set(f.to, a) })
    return map
  }, [flows])

  const spineExtents = useMemo(() => {
    const extents = new Map<string, { x: number; minY: number; maxY: number }>()
    const expand = (key: string, x: number, y: number) => {
      const cur = extents.get(key)
      if (!cur) { extents.set(key, { x, minY: y, maxY: y }) }
      else { cur.minY = Math.min(cur.minY, y); cur.maxY = Math.max(cur.maxY, y) }
    }
    flows.forEach(f => {
      if (f.spineX === undefined) return
      const key = f.spineKey ?? String(f.spineX)
      if (f.spine) {
        const y = pos[f.from]?.y
        if (y !== undefined) expand(key, f.spineX, y)
      }
      if (f.fromSpine) {
        const y = pos[f.to]?.y
        if (y !== undefined) expand(key, f.spineX, y)
      }
    })
    return extents
  }, [flows, pos])

  return (
    <svg className="absolute inset-0 pointer-events-none"
      style={{ width: "100%", height: "100%", overflow: "visible" }}>
      {Array.from(spineExtents.entries()).map(([key, { x, minY, maxY }]) => (
        <path key={`spine-${key}`} d={`M ${x} ${minY} L ${x} ${maxY}`}
          fill="none" stroke={SILVER} strokeWidth={2.5} strokeLinecap="round" opacity={0.7} />
      ))}
      {flows.map((f, i) => {
        const a = pos[f.from], b = pos[f.to]
        if (!a) return null
        if (f.spine && f.spineX !== undefined) {
          const stopX = f.spineX - 2
          if (a.x >= stopX) return null
          return <path key={i} d={`M ${a.x} ${a.y} L ${stopX} ${a.y}`}
            fill="none" stroke={f.color} strokeWidth={1.8} strokeLinecap="round" opacity={0.85} />
        }
        if (f.fromSpine && f.spineX !== undefined && b) {
          const startX = f.spineX + 2
          const endX = b.lx; const endY = b.y
          if (endX <= startX) return null
          return <path key={i} d={`M ${startX} ${endY} L ${endX} ${endY}`}
            fill="none" stroke={f.color} strokeWidth={1.8} strokeLinecap="round" opacity={0.85} />
        }
        if (f.stub && b) {
          const STUB_LEN = 14
          const startX = b.lx - STUB_LEN
          return <path key={i} d={`M ${startX} ${b.y} L ${b.lx} ${b.y}`}
            fill="none" stroke={f.color} strokeWidth={1.8} strokeLinecap="round" opacity={0.85} />
        }
        if (!b) return null
        if (f.toGF) {
          const midX = a.x + STEP
          return (
            <g key={i}>
              <path d={`M ${a.x} ${a.y} L ${midX} ${a.y}`} fill="none" stroke={GOLD} strokeWidth={2} strokeLinecap="round" opacity={0.75} />
              <path d={`M ${midX} ${a.y} L ${midX} ${b.y}`} fill="none" stroke={GOLD} strokeWidth={2} strokeLinecap="round" opacity={0.75} />
              <path d={`M ${midX} ${b.y} L ${b.lx} ${b.y}`} fill="none" stroke={GOLD} strokeWidth={2} strokeLinecap="round" opacity={0.75} />
            </g>
          )
        }
        if (f.straight) {
          const midX = a.x + STEP
          return (
            <g key={i}>
              <path d={`M ${a.x} ${a.y} L ${midX} ${a.y}`} fill="none" stroke={f.color} strokeWidth={1.8} strokeLinecap="round" opacity={0.85} />
              <path d={`M ${midX} ${a.y} L ${midX} ${b.y}`} fill="none" stroke={f.color} strokeWidth={1.8} strokeLinecap="round" opacity={0.85} />
              <path d={`M ${midX} ${b.y} L ${b.lx} ${b.y}`} fill="none" stroke={f.color} strokeWidth={1.8} strokeLinecap="round" opacity={0.85} />
            </g>
          )
        }
        const group = incomingMap.get(f.to) ?? []
        const isMerge = group.filter(g => !g.spine && !g.fromSpine && !g.straight && !g.toGF).length === 2
        if (isMerge) {
          const midX = a.x + STEP
          return (
            <g key={i}>
              <path d={`M ${a.x} ${a.y} L ${midX} ${a.y}`} fill="none" stroke={f.color} strokeWidth={1.8} strokeLinecap="round" opacity={0.85} />
              <path d={`M ${midX} ${a.y} L ${midX} ${b.y}`} fill="none" stroke={f.color} strokeWidth={1.8} strokeLinecap="round" opacity={0.85} />
              {group.indexOf(f) === 0 && (
                <path d={`M ${midX} ${b.y} L ${b.lx} ${b.y}`} fill="none" stroke={SILVER} strokeWidth={2.2} strokeLinecap="round" opacity={0.7} />
              )}
            </g>
          )
        }
        return <path key={i}
          d={`M ${a.x} ${a.y} L ${a.x+STEP} ${a.y} L ${a.x+STEP} ${b.y} L ${b.lx} ${b.y}`}
          fill="none" stroke={f.color} strokeWidth={1.8} strokeLinecap="round" />
      })}
    </svg>
  )
}

/* ===================== MAIN COMPONENT ===================== */
export default function BracketS4({ data }: { data: BracketData4 }) {
  const { pos, register } = useNodePositions()
  const navigate = useNavigate()
  const handleMatchHover = useCallback((_id: string | null) => {}, [])
  void handleMatchHover

  const ubRounds = data.upper.rounds
  const lbRounds = data.lower.rounds

  const ubMaxMatches = Math.max(...ubRounds.map(r => r.matches.length))
  const lbMaxMatches = Math.max(...lbRounds.map(r => r.matches.length))

  const LB_STACK = STACK
  const COL_STRIDE = CARD_W + COL_GAP

  // All LB rounds use proportional (flat) spacing since no `from` arrays exist in the JSON.
  // This gives the same even funnel distribution S3 uses for UB spine-fed rounds.
  const LB_FLAT_ROUNDS = useMemo(
    () => new Set(lbRounds.map((_, i) => i)),
    [lbRounds]
  )

  const U = ubRounds.length  // 5
  const L = lbRounds.length  // 7

  // Map UB columns onto the LB grid (same logic as S3):
  // early rounds 1:1, last two UB rounds compress to last two LB columns
  const ubColIndex = (ri: number) => {
    if (ri <= U - 3) return ri
    if (ri === U - 2) return L - 3
    return L - 1
  }

  const colLeft = (ci: number) => 12 + ci * COL_STRIDE
  const ubRoundLeft = (ri: number) => colLeft(ubColIndex(ri))
  const lbRoundLeft = (ri: number) => colLeft(ri)

  const PANEL_W = L * COL_STRIDE + CARD_W + 24
  const UB_PANEL_W = PANEL_W
  const LB_PANEL_W = PANEL_W

  const UB_PANEL_H = ubMaxMatches * STACK + 72
  const LB_PANEL_H = lbMaxMatches * LB_STACK + 72

  const PANEL_GAP = 26
  const LB_TOP = UB_PANEL_H + PANEL_GAP

  const UB_CONTENT_TOP = 8 + LABEL_H + 16
  const LB_CONTENT_TOP = LB_TOP + LABEL_H + 16

  const ubFinalCache = new Map<string, number>()
  const ubFinalRoundIdx = ubRounds.length - 1
  const ubFinalY = getMatchY(ubFinalRoundIdx, 0, ubRounds, ubFinalCache, UB_FLAT_ROUNDS_S4)
  const ubFinalAbsY = UB_CONTENT_TOP + ubFinalY + CARD_H / 2

  const lbFinalCache = new Map<string, number>()
  const lbFinalRoundIdx = lbRounds.length - 1
  const lbFinalY = getMatchY(lbFinalRoundIdx, 0, lbRounds, lbFinalCache, LB_FLAT_ROUNDS, LB_STACK)
  const lbFinalAbsY = LB_CONTENT_TOP + lbFinalY + CARD_H / 2

  const GF_CARD_H = Math.round(CARD_H * 1.15)
  const GF_CARD_W = Math.round(CARD_W * 1.15)
  const GF_GAP = 38

  const BRACKET_W = PANEL_W
  const GF_PANEL_W = GF_CARD_W + 32
  const GF_PANEL_X = BRACKET_W + GF_GAP
  const GF_CARD_LEFT = GF_PANEL_X + 16

  const GF_CARD_TOP = Math.round((ubFinalAbsY + lbFinalAbsY) / 2 - GF_CARD_H / 2)
  const GF_PANEL_TOP = GF_CARD_TOP - 26
  const GF_PANEL_H = GF_CARD_H + 52

  const totalBracketsH = LB_TOP + LB_PANEL_H
  const TOTAL_W = GF_PANEL_X + GF_PANEL_W + 20
  const TOTAL_H = Math.max(totalBracketsH, GF_PANEL_TOP + GF_PANEL_H) + 20

  // S4 UB Final match id = "UB_FINAL_M1"; LB bracket final id = "LB_R7_M1"
  const ubWinner = ubRounds.flatMap(r => r.matches).find(m => m.id === "UB_FINAL_M1")
  const lbWinner = lbRounds.flatMap(r => r.matches).find(m => m.id === "LB_R7_M1")

  const SPINE_X_R1 = ubRoundLeft(0) + CARD_W + COL_GAP / 2
  const SPINE_X_R2 = ubRoundLeft(1) + CARD_W + COL_GAP / 2
  const SPINE_X_R3 = ubRoundLeft(2) + CARD_W + COL_GAP / 2

  // LB spine X positions for R1→R2, R2→R3, and R3→R4 (completion-order seeding)
  const LB_SPINE_X_R1 = lbRoundLeft(0) + CARD_W + COL_GAP / 2
  const LB_SPINE_X_R2 = lbRoundLeft(1) + CARD_W + COL_GAP / 2
  const LB_SPINE_X_R3 = lbRoundLeft(2) + CARD_W + COL_GAP / 2

  const flows = useMemo<FlowS4[]>(() => {
    const f: FlowS4[] = []

    const findTargetByTeam = (nextRound: Round, teamId?: string | null) =>
      teamId ? nextRound.matches.find(t => t.teams?.includes(teamId)) : undefined

    ubRounds.forEach((r, ri) => {
      const nextRound = ubRounds[ri + 1]
      if (!nextRound) return
      const isSpineRound = ri === 0 || ri === 1
      const spineX = ri === 0 ? SPINE_X_R1 : SPINE_X_R2
      const spineKey = ri === 0 ? "ub-r1" : "ub-r2"
      r.matches.forEach((m, mi) => {
        const clampedIdx = Math.min(Math.floor(mi / 2), nextRound.matches.length - 1)
        const fallbackTarget =
          findTargetByTeam(nextRound, m.teams?.[0]) ??
          findTargetByTeam(nextRound, m.teams?.[1]) ??
          nextRound.matches[clampedIdx]
        if (!fallbackTarget) return
        if (isSpineRound) {
          m.teams?.forEach((teamId, ti) => {
            const isWinner = m.winner ? teamId === m.winner : true
            if (!isWinner) return
            const c = teamById(data.teams, teamId)?.color ?? "#666"
            f.push({ from: slotKey(m.id, ti), to: fallbackTarget.id, color: c, spine: true, spineX, spineKey })
          })
        } else {
          const advancingTeamId =
            m.winner ??
            m.teams?.find(t => t && nextRound.matches.some(nm => nm.teams?.includes(t)))
          const target = findTargetByTeam(nextRound, advancingTeamId) ?? fallbackTarget
          const winnerColor = teamById(data.teams, advancingTeamId)?.color ?? "#666"
          f.push({ from: m.id, to: target.id, color: winnerColor })
        }
      })
    })

    // Entry stubs into UB spine-fed rounds (UB R2, R3 — indices 1, 2 only).
    // Only teams that actually WON in the previous round get an entry stub
    // off the spine. Teams already seeded directly into this round (byes /
    // waiting slots that skipped the prior round entirely) render with no
    // incoming connector at all — same as a plain Round 1 card.
    ;([1, 2] as number[]).forEach(ri => {
      const round = ubRounds[ri]
      const prevRound = ubRounds[ri - 1]
      if (!round || !prevRound) return
      const prevWinners = new Set(
        prevRound.matches.map(m => m.winner).filter(Boolean) as string[]
      )
      const spineX = ri === 1 ? SPINE_X_R1 : SPINE_X_R2
      const spineKey = ri === 1 ? "ub-r1" : "ub-r2"
      round.matches.forEach(m => {
        m.teams?.forEach((teamId, ti) => {
          if (!teamId) return
          const c = teamById(data.teams, teamId)?.color ?? "#666"
          if (prevWinners.has(teamId)) {
            f.push({ from: slotKey(m.id, ti), to: slotKey(m.id, ti), color: c, fromSpine: true, spineX, spineKey })
          } else {
            f.push({ from: slotKey(m.id, ti), to: slotKey(m.id, ti), color: c, stub: true })
          }
        })
      })
    })

    lbRounds.forEach((r, ri) => {
      const nextRound = lbRounds[ri + 1]
      if (!nextRound) return

      const isLbSpineRound = ri === 0
      const lbSpineX = LB_SPINE_X_R1
      const lbSpineKey = "lb-r1"
      // ri=1 (R2→R3, 4:4) and ri=3 (R4→R5, 1:1): straight elbow per card
      const isLbSingleLine = ri === 1 || ri === 3

      r.matches.forEach((m, mi) => {
        const clampedIdx = Math.min(Math.floor(mi / 2), nextRound.matches.length - 1)
        const fallbackTarget =
          findTargetByTeam(nextRound, m.teams?.[0]) ??
          findTargetByTeam(nextRound, m.teams?.[1]) ??
          nextRound.matches[clampedIdx] ??
          nextRound.matches[0]
        if (!fallbackTarget) return

        if (isLbSpineRound) {
          m.teams?.forEach((teamId, ti) => {
            const isWinner = m.winner ? teamId === m.winner : true
            if (!isWinner) return
            const c = teamById(data.teams, teamId)?.color ?? "#666"
            f.push({ from: slotKey(m.id, ti), to: fallbackTarget.id, color: c, spine: true, spineX: lbSpineX, spineKey: lbSpineKey })
          })
        } else if (isLbSingleLine) {
          const advancingTeamId =
            m.winner ??
            m.teams?.find(t => t && nextRound.matches.some(nm => nm.teams?.includes(t)))
          const target = findTargetByTeam(nextRound, advancingTeamId) ?? fallbackTarget
          const winnerTeam = teamById(data.teams, advancingTeamId) ?? teamById(data.teams, m.teams?.[0])
          f.push({ from: m.id, to: target.id, color: winnerTeam?.color ?? "#666", straight: true })
        } else {
          const advancingTeamId =
            m.winner ??
            m.teams?.find(t => t && nextRound.matches.some(nm => nm.teams?.includes(t)))
          const target = findTargetByTeam(nextRound, advancingTeamId) ?? fallbackTarget
          const winnerTeam = teamById(data.teams, advancingTeamId) ?? teamById(data.teams, m.teams?.[0])
          f.push({ from: m.id, to: target.id, color: winnerTeam?.color ?? "#666" })
        }
      })
    })

    // Entry stubs INTO LB R2 from the R1→R2 spine — same guard as UB:
    // only teams that won in LB R1 get an entry stub off the spine.
    ;([1] as number[]).forEach(ri => {
      const round = lbRounds[ri]
      const prevRound = lbRounds[ri - 1]
      if (!round || !prevRound) return
      const prevWinners = new Set(
        prevRound.matches.map(m => m.winner).filter(Boolean) as string[]
      )
      round.matches.forEach(m => {
        m.teams?.forEach((teamId, ti) => {
          if (!teamId) return
          const c = teamById(data.teams, teamId)?.color ?? "#666"
          if (prevWinners.has(teamId)) {
            f.push({ from: slotKey(m.id, ti), to: slotKey(m.id, ti), color: c, fromSpine: true, spineX: LB_SPINE_X_R1, spineKey: "lb-r1" })
          } else {
            f.push({ from: slotKey(m.id, ti), to: slotKey(m.id, ti), color: c, stub: true })
          }
        })
      })
    })

    if (ubWinner) {
      const t = teamById(data.teams, ubWinner.winner)
      if (t) f.push({ from: ubWinner.id, to: data.grandFinal.id, color: t.color, toGF: "ub" })
    }
    if (lbWinner) {
      const t = teamById(data.teams, lbWinner.winner)
      if (t) f.push({ from: lbWinner.id, to: data.grandFinal.id, color: t.color, toGF: "lb" })
    }

    return f
  }, [data, ubRounds, lbRounds, ubWinner, lbWinner, SPINE_X_R1, SPINE_X_R2, SPINE_X_R3, LB_SPINE_X_R1, LB_SPINE_X_R2, LB_SPINE_X_R3])

  return (
    <div className="w-full min-h-screen flex items-start justify-start px-4 py-6 overflow-x-auto"
      style={{ background: "linear-gradient(135deg,#0d0f14 0%,#111520 50%,#0d0f14 100%)" }}>

      <button onClick={() => navigate('/seasons?season=4')}
        className="fixed left-6 top-24 z-50 px-3 sm:px-4 py-1.5 sm:py-2 rounded-full text-[0.65rem] sm:text-[0.72rem] font-semibold uppercase tracking-[0.12em] bg-gradient-to-tr from-white/90 via-zinc-200 to-zinc-300 text-[#050608] shadow-[0_8px_26px_rgba(2,6,23,0.55)] hover:brightness-105 transition-all duration-200 backdrop-blur-sm border border-white/10 cursor-pointer"
        type="button">← Back</button>
      <button onClick={() => navigate('/playoff/3')}
        className="fixed right-44 top-24 z-50 px-3 sm:px-4 py-1.5 sm:py-2 rounded-full text-[0.65rem] sm:text-[0.72rem] font-semibold uppercase tracking-[0.12em] bg-gradient-to-tr from-white/90 via-zinc-200 to-zinc-300 text-[#050608] shadow-[0_8px_26px_rgba(2,6,23,0.55)] hover:brightness-105 transition-all duration-200 backdrop-blur-sm border border-white/10 cursor-pointer"
        type="button">← Prev Season</button>
      <button onClick={() => navigate('/playoff/5')}
        className="fixed right-6 top-24 z-50 px-3 sm:px-4 py-1.5 sm:py-2 rounded-full text-[0.65rem] sm:text-[0.72rem] font-semibold uppercase tracking-[0.12em] bg-gradient-to-tr from-white/90 via-zinc-200 to-zinc-300 text-[#050608] shadow-[0_8px_26px_rgba(2,6,23,0.55)] hover:brightness-105 transition-all duration-200 backdrop-blur-sm border border-white/10 cursor-pointer"
        type="button">Next Season →</button>

      <div style={{ position: "relative", maxWidth: "fit-content",
        border: "2px solid rgba(255,255,255,0.15)", borderRadius: 16,
        background: "rgba(255,255,255,0.008)", boxShadow: "0 0 60px rgba(0,0,0,0.6)", overflow: "visible" }}>

        <div className="flex items-center justify-center py-3 border-b border-white/10 px-4">
          <span className="text-sm font-black tracking-[0.28em] uppercase"
            style={{ color: GOLD, textShadow: "0 0 8px rgba(245,197,66,0.25)" }}>SEASON-Ⅳ (Playoff)</span>
        </div>

        <div className="mx-4 mt-3 flex items-start gap-2 px-4 py-2.5" style={{
          background: "rgba(245,197,66,0.14)", border: "1px solid rgba(245,197,66,0.5)",
          borderRadius: 8, boxShadow: "0 0 14px rgba(245,197,66,0.12)",
        }}>
          <span className="text-[11px] font-black shrink-0" style={{ color: GOLD }}>⚠ SEEDING NOTE</span>
          <p className="text-[11px] leading-relaxed" style={{ color: "#f0ede6" }}>
           8 teams were seeded directly into Upper Bracket Round 2, waiting for the 8 Round 1 winners to join them — their nodes don't start from the silver spine like the advancing teams do. Beyond that, UB R2 & R3 and LB R1 & R2 don't have fixed bracket slots — whichever series finishes first claims the next open slot, so matchups are determined by completion order rather than a fixed bracket position.
          </p>
        </div>

        <div className="overflow-visible p-4">
          <div className="bracket-root-s4 relative" style={{ width: TOTAL_W, height: TOTAL_H }}>
            <ConnectorsS4 pos={pos} flows={flows} />

            {/* Upper Bracket Panel */}
            <div style={{ position: "absolute", top: 8, left: 0, width: UB_PANEL_W, height: UB_PANEL_H,
              border: "1px solid rgba(255,255,255,0.14)", borderRadius: 10, background: "rgba(255,255,255,0.02)" }}>
              <p className="text-[10px] font-bold text-slate-300 uppercase tracking-widest text-center mt-2">UPPER BRACKET </p>
            </div>

            {ubRounds.map((r, ri) => {
              const cache = new Map<string, number>()
              return (
                <div key={r.id} style={{ position: "absolute", left: ubRoundLeft(ri), top: UB_CONTENT_TOP }}>
                  <p className="text-[9px] text-center text-slate-500 tracking-wider uppercase mb-1.5" style={{ width: CARD_W }}>{r.label}</p>
                  <div style={{ position: "relative", width: CARD_W, height: ubMaxMatches * STACK + CARD_H }}>
                    {r.matches.map((m, mi) => (
                      <div key={m.id} style={{ position: "absolute", top: getMatchY(ri, mi, ubRounds, cache, UB_FLAT_ROUNDS_S4) }}>
                        <MatchNode id={m.id} teams={m.teams?.map(t => teamById(data.teams, t)) ?? [null, null]}
                          winner={m.winner} register={register} cardH={CARD_H} visualW={CARD_W}
                          dqTeamId={m.dqTeamId} games={m.games} note={m.note} allTeams={data.teams} />
                      </div>
                    ))}
                  </div>
                </div>
              )
            })}

            {/* Lower Bracket Panel */}
            <div style={{ position: "absolute", top: LB_TOP, left: 0, width: LB_PANEL_W, height: LB_PANEL_H,
              border: "1px solid rgba(255,255,255,0.14)", borderRadius: 10, background: "rgba(255,255,255,0.02)" }}>
              <p className="text-[10px] font-bold text-slate-300 uppercase tracking-widest text-center mt-2">LOWER BRACKET</p>
            </div>

            {lbRounds.map((r, ri) => {
              const cache = new Map<string, number>()
              return (
                <div key={r.id} style={{ position: "absolute", left: lbRoundLeft(ri), top: LB_CONTENT_TOP }}>
                  <p className="text-[9px] text-center text-slate-500 tracking-wider uppercase mb-1.5" style={{ width: CARD_W }}>{r.label}</p>
                  <div style={{ position: "relative", width: CARD_W, height: lbMaxMatches * LB_STACK + CARD_H }}>
                    {r.matches.map((m, mi) => (
                      <div key={m.id} style={{ position: "absolute", top: getMatchY(ri, mi, lbRounds, cache, LB_FLAT_ROUNDS, LB_STACK) }}>
                        <MatchNode id={m.id} teams={m.teams?.map(t => teamById(data.teams, t)) ?? [null, null]}
                          winner={m.winner} register={register} cardH={CARD_H} visualW={CARD_W}
                          dqTeamId={m.dqTeamId} games={m.games} note={m.note} allTeams={data.teams} />
                      </div>
                    ))}
                  </div>
                </div>
              )
            })}

            {/* Grand Final Panel */}
            <div style={{ position: "absolute", top: GF_PANEL_TOP, left: GF_PANEL_X,
              width: GF_PANEL_W, height: GF_PANEL_H,
              border: "1px solid rgba(245,197,66,0.25)", borderRadius: 12,
              background: "rgba(245,197,66,0.012)", boxShadow: "0 0 12px rgba(245,197,66,0.07)" }}>
              <p className="text-[10px] font-bold text-center uppercase tracking-widest mt-2" style={{ color: GOLD }}>GRAND FINAL (BO3)</p>
            </div>

            <AnimatePresence>
              <motion.div key="gf"
                initial={{ opacity: 0, scale: 0.85 }} animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.5, ease: "easeOut" }}
                style={{ position: "absolute", left: GF_CARD_LEFT, top: GF_CARD_TOP, zIndex: 30 }}>
                <div className="absolute rounded-full pointer-events-none" style={{
                  width: GF_CARD_W * 2, height: GF_CARD_W * 2,
                  left: -GF_CARD_W * 0.5, top: -GF_CARD_W * 0.5,
                  background: "radial-gradient(circle,rgba(245,197,66,0.08) 0%,transparent 70%)" }} />
                <MatchNode id={data.grandFinal.id} isGrandFinal
                  teams={data.grandFinal.teams?.map(t => teamById(data.teams, t)) ?? [null, null]}
                  winner={data.grandFinal.winner} register={register}
                  cardH={GF_CARD_H} visualW={GF_CARD_W}
                  games={data.grandFinal.games} allTeams={data.teams} />
              </motion.div>
            </AnimatePresence>

          </div>
        </div>
      </div>
    </div>
  )
}
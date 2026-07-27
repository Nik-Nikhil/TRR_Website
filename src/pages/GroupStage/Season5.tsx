// src/GroupStage/Season5.tsx - Season 5 Group Stage (4 groups layout)
import { motion } from "framer-motion"
import { useNavigate } from "react-router-dom"
import { useMemo, useState, useRef, useEffect } from "react"
import { createPortal } from "react-dom"

export type TeamRow = {
  captain: string
  color: string
  team: string
  wdl: string
  pts: number
  dq?: boolean
}

export type SeriesMatch = { 
  team1: string; 
  result: string; 
  team2: string;
  games?: Array<{
    game: number;
    duration: string;
    winner: string;
    radiant: string;
    dire: string;
    radiantScore: number;
    direScore: number;
    radiantHeroes?: string[];
    direHeroes?: string[];
    dotabuffUrl?: string;
  }>;
}

export type GroupStageData = {
  format?: string
  groups: Record<string, TeamRow[]>
  series?: Record<string, Record<string, SeriesMatch[]>>
  tiebreakers?: Record<string, Array<{ match: string; result: string; winner: string; games?: any[] }>>
}

const GOLD = "#f5c542"

function getTeamNameFontSize(name: string): string {
  const len = name.length
  if (len > 16) return "8px"
  if (len > 13) return "8.5px"
  if (len > 10) return "9px"
  return "10px"
}

export default function GroupStageTable({ data, season }: { data: GroupStageData; season: string }) {
  const navigate = useNavigate()
  const groupKeys = Object.keys(data.groups).sort()
  const [openTooltipId, setOpenTooltipId] = useState<string | null>(null)

  return (
    <div
      className="w-full min-h-screen flex items-start justify-center px-4"
      style={{ 
        background: "linear-gradient(135deg,#0d0f14 0%,#111520 50%,#0d0f14 100%)",
        paddingTop: "90px",
        paddingBottom: "24px"
      }}
    >
      <div className="w-full max-w-[1600px] flex flex-col items-center gap-4">

        {/* Title row with buttons on sides */}
        <div className="w-full flex items-center justify-between">
          <button
            onClick={() => navigate(`/seasons?season=${season}`)}
            className="px-3 sm:px-4 py-1.5 sm:py-2 rounded-full text-[0.65rem] sm:text-[0.72rem] font-semibold uppercase tracking-[0.12em] bg-gradient-to-tr from-white/90 via-zinc-200 to-zinc-300 text-[#050608] shadow-[0_8px_26px_rgba(2,6,23,0.55)] hover:brightness-105 transition-all duration-200 backdrop-blur-sm border border-white/10"
          >
            ← BACK
          </button>

          <div className="text-center">
            <h1
              className="text-xl font-black uppercase tracking-wider mb-0.5"
              style={{ color: GOLD, textShadow: "0 0 15px rgba(245,197,66,0.4)" }}
            >
              Season {season} — Group Stage
            </h1>
            <p className="text-[9px] uppercase tracking-widest" style={{ color: "#6b7280" }}>
              Round Robin • Best of 2
            </p>
            {/* Tip box */}
            <div
              className="inline-flex items-center gap-1.5 mt-2 px-2.5 py-1 rounded-full"
              style={{
                background: "rgba(245,197,66,0.08)",
                border: "1px solid rgba(245,197,66,0.2)",
              }}
            >
              <span className="text-[9px] tracking-wide" style={{ color: "#a3a3a3" }}>
                Click the
              </span>
              <div
                className="flex items-center justify-center rounded-full shrink-0"
                style={{
                  width: 13, height: 13,
                  background: "rgba(255,255,255,0.08)",
                  border: "1px solid rgba(255,255,255,0.14)",
                  color: "#6b7280",
                  fontSize: 8,
                  fontWeight: 700,
                  lineHeight: 1,
                }}
              >
                i
              </div>
              <span className="text-[9px] tracking-wide" style={{ color: "#a3a3a3" }}>
                to view match details
              </span>
            </div>
          </div>

          <button
            onClick={() => navigate(`/playoff/${season}`)}
            className="px-3 sm:px-4 py-1.5 sm:py-2 rounded-full text-[0.65rem] sm:text-[0.72rem] font-semibold uppercase tracking-[0.12em] bg-gradient-to-tr from-white/90 via-zinc-200 to-zinc-300 text-[#050608] shadow-[0_8px_26px_rgba(2,6,23,0.55)] hover:brightness-105 transition-all duration-200 backdrop-blur-sm border border-white/10"
          >
            PLAYOFF →
          </button>
        </div>

        {/* Points System */}
        <div className="flex items-center justify-center gap-3 text-[9px] uppercase tracking-wider" style={{ color: "#9ca3af" }}>
          <span className="font-bold">Points:</span>
          <div className="flex items-center gap-1">
            <span className="px-1.5 py-0.5 rounded font-bold" style={{ background: "#22c55e33", color: "#22c55e" }}>3</span>
            <span style={{ color: "#d1d5db" }}>Win</span>
          </div>
          <div className="flex items-center gap-1">
            <span className="px-1.5 py-0.5 rounded font-bold" style={{ background: "#eab30833", color: "#eab308" }}>1</span>
            <span style={{ color: "#d1d5db" }}>Draw</span>
          </div>
          <div className="flex items-center gap-1">
            <span className="px-1.5 py-0.5 rounded font-bold" style={{ background: "#ef444433", color: "#ef4444" }}>0</span>
            <span style={{ color: "#d1d5db" }}>Loss</span>
          </div>
        </div>

        {/* Groups in 2x2 grid — 2 groups above, 2 groups below */}
        <div className="w-full grid grid-cols-2 gap-4 max-w-[1400px]">
          {groupKeys.map((groupKey, idx) => (
            <LiquipediaStyleGroup
              key={groupKey}
              groupKey={groupKey}
              teams={data.groups[groupKey]}
              series={data.series?.[groupKey]}
              tiebreaker={data.tiebreakers?.[groupKey]}
              index={idx}
              openTooltipId={openTooltipId}
              setOpenTooltipId={setOpenTooltipId}
            />
          ))}
        </div>

      </div>
    </div>
  )
}

function LiquipediaStyleGroup({
  groupKey,
  teams,
  series,
  tiebreaker,
  index,
  openTooltipId,
  setOpenTooltipId,
}: {
  groupKey: string
  teams: TeamRow[]
  series?: Record<string, SeriesMatch[]>
  tiebreaker?: Array<{ match: string; result: string; winner: string; games?: any[] }>
  index: number
  openTooltipId: string | null
  setOpenTooltipId: (id: string | null) => void
}) {
  // Build match matrix
  const matchMatrix = useMemo(() => {
    const matrix: Record<string, Record<string, string>> = {}
    if (!series) return matrix

    // Process all series
    Object.values(series).forEach((seriesMatches) => {
      seriesMatches.forEach((match) => {
        if (!matrix[match.team1]) matrix[match.team1] = {}
        if (!matrix[match.team2]) matrix[match.team2] = {}
        
        matrix[match.team1][match.team2] = match.result
        
        const [score1, score2] = match.result.split("-")
        const reversedResult = `${score2}-${score1}`
        matrix[match.team2][match.team1] = reversedResult
      })
    })

    return matrix
  }, [series])

  const getRankColor = (rank: number) => {
    if (rank === 1) return "#22c55e"  // bright emerald green - 1st place (clearly distinct)
    if (rank <= 3) return "#93C47D"   // medium olive green - 2nd & 3rd place
    if (rank === 4) return "#E69138"  // orange - 4th place
    return "#6b7280" // gray - eliminated
  }

  const isQualified = (rank: number) => rank <= 4

  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: index * 0.1 }}
      style={{
        background: "linear-gradient(145deg, rgba(21,26,34,0.95) 0%, rgba(15,19,28,0.98) 100%)",
        border: "1px solid rgba(255,255,255,0.1)",
        borderRadius: 12,
        overflow: "hidden",
        boxShadow: "0 10px 40px rgba(0,0,0,0.5)"
      }}
    >
      {/* Group Header */}
      <div 
        className="px-3 py-2"
        style={{
          background: `linear-gradient(90deg, ${GOLD}20 0%, transparent 100%)`,
          borderBottom: "1px solid rgba(255,255,255,0.1)"
        }}
      >
        <h2 className="text-sm font-black uppercase tracking-wider text-center" style={{ color: GOLD }}>
          {groupKey}
        </h2>
      </div>

      {/* Liquipedia-style Table */}
      <div className="overflow-x-hidden">
        <table style={{ borderCollapse: "collapse", tableLayout: "fixed", width: "100%" }}>
          <colgroup>
            <col style={{ width: "5%" }} />
            <col style={{ width: "18%" }} />
            {teams.map((_, i) => <col key={i} style={{ width: `${54 / teams.length}%` }} />)}
            <col style={{ width: "5%" }} />
            <col style={{ width: "5%" }} />
            <col style={{ width: "5%" }} />
            <col style={{ width: "8%" }} />
          </colgroup>
          <thead>
            <tr style={{ background: "rgba(0,0,0,0.3)" }}>
              <th className="liqui-th" style={{ textAlign: "center", padding: "6px 2px", fontSize: "10px" }}>#</th>
              <th className="liqui-th" style={{ textAlign: "left", padding: "6px 8px", fontSize: "10px" }}>Team</th>
              {teams.map((t) => (
                <th key={t.captain} className="liqui-th" style={{ textAlign: "center", padding: "6px 2px" }}>
                  <div className="flex flex-col items-center gap-0.5">
                    <div 
                      className="w-2 h-2 rounded-full"
                      style={{ background: t.color, boxShadow: `0 0 4px ${t.color}` }}
                    />
                    <span
                      className="font-mono font-bold"
                      style={{
                        fontSize: getTeamNameFontSize(t.captain),
                        whiteSpace: "nowrap",
                        maxWidth: 48,
                        overflow: "hidden",
                        textOverflow: "ellipsis",
                      }}
                    >
                      {t.captain}
                    </span>
                  </div>
                </th>
              ))}
              <th className="liqui-th" style={{ textAlign: "center", padding: "6px 2px", fontSize: "10px" }}>W</th>
              <th className="liqui-th" style={{ textAlign: "center", padding: "6px 2px", fontSize: "10px" }}>D</th>
              <th className="liqui-th" style={{ textAlign: "center", padding: "6px 2px", fontSize: "10px" }}>L</th>
              <th className="liqui-th" style={{ textAlign: "center", padding: "6px 2px", fontSize: "10px" }}>Pts</th>
            </tr>
          </thead>
          <tbody>
            {teams.map((team, idx) => {
              const rank = idx + 1
              const rankColor = getRankColor(rank)
              const qualified = isQualified(rank)
              const [w, d, l] = team.wdl.split("-").map(Number)

              return (
                <motion.tr
                  key={team.captain}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.5 + idx * 0.05 }}
                  className="group liqui-row"
                  style={{
                    borderLeft: `3px solid ${rankColor}`,
                    background: qualified 
                      ? `linear-gradient(90deg, ${rankColor}15 0%, rgba(255,255,255,0.02) 50%)`
                      : idx % 2 === 0 ? "rgba(255,255,255,0.02)" : "rgba(0,0,0,0.1)",
                    opacity: !qualified && rank > 4 ? 0.6 : 1,
                    boxShadow: qualified ? `inset 0 0 20px ${rankColor}10` : "none"
                  }}
                >
                  {/* Rank */}
                  <td className="liqui-td" style={{ textAlign: "center", padding: "6px 2px" }}>
                    <div 
                      className="inline-flex items-center justify-center w-5 h-5 rounded font-bold text-[10px]"
                      style={{
                        background: `${rankColor}22`,
                        color: rankColor,
                        border: `1px solid ${rankColor}44`
                      }}
                    >
                      {rank}
                    </div>
                  </td>

                  {/* Team */}
                  <td className="liqui-td" style={{ padding: "6px 8px", whiteSpace: "nowrap", overflow: "hidden" }}>
                    <div className="flex items-center gap-1.5" style={{ minWidth: 0 }}>
                      <div 
                        className="w-2 h-2 rounded-full flex-shrink-0"
                        style={{ background: team.color, boxShadow: `0 0 6px ${team.color}` }}
                      />
                      <span
                        className="font-bold"
                        style={{
                          color: "#f0ede6",
                          fontSize: getTeamNameFontSize(team.captain),
                          whiteSpace: "nowrap",
                          overflow: "hidden",
                          textOverflow: "ellipsis",
                          minWidth: 0,
                        }}
                        title={team.captain}
                      >
                        {team.captain}
                      </span>
                      {qualified && (
                        <div 
                          className="ml-1 px-1.5 py-0.5 rounded font-black text-[8px] flex-shrink-0"
                          style={{
                            background: `${rankColor}33`,
                            color: rankColor,
                            border: `1px solid ${rankColor}66`,
                            boxShadow: `0 0 6px ${rankColor}44`
                          }}
                          title={rank <= 2 ? "Qualified to Upper Bracket" : rank === 3 ? "Qualified to Lower Bracket" : "Qualified to Lower Bracket"}
                        >
                          Q
                        </div>
                      )}
                    </div>
                  </td>

                  {/* Match results vs other teams */}
                  {teams.map((opponent) => (
                    <td key={opponent.captain} className="liqui-td" style={{ background: "rgba(0,0,0,0.2)", padding: "6px 2px", textAlign: "center" }}>
                      {team.captain === opponent.captain ? (
                        <span className="text-sm font-bold" style={{ color: "#4b5563" }}>—</span>
                      ) : (
                        <div className="flex items-center justify-center">
                          <MatchCell 
                            result={matchMatrix[team.captain]?.[opponent.captain]} 
                            team1={team.captain}
                            team2={opponent.captain}
                            series={series}
                            tooltipId={`${groupKey}-${team.captain}-${opponent.captain}`}
                            openTooltipId={openTooltipId}
                            setOpenTooltipId={setOpenTooltipId}
                          />
                        </div>
                      )}
                    </td>
                  ))}

                  {/* W/D/L */}
                  <td className="liqui-td text-center" style={{ padding: "6px 2px" }}>
                    <span className="font-mono font-semibold text-[11px]" style={{ color: "#22c55e" }}>{w}</span>
                  </td>
                  <td className="liqui-td text-center" style={{ padding: "6px 2px" }}>
                    <span className="font-mono font-semibold text-[11px]" style={{ color: "#eab308" }}>{d}</span>
                  </td>
                  <td className="liqui-td text-center" style={{ padding: "6px 2px" }}>
                    <span className="font-mono font-semibold text-[11px]" style={{ color: "#ef4444" }}>{l}</span>
                  </td>

                  {/* Points */}
                  <td className="liqui-td text-center" style={{ padding: "6px 2px" }}>
                    <div 
                      className="inline-flex items-center justify-center px-2 py-0.5 rounded font-black text-[11px]"
                      style={{
                        background: `${rankColor}25`,
                        color: rankColor,
                        border: `1px solid ${rankColor}44`
                      }}
                    >
                      {team.pts}
                    </div>
                  </td>
                </motion.tr>
              )
            })}
          </tbody>
        </table>
      </div>

      {/* Tiebreaker - Compact Display */}
      {tiebreaker && tiebreaker.length > 0 && (
        <div className="px-3 py-2" style={{ borderTop: "1px solid rgba(255,255,255,0.05)" }}>
          {tiebreaker.map((tb, tbIdx) => (
            <div 
              key={tbIdx}
              className="rounded overflow-hidden mb-2 last:mb-0"
              style={{
                background: "linear-gradient(90deg, rgba(251,191,36,0.12) 0%, rgba(251,191,36,0.04) 100%)",
                border: "1px solid rgba(251,191,36,0.25)"
              }}
            >
              <div className="px-3 py-1.5 flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <span className="text-sm">⚡</span>
                  <span className="text-[9px] font-black uppercase tracking-wider" style={{ color: "#fbbf24" }}>
                    Tiebreaker Match
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-[10px] font-bold" style={{ color: "#d1d5db" }}>
                    {tb.match.replace(/_/g, ' ')}
                  </span>
                  <div 
                    className="px-2 py-0.5 rounded font-mono font-black text-[10px]"
                    style={{
                      background: "rgba(34,197,94,0.15)",
                      border: "1px solid rgba(34,197,94,0.3)",
                      color: "#22c55e"
                    }}
                  >
                    {tb.result}
                  </div>
                  <span className="text-[9px]" style={{ color: "#a16207" }}>Winner:</span>
                  <span className="text-[10px] font-bold" style={{ color: "#fbbf24" }}>
                    {tb.winner}
                  </span>
                  <span 
                    className="px-1.5 py-0.5 rounded font-black text-[8px]"
                    style={{
                      background: "#22c55e33",
                      color: "#22c55e",
                      border: "1px solid #22c55e66"
                    }}
                  >
                    Q
                  </span>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </motion.div>
  )
}

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

function MatchCell({ 
  result, 
  team1, 
  team2, 
  series,
  tooltipId,
  openTooltipId,
  setOpenTooltipId
}: { 
  result?: string; 
  team1: string;
  team2: string;
  series?: Record<string, SeriesMatch[]>;
  tooltipId: string;
  openTooltipId: string | null;
  setOpenTooltipId: (id: string | null) => void;
}) {
  const showTooltip = openTooltipId === tooltipId
  const btnRef = useRef<HTMLDivElement>(null)
  const [coords, setCoords] = useState({ top: 0, left: 0 })

  // Find the match data with games
  const matchData = useMemo(() => {
    if (!series) return null;
    
    for (const seriesMatches of Object.values(series)) {
      const found = seriesMatches.find(
        m => (m.team1 === team1 && m.team2 === team2) || 
             (m.team1 === team2 && m.team2 === team1)
      );
      if (found && found.games && found.games.length > 0) {
        return found;
      }
    }
    return null;
  }, [series, team1, team2]);

  const hasGames = matchData?.games && matchData.games.length > 0;

  useEffect(() => {
    if (!showTooltip || !btnRef.current || !matchData?.games) return
    const r = btnRef.current.getBoundingClientRect()
    const popH = matchData.games.length * 160
    const popW = 580
    const viewportWidth = window.innerWidth
    const viewportHeight = window.innerHeight

    // Open upward if not enough space below
    const openUp = r.bottom + popH > viewportHeight - 20

    // Center horizontally on the button, clamped to viewport
    const idealLeft = r.left + r.width / 2 - popW / 2
    const leftPos = Math.max(10, Math.min(idealLeft, viewportWidth - popW - 10))

    setCoords({
      top: openUp ? r.top - popH - 4 : r.bottom + 4,
      left: leftPos,
    })
  }, [showTooltip, matchData])

  useEffect(() => {
    if (!showTooltip) return
    const handler = () => setOpenTooltipId(null)
    document.addEventListener("click", handler)
    return () => document.removeEventListener("click", handler)
  }, [showTooltip, setOpenTooltipId])

  if (!result) return (
    <div className="inline-flex items-center gap-1.5" style={{ whiteSpace: "nowrap" }}>
      <span className="text-xs" style={{ color: "#374151" }}>—</span>
      <div style={{ width: 13, height: 13, flexShrink: 0 }} />
    </div>
  )

  const [score1, score2] = result.split("-").map(Number)
  const isDraw = score1 === score2
  const isWin = score1 > score2

  // Render detailed tooltip with heroes if games data exists
  const tooltip = showTooltip && hasGames && matchData.games && (
    <motion.div
      initial={{ opacity: 0, y: -4, scale: 0.95 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      exit={{ opacity: 0, scale: 0.95 }}
      transition={{ duration: 0.15 }}
      style={{
        position: "fixed",
        top: coords.top,
        left: coords.left,
        zIndex: 99999,
        pointerEvents: "auto",
        width: 580,
      }}
      onMouseDown={e => e.stopPropagation()}
    >
      <div
        style={{
          background: "#0d1117",
          border: "1px solid rgba(255,255,255,0.1)",
          borderRadius: 8,
          boxShadow: "0 20px 60px rgba(0,0,0,0.95)",
          overflow: "hidden",
        }}
      >
        {matchData.games.map((g) => {
          const team1isRadiant = team1 === g.radiant
          const team1Score = team1isRadiant ? g.radiantScore : g.direScore
          const team2Score = team1isRadiant ? g.direScore : g.radiantScore
          const t1won = g.winner === team1
          const t2won = g.winner === team2
          const radiantHeroes = g.radiantHeroes ?? []
          const direHeroes = g.direHeroes ?? []
          const t1heroes = team1isRadiant ? radiantHeroes : direHeroes
          const t2heroes = team1isRadiant ? direHeroes : radiantHeroes

          return (
            <div key={g.game}>
              {/* Game header */}
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
                    <img src="/icons/dotabuff.png" alt="Dotabuff" className="shrink-0" style={{ width: 12, height: 12 }} />
                    <span>Show Match</span>
                  </a>
                )}
              </div>

              {/* Team names row */}
              <div className="flex items-center justify-between px-3 pt-2 pb-1" style={{ background: "rgba(255,255,255,0.02)" }}>
                <div className="flex-1 flex justify-center">
                  <span className="text-[11px] font-bold" style={{ color: "#888" }}>{team1}</span>
                </div>
                <div className="flex items-center gap-2 px-4">
                  <span className="text-[15px] font-black tabular-nums" style={{ color: "#f0ede6" }}>{team1Score}</span>
                  <span className="text-[11px] text-slate-500 font-bold">:</span>
                  <span className="text-[15px] font-black tabular-nums" style={{ color: "#f0ede6" }}>{team2Score}</span>
                </div>
                <div className="flex-1 flex justify-center">
                  <span className="text-[11px] font-bold" style={{ color: "#888" }}>{team2}</span>
                </div>
              </div>

              {/* Heroes row */}
              <div className="flex items-center gap-2 px-3 py-2.5" style={{ background: "rgba(255,255,255,0.02)" }}>
                <span className="text-[9px] font-black rounded px-1.5 shrink-0"
                  style={{ background: t1won ? "#16a34a" : "#dc2626", color: "#fff", lineHeight: "20px", height: 20, display: "inline-flex", alignItems: "center" }}>
                  {t1won ? "W" : "L"}
                </span>
                <div className="shrink-0" title={team1isRadiant ? "Radiant" : "Dire"}>
                  <img src={team1isRadiant ? "/Radiant_icon.webp" : "/Dire_icon.webp"} alt={team1isRadiant ? "Radiant" : "Dire"} style={{ width: 18, height: 18, display: "block" }} />
                </div>
                <div className="flex items-center gap-1 shrink-0">
                  {t1heroes.map((h, hi) => <HeroPill key={hi} name={h} won={t1won} />)}
                </div>
                <span className="text-[10px] text-slate-400 font-mono shrink-0 px-2 mx-auto">{g.duration}</span>
                <div className="flex items-center gap-1 shrink-0">
                  {t2heroes.map((h, hi) => <HeroPill key={hi} name={h} won={t2won} />)}
                </div>
                <div className="shrink-0" title={team1isRadiant ? "Dire" : "Radiant"}>
                  <img src={team1isRadiant ? "/Dire_icon.webp" : "/Radiant_icon.webp"} alt={team1isRadiant ? "Dire" : "Radiant"} style={{ width: 18, height: 18, display: "block" }} />
                </div>
                <span className="text-[9px] font-black rounded px-1.5 shrink-0"
                  style={{ background: t2won ? "#16a34a" : "#dc2626", color: "#fff", lineHeight: "20px", height: 20, display: "inline-flex", alignItems: "center" }}>
                  {t2won ? "W" : "L"}
                </span>
              </div>

              {/* Divider between games */}
              {g.game < matchData.games!.length && (
                <div className="relative py-4 px-3" style={{ background: "rgba(0,0,0,0.3)" }}>
                  <div style={{ 
                    height: "2px", 
                    background: "linear-gradient(90deg, transparent 0%, rgba(245,197,66,0.4) 20%, rgba(245,197,66,0.6) 50%, rgba(245,197,66,0.4) 80%, transparent 100%)",
                    boxShadow: "0 0 8px rgba(245,197,66,0.3)"
                  }} />
                </div>
              )}
            </div>
          )
        })}
      </div>
      {/* Arrow */}
      <div style={{ position: "absolute", top: -6, left: "50%", transform: "translateX(-50%)", width: 0, height: 0, borderLeft: "6px solid transparent", borderRight: "6px solid transparent", borderBottom: "6px solid rgba(255,255,255,0.1)" }} />
    </motion.div>
  )

  return (
    <div 
      ref={btnRef}
      className="inline-flex items-center gap-1.5 cursor-pointer group"
      onClick={(e) => {
        e.stopPropagation()
        if (hasGames) {
          setOpenTooltipId(showTooltip ? null : tooltipId)
        }
      }}
      style={{ whiteSpace: "nowrap" }}
    >
      <div
        className="inline-flex items-center justify-center px-2 py-0.5 rounded text-[10px] font-mono font-bold transition-all group-hover:scale-105"
        style={{
          background: isDraw ? "rgba(234,179,8,0.15)" : isWin ? "rgba(34,197,94,0.15)" : "rgba(239,68,68,0.15)",
          border: `1px solid ${isDraw ? "rgba(234,179,8,0.3)" : isWin ? "rgba(34,197,94,0.3)" : "rgba(239,68,68,0.3)"}`,
          color: isDraw ? "#eab308" : isWin ? "#22c55e" : "#ef4444",
          minWidth: "28px",
          height: "18px"
        }}
      >
        {result}
      </div>
      {hasGames ? (
        <div
          className="flex items-center justify-center rounded-full transition-all group-hover:scale-110"
          style={{
            width: 13,
            height: 13,
            background: showTooltip ? "rgba(245,197,66,0.2)" : "rgba(255,255,255,0.08)",
            color: showTooltip ? GOLD : "#6b7280",
            border: `1px solid ${showTooltip ? "rgba(245,197,66,0.45)" : "rgba(255,255,255,0.14)"}`,
            fontSize: 8,
            fontWeight: 700,
            flexShrink: 0,
          }}
        >
          i
        </div>
      ) : (
        <div style={{ width: 13, height: 13, flexShrink: 0 }} />
      )}
      {createPortal(tooltip, document.body)}
    </div>
  )
}

// CSS for Liquipedia-style cells
const styles = `
.liqui-th {
  padding: 12px 8px;
  font-size: 11px;
  font-weight: 700;
  text-transform: uppercase;
  letter-spacing: 0.05em;
  color: #9ca3af;
  border-bottom: 1px solid rgba(255,255,255,0.1);
}

.liqui-td {
  padding: 12px 8px;
  border-bottom: 1px solid rgba(255,255,255,0.03);
  transition: background 0.15s;
  position: relative;
}

/* Row highlight on hover — gold tint across the entire row */
.liqui-row {
  transition: background 0.15s;
}
.liqui-row:hover .liqui-td {
  background: rgba(245,197,66,0.05) !important;
}

/* Left accent line that appears on hover */
.liqui-row:hover {
  border-left-color: #f5c542 !important;
}

/* Top highlight line on the hovered row */
.liqui-row:hover .liqui-td:first-child::before {
  content: "";
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  height: 1px;
  background: linear-gradient(90deg, rgba(245,197,66,0.5), rgba(245,197,66,0.1), transparent);
  pointer-events: none;
}
.liqui-row:hover .liqui-td:last-child::after {
  content: "";
  position: absolute;
  bottom: 0;
  left: 0;
  right: 0;
  height: 1px;
  background: linear-gradient(90deg, rgba(245,197,66,0.5), rgba(245,197,66,0.1), transparent);
  pointer-events: none;
}
`

// Inject styles
if (typeof document !== 'undefined') {
  const styleSheet = document.createElement("style")
  styleSheet.textContent = styles
  document.head.appendChild(styleSheet)
}
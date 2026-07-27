// src/pages/GroupStage/GroupStage.tsx
import { useParams, useNavigate } from "react-router-dom"
import GroupStageTable, { type GroupStageData } from "./Season2"
import GroupStageTable5 from "./Season5"

import season2 from "../../data/GroupStage/Season2.json"
import season5 from "../../data/GroupStage/Season5.json"

type SeasonNumber = 1 | 2 | 3 | 4 | 5

const GROUP_STAGE_BY_SEASON: Partial<Record<SeasonNumber, GroupStageData>> = {
  2: season2 as unknown as GroupStageData,
  5: season5 as GroupStageData,
  // Seasons 1, 3, 4 did not have a group stage format
}

const SEASONS_WITHOUT_GROUP_STAGE = [1, 3, 4]

export default function GroupStage() {
  const { season } = useParams<{ season: string }>()
  const navigate = useNavigate()
  const seasonNum = parseInt(season || "2", 10) as SeasonNumber

  // Check if this season has no group stage
  if (SEASONS_WITHOUT_GROUP_STAGE.includes(seasonNum)) {
    return (
      <div 
        className="w-full min-h-screen flex flex-col items-center justify-center px-4" 
        style={{ background: "linear-gradient(135deg,#0d0f14 0%,#111520 50%,#0d0f14 100%)" }}
      >
        <div className="text-center">
          <h1 
            className="text-4xl font-black uppercase tracking-wider mb-4"
            style={{ 
              color: "#f5c542", 
              textShadow: "0 0 20px rgba(245,197,66,0.5)" 
            }}
          >
            Season {seasonNum}
          </h1>
          <p className="text-lg text-gray-400 mb-8">
            This season did not have a group stage format.
          </p>
          <button
            onClick={() => navigate(`/playoff/${seasonNum}`)}
            className="px-3 sm:px-4 py-1.5 sm:py-2 rounded-full text-[0.65rem] sm:text-[0.72rem] font-semibold uppercase tracking-[0.12em] bg-gradient-to-tr from-white/90 via-zinc-200 to-zinc-300 text-[#050608] shadow-[0_8px_26px_rgba(2,6,23,0.55)] hover:brightness-105 transition-all duration-200 backdrop-blur-sm border border-white/10"
          >
            View Playoff Bracket
          </button>
        </div>
      </div>
    )
  }

  // Fallback to season 2 if invalid or no data available
  const validSeason = GROUP_STAGE_BY_SEASON[seasonNum] ? seasonNum : 2
  const data = GROUP_STAGE_BY_SEASON[validSeason]

  if (!data) {
    return (
      <div className="w-full min-h-screen flex items-center justify-center" style={{ background: "#0d0f14" }}>
        <p className="text-lg text-gray-400">No group stage data available for Season {validSeason}</p>
      </div>
    )
  }

  return seasonNum === 5 ? (
    <GroupStageTable5 data={data} season={String(validSeason)} />
  ) : (
    <GroupStageTable data={data} season={String(validSeason)} />
  )
}

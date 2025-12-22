// src/pages/GroupStage.tsx
import { useParams, useNavigate } from "react-router-dom"
import GroupStageTable from "./GroupStageTable"
import type { TeamRow } from "./GroupStageTable"

import season2 from "../data/GroupStage/Season2.json"

type SeasonNumber = 2

type GroupsWrapper = {
  groups: Record<string, TeamRow[]>
}

const GROUPS_BY_SEASON: Record<SeasonNumber, GroupsWrapper> = {
  2: season2,
}

export default function GroupsPage() {
  const { season } = useParams()
  const navigate = useNavigate()
  const seasonNumber = Number(season) as SeasonNumber

  const seasonData = GROUPS_BY_SEASON[seasonNumber]

  if (!seasonData?.groups) {
    return (
      <main className="p-6">
        <h1 className="text-xl font-bold text-red-400">
          Groups — Season {season}
        </h1>
        <p className="mt-4 text-white/60">
          Group data not found for this season.
        </p>
      </main>
    )
  }

  return (
    <main className="relative px-6 pb-6 pt-36">

      {/* BACK TO SEASONS */}
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

      {/* GO TO PLAYOFF */}
      <button
        onClick={() => navigate(`/playoff/${season}`)}
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
        PLAYOFF →
      </button>

      {/* PAGE CONTENT */}
      <GroupStageTable groups={seasonData.groups} />
    </main>
  )
}

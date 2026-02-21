// src/pages/Playoff.tsx
import { useParams } from "react-router-dom"

import BracketS1 from "./Brackets/Bracket_s1"
import BracketS2 from "./Brackets/Bracket_s2"
import BracketS3 from "./Brackets/Bracket_s3"

import type { BracketData } from "./Brackets/Bracket_s1"
import type { Season2Data } from "./Brackets/Bracket_s2"
import type { BracketData3 } from "./Brackets/Bracket_s3"

import season1 from "../data/Bracket/Season1.json"
import season2 from "../data/Bracket/Season2.json"
import season3 from "../data/Bracket/Season3.json"
import season4 from "../data/Bracket/Season4.json"
import season5 from "../data/Bracket/Season5.json"

/* ---------------- Types ---------------- */

type SeasonNumber = 1 | 2 | 3 | 4 | 5

type SeasonBracketData =
  | BracketData
  | Season2Data
  | BracketData3

type BracketComponentMap = {
  1: React.ComponentType<{ data: BracketData }>
  2: React.ComponentType<{ data: Season2Data }>
  3: React.ComponentType<{ data: BracketData3 }>
  4: React.ComponentType<{ data: BracketData }>
  5: React.ComponentType<{ data: BracketData }>
}

/* ---------------- Maps ---------------- */

const BRACKETS_BY_SEASON: Record<SeasonNumber, SeasonBracketData> = {
  1: season1 as unknown as BracketData,
  2: season2 as Season2Data,
  3: season3 as BracketData3,
  4: season4 as unknown as BracketData,
  5: season5 as unknown as BracketData,
}

const BRACKET_COMPONENT_BY_SEASON: BracketComponentMap = {
  1: BracketS1,
  2: BracketS2,
  3: BracketS3, // ✅ FIXED
  4: BracketS1,
  5: BracketS1,
}

/* ---------------- Component ---------------- */

export default function Playoff() {
  const { season } = useParams()
  const seasonNumber = Number(season) as SeasonNumber

  const bracketData = BRACKETS_BY_SEASON[seasonNumber]
  const BracketComponent = BRACKET_COMPONENT_BY_SEASON[seasonNumber]

  if (!bracketData || !BracketComponent) {
    return (
      <main className="p-6">
        <h1 className="text-xl font-bold text-red-400">
          Playoff — Season {season}
        </h1>
        <p className="mt-4 text-white/60">
          Bracket data or component not found for this season.
        </p>
      </main>
    )
  }

  return (
    <main className="p-6">
      <h1 className="text-2xl font-extrabold mb-6">
        Playoff — Season {season}
      </h1>

      {/* safe cast via mapping */}
      <BracketComponent data={bracketData as any} />
    </main>
  )
}

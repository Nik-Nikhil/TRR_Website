// src/pages/Playoff.tsx
import React from "react"
import { useParams } from "react-router-dom"

import BracketS1 from "./Playoff/Bracket_s1"
import BracketS2 from "./Playoff/Bracket_s2"
import BracketS3 from "./Playoff/Bracket_s3"
import BracketS4 from "./Playoff/Bracket_s4"
import InteractiveBracket from "../components/bracket/InteractiveBracket"

import type { BracketData } from "./Playoff/Bracket_s1"
import type { Season2Data } from "./Playoff/Bracket_s2"
import type { BracketData3 } from "./Playoff/Bracket_s3"
import type { BracketData4 } from "./Playoff/Bracket_s4"

import season1 from "../data/Playoff/Season1.json"
import season2 from "../data/Playoff/Season2.json"
import season3 from "../data/Playoff/Season3.json"
import season4 from "../data/Playoff/Season4.json"
import season5 from "../data/Playoff/Season5.json"

/* ---------------- Types ---------------- */

type SeasonNumber = 1 | 2 | 3 | 4 | 5

type SeasonBracketData =
  | BracketData
  | Season2Data
  | BracketData3
  | BracketData4

type BracketComponentMap = {
  1: React.ComponentType<{ data: BracketData }>
  2: React.ComponentType<{ data: Season2Data }>
  3: React.ComponentType<{ data: BracketData3 }>
  4: React.ComponentType<{ data: BracketData4 }>
  5: React.ComponentType<{ data: BracketData }>
}

/* ---------------- Maps ---------------- */

const BRACKETS_BY_SEASON: Record<SeasonNumber, SeasonBracketData> = {
  1: season1 as unknown as BracketData,
  2: season2 as Season2Data,
  3: season3 as BracketData3,
  4: season4 as BracketData4,
  5: season5 as unknown as BracketData,
}

const BRACKET_COMPONENT_BY_SEASON: BracketComponentMap = {
  1: BracketS1,
  2: BracketS2,
  3: BracketS3,
  4: BracketS4,
  5: BracketS1,
}

/* ---------------- Component ---------------- */

export default function Playoff() {
  const { season } = useParams()
  const seasonNumber = Number(season) as SeasonNumber

  const bracketData = BRACKETS_BY_SEASON[seasonNumber]

  if (!bracketData) {
    return (
      <div className="p-6">
        <h1 className="text-xl font-bold text-red-400">Playoff — Season {season}</h1>
        <p className="mt-4 text-white/60">Bracket data not found for this season.</p>
      </div>
    )
  }

  return (
    <div className="w-full overflow-x-auto pt-16 sm:pt-[68px] md:pt-[76px] lg:pt-20">
      {BRACKET_COMPONENT_BY_SEASON[seasonNumber] ? (
        (() => {
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
          return React.createElement(BRACKET_COMPONENT_BY_SEASON[seasonNumber] as any, { data: bracketData })
        })()
      ) : (
        <InteractiveBracket data={bracketData} />
      )}
    </div>
  )
}

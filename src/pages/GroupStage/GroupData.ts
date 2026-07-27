// src/data/groupStageData.ts
import type { TeamRow } from "./Season2"

// A small rotating accent-color palette for the colored dot next to each captain name.
const PALETTE = ["#38bdf8", "#f97316", "#a78bfa", "#f43f5e", "#34d399", "#fbbf24"]

export const season = "season-2"

export const groups: Record<string, TeamRow[]> = {
  "Group A": [
    { captain: "Irox", color: PALETTE[0], team: "Kasuali Tigers", wdl: "3-2-0", pts: 11 },
    { captain: "@tom1c", color: PALETTE[1], team: "Imposters", wdl: "2-3-0", pts: 9 },
    { captain: "Bazinga", color: PALETTE[2], team: "Ohh Yes Dabba Kardiya", wdl: "2-2-1", pts: 8 },
    { captain: "r3ciprocal", color: PALETTE[3], team: "Monarchs", wdl: "1-4-0", pts: 7 },
    { captain: "Banner", color: PALETTE[4], team: "Mango Juice", wdl: "1-1-3", pts: 4 },
    { captain: "gxnova", color: PALETTE[5], team: "Team Liquor", wdl: "0-0-5", pts: 0 },
  ],
  "Group B": [
    { captain: "Madlad", color: PALETTE[0], team: "Blink Feed Repeat", wdl: "3-1-1", pts: 10 },
    { captain: "Machine", color: PALETTE[1], team: "Hilf Munters", wdl: "3-0-2", pts: 9 },
    { captain: "MSlayer_", color: PALETTE[2], team: "Stylish Slayers", wdl: "2-2-1", pts: 8 },
    { captain: "MaDaRa", color: PALETTE[3], team: "Demonic Empire", wdl: "2-2-1", pts: 8 },
    { captain: "GRIMM", color: PALETTE[4], team: "Immortals", wdl: "2-1-2", pts: 7 },
    { captain: "»Jjn[X]eD«", color: PALETTE[5], team: "Python Hunterz", wdl: "0-0-5", pts: 0 },
  ],
}

// Group B finished with MSlayer_ and MaDaRa tied on points (8).
// MSlayer_ took rank 3 over MaDaRa via a 1-0 tiebreaker match, which is
// already reflected in the ordering above (MSlayer_ listed before MaDaRa).
export const groupBTiebreaker = {
  match: "MSlayer_ vs MaDaRa",
  result: "1-0",
  winner: "MSlayer_",
}
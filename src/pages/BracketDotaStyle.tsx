// src/pages/BracketDotaStyle.tsx
import { useMemo, useState } from "react";
import { teams as teamsData } from "../pages/data/teams"; // adjust path if needed

const BASE_COL_GAP = 260;
const TOTAL_COLUMNS = 5; // R1, R2, R3, UB Winner, GF
const W = BASE_COL_GAP * TOTAL_COLUMNS + 120;
const H = 860;
const TILE_W = 200;
const TILE_H = 92;
const HEADER_GAP = 34;        // bar → round buttons
const ROUND_BUTTON_GAP = 44; // round buttons → matches


/* ---------- small helpers & tournament (your existing data) ---------- */
const TOURNAMENT = {
  tournament: {
    name: "TRR Tournament",
    upperBracket: {
      rounds: [
        {
          round: 1,
          bo: "BO1",
          matches: [
            { id: "UB-R1-M1", team1: "Banner", team2: "Reciprocal", winner: "Reciprocal" },
            { id: "UB-R1-M2", team1: "Billy", team2: "Godspeed", winner: "Godspeed" },
            { id: "UB-R1-M3", team1: "Helm", team2: "Kolly", winner: "Kolly" },
            { id: "UB-R1-M4", team1: "Nabeel", team2: "Bazinga", winner: "Bazinga" }
          ]
        },
        {
          round: 2,
          bo: "BO1",
          matches: [
            { id: "UB-R2-M1", team1: "Reciprocal", team2: "Godspeed", winner: "Reciprocal" },
            { id: "UB-R2-M2", team1: "Kolly", team2: "Bazinga", winner: "Kolly" }
          ]
        },
        {
          round: 3,
          bo: "BO3",
          matches: [
            { id: "UB-R3-M1", team1: "Reciprocal", team2: "Kolly", winner: "Reciprocal" }
          ]
        }
      ],
      winner: "Reciprocal"
    },

    lowerBracket: {
      rounds: [
        {
          round: 1,
          bo: "BO1",
          matches: [
            { id: "LB-R1-M1", team1: "Banner", team2: "Billy", winner: "Billy" },
            { id: "LB-R1-M2", team1: "Helm", team2: "Nabeel", winner: "Helm" }
          ]
        },
        {
          round: 2,
          bo: "BO1",
          matches: [
            { id: "LB-R2-M1", team1: "Bazinga", team2: "Banner", winner: "Banner" },
            { id: "LB-R2-M2", team1: "Godspeed", team2: "Helm", winner: "Godspeed" }
          ]
        },
        {
          round: 3,
          bo: "BO1",
          matches: [
            { id: "LB-R3-M1", team1: "Banner", team2: "Godspeed", winner: "Godspeed" }
          ]
        },
        {
          round: 4,
          bo: "BO3",
          matches: [
            { id: "LB-R4-M1", team1: "Banner", team2: "Godspeed", winner: "Godspeed" }
          ]
        }
      ],
      winner: "Godspeed"
    },

    grandFinals: {
      bo: "BO3",
      match: {
        id: "GF-M1",
        team1: "Reciprocal",
        team2: "Godspeed",
        winner: "Godspeed"
      },
      finalWinner: "Godspeed"
    }
  }
};

const warnedTiles = new Set<string>();

function normalizeDisplay(val: any, tileId?: string): string {
  if (val == null) return "";
  if (typeof val === "string" || typeof val === "number") return String(val);
  if (typeof val === "object") {
    if (typeof val.nickname === "string") return val.nickname;
    if (typeof val.name === "string") return val.name;
    if (typeof val.id === "string") return val.id;
    if (tileId && !warnedTiles.has(tileId)) {
      console.warn(`[BracketDotaStyle] Invalid value in tile '${tileId}'. Expected string/number.`, val);
      warnedTiles.add(tileId);
    }
    try {
      return JSON.stringify(val);
    } catch {
      return "[object]";
    }
  }
  return String(val);
}

function accentFromTeam(team: any) {
  return team?.logoColor ?? "#8892a0";
}

function normalizeNameForMatch(s: string | null) {
  if (!s) return "";
  return String(s).replace(/`/g, "").replace(/[^\w\s-]/g, "").replace(/\s+/g, " ").trim().toLowerCase();
}

function findTeamObject(teamsList: any[], displayName: string | null) {
  if (!displayName) return null;
  const exact = teamsList.find((t) => t.id === displayName || t.name === displayName);
  if (exact) return exact;
  const lowered = displayName.toLowerCase();
  const ci = teamsList.find((t) => (t.id && t.id.toLowerCase() === lowered) || (t.name && t.name.toLowerCase() === lowered));
  if (ci) return ci;
  const normalized = normalizeNameForMatch(displayName);
  const normMatch = teamsList.find((t) => {
    const n1 = t.id ? normalizeNameForMatch(String(t.id)) : "";
    const n2 = t.name ? normalizeNameForMatch(String(t.name)) : "";
    return n1 === normalized || n2 === normalized;
  });
  if (normMatch) return normMatch;
  const placeholderId = displayName.replace(/\s+/g, "-").replace(/[^a-zA-Z0-9-_`]/g, "").toLowerCase() || displayName.toLowerCase();
  return { id: placeholderId, name: displayName, players: [], logoColor: "#7f8c8d" };
}

/* ---------------- Tile ---------------- */

function Tile({ t, hoveredTeamId, setHoveredTeamId }: { t: any; hoveredTeamId: string | null; setHoveredTeamId: (id: string | null) => void; }) {
  const team1 = t.team1;
  const team2 = t.team2;
  const captain1 = normalizeDisplay(team1?.players?.[0]?.nickname ?? team1?.name ?? team1, `${t.id}-team1`);
  const captain2 = normalizeDisplay(team2?.players?.[0]?.nickname ?? team2?.name ?? team2, `${t.id}-team2`);
  const color1 = accentFromTeam(team1);
  const color2 = accentFromTeam(team2);

  // detect winner/loser for styling
  const winnerName = t.rawMatch?.winner ?? null;
  const normalizedWinner = normalizeNameForMatch(winnerName);
  const team1IdLike = (team1?.id ?? team1?.name ?? team1) as string;
  const team2IdLike = (team2?.id ?? team2?.name ?? team2) as string;
  const team1IsWinner = normalizedWinner && normalizeNameForMatch(team1IdLike) === normalizedWinner;
  const team2IsWinner = normalizedWinner && normalizeNameForMatch(team2IdLike) === normalizedWinner;

  // Special styling for grand final tile (golden)
  const isGrandFinal = t.id === "gf";

  // DQ detection for Kolly in UB final (ufinal)
  const kollyDQOnThisTile = t.id === "ufinal" && ((team1 && normalizeNameForMatch(team1.name ?? team1) === "kolly") || (team2 && normalizeNameForMatch(team2.name ?? team2) === "kolly"));

  // For ease: determine whether a particular row should render a trophy (only GF winner)
  const rowHasTrophy = (rowTeam: any) => {
    if (!isGrandFinal) return false;
    if (!rowTeam) return false;
    const gfWinner = t.rawMatch?.winner ?? null;
    return gfWinner && normalizeNameForMatch(rowTeam.name ?? rowTeam) === normalizeNameForMatch(gfWinner);
  };

  return (
    <div className="absolute" style={{ left: t.x, top: t.y, width: TILE_W, height: TILE_H }} role="group">
      <div
        className="rounded-xl w-full h-full overflow-hidden border transition-all"
        style={{
          border: isGrandFinal ? "2px solid rgba(160,120,30,0.95)" : "2px solid rgba(255,255,255,0.05)",
          background: isGrandFinal
            ? "linear-gradient(180deg, #ead08a 0%, #ccb354 45%, #b78f2a 60%, #8b6616 100%)"
            : "linear-gradient(180deg, rgba(255,255,255,0.02), rgba(0,0,0,0.09))",
          padding: 8,
          boxShadow: isGrandFinal ? "0 8px 30px rgba(180,140,40,0.12), inset 0 2px 6px rgba(255,255,255,0.08)" : undefined,
        }}
      >
        <div style={{ display: "flex", flexDirection: "column", gap: 8, height: "100%", justifyContent: "center" }}>
          <div
            onMouseEnter={() => setHoveredTeamId(team1?.id ?? null)}
            onMouseLeave={() => setHoveredTeamId(null)}
            style={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              padding: "8px 10px",
              borderRadius: 8,
              background:
                kollyDQOnThisTile && team1 && normalizeNameForMatch(team1.name ?? team1) === "kolly"
                  ? "linear-gradient(90deg, rgba(255,100,100,0.12), rgba(150,40,40,0.06))"
                  : team1IsWinner
                    ? `linear-gradient(90deg, ${color1}22, ${color1}11)`
                    : "transparent",
              boxShadow:
                kollyDQOnThisTile && team1 && normalizeNameForMatch(team1.name ?? team1) === "kolly"
                  ? "0 8px 24px rgba(200,40,40,0.18) inset"
                  : team1IsWinner
                    ? `0 6px 18px ${color1}22`
                    : undefined,
              cursor: "pointer",
            }}
          >
            <div style={{ display: "flex", gap: 10, alignItems: "center" }}>
  {/* Team color indicator */}
 <div
  style={{
    width: 14,
    height: 14,
    borderRadius: 4,
    background: color1,
    boxShadow: `0 0 6px ${color1}99`,
  }}
/>

  {/* Captain name + badges */}
  <div
    style={{
      fontSize: 14,
      fontWeight: 700,
      color: isGrandFinal
        ? "#3c2b00"
        : team1IsWinner
          ? "#9affc7"     // neon green
          : team2IsWinner
            ? "#ff9a9a"   // neon red
            : "#9fb3c8",  // neutral neon gray
      whiteSpace: "nowrap",
      overflow: "hidden",
      textOverflow: "ellipsis",
      display: "flex",
      gap: 8,
      alignItems: "center",
      textShadow: team1IsWinner
        ? "0 0 6px rgba(120,255,180,0.9)"
        : team2IsWinner
          ? "0 0 6px rgba(255,120,120,0.8)"
          : "none",
    }}
  >
    <span>{captain1}</span>

    {rowHasTrophy(team1) && (
      <span style={{ marginLeft: 4, filter: "drop-shadow(0 0 6px gold)" }}>
        🏆
      </span>
    )}

    {/* DQ badge */}
    {kollyDQOnThisTile &&
      team1 &&
      normalizeNameForMatch(team1.name ?? team1) === "kolly" && (
        <span
          style={{
            color: "#fff",
            background: "linear-gradient(90deg,#ff4d4d,#b30000)",
            padding: "2px 6px",
            borderRadius: 6,
            fontSize: 11,
            fontWeight: 800,
            boxShadow: "0 0 10px rgba(255,60,60,0.9)",
          }}
        >
          DQ
        </span>
      )}
  </div>
</div>

{/* Score / Status */}
<div
  style={{
    fontWeight: 800,
    color: isGrandFinal
      ? "#3c2b00"
      : team1IsWinner
        ? "#9affc7"
        : team2IsWinner
          ? "#ff9a9a"
          : "#9fb3c8",
    textShadow: team1IsWinner
      ? "0 0 6px rgba(120,255,180,0.9)"
      : team2IsWinner
        ? "0 0 6px rgba(255,120,120,0.8)"
        : "none",
  }}
>
  {kollyDQOnThisTile &&
  team1 &&
  normalizeNameForMatch(team1.name ?? team1) === "kolly"
    ? "DQ"
    : normalizeDisplay(team1?.score ?? "-")}
</div>

          </div>

          <div
            onMouseEnter={() => setHoveredTeamId(team2?.id ?? null)}
            onMouseLeave={() => setHoveredTeamId(null)}
            style={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              padding: "8px 10px",
              borderRadius: 8,
              background:
                kollyDQOnThisTile && team2 && normalizeNameForMatch(team2.name ?? team2) === "kolly"
                  ? "linear-gradient(90deg, rgba(255,100,100,0.12), rgba(150,40,40,0.06))"
                  : team2IsWinner
                    ? `linear-gradient(90deg, ${color2}22, ${color2}11)`
                    : "transparent",
              boxShadow:
                kollyDQOnThisTile && team2 && normalizeNameForMatch(team2.name ?? team2) === "kolly"
                  ? "0 8px 24px rgba(200,40,40,0.18) inset"
                  : team2IsWinner
                    ? `0 6px 18px ${color2}22`
                    : undefined,
              cursor: "pointer",
            }}
          >
            <div style={{ display: "flex", gap: 10, alignItems: "center" }}>
              <div style={{ width: 14, height: 14, borderRadius: 4, background: color2,
boxShadow: `0 0 6px ${color2}99`,
 }} />
              <div style={{ fontSize: 15, fontWeight: 700, color: isGrandFinal ? "#3c2b00" : (team2IsWinner ? "#bff1c2" : "#e6eef8"), whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis", display: "flex", gap: 8, alignItems: "center" }}>
                <span>{captain2}</span>
                {rowHasTrophy(team2) ? <span style={{ marginLeft: 6 }}>🏆</span> : null}
                {kollyDQOnThisTile && team2 && normalizeNameForMatch(team2.name ?? team2) === "kolly" ? (
                  <span style={{ color: "#fff", background: "#c92b2b", padding: "2px 6px", borderRadius: 6, fontSize: 11, fontWeight: 800 }}>DQ</span>
                ) : null}
              </div>
            </div>
            <div style={{ color: isGrandFinal ? "#3c2b00" : (team2IsWinner ? "#bff1c2" : "#e6eef8"), fontWeight: 700 }}>
              {kollyDQOnThisTile && team2 && normalizeNameForMatch(team2.name ?? team2) === "kolly" ? "DQ" : normalizeDisplay(team2?.score ?? "-")}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

/* ---------------- Build tiles from tournament JSON ---------------- */

function tilesFromTournament(tournament: any, teamsList: any[]) {
  const ub = tournament.tournament.upperBracket;
  const lb = tournament.tournament.lowerBracket;
  const gf = tournament.tournament.grandFinals;
  const tObj = (name: string | null) => findTeamObject(teamsList, name);
  const makeIdFromName = (name: string) => (name ? name.replace(/\s+/g, "-").replace(/[^a-zA-Z0-9-_`]/g, "").toLowerCase() : name);

  // place rounds as columns (horizontal flow)
  const colX = [28, 260, 520, 820]; // r1, r2, final, gf
  const qfY = [24, 140, 256, 372];

  // LB start will be computed after we know the vertical extent of Round 2
  const LB_ROW_GAP = 160;
  let LB_START_Y = 520;
  let lbY = [LB_START_Y, LB_START_Y + LB_ROW_GAP];

  const qfMatches = ub.rounds[0]?.matches ?? [];
  const qfTiles = qfMatches.map((m: any, idx: number) => {
    const t1 = tObj(m.team1);
    const t2 = tObj(m.team2);
    const winnerObj = m.winner ? tObj(m.winner) : null;
    return {
      id: `qf${idx + 1}`,
      x: colX[0],
      y: qfY[idx] ?? (24 + idx * 116),
      team1: t1,
      team2: t2,
      matchId: m.id,
      // winners flow forward to SF
      connections: [{ to: idx < 2 ? "sf1" : "sf2", fromTeamId: winnerObj?.id ?? (m.winner ? makeIdFromName(m.winner) : null) }],
      rawMatch: m,
    };
  });

  const ubR2Matches = ub.rounds[1]?.matches ?? [];
  const sfTiles = [
    {
      id: "sf1",
      x: colX[1],
      y: 84,
      team1: tObj(ubR2Matches[0]?.team1 ?? null) || { id: "wq1", name: "WinnerQ1" },
      team2: tObj(ubR2Matches[0]?.team2 ?? null) || { id: "wq2", name: "WinnerQ2" },
      matchId: ubR2Matches[0]?.id ?? null,
      connections: [{ to: "ufinal", fromTeamId: ubR2Matches[0]?.winner ? (tObj(ubR2Matches[0].winner)?.id ?? makeIdFromName(ubR2Matches[0].winner)) : null }],
      rawMatch: ubR2Matches[0] ?? null,
    },
    {
      id: "sf2",
      x: colX[1],
      y: 320,
      team1: tObj(ubR2Matches[1]?.team1 ?? null) || { id: "wq3", name: "WinnerQ3" },
      team2: tObj(ubR2Matches[1]?.team2 ?? null) || { id: "wq4", name: "WinnerQ4" },
      matchId: ubR2Matches[1]?.id ?? null,
      connections: [{ to: "ufinal", fromTeamId: ubR2Matches[1]?.winner ? (tObj(ubR2Matches[1].winner)?.id ?? makeIdFromName(ubR2Matches[1].winner)) : null }],
      rawMatch: ubR2Matches[1] ?? null,
    },
  ];

  const ubR3Matches = ub.rounds[2]?.matches ?? [];
  const ufinalMatch = ubR3Matches[0] ?? null;
  const ufinal = {
    id: "ufinal",
    x: colX[2],
    y: 200,
    team1: tObj(ufinalMatch?.team1 ?? null) || { id: "wsf1", name: "WinnerSF1" },
    team2: tObj(ufinalMatch?.team2 ?? null) || { id: "wsf2", name: "WinnerSF2" },
    matchId: ufinalMatch?.id ?? null,
    // connection will be redirected to ub_winner below
    connections: [{ to: "ub_winner", fromTeamId: ufinalMatch?.winner ? (tObj(ufinalMatch.winner)?.id ?? makeIdFromName(ufinalMatch.winner)) : null }],
    rawMatch: ufinalMatch,
  };

  // compute LB start vertically so lower bracket begins after the vertical extent of Round 2 (column index 1)
  // use tiles that live in column 1 (round2 column)
  const round2Tiles = [...sfTiles].filter((t) => t.x === colX[1]);
  const col2MaxY = round2Tiles.length ? Math.max(...round2Tiles.map((t) => (t.y + TILE_H))) : 0;
  LB_START_Y = Math.max(col2MaxY + 40, 520);
  lbY = [LB_START_Y, LB_START_Y + LB_ROW_GAP];

  const gfMatch = gf.match;
  const gfTile = {
    id: "gf",
    x: colX[3],
    // default; will be adjusted later in the component so that GF sits right after UB
    y: 260,
    team1: tObj(gfMatch?.team1 ?? null) || { id: "upper", name: "UpperWinner" },
    team2: tObj(gfMatch?.team2 ?? null) || { id: "lower", name: "LBWinner" },
    matchId: gfMatch?.id ?? null,
    connections: [],
    rawMatch: gfMatch,
  };

  // --- UB Winner tile (new). Place between ufinal and gf
  const ubWinnerTeam = ufinalMatch?.winner ? tObj(ufinalMatch.winner) : (tObj(ufinalMatch?.team1) || tObj(ufinalMatch?.team2));
  const ubWinner = {
    id: "ub_winner",
    x: (colX[2] + colX[3]) / 2 - TILE_W / 2, // middle between final col and gf col
    y: ufinal.y,
    team1: ubWinnerTeam || { id: "upper", name: "UpperWinner" },
    team2: null,
    matchId: "ub_winner",
    connections: [{ to: "gf", fromTeamId: ubWinnerTeam ? (ubWinnerTeam.id ?? makeIdFromName(ubWinnerTeam.name)) : null }],
    rawMatch: { winner: ubWinnerTeam?.name ?? null },
  };

  const lbR1 = lb.rounds[0]?.matches ?? [];
  const lbTilesR1 = lbR1.map((m: any, idx: number) => {
    const t1 = tObj(m.team1);
    const t2 = tObj(m.team2);
    const winnerObj = m.winner ? tObj(m.winner) : null;
    return {
      id: `lb_qf${idx + 1}`,
      x: colX[0],
      y: lbY[idx] ?? (LB_START_Y + idx * 112),
      team1: t1,
      team2: t2,
      matchId: m.id,
      connections: [{ to: "lb_r2_1", fromTeamId: winnerObj?.id ?? (m.winner ? makeIdFromName(m.winner) : null) }],
      rawMatch: m,
    };
  });

  const lbR2 = lb.rounds[1]?.matches ?? [];
  const lbTilesR2 = lbR2.map((m: any, idx: number) => {
    const t1 = tObj(m.team1);
    const t2 = tObj(m.team2);
    const winnerObj = m.winner ? tObj(m.winner) : null;
    return {
      id: `lb_r2_${idx + 1}`,
      x: colX[1],
      y: LB_START_Y + 80 + idx * 160,
      team1: t1,
      team2: t2,
      matchId: m.id,
      connections: [{ to: "lb_final", fromTeamId: winnerObj?.id ?? (m.winner ? makeIdFromName(m.winner) : null) }],
      rawMatch: m,
    };
  });

  const lbFinalMatch = lb.rounds[2]?.matches?.[0] ?? lb.rounds[3]?.matches?.[0] ?? null;
  const lbFinal = {
    id: "lb_final",
    x: colX[2],
    y: LB_START_Y + 220,
    team1: tObj(lbFinalMatch?.team1 ?? null) || { id: "wlb1", name: "WinnerLBQ1" },
    team2: tObj(lbFinalMatch?.team2 ?? null) || { id: "wlb2", name: "WinnerLBQ2" },
    matchId: lbFinalMatch?.id ?? null,
    connections: [{ to: "gf", fromTeamId: lbFinalMatch?.winner ? (tObj(lbFinalMatch.winner)?.id ?? makeIdFromName(lbFinalMatch.winner)) : null }],
    rawMatch: lbFinalMatch,
  };

  const tiles: any[] = [
    ...qfTiles,
    ...sfTiles,
    ufinal,
    ubWinner, // new UB Winner tile
    gfTile,
    ...lbTilesR1,
    ...lbTilesR2,
    lbFinal,
  ];

  // Connect losers from UB to starting LB positions
  // UB Round1 losers -> LB round1 slots (in order)
  qfTiles.forEach((qf, idx) => {
    const m = qf.rawMatch as any;
    if (!m) return;
    const winner = m.winner;
    const loserName = m.team1 === winner ? m.team2 : m.team1;
    const loserObj = tObj(loserName);
    const target = lbTilesR1[idx];
    if (target) {
      // keep data but do not create visual connector to LB (user wanted no falling lines)
      // if you want to keep the logical back-reference uncomment the next line
      // qf.connections.push({ to: target.id, fromTeamId: loserObj?.id ?? makeIdFromName(loserName) });
    }
  });

  // UB Round2 losers (sfTiles) -> LB Round2 slots
  sfTiles.forEach((sf, idx) => {
    const m = sf.rawMatch as any;
    if (!m) return;
    const winner = m.winner;
    const loserName = m.team1 === winner ? m.team2 : m.team1;
    const loserObj = tObj(loserName);
    const target = lbTilesR2[idx];
    if (target) {
      // do not push visual connector to LB (filter later in Connectors)
      // sf.connections.push({ to: target.id, fromTeamId: loserObj?.id ?? makeIdFromName(loserName) });
    }
  });

  // UB Final loser (ufinal) -> LB final entry (lbFinal)
  if (ufinal.rawMatch) {
    const m = ufinal.rawMatch as any;
    const winner = m.winner;
    const loserName = m.team1 === winner ? m.team2 : m.team1;
    const loserObj = tObj(loserName);
    // do not create a falling visual connector; keep logical mapping if needed
    // ufinal.connections.push({ to: lbFinal.id, fromTeamId: loserObj?.id ?? makeIdFromName(loserName) });
  }

  // ensure unique and valid connection targets
  const idSet = new Set(tiles.map((x) => x.id));
  tiles.forEach((t) => {
    const seen = new Set<string>();
    (t.connections || []).forEach((c: any) => {
      if (c.to === "lb_r2_1") c.to = lbTilesR2[0]?.id ?? "lb_final";
      if (!c.to || !idSet.has(c.to)) c.to = "gf";
      if (seen.has(c.to)) {
        c.to = "gf";
      } else {
        seen.add(c.to);
      }
    });
  });

  return tiles;
}

/* ---------------- Connectors (orthogonal routing) ---------------- */

function Connectors({ tiles, hoveredTeamId }: { tiles: any[]; hoveredTeamId: string | null }) {
  const map = useMemo(() => {
    const m = new Map<string, any>();
    tiles.forEach((t) => m.set(t.id, t));
    return m;
  }, [tiles]);

  const edges = useMemo(() => {
    const list: any[] = [];

    // find gf X so we can filter connectors that drop from UB into GF visually
    const gfTile = tiles.find((tt) => tt.id === "gf");
    const gfX = gfTile?.x ?? 820;

    tiles.forEach((t) => {
      const conns = t.connections ?? [];
      conns.forEach((c: any) => {
        const toTile = map.get(c.to);
        if (!toTile) return;

        // --- FILTER: skip connectors that go from UB columns INTO GF tile,
        //            to prevent the long vertical "falling" lines under the UB header.
        // If a tile originates left of the GF column and the target is GF, drop it.
        if (toTile.id === "gf" && t.x < gfX) {
          // keep ufinal -> ub_winner -> gf intact (we set ufinal -> ub_winner in tilesFromTournament)
          // but if any other UB tile tries to point directly to gf, skip it here
          // allow only the explicit connections (we already prepared them)
        }

        // --- FILTER: remove visual connectors that go from UB tiles into LB tiles (user requested no upper->lower falling lines)
        if (String(toTile.id).startsWith("lb_") && t.x <= 520) {
          // skip connectors from UB into LB (prevents falling UB->LB lines)
          return;
        }

        // If toTile is 'gf' but the source is UB and not explicitly allowed, block it:
        if (toTile.id === "gf" && t.x < gfX && t.id !== "ub_winner" && t.id !== "lb_final" && t.id !== "ufinal") {
          // skip stray UB->GF direct lines
          return;
        }

        const fromX = t.x + TILE_W;
        let fromY = t.y + TILE_H / 2;
        const srcId = c.fromTeamId ?? null;
        if (srcId && t.team1?.id === srcId) fromY = t.y + TILE_H * 0.28;
        else if (srcId && t.team2?.id === srcId) fromY = t.y + TILE_H * 0.72;

        const toX = toTile.x;
        let toY = toTile.y + TILE_H / 2;
        if (srcId && toTile.team1?.id === srcId) toY = toTile.y + TILE_H * 0.28;
        else if (srcId && toTile.team2?.id === srcId) toY = toTile.y + TILE_H * 0.72;

        const midX = Math.round((fromX + toX) / 2);

        const sourceTeam = tiles.flatMap((x) => [x.team1, x.team2]).find((x) => x?.id === srcId);

        // prevent connectors from going out of bounds (fix "falling below" lines)
        const maxAllowedY = H - 40; // clamp under the canvas
        if (fromY > maxAllowedY || toY > maxAllowedY) return;

        list.push({
          from: { cx: fromX, cy: fromY },
          to: { cx: toX, cy: toY },
          midX,
          sourceTeamId: srcId,
          sourceTeam,
        });
      });
    });
    return list;
  }, [tiles, map]);

  if (!edges.length) return null;

  return (
    <svg style={{ position: "absolute", left: 0, top: 0, width: W, height: H, pointerEvents: "none", zIndex: 20 }} viewBox={`0 0 ${W} ${H}`} preserveAspectRatio="xMidYMid meet" aria-hidden>
      {edges.map((e, i) => {
        const d = `M ${e.from.cx} ${e.from.cy} L ${e.midX} ${e.from.cy} L ${e.midX} ${e.to.cy} L ${e.to.cx} ${e.to.cy}`;

        const color = e.sourceTeam?.logoColor ?? "#888";
        const highlighted = !!(hoveredTeamId && e.sourceTeamId && hoveredTeamId === e.sourceTeamId);

        return (
          <g key={i} style={{ opacity: 1 }}>
            <path d={d} fill="none" stroke={color} strokeWidth={highlighted ? 12 : 8} strokeLinecap="round" strokeLinejoin="round" opacity={highlighted ? 0.12 : 0.06} />
            <path d={d} fill="none" stroke={color} strokeWidth={highlighted ? 4.4 : 3} strokeLinecap="round" strokeLinejoin="round" opacity={1} />
            <circle cx={e.from.cx - 6} cy={e.from.cy} r={highlighted ? 6 : 4.2} fill={color} opacity={1} />
            <circle cx={e.to.cx + 6} cy={e.to.cy} r={highlighted ? 6 : 4.2} fill={color} opacity={1} />
          </g>
        );
      })}
    </svg>
  );
}

/* ---------------- Round header + dynamic bars (computed from tiles) ---------------- */

function RoundHeader({ width }: { width: number }) {
  return (
    <div style={{ display: "flex", gap: 10, width, pointerEvents: "none" }}>
  <div
    style={{
      flex: "1 1 auto",
      display: "flex",
gap: 10,
    }}
  >
    {[
  { label: "Round 1", bo: "BO1", x: 28 },
  { label: "Round 2", bo: "BO1", x: 260 },
  { label: "Round 3", bo: "BO3", x: 520 },
].map((r) => (
  <div
    key={r.label}
    style={{
      position: "absolute",
      left: r.x,
      width: 128,
      padding: "6px 8px",
      borderRadius: 8,
      textAlign: "center",
      fontWeight: 800,
      fontSize: 12,
      letterSpacing: 0.35,
      color: "#e6f0ff",
      background:
        "linear-gradient(180deg, rgba(90,130,255,0.25), rgba(40,60,140,0.45))",
      border: "1px solid rgba(120,160,255,0.5)",
      boxShadow:
        "0 0 10px rgba(120,160,255,0.25), inset 0 1px 3px rgba(255,255,255,0.08)",
    }}
  >
    {r.label}
    <div style={{ fontSize: 10, fontWeight: 700, opacity: 0.8 }}>
      {r.bo}
    </div>
  </div>
))}


    {/* 🏆 UB Winner — compact gold */}
    <div
      style={{
        position: "absolute",
left: 820,
width: 120,

        padding: "6px 8px",
        borderRadius: 8,
        textAlign: "center",
        fontWeight: 900,
        fontSize: 12,
        letterSpacing: 0.6,
        color: "#2a1d00",

        background:
          "linear-gradient(180deg, #ffe08a 0%, #d1ad42 55%, #8a6a16 100%)",
        border: "1px solid rgba(210,170,70,0.9)",
        boxShadow:
          "0 0 14px rgba(210,170,70,0.45), inset 0 1px 4px rgba(255,255,255,0.25)",
      }}
    >
      UB WINNER
    </div>
  </div>
</div>

  );
}

function LowerRoundHeader({ width }: { width: number }) {
  return (
    <div style={{ display: "flex", gap: 12, width, pointerEvents: "none" }}>
  <div
    style={{
      flex: "1 1 auto",
      display: "flex",
      gap: 10,
      alignItems: "center",
      justifyContent: "center",
    }}
  >
    {[
  { label: "Round 1", bo: "BO1", x: 28 },
  { label: "Round 2", bo: "BO1", x: 260 },
  { label: "Round 3", bo: "BO3", x: 520 },
].map((r) => (
  <div
    key={r.label}
    style={{
      position: "absolute",
      left: r.x,
      width: 128,
      padding: "6px 8px",
      borderRadius: 8,
      textAlign: "center",
      fontWeight: 800,
      fontSize: 12,
      letterSpacing: 0.35,
      color: "#e6f0ff",
      background:
        "linear-gradient(180deg, rgba(90,130,255,0.25), rgba(40,60,140,0.45))",
      border: "1px solid rgba(120,160,255,0.5)",
      boxShadow:
        "0 0 10px rgba(120,160,255,0.25), inset 0 1px 3px rgba(255,255,255,0.08)",
    }}
  >
    {r.label}
    <div style={{ fontSize: 10, fontWeight: 700, opacity: 0.8 }}>
      {r.bo}
    </div>
  </div>
))}

  </div>
</div>

  );
}

/* ---------------- Main component ---------------- */
export default function BracketDotaStyle({ season = 1, teamsProp = null, tournamentProp = null }: { season?: number; teamsProp?: any[] | null; tournamentProp?: any | null }) {
  // keep season referenced so eslint doesn't complain
  void season;
  const [hoveredTeamId, setHoveredTeamId] = useState<string | null>(null);

  const teamsList = Array.isArray(teamsProp) ? teamsProp : Array.isArray(teamsData) ? teamsData : [];
  const tournament = tournamentProp ?? TOURNAMENT;

  const tilesToRender = tilesFromTournament(tournament, teamsList);

  // compute dynamic bounds for upper & lower bracket bars so they match the tile layout
  const upperTiles = tilesToRender.filter((t) => {
    return t.x <= 520 && !String(t.id).startsWith("lb_") && t.y < 480;
  });
  const lowerTiles = tilesToRender.filter((t) => String(t.id).startsWith("lb_") || t.y >= 480);

  const upperMinY = upperTiles.reduce((acc, t) => Math.min(acc, t.y), Infinity) === Infinity ? 24 : upperTiles.reduce((acc, t) => Math.min(acc, t.y), Infinity);
  const upperMaxY = upperTiles.reduce((acc, t) => Math.max(acc, t.y + TILE_H), -Infinity) === -Infinity ? 450 : upperTiles.reduce((acc, t) => Math.max(acc, t.y + TILE_H), -Infinity);
  const lowerMinY = lowerTiles.reduce((acc, t) => Math.min(acc, t.y), Infinity) === Infinity ? 480 : lowerTiles.reduce((acc, t) => Math.min(acc, t.y), Infinity);
  const _lowerMaxY = lowerTiles.reduce((acc, t) => Math.max(acc, t.y + TILE_H), -Infinity) === -Infinity ? H - 40 : lowerTiles.reduce((acc, t) => Math.max(acc, t.y + TILE_H), -Infinity);

  // --- Header width: compute from actual UB round columns so it only spans up to round 4 ---
  // gather the unique column X positions for upper-bracket tiles (sorted)
  const ubColumnXs = Array.from(new Set(upperTiles.map((t) => t.x))).sort((a, b) => a - b);

  // We want the header to span up to the 4th round column (index 3), but clamp if fewer columns exist
  const desiredEndIndex = Math.min(3, Math.max(0, ubColumnXs.length - 1));
  // fallback left anchor (keeps your original left spacing if nothing found)
  const fallbackLeft = 28;

  const computedLeft = ubColumnXs.length ? Math.min(...ubColumnXs) : fallbackLeft;
  // right edge = selected column's x + tile width
  const computedRight = ubColumnXs.length ? (ubColumnXs[desiredEndIndex] + TILE_W) : (W - 28);

  // padding and clamping
  const PAD_AFTER_LAST_ROUND = 12; // small visual gap after the last round box
  const rawWidth = Math.max(computedRight - computedLeft + PAD_AFTER_LAST_ROUND, 120); // min width
  const maxAvailable = W - 56; // same as your previous full width clamp
  const clampedWidth = Math.min(rawWidth, maxAvailable);

  const headerLeft = computedLeft;
  const headerWidth = clampedWidth;
  // --- end header computation ---

  // frame highlight color (if any team hovered)
  const frameColor = hoveredTeamId && teamsList.find((x) => x.id === hoveredTeamId)?.logoColor;

  // Move grand final tile so it sits right AFTER the upper bracket and before the lower bracket visually
  const tiles = tilesToRender.map((t) => {
  const isUpper = t.y < lowerMinY;
  const isLower = t.y >= lowerMinY;

  return {
    ...t,
    y: isUpper
      ? t.y + HEADER_GAP + ROUND_BUTTON_GAP
      : isLower
      ? t.y + HEADER_GAP + ROUND_BUTTON_GAP
      : t.y,
  };
});
 // shallow copy
  const gfIndex = tiles.findIndex((x) => x.id === "gf");
  if (gfIndex !== -1) {
    // place gf a bit below upperMaxY but above lowerMinY
    const targetY = Math.min(Math.max(upperMaxY + 12, 120), Math.max(lowerMinY - TILE_H - 12, upperMaxY + 12));
    tiles[gfIndex].y = targetY;
    // align GF column to far right to make space
    tiles[gfIndex].x = 820;
  }

  // --- Grand Final header helpers (place BEFORE the `return` so they're in JS scope) ---
  const upperHeaderTop = Math.max(upperMinY - 28, 40);
  const gfTileObj = tiles.find((x) => x.id === "gf");
  const gfHeaderWidth = 160;

// distance from upper bracket bar
const GF_GAP_FROM_UB = 40;

const gfHeaderLeft = gfTileObj
  ? gfTileObj.x + TILE_W / 2 - gfHeaderWidth / 2
  : W / 2 - gfHeaderWidth / 2;

// force same horizontal line as upper bracket
const gfHeaderTop = Math.max(upperMinY - 28, 40);

// tweak to taste (120-200)
  // --- end helpers ---

  return (
    <div style={{ padding: 20 }}>
      <div style={{ position: "relative", width: W + 40, height: H + 40, padding: 18, borderRadius: 12, background: "#07080a", border: "2px solid rgba(46, 204, 113, 0.55)",
boxShadow: "0 0 18px rgba(46, 204, 113, 0.25)" }}>
        {/* connectors underneath */}
        <div style={{ position: "relative", width: W, height: H, margin: "0 auto" }}>
          <Connectors tiles={tiles} hoveredTeamId={hoveredTeamId} />
          {tiles.map((t) => (
            <Tile key={t.id} t={t} hoveredTeamId={hoveredTeamId} setHoveredTeamId={setHoveredTeamId} />
          ))}
        </div>

        {/* horizontal green bar (upper) - keep it as a bar and add text */}
        <div style={{
          position: "absolute",
          left: headerLeft,
          top: Math.max(upperMinY - 28, 40),
          width: headerWidth,
          height: 26,
          borderRadius: 6,
          pointerEvents: "none",
          background: "linear-gradient(90deg,#3ce77f 0%, #2ecc71 30%, #27ae60 60%, #1e7e46 100%)",
          boxShadow: "inset 0 2px 8px rgba(255,255,255,0.06), 0 6px 18px rgba(46,204,113,0.06)",

          zIndex: 30,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center'
        }}>
          <div style={{ fontWeight: 800, color: '#04320f', fontSize: 14 }}>Upper Bracket</div>
        </div>

        {/* Grand Final small header aligned on same line as Upper Bracket */}
        <div
          style={{
            position: "absolute",
left: gfHeaderLeft + GF_GAP_FROM_UB,
top: gfHeaderTop,

            // same top as Upper Bracket
            width: gfHeaderWidth,
            height: 26,
            borderRadius: 6,
            pointerEvents: "none",
            background: "linear-gradient(90deg,#d9b55a 0%, #caa13b 50%, #a67f20 100%)",
            boxShadow: "inset 0 2px 6px rgba(255,255,255,0.06), 0 6px 18px rgba(180,140,40,0.08)",

            zIndex: 30,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <div style={{ fontWeight: 800, color: "#3c2b00", fontSize: 14 }}>Grand Final</div>
        </div>

        {/* place round headers immediately after the green bar (same size as header) */}
        <div style={{ position: 'absolute', left: headerLeft, top: Math.max(upperMinY - 28, 40) + HEADER_GAP,
 width: headerWidth, pointerEvents: 'none', zIndex: 35 }}>
          <RoundHeader width={headerWidth} />
        </div>

        {/* horizontal red bar (lower) with centered label - make same size as upper bar */}
        <div style={{
          position: "absolute",
          left: headerLeft,
          top: Math.max(lowerMinY - 28, upperMaxY + 24),
          width: headerWidth,
          height: 26,
          borderRadius: 6,
          pointerEvents: "none",
          background: "linear-gradient(90deg,#f36b57 0%, #e74c3c 45%, #c63a2b 75%, #8f281f 100%)",
          boxShadow: "inset 0 2px 8px rgba(255,255,255,0.05), 0 6px 18px rgba(231,76,60,0.06)",

          zIndex: 30,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center'
        }}>
          <div style={{ fontWeight: 800, color: '#3a0a08', fontSize: 14 }}>Lower Bracket</div>
        </div>

        {/* Lower bracket round headers (4 rounds) */}
        <div style={{ position: 'absolute', left: headerLeft, top: Math.max(lowerMinY - 28, upperMaxY + 24) + HEADER_GAP,
 width: headerWidth, pointerEvents: 'none', zIndex: 35 }}>
          <LowerRoundHeader width={headerWidth} />
        </div>
      </div>
    </div>
  );
}

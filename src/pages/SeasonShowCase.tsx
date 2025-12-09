// src/pages/SeasonShowcase.tsx  (or seasonsshowcase.tsx)

import {
  useRef,
  useState,
  type UIEvent,
  type PointerEvent,
  type JSX,
} from "react";
import { motion } from "framer-motion";
import { Link } from "react-router-dom";

import {
  teams,
  season2Teams,
  season3Teams,
  season4Teams,
  season5Teams,
} from "./data/teams";

import Season6Standings from "./Seasons/Season6Standing";


type Team = (typeof teams)[number];
type Season2Team = (typeof season2Teams)[number];
type Season3Team = (typeof season3Teams)[number];
type Season4Team = (typeof season4Teams)[number];
type Season5Team = (typeof season5Teams)[number];











/* ---------- Season 1 table (inline) ---------- */


function Season1Standings() {
  const orderedByRecord = [...teams].sort((a, b) => {
    if (b.wins !== a.wins) return b.wins - a.wins;
    return a.losses - b.losses;
  });

  const championId = "godspeed";
  const runnerUpId = "reciprocal";
  const thirdId = "banner";
  const dqId = "kolly";

  const champion = orderedByRecord.find((t) => t.id === championId);
  const runnerUp = orderedByRecord.find((t) => t.id === runnerUpId);
  const third = orderedByRecord.find((t) => t.id === thirdId);
  const dqTeam = orderedByRecord.find((t) => t.id === dqId);

  const remaining: Team[] = orderedByRecord.filter(
    (t) => ![championId, runnerUpId, thirdId, dqId].includes(t.id)
  );

  const placementOrderAfterTop3: Team["id"][] = [
    "helm",
    "bazinga",
    "billy",
    "nabeel",
  ];

  const orderedOthers: Team[] = [
    ...placementOrderAfterTop3
      .map((id) => remaining.find((t) => t.id === id))
      .filter((t): t is Team => Boolean(t)),
    ...remaining.filter((t) => !placementOrderAfterTop3.includes(t.id)),
  ];

  function teamGold(team: Team): number {
    return team.players.reduce((sum, p) => sum + (p.gold || 0), 0);
  }

  const ordered: Team[] = [
    champion,
    runnerUp,
    third,
    ...orderedOthers,
    dqTeam,
  ].filter((t): t is Team => Boolean(t));

  return (
    <div className="w-full flex justify-center pb-4">
      <div className="w-full max-w-[1000px] px-4 sm:px-6">
        {/* BRACKET BUTTON */}
        <div className="flex justify-center mb-6">
          <Link
            to="/tournament"
            className="px-8 py-2 rounded-full text-[0.8rem] font-semibold uppercase tracking-[0.18em]
              bg-linear-to-tr from-[#f5f5f5] via-[#c0c0c0] to-[#9ca3af] text-[#050608]
              shadow-[0_0_25px_rgba(148,163,184,0.85)] hover:brightness-110 transition"
          >
            VIEW BRACKET
          </Link>
        </div>

        {/* TABLE CARD */}
        <div className="rounded-4xl border border-white/10 bg-[#050608] shadow-[0_18px_60px_rgba(0,0,0,0.9)] overflow-hidden transition-transform duration-500 hover:scale-[1.01]">

          {/* internal scroll – only the table scrolls vertically */}
          <div
  className="w-full overflow-x-auto max-h-[340px] overflow-y-auto"
  data-vertical-scroll="true"
  style={{ scrollbarWidth: "thin", msOverflowStyle: "none" }}
>

            <table className="w-full border-spacing-0 text-sm">
              <thead className="sticky top-0 z-20 text-left text-[0.7rem] uppercase tracking-[0.22em] text-gray-300 bg-[#050608]/95 backdrop-blur-sm">
                <tr className="border-none">
                  <th className="py-3 pl-6 text-[0.68rem] text-gray-300">
                    Captain
                  </th>
                  <th className="py-3 text-[0.68rem] text-gray-300">
                    Team Name
                  </th>
                  <th className="py-3 text-center w-[72px] text-[0.68rem] text-gray-300" />
                  <th className="py-3 text-right text-[0.68rem] text-gray-300">
                    Avg MMR
                  </th>
                  <th className="py-3 pr-6 text-right text-[0.68rem] text-gray-300">
                    Gold Allocated
                  </th>
                </tr>
              </thead>

              <tbody>
                {ordered.map((team) => {
                  const captain = team.players[0]?.nickname ?? "Captain";
                  const gold = teamGold(team);

                  const isChampion = team.id === championId;
                  const isRunnerUp = team.id === runnerUpId;
                  const isThird = team.id === thirdId;
                  const isDQ = team.id === dqId;

                  const baseRow =
                  "group relative h-10 border-none overflow-hidden hover:bg-white/[0.04] transition-colors duration-300 text-[0.78rem]";


                  let rowClass = baseRow;

                  // base navy row
                  rowClass += " bg-[#020617]";

                  // GOLD / SILVER / BRONZE / DQ tints + hover
                  if (isChampion) {
                    rowClass +=
                      " bg-[rgba(250,204,21,0.25)] hover:bg-[rgba(250,204,21,0.38)]";
                  } else if (isRunnerUp) {
                    rowClass +=
                      " bg-[rgba(148,163,184,0.25)] hover:bg-[rgba(148,163,184,0.38)]";
                  } else if (isThird) {
                    rowClass +=
                      " bg-[rgba(248,153,102,0.25)] hover:bg-[rgba(248,153,102,0.4)]";
                } else if (isDQ) {
  // solid red strip at bottom + slightly lighter on hover (same as other table)
  rowClass += " bg-[#b91c1c] hover:bg-[#dc2626]";
} else {
  rowClass += " bg-[#020617]";
}


                  return (
                    <tr
                      key={team.id}
                      className={rowClass}
                      style={
                        !isChampion && !isRunnerUp && !isThird && !isDQ
                          ? { boxShadow: `0 0 14px ${team.logoColor}40` }
                          : undefined
                      }
                    >
                      {/* CAPTAIN */}
                      <td className="pl-6">
                        <div className="flex items-center gap-3 font-semibold">
                          <span
                            className="h-3 w-3 rounded-full"
                            style={{ backgroundColor: team.logoColor }}
                          />
                          <span className="px-3 py-1 rounded-full bg-white/10 text-[0.7rem] uppercase tracking-[0.16em] text-gray-200 shadow-[0_0_12px_rgba(255,255,255,0.2)]">
                            {captain}
                          </span>
                        </div>
                      </td>

                      {/* TEAM NAME */}
                      <td>
                        <div className="flex items-center gap-2 font-semibold">
                          <Link
                            to={`/teams/${team.id}`}
                            className="hover:text-[#e5e7eb] transition text-sm max-w-[260px]"
                          >
                            <span
                              className={`block whitespace-nowrap overflow-hidden text-ellipsis ${
                                isDQ ? "line-through opacity-80" : ""
                              }`}
                            >
                              {team.name}
                            </span>
                          </Link>
                        </div>
                      </td>

                      {/* MEDAL / DQ ICON */}
                      <td>
                        <div className="flex items-center justify-center">
                          {isChampion && (
                            <div className="inline-flex h-9 w-9 items-center justify-center rounded-full bg-[#facc15] shadow-[0_0_18px_rgba(250,204,21,0.9)] group-hover:scale-105 transition-transform">
                              <span className="text-lg">🏆</span>
                            </div>
                          )}
                          {isRunnerUp && (
                            <div className="inline-flex h-9 w-9 items-center justify-center rounded-full bg-[#9ca3af] shadow-[0_0_18px_rgba(148,163,184,0.9)] group-hover:scale-105 transition-transform">
                              <span className="text-lg">🥈</span>
                            </div>
                          )}
                          {isThird && (
                            <div className="inline-flex h-9 w-9 items-center justify-center rounded-full bg-[#d97706] shadow-[0_0_18px_rgba(234,179,8,0.95)] group-hover:scale-105 transition-transform">
                              <span className="text-lg">🥉</span>
                            </div>
                          )}
                       {isDQ && !isChampion && !isRunnerUp && !isThird && (
  <div className="inline-flex h-9 w-9 items-center justify-center rounded-full bg-[#dc2626] shadow-[0_0_18px_rgba(220,38,38,0.85)] group-hover:scale-105 transition-transform">
    <span className="text-[0.65rem] font-extrabold tracking-[0.18em] uppercase">
      DQ
    </span>
  </div>
)}


                        </div>
                      </td>

                      {/* AVG MMR */}
                      <td className="text-right">
                        <span className="tabular-nums text-sm text-gray-100">
                          {team.averageMMR}
                        </span>
                      </td>

                      {/* GOLD */}
                      <td className="pr-6 text-right">
                        <span className="tabular-nums font-semibold text-gray-200">
                          {gold}
                        </span>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}


/* ---------- Season 2 table (inline) ---------- */

function Season2Standings() {
  const orderedByRecord = [...season2Teams].sort((a, b) => {
    if (b.wins !== a.wins) return b.wins - a.wins;
    return a.losses - b.losses;
  });

  const championId: Season2Team["id"] = "mslayer-s2";
  const runnerUpId: Season2Team["id"] = "bazinga-s2";
  const thirdId: Season2Team["id"] = "ngx-savage-s2";
  const dqId: Season2Team["id"] = "grimm-s2";

  const champion = orderedByRecord.find((t) => t.id === championId);
  const runnerUp = orderedByRecord.find((t) => t.id === runnerUpId);
  const third = orderedByRecord.find((t) => t.id === thirdId);
  const dqTeam = orderedByRecord.find((t) => t.id === dqId);

  const remaining: Season2Team[] = orderedByRecord.filter(
    (t) => ![championId, runnerUpId, thirdId, dqId].includes(t.id)
  );

  const placementOrderAfterTop3: Season2Team["id"][] = [
    "madlad-s2",
    "tom1c-s2",
    "machine-s2",
    "madara-s2",
    "r3ciprocal-s2",
    "banner-s2",
    "gxnova-s2",
    "xj-s2",
  ];

  const orderedOthers: Season2Team[] = [
    ...placementOrderAfterTop3
      .map((id) => remaining.find((t) => t.id === id))
      .filter((t): t is Season2Team => Boolean(t)),
    ...remaining.filter((t) => !placementOrderAfterTop3.includes(t.id)),
  ];

  function teamGold(team: Season2Team): number {
    return team.players.reduce((sum, p) => sum + (p.gold || 0), 0);
  }

  const ordered: Season2Team[] = [
    champion,
    runnerUp,
    third,
    ...orderedOthers,
    dqTeam,
  ].filter((t): t is Season2Team => Boolean(t));

  return (
    <div className="w-full flex justify-center pb-4">
      <div className="w-full max-w-[1000px] px-4 sm:px-6">
        {/* BRACKET BUTTON (same style as S1) */}
        <div className="flex justify-center mb-6">
          <Link
            to="/tournament"
            className="px-8 py-2 rounded-full text-[0.8rem] font-semibold uppercase tracking-[0.18em]
              bg-linear-to-tr from-[#f5f5f5] via-[#c0c0c0] to-[#9ca3af] text-[#050608]
              shadow-[0_0_25px_rgba(148,163,184,0.85)] hover:brightness-110 transition"
          >
            VIEW BRACKET
          </Link>
        </div>

        {/* TABLE CARD – matches S1 + vertical scroll flag */}
        <div className="rounded-4xl border border-white/10 bg-[#050608] shadow-[0_18px_60px_rgba(0,0,0,0.9)] overflow-hidden transition-transform duration-500 hover:scale-[1.01]">
          <div
  className="w-full overflow-x-auto max-h-[340px] overflow-y-auto"
  data-vertical-scroll="true"
  style={{ scrollbarWidth: "thin", msOverflowStyle: "none" }}
>

            <table className="w-full border-spacing-0 text-sm">
              <thead className="sticky top-0 z-20 text-left text-[0.7rem] uppercase tracking-[0.22em] text-gray-300 bg-[#050608]/95 backdrop-blur-sm">
               <tr className="border-none">
                  <th className="py-3 pl-6 text-[0.68rem] text-gray-300">
                    Captain
                  </th>
                  <th className="py-3 text-[0.68rem] text-gray-300">
                    Team Name
                  </th>
                  <th className="py-3 text-center w-[72px] text-[0.68rem] text-gray-300" />
                  <th className="py-3 text-right text-[0.68rem] text-gray-300">
                    Avg MMR
                  </th>
                  <th className="py-3 pr-6 text-right text-[0.68rem] text-gray-300">
                    Gold Allocated
                  </th>
                </tr>
              </thead>

              <tbody>
                {ordered.map((team) => {
                  const captain = team.players[0]?.nickname ?? "Captain";
                  const gold = teamGold(team);

                  const isChampion = team.id === championId;
                  const isRunnerUp = team.id === runnerUpId;
                  const isThird = team.id === thirdId;
                  const isDQ = team.id === dqId;

                 const baseRow =
  "group relative h-10 border-none overflow-hidden transition-colors duration-300 text-[0.78rem]";

let rowClass = baseRow;

if (isChampion) {
  rowClass +=
    " bg-[rgba(250,204,21,0.25)] hover:bg-[rgba(250,204,21,0.38)]";
} else if (isRunnerUp) {
  rowClass +=
    " bg-[rgba(148,163,184,0.25)] hover:bg-[rgba(148,163,184,0.38)]";
} else if (isThird) {
  rowClass +=
    " bg-[rgba(248,153,102,0.25)] hover:bg-[rgba(248,153,102,0.4)]";
} else if (isDQ) {
  // same solid red strip + hover as Season 1
  rowClass += " bg-[#b91c1c] hover:bg-[#dc2626]";
} else {
  rowClass += " bg-[#020617] hover:bg-white/[0.04]";
}


                  return (
                    <tr
                      key={team.id}
                      className={rowClass}
                      style={
                        !isChampion && !isRunnerUp && !isThird && !isDQ
                          ? { boxShadow: `0 0 14px ${team.logoColor}40` }
                          : undefined
                      }
                    >
                      {/* CAPTAIN */}
                      <td className="pl-6">
                        <div className="flex items-center gap-3 font-semibold">
                          <span
                            className="h-3 w-3 rounded-full"
                            style={{ backgroundColor: team.logoColor }}
                          />
                          <span className="px-3 py-1 rounded-full bg-white/10 text-[0.7rem] uppercase tracking-[0.16em] text-gray-200 shadow-[0_0_12px_rgba(255,255,255,0.2)]">
                            {captain}
                          </span>
                        </div>
                      </td>

                      {/* TEAM NAME */}
                      <td>
                        <div className="flex items-center gap-2 font-semibold">
                          <Link
                            to={`/teams/${team.id}`}
                            className="hover:text-[#e5e7eb] transition text-sm max-w-[260px]"
                          >
                            <span
                              className={`block whitespace-nowrap overflow-hidden text-ellipsis ${
                                isDQ ? "line-through opacity-80" : ""
                              }`}
                            >
                              {team.name}
                            </span>
                          </Link>
                        </div>
                      </td>

                      {/* MEDAL / DQ ICON */}
                      <td>
                        <div className="flex items-center justify-center">
                          {isChampion && (
                            <div className="inline-flex h-9 w-9 items-center justify-center rounded-full bg-[#facc15] shadow-[0_0_18px_rgba(250,204,21,0.9)] group-hover:scale-105 transition-transform">
                              <span className="text-lg">🏆</span>
                            </div>
                          )}
                          {isRunnerUp && (
                            <div className="inline-flex h-9 w-9 items-center justify-center rounded-full bg-[#9ca3af] shadow-[0_0_18px_rgba(148,163,184,0.9)] group-hover:scale-105 transition-transform">
                              <span className="text-lg">🥈</span>
                            </div>
                          )}
                          {isThird && (
                            <div className="inline-flex h-9 w-9 items-center justify-center rounded-full bg-[#d97706] shadow-[0_0_18px_rgba(234,179,8,0.95)] group-hover:scale-105 transition-transform">
                              <span className="text-lg">🥉</span>
                            </div>
                          )}
                         {isDQ && !isChampion && !isRunnerUp && !isThird && (
  <div className="inline-flex h-9 w-9 items-center justify-center rounded-full bg-[#b91c1c] shadow-[0_0_18px_rgba(220,38,38,0.85)] group-hover:scale-105 transition-transform">
    <span className="text-[0.65rem] font-extrabold tracking-[0.18em] uppercase">
      DQ
    </span>
  </div>
)}


                        </div>
                      </td>

                      {/* AVG MMR */}
                      <td className="text-right">
                        <span className="tabular-nums text-sm text-gray-100">
                          {team.averageMMR}
                        </span>
                      </td>

                      {/* GOLD */}
                      <td className="pr-6 text-right">
                        <span className="tabular-nums font-semibold text-gray-200">
                          {gold}
                        </span>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}

/* ---------- Season 3 table (inline) ---------- */
function Season3Standings() {
  const orderedByRecord = [...season3Teams].sort((a, b) => {
    if (b.wins !== a.wins) return b.wins - a.wins;
    return a.losses - b.losses;
  });

  const championId: Season3Team["id"] = "dynamodon-s3";
  const runnerUpId: Season3Team["id"] = "nemesisx001-s3";
  const thirdId: Season3Team["id"] = "shaidota-s3";
  const dqId: Season3Team["id"] = "none-s3"; // no DQ but logic stays

  const champion = orderedByRecord.find((t) => t.id === championId);
  const runnerUp = orderedByRecord.find((t) => t.id === runnerUpId);
  const third = orderedByRecord.find((t) => t.id === thirdId);
  const dqTeam = orderedByRecord.find((t) => t.id === dqId);

  const remaining: Season3Team[] = orderedByRecord.filter(
    (t) => ![championId, runnerUpId, thirdId, dqId].includes(t.id)
  );

  const placementOrderAfterTop3: Season3Team["id"][] = [
    "pero-s3",
    "shikamaru-s3",
    "jinx-s3",
    "helm-s3",
    "epizeuxius-s3",
    "rinne-s3",
    "nj-s3",
    "maldini-s3",
    "rut-s3",
    "alcromido-s3",
    "puppyboss-s3",
    "kakarot-s3",
    "sridharocky-s3",
  ];

  const orderedOthers: Season3Team[] = [
    ...placementOrderAfterTop3
      .map((id) => remaining.find((t) => t.id === id))
      .filter((t): t is Season3Team => Boolean(t)),
    ...remaining.filter((t) => !placementOrderAfterTop3.includes(t.id)),
  ];

  const ordered: Season3Team[] = [
    champion,
    runnerUp,
    third,
    ...orderedOthers,
    dqTeam,
  ].filter((t): t is Season3Team => Boolean(t));

  function teamGold(team: Season3Team): number {
    return team.players.reduce((sum, p) => sum + (p.gold || 0), 0);
  }

  return (
    <div className="w-full flex justify-center pb-4">
      <div className="w-full max-w-[1000px] px-4 sm:px-6">
        {/* BRACKET BUTTON */}
        <div className="flex justify-center mb-6">
          <Link
            to="/tournament"
            className="px-8 py-2 rounded-full text-[0.8rem] font-semibold uppercase tracking-[0.18em]
              bg-linear-to-tr from-[#f5f5f5] via-[#c0c0c0] to-[#9ca3af] text-[#050608]
              shadow-[0_0_25px_rgba(148,163,184,0.85)] hover:brightness-110 transition"
          >
            VIEW BRACKET
          </Link>
        </div>

        {/* TABLE CARD — MATCHES S1 & S2 STYLES */}
        <div className="rounded-4xl border border-white/10 bg-[#050608] shadow-[0_18px_60px_rgba(0,0,0,0.9)] overflow-hidden transition-transform duration-500 hover:scale-[1.01]">
          <div
  className="w-full overflow-x-auto max-h-[340px] overflow-y-auto"
  data-vertical-scroll="true"
  style={{ scrollbarWidth: "thin", msOverflowStyle: "none" }}
>

            <table className="w-full border-spacing-0 text-sm">
              <thead className="sticky top-0 z-20 text-left text-[0.7rem] uppercase tracking-[0.22em] text-gray-300 bg-[#050608]/95 backdrop-blur-sm">
                <tr className="border-none">

                  <th className="py-3 pl-6 text-[0.68rem] text-gray-300">
                    Captain
                  </th>
                  <th className="py-3 text-[0.68rem] text-gray-300">
                    Team Name
                  </th>
                  <th className="py-3 text-center w-[72px] text-[0.68rem] text-gray-300" />
                  <th className="py-3 text-right text-[0.68rem] text-gray-300">
                    Avg MMR
                  </th>
                  <th className="py-3 pr-6 text-right text-[0.68rem] text-gray-300">
                    Gold Allocated
                  </th>
                </tr>
              </thead>

              <tbody>
                {ordered.map((team) => {
                  const captain = team.players[0]?.nickname ?? "Captain";
                  const gold = teamGold(team);

                  const isChampion = team.id === championId;
                  const isRunnerUp = team.id === runnerUpId;
                  const isThird = team.id === thirdId;
                  const isDQ = team.id === dqId;

                  const baseRow =
                    "group relative h-12 border-none overflow-hidden text-[0.78rem] transition-colors duration-300";

                  let rowClass = "bg-[#020617] " + baseRow;

                  if (isChampion) rowClass += " bg-[rgba(250,204,21,0.25)] hover:bg-[rgba(250,204,21,0.38)]";
                  else if (isRunnerUp) rowClass += " bg-[rgba(148,163,184,0.25)] hover:bg-[rgba(148,163,184,0.38)]";
                  else if (isThird) rowClass += " bg-[rgba(248,153,102,0.25)] hover:bg-[rgba(248,153,102,0.4)]";
                  else if (isDQ) rowClass += " bg-[#9b1115] hover:bg-[#af161a]";
                  else rowClass += " hover:bg-white/[0.04]";

                  return (
                    <tr
                      key={team.id}
                      className={rowClass}
                      style={
                        !isChampion && !isRunnerUp && !isThird && !isDQ
                          ? { boxShadow: `0 0 14px ${team.logoColor}40` }
                          : undefined
                      }
                    >
                      {/* CAPTAIN */}
                      <td className="pl-6">
                        <div className="flex items-center gap-3 font-semibold">
                          <span className="h-3 w-3 rounded-full" style={{ backgroundColor: team.logoColor }} />
                          <span className="px-3 py-1 rounded-full bg-white/10 text-[0.7rem] uppercase tracking-[0.16em] text-gray-200 shadow-[0_0_12px_rgba(255,255,255,0.2)]">
                            {captain}
                          </span>
                        </div>
                      </td>

                      {/* TEAM NAME */}
                      <td>
                        <div className="flex items-center gap-2 font-semibold">
                          <Link
                            to={`/teams/${team.id}`}
                            className="hover:text-[#e5e7eb] transition text-sm max-w-[260px]"
                          >
                            <span className="block whitespace-nowrap overflow-hidden text-ellipsis">
                              {team.name}
                            </span>
                          </Link>
                        </div>
                      </td>

                      {/* MEDAL / DQ */}
                      <td>
                        <div className="flex items-center justify-center">
                          {isChampion && (
                            <div className="inline-flex h-9 w-9 items-center justify-center rounded-full bg-[#facc15] shadow-[0_0_18px_rgba(250,204,21,0.9)] group-hover:scale-105 transition-transform">
                              <span className="text-lg">🏆</span>
                            </div>
                          )}
                          {isRunnerUp && (
                            <div className="inline-flex h-9 w-9 items-center justify-center rounded-full bg-[#9ca3af] shadow-[0_0_18px_rgba(148,163,184,0.9)] group-hover:scale-105 transition-transform">
                              <span className="text-lg">🥈</span>
                            </div>
                          )}
                          {isThird && (
                            <div className="inline-flex h-9 w-9 items-center justify-center rounded-full bg-[#d97706] shadow-[0_0_18px_rgba(234,179,8,0.95)] group-hover:scale-105 transition-transform">
                              <span className="text-lg">🥉</span>
                            </div>
                          )}
                          {isDQ && !isChampion && !isRunnerUp && !isThird && (
                            <div className="inline-flex h-9 w-9 items-center justify-center rounded-full bg-[#9b1115] group-hover:scale-105 transition-transform">
                              <span className="text-[0.65rem] font-extrabold tracking-[0.18em] uppercase">
                                DQ
                              </span>
                            </div>
                          )}
                        </div>
                      </td>

                      {/* Avg MMR */}
                      <td className="text-right">
                        <span className="tabular-nums text-sm text-gray-100">
                          {team.averageMMR}
                        </span>
                      </td>

                      {/* Gold */}
                      <td className="pr-6 text-right">
                        <span className="tabular-nums font-semibold text-gray-200">
                          {gold}
                        </span>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}

/* ---------- Season 4 table (inline) ---------- */
function Season4Standings() {
  const orderedByRecord = [...season4Teams].sort((a, b) => {
    if (b.wins !== a.wins) return b.wins - a.wins;
    return a.losses - b.losses;
  });

  const championId: Season4Team["id"] = "future-s4";
  const runnerUpId: Season4Team["id"] = "s1mpleo-s4";
  const thirdId: Season4Team["id"] = "helm-s4";
  const dqId: Season4Team["id"] = "none-s4"; // no real DQ, logic preserved

  const champion = orderedByRecord.find((t) => t.id === championId);
  const runnerUp = orderedByRecord.find((t) => t.id === runnerUpId);
  const third = orderedByRecord.find((t) => t.id === thirdId);
  const dqTeam = orderedByRecord.find((t) => t.id === dqId);

  const remaining: Season4Team[] = orderedByRecord.filter(
    (t) => ![championId, runnerUpId, thirdId, dqId].includes(t.id)
  );

  const placementOrderAfterTop3: Season4Team["id"][] = [
    "pyro-s4",
    "lightninggoku-s4",
    "rinne-s4",
    "tambamgod-s4",
    "draco-s4",
    "primeone-s4",
    "penda-s4",
    "muri-s4",
    "shaidota-s4",
    "drnemesis-s4",
    "rav-s4",
    "nj-s4",
    "ericdane-s4",
    "plutoski-s4",
    "vanara-s4",
    "shikamaru-s4",
    "zromep-s4",
  ];

  const orderedOthers: Season4Team[] = [
    ...placementOrderAfterTop3
      .map((id) => remaining.find((t) => t.id === id))
      .filter((t): t is Season4Team => Boolean(t)),
    ...remaining.filter((t) => !placementOrderAfterTop3.includes(t.id)),
  ];

  const ordered: Season4Team[] = [
    champion,
    runnerUp,
    third,
    ...orderedOthers,
    dqTeam,
  ].filter((t): t is Season4Team => Boolean(t));

  function teamGold(team: Season4Team): number {
    return team.players.reduce((sum, p) => sum + (p.gold || 0), 0);
  }

  return (
    <div className="w-full flex justify-center pb-4">
      <div className="w-full max-w-[1000px] px-4 sm:px-6">
        {/* BRACKET BUTTON */}
        <div className="flex justify-center mb-6">
          <Link
            to="/tournament"
            className="px-8 py-2 rounded-full text-[0.8rem] font-semibold uppercase tracking-[0.18em]
              bg-linear-to-tr from-[#f5f5f5] via-[#c0c0c0] to-[#9ca3af] text-[#050608]
              shadow-[0_0_25px_rgba(148,163,184,0.85)] hover:brightness-110 transition"
          >
            VIEW BRACKET
          </Link>
        </div>

        {/* TABLE CARD */}
        <div className="rounded-4xl border border-white/10 bg-[#050608] shadow-[0_18px_60px_rgba(0,0,0,0.9)] overflow-hidden transition-transform duration-500 hover:scale-[1.01]">
          <div
  className="w-full overflow-x-auto max-h-[340px] overflow-y-auto"
  data-vertical-scroll="true"
  style={{ scrollbarWidth: "thin", msOverflowStyle: "none" }}
>

            <table className="w-full border-spacing-0 text-sm">
              <thead className="sticky top-0 z-20 text-left text-[0.7rem] uppercase tracking-[0.22em] text-gray-300 bg-[#050608]/95 backdrop-blur-sm">
                <tr className="border-none">

                  <th className="py-3 pl-6 text-[0.68rem] text-gray-300">
                    Captain
                  </th>
                  <th className="py-3 text-[0.68rem] text-gray-300">
                    Team Name
                  </th>
                  <th className="py-3 text-center w-[72px] text-[0.68rem] text-gray-300" />
                  <th className="py-3 text-right text-[0.68rem] text-gray-300">
                    Avg MMR
                  </th>
                  <th className="py-3 pr-6 text-right text-[0.68rem] text-gray-300">
                    Gold Allocated
                  </th>
                </tr>
              </thead>

              <tbody>
                {ordered.map((team) => {
                  const captain = team.players[0]?.nickname ?? "Captain";
                  const gold = teamGold(team);

                  const isChampion = team.id === championId;
                  const isRunnerUp = team.id === runnerUpId;
                  const isThird = team.id === thirdId;
                  const isDQ = team.id === dqId;

                  const baseRow =
                    "group relative h-12 border-none overflow-hidden text-[0.78rem] transition-colors duration-300";

                  let rowClass = "bg-[#020617] " + baseRow;

                  if (isChampion) rowClass += " bg-[rgba(250,204,21,0.25)] hover:bg-[rgba(250,204,21,0.38)]";
                  else if (isRunnerUp) rowClass += " bg-[rgba(148,163,184,0.25)] hover:bg-[rgba(148,163,184,0.38)]";
                  else if (isThird) rowClass += " bg-[rgba(248,153,102,0.25)] hover:bg-[rgba(248,153,102,0.4)]";
                  else if (isDQ) rowClass += " bg-[#9b1115] hover:bg-[#af161a]";
                  else rowClass += " hover:bg-white/[0.04]";

                  return (
                    <tr
                      key={team.id}
                      className={rowClass}
                      style={
                        !isChampion && !isRunnerUp && !isThird && !isDQ
                          ? { boxShadow: `0 0 14px ${team.logoColor}40` }
                          : undefined
                      }
                    >
                      {/* CAPTAIN */}
                      <td className="pl-6">
                        <div className="flex items-center gap-3 font-semibold">
                          <span className="h-3 w-3 rounded-full" style={{ backgroundColor: team.logoColor }} />
                          <span className="px-3 py-1 rounded-full bg-white/10 text-[0.7rem] uppercase tracking-[0.16em] text-gray-200 shadow-[0_0_12px_rgba(255,255,255,0.2)]">
                            {captain}
                          </span>
                        </div>
                      </td>

                      {/* TEAM NAME */}
                      <td>
                        <div className="flex items-center gap-2 font-semibold">
                          <Link
                            to={`/teams/${team.id}`}
                            className="hover:text-[#e5e7eb] transition text-sm max-w-[260px]"
                          >
                            <span className="block whitespace-nowrap overflow-hidden text-ellipsis">
                              {team.name}
                            </span>
                          </Link>
                        </div>
                      </td>

                      {/* MEDAL / DQ */}
                      <td>
                        <div className="flex items-center justify-center">
                          {isChampion && (
                            <div className="inline-flex h-9 w-9 items-center justify-center rounded-full bg-[#facc15] shadow-[0_0_18px_rgba(250,204,21,0.9)] group-hover:scale-105 transition-transform">
                              <span className="text-lg">🏆</span>
                            </div>
                          )}
                          {isRunnerUp && (
                            <div className="inline-flex h-9 w-9 items-center justify-center rounded-full bg-[#9ca3af] shadow-[0_0_18px_rgba(148,163,184,0.9)] group-hover:scale-105 transition-transform">
                              <span className="text-lg">🥈</span>
                            </div>
                          )}
                          {isThird && (
                            <div className="inline-flex h-9 w-9 items-center justify-center rounded-full bg-[#d97706] shadow-[0_0_18px_rgba(234,179,8,0.95)] group-hover:scale-105 transition-transform">
                              <span className="text-lg">🥉</span>
                            </div>
                          )}
                          {isDQ && !isChampion && !isRunnerUp && !isThird && (
                            <div className="inline-flex h-9 w-9 items-center justify-center rounded-full bg-[#9b1115] group-hover:scale-105 transition-transform">
                              <span className="text-[0.65rem] font-extrabold tracking-[0.18em] uppercase">
                                DQ
                              </span>
                            </div>
                          )}
                        </div>
                      </td>

                      {/* Avg MMR */}
                      <td className="text-right">
                        <span className="tabular-nums text-sm text-gray-100">
                          {team.averageMMR}
                        </span>
                      </td>

                      {/* Gold */}
                      <td className="pr-6 text-right">
                        <span className="tabular-nums font-semibold text-gray-200">
                          {gold}
                        </span>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}

/* ---------- Season 5 table (inline) ---------- */
function Season5Standings() {
  const orderedByRecord = [...season5Teams].sort((a, b) => {
    if (b.wins !== a.wins) return b.wins - a.wins;
    return a.losses - b.losses;
  });

  // FINAL SEASON 5 RESULTS
  const championId: Season5Team["id"] = "bull-s5"; // 1st
  const runnerUpId: Season5Team["id"] = "shadow-s5"; // 2nd
  const thirdId: Season5Team["id"] = "sai-s5"; // 3rd

  // DISQUALIFIED TEAMS
  const dqId1: Season5Team["id"] = "sasuke-s5";
  const dqId2: Season5Team["id"] = "smurfpandas-s5";

  const champion = orderedByRecord.find((t) => t.id === championId);
  const runnerUp = orderedByRecord.find((t) => t.id === runnerUpId);
  const third = orderedByRecord.find((t) => t.id === thirdId);
  const dqTeam1 = orderedByRecord.find((t) => t.id === dqId1);
  const dqTeam2 = orderedByRecord.find((t) => t.id === dqId2);

  const remaining: Season5Team[] = orderedByRecord.filter(
    (t) => ![championId, runnerUpId, thirdId, dqId1, dqId2].includes(t.id)
  );

  const placementOrderAfterTop3: Season5Team["id"][] = [
    "helm-s5",
    "gokushery-s5",
    "sexy-s5",
    "ezlng-s5",
    "razer-s5",
    "drnemesis-s5",
    "s1mple0-s5",
    "flux-s5",
    "midas-s5",
    "shirley-s5",
    "roronoa-s5",
    "banner-s5",
    "n1khil-s5",
    "exe-s5",
    "rav-s5",
    "hina-s5",
    "bakabot-s5",
    "shikamaru-s5",
    "killua-s5",
    "future-s5",
    "billy-s5",
    "zromep-s5",
    "fyt-s5",
  ];

  const orderedOthers: Season5Team[] = [
    ...placementOrderAfterTop3
      .map((id) => remaining.find((t) => t.id === id))
      .filter((t): t is Season5Team => Boolean(t)),
    ...remaining.filter((t) => !placementOrderAfterTop3.includes(t.id)),
  ];

  function teamGold(team: Season5Team): number {
    return team.players.reduce((sum, p) => sum + (p.gold || 0), 0);
  }

  const ordered: Season5Team[] = [
    champion,
    runnerUp,
    third,
    ...orderedOthers,
    dqTeam1,
    dqTeam2,
  ].filter((t): t is Season5Team => Boolean(t));

  return (
    <div className="w-full flex justify-center pb-4">
      <div className="w-full max-w-[1000px] px-4 sm:px-6">
        {/* BRACKET BUTTON */}
        <div className="flex justify-center mb-6">
          <Link
            to="/tournament"
            className="px-8 py-2 rounded-full text-[0.8rem] font-semibold uppercase tracking-[0.18em]
              bg-linear-to-tr from-[#f5f5f5] via-[#c0c0c0] to-[#9ca3af] text-[#050608]
              shadow-[0_0_25px_rgba(148,163,184,0.85)] hover:brightness-110 transition"
          >
            VIEW BRACKET
          </Link>
        </div>

        {/* TABLE CARD (same shell as S1–S4 with vertical scroll) */}
        <div className="rounded-4xl border border-white/10 bg-[#050608] shadow-[0_18px_60px_rgba(0,0,0,0.9)] overflow-hidden transition-transform duration-500 hover:scale-[1.01]">
          <div
  className="w-full overflow-x-auto max-h-[340px] overflow-y-auto"
  data-vertical-scroll="true"
  style={{ scrollbarWidth: "thin", msOverflowStyle: "none" }}
>

            <table className="w-full border-spacing-0 text-sm">
              <thead className="sticky top-0 z-20 text-left text-[0.7rem] uppercase tracking-[0.22em] text-gray-300 bg-[#050608]/95 backdrop-blur-sm">
                <tr className="border-none">

                  <th className="py-3 pl-6 text-[0.68rem] text-gray-300">
                    Captain
                  </th>
                  <th className="py-3 text-[0.68rem] text-gray-300">
                    Team Name
                  </th>
                  <th className="py-3 text-center w-[72px] text-[0.68rem] text-gray-300" />
                  <th className="py-3 text-right text-[0.68rem] text-gray-300">
                    Avg MMR
                  </th>
                  <th className="py-3 pr-6 text-right text-[0.68rem] text-gray-300">
                    Gold Allocated
                  </th>
                </tr>
              </thead>

              <tbody>
                {ordered.map((team) => {
                  const captain = team.players[0]?.nickname ?? "Captain";
                  const gold = teamGold(team);

                  const isChampion = team.id === championId;
                  const isRunnerUp = team.id === runnerUpId;
                  const isThird = team.id === thirdId;
                  const isDQ = team.id === dqId1 || team.id === dqId2;

                  const baseRow =
                    "group relative h-12 border-none overflow-hidden text-[0.78rem] transition-colors duration-300";

                  let rowClass = baseRow;

                  // base navy row
                  rowClass += " bg-[#020617]";

                  if (isChampion) {
                    rowClass +=
                      " bg-[rgba(250,204,21,0.25)] hover:bg-[rgba(250,204,21,0.38)]";
                  } else if (isRunnerUp) {
                    rowClass +=
                      " bg-[rgba(148,163,184,0.25)] hover:bg-[rgba(148,163,184,0.38)]";
                  } else if (isThird) {
                    rowClass +=
                      " bg-[rgba(248,153,102,0.25)] hover:bg-[rgba(248,153,102,0.4)]";
                  } else if (isDQ) {
                    rowClass += " bg-[#9b1115] hover:bg-[#af161a]";
                  } else {
                    rowClass += " hover:bg-white/[0.04]";
                  }

                  return (
                    <tr
                      key={team.id}
                      className={rowClass}
                      style={
                        !isChampion && !isRunnerUp && !isThird && !isDQ
                          ? { boxShadow: `0 0 14px ${team.logoColor}40` }
                          : undefined
                      }
                    >
                      {/* CAPTAIN */}
                      <td className="pl-6">
                        <div className="flex items-center gap-3 font-semibold">
                          <span
                            className="h-3 w-3 rounded-full"
                            style={{ backgroundColor: team.logoColor }}
                          />
                          <span className="px-3 py-1 rounded-full bg-white/10 text-[0.7rem] uppercase tracking-[0.16em] text-gray-200 shadow-[0_0_12px_rgba(255,255,255,0.2)]">
                            {captain}
                          </span>
                        </div>
                      </td>

                      {/* TEAM NAME */}
                      <td>
                        <div className="flex items-center gap-2 font-semibold">
                          <Link
                            to={`/teams/${team.id}`}
                            className="hover:text-[#e5e7eb] transition text-sm max-w-[260px]"
                          >
                            <span
                              className={`block whitespace-nowrap overflow-hidden text-ellipsis ${
                                isDQ ? "line-through opacity-80" : ""
                              }`}
                            >
                              {team.name}
                            </span>
                          </Link>
                        </div>
                      </td>

                      {/* TROPHIES / MEDALS / DQ */}
                      <td>
                        <div className="flex items-center justify-center">
                          {isChampion && (
                            <div className="inline-flex h-9 w-9 items-center justify-center rounded-full bg-[#facc15] shadow-[0_0_18px_rgba(250,204,21,0.9)] group-hover:scale-105 transition-transform">
                              <span className="text-lg">🏆</span>
                            </div>
                          )}
                          {isRunnerUp && (
                            <div className="inline-flex h-9 w-9 items-center justify-center rounded-full bg-[#9ca3af] shadow-[0_0_18px_rgba(148,163,184,0.9)] group-hover:scale-105 transition-transform">
                              <span className="text-lg">🥈</span>
                            </div>
                          )}
                          {isThird && (
                            <div className="inline-flex h-9 w-9 items-center justify-center rounded-full bg-[#d97706] shadow-[0_0_18px_rgba(234,179,8,0.95)] group-hover:scale-105 transition-transform">
                              <span className="text-lg">🥉</span>
                            </div>
                          )}
                          {isDQ && !isChampion && !isRunnerUp && !isThird && (
                            <div className="inline-flex h-9 w-9 items-center justify-center rounded-full bg-[#9b1115] group-hover:scale-105 transition-transform">
                              <span className="text-[0.65rem] font-extrabold tracking-[0.18em] uppercase">
                                DQ
                              </span>
                            </div>
                          )}
                        </div>
                      </td>

                      {/* AVG MMR */}
                      <td className="text-right">
                        <span className="tabular-nums text-sm text-gray-100">
                          {team.averageMMR}
                        </span>
                      </td>

                      {/* GOLD */}
                      <td className="pr-6 text-right">
                        <span className="tabular-nums font-semibold text-gray-200">
                          {gold}
                        </span>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}


/* ---------- Seasons Timeline + Carousel ---------- */

type SeasonConfig = {
  id: number;
  render: () => JSX.Element;
};

const seasons: SeasonConfig[] = [
  { id: 1, render: () => <Season1Standings /> },
  { id: 2, render: () => <Season2Standings /> },
  { id: 3, render: () => <Season3Standings /> },
  { id: 4, render: () => <Season4Standings /> },
  { id: 5, render: () => <Season5Standings /> },
  { id: 6, render: () => <Season6Standings /> },
];

export default function SeasonShowCase() {
  const containerRef = useRef<HTMLDivElement>(null);
  const [activeIndex, setActiveIndex] = useState(0);

  const isDraggingRef = useRef(false);
  const dragStartXRef = useRef(0);
  const dragStartScrollRef = useRef(0);

  const handleScroll = (e: UIEvent<HTMLDivElement>) => {
    const el = e.currentTarget;
    const width = el.clientWidth || 1;
    const idx = Math.round(el.scrollLeft / width);
    if (idx !== activeIndex) setActiveIndex(idx);
  };

  const scrollToIndex = (index: number) => {
    const el = containerRef.current;
    if (!el) return;
    const width = el.clientWidth;
    el.scrollTo({
      left: width * index,
      behavior: "smooth",
    });
  };

  const handlePointerDown = (e: PointerEvent<HTMLDivElement>) => {
    const el = containerRef.current;
    if (!el) return;

    // if drag starts inside a vertically scrollable table, don't start horizontal drag
    const target = e.target as HTMLElement | null;
    if (target && target.closest("[data-vertical-scroll='true']")) {
      return;
    }

    isDraggingRef.current = true;
    dragStartXRef.current = e.clientX;
    dragStartScrollRef.current = el.scrollLeft;
    el.setPointerCapture(e.pointerId);
  };

  const handlePointerMove = (e: PointerEvent<HTMLDivElement>) => {
    if (!isDraggingRef.current) return;
    const el = containerRef.current;
    if (!el) return;
    const dx = e.clientX - dragStartXRef.current;
    el.scrollLeft = dragStartScrollRef.current - dx;
  };

  const endDrag = (e?: PointerEvent<HTMLDivElement>) => {
    isDraggingRef.current = false;
    if (e && containerRef.current) {
      containerRef.current.releasePointerCapture(e.pointerId);
    }
  };

  return (
    <main className="relative overflow-hidden pt-4 pb-6">

      {/* soft background glows only (transparent over body gradient) */}
      <div className="pointer-events-none fixed inset-0 -z-10">
        <div className="absolute inset-0 opacity-60 [background:radial-gradient(circle_at_top,rgba(255,255,255,0.12),transparent_55%)]" />
        <div className="absolute inset-0 opacity-45 [background:radial-gradient(circle_at_bottom,rgba(88,28,135,0.45),transparent_55%)]" />
      </div>

      <div className="relative z-10 pt-0 pb-8">
        <div className="max-w-7xl mx-auto px-6 lg:px-8">
          {/* HEADER */}
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, ease: "easeOut" }}
            className="text-center mb-2"
          >
            <h1 className="relative inline-block">
              <span className="text-xl md:text-2xl lg:text-3xl font-extrabold tracking-tight text-transparent bg-clip-text bg-linear-to-r from-zinc-200 via-slate-100 to-white">
                SEASONS
              </span>

              <span
                className="pointer-events-none absolute inset-0 text-xl md:text-2xl lg:text-3xl font-extrabold tracking-tight text-zinc-300 blur-lg opacity-30"
                style={{ transform: "translate(-1px, -1px)" }}
              >
                SEASONS
              </span>

              <motion.div
                animate={{ x: [-30, 300], opacity: [0, 0.4, 0] }}
                transition={{ duration: 6, repeat: Infinity, ease: "linear" }}
                className="pointer-events-none absolute -top-3 -left-14 w-28 h-28 bg-linear-to-r from-transparent via-zinc-300 to-transparent blur-2xl"
              />
            </h1>

            <p className="mt-1 text-[9px] md:text-[10px] lg:text-xs text-slate-300/80 font-light tracking-[0.35em] uppercase">
              Drag to journey through time
            </p>
          </motion.div>

          {/* TIMELINE */}
          <div className="flex justify-center mb-4">
            <div className="relative w-full max-w-xl">
              <div className="absolute left-0 right-0 top-1/2 -translate-y-1/2 h-px bg-linear-to-r from-transparent via-zinc-400 to-transparent opacity-40 blur-[1px]" />
              <div className="absolute left-0 right-0 top-1/2 -translate-y-1/2 h-px bg-zinc-400/70" />

              <div className="relative flex justify-between items-center px-2">
                {seasons.map((season, index) => {
                  const isActive = index === activeIndex;

                  return (
                    <motion.button
                      key={season.id}
                      onClick={() => scrollToIndex(index)}
                      className="relative group"
                      whileTap={{ scale: 0.92 }}
                    >
                      {isActive && (
                        <motion.div
                          layoutId="timeline-glow"
                          className="absolute -inset-2 rounded-full bg-zinc-200/15 blur-md"
                          transition={{
                            type: "spring",
                            stiffness: 260,
                            damping: 24,
                          }}
                        />
                      )}

                      {isActive && (
                        <motion.div
                          animate={{ scale: [1, 1.15, 1] }}
                          transition={{ duration: 1.4, repeat: Infinity }}
                          className="absolute inset-0 rounded-full bg-linear-to-br from-zinc-200 to-white shadow-[0_0_16px_rgba(250,250,250,0.8)]"
                        />
                      )}

                      <motion.span
                        className={`relative z-10 flex w-8 h-8 items-center justify-center rounded-full
                          text-xs md:text-sm font-semibold
                          bg-linear-to-br from-[#050608] to-black/80
                          border ${
                            isActive
                              ? "border-zinc-200 text-zinc-100 shadow-[0_0_8px_rgba(250,250,250,0.7)]"
                              : "border-slate-700 text-slate-400"
                          } transition-all duration-300`}
                        animate={{ scale: isActive ? 1.05 : 1 }}
                        whileHover={{ scale: 1.08, borderColor: "#e5e5e5" }}
                      >
                        {season.id}
                      </motion.span>
                    </motion.button>
                  );
                })}
              </div>
            </div>
          </div>

          {/* SEASON CONTENT (horizontal drag) */}
          <div
            ref={containerRef}
            onScroll={handleScroll}
            onPointerDown={handlePointerDown}
            onPointerMove={handlePointerMove}
            onPointerUp={endDrag}
            onPointerLeave={endDrag}
            className="flex overflow-x-auto snap-x snap-mandatory scroll-smooth no-scrollbar cursor-grab active:cursor-grabbing select-none"
            style={{ scrollbarWidth: "none", msOverflowStyle: "none" }}
          >
            {seasons.map(({ id, render }, index) => (
              <section
                key={id}
                className="snap-start shrink-0 w-full flex justify-center items-start px-2"
              >
                <motion.div
                  initial={{ opacity: 0, scale: 0.98 }}
                  animate={{
                    opacity: activeIndex === index ? 1 : 0.85,
                    scale: activeIndex === index ? 1 : 0.97,
                  }}
                  transition={{ duration: 0.4 }}
                  className="w-full max-w-[1300px] origin-top pt-2"
                  style={{ transformOrigin: "top center" }}
                >
                  {render()}
                </motion.div>
              </section>
            ))}
          </div>
        </div>
      </div>
    </main>
  );
}

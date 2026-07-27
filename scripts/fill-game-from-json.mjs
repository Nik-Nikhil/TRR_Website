/**
 * fill-game-from-json.mjs
 *
 * Same as fill-game.mjs, but instead of fetching from Stratz itself (which
 * Cloudflare blocks for this network), it reads a Stratz GraphQL response
 * you already fetched manually in the browser at:
 *
 *   https://api.stratz.com/graphiql
 *
 * Workflow:
 *   1. Log in at https://api.stratz.com/graphiql
 *   2. Paste the match query (ask if you need it again) with the matchId variable
 *   3. Run it, then copy the ENTIRE response JSON (the { "data": { "match": {...} } } object)
 *   4. Save it to a file, e.g. match.json
 *   5. Run:
 *      node scripts/fill-game-from-json.mjs <MATCH_ID> <path-to-match.json> [GAME_NUMBER]
 *
 * Examples:
 *   Playoff:      node scripts/fill-game-from-json.mjs UB_R1_M1 match.json
 *   Group Stage:  node scripts/fill-game-from-json.mjs GROUP_A_SERIES1_0 match.json 2
 *   Tiebreaker:   node scripts/fill-game-from-json.mjs TIEBREAKER_A_0 match.json
 *
 * Flags:
 *   --dire-first   Treat the second team in the match as Radiant (only used
 *                  as a fallback when the API response has no team names,
 *                  e.g. pub lobby games)
 */

import { readFileSync, writeFileSync, existsSync } from "fs";
import { fileURLToPath } from "url";
import { dirname, join } from "path";

const __dirname = dirname(fileURLToPath(import.meta.url));

const PLAYOFF_PATH = join(__dirname, "../src/data/Playoff/Season4.json");
const GROUPSTAGE_PATH = join(__dirname, "../src/data/GroupStage/Season5.json");

// ─── CLI args ────────────────────────────────────────────────────────────────
const args = process.argv.slice(2).filter(a => !a.startsWith("--"));
const flags = process.argv.slice(2).filter(a => a.startsWith("--"));

const [matchId, jsonPath, gameNumberArg] = args;

if (!matchId || !jsonPath) {
  console.error(
    "\nUsage: node scripts/fill-game-from-json.mjs <MATCH_ID> <path-to-response.json> [GAME_NUMBER] [--dire-first]\n" +
    "  Playoff:      node scripts/fill-game-from-json.mjs UB_R1_M1 match.json\n" +
    "  Group Stage:  node scripts/fill-game-from-json.mjs GROUP_A_SERIES1_0 match.json 2\n" +
    "  Tiebreaker:   node scripts/fill-game-from-json.mjs TIEBREAKER_A_0 match.json\n\n" +
    "Get the JSON by running the match query at https://api.stratz.com/graphiql\n" +
    "in your browser (logged in) and saving the full response to a file.\n"
  );
  process.exit(1);
}

const gameNumber = gameNumberArg ? parseInt(gameNumberArg, 10) : 1;
const direFirst = flags.includes("--dire-first");

const isGroupStage = matchId.startsWith("GROUP_") || matchId.startsWith("TIEBREAKER_");
const JSON_PATH = isGroupStage ? GROUPSTAGE_PATH : PLAYOFF_PATH;

// ─── Helpers ─────────────────────────────────────────────────────────────────

function formatDuration(seconds) {
  const m = Math.floor(seconds / 60);
  const s = seconds % 60;
  return `${m}:${String(s).padStart(2, "0")}`;
}

function findPlayoffMatch(season4, id) {
  if (season4.grandFinal?.id === id) return season4.grandFinal;
  const allRounds = [...season4.upper.rounds, ...season4.lower.rounds];
  for (const round of allRounds) {
    const m = round.matches.find(m => m.id === id);
    if (m) return m;
  }
  return null;
}

function findGroupStageMatch(groupStage, id) {
  if (id.startsWith("TIEBREAKER_")) {
    const parts = id.split("_");
    if (parts.length < 3) return null;
    const groupLetter = parts[1];
    const tiebreakerIndex = parseInt(parts[2], 10);
    const groupName = `Group ${groupLetter}`;

    if (!groupStage.tiebreakers?.[groupName]) return null;
    const tiebreaker = groupStage.tiebreakers[groupName][tiebreakerIndex];
    if (!tiebreaker) return null;

    return { type: "tiebreaker", match: tiebreaker, groupName };
  }

  const parts = id.split("_");
  if (parts.length < 4) return null;

  const groupLetter = parts[1];
  const seriesKey = parts[2].toLowerCase();
  const matchIndex = parseInt(parts[3], 10);

  const groupName = `Group ${groupLetter}`;

  if (!groupStage.series?.[groupName]?.[seriesKey]) return null;
  const match = groupStage.series[groupName][seriesKey][matchIndex];
  if (!match) return null;

  return { type: "series", match, groupName, seriesKey, matchIndex };
}

// ─── Main ─────────────────────────────────────────────────────────────────────

console.log(`\n🎯 Match type    : ${isGroupStage ? "Group Stage" : "Playoff"}`);
console.log(`🎯 Match ID      : ${matchId}`);
console.log(`📄 JSON file     : ${jsonPath}  (game ${gameNumber})`);
if (direFirst) console.log("🔄 --dire-first flag set: second team treated as Radiant\n");

if (!existsSync(jsonPath)) {
  console.error(`\n❌  File not found: ${jsonPath}`);
  process.exit(1);
}

let payload;
try {
  payload = JSON.parse(readFileSync(jsonPath, "utf-8"));
} catch (err) {
  console.error(`\n❌  Couldn't parse ${jsonPath} as JSON: ${err.message}`);
  process.exit(1);
}

// Accept either the full GraphiQL response ({ data: { match: {...} } })
// or just the inner match object, in case you copied only that part.
const match = payload?.data?.match ?? payload?.match ?? payload;

if (!match?.id || !match?.players) {
  console.error(
    `\n❌  That file doesn't look like a Stratz match response.\n` +
    `    Expected shape: { "data": { "match": { "id", "players", ... } } }`
  );
  process.exit(1);
}

// Load season data and find the target match
const seasonData = JSON.parse(readFileSync(JSON_PATH, "utf-8"));

let matchData, matchObj;

if (isGroupStage) {
  matchData = findGroupStageMatch(seasonData, matchId);
  if (!matchData) {
    console.error(`\n❌  Group stage match "${matchId}" not found in Season5.json.`);
    console.error("    Format: GROUP_<A-D>_SERIES<N>_<INDEX> or TIEBREAKER_<A-D>_<INDEX>");
    console.error("    Example: GROUP_A_SERIES1_0 or TIEBREAKER_A_0");
    process.exit(1);
  }
  matchObj = matchData.match;
  console.log(`\n✅ Found ${matchData.type} in ${matchData.groupName}`);
} else {
  matchObj = findPlayoffMatch(seasonData, matchId);
  if (!matchObj) {
    console.error(`\n❌  Playoff match "${matchId}" not found in Season4.json.`);
    const allRounds = [...seasonData.upper.rounds, ...seasonData.lower.rounds];
    const ids = allRounds.flatMap(r => r.matches.map(m => m.id));
    ids.push(seasonData.grandFinal?.id ?? "GF");
    console.error("    Valid IDs:", ids.join(", "));
    process.exit(1);
  }
}

// Determine radiant / dire team names
let teamA, teamB;
if (isGroupStage) {
  teamA = matchObj.team1;
  teamB = matchObj.team2;
} else {
  [teamA, teamB] = matchObj.teams ?? [];
}

let radiantTeam, direTeam;

if (match.radiantTeam?.name && match.direTeam?.name) {
  radiantTeam = match.radiantTeam.name;
  direTeam = match.direTeam.name;
  console.log(`\n  🟢 Radiant (API): ${radiantTeam}`);
  console.log(`  🔴 Dire    (API): ${direTeam}`);
} else {
  radiantTeam = direFirst ? teamB : teamA;
  direTeam = direFirst ? teamA : teamB;
  console.log(`\n  🟢 Radiant (assumed): ${radiantTeam}`);
  console.log(`  🔴 Dire    (assumed): ${direTeam}`);
  console.log(`  ℹ️  Use --dire-first if the sides are swapped.`);
}

const winner = match.didRadiantWin ? radiantTeam : direTeam;

// Build hero lists (playerSlot 0-4 = radiant, 128+ = dire)
const radiantHeroes = [];
const direHeroes = [];
const players = (match.players ?? []).slice().sort((a, b) => a.playerSlot - b.playerSlot);

let radiantScore = 0;
let direScore = 0;

for (const p of players) {
  const name = p.hero?.displayName ?? `Hero#${p.hero?.id}`;
  if (p.playerSlot < 128) {
    radiantHeroes.push(name);
    radiantScore += p.kills ?? 0;
  } else {
    direHeroes.push(name);
    direScore += p.kills ?? 0;
  }
}

const dotabuffMatchId = match.id;

const gameEntry = {
  game: gameNumber,
  duration: formatDuration(match.durationSeconds),
  winner,
  radiant: radiantTeam,
  dire: direTeam,
  radiantScore,
  direScore,
  radiantHeroes,
  direHeroes,
  dotabuffUrl: `https://www.dotabuff.com/matches/${dotabuffMatchId}`,
};

console.log("\n📋 Game entry:");
console.log(JSON.stringify(gameEntry, null, 2));

// Upsert into matchObj.games
if (!Array.isArray(matchObj.games)) matchObj.games = [];
const idx = matchObj.games.findIndex(g => g.game === gameNumber);
if (idx >= 0) {
  console.log(`\n⚠️  Replacing existing game ${gameNumber} for ${matchId}.`);
  matchObj.games[idx] = gameEntry;
} else {
  matchObj.games.push(gameEntry);
  matchObj.games.sort((a, b) => a.game - b.game);
}

// Write back
const fileName = isGroupStage ? "Season5.json" : "Season4.json";
writeFileSync(JSON_PATH, JSON.stringify(seasonData, null, 2) + "\n", "utf-8");
console.log(`\n💾 ${fileName} updated — ${matchId} game ${gameNumber}. Done!\n`);

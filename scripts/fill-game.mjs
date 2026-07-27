/**
 * fill-game.mjs
 *
 * Fills game data into Season4.json (playoffs) or Season5.json (group stage).
 * Match data is fetched exclusively from the Stratz GraphQL API.
 *
 * Usage:
 *   node scripts/fill-game.mjs <MATCH_ID> <DOTABUFF_MATCH_ID> [GAME_NUMBER]
 *
 * Examples:
 *   Playoff: node scripts/fill-game.mjs UB_R1_M1 8399188976
 *   Playoff: node scripts/fill-game.mjs LB_R3_M2 8399188976 2 --dire-first
 *   Group Stage: node scripts/fill-game.mjs GROUP_A_SERIES1_0 8399188976
 *   Group Stage: node scripts/fill-game.mjs GROUP_A_SERIES1_0 8399188976 2
 *   Tiebreaker: node scripts/fill-game.mjs TIEBREAKER_A_0 8399188976
 *
 * Flags:
 *   --dire-first   Treat the second team in the match as Radiant
 *
 * Requires a STRATZ_API_TOKEN environment variable (or .env entry).
 * Get a free token from https://stratz.com/api.
 */

import { readFileSync, writeFileSync } from "fs";
import { fileURLToPath } from "url";
import { dirname, join } from "path";

// Load .env file if it exists
const __dirname = dirname(fileURLToPath(import.meta.url));
const envPath = join(__dirname, "../.env");
try {
  const envContent = readFileSync(envPath, "utf-8");
  envContent.split("\n").forEach(line => {
    const match = line.match(/^([^=:#]+)=(.*)$/);
    if (match) {
      const key = match[1].trim();
      const value = match[2].trim();
      if (!process.env[key]) process.env[key] = value;
    }
  });
} catch {}

const PLAYOFF_PATH = join(__dirname, "../src/data/Playoff/Season4.json");
const GROUPSTAGE_PATH = join(__dirname, "../src/data/GroupStage/Season5.json");

// ─── CLI args ────────────────────────────────────────────────────────────────
const args = process.argv.slice(2).filter(a => !a.startsWith("--"));
const flags = process.argv.slice(2).filter(a => a.startsWith("--"));

const [matchId, dotabuffMatchId, gameNumberArg] = args;

if (!matchId || !dotabuffMatchId) {
  console.error(
    "\nUsage: node scripts/fill-game.mjs <MATCH_ID> <DOTABUFF_MATCH_ID> [GAME_NUMBER] [--dire-first]\n" +
    "  Playoff:      node scripts/fill-game.mjs UB_R1_M1 8399188976\n" +
    "  Group Stage:  node scripts/fill-game.mjs GROUP_A_SERIES1_0 8399188976 2\n" +
    "  Tiebreaker:   node scripts/fill-game.mjs TIEBREAKER_A_0 8399188976\n"
  );
  process.exit(1);
}

const gameNumber = gameNumberArg ? parseInt(gameNumberArg, 10) : 1;
const direFirst = flags.includes("--dire-first");

// Detect match type
const isGroupStage = matchId.startsWith("GROUP_") || matchId.startsWith("TIEBREAKER_");
const JSON_PATH = isGroupStage ? GROUPSTAGE_PATH : PLAYOFF_PATH;

// ─── Helpers ─────────────────────────────────────────────────────────────────

function sleep(ms) { return new Promise(r => setTimeout(r, ms)); }

function formatDuration(seconds) {
  const m = Math.floor(seconds / 60);
  const s = seconds % 60;
  return `${m}:${String(s).padStart(2, "0")}`;
}

// Find match in playoff bracket
function findPlayoffMatch(season4, id) {
  // Grand Final is a top-level field, not inside a round
  if (season4.grandFinal?.id === id) return season4.grandFinal;
  const allRounds = [...season4.upper.rounds, ...season4.lower.rounds];
  for (const round of allRounds) {
    const m = round.matches.find(m => m.id === id);
    if (m) return m;
  }
  return null;
}

// Find match in group stage
// Format: GROUP_A_SERIES1_0 (group, series, match index)
// Or: TIEBREAKER_A_0 (tiebreaker, group letter, tiebreaker index)
function findGroupStageMatch(groupStage, id) {
  if (id.startsWith("TIEBREAKER_")) {
    // TIEBREAKER_A_0 -> Group A, tiebreaker index 0
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

  // GROUP_A_SERIES1_0 -> Group A, series1, match index 0
  const parts = id.split("_");
  if (parts.length < 4) return null;

  const groupLetter = parts[1]; // "A"
  const seriesKey = parts[2].toLowerCase(); // "series1"
  const matchIndex = parseInt(parts[3], 10); // 0

  const groupName = `Group ${groupLetter}`;

  if (!groupStage.series?.[groupName]?.[seriesKey]) return null;
  const match = groupStage.series[groupName][seriesKey][matchIndex];
  if (!match) return null;

  return { type: "series", match, groupName, seriesKey, matchIndex };
}

/**
 * Fetch match data from the Stratz GraphQL API.
 * Requires STRATZ_API_TOKEN environment variable for authentication.
 *
 * Two common causes of "Stratz failing" that this guards against:
 *  1. Stratz's edge rejects requests with no/blank User-Agent header
 *     (Node's fetch doesn't send a browser-like one by default) — we set one
 *     explicitly, configurable via STRATZ_USER_AGENT.
 *  2. GraphQL APIs often reply 200 OK with an `errors` array instead of a
 *     non-2xx status when the token is invalid/expired or the match id is
 *     wrong — we check `body.errors` explicitly instead of only `res.ok`.
 */
async function fetchFromStratz(matchId, attempt = 1) {
  const token = process.env.STRATZ_API_TOKEN;
  if (!token) {
    throw new Error(
      "STRATZ_API_TOKEN environment variable not set.\n" +
      "  1. Get a free token from https://stratz.com/api\n" +
      "  2. Add it to your .env file as STRATZ_API_TOKEN=your_token"
    );
  }

  console.log(`  📡 Fetching match data from Stratz (attempt ${attempt}/3)…`);

  const query = `
    query GetMatch($matchId: Long!) {
      match(id: $matchId) {
        id
        didRadiantWin
        durationSeconds
        radiantTeam { name }
        direTeam { name }
        players {
          playerSlot
          hero { displayName id }
          kills
          deaths
          assists
        }
      }
    }
  `;

  let res;
  try {
    res = await fetch("https://api.stratz.com/graphql", {
      method: "POST",
      // "Connection: close" avoids a keep-alive socket lingering after the
      // script exits, which triggers a libuv assertion crash on Windows.
      keepalive: false,
      headers: {
        "Content-Type": "application/json",
        "Accept": "application/json",
        "Accept-Language": "en-US,en;q=0.9",
        "Authorization": `Bearer ${token}`,
        // Cloudflare's WAF in front of api.stratz.com challenges requests
        // that don't look like they came from a browser. A bare Node fetch
        // sends none of these, so we send the same set a browser would.
        "User-Agent": process.env.STRATZ_USER_AGENT || "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/124.0.0.0 Safari/537.36",
        "Origin": "https://stratz.com",
        "Referer": "https://stratz.com/",
        "Connection": "close",
      },
      body: JSON.stringify({
        query,
        variables: { matchId: parseInt(matchId, 10) },
      }),
    });
  } catch (networkErr) {
    throw new Error(`Network error reaching Stratz: ${networkErr.message}`);
  }

  const rawText = await res.text();

  const isCloudflareChallenge = /Just a moment|cf-chl|Enable JavaScript and cookies/i.test(rawText);

  if (!res.ok) {
    if (isCloudflareChallenge) {
      throw new Error(
        `Blocked by Cloudflare's bot challenge (HTTP ${res.status}), not an auth error — ` +
        `your token was never evaluated. This is Stratz's edge rejecting the request before ` +
        `it reaches their API. If this keeps happening after retries, it's worth reporting to ` +
        `Stratz support/Discord, since token-authenticated API calls shouldn't hit an interactive challenge.`
      );
    }
    // 401/403 = bad or missing token; show the body since Stratz usually
    // explains exactly what's wrong (expired token, no access, etc.)
    if (res.status === 401 || res.status === 403) {
      throw new Error(
        `Stratz auth failed (HTTP ${res.status}). Your STRATZ_API_TOKEN is missing, ` +
        `invalid, or expired — generate a fresh one at https://stratz.com/api.\n` +
        `  Response: ${rawText.slice(0, 300)}`
      );
    }
    if (res.status === 429) {
      throw new Error(`Stratz rate limit hit (HTTP 429). Wait a bit and retry.`);
    }
    throw new Error(`Stratz API HTTP ${res.status}: ${rawText.slice(0, 300)}`);
  }

  let data;
  try {
    data = JSON.parse(rawText);
  } catch {
    throw new Error(`Stratz returned non-JSON response (likely blocked by edge/WAF): ${rawText.slice(0, 300)}`);
  }

  // GraphQL convention: 200 OK can still carry an `errors` array (e.g. bad
  // token, no permission for this match, unknown field).
  if (data.errors?.length) {
    const messages = data.errors.map(e => e.message).join("; ");
    throw new Error(`Stratz GraphQL error(s): ${messages}`);
  }

  if (!data.data?.match) {
    throw new Error(`Match ${matchId} not found on Stratz (it may be un-parsed, private, or too old).`);
  }

  const match = data.data.match;

  return {
    match_id: match.id,
    radiant_win: match.didRadiantWin,
    duration: match.durationSeconds,
    radiant_team: match.radiantTeam?.name ? { name: match.radiantTeam.name } : null,
    dire_team: match.direTeam?.name ? { name: match.direTeam.name } : null,
    radiant_score: match.players.filter(p => p.playerSlot < 128).reduce((sum, p) => sum + p.kills, 0),
    dire_score: match.players.filter(p => p.playerSlot >= 128).reduce((sum, p) => sum + p.kills, 0),
    players: match.players.map(p => ({
      player_slot: p.playerSlot,
      hero_id: p.hero.id,
      hero_name: p.hero.displayName,
    })),
  };
}

async function fetchFromStratzWithRetries(matchId) {
  let lastErr;
  for (let attempt = 1; attempt <= 3; attempt++) {
    try {
      return await fetchFromStratz(matchId, attempt);
    } catch (err) {
      lastErr = err;
      // Don't retry on auth errors — they won't fix themselves.
      if (/auth failed|STRATZ_API_TOKEN/.test(err.message)) throw err;
      console.log(`  ⚠️  ${err.message}`);
      if (attempt < 3) {
        console.log(`  🔄 Retrying in 4s…`);
        await sleep(4000);
      }
    }
  }
  throw lastErr;
}

// ─── Main ─────────────────────────────────────────────────────────────────────

(async () => {
  console.log(`\n🎯 Match type    : ${isGroupStage ? "Group Stage" : "Playoff"}`);
  console.log(`🎯 Match ID      : ${matchId}`);
  console.log(`🔢 Dotabuff match: ${dotabuffMatchId}  (game ${gameNumber})`);
  if (direFirst) console.log("🔄 --dire-first flag set: second team treated as Radiant\n");

  let match;
  try {
    match = await fetchFromStratzWithRetries(dotabuffMatchId);
    console.log(`  ✅ Match data retrieved from Stratz API (hero names included)`);
  } catch (err) {
    console.error(`\n❌  Stratz API failed: ${err.message}`);
    process.exit(1);
  }

  // 3. Load JSON and find the match
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

  // 4. Determine radiant / dire team names
  let teamA, teamB;

  if (isGroupStage) {
    // Group stage uses team1/team2 fields
    teamA = matchObj.team1;
    teamB = matchObj.team2;
  } else {
    // Playoff uses teams array
    [teamA, teamB] = matchObj.teams ?? [];
  }

  let radiantTeam, direTeam;

  if (match.radiant_team?.name && match.dire_team?.name) {
    radiantTeam = match.radiant_team.name;
    direTeam = match.dire_team.name;
    console.log(`\n  🟢 Radiant (API): ${radiantTeam}`);
    console.log(`  🔴 Dire    (API): ${direTeam}`);
  } else {
    // Pub game — use match order, swapped by --dire-first if needed
    radiantTeam = direFirst ? teamB : teamA;
    direTeam = direFirst ? teamA : teamB;
    console.log(`\n  🟢 Radiant (assumed): ${radiantTeam}`);
    console.log(`  🔴 Dire    (assumed): ${direTeam}`);
    console.log(`  ℹ️  Use --dire-first if the sides are swapped.`);
  }

  const winner = match.radiant_win ? radiantTeam : direTeam;

  // 5. Build hero lists (slots 0-4 = radiant, 128+ = dire)
  const radiantHeroes = [];
  const direHeroes = [];
  const players = (match.players ?? []).slice().sort((a, b) => a.player_slot - b.player_slot);

  for (const p of players) {
    const name = p.hero_name ?? `Hero#${p.hero_id}`;
    if (p.player_slot < 128) radiantHeroes.push(name);
    else direHeroes.push(name);
  }

  // 6. Build game entry
  const gameEntry = {
    game: gameNumber,
    duration: formatDuration(match.duration),
    winner,
    radiant: radiantTeam,
    dire: direTeam,
    radiantScore: match.radiant_score ?? 0,
    direScore: match.dire_score ?? 0,
    radiantHeroes,
    direHeroes,
    dotabuffUrl: `https://www.dotabuff.com/matches/${dotabuffMatchId}`,
  };

  console.log("\n📋 Game entry:");
  console.log(JSON.stringify(gameEntry, null, 2));

  // 7. Upsert into matchObj.games
  if (!Array.isArray(matchObj.games)) matchObj.games = [];
  const idx = matchObj.games.findIndex(g => g.game === gameNumber);
  if (idx >= 0) {
    console.log(`\n⚠️  Replacing existing game ${gameNumber} for ${matchId}.`);
    matchObj.games[idx] = gameEntry;
  } else {
    matchObj.games.push(gameEntry);
    matchObj.games.sort((a, b) => a.game - b.game);
  }

  // 8. Write back
  const fileName = isGroupStage ? "Season5.json" : "Season4.json";
  writeFileSync(JSON_PATH, JSON.stringify(seasonData, null, 2) + "\n", "utf-8");
  console.log(`\n💾 ${fileName} updated — ${matchId} game ${gameNumber}. Done!\n`);

})().catch(err => {
  console.error("\n❌  Fatal error:", err.message);
  process.exit(1);
});

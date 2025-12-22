// generate-player-seasons.js
// Run with: node generate-player-seasons.js
// Works with "type": "module" in package.json

import fs from "node:fs";
import { players } from "./player-data.js";
import { teams } from "./team-data.js";

// --- figure out season number from team id ---
// e.g. "machine-s2" -> 2, "dynamodon-s3" -> 3, "future-s4" -> 4, "sai-s5" -> 5
// Season 1 teams have ids WITHOUT "-s2/-s3/-s4/-s5"
function getSeasonFromTeamId(teamId) {
  if (teamId.includes("-s2")) return 2;
  if (teamId.includes("-s3")) return 3;
  if (teamId.includes("-s4")) return 4;
  if (teamId.includes("-s5")) return 5;
  return 1; // default: season 1
}

// nickname(lowercased) -> Set of seasons [1..5]
const seasonsByNickname = new Map();

// collect seasons from team-data.js
for (const team of teams) {
  if (!team || !Array.isArray(team.players)) continue;

  const season = getSeasonFromTeamId(team.id);

  for (const pl of team.players) {
    if (!pl) continue;

    const rawNick = typeof pl.nickname === "string" ? pl.nickname : null;
    if (!rawNick) continue;

    const nick = rawNick.trim();
    if (!nick) continue;

    const key = nick.toLowerCase();
    let set = seasonsByNickname.get(key);
    if (!set) {
      set = new Set();
      seasonsByNickname.set(key, set);
    }
    set.add(season);
  }
}

// build lines only for players that exist in player-data.js
const lines = [];

for (const p of players) {
  if (!p || !p.nickname) continue;

  const nick = p.nickname.trim();
  const key = nick.toLowerCase();

  const seasonSet = seasonsByNickname.get(key) || new Set();
  const seasonNums = Array.from(seasonSet).sort((a, b) => a - b);

  const seasonLabels = seasonNums.map((n) => `s${n}`); // 1 -> s1

  // if you want to skip players with no seasons, uncomment:
  // if (seasonLabels.length === 0) continue;

  const line = `${nick}: - ${seasonLabels.join(", ")}`;
  lines.push(line);
}

// write result as a simple txt mapping
const output = lines.join("\n");
fs.writeFileSync("player_seasons.txt", output, "utf8");

console.log("✅ Wrote player_seasons.txt");

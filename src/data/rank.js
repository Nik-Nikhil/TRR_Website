// roles.js (or rank.js if you prefer)
// Run with: node roles.js

import fs from "node:fs";
import { playerLinks } from "./player-links.js";

// 1. dotabuff URL -> steam32 id
function extractPlayerId(url) {
  const clean = url.trim();
  const parts = clean.split("/").filter(Boolean);
  return parts[parts.length - 1]; // last segment is id
}

// 2. OpenDota lane_role code -> lane name
// 1=safe, 2=mid, 3=off, 4=jungle, 5=roam
function laneRoleCodeToLane(code) {
  switch (code) {
    case 1:
      return "safe";
    case 2:
      return "mid";
    case 3:
      return "off";
    case 4:
      return "jungle";
    case 5:
      return "roam";
    default:
      return "unknown";
  }
}

// 3. lane -> our role labels
const laneToRole = {
  safe: "carry",
  mid: "mid",
  off: "offlane",
  jungle: "soft_sup",
  roam: "soft_sup",
};

// 4. laneCounts ARRAY -> top 3 roles
function rolesFromLaneCounts(laneCounts) {
  if (!Array.isArray(laneCounts)) return [];

  const roleGames = {
    carry: 0,
    mid: 0,
    offlane: 0,
    soft_sup: 0,
    hard_sup: 0,
  };

  for (const row of laneCounts) {
    const lane = laneRoleCodeToLane(row.lane_role);
    const role = laneToRole[lane];
    if (!role) continue;
    roleGames[role] += row.games || 0;
  }

  return Object.entries(roleGames)
    .filter(([, games]) => games > 0)
    .sort((a, b) => b[1] - a[1])
    .map(([role]) => role)
    .slice(0, 3);
}

// 5. fetchLaneCounts: normalize object -> array
async function fetchLaneCounts(playerId) {
  const url = `https://api.opendota.com/api/players/${playerId}/counts`;
  const res = await fetch(url);
  if (!res.ok) {
    console.error(`❌ counts failed for ${playerId} (status ${res.status})`);
    return [];
  }

  const data = await res.json();
  const laneRoleObj = data.lane_role || {};

  // lane_role object -> array like [{ lane_role: 1, games: 123, win: 60 }, ...]
  const laneCounts = Object.entries(laneRoleObj).map(([code, stats]) => ({
    lane_role: Number(code),
    games: stats.games || 0,
    win: stats.win || 0,
  }));

  return laneCounts;
}

// 6. main: loop players and write txt
async function main() {
  const lines = [];

  for (const [name, url] of Object.entries(playerLinks)) {
    const id = extractPlayerId(url);
    if (!id) {
      console.warn(`⚠️ Could not extract id for ${name} from url ${url}`);
      lines.push(`${name} - unknown`);
      continue;
    }

    try {
      const laneCounts = await fetchLaneCounts(id);
      const roles = rolesFromLaneCounts(laneCounts);
      lines.push(`${name} - ${roles.join(", ") || "unknown"}`);
    } catch (err) {
      console.error(`❌ Error for ${name} (${id}):`, err);
      lines.push(`${name} - unknown`);
    }

    // small delay to be nice to the API
    await new Promise((r) => setTimeout(r, 300));
  }

  fs.writeFileSync("player_roles.txt", lines.join("\n"), "utf8");
  console.log("✅ player_roles.txt updated");
}

await main();

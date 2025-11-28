// generatePlayersFromLinks.js
// Reads combinedLinks.js (Name - steamUrl, dotabuffUrl)
// -> writes playersFromLinks.ts with Player[] objects

import fs from "fs";

const INPUT_FILE = "combinedLinks.js";     // file with: Name - steamUrl, dotabuffUrl
const OUTPUT_FILE = "playersFromLinks.ts";

// Read input
const text = fs.readFileSync(INPUT_FILE, "utf8");

// Each line: Name - steamUrl, dotabuffUrl
const lines = text.split(/\r?\n/).map(l => l.trim()).filter(Boolean);

function makeIdFromName(name) {
  return name
    .toLowerCase()
    .replace(/[^a-z0-9]+/gi, "_")
    .replace(/^_+|_+$/g, "");
}

function esc(str) {
  return str.replace(/\\/g, "\\\\").replace(/"/g, '\\"');
}

const playerObjects = [];

for (const line of lines) {
  // Split: Name - steamUrl, dotabuffUrl
  const [namePart, rest] = line.split(" - ");
  if (!rest) continue;

  const [steamUrlRaw, dotabuffUrlRaw] = rest.split(",").map(s => s.trim());

  const name = namePart.trim();
  const steamUrl = steamUrlRaw.trim();
  const dotabuffUrl = dotabuffUrlRaw.trim();

  const id = makeIdFromName(name);

  const obj = `  {
    id: "${esc(id)}",
    nickname: "${esc(name)}",
    realName: "",
    avatarUrl: "/avatars/default.jpg",
    seasonBadges: [],
    hasWonCup: false,

    laneLabel: "",
    laneIconSrc: "",

    currentMedalLabel: "",
    currentMedalId: "",
    peakMedalLabel: "",
    peakMedalId: "",

    bio: "",
    roles: [],

    steamUrl: "${esc(steamUrl)}",
    dotabuffUrl: "${esc(dotabuffUrl)}",
    favoriteHeroes: [],
  }`;

  playerObjects.push(obj);
}

// Build TS file content
const outputTs = `import { Player } from "./players";

export const playersFromLinks: Player[] = [
${playerObjects.join(",\n")}
];
`;

fs.writeFileSync(OUTPUT_FILE, outputTs);

console.log("✔ playersFromLinks.ts generated!");
console.log("➡ Saved to", OUTPUT_FILE);

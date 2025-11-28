// combineLinks.js
// Reads steamIds.js + Dotabuff.ts → outputs combinedLinks.js
// Format per line: Name - steamLink, dotabuffLink

import fs from "fs";

const STEAM_FILE = "steamIds.js";
const DOTABUFF_FILE = "Dotabuff.ts";
const OUTPUT_FILE = "combinedLinks.js";

// ---- Read files ----
const steamText = fs.readFileSync(STEAM_FILE, "utf8");
const dotabuffText = fs.readFileSync(DOTABUFF_FILE, "utf8");

// ---- Parse steamIds.js (Name - https://steamcommunity.com/profiles/...) ----
const steamByName = {};
const steamRegex =
  /([^\n-][^-\n]*?)\s*-\s*(https?:\/\/steamcommunity\.com\/profiles\/\d+)/g;

let match;

while ((match = steamRegex.exec(steamText)) !== null) {
  const name = match[1].trim();
  const steamUrl = match[2].trim();
  steamByName[name] = steamUrl;
}

// ---- Parse Dotabuff.ts (Name:"https://www.dotabuff.com/players/123", ...) ----
const dotabuffByName = {};
const dotabuffRegex =
  /"?([^":\n]+)"?\s*:\s*"https?:\/\/(?:www\.)?dotabuff\.com\/players\/\d+"/g;

while ((match = dotabuffRegex.exec(dotabuffText)) !== null) {
  const name = match[1].trim();
  const fullMatch = match[0];
  // extract the URL from the full match
  const urlMatch = fullMatch.match(/"(https?:\/\/(?:www\.)?dotabuff\.com\/players\/\d+)"/);
  if (!urlMatch) continue;
  const dotabuffUrl = urlMatch[1].trim();
  dotabuffByName[name] = dotabuffUrl;
}

// ---- Combine into one file ----
const outputLines = [];

for (const [name, steamUrl] of Object.entries(steamByName)) {
  const dotabuffUrl = dotabuffByName[name];
  if (!dotabuffUrl) {
    // If some names don't exist in Dotabuff.ts you can either skip or log:
    console.warn(`No Dotabuff link found for "${name}"`);
    continue;
  }
  outputLines.push(`${name} - ${steamUrl}, ${dotabuffUrl}`);
}

fs.writeFileSync(OUTPUT_FILE, outputLines.join("\n"));

console.log("✔ Combined links generated!");
console.log(`➡ Saved to ${OUTPUT_FILE}`);

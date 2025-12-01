// fillFavoriteHeroes.js
// Run with: node fillFavoriteHeroes.js
// Requires: "type": "module" in package.json

import { readFileSync, writeFileSync } from "fs";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// 👉 adjust this path if your players.ts is elsewhere
const PLAYERS_FILE_PATH = path.join(__dirname, "src","pages", "data", "players.ts");

const HERO_RENDER_BASE =
  "https://cdn.steamstatic.com/apps/dota2/videos/dota_react/heroes/renders";

// Slugs must match the .webm filenames: <slug>.webm
const HERO_SLUGS = [
  "abaddon",
  "alchemist",
  "ancient_apparition",
  "antimage",
  "arc_warden",
  "axe",
  "bane",
  "batrider",
  "beastmaster",
  "bloodseeker",
  "bounty_hunter",
  "brewmaster",
  "bristleback",
  "broodmother",
  "centaur",
  "chaos_knight",
  "chen",
  "clinkz",
  "clockwerk",
  "crystal_maiden",
  "dark_seer",
  "dark_willow",
  "dawnbreaker",
  "dazzle",
  "death_prophet",
  "disruptor",
  "doom_bringer",
  "dragon_knight",
  "drow_ranger",
  "earth_spirit",
  "earthshaker",
  "elder_titan",
  "ember_spirit",
  "enchantress",
  "enigma",
  "faceless_void",
  "grimstroke",
  "gyrocopter",
  "hoodwink",
  "huskar",
  "invoker",
  "jakiro",
  "juggernaut",
  "kunkka",
  "legion_commander",
  "leshrac",
  "lich",
  "life_stealer",
  "lina",
  "lion",
  "lone_druid",
  "luna",
  "lycan",
  "magnataur",
  "mars",
  "medusa",
  "meepo",
  "mirana",
  "monkey_king",
  "morphling",
  "naga_siren",
  "natures_prophet",
  "necrophos",
  "night_stalker",
  "nyx_assassin",
  "obsidian_destroyer",
  "ogre_magi",
  "omniknight",
  "oracle",
  "pangolier",
  "phantom_assassin",
  "phantom_lancer",
  "phoenix",
  "puck",
  "pudge",
  "pugna",
  "queenofpain",
  "razor",
  "riki",
  "ringmaster",
  "rubick",
  "sand_king",
  "shadow_demon",
  "shadow_fiend",
  "shadow_shaman",
  "silencer",
  "skywrath_mage",
  "slardar",
  "slark",
  "snapfire",
  "sniper",
  "spectre",
  "spirit_breaker",
  "storm_spirit",
  "sven",
  "templar_assassin",
  "terrorblade",
  "tidehunter",
  "tinker",
  "tiny",
  "treant",
  "troll_warlord",
  "tusk",
  "underlord",
  "undying",
  "ursa",
  "vengefulspirit",
  "venomancer",
  "viper",
  "visage",
  "void_spirit",
  "warlock",
  "weaver",
  "windrunner",
  "winter_wyvern",
  "wisp",
  "witch_doctor",
  "wraith_king",
  "zeus",
];

// turn "ancient_apparition" → "Ancient Apparition"
function toHeroName(slug) {
  return slug
    .split("_")
    .map((p) => p.charAt(0).toUpperCase() + p.slice(1))
    .join(" ");
}

// pick N random **distinct** heroes from HERO_SLUGS
function pickRandomHeroes(count) {
  const pool = [...HERO_SLUGS];
  const picked = [];
  for (let i = 0; i < count && pool.length > 0; i++) {
    const idx = Math.floor(Math.random() * pool.length);
    const slug = pool.splice(idx, 1)[0];
    picked.push({
      slug,
      name: toHeroName(slug),
      videoSrc: `${HERO_RENDER_BASE}/${slug}.webm`,
    });
  }
  return picked;
}

function main() {
  let content = readFileSync(PLAYERS_FILE_PATH, "utf8");

  // We expect each player has 'favoriteHeroes: [],'
  const FAVORITES_REGEX = /favoriteHeroes:\s*\[\s*\],/g;

  let matchCount = 0;

  content = content.replace(FAVORITES_REGEX, () => {
    matchCount++;
    const heroes = pickRandomHeroes(3); // ⬅️ 3 random heroes per player
    const lines = heroes
      .map(
        (h) =>
          `    { videoSrc: "${h.videoSrc}", name: "${h.name}" },`
      )
      .join("\n");

    return `favoriteHeroes: [\n${lines}\n  ],`;
  });

  writeFileSync(PLAYERS_FILE_PATH, content, "utf8");

  console.log(`✅ Updated ${matchCount} players in ${PLAYERS_FILE_PATH}`);
  if (matchCount === 0) {
    console.log(
      "⚠️ No 'favoriteHeroes: []' found. Make sure your players use that exact pattern."
    );
  }
}

main();

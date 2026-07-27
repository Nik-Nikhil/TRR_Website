// Dota 2 Heroes data with NPC video links
export interface DotaHero {
  id: string;
  name: string;
  videoSrc: string;
}

export const DOTA_HEROES: DotaHero[] = [
  // Strength Heroes
  { id: "abaddon", name: "Abaddon", videoSrc: "/Video/npc_dota_hero_abaddon.webm" },
  { id: "alchemist", name: "Alchemist", videoSrc: "/Video/npc_dota_hero_alchemist.webm" },
  { id: "axe", name: "Axe", videoSrc: "/Video/npc_dota_hero_axe.webm" },
  { id: "beastmaster", name: "Beastmaster", videoSrc: "/Video/npc_dota_hero_beastmaster.webm" },
  { id: "brewmaster", name: "Brewmaster", videoSrc: "/Video/npc_dota_hero_brewmaster.webm" },
  { id: "bristleback", name: "Bristleback", videoSrc: "/Video/npc_dota_hero_bristleback.webm" },
  { id: "centaur", name: "Centaur Warrunner", videoSrc: "/Video/npc_dota_hero_centaur.webm" },
  { id: "chaos_knight", name: "Chaos Knight", videoSrc: "/Video/npc_dota_hero_chaos_knight.webm" },
  { id: "clockwerk", name: "Clockwerk", videoSrc: "/Video/npc_dota_hero_rattletrap.webm" },
  { id: "dawnbreaker", name: "Dawnbreaker", videoSrc: "/Video/npc_dota_hero_dawnbreaker.webm" },
  { id: "doom", name: "Doom", videoSrc: "/Video/npc_dota_hero_doom_bringer.webm" },
  { id: "dragon_knight", name: "Dragon Knight", videoSrc: "/Video/npc_dota_hero_dragon_knight.webm" },
  { id: "earth_spirit", name: "Earth Spirit", videoSrc: "/Video/npc_dota_hero_earth_spirit.webm" },
  { id: "earthshaker", name: "Earthshaker", videoSrc: "/Video/npc_dota_hero_earthshaker.webm" },
  { id: "elder_titan", name: "Elder Titan", videoSrc: "/Video/npc_dota_hero_elder_titan.webm" },
  { id: "huskar", name: "Huskar", videoSrc: "/Video/npc_dota_hero_huskar.webm" },
  { id: "io", name: "Io", videoSrc: "/Video/npc_dota_hero_wisp.webm" },
  { id: "kunkka", name: "Kunkka", videoSrc: "/Video/npc_dota_hero_kunkka.webm" },
  { id: "legion_commander", name: "Legion Commander", videoSrc: "/Video/npc_dota_hero_legion_commander.webm" },
  { id: "lifestealer", name: "Lifestealer", videoSrc: "/Video/npc_dota_hero_life_stealer.webm" },
  { id: "magnus", name: "Magnus", videoSrc: "/Video/npc_dota_hero_magnataur.webm" },
  { id: "marci", name: "Marci", videoSrc: "/Video/npc_dota_hero_marci.webm" },
  { id: "mars", name: "Mars", videoSrc: "/Video/npc_dota_hero_mars.webm" },
  { id: "night_stalker", name: "Night Stalker", videoSrc: "/Video/npc_dota_hero_night_stalker.webm" },
  { id: "omniknight", name: "Omniknight", videoSrc: "/Video/npc_dota_hero_omniknight.webm" },
  { id: "phoenix", name: "Phoenix", videoSrc: "/Video/npc_dota_hero_phoenix.webm" },
  { id: "primal_beast", name: "Primal Beast", videoSrc: "/Video/npc_dota_hero_primal_beast.webm" },
  { id: "pudge", name: "Pudge", videoSrc: "/Video/npc_dota_hero_pudge.webm" },
  { id: "sand_king", name: "Sand King", videoSrc: "/Video/npc_dota_hero_sand_king.webm" },
  { id: "slardar", name: "Slardar", videoSrc: "/Video/npc_dota_hero_slardar.webm" },
  { id: "spirit_breaker", name: "Spirit Breaker", videoSrc: "/Video/npc_dota_hero_spirit_breaker.webm" },
  { id: "sven", name: "Sven", videoSrc: "/Video/npc_dota_hero_sven.webm" },
  { id: "tidehunter", name: "Tidehunter", videoSrc: "/Video/npc_dota_hero_tidehunter.webm" },
  { id: "timbersaw", name: "Timbersaw", videoSrc: "/Video/npc_dota_hero_shredder.webm" },
  { id: "tiny", name: "Tiny", videoSrc: "/Video/npc_dota_hero_tiny.webm" },
  { id: "treant", name: "Treant Protector", videoSrc: "/Video/npc_dota_hero_treant.webm" },
  { id: "tusk", name: "Tusk", videoSrc: "/Video/npc_dota_hero_tusk.webm" },
  { id: "underlord", name: "Underlord", videoSrc: "/Video/npc_dota_hero_abyssal_underlord.webm" },
  { id: "undying", name: "Undying", videoSrc: "/Video/npc_dota_hero_undying.webm" },
  { id: "wraith_king", name: "Wraith King", videoSrc: "/Video/npc_dota_hero_skeleton_king.webm" },

  // Agility Heroes
  { id: "anti_mage", name: "Anti-Mage", videoSrc: "/Video/npc_dota_hero_antimage.webm" },
  { id: "arc_warden", name: "Arc Warden", videoSrc: "/Video/npc_dota_hero_arc_warden.webm" },
  { id: "bloodseeker", name: "Bloodseeker", videoSrc: "/Video/npc_dota_hero_bloodseeker.webm" },
  { id: "bounty_hunter", name: "Bounty Hunter", videoSrc: "/Video/npc_dota_hero_bounty_hunter.webm" },
  { id: "broodmother", name: "Broodmother", videoSrc: "/Video/npc_dota_hero_broodmother.webm" },
  { id: "clinkz", name: "Clinkz", videoSrc: "/Video/npc_dota_hero_clinkz.webm" },
  { id: "drow_ranger", name: "Drow Ranger", videoSrc: "/Video/npc_dota_hero_drow_ranger.webm" },
  { id: "ember_spirit", name: "Ember Spirit", videoSrc: "/Video/npc_dota_hero_ember_spirit.webm" },
  { id: "faceless_void", name: "Faceless Void", videoSrc: "/Video/npc_dota_hero_faceless_void.webm" },
  { id: "gyrocopter", name: "Gyrocopter", videoSrc: "/Video/npc_dota_hero_gyrocopter.webm" },
  { id: "hoodwink", name: "Hoodwink", videoSrc: "/Video/npc_dota_hero_hoodwink.webm" },
  { id: "juggernaut", name: "Juggernaut", videoSrc: "/Video/npc_dota_hero_juggernaut.webm" },
  { id: "kez", name: "Kez", videoSrc: "/Video/npc_dota_hero_kez.webm" },
  { id: "lone_druid", name: "Lone Druid", videoSrc: "/Video/npc_dota_hero_lone_druid.webm" },
  { id: "luna", name: "Luna", videoSrc: "/Video/npc_dota_hero_luna.webm" },
  { id: "medusa", name: "Medusa", videoSrc: "/Video/npc_dota_hero_medusa.webm" },
  { id: "meepo", name: "Meepo", videoSrc: "/Video/npc_dota_hero_meepo.webm" },
  { id: "monkey_king", name: "Monkey King", videoSrc: "/Video/npc_dota_hero_monkey_king.webm" },
  { id: "morphling", name: "Morphling", videoSrc: "/Video/npc_dota_hero_morphling.webm" },
  { id: "naga_siren", name: "Naga Siren", videoSrc: "/Video/npc_dota_hero_naga_siren.webm" },
  { id: "nyx_assassin", name: "Nyx Assassin", videoSrc: "/Video/npc_dota_hero_nyx_assassin.webm" },
  { id: "pangolier", name: "Pangolier", videoSrc: "/Video/npc_dota_hero_pangolier.webm" },
  { id: "phantom_assassin", name: "Phantom Assassin", videoSrc: "/Video/npc_dota_hero_phantom_assassin.webm" },
  { id: "phantom_lancer", name: "Phantom Lancer", videoSrc: "/Video/npc_dota_hero_phantom_lancer.webm" },
  { id: "razor", name: "Razor", videoSrc: "/Video/npc_dota_hero_razor.webm" },
  { id: "riki", name: "Riki", videoSrc: "/Video/npc_dota_hero_riki.webm" },
  { id: "shadow_fiend", name: "Shadow Fiend", videoSrc: "/Video/npc_dota_hero_nevermore.webm" },
  { id: "slark", name: "Slark", videoSrc: "/Video/npc_dota_hero_slark.webm" },
  { id: "sniper", name: "Sniper", videoSrc: "/Video/npc_dota_hero_sniper.webm" },
  { id: "spectre", name: "Spectre", videoSrc: "/Video/npc_dota_hero_spectre.webm" },
  { id: "templar_assassin", name: "Templar Assassin", videoSrc: "/Video/npc_dota_hero_templar_assassin.webm" },
  { id: "terrorblade", name: "Terrorblade", videoSrc: "/Video/npc_dota_hero_terrorblade.webm" },
  { id: "troll_warlord", name: "Troll Warlord", videoSrc: "/Video/npc_dota_hero_troll_warlord.webm" },
  { id: "ursa", name: "Ursa", videoSrc: "/Video/npc_dota_hero_ursa.webm" },
  { id: "vengeful_spirit", name: "Vengeful Spirit", videoSrc: "/Video/npc_dota_hero_vengefulspirit.webm" },
  { id: "venomancer", name: "Venomancer", videoSrc: "/Video/npc_dota_hero_venomancer.webm" },
  { id: "viper", name: "Viper", videoSrc: "/Video/npc_dota_hero_viper.webm" },
  { id: "weaver", name: "Weaver", videoSrc: "/Video/npc_dota_hero_weaver.webm" },
  { id: "windranger", name: "Windranger", videoSrc: "/Video/npc_dota_hero_windrunner.webm" },

  // Intelligence Heroes
  { id: "ancient_apparition", name: "Ancient Apparition", videoSrc: "/Video/npc_dota_hero_ancient_apparition.webm" },
  { id: "bane", name: "Bane", videoSrc: "/Video/npc_dota_hero_bane.webm" },
  { id: "batrider", name: "Batrider", videoSrc: "/Video/npc_dota_hero_batrider.webm" },
  { id: "chen", name: "Chen", videoSrc: "/Video/npc_dota_hero_chen.webm" },
  { id: "crystal_maiden", name: "Crystal Maiden", videoSrc: "/Video/npc_dota_hero_crystal_maiden.webm" },
  { id: "dark_seer", name: "Dark Seer", videoSrc: "/Video/npc_dota_hero_dark_seer.webm" },
  { id: "dark_willow", name: "Dark Willow", videoSrc: "/Video/npc_dota_hero_dark_willow.webm" },
  { id: "dazzle", name: "Dazzle", videoSrc: "/Video/npc_dota_hero_dazzle.webm" },
  { id: "death_prophet", name: "Death Prophet", videoSrc: "/Video/npc_dota_hero_death_prophet.webm" },
  { id: "disruptor", name: "Disruptor", videoSrc: "/Video/npc_dota_hero_disruptor.webm" },
  { id: "enchantress", name: "Enchantress", videoSrc: "/Video/npc_dota_hero_enchantress.webm" },
  { id: "enigma", name: "Enigma", videoSrc: "/Video/npc_dota_hero_enigma.webm" },
  { id: "grimstroke", name: "Grimstroke", videoSrc: "/Video/npc_dota_hero_grimstroke.webm" },
  { id: "invoker", name: "Invoker", videoSrc: "/Video/npc_dota_hero_invoker.webm" },
  { id: "jakiro", name: "Jakiro", videoSrc: "/Video/npc_dota_hero_jakiro.webm" },
  { id: "keeper_of_the_light", name: "Keeper of the Light", videoSrc: "/Video/npc_dota_hero_keeper_of_the_light.webm" },
  { id: "leshrac", name: "Leshrac", videoSrc: "/Video/npc_dota_hero_leshrac.webm" },
  { id: "lich", name: "Lich", videoSrc: "/Video/npc_dota_hero_lich.webm" },
  { id: "lina", name: "Lina", videoSrc: "/Video/npc_dota_hero_lina.webm" },
  { id: "lion", name: "Lion", videoSrc: "/Video/npc_dota_hero_lion.webm" },
  { id: "muerta", name: "Muerta", videoSrc: "/Video/npc_dota_hero_muerta.webm" },
  { id: "nature_prophet", name: "Nature's Prophet", videoSrc: "/Video/npc_dota_hero_furion.webm" },
  { id: "necrophos", name: "Necrophos", videoSrc: "/Video/npc_dota_hero_necrolyte.webm" },
  { id: "ogre_magi", name: "Ogre Magi", videoSrc: "/Video/npc_dota_hero_ogre_magi.webm" },
  { id: "oracle", name: "Oracle", videoSrc: "/Video/npc_dota_hero_oracle.webm" },
  { id: "outworld_destroyer", name: "Outworld Destroyer", videoSrc: "/Video/npc_dota_hero_obsidian_destroyer.webm" },
  { id: "puck", name: "Puck", videoSrc: "/Video/npc_dota_hero_puck.webm" },
  { id: "pugna", name: "Pugna", videoSrc: "/Video/npc_dota_hero_pugna.webm" },
  { id: "queen_of_pain", name: "Queen of Pain", videoSrc: "/Video/npc_dota_hero_queenofpain.webm" },
  { id: "rubick", name: "Rubick", videoSrc: "/Video/npc_dota_hero_rubick.webm" },
  { id: "shadow_demon", name: "Shadow Demon", videoSrc: "/Video/npc_dota_hero_shadow_demon.webm" },
  { id: "shadow_shaman", name: "Shadow Shaman", videoSrc: "/Video/npc_dota_hero_shadow_shaman.webm" },
  { id: "silencer", name: "Silencer", videoSrc: "/Video/npc_dota_hero_silencer.webm" },
  { id: "skywrath_mage", name: "Skywrath Mage", videoSrc: "/Video/npc_dota_hero_skywrath_mage.webm" },
  { id: "storm_spirit", name: "Storm Spirit", videoSrc: "/Video/npc_dota_hero_storm_spirit.webm" },
  { id: "techies", name: "Techies", videoSrc: "/Video/npc_dota_hero_techies.webm" },
  { id: "tinker", name: "Tinker", videoSrc: "/Video/npc_dota_hero_tinker.webm" },
  { id: "visage", name: "Visage", videoSrc: "/Video/npc_dota_hero_visage.webm" },
  { id: "void_spirit", name: "Void Spirit", videoSrc: "/Video/npc_dota_hero_void_spirit.webm" },
  { id: "warlock", name: "Warlock", videoSrc: "/Video/npc_dota_hero_warlock.webm" },
  { id: "winter_wyvern", name: "Winter Wyvern", videoSrc: "/Video/npc_dota_hero_winter_wyvern.webm" },
  { id: "witch_doctor", name: "Witch Doctor", videoSrc: "/Video/npc_dota_hero_witch_doctor.webm" },
  { id: "zeus", name: "Zeus", videoSrc: "/Video/npc_dota_hero_zuus.webm" }
];

// Normalise a string for fuzzy matching: lowercase, strip hyphens/apostrophes/spaces
const normalise = (s: string) => s.toLowerCase().replace(/[-' ]/g, '');

// Helper function to find hero by name (case-insensitive, fuzzy)
export const findHeroByName = (name: string): DotaHero | undefined => {
  const n = normalise(name);
  return DOTA_HEROES.find(hero =>
    normalise(hero.name) === n ||
    normalise(hero.id) === n
  );
};

/**
 * Get the best available image URL for a hero name.
 * Derives the npc slug from the local videoSrc path when found,
 * which guarantees the correct Valve CDN key even for heroes with
 * irregular names (Anti-Mage → antimage, Wraith King → skeleton_king, etc.).
 */
export const getHeroImageUrl = (name: string): string => {
  const hero = findHeroByName(name);
  if (hero?.videoSrc) {
    // Extract slug: "/Video/npc_dota_hero_antimage.webm" → "antimage"
    const match = hero.videoSrc.match(/npc_dota_hero_([^.]+)\.webm/);
    if (match) {
      return `https://cdn.cloudflare.steamstatic.com/apps/dota2/images/dota_react/heroes/${match[1]}.png`;
    }
  }
  // Fallback: best-effort slug from the raw name
  const slug = name.toLowerCase().replace(/[' ]/g, '_').replace(/-/g, '_');
  return `https://cdn.cloudflare.steamstatic.com/apps/dota2/images/dota_react/heroes/${slug}.png`;
};

// Helper function to get all hero names for autocomplete
export const getAllHeroNames = (): string[] => {
  return DOTA_HEROES.map(hero => hero.name);
};
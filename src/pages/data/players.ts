
export interface PlayerRole {
  iconSrc: string;
  label: string;
}

export interface PlayerHero {
  videoSrc: string;
  name: string;
}

export type CupRank = "gold" | "silver" | "bronze";

export interface Player {
  id: string;
  nickname: string;
  realName?: string;
  avatarUrl: string;

  seasonBadges: number[];
  hasWonCup: boolean;

  
  cupRank?: CupRank;
  cupTooltip?: string;
  cupSeason?: number;



  
  currentMedalLabel: string;
  currentMedalId: string;
  peakMedalLabel: string;
  peakMedalId: string;

  bio: string;

  roles: PlayerRole[];
  steamUrl: string;
  dotabuffUrl: string;
  favoriteHeroes: PlayerHero[];

  
  
}

export const players: Player[] = [
  {
    id: "420",
    nickname: "420",
    realName: "",
    avatarUrl: "/avatars/default.jpg",
    seasonBadges: [],
    hasWonCup: false,

    
    

    currentMedalLabel: "",
    currentMedalId: "",
    peakMedalLabel: "",
    peakMedalId: "",

    bio: "",
    roles: [],

    steamUrl: "https://steamcommunity.com/profiles/76561198299655062",
    dotabuffUrl: "https://www.dotabuff.com/players/339389334",
    favoriteHeroes: [
    { videoSrc: "https://cdn.steamstatic.com/apps/dota2/videos/dota_react/heroes/renders/hoodwink.webm", name: "Hoodwink" },
    { videoSrc: "https://cdn.steamstatic.com/apps/dota2/videos/dota_react/heroes/renders/luna.webm", name: "Luna" },
    { videoSrc: "https://cdn.steamstatic.com/apps/dota2/videos/dota_react/heroes/renders/windrunner.webm", name: "Windrunner" },
  ],
  },
  {
    id: "reyuk",
    nickname: "Reyuk",
    realName: "",
    avatarUrl: "/avatars/ryuk.jpg",
    seasonBadges: [],
    hasWonCup: false,

    
    

    currentMedalLabel: "Legend 3",
    currentMedalId: "Legend_3",
    peakMedalLabel: "Ancient 3",
    peakMedalId: "Ancient_3",

    bio: "I plan everything… except my skills.",
    roles: [],

    steamUrl: "https://steamcommunity.com/profiles/76561198061964176",
    dotabuffUrl: "https://www.dotabuff.com/players/101698448",
    favoriteHeroes: [
    { videoSrc: "https://cdn.steamstatic.com/apps/dota2/videos/dota_react/heroes/renders/earth_spirit.webm", name: "Earth Spirit" },
    { videoSrc: "https://cdn.steamstatic.com/apps/dota2/videos/dota_react/heroes/renders/tusk.webm", name: "Tusk" },
    { videoSrc: "https://cdn.steamstatic.com/apps/dota2/videos/dota_react/heroes/renders/earthshaker.webm", name: "Earthshaker" },
  ],
  },
  {
    id: "rocker",
    nickname: "RockeR",
    realName: "",
    avatarUrl: "/avatars/default.jpg",
    seasonBadges: [],
    hasWonCup: false,

    
    

    currentMedalLabel: "",
    currentMedalId: "",
    peakMedalLabel: "",
    peakMedalId: "",

    bio: "",
    roles: [],

    steamUrl: "https://steamcommunity.com/profiles/76561198272726365",
    dotabuffUrl: "https://www.dotabuff.com/players/312460637",
    favoriteHeroes: [
    { videoSrc: "https://cdn.steamstatic.com/apps/dota2/videos/dota_react/heroes/renders/morphling.webm", name: "Morphling" },
    { videoSrc: "https://cdn.steamstatic.com/apps/dota2/videos/dota_react/heroes/renders/dawnbreaker.webm", name: "Dawnbreaker" },
    { videoSrc: "https://cdn.steamstatic.com/apps/dota2/videos/dota_react/heroes/renders/arc_warden.webm", name: "Arc Warden" },
  ],
  },
  {
    id: "narai",
    nickname: "Narai",
    realName: "",
    avatarUrl: "/avatars/default.jpg",
    seasonBadges: [],
    hasWonCup: false,

    
    

    currentMedalLabel: "",
    currentMedalId: "",
    peakMedalLabel: "",
    peakMedalId: "",

    bio: "",
    roles: [],

    steamUrl: "https://steamcommunity.com/profiles/76561198177703726",
    dotabuffUrl: "https://www.dotabuff.com/players/217437998",
    favoriteHeroes: [
    { videoSrc: "https://cdn.steamstatic.com/apps/dota2/videos/dota_react/heroes/renders/clockwerk.webm", name: "Clockwerk" },
    { videoSrc: "https://cdn.steamstatic.com/apps/dota2/videos/dota_react/heroes/renders/doom_bringer.webm", name: "Doom Bringer" },
    { videoSrc: "https://cdn.steamstatic.com/apps/dota2/videos/dota_react/heroes/renders/enigma.webm", name: "Enigma" },
  ],
  },
  {
    id: "hunt",
    nickname: "Hunt",
    realName: "",
    avatarUrl: "/avatars/default.jpg",
    seasonBadges: [],
    hasWonCup: false,

    
    

    currentMedalLabel: "",
    currentMedalId: "",
    peakMedalLabel: "",
    peakMedalId: "",

    bio: "",
    roles: [],

    steamUrl: "https://steamcommunity.com/profiles/76561198122176709",
    dotabuffUrl: "https://www.dotabuff.com/players/161910981",
    favoriteHeroes: [
    { videoSrc: "https://cdn.steamstatic.com/apps/dota2/videos/dota_react/heroes/renders/ursa.webm", name: "Ursa" },
    { videoSrc: "https://cdn.steamstatic.com/apps/dota2/videos/dota_react/heroes/renders/dawnbreaker.webm", name: "Dawnbreaker" },
    { videoSrc: "https://cdn.steamstatic.com/apps/dota2/videos/dota_react/heroes/renders/rubick.webm", name: "Rubick" },
  ],
  },
  {
    id: "clash",
    nickname: "CLASH",
    realName: "",
    avatarUrl: "/avatars/default.jpg",
    seasonBadges: [],
    hasWonCup: false,

    
    

    currentMedalLabel: "",
    currentMedalId: "",
    peakMedalLabel: "",
    peakMedalId: "",

    bio: "",
    roles: [],

    steamUrl: "https://steamcommunity.com/profiles/76561198141055827",
    dotabuffUrl: "https://www.dotabuff.com/players/180790099",
    favoriteHeroes: [
    { videoSrc: "https://cdn.steamstatic.com/apps/dota2/videos/dota_react/heroes/renders/medusa.webm", name: "Medusa" },
    { videoSrc: "https://cdn.steamstatic.com/apps/dota2/videos/dota_react/heroes/renders/huskar.webm", name: "Huskar" },
    { videoSrc: "https://cdn.steamstatic.com/apps/dota2/videos/dota_react/heroes/renders/magnataur.webm", name: "Magnataur" },
  ],
  },
  {
    id: "helm",
    nickname: "Helm",
    realName: "",
    avatarUrl: "/avatars/default.jpg",
    seasonBadges: [],
    hasWonCup: false,

    
    

    currentMedalLabel: "",
    currentMedalId: "",
    peakMedalLabel: "",
    peakMedalId: "",

    bio: "",
    roles: [],

    steamUrl: "https://steamcommunity.com/profiles/76561198047021603",
    dotabuffUrl: "https://www.dotabuff.com/players/86755875",
    favoriteHeroes: [
    { videoSrc: "https://cdn.steamstatic.com/apps/dota2/videos/dota_react/heroes/renders/faceless_void.webm", name: "Faceless Void" },
    { videoSrc: "https://cdn.steamstatic.com/apps/dota2/videos/dota_react/heroes/renders/bristleback.webm", name: "Bristleback" },
    { videoSrc: "https://cdn.steamstatic.com/apps/dota2/videos/dota_react/heroes/renders/pangolier.webm", name: "Pangolier" },
  ],
  },
  {
    id: "toby",
    nickname: "Toby",
    realName: "",
    avatarUrl: "/avatars/default.jpg",
    seasonBadges: [],
    hasWonCup: false,

    
    

    currentMedalLabel: "",
    currentMedalId: "",
    peakMedalLabel: "",
    peakMedalId: "",

    bio: "",
    roles: [],

    steamUrl: "https://steamcommunity.com/profiles/76561198139217830",
    dotabuffUrl: "https://www.dotabuff.com/players/178952102",
    favoriteHeroes: [
    { videoSrc: "https://cdn.steamstatic.com/apps/dota2/videos/dota_react/heroes/renders/batrider.webm", name: "Batrider" },
    { videoSrc: "https://cdn.steamstatic.com/apps/dota2/videos/dota_react/heroes/renders/spirit_breaker.webm", name: "Spirit Breaker" },
    { videoSrc: "https://cdn.steamstatic.com/apps/dota2/videos/dota_react/heroes/renders/clockwerk.webm", name: "Clockwerk" },
  ],
  },
  {
    id: "predator",
    nickname: "PREDATOR",
    realName: "",
    avatarUrl: "/avatars/default.jpg",
    seasonBadges: [],
    hasWonCup: false,

    
    

    currentMedalLabel: "",
    currentMedalId: "",
    peakMedalLabel: "",
    peakMedalId: "",

    bio: "",
    roles: [],

    steamUrl: "https://steamcommunity.com/profiles/76561198057754211",
    dotabuffUrl: "https://www.dotabuff.com/players/97488483",
    favoriteHeroes: [
    { videoSrc: "https://cdn.steamstatic.com/apps/dota2/videos/dota_react/heroes/renders/slardar.webm", name: "Slardar" },
    { videoSrc: "https://cdn.steamstatic.com/apps/dota2/videos/dota_react/heroes/renders/viper.webm", name: "Viper" },
    { videoSrc: "https://cdn.steamstatic.com/apps/dota2/videos/dota_react/heroes/renders/shadow_shaman.webm", name: "Shadow Shaman" },
  ],
  },
  {
    id: "ravi",
    nickname: "Ravi",
    realName: "",
    avatarUrl: "/avatars/default.jpg",
    seasonBadges: [],
    hasWonCup: false,

    
    

    currentMedalLabel: "",
    currentMedalId: "",
    peakMedalLabel: "",
    peakMedalId: "",

    bio: "",
    roles: [],

    steamUrl: "https://steamcommunity.com/profiles/76561198039806173",
    dotabuffUrl: "https://www.dotabuff.com/players/79540445",
    favoriteHeroes: [
    { videoSrc: "https://cdn.steamstatic.com/apps/dota2/videos/dota_react/heroes/renders/gyrocopter.webm", name: "Gyrocopter" },
    { videoSrc: "https://cdn.steamstatic.com/apps/dota2/videos/dota_react/heroes/renders/bounty_hunter.webm", name: "Bounty Hunter" },
    { videoSrc: "https://cdn.steamstatic.com/apps/dota2/videos/dota_react/heroes/renders/huskar.webm", name: "Huskar" },
  ],
  },
  {
    id: "kolly",
    nickname: "Kolly",
    realName: "",
    avatarUrl: "/avatars/default.jpg",
    seasonBadges: [],
    hasWonCup: false,

    
    

    currentMedalLabel: "",
    currentMedalId: "",
    peakMedalLabel: "",
    peakMedalId: "",

    bio: "",
    roles: [],

    steamUrl: "https://steamcommunity.com/profiles/76561198214458432",
    dotabuffUrl: "https://www.dotabuff.com/players/254192704",
    favoriteHeroes: [
    { videoSrc: "https://cdn.steamstatic.com/apps/dota2/videos/dota_react/heroes/renders/enchantress.webm", name: "Enchantress" },
    { videoSrc: "https://cdn.steamstatic.com/apps/dota2/videos/dota_react/heroes/renders/viper.webm", name: "Viper" },
    { videoSrc: "https://cdn.steamstatic.com/apps/dota2/videos/dota_react/heroes/renders/riki.webm", name: "Riki" },
  ],
  },
  {
    id: "server",
    nickname: "Server",
    realName: "",
    avatarUrl: "/avatars/default.jpg",
    seasonBadges: [],
    hasWonCup: false,

    
    

    currentMedalLabel: "",
    currentMedalId: "",
    peakMedalLabel: "",
    peakMedalId: "",

    bio: "",
    roles: [],

    steamUrl: "https://steamcommunity.com/profiles/76561198377149072",
    dotabuffUrl: "https://www.dotabuff.com/players/416883344",
    favoriteHeroes: [
    { videoSrc: "https://cdn.steamstatic.com/apps/dota2/videos/dota_react/heroes/renders/puck.webm", name: "Puck" },
    { videoSrc: "https://cdn.steamstatic.com/apps/dota2/videos/dota_react/heroes/renders/bristleback.webm", name: "Bristleback" },
    { videoSrc: "https://cdn.steamstatic.com/apps/dota2/videos/dota_react/heroes/renders/spectre.webm", name: "Spectre" },
  ],
  },
  {
    id: "phola",
    nickname: "Phola",
    realName: "",
    avatarUrl: "/avatars/default.jpg",
    seasonBadges: [],
    hasWonCup: false,

    
    

    currentMedalLabel: "",
    currentMedalId: "",
    peakMedalLabel: "",
    peakMedalId: "",

    bio: "",
    roles: [],

    steamUrl: "https://steamcommunity.com/profiles/76561198116763261",
    dotabuffUrl: "https://www.dotabuff.com/players/156497533",
    favoriteHeroes: [
    { videoSrc: "https://cdn.steamstatic.com/apps/dota2/videos/dota_react/heroes/renders/treant.webm", name: "Treant" },
    { videoSrc: "https://cdn.steamstatic.com/apps/dota2/videos/dota_react/heroes/renders/kunkka.webm", name: "Kunkka" },
    { videoSrc: "https://cdn.steamstatic.com/apps/dota2/videos/dota_react/heroes/renders/natures_prophet.webm", name: "Natures Prophet" },
  ],
  },
  {
    id: "madara",
    nickname: "MaDaRa",
    realName: "",
    avatarUrl: "/avatars/default.jpg",
    seasonBadges: [],
    hasWonCup: false,

    
    

    currentMedalLabel: "",
    currentMedalId: "",
    peakMedalLabel: "",
    peakMedalId: "",

    bio: "",
    roles: [],

    steamUrl: "https://steamcommunity.com/profiles/76561198333362035",
    dotabuffUrl: "https://www.dotabuff.com/players/373096307",
    favoriteHeroes: [
    { videoSrc: "https://cdn.steamstatic.com/apps/dota2/videos/dota_react/heroes/renders/storm_spirit.webm", name: "Storm Spirit" },
    { videoSrc: "https://cdn.steamstatic.com/apps/dota2/videos/dota_react/heroes/renders/luna.webm", name: "Luna" },
    { videoSrc: "https://cdn.steamstatic.com/apps/dota2/videos/dota_react/heroes/renders/pudge.webm", name: "Pudge" },
  ],
  },
  {
    id: "machine",
    nickname: "Machine",
    realName: "",
    avatarUrl: "/avatars/Machine.png",
    seasonBadges: [1,5],
    hasWonCup: false,

    
    

    currentMedalLabel: "",
    currentMedalId: "",
    peakMedalLabel: "",
    peakMedalId: "",

    bio: "",
    roles: [],

    steamUrl: "https://steamcommunity.com/profiles/76561198294895700",
    dotabuffUrl: "https://www.dotabuff.com/players/334629972",
    favoriteHeroes: [
    { videoSrc: "https://cdn.steamstatic.com/apps/dota2/videos/dota_react/heroes/renders/tinker.webm", name: "Tinker" },
    { videoSrc: "https://cdn.steamstatic.com/apps/dota2/videos/dota_react/heroes/renders/crystal_maiden.webm", name: "Crystal Maiden" },
    { videoSrc: "https://cdn.steamstatic.com/apps/dota2/videos/dota_react/heroes/renders/bounty_hunter.webm", name: "Bounty Hunter" },
  ],
  },
  {
    id: "mvrk",
    nickname: "MVRK",
    realName: "",
    avatarUrl: "/avatars/default.jpg",
    seasonBadges: [],
    hasWonCup: false,

    
    

    currentMedalLabel: "",
    currentMedalId: "",
    peakMedalLabel: "",
    peakMedalId: "",

    bio: "",
    roles: [],

    steamUrl: "https://steamcommunity.com/profiles/76561199071132593",
    dotabuffUrl: "https://www.dotabuff.com/players/1110866865",
    favoriteHeroes: [
    { videoSrc: "https://cdn.steamstatic.com/apps/dota2/videos/dota_react/heroes/renders/visage.webm", name: "Visage" },
    { videoSrc: "https://cdn.steamstatic.com/apps/dota2/videos/dota_react/heroes/renders/sand_king.webm", name: "Sand King" },
    { videoSrc: "https://cdn.steamstatic.com/apps/dota2/videos/dota_react/heroes/renders/lion.webm", name: "Lion" },
  ],
  },
  {
    id: "irox",
    nickname: "Irox",
    realName: "",
    avatarUrl: "/avatars/default.jpg",
    seasonBadges: [],
    hasWonCup: false,

    
    

    currentMedalLabel: "",
    currentMedalId: "",
    peakMedalLabel: "",
    peakMedalId: "",

    bio: "",
    roles: [],

    steamUrl: "https://steamcommunity.com/profiles/76561198087793594",
    dotabuffUrl: "https://www.dotabuff.com/players/127527866",
    favoriteHeroes: [
    { videoSrc: "https://cdn.steamstatic.com/apps/dota2/videos/dota_react/heroes/renders/weaver.webm", name: "Weaver" },
    { videoSrc: "https://cdn.steamstatic.com/apps/dota2/videos/dota_react/heroes/renders/naga_siren.webm", name: "Naga Siren" },
    { videoSrc: "https://cdn.steamstatic.com/apps/dota2/videos/dota_react/heroes/renders/monkey_king.webm", name: "Monkey King" },
  ],
  },
  {
    id: "slappy",
    nickname: "Slappy",
    realName: "",
    avatarUrl: "/avatars/default.jpg",
    seasonBadges: [],
    hasWonCup: false,

    
    

    currentMedalLabel: "",
    currentMedalId: "",
    peakMedalLabel: "",
    peakMedalId: "",

    bio: "",
    roles: [],

    steamUrl: "https://steamcommunity.com/profiles/76561198047673400",
    dotabuffUrl: "https://www.dotabuff.com/players/87407672",
    favoriteHeroes: [
    { videoSrc: "https://cdn.steamstatic.com/apps/dota2/videos/dota_react/heroes/renders/earthshaker.webm", name: "Earthshaker" },
    { videoSrc: "https://cdn.steamstatic.com/apps/dota2/videos/dota_react/heroes/renders/razor.webm", name: "Razor" },
    { videoSrc: "https://cdn.steamstatic.com/apps/dota2/videos/dota_react/heroes/renders/naga_siren.webm", name: "Naga Siren" },
  ],
  },
  {
    id: "atomic",
    nickname: "Atomic",
    realName: "",
    avatarUrl: "/avatars/default.jpg",
    seasonBadges: [],
    hasWonCup: false,

    
    

    currentMedalLabel: "",
    currentMedalId: "",
    peakMedalLabel: "",
    peakMedalId: "",

    bio: "",
    roles: [],

    steamUrl: "https://steamcommunity.com/profiles/76561198418600526",
    dotabuffUrl: "https://www.dotabuff.com/players/458334798",
    favoriteHeroes: [
    { videoSrc: "https://cdn.steamstatic.com/apps/dota2/videos/dota_react/heroes/renders/medusa.webm", name: "Medusa" },
    { videoSrc: "https://cdn.steamstatic.com/apps/dota2/videos/dota_react/heroes/renders/underlord.webm", name: "Underlord" },
    { videoSrc: "https://cdn.steamstatic.com/apps/dota2/videos/dota_react/heroes/renders/dark_willow.webm", name: "Dark Willow" },
  ],
  },
  {
    id: "r3ciprocal",
    nickname: "r3ciprocal",
    realName: "",
    avatarUrl: "/avatars/default.jpg",
    seasonBadges: [],
    hasWonCup: false,

    
    

    currentMedalLabel: "Divine 4",
    currentMedalId: "Divine_4",
    peakMedalLabel: "Immortal",
    peakMedalId: "Immortal",

    bio: "",
    roles: [],

    steamUrl: "https://steamcommunity.com/profiles/76561198280446664",
    dotabuffUrl: "https://www.dotabuff.com/players/320180936",
    favoriteHeroes: [
    { videoSrc: "https://cdn.steamstatic.com/apps/dota2/videos/dota_react/heroes/renders/spirit_breaker.webm", name: "Spirit Breaker" },
    { videoSrc: "https://cdn.steamstatic.com/apps/dota2/videos/dota_react/heroes/renders/antimage.webm", name: "Antimage" },
    { videoSrc: "https://cdn.steamstatic.com/apps/dota2/videos/dota_react/heroes/renders/monkey_king.webm", name: "Monkey King" },
  ],
  },
  {
    id: "abbhy",
    nickname: "abbhY",
    realName: "",
    avatarUrl: "/avatars/default.jpg",
    seasonBadges: [],
    hasWonCup: false,

    
    

    currentMedalLabel: "",
    currentMedalId: "",
    peakMedalLabel: "",
    peakMedalId: "",

    bio: "",
    roles: [],

    steamUrl: "https://steamcommunity.com/profiles/76561199546434168",
    dotabuffUrl: "https://www.dotabuff.com/players/1586168440",
    favoriteHeroes: [
    { videoSrc: "https://cdn.steamstatic.com/apps/dota2/videos/dota_react/heroes/renders/skywrath_mage.webm", name: "Skywrath Mage" },
    { videoSrc: "https://cdn.steamstatic.com/apps/dota2/videos/dota_react/heroes/renders/grimstroke.webm", name: "Grimstroke" },
    { videoSrc: "https://cdn.steamstatic.com/apps/dota2/videos/dota_react/heroes/renders/legion_commander.webm", name: "Legion Commander" },
  ],
  },
  {
    id: "masara",
    nickname: "Masara",
    realName: "",
    avatarUrl: "/avatars/default.jpg",
    seasonBadges: [],
    hasWonCup: false,

    
    

    currentMedalLabel: "",
    currentMedalId: "",
    peakMedalLabel: "",
    peakMedalId: "",

    bio: "",
    roles: [],

    steamUrl: "https://steamcommunity.com/profiles/76561198298688769",
    dotabuffUrl: "https://www.dotabuff.com/players/338423041",
    favoriteHeroes: [
    { videoSrc: "https://cdn.steamstatic.com/apps/dota2/videos/dota_react/heroes/renders/omniknight.webm", name: "Omniknight" },
    { videoSrc: "https://cdn.steamstatic.com/apps/dota2/videos/dota_react/heroes/renders/nyx_assassin.webm", name: "Nyx Assassin" },
    { videoSrc: "https://cdn.steamstatic.com/apps/dota2/videos/dota_react/heroes/renders/dragon_knight.webm", name: "Dragon Knight" },
  ],
  },
  {
    id: "irene",
    nickname: "Irene",
    realName: "",
    avatarUrl: "/avatars/Irene.jpg",
    seasonBadges: [2,4,5],
    hasWonCup: true,
    cupRank: "silver",
    cupTooltip: "2nd place — Season 2",
    cupSeason: 2,


  

    

    currentMedalLabel: "Divine 3",
    currentMedalId: "Divine_3",
    peakMedalLabel: "Immortal",
    peakMedalId: "Immortal",

    bio: "",
    roles: [{ iconSrc: "/icons/pos_4.png", label: "Soft Support" }, { iconSrc: "/icons/pos_5.png", label: "Hard Support" },],

    steamUrl: "https://steamcommunity.com/profiles/76561199007245235",
    dotabuffUrl: "https://www.dotabuff.com/players/1046979507",
    favoriteHeroes: [{ videoSrc: "https://cdn.steamstatic.com/apps/dota2/videos/dota_react/heroes/renders/lich.webm", name: "Lich" },
    { videoSrc: "https://cdn.steamstatic.com/apps/dota2/videos/dota_react/heroes/renders/disruptor.webm", name: "Disruptor" },
    { videoSrc: "https://cdn.steamstatic.com/apps/dota2/videos/dota_react/heroes/renders/abaddon.webm", name: "Abaddon" },]
  },
  
   {
    id: "nikhil",
    nickname: "Nikhil",
    realName: "",
    avatarUrl: "/avatars/Nikhil.jpg",
    seasonBadges: [1,5],
    hasWonCup: false,

    
    

    currentMedalLabel: "Legend 4",
    currentMedalId: "Legend_4",
    peakMedalLabel: "Ancient 5",
    peakMedalId: "Ancient_5",

    bio: "Trying to do better !!",
    roles:  [{ iconSrc: "/icons/pos_1.png", label: "Carry" },],

    steamUrl: "https://steamcommunity.com/profiles/76561198246001148",
    dotabuffUrl: "https://www.dotabuff.com/players/285735420",
    favoriteHeroes: [
    { videoSrc: "https://cdn.steamstatic.com/apps/dota2/videos/dota_react/heroes/renders/terrorblade.webm", name: "Terrorblade" },
    { videoSrc: "https://cdn.steamstatic.com/apps/dota2/videos/dota_react/heroes/renders/antimage.webm", name: "Anti Mage" },
    { videoSrc: "https://cdn.steamstatic.com/apps/dota2/videos/dota_react/heroes/renders/juggernaut.webm", name: "Juggernaut" },
  ],
  },
  {
    id: "banner",
    nickname: "Banner",
    realName: "",
    avatarUrl: "/avatars/Banner.jpg",
    seasonBadges: [],
    hasWonCup: false,

    
    

    currentMedalLabel: "",
    currentMedalId: "",
    peakMedalLabel: "",
    peakMedalId: "",

    bio: "",
    roles: [],

    steamUrl: "https://steamcommunity.com/profiles/76561198193880361",
    dotabuffUrl: "https://www.dotabuff.com/players/233614633",
    favoriteHeroes: [
    { videoSrc: "https://cdn.steamstatic.com/apps/dota2/videos/dota_react/heroes/renders/antimage.webm", name: "Antimage" },
    { videoSrc: "https://cdn.steamstatic.com/apps/dota2/videos/dota_react/heroes/renders/sniper.webm", name: "Sniper" },
    { videoSrc: "https://cdn.steamstatic.com/apps/dota2/videos/dota_react/heroes/renders/jakiro.webm", name: "Jakiro" },
  ],
  },
  {
    id: "lordimpaler",
    nickname: "LordImpaler",
    realName: "",
    avatarUrl: "/avatars/default.jpg",
    seasonBadges: [],
    hasWonCup: false,

    
    

    currentMedalLabel: "",
    currentMedalId: "",
    peakMedalLabel: "",
    peakMedalId: "",

    bio: "",
    roles: [],

    steamUrl: "https://steamcommunity.com/profiles/76561198030818634",
    dotabuffUrl: "https://www.dotabuff.com/players/70552906",
    favoriteHeroes: [
    { videoSrc: "https://cdn.steamstatic.com/apps/dota2/videos/dota_react/heroes/renders/clockwerk.webm", name: "Clockwerk" },
    { videoSrc: "https://cdn.steamstatic.com/apps/dota2/videos/dota_react/heroes/renders/legion_commander.webm", name: "Legion Commander" },
    { videoSrc: "https://cdn.steamstatic.com/apps/dota2/videos/dota_react/heroes/renders/antimage.webm", name: "Antimage" },
  ],
  },
  {
    id: "skyie",
    nickname: "Skyie@",
    realName: "",
    avatarUrl: "/avatars/default.jpg",
    seasonBadges: [],
    hasWonCup: false,

    
    

    currentMedalLabel: "",
    currentMedalId: "",
    peakMedalLabel: "",
    peakMedalId: "",

    bio: "",
    roles: [],

    steamUrl: "https://steamcommunity.com/profiles/76561199803435912",
    dotabuffUrl: "https://www.dotabuff.com/players/1843170184",
    favoriteHeroes: [
    { videoSrc: "https://cdn.steamstatic.com/apps/dota2/videos/dota_react/heroes/renders/invoker.webm", name: "Invoker" },
    { videoSrc: "https://cdn.steamstatic.com/apps/dota2/videos/dota_react/heroes/renders/tinker.webm", name: "Tinker" },
    { videoSrc: "https://cdn.steamstatic.com/apps/dota2/videos/dota_react/heroes/renders/abaddon.webm", name: "Abaddon" },
  ],
  },
  {
    id: "godspeed",
    nickname: "Godspeed",
    realName: "",
    avatarUrl: "/avatars/default.jpg",
    seasonBadges: [1,5],
    hasWonCup: true,
    cupRank: "gold",
    cupTooltip: "1st place — Season 1",
    cupSeason: 1,



    
    

    currentMedalLabel: "",
    currentMedalId: "",
    peakMedalLabel: "",
    peakMedalId: "",

    bio: "",
    roles: [],

    steamUrl: "https://steamcommunity.com/profiles/76561198077736471",
    dotabuffUrl: "https://www.dotabuff.com/players/117470743",
    favoriteHeroes: [
    { videoSrc: "https://cdn.steamstatic.com/apps/dota2/videos/dota_react/heroes/renders/phoenix.webm", name: "Phoenix" },
    { videoSrc: "https://cdn.steamstatic.com/apps/dota2/videos/dota_react/heroes/renders/spectre.webm", name: "Spectre" },
    { videoSrc: "https://cdn.steamstatic.com/apps/dota2/videos/dota_react/heroes/renders/vengefulspirit.webm", name: "Vengefulspirit" },
  ],
  },
  {
    id: "grimm",
    nickname: "GRIMM",
    realName: "",
    avatarUrl: "/avatars/default.jpg",
    seasonBadges: [],
    hasWonCup: false,

    
    

    currentMedalLabel: "",
    currentMedalId: "",
    peakMedalLabel: "",
    peakMedalId: "",

    bio: "",
    roles: [],

    steamUrl: "https://steamcommunity.com/profiles/76561198303987817",
    dotabuffUrl: "https://www.dotabuff.com/players/343722089",
    favoriteHeroes: [
    { videoSrc: "https://cdn.steamstatic.com/apps/dota2/videos/dota_react/heroes/renders/spectre.webm", name: "Spectre" },
    { videoSrc: "https://cdn.steamstatic.com/apps/dota2/videos/dota_react/heroes/renders/lion.webm", name: "Lion" },
    { videoSrc: "https://cdn.steamstatic.com/apps/dota2/videos/dota_react/heroes/renders/dazzle.webm", name: "Dazzle" },
  ],
  },
  {
    id: "deathshadow",
    nickname: "DeathShadow",
    realName: "",
    avatarUrl: "/avatars/default.jpg",
    seasonBadges: [],
    hasWonCup: false,

    
    

    currentMedalLabel: "",
    currentMedalId: "",
    peakMedalLabel: "",
    peakMedalId: "",

    bio: "",
    roles: [],

    steamUrl: "https://steamcommunity.com/profiles/76561199737857315",
    dotabuffUrl: "https://www.dotabuff.com/players/1777591587",
    favoriteHeroes: [
    { videoSrc: "https://cdn.steamstatic.com/apps/dota2/videos/dota_react/heroes/renders/wisp.webm", name: "Wisp" },
    { videoSrc: "https://cdn.steamstatic.com/apps/dota2/videos/dota_react/heroes/renders/lion.webm", name: "Lion" },
    { videoSrc: "https://cdn.steamstatic.com/apps/dota2/videos/dota_react/heroes/renders/lich.webm", name: "Lich" },
  ],
  },
  {
    id: "insanekid08",
    nickname: "Insanekid08",
    realName: "",
    avatarUrl: "/avatars/default.jpg",
    seasonBadges: [],
    hasWonCup: false,

    
    

    currentMedalLabel: "",
    currentMedalId: "",
    peakMedalLabel: "",
    peakMedalId: "",

    bio: "",
    roles: [],

    steamUrl: "https://steamcommunity.com/profiles/76561198075302524",
    dotabuffUrl: "https://www.dotabuff.com/players/115036796",
    favoriteHeroes: [
    { videoSrc: "https://cdn.steamstatic.com/apps/dota2/videos/dota_react/heroes/renders/naga_siren.webm", name: "Naga Siren" },
    { videoSrc: "https://cdn.steamstatic.com/apps/dota2/videos/dota_react/heroes/renders/lich.webm", name: "Lich" },
    { videoSrc: "https://cdn.steamstatic.com/apps/dota2/videos/dota_react/heroes/renders/slardar.webm", name: "Slardar" },
  ],
  },
  {
    id: "bazinga",
    nickname: "Bazinga",
    realName: "",
    avatarUrl: "/avatars/default.jpg",
    seasonBadges: [],
    hasWonCup: false,

    
    

    currentMedalLabel: "",
    currentMedalId: "",
    peakMedalLabel: "",
    peakMedalId: "",

    bio: "",
    roles: [],

    steamUrl: "https://steamcommunity.com/profiles/76561198135084070",
    dotabuffUrl: "https://www.dotabuff.com/players/174818342",
    favoriteHeroes: [
    { videoSrc: "https://cdn.steamstatic.com/apps/dota2/videos/dota_react/heroes/renders/obsidian_destroyer.webm", name: "Obsidian Destroyer" },
    { videoSrc: "https://cdn.steamstatic.com/apps/dota2/videos/dota_react/heroes/renders/bristleback.webm", name: "Bristleback" },
    { videoSrc: "https://cdn.steamstatic.com/apps/dota2/videos/dota_react/heroes/renders/shadow_shaman.webm", name: "Shadow Shaman" },
  ],
  },
  {
    id: "aaron",
    nickname: "AaRoN",
    realName: "",
    avatarUrl: "/avatars/default.jpg",
    seasonBadges: [],
    hasWonCup: false,

    
    

    currentMedalLabel: "",
    currentMedalId: "",
    peakMedalLabel: "",
    peakMedalId: "",

    bio: "",
    roles: [],

    steamUrl: "https://steamcommunity.com/profiles/76561198363809308",
    dotabuffUrl: "https://www.dotabuff.com/players/403543580",
    favoriteHeroes: [
    { videoSrc: "https://cdn.steamstatic.com/apps/dota2/videos/dota_react/heroes/renders/abaddon.webm", name: "Abaddon" },
    { videoSrc: "https://cdn.steamstatic.com/apps/dota2/videos/dota_react/heroes/renders/terrorblade.webm", name: "Terrorblade" },
    { videoSrc: "https://cdn.steamstatic.com/apps/dota2/videos/dota_react/heroes/renders/broodmother.webm", name: "Broodmother" },
  ],
  },
  {
    id: "bolt",
    nickname: "Bolt",
    realName: "",
    avatarUrl: "/avatars/default.jpg",
    seasonBadges: [],
    hasWonCup: false,

    
    

    currentMedalLabel: "",
    currentMedalId: "",
    peakMedalLabel: "",
    peakMedalId: "",

    bio: "",
    roles: [],

    steamUrl: "https://steamcommunity.com/profiles/76561198158623147",
    dotabuffUrl: "https://www.dotabuff.com/players/198357419",
    favoriteHeroes: [
    { videoSrc: "https://cdn.steamstatic.com/apps/dota2/videos/dota_react/heroes/renders/earthshaker.webm", name: "Earthshaker" },
    { videoSrc: "https://cdn.steamstatic.com/apps/dota2/videos/dota_react/heroes/renders/natures_prophet.webm", name: "Natures Prophet" },
    { videoSrc: "https://cdn.steamstatic.com/apps/dota2/videos/dota_react/heroes/renders/silencer.webm", name: "Silencer" },
  ],
  },
  {
    id: "billy",
    nickname: "Billy",
    realName: "",
    avatarUrl: "/avatars/default.jpg",
    seasonBadges: [],
    hasWonCup: false,

    
    

    currentMedalLabel: "",
    currentMedalId: "",
    peakMedalLabel: "",
    peakMedalId: "",

    bio: "",
    roles: [],

    steamUrl: "https://steamcommunity.com/profiles/76561198289049436",
    dotabuffUrl: "https://www.dotabuff.com/players/328783708",
    favoriteHeroes: [
    { videoSrc: "https://cdn.steamstatic.com/apps/dota2/videos/dota_react/heroes/renders/leshrac.webm", name: "Leshrac" },
    { videoSrc: "https://cdn.steamstatic.com/apps/dota2/videos/dota_react/heroes/renders/clinkz.webm", name: "Clinkz" },
    { videoSrc: "https://cdn.steamstatic.com/apps/dota2/videos/dota_react/heroes/renders/undying.webm", name: "Undying" },
  ],
  },
  {
    id: "storm4",
    nickname: "STORM4",
    realName: "",
    avatarUrl: "/avatars/default.jpg",
    seasonBadges: [],
    hasWonCup: false,

    
    

    currentMedalLabel: "",
    currentMedalId: "",
    peakMedalLabel: "",
    peakMedalId: "",

    bio: "",
    roles: [],

    steamUrl: "https://steamcommunity.com/profiles/76561198123145404",
    dotabuffUrl: "https://www.dotabuff.com/players/162879676",
    favoriteHeroes: [
    { videoSrc: "https://cdn.steamstatic.com/apps/dota2/videos/dota_react/heroes/renders/troll_warlord.webm", name: "Troll Warlord" },
    { videoSrc: "https://cdn.steamstatic.com/apps/dota2/videos/dota_react/heroes/renders/axe.webm", name: "Axe" },
    { videoSrc: "https://cdn.steamstatic.com/apps/dota2/videos/dota_react/heroes/renders/winter_wyvern.webm", name: "Winter Wyvern" },
  ],
  },
  {
    id: "nabeel",
    nickname: "Nabeel",
    realName: "",
    avatarUrl: "/avatars/default.jpg",
    seasonBadges: [],
    hasWonCup: false,

    
    

    currentMedalLabel: "",
    currentMedalId: "",
    peakMedalLabel: "",
    peakMedalId: "",

    bio: "",
    roles: [],

    steamUrl: "https://steamcommunity.com/profiles/76561198148067974",
    dotabuffUrl: "https://www.dotabuff.com/players/187802246",
    favoriteHeroes: [
    { videoSrc: "https://cdn.steamstatic.com/apps/dota2/videos/dota_react/heroes/renders/dragon_knight.webm", name: "Dragon Knight" },
    { videoSrc: "https://cdn.steamstatic.com/apps/dota2/videos/dota_react/heroes/renders/lich.webm", name: "Lich" },
    { videoSrc: "https://cdn.steamstatic.com/apps/dota2/videos/dota_react/heroes/renders/bounty_hunter.webm", name: "Bounty Hunter" },
  ],
  },
  {
    id: "sovan",
    nickname: "Sovan",
    realName: "",
    avatarUrl: "/avatars/default.jpg",
    seasonBadges: [],
    hasWonCup: false,

    
    

    currentMedalLabel: "",
    currentMedalId: "",
    peakMedalLabel: "",
    peakMedalId: "",

    bio: "",
    roles: [],

    steamUrl: "https://steamcommunity.com/profiles/76561198219971485",
    dotabuffUrl: "https://www.dotabuff.com/players/259705757",
    favoriteHeroes: [
    { videoSrc: "https://cdn.steamstatic.com/apps/dota2/videos/dota_react/heroes/renders/lion.webm", name: "Lion" },
    { videoSrc: "https://cdn.steamstatic.com/apps/dota2/videos/dota_react/heroes/renders/bane.webm", name: "Bane" },
    { videoSrc: "https://cdn.steamstatic.com/apps/dota2/videos/dota_react/heroes/renders/luna.webm", name: "Luna" },
  ],
  },
  {
    id: "maliketh",
    nickname: "Maliketh",
    realName: "",
    avatarUrl: "/avatars/default.jpg",
    seasonBadges: [],
    hasWonCup: false,

    
    

    currentMedalLabel: "",
    currentMedalId: "",
    peakMedalLabel: "",
    peakMedalId: "",

    bio: "",
    roles: [],

    steamUrl: "https://steamcommunity.com/profiles/76561198307989935",
    dotabuffUrl: "https://www.dotabuff.com/players/347724207",
    favoriteHeroes: [
    { videoSrc: "https://cdn.steamstatic.com/apps/dota2/videos/dota_react/heroes/renders/huskar.webm", name: "Huskar" },
    { videoSrc: "https://cdn.steamstatic.com/apps/dota2/videos/dota_react/heroes/renders/oracle.webm", name: "Oracle" },
    { videoSrc: "https://cdn.steamstatic.com/apps/dota2/videos/dota_react/heroes/renders/bane.webm", name: "Bane" },
  ],
  },
  {
    id: "akash",
    nickname: "Akash",
    realName: "",
    avatarUrl: "/avatars/default.jpg",
    seasonBadges: [],
    hasWonCup: false,

    
    

    currentMedalLabel: "",
    currentMedalId: "",
    peakMedalLabel: "",
    peakMedalId: "",

    bio: "",
    roles: [],

    steamUrl: "https://steamcommunity.com/profiles/76561198137707439",
    dotabuffUrl: "https://www.dotabuff.com/players/177441711",
    favoriteHeroes: [
    { videoSrc: "https://cdn.steamstatic.com/apps/dota2/videos/dota_react/heroes/renders/brewmaster.webm", name: "Brewmaster" },
    { videoSrc: "https://cdn.steamstatic.com/apps/dota2/videos/dota_react/heroes/renders/jakiro.webm", name: "Jakiro" },
    { videoSrc: "https://cdn.steamstatic.com/apps/dota2/videos/dota_react/heroes/renders/slark.webm", name: "Slark" },
  ],
  },
  {
    id: "mslayer",
    nickname: "MSlayer",
    realName: "",
    avatarUrl: "/avatars/default.jpg",
    seasonBadges: [],
    hasWonCup: false,

    
    

    currentMedalLabel: "",
    currentMedalId: "",
    peakMedalLabel: "",
    peakMedalId: "",

    bio: "",
    roles: [],

    steamUrl: "https://steamcommunity.com/profiles/76561197992169501",
    dotabuffUrl: "https://www.dotabuff.com/players/31903773",
    favoriteHeroes: [
    { videoSrc: "https://cdn.steamstatic.com/apps/dota2/videos/dota_react/heroes/renders/ringmaster.webm", name: "Ringmaster" },
    { videoSrc: "https://cdn.steamstatic.com/apps/dota2/videos/dota_react/heroes/renders/lina.webm", name: "Lina" },
    { videoSrc: "https://cdn.steamstatic.com/apps/dota2/videos/dota_react/heroes/renders/life_stealer.webm", name: "Life Stealer" },
  ],
  },
  {
    id: "master_instinct",
    nickname: "Master Instinct",
    realName: "",
    avatarUrl: "/avatars/default.jpg",
    seasonBadges: [],
    hasWonCup: false,

    
    

    currentMedalLabel: "",
    currentMedalId: "",
    peakMedalLabel: "",
    peakMedalId: "",

    bio: "",
    roles: [],

    steamUrl: "https://steamcommunity.com/profiles/76561198124876950",
    dotabuffUrl: "https://www.dotabuff.com/players/164611222",
    favoriteHeroes: [
    { videoSrc: "https://cdn.steamstatic.com/apps/dota2/videos/dota_react/heroes/renders/mars.webm", name: "Mars" },
    { videoSrc: "https://cdn.steamstatic.com/apps/dota2/videos/dota_react/heroes/renders/sniper.webm", name: "Sniper" },
    { videoSrc: "https://cdn.steamstatic.com/apps/dota2/videos/dota_react/heroes/renders/abaddon.webm", name: "Abaddon" },
  ],
  },
  {
    id: "arindam7",
    nickname: "Arindam7",
    realName: "",
    avatarUrl: "/avatars/default.jpg",
    seasonBadges: [],
    hasWonCup: false,

    
    

    currentMedalLabel: "",
    currentMedalId: "",
    peakMedalLabel: "",
    peakMedalId: "",

    bio: "",
    roles: [],

    steamUrl: "https://steamcommunity.com/profiles/76561198144311979",
    dotabuffUrl: "https://www.dotabuff.com/players/184046251",
    favoriteHeroes: [
    { videoSrc: "https://cdn.steamstatic.com/apps/dota2/videos/dota_react/heroes/renders/chaos_knight.webm", name: "Chaos Knight" },
    { videoSrc: "https://cdn.steamstatic.com/apps/dota2/videos/dota_react/heroes/renders/phoenix.webm", name: "Phoenix" },
    { videoSrc: "https://cdn.steamstatic.com/apps/dota2/videos/dota_react/heroes/renders/nyx_assassin.webm", name: "Nyx Assassin" },
  ],
  },
  {
    id: "farhan",
    nickname: "Farhan",
    realName: "",
    avatarUrl: "/avatars/default.jpg",
    seasonBadges: [],
    hasWonCup: false,

    
    

    currentMedalLabel: "",
    currentMedalId: "",
    peakMedalLabel: "",
    peakMedalId: "",

    bio: "",
    roles: [],

    steamUrl: "https://steamcommunity.com/profiles/76561198179995037",
    dotabuffUrl: "https://www.dotabuff.com/players/219729309",
    favoriteHeroes: [
    { videoSrc: "https://cdn.steamstatic.com/apps/dota2/videos/dota_react/heroes/renders/tusk.webm", name: "Tusk" },
    { videoSrc: "https://cdn.steamstatic.com/apps/dota2/videos/dota_react/heroes/renders/ringmaster.webm", name: "Ringmaster" },
    { videoSrc: "https://cdn.steamstatic.com/apps/dota2/videos/dota_react/heroes/renders/queenofpain.webm", name: "Queenofpain" },
  ],
  },
  {
    id: "noob_ca",
    nickname: "Noob CA",
    realName: "",
    avatarUrl: "/avatars/default.jpg",
    seasonBadges: [],
    hasWonCup: false,

    
    

    currentMedalLabel: "",
    currentMedalId: "",
    peakMedalLabel: "",
    peakMedalId: "",

    bio: "",
    roles: [],

    steamUrl: "https://steamcommunity.com/profiles/76561198078264270",
    dotabuffUrl: "https://www.dotabuff.com/players/117998542",
    favoriteHeroes: [
    { videoSrc: "https://cdn.steamstatic.com/apps/dota2/videos/dota_react/heroes/renders/bloodseeker.webm", name: "Bloodseeker" },
    { videoSrc: "https://cdn.steamstatic.com/apps/dota2/videos/dota_react/heroes/renders/gyrocopter.webm", name: "Gyrocopter" },
    { videoSrc: "https://cdn.steamstatic.com/apps/dota2/videos/dota_react/heroes/renders/oracle.webm", name: "Oracle" },
  ],
  },
  {
    id: "guts",
    nickname: "Guts",
    realName: "",
    avatarUrl: "/avatars/default.jpg",
    seasonBadges: [],
    hasWonCup: false,

    
    

    currentMedalLabel: "",
    currentMedalId: "",
    peakMedalLabel: "",
    peakMedalId: "",

    bio: "",
    roles: [],

    steamUrl: "https://steamcommunity.com/profiles/76561198152763516",
    dotabuffUrl: "https://www.dotabuff.com/players/192497788",
    favoriteHeroes: [
    { videoSrc: "https://cdn.steamstatic.com/apps/dota2/videos/dota_react/heroes/renders/bristleback.webm", name: "Bristleback" },
    { videoSrc: "https://cdn.steamstatic.com/apps/dota2/videos/dota_react/heroes/renders/doom_bringer.webm", name: "Doom Bringer" },
    { videoSrc: "https://cdn.steamstatic.com/apps/dota2/videos/dota_react/heroes/renders/shadow_fiend.webm", name: "Shadow Fiend" },
  ],
  },
  {
    id: "madlad",
    nickname: "Madlad",
    realName: "",
    avatarUrl: "/avatars/default.jpg",
    seasonBadges: [],
    hasWonCup: false,

    
    

    currentMedalLabel: "",
    currentMedalId: "",
    peakMedalLabel: "",
    peakMedalId: "",

    bio: "",
    roles: [],

    steamUrl: "https://steamcommunity.com/profiles/76561198066677527",
    dotabuffUrl: "https://www.dotabuff.com/players/106411799",
    favoriteHeroes: [
    { videoSrc: "https://cdn.steamstatic.com/apps/dota2/videos/dota_react/heroes/renders/slark.webm", name: "Slark" },
    { videoSrc: "https://cdn.steamstatic.com/apps/dota2/videos/dota_react/heroes/renders/wisp.webm", name: "Wisp" },
    { videoSrc: "https://cdn.steamstatic.com/apps/dota2/videos/dota_react/heroes/renders/queenofpain.webm", name: "Queenofpain" },
  ],
  },
  {
    id: "voodoo",
    nickname: "Voodoo",
    realName: "",
    avatarUrl: "/avatars/default.jpg",
    seasonBadges: [],
    hasWonCup: false,

    
    

    currentMedalLabel: "",
    currentMedalId: "",
    peakMedalLabel: "",
    peakMedalId: "",

    bio: "",
    roles: [],

    steamUrl: "https://steamcommunity.com/profiles/76561199060779081",
    dotabuffUrl: "https://www.dotabuff.com/players/1100513353",
    favoriteHeroes: [
    { videoSrc: "https://cdn.steamstatic.com/apps/dota2/videos/dota_react/heroes/renders/chen.webm", name: "Chen" },
    { videoSrc: "https://cdn.steamstatic.com/apps/dota2/videos/dota_react/heroes/renders/magnataur.webm", name: "Magnataur" },
    { videoSrc: "https://cdn.steamstatic.com/apps/dota2/videos/dota_react/heroes/renders/enigma.webm", name: "Enigma" },
  ],
  },
  {
    id: "ali_gm_y",
    nickname: "Ali Gm'Y",
    realName: "",
    avatarUrl: "/avatars/default.jpg",
    seasonBadges: [],
    hasWonCup: false,

    
    

    currentMedalLabel: "",
    currentMedalId: "",
    peakMedalLabel: "",
    peakMedalId: "",

    bio: "",
    roles: [],

    steamUrl: "https://steamcommunity.com/profiles/76561198121456422",
    dotabuffUrl: "https://www.dotabuff.com/players/161190694",
    favoriteHeroes: [
    { videoSrc: "https://cdn.steamstatic.com/apps/dota2/videos/dota_react/heroes/renders/pugna.webm", name: "Pugna" },
    { videoSrc: "https://cdn.steamstatic.com/apps/dota2/videos/dota_react/heroes/renders/pangolier.webm", name: "Pangolier" },
    { videoSrc: "https://cdn.steamstatic.com/apps/dota2/videos/dota_react/heroes/renders/abaddon.webm", name: "Abaddon" },
  ],
  },
  {
    id: "zromep",
    nickname: "zRomep",
    realName: "",
    avatarUrl: "/avatars/default.jpg",
    seasonBadges: [],
    hasWonCup: false,

    
    

    currentMedalLabel: "",
    currentMedalId: "",
    peakMedalLabel: "",
    peakMedalId: "",

    bio: "",
    roles: [],

    steamUrl: "https://steamcommunity.com/profiles/76561198377531695",
    dotabuffUrl: "https://www.dotabuff.com/players/417265967",
    favoriteHeroes: [
    { videoSrc: "https://cdn.steamstatic.com/apps/dota2/videos/dota_react/heroes/renders/oracle.webm", name: "Oracle" },
    { videoSrc: "https://cdn.steamstatic.com/apps/dota2/videos/dota_react/heroes/renders/beastmaster.webm", name: "Beastmaster" },
    { videoSrc: "https://cdn.steamstatic.com/apps/dota2/videos/dota_react/heroes/renders/dark_willow.webm", name: "Dark Willow" },
  ],
  },
  {
    id: "shiro",
    nickname: "Shiro",
    realName: "",
    avatarUrl: "/avatars/default.jpg",
    seasonBadges: [],
    hasWonCup: false,

    
    

    currentMedalLabel: "",
    currentMedalId: "",
    peakMedalLabel: "",
    peakMedalId: "",

    bio: "",
    roles: [],

    steamUrl: "https://steamcommunity.com/profiles/76561198091918772",
    dotabuffUrl: "https://www.dotabuff.com/players/131653044",
    favoriteHeroes: [
    { videoSrc: "https://cdn.steamstatic.com/apps/dota2/videos/dota_react/heroes/renders/lone_druid.webm", name: "Lone Druid" },
    { videoSrc: "https://cdn.steamstatic.com/apps/dota2/videos/dota_react/heroes/renders/kunkka.webm", name: "Kunkka" },
    { videoSrc: "https://cdn.steamstatic.com/apps/dota2/videos/dota_react/heroes/renders/antimage.webm", name: "Antimage" },
  ],
  },
  {
    id: "tukiyem",
    nickname: "Tukiyem",
    realName: "",
    avatarUrl: "/avatars/default.jpg",
    seasonBadges: [],
    hasWonCup: false,

    
    

    currentMedalLabel: "",
    currentMedalId: "",
    peakMedalLabel: "",
    peakMedalId: "",

    bio: "",
    roles: [],

    steamUrl: "https://steamcommunity.com/profiles/76561198150642808",
    dotabuffUrl: "https://www.dotabuff.com/players/190377080",
    favoriteHeroes: [
    { videoSrc: "https://cdn.steamstatic.com/apps/dota2/videos/dota_react/heroes/renders/skywrath_mage.webm", name: "Skywrath Mage" },
    { videoSrc: "https://cdn.steamstatic.com/apps/dota2/videos/dota_react/heroes/renders/invoker.webm", name: "Invoker" },
    { videoSrc: "https://cdn.steamstatic.com/apps/dota2/videos/dota_react/heroes/renders/rubick.webm", name: "Rubick" },
  ],
  },
  {
    id: "shezdbest",
    nickname: "shezdbest",
    realName: "",
    avatarUrl: "/avatars/default.jpg",
    seasonBadges: [],
    hasWonCup: false,

    
    

    currentMedalLabel: "",
    currentMedalId: "",
    peakMedalLabel: "",
    peakMedalId: "",

    bio: "",
    roles: [],

    steamUrl: "https://steamcommunity.com/profiles/76561198068033271",
    dotabuffUrl: "https://www.dotabuff.com/players/107767543",
    favoriteHeroes: [
    { videoSrc: "https://cdn.steamstatic.com/apps/dota2/videos/dota_react/heroes/renders/oracle.webm", name: "Oracle" },
    { videoSrc: "https://cdn.steamstatic.com/apps/dota2/videos/dota_react/heroes/renders/elder_titan.webm", name: "Elder Titan" },
    { videoSrc: "https://cdn.steamstatic.com/apps/dota2/videos/dota_react/heroes/renders/arc_warden.webm", name: "Arc Warden" },
  ],
  },
  {
    id: "prime_one",
    nickname: "Prime.One",
    realName: "",
    avatarUrl: "/avatars/default.jpg",
    seasonBadges: [],
    hasWonCup: false,

    
    

    currentMedalLabel: "",
    currentMedalId: "",
    peakMedalLabel: "",
    peakMedalId: "",

    bio: "",
    roles: [],

    steamUrl: "https://steamcommunity.com/profiles/76561198117759496",
    dotabuffUrl: "http://dotabuff.com/players/157493768",
    favoriteHeroes: [
    { videoSrc: "https://cdn.steamstatic.com/apps/dota2/videos/dota_react/heroes/renders/sniper.webm", name: "Sniper" },
    { videoSrc: "https://cdn.steamstatic.com/apps/dota2/videos/dota_react/heroes/renders/phoenix.webm", name: "Phoenix" },
    { videoSrc: "https://cdn.steamstatic.com/apps/dota2/videos/dota_react/heroes/renders/earthshaker.webm", name: "Earthshaker" },
  ],
  },
  {
    id: "sherlocked",
    nickname: "Sherlocked",
    realName: "",
    avatarUrl: "/avatars/default.jpg",
    seasonBadges: [],
    hasWonCup: false,

    
    

    currentMedalLabel: "",
    currentMedalId: "",
    peakMedalLabel: "",
    peakMedalId: "",

    bio: "",
    roles: [],

    steamUrl: "https://steamcommunity.com/profiles/76561198326213024",
    dotabuffUrl: "https://www.dotabuff.com/players/365947296",
    favoriteHeroes: [
    { videoSrc: "https://cdn.steamstatic.com/apps/dota2/videos/dota_react/heroes/renders/beastmaster.webm", name: "Beastmaster" },
    { videoSrc: "https://cdn.steamstatic.com/apps/dota2/videos/dota_react/heroes/renders/kunkka.webm", name: "Kunkka" },
    { videoSrc: "https://cdn.steamstatic.com/apps/dota2/videos/dota_react/heroes/renders/morphling.webm", name: "Morphling" },
  ],
  },
  {
    id: "tundra_goku",
    nickname: "Tundra.Goku",
    realName: "",
    avatarUrl: "/avatars/default.jpg",
    seasonBadges: [],
    hasWonCup: false,

    
    

    currentMedalLabel: "",
    currentMedalId: "",
    peakMedalLabel: "",
    peakMedalId: "",

    bio: "",
    roles: [],

    steamUrl: "https://steamcommunity.com/profiles/76561198069201259",
    dotabuffUrl: "https://www.dotabuff.com/players/108935531",
    favoriteHeroes: [
    { videoSrc: "https://cdn.steamstatic.com/apps/dota2/videos/dota_react/heroes/renders/lion.webm", name: "Lion" },
    { videoSrc: "https://cdn.steamstatic.com/apps/dota2/videos/dota_react/heroes/renders/silencer.webm", name: "Silencer" },
    { videoSrc: "https://cdn.steamstatic.com/apps/dota2/videos/dota_react/heroes/renders/omniknight.webm", name: "Omniknight" },
  ],
  },
  {
    id: "scripter",
    nickname: "ScripTeR",
    realName: "",
    avatarUrl: "/avatars/default.jpg",
    seasonBadges: [],
    hasWonCup: false,

    
    

    currentMedalLabel: "",
    currentMedalId: "",
    peakMedalLabel: "",
    peakMedalId: "",

    bio: "",
    roles: [],

    steamUrl: "https://steamcommunity.com/profiles/76561198414536121",
    dotabuffUrl: "https://www.dotabuff.com/players/454270393",
    favoriteHeroes: [
    { videoSrc: "https://cdn.steamstatic.com/apps/dota2/videos/dota_react/heroes/renders/templar_assassin.webm", name: "Templar Assassin" },
    { videoSrc: "https://cdn.steamstatic.com/apps/dota2/videos/dota_react/heroes/renders/vengefulspirit.webm", name: "Vengefulspirit" },
    { videoSrc: "https://cdn.steamstatic.com/apps/dota2/videos/dota_react/heroes/renders/kunkka.webm", name: "Kunkka" },
  ],
  },
  {
    id: "dragoneye",
    nickname: "DRAGONEYE",
    realName: "",
    avatarUrl: "/avatars/default.jpg",
    seasonBadges: [],
    hasWonCup: false,

    
    

    currentMedalLabel: "",
    currentMedalId: "",
    peakMedalLabel: "",
    peakMedalId: "",

    bio: "",
    roles: [],

    steamUrl: "https://steamcommunity.com/profiles/76561198398712064",
    dotabuffUrl: "https://www.dotabuff.com/players/438446336",
    favoriteHeroes: [
    { videoSrc: "https://cdn.steamstatic.com/apps/dota2/videos/dota_react/heroes/renders/tidehunter.webm", name: "Tidehunter" },
    { videoSrc: "https://cdn.steamstatic.com/apps/dota2/videos/dota_react/heroes/renders/visage.webm", name: "Visage" },
    { videoSrc: "https://cdn.steamstatic.com/apps/dota2/videos/dota_react/heroes/renders/lone_druid.webm", name: "Lone Druid" },
  ],
  },
  {
    id: "sphere",
    nickname: "Sphere",
    realName: "",
    avatarUrl: "/avatars/default.jpg",
    seasonBadges: [],
    hasWonCup: false,

    
    

    currentMedalLabel: "",
    currentMedalId: "",
    peakMedalLabel: "",
    peakMedalId: "",

    bio: "",
    roles: [],

    steamUrl: "https://steamcommunity.com/profiles/76561199029628836",
    dotabuffUrl: "https://www.dotabuff.com/players/1069363108",
    favoriteHeroes: [
    { videoSrc: "https://cdn.steamstatic.com/apps/dota2/videos/dota_react/heroes/renders/huskar.webm", name: "Huskar" },
    { videoSrc: "https://cdn.steamstatic.com/apps/dota2/videos/dota_react/heroes/renders/antimage.webm", name: "Antimage" },
    { videoSrc: "https://cdn.steamstatic.com/apps/dota2/videos/dota_react/heroes/renders/centaur.webm", name: "Centaur" },
  ],
  },
  {
    id: "gxnova",
    nickname: "gxnova",
    realName: "",
    avatarUrl: "/avatars/default.jpg",
    seasonBadges: [],
    hasWonCup: false,

    
    

    currentMedalLabel: "",
    currentMedalId: "",
    peakMedalLabel: "",
    peakMedalId: "",

    bio: "",
    roles: [],

    steamUrl: "https://steamcommunity.com/profiles/76561198137806863",
    dotabuffUrl: "https://www.dotabuff.com/players/177541135",
    favoriteHeroes: [
    { videoSrc: "https://cdn.steamstatic.com/apps/dota2/videos/dota_react/heroes/renders/bane.webm", name: "Bane" },
    { videoSrc: "https://cdn.steamstatic.com/apps/dota2/videos/dota_react/heroes/renders/leshrac.webm", name: "Leshrac" },
    { videoSrc: "https://cdn.steamstatic.com/apps/dota2/videos/dota_react/heroes/renders/lycan.webm", name: "Lycan" },
  ],
  },
  {
    id: "position_0",
    nickname: "Position 0",
    realName: "",
    avatarUrl: "/avatars/default.jpg",
    seasonBadges: [],
    hasWonCup: false,

    
    

    currentMedalLabel: "",
    currentMedalId: "",
    peakMedalLabel: "",
    peakMedalId: "",

    bio: "",
    roles: [],

    steamUrl: "https://steamcommunity.com/profiles/76561198403148919",
    dotabuffUrl: "https://www.dotabuff.com/players/442883191",
    favoriteHeroes: [
    { videoSrc: "https://cdn.steamstatic.com/apps/dota2/videos/dota_react/heroes/renders/weaver.webm", name: "Weaver" },
    { videoSrc: "https://cdn.steamstatic.com/apps/dota2/videos/dota_react/heroes/renders/lone_druid.webm", name: "Lone Druid" },
    { videoSrc: "https://cdn.steamstatic.com/apps/dota2/videos/dota_react/heroes/renders/antimage.webm", name: "Antimage" },
  ],
  },
  {
    id: "ryujin",
    nickname: "Ryujin",
    realName: "",
    avatarUrl: "/avatars/default.jpg",
    seasonBadges: [],
    hasWonCup: false,

    
    

    currentMedalLabel: "",
    currentMedalId: "",
    peakMedalLabel: "",
    peakMedalId: "",

    bio: "",
    roles: [],

    steamUrl: "https://steamcommunity.com/profiles/76561198325778330",
    dotabuffUrl: "https://www.dotabuff.com/players/365512602",
    favoriteHeroes: [
    { videoSrc: "https://cdn.steamstatic.com/apps/dota2/videos/dota_react/heroes/renders/abaddon.webm", name: "Abaddon" },
    { videoSrc: "https://cdn.steamstatic.com/apps/dota2/videos/dota_react/heroes/renders/terrorblade.webm", name: "Terrorblade" },
    { videoSrc: "https://cdn.steamstatic.com/apps/dota2/videos/dota_react/heroes/renders/dazzle.webm", name: "Dazzle" },
  ],
  },
  {
    id: "dk",
    nickname: "DK",
    realName: "",
    avatarUrl: "/avatars/default.jpg",
    seasonBadges: [],
    hasWonCup: false,

    
    

    currentMedalLabel: "",
    currentMedalId: "",
    peakMedalLabel: "",
    peakMedalId: "",

    bio: "",
    roles: [],

    steamUrl: "https://steamcommunity.com/profiles/76561198331138863",
    dotabuffUrl: "https://www.dotabuff.com/players/370873135",
    favoriteHeroes: [
    { videoSrc: "https://cdn.steamstatic.com/apps/dota2/videos/dota_react/heroes/renders/batrider.webm", name: "Batrider" },
    { videoSrc: "https://cdn.steamstatic.com/apps/dota2/videos/dota_react/heroes/renders/bane.webm", name: "Bane" },
    { videoSrc: "https://cdn.steamstatic.com/apps/dota2/videos/dota_react/heroes/renders/axe.webm", name: "Axe" },
  ],
  },
  {
    id: "lanson",
    nickname: "Lanson",
    realName: "",
    avatarUrl: "/avatars/default.jpg",
    seasonBadges: [],
    hasWonCup: false,

    
    

    currentMedalLabel: "",
    currentMedalId: "",
    peakMedalLabel: "",
    peakMedalId: "",

    bio: "",
    roles: [],

    steamUrl: "https://steamcommunity.com/profiles/76561198198688573",
    dotabuffUrl: "https://www.dotabuff.com/players/238422845",
    favoriteHeroes: [
    { videoSrc: "https://cdn.steamstatic.com/apps/dota2/videos/dota_react/heroes/renders/jakiro.webm", name: "Jakiro" },
    { videoSrc: "https://cdn.steamstatic.com/apps/dota2/videos/dota_react/heroes/renders/enchantress.webm", name: "Enchantress" },
    { videoSrc: "https://cdn.steamstatic.com/apps/dota2/videos/dota_react/heroes/renders/silencer.webm", name: "Silencer" },
  ],
  },
  {
    id: "jin_x_ed",
    nickname: "Jin[X]eD",
    realName: "",
    avatarUrl: "/avatars/default.jpg",
    seasonBadges: [],
    hasWonCup: false,

    
    

    currentMedalLabel: "",
    currentMedalId: "",
    peakMedalLabel: "",
    peakMedalId: "",

    bio: "",
    roles: [],

    steamUrl: "https://steamcommunity.com/profiles/76561198113414132",
    dotabuffUrl: "https://www.dotabuff.com/players/153148404",
    favoriteHeroes: [
    { videoSrc: "https://cdn.steamstatic.com/apps/dota2/videos/dota_react/heroes/renders/ringmaster.webm", name: "Ringmaster" },
    { videoSrc: "https://cdn.steamstatic.com/apps/dota2/videos/dota_react/heroes/renders/enchantress.webm", name: "Enchantress" },
    { videoSrc: "https://cdn.steamstatic.com/apps/dota2/videos/dota_react/heroes/renders/legion_commander.webm", name: "Legion Commander" },
  ],
  },
  {
    id: "fyt",
    nickname: "Fyt",
    realName: "",
    avatarUrl: "/avatars/default.jpg",
    seasonBadges: [],
    hasWonCup: false,

    
    

    currentMedalLabel: "",
    currentMedalId: "",
    peakMedalLabel: "",
    peakMedalId: "",

    bio: "",
    roles: [],

    steamUrl: "https://steamcommunity.com/profiles/76561198076789562",
    dotabuffUrl: "https://www.dotabuff.com/players/116523834",
    favoriteHeroes: [
    { videoSrc: "https://cdn.steamstatic.com/apps/dota2/videos/dota_react/heroes/renders/wisp.webm", name: "Wisp" },
    { videoSrc: "https://cdn.steamstatic.com/apps/dota2/videos/dota_react/heroes/renders/earth_spirit.webm", name: "Earth Spirit" },
    { videoSrc: "https://cdn.steamstatic.com/apps/dota2/videos/dota_react/heroes/renders/necrophos.webm", name: "Necrophos" },
  ],
  },
  {
    id: "flamy",
    nickname: "Flamy",
    realName: "",
    avatarUrl: "/avatars/default.jpg",
    seasonBadges: [],
    hasWonCup: false,

    
    

    currentMedalLabel: "",
    currentMedalId: "",
    peakMedalLabel: "",
    peakMedalId: "",

    bio: "",
    roles: [],

    steamUrl: "https://steamcommunity.com/profiles/76561198347230210",
    dotabuffUrl: "https://www.dotabuff.com/players/386964482",
    favoriteHeroes: [
    { videoSrc: "https://cdn.steamstatic.com/apps/dota2/videos/dota_react/heroes/renders/axe.webm", name: "Axe" },
    { videoSrc: "https://cdn.steamstatic.com/apps/dota2/videos/dota_react/heroes/renders/chaos_knight.webm", name: "Chaos Knight" },
    { videoSrc: "https://cdn.steamstatic.com/apps/dota2/videos/dota_react/heroes/renders/tiny.webm", name: "Tiny" },
  ],
  },
  {
    id: "lyrrad",
    nickname: "LYRRAD",
    realName: "",
    avatarUrl: "/avatars/default.jpg",
    seasonBadges: [],
    hasWonCup: false,

    
    

    currentMedalLabel: "",
    currentMedalId: "",
    peakMedalLabel: "",
    peakMedalId: "",

    bio: "",
    roles: [],

    steamUrl: "https://steamcommunity.com/profiles/76561198070813383",
    dotabuffUrl: "https://www.dotabuff.com/players/110547655",
    favoriteHeroes: [
    { videoSrc: "https://cdn.steamstatic.com/apps/dota2/videos/dota_react/heroes/renders/sven.webm", name: "Sven" },
    { videoSrc: "https://cdn.steamstatic.com/apps/dota2/videos/dota_react/heroes/renders/brewmaster.webm", name: "Brewmaster" },
    { videoSrc: "https://cdn.steamstatic.com/apps/dota2/videos/dota_react/heroes/renders/winter_wyvern.webm", name: "Winter Wyvern" },
  ],
  },
  {
    id: "hakuna_matata",
    nickname: "hakuna_matata",
    realName: "",
    avatarUrl: "/avatars/default.jpg",
    seasonBadges: [],
    hasWonCup: false,

    
    

    currentMedalLabel: "",
    currentMedalId: "",
    peakMedalLabel: "",
    peakMedalId: "",

    bio: "",
    roles: [],

    steamUrl: "https://steamcommunity.com/profiles/76561197989269842",
    dotabuffUrl: "https://www.dotabuff.com/players/29004114",
    favoriteHeroes: [
    { videoSrc: "https://cdn.steamstatic.com/apps/dota2/videos/dota_react/heroes/renders/dark_willow.webm", name: "Dark Willow" },
    { videoSrc: "https://cdn.steamstatic.com/apps/dota2/videos/dota_react/heroes/renders/monkey_king.webm", name: "Monkey King" },
    { videoSrc: "https://cdn.steamstatic.com/apps/dota2/videos/dota_react/heroes/renders/meepo.webm", name: "Meepo" },
  ],
  },
  {
    id: "dynamodon",
    nickname: "DynamoDon",
    realName: "",
    avatarUrl: "/avatars/default.jpg",
    seasonBadges: [],
    hasWonCup: false,

    
    

    currentMedalLabel: "",
    currentMedalId: "",
    peakMedalLabel: "",
    peakMedalId: "",

    bio: "",
    roles: [],

    steamUrl: "https://steamcommunity.com/profiles/76561198216899824",
    dotabuffUrl: "https://www.dotabuff.com/players/256634096",
    favoriteHeroes: [
    { videoSrc: "https://cdn.steamstatic.com/apps/dota2/videos/dota_react/heroes/renders/elder_titan.webm", name: "Elder Titan" },
    { videoSrc: "https://cdn.steamstatic.com/apps/dota2/videos/dota_react/heroes/renders/broodmother.webm", name: "Broodmother" },
    { videoSrc: "https://cdn.steamstatic.com/apps/dota2/videos/dota_react/heroes/renders/ancient_apparition.webm", name: "Ancient Apparition" },
  ],
  },
  {
    id: "fox",
    nickname: "FOX",
    realName: "",
    avatarUrl: "/avatars/default.jpg",
    seasonBadges: [],
    hasWonCup: false,

    
    

    currentMedalLabel: "",
    currentMedalId: "",
    peakMedalLabel: "",
    peakMedalId: "",

    bio: "",
    roles: [],

    steamUrl: "https://steamcommunity.com/profiles/76561198801747001",
    dotabuffUrl: "https://www.dotabuff.com/players/841481273",
    favoriteHeroes: [
    { videoSrc: "https://cdn.steamstatic.com/apps/dota2/videos/dota_react/heroes/renders/hoodwink.webm", name: "Hoodwink" },
    { videoSrc: "https://cdn.steamstatic.com/apps/dota2/videos/dota_react/heroes/renders/naga_siren.webm", name: "Naga Siren" },
    { videoSrc: "https://cdn.steamstatic.com/apps/dota2/videos/dota_react/heroes/renders/troll_warlord.webm", name: "Troll Warlord" },
  ],
  },
  {
    id: "ov3rconfidenc3",
    nickname: "Ov3rconfidenc3",
    realName: "",
    avatarUrl: "/avatars/default.jpg",
    seasonBadges: [],
    hasWonCup: false,

    
    

    currentMedalLabel: "",
    currentMedalId: "",
    peakMedalLabel: "",
    peakMedalId: "",

    bio: "",
    roles: [],

    steamUrl: "https://steamcommunity.com/profiles/76561198067922073",
    dotabuffUrl: "http://www.dotabuff.com/players/107656345",
    favoriteHeroes: [
    { videoSrc: "https://cdn.steamstatic.com/apps/dota2/videos/dota_react/heroes/renders/snapfire.webm", name: "Snapfire" },
    { videoSrc: "https://cdn.steamstatic.com/apps/dota2/videos/dota_react/heroes/renders/bloodseeker.webm", name: "Bloodseeker" },
    { videoSrc: "https://cdn.steamstatic.com/apps/dota2/videos/dota_react/heroes/renders/brewmaster.webm", name: "Brewmaster" },
  ],
  },
  {
    id: "dr_nemesis_x",
    nickname: "Dr_Nemesis_X",
    realName: "",
    avatarUrl: "/avatars/default.jpg",
    seasonBadges: [],
    hasWonCup: false,

    
    

    currentMedalLabel: "",
    currentMedalId: "",
    peakMedalLabel: "",
    peakMedalId: "",

    bio: "",
    roles: [],

    steamUrl: "https://steamcommunity.com/profiles/76561198371188806",
    dotabuffUrl: "https://www.dotabuff.com/players/410923078",
    favoriteHeroes: [
    { videoSrc: "https://cdn.steamstatic.com/apps/dota2/videos/dota_react/heroes/renders/razor.webm", name: "Razor" },
    { videoSrc: "https://cdn.steamstatic.com/apps/dota2/videos/dota_react/heroes/renders/underlord.webm", name: "Underlord" },
    { videoSrc: "https://cdn.steamstatic.com/apps/dota2/videos/dota_react/heroes/renders/rubick.webm", name: "Rubick" },
  ],
  },
  {
    id: "yuno",
    nickname: "Yuno",
    realName: "",
    avatarUrl: "/avatars/default.jpg",
    seasonBadges: [],
    hasWonCup: false,

    
    

    currentMedalLabel: "",
    currentMedalId: "",
    peakMedalLabel: "",
    peakMedalId: "",

    bio: "",
    roles: [],

    steamUrl: "https://steamcommunity.com/profiles/76561199037287674",
    dotabuffUrl: "https://www.dotabuff.com/players/1077021946",
    favoriteHeroes: [
    { videoSrc: "https://cdn.steamstatic.com/apps/dota2/videos/dota_react/heroes/renders/wisp.webm", name: "Wisp" },
    { videoSrc: "https://cdn.steamstatic.com/apps/dota2/videos/dota_react/heroes/renders/crystal_maiden.webm", name: "Crystal Maiden" },
    { videoSrc: "https://cdn.steamstatic.com/apps/dota2/videos/dota_react/heroes/renders/razor.webm", name: "Razor" },
  ],
  },
  {
    id: "shaidota",
    nickname: "Shaidota",
    realName: "",
    avatarUrl: "/avatars/default.jpg",
    seasonBadges: [],
    hasWonCup: false,

    
    

    currentMedalLabel: "",
    currentMedalId: "",
    peakMedalLabel: "",
    peakMedalId: "",

    bio: "",
    roles: [],

    steamUrl: "https://steamcommunity.com/profiles/76561198812913109",
    dotabuffUrl: "https://www.dotabuff.com/players/852647381",
    favoriteHeroes: [
    { videoSrc: "https://cdn.steamstatic.com/apps/dota2/videos/dota_react/heroes/renders/juggernaut.webm", name: "Juggernaut" },
    { videoSrc: "https://cdn.steamstatic.com/apps/dota2/videos/dota_react/heroes/renders/dark_seer.webm", name: "Dark Seer" },
    { videoSrc: "https://cdn.steamstatic.com/apps/dota2/videos/dota_react/heroes/renders/shadow_demon.webm", name: "Shadow Demon" },
  ],
  },
  {
    id: "br_w_y",
    nickname: "BrõwÑ ẞöy",
    realName: "",
    avatarUrl: "/avatars/default.jpg",
    seasonBadges: [],
    hasWonCup: false,

    
    

    currentMedalLabel: "",
    currentMedalId: "",
    peakMedalLabel: "",
    peakMedalId: "",

    bio: "",
    roles: [],

    steamUrl: "https://steamcommunity.com/profiles/76561198225698148",
    dotabuffUrl: "https://www.dotabuff.com/players/265432420",
    favoriteHeroes: [
    { videoSrc: "https://cdn.steamstatic.com/apps/dota2/videos/dota_react/heroes/renders/necrophos.webm", name: "Necrophos" },
    { videoSrc: "https://cdn.steamstatic.com/apps/dota2/videos/dota_react/heroes/renders/elder_titan.webm", name: "Elder Titan" },
    { videoSrc: "https://cdn.steamstatic.com/apps/dota2/videos/dota_react/heroes/renders/sand_king.webm", name: "Sand King" },
  ],
  },
  {
    id: "mym_lucky13",
    nickname: "MYM|LUCKY13",
    realName: "",
    avatarUrl: "/avatars/default.jpg",
    seasonBadges: [],
    hasWonCup: false,

    
    

    currentMedalLabel: "",
    currentMedalId: "",
    peakMedalLabel: "",
    peakMedalId: "",

    bio: "",
    roles: [],

    steamUrl: "https://steamcommunity.com/profiles/76561198111784982",
    dotabuffUrl: "https://www.dotabuff.com/players/151519254",
    favoriteHeroes: [
    { videoSrc: "https://cdn.steamstatic.com/apps/dota2/videos/dota_react/heroes/renders/meepo.webm", name: "Meepo" },
    { videoSrc: "https://cdn.steamstatic.com/apps/dota2/videos/dota_react/heroes/renders/dark_seer.webm", name: "Dark Seer" },
    { videoSrc: "https://cdn.steamstatic.com/apps/dota2/videos/dota_react/heroes/renders/snapfire.webm", name: "Snapfire" },
  ],
  },
  {
    id: "pero",
    nickname: "Pero",
    realName: "",
    avatarUrl: "/avatars/default.jpg",
    seasonBadges: [],
    hasWonCup: false,

    
    

    currentMedalLabel: "",
    currentMedalId: "",
    peakMedalLabel: "",
    peakMedalId: "",

    bio: "",
    roles: [],

    steamUrl: "https://steamcommunity.com/profiles/76561198327996098",
    dotabuffUrl: "https://www.dotabuff.com/players/367730370",
    favoriteHeroes: [
    { videoSrc: "https://cdn.steamstatic.com/apps/dota2/videos/dota_react/heroes/renders/grimstroke.webm", name: "Grimstroke" },
    { videoSrc: "https://cdn.steamstatic.com/apps/dota2/videos/dota_react/heroes/renders/weaver.webm", name: "Weaver" },
    { videoSrc: "https://cdn.steamstatic.com/apps/dota2/videos/dota_react/heroes/renders/void_spirit.webm", name: "Void Spirit" },
  ],
  },
  {
    id: "mr_crystal",
    nickname: "Mr.Crystal",
    realName: "",
    avatarUrl: "/avatars/default.jpg",
    seasonBadges: [],
    hasWonCup: false,

    
    

    currentMedalLabel: "",
    currentMedalId: "",
    peakMedalLabel: "",
    peakMedalId: "",

    bio: "",
    roles: [],

    steamUrl: "https://steamcommunity.com/profiles/76561198134866805",
    dotabuffUrl: "https://www.dotabuff.com/players/174601077",
    favoriteHeroes: [
    { videoSrc: "https://cdn.steamstatic.com/apps/dota2/videos/dota_react/heroes/renders/ursa.webm", name: "Ursa" },
    { videoSrc: "https://cdn.steamstatic.com/apps/dota2/videos/dota_react/heroes/renders/shadow_fiend.webm", name: "Shadow Fiend" },
    { videoSrc: "https://cdn.steamstatic.com/apps/dota2/videos/dota_react/heroes/renders/winter_wyvern.webm", name: "Winter Wyvern" },
  ],
  },
  {
    id: "dropthebass",
    nickname: "Dropthebass",
    realName: "",
    avatarUrl: "/avatars/default.jpg",
    seasonBadges: [],
    hasWonCup: false,

    
    

    currentMedalLabel: "",
    currentMedalId: "",
    peakMedalLabel: "",
    peakMedalId: "",

    bio: "",
    roles: [],

    steamUrl: "https://steamcommunity.com/profiles/76561198147931199",
    dotabuffUrl: "https://www.dotabuff.com/players/187665471",
    favoriteHeroes: [
    { videoSrc: "https://cdn.steamstatic.com/apps/dota2/videos/dota_react/heroes/renders/shadow_fiend.webm", name: "Shadow Fiend" },
    { videoSrc: "https://cdn.steamstatic.com/apps/dota2/videos/dota_react/heroes/renders/earthshaker.webm", name: "Earthshaker" },
    { videoSrc: "https://cdn.steamstatic.com/apps/dota2/videos/dota_react/heroes/renders/spirit_breaker.webm", name: "Spirit Breaker" },
  ],
  },
  {
    id: "grizzly",
    nickname: "Grizzly",
    realName: "",
    avatarUrl: "/avatars/default.jpg",
    seasonBadges: [],
    hasWonCup: false,

    
    

    currentMedalLabel: "",
    currentMedalId: "",
    peakMedalLabel: "",
    peakMedalId: "",

    bio: "",
    roles: [],

    steamUrl: "https://steamcommunity.com/profiles/76561198263590410",
    dotabuffUrl: "https://www.dotabuff.com/players/303324682",
    favoriteHeroes: [
    { videoSrc: "https://cdn.steamstatic.com/apps/dota2/videos/dota_react/heroes/renders/axe.webm", name: "Axe" },
    { videoSrc: "https://cdn.steamstatic.com/apps/dota2/videos/dota_react/heroes/renders/slardar.webm", name: "Slardar" },
    { videoSrc: "https://cdn.steamstatic.com/apps/dota2/videos/dota_react/heroes/renders/drow_ranger.webm", name: "Drow Ranger" },
  ],
  },
  {
    id: "penda",
    nickname: "Penda",
    realName: "",
    avatarUrl: "/avatars/default.jpg",
    seasonBadges: [],
    hasWonCup: false,

    
    

    currentMedalLabel: "",
    currentMedalId: "",
    peakMedalLabel: "",
    peakMedalId: "",

    bio: "",
    roles: [],

    steamUrl: "https://steamcommunity.com/profiles/76561198305120933",
    dotabuffUrl: "https://www.dotabuff.com/players/344855205",
    favoriteHeroes: [
    { videoSrc: "https://cdn.steamstatic.com/apps/dota2/videos/dota_react/heroes/renders/spirit_breaker.webm", name: "Spirit Breaker" },
    { videoSrc: "https://cdn.steamstatic.com/apps/dota2/videos/dota_react/heroes/renders/tusk.webm", name: "Tusk" },
    { videoSrc: "https://cdn.steamstatic.com/apps/dota2/videos/dota_react/heroes/renders/viper.webm", name: "Viper" },
  ],
  },
  {
    id: "shikamaru",
    nickname: "Shikamaru",
    realName: "",
    avatarUrl: "/avatars/default.jpg",
    seasonBadges: [],
    hasWonCup: false,

    
    

    currentMedalLabel: "",
    currentMedalId: "",
    peakMedalLabel: "",
    peakMedalId: "",

    bio: "",
    roles: [],

    steamUrl: "https://steamcommunity.com/profiles/76561199154924950",
    dotabuffUrl: "https://www.dotabuff.com/players/1194659222",
    favoriteHeroes: [
    { videoSrc: "https://cdn.steamstatic.com/apps/dota2/videos/dota_react/heroes/renders/night_stalker.webm", name: "Night Stalker" },
    { videoSrc: "https://cdn.steamstatic.com/apps/dota2/videos/dota_react/heroes/renders/beastmaster.webm", name: "Beastmaster" },
    { videoSrc: "https://cdn.steamstatic.com/apps/dota2/videos/dota_react/heroes/renders/skywrath_mage.webm", name: "Skywrath Mage" },
  ],
  },
  {
    id: "faith",
    nickname: "Faith",
    realName: "",
    avatarUrl: "/avatars/default.jpg",
    seasonBadges: [],
    hasWonCup: false,

    
    

    currentMedalLabel: "",
    currentMedalId: "",
    peakMedalLabel: "",
    peakMedalId: "",

    bio: "",
    roles: [],

    steamUrl: "https://steamcommunity.com/profiles/76561198111564276",
    dotabuffUrl: "https://www.dotabuff.com/players/151298548",
    favoriteHeroes: [
    { videoSrc: "https://cdn.steamstatic.com/apps/dota2/videos/dota_react/heroes/renders/luna.webm", name: "Luna" },
    { videoSrc: "https://cdn.steamstatic.com/apps/dota2/videos/dota_react/heroes/renders/shadow_shaman.webm", name: "Shadow Shaman" },
    { videoSrc: "https://cdn.steamstatic.com/apps/dota2/videos/dota_react/heroes/renders/zeus.webm", name: "Zeus" },
  ],
  },
  {
    id: "memelord_ozai",
    nickname: "Memelord Ozai",
    realName: "",
    avatarUrl: "/avatars/default.jpg",
    seasonBadges: [],
    hasWonCup: false,

    
    

    currentMedalLabel: "",
    currentMedalId: "",
    peakMedalLabel: "",
    peakMedalId: "",

    bio: "",
    roles: [],

    steamUrl: "https://steamcommunity.com/profiles/76561198855283430",
    dotabuffUrl: "https://www.dotabuff.com/players/895017702",
    favoriteHeroes: [
    { videoSrc: "https://cdn.steamstatic.com/apps/dota2/videos/dota_react/heroes/renders/viper.webm", name: "Viper" },
    { videoSrc: "https://cdn.steamstatic.com/apps/dota2/videos/dota_react/heroes/renders/wisp.webm", name: "Wisp" },
    { videoSrc: "https://cdn.steamstatic.com/apps/dota2/videos/dota_react/heroes/renders/enigma.webm", name: "Enigma" },
  ],
  },
  {
    id: "blitzip",
    nickname: "Blitzip",
    realName: "",
    avatarUrl: "/avatars/default.jpg",
    seasonBadges: [],
    hasWonCup: false,

    
    

    currentMedalLabel: "",
    currentMedalId: "",
    peakMedalLabel: "",
    peakMedalId: "",

    bio: "",
    roles: [],

    steamUrl: "https://steamcommunity.com/profiles/76561198008347663",
    dotabuffUrl: "https://www.dotabuff.com/players/48081935",
    favoriteHeroes: [
    { videoSrc: "https://cdn.steamstatic.com/apps/dota2/videos/dota_react/heroes/renders/huskar.webm", name: "Huskar" },
    { videoSrc: "https://cdn.steamstatic.com/apps/dota2/videos/dota_react/heroes/renders/mirana.webm", name: "Mirana" },
    { videoSrc: "https://cdn.steamstatic.com/apps/dota2/videos/dota_react/heroes/renders/shadow_shaman.webm", name: "Shadow Shaman" },
  ],
  },
  {
    id: "cpt_flux",
    nickname: "cpt_flux",
    realName: "",
    avatarUrl: "/avatars/default.jpg",
    seasonBadges: [],
    hasWonCup: false,

    
    

    currentMedalLabel: "",
    currentMedalId: "",
    peakMedalLabel: "",
    peakMedalId: "",

    bio: "",
    roles: [],

    steamUrl: "https://steamcommunity.com/profiles/76561198207682317",
    dotabuffUrl: "https://www.dotabuff.com/players/247416589",
    favoriteHeroes: [
    { videoSrc: "https://cdn.steamstatic.com/apps/dota2/videos/dota_react/heroes/renders/witch_doctor.webm", name: "Witch Doctor" },
    { videoSrc: "https://cdn.steamstatic.com/apps/dota2/videos/dota_react/heroes/renders/juggernaut.webm", name: "Juggernaut" },
    { videoSrc: "https://cdn.steamstatic.com/apps/dota2/videos/dota_react/heroes/renders/phantom_lancer.webm", name: "Phantom Lancer" },
  ],
  },
  {
    id: "jinx",
    nickname: "Jinx",
    realName: "",
    avatarUrl: "/avatars/default.jpg",
    seasonBadges: [],
    hasWonCup: false,

    
    

    currentMedalLabel: "",
    currentMedalId: "",
    peakMedalLabel: "",
    peakMedalId: "",

    bio: "",
    roles: [],

    steamUrl: "https://steamcommunity.com/profiles/76561198060588081",
    dotabuffUrl: "http://dotabuff.com/players/100322353",
    favoriteHeroes: [
    { videoSrc: "https://cdn.steamstatic.com/apps/dota2/videos/dota_react/heroes/renders/bounty_hunter.webm", name: "Bounty Hunter" },
    { videoSrc: "https://cdn.steamstatic.com/apps/dota2/videos/dota_react/heroes/renders/dragon_knight.webm", name: "Dragon Knight" },
    { videoSrc: "https://cdn.steamstatic.com/apps/dota2/videos/dota_react/heroes/renders/vengefulspirit.webm", name: "Vengefulspirit" },
  ],
  },
  {
    id: "no_one",
    nickname: "No One",
    realName: "",
    avatarUrl: "/avatars/default.jpg",
    seasonBadges: [],
    hasWonCup: false,

    
    

    currentMedalLabel: "",
    currentMedalId: "",
    peakMedalLabel: "",
    peakMedalId: "",

    bio: "",
    roles: [],

    steamUrl: "https://steamcommunity.com/profiles/76561198129811418",
    dotabuffUrl: "https://www.dotabuff.com/players/169545690",
    favoriteHeroes: [
    { videoSrc: "https://cdn.steamstatic.com/apps/dota2/videos/dota_react/heroes/renders/meepo.webm", name: "Meepo" },
    { videoSrc: "https://cdn.steamstatic.com/apps/dota2/videos/dota_react/heroes/renders/bloodseeker.webm", name: "Bloodseeker" },
    { videoSrc: "https://cdn.steamstatic.com/apps/dota2/videos/dota_react/heroes/renders/grimstroke.webm", name: "Grimstroke" },
  ],
  },
  {
    id: "swaggy_brisngr",
    nickname: "Swaggy Brisngr",
    realName: "",
    avatarUrl: "/avatars/default.jpg",
    seasonBadges: [],
    hasWonCup: false,

    
    

    currentMedalLabel: "",
    currentMedalId: "",
    peakMedalLabel: "",
    peakMedalId: "",

    bio: "",
    roles: [],

    steamUrl: "https://steamcommunity.com/profiles/76561198157163286",
    dotabuffUrl: "https://www.dotabuff.com/players/196897558",
    favoriteHeroes: [
    { videoSrc: "https://cdn.steamstatic.com/apps/dota2/videos/dota_react/heroes/renders/earthshaker.webm", name: "Earthshaker" },
    { videoSrc: "https://cdn.steamstatic.com/apps/dota2/videos/dota_react/heroes/renders/razor.webm", name: "Razor" },
    { videoSrc: "https://cdn.steamstatic.com/apps/dota2/videos/dota_react/heroes/renders/doom_bringer.webm", name: "Doom Bringer" },
  ],
  },
  {
    id: "rb",
    nickname: "RB",
    realName: "",
    avatarUrl: "/avatars/default.jpg",
    seasonBadges: [],
    hasWonCup: false,

    
    

    currentMedalLabel: "",
    currentMedalId: "",
    peakMedalLabel: "",
    peakMedalId: "",

    bio: "",
    roles: [],

    steamUrl: "https://steamcommunity.com/profiles/76561198870516878",
    dotabuffUrl: "https://www.dotabuff.com/players/910251150",
    favoriteHeroes: [
    { videoSrc: "https://cdn.steamstatic.com/apps/dota2/videos/dota_react/heroes/renders/faceless_void.webm", name: "Faceless Void" },
    { videoSrc: "https://cdn.steamstatic.com/apps/dota2/videos/dota_react/heroes/renders/axe.webm", name: "Axe" },
    { videoSrc: "https://cdn.steamstatic.com/apps/dota2/videos/dota_react/heroes/renders/legion_commander.webm", name: "Legion Commander" },
  ],
  },
  {
    id: "epizeuxius",
    nickname: "Epizeuxius",
    realName: "",
    avatarUrl: "/avatars/default.jpg",
    seasonBadges: [],
    hasWonCup: false,

    
    

    currentMedalLabel: "",
    currentMedalId: "",
    peakMedalLabel: "",
    peakMedalId: "",

    bio: "",
    roles: [],

    steamUrl: "https://steamcommunity.com/profiles/76561198285780323",
    dotabuffUrl: "https://www.dotabuff.com/players/325514595",
    favoriteHeroes: [
    { videoSrc: "https://cdn.steamstatic.com/apps/dota2/videos/dota_react/heroes/renders/sniper.webm", name: "Sniper" },
    { videoSrc: "https://cdn.steamstatic.com/apps/dota2/videos/dota_react/heroes/renders/leshrac.webm", name: "Leshrac" },
    { videoSrc: "https://cdn.steamstatic.com/apps/dota2/videos/dota_react/heroes/renders/wraith_king.webm", name: "Wraith King" },
  ],
  },
  {
    id: "ultra_noobpk",
    nickname: "Ultra.NoobPk",
    realName: "",
    avatarUrl: "/avatars/default.jpg",
    seasonBadges: [],
    hasWonCup: false,

    
    

    currentMedalLabel: "",
    currentMedalId: "",
    peakMedalLabel: "",
    peakMedalId: "",

    bio: "",
    roles: [],

    steamUrl: "https://steamcommunity.com/profiles/76561198312840616",
    dotabuffUrl: "https://www.dotabuff.com/players/352574888",
    favoriteHeroes: [
    { videoSrc: "https://cdn.steamstatic.com/apps/dota2/videos/dota_react/heroes/renders/kunkka.webm", name: "Kunkka" },
    { videoSrc: "https://cdn.steamstatic.com/apps/dota2/videos/dota_react/heroes/renders/snapfire.webm", name: "Snapfire" },
    { videoSrc: "https://cdn.steamstatic.com/apps/dota2/videos/dota_react/heroes/renders/dark_seer.webm", name: "Dark Seer" },
  ],
  },
  {
    id: "gifty",
    nickname: "Gifty",
    realName: "",
    avatarUrl: "/avatars/default.jpg",
    seasonBadges: [],
    hasWonCup: false,

    
    

    currentMedalLabel: "",
    currentMedalId: "",
    peakMedalLabel: "",
    peakMedalId: "",

    bio: "",
    roles: [],

    steamUrl: "https://steamcommunity.com/profiles/76561198060748169",
    dotabuffUrl: "https://www.dotabuff.com/players/100482441",
    favoriteHeroes: [
    { videoSrc: "https://cdn.steamstatic.com/apps/dota2/videos/dota_react/heroes/renders/dark_willow.webm", name: "Dark Willow" },
    { videoSrc: "https://cdn.steamstatic.com/apps/dota2/videos/dota_react/heroes/renders/dragon_knight.webm", name: "Dragon Knight" },
    { videoSrc: "https://cdn.steamstatic.com/apps/dota2/videos/dota_react/heroes/renders/bloodseeker.webm", name: "Bloodseeker" },
  ],
  },
  {
    id: "eric_dane",
    nickname: "Eric Dane",
    realName: "",
    avatarUrl: "/avatars/default.jpg",
    seasonBadges: [],
    hasWonCup: false,

    
    

    currentMedalLabel: "",
    currentMedalId: "",
    peakMedalLabel: "",
    peakMedalId: "",

    bio: "",
    roles: [],

    steamUrl: "https://steamcommunity.com/profiles/76561198154928635",
    dotabuffUrl: "https://www.dotabuff.com/players/194662907",
    favoriteHeroes: [
    { videoSrc: "https://cdn.steamstatic.com/apps/dota2/videos/dota_react/heroes/renders/tiny.webm", name: "Tiny" },
    { videoSrc: "https://cdn.steamstatic.com/apps/dota2/videos/dota_react/heroes/renders/troll_warlord.webm", name: "Troll Warlord" },
    { videoSrc: "https://cdn.steamstatic.com/apps/dota2/videos/dota_react/heroes/renders/shadow_demon.webm", name: "Shadow Demon" },
  ],
  },
  {
    id: "still_panda_yt",
    nickname: "Still Panda YT",
    realName: "",
    avatarUrl: "/avatars/default.jpg",
    seasonBadges: [],
    hasWonCup: false,

    
    

    currentMedalLabel: "",
    currentMedalId: "",
    peakMedalLabel: "",
    peakMedalId: "",

    bio: "",
    roles: [],

    steamUrl: "https://steamcommunity.com/profiles/76561199048093511",
    dotabuffUrl: "https://www.dotabuff.com/players/1087827783",
    favoriteHeroes: [
    { videoSrc: "https://cdn.steamstatic.com/apps/dota2/videos/dota_react/heroes/renders/batrider.webm", name: "Batrider" },
    { videoSrc: "https://cdn.steamstatic.com/apps/dota2/videos/dota_react/heroes/renders/obsidian_destroyer.webm", name: "Obsidian Destroyer" },
    { videoSrc: "https://cdn.steamstatic.com/apps/dota2/videos/dota_react/heroes/renders/huskar.webm", name: "Huskar" },
  ],
  },
  {
    id: "rinne",
    nickname: "Rinne",
    realName: "",
    avatarUrl: "/avatars/default.jpg",
    seasonBadges: [],
    hasWonCup: false,

    
    

    currentMedalLabel: "",
    currentMedalId: "",
    peakMedalLabel: "",
    peakMedalId: "",

    bio: "",
    roles: [],

    steamUrl: "https://steamcommunity.com/profiles/76561198263747606",
    dotabuffUrl: "https://www.dotabuff.com/players/303481878",
    favoriteHeroes: [
    { videoSrc: "https://cdn.steamstatic.com/apps/dota2/videos/dota_react/heroes/renders/luna.webm", name: "Luna" },
    { videoSrc: "https://cdn.steamstatic.com/apps/dota2/videos/dota_react/heroes/renders/earthshaker.webm", name: "Earthshaker" },
    { videoSrc: "https://cdn.steamstatic.com/apps/dota2/videos/dota_react/heroes/renders/antimage.webm", name: "Antimage" },
  ],
  },
  {
    id: "shabby",
    nickname: "ShabbY**",
    realName: "",
    avatarUrl: "/avatars/default.jpg",
    seasonBadges: [],
    hasWonCup: false,

    
    

    currentMedalLabel: "",
    currentMedalId: "",
    peakMedalLabel: "",
    peakMedalId: "",

    bio: "",
    roles: [],

    steamUrl: "https://steamcommunity.com/profiles/76561198172935917",
    dotabuffUrl: "https://www.dotabuff.com/players/212670189",
    favoriteHeroes: [
    { videoSrc: "https://cdn.steamstatic.com/apps/dota2/videos/dota_react/heroes/renders/nyx_assassin.webm", name: "Nyx Assassin" },
    { videoSrc: "https://cdn.steamstatic.com/apps/dota2/videos/dota_react/heroes/renders/chaos_knight.webm", name: "Chaos Knight" },
    { videoSrc: "https://cdn.steamstatic.com/apps/dota2/videos/dota_react/heroes/renders/wraith_king.webm", name: "Wraith King" },
  ],
  },
  {
    id: "haz3",
    nickname: "hAz3",
    realName: "",
    avatarUrl: "/avatars/default.jpg",
    seasonBadges: [],
    hasWonCup: false,

    
    

    currentMedalLabel: "",
    currentMedalId: "",
    peakMedalLabel: "",
    peakMedalId: "",

    bio: "",
    roles: [],

    steamUrl: "https://steamcommunity.com/profiles/76561198063274138",
    dotabuffUrl: "https://www.dotabuff.com/players/103008410",
    favoriteHeroes: [
    { videoSrc: "https://cdn.steamstatic.com/apps/dota2/videos/dota_react/heroes/renders/spectre.webm", name: "Spectre" },
    { videoSrc: "https://cdn.steamstatic.com/apps/dota2/videos/dota_react/heroes/renders/tidehunter.webm", name: "Tidehunter" },
    { videoSrc: "https://cdn.steamstatic.com/apps/dota2/videos/dota_react/heroes/renders/earthshaker.webm", name: "Earthshaker" },
  ],
  },
  {
    id: "nj",
    nickname: "Nj",
    realName: "",
    avatarUrl: "/avatars/default.jpg",
    seasonBadges: [],
    hasWonCup: false,

    
    

    currentMedalLabel: "",
    currentMedalId: "",
    peakMedalLabel: "",
    peakMedalId: "",

    bio: "",
    roles: [],

    steamUrl: "https://steamcommunity.com/profiles/76561198260703559",
    dotabuffUrl: "https://www.dotabuff.com/players/300437831",
    favoriteHeroes: [
    { videoSrc: "https://cdn.steamstatic.com/apps/dota2/videos/dota_react/heroes/renders/templar_assassin.webm", name: "Templar Assassin" },
    { videoSrc: "https://cdn.steamstatic.com/apps/dota2/videos/dota_react/heroes/renders/viper.webm", name: "Viper" },
    { videoSrc: "https://cdn.steamstatic.com/apps/dota2/videos/dota_react/heroes/renders/warlock.webm", name: "Warlock" },
  ],
  },
  {
    id: "penduuu",
    nickname: "pEnduUu",
    realName: "",
    avatarUrl: "/avatars/default.jpg",
    seasonBadges: [],
    hasWonCup: false,

    
    

    currentMedalLabel: "",
    currentMedalId: "",
    peakMedalLabel: "",
    peakMedalId: "",

    bio: "",
    roles: [],

    steamUrl: "https://steamcommunity.com/profiles/76561198355994680",
    dotabuffUrl: "https://www.dotabuff.com/players/395728952",
    favoriteHeroes: [
    { videoSrc: "https://cdn.steamstatic.com/apps/dota2/videos/dota_react/heroes/renders/pangolier.webm", name: "Pangolier" },
    { videoSrc: "https://cdn.steamstatic.com/apps/dota2/videos/dota_react/heroes/renders/doom_bringer.webm", name: "Doom Bringer" },
    { videoSrc: "https://cdn.steamstatic.com/apps/dota2/videos/dota_react/heroes/renders/storm_spirit.webm", name: "Storm Spirit" },
  ],
  },
  {
    id: "setupathi",
    nickname: "Setupathi",
    realName: "",
    avatarUrl: "/avatars/default.jpg",
    seasonBadges: [],
    hasWonCup: false,

    
    

    currentMedalLabel: "",
    currentMedalId: "",
    peakMedalLabel: "",
    peakMedalId: "",

    bio: "",
    roles: [],

    steamUrl: "https://steamcommunity.com/profiles/76561198123347448",
    dotabuffUrl: "https://www.dotabuff.com/players/163081720",
    favoriteHeroes: [
    { videoSrc: "https://cdn.steamstatic.com/apps/dota2/videos/dota_react/heroes/renders/bloodseeker.webm", name: "Bloodseeker" },
    { videoSrc: "https://cdn.steamstatic.com/apps/dota2/videos/dota_react/heroes/renders/naga_siren.webm", name: "Naga Siren" },
    { videoSrc: "https://cdn.steamstatic.com/apps/dota2/videos/dota_react/heroes/renders/arc_warden.webm", name: "Arc Warden" },
  ],
  },
  {
    id: "ra_v",
    nickname: "rA'V!",
    realName: "",
    avatarUrl: "/avatars/default.jpg",
    seasonBadges: [],
    hasWonCup: false,

    
    

    currentMedalLabel: "",
    currentMedalId: "",
    peakMedalLabel: "",
    peakMedalId: "",

    bio: "",
    roles: [],

    steamUrl: "https://steamcommunity.com/profiles/76561197998665425",
    dotabuffUrl: "https://www.dotabuff.com/players/38399697",
    favoriteHeroes: [
    { videoSrc: "https://cdn.steamstatic.com/apps/dota2/videos/dota_react/heroes/renders/shadow_demon.webm", name: "Shadow Demon" },
    { videoSrc: "https://cdn.steamstatic.com/apps/dota2/videos/dota_react/heroes/renders/drow_ranger.webm", name: "Drow Ranger" },
    { videoSrc: "https://cdn.steamstatic.com/apps/dota2/videos/dota_react/heroes/renders/medusa.webm", name: "Medusa" },
  ],
  },
  {
    id: "ryuga",
    nickname: "RyuGa",
    realName: "",
    avatarUrl: "/avatars/default.jpg",
    seasonBadges: [],
    hasWonCup: false,

    
    

    currentMedalLabel: "",
    currentMedalId: "",
    peakMedalLabel: "",
    peakMedalId: "",

    bio: "",
    roles: [],

    steamUrl: "https://steamcommunity.com/profiles/76561198268814917",
    dotabuffUrl: "https://www.dotabuff.com/players/308549189",
    favoriteHeroes: [
    { videoSrc: "https://cdn.steamstatic.com/apps/dota2/videos/dota_react/heroes/renders/monkey_king.webm", name: "Monkey King" },
    { videoSrc: "https://cdn.steamstatic.com/apps/dota2/videos/dota_react/heroes/renders/dark_seer.webm", name: "Dark Seer" },
    { videoSrc: "https://cdn.steamstatic.com/apps/dota2/videos/dota_react/heroes/renders/shadow_demon.webm", name: "Shadow Demon" },
  ],
  },
  {
    id: "maldini",
    nickname: "Maldini",
    realName: "",
    avatarUrl: "/avatars/default.jpg",
    seasonBadges: [],
    hasWonCup: false,

    
    

    currentMedalLabel: "",
    currentMedalId: "",
    peakMedalLabel: "",
    peakMedalId: "",

    bio: "",
    roles: [],

    steamUrl: "https://steamcommunity.com/profiles/76561198332637766",
    dotabuffUrl: "https://www.dotabuff.com/players/372372038",
    favoriteHeroes: [
    { videoSrc: "https://cdn.steamstatic.com/apps/dota2/videos/dota_react/heroes/renders/chaos_knight.webm", name: "Chaos Knight" },
    { videoSrc: "https://cdn.steamstatic.com/apps/dota2/videos/dota_react/heroes/renders/templar_assassin.webm", name: "Templar Assassin" },
    { videoSrc: "https://cdn.steamstatic.com/apps/dota2/videos/dota_react/heroes/renders/underlord.webm", name: "Underlord" },
  ],
  },
  {
    id: "dranzer",
    nickname: "Dranzer",
    realName: "",
    avatarUrl: "/avatars/default.jpg",
    seasonBadges: [],
    hasWonCup: false,

    
    

    currentMedalLabel: "",
    currentMedalId: "",
    peakMedalLabel: "",
    peakMedalId: "",

    bio: "",
    roles: [],

    steamUrl: "https://steamcommunity.com/profiles/76561198349412593",
    dotabuffUrl: "https://www.dotabuff.com/players/389146865",
    favoriteHeroes: [
    { videoSrc: "https://cdn.steamstatic.com/apps/dota2/videos/dota_react/heroes/renders/riki.webm", name: "Riki" },
    { videoSrc: "https://cdn.steamstatic.com/apps/dota2/videos/dota_react/heroes/renders/lina.webm", name: "Lina" },
    { videoSrc: "https://cdn.steamstatic.com/apps/dota2/videos/dota_react/heroes/renders/snapfire.webm", name: "Snapfire" },
  ],
  },
  {
    id: "gorki",
    nickname: "Gorki",
    realName: "",
    avatarUrl: "/avatars/default.jpg",
    seasonBadges: [],
    hasWonCup: false,

    
    

    currentMedalLabel: "",
    currentMedalId: "",
    peakMedalLabel: "",
    peakMedalId: "",

    bio: "",
    roles: [],

    steamUrl: "https://steamcommunity.com/profiles/76561198118395432",
    dotabuffUrl: "https://www.dotabuff.com/players/158129704",
    favoriteHeroes: [
    { videoSrc: "https://cdn.steamstatic.com/apps/dota2/videos/dota_react/heroes/renders/invoker.webm", name: "Invoker" },
    { videoSrc: "https://cdn.steamstatic.com/apps/dota2/videos/dota_react/heroes/renders/wraith_king.webm", name: "Wraith King" },
    { videoSrc: "https://cdn.steamstatic.com/apps/dota2/videos/dota_react/heroes/renders/bloodseeker.webm", name: "Bloodseeker" },
  ],
  },
  {
    id: "bluediamond",
    nickname: "Bluediamond",
    realName: "",
    avatarUrl: "/avatars/default.jpg",
    seasonBadges: [],
    hasWonCup: false,

    
    

    currentMedalLabel: "",
    currentMedalId: "",
    peakMedalLabel: "",
    peakMedalId: "",

    bio: "",
    roles: [],

    steamUrl: "https://steamcommunity.com/profiles/76561199085296348",
    dotabuffUrl: "https://www.dotabuff.com/players/1125030620",
    favoriteHeroes: [
    { videoSrc: "https://cdn.steamstatic.com/apps/dota2/videos/dota_react/heroes/renders/ogre_magi.webm", name: "Ogre Magi" },
    { videoSrc: "https://cdn.steamstatic.com/apps/dota2/videos/dota_react/heroes/renders/tinker.webm", name: "Tinker" },
    { videoSrc: "https://cdn.steamstatic.com/apps/dota2/videos/dota_react/heroes/renders/drow_ranger.webm", name: "Drow Ranger" },
  ],
  },
  {
    id: "uma1s",
    nickname: "Uma1s",
    realName: "",
    avatarUrl: "/avatars/default.jpg",
    seasonBadges: [],
    hasWonCup: false,

    
    

    currentMedalLabel: "",
    currentMedalId: "",
    peakMedalLabel: "",
    peakMedalId: "",

    bio: "",
    roles: [],

    steamUrl: "https://steamcommunity.com/profiles/76561198048011177",
    dotabuffUrl: "https://www.dotabuff.com/players/87745449",
    favoriteHeroes: [
    { videoSrc: "https://cdn.steamstatic.com/apps/dota2/videos/dota_react/heroes/renders/monkey_king.webm", name: "Monkey King" },
    { videoSrc: "https://cdn.steamstatic.com/apps/dota2/videos/dota_react/heroes/renders/elder_titan.webm", name: "Elder Titan" },
    { videoSrc: "https://cdn.steamstatic.com/apps/dota2/videos/dota_react/heroes/renders/juggernaut.webm", name: "Juggernaut" },
  ],
  },
  {
    id: "alcromido",
    nickname: "Alcromido",
    realName: "",
    avatarUrl: "/avatars/default.jpg",
    seasonBadges: [],
    hasWonCup: false,

    
    

    currentMedalLabel: "",
    currentMedalId: "",
    peakMedalLabel: "",
    peakMedalId: "",

    bio: "",
    roles: [],

    steamUrl: "https://steamcommunity.com/profiles/76561198196591646",
    dotabuffUrl: "https://www.dotabuff.com/players/236325918",
    favoriteHeroes: [
    { videoSrc: "https://cdn.steamstatic.com/apps/dota2/videos/dota_react/heroes/renders/kunkka.webm", name: "Kunkka" },
    { videoSrc: "https://cdn.steamstatic.com/apps/dota2/videos/dota_react/heroes/renders/magnataur.webm", name: "Magnataur" },
    { videoSrc: "https://cdn.steamstatic.com/apps/dota2/videos/dota_react/heroes/renders/dark_willow.webm", name: "Dark Willow" },
  ],
  },
  {
    id: "dante",
    nickname: "dante",
    realName: "",
    avatarUrl: "/avatars/default.jpg",
    seasonBadges: [],
    hasWonCup: false,

    
    

    currentMedalLabel: "",
    currentMedalId: "",
    peakMedalLabel: "",
    peakMedalId: "",

    bio: "",
    roles: [],

    steamUrl: "https://steamcommunity.com/profiles/76561198102419508",
    dotabuffUrl: "https://www.dotabuff.com/players/142153780",
    favoriteHeroes: [
    { videoSrc: "https://cdn.steamstatic.com/apps/dota2/videos/dota_react/heroes/renders/crystal_maiden.webm", name: "Crystal Maiden" },
    { videoSrc: "https://cdn.steamstatic.com/apps/dota2/videos/dota_react/heroes/renders/templar_assassin.webm", name: "Templar Assassin" },
    { videoSrc: "https://cdn.steamstatic.com/apps/dota2/videos/dota_react/heroes/renders/dawnbreaker.webm", name: "Dawnbreaker" },
  ],
  },
  {
    id: "bull",
    nickname: "bull",
    realName: "",
    avatarUrl: "/avatars/default.jpg",
    seasonBadges: [],
    hasWonCup: false,

    
    

    currentMedalLabel: "",
    currentMedalId: "",
    peakMedalLabel: "",
    peakMedalId: "",

    bio: "",
    roles: [],

    steamUrl: "https://steamcommunity.com/profiles/76561198080338787",
    dotabuffUrl: "https://www.dotabuff.com/players/120073059",
    favoriteHeroes: [
    { videoSrc: "https://cdn.steamstatic.com/apps/dota2/videos/dota_react/heroes/renders/tinker.webm", name: "Tinker" },
    { videoSrc: "https://cdn.steamstatic.com/apps/dota2/videos/dota_react/heroes/renders/dark_willow.webm", name: "Dark Willow" },
    { videoSrc: "https://cdn.steamstatic.com/apps/dota2/videos/dota_react/heroes/renders/sniper.webm", name: "Sniper" },
  ],
  },
  {
    id: "pyro",
    nickname: "pYro",
    realName: "",
    avatarUrl: "/avatars/default.jpg",
    seasonBadges: [],
    hasWonCup: false,

    
    

    currentMedalLabel: "",
    currentMedalId: "",
    peakMedalLabel: "",
    peakMedalId: "",

    bio: "",
    roles: [],

    steamUrl: "https://steamcommunity.com/profiles/76561198057114143",
    dotabuffUrl: "https://www.dotabuff.com/players/96848415",
    favoriteHeroes: [
    { videoSrc: "https://cdn.steamstatic.com/apps/dota2/videos/dota_react/heroes/renders/pugna.webm", name: "Pugna" },
    { videoSrc: "https://cdn.steamstatic.com/apps/dota2/videos/dota_react/heroes/renders/clockwerk.webm", name: "Clockwerk" },
    { videoSrc: "https://cdn.steamstatic.com/apps/dota2/videos/dota_react/heroes/renders/void_spirit.webm", name: "Void Spirit" },
  ],
  },
  {
    id: "kakashi",
    nickname: "Kakashi",
    realName: "",
    avatarUrl: "/avatars/default.jpg",
    seasonBadges: [],
    hasWonCup: false,

    
    

    currentMedalLabel: "",
    currentMedalId: "",
    peakMedalLabel: "",
    peakMedalId: "",

    bio: "",
    roles: [],

    steamUrl: "https://steamcommunity.com/profiles/76561199634618094",
    dotabuffUrl: "https://www.dotabuff.com/players/1674352366",
    favoriteHeroes: [
    { videoSrc: "https://cdn.steamstatic.com/apps/dota2/videos/dota_react/heroes/renders/bane.webm", name: "Bane" },
    { videoSrc: "https://cdn.steamstatic.com/apps/dota2/videos/dota_react/heroes/renders/dark_seer.webm", name: "Dark Seer" },
    { videoSrc: "https://cdn.steamstatic.com/apps/dota2/videos/dota_react/heroes/renders/pudge.webm", name: "Pudge" },
  ],
  },
  {
    id: "puppy_boss",
    nickname: "Puppy boss",
    realName: "",
    avatarUrl: "/avatars/default.jpg",
    seasonBadges: [],
    hasWonCup: false,

    
    

    currentMedalLabel: "",
    currentMedalId: "",
    peakMedalLabel: "",
    peakMedalId: "",

    bio: "",
    roles: [],

    steamUrl: "https://steamcommunity.com/profiles/76561198156738930",
    dotabuffUrl: "https://www.dotabuff.com/players/196473202",
    favoriteHeroes: [
    { videoSrc: "https://cdn.steamstatic.com/apps/dota2/videos/dota_react/heroes/renders/void_spirit.webm", name: "Void Spirit" },
    { videoSrc: "https://cdn.steamstatic.com/apps/dota2/videos/dota_react/heroes/renders/night_stalker.webm", name: "Night Stalker" },
    { videoSrc: "https://cdn.steamstatic.com/apps/dota2/videos/dota_react/heroes/renders/broodmother.webm", name: "Broodmother" },
  ],
  },
  {
    id: "cigerettes_after_sex",
    nickname: "cigerettes after sex",
    realName: "",
    avatarUrl: "/avatars/default.jpg",
    seasonBadges: [],
    hasWonCup: false,

    
    

    currentMedalLabel: "",
    currentMedalId: "",
    peakMedalLabel: "",
    peakMedalId: "",

    bio: "",
    roles: [],

    steamUrl: "https://steamcommunity.com/profiles/76561198091954713",
    dotabuffUrl: "https://www.dotabuff.com/players/131688985",
    favoriteHeroes: [
    { videoSrc: "https://cdn.steamstatic.com/apps/dota2/videos/dota_react/heroes/renders/treant.webm", name: "Treant" },
    { videoSrc: "https://cdn.steamstatic.com/apps/dota2/videos/dota_react/heroes/renders/juggernaut.webm", name: "Juggernaut" },
    { videoSrc: "https://cdn.steamstatic.com/apps/dota2/videos/dota_react/heroes/renders/abaddon.webm", name: "Abaddon" },
  ],
  },
  {
    id: "dot",
    nickname: "DoT",
    realName: "",
    avatarUrl: "/avatars/default.jpg",
    seasonBadges: [],
    hasWonCup: false,

    
    

    currentMedalLabel: "",
    currentMedalId: "",
    peakMedalLabel: "",
    peakMedalId: "",

    bio: "",
    roles: [],

    steamUrl: "https://steamcommunity.com/profiles/76561198389078730",
    dotabuffUrl: "https://www.dotabuff.com/players/428813002",
    favoriteHeroes: [
    { videoSrc: "https://cdn.steamstatic.com/apps/dota2/videos/dota_react/heroes/renders/clinkz.webm", name: "Clinkz" },
    { videoSrc: "https://cdn.steamstatic.com/apps/dota2/videos/dota_react/heroes/renders/tinker.webm", name: "Tinker" },
    { videoSrc: "https://cdn.steamstatic.com/apps/dota2/videos/dota_react/heroes/renders/omniknight.webm", name: "Omniknight" },
  ],
  },
  {
    id: "meow_meow_madafaka",
    nickname: "Meow Meow Madafaka",
    realName: "",
    avatarUrl: "/avatars/default.jpg",
    seasonBadges: [],
    hasWonCup: false,

    
    

    currentMedalLabel: "",
    currentMedalId: "",
    peakMedalLabel: "",
    peakMedalId: "",

    bio: "",
    roles: [],

    steamUrl: "https://steamcommunity.com/profiles/76561198363322461",
    dotabuffUrl: "https://www.dotabuff.com/players/403056733",
    favoriteHeroes: [
    { videoSrc: "https://cdn.steamstatic.com/apps/dota2/videos/dota_react/heroes/renders/antimage.webm", name: "Antimage" },
    { videoSrc: "https://cdn.steamstatic.com/apps/dota2/videos/dota_react/heroes/renders/sven.webm", name: "Sven" },
    { videoSrc: "https://cdn.steamstatic.com/apps/dota2/videos/dota_react/heroes/renders/enigma.webm", name: "Enigma" },
  ],
  },
  {
    id: "kakarot",
    nickname: "Kakarot",
    realName: "",
    avatarUrl: "/avatars/default.jpg",
    seasonBadges: [],
    hasWonCup: false,

    
    

    currentMedalLabel: "",
    currentMedalId: "",
    peakMedalLabel: "",
    peakMedalId: "",

    bio: "",
    roles: [],

    steamUrl: "https://steamcommunity.com/profiles/76561198424433386",
    dotabuffUrl: "https://www.dotabuff.com/players/464167658",
    favoriteHeroes: [
    { videoSrc: "https://cdn.steamstatic.com/apps/dota2/videos/dota_react/heroes/renders/invoker.webm", name: "Invoker" },
    { videoSrc: "https://cdn.steamstatic.com/apps/dota2/videos/dota_react/heroes/renders/snapfire.webm", name: "Snapfire" },
    { videoSrc: "https://cdn.steamstatic.com/apps/dota2/videos/dota_react/heroes/renders/lycan.webm", name: "Lycan" },
  ],
  },
  {
    id: "icarus",
    nickname: "Icarus",
    realName: "",
    avatarUrl: "/avatars/default.jpg",
    seasonBadges: [],
    hasWonCup: false,

    
    

    currentMedalLabel: "",
    currentMedalId: "",
    peakMedalLabel: "",
    peakMedalId: "",

    bio: "",
    roles: [],

    steamUrl: "https://steamcommunity.com/profiles/76561199634110560",
    dotabuffUrl: "https://www.dotabuff.com/players/1673844832",
    favoriteHeroes: [
    { videoSrc: "https://cdn.steamstatic.com/apps/dota2/videos/dota_react/heroes/renders/wraith_king.webm", name: "Wraith King" },
    { videoSrc: "https://cdn.steamstatic.com/apps/dota2/videos/dota_react/heroes/renders/ursa.webm", name: "Ursa" },
    { videoSrc: "https://cdn.steamstatic.com/apps/dota2/videos/dota_react/heroes/renders/earthshaker.webm", name: "Earthshaker" },
  ],
  },
  {
    id: "roronoa_zoro",
    nickname: "Roronoa Zoro",
    realName: "",
    avatarUrl: "/avatars/default.jpg",
    seasonBadges: [],
    hasWonCup: false,

    
    

    currentMedalLabel: "",
    currentMedalId: "",
    peakMedalLabel: "",
    peakMedalId: "",

    bio: "",
    roles: [],

    steamUrl: "https://steamcommunity.com/profiles/76561198338169972",
    dotabuffUrl: "https://www.dotabuff.com/players/377904244",
    favoriteHeroes: [
    { videoSrc: "https://cdn.steamstatic.com/apps/dota2/videos/dota_react/heroes/renders/witch_doctor.webm", name: "Witch Doctor" },
    { videoSrc: "https://cdn.steamstatic.com/apps/dota2/videos/dota_react/heroes/renders/slark.webm", name: "Slark" },
    { videoSrc: "https://cdn.steamstatic.com/apps/dota2/videos/dota_react/heroes/renders/ursa.webm", name: "Ursa" },
  ],
  },
  {
    id: "sj",
    nickname: "SJ",
    realName: "",
    avatarUrl: "/avatars/default.jpg",
    seasonBadges: [],
    hasWonCup: false,

    
    

    currentMedalLabel: "",
    currentMedalId: "",
    peakMedalLabel: "",
    peakMedalId: "",

    bio: "",
    roles: [],

    steamUrl: "https://steamcommunity.com/profiles/76561198254597798",
    dotabuffUrl: "https://www.dotabuff.com/players/294332070",
    favoriteHeroes: [
    { videoSrc: "https://cdn.steamstatic.com/apps/dota2/videos/dota_react/heroes/renders/meepo.webm", name: "Meepo" },
    { videoSrc: "https://cdn.steamstatic.com/apps/dota2/videos/dota_react/heroes/renders/bloodseeker.webm", name: "Bloodseeker" },
    { videoSrc: "https://cdn.steamstatic.com/apps/dota2/videos/dota_react/heroes/renders/sand_king.webm", name: "Sand King" },
  ],
  },
  {
    id: "sridharocky",
    nickname: "Sridharocky",
    realName: "",
    avatarUrl: "/avatars/default.jpg",
    seasonBadges: [],
    hasWonCup: false,

    
    

    currentMedalLabel: "",
    currentMedalId: "",
    peakMedalLabel: "",
    peakMedalId: "",

    bio: "",
    roles: [],

    steamUrl: "https://steamcommunity.com/profiles/76561198199055633",
    dotabuffUrl: "https://www.dotabuff.com/players/238789905",
    favoriteHeroes: [
    { videoSrc: "https://cdn.steamstatic.com/apps/dota2/videos/dota_react/heroes/renders/treant.webm", name: "Treant" },
    { videoSrc: "https://cdn.steamstatic.com/apps/dota2/videos/dota_react/heroes/renders/bounty_hunter.webm", name: "Bounty Hunter" },
    { videoSrc: "https://cdn.steamstatic.com/apps/dota2/videos/dota_react/heroes/renders/dazzle.webm", name: "Dazzle" },
  ],
  },
  {
    id: "dron3",
    nickname: "DroN3",
    realName: "",
    avatarUrl: "/avatars/default.jpg",
    seasonBadges: [],
    hasWonCup: false,

    
    

    currentMedalLabel: "",
    currentMedalId: "",
    peakMedalLabel: "",
    peakMedalId: "",

    bio: "",
    roles: [],

    steamUrl: "https://steamcommunity.com/profiles/76561198135668078",
    dotabuffUrl: "https://www.dotabuff.com/players/175402350",
    favoriteHeroes: [
    { videoSrc: "https://cdn.steamstatic.com/apps/dota2/videos/dota_react/heroes/renders/templar_assassin.webm", name: "Templar Assassin" },
    { videoSrc: "https://cdn.steamstatic.com/apps/dota2/videos/dota_react/heroes/renders/dark_seer.webm", name: "Dark Seer" },
    { videoSrc: "https://cdn.steamstatic.com/apps/dota2/videos/dota_react/heroes/renders/visage.webm", name: "Visage" },
  ],
  },
  {
    id: "flabber",
    nickname: "fLabber",
    realName: "",
    avatarUrl: "/avatars/default.jpg",
    seasonBadges: [],
    hasWonCup: false,

    
    

    currentMedalLabel: "",
    currentMedalId: "",
    peakMedalLabel: "",
    peakMedalId: "",

    bio: "",
    roles: [],

    steamUrl: "https://steamcommunity.com/profiles/76561198081607826",
    dotabuffUrl: "https://www.dotabuff.com/players/121342098",
    favoriteHeroes: [
    { videoSrc: "https://cdn.steamstatic.com/apps/dota2/videos/dota_react/heroes/renders/chen.webm", name: "Chen" },
    { videoSrc: "https://cdn.steamstatic.com/apps/dota2/videos/dota_react/heroes/renders/sven.webm", name: "Sven" },
    { videoSrc: "https://cdn.steamstatic.com/apps/dota2/videos/dota_react/heroes/renders/abaddon.webm", name: "Abaddon" },
  ],
  },
  {
    id: "ronbawa",
    nickname: "Ronbawa",
    realName: "",
    avatarUrl: "/avatars/default.jpg",
    seasonBadges: [],
    hasWonCup: false,

    
    

    currentMedalLabel: "",
    currentMedalId: "",
    peakMedalLabel: "",
    peakMedalId: "",

    bio: "",
    roles: [],

    steamUrl: "https://steamcommunity.com/profiles/76561198195766263",
    dotabuffUrl: "https://www.dotabuff.com/players/235500535",
    favoriteHeroes: [
    { videoSrc: "https://cdn.steamstatic.com/apps/dota2/videos/dota_react/heroes/renders/sniper.webm", name: "Sniper" },
    { videoSrc: "https://cdn.steamstatic.com/apps/dota2/videos/dota_react/heroes/renders/venomancer.webm", name: "Venomancer" },
    { videoSrc: "https://cdn.steamstatic.com/apps/dota2/videos/dota_react/heroes/renders/huskar.webm", name: "Huskar" },
  ],
  },
  {
    id: "future",
    nickname: "Future",
    realName: "",
    avatarUrl: "/avatars/default.jpg",
    seasonBadges: [],
    hasWonCup: false,

    
    

    currentMedalLabel: "",
    currentMedalId: "",
    peakMedalLabel: "",
    peakMedalId: "",

    bio: "",
    roles: [],

    steamUrl: "https://steamcommunity.com/profiles/76561198204082433",
    dotabuffUrl: "https://www.dotabuff.com/players/243816705",
    favoriteHeroes: [
    { videoSrc: "https://cdn.steamstatic.com/apps/dota2/videos/dota_react/heroes/renders/clinkz.webm", name: "Clinkz" },
    { videoSrc: "https://cdn.steamstatic.com/apps/dota2/videos/dota_react/heroes/renders/void_spirit.webm", name: "Void Spirit" },
    { videoSrc: "https://cdn.steamstatic.com/apps/dota2/videos/dota_react/heroes/renders/puck.webm", name: "Puck" },
  ],
  },
  {
    id: "im_still_noob",
    nickname: "IM still Noob",
    realName: "",
    avatarUrl: "/avatars/default.jpg",
    seasonBadges: [],
    hasWonCup: false,

    
    

    currentMedalLabel: "",
    currentMedalId: "",
    peakMedalLabel: "",
    peakMedalId: "",

    bio: "",
    roles: [],

    steamUrl: "https://steamcommunity.com/profiles/76561198242832460",
    dotabuffUrl: "https://www.dotabuff.com/players/282566732",
    favoriteHeroes: [
    { videoSrc: "https://cdn.steamstatic.com/apps/dota2/videos/dota_react/heroes/renders/templar_assassin.webm", name: "Templar Assassin" },
    { videoSrc: "https://cdn.steamstatic.com/apps/dota2/videos/dota_react/heroes/renders/broodmother.webm", name: "Broodmother" },
    { videoSrc: "https://cdn.steamstatic.com/apps/dota2/videos/dota_react/heroes/renders/legion_commander.webm", name: "Legion Commander" },
  ],
  },
  {
    id: "porthos",
    nickname: "Porthos",
    realName: "",
    avatarUrl: "/avatars/default.jpg",
    seasonBadges: [],
    hasWonCup: false,

    
    

    currentMedalLabel: "",
    currentMedalId: "",
    peakMedalLabel: "",
    peakMedalId: "",

    bio: "",
    roles: [],

    steamUrl: "https://steamcommunity.com/profiles/76561198202259953",
    dotabuffUrl: "https://www.dotabuff.com/players/241994225",
    favoriteHeroes: [
    { videoSrc: "https://cdn.steamstatic.com/apps/dota2/videos/dota_react/heroes/renders/treant.webm", name: "Treant" },
    { videoSrc: "https://cdn.steamstatic.com/apps/dota2/videos/dota_react/heroes/renders/gyrocopter.webm", name: "Gyrocopter" },
    { videoSrc: "https://cdn.steamstatic.com/apps/dota2/videos/dota_react/heroes/renders/necrophos.webm", name: "Necrophos" },
  ],
  },
  {
    id: "s1mpleo",
    nickname: "S1mpleO",
    realName: "",
    avatarUrl: "/avatars/default.jpg",
    seasonBadges: [],
    hasWonCup: false,

    
    

    currentMedalLabel: "",
    currentMedalId: "",
    peakMedalLabel: "",
    peakMedalId: "",

    bio: "",
    roles: [],

    steamUrl: "https://steamcommunity.com/profiles/76561198111785158",
    dotabuffUrl: "https://www.dotabuff.com/players/151519430",
    favoriteHeroes: [
    { videoSrc: "https://cdn.steamstatic.com/apps/dota2/videos/dota_react/heroes/renders/axe.webm", name: "Axe" },
    { videoSrc: "https://cdn.steamstatic.com/apps/dota2/videos/dota_react/heroes/renders/medusa.webm", name: "Medusa" },
    { videoSrc: "https://cdn.steamstatic.com/apps/dota2/videos/dota_react/heroes/renders/chen.webm", name: "Chen" },
  ],
  },
  {
    id: "bapu",
    nickname: "BaPU",
    realName: "",
    avatarUrl: "/avatars/default.jpg",
    seasonBadges: [],
    hasWonCup: false,

    
    

    currentMedalLabel: "",
    currentMedalId: "",
    peakMedalLabel: "",
    peakMedalId: "",

    bio: "",
    roles: [],

    steamUrl: "https://steamcommunity.com/profiles/76561198320585919",
    dotabuffUrl: "https://www.dotabuff.com/players/360320191",
    favoriteHeroes: [
    { videoSrc: "https://cdn.steamstatic.com/apps/dota2/videos/dota_react/heroes/renders/enchantress.webm", name: "Enchantress" },
    { videoSrc: "https://cdn.steamstatic.com/apps/dota2/videos/dota_react/heroes/renders/undying.webm", name: "Undying" },
    { videoSrc: "https://cdn.steamstatic.com/apps/dota2/videos/dota_react/heroes/renders/kunkka.webm", name: "Kunkka" },
  ],
  },
  {
    id: "zai_7",
    nickname: "zai_7",
    realName: "",
    avatarUrl: "/avatars/default.jpg",
    seasonBadges: [],
    hasWonCup: false,

    
    

    currentMedalLabel: "",
    currentMedalId: "",
    peakMedalLabel: "",
    peakMedalId: "",

    bio: "",
    roles: [],

    steamUrl: "https://steamcommunity.com/profiles/76561197980242110",
    dotabuffUrl: "https://www.dotabuff.com/players/19976382",
    favoriteHeroes: [
    { videoSrc: "https://cdn.steamstatic.com/apps/dota2/videos/dota_react/heroes/renders/life_stealer.webm", name: "Life Stealer" },
    { videoSrc: "https://cdn.steamstatic.com/apps/dota2/videos/dota_react/heroes/renders/necrophos.webm", name: "Necrophos" },
    { videoSrc: "https://cdn.steamstatic.com/apps/dota2/videos/dota_react/heroes/renders/morphling.webm", name: "Morphling" },
  ],
  },
  {
    id: "terrorr",
    nickname: "TeRroRr",
    realName: "",
    avatarUrl: "/avatars/default.jpg",
    seasonBadges: [],
    hasWonCup: false,

    
    

    currentMedalLabel: "",
    currentMedalId: "",
    peakMedalLabel: "",
    peakMedalId: "",

    bio: "",
    roles: [],

    steamUrl: "https://steamcommunity.com/profiles/76561198117828891",
    dotabuffUrl: "https://www.dotabuff.com/players/157563163",
    favoriteHeroes: [
    { videoSrc: "https://cdn.steamstatic.com/apps/dota2/videos/dota_react/heroes/renders/necrophos.webm", name: "Necrophos" },
    { videoSrc: "https://cdn.steamstatic.com/apps/dota2/videos/dota_react/heroes/renders/skywrath_mage.webm", name: "Skywrath Mage" },
    { videoSrc: "https://cdn.steamstatic.com/apps/dota2/videos/dota_react/heroes/renders/bloodseeker.webm", name: "Bloodseeker" },
  ],
  },
  {
    id: "kunaka",
    nickname: "Kunaka",
    realName: "",
    avatarUrl: "/avatars/default.jpg",
    seasonBadges: [],
    hasWonCup: false,

    
    

    currentMedalLabel: "",
    currentMedalId: "",
    peakMedalLabel: "",
    peakMedalId: "",

    bio: "",
    roles: [],

    steamUrl: "https://steamcommunity.com/profiles/76561198259599149",
    dotabuffUrl: "https://www.dotabuff.com/players/299333421",
    favoriteHeroes: [
    { videoSrc: "https://cdn.steamstatic.com/apps/dota2/videos/dota_react/heroes/renders/beastmaster.webm", name: "Beastmaster" },
    { videoSrc: "https://cdn.steamstatic.com/apps/dota2/videos/dota_react/heroes/renders/obsidian_destroyer.webm", name: "Obsidian Destroyer" },
    { videoSrc: "https://cdn.steamstatic.com/apps/dota2/videos/dota_react/heroes/renders/arc_warden.webm", name: "Arc Warden" },
  ],
  },
  {
    id: "fade",
    nickname: "FADE",
    realName: "",
    avatarUrl: "/avatars/default.jpg",
    seasonBadges: [],
    hasWonCup: false,

    
    

    currentMedalLabel: "",
    currentMedalId: "",
    peakMedalLabel: "",
    peakMedalId: "",

    bio: "",
    roles: [],

    steamUrl: "https://steamcommunity.com/profiles/76561198207632437",
    dotabuffUrl: "https://www.dotabuff.com/players/247366709",
    favoriteHeroes: [
    { videoSrc: "https://cdn.steamstatic.com/apps/dota2/videos/dota_react/heroes/renders/ancient_apparition.webm", name: "Ancient Apparition" },
    { videoSrc: "https://cdn.steamstatic.com/apps/dota2/videos/dota_react/heroes/renders/dazzle.webm", name: "Dazzle" },
    { videoSrc: "https://cdn.steamstatic.com/apps/dota2/videos/dota_react/heroes/renders/mars.webm", name: "Mars" },
  ],
  },
  {
    id: "gotatch_captain",
    nickname: "Gotatch captain",
    realName: "",
    avatarUrl: "/avatars/default.jpg",
    seasonBadges: [],
    hasWonCup: false,

    
    

    currentMedalLabel: "",
    currentMedalId: "",
    peakMedalLabel: "",
    peakMedalId: "",

    bio: "",
    roles: [],

    steamUrl: "https://steamcommunity.com/profiles/76561198322673785",
    dotabuffUrl: "https://www.dotabuff.com/players/362408057",
    favoriteHeroes: [
    { videoSrc: "https://cdn.steamstatic.com/apps/dota2/videos/dota_react/heroes/renders/naga_siren.webm", name: "Naga Siren" },
    { videoSrc: "https://cdn.steamstatic.com/apps/dota2/videos/dota_react/heroes/renders/weaver.webm", name: "Weaver" },
    { videoSrc: "https://cdn.steamstatic.com/apps/dota2/videos/dota_react/heroes/renders/winter_wyvern.webm", name: "Winter Wyvern" },
  ],
  },
  {
    id: "zombie",
    nickname: "Zombie",
    realName: "",
    avatarUrl: "/avatars/default.jpg",
    seasonBadges: [],
    hasWonCup: false,

    
    

    currentMedalLabel: "",
    currentMedalId: "",
    peakMedalLabel: "",
    peakMedalId: "",

    bio: "",
    roles: [],

    steamUrl: "https://steamcommunity.com/profiles/76561198136696117",
    dotabuffUrl: "https://www.dotabuff.com/players/176430389",
    favoriteHeroes: [
    { videoSrc: "https://cdn.steamstatic.com/apps/dota2/videos/dota_react/heroes/renders/tidehunter.webm", name: "Tidehunter" },
    { videoSrc: "https://cdn.steamstatic.com/apps/dota2/videos/dota_react/heroes/renders/weaver.webm", name: "Weaver" },
    { videoSrc: "https://cdn.steamstatic.com/apps/dota2/videos/dota_react/heroes/renders/death_prophet.webm", name: "Death Prophet" },
  ],
  },
  {
    id: "lightning_goku",
    nickname: "LightNing Goku",
    realName: "",
    avatarUrl: "/avatars/default.jpg",
    seasonBadges: [],
    hasWonCup: false,

    
    

    currentMedalLabel: "",
    currentMedalId: "",
    peakMedalLabel: "",
    peakMedalId: "",

    bio: "",
    roles: [],

    steamUrl: "https://steamcommunity.com/profiles/76561198117014632",
    dotabuffUrl: "https://www.dotabuff.com/players/156748904",
    favoriteHeroes: [
    { videoSrc: "https://cdn.steamstatic.com/apps/dota2/videos/dota_react/heroes/renders/morphling.webm", name: "Morphling" },
    { videoSrc: "https://cdn.steamstatic.com/apps/dota2/videos/dota_react/heroes/renders/lone_druid.webm", name: "Lone Druid" },
    { videoSrc: "https://cdn.steamstatic.com/apps/dota2/videos/dota_react/heroes/renders/slark.webm", name: "Slark" },
  ],
  },
  {
    id: "foujii",
    nickname: "*Foujii",
    realName: "",
    avatarUrl: "/avatars/default.jpg",
    seasonBadges: [],
    hasWonCup: false,

    
    

    currentMedalLabel: "",
    currentMedalId: "",
    peakMedalLabel: "",
    peakMedalId: "",

    bio: "",
    roles: [],

    steamUrl: "https://steamcommunity.com/profiles/76561198254389672",
    dotabuffUrl: "https://www.dotabuff.com/players/294123944",
    favoriteHeroes: [
    { videoSrc: "https://cdn.steamstatic.com/apps/dota2/videos/dota_react/heroes/renders/meepo.webm", name: "Meepo" },
    { videoSrc: "https://cdn.steamstatic.com/apps/dota2/videos/dota_react/heroes/renders/natures_prophet.webm", name: "Natures Prophet" },
    { videoSrc: "https://cdn.steamstatic.com/apps/dota2/videos/dota_react/heroes/renders/centaur.webm", name: "Centaur" },
  ],
  },
  {
    id: "sejlur",
    nickname: "Sejlur",
    realName: "",
    avatarUrl: "/avatars/default.jpg",
    seasonBadges: [],
    hasWonCup: false,

    
    

    currentMedalLabel: "",
    currentMedalId: "",
    peakMedalLabel: "",
    peakMedalId: "",

    bio: "",
    roles: [],

    steamUrl: "https://steamcommunity.com/profiles/76561198047537854",
    dotabuffUrl: "https://www.dotabuff.com/players/87272126",
    favoriteHeroes: [
    { videoSrc: "https://cdn.steamstatic.com/apps/dota2/videos/dota_react/heroes/renders/lycan.webm", name: "Lycan" },
    { videoSrc: "https://cdn.steamstatic.com/apps/dota2/videos/dota_react/heroes/renders/phoenix.webm", name: "Phoenix" },
    { videoSrc: "https://cdn.steamstatic.com/apps/dota2/videos/dota_react/heroes/renders/nyx_assassin.webm", name: "Nyx Assassin" },
  ],
  },
  {
    id: "mr_pudge",
    nickname: "Mr Pudge",
    realName: "",
    avatarUrl: "/avatars/default.jpg",
    seasonBadges: [],
    hasWonCup: false,

    
    

    currentMedalLabel: "",
    currentMedalId: "",
    peakMedalLabel: "",
    peakMedalId: "",

    bio: "",
    roles: [],

    steamUrl: "https://steamcommunity.com/profiles/76561198332653736",
    dotabuffUrl: "https://www.dotabuff.com/players/372388008",
    favoriteHeroes: [
    { videoSrc: "https://cdn.steamstatic.com/apps/dota2/videos/dota_react/heroes/renders/ogre_magi.webm", name: "Ogre Magi" },
    { videoSrc: "https://cdn.steamstatic.com/apps/dota2/videos/dota_react/heroes/renders/dazzle.webm", name: "Dazzle" },
    { videoSrc: "https://cdn.steamstatic.com/apps/dota2/videos/dota_react/heroes/renders/mars.webm", name: "Mars" },
  ],
  },
  {
    id: "the_beast",
    nickname: "The Beast",
    realName: "",
    avatarUrl: "/avatars/default.jpg",
    seasonBadges: [],
    hasWonCup: false,

    
    

    currentMedalLabel: "",
    currentMedalId: "",
    peakMedalLabel: "",
    peakMedalId: "",

    bio: "",
    roles: [],

    steamUrl: "https://steamcommunity.com/profiles/76561198068707755",
    dotabuffUrl: "https://www.dotabuff.com/players/108442027",
    favoriteHeroes: [
    { videoSrc: "https://cdn.steamstatic.com/apps/dota2/videos/dota_react/heroes/renders/troll_warlord.webm", name: "Troll Warlord" },
    { videoSrc: "https://cdn.steamstatic.com/apps/dota2/videos/dota_react/heroes/renders/lion.webm", name: "Lion" },
    { videoSrc: "https://cdn.steamstatic.com/apps/dota2/videos/dota_react/heroes/renders/windrunner.webm", name: "Windrunner" },
  ],
  },
  {
    id: "tambamgod",
    nickname: "TamBamGOD",
    realName: "",
    avatarUrl: "/avatars/default.jpg",
    seasonBadges: [],
    hasWonCup: false,

    
    

    currentMedalLabel: "",
    currentMedalId: "",
    peakMedalLabel: "",
    peakMedalId: "",

    bio: "",
    roles: [],

    steamUrl: "https://steamcommunity.com/profiles/76561198290132443",
    dotabuffUrl: "https://www.dotabuff.com/players/329866715",
    favoriteHeroes: [
    { videoSrc: "https://cdn.steamstatic.com/apps/dota2/videos/dota_react/heroes/renders/terrorblade.webm", name: "Terrorblade" },
    { videoSrc: "https://cdn.steamstatic.com/apps/dota2/videos/dota_react/heroes/renders/ogre_magi.webm", name: "Ogre Magi" },
    { videoSrc: "https://cdn.steamstatic.com/apps/dota2/videos/dota_react/heroes/renders/kunkka.webm", name: "Kunkka" },
  ],
  },
  {
    id: "mgl",
    nickname: "MGL",
    realName: "",
    avatarUrl: "/avatars/default.jpg",
    seasonBadges: [],
    hasWonCup: false,

    
    

    currentMedalLabel: "",
    currentMedalId: "",
    peakMedalLabel: "",
    peakMedalId: "",

    bio: "",
    roles: [],

    steamUrl: "https://steamcommunity.com/profiles/76561199166345064",
    dotabuffUrl: "https://www.dotabuff.com/players/1206079336",
    favoriteHeroes: [
    { videoSrc: "https://cdn.steamstatic.com/apps/dota2/videos/dota_react/heroes/renders/crystal_maiden.webm", name: "Crystal Maiden" },
    { videoSrc: "https://cdn.steamstatic.com/apps/dota2/videos/dota_react/heroes/renders/dragon_knight.webm", name: "Dragon Knight" },
    { videoSrc: "https://cdn.steamstatic.com/apps/dota2/videos/dota_react/heroes/renders/sand_king.webm", name: "Sand King" },
  ],
  },
  {
    id: "eternal_bliz2ard",
    nickname: "Eternal_Bliz2ard",
    realName: "",
    avatarUrl: "/avatars/default.jpg",
    seasonBadges: [],
    hasWonCup: false,

    
    

    currentMedalLabel: "",
    currentMedalId: "",
    peakMedalLabel: "",
    peakMedalId: "",

    bio: "",
    roles: [],

    steamUrl: "https://steamcommunity.com/profiles/76561198350577268",
    dotabuffUrl: "https://www.dotabuff.com/players/390311540",
    favoriteHeroes: [
    { videoSrc: "https://cdn.steamstatic.com/apps/dota2/videos/dota_react/heroes/renders/night_stalker.webm", name: "Night Stalker" },
    { videoSrc: "https://cdn.steamstatic.com/apps/dota2/videos/dota_react/heroes/renders/undying.webm", name: "Undying" },
    { videoSrc: "https://cdn.steamstatic.com/apps/dota2/videos/dota_react/heroes/renders/mars.webm", name: "Mars" },
  ],
  },
  {
    id: "draco",
    nickname: "Draco~",
    realName: "",
    avatarUrl: "/avatars/default.jpg",
    seasonBadges: [],
    hasWonCup: false,

    
    

    currentMedalLabel: "",
    currentMedalId: "",
    peakMedalLabel: "",
    peakMedalId: "",

    bio: "",
    roles: [],

    steamUrl: "https://steamcommunity.com/profiles/76561198151377752",
    dotabuffUrl: "https://www.dotabuff.com/players/191112024",
    favoriteHeroes: [
    { videoSrc: "https://cdn.steamstatic.com/apps/dota2/videos/dota_react/heroes/renders/death_prophet.webm", name: "Death Prophet" },
    { videoSrc: "https://cdn.steamstatic.com/apps/dota2/videos/dota_react/heroes/renders/queenofpain.webm", name: "Queenofpain" },
    { videoSrc: "https://cdn.steamstatic.com/apps/dota2/videos/dota_react/heroes/renders/chen.webm", name: "Chen" },
  ],
  },
  {
    id: "anzu",
    nickname: "Anzu",
    realName: "",
    avatarUrl: "/avatars/default.jpg",
    seasonBadges: [],
    hasWonCup: false,

    
    

    currentMedalLabel: "",
    currentMedalId: "",
    peakMedalLabel: "",
    peakMedalId: "",

    bio: "",
    roles: [],

    steamUrl: "https://steamcommunity.com/profiles/76561199245515668",
    dotabuffUrl: "https://www.dotabuff.com/players/1285249940",
    favoriteHeroes: [
    { videoSrc: "https://cdn.steamstatic.com/apps/dota2/videos/dota_react/heroes/renders/templar_assassin.webm", name: "Templar Assassin" },
    { videoSrc: "https://cdn.steamstatic.com/apps/dota2/videos/dota_react/heroes/renders/ogre_magi.webm", name: "Ogre Magi" },
    { videoSrc: "https://cdn.steamstatic.com/apps/dota2/videos/dota_react/heroes/renders/winter_wyvern.webm", name: "Winter Wyvern" },
  ],
  },
  {
    id: "itus",
    nickname: "itus",
    realName: "",
    avatarUrl: "/avatars/default.jpg",
    seasonBadges: [],
    hasWonCup: false,

    
    

    currentMedalLabel: "",
    currentMedalId: "",
    peakMedalLabel: "",
    peakMedalId: "",

    bio: "",
    roles: [],

    steamUrl: "https://steamcommunity.com/profiles/76561198081824644",
    dotabuffUrl: "https://www.dotabuff.com/players/121558916",
    favoriteHeroes: [
    { videoSrc: "https://cdn.steamstatic.com/apps/dota2/videos/dota_react/heroes/renders/ember_spirit.webm", name: "Ember Spirit" },
    { videoSrc: "https://cdn.steamstatic.com/apps/dota2/videos/dota_react/heroes/renders/meepo.webm", name: "Meepo" },
    { videoSrc: "https://cdn.steamstatic.com/apps/dota2/videos/dota_react/heroes/renders/disruptor.webm", name: "Disruptor" },
  ],
  },
  {
    id: "boom",
    nickname: "BOOM",
    realName: "",
    avatarUrl: "/avatars/default.jpg",
    seasonBadges: [],
    hasWonCup: false,

    
    

    currentMedalLabel: "",
    currentMedalId: "",
    peakMedalLabel: "",
    peakMedalId: "",

    bio: "",
    roles: [],

    steamUrl: "https://steamcommunity.com/profiles/76561198973871305",
    dotabuffUrl: "https://www.dotabuff.com/players/1013605577",
    favoriteHeroes: [
    { videoSrc: "https://cdn.steamstatic.com/apps/dota2/videos/dota_react/heroes/renders/beastmaster.webm", name: "Beastmaster" },
    { videoSrc: "https://cdn.steamstatic.com/apps/dota2/videos/dota_react/heroes/renders/meepo.webm", name: "Meepo" },
    { videoSrc: "https://cdn.steamstatic.com/apps/dota2/videos/dota_react/heroes/renders/lion.webm", name: "Lion" },
  ],
  },
  {
    id: "razer",
    nickname: "Razer",
    realName: "",
    avatarUrl: "/avatars/default.jpg",
    seasonBadges: [],
    hasWonCup: false,

    
    

    currentMedalLabel: "",
    currentMedalId: "",
    peakMedalLabel: "",
    peakMedalId: "",

    bio: "",
    roles: [],

    steamUrl: "https://steamcommunity.com/profiles/76561198189550322",
    dotabuffUrl: "https://www.dotabuff.com/players/229284594",
    favoriteHeroes: [
    { videoSrc: "https://cdn.steamstatic.com/apps/dota2/videos/dota_react/heroes/renders/visage.webm", name: "Visage" },
    { videoSrc: "https://cdn.steamstatic.com/apps/dota2/videos/dota_react/heroes/renders/snapfire.webm", name: "Snapfire" },
    { videoSrc: "https://cdn.steamstatic.com/apps/dota2/videos/dota_react/heroes/renders/troll_warlord.webm", name: "Troll Warlord" },
  ],
  },
  {
    id: "dis_traction",
    nickname: "Dis.Traction",
    realName: "",
    avatarUrl: "/avatars/default.jpg",
    seasonBadges: [],
    hasWonCup: false,

    
    

    currentMedalLabel: "",
    currentMedalId: "",
    peakMedalLabel: "",
    peakMedalId: "",

    bio: "",
    roles: [],

    steamUrl: "https://steamcommunity.com/profiles/76561198114968522",
    dotabuffUrl: "https://www.dotabuff.com/players/154702794",
    favoriteHeroes: [
    { videoSrc: "https://cdn.steamstatic.com/apps/dota2/videos/dota_react/heroes/renders/chen.webm", name: "Chen" },
    { videoSrc: "https://cdn.steamstatic.com/apps/dota2/videos/dota_react/heroes/renders/lycan.webm", name: "Lycan" },
    { videoSrc: "https://cdn.steamstatic.com/apps/dota2/videos/dota_react/heroes/renders/meepo.webm", name: "Meepo" },
  ],
  },
  {
    id: "jimmy",
    nickname: "JiMmY#",
    realName: "",
    avatarUrl: "/avatars/default.jpg",
    seasonBadges: [],
    hasWonCup: false,

    
    

    currentMedalLabel: "",
    currentMedalId: "",
    peakMedalLabel: "",
    peakMedalId: "",

    bio: "",
    roles: [],

    steamUrl: "https://steamcommunity.com/profiles/76561198334942741",
    dotabuffUrl: "https://www.dotabuff.com/players/374677013",
    favoriteHeroes: [
    { videoSrc: "https://cdn.steamstatic.com/apps/dota2/videos/dota_react/heroes/renders/broodmother.webm", name: "Broodmother" },
    { videoSrc: "https://cdn.steamstatic.com/apps/dota2/videos/dota_react/heroes/renders/ancient_apparition.webm", name: "Ancient Apparition" },
    { videoSrc: "https://cdn.steamstatic.com/apps/dota2/videos/dota_react/heroes/renders/pugna.webm", name: "Pugna" },
  ],
  },
  {
    id: "muri",
    nickname: "Muri",
    realName: "",
    avatarUrl: "/avatars/default.jpg",
    seasonBadges: [],
    hasWonCup: false,

    
    

    currentMedalLabel: "",
    currentMedalId: "",
    peakMedalLabel: "",
    peakMedalId: "",

    bio: "",
    roles: [],

    steamUrl: "https://steamcommunity.com/profiles/76561198390575907",
    dotabuffUrl: "https://www.dotabuff.com/players/430310179",
    favoriteHeroes: [
    { videoSrc: "https://cdn.steamstatic.com/apps/dota2/videos/dota_react/heroes/renders/oracle.webm", name: "Oracle" },
    { videoSrc: "https://cdn.steamstatic.com/apps/dota2/videos/dota_react/heroes/renders/necrophos.webm", name: "Necrophos" },
    { videoSrc: "https://cdn.steamstatic.com/apps/dota2/videos/dota_react/heroes/renders/gyrocopter.webm", name: "Gyrocopter" },
  ],
  },
  {
    id: "bliss",
    nickname: "BlisS",
    realName: "",
    avatarUrl: "/avatars/default.jpg",
    seasonBadges: [],
    hasWonCup: false,

    
    

    currentMedalLabel: "",
    currentMedalId: "",
    peakMedalLabel: "",
    peakMedalId: "",

    bio: "",
    roles: [],

    steamUrl: "https://steamcommunity.com/profiles/76561199011354107",
    dotabuffUrl: "https://www.dotabuff.com/players/1051088379",
    favoriteHeroes: [
    { videoSrc: "https://cdn.steamstatic.com/apps/dota2/videos/dota_react/heroes/renders/queenofpain.webm", name: "Queenofpain" },
    { videoSrc: "https://cdn.steamstatic.com/apps/dota2/videos/dota_react/heroes/renders/omniknight.webm", name: "Omniknight" },
    { videoSrc: "https://cdn.steamstatic.com/apps/dota2/videos/dota_react/heroes/renders/monkey_king.webm", name: "Monkey King" },
  ],
  },
  {
    id: "skipper",
    nickname: "skipper",
    realName: "",
    avatarUrl: "/avatars/default.jpg",
    seasonBadges: [],
    hasWonCup: false,

    
    

    currentMedalLabel: "",
    currentMedalId: "",
    peakMedalLabel: "",
    peakMedalId: "",

    bio: "",
    roles: [],

    steamUrl: "https://steamcommunity.com/profiles/76561198180754487",
    dotabuffUrl: "https://www.dotabuff.com/players/220488759",
    favoriteHeroes: [
    { videoSrc: "https://cdn.steamstatic.com/apps/dota2/videos/dota_react/heroes/renders/wisp.webm", name: "Wisp" },
    { videoSrc: "https://cdn.steamstatic.com/apps/dota2/videos/dota_react/heroes/renders/omniknight.webm", name: "Omniknight" },
    { videoSrc: "https://cdn.steamstatic.com/apps/dota2/videos/dota_react/heroes/renders/disruptor.webm", name: "Disruptor" },
  ],
  },
  {
    id: "seedhemaut",
    nickname: "Seedhemaut",
    realName: "",
    avatarUrl: "/avatars/default.jpg",
    seasonBadges: [],
    hasWonCup: false,

    
    

    currentMedalLabel: "",
    currentMedalId: "",
    peakMedalLabel: "",
    peakMedalId: "",

    bio: "",
    roles: [],

    steamUrl: "https://steamcommunity.com/profiles/76561199045778662",
    dotabuffUrl: "https://www.dotabuff.com/players/1085512934",
    favoriteHeroes: [
    { videoSrc: "https://cdn.steamstatic.com/apps/dota2/videos/dota_react/heroes/renders/warlock.webm", name: "Warlock" },
    { videoSrc: "https://cdn.steamstatic.com/apps/dota2/videos/dota_react/heroes/renders/slardar.webm", name: "Slardar" },
    { videoSrc: "https://cdn.steamstatic.com/apps/dota2/videos/dota_react/heroes/renders/leshrac.webm", name: "Leshrac" },
  ],
  },
  {
    id: "maddened",
    nickname: "Maddened",
    realName: "",
    avatarUrl: "/avatars/default.jpg",
    seasonBadges: [],
    hasWonCup: false,

    
    

    currentMedalLabel: "",
    currentMedalId: "",
    peakMedalLabel: "",
    peakMedalId: "",

    bio: "",
    roles: [],

    steamUrl: "https://steamcommunity.com/profiles/76561198077906358",
    dotabuffUrl: "https://www.dotabuff.com/players/117640630",
    favoriteHeroes: [
    { videoSrc: "https://cdn.steamstatic.com/apps/dota2/videos/dota_react/heroes/renders/mars.webm", name: "Mars" },
    { videoSrc: "https://cdn.steamstatic.com/apps/dota2/videos/dota_react/heroes/renders/silencer.webm", name: "Silencer" },
    { videoSrc: "https://cdn.steamstatic.com/apps/dota2/videos/dota_react/heroes/renders/treant.webm", name: "Treant" },
  ],
  },
  {
    id: "zonark",
    nickname: "Zonark",
    realName: "",
    avatarUrl: "/avatars/default.jpg",
    seasonBadges: [],
    hasWonCup: false,

    
    

    currentMedalLabel: "",
    currentMedalId: "",
    peakMedalLabel: "",
    peakMedalId: "",

    bio: "",
    roles: [],

    steamUrl: "https://steamcommunity.com/profiles/76561199219352365",
    dotabuffUrl: "https://www.dotabuff.com/players/1259086637",
    favoriteHeroes: [
    { videoSrc: "https://cdn.steamstatic.com/apps/dota2/videos/dota_react/heroes/renders/nyx_assassin.webm", name: "Nyx Assassin" },
    { videoSrc: "https://cdn.steamstatic.com/apps/dota2/videos/dota_react/heroes/renders/riki.webm", name: "Riki" },
    { videoSrc: "https://cdn.steamstatic.com/apps/dota2/videos/dota_react/heroes/renders/phantom_assassin.webm", name: "Phantom Assassin" },
  ],
  },
  {
    id: "07_apple",
    nickname: "07 Apple",
    realName: "",
    avatarUrl: "/avatars/default.jpg",
    seasonBadges: [],
    hasWonCup: false,

    
    

    currentMedalLabel: "",
    currentMedalId: "",
    peakMedalLabel: "",
    peakMedalId: "",

    bio: "",
    roles: [],

    steamUrl: "https://steamcommunity.com/profiles/76561198105146154",
    dotabuffUrl: "https://www.dotabuff.com/players/144880426",
    favoriteHeroes: [
    { videoSrc: "https://cdn.steamstatic.com/apps/dota2/videos/dota_react/heroes/renders/silencer.webm", name: "Silencer" },
    { videoSrc: "https://cdn.steamstatic.com/apps/dota2/videos/dota_react/heroes/renders/axe.webm", name: "Axe" },
    { videoSrc: "https://cdn.steamstatic.com/apps/dota2/videos/dota_react/heroes/renders/grimstroke.webm", name: "Grimstroke" },
  ],
  },
  {
    id: "naruto",
    nickname: "Naruto",
    realName: "",
    avatarUrl: "/avatars/default.jpg",
    seasonBadges: [],
    hasWonCup: false,

    
    

    currentMedalLabel: "",
    currentMedalId: "",
    peakMedalLabel: "",
    peakMedalId: "",

    bio: "",
    roles: [],

    steamUrl: "https://steamcommunity.com/profiles/76561198351732682",
    dotabuffUrl: "https://www.dotabuff.com/players/391466954",
    favoriteHeroes: [
    { videoSrc: "https://cdn.steamstatic.com/apps/dota2/videos/dota_react/heroes/renders/clockwerk.webm", name: "Clockwerk" },
    { videoSrc: "https://cdn.steamstatic.com/apps/dota2/videos/dota_react/heroes/renders/lich.webm", name: "Lich" },
    { videoSrc: "https://cdn.steamstatic.com/apps/dota2/videos/dota_react/heroes/renders/huskar.webm", name: "Huskar" },
  ],
  },
  {
    id: "markeloff",
    nickname: "Markeloff",
    realName: "",
    avatarUrl: "/avatars/default.jpg",
    seasonBadges: [],
    hasWonCup: false,

    
    

    currentMedalLabel: "",
    currentMedalId: "",
    peakMedalLabel: "",
    peakMedalId: "",

    bio: "",
    roles: [],

    steamUrl: "https://steamcommunity.com/profiles/76561199713361554",
    dotabuffUrl: "https://www.dotabuff.com/players/1753095826",
    favoriteHeroes: [
    { videoSrc: "https://cdn.steamstatic.com/apps/dota2/videos/dota_react/heroes/renders/windrunner.webm", name: "Windrunner" },
    { videoSrc: "https://cdn.steamstatic.com/apps/dota2/videos/dota_react/heroes/renders/sand_king.webm", name: "Sand King" },
    { videoSrc: "https://cdn.steamstatic.com/apps/dota2/videos/dota_react/heroes/renders/brewmaster.webm", name: "Brewmaster" },
  ],
  },
  {
    id: "tintin000",
    nickname: "Tintin000",
    realName: "",
    avatarUrl: "/avatars/default.jpg",
    seasonBadges: [],
    hasWonCup: false,

    
    

    currentMedalLabel: "",
    currentMedalId: "",
    peakMedalLabel: "",
    peakMedalId: "",

    bio: "",
    roles: [],

    steamUrl: "https://steamcommunity.com/profiles/76561198813955149",
    dotabuffUrl: "https://www.dotabuff.com/players/853689421",
    favoriteHeroes: [
    { videoSrc: "https://cdn.steamstatic.com/apps/dota2/videos/dota_react/heroes/renders/necrophos.webm", name: "Necrophos" },
    { videoSrc: "https://cdn.steamstatic.com/apps/dota2/videos/dota_react/heroes/renders/clinkz.webm", name: "Clinkz" },
    { videoSrc: "https://cdn.steamstatic.com/apps/dota2/videos/dota_react/heroes/renders/antimage.webm", name: "Antimage" },
  ],
  },
  {
    id: "deathgods",
    nickname: "Deathgods",
    realName: "",
    avatarUrl: "/avatars/default.jpg",
    seasonBadges: [],
    hasWonCup: false,

    
    

    currentMedalLabel: "",
    currentMedalId: "",
    peakMedalLabel: "",
    peakMedalId: "",

    bio: "",
    roles: [],

    steamUrl: "https://steamcommunity.com/profiles/76561198378968295",
    dotabuffUrl: "https://www.dotabuff.com/players/418702567",
    favoriteHeroes: [
    { videoSrc: "https://cdn.steamstatic.com/apps/dota2/videos/dota_react/heroes/renders/lion.webm", name: "Lion" },
    { videoSrc: "https://cdn.steamstatic.com/apps/dota2/videos/dota_react/heroes/renders/phoenix.webm", name: "Phoenix" },
    { videoSrc: "https://cdn.steamstatic.com/apps/dota2/videos/dota_react/heroes/renders/visage.webm", name: "Visage" },
  ],
  },
  {
    id: "lala",
    nickname: "Lala",
    realName: "",
    avatarUrl: "/avatars/default.jpg",
    seasonBadges: [],
    hasWonCup: false,

    
    

    currentMedalLabel: "",
    currentMedalId: "",
    peakMedalLabel: "",
    peakMedalId: "",

    bio: "",
    roles: [],

    steamUrl: "https://steamcommunity.com/profiles/76561198322499979",
    dotabuffUrl: "https://www.dotabuff.com/players/362234251",
    favoriteHeroes: [
    { videoSrc: "https://cdn.steamstatic.com/apps/dota2/videos/dota_react/heroes/renders/phantom_lancer.webm", name: "Phantom Lancer" },
    { videoSrc: "https://cdn.steamstatic.com/apps/dota2/videos/dota_react/heroes/renders/tiny.webm", name: "Tiny" },
    { videoSrc: "https://cdn.steamstatic.com/apps/dota2/videos/dota_react/heroes/renders/grimstroke.webm", name: "Grimstroke" },
  ],
  },
  {
    id: "mask",
    nickname: "Mask",
    realName: "",
    avatarUrl: "/avatars/default.jpg",
    seasonBadges: [],
    hasWonCup: false,

    
    

    currentMedalLabel: "",
    currentMedalId: "",
    peakMedalLabel: "",
    peakMedalId: "",

    bio: "",
    roles: [],

    steamUrl: "https://steamcommunity.com/profiles/76561198108822781",
    dotabuffUrl: "https://www.dotabuff.com/players/148557053",
    favoriteHeroes: [
    { videoSrc: "https://cdn.steamstatic.com/apps/dota2/videos/dota_react/heroes/renders/medusa.webm", name: "Medusa" },
    { videoSrc: "https://cdn.steamstatic.com/apps/dota2/videos/dota_react/heroes/renders/monkey_king.webm", name: "Monkey King" },
    { videoSrc: "https://cdn.steamstatic.com/apps/dota2/videos/dota_react/heroes/renders/phoenix.webm", name: "Phoenix" },
  ],
  },
  {
    id: "plutoski",
    nickname: "plutoski",
    realName: "",
    avatarUrl: "/avatars/default.jpg",
    seasonBadges: [],
    hasWonCup: false,

    
    

    currentMedalLabel: "",
    currentMedalId: "",
    peakMedalLabel: "",
    peakMedalId: "",

    bio: "",
    roles: [],

    steamUrl: "https://steamcommunity.com/profiles/76561198047161874",
    dotabuffUrl: "https://www.dotabuff.com/players/86896146",
    favoriteHeroes: [
    { videoSrc: "https://cdn.steamstatic.com/apps/dota2/videos/dota_react/heroes/renders/spectre.webm", name: "Spectre" },
    { videoSrc: "https://cdn.steamstatic.com/apps/dota2/videos/dota_react/heroes/renders/riki.webm", name: "Riki" },
    { videoSrc: "https://cdn.steamstatic.com/apps/dota2/videos/dota_react/heroes/renders/lone_druid.webm", name: "Lone Druid" },
  ],
  },
  {
    id: "mind_flay3r",
    nickname: "Mind_Flay3R",
    realName: "",
    avatarUrl: "/avatars/default.jpg",
    seasonBadges: [],
    hasWonCup: false,

    
    

    currentMedalLabel: "",
    currentMedalId: "",
    peakMedalLabel: "",
    peakMedalId: "",

    bio: "",
    roles: [],

    steamUrl: "https://steamcommunity.com/profiles/76561198433204338",
    dotabuffUrl: "https://www.dotabuff.com/players/472938610",
    favoriteHeroes: [
    { videoSrc: "https://cdn.steamstatic.com/apps/dota2/videos/dota_react/heroes/renders/spirit_breaker.webm", name: "Spirit Breaker" },
    { videoSrc: "https://cdn.steamstatic.com/apps/dota2/videos/dota_react/heroes/renders/chen.webm", name: "Chen" },
    { videoSrc: "https://cdn.steamstatic.com/apps/dota2/videos/dota_react/heroes/renders/pugna.webm", name: "Pugna" },
  ],
  },
  {
    id: "toji_khan",
    nickname: "Toji Khan",
    realName: "",
    avatarUrl: "/avatars/default.jpg",
    seasonBadges: [],
    hasWonCup: false,

    
    

    currentMedalLabel: "",
    currentMedalId: "",
    peakMedalLabel: "",
    peakMedalId: "",

    bio: "",
    roles: [],

    steamUrl: "https://steamcommunity.com/profiles/76561198244311744",
    dotabuffUrl: "https://www.dotabuff.com/players/284046016",
    favoriteHeroes: [
    { videoSrc: "https://cdn.steamstatic.com/apps/dota2/videos/dota_react/heroes/renders/grimstroke.webm", name: "Grimstroke" },
    { videoSrc: "https://cdn.steamstatic.com/apps/dota2/videos/dota_react/heroes/renders/necrophos.webm", name: "Necrophos" },
    { videoSrc: "https://cdn.steamstatic.com/apps/dota2/videos/dota_react/heroes/renders/juggernaut.webm", name: "Juggernaut" },
  ],
  },
  {
    id: "vanara",
    nickname: "Vanara",
    realName: "",
    avatarUrl: "/avatars/default.jpg",
    seasonBadges: [],
    hasWonCup: false,

    
    

    currentMedalLabel: "",
    currentMedalId: "",
    peakMedalLabel: "",
    peakMedalId: "",

    bio: "",
    roles: [],

    steamUrl: "https://steamcommunity.com/profiles/76561198076358634",
    dotabuffUrl: "https://www.dotabuff.com/players/116092906",
    favoriteHeroes: [
    { videoSrc: "https://cdn.steamstatic.com/apps/dota2/videos/dota_react/heroes/renders/clockwerk.webm", name: "Clockwerk" },
    { videoSrc: "https://cdn.steamstatic.com/apps/dota2/videos/dota_react/heroes/renders/lina.webm", name: "Lina" },
    { videoSrc: "https://cdn.steamstatic.com/apps/dota2/videos/dota_react/heroes/renders/pangolier.webm", name: "Pangolier" },
  ],
  },
  {
    id: "chinigami",
    nickname: "Chinigami",
    realName: "",
    avatarUrl: "/avatars/default.jpg",
    seasonBadges: [],
    hasWonCup: false,

    
    

    currentMedalLabel: "",
    currentMedalId: "",
    peakMedalLabel: "",
    peakMedalId: "",

    bio: "",
    roles: [],

    steamUrl: "https://steamcommunity.com/profiles/76561198386122515",
    dotabuffUrl: "https://www.dotabuff.com/players/425856787",
    favoriteHeroes: [
    { videoSrc: "https://cdn.steamstatic.com/apps/dota2/videos/dota_react/heroes/renders/chen.webm", name: "Chen" },
    { videoSrc: "https://cdn.steamstatic.com/apps/dota2/videos/dota_react/heroes/renders/natures_prophet.webm", name: "Natures Prophet" },
    { videoSrc: "https://cdn.steamstatic.com/apps/dota2/videos/dota_react/heroes/renders/earthshaker.webm", name: "Earthshaker" },
  ],
  },
  {
    id: "maddy",
    nickname: "Maddy",
    realName: "",
    avatarUrl: "/avatars/default.jpg",
    seasonBadges: [],
    hasWonCup: false,

    
    

    currentMedalLabel: "",
    currentMedalId: "",
    peakMedalLabel: "",
    peakMedalId: "",

    bio: "",
    roles: [],

    steamUrl: "https://steamcommunity.com/profiles/76561198082130292",
    dotabuffUrl: "https://www.dotabuff.com/players/121864564",
    favoriteHeroes: [
    { videoSrc: "https://cdn.steamstatic.com/apps/dota2/videos/dota_react/heroes/renders/ember_spirit.webm", name: "Ember Spirit" },
    { videoSrc: "https://cdn.steamstatic.com/apps/dota2/videos/dota_react/heroes/renders/visage.webm", name: "Visage" },
    { videoSrc: "https://cdn.steamstatic.com/apps/dota2/videos/dota_react/heroes/renders/pangolier.webm", name: "Pangolier" },
  ],
  },
  {
    id: "asd",
    nickname: "Asd",
    realName: "",
    avatarUrl: "/avatars/default.jpg",
    seasonBadges: [],
    hasWonCup: false,

    
    

    currentMedalLabel: "",
    currentMedalId: "",
    peakMedalLabel: "",
    peakMedalId: "",

    bio: "",
    roles: [],

    steamUrl: "https://steamcommunity.com/profiles/76561198214252141",
    dotabuffUrl: "https://www.dotabuff.com/players/253986413",
    favoriteHeroes: [
    { videoSrc: "https://cdn.steamstatic.com/apps/dota2/videos/dota_react/heroes/renders/doom_bringer.webm", name: "Doom Bringer" },
    { videoSrc: "https://cdn.steamstatic.com/apps/dota2/videos/dota_react/heroes/renders/witch_doctor.webm", name: "Witch Doctor" },
    { videoSrc: "https://cdn.steamstatic.com/apps/dota2/videos/dota_react/heroes/renders/night_stalker.webm", name: "Night Stalker" },
  ],
  },
  {
    id: "rockrobin",
    nickname: "Rockrobin",
    realName: "",
    avatarUrl: "/avatars/default.jpg",
    seasonBadges: [],
    hasWonCup: false,

    
    

    currentMedalLabel: "",
    currentMedalId: "",
    peakMedalLabel: "",
    peakMedalId: "",

    bio: "",
    roles: [],

    steamUrl: "https://steamcommunity.com/profiles/76561198158529135",
    dotabuffUrl: "https://www.dotabuff.com/players/198263407",
    favoriteHeroes: [
    { videoSrc: "https://cdn.steamstatic.com/apps/dota2/videos/dota_react/heroes/renders/faceless_void.webm", name: "Faceless Void" },
    { videoSrc: "https://cdn.steamstatic.com/apps/dota2/videos/dota_react/heroes/renders/lycan.webm", name: "Lycan" },
    { videoSrc: "https://cdn.steamstatic.com/apps/dota2/videos/dota_react/heroes/renders/slardar.webm", name: "Slardar" },
  ],
  },
  {
    id: "dracarys",
    nickname: "Dracarys",
    realName: "",
    avatarUrl: "/avatars/default.jpg",
    seasonBadges: [],
    hasWonCup: false,

    
    

    currentMedalLabel: "",
    currentMedalId: "",
    peakMedalLabel: "",
    peakMedalId: "",

    bio: "",
    roles: [],

    steamUrl: "https://steamcommunity.com/profiles/76561198160588415",
    dotabuffUrl: "https://www.dotabuff.com/players/200322687",
    favoriteHeroes: [
    { videoSrc: "https://cdn.steamstatic.com/apps/dota2/videos/dota_react/heroes/renders/antimage.webm", name: "Antimage" },
    { videoSrc: "https://cdn.steamstatic.com/apps/dota2/videos/dota_react/heroes/renders/kunkka.webm", name: "Kunkka" },
    { videoSrc: "https://cdn.steamstatic.com/apps/dota2/videos/dota_react/heroes/renders/sniper.webm", name: "Sniper" },
  ],
  },
  {
    id: "shadow",
    nickname: "shadow",
    realName: "",
    avatarUrl: "/avatars/default.jpg",
    seasonBadges: [],
    hasWonCup: false,

    
    

    currentMedalLabel: "",
    currentMedalId: "",
    peakMedalLabel: "",
    peakMedalId: "",

    bio: "",
    roles: [],

    steamUrl: "https://steamcommunity.com/profiles/76561198117028430",
    dotabuffUrl: "https://www.dotabuff.com/players/156762702",
    favoriteHeroes: [
    { videoSrc: "https://cdn.steamstatic.com/apps/dota2/videos/dota_react/heroes/renders/visage.webm", name: "Visage" },
    { videoSrc: "https://cdn.steamstatic.com/apps/dota2/videos/dota_react/heroes/renders/shadow_demon.webm", name: "Shadow Demon" },
    { videoSrc: "https://cdn.steamstatic.com/apps/dota2/videos/dota_react/heroes/renders/queenofpain.webm", name: "Queenofpain" },
  ],
  },
  {
    id: "dp",
    nickname: "dp",
    realName: "",
    avatarUrl: "/avatars/default.jpg",
    seasonBadges: [],
    hasWonCup: false,

    
    

    currentMedalLabel: "",
    currentMedalId: "",
    peakMedalLabel: "",
    peakMedalId: "",

    bio: "",
    roles: [],

    steamUrl: "https://steamcommunity.com/profiles/76561198931002036",
    dotabuffUrl: "https://www.dotabuff.com/players/970736308",
    favoriteHeroes: [
    { videoSrc: "https://cdn.steamstatic.com/apps/dota2/videos/dota_react/heroes/renders/enchantress.webm", name: "Enchantress" },
    { videoSrc: "https://cdn.steamstatic.com/apps/dota2/videos/dota_react/heroes/renders/phantom_assassin.webm", name: "Phantom Assassin" },
    { videoSrc: "https://cdn.steamstatic.com/apps/dota2/videos/dota_react/heroes/renders/slark.webm", name: "Slark" },
  ],
  },
  {
    id: "ming",
    nickname: "Ming~ ^._.^",
    realName: "",
    avatarUrl: "/avatars/default.jpg",
    seasonBadges: [],
    hasWonCup: false,

    
    

    currentMedalLabel: "",
    currentMedalId: "",
    peakMedalLabel: "",
    peakMedalId: "",

    bio: "",
    roles: [],

    steamUrl: "https://steamcommunity.com/profiles/76561198084648453",
    dotabuffUrl: "https://www.dotabuff.com/players/124382725",
    favoriteHeroes: [
    { videoSrc: "https://cdn.steamstatic.com/apps/dota2/videos/dota_react/heroes/renders/shadow_fiend.webm", name: "Shadow Fiend" },
    { videoSrc: "https://cdn.steamstatic.com/apps/dota2/videos/dota_react/heroes/renders/legion_commander.webm", name: "Legion Commander" },
    { videoSrc: "https://cdn.steamstatic.com/apps/dota2/videos/dota_react/heroes/renders/dark_seer.webm", name: "Dark Seer" },
  ],
  },
  {
    id: "i_will_bully_u",
    nickname: "I will bully u",
    realName: "",
    avatarUrl: "/avatars/default.jpg",
    seasonBadges: [],
    hasWonCup: false,

    
    

    currentMedalLabel: "",
    currentMedalId: "",
    peakMedalLabel: "",
    peakMedalId: "",

    bio: "",
    roles: [],

    steamUrl: "https://steamcommunity.com/profiles/76561198287848090",
    dotabuffUrl: "https://www.dotabuff.com/players/327582362",
    favoriteHeroes: [
    { videoSrc: "https://cdn.steamstatic.com/apps/dota2/videos/dota_react/heroes/renders/natures_prophet.webm", name: "Natures Prophet" },
    { videoSrc: "https://cdn.steamstatic.com/apps/dota2/videos/dota_react/heroes/renders/meepo.webm", name: "Meepo" },
    { videoSrc: "https://cdn.steamstatic.com/apps/dota2/videos/dota_react/heroes/renders/death_prophet.webm", name: "Death Prophet" },
  ],
  },
  {
    id: "curserdterror",
    nickname: "CurserdTerror",
    realName: "",
    avatarUrl: "/avatars/default.jpg",
    seasonBadges: [],
    hasWonCup: false,

    
    

    currentMedalLabel: "",
    currentMedalId: "",
    peakMedalLabel: "",
    peakMedalId: "",

    bio: "",
    roles: [],

    steamUrl: "https://steamcommunity.com/profiles/76561198166103553",
    dotabuffUrl: "https://www.dotabuff.com/players/205837825",
    favoriteHeroes: [
    { videoSrc: "https://cdn.steamstatic.com/apps/dota2/videos/dota_react/heroes/renders/riki.webm", name: "Riki" },
    { videoSrc: "https://cdn.steamstatic.com/apps/dota2/videos/dota_react/heroes/renders/legion_commander.webm", name: "Legion Commander" },
    { videoSrc: "https://cdn.steamstatic.com/apps/dota2/videos/dota_react/heroes/renders/wisp.webm", name: "Wisp" },
  ],
  },
  {
    id: "sai",
    nickname: "Sai",
    realName: "",
    avatarUrl: "/avatars/default.jpg",
    seasonBadges: [],
    hasWonCup: false,

    
    

    currentMedalLabel: "",
    currentMedalId: "",
    peakMedalLabel: "",
    peakMedalId: "",

    bio: "",
    roles: [],

    steamUrl: "https://steamcommunity.com/profiles/76561198068047115",
    dotabuffUrl: "https://www.dotabuff.com/players/107781387",
    favoriteHeroes: [
    { videoSrc: "https://cdn.steamstatic.com/apps/dota2/videos/dota_react/heroes/renders/viper.webm", name: "Viper" },
    { videoSrc: "https://cdn.steamstatic.com/apps/dota2/videos/dota_react/heroes/renders/wisp.webm", name: "Wisp" },
    { videoSrc: "https://cdn.steamstatic.com/apps/dota2/videos/dota_react/heroes/renders/centaur.webm", name: "Centaur" },
  ],
  },
  {
    id: "xcarnation",
    nickname: "Xcarnation",
    realName: "",
    avatarUrl: "/avatars/default.jpg",
    seasonBadges: [],
    hasWonCup: false,

    
    

    currentMedalLabel: "",
    currentMedalId: "",
    peakMedalLabel: "",
    peakMedalId: "",

    bio: "",
    roles: [],

    steamUrl: "https://steamcommunity.com/profiles/76561198047008729",
    dotabuffUrl: "https://www.dotabuff.com/players/86743001",
    favoriteHeroes: [
    { videoSrc: "https://cdn.steamstatic.com/apps/dota2/videos/dota_react/heroes/renders/invoker.webm", name: "Invoker" },
    { videoSrc: "https://cdn.steamstatic.com/apps/dota2/videos/dota_react/heroes/renders/silencer.webm", name: "Silencer" },
    { videoSrc: "https://cdn.steamstatic.com/apps/dota2/videos/dota_react/heroes/renders/brewmaster.webm", name: "Brewmaster" },
  ],
  },
  {
    id: "echo_salami",
    nickname: "Echo Salami",
    realName: "",
    avatarUrl: "/avatars/default.jpg",
    seasonBadges: [],
    hasWonCup: false,

    
    

    currentMedalLabel: "",
    currentMedalId: "",
    peakMedalLabel: "",
    peakMedalId: "",

    bio: "",
    roles: [],

    steamUrl: "https://steamcommunity.com/profiles/76561198144438318",
    dotabuffUrl: "https://www.dotabuff.com/players/184172590",
    favoriteHeroes: [
    { videoSrc: "https://cdn.steamstatic.com/apps/dota2/videos/dota_react/heroes/renders/storm_spirit.webm", name: "Storm Spirit" },
    { videoSrc: "https://cdn.steamstatic.com/apps/dota2/videos/dota_react/heroes/renders/tusk.webm", name: "Tusk" },
    { videoSrc: "https://cdn.steamstatic.com/apps/dota2/videos/dota_react/heroes/renders/templar_assassin.webm", name: "Templar Assassin" },
  ],
  },
  {
    id: "m1p07",
    nickname: "m1p07",
    realName: "",
    avatarUrl: "/avatars/default.jpg",
    seasonBadges: [],
    hasWonCup: false,

    
    

    currentMedalLabel: "",
    currentMedalId: "",
    peakMedalLabel: "",
    peakMedalId: "",

    bio: "",
    roles: [],

    steamUrl: "https://steamcommunity.com/profiles/76561198175791819",
    dotabuffUrl: "https://www.dotabuff.com/players/215526091",
    favoriteHeroes: [
    { videoSrc: "https://cdn.steamstatic.com/apps/dota2/videos/dota_react/heroes/renders/ancient_apparition.webm", name: "Ancient Apparition" },
    { videoSrc: "https://cdn.steamstatic.com/apps/dota2/videos/dota_react/heroes/renders/kunkka.webm", name: "Kunkka" },
    { videoSrc: "https://cdn.steamstatic.com/apps/dota2/videos/dota_react/heroes/renders/death_prophet.webm", name: "Death Prophet" },
  ],
  },
  {
    id: "ome1r",
    nickname: "ome1r",
    realName: "",
    avatarUrl: "/avatars/default.jpg",
    seasonBadges: [],
    hasWonCup: false,

    
    

    currentMedalLabel: "",
    currentMedalId: "",
    peakMedalLabel: "",
    peakMedalId: "",

    bio: "",
    roles: [],

    steamUrl: "https://steamcommunity.com/profiles/76561198133064552",
    dotabuffUrl: "https://www.dotabuff.com/players/172798824",
    favoriteHeroes: [
    { videoSrc: "https://cdn.steamstatic.com/apps/dota2/videos/dota_react/heroes/renders/earthshaker.webm", name: "Earthshaker" },
    { videoSrc: "https://cdn.steamstatic.com/apps/dota2/videos/dota_react/heroes/renders/batrider.webm", name: "Batrider" },
    { videoSrc: "https://cdn.steamstatic.com/apps/dota2/videos/dota_react/heroes/renders/axe.webm", name: "Axe" },
  ],
  },
  {
    id: "zukegod",
    nickname: "ZukeGod",
    realName: "",
    avatarUrl: "/avatars/default.jpg",
    seasonBadges: [],
    hasWonCup: false,

    
    

    currentMedalLabel: "",
    currentMedalId: "",
    peakMedalLabel: "",
    peakMedalId: "",

    bio: "",
    roles: [],

    steamUrl: "https://steamcommunity.com/profiles/76561198054143997",
    dotabuffUrl: "https://www.dotabuff.com/players/93878269",
    favoriteHeroes: [
    { videoSrc: "https://cdn.steamstatic.com/apps/dota2/videos/dota_react/heroes/renders/ringmaster.webm", name: "Ringmaster" },
    { videoSrc: "https://cdn.steamstatic.com/apps/dota2/videos/dota_react/heroes/renders/lone_druid.webm", name: "Lone Druid" },
    { videoSrc: "https://cdn.steamstatic.com/apps/dota2/videos/dota_react/heroes/renders/weaver.webm", name: "Weaver" },
  ],
  },
  {
    id: "vexcon",
    nickname: "Vexcon",
    realName: "",
    avatarUrl: "/avatars/default.jpg",
    seasonBadges: [],
    hasWonCup: false,

    
    

    currentMedalLabel: "",
    currentMedalId: "",
    peakMedalLabel: "",
    peakMedalId: "",

    bio: "",
    roles: [],

    steamUrl: "https://steamcommunity.com/profiles/76561198186642209",
    dotabuffUrl: "https://www.dotabuff.com/players/226376481",
    favoriteHeroes: [
    { videoSrc: "https://cdn.steamstatic.com/apps/dota2/videos/dota_react/heroes/renders/dark_willow.webm", name: "Dark Willow" },
    { videoSrc: "https://cdn.steamstatic.com/apps/dota2/videos/dota_react/heroes/renders/enigma.webm", name: "Enigma" },
    { videoSrc: "https://cdn.steamstatic.com/apps/dota2/videos/dota_react/heroes/renders/morphling.webm", name: "Morphling" },
  ],
  },
  {
    id: "sexy",
    nickname: "Sexy",
    realName: "",
    avatarUrl: "/avatars/default.jpg",
    seasonBadges: [],
    hasWonCup: false,

    
    

    currentMedalLabel: "",
    currentMedalId: "",
    peakMedalLabel: "",
    peakMedalId: "",

    bio: "",
    roles: [],

    steamUrl: "https://steamcommunity.com/profiles/76561198168754602",
    dotabuffUrl: "https://www.dotabuff.com/players/208488874",
    favoriteHeroes: [
    { videoSrc: "https://cdn.steamstatic.com/apps/dota2/videos/dota_react/heroes/renders/legion_commander.webm", name: "Legion Commander" },
    { videoSrc: "https://cdn.steamstatic.com/apps/dota2/videos/dota_react/heroes/renders/faceless_void.webm", name: "Faceless Void" },
    { videoSrc: "https://cdn.steamstatic.com/apps/dota2/videos/dota_react/heroes/renders/undying.webm", name: "Undying" },
  ],
  },
  {
    id: "munna_lisa",
    nickname: "Munna Lisa",
    realName: "",
    avatarUrl: "/avatars/default.jpg",
    seasonBadges: [],
    hasWonCup: false,

    
    

    currentMedalLabel: "",
    currentMedalId: "",
    peakMedalLabel: "",
    peakMedalId: "",

    bio: "",
    roles: [],

    steamUrl: "https://steamcommunity.com/profiles/76561197967583758",
    dotabuffUrl: "https://www.dotabuff.com/players/7318030",
    favoriteHeroes: [
    { videoSrc: "https://cdn.steamstatic.com/apps/dota2/videos/dota_react/heroes/renders/weaver.webm", name: "Weaver" },
    { videoSrc: "https://cdn.steamstatic.com/apps/dota2/videos/dota_react/heroes/renders/dawnbreaker.webm", name: "Dawnbreaker" },
    { videoSrc: "https://cdn.steamstatic.com/apps/dota2/videos/dota_react/heroes/renders/broodmother.webm", name: "Broodmother" },
  ],
  },
  {
    id: "enjoyer",
    nickname: "Enjoyer",
    realName: "",
    avatarUrl: "/avatars/default.jpg",
    seasonBadges: [],
    hasWonCup: false,

    
    

    currentMedalLabel: "",
    currentMedalId: "",
    peakMedalLabel: "",
    peakMedalId: "",

    bio: "",
    roles: [],

    steamUrl: "https://steamcommunity.com/profiles/76561198094855757",
    dotabuffUrl: "https://www.dotabuff.com/players/134590029",
    favoriteHeroes: [
    { videoSrc: "https://cdn.steamstatic.com/apps/dota2/videos/dota_react/heroes/renders/lich.webm", name: "Lich" },
    { videoSrc: "https://cdn.steamstatic.com/apps/dota2/videos/dota_react/heroes/renders/chaos_knight.webm", name: "Chaos Knight" },
    { videoSrc: "https://cdn.steamstatic.com/apps/dota2/videos/dota_react/heroes/renders/mars.webm", name: "Mars" },
  ],
  },
  {
    id: "kfp",
    nickname: "KFP",
    realName: "",
    avatarUrl: "/avatars/default.jpg",
    seasonBadges: [],
    hasWonCup: false,

    
    

    currentMedalLabel: "",
    currentMedalId: "",
    peakMedalLabel: "",
    peakMedalId: "",

    bio: "",
    roles: [],

    steamUrl: "https://steamcommunity.com/profiles/76561198371739829",
    dotabuffUrl: "https://www.dotabuff.com/players/411474101",
    favoriteHeroes: [
    { videoSrc: "https://cdn.steamstatic.com/apps/dota2/videos/dota_react/heroes/renders/morphling.webm", name: "Morphling" },
    { videoSrc: "https://cdn.steamstatic.com/apps/dota2/videos/dota_react/heroes/renders/broodmother.webm", name: "Broodmother" },
    { videoSrc: "https://cdn.steamstatic.com/apps/dota2/videos/dota_react/heroes/renders/brewmaster.webm", name: "Brewmaster" },
  ],
  },
  {
    id: "subversion",
    nickname: "SUBVERSION",
    realName: "",
    avatarUrl: "/avatars/default.jpg",
    seasonBadges: [],
    hasWonCup: false,

    
    

    currentMedalLabel: "",
    currentMedalId: "",
    peakMedalLabel: "",
    peakMedalId: "",

    bio: "",
    roles: [],

    steamUrl: "https://steamcommunity.com/profiles/76561198353666149",
    dotabuffUrl: "https://www.dotabuff.com/players/393400421",
    favoriteHeroes: [
    { videoSrc: "https://cdn.steamstatic.com/apps/dota2/videos/dota_react/heroes/renders/necrophos.webm", name: "Necrophos" },
    { videoSrc: "https://cdn.steamstatic.com/apps/dota2/videos/dota_react/heroes/renders/alchemist.webm", name: "Alchemist" },
    { videoSrc: "https://cdn.steamstatic.com/apps/dota2/videos/dota_react/heroes/renders/oracle.webm", name: "Oracle" },
  ],
  },
  {
    id: "hero_for_fun",
    nickname: "Hero for Fun!",
    realName: "",
    avatarUrl: "/avatars/default.jpg",
    seasonBadges: [],
    hasWonCup: false,

    
    

    currentMedalLabel: "",
    currentMedalId: "",
    peakMedalLabel: "",
    peakMedalId: "",

    bio: "",
    roles: [],

    steamUrl: "https://steamcommunity.com/profiles/76561198350173346",
    dotabuffUrl: "https://www.dotabuff.com/players/389907618",
    favoriteHeroes: [
    { videoSrc: "https://cdn.steamstatic.com/apps/dota2/videos/dota_react/heroes/renders/underlord.webm", name: "Underlord" },
    { videoSrc: "https://cdn.steamstatic.com/apps/dota2/videos/dota_react/heroes/renders/life_stealer.webm", name: "Life Stealer" },
    { videoSrc: "https://cdn.steamstatic.com/apps/dota2/videos/dota_react/heroes/renders/dark_seer.webm", name: "Dark Seer" },
  ],
  },
  {
    id: "bomberman",
    nickname: "Bomberman™",
    realName: "",
    avatarUrl: "/avatars/default.jpg",
    seasonBadges: [],
    hasWonCup: false,

    
    

    currentMedalLabel: "",
    currentMedalId: "",
    peakMedalLabel: "",
    peakMedalId: "",

    bio: "",
    roles: [],

    steamUrl: "https://steamcommunity.com/profiles/76561198193258895",
    dotabuffUrl: "https://www.dotabuff.com/players/232993167",
    favoriteHeroes: [
    { videoSrc: "https://cdn.steamstatic.com/apps/dota2/videos/dota_react/heroes/renders/broodmother.webm", name: "Broodmother" },
    { videoSrc: "https://cdn.steamstatic.com/apps/dota2/videos/dota_react/heroes/renders/tiny.webm", name: "Tiny" },
    { videoSrc: "https://cdn.steamstatic.com/apps/dota2/videos/dota_react/heroes/renders/warlock.webm", name: "Warlock" },
  ],
  },
  {
    id: "mystic_bolt",
    nickname: "Mystic_Bolt",
    realName: "",
    avatarUrl: "/avatars/default.jpg",
    seasonBadges: [],
    hasWonCup: false,

    
    

    currentMedalLabel: "",
    currentMedalId: "",
    peakMedalLabel: "",
    peakMedalId: "",

    bio: "",
    roles: [],

    steamUrl: "https://steamcommunity.com/profiles/76561198041898419",
    dotabuffUrl: "https://www.dotabuff.com/players/81632691",
    favoriteHeroes: [
    { videoSrc: "https://cdn.steamstatic.com/apps/dota2/videos/dota_react/heroes/renders/medusa.webm", name: "Medusa" },
    { videoSrc: "https://cdn.steamstatic.com/apps/dota2/videos/dota_react/heroes/renders/chen.webm", name: "Chen" },
    { videoSrc: "https://cdn.steamstatic.com/apps/dota2/videos/dota_react/heroes/renders/pangolier.webm", name: "Pangolier" },
  ],
  },
  {
    id: "topuria_enjoyer",
    nickname: "topuria enjoyer",
    realName: "",
    avatarUrl: "/avatars/default.jpg",
    seasonBadges: [],
    hasWonCup: false,

    
    

    currentMedalLabel: "",
    currentMedalId: "",
    peakMedalLabel: "",
    peakMedalId: "",

    bio: "",
    roles: [],

    steamUrl: "https://steamcommunity.com/profiles/76561198862247886",
    dotabuffUrl: "https://www.dotabuff.com/players/901982158",
    favoriteHeroes: [
    { videoSrc: "https://cdn.steamstatic.com/apps/dota2/videos/dota_react/heroes/renders/earthshaker.webm", name: "Earthshaker" },
    { videoSrc: "https://cdn.steamstatic.com/apps/dota2/videos/dota_react/heroes/renders/axe.webm", name: "Axe" },
    { videoSrc: "https://cdn.steamstatic.com/apps/dota2/videos/dota_react/heroes/renders/shadow_demon.webm", name: "Shadow Demon" },
  ],
  },
  {
    id: "cd_lostfromlight",
    nickname: "CD.LostfromLight",
    realName: "",
    avatarUrl: "/avatars/default.jpg",
    seasonBadges: [],
    hasWonCup: false,

    
    

    currentMedalLabel: "",
    currentMedalId: "",
    peakMedalLabel: "",
    peakMedalId: "",

    bio: "",
    roles: [],

    steamUrl: "https://steamcommunity.com/profiles/76561198414427034",
    dotabuffUrl: "https://www.dotabuff.com/players/454161306",
    favoriteHeroes: [
    { videoSrc: "https://cdn.steamstatic.com/apps/dota2/videos/dota_react/heroes/renders/leshrac.webm", name: "Leshrac" },
    { videoSrc: "https://cdn.steamstatic.com/apps/dota2/videos/dota_react/heroes/renders/ember_spirit.webm", name: "Ember Spirit" },
    { videoSrc: "https://cdn.steamstatic.com/apps/dota2/videos/dota_react/heroes/renders/monkey_king.webm", name: "Monkey King" },
  ],
  },
  {
    id: "midas",
    nickname: "Midas",
    realName: "",
    avatarUrl: "/avatars/default.jpg",
    seasonBadges: [],
    hasWonCup: false,

    
    

    currentMedalLabel: "",
    currentMedalId: "",
    peakMedalLabel: "",
    peakMedalId: "",

    bio: "",
    roles: [],

    steamUrl: "https://steamcommunity.com/profiles/76561198302708950",
    dotabuffUrl: "https://www.dotabuff.com/players/342443222",
    favoriteHeroes: [
    { videoSrc: "https://cdn.steamstatic.com/apps/dota2/videos/dota_react/heroes/renders/clinkz.webm", name: "Clinkz" },
    { videoSrc: "https://cdn.steamstatic.com/apps/dota2/videos/dota_react/heroes/renders/monkey_king.webm", name: "Monkey King" },
    { videoSrc: "https://cdn.steamstatic.com/apps/dota2/videos/dota_react/heroes/renders/arc_warden.webm", name: "Arc Warden" },
  ],
  },
  {
    id: "luciferrocker",
    nickname: "LUCIFERROCKER",
    realName: "",
    avatarUrl: "/avatars/default.jpg",
    seasonBadges: [],
    hasWonCup: false,

    
    

    currentMedalLabel: "",
    currentMedalId: "",
    peakMedalLabel: "",
    peakMedalId: "",

    bio: "",
    roles: [],

    steamUrl: "https://steamcommunity.com/profiles/76561198289724568",
    dotabuffUrl: "https://www.dotabuff.com/players/329458840",
    favoriteHeroes: [
    { videoSrc: "https://cdn.steamstatic.com/apps/dota2/videos/dota_react/heroes/renders/disruptor.webm", name: "Disruptor" },
    { videoSrc: "https://cdn.steamstatic.com/apps/dota2/videos/dota_react/heroes/renders/treant.webm", name: "Treant" },
    { videoSrc: "https://cdn.steamstatic.com/apps/dota2/videos/dota_react/heroes/renders/tinker.webm", name: "Tinker" },
  ],
  },
  {
    id: "f_x",
    nickname: "F(x)",
    realName: "",
    avatarUrl: "/avatars/default.jpg",
    seasonBadges: [],
    hasWonCup: false,

    
    

    currentMedalLabel: "",
    currentMedalId: "",
    peakMedalLabel: "",
    peakMedalId: "",

    bio: "",
    roles: [],

    steamUrl: "https://steamcommunity.com/profiles/76561198150397483",
    dotabuffUrl: "https://www.dotabuff.com/players/190131755",
    favoriteHeroes: [
    { videoSrc: "https://cdn.steamstatic.com/apps/dota2/videos/dota_react/heroes/renders/nyx_assassin.webm", name: "Nyx Assassin" },
    { videoSrc: "https://cdn.steamstatic.com/apps/dota2/videos/dota_react/heroes/renders/sand_king.webm", name: "Sand King" },
    { videoSrc: "https://cdn.steamstatic.com/apps/dota2/videos/dota_react/heroes/renders/medusa.webm", name: "Medusa" },
  ],
  },
  {
    id: "yt_jnjishnu",
    nickname: "yt/JNJISHNU",
    realName: "",
    avatarUrl: "/avatars/default.jpg",
    seasonBadges: [],
    hasWonCup: false,

    
    

    currentMedalLabel: "",
    currentMedalId: "",
    peakMedalLabel: "",
    peakMedalId: "",

    bio: "",
    roles: [],

    steamUrl: "https://steamcommunity.com/profiles/76561198254530768",
    dotabuffUrl: "https://www.dotabuff.com/players/294265040",
    favoriteHeroes: [
    { videoSrc: "https://cdn.steamstatic.com/apps/dota2/videos/dota_react/heroes/renders/medusa.webm", name: "Medusa" },
    { videoSrc: "https://cdn.steamstatic.com/apps/dota2/videos/dota_react/heroes/renders/meepo.webm", name: "Meepo" },
    { videoSrc: "https://cdn.steamstatic.com/apps/dota2/videos/dota_react/heroes/renders/treant.webm", name: "Treant" },
  ],
  },
  {
    id: "dean",
    nickname: "DEAN",
    realName: "",
    avatarUrl: "/avatars/default.jpg",
    seasonBadges: [],
    hasWonCup: false,

    
    

    currentMedalLabel: "",
    currentMedalId: "",
    peakMedalLabel: "",
    peakMedalId: "",

    bio: "",
    roles: [],

    steamUrl: "https://steamcommunity.com/profiles/76561198059411294",
    dotabuffUrl: "https://www.dotabuff.com/players/99145566",
    favoriteHeroes: [
    { videoSrc: "https://cdn.steamstatic.com/apps/dota2/videos/dota_react/heroes/renders/huskar.webm", name: "Huskar" },
    { videoSrc: "https://cdn.steamstatic.com/apps/dota2/videos/dota_react/heroes/renders/dark_willow.webm", name: "Dark Willow" },
    { videoSrc: "https://cdn.steamstatic.com/apps/dota2/videos/dota_react/heroes/renders/tusk.webm", name: "Tusk" },
  ],
  },
  {
    id: "younoob",
    nickname: "YOUNOOB",
    realName: "",
    avatarUrl: "/avatars/default.jpg",
    seasonBadges: [],
    hasWonCup: false,

    
    

    currentMedalLabel: "",
    currentMedalId: "",
    peakMedalLabel: "",
    peakMedalId: "",

    bio: "",
    roles: [],

    steamUrl: "https://steamcommunity.com/profiles/76561198369505601",
    dotabuffUrl: "https://www.dotabuff.com/players/409239873",
    favoriteHeroes: [
    { videoSrc: "https://cdn.steamstatic.com/apps/dota2/videos/dota_react/heroes/renders/vengefulspirit.webm", name: "Vengefulspirit" },
    { videoSrc: "https://cdn.steamstatic.com/apps/dota2/videos/dota_react/heroes/renders/razor.webm", name: "Razor" },
    { videoSrc: "https://cdn.steamstatic.com/apps/dota2/videos/dota_react/heroes/renders/obsidian_destroyer.webm", name: "Obsidian Destroyer" },
  ],
  },
  {
    id: "jhamkuanna",
    nickname: "jhamkuanna",
    realName: "",
    avatarUrl: "/avatars/default.jpg",
    seasonBadges: [],
    hasWonCup: false,

    
    

    currentMedalLabel: "",
    currentMedalId: "",
    peakMedalLabel: "",
    peakMedalId: "",

    bio: "",
    roles: [],

    steamUrl: "https://steamcommunity.com/profiles/76561198078162250",
    dotabuffUrl: "https://www.dotabuff.com/players/117896522",
    favoriteHeroes: [
    { videoSrc: "https://cdn.steamstatic.com/apps/dota2/videos/dota_react/heroes/renders/natures_prophet.webm", name: "Natures Prophet" },
    { videoSrc: "https://cdn.steamstatic.com/apps/dota2/videos/dota_react/heroes/renders/monkey_king.webm", name: "Monkey King" },
    { videoSrc: "https://cdn.steamstatic.com/apps/dota2/videos/dota_react/heroes/renders/earthshaker.webm", name: "Earthshaker" },
  ],
  },
  {
    id: "kungfupanda",
    nickname: "✪KungFuPanda",
    realName: "",
    avatarUrl: "/avatars/default.jpg",
    seasonBadges: [],
    hasWonCup: false,

    
    

    currentMedalLabel: "",
    currentMedalId: "",
    peakMedalLabel: "",
    peakMedalId: "",

    bio: "",
    roles: [],

    steamUrl: "https://steamcommunity.com/profiles/76561198390800289",
    dotabuffUrl: "https://www.dotabuff.com/players/430534561",
    favoriteHeroes: [
    { videoSrc: "https://cdn.steamstatic.com/apps/dota2/videos/dota_react/heroes/renders/meepo.webm", name: "Meepo" },
    { videoSrc: "https://cdn.steamstatic.com/apps/dota2/videos/dota_react/heroes/renders/lich.webm", name: "Lich" },
    { videoSrc: "https://cdn.steamstatic.com/apps/dota2/videos/dota_react/heroes/renders/brewmaster.webm", name: "Brewmaster" },
  ],
  },
  {
    id: "lily",
    nickname: "Lily",
    realName: "",
    avatarUrl: "/avatars/default.jpg",
    seasonBadges: [],
    hasWonCup: false,

    
    

    currentMedalLabel: "",
    currentMedalId: "",
    peakMedalLabel: "",
    peakMedalId: "",

    bio: "",
    roles: [],

    steamUrl: "https://steamcommunity.com/profiles/76561199151767706",
    dotabuffUrl: "https://www.dotabuff.com/players/1191501978",
    favoriteHeroes: [
    { videoSrc: "https://cdn.steamstatic.com/apps/dota2/videos/dota_react/heroes/renders/snapfire.webm", name: "Snapfire" },
    { videoSrc: "https://cdn.steamstatic.com/apps/dota2/videos/dota_react/heroes/renders/bloodseeker.webm", name: "Bloodseeker" },
    { videoSrc: "https://cdn.steamstatic.com/apps/dota2/videos/dota_react/heroes/renders/alchemist.webm", name: "Alchemist" },
  ],
  },
  {
    id: "sasuke",
    nickname: "Sasuke",
    realName: "",
    avatarUrl: "/avatars/default.jpg",
    seasonBadges: [],
    hasWonCup: false,

    
    

    currentMedalLabel: "",
    currentMedalId: "",
    peakMedalLabel: "",
    peakMedalId: "",

    bio: "",
    roles: [],

    steamUrl: "https://steamcommunity.com/profiles/76561199080961534",
    dotabuffUrl: "https://www.dotabuff.com/players/1120695806",
    favoriteHeroes: [
    { videoSrc: "https://cdn.steamstatic.com/apps/dota2/videos/dota_react/heroes/renders/dark_seer.webm", name: "Dark Seer" },
    { videoSrc: "https://cdn.steamstatic.com/apps/dota2/videos/dota_react/heroes/renders/snapfire.webm", name: "Snapfire" },
    { videoSrc: "https://cdn.steamstatic.com/apps/dota2/videos/dota_react/heroes/renders/brewmaster.webm", name: "Brewmaster" },
  ],
  },
  {
    id: "yoko",
    nickname: "Yoko",
    realName: "",
    avatarUrl: "/avatars/default.jpg",
    seasonBadges: [],
    hasWonCup: false,

    
    

    currentMedalLabel: "",
    currentMedalId: "",
    peakMedalLabel: "",
    peakMedalId: "",

    bio: "",
    roles: [],

    steamUrl: "https://steamcommunity.com/profiles/76561198820297026",
    dotabuffUrl: "https://www.dotabuff.com/players/860031298",
    favoriteHeroes: [
    { videoSrc: "https://cdn.steamstatic.com/apps/dota2/videos/dota_react/heroes/renders/natures_prophet.webm", name: "Natures Prophet" },
    { videoSrc: "https://cdn.steamstatic.com/apps/dota2/videos/dota_react/heroes/renders/lycan.webm", name: "Lycan" },
    { videoSrc: "https://cdn.steamstatic.com/apps/dota2/videos/dota_react/heroes/renders/obsidian_destroyer.webm", name: "Obsidian Destroyer" },
  ],
  },
  {
    id: "hunter",
    nickname: "Hunter",
    realName: "",
    avatarUrl: "/avatars/default.jpg",
    seasonBadges: [],
    hasWonCup: false,

    
    

    currentMedalLabel: "",
    currentMedalId: "",
    peakMedalLabel: "",
    peakMedalId: "",

    bio: "",
    roles: [],

    steamUrl: "https://steamcommunity.com/profiles/76561198073507265",
    dotabuffUrl: "https://www.dotabuff.com/players/113241537",
    favoriteHeroes: [
    { videoSrc: "https://cdn.steamstatic.com/apps/dota2/videos/dota_react/heroes/renders/sniper.webm", name: "Sniper" },
    { videoSrc: "https://cdn.steamstatic.com/apps/dota2/videos/dota_react/heroes/renders/ancient_apparition.webm", name: "Ancient Apparition" },
    { videoSrc: "https://cdn.steamstatic.com/apps/dota2/videos/dota_react/heroes/renders/alchemist.webm", name: "Alchemist" },
  ],
  },
  {
    id: "zet",
    nickname: "ZeT",
    realName: "",
    avatarUrl: "/avatars/default.jpg",
    seasonBadges: [],
    hasWonCup: false,

    
    

    currentMedalLabel: "",
    currentMedalId: "",
    peakMedalLabel: "",
    peakMedalId: "",

    bio: "",
    roles: [],

    steamUrl: "https://steamcommunity.com/profiles/76561198319039061",
    dotabuffUrl: "https://www.dotabuff.com/players/358773333",
    favoriteHeroes: [
    { videoSrc: "https://cdn.steamstatic.com/apps/dota2/videos/dota_react/heroes/renders/dawnbreaker.webm", name: "Dawnbreaker" },
    { videoSrc: "https://cdn.steamstatic.com/apps/dota2/videos/dota_react/heroes/renders/bane.webm", name: "Bane" },
    { videoSrc: "https://cdn.steamstatic.com/apps/dota2/videos/dota_react/heroes/renders/batrider.webm", name: "Batrider" },
  ],
  },
  {
    id: "impeccable",
    nickname: "Impeccable",
    realName: "",
    avatarUrl: "/avatars/default.jpg",
    seasonBadges: [],
    hasWonCup: false,

    
    

    currentMedalLabel: "",
    currentMedalId: "",
    peakMedalLabel: "",
    peakMedalId: "",

    bio: "",
    roles: [],

    steamUrl: "https://steamcommunity.com/profiles/76561198100030137",
    dotabuffUrl: "https://www.dotabuff.com/players/139764409",
    favoriteHeroes: [
    { videoSrc: "https://cdn.steamstatic.com/apps/dota2/videos/dota_react/heroes/renders/lich.webm", name: "Lich" },
    { videoSrc: "https://cdn.steamstatic.com/apps/dota2/videos/dota_react/heroes/renders/pangolier.webm", name: "Pangolier" },
    { videoSrc: "https://cdn.steamstatic.com/apps/dota2/videos/dota_react/heroes/renders/void_spirit.webm", name: "Void Spirit" },
  ],
  },
  {
    id: "tadi_uncle",
    nickname: "tadi_uncle",
    realName: "",
    avatarUrl: "/avatars/default.jpg",
    seasonBadges: [],
    hasWonCup: false,

    
    

    currentMedalLabel: "",
    currentMedalId: "",
    peakMedalLabel: "",
    peakMedalId: "",

    bio: "",
    roles: [],

    steamUrl: "https://steamcommunity.com/profiles/76561199195657578",
    dotabuffUrl: "https://www.dotabuff.com/players/1235391850",
    favoriteHeroes: [
    { videoSrc: "https://cdn.steamstatic.com/apps/dota2/videos/dota_react/heroes/renders/undying.webm", name: "Undying" },
    { videoSrc: "https://cdn.steamstatic.com/apps/dota2/videos/dota_react/heroes/renders/treant.webm", name: "Treant" },
    { videoSrc: "https://cdn.steamstatic.com/apps/dota2/videos/dota_react/heroes/renders/enchantress.webm", name: "Enchantress" },
  ],
  },
  {
    id: "u_from_miri",
    nickname: "U from miri",
    realName: "",
    avatarUrl: "/avatars/default.jpg",
    seasonBadges: [],
    hasWonCup: false,

    
    

    currentMedalLabel: "",
    currentMedalId: "",
    peakMedalLabel: "",
    peakMedalId: "",

    bio: "",
    roles: [],

    steamUrl: "https://steamcommunity.com/profiles/76561198328888387",
    dotabuffUrl: "https://www.dotabuff.com/players/368622659",
    favoriteHeroes: [
    { videoSrc: "https://cdn.steamstatic.com/apps/dota2/videos/dota_react/heroes/renders/dark_willow.webm", name: "Dark Willow" },
    { videoSrc: "https://cdn.steamstatic.com/apps/dota2/videos/dota_react/heroes/renders/shadow_demon.webm", name: "Shadow Demon" },
    { videoSrc: "https://cdn.steamstatic.com/apps/dota2/videos/dota_react/heroes/renders/antimage.webm", name: "Antimage" },
  ],
  },
  {
    id: "btt",
    nickname: "BTT",
    realName: "",
    avatarUrl: "/avatars/default.jpg",
    seasonBadges: [],
    hasWonCup: false,

    
    

    currentMedalLabel: "",
    currentMedalId: "",
    peakMedalLabel: "",
    peakMedalId: "",

    bio: "",
    roles: [],

    steamUrl: "https://steamcommunity.com/profiles/76561199635090797",
    dotabuffUrl: "https://www.dotabuff.com/players/1674825069",
    favoriteHeroes: [
    { videoSrc: "https://cdn.steamstatic.com/apps/dota2/videos/dota_react/heroes/renders/slark.webm", name: "Slark" },
    { videoSrc: "https://cdn.steamstatic.com/apps/dota2/videos/dota_react/heroes/renders/pugna.webm", name: "Pugna" },
    { videoSrc: "https://cdn.steamstatic.com/apps/dota2/videos/dota_react/heroes/renders/spectre.webm", name: "Spectre" },
  ],
  },
  {
    id: "skooti",
    nickname: "SKOOTI",
    realName: "",
    avatarUrl: "/avatars/default.jpg",
    seasonBadges: [],
    hasWonCup: false,

    
    

    currentMedalLabel: "",
    currentMedalId: "",
    peakMedalLabel: "",
    peakMedalId: "",

    bio: "",
    roles: [],

    steamUrl: "https://steamcommunity.com/profiles/76561198307264129",
    dotabuffUrl: "https://www.dotabuff.com/players/346998401",
    favoriteHeroes: [
    { videoSrc: "https://cdn.steamstatic.com/apps/dota2/videos/dota_react/heroes/renders/mirana.webm", name: "Mirana" },
    { videoSrc: "https://cdn.steamstatic.com/apps/dota2/videos/dota_react/heroes/renders/phantom_assassin.webm", name: "Phantom Assassin" },
    { videoSrc: "https://cdn.steamstatic.com/apps/dota2/videos/dota_react/heroes/renders/weaver.webm", name: "Weaver" },
  ],
  },
  {
    id: "juker",
    nickname: "Juker",
    realName: "",
    avatarUrl: "/avatars/default.jpg",
    seasonBadges: [],
    hasWonCup: false,

    
    

    currentMedalLabel: "",
    currentMedalId: "",
    peakMedalLabel: "",
    peakMedalId: "",

    bio: "",
    roles: [],

    steamUrl: "https://steamcommunity.com/profiles/76561198301439473",
    dotabuffUrl: "https://www.dotabuff.com/players/341173745",
    favoriteHeroes: [
    { videoSrc: "https://cdn.steamstatic.com/apps/dota2/videos/dota_react/heroes/renders/bane.webm", name: "Bane" },
    { videoSrc: "https://cdn.steamstatic.com/apps/dota2/videos/dota_react/heroes/renders/naga_siren.webm", name: "Naga Siren" },
    { videoSrc: "https://cdn.steamstatic.com/apps/dota2/videos/dota_react/heroes/renders/chaos_knight.webm", name: "Chaos Knight" },
  ],
  },
  {
    id: "erza_scarlet",
    nickname: "Erza Scarlet",
    realName: "",
    avatarUrl: "/avatars/default.jpg",
    seasonBadges: [],
    hasWonCup: false,

    
    

    currentMedalLabel: "",
    currentMedalId: "",
    peakMedalLabel: "",
    peakMedalId: "",

    bio: "",
    roles: [],

    steamUrl: "https://steamcommunity.com/profiles/76561198876667791",
    dotabuffUrl: "https://www.dotabuff.com/players/916402063",
    favoriteHeroes: [
    { videoSrc: "https://cdn.steamstatic.com/apps/dota2/videos/dota_react/heroes/renders/medusa.webm", name: "Medusa" },
    { videoSrc: "https://cdn.steamstatic.com/apps/dota2/videos/dota_react/heroes/renders/storm_spirit.webm", name: "Storm Spirit" },
    { videoSrc: "https://cdn.steamstatic.com/apps/dota2/videos/dota_react/heroes/renders/juggernaut.webm", name: "Juggernaut" },
  ],
  },
  {
    id: "changing_star",
    nickname: "Changing Star",
    realName: "",
    avatarUrl: "/avatars/default.jpg",
    seasonBadges: [],
    hasWonCup: false,

    
    

    currentMedalLabel: "",
    currentMedalId: "",
    peakMedalLabel: "",
    peakMedalId: "",

    bio: "",
    roles: [],

    steamUrl: "https://steamcommunity.com/profiles/76561198845147763",
    dotabuffUrl: "https://www.dotabuff.com/players/884882035",
    favoriteHeroes: [
    { videoSrc: "https://cdn.steamstatic.com/apps/dota2/videos/dota_react/heroes/renders/queenofpain.webm", name: "Queenofpain" },
    { videoSrc: "https://cdn.steamstatic.com/apps/dota2/videos/dota_react/heroes/renders/lich.webm", name: "Lich" },
    { videoSrc: "https://cdn.steamstatic.com/apps/dota2/videos/dota_react/heroes/renders/phoenix.webm", name: "Phoenix" },
  ],
  },
  {
    id: "confi",
    nickname: "ConFi",
    realName: "",
    avatarUrl: "/avatars/default.jpg",
    seasonBadges: [],
    hasWonCup: false,

    
    

    currentMedalLabel: "",
    currentMedalId: "",
    peakMedalLabel: "",
    peakMedalId: "",

    bio: "",
    roles: [],

    steamUrl: "https://steamcommunity.com/profiles/76561198241427100",
    dotabuffUrl: "https://www.dotabuff.com/players/281161372",
    favoriteHeroes: [
    { videoSrc: "https://cdn.steamstatic.com/apps/dota2/videos/dota_react/heroes/renders/mirana.webm", name: "Mirana" },
    { videoSrc: "https://cdn.steamstatic.com/apps/dota2/videos/dota_react/heroes/renders/bane.webm", name: "Bane" },
    { videoSrc: "https://cdn.steamstatic.com/apps/dota2/videos/dota_react/heroes/renders/magnataur.webm", name: "Magnataur" },
  ],
  },
  {
    id: "bakabot",
    nickname: "Bakabot",
    realName: "",
    avatarUrl: "/avatars/default.jpg",
    seasonBadges: [],
    hasWonCup: false,

    
    

    currentMedalLabel: "",
    currentMedalId: "",
    peakMedalLabel: "",
    peakMedalId: "",

    bio: "",
    roles: [],

    steamUrl: "https://steamcommunity.com/profiles/76561198392179703",
    dotabuffUrl: "https://www.dotabuff.com/players/431913975",
    favoriteHeroes: [
    { videoSrc: "https://cdn.steamstatic.com/apps/dota2/videos/dota_react/heroes/renders/wraith_king.webm", name: "Wraith King" },
    { videoSrc: "https://cdn.steamstatic.com/apps/dota2/videos/dota_react/heroes/renders/natures_prophet.webm", name: "Natures Prophet" },
    { videoSrc: "https://cdn.steamstatic.com/apps/dota2/videos/dota_react/heroes/renders/slardar.webm", name: "Slardar" },
  ],
  },
  {
    id: "potatobuoy",
    nickname: "Potatobuoy",
    realName: "",
    avatarUrl: "/avatars/default.jpg",
    seasonBadges: [],
    hasWonCup: false,

    
    

    currentMedalLabel: "",
    currentMedalId: "",
    peakMedalLabel: "",
    peakMedalId: "",

    bio: "",
    roles: [],

    steamUrl: "https://steamcommunity.com/profiles/76561198132130996",
    dotabuffUrl: "https://www.dotabuff.com/players/171865268",
    favoriteHeroes: [
    { videoSrc: "https://cdn.steamstatic.com/apps/dota2/videos/dota_react/heroes/renders/ringmaster.webm", name: "Ringmaster" },
    { videoSrc: "https://cdn.steamstatic.com/apps/dota2/videos/dota_react/heroes/renders/mirana.webm", name: "Mirana" },
    { videoSrc: "https://cdn.steamstatic.com/apps/dota2/videos/dota_react/heroes/renders/meepo.webm", name: "Meepo" },
  ],
  },
  {
    id: "hina",
    nickname: "Hina",
    realName: "",
    avatarUrl: "/avatars/default.jpg",
    seasonBadges: [],
    hasWonCup: false,

    
    

    currentMedalLabel: "",
    currentMedalId: "",
    peakMedalLabel: "",
    peakMedalId: "",

    bio: "",
    roles: [],

    steamUrl: "https://steamcommunity.com/profiles/76561198327829346",
    dotabuffUrl: "https://www.dotabuff.com/players/367563618",
    favoriteHeroes: [
    { videoSrc: "https://cdn.steamstatic.com/apps/dota2/videos/dota_react/heroes/renders/dark_seer.webm", name: "Dark Seer" },
    { videoSrc: "https://cdn.steamstatic.com/apps/dota2/videos/dota_react/heroes/renders/silencer.webm", name: "Silencer" },
    { videoSrc: "https://cdn.steamstatic.com/apps/dota2/videos/dota_react/heroes/renders/abaddon.webm", name: "Abaddon" },
  ],
  },
  {
    id: "v_n",
    nickname: "έ_v!Ḷ₥!N_Đ",
    realName: "",
    avatarUrl: "/avatars/default.jpg",
    seasonBadges: [],
    hasWonCup: false,

    
    

    currentMedalLabel: "",
    currentMedalId: "",
    peakMedalLabel: "",
    peakMedalId: "",

    bio: "",
    roles: [],

    steamUrl: "https://steamcommunity.com/profiles/76561198360909414",
    dotabuffUrl: "https://www.dotabuff.com/players/400643686",
    favoriteHeroes: [
    { videoSrc: "https://cdn.steamstatic.com/apps/dota2/videos/dota_react/heroes/renders/clockwerk.webm", name: "Clockwerk" },
    { videoSrc: "https://cdn.steamstatic.com/apps/dota2/videos/dota_react/heroes/renders/dark_willow.webm", name: "Dark Willow" },
    { videoSrc: "https://cdn.steamstatic.com/apps/dota2/videos/dota_react/heroes/renders/pangolier.webm", name: "Pangolier" },
  ],
  },
  {
    id: "mrbeanbag",
    nickname: "MrBeanBag",
    realName: "",
    avatarUrl: "/avatars/default.jpg",
    seasonBadges: [],
    hasWonCup: false,

    
    

    currentMedalLabel: "",
    currentMedalId: "",
    peakMedalLabel: "",
    peakMedalId: "",

    bio: "",
    roles: [],

    steamUrl: "https://steamcommunity.com/profiles/76561198249643688",
    dotabuffUrl: "https://www.dotabuff.com/players/289377960",
    favoriteHeroes: [
    { videoSrc: "https://cdn.steamstatic.com/apps/dota2/videos/dota_react/heroes/renders/lycan.webm", name: "Lycan" },
    { videoSrc: "https://cdn.steamstatic.com/apps/dota2/videos/dota_react/heroes/renders/faceless_void.webm", name: "Faceless Void" },
    { videoSrc: "https://cdn.steamstatic.com/apps/dota2/videos/dota_react/heroes/renders/viper.webm", name: "Viper" },
  ],
  },
  {
    id: "humble",
    nickname: "humble",
    realName: "",
    avatarUrl: "/avatars/default.jpg",
    seasonBadges: [],
    hasWonCup: false,

    
    

    currentMedalLabel: "",
    currentMedalId: "",
    peakMedalLabel: "",
    peakMedalId: "",

    bio: "",
    roles: [],

    steamUrl: "https://steamcommunity.com/profiles/76561198981961488",
    dotabuffUrl: "https://www.dotabuff.com/players/1021695760",
    favoriteHeroes: [
    { videoSrc: "https://cdn.steamstatic.com/apps/dota2/videos/dota_react/heroes/renders/riki.webm", name: "Riki" },
    { videoSrc: "https://cdn.steamstatic.com/apps/dota2/videos/dota_react/heroes/renders/chaos_knight.webm", name: "Chaos Knight" },
    { videoSrc: "https://cdn.steamstatic.com/apps/dota2/videos/dota_react/heroes/renders/visage.webm", name: "Visage" },
  ],
  },
  {
    id: "exe",
    nickname: "EXe",
    realName: "",
    avatarUrl: "/avatars/default.jpg",
    seasonBadges: [],
    hasWonCup: false,

    
    

    currentMedalLabel: "",
    currentMedalId: "",
    peakMedalLabel: "",
    peakMedalId: "",

    bio: "",
    roles: [],

    steamUrl: "https://steamcommunity.com/profiles/76561198833089137",
    dotabuffUrl: "https://www.dotabuff.com/players/872823409",
    favoriteHeroes: [
    { videoSrc: "https://cdn.steamstatic.com/apps/dota2/videos/dota_react/heroes/renders/phantom_assassin.webm", name: "Phantom Assassin" },
    { videoSrc: "https://cdn.steamstatic.com/apps/dota2/videos/dota_react/heroes/renders/windrunner.webm", name: "Windrunner" },
    { videoSrc: "https://cdn.steamstatic.com/apps/dota2/videos/dota_react/heroes/renders/ogre_magi.webm", name: "Ogre Magi" },
  ],
  },
  {
    id: "siniomega",
    nickname: "SiniOmega",
    realName: "",
    avatarUrl: "/avatars/default.jpg",
    seasonBadges: [],
    hasWonCup: false,

    
    

    currentMedalLabel: "",
    currentMedalId: "",
    peakMedalLabel: "",
    peakMedalId: "",

    bio: "",
    roles: [],

    steamUrl: "https://steamcommunity.com/profiles/76561198383152988",
    dotabuffUrl: "https://www.dotabuff.com/players/422887260",
    favoriteHeroes: [
    { videoSrc: "https://cdn.steamstatic.com/apps/dota2/videos/dota_react/heroes/renders/windrunner.webm", name: "Windrunner" },
    { videoSrc: "https://cdn.steamstatic.com/apps/dota2/videos/dota_react/heroes/renders/tiny.webm", name: "Tiny" },
    { videoSrc: "https://cdn.steamstatic.com/apps/dota2/videos/dota_react/heroes/renders/dragon_knight.webm", name: "Dragon Knight" },
  ],
  },
  {
    id: "zx",
    nickname: "zx",
    realName: "",
    avatarUrl: "/avatars/default.jpg",
    seasonBadges: [],
    hasWonCup: false,

    
    

    currentMedalLabel: "",
    currentMedalId: "",
    peakMedalLabel: "",
    peakMedalId: "",

    bio: "",
    roles: [],

    steamUrl: "https://steamcommunity.com/profiles/76561198835367057",
    dotabuffUrl: "https://www.dotabuff.com/players/875101329",
    favoriteHeroes: [
    { videoSrc: "https://cdn.steamstatic.com/apps/dota2/videos/dota_react/heroes/renders/crystal_maiden.webm", name: "Crystal Maiden" },
    { videoSrc: "https://cdn.steamstatic.com/apps/dota2/videos/dota_react/heroes/renders/queenofpain.webm", name: "Queenofpain" },
    { videoSrc: "https://cdn.steamstatic.com/apps/dota2/videos/dota_react/heroes/renders/bounty_hunter.webm", name: "Bounty Hunter" },
  ],
  },
  {
    id: "shrijan",
    nickname: "Shrijan",
    realName: "",
    avatarUrl: "/avatars/default.jpg",
    seasonBadges: [],
    hasWonCup: false,

    
    

    currentMedalLabel: "",
    currentMedalId: "",
    peakMedalLabel: "",
    peakMedalId: "",

    bio: "",
    roles: [],

    steamUrl: "https://steamcommunity.com/profiles/76561198287827827",
    dotabuffUrl: "https://www.dotabuff.com/players/327562099",
    favoriteHeroes: [
    { videoSrc: "https://cdn.steamstatic.com/apps/dota2/videos/dota_react/heroes/renders/necrophos.webm", name: "Necrophos" },
    { videoSrc: "https://cdn.steamstatic.com/apps/dota2/videos/dota_react/heroes/renders/life_stealer.webm", name: "Life Stealer" },
    { videoSrc: "https://cdn.steamstatic.com/apps/dota2/videos/dota_react/heroes/renders/zeus.webm", name: "Zeus" },
  ],
  },
  {
    id: "rizwan_the_fu_ker",
    nickname: "rizwan the fu*ker",
    realName: "",
    avatarUrl: "/avatars/default.jpg",
    seasonBadges: [],
    hasWonCup: false,

    
    

    currentMedalLabel: "",
    currentMedalId: "",
    peakMedalLabel: "",
    peakMedalId: "",

    bio: "",
    roles: [],

    steamUrl: "https://steamcommunity.com/profiles/76561198357688464",
    dotabuffUrl: "https://www.dotabuff.com/players/397422736",
    favoriteHeroes: [
    { videoSrc: "https://cdn.steamstatic.com/apps/dota2/videos/dota_react/heroes/renders/terrorblade.webm", name: "Terrorblade" },
    { videoSrc: "https://cdn.steamstatic.com/apps/dota2/videos/dota_react/heroes/renders/slark.webm", name: "Slark" },
    { videoSrc: "https://cdn.steamstatic.com/apps/dota2/videos/dota_react/heroes/renders/mars.webm", name: "Mars" },
  ],
  },
  {
    id: "shirleythomas",
    nickname: "Shirleythomas",
    realName: "",
    avatarUrl: "/avatars/default.jpg",
    seasonBadges: [],
    hasWonCup: false,

    
    

    currentMedalLabel: "",
    currentMedalId: "",
    peakMedalLabel: "",
    peakMedalId: "",

    bio: "",
    roles: [],

    steamUrl: "https://steamcommunity.com/profiles/76561198138494882",
    dotabuffUrl: "https://www.dotabuff.com/players/178229154",
    favoriteHeroes: [
    { videoSrc: "https://cdn.steamstatic.com/apps/dota2/videos/dota_react/heroes/renders/rubick.webm", name: "Rubick" },
    { videoSrc: "https://cdn.steamstatic.com/apps/dota2/videos/dota_react/heroes/renders/chaos_knight.webm", name: "Chaos Knight" },
    { videoSrc: "https://cdn.steamstatic.com/apps/dota2/videos/dota_react/heroes/renders/crystal_maiden.webm", name: "Crystal Maiden" },
  ],
  },
  {
    id: "ozee",
    nickname: "OzEe",
    realName: "",
    avatarUrl: "/avatars/default.jpg",
    seasonBadges: [],
    hasWonCup: false,

    
    

    currentMedalLabel: "",
    currentMedalId: "",
    peakMedalLabel: "",
    peakMedalId: "",

    bio: "",
    roles: [],

    steamUrl: "https://steamcommunity.com/profiles/76561198067747110",
    dotabuffUrl: "https://www.dotabuff.com/players/107481382",
    favoriteHeroes: [
    { videoSrc: "https://cdn.steamstatic.com/apps/dota2/videos/dota_react/heroes/renders/bounty_hunter.webm", name: "Bounty Hunter" },
    { videoSrc: "https://cdn.steamstatic.com/apps/dota2/videos/dota_react/heroes/renders/wisp.webm", name: "Wisp" },
    { videoSrc: "https://cdn.steamstatic.com/apps/dota2/videos/dota_react/heroes/renders/leshrac.webm", name: "Leshrac" },
  ],
  },
  {
    id: "kyuubi",
    nickname: "°Kyuubi°",
    realName: "",
    avatarUrl: "/avatars/default.jpg",
    seasonBadges: [],
    hasWonCup: false,

    
    

    currentMedalLabel: "",
    currentMedalId: "",
    peakMedalLabel: "",
    peakMedalId: "",

    bio: "",
    roles: [],

    steamUrl: "https://steamcommunity.com/profiles/76561199028189611",
    dotabuffUrl: "https://www.dotabuff.com/players/1067923883",
    favoriteHeroes: [
    { videoSrc: "https://cdn.steamstatic.com/apps/dota2/videos/dota_react/heroes/renders/faceless_void.webm", name: "Faceless Void" },
    { videoSrc: "https://cdn.steamstatic.com/apps/dota2/videos/dota_react/heroes/renders/underlord.webm", name: "Underlord" },
    { videoSrc: "https://cdn.steamstatic.com/apps/dota2/videos/dota_react/heroes/renders/earthshaker.webm", name: "Earthshaker" },
  ],
  },
  {
    id: "miracles_from_heaven",
    nickname: "Miracles from heaven!",
    realName: "",
    avatarUrl: "/avatars/default.jpg",
    seasonBadges: [],
    hasWonCup: false,

    
    

    currentMedalLabel: "",
    currentMedalId: "",
    peakMedalLabel: "",
    peakMedalId: "",

    bio: "",
    roles: [],

    steamUrl: "https://steamcommunity.com/profiles/76561198069911814",
    dotabuffUrl: "https://www.dotabuff.com/players/109646086",
    favoriteHeroes: [
    { videoSrc: "https://cdn.steamstatic.com/apps/dota2/videos/dota_react/heroes/renders/undying.webm", name: "Undying" },
    { videoSrc: "https://cdn.steamstatic.com/apps/dota2/videos/dota_react/heroes/renders/bane.webm", name: "Bane" },
    { videoSrc: "https://cdn.steamstatic.com/apps/dota2/videos/dota_react/heroes/renders/enigma.webm", name: "Enigma" },
  ],
  }
];

export function getPlayerById(id: string): Player | undefined {
  return players.find((p) => p.id === id);
}

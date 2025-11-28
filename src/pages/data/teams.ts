


export type Player = {
  id: string;
  nickname: string;
  mmr: number;
  gold: number;
};

export type Team = {
  id: string;
  name: string;        
  shortName: string;   
  logoColor: string;
  wins: number;
  losses: number;
  players: Player[];
  averageMMR: number;
};

function calcAvgMMR(players: Player[]): number {
  if (!players.length) return 0;
  const total = players.reduce((sum, p) => sum + p.mmr, 0);
  return Math.round(total / players.length);
}

// Season 1 stacks
const teamsRaw: Omit<Team, "averageMMR">[] = [
  {
    id: "banner",
    name: "LORDS",
    shortName: "LDS",
    logoColor: "#3C78D8",   // Banner
    wins: 3,
    losses: 0,
    players: [
      { id: "banner-1", nickname: "Banner",  mmr: 3000, gold: 0 },
      { id: "banner-2", nickname: "RockeR",   mmr: 6300, gold: 61 },
      { id: "banner-3", nickname: "Server",   mmr: 4400, gold: 25 },
      { id: "banner-4", nickname: "Skyie@",  mmr: 3079, gold: 2 },
      { id: "banner-5", nickname: "LordImpaler",  mmr: 2766, gold: 5 },
      
    ],
  },
  {
    id: "billy",
    name: "Billy Team",
    shortName: "BIL",
    logoColor: "#E06666",   // Billy
    wins: 2,
    losses: 1,
    players: [
      { id: "billy-1", nickname: "Billy",  mmr: 2800, gold: 0 },
      { id: "billy-2", nickname: "SlowFast",  mmr: 3666, gold: 16 },
      { id: "billy-3", nickname: "PREDATOR",  mmr: 4900, gold: 25 },
      { id: "billy-4", nickname: "STORM4",  mmr: 6000, gold: 39 },
      { id: "billy-5", nickname: "Irox",  mmr: 3300, gold: 20 },
    ],
  },
  {
    id: "reciprocal",
    name: "Pandey Randi",
    shortName: "PDR",
    logoColor: "#674EA7",   // Reciprocal
    wins: 2,
    losses: 1,
    players: [
      { id: "recip-1", nickname: "r3ciprocal",  mmr: 3500, gold: 0 },
      { id: "recip-2", nickname: "DeathShadow",  mmr: 3200, gold: 17 },
      { id: "recip-3", nickname: "Machine",  mmr: 3900, gold: 25 },
      { id: "recip-4", nickname: "Phola",  mmr: 4200, gold: 26 },
      { id: "recip-5", nickname: "Slappy",  mmr: 3300, gold: 12 },
    ],
  },
  {
    id: "bazinga",
    name: "Shayad Degi Woh",
    shortName: "SDW",
    logoColor: "#93C47D",   // Bazinga
    wins: 2,
    losses: 1,
    players: [
      { id: "baz-1", nickname: "Bazinga",  mmr: 4000, gold: 0 },
      { id: "baz-2", nickname: "MaDaRa",  mmr: 4600, gold: 50 },
      { id: "baz-3", nickname: "AaRoN",  mmr: 3000, gold: 4 },
      { id: "baz-4", nickname: "Bolt",  mmr: 3670, gold: 17 },
      { id: "baz-5", nickname: "Masara",  mmr: 2710, gold: 5 },
    ],
  },
  {
    id: "helm",
    name: "Viewers Games",
    shortName: "VG",
    logoColor: "#F1C232",   // Helm
    wins: 1,
    losses: 2,
    players: [
      { id: "helm-1", nickname: "Helm",  mmr: 5300, gold: 0 },
      { id: "helm-2", nickname: "Ravi",  mmr: 4600, gold: 39 },
      { id: "helm-3", nickname: "Nikhil",  mmr: 4013, gold: 11 },
      { id: "helm-4", nickname: "Insanekid08",  mmr: 1200, gold: 1 },
      { id: "helm-5", nickname: "abbhY",  mmr: 1115, gold: 2 },
    ],
  },
  {
    id: "godspeed",
    name: "Imposters",
    shortName: "IMPS",
    logoColor: "#B45F06",   // Godspeed
    wins: 3,
    losses: 0,
    players: [
      { id: "g-1", nickname: "Godspeed",  mmr: 2233, gold: 0 },
      { id: "g-2", nickname: "Toby",  mmr: 5300, gold: 55 },
      { id: "g-3", nickname: "Narai",  mmr: 6000, gold: 12 },
      { id: "g-4", nickname: "Atomic",  mmr: 3624, gold: 13 },
      { id: "g-5", nickname: "GRIMM",  mmr: 3200, gold: 0 },
    ],
  },
  {
    id: "nabeel",
    name: "The Unknowns",
    shortName: "UNK",
    logoColor: "#76A5AF",   // Nabeel
    wins: 1,
    losses: 2,
    players: [
      { id: "n-1", nickname: "Nabeel",  mmr: 2800, gold: 0 },
      { id: "n-2", nickname: "DJ",  mmr: 2500, gold: 30 },
      { id: "n-3", nickname: "MVRK",  mmr: 3900, gold: 0 },
      { id: "n-4", nickname: "Hunt",  mmr: 5000, gold: 43 },
      { id: "n-5", nickname: "Sovan",  mmr: 2800, gold: 8 },
    ],
  },
  {
    id: "kolly",
    name: "Her Ofs Fan Boys",
    shortName: "HOFB",
    logoColor: "#C27BA0",   // Kolly
    wins: 3,
    losses: 0,
    players: [
      { id: "k-1", nickname: "Kolly",  mmr: 5660, gold: 0 },
      { id: "k-2", nickname: "CLASH",  mmr: 4800, gold: 40 },
      { id: "k-3", nickname: "420-smurf",  mmr: 2000, gold: 0 },
      { id: "k-4", nickname: "Maliketh",  mmr: 2461, gold: 0 },
      { id: "k-5", nickname: "Akash",  mmr: 3000, gold: 14 },
    ],
  },
];

export const teams: Team[] = teamsRaw.map((t) => ({
  ...t,
  averageMMR: calcAvgMMR(t.players),
}));


/* =====================
   Season 2 stacks (from sheet screenshot)
   NOTE: mmr & gold are set to 0 as placeholders.
   Copy the real numbers from your image/sheet.
   ===================== */

const season2TeamsRaw: Omit<Team, "averageMMR">[] = [
  {
    id: "machine-s2",
    name: "Hilf Munters",
    shortName: "MCH",
    logoColor: "#4A86E8", // blue
    wins: 0,
    losses: 0,
    players: [
      { id: "s2-machine-1", nickname: "Machine",  mmr: 3500, gold: 0 }, // TODO
      { id: "s2-machine-2", nickname: "Narai",  mmr: 6000, gold:67 },   // TODO
      { id: "s2-machine-3", nickname: "Server",  mmr:4400, gold: 24 },  // TODO
      { id: "s2-machine-4", nickname: "LordImpaler",  mmr: 2809, gold: 5 }, // TODO
      { id: "s2-machine-5", nickname: "Ronbawa",  mmr: 1530, gold: 0 },   // TODO
    ],
  },
  {
    id: "bazinga-s2",
    name: "Ohh Yes Dabba Kardiya",
    shortName: "BZ2",
    logoColor: "#FFD966", // yellow
    wins: 0,
    losses: 0,
    players: [
      { id: "s2-bazinga-1", nickname: "Bazinga",  mmr: 3569, gold: 0 }, // TODO
      { id: "s2-bazinga-2", nickname: "Inner Peace-",  mmr:5800, gold: 41 },
      { id: "s2-bazinga-3", nickname: "Irene",  mmr: 5090, gold: 39 },
      { id: "s2-bazinga-4", nickname: "Farhan",  mmr: 1821, gold: 8 },
      { id: "s2-bazinga-5", nickname: "Arindam7",  mmr: 1559, gold: 6 },
    ],
  },
  {
    id: "mslayer-s2",
    name: "Stylish Slayers",
    shortName: "MSL",
    logoColor: "#F6B26B", // orange
    wins: 0,
    losses: 0,
    players: [
      { id: "s2-mslayer-1", nickname: "MSlayer",  mmr: 3096, gold: 0 },
      { id: "s2-mslayer-2", nickname: "Master Instinct",  mmr: 8400, gold: 72 },
      { id: "s2-mslayer-3", nickname: "Phola",  mmr: 4200, gold: 21 },
      { id: "s2-mslayer-4", nickname: "Billy",  mmr:2719, gold: 10 },
      { id: "s2-mslayer-5", nickname: "Nabeel",  mmr: 2896, gold: 5 },
    ],
  },
  {
    id: "madlad-s2",
    name: "Blink Feed Repeat",
    shortName: "MDL",
    logoColor: "#E06666", // red
    wins: 0,
    losses: 0,
    players: [
      { id: "s2-madlad-1", nickname: "Madlad",  mmr: 3336, gold: 0 },
      { id: "s2-madlad-2", nickname: "Voodoo",  mmr: 5645, gold: 56 },
      { id: "s2-madlad-3", nickname: "Ali Gm'Y",  mmr: 4430, gold: 22 },
      { id: "s2-madlad-4", nickname: "zRomep",  mmr:2969, gold: 17},
      { id: "s2-madlad-5", nickname: "Insanekid08",  mmr: 1200, gold: 5 },
    ],
  },
  {
    id: "xj-s2",
    name: "Python Hunterz",
    shortName: "XJN",
    logoColor: "#F9CB9C", // light orange
    wins: 0,
    losses: 0,
    players: [
      { id: "s2-xj-1", nickname: "Jin[X]eD",  mmr: 3300, gold: 0 },
      { id: "s2-xj-2", nickname: "Lanson",  mmr: 8385, gold: 70 },
      { id: "s2-xj-3", nickname: "SlowFast",  mmr: 3500, gold: 15 },
      { id: "s2-xj-4", nickname: "Godspeed",  mmr: 2333, gold: 6 },
      { id: "s2-xj-5", nickname: "DK",  mmr: 2697, gold: 10 },
    ],
  },
  {
    id: "r3ciprocal-s2",
    name: "Monarchs",
    shortName: "R3C",
    logoColor: "#6AA84F", // green
    wins: 0,
    losses: 0,
    players: [
      { id: "s2-r3c-1", nickname: "r3ciprocal",  mmr: 3464, gold: 0 },
      { id: "s2-r3c-2", nickname: "Sherlocked",  mmr: 5420, gold: 41 },
      { id: "s2-r3c-3", nickname: "Prime.One",  mmr: 5445, gold: 31 },
      { id: "s2-r3c-4", nickname: "Tundra.Goku",  mmr: 2380, gold: 10 },
      { id: "s2-r3c-5", nickname: "Sovan",  mmr: 2300, gold: 15 },
    ],
  },
  {
    id: "madara-s2",
    name: "Demonic Empire",
    shortName: "MDR",
    logoColor: "#8E7CC3", // purple
    wins: 0,
    losses: 0,
    players: [
      { id: "s2-madara-1", nickname: "MaDaRa",  mmr: 3823, gold: 0 },
      { id: "s2-madara-2", nickname: "Tukiyem",  mmr: 7053, gold: 59 },
      { id: "s2-madara-3", nickname: "Slappy",  mmr:2600, gold: 10 },
      { id: "s2-madara-4", nickname: "DeathShadow",  mmr: 2950, gold: 17 },
      { id: "s2-madara-5", nickname: "shezdbest",  mmr: 1460, gold: 2 },
    ],
  },
  {
    id: "ngx-Irox-s2",
    name: "Kasauli Tigers",
    shortName: "NGX",
    logoColor: "#76A5AF", // teal
    wins: 0,
    losses: 0,
    players: [
      { id: "s2-ngx-1", nickname: "Irox",  mmr: 3355, gold: 0 },
      { id: "s2-ngx-2", nickname: "RockeR",  mmr: 6400, gold: 67 },
      { id: "s2-ngx-3", nickname: "Noob CA",  mmr: 2154, gold: 1 },
      { id: "s2-ngx-4", nickname: "Guts",  mmr:4100, gold: 16 },
      { id: "s2-ngx-5", nickname: "AaRoN",  mmr: 2600, gold: 16 },
    ],
  },
  {
    id: "banner-s2",
    name: "Haldiram Hunters",
    shortName: "BNS2",
    logoColor: "#CC0000", // red
    wins: 0,
    losses: 0,
    players: [
      { id: "s2-banner-1", nickname: "Banner",  mmr: 3200, gold: 0 },
      { id: "s2-banner-2", nickname: "ScripTeR",  mmr: 4400, gold: 46 },
      { id: "s2-banner-3", nickname: "Kolly",  mmr: 4315, gold: 39 },
      { id: "s2-banner-4", nickname: "DRAGONEYE",  mmr: 3335, gold: 16 },
      { id: "s2-banner-5", nickname: "Sphere",  mmr: 1500, gold: 4 },
    ],
  },
  {
    id: "tom1c-s2",
    name: "Imposters",
    shortName: "TMC",
    logoColor: "#B6D7A8", // light green
    wins: 0,
    losses: 0,
    players: [
      { id: "s2-tom1c-1", nickname: "Atomic",  mmr: 3120, gold: 0 },
      { id: "s2-tom1c-2", nickname: "Toby",  mmr: 4880, gold: 51 },
      { id: "s2-tom1c-3", nickname: "Shiro",  mmr: 5800, gold: 46 },
      { id: "s2-tom1c-4", nickname: "abbhY",  mmr: 1227, gold: 7 },
      { id: "s2-tom1c-5", nickname: "DoT",  mmr: 2560, gold: 3 },
    ],
  },
  {
    id: "gxnova-s2",
    name: "Team Liquor",
    shortName: "GXN",
    logoColor: "#E691B8", // pink
    wins: 0,
    losses: 0,
    players: [
      { id: "s2-gxnova-1", nickname: "gxnova",  mmr: 3106, gold: 0 },
      { id: "s2-gxnova-2", nickname: "DJ",  mmr: 5112, gold: 41 },
      { id: "s2-gxnova-3", nickname: "Helm",  mmr: 4988, gold: 44 },
      { id: "s2-gxnova-4", nickname: "Position 0",  mmr: 4250, gold: 16 },
      { id: "s2-gxnova-5", nickname: "Ryujin",  mmr: 2619, gold: 7 },
    ],
  },
  {
    id: "grimm-s2",
    name: "Immortals",
    shortName: "GRM2",
    logoColor: "#FFD966", // yellow
    wins: 0,
    losses: 0,
    players: [
      { id: "s2-grimm-1", nickname: "GRIMM",  mmr: 3300, gold: 0 },
      { id: "s2-grimm-2", nickname: "Fyt",  mmr: 6401, gold: 82 },
      { id: "s2-grimm-3", nickname: "Flamy",  mmr: 2491, gold: 19 },
      { id: "s2-grimm-4", nickname: "LYRRAD",  mmr: 1453, gold: 0 },
      { id: "s2-grimm-5", nickname: "hakuna_matata",  mmr: 864, gold: 0 },
    ],
  },
];

export const season2Teams: Team[] = season2TeamsRaw.map((t) => ({
  ...t,
  averageMMR: calcAvgMMR(t.players),
}));


/* =====================
   Season 3 stacks
   ===================== */

const season3TeamsRaw: Omit<Team, "averageMMR">[] = [
  {
    id: "dynamodon-s3",
    name: "Dynamite",
    shortName: "DYN",
    logoColor: "#3C78D8", // blue
    wins: 0,
    losses: 0,
    players: [
      { id: "s3-dyn-1", nickname: "DynamoDon",  mmr: 3200, gold: 0 },
      { id: "s3-dyn-2", nickname: "Shiro",  mmr: 5500, gold: 91 },
      { id: "s3-dyn-3", nickname: "Inner Peace-",  mmr: 5800, gold: 58 },
      { id: "s3-dyn-4", nickname:  "FOX",  mmr: 2969, gold: 5 }, // TODO: check spelling
      { id: "s3-dyn-5", nickname: "Ov3rconfidenc3",  mmr: 3510, gold: 22 },
    ],
  },

  {
    id: "puppyboss-s3",
    name: "Ganzza Boys",
    shortName: "GNZ",
    logoColor: "#CC0000", // red
    wins: 0,
    losses: 0,
    players: [
      { id: "s3-puppy-1", nickname: "Puppy boss",  mmr: 3506, gold: 0 },
      { id: "s3-puppy-2", nickname: "cigerettes after sex",  mmr: 6300, gold: 76 },
      { id: "s3-puppy-3", nickname: "DoT",  mmr: 2435, gold: 12 },
      { id: "s3-puppy-4", nickname: "420",  mmr: 5018, gold: 41 },
      { id: "s3-puppy-5", nickname: "Meow Meow Madafaka",  mmr: 5442, gold: 34 },
    ],
  },

  {
    id: "kakarot-s3",
    name: "Samraj's Army",
    shortName: "SMA",
    logoColor: "#E69138", // orange
    wins: 0,
    losses: 0,
    players: [
      { id: "s3-kakarot-1", nickname: "Kakarot",  mmr: 5050, gold: 0 },
      { id: "s3-kakarot-2", nickname: "Icarus",  mmr: 8205, gold: 111 },
      { id: "s3-kakarot-3", nickname: "Fren-_-zied",  mmr: 2800, gold: 2 },
      { id: "s3-kakarot-4", nickname: "Roronoa Zoro",  mmr: 3001, gold: 9 },
      { id: "s3-kakarot-5", nickname: "SJ",  mmr: 1990, gold: 0 },
    ],
  },

  {
    id: "sridharocky-s3",
    name: "Jaldi Khatam Karo Jaan",
    shortName: "JKKJ",
    logoColor: "#76A5AF", // teal
    wins: 0,
    losses: 0,
    players: [
      { id: "s3-srid-1", nickname: "Sridharocky",  mmr: 4033, gold: 0 },
      { id: "s3-srid-2", nickname: "Fyt",  mmr: 6230, gold: 146 },
      { id: "s3-srid-3", nickname: "DroN3",  mmr: 1929, gold: 0 },
      { id: "s3-srid-4", nickname: "fLabber",  mmr: 2142, gold: 0 },
      { id: "s3-srid-5", nickname: "Ronbawa",  mmr: 1500, gold: 0 },
    ],
  },

  {
    id: "alcromido-s3",
    name: "Alcromido",
    shortName: "ALC",
    logoColor: "#E06666", // reddish
    wins: 0,
    losses: 0,
    players: [
      { id: "s3-alc-1", nickname: "Alcromido",  mmr: 3203, gold: 0 }, // gold not shown -> 0
      { id: "s3-alc-2", nickname: "dante",  mmr: 4303, gold: 0 },   // TODO: confirm gold
      { id: "s3-alc-3", nickname: "Kakashi",  mmr: 5640, gold: 0 }, // TODO
      { id: "s3-alc-4", nickname: "bull",  mmr: 2666, gold: 0 },       // TODO
      { id: "s3-alc-5", nickname: "pYro",  mmr: 3568, gold: 0 },   // TODO
    ],
  },

  {
    id: "rinne-s3",
    name: "5 Pandav",
    shortName: "5PD",
    logoColor: "#F4CCCC", // light pink
    wins: 0,
    losses: 0,
    players: [
      { id: "s3-rinne-1", nickname: "Rinne",  mmr: 3224, gold: 7 },
      { id: "s3-rinne-2", nickname: "ShabbY**",  mmr: 6290, gold: 72 }, // TODO: check spelling
      { id: "s3-rinne-3", nickname: "hAz3",  mmr: 5350, gold: 60 },
      { id: "s3-rinne-4", nickname: "MaDaRa",  mmr: 4099, gold: 28 },
      { id: "s3-rinne-5", nickname: "Atomic",  mmr: 2320, gold: 8 },
    ],
  },

  {
    id: "nj-s3",
    name: "Naam Bata Lash Utha",
    shortName: "NBLU",
    logoColor: "#B4A7D6", // purple
    wins: 0,
    losses: 0,
    players: [
      { id: "s3-nj-1", nickname: "Nj",  mmr: 3307, gold: 2 },
      { id: "s3-nj-2", nickname: "pEnduUu",  mmr: 5631, gold: 54 }, // TODO: verify nick
      { id: "s3-nj-3", nickname: "Setupathi",  mmr: 4610, gold: 37 },    // TODO: full nick
      { id: "s3-nj-4", nickname: "rA'V!",  mmr: 2600, gold: 22 },
      { id: "s3-nj-5", nickname: "RyuGa",  mmr: 2881, gold: 34 },
    ],
  },

  {
    id: "rut-s3",
    name: "0Map Awareness",
    shortName: "0MAP",
    logoColor: "#FFD966", // yellow
    wins: 0,
    losses: 0,
    players: [
      { id: "s3-rut-1", nickname: "zRomep",  mmr: 3262, gold: 0 },
      { id: "s3-rut-2", nickname: "Uma1s",  mmr: 9200, gold: 105 },
      { id: "s3-rut-3", nickname: "Slappy",  mmr: 2900, gold: 60 },
      { id: "s3-rut-4", nickname: "Madlad",  mmr: 4000, gold: 32 }, // TODO: replace name + stats
      { id: "s3-rut-5", nickname: "Sphere",  mmr: 2000, gold: 8 },
    ],
  },

  {
    id: "maldini-s3",
    name: "Controversial",
    shortName: "CNT",
    logoColor: "#F1C232", // gold
    wins: 0,
    losses: 0,
    players: [
      { id: "s3-maldini-1", nickname: "Maldini",  mmr: 3286, gold: 0 },
      { id: "s3-maldini-2", nickname: "Dranzer",  mmr: 6185, gold: 87 },
      { id: "s3-maldini-3", nickname: "AaRoN",  mmr: 3200, gold: 69 },
      { id: "s3-maldini-4", nickname: "Gorki",  mmr: 6600, gold: 100 },
      { id: "s3-maldini-5", nickname: "Bluediamond",  mmr: 2788, gold: 0 }, // TODO: gold
    ],
  },

  {
    id: "pero-s3",
    name: "5 Star",
    shortName: "5SR",
    logoColor: "#BF9000", // dark gold
    wins: 0,
    losses: 0,
    players: [
      { id: "s3-pero-1", nickname: "Pero",  mmr: 3420, gold: 3 },
      { id: "s3-pero-2", nickname: "Mr.Crystal",  mmr: 6100, gold: 91 },
      { id: "s3-pero-3", nickname: "Dropthebass",  mmr: 3550, gold: 13 },
      { id: "s3-pero-4", nickname: "Grizzly",  mmr: 5800, gold: 54 },
      { id: "s3-pero-5", nickname: "Penda",  mmr: 3200, gold: 5 },
    ],
  },

  {
    id: "helm-s3",
    name: "Blink Hashira",
    shortName: "BKH",
    logoColor: "#B6D7A8", // light green
    wins: 0,
    losses: 0,
    players: [
      { id: "s3-helm-1", nickname: "Helm",  mmr: 4320, gold: 0 },
      { id: "s3-helm-2", nickname: "Ali Gm'Y",  mmr: 4600, gold: 41 }, // TODO: spelling
      { id: "s3-helm-3", nickname: "Phola",  mmr: 4620, gold: 40 },
      { id: "s3-helm-4", nickname: "RB",  mmr: 5885, gold: 34 },
      { id: "s3-helm-5", nickname: "Irox",  mmr: 4554, gold: 23 },
    ],
  },

  {
    id: "epizeuxius-s3",
    name: "Ataksuki",
    shortName: "ATK",
    logoColor: "#6AA84F", // green
    wins: 0,
    losses: 0,
    players: [
      { id: "s3-epi-1", nickname: "Epizeuxius",  mmr: 3855, gold: 0 },
      { id: "s3-epi-2", nickname: "Ultra.NoobPk",  mmr: 8100, gold: 84 },
      { id: "s3-epi-3", nickname: "Gifty",  mmr: 4223, gold: 35 },
      { id: "s3-epi-4", nickname: "Eric Dane",  mmr: 5030, gold: 27 },
      { id: "s3-epi-5", nickname: "Still Panda YT",  mmr: 2559, gold: 5 },
    ],
  },

  {
    id: "jinx-s3",
    name: "Lulquid",
    shortName: "LULQ",
    logoColor: "#C27BA0", // pink
    wins: 0,
    losses: 0,
    players: [
      { id: "s3-jinx-1", nickname: "Jinx",  mmr: 4079, gold: 0 },
      { id: "s3-jinx-2", nickname: "RockeR",  mmr: 5800, gold: 91 },
      { id: "s3-jinx-3", nickname: "No One",  mmr: 4300, gold: 39 },
      { id: "s3-jinx-4", nickname: "Tundra.Goku",  mmr: 2276, gold: 0 },
      { id: "s3-jinx-5", nickname: "Swaggy Brisngr",  mmr: 3050, gold: 15 },
    ],
  },

  {
    id: "shikamaru-s3",
    name: "Faith REDBORN",
    shortName: "FRB",
    logoColor: "#8E7CC3", // purple
    wins: 0,
    losses: 0,
    players: [
      { id: "s3-shika-1", nickname: "Shikamaru",  mmr: 3540, gold: 0 },
      { id: "s3-shika-2", nickname: "cpt_flux",  mmr: 7003, gold: 90 },
      { id: "s3-shika-3", nickname: "Faith",  mmr: 4610, gold: 50 },
      { id: "s3-shika-4", nickname: "Blitzip",  mmr: 4800, gold: 22 },
      { id: "s3-shika-5", nickname: "Memelord Ozai",  mmr: 2395, gold: 0 },
    ],
  },

  {
    id: "shaidota-s3",
    name: "Something Sinister",
    shortName: "SNS",
    logoColor: "#76A5AF", // teal-ish
    wins: 0,
    losses: 0,
    players: [
      { id: "s3-shai-1", nickname: "Shaidota",  mmr: 3900, gold: 0 },
      { id: "s3-shai-2", nickname: "Voodoo",  mmr: 6100, gold: 101 },
      { id: "s3-shai-3", nickname: "BrõwÑ ẞöy",  mmr: 5100, gold: 35 },
      { id: "s3-shai-4", nickname: "SSM-iwnl",  mmr: 3300, gold: 23 },
      { id: "s3-shai-5", nickname: "MYM|LUCKY13",  mmr: 2933, gold: 13 },
    ],
  },

  {
    id: "nemesisx001-s3",
    name: "Nemesis",
    shortName: "NMS",
    logoColor: "#6D9EEB", // blue
    wins: 0,
    losses: 0,
    players: [
      { id: "s3-nemesis-1", nickname: "Dr_Nemesis_X",  mmr: 4012, gold: 0 },
      { id: "s3-nemesis-2", nickname: "Master Instinct",  mmr: 8300, gold: 106 },
      { id: "s3-nemesis-3", nickname: "Billy",  mmr: 3500, gold: 24 },
      { id: "s3-nemesis-4", nickname: "Bazinga",  mmr: 4000, gold: 12 },
      { id: "s3-nemesis-5", nickname: "Yuno",  mmr: 3680, gold: 4 },
    ],
  },
];

export const season3Teams: Team[] = season3TeamsRaw.map((t) => ({
  ...t,
  averageMMR: calcAvgMMR(t.players),
}));


/* =====================
   Season 4 stacks
   ===================== */

const season4TeamsRaw: Omit<Team, "averageMMR">[] = [
  // --- 1st Place: Future ---
  {
    id: "future-s4",
    name: "Future",
    shortName: "FUT",
    logoColor: "#FFC000", // yellow
    wins: 0,
    losses: 0,
    players: [
      { id: "s4-future-1", nickname: "Future",         mmr: 4500, gold: 0 },
      { id: "s4-future-2", nickname: "IM still Noob",  mmr: 5684, gold: 45 },
      { id: "s4-future-3", nickname: "SKOOTI",  mmr: 8500, gold: 90 },
      { id: "s4-future-4", nickname: "DeathShadow",    mmr: 2550, gold: 7 },
      { id: "s4-future-5", nickname: "Porthos",        mmr: 2259, gold: 6 },
    ],
  },

  // --- 2nd Place: S1mpleO ---
  {
    id: "s1mpleo-s4",
    name: "S1mpleO",
    shortName: "S1M",
    logoColor: "#E06666", // red
    wins: 0,
    losses: 0,
    players: [
      { id: "s4-s1mpleo-1", nickname: "S1mpleO",        mmr: 4637, gold: 0 },
      { id: "s4-s1mpleo-2", nickname: "BaPU",   mmr: 1900, gold: 0 },
      { id: "s4-s1mpleo-3", nickname: "Ultra.NoobPk",      mmr: 8000, gold: 80 },
      { id: "s4-s1mpleo-4", nickname: "zai_7",             mmr: 4700, gold: 32 },
      { id: "s4-s1mpleo-5", nickname: "TeRroRr",        mmr: 5000, gold: 33 },
    ],
  },

  // --- 3rd Place: Helm ---
  {
    id: "helm-s4",
    name: "Helm",
    shortName: "HLM4",
    logoColor: "#FFD966", // gold
    wins: 0,
    losses: 0,
    players: [
      { id: "s4-helm-1", nickname: "Helm",              mmr: 4400, gold: 0 },
      { id: "s4-helm-2", nickname: "Kunaka",            mmr: 10341, gold: 121 },
      { id: "s4-helm-3", nickname: "Gotatch captain",   mmr: 2700, gold: 6 },
      { id: "s4-helm-4", nickname: "FADE",              mmr: 4438, gold: 11 },
      { id: "s4-helm-5", nickname: "Madlad",            mmr: 3024, gold: 12 },
    ],
  },

  // --- Team 1: pYro ---
  {
    id: "pyro-s4",
    name: "pYro",
    shortName: "PYR",
    logoColor: "#4A86E8", // blue
    wins: 0,
    losses: 0,
    players: [
      { id: "s4-pyro-1", nickname: "pYro",            mmr: 3617, gold: 0 },
      { id: "s4-pyro-2", nickname: "Master Instinct", mmr: 8100, gold: 128 },
      { id: "s4-pyro-3", nickname: "Roronoa Zoro",    mmr: 2531, gold: 10 },
      { id: "s4-pyro-4", nickname: "Zombie",          mmr: 1979, gold: 3 },
      { id: "s4-pyro-5", nickname: "SSM-iwnl",       mmr: 3300, gold: 30 },
    ],
  },

  // --- Team 2: LightNing Goku ---
  {
    id: "lightninggoku-s4",
    name: "LightNing Goku",
    shortName: "LNG",
    logoColor: "#E06666", // red-ish
    wins: 0,
    losses: 0,
    players: [
      { id: "s4-lng-1", nickname: "LightNing Goku",  mmr: 4710, gold: 0 },
      { id: "s4-lng-2", nickname: "Sejlur",          mmr: 7882, gold: 110 },
      { id: "s4-lng-3", nickname: "Iceman-",         mmr: 3368, gold: 17 },
      { id: "s4-lng-4", nickname: "aizEn-",          mmr: 4242, gold: 20 },
      { id: "s4-lng-5", nickname: "*Foujii",         mmr: 2990, gold: 6 },
    ],
  },

  // --- Team 6: Rinne ---
  {
    id: "rinne-s4",
    name: "Rinne",
    shortName: "RIN4",
    logoColor: "#B45F06", // brown
    wins: 0,
    losses: 0,
    players: [
      { id: "s4-rinne-1", nickname: "Rinne",     mmr: 4500, gold: 0 },
      { id: "s4-rinne-2", nickname: "Fyt",       mmr: 6691, gold: 113 },
      { id: "s4-rinne-3", nickname: "Flamy",     mmr: 2403, gold: 19 },
      { id: "s4-rinne-4", nickname: "Mr Pudge",  mmr: 4142, gold: 40 },
      { id: "s4-rinne-5", nickname: "The Beast", mmr: 1026, gold: 2 },
    ],
  },

  // --- Team 9: TamBamGOD ---
  {
    id: "tambamgod-s4",
    name: "TamBamGOD",
    shortName: "TBG",
    logoColor: "#F6B26B", // orange
    wins: 0,
    losses: 0,
    players: [
      { id: "s4-tbg-1", nickname: "TamBamGOD",            mmr: 3829, gold: 0 },
      { id: "s4-tbg-2", nickname: "MGL",                  mmr: 5891, gold: 90 },
      { id: "s4-tbg-3", nickname: "Irene",          mmr: 5400, gold: 49 },
      { id: "s4-tbg-4", nickname: "MaDaRa",               mmr: 4234, gold: 20 },
      { id: "s4-tbg-5", nickname: "Arindam7",  mmr: 2166, gold: 6 },
    ],
  },

  // --- Team 14: Draco~ ---
  {
    id: "draco-s4",
    name: "Draco~",
    shortName: "DRC",
    logoColor: "#6AA84F", // green
    wins: 0,
    losses: 0,
    players: [
      { id: "s4-draco-1", nickname: "Draco~",           mmr: 3622, gold: 0 },
      { id: "s4-draco-2", nickname: "SQueEzee-",        mmr: 7233, gold: 115 },
      { id: "s4-draco-3", nickname: "Anzu",             mmr: 5420, gold: 42 },
      { id: "s4-draco-4", nickname: "Eternal_Bliz2ard", mmr: 3822, gold: 9 },
      { id: "s4-draco-5", nickname: "itus",             mmr: 2234, gold: 5 },
    ],
  },

  // --- Team 15: Prime.One ---
  {
    id: "primeone-s4",
    name: "Prime.One",
    shortName: "PRM",
    logoColor: "#E691B8", // pink
    wins: 0,
    losses: 0,
    players: [
      { id: "s4-prime-1", nickname: "Prime.One",   mmr: 4517, gold: 0 },
      { id: "s4-prime-2", nickname: "Razer",       mmr: 5600, gold: 70 },
      { id: "s4-prime-3", nickname: "Dis.Traction", mmr: 3320, gold: 17 },
      { id: "s4-prime-4", nickname: "BOOM",        mmr: 4500, gold: 22 },
      { id: "s4-prime-5", nickname: "RB",          mmr: 5400, gold: 38 },
    ],
  },

  // --- Team 20: Penda ---
  {
    id: "penda-s4",
    name: "Penda",
    shortName: "PND4",
    logoColor: "#B4A7D6", // lavender
    wins: 0,
    losses: 0,
    players: [
      { id: "s4-penda-1", nickname: "Penda",     mmr: 3750, gold: 0 },
      { id: "s4-penda-2", nickname: "vanished-", mmr: 3749, gold: 36 },
      { id: "s4-penda-3", nickname: "pEnduUu",   mmr: 5548, gold: 50 },
      { id: "s4-penda-4", nickname: "DJ",        mmr: 5158, gold: 31 },
      { id: "s4-penda-5", nickname: "JiMmY#",    mmr: 4009, gold: 50 },
    ],
  },

  // --- Team 21: Muri ---
  {
    id: "muri-s4",
    name: "Muri",
    shortName: "MRI",
    logoColor: "#4A86E8", // blue
    wins: 0,
    losses: 0,
    players: [
      { id: "s4-muri-1", nickname: "Muri",    mmr: 4300, gold: 0 },
      { id: "s4-muri-2", nickname: "BlisS",  mmr: 5410, gold: 46 },
      { id: "s4-muri-3", nickname: "Maldini",     mmr: 3200, gold: 46 },
      { id: "s4-muri-4", nickname: "Kolly", mmr: 4600, gold: 45 },
      { id: "s4-muri-5", nickname: "skipper", mmr: 3600, gold: 45 },
    ],
  },

  // --- Team 4: Shaidota ---
  {
    id: "shaidota-s4",
    name: "Shaidota",
    shortName: "SH4",
    logoColor: "#93C47D", // light green
    wins: 0,
    losses: 0,
    players: [
      { id: "s4-shai-1", nickname: "Shaidota",      mmr: 3800, gold: 0 },
      { id: "s4-shai-2", nickname: "Voodoo",        mmr: 6100, gold: 92 },
      { id: "s4-shai-3", nickname: "Inner Peace-",  mmr: 5566, gold: 45 },
      { id: "s4-shai-4", nickname: "FOX",           mmr: 3102, gold: 21 },
      { id: "s4-shai-5", nickname: "Fren-_-zied",   mmr: 3000, gold: 8 },
    ],
  },

  // --- Team 13: Dr_Nemesis_X ---
  {
    id: "drnemesis-s4",
    name: "Dr_Nemesis_X",
    shortName: "DNX",
    logoColor: "#6D9EEB", // light blue
    wins: 0,
    losses: 0,
    players: [
      { id: "s4-dnx-1", nickname: "Dr_Nemesis_X",  mmr: 3810, gold: 0 },
      { id: "s4-dnx-2", nickname: "GranD_MasTeR-", mmr: 8319, gold: 118 },
      { id: "s4-dnx-3", nickname: "Seedhemaut",    mmr: 2300, gold: 6 },
      { id: "s4-dnx-4", nickname: "Maddened",      mmr: 5998, gold: 39 },
      { id: "s4-dnx-5", nickname: "RHUM-RON",      mmr: 1290, gold: 2 },
    ],
  },

  // --- Team 19: rA'V! ---
  {
    id: "rav-s4",
    name: "rA'V!",
    shortName: "RAV",
    logoColor: "#F4CCCC", // light red
    wins: 0,
    losses: 0,
    players: [
      { id: "s4-rav-1", nickname: "rA'V!",  mmr: 4900, gold: 0 },
      { id: "s4-rav-2", nickname: "Zonark",  mmr: 6700, gold: 105 },
      { id: "s4-rav-3", nickname: "RyuGa",   mmr: 4504, gold: 27 },
      { id: "s4-rav-4", nickname: "PADA THE F",  mmr: 2732, gold: 8 },
      { id: "s4-rav-5", nickname: "J",       mmr: 1154, gold: 0 },
    ],
  },

  // --- Team 8: NJ ---
  {
    id: "nj-s4",
    name: "NJ",
    shortName: "NJ4",
    logoColor: "#C27BA0", // pink-ish
    wins: 0,
    losses: 0,
    players: [
      { id: "s4-nj-1", nickname: "Nj",      mmr: 4198, gold: 0 },
      { id: "s4-nj-2", nickname: "Uma1s",   mmr: 9200, gold: 123 },
      { id: "s4-nj-3", nickname: "Ali Gm'Y",  mmr: 4620, gold: 21 },
      { id: "s4-nj-4", nickname: "Naruto",  mmr: 2801, gold: 6 },
      { id: "s4-nj-5", nickname: "Markeloff",  mmr: 2400, gold: 5 },
    ],
  },

  // --- Team 12: Eric Dane ---
  {
    id: "ericdane-s4",
    name: "Eric Dane",
    shortName: "ED4",
    logoColor: "#BF9000", // dark gold
    wins: 0,
    losses: 0,
    players: [
      { id: "s4-ed-1", nickname: "Eric Dane",  mmr: 4500, gold: 0 },
      { id: "s4-ed-2", nickname: "Tintin000",  mmr: 4600, gold: 39 },
      { id: "s4-ed-3", nickname: "Mask",       mmr: 3626, gold: 10 },
      { id: "s4-ed-4", nickname: "Lala",       mmr: 6050, gold: 63 },
      { id: "s4-ed-5", nickname: "Deathgods",  mmr: 4650, gold: 36 },
    ],
  },

  // --- Team 5: plutoski ---
  {
    id: "plutoski-s4",
    name: "plutoski",
    shortName: "PLT",
    logoColor: "#FFD966", // yellow
    wins: 0,
    losses: 0,
    players: [
      { id: "s4-plut-1", nickname: "plutoski",    mmr: 4300, gold: 0 },
      { id: "s4-plut-2", nickname: "bull",        mmr: 2700, gold: 18 },
      { id: "s4-plut-3", nickname: "Dranzer",     mmr: 6511, gold: 41 },
      { id: "s4-plut-4", nickname: "Toji Khan",   mmr: 6999, gold: 42 },
      { id: "s4-plut-5", nickname: "Mind_Flay3R", mmr: 5339, gold: 51 },
    ],
  },

  // --- Team 7: Vanara ---
  {
    id: "vanara-s4",
    name: "Vanara",
    shortName: "VNR",
    logoColor: "#76A5AF", // teal
    wins: 0,
    losses: 0,
    players: [
      { id: "s4-van-1", nickname: "Vanara",         mmr: 3473, gold: 0 },
      { id: "s4-van-2", nickname: "ome1r",        mmr: 9000, gold: 139 },
      { id: "s4-van-3", nickname: "Memelord Ozai",  mmr: 2330, gold: 10 },
      { id: "s4-van-4", nickname: "Atomic",         mmr: 3300, gold: 8 },
      { id: "s4-van-5", nickname: "DynamoDon",      mmr: 3000, gold: 19 },
    ],
  },

  // --- Team 24: Shikamaru ---
  {
    id: "shikamaru-s4",
    name: "Shikamaru",
    shortName: "SHIK4",
    logoColor: "#E06666", // red
    wins: 0,
    losses: 0,
    players: [
      { id: "s4-shika4-1", nickname: "Shikamaru",    mmr: 3322, gold: 0 },
      { id: "s4-shika4-2", nickname: "cpt_flux",        mmr: 6548, gold: 125 },
      { id: "s4-shika4-3", nickname: "",  mmr: 4231, gold: 51 },
      { id: "s4-shika4-4", nickname: "Chinigami",    mmr: 2100, gold: 4 },
      { id: "s4-shika4-5", nickname: "Maddy",        mmr: 1386, gold: 2 },
    ],
  },

  // --- Team 22: zRomep ---
  {
    id: "zromep-s4",
    name: "zRomep",
    shortName: "ZRM",
    logoColor: "#FFE599", // yellow
    wins: 0,
    losses: 0,
    players: [
      { id: "s4-zrom-1", nickname: "zRomep",  mmr: 3262, gold: 0 },
      { id: "s4-zrom-2", nickname: "RockeR",  mmr: 5868, gold: 78 },
      { id: "s4-zrom-3", nickname: "Narai",   mmr: 5600, gold: 75 },
      { id: "s4-zrom-4", nickname: "ScripTeR",  mmr: 3300, gold: 12 },
      { id: "s4-zrom-5", nickname: "Asd",     mmr: 3207, gold: 20 },
    ],
  },
];

export const season4Teams: Team[] = season4TeamsRaw.map((t) => ({
  ...t,
  averageMMR: calcAvgMMR(t.players),
}));


/* =====================
   Season 5 stacks
   ===================== */

const season5TeamsRaw: Omit<Team, "averageMMR">[] = [
  // Group A – Team 5 Sai
  {
    id: "sai-s5",
    name: "Sai",
    shortName: "SAI5",
    logoColor: "#F6B26B", // orange-ish
    wins: 0,
    losses: 0,
    players: [
      { id: "s5-sai-1", nickname: "Sai",           mmr: 5775, gold: 0 },
      { id: "s5-sai-2", nickname: "Xcarnation",    mmr: 6100, gold: 0 },
      { id: "s5-sai-3", nickname: "Anzu",          mmr: 6200, gold: 101 },
      { id: "s5-sai-4", nickname: "Echo Salami",   mmr: 3925, gold: 33 },
      { id: "s5-sai-5", nickname: "*Foujii",        mmr: 2943, gold: 10 },
    ],
  },

  // Team 21 zRomep
  {
    id: "zromep-s5",
    name: "zRomep",
    shortName: "ZRM5",
    logoColor: "#FFD966",
    wins: 0,
    losses: 0,
    players: [
      { id: "s5-zromep-1", nickname: "zRomep",        mmr: 3262, gold: 0 },
      { id: "s5-zromep-2", nickname: "Ali Gm'Y",        mmr: 4820, gold: 0 },
      { id: "s5-zromep-3", nickname: "Impeccable",    mmr: 5009, gold: 131 },
      { id: "s5-zromep-4", nickname: "tadi_uncle",    mmr: 3555, gold: 44 },
      { id: "s5-zromep-5", nickname: "U from miri",   mmr: 2457, gold: 13 },
    ],
  },

  // Team 24 Dr_Nemesis_X
  {
    id: "drnemesis-s5",
    name: "Dr_Nemesis_X",
    shortName: "DNX5",
    logoColor: "#A4C2F4",
    wins: 0,
    losses: 0,
    players: [
      { id: "s5-dnx-1", nickname: "Dr_Nemesis_X",  mmr: 3964, gold: 0 },
      { id: "s5-dnx-2", nickname: "Uma1s",         mmr: 9260, gold: 0 },
      { id: "s5-dnx-3", nickname: "Bomberman™",    mmr: 2900, gold: 10 },
      { id: "s5-dnx-4", nickname: "Shaidota",          mmr: 3500, gold: 27 },
      { id: "s5-dnx-5", nickname: "Mystic_Bolt",   mmr: 4626, gold: 97 },
    ],
  },

  // Team 6 FluX-
  {
    id: "flux-s5",
    name: "FluX-",
    shortName: "FLX5",
    logoColor: "#FFE599",
    wins: 0,
    losses: 0,
    players: [
      { id: "s5-flux-1", nickname: "cpt_flux",           mmr: 6300, gold: 0 },
      { id: "s5-flux-2", nickname: "FADE",           mmr: 4600, gold: 0 },
      { id: "s5-flux-3", nickname: "Memelord Ozai",   mmr: 2618, gold: 12 },
      { id: "s5-flux-4", nickname: "FOX",             mmr: 3600, gold: 40 },
      { id: "s5-flux-5", nickname: "CD.LostfromLight",  mmr: 4400, gold: 100 },
    ],
  },

  // Team 4 Helm
  {
    id: "helm-s5",
    name: "Team Helm",
    shortName: "HLM5",
    logoColor: "#F1C232",
    wins: 0,
    losses: 0,
    players: [
      { id: "s5-helm-1", nickname: "Helm",              mmr: 5021, gold: 106 },
      { id: "s5-helm-2", nickname: "MaDaRa",            mmr: 4600, gold: 0 },
      { id: "s5-helm-3", nickname: "m1p07",             mmr: 7100, gold:46 }, 
      { id: "s5-helm-4", nickname: "*-*-$HAZAM-*-*",    mmr: 4300, gold: 53 },
      { id: "s5-helm-5", nickname: "SJ",                mmr: 2800, gold: 7 },
    ],
  },

  // Team 3 Ez | LightNing Goku
  {
    id: "ezlng-s5",
    name: "Ez | LightNing Goku",
    shortName: "EZLG",
    logoColor: "#6FA8DC",
    wins: 0,
    losses: 0,
    players: [
      { id: "s5-ez-1", nickname: "LightNing Goku",  mmr: 5100, gold: 0 },
      { id: "s5-ez-2", nickname: "KFP",                   mmr: 5725, gold: 0 },
      { id: "s5-ez-3", nickname: "NGX|`Miracle~",         mmr: 3840, gold: 30 },
      { id: "s5-ez-4", nickname: "Inner Peace-",          mmr: 5700, gold: 90 },
      { id: "s5-ez-5", nickname: "DynamoDon",             mmr: 3000, gold: 33 },
    ],
  },

  // Team 14 Sexy
  {
    id: "sexy-s5",
    name: "Sexy",
    shortName: "SXY5",
    logoColor: "#E06666",
    wins: 0,
    losses: 0,
    players: [
      { id: "s5-sexy-1", nickname: "Sexy",         mmr: 4520, gold: 0 },
      { id: "s5-sexy-2", nickname: "Ultra.NoobPk",  mmr: 7900, gold: 0 },
      { id: "s5-sexy-3", nickname: "ome1r",      mmr: 5341, gold: 113 },
      { id: "s5-sexy-4", nickname: "Munna Lisa",   mmr: 2352, gold: 1 },
      { id: "s5-sexy-5", nickname: "Godspeed",     mmr: 2300, gold: 25 }, 
    ],
  },

  // Team 7 Goku-Shery
  {
    id: "gokushery-s5",
    name: "Goku-Shery",
    shortName: "GOKU5",
    logoColor: "#C27BA0",
    wins: 0,
    losses: 0,
    players: [
      { id: "s5-goku-1", nickname: "Goku-Shery",  mmr: 4497, gold: -1 },
      { id: "s5-goku-2", nickname: "ome1r",       mmr: 9500, gold: 0 },
      { id: "s5-goku-3", nickname: "zai_7",       mmr: 5127, gold: 82 },
      { id: "s5-goku-4", nickname: "Vexcon",      mmr: 2441, gold: 24 },
      { id: "s5-goku-5", nickname: "ZukeGod",     mmr: 3400, gold: 24 },
    ],
  },

  // Team 27 EXe
  {
    id: "exe-s5",
    name: "EXe",
    shortName: "EXE5",
    logoColor: "#3C78D8",
    wins: 0,
    losses: 0,
    players: [
      { id: "s5-exe-1", nickname: "EXe",         mmr: 6253, gold: 0 },
      { id: "s5-exe-2", nickname: "SiniOmega",   mmr: 3011, gold: 0 },
      { id: "s5-exe-3", nickname: "Rinne",       mmr: 5468, gold: 87 },
      { id: "s5-exe-4", nickname: "skipper",     mmr: 4027, gold: 40 },
      { id: "s5-exe-5", nickname: "zx",          mmr: 3218, gold: 43 },
    ],
  },

  // Team 1 Bakabot
  {
    id: "bakabot-s5",
    name: "Bakabot",
    shortName: "BAK5",
    logoColor: "#6AA84F",
    wins: 0,
    losses: 0,
    players: [
      { id: "s5-baka-1", nickname: "Bakabot",     mmr: 6000, gold: 0 },
      { id: "s5-baka-2", nickname: "Prime.One",   mmr: 4732, gold: 0 },
      { id: "s5-baka-3", nickname: "Jinx",       mmr: 5715, gold: 154 },
      { id: "s5-baka-4", nickname: "Potatobuoy",  mmr: 1900, gold: 0 },
      { id: "s5-baka-5", nickname: "Skyie@",      mmr: 1600, gold: 0 },
    ],
  },

  // Team 28 Midas
  {
    id: "midas-s5",
    name: "Midas",
    shortName: "MID5",
    logoColor: "#FFD966",
    wins: 0,
    losses: 0,
    players: [
      { id: "s5-midas-1", nickname: "Midas",           mmr: 7500, gold: 138 },
      { id: "s5-midas-2", nickname: "F(x)",            mmr: 4600, gold: 0 },
      { id: "s5-midas-3", nickname: "yt/JNJISHNU",     mmr: 6500, gold: 0 }, // Replaced
      { id: "s5-midas-4", nickname: "LUCIFERROCKER",   mmr: 2400, gold: 2 },
      { id: "s5-midas-5", nickname: "DEAN",            mmr: 1617, gold: 2 },
    ],
  },

  // Team 12 Sasuke (DISQUALIFIED)
  {
    id: "sasuke-s5",
    name: "Sasuke",
    shortName: "SAS5",
    logoColor: "#B4A7D6",
    wins: 0,
    losses: 0,
    players: [
      { id: "s5-sasuke-1", nickname: "Sasuke",  mmr: 8000, gold: 0 },
      { id: "s5-sasuke-2", nickname: "Yoko",    mmr: 6050, gold: 0 },
      { id: "s5-sasuke-3", nickname: "Irene",   mmr: 4900, gold: 63 },
      { id: "s5-sasuke-4", nickname: "YuRi-smurf",    mmr: 3000, gold: 25 },
      { id: "s5-sasuke-5", nickname: "Lily",    mmr: 1769, gold: 41 },
    ],
  },

  // Team 19 Billy
  {
    id: "billy-s5",
    name: "Billy",
    shortName: "BLY5",
    logoColor: "#E69138",
    wins: 0,
    losses: 0,
    players: [
      { id: "s5-billy-1", nickname: "Billy",            mmr: 3200, gold: 3 },
      { id: "s5-billy-2", nickname: "Master Instinct",  mmr: 8011, gold: 0 },
      { id: "s5-billy-3", nickname: "BrõwÑ ẞöy",        mmr: 5047, gold: 98 },
      { id: "s5-billy-4", nickname: "pYro",             mmr: 3850, gold: 43 },
      { id: "s5-billy-5", nickname: "BTT",              mmr: 2000, gold: 5 },
    ],
  },

  // Team 20 S1mple0
  {
    id: "s1mple0-s5",
    name: "S1mple0",
    shortName: "S1M5",
    logoColor: "#F4CCCC",
    wins: 0,
    losses: 0,
    players: [
      { id: "s5-s1mple-1", nickname: "S1mpleO",       mmr: 4348, gold: -1 },
      { id: "s5-s1mple-2", nickname: "TeRroRr",       mmr: 6000, gold: 0 },
      { id: "s5-s1mple-3", nickname: "topuria enjoyer",  mmr: 5750, gold: 117 },
      { id: "s5-s1mple-4", nickname: "BapU",    mmr: 2772, gold: 6 },
      { id: "s5-s1mple-5", nickname: "™тj-кs 凱",       mmr: 3166, gold: 35 },
    ],
  },

  // Team 9 Shikamaru
  {
    id: "shikamaru-s5",
    name: "Shikamaru",
    shortName: "SHK5",
    logoColor: "#A64D79",
    wins: 0,
    losses: 0,
    players: [
      { id: "s5-shika-1", nickname: "Shikamaru",      mmr: 4468, gold: 0 },
      { id: "s5-shika-2", nickname: "Erza Scarlet",   mmr: 7219, gold: 0 },
      { id: "s5-shika-3", nickname: "Changing Star",  mmr: 4333, gold: 51 },
      { id: "s5-shika-4", nickname: "Mask",         mmr: 4800, gold: 94 },
      { id: "s5-shika-5", nickname: "ConFi",          mmr: 1367, gold: 0 },
    ],
  },

  // Team 15 killua
  {
    id: "killua-s5",
    name: "killua",
    shortName: "KIL5",
    logoColor: "#FFE599",
    wins: 0,
    losses: 0,
    players: [
      { id: "s5-killua-1", nickname: "Setupathi",     mmr: 5100, gold: 0 },
      { id: "s5-killua-2", nickname: "Dranzer",    mmr: 6276, gold: 0 },
      { id: "s5-killua-3", nickname: "Juker",      mmr: 5400, gold: 122 },
      { id: "s5-killua-4", nickname: "SSM-iwnl", mmr: 3450, gold: 25 },
      { id: "s5-killua-5", nickname: "Zombie",     mmr: 1750, gold: 1 },
    ],
  },

  // Team 8 bull
  {
    id: "bull-s5",
    name: "bull",
    shortName: "BULL",
    logoColor: "#C00000",
    wins: 0,
    losses: 0,
    players: [
      { id: "s5-bull-1", nickname: "bull",       mmr: 2700, gold: 0 },
      { id: "s5-bull-2", nickname: "Kunaka",     mmr: 11000, gold: 0 },
      { id: "s5-bull-3", nickname: "Rockrobin",  mmr: 5000, gold: 102 },
      { id: "s5-bull-4", nickname: "Mslayer",  mmr: 4000, gold: 25 },
      { id: "s5-bull-5", nickname: "Dracarys",   mmr: 2744, gold: 4 },
    ],
  },

  // Team 10 shadow
  {
    id: "shadow-s5",
    name: "shadow",
    shortName: "SHDW5",
    logoColor: "#F4CCCC",
    wins: 0,
    losses: 0,
    players: [
      { id: "s5-shadow-1", nickname: "shadow",          mmr: 4600, gold: 0 },
      { id: "s5-shadow-2", nickname: "dp",              mmr: 5794, gold: 0 },
      { id: "s5-shadow-3", nickname: "Ming~ ^._.^",     mmr: 5792, gold: 93 },
      { id: "s5-shadow-4", nickname: "CurserdTerror",     mmr: 4702, gold: 47 },
      { id: "s5-shadow-5", nickname: "I will bully u",  mmr: 2741, gold: 17 },
    ],
  },

  // Team 11 N1KHIL
  {
    id: "n1khil-s5",
    name: "N1KHIL",
    shortName: "NKL5",
    logoColor: "#E69138",
    wins: 0,
    losses: 0,
    players: [
      { id: "s5-n1k-1", nickname: "Nikhil",            mmr: 3680, gold: 0 },
      { id: "s5-n1k-2", nickname: "Gorki",  mmr: 6300, gold: 0 },
      { id: "s5-n1k-3", nickname: "Server",            mmr: 4300, gold: 87 },
      { id: "s5-n1k-4", nickname: "YOUNOOB",           mmr: 3302, gold: 27 },
      { id: "s5-n1k-5", nickname: "MVRK",           mmr: 3000, gold: 48 },

    ],
  },

  // Team 17 Shirleythomas
  {
    id: "shirley-s5",
    name: "Shirleythomas",
    shortName: "SHRL",
    logoColor: "#93C47D",
    wins: 0,
    losses: 0,
    players: [
      { id: "s5-shirley-1", nickname: "Shirleythomas",        mmr: 3700, gold: 0 },
      { id: "s5-shirley-2", nickname: "OzEe",                 mmr: 6100, gold: 0 },
      { id: "s5-shirley-3", nickname: "RockeR",               mmr: 6400, gold: 141 },
      { id: "s5-shirley-4", nickname: "°Kyuubi°",               mmr: 2900, gold:7  },
      { id: "s5-shirley-5", nickname: "Miracles from heaven!",  mmr: 2401, gold: 15 },
    ],
  },

  // Team 2 rA'V!
  {
    id: "rav-s5",
    name: "rA'V!",
    shortName: "RAV5",
    logoColor: "#B45F06",
    wins: 0,
    losses: 0,
    players: [
      { id: "s5-rav-1", nickname: "rA'V!",         mmr: 4600, gold: 0 },
      { id: "s5-rav-2", nickname: "humble",        mmr: 8100, gold: 0 },
      { id: "s5-rav-3", nickname: "Ov3rconfidenc3",  mmr: 3450, gold: 31 },
      { id: "s5-rav-4", nickname: "Jin[X]eD",    mmr: 4598, gold: 58 },
      { id: "s5-rav-5", nickname: "MrBeanBag",     mmr: 3960, gold: 49 },
    ],
  },

  // Team 25 Hina
  {
    id: "hina-s5",
    name: "Hina",
    shortName: "HINA",
    logoColor: "#F9CB9C",
    wins: 0,
    losses: 0,
    players: [
      { id: "s5-hina-1", nickname: "Hina",              mmr: 4850, gold: 1 },
      { id: "s5-hina-2", nickname: "έ_v!Ḷ₥!N_Đ",        mmr: 4050, gold: 0 }, // Replaced
      { id: "s5-hina-3", nickname: "r3ciprocal",        mmr: 5675, gold: 141 },
      { id: "s5-hina-4", nickname: "vanished-",         mmr: 3608, gold: 32 },
      { id: "s5-hina-5", nickname: "--== | Ad!TyA | ==--",  mmr: 1990, gold: 2 },
    ],
  },

  // Team 16 Fyt
  {
    id: "fyt-s5",
    name: "Fyt",
    shortName: "FYT5",
    logoColor: "#FFD966",
    wins: 0,
    losses: 0,
    players: [
      { id: "s5-fyt-1", nickname: "Fyt",         mmr: 6801, gold: 0 },
      { id: "s5-fyt-2", nickname: "Hunter",      mmr: 3437, gold: 0 },
      { id: "s5-fyt-3", nickname: "ZeT",         mmr: 7069, gold: 104 },
      { id: "s5-fyt-4", nickname: "Madlad",      mmr: 3024, gold: 24 },
      { id: "s5-fyt-5", nickname: "Fren-_-zied", mmr: 3000, gold: 31 },
    ],
  },

  // Team 22 Banner
  {
    id: "banner-s5",
    name: "Banner",
    shortName: "BNR5",
    logoColor: "#FFE599",
    wins: 0,
    losses: 0,
    players: [
      { id: "s5-banner-1", nickname: "Banner",     mmr: 3100, gold: 0 },
      { id: "s5-banner-2", nickname: "Shiro",      mmr: 5600, gold: 0 },
      { id: "s5-banner-3", nickname: "Shrijan",    mmr: 5620, gold: 136 },
      { id: "s5-banner-4", nickname: "ScripTeR",   mmr: 2500, gold: 28 },
      { id: "s5-banner-5", nickname: "Atom1c",     mmr: 3000, gold: 14 },
    ],
  },

  // Team 18 Razer
  {
    id: "razer-s5",
    name: "Team Razer",
    shortName: "RZR5",
    logoColor: "#DBA900",
    wins: 0,
    losses: 0,
    players: [
      { id: "s5-razer-1", nickname: "Razer",          mmr: 6626, gold: 0 },
      { id: "s5-razer-2", nickname: "SUBVERSION",     mmr: 5550, gold: 0 },
      { id: "s5-razer-3", nickname: "BOOM",           mmr: 4500, gold: 94 },
      { id: "s5-razer-4", nickname: "Hero for Fun!",  mmr: 3183, gold: 18 },
      { id: "s5-razer-5", nickname: "Kaisel",         mmr: 3250, gold: 29 },
    ],
  },

  // Team 13 Roronoa Zoro
  {
    id: "roronoa-s5",
    name: "Roronoa Zoro",
    shortName: "ZORO5",
    logoColor: "#93C47D",
    wins: 0,
    losses: 0,
    players: [
      { id: "s5-zoro-1", nickname: "Roronoa Zoro",  mmr: 3250, gold: 0 },
      { id: "s5-zoro-2", nickname: "TamBamGOD",     mmr: 4700, gold: 0 },
      { id: "s5-zoro-3", nickname: "rizwan the fu*ker",  mmr: 5343, gold: 133 },
      { id: "s5-zoro-4", nickname: "Draco~",        mmr: 2834, gold: 28 },
      { id: "s5-zoro-5", nickname: "PADA THE F",    mmr: 3056, gold: 29 },
    ],
  },

  // Team SMURFPANDAS (DQ)
  {
    id: "smurfpandas-s5",
    name: "SMURFPANDAS",
    shortName: "SMRP",
    logoColor: "#6AA84F",
    wins: 0,
    losses: 0,
    players: [
      { id: "s5-smurf-1", nickname: "✪KungFuPanda",  mmr: 5100, gold: 0 },
      { id: "s5-smurf-2", nickname: "Lala",          mmr: 6700, gold: 0 },
      { id: "s5-smurf-3", nickname: "No One",        mmr: 4400, gold: 93 },
      { id: "s5-smurf-4", nickname: "Sparrow-",      mmr: 3574, gold: 28 },
      { id: "s5-smurf-5", nickname: "jhamkuanna",    mmr: 3262, gold: 23 },
    ],
  },

  // Team 23 Future
  {
    id: "future-s5",
    name: "Future",
    shortName: "FUT5",
    logoColor: "#F1C232",
    wins: 0,
    losses: 0,
    players: [
      { id: "s5-future-1", nickname: "Future",   mmr: 4500, gold: 0 },
      { id: "s5-future-2", nickname: "SKOOTI",   mmr: 8700, gold: 0 },
      { id: "s5-future-3", nickname: "Faith",    mmr: 3650, gold: 45 },
      { id: "s5-future-4", nickname: "Bazinga",  mmr: 4000, gold: 66 },
      { id: "s5-future-5", nickname: "Porthos",  mmr: 2307, gold: 23 },
    ],
  },
];

export const season5Teams: Team[] = season5TeamsRaw.map((t) => ({
  ...t,
  averageMMR: calcAvgMMR(t.players),
}));

// ========= ALL SEASONS (for detail pages etc.) =========
export const allTeams: Team[] = [
  ...teams,          // season 1
  ...season2Teams,
  ...season3Teams,
  ...season4Teams,
  ...season5Teams,
];

export function getTeamById(id: string): Team | undefined {
  return allTeams.find((t) => t.id === id);
}

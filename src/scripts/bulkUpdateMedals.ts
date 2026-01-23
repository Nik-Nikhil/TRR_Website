import { getMedalFromMMR } from '../utils/mmrToMedal';

// This script will output the corrected player data
// Copy the output and replace the players array in players.ts

const playersToUpdate = [
  // Player 420
  { id: "420", currentMMR: 4850, peakMMR: 5200 },
  // Reyuk - already correct
  { id: "reyuk", currentMMR: 3250, peakMMR: 3890 },
  // RockeR
  { id: "rocker", currentMMR: 6500, peakMMR: 6500 }, // Immortal
  // Narai
  { id: "narai", currentMMR: 5500, peakMMR: 6000 }, // Divine 5, Immortal
  // Hunt
  { id: "hunt", currentMMR: 6200, peakMMR: 6200 }, // Immortal
  // CLASH
  { id: "clash", currentMMR: 6100, peakMMR: 6100 }, // Immortal
  // Helm
  { id: "helm", currentMMR: 4900, peakMMR: 6000 }, // Divine 2, Immortal
  // Toby
  { id: "toby", currentMMR: 4900, peakMMR: 4900 }, // Divine 2
  // PREDATOR
  { id: "predator", currentMMR: 4900, peakMMR: 4900 }, // Divine 2
  // Kolly
  { id: "kolly", currentMMR: 4700, peakMMR: 4700 }, // Divine 1
  // Server
  { id: "server", currentMMR: 4100, peakMMR: 4900 }, // Ancient 5, Divine 2
  // Phola
  { id: "phola", currentMMR: 3400, peakMMR: 3400 }, // Legend 4
  // MaDaRa
  { id: "madara", currentMMR: 4200, peakMMR: 4200 }, // Ancient 4
  // Machine
  { id: "machine", currentMMR: 3100, peakMMR: 3100 }, // Legend 1
  // MVRK
  { id: "mvrk", currentMMR: 2200, peakMMR: 2200 }, // Crusader 5
  // Irox
  { id: "irox", currentMMR: 5000, peakMMR: 5000 }, // Divine 3
  // Slappy
  { id: "slappy", currentMMR: 3400, peakMMR: 3400 }, // Legend 3
  // Atomic
  { id: "atomic", currentMMR: 2700, peakMMR: 2700 }, // Archon 4
  // r3ciprocal
  { id: "r3ciprocal", currentMMR: 5300, peakMMR: 6000 }, // Divine 4, Immortal
  // abbhY
  { id: "abbhy", currentMMR: 3100, peakMMR: 3100 }, // Legend 1
  // Masara
  { id: "masara", currentMMR: 1900, peakMMR: 1900 }, // Crusader 3
  // Irene
  { id: "irene", currentMMR: 4900, peakMMR: 5500 }, // Divine 2, Divine 5
  // Nikhil
  { id: "nikhil", currentMMR: 3500, peakMMR: 4400 }, // Legend 4, Ancient 5
  // Banner
  { id: "banner", currentMMR: 3100, peakMMR: 3100 }, // Legend 1
  // LordImpaler
  { id: "lordimpaler", currentMMR: 2600, peakMMR: 2600 }, // Archon 3
  // Skyie@
  { id: "skyie", currentMMR: 2200, peakMMR: 2200 }, // Crusader 5
  // Godspeed
  { id: "godspeed", currentMMR: 1300, peakMMR: 1300 }, // Guardian 5
  // GRIMM
  { id: "grimm", currentMMR: 3400, peakMMR: 3400 }, // Legend 3
  // DeathShadow
  { id: "deathshadow", currentMMR: 1600, peakMMR: 1600 }, // Crusader 1
  // Insanekid08
  { id: "insanekid08", currentMMR: 1700, peakMMR: 1700 }, // Crusader 2
  // Bazinga
  { id: "bazinga", currentMMR: 4700, peakMMR: 4700 }, // Divine 1
  // AaRoN
  { id: "aaron", currentMMR: 2700, peakMMR: 2700 }, // Archon 4
  // Bolt
  { id: "bolt", currentMMR: 3700, peakMMR: 3700 }, // Legend 5
  // Billy
  { id: "billy", currentMMR: 1700, peakMMR: 1700 }, // Crusader 2
  // STORM4
  { id: "storm4", currentMMR: 6000, peakMMR: 6000 }, // Immortal
  // Nabeel
  { id: "nabeel", currentMMR: 2500, peakMMR: 2500 }, // Archon 2
];

// Generate medal updates
playersToUpdate.forEach(player => {
  const currentMedal = getMedalFromMMR(player.currentMMR);
  const peakMedal = getMedalFromMMR(player.peakMMR);
  
  console.log(`// ${player.id}`);
  console.log(`currentMedalLabel: "${currentMedal.label}",`);
  console.log(`currentMedalId: "${currentMedal.id}",`);
  console.log(`currentMMR: ${player.currentMMR},`);
  console.log(`peakMedalLabel: "${peakMedal.label}",`);
  console.log(`peakMedalId: "${peakMedal.id}",`);
  console.log(`peakMMR: ${player.peakMMR},`);
  console.log('---');
});

export {};
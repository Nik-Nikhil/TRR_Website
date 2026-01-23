import { getMedalFromMMR } from '../utils/mmrToMedal';

// Complete player data with MMR values from the bulk update script
const playerUpdates = [
  // Players with known MMR values that need updates
  { id: "420", currentMMR: 4850, peakMMR: 5200 },
  { id: "reyuk", currentMMR: 3250, peakMMR: 3890 },
  { id: "rocker", currentMMR: 6500, peakMMR: 6500 },
  { id: "narai", currentMMR: 5500, peakMMR: 6000 },
  { id: "hunt", currentMMR: 6200, peakMMR: 6200 },
  { id: "clash", currentMMR: 6100, peakMMR: 6100 },
  { id: "helm", currentMMR: 4900, peakMMR: 6000 },
  { id: "toby", currentMMR: 4900, peakMMR: 4900 },
  { id: "predator", currentMMR: 4900, peakMMR: 4900 },
  { id: "kolly", currentMMR: 4700, peakMMR: 4700 },
  { id: "server", currentMMR: 4100, peakMMR: 4900 },
  { id: "phola", currentMMR: 3400, peakMMR: 3400 },
  { id: "madara", currentMMR: 4200, peakMMR: 4200 },
  { id: "machine", currentMMR: 3100, peakMMR: 3100 },
  { id: "mvrk", currentMMR: 2200, peakMMR: 2200 },
  { id: "irox", currentMMR: 5000, peakMMR: 5000 },
  { id: "slappy", currentMMR: 3400, peakMMR: 3400 },
  { id: "atomic", currentMMR: 2700, peakMMR: 2700 },
  { id: "r3ciprocal", currentMMR: 5300, peakMMR: 6000 },
  { id: "abbhy", currentMMR: 3100, peakMMR: 3100 },
  { id: "masara", currentMMR: 1900, peakMMR: 1900 },
  { id: "irene", currentMMR: 4900, peakMMR: 5500 },
  { id: "nikhil", currentMMR: 3500, peakMMR: 4400 },
  { id: "banner", currentMMR: 3100, peakMMR: 3100 },
  { id: "lordimpaler", currentMMR: 2600, peakMMR: 2600 },
  { id: "skyie", currentMMR: 2200, peakMMR: 2200 },
  { id: "godspeed", currentMMR: 1300, peakMMR: 1300 },
  { id: "grimm", currentMMR: 3400, peakMMR: 3400 },
  { id: "deathshadow", currentMMR: 1600, peakMMR: 1600 },
  { id: "insanekid08", currentMMR: 1700, peakMMR: 1700 },
  { id: "bazinga", currentMMR: 4700, peakMMR: 4700 },
  { id: "aaron", currentMMR: 2700, peakMMR: 2700 },
  { id: "bolt", currentMMR: 3700, peakMMR: 3700 },
  { id: "billy", currentMMR: 1700, peakMMR: 1700 },
  { id: "storm4", currentMMR: 6000, peakMMR: 6000 },
  { id: "nabeel", currentMMR: 2500, peakMMR: 2500 },
];

console.log('// Updated player medal data based on correct MMR mappings:');
console.log('// Copy and paste these updates into players.ts');
console.log('');

playerUpdates.forEach(player => {
  const currentMedal = getMedalFromMMR(player.currentMMR);
  const peakMedal = getMedalFromMMR(player.peakMMR);
  
  console.log(`// ${player.id}`);
  console.log(`currentMedalLabel: "${currentMedal.label}",`);
  console.log(`currentMedalId: "${currentMedal.id}",`);
  console.log(`currentMMR: ${player.currentMMR},`);
  console.log(`peakMedalLabel: "${peakMedal.label}",`);
  console.log(`peakMedalId: "${peakMedal.id}",`);
  console.log(`peakMMR: ${player.peakMMR},`);
  console.log('');
});

export {};
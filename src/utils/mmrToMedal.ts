// MMR to Medal mapping based on Dota 2 ranking system
export interface MedalInfo {
  id: string;
  label: string;
  minMMR: number;
  maxMMR: number;
}

export const MEDAL_RANKINGS: MedalInfo[] = [
  // Herald
  { id: "Herald_1", label: "Herald 1", minMMR: 0, maxMMR: 153 },
  { id: "Herald_2", label: "Herald 2", minMMR: 154, maxMMR: 307 },
  { id: "Herald_3", label: "Herald 3", minMMR: 308, maxMMR: 461 },
  { id: "Herald_4", label: "Herald 4", minMMR: 462, maxMMR: 615 },
  { id: "Herald_5", label: "Herald 5", minMMR: 616, maxMMR: 769 },

  // Guardian
  { id: "Guardian_1", label: "Guardian 1", minMMR: 770, maxMMR: 923 },
  { id: "Guardian_2", label: "Guardian 2", minMMR: 924, maxMMR: 1077 },
  { id: "Guardian_3", label: "Guardian 3", minMMR: 1078, maxMMR: 1231 },
  { id: "Guardian_4", label: "Guardian 4", minMMR: 1232, maxMMR: 1385 },
  { id: "Guardian_5", label: "Guardian 5", minMMR: 1386, maxMMR: 1539 },

  // Crusader
  { id: "Crusader_1", label: "Crusader 1", minMMR: 1540, maxMMR: 1693 },
  { id: "Crusader_2", label: "Crusader 2", minMMR: 1694, maxMMR: 1847 },
  { id: "Crusader_3", label: "Crusader 3", minMMR: 1848, maxMMR: 2001 },
  { id: "Crusader_4", label: "Crusader 4", minMMR: 2002, maxMMR: 2155 },
  { id: "Crusader_5", label: "Crusader 5", minMMR: 2156, maxMMR: 2309 },

  // Archon
  { id: "Archon_1", label: "Archon 1", minMMR: 2310, maxMMR: 2463 },
  { id: "Archon_2", label: "Archon 2", minMMR: 2464, maxMMR: 2617 },
  { id: "Archon_3", label: "Archon 3", minMMR: 2618, maxMMR: 2771 },
  { id: "Archon_4", label: "Archon 4", minMMR: 2772, maxMMR: 2925 },
  { id: "Archon_5", label: "Archon 5", minMMR: 2926, maxMMR: 3079 },

  // Legend
  { id: "Legend_1", label: "Legend 1", minMMR: 3080, maxMMR: 3233 },
  { id: "Legend_2", label: "Legend 2", minMMR: 3234, maxMMR: 3387 },
  { id: "Legend_3", label: "Legend 3", minMMR: 3388, maxMMR: 3541 },
  { id: "Legend_4", label: "Legend 4", minMMR: 3542, maxMMR: 3695 },
  { id: "Legend_5", label: "Legend 5", minMMR: 3696, maxMMR: 3849 },

  // Ancient
  { id: "Ancient_1", label: "Ancient 1", minMMR: 3850, maxMMR: 4003 },
  { id: "Ancient_2", label: "Ancient 2", minMMR: 4004, maxMMR: 4157 },
  { id: "Ancient_3", label: "Ancient 3", minMMR: 4158, maxMMR: 4311 },
  { id: "Ancient_4", label: "Ancient 4", minMMR: 4312, maxMMR: 4465 },
  { id: "Ancient_5", label: "Ancient 5", minMMR: 4466, maxMMR: 4619 },

  // Divine
  { id: "Divine_1", label: "Divine 1", minMMR: 4620, maxMMR: 4819 },
  { id: "Divine_2", label: "Divine 2", minMMR: 4820, maxMMR: 5019 },
  { id: "Divine_3", label: "Divine 3", minMMR: 5020, maxMMR: 5219 },
  { id: "Divine_4", label: "Divine 4", minMMR: 5220, maxMMR: 5419 },
  { id: "Divine_5", label: "Divine 5", minMMR: 5420, maxMMR: 5619 },

  // Immortal
  { id: "Immortal", label: "Immortal", minMMR: 5620, maxMMR: 99999 },
];

/**
 * Get medal information based on MMR
 */
export function getMedalFromMMR(mmr: number): MedalInfo {
  // Handle edge cases
  if (!mmr || mmr < 0) {
    return { id: "Uncalibrated", label: "Uncalibrated", minMMR: 0, maxMMR: 0 };
  }

  // Find the appropriate medal
  const medal = MEDAL_RANKINGS.find(medal => mmr >= medal.minMMR && mmr <= medal.maxMMR);
  
  if (!medal) {
    // If MMR is higher than Divine 5, it's Immortal
    if (mmr >= 5620) {
      return MEDAL_RANKINGS[MEDAL_RANKINGS.length - 1]; // Immortal
    }
    // Fallback to Uncalibrated
    return { id: "Uncalibrated", label: "Uncalibrated", minMMR: 0, maxMMR: 0 };
  }

  return medal;
}

/**
 * Get medal ID from MMR (for backward compatibility)
 */
export function getMedalIdFromMMR(mmr: number): string {
  return getMedalFromMMR(mmr).id;
}

/**
 * Get medal label from MMR (for backward compatibility)
 */
export function getMedalLabelFromMMR(mmr: number): string {
  return getMedalFromMMR(mmr).label;
}

/**
 * Update player medal information based on their MMR
 */
export function updatePlayerMedals(player: any) {
  const updatedPlayer = { ...player };

  // Update current medal if currentMMR exists
  if (updatedPlayer.currentMMR) {
    const currentMedal = getMedalFromMMR(updatedPlayer.currentMMR);
    updatedPlayer.currentMedalId = currentMedal.id;
    updatedPlayer.currentMedalLabel = currentMedal.label;
  }

  // Update peak medal if peakMMR exists
  if (updatedPlayer.peakMMR) {
    const peakMedal = getMedalFromMMR(updatedPlayer.peakMMR);
    updatedPlayer.peakMedalId = peakMedal.id;
    updatedPlayer.peakMedalLabel = peakMedal.label;
  }

  return updatedPlayer;
}
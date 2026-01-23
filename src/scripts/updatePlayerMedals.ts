import { players } from '../data/players';
import { updatePlayerMedals } from '../utils/mmrToMedal';

/**
 * Script to update all players with correct medals based on their MMR
 * This will generate the updated players array that can be copied back to players.ts
 */
export function generateUpdatedPlayersData() {
  const updatedPlayers = players.map(player => {
    return updatePlayerMedals(player);
  });

  // Generate the TypeScript code for the updated players array
  const playersCode = `export const players: Player[] = [
${updatedPlayers.map(player => {
  return `  {
    id: "${player.id}",
    nickname: "${player.nickname}",
    realName: "${player.realName || ''}",
    avatarUrl: "${player.avatarUrl}",
    seasonBadges: [${player.seasonBadges.map(s => `"${s}"`).join(', ')}],
    hasWonCup: ${player.hasWonCup},
    ${player.cupRank ? `cupRank: "${player.cupRank}",` : ''}
    ${player.cupTooltip ? `cupTooltip: "${player.cupTooltip}",` : ''}
    ${player.cupSeason ? `cupSeason: ${player.cupSeason},` : ''}
    currentMedalLabel: "${player.currentMedalLabel}",
    currentMedalId: "${player.currentMedalId}",
    ${player.currentMMR ? `currentMMR: ${player.currentMMR},` : ''}
    peakMedalLabel: "${player.peakMedalLabel}",
    peakMedalId: "${player.peakMedalId}",
    ${player.peakMMR ? `peakMMR: ${player.peakMMR},` : ''}
    bio: "${player.bio}",
    roles: [${player.roles.map(role => `{ iconSrc: "${role.iconSrc}", label: "${role.label}" }`).join(', ')}],
    steamUrl: "${player.steamUrl}",
    dotabuffUrl: "${player.dotabuffUrl}",
    favoriteHeroes: [${player.favoriteHeroes.map(hero => `{ videoSrc: "${hero.videoSrc}", name: "${hero.name}" }`).join(', ')}],
    ${player.behaviorScore ? `behaviorScore: {
      ${player.behaviorScore.mechanicalSkill ? `mechanicalSkill: ${player.behaviorScore.mechanicalSkill},` : ''}
      ${player.behaviorScore.teamwork ? `teamwork: ${player.behaviorScore.teamwork},` : ''}
      ${player.behaviorScore.communication ? `communication: ${player.behaviorScore.communication},` : ''}
      ${player.behaviorScore.consistency ? `consistency: ${player.behaviorScore.consistency},` : ''}
    },` : ''}
    ${player.specialBadge ? `specialBadge: "${player.specialBadge}",` : ''}
  }`;
}).join(',\n')}
];`;

  return playersCode;
}

// Log the updated data for manual copying
console.log('Updated Players Data:');
console.log(generateUpdatedPlayersData());
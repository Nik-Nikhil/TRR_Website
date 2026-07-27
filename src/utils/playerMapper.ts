// Map database player fields (snake_case) to frontend Player interface (camelCase)
import type { Player as FrontendPlayer } from '../data/players';
import type { Player as DatabasePlayer } from '../services/supabaseService';

export function mapDatabasePlayerToFrontend(dbPlayer: DatabasePlayer): FrontendPlayer {
  return {
    id: dbPlayer.id,
    nickname: dbPlayer.nickname,
    realName: dbPlayer.real_name,
    avatarUrl: dbPlayer.avatar_url || '/avatars/default.jpg',
    
    // Medals
    currentMedalLabel: dbPlayer.current_medal_label || '',
    currentMedalId: dbPlayer.current_medal_id || '',
    currentMMR: dbPlayer.current_mmr,
    peakMedalLabel: dbPlayer.peak_medal_label || '',
    peakMedalId: dbPlayer.peak_medal_id || '',
    peakMMR: dbPlayer.peak_mmr,
    
    // Bio and URLs
    bio: dbPlayer.bio || '',
    steamUrl: dbPlayer.steam_url || '',
    steamId: dbPlayer.steam_id || '',
    dotabuffUrl: dbPlayer.dotabuff_url || '',
    pingRange: dbPlayer.ping_range,
    
    // Arrays (JSONB fields)
    roles: dbPlayer.roles || [],
    favoriteHeroes: dbPlayer.favorite_heroes || [],
    seasonBadges: dbPlayer.season_badges || [],
    
    // Cup data
    hasWonCup: dbPlayer.has_won_cup || false,
    cupRank: dbPlayer.cup_rank as any,
    cupTooltip: dbPlayer.cup_tooltip,
    cupSeason: dbPlayer.cup_season,
    
    // Behavior scores
    behaviorScore: {
      mechanicalSkill: dbPlayer.mechanical_skill,
      teamwork: dbPlayer.teamwork,
      communication: dbPlayer.communication,
      consistency: dbPlayer.consistency,
    },
    
    // Special badge
    specialBadge: dbPlayer.special_badge as any,
  };
}

export function mapFrontendPlayerToDatabase(frontendPlayer: Partial<FrontendPlayer>): Partial<DatabasePlayer> {
  return {
    id: frontendPlayer.id,
    nickname: frontendPlayer.nickname,
    real_name: frontendPlayer.realName,
    avatar_url: frontendPlayer.avatarUrl,
    
    // Medals
    current_medal_label: frontendPlayer.currentMedalLabel,
    current_medal_id: frontendPlayer.currentMedalId,
    current_mmr: frontendPlayer.currentMMR,
    peak_medal_label: frontendPlayer.peakMedalLabel,
    peak_medal_id: frontendPlayer.peakMedalId,
    peak_mmr: frontendPlayer.peakMMR,
    
    // Bio and URLs
    bio: frontendPlayer.bio,
    steam_url: frontendPlayer.steamUrl,
    dotabuff_url: frontendPlayer.dotabuffUrl,
    ping_range: frontendPlayer.pingRange,
    
    // Arrays (JSONB fields)
    roles: frontendPlayer.roles as any,
    favorite_heroes: frontendPlayer.favoriteHeroes as any,
    season_badges: frontendPlayer.seasonBadges as any,
    
    // Cup data
    has_won_cup: frontendPlayer.hasWonCup,
    cup_rank: frontendPlayer.cupRank,
    cup_tooltip: frontendPlayer.cupTooltip,
    cup_season: frontendPlayer.cupSeason,
    
    // Behavior scores
    mechanical_skill: frontendPlayer.behaviorScore?.mechanicalSkill,
    teamwork: frontendPlayer.behaviorScore?.teamwork,
    communication: frontendPlayer.behaviorScore?.communication,
    consistency: frontendPlayer.behaviorScore?.consistency,
    
    // Special badge
    special_badge: frontendPlayer.specialBadge,
  };
}

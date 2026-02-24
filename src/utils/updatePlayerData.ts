// Update all player data in Supabase with complete information
import { supabase } from '../lib/supabase';
import { players } from '../data/players';

interface UpdateResult {
  success: string[];
  errors: { nickname: string; error: string }[];
}

export async function updateAllPlayerData(): Promise<UpdateResult> {
  
  const result: UpdateResult = {
    success: [],
    errors: []
  };

  for (const player of players) {
    try {
      
      // First, find the player by nickname (case-insensitive)
      const { data: existingPlayer, error: fetchError } = await supabase
        .from('players')
        .select('id, nickname')
        .ilike('nickname', player.nickname)
        .maybeSingle();

      if (fetchError) {
        console.error(`❌ Error fetching ${player.nickname}:`, fetchError);
        result.errors.push({ nickname: player.nickname, error: fetchError.message });
        continue;
      }

      if (!existingPlayer) {
        result.errors.push({ nickname: player.nickname, error: 'Player not found in database' });
        continue;
      }

      // Prepare complete update data
      const updateData = {
        // Basic info
        real_name: player.realName || null,
        avatar_url: player.avatarUrl,
        bio: player.bio || null,
        
        // URLs
        steam_url: player.steamUrl || null,
        dotabuff_url: player.dotabuffUrl || null,
        ping_range: player.pingRange || null,
        
        // MMR and Medals
        current_mmr: player.currentMMR || null,
        peak_mmr: player.peakMMR || null,
        current_medal_label: player.currentMedalLabel,
        current_medal_id: player.currentMedalId,
        peak_medal_label: player.peakMedalLabel,
        peak_medal_id: player.peakMedalId,
        
        // Roles (JSONB)
        roles: player.roles || [],
        
        // Favorite Heroes (JSONB)
        favorite_heroes: player.favoriteHeroes || [],
        
        // Season Badges (JSONB)
        season_badges: player.seasonBadges || [],
        
        // Cup data
        has_won_cup: player.hasWonCup || false,
        cup_rank: player.cupRank || null,
        cup_tooltip: player.cupTooltip || null,
        cup_season: player.cupSeason || null,
        
        // Behavior scores (JSONB)
        mechanical_skill: player.behaviorScore?.mechanicalSkill || null,
        teamwork: player.behaviorScore?.teamwork || null,
        communication: player.behaviorScore?.communication || null,
        consistency: player.behaviorScore?.consistency || null,
        
        // Special badge
        special_badge: player.specialBadge || null,
        
        // Update timestamp
        updated_at: new Date().toISOString()
      };

      // Update the player
      const { error: updateError } = await supabase
        .from('players')
        .update(updateData)
        .eq('id', existingPlayer.id);

      if (updateError) {
        console.error(`❌ Error updating ${player.nickname}:`, updateError);
        result.errors.push({ nickname: player.nickname, error: updateError.message });
        continue;
      }

      result.success.push(player.nickname);

    } catch (error) {
      console.error(`❌ Exception for ${player.nickname}:`, error);
      result.errors.push({ 
        nickname: player.nickname, 
        error: error instanceof Error ? error.message : 'Unknown error' 
      });
    }
  }

  return result;
}

// Debug function to check a specific player's data
export async function debugPlayerData(nickname: string) {
  
  // Get from database
  const { data: dbPlayer, error } = await supabase
    .from('players')
    .select('*')
    .ilike('nickname', nickname)
    .maybeSingle();

  if (error) {
    console.error('❌ Database error:', error);
    return;
  }

  if (!dbPlayer) {
    return;
  }

}

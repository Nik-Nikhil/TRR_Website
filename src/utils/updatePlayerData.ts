// Update all player data in Supabase with complete information
import { supabase } from '../lib/supabase';
import { players } from '../data/players';

interface UpdateResult {
  success: string[];
  errors: { nickname: string; error: string }[];
}

export async function updateAllPlayerData(): Promise<UpdateResult> {
  console.log('🔄 Starting complete player data update...');
  console.log(`📊 Total players to update: ${players.length}`);
  
  const result: UpdateResult = {
    success: [],
    errors: []
  };

  for (const player of players) {
    try {
      console.log(`\n🔍 Processing: ${player.nickname}`);
      
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
        console.log(`⚠️ Player not found in database: ${player.nickname}`);
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

      console.log(`✅ Updated: ${player.nickname}`);
      result.success.push(player.nickname);

    } catch (error) {
      console.error(`❌ Exception for ${player.nickname}:`, error);
      result.errors.push({ 
        nickname: player.nickname, 
        error: error instanceof Error ? error.message : 'Unknown error' 
      });
    }
  }

  console.log('\n' + '='.repeat(50));
  console.log('=== Player Data Update Complete ===');
  console.log(`✅ Success: ${result.success.length} players`);
  console.log(`❌ Errors: ${result.errors.length} players`);
  
  if (result.errors.length > 0) {
    console.log('\n❌ Failed players:');
    result.errors.forEach(({ nickname, error }) => {
      console.log(`   • ${nickname}: ${error}`);
    });
  }

  return result;
}

// Debug function to check a specific player's data
export async function debugPlayerData(nickname: string) {
  console.log(`\n🔍 Debugging player data for: ${nickname}`);
  console.log('='.repeat(50));
  
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
    console.log('❌ Player not found in database');
    return;
  }

  console.log('\n📊 Database Data:');
  console.log('   ID:', dbPlayer.id);
  console.log('   Nickname:', dbPlayer.nickname);
  console.log('   Avatar:', dbPlayer.avatar_url);
  console.log('   Current Medal:', dbPlayer.current_medal_label, `(${dbPlayer.current_medal_id})`);
  console.log('   Peak Medal:', dbPlayer.peak_medal_label, `(${dbPlayer.peak_medal_id})`);
  console.log('   Current MMR:', dbPlayer.current_mmr);
  console.log('   Peak MMR:', dbPlayer.peak_mmr);
  console.log('   Roles:', JSON.stringify(dbPlayer.roles, null, 2));
  console.log('   Favorite Heroes:', JSON.stringify(dbPlayer.favorite_heroes, null, 2));
  console.log('   Season Badges:', JSON.stringify(dbPlayer.season_badges, null, 2));
  console.log('   Has Won Cup:', dbPlayer.has_won_cup);
  console.log('   Bio:', dbPlayer.bio);
  console.log('   Steam URL:', dbPlayer.steam_url);
  console.log('   Dotabuff URL:', dbPlayer.dotabuff_url);

  // Get from local data
  const localPlayer = players.find(p => p.nickname.toLowerCase() === nickname.toLowerCase());
  
  if (localPlayer) {
    console.log('\n📋 Local Data:');
    console.log('   Current Medal:', localPlayer.currentMedalLabel, `(${localPlayer.currentMedalId})`);
    console.log('   Peak Medal:', localPlayer.peakMedalLabel, `(${localPlayer.peakMedalId})`);
    console.log('   Current MMR:', localPlayer.currentMMR);
    console.log('   Peak MMR:', localPlayer.peakMMR);
    console.log('   Roles:', localPlayer.roles.length, 'roles');
    console.log('   Favorite Heroes:', localPlayer.favoriteHeroes.length, 'heroes');
    console.log('   Season Badges:', localPlayer.seasonBadges.length, 'badges');
  }

  console.log('='.repeat(50));
}

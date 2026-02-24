// Fix captain player_id to use UUID from database instead of local string ID
import { supabase } from '../lib/supabase';

export async function fixCaptainIds() {
  
  // Get all captains
  const { data: captains, error: captainsError } = await supabase
    .from('captains')
    .select('*');
  
  if (captainsError) {
    console.error('❌ Error fetching captains:', captainsError);
    return { success: false, error: captainsError.message };
  }
  
  if (!captains || captains.length === 0) {
    return { success: true, message: 'No captains to fix' };
  }
  
  let fixed = 0;
  let skipped = 0;
  let errors = 0;
  
  for (const captain of captains) {
    
    // Check if player_id is already a UUID
    const isUUID = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(captain.player_id);
    
    if (isUUID) {
      skipped++;
      continue;
    }
    
    // Find player by nickname in database
    const { data: player, error: playerError } = await supabase
      .from('players')
      .select('id, nickname')
      .ilike('nickname', captain.player_nickname)
      .maybeSingle();
    
    if (playerError) {
      console.error('   ❌ Error finding player:', playerError);
      errors++;
      continue;
    }
    
    if (!player) {
      errors++;
      continue;
    }
    
    // Update captain record with correct UUID
    const { error: updateError } = await supabase
      .from('captains')
      .update({ player_id: player.id })
      .eq('id', captain.id);
    
    if (updateError) {
      console.error('   ❌ Error updating captain:', updateError);
      errors++;
      continue;
    }
    
    fixed++;
  }
  
  return {
    success: true,
    fixed,
    skipped,
    errors
  };
}

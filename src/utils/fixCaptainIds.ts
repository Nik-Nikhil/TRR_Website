// Fix captain player_id to use UUID from database instead of local string ID
import { supabase } from '../lib/supabase';

export async function fixCaptainIds() {
  console.log('\n🔧 Fixing Captain IDs');
  console.log('='.repeat(50));
  
  // Get all captains
  const { data: captains, error: captainsError } = await supabase
    .from('captains')
    .select('*');
  
  if (captainsError) {
    console.error('❌ Error fetching captains:', captainsError);
    return { success: false, error: captainsError.message };
  }
  
  if (!captains || captains.length === 0) {
    console.log('⚠️ No captains found');
    return { success: true, message: 'No captains to fix' };
  }
  
  console.log(`📊 Found ${captains.length} captains to check\n`);
  
  let fixed = 0;
  let skipped = 0;
  let errors = 0;
  
  for (const captain of captains) {
    console.log(`\n🔍 Checking: ${captain.player_nickname}`);
    console.log(`   Current player_id: ${captain.player_id}`);
    
    // Check if player_id is already a UUID
    const isUUID = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(captain.player_id);
    
    if (isUUID) {
      console.log('   ✅ Already a UUID, skipping');
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
      console.log('   ❌ Player not found in database');
      errors++;
      continue;
    }
    
    console.log(`   📝 Found player UUID: ${player.id}`);
    
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
    
    console.log('   ✅ Updated successfully');
    fixed++;
  }
  
  console.log('\n' + '='.repeat(50));
  console.log('📊 Summary:');
  console.log(`   ✅ Fixed: ${fixed}`);
  console.log(`   ⏭️  Skipped (already UUID): ${skipped}`);
  console.log(`   ❌ Errors: ${errors}`);
  console.log('='.repeat(50));
  
  return {
    success: true,
    fixed,
    skipped,
    errors
  };
}

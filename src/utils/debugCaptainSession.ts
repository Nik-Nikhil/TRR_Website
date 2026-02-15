// Debug captain session and lookup
import { supabase } from '../lib/supabase';
import { AuthService } from '../services/auth';
import captainService from '../services/captainService';

export async function debugCaptainSession() {
  console.log('\n🔍 Debugging Captain Session');
  console.log('='.repeat(50));
  
  // 1. Check current session
  const session = AuthService.getCurrentPlayerSession();
  console.log('\n1️⃣ Current Player Session:');
  if (session) {
    console.log('   Player ID:', session.playerId);
    console.log('   Nickname:', session.nickname);
    console.log('   Type:', session.type);
  } else {
    console.log('   ❌ No session found');
    return;
  }
  
  // 2. Check all captains in database
  console.log('\n2️⃣ All Captains in Database:');
  const { data: allCaptains, error: captainsError } = await supabase
    .from('captains')
    .select('*');
  
  if (captainsError) {
    console.error('   ❌ Error:', captainsError);
  } else if (allCaptains) {
    console.log(`   Found ${allCaptains.length} captains:`);
    allCaptains.forEach(c => {
      console.log(`   - ${c.player_nickname} (player_id: ${c.player_id}, team: ${c.team_name})`);
    });
  }
  
  // 3. Try to find captain by session player ID
  console.log('\n3️⃣ Looking for Captain by Session Player ID:');
  const { data: captainByUUID, error: uuidError } = await supabase
    .from('captains')
    .select('*')
    .eq('player_id', session.playerId)
    .maybeSingle();
  
  if (uuidError) {
    console.error('   ❌ Error:', uuidError);
  } else if (captainByUUID) {
    console.log('   ✅ Found:', captainByUUID.player_nickname);
  } else {
    console.log('   ❌ Not found by UUID');
  }
  
  // 4. Try to find captain by nickname
  console.log('\n4️⃣ Looking for Captain by Nickname:');
  const { data: captainByNickname, error: nicknameError } = await supabase
    .from('captains')
    .select('*')
    .ilike('player_nickname', session.nickname)
    .maybeSingle();
  
  if (nicknameError) {
    console.error('   ❌ Error:', nicknameError);
  } else if (captainByNickname) {
    console.log('   ✅ Found:', captainByNickname.player_nickname);
    console.log('   Player ID in captains table:', captainByNickname.player_id);
    console.log('   Player ID in session:', session.playerId);
    console.log('   Match:', captainByNickname.player_id === session.playerId ? '✅' : '❌');
  } else {
    console.log('   ❌ Not found by nickname');
  }
  
  // 5. Check player in players table
  console.log('\n5️⃣ Player in Players Table:');
  const { data: player, error: playerError } = await supabase
    .from('players')
    .select('id, nickname')
    .eq('id', session.playerId)
    .maybeSingle();
  
  if (playerError) {
    console.error('   ❌ Error:', playerError);
  } else if (player) {
    console.log('   ✅ Found:', player.nickname);
    console.log('   UUID:', player.id);
  } else {
    console.log('   ❌ Not found');
  }
  
  console.log('\n' + '='.repeat(50));
  console.log('💡 Solution:');
  console.log('   If player_id in captains table doesn\'t match session playerId,');
  console.log('   the captain record needs to be updated with the correct UUID.');
  console.log('='.repeat(50));
}

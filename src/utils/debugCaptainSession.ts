// Debug captain session and lookup
import { supabase } from '../lib/supabase';
import { AuthService } from '../services/auth';

export async function debugCaptainSession() {
  
  // 1. Check current session
  const session = AuthService.getCurrentPlayerSession();
  if (session) {
    // Silent check
  } else {
    return;
  }
  
  // 2. Check all captains in database
  const { data: allCaptains, error: captainsError } = await supabase
    .from('captains')
    .select('*');
  
  if (captainsError) {
    // Silent error
  } else if (allCaptains) {
    // Silent success
  }
  
  // 3. Try to find captain by session player ID
  const { data: captainByUUID, error: uuidError } = await supabase
    .from('captains')
    .select('*')
    .eq('player_id', session.playerId)
    .maybeSingle();
  
  if (uuidError) {
    // Silent error
  } else if (captainByUUID) {
    // Silent success
  } else {
    // Silent not found
  }
  
  // 4. Try to find captain by nickname
  const { data: captainByNickname, error: nicknameError } = await supabase
    .from('captains')
    .select('*')
    .ilike('player_nickname', session.nickname)
    .maybeSingle();
  
  if (nicknameError) {
    // Silent error
  } else if (captainByNickname) {
    // Silent success
  } else {
    // Silent not found
  }
  
  // 5. Check player in players table
  const { data: player, error: playerError } = await supabase
    .from('players')
    .select('id, nickname')
    .eq('player_id', session.playerId)
    .maybeSingle();
  
  if (playerError) {
    // Silent error
  } else if (player) {
    // Silent success
  } else {
    // Silent not found
  }
}

/**
 * Reset password for a specific player
 */

import { supabase } from '../lib/supabase';

export async function resetPlayerPassword(nickname: string, newPassword: string) {
  try {

    // Get player by nickname
    const { data: player, error: playerError } = await supabase
      .from('players')
      .select('id, nickname')
      .ilike('nickname', nickname)
      .single();

    if (playerError || !player) {
      console.error('❌ Player not found:', nickname);
      return { success: false, error: 'Player not found' };
    }

    // Import password service
    const passwordService = await import('../services/passwordService');

    // Set new password
    const result = await passwordService.default.setPassword(player.id, 'player', newPassword);

    if (result.success) {
      return { 
        success: true, 
        message: `Password reset for ${player.nickname}`,
        newPassword 
      };
    } else {
      console.error(`❌ Failed to reset password:`, result.error);
      return { success: false, error: result.error };
    }
  } catch (error: any) {
    console.error('❌ Error:', error);
    return { success: false, error: error.message };
  }
}

// Make available in browser console
if (typeof window !== 'undefined') {
  (window as any).resetPlayerPassword = resetPlayerPassword;
}

export default resetPlayerPassword;

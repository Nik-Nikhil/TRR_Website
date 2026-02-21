/**
 * Reset password for a specific player
 */

import { supabase } from '../lib/supabase';

export async function resetPlayerPassword(nickname: string, newPassword: string) {
  try {
    console.log(`🔐 Resetting password for player: ${nickname}`);

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

    console.log(`✅ Found player: ${player.nickname} (ID: ${player.id})`);

    // Import password service
    const { default: passwordService } = await import('../services/passwordService');
    const { UserType } = await import('../services/passwordService');

    // Set new password
    const result = await passwordService.setPassword(player.id, newPassword, 'player' as UserType);

    if (result.success) {
      console.log(`✅ Password reset successful for ${player.nickname}`);
      console.log(`🔑 New Password: ${newPassword}`);
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

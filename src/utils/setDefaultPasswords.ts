/**
 * Utility to set default passwords for all players
 * 
 * This script sets a default password for all players in the database.
 * Run this from the browser console or as a one-time migration.
 */

import { supabase } from '../lib/supabase';
import { DEFAULT_PASSWORDS } from '../config/defaultPasswords';

/**
 * Set default password for all players
 */
export async function setDefaultPasswordsForAllPlayers() {
  
  const defaultPassword = DEFAULT_PASSWORDS.PLAYER_DEFAULT;
  let successCount = 0;
  let errorCount = 0;
  const errors: any[] = [];

  try {
    // Get all players
    const { data: players, error: fetchError } = await supabase
      .from('players')
      .select('id, nickname, password_hash');

    if (fetchError) {
      console.error('❌ Error fetching players:', fetchError);
      return { success: false, error: fetchError.message };
    }

    if (!players || players.length === 0) {
      return { success: true, message: 'No players to update' };
    }

    // Import password service
    const { default: passwordService } = await import('../services/passwordService');

    // Update each player
    for (const player of players) {
      try {
        // Set the default password (userId, userType, password)
        const result = await passwordService.setPassword(player.id, 'player', defaultPassword);

        if (result.success) {
          successCount++;
        } else {
          console.error(`❌ Failed for ${player.nickname}:`, result.error);
          errorCount++;
          errors.push({ player: player.nickname, error: result.error });
        }
      } catch (err) {
        console.error(`❌ Exception for ${player.nickname}:`, err);
        errorCount++;
        errors.push({ player: player.nickname, error: err });
      }
    }
    
    if (errors.length > 0) {
      // Silent error logging
    }

    return {
      success: true,
      successCount,
      errorCount,
      errors,
      defaultPassword
    };
  } catch (error: any) {
    console.error('❌ Fatal error:', error);
    return { success: false, error: error.message };
  }
}

/**
 * Set default password for a specific player
 */
export async function setDefaultPasswordForPlayer(playerId: string) {
  const defaultPassword = DEFAULT_PASSWORDS.PLAYER_DEFAULT;
  
  try {
    const { default: passwordService } = await import('../services/passwordService');
    const result = await passwordService.setPassword(playerId, 'player', defaultPassword);
    
    if (result.success) {
      // Silent success
    } else {
      // Silent error
    }
    
    return result;
  } catch (error: any) {
    console.error('❌ Error:', error);
    return { success: false, error: error.message };
  }
}

// Export for browser console usage
if (typeof window !== 'undefined') {
  (window as any).setDefaultPasswordsForAllPlayers = setDefaultPasswordsForAllPlayers;
  (window as any).setDefaultPasswordForPlayer = setDefaultPasswordForPlayer;
}

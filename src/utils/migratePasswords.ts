import passwordService from '../services/passwordService';
import { players } from '../data/players';
import { admins } from '../data/admins';

// Default passwords from the old system
const DEFAULT_PLAYER_PASSWORD = 'player123';
const DEFAULT_ADMIN_PASSWORD = 'admin123';

// Super admin passwords (should match login passwords)
const SUPER_ADMIN_PASSWORDS: Record<string, string> = {
  'reyuk': '12345',
  'nikhil': 'SuperAdmin2024!',
  'banner': 'banner123'
};

interface MigrationResult {
  success: number;
  failed: number;
  errors: string[];
}

/**
 * Migrate all player passwords to encrypted database
 */
export async function migratePlayerPasswords(): Promise<MigrationResult> {
  const result: MigrationResult = {
    success: 0,
    failed: 0,
    errors: []
  };

  for (const player of players) {
    try {
      // Check if player already has a password in the database
      const hasPassword = await passwordService.hasPassword(player.id);
      
      if (!hasPassword) {
        // Set default password (encrypted)
        const setResult = await passwordService.setPassword(
          player.id,
          'player',
          DEFAULT_PLAYER_PASSWORD
        );

        if (setResult.success) {
          result.success++;
        } else {
          result.failed++;
          result.errors.push(`${player.nickname}: ${setResult.error}`);
        }
      } else {
        result.success++;
      }
    } catch (error: any) {
      result.failed++;
      result.errors.push(`${player.nickname}: ${error.message}`);
    }
  }

  return result;
}

/**
 * Migrate all admin passwords to encrypted database
 */
export async function migrateAdminPasswords(): Promise<MigrationResult> {
  const result: MigrationResult = {
    success: 0,
    failed: 0,
    errors: []
  };

  for (const admin of admins) {
    try {
      // Check if admin already has a password in the database
      const hasPassword = await passwordService.hasPassword(admin.username);
      
      if (!hasPassword) {
        // Get password - use super admin password if available, otherwise use admin password or default
        const password = SUPER_ADMIN_PASSWORDS[admin.username] || 
                        (admin as any).password || 
                        DEFAULT_ADMIN_PASSWORD;
        
        // Determine user type based on role
        const userType = (admin.role === 'Founder' || admin.role === 'Super Admin') ? 'superadmin' : 'admin';
        
        // Set password (encrypted)
        const setResult = await passwordService.setPassword(
          admin.username,
          userType,
          password
        );

        if (setResult.success) {
          result.success++;
        } else {
          result.failed++;
          result.errors.push(`${admin.username}: ${setResult.error}`);
        }
      } else {
        result.success++;
      }
    } catch (error: any) {
      result.failed++;
      result.errors.push(`${admin.username}: ${error.message}`);
    }
  }

  return result;
}

/**
 * Migrate all passwords (players and admins)
 */
export async function migrateAllPasswords(): Promise<{
  players: MigrationResult;
  admins: MigrationResult;
}> {
  const playerResult = await migratePlayerPasswords();
  const adminResult = await migrateAdminPasswords();

  return {
    players: playerResult,
    admins: adminResult
  };
}

/**
 * Check migration status
 */
export async function checkMigrationStatus(): Promise<{
  totalPlayers: number;
  playersWithPassword: number;
  totalAdmins: number;
  adminsWithPassword: number;
}> {
  let playersWithPassword = 0;
  let adminsWithPassword = 0;

  // Check players
  for (const player of players) {
    const hasPassword = await passwordService.hasPassword(player.id);
    if (hasPassword) playersWithPassword++;
  }

  // Check admins
  for (const admin of admins) {
    const hasPassword = await passwordService.hasPassword(admin.username);
    if (hasPassword) adminsWithPassword++;
  }

  return {
    totalPlayers: players.length,
    playersWithPassword,
    totalAdmins: admins.length,
    adminsWithPassword
  };
}

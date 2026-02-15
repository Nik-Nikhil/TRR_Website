/**
 * Default Password Configuration
 * 
 * This file contains default passwords for players.
 * 
 * SECURITY WARNING:
 * - Change these passwords in production
 * - Encourage users to change their passwords after first login
 * - Never commit real passwords to version control
 */

export const DEFAULT_PASSWORDS = {
  // Default password for all players
  PLAYER_DEFAULT: 'Player123!',
  
  // Default password for new registrations
  NEW_PLAYER_DEFAULT: 'Player123!',
  
  // Temporary password for password resets
  RESET_DEFAULT: 'Reset2024!',
};

/**
 * Check if a password is a default password
 */
export function isDefaultPassword(password: string): boolean {
  return Object.values(DEFAULT_PASSWORDS).includes(password);
}

/**
 * Get the default password for a player type
 */
export function getDefaultPassword(type: 'player' | 'new' | 'reset' = 'player'): string {
  switch (type) {
    case 'new':
      return DEFAULT_PASSWORDS.NEW_PLAYER_DEFAULT;
    case 'reset':
      return DEFAULT_PASSWORDS.RESET_DEFAULT;
    case 'player':
    default:
      return DEFAULT_PASSWORDS.PLAYER_DEFAULT;
  }
}

export default DEFAULT_PASSWORDS;

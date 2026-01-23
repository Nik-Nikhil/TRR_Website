// Player ban service for Super Admin
interface BannedPlayer {
  playerId: string;
  nickname: string;
  bannedBy: string;
  bannedAt: string;
  reason: string;
  isActive: boolean;
}

class PlayerBanService {
  private storageKey = 'bannedPlayers';

  // Get all banned players
  getBannedPlayers(): BannedPlayer[] {
    try {
      const stored = localStorage.getItem(this.storageKey);
      if (stored) {
        return JSON.parse(stored);
      }
    } catch (error) {
      console.error('Error loading banned players:', error);
    }
    return [];
  }

  // Check if a player is banned
  isPlayerBanned(playerId: string): boolean {
    const bannedPlayers = this.getBannedPlayers();
    return bannedPlayers.some(bp => bp.playerId === playerId && bp.isActive);
  }

  // Get ban details for a player
  getBanDetails(playerId: string): BannedPlayer | null {
    const bannedPlayers = this.getBannedPlayers();
    return bannedPlayers.find(bp => bp.playerId === playerId && bp.isActive) || null;
  }

  // Ban a player
  banPlayer(
    playerId: string,
    nickname: string,
    bannedBy: string,
    reason: string
  ): { success: boolean; error?: string } {
    try {
      const bannedPlayers = this.getBannedPlayers();
      
      // Check if player is already banned
      const existingBan = bannedPlayers.find(bp => bp.playerId === playerId && bp.isActive);
      if (existingBan) {
        return {
          success: false,
          error: 'Player is already banned'
        };
      }

      const newBan: BannedPlayer = {
        playerId,
        nickname,
        bannedBy,
        bannedAt: new Date().toISOString(),
        reason: reason.trim(),
        isActive: true
      };

      bannedPlayers.push(newBan);
      localStorage.setItem(this.storageKey, JSON.stringify(bannedPlayers));

      // Dispatch event to notify components
      window.dispatchEvent(new CustomEvent('playerBanChanged', {
        detail: { type: 'banned', playerId, banDetails: newBan }
      }));

      return { success: true };
    } catch (error) {
      console.error('Error banning player:', error);
      return {
        success: false,
        error: 'Failed to ban player'
      };
    }
  }

  // Unban a player
  unbanPlayer(
    playerId: string,
    _unbannedBy: string
  ): { success: boolean; error?: string } {
    try {
      const bannedPlayers = this.getBannedPlayers();
      
      // Find and deactivate the ban
      const banIndex = bannedPlayers.findIndex(bp => bp.playerId === playerId && bp.isActive);
      if (banIndex === -1) {
        return {
          success: false,
          error: 'Player is not currently banned'
        };
      }

      bannedPlayers[banIndex].isActive = false;
      localStorage.setItem(this.storageKey, JSON.stringify(bannedPlayers));

      // Dispatch event to notify components
      window.dispatchEvent(new CustomEvent('playerBanChanged', {
        detail: { type: 'unbanned', playerId }
      }));

      return { success: true };
    } catch (error) {
      console.error('Error unbanning player:', error);
      return {
        success: false,
        error: 'Failed to unban player'
      };
    }
  }

  // Get ban statistics
  getBanStats(): { totalBanned: number; activeBans: number } {
    const bannedPlayers = this.getBannedPlayers();
    return {
      totalBanned: bannedPlayers.length,
      activeBans: bannedPlayers.filter(bp => bp.isActive).length
    };
  }
}

export default new PlayerBanService();
import DatabaseService from './database';

// Authentication service for managing user sessions
export class AuthService {
  
  // ==================== SESSION MANAGEMENT ====================
  
  /**
   * Get current player session
   */
  static getCurrentPlayerSession() {
    try {
      const session = localStorage.getItem('playerSession');
      if (!session) return null;
      
      const parsed = JSON.parse(session);
      
      // Check if session is expired (24 hours)
      const loginTime = new Date(parsed.loginTime);
      const now = new Date();
      const hoursDiff = (now.getTime() - loginTime.getTime()) / (1000 * 60 * 60);
      
      if (hoursDiff > 24) {
        this.clearPlayerSession();
        return null;
      }
      
      return parsed;
    } catch (error) {
      console.error('Error getting player session:', error);
      return null;
    }
  }

  /**
   * Get current admin session
   */
  static getCurrentAdminSession() {
    try {
      const session = localStorage.getItem('adminSession');
      if (!session) return null;
      
      const parsed = JSON.parse(session);
      
      // Check if session is expired (8 hours for admin)
      const loginTime = new Date(parsed.loginTime);
      const now = new Date();
      const hoursDiff = (now.getTime() - loginTime.getTime()) / (1000 * 60 * 60);
      
      if (hoursDiff > 8) {
        this.clearAdminSession();
        return null;
      }
      
      return parsed;
    } catch (error) {
      console.error('Error getting admin session:', error);
      return null;
    }
  }

  /**
   * Set player session
   */
  static setPlayerSession(playerData: {
    playerId: string;
    nickname: string;
    steamId?: string;
    isNewAccount?: boolean;
  }) {
    try {
      const session = {
        ...playerData,
        loginTime: new Date().toISOString(),
        type: 'player'
      };
      
      localStorage.setItem('playerSession', JSON.stringify(session));
      return true;
    } catch (error) {
      console.error('Error setting player session:', error);
      return false;
    }
  }

  /**
   * Set admin session
   */
  static setAdminSession(adminData: {
    username: string;
    role: string;
  }) {
    try {
      const session = {
        ...adminData,
        loginTime: new Date().toISOString(),
        type: 'admin'
      };
      
      localStorage.setItem('adminSession', JSON.stringify(session));
      return true;
    } catch (error) {
      console.error('Error setting admin session:', error);
      return false;
    }
  }

  /**
   * Clear player session
   */
  static clearPlayerSession() {
    try {
      localStorage.removeItem('playerSession');
      localStorage.removeItem('steamSession');
      return true;
    } catch (error) {
      console.error('Error clearing player session:', error);
      return false;
    }
  }

  /**
   * Clear admin session
   */
  static clearAdminSession() {
    try {
      localStorage.removeItem('adminSession');
      return true;
    } catch (error) {
      console.error('Error clearing admin session:', error);
      return false;
    }
  }

  /**
   * Clear all sessions
   */
  static clearAllSessions() {
    this.clearPlayerSession();
    this.clearAdminSession();
  }

  // ==================== AUTHENTICATION METHODS ====================

  /**
   * Login player with nickname and password
   */
  static async loginPlayer(nickname: string, password: string) {
    try {
      const result = await DatabaseService.authenticatePlayer(nickname, password);
      
      if (!result.success || !result.data) {
        return result;
      }

      // Set session
      const sessionSet = this.setPlayerSession({
        playerId: result.data.id,
        nickname: result.data.nickname
      });

      if (!sessionSet) {
        return { success: false, error: 'Failed to create session' };
      }

      return { success: true, data: result.data };
    } catch (error: any) {
      console.error('Error logging in player:', error);
      return { success: false, error: error?.message || 'Unknown error' };
    }
  }

  /**
   * Login admin with username and password
   */
  static async loginAdmin(username: string, password: string) {
    try {
      const result = await DatabaseService.authenticateAdmin(username, password);
      
      if (!result.success || !result.data) {
        return result;
      }

      // Set session
      const sessionSet = this.setAdminSession({
        username: result.data.username,
        role: result.data.role
      });

      if (!sessionSet) {
        return { success: false, error: 'Failed to create session' };
      }

      return { success: true, data: result.data };
    } catch (error: any) {
      console.error('Error logging in admin:', error);
      return { success: false, error: error?.message || 'Unknown error' };
    }
  }

  /**
   * Register player with Steam
   */
  static async registerWithSteam(steamData: {
    steamId: string;
    nickname: string;
    avatarUrl: string;
    steamUrl: string;
  }) {
    try {
      // Check if player already exists
      const existingPlayer = await DatabaseService.getPlayerByNickname(steamData.nickname);
      
      if (existingPlayer.success) {
        return { success: false, error: 'Player with this nickname already exists' };
      }

      // Create new player
      const result = await DatabaseService.registerPlayerWithSteam(steamData);
      
      if (!result.success) {
        return result;
      }

      // Set session
      const sessionSet = this.setPlayerSession({
        playerId: result.data.id,
        nickname: result.data.nickname,
        steamId: steamData.steamId,
        isNewAccount: true
      });

      if (!sessionSet) {
        return { success: false, error: 'Failed to create session' };
      }

      return { success: true, data: result.data };
    } catch (error: any) {
      console.error('Error registering with Steam:', error);
      return { success: false, error: error?.message || 'Unknown error' };
    }
  }

  /**
   * Logout current user
   */
  static logout() {
    this.clearAllSessions();
    return { success: true, message: 'Logged out successfully' };
  }

  // ==================== AUTHORIZATION CHECKS ====================

  /**
   * Check if user is logged in as player
   */
  static isPlayerLoggedIn(): boolean {
    return this.getCurrentPlayerSession() !== null;
  }

  /**
   * Check if user is logged in as admin
   */
  static isAdminLoggedIn(): boolean {
    return this.getCurrentAdminSession() !== null;
  }

  /**
   * Check if user has admin role
   */
  static hasAdminRole(requiredRole?: string): boolean {
    const session = this.getCurrentAdminSession();
    if (!session) return false;
    
    if (!requiredRole) return true;
    
    const roleHierarchy: Record<string, number> = {
      'Founder': 3,
      'Admin': 2,
      'Mini Admin': 1
    };
    
    const userLevel = roleHierarchy[session.role] || 0;
    const requiredLevel = roleHierarchy[requiredRole] || 0;
    
    return userLevel >= requiredLevel;
  }

  /**
   * Get current user info
   */
  static getCurrentUser() {
    const playerSession = this.getCurrentPlayerSession();
    const adminSession = this.getCurrentAdminSession();
    
    if (playerSession) {
      return { type: 'player', ...playerSession };
    }
    
    if (adminSession) {
      return { type: 'admin', ...adminSession };
    }
    
    return null;
  }

  // ==================== UTILITY METHODS ====================

  /**
   * Refresh session (extend expiry)
   */
  static refreshSession() {
    const playerSession = this.getCurrentPlayerSession();
    const adminSession = this.getCurrentAdminSession();
    
    if (playerSession) {
      this.setPlayerSession({
        playerId: playerSession.playerId,
        nickname: playerSession.nickname,
        steamId: playerSession.steamId,
        isNewAccount: playerSession.isNewAccount
      });
    }
    
    if (adminSession) {
      this.setAdminSession({
        username: adminSession.username,
        role: adminSession.role
      });
    }
  }

  /**
   * Check session validity
   */
  static isSessionValid(): boolean {
    return this.isPlayerLoggedIn() || this.isAdminLoggedIn();
  }
}

export default AuthService;
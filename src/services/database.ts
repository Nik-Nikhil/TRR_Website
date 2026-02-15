import { supabase } from '../lib/supabase';
import { players } from '../data/players';

// Database service for handling all database operations
export class DatabaseService {
  
  // ==================== PLAYER OPERATIONS ====================
  
  /**
   * Get all players (local implementation)
   */
  static async getAllPlayersLocal() {
    try {
      // Use direct import instead of dynamic import
      return { success: true, data: players };
    } catch (error) {
      console.error('Error fetching all players:', error);
      return { success: false, error: (error as Error).message };
    }
  }

  /**
   * Get all players from database
   */
  static async getAllPlayers() {
    try {
      const { PlayerService } = await import('./supabaseService');
      const players = await PlayerService.getAllPlayers();
      return { success: true, data: players };
    } catch (error) {
      console.error('Error fetching players:', error);
      return { success: false, error: (error as Error).message };
    }
  }

  /**
   * Get player by ID
   */
  static async getPlayerById(id: string) {
    try {
      const { data, error } = await supabase
        .from('players')
        .select('*')
        .eq('id', id)
        .single();
      
      if (error) throw error;
      return { success: true, data };
    } catch (error) {
      console.error('Error fetching player:', error);
      return { success: false, error: (error as Error).message };
    }
  }

  /**
   * Get player by nickname
   */
  static async getPlayerByNickname(nickname: string) {
    try {
      // Query Supabase database
      const { PlayerService } = await import('./supabaseService');
      const player = await PlayerService.getPlayerByNickname(nickname);
      
      if (!player) {
        return { success: false, error: 'Player not found' };
      }
      
      return { success: true, data: player };
    } catch (error) {
      console.error('Error fetching player by nickname:', error);
      return { success: false, error: (error as Error).message };
    }
  }

  /**
   * Search players by nickname or real name
   */
  static async searchPlayers(query: string) {
    try {
      const { PlayerService } = await import('./supabaseService');
      const players = await PlayerService.searchPlayers(query);
      return { success: true, data: players };
    } catch (error) {
      console.error('Error searching players:', error);
      return { success: false, error: (error as Error).message };
    }
  }

  /**
   * Create new player
   */
  static async createPlayer(playerData: {
    nickname: string;
    real_name?: string;
    discord_username?: string;
    steam_url?: string;
    avatar_url?: string;
    current_mmr?: number;
    ping_range?: string;
    preferred_roles?: string[];
  }) {
    try {
      const { data, error } = await supabase
        .from('players')
        .insert([playerData])
        .select()
        .single();
      
      if (error) throw error;
      return { success: true, data };
    } catch (error) {
      console.error('Error creating player:', error);
      return { success: false, error: (error as Error).message };
    }
  }

  /**
   * Update player
   */
  static async updatePlayer(id: string, updates: Partial<{
    nickname: string;
    real_name: string;
    discord_username: string;
    steam_url: string;
    avatar_url: string;
    current_mmr: number;
    ping_range: string;
    preferred_roles: string[];
  }>) {
    try {
      const { data, error } = await supabase
        .from('players')
        .update({ ...updates, updated_at: new Date().toISOString() })
        .eq('id', id)
        .select()
        .single();
      
      if (error) throw error;
      return { success: true, data };
    } catch (error) {
      console.error('Error updating player:', error);
      return { success: false, error: (error as Error).message };
    }
  }

  // ==================== AUTHENTICATION OPERATIONS ====================

  /**
   * Authenticate player login
   */
  static async authenticatePlayer(nickname: string, password: string) {
    try {
      const player = await this.getPlayerByNickname(nickname);
      
      if (!player.success || !player.data) {
        return { success: false, error: 'Player not found' };
      }

      // Use encrypted password service for authentication
      const { default: passwordService } = await import('./passwordService');
      const verification = await passwordService.verifyUserPassword(player.data.id, password);
      
      if (!verification.success) {
        return { success: false, error: 'Invalid password' };
      }

      return { success: true, data: player.data };
    } catch (error) {
      console.error('Error authenticating player:', error);
      return { success: false, error: (error as Error).message };
    }
  }

  /**
   * Register new player with Steam
   */
  static async registerPlayerWithSteam(steamData: {
    steamId: string;
    nickname: string;
    avatarUrl: string;
    steamUrl: string;
  }) {
    try {
      const playerData = {
        nickname: steamData.nickname,
        steam_url: steamData.steamUrl,
        avatar_url: steamData.avatarUrl,
        // Add steam_id field if you want to store it separately
      };

      const result = await this.createPlayer(playerData);
      return result;
    } catch (error) {
      console.error('Error registering Steam player:', error);
      return { success: false, error: (error as Error).message };
    }
  }

  // ==================== ADMIN OPERATIONS ====================

  /**
   * Get admin by username (you might want to create a separate admins table)
   */
  static async getAdminByUsername(username: string) {
    try {
      // For now, we'll use hardcoded admin data
      // In production, create a separate admins table
      const adminData: Record<string, { username: string; role: string; password: string }> = {
        'reyuk': { username: 'reyuk', role: 'Founder', password: '12345' },
        'r3ciprocal': { username: 'r3ciprocal', role: 'Admin', password: 'admin2024' },
        'frost': { username: 'frost', role: 'Admin', password: 'admin2024' },
        'machine': { username: 'machine', role: 'Admin', password: 'admin2024' },
        'godspeed': { username: 'godspeed', role: 'Admin', password: 'admin2024' },
        'slowfast': { username: 'slowfast', role: 'Admin', password: '12345' },
        'banner': { username: 'banner', role: 'Mini Admin', password: 'mini2024' },
        'insanekid': { username: 'insanekid', role: 'Mini Admin', password: 'mini2024' },
        'fatty': { username: 'fatty', role: 'Mini Admin', password: 'mini2024' },
        'scripter': { username: 'scripter', role: 'Mini Admin', password: 'mini2024' },
        'havok4evr': { username: 'havok4evr', role: 'Mini Admin', password: 'mini2024' },
      };

      const admin = adminData[username.toLowerCase()];
      if (!admin) {
        return { success: false, error: 'Admin not found' };
      }

      return { success: true, data: admin };
    } catch (error) {
      console.error('Error fetching admin:', error);
      return { success: false, error: (error as Error).message };
    }
  }

  /**
   * Authenticate admin login
  /**
   * Authenticate admin login
   */
  static async authenticateAdmin(username: string, password: string) {
    try {
      const admin = await this.getAdminByUsername(username);
      
      if (!admin.success || !admin.data) {
        return { success: false, error: 'Admin not found' };
      }

      // Use encrypted password service for authentication
      const { default: passwordService } = await import('./passwordService');
      const verification = await passwordService.verifyUserPassword(username, password);
      
      if (!verification.success) {
        return { success: false, error: 'Invalid password' };
      }

      // Don't return password in response
      const { password: _, ...adminData } = admin.data;
      return { success: true, data: adminData };
    } catch (error) {
      console.error('Error authenticating admin:', error);
      return { success: false, error: (error as Error).message };
    }
  }

  // ==================== REGISTRATION OPERATIONS ====================

  /**
   * Create tournament registration
   */
  static async createRegistration(registrationData: {
    player_id: string;
    tournament_season: string;
    additional_info?: string;
  }) {
    try {
      const { data, error } = await supabase
        .from('registrations')
        .insert([registrationData])
        .select()
        .single();
      
      if (error) throw error;
      return { success: true, data };
    } catch (error) {
      console.error('Error creating registration:', error);
      return { success: false, error: (error as Error).message };
    }
  }

  /**
   * Get registrations for a season
   */
  static async getRegistrationsBySeason(season: string) {
    try {
      const { data, error } = await supabase
        .from('registrations')
        .select(`
          *,
          players (
            id,
            nickname,
            real_name,
            avatar_url,
            current_mmr
          )
        `)
        .eq('tournament_season', season)
        .order('registered_at', { ascending: false });
      
      if (error) throw error;
      return { success: true, data };
    } catch (error) {
      console.error('Error fetching registrations:', error);
      return { success: false, error: (error as Error).message };
    }
  }

  /**
   * Update registration status
   */
  static async updateRegistrationStatus(id: string, status: 'pending' | 'approved' | 'rejected') {
    try {
      const { data, error } = await supabase
        .from('registrations')
        .update({ status })
        .eq('id', id)
        .select()
        .single();
      
      if (error) throw error;
      return { success: true, data };
    } catch (error) {
      console.error('Error updating registration status:', error);
      return { success: false, error: (error as Error).message };
    }
  }

  // ==================== TEAM OPERATIONS ====================

  /**
   * Create team
   */
  static async createTeam(teamData: {
    name: string;
    captain_id: string;
  }) {
    try {
      const { data, error } = await supabase
        .from('teams')
        .insert([teamData])
        .select()
        .single();
      
      if (error) throw error;
      return { success: true, data };
    } catch (error) {
      console.error('Error creating team:', error);
      return { success: false, error: (error as Error).message };
    }
  }

  /**
   * Get all teams
   */
  static async getAllTeams() {
    try {
      const { data, error } = await supabase
        .from('teams')
        .select(`
          *,
          captain:players!captain_id (
            id,
            nickname,
            avatar_url
          ),
          team_members (
            id,
            role,
            player:players (
              id,
              nickname,
              avatar_url,
              current_mmr
            )
          )
        `)
        .order('name');
      
      if (error) throw error;
      return { success: true, data };
    } catch (error) {
      console.error('Error fetching teams:', error);
      return { success: false, error: (error as Error).message };
    }
  }

  // ==================== APPROVAL OPERATIONS ====================

  /**
   * Submit role change request
   */
  static async submitRoleChangeRequest(requestData: {
    playerId: string;
    playerNickname: string;
    currentRoles: string[];
    requestedRoles: string[];
    reason?: string;
  }) {
    try {
      // In a real implementation, this would insert into a pending_approvals table
      // For now, we'll just log it and return success
      const approvalRequest = {
        id: `role_change_${Date.now()}`,
        type: 'role_change',
        playerId: requestData.playerId,
        playerNickname: requestData.playerNickname,
        submittedAt: new Date().toISOString(),
        submittedBy: requestData.playerId,
        status: 'pending',
        data: {
          roleChange: {
            currentRoles: requestData.currentRoles,
            requestedRoles: requestData.requestedRoles,
            reason: requestData.reason
          }
        }
      };

      console.log('Role change request submitted:', approvalRequest);
      
      // In production, you would insert this into the database:
      // const { data, error } = await supabase
      //   .from('pending_approvals')
      //   .insert([approvalRequest])
      //   .select()
      //   .single();
      
      return { success: true, data: approvalRequest };
    } catch (error) {
      console.error('Error submitting role change request:', error);
      return { success: false, error: (error as Error).message };
    }
  }

  /**
   * Create new player account (for registration)
   */
  static async createPlayerAccount(playerData: {
    nickname: string;
    realName?: string;
    email: string;
    password: string;
    currentMMR?: number;
    peakMMR?: number;
    currentMedalLabel: string;
    currentMedalId: string;
    peakMedalLabel: string;
    peakMedalId: string;
    steamUrl?: string;
    dotabuffUrl?: string;
    discordUsername?: string;
    whatsappNumber?: string;
    bio: string;
    avatarUrl: string;
    preferredRoles: string[];
    pingRange: string;
    seasonBadges: any[];
    hasWonCup: boolean;
    roles: { iconSrc: string; label: string }[];
    favoriteHeroes: any[];
  }) {
    try {
      // Generate a unique ID for the new player
      const newPlayerId = `player_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
      
      // Check if nickname already exists
      const existingPlayer = await this.getPlayerByNickname(playerData.nickname);
      if (existingPlayer.success) {
        return { success: false, error: 'A player with this nickname already exists' };
      }

      // Create new player object matching the existing player structure
      const newPlayer = {
        id: newPlayerId,
        nickname: playerData.nickname,
        realName: playerData.realName || '',
        email: playerData.email,
        password: playerData.password, // In production, hash this password
        currentMMR: playerData.currentMMR || 0,
        peakMMR: playerData.peakMMR || playerData.currentMMR || 0,
        currentMedalLabel: playerData.currentMedalLabel,
        currentMedalId: playerData.currentMedalId,
        peakMedalLabel: playerData.peakMedalLabel,
        peakMedalId: playerData.peakMedalId,
        steamUrl: playerData.steamUrl || '',
        dotabuffUrl: playerData.dotabuffUrl || '',
        discordUsername: playerData.discordUsername || '',
        whatsappNumber: playerData.whatsappNumber || '',
        bio: playerData.bio,
        avatarUrl: playerData.avatarUrl,
        preferredRoles: playerData.preferredRoles,
        pingRange: playerData.pingRange,
        seasonBadges: playerData.seasonBadges,
        hasWonCup: playerData.hasWonCup,
        roles: playerData.roles,
        favoriteHeroes: playerData.favoriteHeroes,
        createdAt: new Date().toISOString(),
        isActive: true
      };

      // In a real implementation, this would insert into the database
      // For now, we'll simulate success and log the new player data
      console.log('New player account created:', newPlayer);
      
      // In production, you would insert this into the database:
      // const { data, error } = await supabase
      //   .from('players')
      //   .insert([newPlayer])
      //   .select()
      //   .single();
      
      // For demo purposes, we'll add to the local players array
      // Note: This won't persist across page reloads in the current implementation
      players.push(newPlayer);
      
      return { success: true, data: newPlayer };
    } catch (error) {
      console.error('Error creating player account:', error);
      return { success: false, error: (error as Error).message };
    }
  }

  // ==================== UTILITY FUNCTIONS ====================

  /**
   * Check if database connection is working
   */
  static async testConnection() {
    try {
      const { error } = await supabase
        .from('players')
        .select('count')
        .limit(1);
      
      if (error) throw error;
      return { success: true, message: 'Database connection successful' };
    } catch (error) {
      console.error('Database connection failed:', error);
      return { success: false, error: (error as Error).message };
    }
  }
}

export default DatabaseService;
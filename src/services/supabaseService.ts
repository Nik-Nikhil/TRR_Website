// Comprehensive Supabase Service Layer
import { supabase } from '../lib/supabase';

// ==================== TYPE DEFINITIONS ====================

export interface Player {
  id: string;
  nickname: string;
  real_name?: string;
  discord_username?: string;
  steam_url?: string;
  dotabuff_url?: string;
  avatar_url?: string;
  current_mmr?: number;
  peak_mmr?: number;
  current_medal_label?: string;
  current_medal_id?: string;
  peak_medal_label?: string;
  peak_medal_id?: string;
  ping_range?: string;
  preferred_roles?: string[];
  bio?: string;
  roles?: any[];
  favorite_heroes?: any[];
  season_badges?: any[];
  has_won_cup?: boolean;
  is_banned?: boolean;
  ban_reason?: string;
  whatsapp_number?: string;
  email?: string;
  password_hash?: string;
  created_at?: string;
  updated_at?: string;
}

export interface Admin {
  id: string;
  username: string;
  display_name: string;
  real_name?: string;
  password_hash: string;
  role: 'Founder' | 'Admin' | 'Mini Admin';
  avatar_url?: string;
  description?: string;
  is_active: boolean;
  created_at?: string;
  updated_at?: string;
}

export interface Captain {
  id: string;
  player_id: string;
  player_nickname: string;
  team_name: string;
  budget: number;
  assigned_at?: string;
  assigned_by?: string;
}

export interface Auction {
  id: string;
  name: string;
  season: string;
  status: 'not-started' | 'live' | 'paused' | 'completed';
  current_player_id?: string | null;
  current_player_data?: any;
  highest_bid?: number | null;
  highest_bidder_id?: string | null;
  highest_bidder_name?: string | null;
  highest_bidder_team?: string | null;
  created_by: string;
  created_at?: string;
  updated_at?: string;
  started_at?: string;
  completed_at?: string;
}

export interface AuctionBid {
  id: string;
  auction_id: string;
  player_id?: string | null;
  captain_id: string;
  captain_name: string;
  team_name: string;
  amount: number;
  created_at?: string;
}

export interface AuctionResult {
  id: string;
  auction_id: string;
  player_id?: string | null;
  player_data?: any;
  sold_to_captain_id?: string | null;
  sold_to_captain_name?: string;
  sold_to_team_name?: string;
  final_price: number;
  sold_at?: string;
}

// ==================== PLAYER OPERATIONS ====================

export class PlayerService {
  static async getAllPlayers(): Promise<Player[]> {
    const { data, error } = await supabase
      .from('players')
      .select('*')
      .order('nickname');
    
    if (error) throw error;
    return data || [];
  }

  static async getPlayerById(id: string): Promise<Player | null> {
    console.log('🔍 Fetching player by id:', id);
    
    // Check if id looks like a UUID (contains hyphens and is 36 chars)
    const isUUID = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(id);
    
    if (isUUID) {
      // Try to get by UUID id
      const { data, error } = await supabase
        .from('players')
        .select('*')
        .eq('id', id)
        .maybeSingle();
      
      console.log('Query by UUID:', { 
        found: !!data, 
        nickname: data?.nickname,
        hasRoles: !!data?.roles,
        hasHeroes: !!data?.favorite_heroes,
        hasMedal: !!data?.current_medal_label,
        error 
      });
      
      if (error) {
        console.error('❌ Error fetching by UUID:', error);
        return null;
      }
      
      if (data) {
        console.log('✅ Found player by UUID:', data.nickname);
        return data;
      }
    }
    
    // Try by nickname (either because it's not a UUID or UUID lookup failed)
    // Use case-insensitive search
    console.log('🔄 Trying by nickname (case-insensitive):', id);
    
    const { data, error } = await supabase
      .from('players')
      .select('*')
      .ilike('nickname', id)
      .maybeSingle();
    
    console.log('Query by nickname:', { 
      found: !!data, 
      nickname: data?.nickname,
      hasRoles: !!data?.roles,
      hasHeroes: !!data?.favorite_heroes,
      hasMedal: !!data?.current_medal_label,
      error 
    });
    
    if (error) {
      console.error('❌ Error fetching by nickname:', error);
      return null;
    }
    
    if (data) {
      console.log('✅ Found player by nickname:', data.nickname);
    } else {
      console.log('❌ Player not found in database');
    }
    
    return data;
  }

  static async getPlayerByNickname(nickname: string): Promise<Player | null> {
    const { data, error } = await supabase
      .from('players')
      .select('*')
      .ilike('nickname', nickname)
      .single();
    
    if (error) return null;
    return data;
  }

  static async createPlayer(playerData: Partial<Player>): Promise<Player> {
    const { data, error } = await supabase
      .from('players')
      .insert([playerData])
      .select()
      .single();
    
    if (error) throw error;
    return data;
  }

  static async updatePlayer(id: string, updates: Partial<Player>): Promise<Player> {
    const { data, error } = await supabase
      .from('players')
      .update({ ...updates, updated_at: new Date().toISOString() })
      .eq('id', id)
      .select()
      .single();
    
    if (error) throw error;
    return data;
  }

  static async searchPlayers(query: string): Promise<Player[]> {
    const { data, error } = await supabase
      .from('players')
      .select('*')
      .or(`nickname.ilike.%${query}%,real_name.ilike.%${query}%`)
      .limit(20);
    
    if (error) throw error;
    return data || [];
  }
}

// ==================== ADMIN OPERATIONS ====================

export class AdminService {
  static async getAdminByUsername(username: string): Promise<Admin | null> {
    const { data, error } = await supabase
      .from('admins')
      .select('*')
      .eq('username', username)
      .single();
    
    if (error) return null;
    return data;
  }

  static async getAllAdmins(): Promise<Admin[]> {
    const { data, error } = await supabase
      .from('admins')
      .select('*')
      .order('display_name');
    
    if (error) throw error;
    return data || [];
  }

  static async updateAdmin(username: string, updates: Partial<Admin>): Promise<Admin> {
    const { data, error } = await supabase
      .from('admins')
      .update({ ...updates, updated_at: new Date().toISOString() })
      .eq('username', username)
      .select()
      .single();
    
    if (error) throw error;
    return data;
  }
}

// ==================== CAPTAIN OPERATIONS ====================

export class CaptainService {
  static async getAllCaptains(): Promise<Captain[]> {
    const { data, error } = await supabase
      .from('captains')
      .select('*')
      .order('team_name');
    
    if (error) throw error;
    return data || [];
  }

  static async getCaptainById(id: string): Promise<Captain | null> {
    const { data, error } = await supabase
      .from('captains')
      .select('*')
      .eq('id', id)
      .single();
    
    if (error) return null;
    return data;
  }
}

// ==================== AUCTION OPERATIONS ====================

export class AuctionService {
  static async getActiveAuction(): Promise<Auction | null> {
    const { data, error } = await supabase
      .from('auctions')
      .select('*')
      .in('status', ['live', 'paused'])
      .order('created_at', { ascending: false })
      .limit(1)
      .single();
    
    if (error) return null;
    return data;
  }

  static async getAuctionById(id: string): Promise<Auction | null> {
    const { data, error } = await supabase
      .from('auctions')
      .select('*')
      .eq('id', id)
      .single();
    
    if (error) return null;
    return data;
  }
}

// Supabase-backed Auction Service with Admin Controls
import { supabase } from '../lib/supabase';

export interface Auction {
  id: string;
  name: string;
  season: string;
  status: 'not-started' | 'live' | 'paused' | 'completed';
  current_player_id: string | null;
  current_player_data: any;
  highest_bid: number | null;
  highest_bidder_id: string | null;
  highest_bidder_name: string | null;
  highest_bidder_team: string | null;
  created_by: string;
  created_at: string;
  updated_at: string;
  started_at: string | null;
  completed_at: string | null;
  deletion_status: 'active' | 'pending_deletion' | 'deleted';
  deleted_at?: string | null;
  deleted_by?: string | null;
}

export interface AuctionBid {
  id: string;
  auction_id: string;
  captain_id: string;
  captain_name: string;
  team_name: string;
  amount: number;
  player_id: string | null;
  created_at: string;
}

export interface AuctionResult {
  id: string;
  auction_id: string;
  player_id: string;
  player_data: any;
  sold_to_captain_id: string;
  sold_to_captain_name: string;
  sold_to_team_name: string;
  final_price: number;
  sold_at: string;
}

export interface DeletionRequest {
  id: string;
  auction_id: string;
  requested_by: string;
  requested_at: string;
  reason: string;
  status: 'pending' | 'approved' | 'rejected';
  reviewed_by: string | null;
  reviewed_at: string | null;
  review_notes: string | null;
}

export class AuctionDatabaseService {
  private static readonly CURRENT_AUCTION_KEY = 'trr_current_auction_id';

  // Create new auction
  static async createAuction(name: string, season: string, createdBy: string): Promise<Auction> {
    const { data, error } = await supabase
      .from('auctions')
      .insert([{
        name,
        season,
        status: 'not-started',
        created_by: createdBy,
        deletion_status: 'active'
      }])
      .select()
      .single();

    if (error) throw error;
    
    window.dispatchEvent(new CustomEvent('auctionCreated', { detail: data }));
    return data;
  }

  // Get all auctions (excluding deleted)
  static async getAllAuctions(): Promise<Auction[]> {
    const { data, error } = await supabase
      .from('auctions')
      .select('*')
      .neq('deletion_status', 'deleted')
      .order('created_at', { ascending: false });

    if (error) throw error;
    return data || [];
  }

  // Get auction by ID
  static async getAuctionById(id: string): Promise<Auction | null> {
    const { data, error } = await supabase
      .from('auctions')
      .select('*')
      .eq('id', id)
      .single();

    if (error) return null;
    return data;
  }

  // Set current active auction
  static setCurrentAuction(auctionId: string): void {
    localStorage.setItem(this.CURRENT_AUCTION_KEY, auctionId);
    window.dispatchEvent(new CustomEvent('currentAuctionChanged', { detail: auctionId }));
  }

  // Get current active auction
  static async getCurrentAuction(): Promise<Auction | null> {
    const currentId = localStorage.getItem(this.CURRENT_AUCTION_KEY);
    if (!currentId) return null;
    return this.getAuctionById(currentId);
  }

  // Update auction
  static async updateAuction(id: string, updates: Partial<Auction>): Promise<boolean> {
    const { error } = await supabase
      .from('auctions')
      .update(updates)
      .eq('id', id);

    if (error) {
      console.error('Update auction error:', error);
      return false;
    }

    window.dispatchEvent(new CustomEvent('auctionUpdated', { detail: { id, ...updates } }));
    return true;
  }

  // Request auction deletion (admin)
  static async requestDeletion(auctionId: string, requestedBy: string, reason: string): Promise<DeletionRequest> {
    // Mark auction as pending deletion
    await this.updateAuction(auctionId, { deletion_status: 'pending_deletion' });

    window.dispatchEvent(new CustomEvent('deletionRequested', { detail: { auctionId, requestedBy, reason } }));
    
    return {
      id: Date.now().toString(),
      auction_id: auctionId,
      requested_by: requestedBy,
      requested_at: new Date().toISOString(),
      reason,
      status: 'pending',
      reviewed_by: null,
      reviewed_at: null,
      review_notes: null
    };
  }

  // Approve deletion (superadmin)
  static async approveDeletion(requestId: string, reviewedBy: string, notes?: string): Promise<boolean> {
    // For now, just mark as deleted - you can add a deletion_requests table later
    window.dispatchEvent(new CustomEvent('deletionApproved', { detail: { requestId, reviewedBy } }));
    return true;
  }

  // Reject deletion (superadmin)
  static async rejectDeletion(requestId: string, reviewedBy: string, _notes?: string): Promise<boolean> {
    window.dispatchEvent(new CustomEvent('deletionRejected', { detail: { requestId, reviewedBy } }));
    return true;
  }

  // Get all deletion requests
  static getAllDeletionRequests(): DeletionRequest[] {
    // TODO: Implement with database table
    return [];
  }

  // Get pending deletion requests
  static getPendingDeletionRequests(): DeletionRequest[] {
    return this.getAllDeletionRequests().filter(r => r.status === 'pending');
  }

  // Save auction result (when player is sold)
  static async saveAuctionResult(
    auctionId: string,
    playerId: string,
    playerData: any,
    captainId: string,
    captainName: string,
    teamName: string,
    finalPrice: number
  ): Promise<AuctionResult> {
    const { data, error } = await supabase
      .from('auction_results')
      .insert([{
        auction_id: auctionId,
        player_id: playerId,
        player_data: playerData,
        sold_to_captain_id: captainId,
        sold_to_captain_name: captainName,
        sold_to_team_name: teamName,
        final_price: finalPrice
      }])
      .select()
      .single();

    if (error) throw error;

    window.dispatchEvent(new CustomEvent('playerSold', { detail: data }));
    return data;
  }

  // Get auction results
  static async getAuctionResults(auctionId: string): Promise<AuctionResult[]> {
    const { data, error } = await supabase
      .from('auction_results')
      .select('*')
      .eq('auction_id', auctionId)
      .order('sold_at', { ascending: false });

    if (error) throw error;
    return data || [];
  }

  // Save bid to database
  static async saveBid(
    auctionId: string,
    captainId: string,
    captainName: string,
    teamName: string,
    amount: number,
    playerId?: string
  ): Promise<AuctionBid> {
    const { data, error } = await supabase
      .from('auction_bids')
      .insert([{
        auction_id: auctionId,
        captain_id: captainId,
        captain_name: captainName,
        team_name: teamName,
        amount: amount,
        player_id: playerId || null
      }])
      .select()
      .single();

    if (error) throw error;
    return data;
  }

  // Get bid history for an auction
  static async getBidHistory(auctionId: string): Promise<AuctionBid[]> {
    const { data, error } = await supabase
      .from('auction_bids')
      .select('*')
      .eq('auction_id', auctionId)
      .order('created_at', { ascending: false });

    if (error) throw error;
    return data || [];
  }
}

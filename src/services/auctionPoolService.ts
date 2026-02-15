// Auction Pool Service - Manage players available for auction
import { supabase } from '../lib/supabase';

export interface AuctionPoolPlayer {
  id: string;
  auction_id: string;
  player_id: string;
  player_data: any;
  status: 'available' | 'sold' | 'removed';
  added_by: string;
  added_at: string;
  sold_at?: string;
}

class AuctionPoolService {
  // Get all players in the auction pool for current auction
  async getAuctionPool(auctionId: string): Promise<AuctionPoolPlayer[]> {
    try {
      const { data, error } = await supabase
        .from('auction_pool')
        .select('*')
        .eq('auction_id', auctionId)
        .order('added_at', { ascending: true });

      if (error) {
        console.error('Error fetching auction pool:', error);
        return [];
      }

      return data || [];
    } catch (error) {
      console.error('Error fetching auction pool:', error);
      return [];
    }
  }

  // Get available players (not sold yet)
  async getAvailablePlayers(auctionId: string): Promise<AuctionPoolPlayer[]> {
    try {
      const { data, error } = await supabase
        .from('auction_pool')
        .select('*')
        .eq('auction_id', auctionId)
        .eq('status', 'available')
        .order('added_at', { ascending: true });

      if (error) {
        console.error('Error fetching available players:', error);
        return [];
      }

      return data || [];
    } catch (error) {
      console.error('Error fetching available players:', error);
      return [];
    }
  }

  // Add player to auction pool
  async addPlayerToPool(
    auctionId: string,
    playerId: string,
    playerData: any,
    addedBy: string
  ): Promise<boolean> {
    try {
      const { error } = await supabase
        .from('auction_pool')
        .insert({
          auction_id: auctionId,
          player_id: playerId,
          player_data: playerData,
          status: 'available',
          added_by: addedBy
        });

      if (error) {
        console.error('Error adding player to pool:', error);
        return false;
      }

      return true;
    } catch (error) {
      console.error('Error adding player to pool:', error);
      return false;
    }
  }

  // Remove player from auction pool
  async removePlayerFromPool(poolId: string): Promise<boolean> {
    try {
      const { error } = await supabase
        .from('auction_pool')
        .delete()
        .eq('id', poolId);

      if (error) {
        console.error('Error removing player from pool:', error);
        return false;
      }

      return true;
    } catch (error) {
      console.error('Error removing player from pool:', error);
      return false;
    }
  }

  // Mark player as sold
  async markPlayerAsSold(playerId: string, auctionId: string): Promise<boolean> {
    try {
      const { error } = await supabase
        .from('auction_pool')
        .update({
          status: 'sold',
          sold_at: new Date().toISOString()
        })
        .eq('auction_id', auctionId)
        .eq('player_id', playerId);

      if (error) {
        console.error('Error marking player as sold:', error);
        return false;
      }

      return true;
    } catch (error) {
      console.error('Error marking player as sold:', error);
      return false;
    }
  }

  // Subscribe to auction pool changes
  subscribeToAuctionPool(auctionId: string, callback: () => void) {
    const channel = supabase
      .channel(`auction-pool-${auctionId}`)
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'auction_pool',
          filter: `auction_id=eq.${auctionId}`
        },
        () => {
          callback();
        }
      )
      .subscribe();

    return {
      unsubscribe: () => {
        supabase.removeChannel(channel);
      }
    };
  }
}

export default new AuctionPoolService();

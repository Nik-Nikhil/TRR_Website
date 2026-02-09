// Supabase-based Auction Service with Real-time Sync
import { supabase } from '../lib/supabase';

export interface AuctionBid {
  id: string;
  auction_id: string;
  captain_id: string;
  captain_name: string;
  team_name: string;
  amount: number;
  created_at: string;
}

export interface AuctionState {
  id: string;
  status: 'not-started' | 'live' | 'paused' | 'completed';
  current_player_id: string | null;
  current_player_data: any;
  highest_bid: number | null;
  highest_bidder_id: string | null;
  highest_bidder_name: string | null;
  highest_bidder_team: string | null;
  created_at: string;
  updated_at: string;
}

export class AuctionService {
  // Get current auction state from Supabase
  static async getAuctionState(): Promise<AuctionState | null> {
    try {
      const { data, error } = await supabase
        .from('auctions')
        .select('*')
        .eq('deletion_status', 'active')
        .order('created_at', { ascending: false })
        .limit(1)
        .single();

      if (error) {
        console.error('Error fetching auction state:', error);
        return null;
      }

      return data ? {
        id: data.id,
        status: data.status,
        current_player_id: data.current_player_id,
        current_player_data: data.current_player_data,
        highest_bid: data.highest_bid,
        highest_bidder_id: data.highest_bidder_id,
        highest_bidder_name: data.highest_bidder_name,
        highest_bidder_team: data.highest_bidder_team,
        created_at: data.created_at,
        updated_at: data.updated_at
      } : null;
    } catch (error) {
      console.error('Error fetching auction state:', error);
      return null;
    }
  }

  // Start auction
  static async startAuction(): Promise<boolean> {
    try {
      // First check if there's already an active auction
      const existingAuction = await this.getAuctionState();
      if (existingAuction && existingAuction.status !== 'completed') {
        const { error } = await supabase
          .from('auctions')
          .update({ status: 'live' })
          .eq('id', existingAuction.id);

        if (error) {
          console.error('Error updating auction:', error);
          return false;
        }
        return true;
      }

      // Create new auction
      const { data, error } = await supabase
        .from('auctions')
        .insert([{
          name: `Auction ${new Date().toLocaleDateString()}`,
          season: 'Current',
          status: 'live',
          created_by: 'admin',
          deletion_status: 'active'
        }])
        .select()
        .single();

      if (error) {
        console.error('Error starting auction:', error);
        console.error('Error details:', JSON.stringify(error, null, 2));
        return false;
      }

      return true;
    } catch (error) {
      console.error('Exception starting auction:', error);
      return false;
    }
  }

  // Stop/Close auction (set to finished)
  static async stopAuction(): Promise<boolean> {
    try {
      const state = await this.getAuctionState();
      if (!state) return false;

      const { error } = await supabase
        .from('auctions')
        .update({ 
          status: 'completed',
          completed_at: new Date().toISOString()
        })
        .eq('id', state.id);

      if (error) {
        console.error('Error stopping auction:', error);
        return false;
      }

      return true;
    } catch (error) {
      console.error('Error stopping auction:', error);
      return false;
    }
  }

  // Reset auction to not-started
  static async resetAuction(): Promise<boolean> {
    try {
      const state = await this.getAuctionState();
      
      if (!state) {
        // Create new auction in not-started state
        const { error } = await supabase
          .from('auctions')
          .insert([{
            name: `Auction ${new Date().toLocaleDateString()}`,
            season: 'Current',
            status: 'not-started',
            current_player_id: null,
            current_player_data: null,
            highest_bid: null,
            highest_bidder_id: null,
            highest_bidder_name: null,
            highest_bidder_team: null,
            created_by: 'admin',
            deletion_status: 'active'
          }]);

        if (error) {
          console.error('Error creating auction:', error);
          return false;
        }
      } else {
        const { error } = await supabase
          .from('auctions')
          .update({
            status: 'not-started',
            current_player_id: null,
            current_player_data: null,
            highest_bid: null,
            highest_bidder_id: null,
            highest_bidder_name: null,
            highest_bidder_team: null
          })
          .eq('id', state.id);

        if (error) {
          console.error('Error resetting auction:', error);
          return false;
        }
      }

      return true;
    } catch (error) {
      console.error('Error resetting auction:', error);
      return false;
    }
  }

  // Pause auction
  static async pauseAuction(): Promise<boolean> {
    try {
      const state = await this.getAuctionState();
      if (!state) return false;

      const { error } = await supabase
        .from('auctions')
        .update({ status: 'paused' })
        .eq('id', state.id);

      if (error) {
        console.error('Error pausing auction:', error);
        return false;
      }

      return true;
    } catch (error) {
      console.error('Error pausing auction:', error);
      return false;
    }
  }

  // Resume auction
  static async resumeAuction(): Promise<boolean> {
    try {
      const state = await this.getAuctionState();
      if (!state) return false;

      const { error } = await supabase
        .from('auctions')
        .update({ status: 'live' })
        .eq('id', state.id);

      if (error) {
        console.error('Error resuming auction:', error);
        return false;
      }

      return true;
    } catch (error) {
      console.error('Error resuming auction:', error);
      return false;
    }
  }

  // Set current player
  static async setCurrentPlayer(playerId: string, playerData: any): Promise<boolean> {
    try {
      const state = await this.getAuctionState();
      if (!state) return false;

      // Don't set current_player_id as foreign key since players might not be in DB yet
      // Just store the player data in JSONB
      const { error } = await supabase
        .from('auctions')
        .update({
          current_player_id: null, // Set to null to avoid foreign key constraint
          current_player_data: {
            id: playerId,
            ...playerData
          },
          highest_bid: playerData?.basePrice || 0,
          highest_bidder_id: null,
          highest_bidder_name: null,
          highest_bidder_team: null
        })
        .eq('id', state.id);

      if (error) {
        console.error('Error setting current player:', error);
        return false;
      }

      return true;
    } catch (error) {
      console.error('Error setting current player:', error);
      return false;
    }
  }

  // Place bid
  static async placeBid(captainId: string, captainName: string, teamName: string, amount: number): Promise<boolean> {
    try {
      const state = await this.getAuctionState();
      if (!state || state.status !== 'live') return false;

      // Check if bid is higher than current
      if (state.highest_bid && amount <= state.highest_bid) {
        return false;
      }

      // Update auction state
      const { error: updateError } = await supabase
        .from('auctions')
        .update({
          highest_bid: amount,
          highest_bidder_id: captainId,
          highest_bidder_name: captainName,
          highest_bidder_team: teamName
        })
        .eq('id', state.id);

      if (updateError) {
        console.error('Error updating auction state:', updateError);
        return false;
      }

      // Record bid in history
      const { error: bidError } = await supabase
        .from('auction_bids')
        .insert([{
          auction_id: state.id,
          player_id: state.current_player_id,
          captain_id: captainId,
          captain_name: captainName,
          team_name: teamName,
          amount: amount
        }]);

      if (bidError) {
        console.error('Error recording bid:', bidError);
        return false;
      }

      return true;
    } catch (error) {
      console.error('Error placing bid:', error);
      return false;
    }
  }

  // Get bid history for current player
  static async getBidHistory(auctionId: string): Promise<AuctionBid[]> {
    try {
      const { data, error } = await supabase
        .from('auction_bids')
        .select('*')
        .eq('auction_id', auctionId)
        .order('created_at', { ascending: false });

      if (error) {
        console.error('Error fetching bid history:', error);
        return [];
      }

      return data || [];
    } catch (error) {
      console.error('Error fetching bid history:', error);
      return [];
    }
  }

  // Subscribe to auction state changes with Supabase real-time
  static subscribeToAuctionState(callback: (state: AuctionState) => void) {
    const channel = supabase
      .channel('auction-state-changes')
      .on(
        'postgres_changes',
        {
          event: 'UPDATE',
          schema: 'public',
          table: 'auctions'
        },
        async (payload) => {
          console.log('🔔 Auction UPDATE detected:', payload);
          // Fetch the latest state when auction is updated
          const state = await this.getAuctionState();
          if (state) {
            callback(state);
          }
        }
      )
      .on(
        'postgres_changes',
        {
          event: 'INSERT',
          schema: 'public',
          table: 'auctions'
        },
        async (payload) => {
          console.log('🔔 Auction INSERT detected:', payload);
          // Fetch the latest state when new auction is created
          const state = await this.getAuctionState();
          if (state) {
            callback(state);
          }
        }
      )
      .subscribe((status, err) => {
        if (status === 'SUBSCRIBED') {
          console.log('✅ Subscribed to auction state changes');
        }
        if (status === 'CHANNEL_ERROR') {
          console.error('❌ Auction subscription error:', err);
        }
        if (status === 'TIMED_OUT') {
          console.error('⏱️ Auction subscription timed out');
        }
      });

    return {
      unsubscribe: () => {
        supabase.removeChannel(channel);
      }
    };
  }

  // Subscribe to bid changes with Supabase real-time
  static subscribeToBids(callback: (bid: AuctionBid) => void) {
    const channel = supabase
      .channel('auction-bids-changes')
      .on(
        'postgres_changes',
        {
          event: 'INSERT',
          schema: 'public',
          table: 'auction_bids'
        },
        (payload) => {
          const bid = payload.new as AuctionBid;
          callback(bid);
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

// LocalStorage-based Auction Service (No Supabase required)

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
  private static readonly AUCTION_STATE_KEY = 'trr_auction_state';
  private static readonly AUCTION_BIDS_KEY = 'trr_auction_bids';

  // Get current auction state
  static async getAuctionState(): Promise<AuctionState | null> {
    try {
      const data = localStorage.getItem(this.AUCTION_STATE_KEY);
      return data ? JSON.parse(data) : null;
    } catch (error) {
      console.error('Error fetching auction state:', error);
      return null;
    }
  }

  // Save auction state
  private static async saveAuctionState(state: AuctionState): Promise<void> {
    localStorage.setItem(this.AUCTION_STATE_KEY, JSON.stringify(state));
    // Dispatch event for real-time updates
    window.dispatchEvent(new CustomEvent('auctionStateChanged', { detail: state }));
  }

  // Start auction
  static async startAuction(): Promise<boolean> {
    try {
      const newState: AuctionState = {
        id: Date.now().toString(),
        status: 'live',
        current_player_id: null,
        current_player_data: null,
        highest_bid: null,
        highest_bidder_id: null,
        highest_bidder_name: null,
        highest_bidder_team: null,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      };
      await this.saveAuctionState(newState);
      
      // Dispatch event to clear chat
      window.dispatchEvent(new CustomEvent('auctionStarted'));
      
      return true;
    } catch (error) {
      console.error('Error starting auction:', error);
      return false;
    }
  }

  // Stop/Close auction (set to finished)
  static async stopAuction(): Promise<boolean> {
    try {
      const state = await this.getAuctionState();
      if (!state) return false;

      state.status = 'completed';
      state.updated_at = new Date().toISOString();
      await this.saveAuctionState(state);
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
        const newState: AuctionState = {
          id: Date.now().toString(),
          status: 'not-started',
          current_player_id: null,
          current_player_data: null,
          highest_bid: null,
          highest_bidder_id: null,
          highest_bidder_name: null,
          highest_bidder_team: null,
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString()
        };
        await this.saveAuctionState(newState);
      } else {
        state.status = 'not-started';
        state.current_player_id = null;
        state.current_player_data = null;
        state.highest_bid = null;
        state.highest_bidder_id = null;
        state.highest_bidder_name = null;
        state.highest_bidder_team = null;
        state.updated_at = new Date().toISOString();
        await this.saveAuctionState(state);
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

      state.status = 'paused';
      state.updated_at = new Date().toISOString();
      await this.saveAuctionState(state);
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

      state.status = 'live';
      state.updated_at = new Date().toISOString();
      await this.saveAuctionState(state);
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

      state.current_player_id = playerId;
      state.current_player_data = playerData;
      state.highest_bid = playerData?.basePrice || 50;
      state.highest_bidder_id = null;
      state.highest_bidder_name = null;
      state.highest_bidder_team = null;
      state.updated_at = new Date().toISOString();
      
      await this.saveAuctionState(state);
      
      // Clear bid history for the new player
      if (playerId) {
        localStorage.setItem(this.AUCTION_BIDS_KEY, JSON.stringify([]));
        // Dispatch event to notify UI
        window.dispatchEvent(new CustomEvent('bidHistoryCleared'));
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
      state.highest_bid = amount;
      state.highest_bidder_id = captainId;
      state.highest_bidder_name = captainName;
      state.highest_bidder_team = teamName;
      state.updated_at = new Date().toISOString();
      
      await this.saveAuctionState(state);

      // Record bid in history
      const bid: AuctionBid = {
        id: Date.now().toString(),
        auction_id: state.id,
        captain_id: captainId,
        captain_name: captainName,
        team_name: teamName,
        amount: amount,
        created_at: new Date().toISOString()
      };

      const bids = await this.getBidHistory(state.id);
      bids.unshift(bid);
      localStorage.setItem(this.AUCTION_BIDS_KEY, JSON.stringify(bids));

      // Dispatch event for real-time updates
      window.dispatchEvent(new CustomEvent('newBid', { detail: bid }));

      return true;
    } catch (error) {
      console.error('Error placing bid:', error);
      return false;
    }
  }

  // Get bid history for current player
  static async getBidHistory(auctionId: string): Promise<AuctionBid[]> {
    try {
      const data = localStorage.getItem(this.AUCTION_BIDS_KEY);
      const allBids: AuctionBid[] = data ? JSON.parse(data) : [];
      return allBids.filter(bid => bid.auction_id === auctionId);
    } catch (error) {
      console.error('Error fetching bid history:', error);
      return [];
    }
  }

  // Subscribe to auction state changes (using custom events instead of Supabase)
  static subscribeToAuctionState(callback: (state: AuctionState) => void) {
    const handler = (event: any) => {
      callback(event.detail);
    };
    window.addEventListener('auctionStateChanged', handler);
    
    return {
      unsubscribe: () => {
        window.removeEventListener('auctionStateChanged', handler);
      }
    };
  }

  // Subscribe to bid changes (using custom events instead of Supabase)
  static subscribeToBids(callback: (bid: AuctionBid) => void) {
    const handler = (event: any) => {
      callback(event.detail);
    };
    window.addEventListener('newBid', handler);
    
    return {
      unsubscribe: () => {
        window.removeEventListener('newBid', handler);
      }
    };
  }
}

import { supabase } from '../lib/supabase';

export interface AuctionHistoryRecord {
  id: string;
  auction_name: string;
  season: string;
  auction_data: any;
  captains_data: any[];
  bids_data: any[];
  results_data: any[];
  completed_at: string;
  created_by: string;
  notes?: string;
}

export class AuctionHistoryService {
  // Archive current auction to history
  static async archiveCurrentAuction(auctionName: string, season: string, createdBy: string): Promise<boolean> {
    try {
      // Fetch all current auction data
      const { data: auctionData, error: auctionError } = await supabase
        .from('auctions')
        .select('*')
        .eq('deletion_status', 'active')
        .order('created_at', { ascending: false })
        .limit(1)
        .single();

      if (auctionError) {
        console.error('Error fetching auction:', auctionError);
        return false;
      }

      // Fetch captains
      const { data: captainsData, error: captainsError } = await supabase
        .from('captains')
        .select('*');

      if (captainsError) {
        console.error('Error fetching captains:', captainsError);
      }

      // Fetch bids
      const { data: bidsData, error: bidsError } = await supabase
        .from('auction_bids')
        .select('*')
        .order('created_at', { ascending: false });

      if (bidsError) {
        console.error('Error fetching bids:', bidsError);
      }

      // Fetch results
      const { data: resultsData, error: resultsError } = await supabase
        .from('auction_results')
        .select('*');

      if (resultsError) {
        console.error('Error fetching results:', resultsError);
      }

      // Insert into history
      const { error: insertError } = await supabase
        .from('auction_history')
        .insert({
          auction_name: auctionName,
          season: season,
          auction_data: auctionData,
          captains_data: captainsData || [],
          bids_data: bidsData || [],
          results_data: resultsData || [],
          created_by: createdBy
        });

      if (insertError) {
        console.error('Error archiving auction:', insertError);
        return false;
      }

      return true;
    } catch (error) {
      console.error('Exception archiving auction:', error);
      return false;
    }
  }

  // Get all auction history
  static async getAllHistory(): Promise<AuctionHistoryRecord[]> {
    try {
      const { data, error } = await supabase
        .from('auction_history')
        .select('*')
        .order('completed_at', { ascending: false });

      if (error) {
        console.error('Error fetching history:', error);
        return [];
      }

      return data || [];
    } catch (error) {
      console.error('Exception fetching history:', error);
      return [];
    }
  }

  // Get single auction history by ID
  static async getHistoryById(id: string): Promise<AuctionHistoryRecord | null> {
    try {
      const { data, error } = await supabase
        .from('auction_history')
        .select('*')
        .eq('id', id)
        .single();

      if (error) {
        console.error('Error fetching history record:', error);
        return null;
      }

      return data;
    } catch (error) {
      console.error('Exception fetching history record:', error);
      return null;
    }
  }

  // Delete auction history record
  static async deleteHistory(id: string): Promise<boolean> {
    try {
      const { error } = await supabase
        .from('auction_history')
        .delete()
        .eq('id', id);

      if (error) {
        console.error('Error deleting history:', error);
        return false;
      }

      return true;
    } catch (error) {
      console.error('Exception deleting history:', error);
      return false;
    }
  }

  // Delete all auction history
  static async deleteAllHistory(): Promise<boolean> {
    try {
      const { error } = await supabase
        .from('auction_history')
        .delete()
        .neq('id', '00000000-0000-0000-0000-000000000000'); // Delete all

      if (error) {
        console.error('Error deleting all history:', error);
        return false;
      }

      return true;
    } catch (error) {
      console.error('Exception deleting all history:', error);
      return false;
    }
  }
}

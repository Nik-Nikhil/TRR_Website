import * as XLSX from 'xlsx';
import type { AuctionHistoryRecord } from '../services/auctionHistoryService';

export const exportAuctionToExcel = (historyRecord: AuctionHistoryRecord) => {
  try {
    // Create workbook
    const wb = XLSX.utils.book_new();

    // Sheet 1: Auction Info
    const auctionInfo = [{
      'Auction Name': historyRecord.auction_name,
      'Season': historyRecord.season,
      'Status': historyRecord.auction_data?.status || 'N/A',
      'Completed At': new Date(historyRecord.completed_at).toLocaleString(),
      'Created By': historyRecord.created_by,
      'Total Captains': historyRecord.captains_data?.length || 0,
      'Total Bids': historyRecord.bids_data?.length || 0,
      'Total Players Sold': historyRecord.results_data?.length || 0
    }];
    const auctionSheet = XLSX.utils.json_to_sheet(auctionInfo);
    XLSX.utils.book_append_sheet(wb, auctionSheet, 'Auction Info');

    // Sheet 2: Captains
    if (historyRecord.captains_data && historyRecord.captains_data.length > 0) {
      const captainsFormatted = historyRecord.captains_data.map((captain: any) => ({
        'Player ID': captain.player_id,
        'Team Name': captain.team_name,
        'Initial Budget': captain.initial_budget,
        'Current Budget': captain.budget,
        'Spent': captain.initial_budget - captain.budget,
        'Created At': new Date(captain.created_at).toLocaleString()
      }));
      const captainsSheet = XLSX.utils.json_to_sheet(captainsFormatted);
      XLSX.utils.book_append_sheet(wb, captainsSheet, 'Captains');
    }

    // Sheet 3: Bids
    if (historyRecord.bids_data && historyRecord.bids_data.length > 0) {
      const bidsFormatted = historyRecord.bids_data.map((bid: any) => ({
        'Player ID': bid.player_id,
        'Captain ID': bid.captain_id,
        'Captain Name': bid.captain_name,
        'Team Name': bid.team_name,
        'Amount': bid.amount,
        'Timestamp': new Date(bid.created_at).toLocaleString()
      }));
      const bidsSheet = XLSX.utils.json_to_sheet(bidsFormatted);
      XLSX.utils.book_append_sheet(wb, bidsSheet, 'Bids');
    }

    // Sheet 4: Results (Sold Players)
    if (historyRecord.results_data && historyRecord.results_data.length > 0) {
      const resultsFormatted = historyRecord.results_data.map((result: any) => ({
        'Player ID': result.player_id,
        'Player Data': JSON.stringify(result.player_data),
        'Team Name': result.team_name,
        'Captain ID': result.captain_id,
        'Final Price': result.final_price,
        'Sold At': new Date(result.sold_at).toLocaleString()
      }));
      const resultsSheet = XLSX.utils.json_to_sheet(resultsFormatted);
      XLSX.utils.book_append_sheet(wb, resultsSheet, 'Sold Players');
    }

    // Generate filename
    const filename = `auction_${historyRecord.auction_name.replace(/[^a-z0-9]/gi, '_')}_${Date.now()}.xlsx`;

    // Download
    XLSX.writeFile(wb, filename);
    
    return true;
  } catch (error) {
    console.error('Error exporting to Excel:', error);
    return false;
  }
};

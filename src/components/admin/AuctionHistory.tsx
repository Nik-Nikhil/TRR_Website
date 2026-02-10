import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { History, Download, Trash2, Calendar, Users, TrendingUp, Loader2 } from 'lucide-react';
import { AuctionHistoryService, type AuctionHistoryRecord } from '../../services/auctionHistoryService';
import { exportAuctionToExcel } from '../../utils/excelExport';
import { useModal } from '../../hooks/useModal';

export const AuctionHistory = () => {
  const { confirm, alert, ModalComponent } = useModal();
  const [history, setHistory] = useState<AuctionHistoryRecord[]>([]);
  const [selectedAuction, setSelectedAuction] = useState<AuctionHistoryRecord | null>(null);
  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState(false);

  useEffect(() => {
    loadHistory();
  }, []);

  const loadHistory = async () => {
    setLoading(true);
    const data = await AuctionHistoryService.getAllHistory();
    setHistory(data);
    setLoading(false);
  };

  const handleDelete = async (id: string, name: string) => {
    const confirmed = await confirm(
      `Are you sure you want to delete the auction "${name}"?\n\nThis action cannot be undone.`,
      'Delete Auction History'
    );

    if (!confirmed) return;

    setActionLoading(true);
    const success = await AuctionHistoryService.deleteHistory(id);
    
    if (success) {
      await alert('Auction history deleted successfully', 'Success', 'success');
      await loadHistory();
      if (selectedAuction?.id === id) {
        setSelectedAuction(null);
      }
    } else {
      await alert('Failed to delete auction history', 'Error', 'warning');
    }
    setActionLoading(false);
  };

  const handleClearAll = async () => {
    const confirmed = await confirm(
      'Are you sure you want to clear ALL auction history?\n\nThis will permanently delete all archived auctions.\n\nThis action CANNOT be undone!',
      'Clear All History'
    );

    if (!confirmed) return;

    setActionLoading(true);
    const success = await AuctionHistoryService.deleteAllHistory();
    
    if (success) {
      await alert('All auction history cleared successfully', 'Success', 'success');
      setHistory([]);
      setSelectedAuction(null);
    } else {
      await alert('Failed to clear auction history', 'Error', 'warning');
    }
    setActionLoading(false);
  };

  const handleDownload = async (record: AuctionHistoryRecord) => {
    setActionLoading(true);
    const success = exportAuctionToExcel(record);
    
    if (success) {
      await alert('Excel file downloaded successfully', 'Success', 'success');
    } else {
      await alert('Failed to export to Excel', 'Error', 'warning');
    }
    setActionLoading(false);
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center p-12">
        <Loader2 className="w-8 h-8 text-purple-400 animate-spin" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <ModalComponent />
      
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold text-white">Auction History</h2>
          <p className="text-gray-400 text-sm">View and manage past auction records</p>
        </div>
        {history.length > 0 && (
          <button
            onClick={handleClearAll}
            disabled={actionLoading}
            className="flex items-center gap-2 px-4 py-2 bg-red-600/20 hover:bg-red-600/30 border border-red-500/50 text-red-300 rounded-lg transition-colors disabled:opacity-50"
          >
            <Trash2 className="w-4 h-4" />
            Clear All
          </button>
        )}
      </div>

      {history.length === 0 ? (
        <div className="bg-black/60 backdrop-blur-sm rounded-xl p-12 border border-gray-500/40 text-center">
          <History className="w-16 h-16 text-gray-500 mx-auto mb-4" />
          <p className="text-gray-400 text-lg">No auction history yet</p>
          <p className="text-gray-500 text-sm mt-2">Archived auctions will appear here</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Auction List */}
          <div className="lg:col-span-1 space-y-4">
            {history.map((auction) => (
              <motion.div
                key={auction.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                onClick={() => setSelectedAuction(auction)}
                className={`bg-gradient-to-br from-purple-900/40 to-indigo-900/40 backdrop-blur-xl border rounded-xl p-4 cursor-pointer transition-all ${
                  selectedAuction?.id === auction.id
                    ? 'border-purple-500 shadow-lg shadow-purple-500/20'
                    : 'border-purple-500/30 hover:border-purple-500/50'
                }`}
              >
                <div className="flex items-start justify-between mb-3">
                  <div className="flex-1">
                    <h3 className="text-white font-semibold">{auction.auction_name}</h3>
                    <p className="text-purple-300 text-sm">{auction.season}</p>
                  </div>
                  <div className="flex gap-2">
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        handleDownload(auction);
                      }}
                      disabled={actionLoading}
                      className="p-2 bg-green-600/20 hover:bg-green-600/30 border border-green-500/50 text-green-300 rounded-lg transition-colors disabled:opacity-50"
                      title="Download Excel"
                    >
                      <Download className="w-4 h-4" />
                    </button>
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        handleDelete(auction.id, auction.auction_name);
                      }}
                      disabled={actionLoading}
                      className="p-2 bg-red-600/20 hover:bg-red-600/30 border border-red-500/50 text-red-300 rounded-lg transition-colors disabled:opacity-50"
                      title="Delete"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>

                <div className="grid grid-cols-3 gap-2 text-xs">
                  <div className="bg-black/40 rounded p-2 text-center">
                    <Users className="w-4 h-4 text-blue-400 mx-auto mb-1" />
                    <p className="text-gray-400">{auction.captains_data?.length || 0}</p>
                    <p className="text-gray-500">Captains</p>
                  </div>
                  <div className="bg-black/40 rounded p-2 text-center">
                    <TrendingUp className="w-4 h-4 text-green-400 mx-auto mb-1" />
                    <p className="text-gray-400">{auction.bids_data?.length || 0}</p>
                    <p className="text-gray-500">Bids</p>
                  </div>
                  <div className="bg-black/40 rounded p-2 text-center">
                    <Users className="w-4 h-4 text-purple-400 mx-auto mb-1" />
                    <p className="text-gray-400">{auction.results_data?.length || 0}</p>
                    <p className="text-gray-500">Sold</p>
                  </div>
                </div>

                <div className="mt-3 flex items-center gap-2 text-xs text-gray-400">
                  <Calendar className="w-3 h-3" />
                  {new Date(auction.completed_at).toLocaleString()}
                </div>
              </motion.div>
            ))}
          </div>

          {/* Auction Details */}
          <div className="lg:col-span-2">
            {selectedAuction ? (
              <motion.div
                key={selectedAuction.id}
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                className="bg-gradient-to-br from-indigo-900/40 to-purple-900/40 backdrop-blur-xl border border-indigo-500/30 rounded-xl p-6"
              >
                <div className="flex items-start justify-between mb-6">
                  <div>
                    <h2 className="text-2xl font-bold text-white">{selectedAuction.auction_name}</h2>
                    <p className="text-indigo-300">{selectedAuction.season}</p>
                  </div>
                  <button
                    onClick={() => handleDownload(selectedAuction)}
                    disabled={actionLoading}
                    className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-500 hover:to-emerald-500 text-white font-semibold rounded-lg transition-all disabled:opacity-50"
                  >
                    <Download className="w-4 h-4" />
                    Download Excel
                  </button>
                </div>

                {/* Stats Grid */}
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
                  <div className="bg-black/40 rounded-xl p-4 border border-blue-500/20">
                    <Users className="w-6 h-6 text-blue-400 mb-2" />
                    <p className="text-2xl font-bold text-white">{selectedAuction.captains_data?.length || 0}</p>
                    <p className="text-gray-400 text-sm">Captains</p>
                  </div>
                  <div className="bg-black/40 rounded-xl p-4 border border-green-500/20">
                    <TrendingUp className="w-6 h-6 text-green-400 mb-2" />
                    <p className="text-2xl font-bold text-white">{selectedAuction.bids_data?.length || 0}</p>
                    <p className="text-gray-400 text-sm">Total Bids</p>
                  </div>
                  <div className="bg-black/40 rounded-xl p-4 border border-purple-500/20">
                    <Users className="w-6 h-6 text-purple-400 mb-2" />
                    <p className="text-2xl font-bold text-white">{selectedAuction.results_data?.length || 0}</p>
                    <p className="text-gray-400 text-sm">Players Sold</p>
                  </div>
                  <div className="bg-black/40 rounded-xl p-4 border border-yellow-500/20">
                    <Calendar className="w-6 h-6 text-yellow-400 mb-2" />
                    <p className="text-white text-sm font-semibold">
                      {new Date(selectedAuction.completed_at).toLocaleDateString()}
                    </p>
                    <p className="text-gray-400 text-sm">Completed</p>
                  </div>
                </div>

                {/* Captains Table */}
                {selectedAuction.captains_data && selectedAuction.captains_data.length > 0 && (
                  <div className="mb-6">
                    <h3 className="text-lg font-semibold text-white mb-3">Captains</h3>
                    <div className="bg-black/40 rounded-xl overflow-hidden border border-white/10">
                      <div className="overflow-x-auto">
                        <table className="w-full">
                          <thead className="bg-purple-900/40">
                            <tr>
                              <th className="px-4 py-3 text-left text-xs font-semibold text-gray-300">Team</th>
                              <th className="px-4 py-3 text-left text-xs font-semibold text-gray-300">Player ID</th>
                              <th className="px-4 py-3 text-right text-xs font-semibold text-gray-300">Budget</th>
                              <th className="px-4 py-3 text-right text-xs font-semibold text-gray-300">Spent</th>
                            </tr>
                          </thead>
                          <tbody className="divide-y divide-white/5">
                            {selectedAuction.captains_data.map((captain: any, idx: number) => (
                              <tr key={idx} className="hover:bg-white/5">
                                <td className="px-4 py-3 text-white font-semibold">{captain.team_name}</td>
                                <td className="px-4 py-3 text-gray-300">{captain.player_id}</td>
                                <td className="px-4 py-3 text-right text-yellow-400">🪙 {captain.budget}</td>
                                <td className="px-4 py-3 text-right text-red-400">
                                  🪙 {captain.initial_budget - captain.budget}
                                </td>
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      </div>
                    </div>
                  </div>
                )}

                {/* Sold Players Table */}
                {selectedAuction.results_data && selectedAuction.results_data.length > 0 && (
                  <div>
                    <h3 className="text-lg font-semibold text-white mb-3">Sold Players</h3>
                    <div className="bg-black/40 rounded-xl overflow-hidden border border-white/10">
                      <div className="overflow-x-auto">
                        <table className="w-full">
                          <thead className="bg-indigo-900/40">
                            <tr>
                              <th className="px-4 py-3 text-left text-xs font-semibold text-gray-300">Player</th>
                              <th className="px-4 py-3 text-left text-xs font-semibold text-gray-300">Team</th>
                              <th className="px-4 py-3 text-right text-xs font-semibold text-gray-300">Price</th>
                            </tr>
                          </thead>
                          <tbody className="divide-y divide-white/5">
                            {selectedAuction.results_data.map((result: any, idx: number) => (
                              <tr key={idx} className="hover:bg-white/5">
                                <td className="px-4 py-3 text-white">
                                  {result.player_data?.nickname || result.player_id}
                                </td>
                                <td className="px-4 py-3 text-purple-300 font-semibold">{result.team_name}</td>
                                <td className="px-4 py-3 text-right text-yellow-400 font-semibold">
                                  🪙 {result.final_price}
                                </td>
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      </div>
                    </div>
                  </div>
                )}
              </motion.div>
            ) : (
              <div className="bg-black/60 backdrop-blur-sm rounded-xl p-12 border border-gray-500/40 text-center h-full flex items-center justify-center">
                <div>
                  <History className="w-16 h-16 text-gray-500 mx-auto mb-4" />
                  <p className="text-gray-400">Select an auction to view details</p>
                </div>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

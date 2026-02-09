import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Plus, Trash2, Play, CheckCircle, XCircle, AlertCircle } from "lucide-react";
import { AuctionDatabaseService } from "../../services/auctionDatabaseService";
import type { Auction, DeletionRequest } from "../../services/auctionDatabaseService";

interface AuctionManagementProps {
  userRole: 'admin' | 'superadmin';
  username: string;
}

export function AuctionManagement({ userRole, username }: AuctionManagementProps) {
  const [auctions, setAuctions] = useState<Auction[]>([]);
  const [deletionRequests, setDeletionRequests] = useState<DeletionRequest[]>([]);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [newAuctionName, setNewAuctionName] = useState('');
  const [newAuctionSeason, setNewAuctionSeason] = useState('');
  const [deleteReason, setDeleteReason] = useState('');
  const [selectedAuctionForDelete, setSelectedAuctionForDelete] = useState<string | null>(null);

  useEffect(() => {
    loadAuctions();
    loadDeletionRequests();

    const handleAuctionCreated = () => loadAuctions();
    const handleAuctionUpdated = () => loadAuctions();
    const handleDeletionRequested = () => {
      loadAuctions();
      loadDeletionRequests();
    };

    window.addEventListener('auctionCreated', handleAuctionCreated);
    window.addEventListener('auctionUpdated', handleAuctionUpdated);
    window.addEventListener('deletionRequested', handleDeletionRequested);
    window.addEventListener('deletionApproved', handleDeletionRequested);
    window.addEventListener('deletionRejected', handleDeletionRequested);

    return () => {
      window.removeEventListener('auctionCreated', handleAuctionCreated);
      window.removeEventListener('auctionUpdated', handleAuctionUpdated);
      window.removeEventListener('deletionRequested', handleDeletionRequested);
      window.removeEventListener('deletionApproved', handleDeletionRequested);
      window.removeEventListener('deletionRejected', handleDeletionRequested);
    };
  }, []);

  const loadAuctions = async () => {
    const allAuctions = await AuctionDatabaseService.getAllAuctions();
    setAuctions(allAuctions);
  };

  const loadDeletionRequests = () => {
    const requests = AuctionDatabaseService.getPendingDeletionRequests();
    setDeletionRequests(requests);
  };

  const handleCreateAuction = async () => {
    if (!newAuctionName.trim() || !newAuctionSeason.trim()) {
      alert('Please fill in all fields');
      return;
    }

    await AuctionDatabaseService.createAuction(newAuctionName, newAuctionSeason, username);
    setNewAuctionName('');
    setNewAuctionSeason('');
    setShowCreateModal(false);
  };

  const handleRequestDeletion = async (auctionId: string) => {
    if (!deleteReason.trim()) {
      alert('Please provide a reason for deletion');
      return;
    }

    await AuctionDatabaseService.requestDeletion(auctionId, username, deleteReason);
    setDeleteReason('');
    setSelectedAuctionForDelete(null);
  };

  const handleApproveDeletion = async (requestId: string) => {
    const notes = prompt('Add review notes (optional):');
    await AuctionDatabaseService.approveDeletion(requestId, username, notes || undefined);
  };

  const handleRejectDeletion = async (requestId: string) => {
    const notes = prompt('Add review notes (optional):');
    await AuctionDatabaseService.rejectDeletion(requestId, username, notes || undefined);
  };

  const handleSetCurrentAuction = (auctionId: string) => {
    AuctionDatabaseService.setCurrentAuction(auctionId);
    alert('Auction set as current!');
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold text-white">Auction Management</h2>
        <button
          onClick={() => setShowCreateModal(true)}
          className="px-4 py-2 bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-500 hover:to-pink-500 text-white font-semibold rounded-lg transition-all duration-300 flex items-center gap-2"
        >
          <Plus className="w-5 h-5" />
          Create Auction
        </button>
      </div>

      {/* Superadmin: Pending Deletion Requests */}
      {userRole === 'superadmin' && deletionRequests.length > 0 && (
        <div className="bg-yellow-500/10 border border-yellow-500/30 rounded-xl p-6">
          <h3 className="text-xl font-bold text-yellow-400 mb-4 flex items-center gap-2">
            <AlertCircle className="w-6 h-6" />
            Pending Deletion Requests
          </h3>
          <div className="space-y-3">
            {deletionRequests.map((request) => {
              const auction = auctions.find(a => a.id === request.auction_id);
              return (
                <div key={request.id} className="bg-black/40 rounded-lg p-4 border border-yellow-500/20">
                  <div className="flex items-start justify-between mb-2">
                    <div>
                      <h4 className="text-white font-semibold">{auction?.name || 'Unknown Auction'}</h4>
                      <p className="text-gray-400 text-sm">Season: {auction?.season}</p>
                      <p className="text-yellow-400 text-sm mt-2">Requested by: {request.requested_by}</p>
                      <p className="text-gray-300 text-sm">Reason: {request.reason}</p>
                    </div>
                    <div className="flex gap-2">
                      <button
                        onClick={() => handleApproveDeletion(request.id)}
                        className="px-3 py-1 bg-green-600 hover:bg-green-500 text-white text-sm rounded-lg flex items-center gap-1"
                      >
                        <CheckCircle className="w-4 h-4" />
                        Approve
                      </button>
                      <button
                        onClick={() => handleRejectDeletion(request.id)}
                        className="px-3 py-1 bg-red-600 hover:bg-red-500 text-white text-sm rounded-lg flex items-center gap-1"
                      >
                        <XCircle className="w-4 h-4" />
                        Reject
                      </button>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* Auctions List */}
      <div className="bg-black/40 backdrop-blur-sm rounded-xl p-6 border border-purple-500/40">
        <h3 className="text-xl font-bold text-white mb-4">All Auctions</h3>
        {auctions.length === 0 ? (
          <p className="text-gray-400 text-center py-8">No auctions created yet</p>
        ) : (
          <div className="space-y-3">
            {auctions.map((auction) => (
              <motion.div
                key={auction.id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className={`border rounded-lg p-4 ${
                  auction.deletion_status === 'pending_deletion'
                    ? 'bg-yellow-500/10 border-yellow-500/30'
                    : 'bg-purple-500/10 border-purple-500/30'
                }`}
              >
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <h4 className="text-white font-semibold text-lg">{auction.name}</h4>
                    <p className="text-gray-400 text-sm">Season: {auction.season}</p>
                    <div className="flex items-center gap-4 mt-2 text-xs">
                      <span className={`px-2 py-1 rounded ${
                        auction.status === 'live' ? 'bg-green-500/20 text-green-400' :
                        auction.status === 'paused' ? 'bg-yellow-500/20 text-yellow-400' :
                        auction.status === 'completed' ? 'bg-blue-500/20 text-blue-400' :
                        'bg-gray-500/20 text-gray-400'
                      }`}>
                        {auction.status.toUpperCase()}
                      </span>
                      {auction.deletion_status === 'pending_deletion' && (
                        <span className="px-2 py-1 rounded bg-yellow-500/20 text-yellow-400">
                          PENDING DELETION
                        </span>
                      )}
                      <span className="text-gray-500">Created by: {auction.created_by}</span>
                      <span className="text-gray-500">
                        {new Date(auction.created_at).toLocaleDateString()}
                      </span>
                    </div>
                  </div>
                  <div className="flex gap-2">
                    <button
                      onClick={() => handleSetCurrentAuction(auction.id)}
                      className="px-3 py-1 bg-blue-600 hover:bg-blue-500 text-white text-sm rounded-lg flex items-center gap-1"
                    >
                      <Play className="w-4 h-4" />
                      Set Active
                    </button>
                    {auction.deletion_status === 'active' && (
                      <button
                        onClick={() => setSelectedAuctionForDelete(auction.id)}
                        className="px-3 py-1 bg-red-600 hover:bg-red-500 text-white text-sm rounded-lg flex items-center gap-1"
                      >
                        <Trash2 className="w-4 h-4" />
                        Delete
                      </button>
                    )}
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        )}
      </div>

      {/* Create Auction Modal */}
      <AnimatePresence>
        {showCreateModal && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4"
            onClick={() => setShowCreateModal(false)}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="bg-gradient-to-br from-purple-900/90 to-indigo-900/90 rounded-xl p-6 max-w-md w-full border border-purple-500/40"
              onClick={(e) => e.stopPropagation()}
            >
              <h3 className="text-2xl font-bold text-white mb-4">Create New Auction</h3>
              <div className="space-y-4">
                <div>
                  <label className="text-white text-sm font-semibold mb-2 block">Auction Name</label>
                  <input
                    type="text"
                    value={newAuctionName}
                    onChange={(e) => setNewAuctionName(e.target.value)}
                    placeholder="e.g., Demo Auction"
                    className="w-full px-4 py-2 bg-black/60 border border-purple-500/40 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500"
                  />
                </div>
                <div>
                  <label className="text-white text-sm font-semibold mb-2 block">Season</label>
                  <input
                    type="text"
                    value={newAuctionSeason}
                    onChange={(e) => setNewAuctionSeason(e.target.value)}
                    placeholder="e.g., Season 5"
                    className="w-full px-4 py-2 bg-black/60 border border-purple-500/40 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500"
                  />
                </div>
                <div className="flex gap-3 mt-6">
                  <button
                    onClick={handleCreateAuction}
                    className="flex-1 px-4 py-2 bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-500 hover:to-emerald-500 text-white font-semibold rounded-lg transition-all duration-300"
                  >
                    Create
                  </button>
                  <button
                    onClick={() => setShowCreateModal(false)}
                    className="flex-1 px-4 py-2 bg-gray-600 hover:bg-gray-500 text-white font-semibold rounded-lg transition-all duration-300"
                  >
                    Cancel
                  </button>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Delete Confirmation Modal */}
      <AnimatePresence>
        {selectedAuctionForDelete && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4"
            onClick={() => setSelectedAuctionForDelete(null)}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="bg-gradient-to-br from-red-900/90 to-orange-900/90 rounded-xl p-6 max-w-md w-full border border-red-500/40"
              onClick={(e) => e.stopPropagation()}
            >
              <h3 className="text-2xl font-bold text-white mb-4">Request Auction Deletion</h3>
              <p className="text-gray-300 text-sm mb-4">
                This will send a deletion request to the superadmin for approval.
              </p>
              <div className="space-y-4">
                <div>
                  <label className="text-white text-sm font-semibold mb-2 block">Reason for Deletion</label>
                  <textarea
                    value={deleteReason}
                    onChange={(e) => setDeleteReason(e.target.value)}
                    placeholder="Explain why this auction should be deleted..."
                    rows={4}
                    className="w-full px-4 py-2 bg-black/60 border border-red-500/40 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-red-500"
                  />
                </div>
                <div className="flex gap-3 mt-6">
                  <button
                    onClick={() => handleRequestDeletion(selectedAuctionForDelete)}
                    className="flex-1 px-4 py-2 bg-gradient-to-r from-red-600 to-orange-600 hover:from-red-500 hover:to-orange-500 text-white font-semibold rounded-lg transition-all duration-300"
                  >
                    Request Deletion
                  </button>
                  <button
                    onClick={() => {
                      setSelectedAuctionForDelete(null);
                      setDeleteReason('');
                    }}
                    className="flex-1 px-4 py-2 bg-gray-600 hover:bg-gray-500 text-white font-semibold rounded-lg transition-all duration-300"
                  >
                    Cancel
                  </button>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

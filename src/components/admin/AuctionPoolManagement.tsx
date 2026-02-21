import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Users, UserPlus, X, Trash2, Search } from 'lucide-react';
import auctionPoolService from '../../services/auctionPoolService';
import { PlayerService } from '../../services/supabaseService';
import { mapDatabasePlayerToFrontend } from '../../utils/playerMapper';
import { Avatar } from '../ui/Avatar';

interface AuctionPoolManagementProps {
  auctionId: string;
  adminUsername: string;
}

export const AuctionPoolManagement: React.FC<AuctionPoolManagementProps> = ({ 
  auctionId, 
  adminUsername 
}) => {
  const [poolPlayers, setPoolPlayers] = useState<any[]>([]);
  const [allPlayers, setAllPlayers] = useState<any[]>([]);
  const [showAddModal, setShowAddModal] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedPlayers, setSelectedPlayers] = useState<Set<string>>(new Set());
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    loadPoolPlayers();
    loadAllPlayers();

    // Subscribe to pool changes
    const subscription = auctionPoolService.subscribeToAuctionPool(auctionId, () => {
      loadPoolPlayers();
    });

    return () => {
      subscription.unsubscribe();
    };
  }, [auctionId]);

  const loadPoolPlayers = async () => {
    const players = await auctionPoolService.getAuctionPool(auctionId);
    setPoolPlayers(players);
  };

  const loadAllPlayers = async () => {
    try {
      const dbPlayers = await PlayerService.getAllPlayers();
      const mappedPlayers = dbPlayers.map(mapDatabasePlayerToFrontend);
      setAllPlayers(mappedPlayers);
    } catch (error) {
      console.error('Error loading players:', error);
    }
  };

  const handleAddPlayers = async () => {
    if (selectedPlayers.size === 0) {
      setError('Please select at least one player');
      return;
    }

    setLoading(true);
    setError('');

    let successCount = 0;
    const errors: string[] = [];

    for (const playerId of selectedPlayers) {
      const player = allPlayers.find(p => p.id === playerId);
      if (!player) {
        errors.push(`Player ${playerId} not found`);
        continue;
      }

      const result = await auctionPoolService.addPlayerToPool(
        auctionId,
        player.id,
        player,
        adminUsername
      );

      if (result.success) {
        successCount++;
      } else {
        errors.push(`${player.nickname}: ${result.error || 'Unknown error'}`);
      }
    }

    setLoading(false);
    setSelectedPlayers(new Set());
    setShowAddModal(false);
    await loadPoolPlayers();

    // Show detailed results
    if (successCount > 0 && errors.length === 0) {
      setError(`✅ Successfully added ${successCount} player(s) to auction pool`);
      setTimeout(() => setError(''), 5000);
    } else if (successCount > 0 && errors.length > 0) {
      setError(`✅ Added ${successCount} player(s). ❌ ${errors.length} failed:\n${errors.join('\n')}`);
    } else {
      setError(`❌ Failed to add players:\n${errors.join('\n')}`);
    }
  };

  const handleRemovePlayer = async (poolId: string) => {
    if (!confirm('Remove this player from the auction pool?')) return;

    const success = await auctionPoolService.removePlayerFromPool(poolId);
    if (success) {
      await loadPoolPlayers();
    }
  };

  const togglePlayerSelection = (playerId: string) => {
    const newSelection = new Set(selectedPlayers);
    if (newSelection.has(playerId)) {
      newSelection.delete(playerId);
    } else {
      newSelection.add(playerId);
    }
    setSelectedPlayers(newSelection);
  };

  // Filter players not already in pool
  const poolPlayerIds = new Set(poolPlayers.map(p => p.player_id));
  const availableToAdd = allPlayers.filter(p => !poolPlayerIds.has(p.id));

  // Filter by search query
  const filteredPlayers = availableToAdd.filter(p =>
    p.nickname.toLowerCase().includes(searchQuery.toLowerCase()) ||
    (p.realName && p.realName.toLowerCase().includes(searchQuery.toLowerCase()))
  );

  // Separate by status
  const availablePlayers = poolPlayers.filter(p => p.status === 'available');
  const soldPlayers = poolPlayers.filter(p => p.status === 'sold');

  return (
    <div className="space-y-6">
      {/* Header Card */}
      <div className="bg-gradient-to-r from-blue-900/30 to-cyan-900/30 backdrop-blur-sm rounded-xl border border-blue-500/20 p-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <div className="p-3 bg-blue-500/20 rounded-xl border border-blue-400/30">
              <Users className="w-7 h-7 text-blue-400" />
            </div>
            <div>
              <h3 className="text-2xl font-bold text-white">Auction Pool</h3>
              <p className="text-sm text-blue-300 mt-1">
                {availablePlayers.length} available • {soldPlayers.length} sold
              </p>
            </div>
          </div>
          <button
            onClick={() => setShowAddModal(true)}
            className="flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-blue-600 to-cyan-600 hover:from-blue-500 hover:to-cyan-500 text-white font-semibold rounded-xl transition-all duration-300 shadow-lg hover:shadow-blue-500/50 hover:scale-105"
          >
            <UserPlus className="w-5 h-5" />
            Add Players
          </button>
        </div>
      </div>

      {/* Content Card */}
      <div className="bg-gray-900/50 backdrop-blur-sm rounded-xl border border-blue-500/20 p-6">
        {error && (
          <div className="mb-4 p-4 bg-yellow-500/10 border border-yellow-500/30 rounded-xl">
            <p className="text-yellow-400 text-sm font-medium">{error}</p>
          </div>
        )}

        {poolPlayers.length === 0 ? (
          <div className="text-center py-20">
            <div className="inline-flex p-5 bg-blue-500/10 rounded-full mb-4">
              <Users className="w-16 h-16 text-blue-400/50" />
            </div>
            <p className="text-gray-300 text-xl font-medium mb-2">No players in auction pool yet</p>
            <p className="text-gray-500">Click "Add Players" to start building your auction pool</p>
          </div>
        ) : (
          <div className="space-y-8">
            {/* Available Players */}
            {availablePlayers.length > 0 && (
              <div>
                <div className="flex items-center gap-2 mb-4">
                  <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
                  <h4 className="text-green-400 font-bold text-lg">Available Players ({availablePlayers.length})</h4>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
                  {availablePlayers.map((poolPlayer) => (
                    <motion.div
                      key={poolPlayer.id}
                      initial={{ opacity: 0, scale: 0.95 }}
                      animate={{ opacity: 1, scale: 1 }}
                      className="group relative bg-gradient-to-br from-green-900/20 to-emerald-900/20 border border-green-500/30 rounded-xl p-4 hover:border-green-400/50 transition-all duration-300 hover:shadow-lg hover:shadow-green-500/10"
                    >
                      <div className="flex items-start justify-between mb-3">
                        <div className="flex items-center gap-3 flex-1 min-w-0">
                          <Avatar
                            src={poolPlayer.player_data?.avatarUrl}
                            alt={poolPlayer.player_data?.nickname}
                            name={poolPlayer.player_data?.nickname}
                            size="md"
                            className="border-2 border-green-500/50"
                          />
                          <div className="flex-1 min-w-0">
                            <p className="text-white font-bold text-base truncate">
                              {poolPlayer.player_data?.nickname}
                            </p>
                            <p className="text-green-400 text-sm font-semibold">
                              {poolPlayer.player_data?.currentMMR || 'N/A'} MMR
                            </p>
                          </div>
                        </div>
                        <button
                          onClick={() => handleRemovePlayer(poolPlayer.id)}
                          className="p-2 bg-red-500/10 hover:bg-red-500/20 border border-red-500/30 hover:border-red-500/50 text-red-400 hover:text-red-300 rounded-lg transition-all duration-200 hover:scale-110"
                          title="Remove from pool"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                      {poolPlayer.player_data?.currentMedalLabel && (
                        <div className="text-xs text-gray-400 bg-gray-800/50 rounded px-2 py-1">
                          {poolPlayer.player_data.currentMedalLabel}
                        </div>
                      )}
                    </motion.div>
                  ))}
                </div>
              </div>
            )}

            {/* Sold Players */}
            {soldPlayers.length > 0 && (
              <div>
                <div className="flex items-center gap-2 mb-4">
                  <div className="w-2 h-2 bg-gray-500 rounded-full"></div>
                  <h4 className="text-gray-400 font-bold text-lg">Sold Players ({soldPlayers.length})</h4>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
                  {soldPlayers.map((poolPlayer) => (
                    <div
                      key={poolPlayer.id}
                      className="bg-gray-800/40 border border-gray-600/30 rounded-xl p-4 opacity-60"
                    >
                      <div className="flex items-center gap-3">
                        <Avatar
                          src={poolPlayer.player_data?.avatarUrl}
                          alt={poolPlayer.player_data?.nickname}
                          name={poolPlayer.player_data?.nickname}
                          size="md"
                          className="border-2 border-gray-500/50"
                        />
                        <div className="flex-1 min-w-0">
                          <p className="text-gray-300 font-bold text-base truncate">
                            {poolPlayer.player_data?.nickname}
                          </p>
                          <p className="text-gray-500 text-sm font-semibold">✓ Sold</p>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}
      </div>

      {/* Add Players Modal */}
      <AnimatePresence>
        {showAddModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="absolute inset-0 bg-black/80 backdrop-blur-md" 
              onClick={() => setShowAddModal(false)} 
            />
            
            <motion.div
              initial={{ opacity: 0, scale: 0.9, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 20 }}
              className="relative bg-gradient-to-br from-gray-800 to-gray-900 backdrop-blur-xl border border-blue-500/30 rounded-2xl w-full max-w-4xl max-h-[85vh] flex flex-col shadow-2xl"
            >
              {/* Modal Header */}
              <div className="flex items-center justify-between p-6 border-b border-blue-500/20">
                <div className="flex items-center gap-3">
                  <div className="p-2.5 bg-blue-500/20 rounded-xl border border-blue-400/30">
                    <Users className="w-6 h-6 text-blue-400" />
                  </div>
                  <h3 className="text-2xl font-bold text-white">Add Players to Auction Pool</h3>
                </div>
                <button
                  onClick={() => setShowAddModal(false)}
                  className="p-2 text-gray-400 hover:text-white hover:bg-gray-700/50 rounded-lg transition-all"
                >
                  <X className="w-6 h-6" />
                </button>
              </div>

              {/* Modal Body */}
              <div className="flex-1 overflow-hidden flex flex-col p-6">
                {/* Search */}
                <div className="mb-4">
                  <div className="relative">
                    <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                    <input
                      type="text"
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      placeholder="Search players..."
                      className="w-full pl-12 pr-4 py-3.5 bg-gray-700/50 border border-gray-600/50 rounded-xl text-white text-base placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                    />
                  </div>
                  <p className="text-sm text-blue-400 font-medium mt-2.5">
                    {selectedPlayers.size} player(s) selected
                  </p>
                </div>

                {/* Player List */}
                <div className="flex-1 overflow-y-auto space-y-2 pr-2 custom-standings-scroll">
                  {filteredPlayers.length === 0 ? (
                    <div className="text-center py-12 text-gray-400">
                      <Users className="w-12 h-12 mx-auto mb-3 opacity-50" />
                      <p>No players available</p>
                    </div>
                  ) : (
                    filteredPlayers.map((player) => (
                      <motion.div
                        key={player.id}
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        onClick={() => togglePlayerSelection(player.id)}
                        className={`flex items-center gap-4 p-4 rounded-xl cursor-pointer transition-all ${
                          selectedPlayers.has(player.id)
                            ? 'bg-blue-600/30 border-2 border-blue-500 shadow-lg shadow-blue-500/20'
                            : 'bg-gray-700/30 border-2 border-transparent hover:border-gray-600 hover:bg-gray-700/50'
                        }`}
                      >
                        <input
                          type="checkbox"
                          checked={selectedPlayers.has(player.id)}
                          onChange={() => {}}
                          className="w-5 h-5 rounded border-gray-600 text-blue-600 focus:ring-blue-500"
                        />
                        <Avatar
                          src={player.avatarUrl}
                          alt={player.nickname}
                          name={player.nickname}
                          size="md"
                          className="border-2 border-blue-500/50"
                        />
                        <div className="flex-1 min-w-0">
                          <p className="text-white font-bold text-base">{player.nickname}</p>
                          <p className="text-gray-400 text-sm">
                            {player.currentMedalLabel} • {player.currentMMR || 'N/A'} MMR
                          </p>
                        </div>
                      </motion.div>
                    ))
                  )}
                </div>
              </div>

              {/* Modal Footer */}
              <div className="flex gap-3 p-6 border-t border-blue-500/20">
                <button
                  onClick={() => setShowAddModal(false)}
                  className="flex-1 px-5 py-3.5 bg-gray-700/50 hover:bg-gray-700 border border-gray-600/50 text-gray-300 hover:text-white font-semibold rounded-xl transition-all duration-200 text-base"
                >
                  Cancel
                </button>
                <button
                  onClick={handleAddPlayers}
                  disabled={selectedPlayers.size === 0 || loading}
                  className="flex-1 px-5 py-3.5 bg-gradient-to-r from-blue-600 to-cyan-600 hover:from-blue-500 hover:to-cyan-500 disabled:from-gray-600 disabled:to-gray-700 disabled:cursor-not-allowed text-white font-semibold rounded-xl transition-all duration-300 shadow-lg hover:shadow-blue-500/50 text-base"
                >
                  {loading ? 'Adding...' : `Add ${selectedPlayers.size} Player(s)`}
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
};

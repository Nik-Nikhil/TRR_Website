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
    let errorCount = 0;

    for (const playerId of selectedPlayers) {
      const player = allPlayers.find(p => p.id === playerId);
      if (!player) continue;

      const success = await auctionPoolService.addPlayerToPool(
        auctionId,
        player.id,
        player,
        adminUsername
      );

      if (success) {
        successCount++;
      } else {
        errorCount++;
      }
    }

    setLoading(false);
    setSelectedPlayers(new Set());
    setShowAddModal(false);
    await loadPoolPlayers();

    if (errorCount > 0) {
      setError(`Added ${successCount} players, ${errorCount} failed (may already be in pool)`);
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
    <div className="bg-black/60 backdrop-blur-sm rounded-xl border border-blue-500/40">
      <div className="p-6 border-b border-blue-500/20">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <Users className="w-6 h-6 text-blue-400" />
            <div>
              <h3 className="text-lg font-semibold text-white">Auction Pool</h3>
              <p className="text-sm text-gray-400">
                {availablePlayers.length} available • {soldPlayers.length} sold
              </p>
            </div>
          </div>
          <button
            onClick={() => setShowAddModal(true)}
            className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-blue-600 to-cyan-600 hover:from-blue-500 hover:to-cyan-500 text-white rounded-lg transition-all duration-300 shadow-lg"
          >
            <UserPlus className="w-4 h-4" />
            Add Players
          </button>
        </div>
      </div>

      <div className="p-6">
        {error && (
          <div className="mb-4 p-3 bg-yellow-500/20 border border-yellow-500/50 rounded-lg">
            <p className="text-yellow-300 text-sm">{error}</p>
          </div>
        )}

        {poolPlayers.length === 0 ? (
          <div className="text-center py-12 text-gray-400">
            <Users className="w-12 h-12 mx-auto mb-3 opacity-50" />
            <p>No players in auction pool yet</p>
            <p className="text-sm">Click "Add Players" to start</p>
          </div>
        ) : (
          <div className="space-y-6">
            {/* Available Players */}
            {availablePlayers.length > 0 && (
              <div>
                <h4 className="text-green-400 font-semibold mb-3">Available ({availablePlayers.length})</h4>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
                  {availablePlayers.map((poolPlayer) => (
                    <motion.div
                      key={poolPlayer.id}
                      initial={{ opacity: 0, scale: 0.95 }}
                      animate={{ opacity: 1, scale: 1 }}
                      className="bg-gradient-to-br from-green-900/20 to-emerald-900/20 border border-green-500/30 rounded-xl p-3 hover:border-green-400/50 transition-all duration-300"
                    >
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2 flex-1 min-w-0">
                          <Avatar
                            src={poolPlayer.player_data?.avatarUrl}
                            alt={poolPlayer.player_data?.nickname}
                            name={poolPlayer.player_data?.nickname}
                            size="sm"
                            className="border-2 border-green-500/50"
                          />
                          <div className="flex-1 min-w-0">
                            <p className="text-white font-semibold text-sm truncate">
                              {poolPlayer.player_data?.nickname}
                            </p>
                            <p className="text-green-400 text-xs">
                              {poolPlayer.player_data?.currentMMR || 'N/A'} MMR
                            </p>
                          </div>
                        </div>
                        <button
                          onClick={() => handleRemovePlayer(poolPlayer.id)}
                          className="p-1.5 bg-red-600/20 hover:bg-red-600/30 border border-red-500/50 text-red-300 rounded transition-colors"
                        >
                          <Trash2 className="w-3 h-3" />
                        </button>
                      </div>
                    </motion.div>
                  ))}
                </div>
              </div>
            )}

            {/* Sold Players */}
            {soldPlayers.length > 0 && (
              <div>
                <h4 className="text-gray-400 font-semibold mb-3">Sold ({soldPlayers.length})</h4>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
                  {soldPlayers.map((poolPlayer) => (
                    <div
                      key={poolPlayer.id}
                      className="bg-gray-900/40 border border-gray-600/30 rounded-xl p-3 opacity-60"
                    >
                      <div className="flex items-center gap-2">
                        <Avatar
                          src={poolPlayer.player_data?.avatarUrl}
                          alt={poolPlayer.player_data?.nickname}
                          name={poolPlayer.player_data?.nickname}
                          size="sm"
                          className="border-2 border-gray-500/50"
                        />
                        <div className="flex-1 min-w-0">
                          <p className="text-gray-300 font-semibold text-sm truncate">
                            {poolPlayer.player_data?.nickname}
                          </p>
                          <p className="text-gray-500 text-xs">Sold</p>
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
            <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" onClick={() => setShowAddModal(false)} />
            
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="relative bg-gray-800/90 backdrop-blur-xl border border-blue-500/30 rounded-2xl p-6 w-full max-w-4xl max-h-[80vh] flex flex-col"
            >
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-xl font-semibold text-white flex items-center gap-2">
                  <Users className="w-5 h-5 text-blue-400" />
                  Add Players to Auction Pool
                </h3>
                <button
                  onClick={() => setShowAddModal(false)}
                  className="text-gray-400 hover:text-white transition-colors"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              {/* Search */}
              <div className="mb-4">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                  <input
                    type="text"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder="Search players..."
                    className="w-full pl-10 pr-4 py-2 bg-gray-700/50 border border-gray-600/40 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
                <p className="text-sm text-gray-400 mt-2">
                  {selectedPlayers.size} player(s) selected
                </p>
              </div>

              {/* Player List */}
              <div className="flex-1 overflow-y-auto space-y-2 mb-4">
                {filteredPlayers.map((player) => (
                  <div
                    key={player.id}
                    onClick={() => togglePlayerSelection(player.id)}
                    className={`flex items-center gap-3 p-3 rounded-lg cursor-pointer transition-all ${
                      selectedPlayers.has(player.id)
                        ? 'bg-blue-600/30 border-2 border-blue-500'
                        : 'bg-gray-700/30 border-2 border-transparent hover:border-gray-600'
                    }`}
                  >
                    <input
                      type="checkbox"
                      checked={selectedPlayers.has(player.id)}
                      onChange={() => {}}
                      className="w-4 h-4"
                    />
                    <Avatar
                      src={player.avatarUrl}
                      alt={player.nickname}
                      name={player.nickname}
                      size="sm"
                    />
                    <div className="flex-1">
                      <p className="text-white font-semibold">{player.nickname}</p>
                      <p className="text-gray-400 text-sm">
                        {player.currentMedalLabel} • {player.currentMMR || 'N/A'} MMR
                      </p>
                    </div>
                  </div>
                ))}
              </div>

              {/* Actions */}
              <div className="flex gap-3">
                <button
                  onClick={() => setShowAddModal(false)}
                  className="flex-1 px-4 py-2 bg-gray-600/80 hover:bg-gray-600 text-white rounded-lg transition-colors"
                >
                  Cancel
                </button>
                <button
                  onClick={handleAddPlayers}
                  disabled={selectedPlayers.size === 0 || loading}
                  className="flex-1 px-4 py-2 bg-gradient-to-r from-blue-600 to-cyan-600 hover:from-blue-500 hover:to-cyan-500 disabled:from-gray-600 disabled:to-gray-700 disabled:cursor-not-allowed text-white rounded-lg transition-all duration-300"
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

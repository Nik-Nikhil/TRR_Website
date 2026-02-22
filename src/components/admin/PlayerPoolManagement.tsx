import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { UserPlus, Trash2, Search, CheckCircle } from 'lucide-react';
import { supabase } from '../../lib/supabase';
import { Avatar } from '../ui/Avatar';

interface Player {
  id: string;
  nickname: string;
  avatar_url?: string;
  current_mmr?: number;
  current_medal_label?: string;
  roles?: any[];
}

interface AuctionPoolPlayer {
  id: string;
  player_id: string;
  auction_id: string;
  base_price: number;
  added_at: string;
  player?: Player;
}

export function PlayerPoolManagement() {
  const [registeredPlayers, setRegisteredPlayers] = useState<Player[]>([]);
  const [poolPlayers, setPoolPlayers] = useState<AuctionPoolPlayer[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedPlayers, setSelectedPlayers] = useState<Set<string>>(new Set());
  const [basePrice, setBasePrice] = useState('0');
  const [playerType, setPlayerType] = useState<'core' | 'support'>('core');
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState('');

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      setLoading(true);
      
      // Load registered players (approved registrations)
      const { data: registrations, error: regError } = await supabase
        .from('registrations')
        .select(`
          player_id,
          players (
            id,
            nickname,
            avatar_url,
            current_mmr,
            current_medal_label,
            roles
          )
        `)
        .eq('status', 'approved');

      if (regError) throw regError;

      const players = (registrations
        ?.map(r => r.players)
        .filter(Boolean) as unknown) as Player[];
      
      setRegisteredPlayers(players || []);

      // Load current auction pool
      const { data: poolData, error: poolError } = await supabase
        .from('auction_pool')
        .select(`
          *,
          players (
            id,
            nickname,
            avatar_url,
            current_mmr,
            current_medal_label,
            roles
          )
        `)
        .order('added_at', { ascending: false });

      if (poolError) throw poolError;
      setPoolPlayers(poolData || []);

    } catch (error: any) {
      console.error('Error loading data:', error);
      setMessage(error.message || 'Failed to load data');
    } finally {
      setLoading(false);
    }
  };

  const handleTogglePlayer = (playerId: string) => {
    const newSelected = new Set(selectedPlayers);
    if (newSelected.has(playerId)) {
      newSelected.delete(playerId);
    } else {
      newSelected.add(playerId);
    }
    setSelectedPlayers(newSelected);
  };

  const handleAddToPool = async () => {
    if (selectedPlayers.size === 0) {
      setMessage('Please select at least one player');
      return;
    }

    const price = parseInt(basePrice);
    if (isNaN(price) || price < 0) {
      setMessage('Please enter a valid base price (0 or higher)');
      return;
    }

    try {
      setMessage('Adding players to pool...');

      // Get full player data for each selected player
      const playersToAdd = await Promise.all(
        Array.from(selectedPlayers).map(async (playerId) => {
          const player = registeredPlayers.find(p => p.id === playerId);
          
          return {
            player_id: playerId,
            base_price: price,
            player_type: playerType,
            player_data: player, // Store full player data as JSONB
            auction_id: null // Will be set when auction starts
          };
        })
      );

      const { error } = await supabase
        .from('auction_pool')
        .insert(playersToAdd);

      if (error) throw error;

      setMessage(`Successfully added ${selectedPlayers.size} ${playerType} player(s) to pool!`);
      setSelectedPlayers(new Set());
      setBasePrice('0');
      await loadData();

      setTimeout(() => setMessage(''), 3000);
    } catch (error: any) {
      console.error('Error adding to pool:', error);
      setMessage(error.message || 'Failed to add players');
    }
  };

  const handleRemoveFromPool = async (poolId: string) => {
    if (!confirm('Remove this player from the auction pool?')) return;

    try {
      const { error } = await supabase
        .from('auction_pool')
        .delete()
        .eq('id', poolId);

      if (error) throw error;

      setMessage('Player removed from pool');
      await loadData();
      setTimeout(() => setMessage(''), 3000);
    } catch (error: any) {
      console.error('Error removing from pool:', error);
      setMessage(error.message || 'Failed to remove player');
    }
  };

  const filteredPlayers = registeredPlayers.filter(player => {
    const inPool = poolPlayers.some(p => p.player_id === player.id);
    if (inPool) return false;

    if (!searchQuery) return true;
    return player.nickname.toLowerCase().includes(searchQuery.toLowerCase());
  });

  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="text-white text-lg">Loading players...</div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h2 className="text-2xl font-bold text-white mb-2">Auction Player Pool</h2>
        <p className="text-gray-400 text-sm">
          Add registered players to the auction pool. Only players in the pool can be auctioned.
        </p>
      </div>

      {/* Message */}
      {message && (
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className={`p-4 rounded-lg ${
            message.includes('Success') || message.includes('removed')
              ? 'bg-green-500/20 border border-green-500/50 text-green-300'
              : message.includes('Failed') || message.includes('Error')
              ? 'bg-red-500/20 border border-red-500/50 text-red-300'
              : 'bg-blue-500/20 border border-blue-500/50 text-blue-300'
          }`}
        >
          {message}
        </motion.div>
      )}

      {/* Current Pool */}
      <div className="bg-black/40 backdrop-blur-sm rounded-xl p-6 border border-green-500/40">
        <h3 className="text-xl font-bold text-white mb-4">
          Current Pool ({poolPlayers.length} players)
        </h3>
        
        {poolPlayers.length === 0 ? (
          <p className="text-gray-400 text-center py-8">No players in pool yet</p>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
            {poolPlayers.map((poolPlayer) => {
              const player = poolPlayer.player as unknown as Player;
              if (!player) return null;

              return (
                <motion.div
                  key={poolPlayer.id}
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className="bg-gradient-to-br from-green-900/30 to-emerald-900/30 border-2 border-green-500/50 rounded-lg p-3"
                >
                  <div className="flex items-center gap-3 mb-2">
                    <Avatar
                      src={player.avatar_url}
                      alt={player.nickname}
                      name={player.nickname}
                      size="md"
                      className="border-2 border-green-400"
                    />
                    <div className="flex-1 min-w-0">
                      <p className="text-white font-bold truncate">{player.nickname}</p>
                      <p className="text-green-400 text-sm">
                        Base: 🪙 {poolPlayer.base_price}
                      </p>
                    </div>
                    <button
                      onClick={() => handleRemoveFromPool(poolPlayer.id)}
                      className="p-2 hover:bg-red-500/20 rounded-lg transition-colors"
                    >
                      <Trash2 className="w-4 h-4 text-red-400" />
                    </button>
                  </div>
                </motion.div>
              );
            })}
          </div>
        )}
      </div>

      {/* Add Players Section */}
      <div className="bg-black/40 backdrop-blur-sm rounded-xl p-6 border border-purple-500/40">
        <h3 className="text-xl font-bold text-white mb-4">
          Add Players to Pool
        </h3>

        {/* Search and Base Price */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-4">
          <div className="md:col-span-2">
            <label className="text-white text-sm font-semibold mb-2 block">
              Search Players
            </label>
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search by nickname..."
                className="w-full pl-10 pr-4 py-2 bg-black/60 border border-purple-500/40 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500"
              />
            </div>
          </div>

          <div>
            <label className="text-white text-sm font-semibold mb-2 block">
              Player Type
            </label>
            <select
              value={playerType}
              onChange={(e) => setPlayerType(e.target.value as 'core' | 'support')}
              className="w-full px-4 py-2 bg-black/60 border border-purple-500/40 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-purple-500"
            >
              <option value="core">Core</option>
              <option value="support">Support</option>
            </select>
          </div>

          <div>
            <label className="text-white text-sm font-semibold mb-2 block">
              Base Price
            </label>
            <input
              type="number"
              value={basePrice}
              onChange={(e) => setBasePrice(e.target.value)}
              placeholder="0"
              min="0"
              className="w-full px-4 py-2 bg-black/60 border border-purple-500/40 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500"
            />
          </div>
        </div>

        {/* Selected Count and Add Button */}
        {selectedPlayers.size > 0 && (
          <div className="mb-4 flex items-center justify-between bg-purple-500/20 border border-purple-500/40 rounded-lg p-3">
            <span className="text-white font-semibold">
              {selectedPlayers.size} player(s) selected
            </span>
            <button
              onClick={handleAddToPool}
              className="px-4 py-2 bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-500 hover:to-pink-500 text-white font-bold rounded-lg transition-all duration-300 flex items-center gap-2"
            >
              <UserPlus className="w-5 h-5" />
              Add to Pool
            </button>
          </div>
        )}

        {/* Player List */}
        {filteredPlayers.length === 0 ? (
          <p className="text-gray-400 text-center py-8">
            {searchQuery ? 'No players found' : 'All registered players are already in the pool'}
          </p>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3 max-h-96 overflow-y-auto">
            {filteredPlayers.map((player) => {
              const isSelected = selectedPlayers.has(player.id);

              return (
                <motion.div
                  key={player.id}
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  onClick={() => handleTogglePlayer(player.id)}
                  className={`cursor-pointer rounded-lg p-3 border-2 transition-all ${
                    isSelected
                      ? 'bg-purple-500/30 border-purple-500'
                      : 'bg-gray-800/30 border-gray-600/50 hover:border-purple-500/50'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <Avatar
                      src={player.avatar_url}
                      alt={player.nickname}
                      name={player.nickname}
                      size="md"
                      className={`border-2 ${
                        isSelected ? 'border-purple-400' : 'border-gray-500'
                      }`}
                    />
                    <div className="flex-1 min-w-0">
                      <p className="text-white font-bold truncate">{player.nickname}</p>
                      {player.current_mmr && (
                        <p className="text-gray-400 text-sm">MMR: {player.current_mmr}</p>
                      )}
                    </div>
                    {isSelected && (
                      <CheckCircle className="w-5 h-5 text-purple-400 flex-shrink-0" />
                    )}
                  </div>
                </motion.div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}

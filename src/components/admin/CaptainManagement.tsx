import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Users, UserPlus, X, Trash2, DollarSign, Trophy } from 'lucide-react';
import captainService from '../../services/captainService';
import { Avatar } from '../ui/Avatar';
import { players } from '../../data/players';
import { PlayerService } from '../../services/supabaseService';
import { mapDatabasePlayerToFrontend } from '../../utils/playerMapper';

interface TeamManagementProps {
  adminUsername: string;
}

export const CaptainManagement: React.FC<TeamManagementProps> = ({ adminUsername }) => {
  const [captains, setCaptains] = useState<any[]>([]);
  const [showAddModal, setShowAddModal] = useState(false);
  const [selectedPlayer, setSelectedPlayer] = useState('');
  const [teamName, setTeamName] = useState('');
  const [budget, setBudget] = useState(1000);
  const [error, setError] = useState('');
  const [availablePlayers, setAvailablePlayers] = useState<any[]>([]);
  const [captainPlayers, setCaptainPlayers] = useState<Map<string, any>>(new Map());

  useEffect(() => {
    loadCaptains();
    filterAvailablePlayers();

    // Subscribe to captain changes for real-time updates
    const subscription = captainService.subscribeToCaptains(() => {
      loadCaptains();
      filterAvailablePlayers();
    });

    return () => {
      subscription.unsubscribe();
    };
  }, []);

  useEffect(() => {
    filterAvailablePlayers();
  }, [captains]);

  const filterAvailablePlayers = async () => {
    const captainsList = await captainService.getCaptains();
    const captainIds = captainsList.map(c => c.playerId);
    setAvailablePlayers(players.filter(p => !captainIds.includes(p.id)));
  };

  const loadCaptains = async () => {
    const captainsList = await captainService.getCaptains();
    setCaptains(captainsList);
    
    // Load player data for each captain from database
    const playerMap = new Map();
    for (const captain of captainsList) {
      try {
        const dbPlayer = await PlayerService.getPlayerById(captain.playerId);
        if (dbPlayer) {
          const frontendPlayer = mapDatabasePlayerToFrontend(dbPlayer);
          playerMap.set(captain.playerId, frontendPlayer);
        }
      } catch (error) {
        console.error(`Error loading player ${captain.playerId}:`, error);
      }
    }
    setCaptainPlayers(playerMap);
  };

  const handleAddCaptain = async () => {
    setError('');

    if (!selectedPlayer) {
      setError('Please select a player');
      return;
    }

    if (!teamName.trim()) {
      setError('Please enter a team name');
      return;
    }

    if (budget < 100) {
      setError('Budget must be at least 100');
      return;
    }

    const player = players.find(p => p.id === selectedPlayer);
    if (!player) {
      setError('Player not found');
      return;
    }

    // Get the player's UUID from the database
    const { PlayerService } = await import('../../services/supabaseService');
    const dbPlayer = await PlayerService.getPlayerByNickname(player.nickname);
    
    if (!dbPlayer) {
      setError('Player not found in database');
      return;
    }

    // Use the database UUID instead of the local ID
    const success = await captainService.assignCaptain(
      dbPlayer.id, // Use UUID from database
      player.nickname,
      teamName.trim(),
      budget,
      adminUsername
    );

    if (success) {
      setShowAddModal(false);
      setSelectedPlayer('');
      setTeamName('');
      setBudget(1000);
      setError('');
      await loadCaptains();
    } else {
      setError('Failed to assign captain. Player may already be a captain or team name exists.');
    }
  };

  const handleRemoveCaptain = async (playerId: string) => {
    if (confirm('Are you sure you want to remove this captain?')) {
      await captainService.removeCaptain(playerId);
      await loadCaptains();
    }
  };

  // Filter out players who are already captains
  // (handled by state and useEffect above)

  return (
    <div className="space-y-6">
      {/* Header Card */}
      <div className="bg-gradient-to-r from-purple-900/30 to-indigo-900/30 backdrop-blur-sm rounded-xl border border-purple-500/20 p-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <div className="p-3 bg-purple-500/20 rounded-xl border border-purple-400/30">
              <Users className="w-7 h-7 text-purple-400" />
            </div>
            <div>
              <h3 className="text-2xl font-bold text-white">Team Management</h3>
              <p className="text-sm text-purple-300 mt-1">Assign captains and manage team rosters</p>
            </div>
          </div>
          <button
            onClick={() => setShowAddModal(true)}
            className="flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 text-white font-semibold rounded-xl transition-all duration-300 shadow-lg hover:shadow-purple-500/50 hover:scale-105"
          >
            <UserPlus className="w-5 h-5" />
            Add Captain
          </button>
        </div>
      </div>

      {/* Teams Grid */}
      <div className="bg-gray-900/50 backdrop-blur-sm rounded-xl border border-purple-500/20 p-6">
        {captains.length === 0 ? (
          <div className="text-center py-20">
            <div className="inline-flex p-5 bg-purple-500/10 rounded-full mb-4">
              <Users className="w-16 h-16 text-purple-400/50" />
            </div>
            <p className="text-gray-300 text-xl font-medium mb-2">No teams created yet</p>
            <p className="text-gray-500">Click "Add Captain" to create your first team</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
            {captains.map((captain) => {
              const player = captainPlayers.get(captain.playerId) || players.find(p => p.id === captain.playerId);
              return (
                <motion.div
                  key={captain.playerId}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="group relative bg-gradient-to-br from-gray-800/60 to-gray-900/60 border border-purple-500/20 rounded-xl overflow-hidden hover:border-purple-400/40 transition-all duration-300 hover:shadow-xl hover:shadow-purple-500/10"
                >
                  {/* Gradient overlay on hover */}
                  <div className="absolute inset-0 bg-gradient-to-br from-purple-600/0 to-indigo-600/0 group-hover:from-purple-600/5 group-hover:to-indigo-600/5 transition-all duration-300" />
                  
                  <div className="relative p-6">
                    {/* Header with Avatar and Remove Button */}
                    <div className="flex items-start justify-between mb-5">
                      <div className="flex items-center gap-4">
                        <div className="relative">
                          <Avatar
                            src={player?.avatarUrl}
                            alt={captain.playerNickname}
                            name={captain.playerNickname}
                            size="lg"
                            className="border-3 border-purple-500/50 shadow-lg"
                          />
                          <div className="absolute -bottom-1 -right-1 p-1.5 bg-gradient-to-br from-amber-500 to-yellow-600 rounded-full border-2 border-gray-900">
                            <Trophy className="w-3.5 h-3.5 text-white" />
                          </div>
                        </div>
                        <div>
                          <h4 className="text-white font-bold text-lg mb-1">{captain.playerNickname}</h4>
                          <p className="text-purple-400 text-sm font-semibold">{captain.teamName}</p>
                        </div>
                      </div>
                      <button
                        onClick={() => handleRemoveCaptain(captain.playerId)}
                        className="p-2.5 bg-red-500/10 hover:bg-red-500/20 border border-red-500/30 hover:border-red-500/50 text-red-400 hover:text-red-300 rounded-lg transition-all duration-200 hover:scale-110"
                        title="Remove Captain"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>

                    {/* Stats Grid */}
                    <div className="space-y-3">
                      {/* Budget */}
                      <div className="flex items-center justify-between p-3 bg-green-500/10 border border-green-500/20 rounded-lg">
                        <div className="flex items-center gap-2">
                          <div className="p-1.5 bg-green-500/20 rounded">
                            <DollarSign className="w-4 h-4 text-green-400" />
                          </div>
                          <span className="text-gray-300 text-sm font-medium">Budget</span>
                        </div>
                        <span className="text-green-400 font-bold text-lg">{captain.budget.toLocaleString()}</span>
                      </div>

                      {/* Metadata */}
                      <div className="grid grid-cols-2 gap-3 text-xs">
                        <div className="p-3 bg-gray-700/30 rounded-lg">
                          <p className="text-gray-500 mb-1">Assigned</p>
                          <p className="text-gray-300 font-medium">{new Date(captain.assignedAt).toLocaleDateString()}</p>
                        </div>
                        <div className="p-3 bg-gray-700/30 rounded-lg">
                          <p className="text-gray-500 mb-1">By Admin</p>
                          <p className="text-gray-300 font-medium truncate">{captain.assignedBy}</p>
                        </div>
                      </div>
                    </div>
                  </div>
                </motion.div>
              );
            })}
          </div>
        )}
      </div>

      {/* Add Captain Modal */}
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
              className="relative bg-gradient-to-br from-gray-800 to-gray-900 backdrop-blur-xl border border-purple-500/30 rounded-2xl w-full max-w-lg shadow-2xl"
            >
              {/* Modal Header */}
              <div className="flex items-center justify-between p-6 border-b border-purple-500/20">
                <div className="flex items-center gap-3">
                  <div className="p-2.5 bg-purple-500/20 rounded-xl border border-purple-400/30">
                    <Users className="w-6 h-6 text-purple-400" />
                  </div>
                  <h3 className="text-2xl font-bold text-white">Assign Captain</h3>
                </div>
                <button
                  onClick={() => setShowAddModal(false)}
                  className="p-2 text-gray-400 hover:text-white hover:bg-gray-700/50 rounded-lg transition-all"
                >
                  <X className="w-6 h-6" />
                </button>
              </div>

              {/* Modal Body */}
              <div className="p-6">
                {/* Error Message */}
                {error && (
                  <motion.div
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="mb-5 p-4 bg-red-500/10 border border-red-500/30 rounded-xl"
                  >
                    <p className="text-red-400 text-sm font-medium">{error}</p>
                  </motion.div>
                )}

                {/* Form */}
                <div className="space-y-5">
                  {/* Player Select */}
                  <div>
                    <label className="block text-sm font-semibold text-gray-300 mb-2.5">
                      Select Player
                    </label>
                    <select
                      value={selectedPlayer}
                      onChange={(e) => setSelectedPlayer(e.target.value)}
                      className="w-full px-4 py-3.5 bg-gray-700/50 border border-gray-600/50 rounded-xl text-white text-base focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all"
                    >
                      <option value="">Choose a player...</option>
                      {availablePlayers.map((player) => (
                        <option key={player.id} value={player.id}>
                          {player.nickname} - {player.currentMMR || 'Unranked'} MMR
                        </option>
                      ))}
                    </select>
                  </div>

                  {/* Team Name */}
                  <div>
                    <label className="block text-sm font-semibold text-gray-300 mb-2.5">
                      Team Name
                    </label>
                    <input
                      type="text"
                      value={teamName}
                      onChange={(e) => setTeamName(e.target.value)}
                      className="w-full px-4 py-3.5 bg-gray-700/50 border border-gray-600/50 rounded-xl text-white text-base placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all"
                      placeholder="e.g., Team Phoenix"
                    />
                  </div>

                  {/* Budget */}
                  <div>
                    <label className="block text-sm font-semibold text-gray-300 mb-2.5">
                      Budget
                    </label>
                    <input
                      type="number"
                      value={budget}
                      onChange={(e) => setBudget(parseInt(e.target.value) || 0)}
                      min="100"
                      step="50"
                      className="w-full px-4 py-3.5 bg-gray-700/50 border border-gray-600/50 rounded-xl text-white text-base focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all"
                    />
                    <p className="text-xs text-gray-500 mt-2">Minimum budget: 100</p>
                  </div>
                </div>
              </div>

              {/* Modal Footer */}
              <div className="flex gap-3 p-6 border-t border-purple-500/20">
                <button
                  onClick={() => setShowAddModal(false)}
                  className="flex-1 px-5 py-3.5 bg-gray-700/50 hover:bg-gray-700 border border-gray-600/50 text-gray-300 hover:text-white font-semibold rounded-xl transition-all duration-200 text-base"
                >
                  Cancel
                </button>
                <button
                  onClick={handleAddCaptain}
                  className="flex-1 px-5 py-3.5 bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 text-white font-semibold rounded-xl transition-all duration-300 shadow-lg hover:shadow-purple-500/50 text-base"
                >
                  Assign Captain
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
};

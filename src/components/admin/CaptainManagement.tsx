import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Shield, UserPlus, X, Trash2, DollarSign } from 'lucide-react';
import captainService from '../../services/captainService';
import { Avatar } from '../ui/Avatar';
import { players } from '../../data/players';

interface CaptainManagementProps {
  adminUsername: string;
}

export const CaptainManagement: React.FC<CaptainManagementProps> = ({ adminUsername }) => {
  const [captains, setCaptains] = useState<any[]>([]);
  const [showAddModal, setShowAddModal] = useState(false);
  const [selectedPlayer, setSelectedPlayer] = useState('');
  const [teamName, setTeamName] = useState('');
  const [budget, setBudget] = useState(1000);
  const [error, setError] = useState('');

  useEffect(() => {
    loadCaptains();

    // Listen for captain changes
    const handleCaptainAssigned = () => loadCaptains();
    const handleCaptainRemoved = () => loadCaptains();

    window.addEventListener('captainAssigned', handleCaptainAssigned);
    window.addEventListener('captainRemoved', handleCaptainRemoved);

    return () => {
      window.removeEventListener('captainAssigned', handleCaptainAssigned);
      window.removeEventListener('captainRemoved', handleCaptainRemoved);
    };
  }, []);

  const loadCaptains = () => {
    setCaptains(captainService.getCaptains());
  };

  const handleAddCaptain = () => {
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

    const success = captainService.assignCaptain(
      player.id,
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
    } else {
      setError('Failed to assign captain. Player may already be a captain or team name exists.');
    }
  };

  const handleRemoveCaptain = (playerId: string) => {
    if (confirm('Are you sure you want to remove this captain?')) {
      captainService.removeCaptain(playerId);
    }
  };

  // Filter out players who are already captains
  const availablePlayers = players.filter(p => !captainService.isCaptain(p.id));

  return (
    <div className="bg-black/60 backdrop-blur-sm rounded-xl border border-amber-500/40">
      <div className="p-6 border-b border-amber-500/20">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <Shield className="w-6 h-6 text-amber-400" />
            <div>
              <h3 className="text-lg font-semibold text-white">Captain Management</h3>
              <p className="text-sm text-gray-400">Assign and manage team captains</p>
            </div>
          </div>
          <button
            onClick={() => setShowAddModal(true)}
            className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-amber-600 to-yellow-600 hover:from-amber-500 hover:to-yellow-500 text-white rounded-lg transition-all duration-300 shadow-lg"
          >
            <UserPlus className="w-4 h-4" />
            Add Captain
          </button>
        </div>
      </div>

      <div className="p-6">
        {captains.length === 0 ? (
          <div className="text-center py-12 text-gray-400">
            <Shield className="w-12 h-12 mx-auto mb-3 opacity-50" />
            <p>No captains assigned yet</p>
            <p className="text-sm">Click "Add Captain" to assign team captains</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {captains.map((captain) => {
              const player = players.find(p => p.id === captain.playerId);
              return (
                <motion.div
                  key={captain.playerId}
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className="bg-gradient-to-br from-amber-900/20 to-yellow-900/20 border border-amber-500/30 rounded-xl p-4 hover:border-amber-400/50 transition-all duration-300"
                >
                  <div className="flex items-start justify-between mb-3">
                    <div className="flex items-center gap-3">
                      <Avatar
                        src={player?.avatarUrl}
                        alt={captain.playerNickname}
                        name={captain.playerNickname}
                        size="md"
                        className="border-2 border-amber-500/50"
                      />
                      <div>
                        <h4 className="text-white font-semibold">{captain.playerNickname}</h4>
                        <p className="text-amber-400 text-sm font-medium">{captain.teamName}</p>
                      </div>
                    </div>
                    <button
                      onClick={() => handleRemoveCaptain(captain.playerId)}
                      className="p-2 bg-red-600/20 hover:bg-red-600/30 border border-red-500/50 text-red-300 rounded-lg transition-colors"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>

                  <div className="space-y-2">
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-gray-400 flex items-center gap-1">
                        <DollarSign className="w-3 h-3" />
                        Budget:
                      </span>
                      <span className="text-green-400 font-semibold">{captain.budget.toLocaleString()}</span>
                    </div>
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-gray-400">Assigned:</span>
                      <span className="text-gray-300">{new Date(captain.assignedAt).toLocaleDateString()}</span>
                    </div>
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-gray-400">By:</span>
                      <span className="text-gray-300">{captain.assignedBy}</span>
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
            <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" onClick={() => setShowAddModal(false)} />
            
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="relative bg-gray-800/90 backdrop-blur-xl border border-amber-500/30 rounded-2xl p-6 w-full max-w-md"
            >
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-xl font-semibold text-white flex items-center gap-2">
                  <Shield className="w-5 h-5 text-amber-400" />
                  Assign Captain
                </h3>
                <button
                  onClick={() => setShowAddModal(false)}
                  className="text-gray-400 hover:text-white transition-colors"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              {error && (
                <div className="mb-4 p-3 bg-red-500/20 border border-red-500/50 rounded-lg">
                  <p className="text-red-300 text-sm">{error}</p>
                </div>
              )}

              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    Select Player
                  </label>
                  <select
                    value={selectedPlayer}
                    onChange={(e) => setSelectedPlayer(e.target.value)}
                    className="w-full p-3 bg-gray-700/50 border border-gray-600/40 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-amber-500"
                  >
                    <option value="">Choose a player...</option>
                    {availablePlayers.map((player) => (
                      <option key={player.id} value={player.id}>
                        {player.nickname} - {player.currentMMR || 'Unranked'} MMR
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    Team Name
                  </label>
                  <input
                    type="text"
                    value={teamName}
                    onChange={(e) => setTeamName(e.target.value)}
                    className="w-full p-3 bg-gray-700/50 border border-gray-600/40 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-amber-500"
                    placeholder="e.g., Team Phoenix"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    Budget
                  </label>
                  <input
                    type="number"
                    value={budget}
                    onChange={(e) => setBudget(parseInt(e.target.value) || 0)}
                    min="100"
                    step="50"
                    className="w-full p-3 bg-gray-700/50 border border-gray-600/40 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-amber-500"
                  />
                  <p className="text-xs text-gray-400 mt-1">Minimum budget: 100</p>
                </div>
              </div>

              <div className="flex gap-3 mt-6">
                <button
                  onClick={() => setShowAddModal(false)}
                  className="flex-1 px-4 py-2 bg-gray-600/80 hover:bg-gray-600 text-white rounded-lg transition-colors"
                >
                  Cancel
                </button>
                <button
                  onClick={handleAddCaptain}
                  className="flex-1 px-4 py-2 bg-gradient-to-r from-amber-600 to-yellow-600 hover:from-amber-500 hover:to-yellow-500 text-white rounded-lg transition-all duration-300"
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

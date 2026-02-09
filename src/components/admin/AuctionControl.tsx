import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Gavel, Play, Pause, Square, Loader2, Users, ArrowRight, RotateCcw } from 'lucide-react';
import { AuctionService } from '../../services/auctionService';
import { Avatar } from '../ui/Avatar';
import { players } from '../../data/players';

export const AuctionControl = () => {
  const [auctionStatus, setAuctionStatus] = useState<'not-started' | 'live' | 'paused' | 'completed'>('not-started');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [selectedPlayerId, setSelectedPlayerId] = useState('');
  const [currentPlayer, setCurrentPlayer] = useState<any>(null);
  const [showNameInput, setShowNameInput] = useState(false);
  const [auctionName, setAuctionName] = useState('');

  useEffect(() => {
    loadAuctionState();
    
    // Subscribe to auction state changes
    const subscription = AuctionService.subscribeToAuctionState((state) => {
      setAuctionStatus(state.status);
      setCurrentPlayer(state.current_player_data);
    });

    return () => {
      subscription.unsubscribe();
    };
  }, []);

  const loadAuctionState = async () => {
    const state = await AuctionService.getAuctionState();
    if (state) {
      setAuctionStatus(state.status);
      setCurrentPlayer(state.current_player_data);
    }
  };

  const handleStartClick = () => {
    setShowNameInput(true);
    setError(null);
  };

  const handleStartAuction = async () => {
    if (!auctionName || !auctionName.trim()) {
      setError('Auction name is required');
      return;
    }

    setLoading(true);
    setError(null);
    const success = await AuctionService.startAuction();
    if (success) {
      setAuctionStatus('live');
      // Store auction name in localStorage for display
      localStorage.setItem('current_auction_name', auctionName.trim());
      setShowNameInput(false);
      setAuctionName('');
    } else {
      setError('Failed to start auction');
    }
    setLoading(false);
  };

  const handleCancelNameInput = () => {
    setShowNameInput(false);
    setAuctionName('');
    setError(null);
  };

  const handlePause = async () => {
    setLoading(true);
    setError(null);
    const success = await AuctionService.pauseAuction();
    if (success) {
      setAuctionStatus('paused');
    } else {
      setError('Failed to pause auction');
    }
    setLoading(false);
  };

  const handleResume = async () => {
    setLoading(true);
    setError(null);
    const success = await AuctionService.resumeAuction();
    if (success) {
      setAuctionStatus('live');
    } else {
      setError('Failed to resume auction');
    }
    setLoading(false);
  };

  const handleStop = async () => {
    setLoading(true);
    setError(null);
    const success = await AuctionService.stopAuction();
    if (success) {
      setAuctionStatus('completed');
    } else {
      setError('Failed to stop auction');
    }
    setLoading(false);
  };

  const handleReset = async () => {
    if (!confirm('Are you sure you want to reset the auction to Not Started? This will clear all current auction data.')) {
      return;
    }
    
    setLoading(true);
    setError(null);
    const success = await AuctionService.resetAuction();
    if (success) {
      setAuctionStatus('not-started');
      setCurrentPlayer(null);
    } else {
      setError('Failed to reset auction');
    }
    setLoading(false);
  };

  const handleSetPlayer = async () => {
    if (!selectedPlayerId) {
      setError('Please select a player');
      return;
    }

    setLoading(true);
    setError(null);

    const player = players.find(p => p.id === selectedPlayerId);
    if (!player) {
      setError('Player not found');
      setLoading(false);
      return;
    }

    // Add base price to player data
    const playerData = {
      ...player,
      basePrice: 50 // Default base price
    };

    const success = await AuctionService.setCurrentPlayer(player.id, playerData);
    if (success) {
      setCurrentPlayer(playerData);
      setSelectedPlayerId('');
    } else {
      setError('Failed to set player');
    }
    setLoading(false);
  };

  const getStatusColor = () => {
    switch (auctionStatus) {
      case 'live': return 'from-green-500 to-emerald-600';
      case 'paused': return 'from-yellow-500 to-orange-600';
      case 'completed': return 'from-gray-500 to-gray-600';
      default: return 'from-purple-500 to-indigo-600';
    }
  };

  const getStatusText = () => {
    switch (auctionStatus) {
      case 'live': return 'Live';
      case 'paused': return 'Paused';
      case 'completed': return 'Completed';
      default: return 'Not Started';
    }
  };

  return (
    <div className="space-y-6">
      {/* Quick State Switcher */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-gradient-to-br from-indigo-900/40 to-purple-900/40 backdrop-blur-xl border border-indigo-500/30 rounded-2xl p-4 shadow-2xl"
      >
        <h4 className="text-sm font-semibold text-white mb-3">Quick State Control</h4>
        <div className="grid grid-cols-3 gap-2">
          <button
            onClick={handleReset}
            disabled={loading || auctionStatus === 'not-started'}
            className={`px-3 py-2 rounded-lg text-xs font-semibold transition-all ${
              auctionStatus === 'not-started'
                ? 'bg-purple-600 text-white'
                : 'bg-purple-500/20 text-purple-300 hover:bg-purple-500/30'
            } disabled:opacity-50 disabled:cursor-not-allowed`}
          >
            Not Started
          </button>
          <button
            onClick={auctionStatus === 'paused' ? handleResume : handleStartClick}
            disabled={loading || auctionStatus === 'live'}
            className={`px-3 py-2 rounded-lg text-xs font-semibold transition-all ${
              auctionStatus === 'live' || auctionStatus === 'paused'
                ? 'bg-green-600 text-white'
                : 'bg-green-500/20 text-green-300 hover:bg-green-500/30'
            } disabled:opacity-50 disabled:cursor-not-allowed`}
          >
            Ongoing
          </button>
          <button
            onClick={handleStop}
            disabled={loading || auctionStatus === 'completed'}
            className={`px-3 py-2 rounded-lg text-xs font-semibold transition-all ${
              auctionStatus === 'completed'
                ? 'bg-gray-600 text-white'
                : 'bg-gray-500/20 text-gray-300 hover:bg-gray-500/30'
            } disabled:opacity-50 disabled:cursor-not-allowed`}
          >
            Finished
          </button>
        </div>
      </motion.div>

      {/* Main Auction Control */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-gradient-to-br from-purple-900/40 to-indigo-900/40 backdrop-blur-xl border border-purple-500/30 rounded-2xl p-6 shadow-2xl"
      >
        <div className="flex items-center gap-3 mb-6">
          <div className={`w-12 h-12 bg-gradient-to-br ${getStatusColor()} rounded-xl flex items-center justify-center shadow-lg`}>
            <Gavel className="w-6 h-6 text-white" />
          </div>
          <div>
            <h3 className="text-xl font-bold text-white">Auction Control</h3>
            <p className="text-sm text-gray-400">Manage player auction</p>
          </div>
        </div>

        {/* Status Display */}
        <div className="bg-black/40 rounded-xl p-4 mb-4 border border-purple-500/20">
          <div className="flex items-center justify-between">
            <span className="text-gray-400 text-sm">Current Status:</span>
            <div className="flex items-center gap-2">
              <div className={`w-2 h-2 rounded-full ${
                auctionStatus === 'live' ? 'bg-green-400 animate-pulse' :
                auctionStatus === 'paused' ? 'bg-yellow-400' :
                auctionStatus === 'completed' ? 'bg-gray-400' :
                'bg-purple-400'
              }`} />
              <span className="text-white font-semibold">{getStatusText()}</span>
            </div>
          </div>
        </div>

        {/* Error Message */}
        {error && (
          <div className="bg-red-500/20 border border-red-500/50 rounded-lg p-3 mb-4">
            <p className="text-red-300 text-sm">{error}</p>
          </div>
        )}

        {/* Auction Name Input - Show when starting auction */}
        {showNameInput && auctionStatus === 'not-started' && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="bg-indigo-500/10 border border-indigo-500/30 rounded-xl p-4 mb-4"
          >
            <label className="block text-sm font-semibold text-white mb-2">
              Auction Name <span className="text-red-400">*</span>
            </label>
            <input
              type="text"
              value={auctionName}
              onChange={(e) => setAuctionName(e.target.value)}
              placeholder='e.g., "Season 6 Auction", "Demo Auction"'
              className="w-full px-4 py-2 bg-black/60 border border-indigo-500/40 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 mb-3"
              autoFocus
            />
            <div className="flex gap-2">
              <button
                onClick={handleStartAuction}
                disabled={loading || !auctionName.trim()}
                className="flex-1 flex items-center justify-center gap-2 px-4 py-2 bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-500 hover:to-emerald-500 disabled:from-gray-600 disabled:to-gray-700 text-white font-semibold rounded-lg transition-all duration-300"
              >
                {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Play className="w-4 h-4" />}
                Start Auction
              </button>
              <button
                onClick={handleCancelNameInput}
                disabled={loading}
                className="px-4 py-2 bg-gray-600 hover:bg-gray-500 disabled:bg-gray-700 text-white font-semibold rounded-lg transition-all duration-300"
              >
                Cancel
              </button>
            </div>
          </motion.div>
        )}

        {/* Control Buttons */}
        <div className="grid grid-cols-2 gap-3">
          {auctionStatus === 'not-started' && !showNameInput && (
            <button
              onClick={handleStartClick}
              disabled={loading}
              className="col-span-2 flex items-center justify-center gap-2 px-4 py-3 bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-500 hover:to-emerald-500 disabled:from-gray-600 disabled:to-gray-700 text-white font-semibold rounded-xl transition-all duration-300 shadow-lg"
            >
              {loading ? <Loader2 className="w-5 h-5 animate-spin" /> : <Play className="w-5 h-5" />}
              Start Auction
            </button>
          )}

          {auctionStatus === 'live' && (
            <>
              <button
                onClick={handlePause}
                disabled={loading}
                className="flex items-center justify-center gap-2 px-4 py-3 bg-gradient-to-r from-yellow-600 to-orange-600 hover:from-yellow-500 hover:to-orange-500 disabled:from-gray-600 disabled:to-gray-700 text-white font-semibold rounded-xl transition-all duration-300 shadow-lg"
              >
                {loading ? <Loader2 className="w-5 h-5 animate-spin" /> : <Pause className="w-5 h-5" />}
                Pause
              </button>
              <button
                onClick={handleStop}
                disabled={loading}
                className="flex items-center justify-center gap-2 px-4 py-3 bg-gradient-to-r from-red-600 to-rose-600 hover:from-red-500 hover:to-rose-500 disabled:from-gray-600 disabled:to-gray-700 text-white font-semibold rounded-xl transition-all duration-300 shadow-lg"
              >
                {loading ? <Loader2 className="w-5 h-5 animate-spin" /> : <Square className="w-5 h-5" />}
                Stop
              </button>
            </>
          )}

          {auctionStatus === 'paused' && (
            <>
              <button
                onClick={handleResume}
                disabled={loading}
                className="flex items-center justify-center gap-2 px-4 py-3 bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-500 hover:to-emerald-500 disabled:from-gray-600 disabled:to-gray-700 text-white font-semibold rounded-xl transition-all duration-300 shadow-lg"
              >
                {loading ? <Loader2 className="w-5 h-5 animate-spin" /> : <Play className="w-5 h-5" />}
                Resume
              </button>
              <button
                onClick={handleStop}
                disabled={loading}
                className="flex items-center justify-center gap-2 px-4 py-3 bg-gradient-to-r from-red-600 to-rose-600 hover:from-red-500 hover:to-rose-500 disabled:from-gray-600 disabled:to-gray-700 text-white font-semibold rounded-xl transition-all duration-300 shadow-lg"
              >
                {loading ? <Loader2 className="w-5 h-5 animate-spin" /> : <Square className="w-5 h-5" />}
                Stop
              </button>
            </>
          )}

          {auctionStatus === 'completed' && !showNameInput && (
            <>
              <button
                onClick={handleReset}
                disabled={loading}
                className="flex items-center justify-center gap-2 px-4 py-3 bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 disabled:from-gray-600 disabled:to-gray-700 text-white font-semibold rounded-xl transition-all duration-300 shadow-lg"
              >
                {loading ? <Loader2 className="w-5 h-5 animate-spin" /> : <RotateCcw className="w-5 h-5" />}
                Reset to Not Started
              </button>
              <button
                onClick={handleStartClick}
                disabled={loading}
                className="flex items-center justify-center gap-2 px-4 py-3 bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-500 hover:to-emerald-500 disabled:from-gray-600 disabled:to-gray-700 text-white font-semibold rounded-xl transition-all duration-300 shadow-lg"
              >
                {loading ? <Loader2 className="w-5 h-5 animate-spin" /> : <Play className="w-5 h-5" />}
                Start New Auction
              </button>
            </>
          )}

          {auctionStatus === 'completed' && showNameInput && (
            <div className="col-span-2">
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                exit={{ opacity: 0, height: 0 }}
                className="bg-indigo-500/10 border border-indigo-500/30 rounded-xl p-4"
              >
                <label className="block text-sm font-semibold text-white mb-2">
                  Auction Name <span className="text-red-400">*</span>
                </label>
                <input
                  type="text"
                  value={auctionName}
                  onChange={(e) => setAuctionName(e.target.value)}
                  placeholder='e.g., "Season 6 Auction", "Demo Auction"'
                  className="w-full px-4 py-2 bg-black/60 border border-indigo-500/40 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 mb-3"
                  autoFocus
                />
                <div className="flex gap-2">
                  <button
                    onClick={handleStartAuction}
                    disabled={loading || !auctionName.trim()}
                    className="flex-1 flex items-center justify-center gap-2 px-4 py-2 bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-500 hover:to-emerald-500 disabled:from-gray-600 disabled:to-gray-700 text-white font-semibold rounded-lg transition-all duration-300"
                  >
                    {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Play className="w-4 h-4" />}
                    Start Auction
                  </button>
                  <button
                    onClick={handleCancelNameInput}
                    disabled={loading}
                    className="px-4 py-2 bg-gray-600 hover:bg-gray-500 disabled:bg-gray-700 text-white font-semibold rounded-lg transition-all duration-300"
                  >
                    Cancel
                  </button>
                </div>
              </motion.div>
            </div>
          )}
        </div>
      </motion.div>

      {/* Player Selection - Only show when auction is live or paused */}
      {(auctionStatus === 'live' || auctionStatus === 'paused') && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-gradient-to-br from-blue-900/40 to-cyan-900/40 backdrop-blur-xl border border-blue-500/30 rounded-2xl p-6 shadow-2xl"
        >
          <div className="flex items-center gap-3 mb-6">
            <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-cyan-600 rounded-xl flex items-center justify-center shadow-lg">
              <Users className="w-6 h-6 text-white" />
            </div>
            <div>
              <h3 className="text-xl font-bold text-white">Player Selection</h3>
              <p className="text-sm text-gray-400">Select next player for bidding</p>
            </div>
          </div>

          {/* Current Player Display */}
          {currentPlayer && (
            <div className="bg-black/40 rounded-xl p-4 mb-4 border border-blue-500/20">
              <p className="text-gray-400 text-xs mb-2">Current Player:</p>
              <div className="flex items-center gap-3">
                <Avatar
                  src={currentPlayer.avatarUrl}
                  alt={currentPlayer.nickname}
                  name={currentPlayer.nickname}
                  size="md"
                  className="border-2 border-blue-400"
                />
                <div>
                  <p className="text-white font-semibold">{currentPlayer.nickname}</p>
                  <p className="text-blue-400 text-sm">{currentPlayer.currentMMR} MMR</p>
                </div>
              </div>
            </div>
          )}

          {/* Player Selection Dropdown */}
          <div className="space-y-3">
            <select
              value={selectedPlayerId}
              onChange={(e) => setSelectedPlayerId(e.target.value)}
              className="w-full p-3 bg-black/60 border border-blue-500/40 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="">Select a player...</option>
              {players.map((player) => (
                <option key={player.id} value={player.id}>
                  {player.nickname} - {player.currentMMR || 'Unranked'} MMR - {player.roles?.map(r => r.label).join(', ')}
                </option>
              ))}
            </select>

            <button
              onClick={handleSetPlayer}
              disabled={loading || !selectedPlayerId}
              className="w-full flex items-center justify-center gap-2 px-4 py-3 bg-gradient-to-r from-blue-600 to-cyan-600 hover:from-blue-500 hover:to-cyan-500 disabled:from-gray-600 disabled:to-gray-700 text-white font-semibold rounded-xl transition-all duration-300 shadow-lg"
            >
              {loading ? <Loader2 className="w-5 h-5 animate-spin" /> : <ArrowRight className="w-5 h-5" />}
              Set as Current Player
            </button>
          </div>
        </motion.div>
      )}
    </div>
  );
};

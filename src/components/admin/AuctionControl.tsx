import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Gavel, Play, Pause, Square, Loader2, Users, ArrowRight, RotateCcw, Archive } from 'lucide-react';
import { AuctionService } from '../../services/auctionService';
import { AuctionHistoryService } from '../../services/auctionHistoryService';
import { Avatar } from '../ui/Avatar';
import { supabase } from '../../lib/supabase';
import { useModal } from '../../hooks/useModal';

export const AuctionControl = () => {
  const { confirm, alert, ModalComponent } = useModal();
  const [auctionStatus, setAuctionStatus] = useState<'not-started' | 'live' | 'paused' | 'completed'>('not-started');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [selectedPlayerId, setSelectedPlayerId] = useState('');
  const [currentPlayer, setCurrentPlayer] = useState<any>(null);
  const [showNameInput, setShowNameInput] = useState(false);
  const [auctionName, setAuctionName] = useState('');
  const [poolPlayers, setPoolPlayers] = useState<any[]>([]);
  const [soldPlayers, setSoldPlayers] = useState<any[]>([]); // Track sold players

  useEffect(() => {
    loadAuctionState();
    loadPoolPlayers();
    loadSoldPlayers(); // Load sold players
    
    // Subscribe to auction state changes
    const subscription = AuctionService.subscribeToAuctionState((state) => {
      setAuctionStatus(state.status);
      setCurrentPlayer(state.current_player_data);
    });

    // Subscribe to sold players changes
    const soldPlayersChannel = supabase
      .channel('auction-results-admin')
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'auction_results'
        },
        () => {
          loadSoldPlayers();
        }
      )
      .subscribe();

    return () => {
      subscription.unsubscribe();
      supabase.removeChannel(soldPlayersChannel);
    };
  }, []);

  const loadAuctionState = async () => {
    const state = await AuctionService.getAuctionState();
    if (state) {
      setAuctionStatus(state.status);
      setCurrentPlayer(state.current_player_data);
    }
  };

  const loadSoldPlayers = async () => {
    try {
      const state = await AuctionService.getAuctionState();
      if (!state) {
        setSoldPlayers([]);
        return;
      }

      const { data, error } = await supabase
        .from('auction_results')
        .select('player_id')
        .eq('auction_id', state.id);

      if (!error && data) {
        setSoldPlayers(data);
      }
    } catch (error) {
      // Silent error
    }
  };

  const loadPoolPlayers = async () => {
    try {
      // Reload sold players first to get fresh data
      await loadSoldPlayers();
      
      // Get current auction state to filter by auction ID
      const auctionState = await AuctionService.getAuctionState();
      if (!auctionState) {
        setPoolPlayers([]);
        return;
      }

      // Import and use auction pool service
      const { default: auctionPoolService } = await import('../../services/auctionPoolService');
      const players = await auctionPoolService.getAuctionPool(auctionState.id);
      setPoolPlayers(players);
    } catch (error) {
      console.error('Error loading pool players:', error);
      setPoolPlayers([]);
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
    
    try {
      const success = await AuctionService.startAuction();
      
      if (success) {
        setAuctionStatus('live');
        setShowNameInput(false);
        setAuctionName('');
      } else {
        setError('Failed to start auction. Check browser console for details.');
      }
    } catch (err: any) {
      console.error('Exception in handleStartAuction:', err);
      setError(`Error: ${err.message || 'Unknown error'}`);
    } finally {
      setLoading(false);
    }
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
    const confirmed = await confirm(
      'Are you sure you want to reset the auction to Not Started? This will clear all current auction data.',
      'Reset Auction'
    );
    
    if (!confirmed) return;
    
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

    const poolPlayer = poolPlayers.find(p => p.id === selectedPlayerId);
    if (!poolPlayer) {
      setError('Player not found in pool');
      setLoading(false);
      return;
    }

    // Use player data from pool with base_price
    const playerData = {
      ...poolPlayer.player_data,
      basePrice: poolPlayer.base_price || 0 // Use base_price from auction_pool
    };

    const success = await AuctionService.setCurrentPlayer(poolPlayer.player_id, playerData);
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
      <ModalComponent />
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
              {poolPlayers
                .filter((poolPlayer) => {
                  // Remove sold players completely
                  const isSold = soldPlayers.some(sp => sp.player_id === poolPlayer.player_id);
                  return !isSold;
                })
                .map((poolPlayer) => {
                  const player = poolPlayer.player_data;
                  return (
                    <option 
                      key={poolPlayer.id} 
                      value={poolPlayer.id}
                    >
                      {player?.nickname || 'Unknown'} - {player?.currentMMR || 'Unranked'} MMR - Base: {poolPlayer.base_price} gold
                    </option>
                  );
                })}
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

      {/* Data Management Section */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-gradient-to-br from-red-900/40 to-rose-900/40 backdrop-blur-xl border border-red-500/30 rounded-2xl p-6 shadow-2xl"
      >
        <div className="flex items-center gap-3 mb-6">
          <div className="w-12 h-12 bg-gradient-to-br from-red-500 to-rose-600 rounded-xl flex items-center justify-center shadow-lg">
            <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
            </svg>
          </div>
          <div>
            <h3 className="text-xl font-bold text-white">Data Management</h3>
            <p className="text-sm text-gray-400">Delete auction data selectively</p>
          </div>
        </div>

        <div className="bg-yellow-500/10 border border-yellow-500/30 rounded-lg p-3 mb-4">
          <p className="text-yellow-300 text-xs">
            ⚠️ Warning: These actions cannot be undone. Please be careful when deleting data.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          {/* Delete All Data */}
          <button
            onClick={async () => {
              const confirmed = await confirm(
                '⚠️ DELETE ALL DATA?\n\nThis will permanently delete:\n• All captains\n• All bids\n• All results\n• Auction pool (all players)\n• Auction state\n\nThis action CANNOT be undone!\n\nAre you absolutely sure?',
                'Delete All Data'
              );
              
              if (!confirmed) return;
              
              setLoading(true);
              setError(null);
              const success = await AuctionService.deleteAllAuctionData();
              if (success) {
                await alert('All auction data deleted successfully', 'Success', 'success');
                await loadAuctionState();
              } else {
                setError('Failed to delete all data');
              }
              setLoading(false);
            }}
            disabled={loading}
            className="col-span-1 md:col-span-2 flex items-center justify-center gap-2 px-4 py-3 bg-gradient-to-r from-red-600 to-rose-600 hover:from-red-500 hover:to-rose-500 disabled:from-gray-600 disabled:to-gray-700 text-white font-semibold rounded-xl transition-all duration-300 shadow-lg"
          >
            {loading ? <Loader2 className="w-5 h-5 animate-spin" /> : (
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
              </svg>
            )}
            Delete All Data
          </button>

          {/* Archive & Delete All Data */}
          <button
            onClick={async () => {
              const confirmed = await confirm(
                '📦 ARCHIVE & DELETE?\n\nThis will:\n1. Save current auction to history\n2. Delete all current data\n\nYou can view archived data in Auction History.\n\nContinue?',
                'Archive & Delete'
              );
              
              if (!confirmed) return;
              
              setLoading(true);
              setError(null);
              
              // Archive first
              const auctionState = await AuctionService.getAuctionState();
              const auctionName = auctionState?.id ? `Auction ${new Date().toLocaleDateString()}` : 'Unnamed Auction';
              const archived = await AuctionHistoryService.archiveCurrentAuction(
                auctionName,
                'Current Season',
                'admin'
              );
              
              if (!archived) {
                await alert('Failed to archive auction. Deletion cancelled.', 'Error', 'warning');
                setLoading(false);
                return;
              }
              
              // Then delete
              const success = await AuctionService.deleteAllAuctionData();
              if (success) {
                await alert('Auction archived and data deleted successfully', 'Success', 'success');
                await loadAuctionState();
              } else {
                await alert('Archived successfully but failed to delete data', 'Warning', 'warning');
              }
              setLoading(false);
            }}
            disabled={loading}
            className="col-span-1 md:col-span-2 flex items-center justify-center gap-2 px-4 py-3 bg-gradient-to-r from-orange-600 to-amber-600 hover:from-orange-500 hover:to-amber-500 disabled:from-gray-600 disabled:to-gray-700 text-white font-semibold rounded-xl transition-all duration-300 shadow-lg"
          >
            {loading ? <Loader2 className="w-5 h-5 animate-spin" /> : <Archive className="w-5 h-5" />}
            Archive & Delete All
          </button>

          {/* Delete Captains */}
          <button
            onClick={async () => {
              const confirmed = await confirm(
                'Delete all captains?\n\nThis will remove all captain assignments and budgets.\n\nContinue?',
                'Delete Captains'
              );
              
              if (!confirmed) return;
              
              setLoading(true);
              setError(null);
              const success = await AuctionService.deleteCaptains();
              if (success) {
                await alert('Captains deleted successfully', 'Success', 'success');
              } else {
                setError('Failed to delete captains');
              }
              setLoading(false);
            }}
            disabled={loading}
            className="flex items-center justify-center gap-2 px-4 py-2 bg-orange-600/80 hover:bg-orange-600 disabled:bg-gray-600 text-white font-semibold rounded-lg transition-all duration-300"
          >
            {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : '👥'}
            Delete Captains
          </button>

          {/* Delete Bids */}
          <button
            onClick={async () => {
              const confirmed = await confirm(
                'Delete all bids?\n\nThis will remove all bid history.\n\nContinue?',
                'Delete Bids'
              );
              
              if (!confirmed) return;
              
              setLoading(true);
              setError(null);
              const success = await AuctionService.deleteBids();
              if (success) {
                await alert('Bids deleted successfully', 'Success', 'success');
              } else {
                setError('Failed to delete bids');
              }
              setLoading(false);
            }}
            disabled={loading}
            className="flex items-center justify-center gap-2 px-4 py-2 bg-yellow-600/80 hover:bg-yellow-600 disabled:bg-gray-600 text-white font-semibold rounded-lg transition-all duration-300"
          >
            {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : '🪙'}
            Delete Bids
          </button>

          {/* Delete Results */}
          <button
            onClick={async () => {
              const confirmed = await confirm(
                'Delete all results?\n\nThis will remove all sold player records.\n\nContinue?',
                'Delete Results'
              );
              
              if (!confirmed) return;
              
              setLoading(true);
              setError(null);
              const success = await AuctionService.deleteResults();
              if (success) {
                await alert('Results deleted successfully', 'Success', 'success');
              } else {
                setError('Failed to delete results');
              }
              setLoading(false);
            }}
            disabled={loading}
            className="flex items-center justify-center gap-2 px-4 py-2 bg-green-600/80 hover:bg-green-600 disabled:bg-gray-600 text-white font-semibold rounded-lg transition-all duration-300"
          >
            {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : '📋'}
            Delete Results
          </button>

          {/* Delete Auction State */}
          <button
            onClick={async () => {
              const confirmed = await confirm(
                'Delete auction state?\n\nThis will remove the current auction status and player.\n\nContinue?',
                'Delete Auction State'
              );
              
              if (!confirmed) return;
              
              setLoading(true);
              setError(null);
              const success = await AuctionService.deleteAuctionState();
              if (success) {
                await alert('Auction state deleted successfully', 'Success', 'success');
                await loadAuctionState();
              } else {
                setError('Failed to delete auction state');
              }
              setLoading(false);
            }}
            disabled={loading}
            className="flex items-center justify-center gap-2 px-4 py-2 bg-purple-600/80 hover:bg-purple-600 disabled:bg-gray-600 text-white font-semibold rounded-lg transition-all duration-300"
          >
            {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : '⚙️'}
            Delete Auction State
          </button>

          {/* Delete Auction Pool */}
          <button
            onClick={async () => {
              const confirmed = await confirm(
                'Delete auction pool?\n\nThis will remove all players from the auction pool.\n\nContinue?',
                'Delete Auction Pool'
              );
              
              if (!confirmed) return;
              
              setLoading(true);
              setError(null);
              const success = await AuctionService.deleteAuctionPool();
              if (success) {
                await alert('Auction pool deleted successfully', 'Success', 'success');
                await loadPoolPlayers();
              } else {
                setError('Failed to delete auction pool');
              }
              setLoading(false);
            }}
            disabled={loading}
            className="flex items-center justify-center gap-2 px-4 py-2 bg-blue-600/80 hover:bg-blue-600 disabled:bg-gray-600 text-white font-semibold rounded-lg transition-all duration-300"
          >
            {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : '🎯'}
            Delete Auction Pool
          </button>
        </div>

        <div className="mt-4 bg-red-500/10 border border-red-500/30 rounded-lg p-3">
          <p className="text-red-300 text-xs">
            <strong>Note:</strong> Individual deletions do not affect other tables. Use "Delete All Data" to clear everything at once.
          </p>
        </div>
      </motion.div>
    </div>
  );
};


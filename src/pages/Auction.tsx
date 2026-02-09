import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Gavel } from "lucide-react";
import { AuctionGavel } from "../components/ui/AuctionGavel";
import { Avatar } from "../components/ui/Avatar";
import { AuctionService } from "../services/auctionService";
import captainService from "../services/captainService";
import type { AuctionState } from "../services/auctionService";
import { AuthService } from "../services/auth";
import { supabase } from "../lib/supabase";

export default function Auction() {
  const [auctionState, setAuctionState] = useState<AuctionState | null>(null);
  const [bidHistory, setBidHistory] = useState<any[]>([]);
  const [bidAmount, setBidAmount] = useState('');
  const [currentCaptainSession, setCurrentCaptainSession] = useState<any>(null);
  const [captains, setCaptains] = useState<any[]>([]);
  const [bidError, setBidError] = useState<string>('');
  const [adminSession, setAdminSession] = useState<any>(null);
  const [showConfirmModal, setShowConfirmModal] = useState(false);
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const [successMessage, setSuccessMessage] = useState('');

  const [soldPlayers, setSoldPlayers] = useState<any[]>([]);

  useEffect(() => {
    // Load initial data
    loadCaptains();
    loadAuctionState();
    loadSoldPlayers();
    
    // Check for captain session
    const playerSession = AuthService.getCurrentPlayerSession();
    if (playerSession) {
      setCurrentCaptainSession(playerSession);
    }

    // Check for admin session
    const admin = AuthService.getCurrentAdminSession();
    if (admin) {
      setAdminSession(admin);
    }

    // Subscribe to auction state changes
    const stateSubscription = AuctionService.subscribeToAuctionState((state) => {
      setAuctionState(state);
      
      if (state.id) {
        loadBidHistory(state.id);
      }
    });

    // Subscribe to new bids
    const bidSubscription = AuctionService.subscribeToBids((bid) => {
      setBidHistory(prev => [bid, ...prev]);
    });

    // Subscribe to captain changes
    const captainSubscription = captainService.subscribeToCaptains(() => {
      loadCaptains();
    });

    // Subscribe to sold players (auction_results) changes
    const soldPlayersChannel = supabase
      .channel('auction-results-changes')
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
      .subscribe((status, err) => {
        if (status === 'SUBSCRIBED') {
          console.log('✅ Subscribed to sold players changes');
        }
        if (status === 'CHANNEL_ERROR') {
          console.error('❌ Sold players subscription error:', err);
        }
      });

    // Fallback: Poll for updates every 2 seconds as backup
    const pollInterval = setInterval(() => {
      loadAuctionState();
    }, 2000);

    return () => {
      stateSubscription.unsubscribe();
      bidSubscription.unsubscribe();
      captainSubscription.unsubscribe();
      supabase.removeChannel(soldPlayersChannel);
      clearInterval(pollInterval);
    };
  }, []);

  // Reset bid history when current player changes
  useEffect(() => {
    if (auctionState?.current_player_id) {
      setBidHistory([]);
      if (auctionState.id) {
        loadBidHistory(auctionState.id);
      }
    }
  }, [auctionState?.current_player_id]);

  const loadSoldPlayers = async () => {
    try {
      const state = await AuctionService.getAuctionState();
      if (!state) return;

      const { data, error } = await supabase
        .from('auction_results')
        .select('*')
        .eq('auction_id', state.id)
        .order('sold_at', { ascending: false });

      if (!error && data) {
        setSoldPlayers(data.map((item: any) => ({
          id: item.id,
          playerId: item.player_id,
          playerNickname: item.player_data?.nickname || 'Unknown',
          playerData: item.player_data,
          soldTo: item.sold_to_captain_name,
          soldToCaptainId: item.sold_to_captain_id,
          teamName: item.sold_to_team_name,
          soldFor: item.final_price,
          soldAt: item.sold_at,
          auctionId: item.auction_id
        })));
      }
    } catch (error) {
      console.error('Error loading sold players:', error);
    }
  };

  const loadCaptains = async () => {
    const captainsList = await captainService.getCaptains();
    setCaptains(captainsList);
  };

  const loadAuctionState = async () => {
    const state = await AuctionService.getAuctionState();
    setAuctionState(state);
    if (state?.id) {
      loadBidHistory(state.id);
    }
  };

  const loadBidHistory = async (auctionId: string) => {
    const history = await AuctionService.getBidHistory(auctionId);
    setBidHistory(history);
  };

  const handlePlaceBid = async () => {
    if (!currentCaptainSession || !bidAmount || !auctionState) return;

    setBidError('');
    const amount = parseInt(bidAmount);
    
    if (isNaN(amount) || amount <= 0) {
      setBidError('Please enter a valid bid amount');
      return;
    }
    
    // Minimum bid is 1 (no base price)
    if (amount < 1) {
      setBidError('Minimum bid is 1');
      return;
    }

    // Check if captain has enough budget
    // Try both 'id' and 'playerId' fields to find the captain
    const captainId = currentCaptainSession.playerId || currentCaptainSession.id;
    const captain = captains.find(c => c.playerId === captainId);
    
    if (!captain) {
      setBidError('You are not registered as a captain');
      return;
    }
    
    if (captain.budget < amount) {
      setBidError(`Insufficient budget. Available: ${captain.budget}`);
      return;
    }

    const success = await AuctionService.placeBid(
      captainId,
      currentCaptainSession.nickname,
      captain.teamName,
      amount
    );

    if (success) {
      setBidAmount('');
      setBidError('');
    } else {
      // Service rejected the bid because it's not higher than current
      const currentBid = auctionState.highest_bid || 0;
      setBidError(`Your bid must be higher than the current bid of ${currentBid}`);
    }
  };

  const handleSellPlayer = async () => {
    if (!auctionState || !auctionState.highest_bidder_id) {
      return;
    }

    setShowConfirmModal(true);
  };

  const confirmFinalize = async () => {
    if (!auctionState || !auctionState.highest_bidder_id) return;

    setShowConfirmModal(false);

    const playerNickname = auctionState.current_player_data?.nickname || 'Unknown Player';

    // Deduct budget from winning captain
    const winningCaptain = captains.find(c => c.playerId === auctionState.highest_bidder_id);
    if (winningCaptain) {
      const newBudget = winningCaptain.budget - (auctionState.highest_bid || 0);
      await captainService.updateBudget(auctionState.highest_bidder_id, newBudget);
    }

    // Save to auction results in Supabase
    const { error } = await supabase
      .from('auction_results')
      .insert([{
        auction_id: auctionState.id,
        player_id: auctionState.current_player_id,
        player_data: auctionState.current_player_data,
        sold_to_captain_id: auctionState.highest_bidder_id,
        sold_to_captain_name: auctionState.highest_bidder_name,
        sold_to_team_name: auctionState.highest_bidder_team,
        final_price: auctionState.highest_bid
      }]);

    if (error) {
      console.error('Error saving auction result:', error);
    }

    // Clear current player from auction
    await AuctionService.setCurrentPlayer('', null);
    
    // Reload data
    await loadCaptains();
    await loadSoldPlayers();
    
    // Show success modal
    const newBudget = winningCaptain ? winningCaptain.budget - (auctionState.highest_bid || 0) : 0;
    setSuccessMessage(`${playerNickname} assigned to ${auctionState.highest_bidder_team}! Budget updated to ${newBudget}.`);
    setShowSuccessModal(true);
  };

  const status = auctionState?.status || 'not-started';
  const currentPlayer = auctionState?.current_player_data;

  return (
    <>
      {/* Main Content - Full Page */}
      <div className="min-h-screen bg-gradient-to-br from-gray-900 via-black to-gray-900 flex flex-col" style={{ paddingTop: '80px', paddingBottom: '60px' }}>
        <div className="flex-1 flex flex-col px-4 sm:px-6 lg:px-8 py-6" style={{ maxWidth: '100%', minHeight: 0 }}>
          
          {/* Auction Status Display */}
          <div className="w-full flex-1 flex flex-col overflow-hidden">
            <div className="bg-black/80 backdrop-blur-xl flex-1 flex flex-col overflow-hidden rounded-2xl border border-purple-500/20" style={{ boxShadow: 'none', borderBottom: 'none' }}>
              {/* Status Header */}
              <div className="bg-gradient-to-r from-purple-900/50 to-indigo-900/50 px-6 py-3 flex-shrink-0 border-b-2 border-purple-500/40 shadow-[0_0_15px_rgba(168,85,247,0.2)]">
                <div className="flex items-center justify-center gap-3">
                  <div className="w-10 h-10 bg-gradient-to-br from-purple-500 to-indigo-600 rounded-lg flex items-center justify-center flex-shrink-0">
                    <Gavel className="w-5 h-5 text-white" />
                  </div>
                  <h2 className="text-xl font-bold text-white">Auction Status</h2>
                  <div className="flex items-center gap-2 ml-4">
                    <div className={`w-2.5 h-2.5 rounded-full flex-shrink-0 ${
                      status === 'live' || status === 'paused' ? 'bg-green-400 animate-pulse' :
                      status === 'completed' ? 'bg-gray-400' :
                      'bg-purple-400'
                    }`} />
                    <span className={`text-sm font-semibold px-3 py-1.5 rounded-full whitespace-nowrap ${
                      status === 'live' || status === 'paused' 
                        ? 'bg-green-500/20 text-green-300 border border-green-500/30' :
                      status === 'completed' 
                        ? 'bg-gray-500/20 text-gray-300 border border-gray-500/30' :
                        'bg-purple-500/20 text-purple-300 border border-purple-500/30'
                    }`}>
                      {status === 'live' || status === 'paused' ? 'Ongoing' :
                       status === 'completed' ? 'Finished' :
                       'Not Started'}
                    </span>
                  </div>
                </div>
              </div>

              {/* Main Display Area */}
              <div className="p-4 sm:p-6 overflow-hidden flex-1 flex flex-col" style={{ minHeight: '0' }}>
                {status === 'not-started' && (
                  <div className="flex items-center justify-center h-full">
                    <motion.div
                      initial={{ opacity: 0, scale: 0.9 }}
                      animate={{ opacity: 1, scale: 1 }}
                      className="text-center"
                    >
                      <AuctionGavel show={true} />
                      <p className="text-gray-400 text-lg max-w-md mx-auto mt-8">
                        The auction will begin shortly. Stay tuned!
                      </p>
                    </motion.div>
                  </div>
                )}

                {(status === 'live' || status === 'paused') && currentPlayer && (
                  <>
                  {/* New 4-Section Layout - Full Height with Fixed Heights */}
                  <div className="grid grid-cols-1 lg:grid-cols-[280px_1.2fr_380px_280px] gap-3 overflow-hidden" style={{ height: 'calc(100vh - 240px)' }}>
                    
                    {/* Section 1: Top Bids - Scrollable with Neon Glow */}
                    <div className="bg-black/40 backdrop-blur-sm rounded-xl p-3 border-2 border-yellow-500/60 flex flex-col overflow-hidden shadow-[0_0_20px_rgba(234,179,8,0.3)]">
                      <h3 className="text-white font-bold mb-2 text-sm text-center flex-shrink-0">Top Bids</h3>
                      <div className="flex-1 overflow-y-auto custom-standings-scroll pr-1 space-y-2" style={{ minHeight: '0' }}>
                        {bidHistory.length === 0 ? (
                          <div className="text-gray-400 text-xs text-center py-8">
                            No bids yet
                          </div>
                        ) : (
                          bidHistory.slice(0, 5).map((bid, index) => (
                            <motion.div
                              key={bid.id}
                              initial={{ opacity: 0, scale: 0.9 }}
                              animate={{ opacity: 1, scale: 1 }}
                              transition={{ delay: index * 0.1 }}
                              className={`relative rounded-lg p-2 border ${
                                index === 0 
                                  ? 'bg-gradient-to-br from-yellow-900/50 to-orange-900/50 border-yellow-500/70' 
                                  : 'bg-gradient-to-br from-gray-900/50 to-gray-800/50 border-gray-600/50'
                              }`}
                            >
                              <div className="relative z-10">
                                <div className="flex items-center justify-center mb-1">
                                  {index === 0 && <span className="text-sm mr-1">👑</span>}
                                  <span className={`text-lg font-bold ${
                                    index === 0 ? 'text-yellow-300' : 'text-gray-300'
                                  }`}>
                                    🪙 {bid.amount}
                                  </span>
                                </div>
                                <div className="text-center">
                                  <p className={`text-xs font-bold truncate ${
                                    index === 0 ? 'text-yellow-400' : 'text-gray-400'
                                  }`}>
                                    {bid.captain_name}
                                  </p>
                                  <p className={`text-xs truncate ${
                                    index === 0 ? 'text-orange-400' : 'text-gray-500'
                                  }`}>
                                    {bid.team_name}
                                  </p>
                                </div>
                              </div>
                            </motion.div>
                          ))
                        )}
                      </div>
                    </div>

                    {/* Center: Current Player - Scrollable with Neon Glow */}
                    <div className="bg-gradient-to-br from-yellow-900/40 to-orange-900/40 backdrop-blur-sm rounded-xl p-3 border-2 border-yellow-500/70 shadow-[0_0_30px_rgba(234,179,8,0.4)] flex flex-col relative overflow-hidden">
                      {/* Animated background glow */}
                      <motion.div
                        className="absolute inset-0 bg-gradient-to-br from-yellow-500/10 to-orange-500/10"
                        animate={{
                          opacity: [0.3, 0.6, 0.3],
                        }}
                        transition={{
                          duration: 3,
                          repeat: Infinity,
                          ease: "easeInOut"
                        }}
                      />
                      
                      <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="relative z-10 flex-1 flex flex-col overflow-y-auto custom-standings-scroll pr-1"
                        style={{ minHeight: '0' }}
                      >
                        {/* Player Header with MMR on sides */}
                        <div className="flex items-center justify-between gap-3 mb-3">
                          {/* Left: Current MMR */}
                          <div className="bg-gradient-to-br from-cyan-900/40 to-blue-900/40 border border-cyan-500/50 rounded-lg p-1.5 flex-shrink-0 w-24">
                            <p className="text-cyan-400 text-[0.6rem] font-bold mb-0.5 text-center">CURRENT</p>
                            <div className="flex flex-col items-center gap-0.5">
                              {currentPlayer.currentMedalLabel && (
                                <div className="relative group">
                                  <img 
                                    src={`/medals/${currentPlayer.currentMedalLabel.replace(' ', '_')}.png`}
                                    alt={currentPlayer.currentMedalLabel}
                                    className="w-6 h-6 object-contain cursor-pointer"
                                    onError={(e) => {
                                      e.currentTarget.style.display = 'none';
                                    }}
                                  />
                                  <span className="pointer-events-none absolute -bottom-8 left-1/2 -translate-x-1/2 px-2 py-1 rounded-lg bg-black/90 border border-cyan-500/60 text-[0.65rem] text-cyan-200 opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap z-20">
                                    {currentPlayer.currentMedalLabel}
                                  </span>
                                </div>
                              )}
                              <p className="text-cyan-300 text-xs font-bold">{currentPlayer.currentMMR || 'N/A'}</p>
                            </div>
                          </div>

                          {/* Center: Avatar + Name + Badges */}
                          <div className="flex flex-col items-center gap-2 flex-1 min-w-0">
                            {/* Avatar */}
                            <div className="relative flex-shrink-0">
                              <Avatar
                                src={currentPlayer.avatarUrl}
                                alt={currentPlayer.nickname}
                                name={currentPlayer.nickname}
                                size="lg"
                                className="border-3 border-yellow-400 shadow-xl shadow-yellow-500/50"
                              />
                            </div>
                            
                            {/* Name and Star Badge */}
                            <div className="flex items-center gap-2">
                              <h3 className="text-2xl font-bold text-white drop-shadow-lg">{currentPlayer.nickname}</h3>
                              
                              {/* Website Contributor Star Badge */}
                              {(currentPlayer.specialBadge === 'contributor' || currentPlayer.isContributor) && (
                                <motion.div
                                  initial={{ scale: 0, rotate: -180 }}
                                  animate={{ scale: 1, rotate: 0 }}
                                  transition={{ delay: 0.3, type: "spring", stiffness: 200 }}
                                  className="relative flex-shrink-0 group"
                                >
                                  <motion.div
                                    animate={{ 
                                      rotate: [0, 360],
                                      scale: [1, 1.3, 1]
                                    }}
                                    transition={{ 
                                      duration: 4,
                                      repeat: Infinity,
                                      ease: "easeInOut"
                                    }}
                                    className="text-2xl cursor-pointer relative z-10 drop-shadow-[0_0_8px_rgba(251,191,36,0.8)]"
                                  >
                                    ⭐
                                  </motion.div>
                                  <span className="pointer-events-none absolute -bottom-14 left-1/2 -translate-x-1/2 px-3 py-2 rounded-lg bg-gradient-to-br from-amber-900/95 to-yellow-900/95 border-2 border-yellow-400/60 text-[0.7rem] text-yellow-100 font-medium opacity-0 group-hover:opacity-100 transition-opacity duration-300 whitespace-nowrap z-20 shadow-[0_0_20px_rgba(251,191,36,0.4)]">
                                    ✨ Website Contributor ✨
                                  </span>
                                </motion.div>
                              )}
                            </div>
                            
                            {/* Role Preferences - Icons only with tooltip */}
                            {currentPlayer.roles && currentPlayer.roles.length > 0 && (
                              <div className="flex items-center gap-2">
                                {currentPlayer.roles.map((role: any, idx: number) => (
                                  <div key={idx} className="relative group">
                                    <img
                                      src={role.iconSrc}
                                      alt={role.label}
                                      className="w-6 h-6 object-contain cursor-pointer"
                                    />
                                    <span className="pointer-events-none absolute -bottom-8 left-1/2 -translate-x-1/2 px-2 py-1 rounded-lg bg-black/90 border border-cyan-500/60 text-[0.65rem] text-cyan-200 opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap z-20">
                                      {role.label}
                                    </span>
                                  </div>
                                ))}
                              </div>
                            )}

                            {/* Dotabuff Icon */}
                            {currentPlayer.dotabuffUrl && (
                              <a
                                href={currentPlayer.dotabuffUrl}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="flex items-center justify-center w-8 h-8 bg-red-600/90 hover:bg-red-600 border border-red-500 rounded-md transition-all duration-300 hover:scale-110 cursor-pointer"
                                title="View Dotabuff Profile"
                              >
                                <img 
                                  src="/icons/dotabuff.png" 
                                  alt="Dotabuff" 
                                  className="w-5 h-5"
                                />
                              </a>
                            )}
                          </div>

                          {/* Right: Peak MMR */}
                          <div className="bg-gradient-to-br from-purple-900/40 to-pink-900/40 border border-purple-500/50 rounded-lg p-1.5 flex-shrink-0 w-24">
                            <p className="text-purple-400 text-[0.6rem] font-bold mb-0.5 text-center">PEAK</p>
                            <div className="flex flex-col items-center gap-0.5">
                              {currentPlayer.peakMedalLabel && (
                                <div className="relative group">
                                  <img 
                                    src={`/medals/${currentPlayer.peakMedalLabel.replace(' ', '_')}.png`}
                                    alt={currentPlayer.peakMedalLabel}
                                    className="w-6 h-6 object-contain cursor-pointer"
                                    onError={(e) => {
                                      e.currentTarget.style.display = 'none';
                                    }}
                                  />
                                  <span className="pointer-events-none absolute -bottom-8 left-1/2 -translate-x-1/2 px-2 py-1 rounded-lg bg-black/90 border border-purple-500/60 text-[0.65rem] text-purple-200 opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap z-20">
                                    {currentPlayer.peakMedalLabel}
                                  </span>
                                </div>
                              )}
                              <p className="text-purple-300 text-xs font-bold">{currentPlayer.peakMMR || 'N/A'}</p>
                            </div>
                          </div>
                        </div>

                        {/* Seasons Played - Left Side */}
                        {currentPlayer.seasonBadges && currentPlayer.seasonBadges.length > 0 && (
                          <div className="mb-2 bg-gradient-to-br from-purple-900/30 to-indigo-900/30 rounded-lg p-2 border border-purple-500/40">
                            <div className="flex items-center justify-center gap-2 flex-wrap">
                              {currentPlayer.seasonBadges.map((badge: any, idx: number) => {
                                const seasonNum = typeof badge === 'string' ? parseInt(badge.replace('s', '')) : badge;
                                const seasonStyles: Record<number, string> = {
                                  1: "bg-gradient-to-br from-cyan-400 via-blue-500 to-indigo-600 border border-cyan-300/50",
                                  2: "bg-gradient-to-br from-emerald-400 via-green-500 to-teal-600 border border-emerald-300/50",
                                  3: "bg-gradient-to-br from-fuchsia-400 via-purple-500 to-violet-600 border border-fuchsia-300/50",
                                  4: "bg-gradient-to-br from-rose-400 via-pink-500 to-red-600 border border-rose-300/50",
                                  5: "bg-gradient-to-br from-amber-400 via-orange-500 to-yellow-600 border border-amber-300/50",
                                };
                                
                                return (
                                  <div 
                                    key={idx}
                                    className={`flex items-center justify-center w-8 h-8 rounded-full transition-all duration-300 cursor-pointer hover:scale-110 ${
                                      seasonStyles[seasonNum] || seasonStyles[1]
                                    }`}
                                    title={`Season ${seasonNum}`}
                                  >
                                    <span className="text-white text-[0.65rem] font-bold">S{seasonNum}</span>
                                  </div>
                                );
                              })}
                            </div>
                          </div>
                        )}

                        {/* Trophy Cabinet - Only if player has won */}
                        {currentPlayer.hasWonCup && (
                          <div className="mb-2">
                            <motion.div
                              initial={{ opacity: 0, y: 10 }}
                              animate={{ opacity: 1, y: 0 }}
                              transition={{ delay: 0.6 }}
                              whileHover={{ scale: 1.05 }}
                              className={`flex items-center justify-center gap-1.5 px-3 py-1.5 rounded-lg border transition-all duration-300 cursor-pointer ${
                                currentPlayer.cupRank === 'gold' ? 'bg-gradient-to-br from-yellow-900/30 to-amber-900/30 border-yellow-400' :
                                currentPlayer.cupRank === 'silver' ? 'bg-gradient-to-br from-gray-800/30 to-gray-700/30 border-gray-400' :
                                currentPlayer.cupRank === 'bronze' ? 'bg-gradient-to-br from-orange-900/30 to-amber-900/30 border-orange-400' :
                                'bg-gradient-to-br from-yellow-900/30 to-amber-900/30 border-yellow-400'
                              }`}
                              title={currentPlayer.cupTooltip || `Season ${currentPlayer.cupSeason || ''} Champion`}
                            >
                              <span className="text-base">
                                {currentPlayer.cupRank === 'gold' && '🏆'}
                                {currentPlayer.cupRank === 'silver' && '🥈'}
                                {currentPlayer.cupRank === 'bronze' && '🥉'}
                                {!currentPlayer.cupRank && '🏆'}
                              </span>
                              <span className="text-white font-bold text-sm">Season {currentPlayer.cupSeason || '?'} Champion</span>
                            </motion.div>
                          </div>
                        )}

                        {/* Bid Info - Only Current Bid and Highest Bidder */}
                        <div className="bg-black/50 rounded-lg p-2 border border-yellow-500/40 shadow-lg mb-2">
                          {/* Current Bid */}
                          <div className="text-center mb-2">
                            <p className="text-gray-400 text-[0.65rem] mb-1">Current Bid</p>
                            <motion.p 
                              className="text-2xl font-bold text-green-400"
                              animate={{ 
                                scale: (auctionState.highest_bid || 0) > 0 ? [1, 1.1, 1] : 1
                              }}
                              transition={{ 
                                duration: 0.5,
                              }}
                            >
                              🪙 {auctionState.highest_bid || 0}
                            </motion.p>
                          </div>
                          
                          {/* Highest Bidder */}
                          {auctionState.highest_bidder_name ? (
                            <div className="pt-2 border-t border-yellow-500/30">
                              <p className="text-gray-400 text-[0.65rem] mb-1 text-center">Highest Bidder</p>
                              <div className="flex items-center justify-center gap-1.5">
                                <Avatar
                                  src=""
                                  alt={auctionState.highest_bidder_name}
                                  name={auctionState.highest_bidder_name}
                                  size="sm"
                                  className="border border-green-400"
                                />
                                <div>
                                  <p className="text-white font-semibold text-[0.65rem]">{auctionState.highest_bidder_name}</p>
                                  <p className="text-green-400 text-[0.65rem]">{auctionState.highest_bidder_team}</p>
                                </div>
                              </div>
                            </div>
                          ) : (
                            <div className="pt-2 border-t border-yellow-500/30">
                              <p className="text-gray-500 text-[0.65rem] text-center italic">No bids yet</p>
                            </div>
                          )}
                        </div>

                        {/* Notes for Captain - More Compact */}
                        <div className="mb-2 bg-gradient-to-br from-indigo-900/30 to-purple-900/30 rounded-lg p-1.5 border border-indigo-500/40">
                          <p className="text-indigo-400 text-[0.65rem] font-semibold mb-0.5">Notes for Captain</p>
                          {currentPlayer.bio ? (
                            <p className="text-gray-300 text-[0.65rem] leading-relaxed line-clamp-2">
                              {currentPlayer.bio}
                            </p>
                          ) : (
                            <p className="text-gray-500 text-[0.65rem] italic">
                              No notes available
                            </p>
                          )}
                        </div>

                        {status === 'paused' && (
                          <motion.div 
                            className="bg-yellow-500/20 border border-yellow-500/50 rounded-lg p-1.5 text-center mb-2"
                            animate={{ opacity: [0.7, 1, 0.7] }}
                            transition={{ duration: 1.5, repeat: Infinity }}
                          >
                            <p className="text-yellow-300 text-xs font-semibold">⏸️ Auction Paused</p>
                          </motion.div>
                        )}

                        {/* Admin Finalize/Assign Button - Always enabled */}
                        {(adminSession || AuthService.isAdminLoggedIn()) && (
                          <motion.div 
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.3 }}
                          >
                            <button
                              onClick={handleSellPlayer}
                              className="w-full px-3 py-2 bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-500 hover:to-emerald-500 text-white text-sm font-bold rounded-lg transition-all duration-300 shadow-lg hover:shadow-green-500/50 flex items-center justify-center gap-2"
                            >
                              <span className="text-base">🎯</span>
                              <span>Assign to Team</span>
                            </button>
                            {!auctionState?.highest_bidder_id && (
                              <p className="text-gray-400 text-xs mt-1 text-center">No bids - Select team to assign manually</p>
                            )}
                          </motion.div>
                        )}
                      </motion.div>
                    </div>

                    {/* Section 3: Teams Overview - Table Format - Scrollable with Neon Glow */}
                    <div className="bg-black/40 backdrop-blur-sm rounded-xl p-3 border-2 border-blue-500/60 flex flex-col overflow-hidden shadow-[0_0_20px_rgba(59,130,246,0.3)]">
                      <h3 className="text-white font-bold mb-2 text-sm text-center flex-shrink-0">Teams Overview</h3>
                      
                      {captains.length === 0 ? (
                        <div className="text-gray-400 text-xs text-center py-8">
                          No teams yet
                        </div>
                      ) : (
                        <div className="flex-1 overflow-y-auto custom-standings-scroll" style={{ minHeight: '0' }}>
                          <table className="w-full text-xs">
                            <thead className="sticky top-0 bg-gradient-to-r from-blue-900/80 to-indigo-900/80 backdrop-blur-sm z-10">
                              <tr className="border-b border-blue-500/30">
                                <th className="text-left py-2 px-2 text-blue-300 font-bold">Team</th>
                                <th className="text-center py-2 px-1 text-amber-300 font-bold text-[0.65rem]">Total Gold</th>
                                <th className="text-center py-2 px-1 text-yellow-300 font-bold text-[0.65rem]">Gold Left</th>
                                <th className="text-center py-2 px-1 text-green-300 font-bold">Players</th>
                              </tr>
                            </thead>
                            <tbody>
                              {captains.map((captain, index) => {
                                // Get team players count from auction results
                                const teamPlayersCount = soldPlayers.filter(
                                  p => p.soldToCaptainId === captain.playerId
                                ).length;
                                const playerCount = teamPlayersCount + 1; // +1 for captain
                                
                                // Standard starting budget
                                const startingBudget = 1000;

                                return (
                                  <motion.tr
                                    key={captain.playerId}
                                    initial={{ opacity: 0, x: -20 }}
                                    animate={{ opacity: 1, x: 0 }}
                                    transition={{ delay: index * 0.02 }}
                                    className="border-b border-blue-500/10 hover:bg-blue-900/20 transition-colors"
                                  >
                                    {/* Team Name & Captain */}
                                    <td className="py-2 px-2">
                                      <div className="flex flex-col">
                                        <span className="text-blue-300 font-semibold truncate text-xs">
                                          {captain.teamName}
                                        </span>
                                        <span className="text-gray-400 text-[0.65rem] truncate">
                                          {captain.playerNickname}
                                        </span>
                                      </div>
                                    </td>
                                    
                                    {/* Total Gold */}
                                    <td className="py-2 px-1 text-center">
                                      <span className="text-amber-400 font-bold">
                                        {startingBudget}
                                      </span>
                                    </td>
                                    
                                    {/* Gold Left */}
                                    <td className="py-2 px-1 text-center">
                                      <span className={`font-bold ${
                                        captain.budget > 500 ? 'text-green-400' :
                                        captain.budget > 200 ? 'text-yellow-400' :
                                        'text-red-400'
                                      }`}>
                                        {captain.budget}
                                      </span>
                                    </td>
                                    
                                    {/* Players with /5 */}
                                    <td className="py-2 px-1 text-center">
                                      <span className={`font-bold ${
                                        playerCount >= 5 ? 'text-green-400' : 'text-cyan-300'
                                      }`}>
                                        {playerCount}/5
                                      </span>
                                    </td>
                                  </motion.tr>
                                );
                              })}
                            </tbody>
                          </table>
                        </div>
                      )}
                    </div>

                    {/* Section 4: Sold Players Log - Scrollable with Neon Glow */}
                    <div className="bg-black/40 backdrop-blur-sm rounded-xl p-3 border-2 border-green-500/60 flex flex-col overflow-hidden shadow-[0_0_20px_rgba(34,197,94,0.3)]">
                      <h3 className="text-white font-bold mb-2 text-sm text-center flex-shrink-0">Assignment Logs</h3>
                      
                      {/* Sold Players List */}
                      <div className="flex-1 overflow-y-auto custom-standings-scroll pr-1 space-y-2" style={{ minHeight: '0' }}>
                        {soldPlayers.length === 0 ? (
                          <div className="text-gray-400 text-xs text-center py-8">
                            No players sold yet
                          </div>
                        ) : (
                          soldPlayers.map((sold, index) => (
                            <motion.div
                              key={sold.id}
                              initial={{ opacity: 0, scale: 0.9 }}
                              animate={{ opacity: 1, scale: 1 }}
                              transition={{ delay: index * 0.05 }}
                              className="bg-gradient-to-br from-green-900/30 to-emerald-900/30 border-2 border-green-500/50 rounded-lg p-2.5 shadow-lg"
                            >
                              {/* Player Info */}
                              <div className="flex items-center gap-2 mb-2">
                                <Avatar
                                  src={sold.playerData?.avatarUrl || ''}
                                  alt={sold.playerNickname || 'Unknown Player'}
                                  name={sold.playerNickname || 'Unknown Player'}
                                  size="sm"
                                  className="border-2 border-green-400"
                                />
                                <div className="flex-1 min-w-0">
                                  <p className="text-white font-bold text-xs truncate">
                                    {sold.playerNickname || 'Unknown Player'}
                                  </p>
                                  <p className="text-green-300 text-xs truncate">
                                    🪙 {sold.soldFor || 0}
                                  </p>
                                </div>
                              </div>

                              {/* Buyer Info */}
                              <div className="bg-black/30 rounded-lg p-2 border border-green-500/30">
                                <div className="text-xs mb-1 text-center">
                                  <span className="text-gray-400 block mb-1">Will play in team</span>
                                  <span className="text-emerald-300 font-semibold">
                                    {sold.teamName || 'Unknown Team'}
                                  </span>
                                </div>
                              </div>

                              {/* Timestamp */}
                              <div className="mt-1.5 text-center">
                                <span className="text-gray-500 text-xs">
                                  {new Date(sold.soldAt).toLocaleTimeString()}
                                </span>
                              </div>
                            </motion.div>
                          ))
                        )}
                      </div>
                    </div>
                  </div>

                  {currentCaptainSession && (
                    <motion.div 
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="mt-4 bg-gradient-to-br from-yellow-900/40 to-orange-900/40 backdrop-blur-sm rounded-xl p-4 border-2 border-yellow-500/50 shadow-xl"
                    >
                      {/* Captain Bid Section - Below the three columns */}
                      <h3 className="text-white font-bold mb-3 text-center text-sm">
                        💰 Place Your Bid
                      </h3>
                      
                      {/* Bid Input */}
                      <div className="max-w-md mx-auto">
                        <div className="flex gap-2">
                          <input
                            type="text"
                            inputMode="numeric"
                            pattern="[0-9]*"
                            value={bidAmount}
                            onChange={(e) => {
                              const value = e.target.value.replace(/[^0-9]/g, '');
                              setBidAmount(value);
                              setBidError('');
                            }}
                            placeholder="Enter bid amount"
                            className="flex-1 px-4 py-2.5 bg-black/60 border border-yellow-500/40 rounded-lg text-white text-sm font-bold placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-yellow-500 [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
                          />
                          <button
                            onClick={handlePlaceBid}
                            disabled={!bidAmount || status === 'paused'}
                            className="px-6 py-2.5 bg-gradient-to-r from-yellow-600 to-orange-600 hover:from-yellow-500 hover:to-orange-500 disabled:from-gray-600 disabled:to-gray-700 text-white font-bold rounded-lg transition-all duration-300 flex items-center justify-center gap-2 shadow-lg flex-shrink-0"
                          >
                            <span className="text-base">🪙</span>
                            <span className="text-sm">PLACE BID</span>
                          </button>
                        </div>
                        {bidError && (
                          <p className="text-red-400 text-xs mt-2 font-semibold text-center">⚠️ {bidError}</p>
                        )}
                        {status === 'paused' && (
                          <p className="text-yellow-400 text-xs mt-2 text-center">⏸️ Bidding paused</p>
                        )}
                      </div>
                    </motion.div>
                  )}
                  </>
                )}

                {status === 'completed' && (
                  <motion.div
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className="text-center"
                  >
                    <motion.div 
                      className="w-20 h-20 bg-gradient-to-br from-green-500/20 to-emerald-500/20 rounded-full flex items-center justify-center mx-auto mb-4 border-4 border-green-500/30"
                      animate={{ 
                        scale: [1, 1.15, 1],
                        rotate: [0, 10, -10, 0]
                      }}
                      transition={{ 
                        duration: 2,
                        repeat: Infinity,
                        ease: "easeInOut"
                      }}
                    >
                      <span className="text-4xl">🏆</span>
                    </motion.div>
                    <h3 className="text-xl font-bold text-white mb-2">Auction Completed!</h3>
                    <p className="text-gray-400 text-sm max-w-md mx-auto">
                      All players have been sold. Check the results below.
                    </p>
                  </motion.div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Confirmation Modal */}
      <AnimatePresence>
        {showConfirmModal && auctionState && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4"
            onClick={() => setShowConfirmModal(false)}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="bg-gradient-to-br from-purple-900/90 to-indigo-900/90 rounded-xl p-6 max-w-md w-full border border-purple-500/40"
              onClick={(e) => e.stopPropagation()}
            >
              <h3 className="text-2xl font-bold text-white mb-4">Finalize Auction?</h3>
              <p className="text-gray-300 text-sm mb-4">
                Assign <span className="text-yellow-400 font-bold">{auctionState.current_player_data?.nickname}</span> to{' '}
                <span className="text-green-400 font-bold">{auctionState.highest_bidder_team}</span> for{' '}
                <span className="text-yellow-400 font-bold">🪙 {auctionState.highest_bid}</span>?
              </p>
              <div className="flex gap-3 mt-6">
                <button
                  onClick={confirmFinalize}
                  className="flex-1 px-4 py-2 bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-500 hover:to-emerald-500 text-white font-semibold rounded-lg transition-all duration-300"
                >
                  Finalize
                </button>
                <button
                  onClick={() => setShowConfirmModal(false)}
                  className="flex-1 px-4 py-2 bg-gray-600 hover:bg-gray-500 text-white font-semibold rounded-lg transition-all duration-300"
                >
                  Cancel
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Success Modal */}
      <AnimatePresence>
        {showSuccessModal && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4"
            onClick={() => setShowSuccessModal(false)}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="bg-gradient-to-br from-green-900/90 to-emerald-900/90 rounded-xl p-6 max-w-md w-full border border-green-500/40"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="text-center">
                <div className="text-6xl mb-4">✅</div>
                <h3 className="text-2xl font-bold text-white mb-4">Success!</h3>
                <p className="text-gray-300 text-sm mb-6">
                  {successMessage}
                </p>
                <button
                  onClick={() => setShowSuccessModal(false)}
                  className="px-6 py-2 bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-500 hover:to-emerald-500 text-white font-semibold rounded-lg transition-all duration-300"
                >
                  Continue
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}

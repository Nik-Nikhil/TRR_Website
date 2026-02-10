import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Link } from "react-router-dom";
import { Gavel } from "lucide-react";
import { AuctionGavel } from "../components/ui/AuctionGavel";
import { Avatar } from "../components/ui/Avatar";
import { AuctionService } from "../services/auctionService";
import captainService from "../services/captainService";
import type { AuctionState } from "../services/auctionService";
import { AuthService } from "../services/auth";
import { supabase } from "../lib/supabase";
import { useModal } from "../hooks/useModal";

export default function Auction() {
  const { confirm, alert, ModalComponent } = useModal();
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
  const [selectedTeamForManualAssign, setSelectedTeamForManualAssign] = useState<string>('');
  const [manualAssignPrice, setManualAssignPrice] = useState<string>('1');

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
    const stateSubscription = AuctionService.subscribeToAuctionState(async (state) => {
      setAuctionState(state);
      
      // When player changes, clear bid history (will be reloaded by the other useEffect)
      if (state.current_player_id !== auctionState?.current_player_id) {
        setBidHistory([]);
      }
      
      // Also reload bid history when auction state changes to ensure sync
      if (state.id) {
        await pollBidsForCurrentAuction(state.id);
      }
    });

    // Subscribe to new bids - using a unique channel name with timestamp
    const bidChannelName = `auction-bids-${Date.now()}`;
    const bidChannel = supabase
      .channel(bidChannelName)
      .on(
        'postgres_changes',
        {
          event: 'INSERT',
          schema: 'public',
          table: 'auction_bids'
        },
        async (payload) => {
          const bid = payload.new as any;
          
          // Get current state to check if bid is for current player
          const currentState = await AuctionService.getAuctionState();
          const currentPlayerId = currentState?.current_player_id;
          const currentPlayerDataId = currentState?.current_player_data?.id;
          
          // Only add bid if it's for the current player
          const isForCurrentPlayer = bid.player_id === currentPlayerId || 
                                     bid.player_id === currentPlayerDataId ||
                                     (currentState?.current_player_data && 
                                      bid.player_id === currentState.current_player_data.id);
          
          if (!isForCurrentPlayer) {
            return;
          }
          
          // Add bid to history
          setBidHistory(prev => {
            // Check if bid already exists to avoid duplicates
            if (prev.some(b => b.id === bid.id)) {
              return prev;
            }
            return [bid, ...prev];
          });
          // Reload auction state to get updated highest bid
          loadAuctionState();
        }
      )
      .subscribe((status, err) => {
        if (status === 'CHANNEL_ERROR') {
          console.error('❌ Bid subscription error:', err);
        }
        if (status === 'TIMED_OUT') {
          console.error('⏱️ Bid subscription timed out');
        }
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
          // Subscribed successfully
        }
        if (status === 'CHANNEL_ERROR') {
          console.error('❌ Sold players subscription error:', err);
        }
      });

    // Fallback: Poll for updates every 2 seconds as backup
    const pollInterval = setInterval(async () => {
      await loadAuctionState();
      await loadCaptains(); // Also poll captains for budget updates
      
      // Poll for bids - get current state
      const currentState = await AuctionService.getAuctionState();
      if (currentState?.id) {
        await pollBidsForCurrentAuction(currentState.id);
      }
    }, 2000);

    return () => {
      stateSubscription.unsubscribe();
      supabase.removeChannel(bidChannel);
      captainSubscription.unsubscribe();
      supabase.removeChannel(soldPlayersChannel);
      clearInterval(pollInterval);
    };
  }, []);

  // Reset bid history when current player changes
  useEffect(() => {
    if (auctionState?.current_player_id) {
      // Clear bid history for new player - bids start fresh for each player
      setBidHistory([]);
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
    // Bids will be populated by the real-time subscription
  };

  const pollBidsForCurrentAuction = async (auctionId: string) => {
    try {
      // Get current auction state to know which player we're showing
      const currentState = await AuctionService.getAuctionState();
      
      // Check if there's a current player (either via current_player_id or current_player_data)
      const hasCurrentPlayer = currentState?.current_player_id || currentState?.current_player_data?.id;
      
      if (!hasCurrentPlayer) {
        // No current player, clear bids
        setBidHistory([]);
        return;
      }

      const { data, error } = await supabase
        .from('auction_bids')
        .select('*')
        .eq('auction_id', auctionId)
        .order('created_at', { ascending: false });

      if (!error && data) {
        // Filter bids to only show those for the current player
        // The player_id in bids might be stored in different formats, so we need to check
        const currentPlayerId = currentState.current_player_id;
        const currentPlayerDataId = currentState.current_player_data?.id;
        
        const filteredBids = data.filter(bid => {
          // Check if bid's player_id matches current player
          return bid.player_id === currentPlayerId || 
                 bid.player_id === currentPlayerDataId ||
                 (currentState.current_player_data && 
                  bid.player_id === currentState.current_player_data.id);
        });

        // Only update if the data is different to avoid unnecessary re-renders
        setBidHistory(prev => {
          if (JSON.stringify(prev) !== JSON.stringify(filteredBids)) {
            return filteredBids;
          }
          return prev;
        });
      }
    } catch (error) {
      console.error('Error polling bids:', error);
    }
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

    // ✅ CHECK IF TEAM IS ALREADY FULL (5 PLAYERS)
    const teamPlayerCount = soldPlayers.filter(p => p.teamName === captain.teamName).length;
    if (teamPlayerCount >= 5) {
      setBidError(`Your team is full (5/5 players). Cannot bid on more players.`);
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
    if (!auctionState) return;

    // If there's a highest bidder, proceed normally
    if (auctionState.highest_bidder_id) {
      setShowConfirmModal(true);
      return;
    }

    // If no bids, check if admin selected a team for manual assignment
    if (!selectedTeamForManualAssign) {
      await alert('Please select a team to assign this player to', 'Selection Required', 'warning');
      return;
    }

    // Validate manual price
    const price = parseInt(manualAssignPrice);
    if (isNaN(price) || price < 1) {
      await alert('Please enter a valid price (minimum 1)', 'Invalid Price', 'warning');
      return;
    }

    // Check if selected team has enough budget
    const selectedCaptain = captains.find(c => c.teamName === selectedTeamForManualAssign);
    if (selectedCaptain && selectedCaptain.budget < price) {
      await alert(`${selectedTeamForManualAssign} doesn't have enough budget. Available: ${selectedCaptain.budget}`, 'Insufficient Budget', 'warning');
      return;
    }

    setShowConfirmModal(true);
  };

  const confirmFinalize = async () => {
    if (!auctionState) return;

    setShowConfirmModal(false);

    const playerNickname = auctionState.current_player_data?.nickname || 'Unknown Player';

    let finalCaptainId: string;
    let finalCaptainName: string;
    let finalTeamName: string;
    let finalPrice: number;

    // Check if there's a highest bidder or manual assignment
    if (auctionState.highest_bidder_id) {
      // Normal auction flow with bids
      finalCaptainId = auctionState.highest_bidder_id;
      finalCaptainName = auctionState.highest_bidder_name || '';
      finalTeamName = auctionState.highest_bidder_team || '';
      finalPrice = auctionState.highest_bid || 0;
    } else {
      // Manual assignment by admin (no bids)
      const selectedCaptain = captains.find(c => c.teamName === selectedTeamForManualAssign);
      if (!selectedCaptain) {
        await alert('Selected team not found', 'Error', 'warning');
        return;
      }
      finalCaptainId = selectedCaptain.playerId;
      finalCaptainName = selectedCaptain.playerNickname;
      finalTeamName = selectedCaptain.teamName;
      finalPrice = parseInt(manualAssignPrice) || 1; // Use admin-specified price
    }

    // ✅ CHECK 5-PLAYER LIMIT PER TEAM
    const teamPlayerCount = soldPlayers.filter(p => p.teamName === finalTeamName).length;
    if (teamPlayerCount >= 5) {
      await alert(
        `${finalTeamName} already has 5 players!\n\nTeams cannot have more than 5 players.\n\nCurrent roster: ${teamPlayerCount}/5`,
        'Team Full',
        'warning'
      );
      return;
    }

    // Deduct budget from winning captain
    const winningCaptain = captains.find(c => c.playerId === finalCaptainId);
    const newBudget = winningCaptain ? winningCaptain.budget - finalPrice : 0;
    
    if (winningCaptain) {
      await captainService.updateBudget(finalCaptainId, newBudget);
    }

    // Save to auction results in Supabase
    const { error } = await supabase
      .from('auction_results')
      .insert([{
        auction_id: auctionState.id,
        player_id: auctionState.current_player_id,
        player_data: auctionState.current_player_data,
        sold_to_captain_id: finalCaptainId,
        sold_to_captain_name: finalCaptainName,
        sold_to_team_name: finalTeamName,
        final_price: finalPrice
      }]);

    if (error) {
      console.error('Error saving auction result:', error);
    }

    // Clear current player from auction
    await AuctionService.setCurrentPlayer('', null);
    
    // Force immediate reload of all data to ensure UI updates
    await Promise.all([
      loadCaptains(),
      loadSoldPlayers()
    ]);
    
    // Reset manual assignment selection
    setSelectedTeamForManualAssign('');
    setManualAssignPrice('1');
    
    // Show success modal
    setSuccessMessage(`${playerNickname} assigned to ${finalTeamName}! Budget updated to ${newBudget}.`);
    setShowSuccessModal(true);
  };

  const status = auctionState?.status || 'not-started';
  const currentPlayer = auctionState?.current_player_data;

  return (
    <>
      <ModalComponent />
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
                                  {/* Timestamp */}
                                  <p className="text-gray-500 text-[0.65rem] mt-1">
                                    {new Date(bid.created_at).toLocaleTimeString()}
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
                          <div className="bg-gradient-to-br from-cyan-900/40 to-blue-900/40 border border-cyan-500/50 rounded-lg p-2 flex-shrink-0 w-28">
                            <p className="text-cyan-400 text-[0.65rem] font-bold mb-1 text-center">CURRENT</p>
                            <div className="flex flex-col items-center gap-1">
                              {currentPlayer.currentMedalLabel && (
                                <div className="relative group">
                                  <img 
                                    src={`/medals/${currentPlayer.currentMedalLabel.replace(' ', '_')}.png`}
                                    alt={currentPlayer.currentMedalLabel}
                                    title={currentPlayer.currentMedalLabel}
                                    className="w-10 h-10 object-contain cursor-pointer transition-transform hover:scale-110"
                                    onError={(e) => {
                                      e.currentTarget.style.display = 'none';
                                    }}
                                  />
                                  <span className="pointer-events-none absolute -bottom-9 left-1/2 -translate-x-1/2 px-2 py-1 rounded-lg bg-black/95 border border-cyan-500/70 text-[0.7rem] text-cyan-200 opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap z-20 shadow-lg">
                                    {currentPlayer.currentMedalLabel}
                                  </span>
                                </div>
                              )}
                              <p className="text-cyan-300 text-sm font-bold">{currentPlayer.currentMMR || 'N/A'}</p>
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
                            <div className="flex items-center gap-2 max-w-full">
                              <h3 className="text-2xl font-bold text-white drop-shadow-lg truncate max-w-[200px]" style={{ fontSize: (currentPlayer.nickname?.length || 0) > 15 ? '1.25rem' : '1.5rem' }}>{currentPlayer.nickname}</h3>
                              
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
                          <div className="bg-gradient-to-br from-purple-900/40 to-pink-900/40 border border-purple-500/50 rounded-lg p-2 flex-shrink-0 w-28">
                            <p className="text-purple-400 text-[0.65rem] font-bold mb-1 text-center">PEAK</p>
                            <div className="flex flex-col items-center gap-1">
                              {currentPlayer.peakMedalLabel && (
                                <div className="relative group">
                                  <img 
                                    src={`/medals/${currentPlayer.peakMedalLabel.replace(' ', '_')}.png`}
                                    alt={currentPlayer.peakMedalLabel}
                                    title={currentPlayer.peakMedalLabel}
                                    className="w-10 h-10 object-contain cursor-pointer transition-transform hover:scale-110"
                                    onError={(e) => {
                                      e.currentTarget.style.display = 'none';
                                    }}
                                  />
                                  <span className="pointer-events-none absolute -bottom-9 left-1/2 -translate-x-1/2 px-2 py-1 rounded-lg bg-black/95 border border-purple-500/70 text-[0.7rem] text-purple-200 opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap z-20 shadow-lg">
                                    {currentPlayer.peakMedalLabel}
                                  </span>
                                </div>
                              )}
                              <p className="text-purple-300 text-sm font-bold">{currentPlayer.peakMMR || 'N/A'}</p>
                            </div>
                          </div>
                        </div>

                        {/* Preferred Roles - Horizontal Layout */}
                        {currentPlayer.roles && currentPlayer.roles.length > 0 && (
                          <div className="mb-2 bg-gradient-to-br from-cyan-900/30 to-blue-900/30 rounded-lg p-2 border border-cyan-500/40">
                            <div className="flex items-center gap-3">
                              <p className="text-cyan-400 text-[0.65rem] font-bold whitespace-nowrap w-32">PREFERRED ROLES</p>
                              <div className="flex items-center gap-2">
                                {currentPlayer.roles.map((role: any, idx: number) => (
                                  <div key={idx} className="relative group">
                                    <img
                                      src={role.iconSrc}
                                      alt={role.label}
                                      title={role.label}
                                      className="w-6 h-6 object-contain cursor-pointer hover:scale-110 transition-transform"
                                    />
                                    <span className="pointer-events-none absolute -bottom-8 left-1/2 -translate-x-1/2 px-2 py-1 rounded-lg bg-black/95 border border-cyan-500/70 text-[0.65rem] text-cyan-200 opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap z-20 shadow-lg">
                                      {role.label}
                                    </span>
                                  </div>
                                ))}
                              </div>
                            </div>
                          </div>
                        )}

                        {/* Best Heroes Section */}
                        {currentPlayer.favoriteHeroes && currentPlayer.favoriteHeroes.length > 0 && (
                          <div className="mb-2 bg-gradient-to-br from-red-900/30 to-orange-900/30 rounded-lg p-2 border border-red-500/40">
                            <div className="flex items-center gap-3">
                              <p className="text-red-400 text-[0.65rem] font-bold whitespace-nowrap w-32">BEST HEROES</p>
                              <div className="flex items-center gap-2">
                                {currentPlayer.favoriteHeroes.slice(0, 3).map((hero: any, idx: number) => (
                                  <div 
                                    key={idx}
                                    className="relative group"
                                    title={hero.name}
                                  >
                                    <video
                                      src={hero.videoSrc}
                                      autoPlay
                                      loop
                                      muted
                                      playsInline
                                      className="w-10 h-10 rounded-lg object-cover border-2 border-red-500/50 hover:border-red-400 transition-all cursor-pointer hover:scale-110"
                                    />
                                    <span className="pointer-events-none absolute -bottom-8 left-1/2 -translate-x-1/2 px-2 py-1 rounded-lg bg-black/95 border border-red-500/70 text-[0.65rem] text-red-200 opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap z-20 shadow-lg">
                                      {hero.name}
                                    </span>
                                  </div>
                                ))}
                              </div>
                            </div>
                          </div>
                        )}

                        {/* Seasons Played - Horizontal Layout */}
                        {currentPlayer.seasonBadges && currentPlayer.seasonBadges.length > 0 && (
                          <div className="mb-2 bg-gradient-to-br from-purple-900/30 to-indigo-900/30 rounded-lg p-2 border border-purple-500/40">
                            <div className="flex items-center gap-3">
                              <p className="text-purple-400 text-[0.65rem] font-bold whitespace-nowrap w-32">SEASONS PLAYED</p>
                              <div className="flex items-center gap-2">
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
                                      className={`flex items-center justify-center w-7 h-7 rounded-full transition-all duration-300 cursor-pointer hover:scale-110 ${
                                        seasonStyles[seasonNum] || seasonStyles[1]
                                      }`}
                                      title={`Season ${seasonNum}`}
                                    >
                                      <span className="text-white text-[0.6rem] font-bold">S{seasonNum}</span>
                                    </div>
                                  );
                                })}
                              </div>
                            </div>
                          </div>
                        )}

                        {/* Achievements - Only if player has won */}
                        {currentPlayer.hasWonCup && (
                          <div className="mb-2 bg-gradient-to-br from-amber-900/30 to-yellow-900/30 rounded-lg p-2 border border-yellow-500/40">
                            <div className="flex items-center gap-3">
                              <p className="text-yellow-400 text-[0.65rem] font-bold whitespace-nowrap w-32">ACHIEVEMENTS</p>
                              <div className="flex items-center gap-2">
                                {/* Achievement Badge */}
                                <motion.div
                                  initial={{ opacity: 0, scale: 0.8 }}
                                  animate={{ opacity: 1, scale: 1 }}
                                  transition={{ delay: 0.3 }}
                                  whileHover={{ scale: 1.05 }}
                                  className="flex items-center gap-1.5 px-2 py-1 rounded-lg bg-gradient-to-br from-yellow-900/40 to-amber-900/40 border border-yellow-500/50 cursor-pointer transition-all"
                                  title={currentPlayer.cupTooltip || `Season ${currentPlayer.cupSeason || ''} Champion`}
                                >
                                  {/* Ranking Medal */}
                                  <span className="text-base">
                                    {currentPlayer.cupRank === 'gold' && '🏆'}
                                    {currentPlayer.cupRank === 'silver' && '🥈'}
                                    {currentPlayer.cupRank === 'bronze' && '🥉'}
                                    {!currentPlayer.cupRank && '🏆'}
                                  </span>
                                  {/* Season Text */}
                                  <span className="text-yellow-300 font-bold text-[0.65rem]">Season {currentPlayer.cupSeason || '?'}</span>
                                </motion.div>
                                {/* Future achievements can be added here */}
                              </div>
                            </div>
                          </div>
                        )}

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
                            className="space-y-2"
                          >
                            {/* Team Selector - Only show when no bids */}
                            {!auctionState?.highest_bidder_id && (
                              <div className="bg-black/40 rounded-lg p-2 border border-purple-500/40 space-y-2">
                                <div>
                                  <label className="text-purple-300 text-xs font-semibold mb-1 block">
                                    Select Team for Manual Assignment
                                  </label>
                                  <select
                                    value={selectedTeamForManualAssign}
                                    onChange={(e) => setSelectedTeamForManualAssign(e.target.value)}
                                    className="w-full px-2 py-1.5 bg-black/60 border border-purple-500/40 rounded text-white text-xs focus:outline-none focus:ring-2 focus:ring-purple-500"
                                  >
                                    <option value="">-- Select Team --</option>
                                    {captains.map((captain) => (
                                      <option key={captain.playerId} value={captain.teamName}>
                                        {captain.teamName} (Budget: {captain.budget})
                                      </option>
                                    ))}
                                  </select>
                                </div>
                                
                                <div>
                                  <label className="text-yellow-300 text-xs font-semibold mb-1 block">
                                    Set Price (Gold)
                                  </label>
                                  <input
                                    type="text"
                                    inputMode="numeric"
                                    pattern="[0-9]*"
                                    value={manualAssignPrice}
                                    onChange={(e) => {
                                      const value = e.target.value.replace(/[^0-9]/g, '');
                                      setManualAssignPrice(value || '1');
                                    }}
                                    placeholder="Enter price"
                                    className="w-full px-2 py-1.5 bg-black/60 border border-yellow-500/40 rounded text-white text-xs font-bold focus:outline-none focus:ring-2 focus:ring-yellow-500 [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
                                  />
                                </div>
                              </div>
                            )}
                            
                            <button
                              onClick={handleSellPlayer}
                              disabled={!auctionState?.highest_bidder_id && !selectedTeamForManualAssign}
                              className="w-full px-3 py-2 bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-500 hover:to-emerald-500 disabled:from-gray-600 disabled:to-gray-700 disabled:cursor-not-allowed text-white text-sm font-bold rounded-lg transition-all duration-300 shadow-lg hover:shadow-green-500/50 flex items-center justify-center gap-2"
                            >
                              <span className="text-base">🎯</span>
                              <span>Assign to Team</span>
                            </button>
                            {!auctionState?.highest_bidder_id && (
                              <p className="text-gray-400 text-xs text-center">
                                {selectedTeamForManualAssign 
                                  ? `Will assign to ${selectedTeamForManualAssign} for 🪙 ${manualAssignPrice}`
                                  : 'No bids - Select team above'}
                              </p>
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
                                        <Link 
                                          to={`/team/${encodeURIComponent(captain.teamName)}`}
                                          className="text-blue-300 font-semibold truncate text-xs hover:text-blue-200 hover:underline transition-colors"
                                        >
                                          {captain.teamName}
                                        </Link>
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
                                      {playerCount >= 5 && (
                                        <div className="text-[0.6rem] text-green-400">✓ FULL</div>
                                      )}
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
                                <div className="text-xs text-center">
                                  <span className="text-gray-400 block mb-1">Will play in team</span>
                                  <span className="text-emerald-300 font-semibold">
                                    {sold.teamName || 'Unknown Team'}
                                  </span>
                                </div>
                              </div>

                              {/* Admin Reassignment Button */}
                              {adminSession && (
                                <button
                                  onClick={async () => {
                                    const confirmed = await confirm(
                                      `Reassign ${sold.playerNickname} to a different team?\n\nThis will:\n• Refund ${sold.soldFor} to ${sold.teamName}\n• Allow you to assign to another team`,
                                      'Reassign Player'
                                    );
                                    
                                    if (!confirmed) return;

                                    // Refund budget to original team
                                    const originalCaptain = captains.find(c => c.teamName === sold.teamName);
                                    if (originalCaptain) {
                                      await captainService.updateBudget(
                                        originalCaptain.playerId,
                                        originalCaptain.budget + sold.soldFor
                                      );
                                    }

                                    // Delete from auction_results
                                    const { error } = await supabase
                                      .from('auction_results')
                                      .delete()
                                      .eq('id', sold.id);

                                    if (error) {
                                      await alert('Failed to remove player from team', 'Error', 'warning');
                                      return;
                                    }

                                    // Reload data
                                    await Promise.all([
                                      loadCaptains(),
                                      loadSoldPlayers()
                                    ]);

                                    await alert(
                                      `${sold.playerNickname} removed from ${sold.teamName}.\n\nBudget refunded: 🪙${sold.soldFor}\n\nYou can now reassign this player.`,
                                      'Player Removed',
                                      'success'
                                    );
                                  }}
                                  className="mt-2 w-full px-2 py-1 bg-orange-600/20 hover:bg-orange-600/30 border border-orange-500/50 text-orange-300 rounded text-xs font-semibold transition-colors"
                                >
                                  🔄 Reassign
                                </button>
                              )}
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
              <h3 className="text-2xl font-bold text-white mb-4">Finalize Assignment?</h3>
              <p className="text-gray-300 text-sm mb-4">
                Assign <span className="text-yellow-400 font-bold">{auctionState.current_player_data?.nickname}</span> to{' '}
                <span className="text-green-400 font-bold">
                  {auctionState.highest_bidder_team || selectedTeamForManualAssign}
                </span> for{' '}
                <span className="text-yellow-400 font-bold">
                  🪙 {auctionState.highest_bid || manualAssignPrice}
                </span>
                {!auctionState.highest_bidder_id && (
                  <span className="text-purple-300"> (Manual Assignment)</span>
                )}
                ?
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

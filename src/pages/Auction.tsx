import { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Link } from "react-router-dom";
import { Gavel } from "lucide-react";
import { AuctionGavel } from "../components/ui/AuctionGavel";
import { Avatar } from "../components/ui/Avatar";
import { AuctionService } from "../services/auctionService";
import captainService from "../services/captainService";
import auctionChatService from "../services/auctionChatService";
import type { AuctionState } from "../services/auctionService";
import { AuthService } from "../services/auth";
import { supabase } from "../lib/supabase";
import { useModal } from "../hooks/useModal";
import { TopBidsStandalone } from "../components/auction/TopBidsStandalone";

export default function Auction() {
  const { alert, ModalComponent } = useModal();
  const [auctionState, setAuctionState] = useState<AuctionState | null>(null);
  const [bidAmount, setBidAmount] = useState('');
  const [currentCaptainSession, setCurrentCaptainSession] = useState<any>(null);
  const [captains, setCaptains] = useState<any[]>([]);
  const [bidError, setBidError] = useState<string>('');
  const [adminSession, setAdminSession] = useState<any>(null);
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const [successMessage, setSuccessMessage] = useState('');
  const [isBidding, setIsBidding] = useState(false);

  const [soldPlayers, setSoldPlayers] = useState<any[]>([]);
  const [selectedTeamForManualAssign, setSelectedTeamForManualAssign] = useState<string>('');
  const [manualAssignPrice, setManualAssignPrice] = useState<string>('');
  
  // Player Pool modal state
  const [showPlayerPoolModal, setShowPlayerPoolModal] = useState(false);
  const [allPlayers, setAllPlayers] = useState<any[]>([]);
  const [playerPoolType, setPlayerPoolType] = useState<'core' | 'support'>('core');
  
  // Auction pool state
  // const [auctionPool, setAuctionPool] = useState<any[]>([]);
  
  // Captain chat state
  const [chatMessages, setChatMessages] = useState<any[]>([]);
  const [chatInput, setChatInput] = useState('');
  
  // Hammer countdown state - synced from database
  const [hammerStage, setHammerStage] = useState<0 | 1 | 2 | 3>(0); // 0=none, 1=once, 2=twice, 3=sold
  const [hammerCountdown, setHammerCountdown] = useState(5);
  const [isHammerActive, setIsHammerActive] = useState(false);
  const [newBidDuringHammer, setNewBidDuringHammer] = useState(false);
  
  // Ref to track if we're in the middle of a local hammer countdown
  const isLocalHammerRunning = useRef(false);
  
  // Ref to track sale execution timeout
  const saleTimeoutRef = useRef<number | null>(null);

  // Sync hammer state from auction state
  // Sync hammer state from database only when not actively running locally
  useEffect(() => {
    if (auctionState && !isLocalHammerRunning.current) {
      console.log('🔄 Syncing hammer state from database:', {
        active: auctionState.hammer_active,
        stage: auctionState.hammer_stage,
        countdown: auctionState.hammer_countdown,
        localRunning: isLocalHammerRunning.current
      });
      // Only sync from database if we're not in the middle of a local countdown
      // This prevents the subscription from overwriting our local countdown state
      setIsHammerActive(auctionState.hammer_active);
      setHammerStage(auctionState.hammer_stage);
      setHammerCountdown(auctionState.hammer_countdown);
    } else if (isLocalHammerRunning.current) {
      console.log('⏸️ Skipping database sync - local hammer is running');
    }
  }, [auctionState]);

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

    // Check for admin session (regular admin or superadmin)
    const admin = AuthService.getCurrentAdminSession();
    if (admin) {
      setAdminSession(admin);
    } else {
      // Check for superadmin session
      const superAdminSessionStr = localStorage.getItem('superAdminSession');
      if (superAdminSessionStr) {
        try {
          const superAdmin = JSON.parse(superAdminSessionStr);
          if (superAdmin.authenticated) {
            setAdminSession(superAdmin);
          }
        } catch (e) {
          // Silent error
        }
      }
    }

    // Subscribe to auction state changes
    const stateSubscription = AuctionService.subscribeToAuctionState(async (state) => {
      // Check if player changed by comparing player data IDs
      const oldPlayerId = auctionState?.current_player_data?.id;
      const newPlayerId = state.current_player_data?.id;
      
      setAuctionState(state);
      
      // When player changes, poll bids for the new player
      if (oldPlayerId !== newPlayerId) {
        // Only poll bids when player actually changes
        if (state.id && newPlayerId) {
          await pollBidsForCurrentAuction(state.id);
        }
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
          
          // If hammer is active, stop it automatically when new bid comes in
          if (isHammerActive) {
            setNewBidDuringHammer(true);
            // Clear any pending sale execution
            if (saleTimeoutRef.current) {
              window.clearTimeout(saleTimeoutRef.current);
              saleTimeoutRef.current = null;
            }
            // Automatically stop the hammer
            setIsHammerActive(false);
            setHammerStage(0);
            setHammerCountdown(6);
            // Update database
            AuctionService.updateHammerState(false, 0, 6);
          }
          
          // Reload auction state to get updated highest bid
          loadAuctionState();
        }
      )
      .subscribe();

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
      .subscribe();

    // Fallback: Poll for updates every 5 seconds as backup
    const pollInterval = setInterval(async () => {
      await loadAuctionState();
      await loadCaptains();
      await loadSoldPlayers();
      
      // Poll for bids - get current state
      const currentState = await AuctionService.getAuctionState();
      if (currentState?.id) {
        await pollBidsForCurrentAuction(currentState.id);
      }
    }, 5000);

    return () => {
      stateSubscription.unsubscribe();
      supabase.removeChannel(bidChannel);
      captainSubscription.unsubscribe();
      supabase.removeChannel(soldPlayersChannel);
      clearInterval(pollInterval);
    };
  }, []);

  // Separate effect for chat subscription based on auction state
  useEffect(() => {
    if (!auctionState?.id) return;

    // Load initial messages
    const loadMessages = async () => {
      const messages = await auctionChatService.getMessages(auctionState.id);
      console.log('💬 Loaded chat messages:', messages.length);
      setChatMessages(messages);
    };
    loadMessages();

    // Subscribe to new messages
    const chatSubscription = auctionChatService.subscribeToMessages(auctionState.id, (newMessage) => {
      console.log('📨 New chat message received:', newMessage);
      setChatMessages(prev => {
        // Avoid duplicates
        if (prev.some(m => m.id === newMessage.id)) {
          console.log('⚠️ Duplicate message, skipping');
          return prev;
        }
        console.log('✅ Adding new message to chat (at top)');
        return [newMessage, ...prev]; // Add new message at the beginning (top)
      });
    });

    // Polling fallback - check for new messages every 3 seconds
    const pollInterval = setInterval(async () => {
      const messages = await auctionChatService.getMessages(auctionState.id);
      setChatMessages(prev => {
        // Check if there are any new messages by comparing IDs
        const prevIds = new Set(prev.map(m => m.id));
        const newMessages = messages.filter(m => !prevIds.has(m.id));
        
        if (newMessages.length > 0) {
          console.log('📥 Polling found', newMessages.length, 'new messages');
          // Add new messages at the top (they're already sorted newest first from DB)
          return [...newMessages, ...prev];
        }
        return prev;
        }
        return prev;
      });
    }, 3000);

    return () => {
      chatSubscription.unsubscribe();
      clearInterval(pollInterval);
    };
  }, [auctionState?.id]);

  // Hammer countdown effect - 6 seconds per stage
  useEffect(() => {
    if (!isHammerActive || hammerStage === 0) {
      console.log('🔨 Hammer countdown stopped. Active:', isHammerActive, 'Stage:', hammerStage);
      if (hammerStage === 0) {
        isLocalHammerRunning.current = false;
      }
      return; // Stop countdown
    }

    // If we're at stage 3 (SOLD), don't do anything - the timeout is already set
    if (hammerStage === 3) {
      console.log('🔨 At SOLD stage, waiting for sale execution');
      return; // Don't clear the sale timeout
    }

    // Mark that we're running a local countdown
    isLocalHammerRunning.current = true;
    console.log('🔨 Hammer countdown running. Stage:', hammerStage, 'Countdown:', hammerCountdown);

    if (hammerCountdown > 0) {
      const timer = setTimeout(() => {
        const newCountdown = hammerCountdown - 1;
        console.log('⏱️ Countdown tick:', newCountdown, 'Stage:', hammerStage);
        setHammerCountdown(newCountdown);
        // Don't update database on every tick - only on stage changes
      }, 1000);
      return () => clearTimeout(timer);
    } else {
      // Countdown finished, move to next stage
      if (hammerStage === 1) {
        // Going Once -> Going Twice (6 seconds)
        console.log('🔨 Moving from GOING ONCE to GOING TWICE');
        const newStage = 2;
        const newCountdown = 6;
        setHammerStage(newStage);
        setHammerCountdown(newCountdown);
        // Update database only on stage change
        AuctionService.updateHammerState(true, newStage, newCountdown);
      } else if (hammerStage === 2) {
        // Going Twice -> SOLD! (instant execution, no delay)
        console.log('🔨 Moving from GOING TWICE to SOLD!');
        const newStage = 3;
        setHammerStage(newStage);
        setHammerCountdown(0);
        // Update database
        AuctionService.updateHammerState(true, newStage, 0);
        // Execute sale after a brief moment to show SOLD animation
        // Store timeout ref so it can be cancelled if a bid comes in
        console.log('⏰ Setting timeout to execute sale in 0.8s');
        saleTimeoutRef.current = window.setTimeout(() => {
          console.log('💰 Executing sale now!');
          // Execute sale - timeout will be cleared if a bid comes in
          executeSale();
          saleTimeoutRef.current = null;
          isLocalHammerRunning.current = false;
        }, 800); // Just 0.8 seconds to show SOLD
      }
    }
  }, [isHammerActive, hammerStage, hammerCountdown]);

  const loadSoldPlayers = async () => {
    try {
      const state = await AuctionService.getAuctionState();
      if (!state) {
        console.log('⚠️ No auction state, clearing sold players');
        setSoldPlayers([]);
        return;
      }

      console.log('🔍 Loading sold players for auction:', state.id);

      const { data, error } = await supabase
        .from('auction_results')
        .select('*')
        .eq('auction_id', state.id)
        .order('sold_at', { ascending: false });

      if (!error && data) {
        console.log('✅ Loaded sold players:', data.length, 'players');
        console.log('📊 Sold players data:', data);
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
      } else if (error) {
        console.error('❌ Error loading sold players:', error);
        setSoldPlayers([]);
      }
    } catch (error) {
      console.error('❌ Exception loading sold players:', error);
      setSoldPlayers([]);
    }
  };

  const loadAllPlayers = async (type: 'core' | 'support') => {
    try {
      const state = await AuctionService.getAuctionState();
      if (!state) return;

      const { data, error } = await supabase
        .from('auction_pool')
        .select('*')
        .eq('auction_id', state.id)
        .eq('player_type', type)
        .order('player_data->currentMMR', { ascending: false });

      if (!error && data) {
        setAllPlayers(data.map((item: any) => item.player_data));
      }
    } catch (error) {
      // Silent error
    }
  };

  const handleSendMessage = async () => {
    if (!chatInput.trim() || !auctionState?.id) return;
    
    let senderId: string;
    let senderName: string;
    let senderTeam: string | undefined;

    // Check if user is admin
    if (adminSession) {
      senderId = adminSession.id || adminSession.username;
      senderName = `Admin: ${adminSession.username}`;
      senderTeam = undefined; // Admins don't have teams
    } 
    // Check if user is a captain (not just any player)
    else if (currentCaptainSession) {
      const captainId = currentCaptainSession.playerId || currentCaptainSession.id;
      const captain = captains.find(c => c.playerId === captainId);
      
      // Verify this player is actually a captain
      if (!captain) {
        return;
      }
      
      senderId = captainId;
      senderName = currentCaptainSession.nickname;
      senderTeam = captain.teamName;
    } else {
      // Not authorized
      return;
    }

    const messageToSend = chatInput;
    setChatInput(''); // Clear input immediately

    // Send to database - no optimistic update, let subscription handle it
    const success = await auctionChatService.sendMessage(
      auctionState.id,
      senderId,
      senderName,
      senderTeam,
      messageToSend
    );

    if (!success) {
      // Restore input if send failed
      setChatInput(messageToSend);
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

  const pollBidsForCurrentAuction = async (_auctionId: string) => {
    try {
      const currentState = await AuctionService.getAuctionState();
      
      const hasCurrentPlayer = currentState?.current_player_id || currentState?.current_player_data?.id;
      
      if (!hasCurrentPlayer) {
        return;
      }

      // Bids are now handled by TopBidsStandalone component
      // This function is kept for compatibility but doesn't need to do anything
    } catch (error) {
      // Silent error
    }
  };

  const handlePlaceBid = async () => {
    if (!currentCaptainSession || !bidAmount || !auctionState) return;
    
    // Prevent simultaneous bids
    if (isBidding) {
      setBidError('Please wait, processing bid...');
      return;
    }

    setBidError('');
    const amount = parseInt(bidAmount);
    
    if (isNaN(amount) || amount < 0) {
      setBidError('Please enter a valid bid amount');
      return;
    }
    
    // Get minimum bid based on current state
    const currentBid = auctionState.highest_bid || 0;
    const hasExistingBids = auctionState.highest_bidder_id !== null;
    
    // If no bids yet, minimum is the base price (or 1 if base price is 0)
    // If there are bids, minimum is current bid + 1
    const minimumBid = hasExistingBids ? currentBid + 1 : (currentBid > 0 ? currentBid : 1);
    
    if (amount < minimumBid) {
      if (hasExistingBids) {
        setBidError(`Your bid must be higher than the current bid of ${currentBid}`);
      } else {
        setBidError(`Minimum bid is ${minimumBid}`);
      }
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
    
    // Check if captain has enough budget
    if (captain.budget <= 0) {
      setBidError('You have no budget left');
      return;
    }
    
    if (amount > captain.budget) {
      setBidError(`Insufficient budget. You have ${captain.budget} gold left`);
      return;
    }

    // ✅ CHECK IF TEAM IS ALREADY FULL (5 PLAYERS)
    const teamPlayerCount = soldPlayers.filter(p => p.teamName === captain.teamName).length;
    if (teamPlayerCount >= 5) {
      setBidError(`Your team is full (5/5 players). Cannot bid on more players.`);
      return;
    }

    setIsBidding(true); // Lock bidding

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
    
    setIsBidding(false); // Unlock bidding
  };

  // Start hammer countdown - 6 seconds for "GOING ONCE!"
  const handleStartHammer = async () => {
    console.log('🔨 START HAMMER clicked');
    if (!auctionState?.highest_bidder_id && !selectedTeamForManualAssign) {
      alert('No bids placed and no team selected for manual assignment', 'Cannot Start Hammer', 'warning');
      return;
    }

    console.log('🔨 Starting hammer countdown...');
    isLocalHammerRunning.current = true; // Mark that we're starting a local countdown
    setHammerStage(1);
    setHammerCountdown(6); // 6 seconds for GOING ONCE
    setIsHammerActive(true);
    setNewBidDuringHammer(false); // Reset flag
    // Update database
    await AuctionService.updateHammerState(true, 1, 6);
    console.log('🔨 Hammer started: Stage 1, Countdown 6');
  };

  // Cancel hammer countdown
  const handleCancelHammer = async () => {
    // Clear any pending sale execution
    if (saleTimeoutRef.current) {
      window.clearTimeout(saleTimeoutRef.current);
      saleTimeoutRef.current = null;
    }
    
    isLocalHammerRunning.current = false; // Mark that we're stopping the countdown
    setHammerStage(0);
    setHammerCountdown(6);
    setIsHammerActive(false);
    setNewBidDuringHammer(false); // Reset flag
    // Update database
    await AuctionService.updateHammerState(false, 0, 6);
  };

  // Execute the sale after SOLD animation
  const executeSale = async () => {
    console.log('💰 executeSale called');
    console.log('💰 saleTimeoutRef.current:', saleTimeoutRef.current);
    isLocalHammerRunning.current = false; // Mark that countdown is complete
    await AuctionService.updateHammerState(false, 0, 6);
    setIsHammerActive(false);
    setHammerStage(0);
    setHammerCountdown(6);
    console.log('💰 Calling finalizeSale...');
    await finalizeSale();
    console.log('💰 finalizeSale completed');
  };

  const handleSellPlayer = async () => {
    if (!auctionState) return;
    handleStartHammer();
  };

  const finalizeSale = async () => {
    console.log('🎯 finalizeSale START');
    if (!auctionState) {
      console.log('❌ No auction state, aborting');
      return;
    }

    console.log('🎯 Auction state:', auctionState);
    console.log('🎯 Highest bidder:', auctionState.highest_bidder_id);
    console.log('🎯 Selected team for manual assign:', selectedTeamForManualAssign);

    if (!auctionState.highest_bidder_id && !selectedTeamForManualAssign) {
      await alert('Please select a team to assign this player to', 'Selection Required', 'warning');
      return;
    }

    if (!auctionState.highest_bidder_id) {
      if (manualAssignPrice.trim() === '') {
        await alert('Please enter a price (0 or higher)', 'Invalid Price', 'warning');
        return;
      }
      
      const price = parseInt(manualAssignPrice);
      if (isNaN(price) || price < 0) {
        await alert('Please enter a valid price (0 or higher)', 'Invalid Price', 'warning');
        return;
      }

      const selectedCaptain = captains.find(c => c.teamName === selectedTeamForManualAssign);
      if (selectedCaptain && selectedCaptain.budget < price) {
        await alert(`${selectedTeamForManualAssign} doesn't have enough budget. Available: ${selectedCaptain.budget}`, 'Insufficient Budget', 'warning');
        return;
      }
    }

    const playerNickname = auctionState.current_player_data?.nickname || 'Unknown Player';
    console.log('🎯 Player nickname:', playerNickname);

    let finalCaptainId: string;
    let finalCaptainName: string;
    let finalTeamName: string;
    let finalPrice: number;

    if (auctionState.highest_bidder_id) {
      finalCaptainId = auctionState.highest_bidder_id;
      finalCaptainName = auctionState.highest_bidder_name || '';
      finalTeamName = auctionState.highest_bidder_team || '';
      finalPrice = auctionState.highest_bid || 0;
    } else {
      const selectedCaptain = captains.find(c => c.teamName === selectedTeamForManualAssign);
      if (!selectedCaptain) {
        await alert('Selected team not found', 'Error', 'warning');
        return;
      }
      finalCaptainId = selectedCaptain.playerId;
      finalCaptainName = selectedCaptain.playerNickname;
      finalTeamName = selectedCaptain.teamName;
      finalPrice = parseInt(manualAssignPrice) || 0;
    }

    console.log('🎯 Final assignment:', {
      captainId: finalCaptainId,
      captainName: finalCaptainName,
      teamName: finalTeamName,
      price: finalPrice
    });

    const teamPlayerCount = soldPlayers.filter(p => p.teamName === finalTeamName).length;
    console.log('🎯 Current team player count:', teamPlayerCount);
    
    if (teamPlayerCount >= 5) {
      await alert(
        `${finalTeamName} already has 5 players!\n\nTeams cannot have more than 5 players.\n\nCurrent roster: ${teamPlayerCount}/5`,
        'Team Full',
        'warning'
      );
      return;
    }

    const winningCaptain = captains.find(c => c.playerId === finalCaptainId);
    const newBudget = winningCaptain ? winningCaptain.budget - finalPrice : 0;
    
    console.log('🎯 Updating captain budget to:', newBudget);
    if (winningCaptain) {
      await captainService.updateBudget(finalCaptainId, newBudget);
    }

    console.log('🎯 Inserting into auction_results...');
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
      console.error('❌ Failed to insert into auction_results:', error);
      await alert(`Failed to assign player: ${error.message}`, 'Database Error', 'warning');
      return;
    }

    console.log('✅ Player inserted into auction_results successfully');
    console.log('📊 Inserted data:', {
      auction_id: auctionState.id,
      player_id: auctionState.current_player_id,
      player_nickname: playerNickname,
      sold_to_captain_id: finalCaptainId,
      sold_to_captain_name: finalCaptainName,
      sold_to_team_name: finalTeamName,
      final_price: finalPrice
    });

    // Send chat message about the sale
    const chatMessage = `✅ ${playerNickname} has been assigned to ${finalTeamName} (Captain: ${finalCaptainName}) for 🪙 ${finalPrice} gold!`;
    console.log('📨 Sending chat message:', chatMessage);
    
    const chatResult = await auctionChatService.sendMessage(
      auctionState.id,
      'system',
      'Auction System',
      undefined,
      chatMessage
    );

    console.log('📨 Chat message sent:', chatResult ? 'SUCCESS' : 'FAILED');
    
    if (!chatResult) {
      console.error('❌ Chat message failed to send!');
    }

    // Clear current player
    console.log('🗑️ Clearing current player...');
    await AuctionService.setCurrentPlayer('', null);
    console.log('✅ Current player cleared');
    
    console.log('🔄 Reloading captains and sold players...');
    
    // Reload captains and sold players to update UI
    await Promise.all([
      loadCaptains(),
      loadSoldPlayers()
    ]);
    
    console.log('✅ Reload complete');
    
    setSelectedTeamForManualAssign('');
    setManualAssignPrice('');
    
    setSuccessMessage(`${playerNickname} assigned to ${finalTeamName}! Budget updated to ${newBudget}.`);
    setShowSuccessModal(true);
    console.log('🎯 finalizeSale END');
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
                  
                  {/* Player Pool Buttons */}
                  <div className="ml-auto flex gap-2">
                    <button
                      onClick={() => {
                        setPlayerPoolType('core');
                        loadAllPlayers('core');
                        setShowPlayerPoolModal(true);
                      }}
                      className="px-4 py-2 bg-gradient-to-r from-red-600 to-orange-600 hover:from-red-500 hover:to-orange-500 text-white text-sm font-semibold rounded-lg transition-all duration-300 flex items-center gap-2 shadow-lg"
                    >
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                      </svg>
                      Core Pool
                    </button>
                    <button
                      onClick={() => {
                        setPlayerPoolType('support');
                        loadAllPlayers('support');
                        setShowPlayerPoolModal(true);
                      }}
                      className="px-4 py-2 bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-500 hover:to-emerald-500 text-white text-sm font-semibold rounded-lg transition-all duration-300 flex items-center gap-2 shadow-lg"
                    >
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                      </svg>
                      Support Pool
                    </button>
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
                    
                    {/* Section 1: Top Bids - Standalone with own subscription */}
                    <TopBidsStandalone 
                      auctionId={auctionState?.id || null}
                      currentPlayerId={auctionState?.current_player_data?.id || null}
                      hammerStage={hammerStage}
                    />

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

                        {/* Ping Section */}
                        <div className="mb-2 bg-gradient-to-br from-green-900/30 to-emerald-900/30 rounded-lg p-2 border border-green-500/40">
                          <div className="flex items-center gap-3">
                            <p className="text-green-400 text-[0.65rem] font-bold whitespace-nowrap w-32">PING</p>
                            <div className="flex items-center gap-2">
                              <div className="px-3 py-1 bg-green-500/20 border border-green-400/50 rounded-lg">
                                <span className="text-green-300 text-sm font-semibold">
                                  {currentPlayer.pingRange ? `${currentPlayer.pingRange} ms` : 'N/A'}
                                </span>
                              </div>
                            </div>
                          </div>
                        </div>

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
                                    {captains.map((captain) => {
                                      // Count players for this team
                                      const teamPlayers = soldPlayers.filter(p => p.teamName === captain.teamName);
                                      const isFull = teamPlayers.length >= 5;
                                      
                                      return (
                                        <option 
                                          key={captain.playerId} 
                                          value={captain.teamName}
                                          disabled={isFull}
                                        >
                                          {captain.teamName} (Budget: {captain.budget}) {isFull ? '- FULL' : ''}
                                        </option>
                                      );
                                    })}
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
                                      setManualAssignPrice(value);
                                    }}
                                    placeholder="Enter gold value"
                                    className="w-full px-2 py-1.5 bg-black/60 border border-yellow-500/40 rounded text-white text-xs font-bold focus:outline-none focus:ring-2 focus:ring-yellow-500 [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
                                  />
                                </div>
                              </div>
                            )}
                            
                            <button
                              onClick={isHammerActive ? handleCancelHammer : handleSellPlayer}
                              disabled={!isHammerActive && !auctionState?.highest_bidder_id && !selectedTeamForManualAssign}
                              className={`w-full px-3 py-2 ${
                                isHammerActive 
                                  ? 'bg-gradient-to-r from-red-600 to-orange-600 hover:from-red-500 hover:to-orange-500'
                                  : 'bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-500 hover:to-emerald-500'
                              } disabled:from-gray-600 disabled:to-gray-700 disabled:cursor-not-allowed text-white text-sm font-bold rounded-lg transition-all duration-300 shadow-lg flex items-center justify-center gap-2`}
                            >
                              <span className="text-base">{isHammerActive ? '❌' : '🔨'}</span>
                              <span>{isHammerActive ? 'Cancel Hammer' : 'Start Hammer'}</span>
                            </button>
                            
                            {/* Stop Hammer button - shows when new bid during hammer */}
                            {isHammerActive && newBidDuringHammer && (
                              <motion.button
                                initial={{ scale: 0.8, opacity: 0 }}
                                animate={{ scale: 1, opacity: 1 }}
                                onClick={handleCancelHammer}
                                className="w-full px-3 py-2 bg-gradient-to-r from-yellow-600 to-amber-600 hover:from-yellow-500 hover:to-amber-500 text-white text-sm font-bold rounded-lg transition-all duration-300 shadow-lg flex items-center justify-center gap-2 animate-pulse"
                              >
                                <span className="text-base">⚠️</span>
                                <span>Stop Hammer - New Bid!</span>
                              </motion.button>
                            )}
                            
                            {!auctionState?.highest_bidder_id && (
                              <p className="text-gray-400 text-xs text-center">
                                {selectedTeamForManualAssign 
                                  ? `Will assign to ${selectedTeamForManualAssign} for 🪙 ${manualAssignPrice || '0'}`
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
                                // Get team players count from auction results (only bought players, not captain)
                                const teamPlayersCount = soldPlayers.filter(
                                  p => p.soldToCaptainId === captain.playerId
                                ).length;
                                const playerCount = teamPlayersCount; // Don't add captain to count
                                
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

                    {/* Section 4: Chat - Scrollable with Neon Glow */}
                    <div className="bg-black/40 backdrop-blur-sm rounded-xl p-3 border-2 border-purple-500/60 flex flex-col overflow-hidden shadow-[0_0_20px_rgba(168,85,247,0.3)]">
                      <h3 className="text-white font-bold mb-2 text-sm text-center flex-shrink-0">Chat</h3>
                      
                      {/* Chat Messages */}
                      <div className="flex-1 overflow-y-auto custom-standings-scroll pr-1 space-y-2 mb-2" style={{ minHeight: '0' }}>
                        {chatMessages.length === 0 ? (
                          <div className="text-gray-400 text-xs text-center py-8">
                            No messages yet
                          </div>
                        ) : (
                          chatMessages.map((msg, index) => {
                            const isSystemMessage = msg.sender_id === 'system';
                            return (
                              <motion.div
                                key={msg.id || index}
                                initial={{ opacity: 0, x: -10 }}
                                animate={{ opacity: 1, x: 0 }}
                                className={`rounded-lg p-2 border ${
                                  isSystemMessage 
                                    ? 'bg-green-900/20 border-green-500/30' 
                                    : 'bg-purple-900/20 border-purple-500/30'
                                }`}
                              >
                                <div className="flex items-start gap-2">
                                  <div className="flex-1 min-w-0">
                                    <div className="flex items-center gap-2">
                                      <p className={`font-semibold text-xs truncate ${
                                        isSystemMessage ? 'text-green-300' : 'text-purple-300'
                                      }`}>
                                        {msg.sender_name}
                                      </p>
                                      {msg.sender_team && (
                                        <span className="text-purple-400 text-[0.6rem] bg-purple-900/40 px-1.5 py-0.5 rounded">
                                          {msg.sender_team}
                                        </span>
                                      )}
                                    </div>
                                    <p className={`text-xs mt-0.5 break-words ${
                                      isSystemMessage ? 'text-green-200 font-medium' : 'text-white'
                                    }`}>
                                      {msg.message}
                                    </p>
                                    <p className="text-gray-500 text-[0.6rem] mt-1">
                                      {new Date(msg.created_at).toLocaleTimeString()}
                                    </p>
                                  </div>
                                </div>
                              </motion.div>
                            );
                          })
                        )}
                      </div>
                      
                      {/* Chat Input - Only for captains and admins */}
                      {(() => {
                        // Check if user is admin
                        if (adminSession) {
                          return (
                            <div className="flex gap-2 flex-shrink-0">
                              <input
                                type="text"
                                value={chatInput}
                                onChange={(e) => setChatInput(e.target.value)}
                                onKeyPress={(e) => {
                                  if (e.key === 'Enter' && chatInput.trim()) {
                                    handleSendMessage();
                                  }
                                }}
                                placeholder="Type a message..."
                                className="flex-1 px-2 py-1.5 bg-black/60 border border-purple-500/40 rounded text-white text-xs placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500"
                              />
                              <button
                                onClick={handleSendMessage}
                                disabled={!chatInput.trim()}
                                className="px-3 py-1.5 bg-purple-600 hover:bg-purple-500 disabled:bg-gray-600 disabled:cursor-not-allowed text-white text-xs font-semibold rounded transition-colors"
                              >
                                Send
                              </button>
                            </div>
                          );
                        }
                        
                        // Check if user is a captain (not just any player)
                        if (currentCaptainSession) {
                          const captainId = currentCaptainSession.playerId || currentCaptainSession.id;
                          const isCaptain = captains.some(c => c.playerId === captainId);
                          
                          if (isCaptain) {
                            return (
                              <div className="flex gap-2 flex-shrink-0">
                                <input
                                  type="text"
                                  value={chatInput}
                                  onChange={(e) => setChatInput(e.target.value)}
                                  onKeyPress={(e) => {
                                    if (e.key === 'Enter' && chatInput.trim()) {
                                      handleSendMessage();
                                    }
                                  }}
                                  placeholder="Type a message..."
                                  className="flex-1 px-2 py-1.5 bg-black/60 border border-purple-500/40 rounded text-white text-xs placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500"
                                />
                                <button
                                  onClick={handleSendMessage}
                                  disabled={!chatInput.trim()}
                                  className="px-3 py-1.5 bg-purple-600 hover:bg-purple-500 disabled:bg-gray-600 disabled:cursor-not-allowed text-white text-xs font-semibold rounded transition-colors"
                                >
                                  Send
                                </button>
                              </div>
                            );
                          }
                        }
                        
                        // Not a captain or admin - show locked message
                        return (
                          <div className="bg-gray-800/50 border border-gray-600/50 rounded-lg p-2 text-center flex-shrink-0">
                            <p className="text-gray-400 text-xs">
                              🔒 Chat is only available for captains and admins
                            </p>
                          </div>
                        );
                      })()}
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
                        {(() => {
                          const captainId = currentCaptainSession.playerId || currentCaptainSession.id;
                          const isHighestBidder = auctionState?.highest_bidder_id === captainId;
                          const captain = captains.find(c => c.playerId === captainId);
                          const hasNoBudget = captain && captain.budget <= 0;
                          
                          // Show message if captain is highest bidder
                          if (isHighestBidder) {
                            return (
                              <div className="bg-green-900/30 border border-green-500/50 rounded-lg p-4 text-center">
                                <p className="text-green-300 font-bold text-sm mb-1">✅ You have the highest bid!</p>
                                <p className="text-green-400/80 text-xs">
                                  Your bid: <span className="font-bold">🪙 {auctionState?.highest_bid}</span>
                                </p>
                                <p className="text-gray-400 text-xs mt-2">
                                  Wait for another captain to bid before you can bid again
                                </p>
                              </div>
                            );
                          }
                          
                          return (
                            <>
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
                                  disabled={!bidAmount || status === 'paused' || isBidding || hasNoBudget}
                                  className="px-6 py-2.5 bg-gradient-to-r from-yellow-600 to-orange-600 hover:from-yellow-500 hover:to-orange-500 disabled:from-gray-600 disabled:to-gray-700 disabled:cursor-not-allowed text-white font-bold rounded-lg transition-all duration-300 flex items-center justify-center gap-2 shadow-lg flex-shrink-0"
                                >
                                  <span className="text-base">🪙</span>
                                  <span className="text-sm">{isBidding ? 'BIDDING...' : 'PLACE BID'}</span>
                                </button>
                              </div>
                              {bidError && (
                                <p className="text-red-400 text-xs mt-2 font-semibold text-center">⚠️ {bidError}</p>
                              )}
                              {status === 'paused' && (
                                <p className="text-yellow-400 text-xs mt-2 text-center">⏸️ Bidding paused</p>
                              )}
                            </>
                          );
                        })()}
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

      {/* Player Pool Modal */}
      <AnimatePresence>
        {showPlayerPoolModal && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4"
            onClick={() => setShowPlayerPoolModal(false)}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="bg-gradient-to-br from-gray-900/95 to-gray-800/95 rounded-xl p-6 max-w-6xl w-full max-h-[90vh] border border-cyan-500/40 overflow-hidden flex flex-col"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-2xl font-bold text-white flex items-center gap-2">
                  <svg className="w-6 h-6 text-cyan-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                  </svg>
                  {playerPoolType === 'core' ? 'Core' : 'Support'} Player Pool ({allPlayers.length} Players)
                </h3>
                <button
                  onClick={() => setShowPlayerPoolModal(false)}
                  className="text-gray-400 hover:text-white transition-colors"
                >
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>
              
              <div className="overflow-auto flex-1">
                <table className="w-full text-sm">
                  <thead className="sticky top-0 bg-gradient-to-r from-cyan-900/80 to-blue-900/80 backdrop-blur-sm z-10">
                    <tr className="border-b-2 border-cyan-500/30">
                      <th className="text-left py-3 px-3 text-cyan-300 font-bold">#</th>
                      <th className="text-left py-3 px-3 text-cyan-300 font-bold">Player Name</th>
                      <th className="text-center py-3 px-3 text-purple-300 font-bold">Peak MMR</th>
                      <th className="text-center py-3 px-3 text-cyan-300 font-bold">Current MMR</th>
                      <th className="text-center py-3 px-3 text-yellow-300 font-bold">Roles</th>
                      <th className="text-center py-3 px-3 text-green-300 font-bold">Ping</th>
                    </tr>
                  </thead>
                  <tbody>
                    {allPlayers.map((player, index) => {
                      // Check if this player has been sold
                      const isSold = soldPlayers.some(sp => sp.playerId === player.id);
                      
                      return (
                        <tr 
                          key={player.id || index}
                          className={`border-b border-gray-700/50 transition-colors ${
                            isSold 
                              ? 'opacity-40 bg-gray-800/50 cursor-not-allowed' 
                              : 'hover:bg-cyan-500/10'
                          }`}
                        >
                          <td className="py-3 px-3 text-gray-400 font-semibold">{index + 1}</td>
                          <td className="py-3 px-3">
                            <div className="flex items-center gap-2">
                              <img 
                                src={player.avatarUrl || '/avatars/default.png'} 
                                alt={player.nickname}
                                className={`w-8 h-8 rounded-full border ${
                                  isSold ? 'border-gray-600 grayscale' : 'border-cyan-500/50'
                                }`}
                                onError={(e) => {
                                  e.currentTarget.src = '/avatars/default.png';
                                }}
                              />
                              <div className="flex flex-col">
                                <span className={`font-semibold ${
                                  isSold ? 'text-gray-500 line-through' : 'text-white'
                                }`}>
                                  {player.nickname}
                                </span>
                                {isSold && (
                                  <span className="text-xs text-red-400">SOLD</span>
                                )}
                              </div>
                            </div>
                          </td>
                          <td className="py-3 px-3 text-center">
                            <span className={`font-bold ${
                              isSold ? 'text-gray-600' : 'text-purple-300'
                            }`}>
                              {player.peakMMR || 'N/A'}
                            </span>
                          </td>
                          <td className="py-3 px-3 text-center">
                            <span className={`font-bold ${
                              isSold ? 'text-gray-600' : 'text-cyan-300'
                            }`}>
                              {player.currentMMR || 'N/A'}
                            </span>
                          </td>
                          <td className="py-3 px-3">
                            <div className="flex items-center justify-center gap-1">
                              {player.roles && player.roles.length > 0 ? (
                                player.roles.map((role: any, idx: number) => (
                                  <img
                                    key={idx}
                                    src={role.iconSrc}
                                    alt={role.label}
                                    title={role.label}
                                    className={`w-5 h-5 object-contain ${
                                      isSold ? 'grayscale opacity-50' : ''
                                    }`}
                                  />
                                ))
                              ) : (
                                <span className="text-gray-500 text-xs">N/A</span>
                              )}
                            </div>
                          </td>
                          <td className="py-3 px-3 text-center">
                            <span className={`font-semibold ${
                              isSold ? 'text-gray-600' : 'text-green-300'
                            }`}>
                              {player.pingRange || 'N/A'}
                            </span>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}

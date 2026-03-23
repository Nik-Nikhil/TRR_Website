import { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Link } from "react-router-dom";
import { Gavel, Play, Pause, Square, RotateCcw, ArrowRight, Loader2, ChevronDown, ChevronUp, Search } from "lucide-react";
import { AuctionGavel } from "../components/ui/AuctionGavel";
import { Avatar } from "../components/ui/Avatar";
import { AuctionService } from "../services/auctionService";
import auctionPoolService from "../services/auctionPoolService";
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
  const [showPlayerPoolModal, setShowPlayerPoolModal] = useState(false);
  const [allPlayers, setAllPlayers] = useState<any[]>([]);
  const [playerPoolType, setPlayerPoolType] = useState<'core' | 'support'>('core');
  const [playerPoolTab, setPlayerPoolTab] = useState<'available' | 'sold'>('available');
  const [soldPlayersInPool, setSoldPlayersInPool] = useState<any[]>([]);
  const [chatMessages, setChatMessages] = useState<any[]>([]);
  const [chatInput, setChatInput] = useState('');
  const [hammerStage, setHammerStage] = useState<0 | 1 | 2 | 3>(0);
  const [hammerCountdown, setHammerCountdown] = useState(5);
  const [isHammerActive, setIsHammerActive] = useState(false);
  const [newBidDuringHammer, setNewBidDuringHammer] = useState(false);
  const isLocalHammerRunning = useRef(false);
  const saleTimeoutRef = useRef<number | null>(null);
  const isSaleInProgress = useRef(false);
  const [poolSearch, setPoolSearch] = useState('');
  const [poolPlayers, setPoolPlayers] = useState<any[]>([]);
  // Admin panel
  const [adminPanelOpen, setAdminPanelOpen] = useState(false);
  const [adminPoolPlayers, setAdminPoolPlayers] = useState<any[]>([]);
  const [adminSelectedPlayer, setAdminSelectedPlayer] = useState('');
  const [adminPoolFilter, setAdminPoolFilter] = useState<'all' | 'core' | 'support'>('all');
  const [adminLoading, setAdminLoading] = useState(false);
  const [adminError, setAdminError] = useState('');

  // Hammer sync
  useEffect(() => {
    if (!auctionState) return;
    if (!window.location.pathname.includes('/auction')) {
      if (isHammerActive || hammerStage !== 0) { setIsHammerActive(false); setHammerStage(0); setHammerCountdown(6); isLocalHammerRunning.current = false; if (saleTimeoutRef.current) { window.clearTimeout(saleTimeoutRef.current); saleTimeoutRef.current = null; } }
      return;
    }
    if (!isLocalHammerRunning.current) {
      setIsHammerActive(auctionState.hammer_active); setHammerStage(auctionState.hammer_stage); setHammerCountdown(auctionState.hammer_countdown);
      if (auctionState.hammer_active && auctionState.hammer_stage === 3) { isLocalHammerRunning.current = true; saleTimeoutRef.current = window.setTimeout(() => { executeSale(); saleTimeoutRef.current = null; }, 800); }
    }
  }, [auctionState?.highest_bid, auctionState?.hammer_active, auctionState?.hammer_stage]);

  useEffect(() => {
    loadCaptains(); loadAuctionState(); loadSoldPlayers();
    const playerSession = AuthService.getCurrentPlayerSession();
    if (playerSession) setCurrentCaptainSession(playerSession);
    const admin = AuthService.getCurrentAdminSession();
    if (admin) { setAdminSession(admin); } else {
      const s = localStorage.getItem('superAdminSession');
      if (s) { try { const sa = JSON.parse(s); if (sa.authenticated) setAdminSession(sa); } catch(e){} }
    }
    loadAdminPool();
    const stateSubscription = AuctionService.subscribeToAuctionState(async (state) => {
      const oldId = auctionState?.current_player_data?.id;
      const newId = state.current_player_data?.id;
      setAuctionState(state);
      if (oldId !== newId && state.id && newId) await pollBidsForCurrentAuction(state.id);
      loadAdminPool();
    });
    const bidChannel = supabase.channel(`auction-bids-${Date.now()}`).on('postgres_changes',
      { event: 'INSERT', schema: 'public', table: 'auction_bids' },
      async (payload) => {
        const bid = payload.new as any;
        const cs = await AuctionService.getAuctionState();
        const isForCurrent = bid.player_id === cs?.current_player_id || bid.player_id === cs?.current_player_data?.id;
        if (!isForCurrent) return;
        if (isHammerActive) { setNewBidDuringHammer(true); if (saleTimeoutRef.current) { window.clearTimeout(saleTimeoutRef.current); saleTimeoutRef.current = null; } setIsHammerActive(false); setHammerStage(0); setHammerCountdown(6); AuctionService.updateHammerState(false, 0, 6); }
        loadAuctionState();
      }).subscribe();
    const captainSubscription = captainService.subscribeToCaptains(() => loadCaptains());
    const soldPlayersChannel = supabase.channel('auction-results-changes').on('postgres_changes', { event: '*', schema: 'public', table: 'auction_results' }, () => loadSoldPlayers()).subscribe();
    const pollInterval = setInterval(async () => {
      await loadAuctionState(); await loadCaptains(); await loadSoldPlayers(); await loadAdminPool();
      const cs = await AuctionService.getAuctionState();
      if (cs?.id) await pollBidsForCurrentAuction(cs.id);
    }, 5000);
    return () => { stateSubscription.unsubscribe(); supabase.removeChannel(bidChannel); captainSubscription.unsubscribe(); supabase.removeChannel(soldPlayersChannel); clearInterval(pollInterval); };
  }, []);

  useEffect(() => {
    if (!auctionState?.id) return;
    const loadMessages = async () => { const msgs = await auctionChatService.getMessages(auctionState.id); setChatMessages(msgs); };
    loadMessages();
    const chatSub = auctionChatService.subscribeToMessages(auctionState.id, (msg) => { setChatMessages(prev => prev.some(m => m.id === msg.id) ? prev : [msg, ...prev]); });
    const poll = setInterval(async () => {
      const msgs = await auctionChatService.getMessages(auctionState.id);
      setChatMessages(prev => { const ids = new Set(prev.map(m => m.id)); const nw = msgs.filter(m => !ids.has(m.id)); return nw.length > 0 ? [...nw, ...prev] : prev; });
    }, 3000);
    return () => { chatSub.unsubscribe(); clearInterval(poll); };
  }, [auctionState?.id]);

  useEffect(() => {
    if (!window.location.pathname.includes('/auction')) { if (isHammerActive || hammerStage !== 0) { setIsHammerActive(false); setHammerStage(0); setHammerCountdown(6); isLocalHammerRunning.current = false; if (saleTimeoutRef.current) { window.clearTimeout(saleTimeoutRef.current); saleTimeoutRef.current = null; } } return; }
    if (!auctionState) return;
    if (!isHammerActive || hammerStage === 0) { if (hammerStage === 0) isLocalHammerRunning.current = false; return; }
    if (hammerStage === 3) return;
    if (hammerCountdown > 0) {
      const t = setTimeout(() => { const nc = hammerCountdown - 1; setHammerCountdown(nc); if (isLocalHammerRunning.current) AuctionService.updateHammerState(isHammerActive, hammerStage, nc); }, 1000);
      return () => clearTimeout(t);
    } else {
      if (hammerStage === 1) { setHammerStage(2); setHammerCountdown(6); if (isLocalHammerRunning.current) AuctionService.updateHammerState(true, 2, 6); }
      else if (hammerStage === 2) { setHammerStage(3); setHammerCountdown(0); if (isLocalHammerRunning.current) AuctionService.updateHammerState(true, 3, 0); saleTimeoutRef.current = window.setTimeout(() => { executeSale(); saleTimeoutRef.current = null; }, 800); }
    }
  }, [isHammerActive, hammerStage, hammerCountdown, auctionState]);

  useEffect(() => {
    const load = async () => {
      const state = await AuctionService.getAuctionState();
      if (!state) return;
      const { data, error } = await supabase.from('auction_pool').select('*').eq('auction_id', state.id).eq('is_sold', false).order('player_data->currentMMR', { ascending: false });
      if (!error && data) {
        const { data: sd } = await supabase.from('auction_results').select('player_id').eq('auction_id', state.id);
        const soldIds = new Set(sd?.map((s: any) => s.player_id) || []);
        const seen = new Set<string>(); const players: any[] = [];
        data.forEach((item: any) => { const pid = item.player_id; if (!soldIds.has(pid) && !seen.has(pid)) { seen.add(pid); players.push({ ...item.player_data, _poolType: item.player_type }); } });
        setPoolPlayers(players);
      }
    };
    load();
  }, [auctionState?.id, soldPlayers.length]);

  const loadSoldPlayers = async () => {
    try {
      const state = await AuctionService.getAuctionState();
      if (!state) { setSoldPlayers([]); return; }
      const { data, error } = await supabase.from('auction_results').select('*').eq('auction_id', state.id).order('sold_at', { ascending: false });
      if (!error && data) {
        setSoldPlayers(data.map((item: any) => ({ id: item.id, playerId: item.player_id, playerNickname: item.player_data?.nickname || 'Unknown', playerData: item.player_data, soldTo: item.sold_to_captain_name, soldToCaptainId: item.sold_to_captain_id, teamName: item.sold_to_team_name, soldFor: item.final_price, soldAt: item.sold_at, auctionId: item.auction_id })));
      } else setSoldPlayers([]);
    } catch { setSoldPlayers([]); }
  };

  const loadAllPlayers = async (type?: 'core' | 'support') => {
    try {
      const state = await AuctionService.getAuctionState();
      if (!state) return;
      let query = supabase.from('auction_pool').select('*').eq('auction_id', state.id).eq('is_sold', false).order('player_data->currentMMR', { ascending: false });
      if (type) query = query.eq('player_type', type);
      const { data, error } = await query;
      if (!error && data) {
        const { data: sd } = await supabase.from('auction_results').select('player_id').eq('auction_id', state.id);
        const soldIds = new Set(sd?.map((s: any) => s.player_id) || []);
        const map = new Map();
        data.forEach((item: any) => { const pid = item.player_id; if (pid !== state.current_player_id && !soldIds.has(pid) && !map.has(pid)) map.set(pid, { ...item.player_data, _poolType: item.player_type }); });
        setAllPlayers(Array.from(map.values()));
      }
    } catch { setAllPlayers([]); }
  };

  const loadSoldPlayersInPool = async (type?: 'core' | 'support') => {
    try {
      const state = await AuctionService.getAuctionState();
      if (!state) return;
      const { data: sd, error } = await supabase.from('auction_results').select('*').eq('auction_id', state.id).order('sold_at', { ascending: false });
      if (!error && sd) {
        const map = new Map();
        sd.forEach((r: any) => { const pid = r.player_id; const pt = r.player_data?.playerType || r.player_data?.player_type; if ((!type || pt === type) && !map.has(pid)) map.set(pid, { ...r.player_data, id: pid, soldTo: r.sold_to_team_name, soldFor: r.final_price, soldAt: r.sold_at }); });
        setSoldPlayersInPool(Array.from(map.values()));
      }
    } catch { setSoldPlayersInPool([]); }
  };

  const handleSendMessage = async () => {
    if (!chatInput.trim() || !auctionState?.id) return;
    let senderId: string, senderName: string, senderTeam: string | undefined;
    if (adminSession) { senderId = adminSession.id || adminSession.username; senderName = `Admin: ${adminSession.username}`; senderTeam = undefined; }
    else if (currentCaptainSession) {
      const cid = currentCaptainSession.playerId || currentCaptainSession.id;
      const cap = captains.find(c => c.playerId === cid);
      if (!cap) return;
      senderId = cid; senderName = currentCaptainSession.nickname; senderTeam = cap.teamName;
    } else return;
    const msg = chatInput; setChatInput('');
    const ok = await auctionChatService.sendMessage(auctionState.id, senderId, senderName, senderTeam, msg);
    if (!ok) setChatInput(msg);
  };

  const loadCaptains = async () => { const list = await captainService.getCaptains(); setCaptains(list); };
  const loadAuctionState = async () => { const s = await AuctionService.getAuctionState(); setAuctionState(s); };
  const pollBidsForCurrentAuction = async (_id: string) => {};

  const loadAdminPool = async () => {
    const state = await AuctionService.getAuctionState();
    if (!state) { setAdminPoolPlayers([]); return; }
    const { data: sold } = await supabase.from('auction_results').select('player_id').eq('auction_id', state.id);
    const soldIds = new Set(sold?.map((s: any) => s.player_id) || []);
    const currentId = state.current_player_data?.id;
    const pool = await auctionPoolService.getAvailablePlayers(state.id);
    setAdminPoolPlayers(pool.filter(p => !soldIds.has(p.player_id) && p.player_id !== currentId));
  };

  const handleAdminStart = async () => { setAdminLoading(true); setAdminError(''); const ok = await AuctionService.startAuction(); if (ok) { await loadAuctionState(); await loadAdminPool(); } else setAdminError('Failed to start'); setAdminLoading(false); };
  const handleAdminPause = async () => { setAdminLoading(true); setAdminError(''); const ok = await AuctionService.pauseAuction(); if (ok) await loadAuctionState(); else setAdminError('Failed to pause'); setAdminLoading(false); };
  const handleAdminResume = async () => { setAdminLoading(true); setAdminError(''); const ok = await AuctionService.resumeAuction(); if (ok) await loadAuctionState(); else setAdminError('Failed to resume'); setAdminLoading(false); };
  const handleAdminStop = async () => { setAdminLoading(true); setAdminError(''); const ok = await AuctionService.stopAuction(); if (ok) await loadAuctionState(); else setAdminError('Failed to stop'); setAdminLoading(false); };
  const handleAdminReset = async () => { setAdminLoading(true); setAdminError(''); const ok = await AuctionService.resetAuction(); if (ok) { await loadAuctionState(); await loadAdminPool(); } else setAdminError('Failed to reset'); setAdminLoading(false); };
  const handleAdminSetPlayer = async () => {
    if (!adminSelectedPlayer) return;
    setAdminLoading(true); setAdminError('');
    const poolEntry = adminPoolPlayers.find(p => p.id === adminSelectedPlayer);
    if (!poolEntry) { setAdminError('Player not found'); setAdminLoading(false); return; }
    const playerData = { ...poolEntry.player_data, basePrice: poolEntry.base_price || 0 };
    const ok = await AuctionService.setCurrentPlayer(poolEntry.player_id, playerData);
    if (ok) { setAdminSelectedPlayer(''); await loadAuctionState(); await loadAdminPool(); } else setAdminError('Failed to set player');
    setAdminLoading(false);
  };

  const handlePlaceBid = async () => {
    if (!currentCaptainSession || !bidAmount || !auctionState) return;
    if (isBidding) { setBidError('Processing...'); return; }
    setBidError('');
    const amount = parseInt(bidAmount);
    if (isNaN(amount) || amount < 0) { setBidError('Invalid bid amount'); return; }
    const currentBid = auctionState.highest_bid || 0;
    const hasExisting = auctionState.highest_bidder_id !== null;
    const minBid = hasExisting ? currentBid + 1 : (currentBid > 0 ? currentBid : 1);
    if (amount < minBid) { setBidError(hasExisting ? `Must be > ${currentBid}` : `Min bid is ${minBid}`); return; }
    const cid = currentCaptainSession.playerId || currentCaptainSession.id;
    const cap = captains.find(c => c.playerId === cid);
    if (!cap) { setBidError('Not a captain'); return; }
    if (cap.budget <= 0) { setBidError('No budget left'); return; }
    if (amount > cap.budget) { setBidError(`Max budget: ${cap.budget}g`); return; }
    const teamCount = soldPlayers.filter(p => p.teamName === cap.teamName).length;
    if (teamCount >= 4) { setBidError('Team is full'); return; }
    setIsBidding(true);
    const ok = await AuctionService.placeBid(cid, currentCaptainSession.nickname, cap.teamName, amount);
    if (ok) { setBidAmount(''); setBidError(''); } else setBidError(`Must be > ${auctionState.highest_bid || 0}`);
    setIsBidding(false);
  };

  const handleStartHammer = async () => {
    if (!auctionState?.highest_bidder_id && !selectedTeamForManualAssign) { alert('No bids and no team selected', 'Cannot Start Hammer', 'warning'); return; }
    isLocalHammerRunning.current = true; setHammerStage(1); setHammerCountdown(6); setIsHammerActive(true); setNewBidDuringHammer(false);
    await AuctionService.updateHammerState(true, 1, 6);
  };
  const handleCancelHammer = async () => {
    if (saleTimeoutRef.current) { window.clearTimeout(saleTimeoutRef.current); saleTimeoutRef.current = null; }
    isLocalHammerRunning.current = false; setHammerStage(0); setHammerCountdown(6); setIsHammerActive(false); setNewBidDuringHammer(false);
    await AuctionService.updateHammerState(false, 0, 6);
  };
  const executeSale = async () => {
    if (!window.location.pathname.includes('/auction')) { isLocalHammerRunning.current = false; setIsHammerActive(false); setHammerStage(0); setHammerCountdown(6); return; }
    if (!auctionState) { isLocalHammerRunning.current = false; return; }
    if (!isLocalHammerRunning.current) { await AuctionService.updateHammerState(false, 0, 6); setIsHammerActive(false); setHammerStage(0); setHammerCountdown(6); return; }
    if (!auctionState?.highest_bidder_id && !selectedTeamForManualAssign) { await alert('No bids and no team selected', 'Cannot Complete Sale', 'warning'); isLocalHammerRunning.current = false; await AuctionService.updateHammerState(false, 0, 6); setIsHammerActive(false); setHammerStage(0); setHammerCountdown(6); return; }
    isLocalHammerRunning.current = false; await AuctionService.updateHammerState(false, 0, 6); setIsHammerActive(false); setHammerStage(0); setHammerCountdown(6); await finalizeSale();
  };
  const handleSellPlayer = async () => { if (!auctionState) return; handleStartHammer(); };

  const finalizeSale = async () => {
    if (isSaleInProgress.current) return;
    if (!auctionState) return;
    const { data: existing } = await supabase.from('auction_results').select('id').eq('auction_id', auctionState.id).eq('player_id', auctionState.current_player_id).maybeSingle();
    if (existing) { await AuctionService.setCurrentPlayer('', null); await Promise.all([loadCaptains(), loadSoldPlayers()]); setSelectedTeamForManualAssign(''); setManualAssignPrice(''); return; }
    isSaleInProgress.current = true;
    if (!auctionState.highest_bidder_id && !selectedTeamForManualAssign) { await alert('Select a team', 'Selection Required', 'warning'); isSaleInProgress.current = false; return; }
    if (!auctionState.highest_bidder_id) {
      if (manualAssignPrice.trim() === '') { await alert('Enter a price', 'Invalid Price', 'warning'); isSaleInProgress.current = false; return; }
      const p = parseInt(manualAssignPrice);
      if (isNaN(p) || p < 0) { await alert('Enter valid price', 'Invalid Price', 'warning'); isSaleInProgress.current = false; return; }
    }
    const playerNickname = auctionState.current_player_data?.nickname || 'Unknown Player';
    let finalCaptainId: string, finalCaptainName: string, finalTeamName: string, finalPrice: number;
    if (auctionState.highest_bidder_id) {
      finalCaptainId = auctionState.highest_bidder_id; finalCaptainName = auctionState.highest_bidder_name || ''; finalTeamName = auctionState.highest_bidder_team || ''; finalPrice = auctionState.highest_bid || 0;
    } else {
      const sc = captains.find(c => c.teamName === selectedTeamForManualAssign);
      if (!sc) { await alert('Team not found', 'Error', 'warning'); return; }
      finalCaptainId = sc.playerId; finalCaptainName = sc.playerNickname; finalTeamName = sc.teamName; finalPrice = Math.min(parseInt(manualAssignPrice) || 0, sc.budget);
    }
    const teamCount = soldPlayers.filter(p => p.teamName === finalTeamName).length;
    if (teamCount >= 4) { await alert(`${finalTeamName} is full!`, 'Team Full', 'warning'); return; }
    const wc = captains.find(c => c.playerId === finalCaptainId);
    const newBudget = wc ? wc.budget - finalPrice : 0;
    if (wc) await captainService.updateBudget(finalCaptainId, newBudget);
    const { error } = await supabase.from('auction_results').insert([{ auction_id: auctionState.id, player_id: auctionState.current_player_id, player_data: auctionState.current_player_data, sold_to_captain_id: finalCaptainId, sold_to_captain_name: finalCaptainName, sold_to_team_name: finalTeamName, final_price: finalPrice }]);
    if (error) { await alert(`Failed: ${error.message}`, 'Database Error', 'warning'); isSaleInProgress.current = false; return; }
    await supabase.from('auction_pool').update({ is_sold: true, sold_at: new Date().toISOString() }).eq('auction_id', auctionState.id).eq('player_id', auctionState.current_player_id);
    await auctionChatService.sendMessage(auctionState.id, 'system', 'Auction System', undefined, `${playerNickname} will be playing in Team ${finalTeamName} (Captain: ${finalCaptainName}) for 🪙 ${finalPrice} gold`);
    await AuctionService.setCurrentPlayer('', null);
    await Promise.all([loadCaptains(), loadSoldPlayers()]);
    setSelectedTeamForManualAssign(''); setManualAssignPrice('');
    setSuccessMessage(`${playerNickname} → ${finalTeamName} for ${finalPrice}g`);
    setShowSuccessModal(true);
    isSaleInProgress.current = false;
  };

  const status = auctionState?.status || 'not-started';
  const currentPlayer = auctionState?.current_player_data;
  const teamColors = ['#c9a227','#e05c5c','#5ce0a8','#5c9ee0','#c05ce0','#e0a05c','#5ce0d4','#e05ca8'];
  const getTeamColor = (name: string) => { let h = 0; for (let i = 0; i < name.length; i++) h = name.charCodeAt(i) + ((h << 5) - h); return teamColors[Math.abs(h) % teamColors.length]; };
  const avatarColors = ['from-blue-500 to-indigo-600','from-purple-500 to-pink-600','from-orange-500 to-red-600','from-teal-500 to-cyan-600','from-green-500 to-emerald-600'];
  const getAvatarColor = (name: string) => { let h = 0; for (let i = 0; i < name.length; i++) h = name.charCodeAt(i) + ((h << 5) - h); return avatarColors[Math.abs(h) % avatarColors.length]; };
  const getInitials = (name: string) => { const w = (name || '').trim().split(/\s+/); return w.length >= 2 ? (w[0][0] + w[w.length-1][0]).toUpperCase() : (name || '??').slice(0,2).toUpperCase(); };
  const corePlayers = poolPlayers.filter(p => p._poolType === 'core' || (p.playerType || p.player_type) === 'core');
  const suppPlayers = poolPlayers.filter(p => p._poolType === 'support' || (p.playerType || p.player_type) === 'support');
  const coreSold = soldPlayers.filter(p => (p.playerData?.playerType || p.playerData?.player_type) === 'core');
  const suppSold = soldPlayers.filter(p => (p.playerData?.playerType || p.playerData?.player_type) === 'support');
  const filteredCore = corePlayers.filter(p => !poolSearch || p.nickname?.toLowerCase().includes(poolSearch.toLowerCase()));
  const filteredSupp = suppPlayers.filter(p => !poolSearch || p.nickname?.toLowerCase().includes(poolSearch.toLowerCase()));
  const isAdmin = !!(adminSession || AuthService.isAdminLoggedIn());
  const isCaptain = !!(currentCaptainSession && captains.some(c => c.playerId === (currentCaptainSession.playerId || currentCaptainSession.id)));

  return (
    <>
      <ModalComponent />

      {/* Full-viewport layout below navbar */}
      <div className="fixed inset-0 pt-16 sm:pt-[68px] md:pt-[76px] lg:pt-20 flex flex-col bg-[rgba(5,7,10,0.97)]">

        {/* ── TOP BAR ── */}
        <div className="flex-shrink-0 flex items-center gap-3 px-5 h-12 border-b border-white/8 bg-gradient-to-r from-black/60 via-black/40 to-black/60 backdrop-blur-md">
          {/* Breadcrumb */}
          <div className="flex items-center gap-2">
            <Link to="/" className="text-xs text-gray-600 hover:text-gray-400 font-semibold tracking-wide transition-colors">TRR</Link>
            <span className="text-gray-700 text-xs">/</span>
            <span className="text-xs text-gray-300 font-bold tracking-widest uppercase">Auction</span>
          </div>

          {/* Divider */}
          <div className="w-px h-5 bg-white/10" />

          {/* Status badge */}
          <div className={`flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold border tracking-wider ${
            status === 'live' ? 'bg-emerald-500/10 border-emerald-500/30 text-emerald-400' :
            status === 'paused' ? 'bg-yellow-500/10 border-yellow-500/30 text-yellow-400' :
            status === 'completed' ? 'bg-gray-500/10 border-gray-500/30 text-gray-400' :
            'bg-slate-500/10 border-slate-500/30 text-slate-500'
          }`}>
            <span className={`w-1.5 h-1.5 rounded-full flex-shrink-0 ${status === 'live' ? 'bg-emerald-400 animate-pulse' : status === 'paused' ? 'bg-yellow-400' : 'bg-gray-600'}`} />
            {status === 'live' ? 'LIVE' : status === 'paused' ? 'PAUSED' : status === 'completed' ? 'ENDED' : 'WAITING'}
          </div>

          {/* Stats */}
          {(status === 'live' || status === 'paused') && (
            <>
              <div className="w-px h-5 bg-white/10" />
              <div className="flex items-center gap-4">
                <div className="flex items-center gap-1.5">
                  <span className="text-[10px] text-gray-600 font-bold tracking-widest">CORE</span>
                  <span className="text-sm font-black text-blue-400 font-mono">{coreSold.length}</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <span className="text-[10px] text-gray-600 font-bold tracking-widest">SUPP</span>
                  <span className="text-sm font-black text-emerald-400 font-mono">{suppSold.length}</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <span className="text-[10px] text-gray-600 font-bold tracking-widest">LEFT</span>
                  <span className="text-sm font-black text-white font-mono">{captains.length > 0 ? Math.max(0, captains.length * 4 - soldPlayers.length) : '?'}</span>
                </div>
              </div>
            </>
          )}

          {/* Right side */}
          <div className="ml-auto flex items-center gap-2">
            <button
              onClick={async () => {
                setPlayerPoolTab('available');
                await loadSoldPlayers();
                await loadAllPlayers();
                await loadSoldPlayersInPool();
                setShowPlayerPoolModal(true);
              }}
              className="flex items-center gap-1.5 text-xs px-3.5 py-1.5 rounded-full bg-yellow-500/10 border border-yellow-500/25 text-yellow-400 hover:bg-yellow-500/20 hover:border-yellow-500/40 transition-all font-bold tracking-wider">
              <Gavel className="w-3 h-3" />
              POOL
            </button>
          </div>
        </div>

        {/* ── TEAMS STRIP ── */}
        {captains.length > 0 && (
          <div className="flex-shrink-0 flex gap-2 px-3 py-2 overflow-x-auto border-b border-white/5 bg-black/20 no-scrollbar">
            {captains.map(captain => {
              const teamPlayers = soldPlayers.filter(p => p.soldToCaptainId === captain.playerId);
              const playerCount = teamPlayers.length + 1;
              const isFull = playerCount >= 5;
              const tc = getTeamColor(captain.teamName);
              const budgetPct = Math.max(0, Math.min(100, (captain.budget / 1000) * 100));
              return (
                <div key={captain.playerId} className="flex-shrink-0 min-w-[140px] rounded-xl bg-black/40 backdrop-blur-sm border border-white/8 p-2.5 hover:border-white/15 transition-all" style={{ borderLeftColor: tc, borderLeftWidth: 3 }}>
                  <div className="flex items-center justify-between mb-1.5">
                    <Link to={`/team/${encodeURIComponent(captain.teamName)}`} className="text-sm font-bold truncate max-w-[90px] hover:text-white transition-colors" style={{ color: tc }}>{captain.teamName}</Link>
                    <span className={`text-xs font-semibold ${isFull ? 'text-emerald-400' : 'text-gray-500'}`}>{playerCount}/5</span>
                  </div>
                  <div className="flex items-center gap-2 mb-2">
                    <div className="flex-1 h-1 rounded-full bg-white/10 overflow-hidden">
                      <div className="h-full rounded-full transition-all duration-500" style={{ width: `${budgetPct}%`, background: captain.budget > 500 ? '#34d399' : captain.budget > 200 ? '#fbbf24' : '#f87171' }} />
                    </div>
                    <span className="text-xs font-mono" style={{ color: captain.budget > 500 ? '#34d399' : captain.budget > 200 ? '#fbbf24' : '#f87171' }}>{captain.budget}g</span>
                  </div>
                  <div className="flex gap-1">
                    <div className="w-5 h-5 rounded-full flex items-center justify-center flex-shrink-0 text-black text-[9px] font-black" style={{ background: tc }} title={captain.playerNickname}>C</div>
                    {teamPlayers.map((p, i) => (
                      <div key={i} className={`w-5 h-5 rounded-full bg-gradient-to-br ${getAvatarColor(p.playerNickname)} flex items-center justify-center`} title={p.playerNickname}>
                        <span className="text-[9px] font-bold text-white">{p.playerNickname[0]?.toUpperCase()}</span>
                      </div>
                    ))}
                    {Array.from({ length: Math.max(0, 4 - teamPlayers.length) }).map((_, i) => (
                      <div key={`e-${i}`} className="w-5 h-5 rounded-full border border-dashed border-white/15" />
                    ))}
                  </div>
                </div>
              );
            })}
          </div>
        )}

        {/* ── MAIN 3-COLUMN GRID ── */}
        <div className="flex-1 grid overflow-hidden min-h-0" style={{ gridTemplateColumns: '280px 1fr 260px' }}>

          {/* ═══ LEFT: Player Pool ═══ */}
          <div className="flex flex-col border-r border-white/5 overflow-hidden bg-black/20">
            {/* Pool header */}
            <div className="flex-shrink-0 p-3 border-b border-white/5 bg-black/30">
              <div className="flex items-center gap-2 mb-2">
                <Gavel className="w-3.5 h-3.5 text-yellow-400" />
                <span className="text-sm font-bold text-yellow-400 tracking-wide">PLAYER POOL</span>
                <span className="ml-auto text-xs text-gray-500">{filteredCore.length + filteredSupp.length} left</span>
              </div>
              <div className="relative">
                <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 w-3 h-3 text-gray-500" />
                <input value={poolSearch} onChange={e => setPoolSearch(e.target.value)} placeholder="Search players..."
                  className="w-full pl-7 pr-3 py-1.5 text-xs bg-white/5 border border-white/10 rounded-lg text-white placeholder-gray-600 outline-none focus:border-white/20 transition-colors" />
              </div>
            </div>
            {/* Core / Supp split */}
            <div className="flex-1 grid overflow-hidden min-h-0" style={{ gridTemplateColumns: '1fr 1fr' }}>
              {/* Core */}
              <div className="flex flex-col border-r border-white/5 overflow-hidden">
                <div className="flex-shrink-0 flex items-center gap-1.5 px-2.5 py-1.5 border-b border-white/5 bg-blue-500/5">
                  <span className="text-xs font-bold text-blue-400">CORE</span>
                  <span className="text-xs text-gray-600">{filteredCore.length}</span>
                </div>
                <div className="flex-1 overflow-y-auto custom-scrollbar">
                  {filteredCore.length === 0
                    ? <p className="text-center text-xs text-gray-600 py-4">No core players</p>
                    : filteredCore.map((p, i) => {
                      const isOnBlock = currentPlayer && (currentPlayer.id === p.id || currentPlayer.nickname === p.nickname);
                      return (
                        <div key={p.id || i} className={`flex items-center gap-2 px-2.5 py-2 border-b border-white/5 transition-colors ${isOnBlock ? 'bg-yellow-500/10 border-l-2 border-l-yellow-400' : 'hover:bg-white/3'}`}>
                          <div className="w-6 h-6 rounded-full bg-blue-500/20 border border-blue-500/30 flex items-center justify-center flex-shrink-0 overflow-hidden">
                            {p.avatarUrl ? <img src={p.avatarUrl} alt={p.nickname} className="w-full h-full object-cover" onError={e => (e.currentTarget.style.display = 'none')} /> : <span className="text-[8px] font-bold text-blue-400">{getInitials(p.nickname)}</span>}
                          </div>
                          <div className="flex-1 min-w-0">
                            <div className={`text-xs font-semibold truncate ${isOnBlock ? 'text-yellow-400' : 'text-white'}`}>{p.nickname}</div>
                            <div className="text-[10px] text-blue-400 font-mono">{p.currentMMR || '?'}</div>
                          </div>
                          {isOnBlock && <span className="text-[9px] font-bold text-yellow-400 flex-shrink-0">●</span>}
                        </div>
                      );
                    })}
                </div>
              </div>
              {/* Support */}
              <div className="flex flex-col overflow-hidden">
                <div className="flex-shrink-0 flex items-center gap-1.5 px-2.5 py-1.5 border-b border-white/5 bg-emerald-500/5">
                  <span className="text-xs font-bold text-emerald-400">SUPP</span>
                  <span className="text-xs text-gray-600">{filteredSupp.length}</span>
                </div>
                <div className="flex-1 overflow-y-auto custom-scrollbar">
                  {filteredSupp.length === 0
                    ? <p className="text-center text-xs text-gray-600 py-4">No support players</p>
                    : filteredSupp.map((p, i) => {
                      const isOnBlock = currentPlayer && (currentPlayer.id === p.id || currentPlayer.nickname === p.nickname);
                      return (
                        <div key={p.id || i} className={`flex items-center gap-2 px-2.5 py-2 border-b border-white/5 transition-colors ${isOnBlock ? 'bg-yellow-500/10 border-l-2 border-l-yellow-400' : 'hover:bg-white/3'}`}>
                          <div className="w-6 h-6 rounded-full bg-emerald-500/20 border border-emerald-500/30 flex items-center justify-center flex-shrink-0 overflow-hidden">
                            {p.avatarUrl ? <img src={p.avatarUrl} alt={p.nickname} className="w-full h-full object-cover" onError={e => (e.currentTarget.style.display = 'none')} /> : <span className="text-[8px] font-bold text-emerald-400">{getInitials(p.nickname)}</span>}
                          </div>
                          <div className="flex-1 min-w-0">
                            <div className={`text-xs font-semibold truncate ${isOnBlock ? 'text-yellow-400' : 'text-white'}`}>{p.nickname}</div>
                            <div className="text-[10px] text-emerald-400 font-mono">{p.currentMMR || '?'}</div>
                          </div>
                          {isOnBlock && <span className="text-[9px] font-bold text-yellow-400 flex-shrink-0">●</span>}
                        </div>
                      );
                    })}
                </div>
              </div>
            </div>
          </div>

          {/* ═══ CENTER: Stage ═══ */}
          <div className="flex flex-col overflow-hidden bg-[rgba(5,7,10,0.6)]">
            {status === 'not-started' && (
              <div className="flex-1 flex flex-col items-center justify-center gap-4">
                <AuctionGavel show={true} />
                <p className="text-gray-500 text-sm text-center max-w-xs">The auction will begin shortly. Stay tuned.</p>
              </div>
            )}
            {status === 'completed' && (
              <div className="flex-1 flex flex-col items-center justify-center gap-3">
                <span className="text-5xl">🏆</span>
                <h3 className="text-2xl font-black text-yellow-400 tracking-wider">AUCTION COMPLETE</h3>
                <p className="text-gray-500 text-sm">All players have been assigned.</p>
              </div>
            )}
            {(status === 'live' || status === 'paused') && (
              <div className="flex-1 flex flex-col overflow-hidden">
                {/* Stage hero area */}
                <div className="flex-shrink-0 flex flex-col items-center px-6 py-5 gap-4 border-b border-white/5">
                  {currentPlayer ? (
                    <motion.div key={currentPlayer.id} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.3 }} className="w-full flex flex-col items-center gap-4">
                      {/* LOT + paused */}
                      <div className="flex items-center gap-3">
                        <span className="text-xs text-yellow-400/40 font-mono">LOT #{soldPlayers.length + 1}</span>
                        {status === 'paused' && (
                          <motion.span animate={{ opacity: [0.5, 1, 0.5] }} transition={{ duration: 1.5, repeat: Infinity }} className="text-xs font-bold text-yellow-400">⏸ PAUSED</motion.span>
                        )}
                      </div>
                      {/* Avatar ring */}
                      <div className="relative w-24 h-24">
                        <div className="absolute inset-0 rounded-full border-2 border-yellow-400/20 animate-spin" style={{ animationDuration: '12s', borderStyle: 'dashed' }} />
                        <div className="absolute inset-2 rounded-full overflow-hidden border-2 border-yellow-400/30 bg-black/50">
                          <Avatar src={currentPlayer.avatarUrl} alt={currentPlayer.nickname} name={currentPlayer.nickname} size="lg" className="w-full h-full object-cover" />
                        </div>
                        {(currentPlayer.specialBadge === 'contributor' || currentPlayer.isContributor) && (
                          <span className="absolute -top-1 -right-1 text-base">⭐</span>
                        )}
                      </div>
                      {/* Name */}
                      <h2 className="text-3xl font-black text-white tracking-wide text-center leading-none">{currentPlayer.nickname}</h2>
                      {/* MMR + roles */}
                      <div className="flex items-center gap-2 flex-wrap justify-center">
                        {currentPlayer.currentMMR && <span className="text-sm font-bold text-yellow-400 font-mono">{currentPlayer.currentMMR} MMR</span>}
                        {currentPlayer.roles?.length > 0 && currentPlayer.roles.map((r: any, i: number) => <img key={i} src={r.iconSrc} alt={r.label} title={r.label} className="w-4 h-4 object-contain opacity-80" />)}
                        {currentPlayer.pingRange && <span className="text-xs text-emerald-400">{currentPlayer.pingRange}ms</span>}
                        {currentPlayer.dotabuffUrl && (
                          <a href={currentPlayer.dotabuffUrl} target="_blank" rel="noopener noreferrer" className="flex items-center gap-1 px-2 py-0.5 rounded bg-red-900/30 border border-red-500/30 text-red-300 text-xs hover:bg-red-900/50 transition-colors">
                            <img src="/icons/dotabuff.png" alt="DB" className="w-3 h-3" />DB
                          </a>
                        )}
                      </div>
                      {/* Bid cards */}
                      <div className="flex gap-3 w-full max-w-sm">
                        <div className="flex-1 rounded-xl bg-black/40 backdrop-blur-sm border border-white/8 p-3 text-center">
                          <div className="text-[10px] text-gray-500 font-medium mb-1 tracking-wider">CURRENT BID</div>
                          <div className={`text-2xl font-black ${auctionState?.highest_bid ? 'text-yellow-400' : 'text-white/15'}`}>
                            {auctionState?.highest_bid ? `${auctionState.highest_bid}g` : '—'}
                          </div>
                          {auctionState?.highest_bidder_team && <div className="text-xs text-gray-400 mt-0.5">{auctionState.highest_bidder_team}</div>}
                        </div>
                        <div className="flex-1 rounded-xl bg-black/40 backdrop-blur-sm border border-white/8 p-3 text-center">
                          <div className="text-[10px] text-gray-500 font-medium mb-1 tracking-wider">BASE PRICE</div>
                          <div className="text-2xl font-black text-gray-500">{currentPlayer.basePrice || currentPlayer.base_price || '—'}</div>
                        </div>
                      </div>
                      {/* Hammer */}
                      {isHammerActive && (
                        <motion.div initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }}
                          className="flex flex-col items-center gap-2 px-5 py-3 rounded-xl bg-red-500/8 border border-red-500/30 w-full max-w-sm">
                          <div className="flex items-center gap-2">
                            <motion.span animate={{ scale: [1, 1.3, 1] }} transition={{ duration: 0.5, repeat: Infinity }} className="text-lg">🔨</motion.span>
                            <span className="text-lg font-black text-red-300 tracking-widest">
                              {hammerStage === 1 ? 'GOING ONCE' : hammerStage === 2 ? 'GOING TWICE' : '🔥 SOLD!'}
                            </span>
                          </div>
                          {hammerStage < 3 && (
                            <div className="w-full h-1.5 rounded-full bg-white/10 overflow-hidden">
                              <motion.div className="h-full rounded-full bg-red-500" animate={{ width: `${(hammerCountdown / 6) * 100}%` }} transition={{ duration: 0.3 }} />
                            </div>
                          )}
                        </motion.div>
                      )}
                      {/* Top bids */}
                      <div className="w-full max-w-sm">
                        <TopBidsStandalone auctionId={auctionState?.id || null} currentPlayerId={auctionState?.current_player_data?.id || null} hammerStage={hammerStage} />
                      </div>
                      {/* Admin controls */}
                      {isAdmin && (
                        <div className="w-full max-w-sm flex flex-col gap-2">
                          {!auctionState?.highest_bidder_id && (
                            <div className="flex gap-2">
                              <select value={selectedTeamForManualAssign} onChange={e => setSelectedTeamForManualAssign(e.target.value)}
                                className="flex-1 px-3 py-2 text-xs bg-black/50 border border-white/10 rounded-lg text-white outline-none focus:border-white/20">
                                <option value="">— Assign to Team —</option>
                                {captains.map(c => { const full = soldPlayers.filter(p => p.teamName === c.teamName).length >= 4; return <option key={c.playerId} value={c.teamName} disabled={full}>{c.teamName} ({c.budget}g){full ? ' FULL' : ''}</option>; })}
                              </select>
                              <input type="text" inputMode="numeric" value={manualAssignPrice} onChange={e => setManualAssignPrice(e.target.value.replace(/[^0-9]/g, ''))} placeholder="Price"
                                className="w-16 px-2 py-2 text-xs bg-black/50 border border-white/10 rounded-lg text-white outline-none focus:border-white/20 font-mono" />
                            </div>
                          )}
                          <div className="flex gap-2">
                            <button onClick={isHammerActive ? handleCancelHammer : handleSellPlayer}
                              disabled={!isHammerActive && !auctionState?.highest_bidder_id && !selectedTeamForManualAssign}
                              className={`flex-1 py-2 rounded-lg text-sm font-bold transition-all ${isHammerActive ? 'bg-red-500/20 border border-red-500/40 text-red-300 hover:bg-red-500/30' : 'bg-yellow-500/15 border border-yellow-500/30 text-yellow-400 hover:bg-yellow-500/25 disabled:opacity-30 disabled:cursor-not-allowed'}`}>
                              {isHammerActive ? '✕ CANCEL' : '🔨 HAMMER'}
                            </button>
                            {isHammerActive && newBidDuringHammer && (
                              <motion.button animate={{ scale: [1, 1.03, 1] }} transition={{ duration: 0.8, repeat: Infinity }} onClick={handleCancelHammer}
                                className="px-3 py-2 text-xs font-bold rounded-lg bg-yellow-500/10 border border-yellow-500/30 text-yellow-300">
                                ⚠ NEW BID
                              </motion.button>
                            )}
                          </div>
                        </div>
                      )}
                      {/* Captain bid */}
                      {isCaptain && (() => {
                        const cid = currentCaptainSession.playerId || currentCaptainSession.id;
                        const myCap = captains.find(c => c.playerId === cid);
                        const minBid = (auctionState?.highest_bid || 0) + 1;
                        return (
                          <div className="w-full max-w-sm flex flex-col gap-2">
                            <div className="flex gap-1.5 justify-center">
                              {[10, 50, 100, 200].map(chip => (
                                <button key={chip} onClick={() => setBidAmount(String((parseInt(bidAmount) || (auctionState?.highest_bid || 0)) + chip))}
                                  className="px-3 py-1 text-xs font-bold rounded-full bg-yellow-500/10 border border-yellow-500/20 text-yellow-400 hover:bg-yellow-500/20 transition-all">
                                  +{chip}
                                </button>
                              ))}
                            </div>
                            <div className="flex gap-2">
                              <input type="text" inputMode="numeric" value={bidAmount}
                                onChange={e => { setBidAmount(e.target.value.replace(/[^0-9]/g, '')); setBidError(''); }}
                                onKeyDown={e => e.key === 'Enter' && handlePlaceBid()} placeholder={`Min ${minBid}g`}
                                className="flex-1 px-3 py-2 text-sm bg-black/50 border border-white/10 rounded-lg text-white outline-none focus:border-yellow-400/40 font-mono" />
                              <button onClick={handlePlaceBid} disabled={isBidding || !bidAmount}
                                className="px-5 py-2 text-sm font-black rounded-lg bg-yellow-500/20 border border-yellow-500/40 text-yellow-400 hover:bg-yellow-500/30 transition-all disabled:opacity-40 disabled:cursor-not-allowed">
                                {isBidding ? '…' : 'BID'}
                              </button>
                            </div>
                            {myCap && <div className="text-xs text-center text-gray-500 font-mono">Budget: <span className="text-yellow-400 font-bold">{myCap.budget}g</span></div>}
                            {bidError && <div className="text-xs text-red-400 text-center">{bidError}</div>}
                          </div>
                        );
                      })()}
                    </motion.div>
                  ) : (
                    <div className="flex flex-col items-center gap-3 py-8">
                      <AuctionGavel show={true} />
                      <p className="text-gray-500 text-sm">Waiting for next player...</p>
                    </div>
                  )}
                </div>
                {/* Player detail */}
                {currentPlayer && (
                  <div className="flex-1 overflow-y-auto custom-scrollbar px-6 py-4">
                    <motion.div key={`info-${currentPlayer.id}`} initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.15 }} className="flex flex-col items-center gap-3 max-w-sm mx-auto">
                      <div className="flex gap-3 w-full">
                        <div className="flex-1 rounded-xl bg-black/40 border border-white/8 p-3 text-center">
                          <div className="text-[10px] text-gray-500 mb-2 tracking-wider">CURRENT MMR</div>
                          {currentPlayer.currentMedalLabel && <img src={`/medals/${currentPlayer.currentMedalLabel.replace(' ', '_')}.png`} alt={currentPlayer.currentMedalLabel} className="w-8 h-8 object-contain mx-auto mb-1" onError={e => (e.currentTarget.style.display = 'none')} />}
                          <div className="text-xl font-black text-white">{currentPlayer.currentMMR || 'N/A'}</div>
                        </div>
                        <div className="flex-1 rounded-xl bg-black/40 border border-white/8 p-3 text-center">
                          <div className="text-[10px] text-gray-500 mb-2 tracking-wider">PEAK MMR</div>
                          {currentPlayer.peakMedalLabel && <img src={`/medals/${currentPlayer.peakMedalLabel.replace(' ', '_')}.png`} alt={currentPlayer.peakMedalLabel} className="w-8 h-8 object-contain mx-auto mb-1" onError={e => (e.currentTarget.style.display = 'none')} />}
                          <div className="text-xl font-black text-white">{currentPlayer.peakMMR || 'N/A'}</div>
                        </div>
                      </div>
                      {currentPlayer.seasonBadges?.length > 0 && (
                        <div className="flex gap-1.5 flex-wrap justify-center">
                          {currentPlayer.seasonBadges.map((b: any, i: number) => {
                            const n = typeof b === 'string' ? parseInt(b.replace('s', '')) : b;
                            const sc: Record<number, string> = { 1: 'from-cyan-400 to-indigo-600', 2: 'from-emerald-400 to-teal-600', 3: 'from-fuchsia-400 to-violet-600', 4: 'from-rose-400 to-red-600', 5: 'from-amber-400 to-yellow-600' };
                            return <div key={i} className={`w-6 h-6 rounded-full bg-gradient-to-br ${sc[n] || sc[1]} flex items-center justify-center`}><span className="text-white text-[9px] font-bold">S{n}</span></div>;
                          })}
                        </div>
                      )}
                      {currentPlayer.hasWonCup && (
                        <span className="text-xs px-3 py-1.5 rounded-full bg-yellow-500/10 border border-yellow-500/25 text-yellow-300">
                          {currentPlayer.cupRank === 'gold' ? '🏆' : currentPlayer.cupRank === 'silver' ? '🥈' : '🥉'} Season {currentPlayer.cupSeason} Champion
                        </span>
                      )}
                      {currentPlayer.bio && (
                        <div className="w-full rounded-xl bg-black/30 border border-white/8 p-3">
                          <div className="text-[10px] text-gray-500 mb-1.5 tracking-wider">NOTES</div>
                          <p className="text-xs text-gray-300 leading-relaxed">{currentPlayer.bio}</p>
                        </div>
                      )}
                    </motion.div>
                  </div>
                )}
              </div>
            )}
          </div>

          {/* ═══ RIGHT: Chat ═══ */}
          <div className="flex flex-col border-l border-white/5 overflow-hidden bg-black/20">
            <div className="flex-shrink-0 flex items-center justify-between px-3 py-2.5 border-b border-white/5 bg-black/30">
              <span className="text-sm font-bold text-gray-300 tracking-wide">CHAT</span>
              <span className="text-xs text-yellow-400 font-mono font-bold">{soldPlayers.length} sold</span>
            </div>
            <div className="flex-1 overflow-y-auto custom-scrollbar p-2 flex flex-col gap-1.5 min-h-0">
              {chatMessages.length === 0
                ? <p className="text-center text-xs text-gray-600 py-6">No messages yet</p>
                : chatMessages.map((msg, i) => {
                  const isSys = msg.sender_id === 'system';
                  return (
                    <div key={msg.id || i} className={`rounded-lg p-2.5 border ${isSys ? 'bg-yellow-500/8 border-yellow-500/15' : 'bg-white/3 border-white/5'}`}>
                      <div className="flex items-center gap-1.5 mb-1">
                        <span className={`text-xs font-bold ${isSys ? 'text-yellow-400' : 'text-gray-400'}`}>{msg.sender_name}</span>
                        {msg.sender_team && <span className="text-[10px] text-gray-600 px-1.5 py-0.5 bg-white/5 rounded">{msg.sender_team}</span>}
                      </div>
                      <p className={`text-xs leading-relaxed break-words ${isSys ? 'text-yellow-300/80' : 'text-gray-300'}`}>{msg.message}</p>
                    </div>
                  );
                })}
            </div>
            {(isAdmin || isCaptain) && (
              <div className="flex-shrink-0 flex gap-2 p-2 border-t border-white/5">
                <input type="text" value={chatInput} onChange={e => setChatInput(e.target.value)} onKeyDown={e => e.key === 'Enter' && chatInput.trim() && handleSendMessage()} placeholder="Message..."
                  className="flex-1 px-3 py-1.5 text-xs bg-white/5 border border-white/10 rounded-lg text-white placeholder-gray-600 outline-none focus:border-white/20 transition-colors" />
                <button onClick={handleSendMessage} disabled={!chatInput.trim()}
                  className="px-3 py-1.5 text-sm font-bold rounded-lg bg-yellow-500/15 border border-yellow-500/25 text-yellow-400 hover:bg-yellow-500/25 transition-all disabled:opacity-30 disabled:cursor-not-allowed">
                  →
                </button>
              </div>
            )}
          </div>

        </div>{/* end grid */}
      </div>{/* end fixed layout */}

      {/* ── ADMIN PANEL (slide-in from right) ── */}
      {isAdmin && (
        <>
          <button onClick={() => { setAdminPanelOpen(o => !o); if (!adminPanelOpen) loadAdminPool(); }}
            className="fixed right-0 top-1/2 -translate-y-1/2 z-50 flex flex-col items-center gap-1 px-1.5 py-3 bg-black/80 backdrop-blur-sm border border-yellow-500/40 border-r-0 rounded-l-lg text-yellow-400 cursor-pointer hover:bg-black/90 transition-all"
            style={{ right: adminPanelOpen ? 300 : 0, transition: 'right 0.25s' }}>
            {adminPanelOpen ? <ChevronDown className="w-3 h-3 rotate-90" /> : <ChevronUp className="w-3 h-3 rotate-90" />}
            <span className="text-[9px] font-black tracking-widest" style={{ writingMode: 'vertical-rl' }}>ADMIN</span>
          </button>
          <AnimatePresence>
            {adminPanelOpen && (
              <motion.div initial={{ x: 300 }} animate={{ x: 0 }} exit={{ x: 300 }} transition={{ type: 'tween', duration: 0.25 }}
                className="fixed right-0 top-0 bottom-0 w-[300px] z-40 bg-[rgba(5,7,10,0.98)] backdrop-blur-xl border-l border-yellow-500/20 flex flex-col"
                style={{ paddingTop: '80px' }}>
                <div className="flex-1 overflow-y-auto custom-scrollbar p-4 flex flex-col gap-4">
                  {/* Header */}
                  <div className="flex items-center gap-2 pb-3 border-b border-white/8">
                    <Gavel className="w-4 h-4 text-yellow-400" />
                    <span className="text-base font-black text-yellow-400 tracking-wider">ADMIN CONTROLS</span>
                    <span className={`ml-auto text-xs px-2 py-0.5 rounded-full font-semibold border ${status === 'live' ? 'bg-emerald-500/10 border-emerald-500/30 text-emerald-400' : status === 'paused' ? 'bg-yellow-500/10 border-yellow-500/30 text-yellow-400' : 'bg-gray-500/10 border-gray-500/20 text-gray-500'}`}>
                      {status.toUpperCase()}
                    </span>
                  </div>
                  {adminError && <div className="px-3 py-2 rounded-lg bg-red-500/10 border border-red-500/30 text-xs text-red-400">{adminError}</div>}
                  {/* State controls */}
                  <div className="flex flex-col gap-2">
                    <span className="text-[10px] text-gray-600 font-bold tracking-widest">AUCTION STATE</span>
                    {status === 'not-started' && (
                      <button onClick={handleAdminStart} disabled={adminLoading} className="flex items-center justify-center gap-2 py-2.5 rounded-xl bg-emerald-500/15 border border-emerald-500/30 text-emerald-400 text-sm font-bold hover:bg-emerald-500/25 transition-all disabled:opacity-50">
                        {adminLoading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Play className="w-4 h-4" />} START AUCTION
                      </button>
                    )}
                    {status === 'live' && (
                      <div className="grid grid-cols-2 gap-2">
                        <button onClick={handleAdminPause} disabled={adminLoading} className="flex items-center justify-center gap-1.5 py-2 rounded-xl bg-yellow-500/15 border border-yellow-500/30 text-yellow-400 text-sm font-bold hover:bg-yellow-500/25 transition-all disabled:opacity-50">
                          {adminLoading ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <Pause className="w-3.5 h-3.5" />} PAUSE
                        </button>
                        <button onClick={handleAdminStop} disabled={adminLoading} className="flex items-center justify-center gap-1.5 py-2 rounded-xl bg-red-500/15 border border-red-500/30 text-red-400 text-sm font-bold hover:bg-red-500/25 transition-all disabled:opacity-50">
                          {adminLoading ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <Square className="w-3.5 h-3.5" />} STOP
                        </button>
                      </div>
                    )}
                    {status === 'paused' && (
                      <div className="grid grid-cols-2 gap-2">
                        <button onClick={handleAdminResume} disabled={adminLoading} className="flex items-center justify-center gap-1.5 py-2 rounded-xl bg-emerald-500/15 border border-emerald-500/30 text-emerald-400 text-sm font-bold hover:bg-emerald-500/25 transition-all disabled:opacity-50">
                          {adminLoading ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <Play className="w-3.5 h-3.5" />} RESUME
                        </button>
                        <button onClick={handleAdminStop} disabled={adminLoading} className="flex items-center justify-center gap-1.5 py-2 rounded-xl bg-red-500/15 border border-red-500/30 text-red-400 text-sm font-bold hover:bg-red-500/25 transition-all disabled:opacity-50">
                          {adminLoading ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <Square className="w-3.5 h-3.5" />} STOP
                        </button>
                      </div>
                    )}
                    {status === 'completed' && (
                      <button onClick={handleAdminReset} disabled={adminLoading} className="flex items-center justify-center gap-2 py-2.5 rounded-xl bg-blue-500/15 border border-blue-500/30 text-blue-400 text-sm font-bold hover:bg-blue-500/25 transition-all disabled:opacity-50">
                        {adminLoading ? <Loader2 className="w-4 h-4 animate-spin" /> : <RotateCcw className="w-4 h-4" />} RESET
                      </button>
                    )}
                  </div>
                  {/* Next player */}
                  {(status === 'live' || status === 'paused') && (
                    <div className="flex flex-col gap-3 pt-3 border-t border-white/8">
                      <span className="text-[10px] text-gray-600 font-bold tracking-widest">NEXT PLAYER</span>
                      {currentPlayer && (
                        <div className="flex items-center gap-2 px-3 py-2 rounded-lg bg-yellow-500/8 border border-yellow-500/15">
                          <span className="text-[10px] text-yellow-500 font-bold">ON BLOCK:</span>
                          <span className="text-sm font-bold text-white truncate">{currentPlayer.nickname}</span>
                        </div>
                      )}
                      <div className="flex gap-1">
                        {(['all', 'core', 'support'] as const).map(f => (
                          <button key={f} onClick={() => setAdminPoolFilter(f)}
                            className={`flex-1 py-1 rounded-lg text-xs font-bold transition-all ${adminPoolFilter === f ? (f === 'core' ? 'bg-blue-500/20 border border-blue-500/40 text-blue-400' : f === 'support' ? 'bg-emerald-500/20 border border-emerald-500/40 text-emerald-400' : 'bg-yellow-500/15 border border-yellow-500/30 text-yellow-400') : 'bg-white/3 border border-white/8 text-gray-500 hover:text-gray-300'}`}>
                            {f === 'all' ? 'ALL' : f === 'core' ? 'CORE' : 'SUPP'}
                          </button>
                        ))}
                      </div>
                      <select value={adminSelectedPlayer} onChange={e => setAdminSelectedPlayer(e.target.value)}
                        className="w-full px-3 py-2 text-xs bg-black/50 border border-white/10 rounded-lg text-white outline-none focus:border-white/20">
                        <option value="">— Select player —</option>
                        {adminPoolPlayers.filter(p => adminPoolFilter === 'all' || p.player_type === adminPoolFilter).map(p => (
                          <option key={p.id} value={p.id}>[{p.player_type === 'core' ? 'C' : 'S'}] {p.player_data?.nickname || 'Unknown'} — {p.player_data?.currentMMR || '?'} MMR — {p.base_price || 0}g</option>
                        ))}
                      </select>
                      <button onClick={handleAdminSetPlayer} disabled={adminLoading || !adminSelectedPlayer}
                        className="flex items-center justify-center gap-2 py-2.5 rounded-xl bg-yellow-500/15 border border-yellow-500/30 text-yellow-400 text-sm font-bold hover:bg-yellow-500/25 transition-all disabled:opacity-40 disabled:cursor-not-allowed">
                        {adminLoading ? <Loader2 className="w-4 h-4 animate-spin" /> : <ArrowRight className="w-4 h-4" />} PUT ON BLOCK
                      </button>
                      {adminPoolPlayers.filter(p => adminPoolFilter === 'all' || p.player_type === adminPoolFilter).length === 0 && (
                        <p className="text-xs text-gray-600 text-center">No players in pool</p>
                      )}
                    </div>
                  )}
                  {/* Stats */}
                  <div className="grid grid-cols-3 gap-2 pt-3 border-t border-white/8">
                    <div className="rounded-xl bg-blue-500/8 border border-blue-500/15 p-2 text-center">
                      <div className="text-lg font-black text-blue-400">{adminPoolPlayers.filter(p => p.player_type === 'core').length}</div>
                      <div className="text-[9px] text-gray-600 font-bold tracking-wider">CORE</div>
                    </div>
                    <div className="rounded-xl bg-emerald-500/8 border border-emerald-500/15 p-2 text-center">
                      <div className="text-lg font-black text-emerald-400">{adminPoolPlayers.filter(p => p.player_type === 'support').length}</div>
                      <div className="text-[9px] text-gray-600 font-bold tracking-wider">SUPP</div>
                    </div>
                    <div className="rounded-xl bg-yellow-500/8 border border-yellow-500/15 p-2 text-center">
                      <div className="text-lg font-black text-yellow-400">{soldPlayers.length}</div>
                      <div className="text-[9px] text-gray-600 font-bold tracking-wider">SOLD</div>
                    </div>
                  </div>
                  <button onClick={loadAdminPool} disabled={adminLoading} className="py-1.5 rounded-lg bg-white/3 border border-white/8 text-xs text-gray-500 hover:text-gray-300 hover:bg-white/5 transition-all disabled:opacity-50">
                    ↻ Refresh Pool
                  </button>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </>
      )}

      {/* ── SUCCESS MODAL ── */}
      <AnimatePresence>
        {showSuccessModal && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4"
            onClick={() => setShowSuccessModal(false)}>
            <motion.div initial={{ scale: 0.9, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} exit={{ scale: 0.9, opacity: 0 }}
              className="rounded-2xl p-6 max-w-sm w-full bg-gradient-to-br from-gray-900/95 to-black/95 border border-yellow-500/20 shadow-2xl"
              onClick={e => e.stopPropagation()}>
              <div className="text-center">
                <div className="text-4xl mb-3">✅</div>
                <h3 className="text-lg font-black text-white mb-2">Player Sold!</h3>
                <p className="text-gray-400 text-sm mb-5">{successMessage}</p>
                <button onClick={() => setShowSuccessModal(false)}
                  className="px-6 py-2 rounded-full bg-yellow-500/15 border border-yellow-500/30 text-yellow-400 text-sm font-bold hover:bg-yellow-500/25 transition-all cursor-pointer">
                  Continue
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* ── PLAYER POOL MODAL ── */}
      <AnimatePresence>
        {showPlayerPoolModal && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4"
            onClick={() => setShowPlayerPoolModal(false)}>
            <motion.div initial={{ scale: 0.9, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} exit={{ scale: 0.9, opacity: 0 }}
              className="rounded-2xl p-6 max-w-5xl w-full max-h-[85vh] bg-gradient-to-br from-gray-900/98 to-black/98 border border-white/10 shadow-2xl flex flex-col"
              onClick={e => e.stopPropagation()}>
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-3">
                  <h3 className="text-xl font-black text-white">Player Pool</h3>
                  <div className="flex gap-2">
                    <button onClick={() => setPlayerPoolTab('available')} className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${playerPoolTab === 'available' ? 'bg-blue-500/20 border border-blue-500/40 text-blue-400' : 'bg-white/5 border border-white/10 text-gray-400 hover:text-white'}`}>
                      Available ({allPlayers.length})
                    </button>
                    <button onClick={() => setPlayerPoolTab('sold')} className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${playerPoolTab === 'sold' ? 'bg-emerald-500/20 border border-emerald-500/40 text-emerald-400' : 'bg-white/5 border border-white/10 text-gray-400 hover:text-white'}`}>
                      Sold ({soldPlayersInPool.length})
                    </button>
                  </div>
                  <div className="flex gap-1.5 ml-2">
                    {(['all', 'core', 'support'] as const).map(t => (
                      <button key={t} onClick={async () => { setPlayerPoolType(t === 'all' ? 'core' : t); await loadAllPlayers(t === 'all' ? undefined : t); await loadSoldPlayersInPool(t === 'all' ? undefined : t); }}
                        className={`px-2.5 py-1 rounded-lg text-xs font-bold transition-all ${
                          (t === 'all' && playerPoolType === 'core' && allPlayers.some(p => p._poolType === 'support')) || (t !== 'all' && playerPoolType === t)
                            ? (t === 'core' ? 'bg-blue-500/20 border border-blue-500/40 text-blue-400' : t === 'support' ? 'bg-emerald-500/20 border border-emerald-500/40 text-emerald-400' : 'bg-yellow-500/15 border border-yellow-500/30 text-yellow-400')
                            : 'bg-white/5 border border-white/10 text-gray-500 hover:text-gray-300'
                        }`}>
                        {t === 'all' ? 'ALL' : t === 'core' ? 'CORE' : 'SUPP'}
                      </button>
                    ))}
                  </div>
                </div>
                <button onClick={() => setShowPlayerPoolModal(false)} className="text-gray-500 hover:text-white transition-colors">
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>
                </button>
              </div>
              <div className="overflow-auto flex-1 custom-scrollbar">
                {playerPoolTab === 'available' ? (
                  <table className="w-full text-sm">
                    <thead className="sticky top-0 bg-gray-900/90 backdrop-blur-sm">
                      <tr className="border-b border-white/10">
                        <th className="text-left py-2.5 px-3 text-xs text-gray-500 font-bold tracking-wider">#</th>
                        <th className="text-left py-2.5 px-3 text-xs text-gray-500 font-bold tracking-wider">PLAYER</th>
                        <th className="text-center py-2.5 px-3 text-xs text-gray-500 font-bold tracking-wider">PEAK</th>
                        <th className="text-center py-2.5 px-3 text-xs text-gray-500 font-bold tracking-wider">CURRENT</th>
                        <th className="text-center py-2.5 px-3 text-xs text-gray-500 font-bold tracking-wider">ROLES</th>
                        <th className="text-center py-2.5 px-3 text-xs text-gray-500 font-bold tracking-wider">PING</th>
                        <th className="text-center py-2.5 px-3 text-xs text-gray-500 font-bold tracking-wider">DB</th>
                      </tr>
                    </thead>
                    <tbody>
                      {allPlayers.map((player, idx) => (
                        <tr key={player.id || idx} className="border-b border-white/5 hover:bg-white/3 transition-colors">
                          <td className="py-2.5 px-3 text-gray-500 text-xs">{idx + 1}</td>
                          <td className="py-2.5 px-3"><div className="flex items-center gap-2"><Avatar src={player.avatarUrl} alt={player.nickname} name={player.nickname} size="sm" className="border border-white/10" /><span className="text-white font-semibold text-sm">{player.nickname}</span></div></td>
                          <td className="py-2.5 px-3 text-center"><span className="text-purple-400 font-bold text-sm">{player.peakMMR || 'N/A'}</span></td>
                          <td className="py-2.5 px-3 text-center"><span className="text-blue-400 font-bold text-sm">{player.currentMMR || 'N/A'}</span></td>
                          <td className="py-2.5 px-3"><div className="flex items-center justify-center gap-1">{player.roles?.length > 0 ? player.roles.map((r: any, i: number) => <img key={i} src={r.iconSrc} alt={r.label} title={r.label} className="w-4 h-4 object-contain" />) : <span className="text-gray-600 text-xs">—</span>}</div></td>
                          <td className="py-2.5 px-3 text-center"><span className="text-emerald-400 text-sm">{player.pingRange || '—'}</span></td>
                          <td className="py-2.5 px-3 text-center">{player.dotabuffUrl ? <a href={player.dotabuffUrl} target="_blank" rel="noopener noreferrer" className="inline-flex items-center justify-center w-7 h-7 bg-red-900/40 hover:bg-red-900/60 border border-red-500/30 rounded-lg transition-all" onClick={e => e.stopPropagation()}><img src="/icons/dotabuff.png" alt="DB" className="w-4 h-4" /></a> : <span className="text-gray-600 text-xs">—</span>}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                ) : (
                  <table className="w-full text-sm">
                    <thead className="sticky top-0 bg-gray-900/90 backdrop-blur-sm">
                      <tr className="border-b border-white/10">
                        <th className="text-left py-2.5 px-3 text-xs text-gray-500 font-bold tracking-wider">#</th>
                        <th className="text-left py-2.5 px-3 text-xs text-gray-500 font-bold tracking-wider">PLAYER</th>
                        <th className="text-center py-2.5 px-3 text-xs text-gray-500 font-bold tracking-wider">PEAK</th>
                        <th className="text-center py-2.5 px-3 text-xs text-gray-500 font-bold tracking-wider">CURRENT</th>
                        <th className="text-center py-2.5 px-3 text-xs text-gray-500 font-bold tracking-wider">SOLD TO</th>
                        <th className="text-center py-2.5 px-3 text-xs text-gray-500 font-bold tracking-wider">PRICE</th>
                        <th className="text-center py-2.5 px-3 text-xs text-gray-500 font-bold tracking-wider">DB</th>
                      </tr>
                    </thead>
                    <tbody>
                      {soldPlayersInPool.map((player, idx) => (
                        <tr key={player.id || idx} className="border-b border-white/5 hover:bg-white/3 transition-colors">
                          <td className="py-2.5 px-3 text-gray-500 text-xs">{idx + 1}</td>
                          <td className="py-2.5 px-3"><div className="flex items-center gap-2"><Avatar src={player.avatarUrl} alt={player.nickname} name={player.nickname} size="sm" className="border border-white/10" /><span className="text-white font-semibold text-sm">{player.nickname}</span></div></td>
                          <td className="py-2.5 px-3 text-center"><span className="text-purple-400 font-bold text-sm">{player.peakMMR || 'N/A'}</span></td>
                          <td className="py-2.5 px-3 text-center"><span className="text-blue-400 font-bold text-sm">{player.currentMMR || 'N/A'}</span></td>
                          <td className="py-2.5 px-3 text-center"><span className="text-yellow-400 font-semibold text-sm">{player.soldTo || '—'}</span></td>
                          <td className="py-2.5 px-3 text-center"><span className="text-yellow-400 font-bold text-sm">🪙 {player.soldFor || 0}</span></td>
                          <td className="py-2.5 px-3 text-center">{player.dotabuffUrl ? <a href={player.dotabuffUrl} target="_blank" rel="noopener noreferrer" className="inline-flex items-center justify-center w-7 h-7 bg-red-900/40 hover:bg-red-900/60 border border-red-500/30 rounded-lg transition-all" onClick={e => e.stopPropagation()}><img src="/icons/dotabuff.png" alt="DB" className="w-4 h-4" /></a> : <span className="text-gray-600 text-xs">—</span>}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                )}
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}

import { useState, useEffect } from "react";
import { players } from "../data/players";
import { AuthService } from "../services/auth";

interface AuctionPlayer {
  id: string;
  nickname: string;
  realName?: string;
  avatarUrl: string;
  currentMedalLabel: string;
  currentMMR?: number;
  peakMMR?: number;
  roles: Array<{ iconSrc: string; label: string }>;
  basePrice: number;
  currentBid: number;
  status: 'in-jar' | 'current' | 'sold' | 'unsold';
  team?: string;
  teamId?: string;
  ping?: number;
  gold?: number;
  favoriteHeroes: Array<{ name: string; videoSrc: string }>;
  isBanned?: boolean;
  banReason?: string;
}

interface Team {
  id: string;
  name: string;
  captain: string;
  captainId?: string;
  budget: number;
  spent: number;
  players: AuctionPlayer[];
  color: string;
}

const teamColors = [
  "from-red-500 to-red-700",
  "from-blue-500 to-blue-700", 
  "from-green-500 to-green-700",
  "from-purple-500 to-purple-700",
  "from-yellow-500 to-yellow-700",
  "from-pink-500 to-pink-700",
  "from-indigo-500 to-indigo-700",
  "from-teal-500 to-teal-700",
  "from-orange-500 to-orange-700",
  "from-cyan-500 to-cyan-700",
  "from-lime-500 to-lime-700",
  "from-rose-500 to-rose-700",
  "from-violet-500 to-violet-700",
  "from-emerald-500 to-emerald-700",
  "from-amber-500 to-amber-700",
  "from-sky-500 to-sky-700",
  "from-fuchsia-500 to-fuchsia-700",
  "from-slate-500 to-slate-700",
  "from-zinc-500 to-zinc-700",
  "from-neutral-500 to-neutral-700",
  "from-stone-500 to-stone-700",
  "from-red-600 to-red-800",
  "from-blue-600 to-blue-800",
  "from-green-600 to-green-800",
  "from-purple-600 to-purple-800",
  "from-yellow-600 to-yellow-800",
  "from-pink-600 to-pink-800",
  "from-indigo-600 to-indigo-800",
  "from-teal-600 to-teal-800",
  "from-orange-600 to-orange-800",
  "from-cyan-600 to-cyan-800",
  "from-lime-600 to-lime-800"
];

export default function Auction() {
  const [auctionPlayers, setAuctionPlayers] = useState<AuctionPlayer[]>([]);
  const [auctionTeams, setAuctionTeams] = useState<Team[]>([]);
  const [currentPlayer, setCurrentPlayer] = useState<AuctionPlayer | null>(null);
  const [jarAnimating, setJarAnimating] = useState(false);
  const [currentBid, setCurrentBid] = useState(0);
  const [bidAmount, setBidAmount] = useState("");
  const [selectedTeam, setSelectedTeam] = useState<string>("");
  const [auctionStatus, setAuctionStatus] = useState<'setup' | 'ready' | 'live' | 'completed'>('setup');
  const [timeLeft, setTimeLeft] = useState(60);
  const [isTimerActive, setIsTimerActive] = useState(false);
  
  // Team creation states
  const [showTeamCreation, setShowTeamCreation] = useState(false);
  const [newTeamName, setNewTeamName] = useState("");
  const [selectedCaptain, setSelectedCaptain] = useState("");
  const [availableCaptains, setAvailableCaptains] = useState<AuctionPlayer[]>([]);

  // Authentication state
  const [isAdmin, setIsAdmin] = useState(false);
  const [adminSession, setAdminSession] = useState<any>(null);

  // Captain chat system
  const [captainMessages, setCaptainMessages] = useState<{[teamId: string]: string}>({});
  const [messageInput, setMessageInput] = useState("");
  const [currentPlayerSession, setCurrentPlayerSession] = useState<any>(null);

  // Captain login states
  const [showCaptainLogin, setShowCaptainLogin] = useState(false);
  const [captainSearchQuery, setCaptainSearchQuery] = useState('');
  const [captainPassword, setCaptainPassword] = useState('');
  const [captainLoginError, setCaptainLoginError] = useState('');
  const [captainLoginLoading, setCaptainLoginLoading] = useState(false);
  const [selectedCaptainPlayer, setSelectedCaptainPlayer] = useState<AuctionPlayer | null>(null);
  const [availableCaptainPlayers, setAvailableCaptainPlayers] = useState<AuctionPlayer[]>([]);

  // Ban/Unban Modal states
  const [showBanModal, setShowBanModal] = useState(false);
  const [showUnbanModal, setShowUnbanModal] = useState(false);
  const [selectedPlayerForBan, setSelectedPlayerForBan] = useState<AuctionPlayer | null>(null);
  const [banReason, setBanReason] = useState('');
  
  // Captain selection states
  const [showCaptainSelectionModal, setShowCaptainSelectionModal] = useState(false);
  const [selectedPlayerForCaptain, setSelectedPlayerForCaptain] = useState<AuctionPlayer | null>(null);
  const [newCaptainTeamName, setNewCaptainTeamName] = useState('');

  // Enhanced player cards states
  const [showEnhancedPlayerCards, setShowEnhancedPlayerCards] = useState(false);

  // Check if current user is a captain
  const isUserCaptain = () => {
    if (!currentPlayerSession) return null;
    return auctionTeams.find(team => team.captainId === currentPlayerSession.playerId);
  };

  // Check admin authentication
  useEffect(() => {
    const session = AuthService.getCurrentAdminSession();
    if (session) {
      setIsAdmin(true);
      setAdminSession(session);
    } else {
      setIsAdmin(false);
      setAdminSession(null);
    }

    // Check player session for captain functionality
    const playerSession = AuthService.getCurrentPlayerSession();
    if (playerSession) {
      setCurrentPlayerSession(playerSession);
    }
  }, []);

  // Initialize auction players with enhanced data
  useEffect(() => {
    const initPlayers: AuctionPlayer[] = players.map((player, index) => {
      return {
        id: player.id,
        nickname: player.nickname,
        realName: player.realName,
        avatarUrl: player.avatarUrl,
        currentMedalLabel: player.currentMedalLabel,
        currentMMR: player.currentMMR,
        peakMMR: player.peakMMR,
        roles: player.roles,
        basePrice: 50 + (index * 2), // Base price between 50-500+ gold (reduced increment for more players)
        currentBid: 0,
        status: 'in-jar',
        ping: Math.floor(Math.random() * 150) + 10, // Random ping 10-160ms
        gold: Math.floor(Math.random() * 1000) + 100, // Random gold 100-1100
        favoriteHeroes: [], // Removed to improve performance
        isBanned: false,
        banReason: ''
      };
    });
    setAuctionPlayers(initPlayers);
    setAvailableCaptains(initPlayers);
    setAvailableCaptainPlayers(initPlayers);
  }, []);

  // Timer effect
  useEffect(() => {
    if (isTimerActive && timeLeft > 0) {
      const timer = setInterval(() => {
        setTimeLeft(prev => prev - 1);
      }, 1000);
      return () => clearInterval(timer);
    } else if (timeLeft === 0 && currentPlayer) {
      // Auto-sell to highest bidder or mark as unsold
      handleTimeUp();
    }
  }, [isTimerActive, timeLeft, currentPlayer]);

  const createTeam = () => {
    if (!newTeamName.trim() || !selectedCaptain || auctionTeams.length >= 32) return;

    const captain = availableCaptains.find(p => p.id === selectedCaptain);
    if (!captain) return;

    const newTeam: Team = {
      id: (auctionTeams.length + 1).toString(),
      name: newTeamName.trim(),
      captain: captain.nickname,
      captainId: captain.id,
      budget: 1000, // 1000 gold budget
      spent: 0,
      players: [],
      color: teamColors[auctionTeams.length % teamColors.length]
    };

    setAuctionTeams(prev => [...prev, newTeam]);
    
    // Remove captain from available captains and auction pool
    setAvailableCaptains(prev => prev.filter(p => p.id !== selectedCaptain));
    setAuctionPlayers(prev => prev.filter(p => p.id !== selectedCaptain));
    
    // Reset form
    setNewTeamName("");
    setSelectedCaptain("");
    setShowTeamCreation(false);
  };

  const deleteTeam = (teamId: string) => {
    const team = auctionTeams.find(t => t.id === teamId);
    if (!team) return;

    // Return captain to available captains if they exist
    if (team.captainId) {
      const captain = players.find(p => p.id === team.captainId);
      if (captain) {
        const captainPlayer: AuctionPlayer = {
          id: captain.id,
          nickname: captain.nickname,
          realName: captain.realName,
          avatarUrl: captain.avatarUrl,
          currentMedalLabel: captain.currentMedalLabel,
          currentMMR: captain.currentMMR,
          peakMMR: captain.peakMMR,
          roles: captain.roles,
          basePrice: 50,
          currentBid: 0,
          status: 'in-jar',
          ping: Math.floor(Math.random() * 150) + 10,
          gold: Math.floor(Math.random() * 1000) + 100,
          favoriteHeroes: [],
          isBanned: false,
          banReason: ''
        };
        setAvailableCaptains(prev => [...prev, captainPlayer]);
        setAuctionPlayers(prev => [...prev, captainPlayer]);
      }
    }

    // Return team players to auction pool
    team.players.forEach(player => {
      setAuctionPlayers(prev => [...prev, { ...player, status: 'in-jar', team: undefined, teamId: undefined }]);
    });

    // Remove team
    setAuctionTeams(prev => prev.filter(t => t.id !== teamId));
  };

  const startAuction = () => {
    if (auctionTeams.length < 2) {
      alert("Need at least 2 teams to start auction!");
      return;
    }
    setAuctionStatus('ready');
  };

  const sendCaptainMessage = (teamId: string, message: string) => {
    if (message.trim().length === 0 || message.trim().length > 25) return;
    
    const words = message.trim().split(' ');
    if (words.length > 5) return;
    
    setCaptainMessages(prev => ({
      ...prev,
      [teamId]: message.trim()
    }));
    
    // Clear message after 10 seconds
    setTimeout(() => {
      setCaptainMessages(prev => ({
        ...prev,
        [teamId]: ""
      }));
    }, 10000);
  };

  const handleCaptainLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedCaptainPlayer || !captainPassword.trim()) return;

    setCaptainLoginLoading(true);
    setCaptainLoginError('');

    try {
      // Authenticate with database using player's nickname and password
      const result = await AuthService.loginPlayer(selectedCaptainPlayer.nickname, captainPassword);
      
      if (!result.success) {
        setCaptainLoginError(result.error || 'Login failed');
        setCaptainLoginLoading(false);
        return;
      }

      // Set player session with captain info
      setCurrentPlayerSession({
        playerId: selectedCaptainPlayer.id,
        nickname: selectedCaptainPlayer.nickname,
        type: 'captain',
        avatarUrl: selectedCaptainPlayer.avatarUrl
      });

      // Close login modal
      setShowCaptainLogin(false);
      setSelectedCaptainPlayer(null);
      setCaptainPassword('');
      setCaptainSearchQuery('');
    } catch (error) {
      console.error('Captain login error:', error);
      setCaptainLoginError('Login failed. Please try again.');
    } finally {
      setCaptainLoginLoading(false);
    }
  };

  const handleCaptainLogout = () => {
    setCurrentPlayerSession(null);
    AuthService.clearPlayerSession();
  };

  // Admin Functions for Ban/Unban
  const handleBanPlayer = (player: AuctionPlayer) => {
    setSelectedPlayerForBan(player);
    setShowBanModal(true);
  };

  const confirmBanPlayer = () => {
    if (!selectedPlayerForBan || !banReason.trim()) return;
    
    setAuctionPlayers(prev => 
      prev.map(p => 
        p.id === selectedPlayerForBan.id 
          ? { ...p, isBanned: true, banReason: banReason.trim(), status: 'unsold' }
          : p
      )
    );
    
    setShowBanModal(false);
    setBanReason('');
    setSelectedPlayerForBan(null);
  };

  const handleUnbanPlayer = (player: AuctionPlayer) => {
    setSelectedPlayerForBan(player);
    setShowUnbanModal(true);
  };

  const confirmUnbanPlayer = () => {
    if (!selectedPlayerForBan) return;
    
    setAuctionPlayers(prev => 
      prev.map(p => 
        p.id === selectedPlayerForBan.id 
          ? { ...p, isBanned: false, banReason: '', status: 'in-jar' }
          : p
      )
    );
    
    setShowUnbanModal(false);
    setSelectedPlayerForBan(null);
  };

  // Captain Selection Functions
  const handleSelectCaptain = (player: AuctionPlayer) => {
    setSelectedPlayerForCaptain(player);
    setShowCaptainSelectionModal(true);
  };

  const confirmCaptainSelection = () => {
    if (!selectedPlayerForCaptain || !newCaptainTeamName.trim() || auctionTeams.length >= 32) return;

    const newTeam: Team = {
      id: `team-${Date.now()}`,
      name: newCaptainTeamName.trim(),
      captain: selectedPlayerForCaptain.nickname,
      captainId: selectedPlayerForCaptain.id,
      budget: 1000,
      spent: 0,
      players: [],
      color: teamColors[auctionTeams.length % teamColors.length]
    };

    setAuctionTeams(prev => [...prev, newTeam]);
    
    // Remove player from auction pool and available captains
    setAuctionPlayers(prev => 
      prev.map(p => 
        p.id === selectedPlayerForCaptain.id 
          ? { ...p, status: 'sold', team: newTeam.name, teamId: newTeam.id }
          : p
      )
    );
    
    setAvailableCaptains(prev => prev.filter(p => p.id !== selectedPlayerForCaptain.id));

    setShowCaptainSelectionModal(false);
    setNewCaptainTeamName('');
    setSelectedPlayerForCaptain(null);
  };

  const handleTimeUp = () => {
    if (currentPlayer && currentBid > 0 && selectedTeam) {
      sellPlayer(selectedTeam);
    } else if (currentPlayer) {
      // Mark as unsold
      setAuctionPlayers(prev => 
        prev.map(p => p.id === currentPlayer.id ? { ...p, status: 'unsold' } : p)
      );
      nextPlayer();
    }
  };

  const drawNextPlayer = () => {
    const availablePlayers = auctionPlayers.filter(p => p.status === 'in-jar');
    if (availablePlayers.length === 0) {
      setAuctionStatus('completed');
      return;
    }

    setJarAnimating(true);
    setAuctionStatus('live');
    
    // Simulate jar animation delay
    setTimeout(() => {
      const randomIndex = Math.floor(Math.random() * availablePlayers.length);
      const selectedPlayer = availablePlayers[randomIndex];
      
      setCurrentPlayer(selectedPlayer);
      setCurrentBid(selectedPlayer.basePrice);
      setBidAmount("");
      setSelectedTeam("");
      setTimeLeft(60);
      setIsTimerActive(true);
      
      // Update player status
      setAuctionPlayers(prev => 
        prev.map(p => p.id === selectedPlayer.id ? { ...p, status: 'current', currentBid: selectedPlayer.basePrice } : p)
      );
      
      setJarAnimating(false);
    }, 2000);
  };

  const placeBid = (teamId: string, amount: number) => {
    if (amount > currentBid && currentPlayer) {
      setCurrentBid(amount);
      setSelectedTeam(teamId);
      
      // Update player's current bid
      setAuctionPlayers(prev => 
        prev.map(p => p.id === currentPlayer.id ? { ...p, currentBid: amount } : p)
      );
      
      // Reset timer to 10 seconds on new bid
      setTimeLeft(10);
    }
  };

  const sellPlayer = (teamId: string) => {
    if (!currentPlayer) return;

    const team = auctionTeams.find(t => t.id === teamId);
    if (!team) return;

    // Update teams
    setAuctionTeams(prev => prev.map(t => {
      if (t.id === teamId) {
        return {
          ...t,
          spent: t.spent + currentBid,
          players: [...t.players, { ...currentPlayer, status: 'sold', team: t.name, teamId }]
        };
      }
      return t;
    }));

    // Update player status
    setAuctionPlayers(prev => 
      prev.map(p => p.id === currentPlayer.id ? { 
        ...p, 
        status: 'sold', 
        team: team.name,
        teamId,
        currentBid 
      } : p)
    );

    nextPlayer();
  };

  const nextPlayer = () => {
    setCurrentPlayer(null);
    setCurrentBid(0);
    setSelectedTeam("");
    setIsTimerActive(false);
    setTimeLeft(60);
    
    // Check if auction should continue
    const remainingPlayers = auctionPlayers.filter(p => p.status === 'in-jar');
    if (remainingPlayers.length === 0) {
      setAuctionStatus('completed');
    } else {
      setAuctionStatus('ready');
    }
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const getRoleIcon = (roles: Array<{ iconSrc: string; label: string }>) => {
    return roles[0]?.iconSrc || '/icons/pos_1.png';
  };

  const getRoleLabel = (roles: Array<{ iconSrc: string; label: string }>) => {
    return roles[0]?.label || 'Carry';
  };

  return (
    <>
      {/* Fixed Background - Same pattern as Home */}
      <div className="fixed inset-0 z-0">
        <div 
          className="absolute inset-0 bg-cover bg-center bg-no-repeat"
          style={{ backgroundImage: 'url(/bg6.webp)' }}
        />
        <div className="absolute inset-0 bg-black/60" />
      </div>

      <main className="relative min-h-screen flex flex-col w-full z-10 pb-20" style={{ paddingTop: '80px' }}>
        <div className="flex-1 px-4 md:px-6 py-4">
          {/* Hero Section - Compact */}
          <div className="text-center mb-8">
            <div className="relative inline-block mb-4">
              <div className="absolute inset-0 bg-gradient-to-r from-yellow-400/20 via-orange-400/20 to-red-400/20 blur-2xl rounded-full"></div>
              <h1 className="relative text-2xl md:text-4xl lg:text-5xl font-black bg-gradient-to-r from-yellow-400 via-orange-400 to-red-400 bg-clip-text text-transparent mb-2 flex items-center justify-center gap-3">
                <div className="w-10 h-10 md:w-12 md:h-12 bg-gradient-to-br from-yellow-500 to-orange-600 rounded-xl flex items-center justify-center shadow-xl shadow-orange-500/30">
                  <svg className="w-6 h-6 md:w-7 md:h-7 text-white" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M12 2L15.09 8.26L22 9L17 14L18.18 21L12 17.77L5.82 21L7 14L2 9L8.91 8.26L12 2Z"/>
                  </svg>
                </div>
                Player Auction
              </h1>
            </div>
            <p className="text-sm md:text-base text-gray-300 max-w-xl mx-auto">
              India's premier amateur league auction system.
            </p>
          </div>

          {/* Captain Login and Player Showcase - Side by Side */}
          {!isAdmin && !currentPlayerSession && auctionStatus === 'setup' && (
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
              {/* Captain Login Card */}
              <div className="group relative overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-br from-yellow-500/20 via-orange-500/20 to-red-500/20 blur-lg"></div>
                <div className="relative bg-black/60 backdrop-blur-xl border border-yellow-500/30 rounded-xl p-6 hover:border-yellow-400/50 transition-all duration-300 hover:scale-[1.02] hover:shadow-lg hover:shadow-yellow-500/20">
                  <div className="flex items-center gap-4 mb-4">
                    <div className="w-14 h-14 bg-gradient-to-br from-yellow-500 to-orange-600 rounded-lg flex items-center justify-center shadow-lg">
                      <span className="text-2xl">👑</span>
                    </div>
                    <div>
                      <h3 className="text-xl font-bold text-yellow-300 mb-1">Team Captain</h3>
                      <p className="text-yellow-400/80 text-sm">Lead your squad to victory</p>
                    </div>
                  </div>
                  <p className="text-gray-300 mb-6 text-sm leading-relaxed">
                    Ready to build your dream team? Login as a captain to participate in the auction and bid on the best players.
                  </p>
                  <button
                    onClick={() => setShowCaptainLogin(true)}
                    className="w-full px-6 py-3 bg-gradient-to-r from-yellow-600 to-orange-600 hover:from-yellow-500 hover:to-orange-500 text-white font-semibold rounded-lg transition-all duration-300 transform hover:scale-[1.02] shadow-md"
                  >
                    🏆 Captain Login
                  </button>
                </div>
              </div>

              {/* Player Showcase */}
              <div className="group relative overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-br from-blue-500/20 via-purple-500/20 to-indigo-500/20 blur-lg"></div>
                <div className="relative bg-black/60 backdrop-blur-xl border border-blue-500/30 rounded-xl p-6 hover:border-blue-400/50 transition-all duration-300 hover:scale-[1.02] hover:shadow-lg hover:shadow-blue-500/20">
                  <div className="flex items-center gap-4 mb-4">
                    <div className="w-14 h-14 bg-gradient-to-br from-blue-500 to-purple-600 rounded-lg flex items-center justify-center shadow-lg">
                      <span className="text-2xl">🎯</span>
                    </div>
                    <div>
                      <h3 className="text-xl font-bold text-blue-300 mb-1">Player Showcase</h3>
                      <p className="text-blue-400/80 text-sm">Explore our talented players</p>
                    </div>
                  </div>
                  <p className="text-gray-300 mb-6 text-sm leading-relaxed">
                    Browse through our roster of {auctionPlayers.length} skilled players while the auction is being prepared.
                  </p>
                  <button 
                    onClick={() => setShowEnhancedPlayerCards(true)}
                    className="w-full px-6 py-3 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-500 hover:to-purple-500 text-white font-semibold rounded-lg transition-all duration-300 transform hover:scale-[1.02] shadow-md"
                  >
                    👥 View All Players
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* Live Auction Display with Curtain Animation */}
          {auctionStatus === 'live' && currentPlayer && (
            <div className="max-w-4xl mx-auto">
              {/* Curtain Animation Container */}
              <div className="relative h-96 bg-black/40 backdrop-blur-sm rounded-2xl border border-red-500/30 overflow-hidden">
                {/* Animated Curtains */}
                <div className="absolute inset-0 flex">
                  <div className="w-1/2 h-full bg-gradient-to-r from-red-900 to-red-700 transform -translate-x-full animate-curtain-left border-r-2 border-gold-400"></div>
                  <div className="w-1/2 h-full bg-gradient-to-l from-red-900 to-red-700 transform translate-x-full animate-curtain-right border-l-2 border-gold-400"></div>
                </div>

                {/* Live Auction Content */}
                <div className="absolute inset-0 flex items-center justify-center p-8 animate-fade-in-delayed">
                  <div className="text-center">
                    <div className="mb-6">
                      <div className="inline-block bg-red-600/20 backdrop-blur-sm rounded-full px-4 py-2 border border-red-500/50 mb-4">
                        <span className="text-red-300 text-sm font-bold">🔴 LIVE AUCTION</span>
                      </div>
                    </div>

                    {/* Current Player Card */}
                    <div className="bg-black/60 backdrop-blur-xl rounded-2xl p-6 border border-yellow-500/40 max-w-md mx-auto">
                      <div className="flex items-center justify-center mb-4">
                        <img 
                          src={currentPlayer.avatarUrl} 
                          alt={currentPlayer.nickname}
                          className="w-20 h-20 rounded-full object-cover border-4 border-yellow-400 shadow-lg"
                          onError={(e) => {
                            e.currentTarget.src = "/avatars/default.jpg";
                          }}
                        />
                      </div>
                      
                      <h3 className="text-2xl font-bold text-white mb-2">{currentPlayer.nickname}</h3>
                      {currentPlayer.realName && (
                        <p className="text-slate-400 mb-4">{currentPlayer.realName}</p>
                      )}

                      <div className="flex items-center justify-center gap-2 text-sm mb-4">
                        <span className="text-slate-400">🏅</span>
                        <span className="text-blue-400">{currentPlayer.currentMedalLabel}</span>
                        <span className="text-slate-400">•</span>
                        <span className="text-green-400">MMR: {currentPlayer.currentMMR}</span>
                      </div>

                      {/* Current Bid Display */}
                      <div className="bg-gradient-to-r from-yellow-600/20 to-orange-600/20 backdrop-blur-sm rounded-xl p-4 border border-yellow-500/40 mb-4">
                        <div className="text-center">
                          <div className="text-yellow-300 text-sm font-semibold mb-1">Current Bid</div>
                          <div className="text-yellow-400 text-3xl font-bold">🪙{currentBid}</div>
                          {selectedTeam && (
                            <div className="text-yellow-300/80 text-xs mt-1">
                              Leading: {auctionTeams.find(t => t.id === selectedTeam)?.name}
                            </div>
                          )}
                        </div>
                      </div>

                      {/* Timer */}
                      <div className="flex items-center justify-center gap-2 text-lg">
                        <span className="text-red-400">⏱️</span>
                        <span className="text-white font-bold">{formatTime(timeLeft)}</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Admin Welcome - Compact */}
          {isAdmin && (
            <div className="mb-6 max-w-3xl mx-auto">
              <div className="relative overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-br from-green-500/20 via-emerald-500/20 to-teal-500/20 blur-lg"></div>
                <div className="relative bg-black/70 backdrop-blur-xl border border-green-500/40 rounded-xl p-5">
                  <div className="flex flex-col md:flex-row items-center justify-between gap-4">
                    <div className="flex items-center gap-4">
                      <div className="w-14 h-14 bg-gradient-to-br from-green-500 to-emerald-600 rounded-xl flex items-center justify-center shadow-lg">
                        👑
                      </div>
                      <div>
                        <h3 className="text-xl font-bold text-green-300 mb-1">Admin Control Panel</h3>
                        <p className="text-green-400/80 text-sm">Welcome, <span className="font-semibold">{adminSession?.username}</span> ({adminSession?.role})</p>
                      </div>
                    </div>
                    <div className="flex flex-col sm:flex-row gap-3">
                      <button
                        onClick={() => setShowEnhancedPlayerCards(true)}
                        className="px-4 py-2 bg-blue-600/20 hover:bg-blue-600/30 border border-blue-500/50 text-blue-300 rounded-lg text-sm font-semibold transition-all duration-300 hover:scale-105 shadow-md"
                      >
                        👥 View Players
                      </button>
                      <button
                        onClick={() => {
                          AuthService.clearAdminSession();
                          setIsAdmin(false);
                          setAdminSession(null);
                        }}
                        className="px-4 py-2 bg-red-600/20 hover:bg-red-600/30 border border-red-500/50 text-red-300 rounded-lg text-sm font-semibold transition-all duration-300 hover:scale-105 shadow-md"
                      >
                        🚪 Logout
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Captain Welcome - Compact */}
          {!isAdmin && currentPlayerSession && (
            <div className="mb-6 max-w-3xl mx-auto">
              <div className="relative overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-br from-blue-500/20 via-purple-500/20 to-indigo-500/20 blur-lg"></div>
                <div className="relative bg-black/70 backdrop-blur-xl border border-blue-500/40 rounded-xl p-5">
                  <div className="flex flex-col md:flex-row items-center justify-between gap-4">
                    <div className="flex items-center gap-4">
                      <div className="relative">
                        <img 
                          src={currentPlayerSession.avatarUrl} 
                          alt={currentPlayerSession.nickname}
                          className="w-14 h-14 rounded-xl object-cover border-3 border-blue-400 shadow-lg"
                          onError={(e) => {
                            e.currentTarget.src = "/avatars/default.jpg";
                          }}
                        />
                        <div className="absolute -top-1 -right-1 w-6 h-6 bg-gradient-to-br from-yellow-400 to-orange-500 rounded-full flex items-center justify-center shadow-md">
                          👑
                        </div>
                      </div>
                      <div>
                        <h3 className="text-xl font-bold text-blue-300 mb-1">Captain Dashboard</h3>
                        <p className="text-blue-400/80 text-sm">Welcome, Captain <span className="font-semibold">{currentPlayerSession.nickname}</span></p>
                      </div>
                    </div>
                    <button
                      onClick={handleCaptainLogout}
                      className="px-4 py-2 bg-red-600/20 hover:bg-red-600/30 border border-red-500/50 text-red-300 rounded-lg text-sm font-semibold transition-all duration-300 hover:scale-105 shadow-md"
                    >
                      🚪 Logout
                    </button>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Captain Login Modal */}
          {showCaptainLogin && (
            <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50" onClick={() => setShowCaptainLogin(false)}>
              <div className="bg-slate-900 border border-slate-600 rounded-2xl p-8 max-w-md w-full" onClick={e => e.stopPropagation()}>
                <div className="flex justify-between items-center mb-6">
                  <h3 className="text-2xl font-bold text-white flex items-center gap-2">
                    👑 Captain Login
                  </h3>
                  <button 
                    onClick={() => {
                      setShowCaptainLogin(false);
                      setSelectedCaptainPlayer(null);
                      setCaptainSearchQuery('');
                      setCaptainPassword('');
                    }}
                    className="text-slate-400 hover:text-white text-2xl cursor-pointer"
                  >
                    ✕
                  </button>
                </div>
                
                {!selectedCaptainPlayer ? (
                  /* Player Selection */
                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium text-slate-300 mb-2">
                        Search for your player profile
                      </label>
                      <input
                        type="text"
                        value={captainSearchQuery}
                        onChange={(e) => setCaptainSearchQuery(e.target.value)}
                        placeholder="Search by nickname or real name..."
                        className="w-full px-4 py-3 bg-slate-800 border border-slate-600 rounded-lg text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-yellow-500/50 focus:border-yellow-500/50"
                      />
                    </div>

                    {/* Player Results */}
                    {captainSearchQuery && (
                      <div className="max-h-60 overflow-y-auto space-y-2">
                        {availableCaptainPlayers
                          .filter(player => 
                            player.nickname.toLowerCase().includes(captainSearchQuery.toLowerCase()) ||
                            (player.realName && player.realName.toLowerCase().includes(captainSearchQuery.toLowerCase()))
                          )
                          .slice(0, 8)
                          .map((player) => (
                            <button
                              key={player.id}
                              onClick={() => {
                                setSelectedCaptainPlayer(player);
                                setCaptainSearchQuery('');
                              }}
                              className="w-full flex items-center gap-3 p-3 bg-slate-800/50 hover:bg-slate-700/50 border border-slate-600/30 hover:border-yellow-500/50 rounded-lg transition-all cursor-pointer"
                            >
                              <img 
                                src={player.avatarUrl} 
                                alt={player.nickname}
                                className="w-10 h-10 rounded-full object-cover border-2 border-slate-500"
                                onError={(e) => {
                                  e.currentTarget.src = "/avatars/default.jpg";
                                }}
                              />
                              <div className="flex-1 text-left">
                                <div className="text-white font-semibold text-sm">{player.nickname}</div>
                                {player.realName && (
                                  <div className="text-slate-400 text-xs">{player.realName}</div>
                                )}
                                <div className="text-slate-500 text-xs">{player.currentMedalLabel}</div>
                              </div>
                            </button>
                          ))}
                      </div>
                    )}

                    {!captainSearchQuery && (
                      <div className="text-center py-8 text-slate-400">
                        <div className="text-4xl mb-2">👑</div>
                        <p className="text-sm">Search for your player profile to login as captain</p>
                      </div>
                    )}
                  </div>
                ) : (
                  /* Password Entry */
                  <form onSubmit={handleCaptainLogin} className="space-y-4">
                    {/* Selected Player Display */}
                    <div className="text-center mb-4">
                      <img 
                        src={selectedCaptainPlayer.avatarUrl} 
                        alt={selectedCaptainPlayer.nickname}
                        className="w-16 h-16 rounded-full object-cover border-4 border-yellow-500 mx-auto mb-2"
                        onError={(e) => {
                          e.currentTarget.src = "/avatars/default.jpg";
                        }}
                      />
                      <h4 className="text-white font-bold">{selectedCaptainPlayer.nickname}</h4>
                      {selectedCaptainPlayer.realName && (
                        <p className="text-slate-400 text-sm">{selectedCaptainPlayer.realName}</p>
                      )}
                      <p className="text-slate-500 text-xs">{selectedCaptainPlayer.currentMedalLabel}</p>
                      <button
                        type="button"
                        onClick={() => setSelectedCaptainPlayer(null)}
                        className="text-yellow-400 hover:text-yellow-300 text-sm mt-2 cursor-pointer"
                      >
                        ← Choose different player
                      </button>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-slate-300 mb-2">
                        Password <span className="text-red-400">*</span>
                      </label>
                      <input
                        type="password"
                        value={captainPassword}
                        onChange={(e) => setCaptainPassword(e.target.value)}
                        placeholder="Enter your password"
                        className="w-full px-4 py-3 bg-slate-800 border border-slate-600 rounded-lg text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-yellow-500/50 focus:border-yellow-500/50"
                        required
                        autoFocus
                      />
                    </div>

                    {captainLoginError && (
                      <div className="p-3 bg-red-900/40 border border-red-500/60 rounded-lg">
                        <p className="text-red-200 text-sm">{captainLoginError}</p>
                      </div>
                    )}

                    <div className="flex gap-3 pt-4">
                      <button
                        type="button"
                        onClick={() => setSelectedCaptainPlayer(null)}
                        className="flex-1 px-4 py-3 bg-slate-700 hover:bg-slate-600 text-white rounded-lg font-semibold transition-colors cursor-pointer"
                      >
                        Back
                      </button>
                      <button
                        type="submit"
                        disabled={captainLoginLoading || !captainPassword.trim()}
                        className="flex-1 px-4 py-3 bg-gradient-to-r from-yellow-600 to-orange-600 hover:from-yellow-700 hover:to-orange-700 disabled:from-slate-600 disabled:to-slate-700 disabled:cursor-not-allowed text-white rounded-lg font-semibold transition-all cursor-pointer"
                      >
                        {captainLoginLoading ? 'Logging in...' : 'Login'}
                      </button>
                    </div>
                  </form>
                )}

                {!selectedCaptainPlayer && (
                  <div className="bg-slate-800/50 rounded-lg p-4 mt-4">
                    <h4 className="text-sm font-semibold text-slate-300 mb-2">Captain Features:</h4>
                    <ul className="text-xs text-slate-400 space-y-1">
                      <li>• Send messages during live auction</li>
                      <li>• Messages visible to all participants</li>
                      <li>• Maximum 5 words per message</li>
                      <li>• Messages auto-clear after 10 seconds</li>
                    </ul>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* Team Setup Phase - Admin Only */}
          {isAdmin && auctionStatus === 'setup' && (
            <div className="space-y-8">
              {/* Team Creation Section */}
              <div className="bg-slate-900/80 border border-slate-600/50 rounded-2xl p-8 backdrop-blur-sm">
                <div className="flex justify-between items-center mb-6">
                  <h2 className="text-2xl font-bold text-white flex items-center gap-2">
                    <span className="text-3xl">⚔️</span>
                    Team Setup ({auctionTeams.length}/32 Teams)
                  </h2>
                  <button
                    onClick={() => setShowTeamCreation(true)}
                    disabled={auctionTeams.length >= 32 || availableCaptains.length === 0}
                    className="px-6 py-3 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 disabled:from-slate-600 disabled:to-slate-700 disabled:cursor-not-allowed text-white font-bold rounded-lg transition-all duration-300 cursor-pointer"
                  >
                    ➕ Create Team
                  </button>
                </div>

                {/* Teams Grid */}
                {auctionTeams.length > 0 ? (
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 mb-6">
                    {auctionTeams.map((team) => (
                      <div key={team.id} className={`bg-gradient-to-br ${team.color} p-4 rounded-xl text-white relative group`}>
                        <button
                          onClick={() => deleteTeam(team.id)}
                          className="absolute top-2 right-2 w-6 h-6 bg-red-600 hover:bg-red-700 rounded-full flex items-center justify-center text-xs opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer"
                        >
                          ✕
                        </button>
                        <h3 className="font-bold text-lg mb-2">{team.name}</h3>
                        <div className="text-sm opacity-90">
                          <div className="flex items-center gap-2 mb-1">
                            <span>👑</span>
                            <span>{team.captain}</span>
                          </div>
                          <div>🪙 {team.budget} Gold Budget</div>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-12 text-slate-400">
                    <div className="text-6xl mb-4">🏆</div>
                    <h3 className="text-xl font-semibold mb-2">No Teams Created Yet</h3>
                    <p>Create your first team to begin the auction setup</p>
                  </div>
                )}

                {/* Start Auction Button */}
                {auctionTeams.length >= 2 && (
                  <div className="text-center">
                    <button
                      onClick={startAuction}
                      className="px-8 py-4 bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 text-white font-bold rounded-xl text-lg transform hover:scale-105 transition-all duration-300 shadow-lg cursor-pointer"
                    >
                      🚀 Start Auction with {auctionTeams.length} Teams
                    </button>
                  </div>
                )}
              </div>

              {/* Available Captains */}
              <div className="bg-slate-900/80 border border-slate-600/50 rounded-2xl p-8 backdrop-blur-sm">
                <h3 className="text-xl font-bold text-white mb-4 flex items-center gap-2">
                  <span className="text-2xl">👑</span>
                  Available Captains ({availableCaptains.length})
                </h3>
                <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 xl:grid-cols-8 gap-4 max-h-96 overflow-y-auto">
                  {availableCaptains.map((captain) => (
                    <div key={captain.id} className="bg-slate-800/50 border border-slate-600/30 rounded-lg p-3 text-center">
                      <img 
                        src={captain.avatarUrl} 
                        alt={captain.nickname}
                        className="w-12 h-12 rounded-full object-cover mx-auto mb-2"
                        onError={(e) => {
                          e.currentTarget.src = "/avatars/default.jpg";
                        }}
                      />
                      <div className="text-white text-sm font-semibold truncate">{captain.nickname}</div>
                      <div className="text-slate-400 text-xs">{captain.currentMedalLabel}</div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* Team Creation Modal - Admin Only */}
          {isAdmin && showTeamCreation && (
            <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50" onClick={() => setShowTeamCreation(false)}>
              <div className="bg-slate-900 border border-slate-600 rounded-2xl p-8 max-w-md w-full" onClick={e => e.stopPropagation()}>
                <div className="flex justify-between items-center mb-6">
                  <h3 className="text-2xl font-bold text-white">Create New Team</h3>
                  <button 
                    onClick={() => setShowTeamCreation(false)}
                    className="text-slate-400 hover:text-white text-2xl cursor-pointer"
                  >
                    ✕
                  </button>
                </div>
                
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-slate-300 mb-2">
                      Team Name <span className="text-red-400">*</span>
                    </label>
                    <input
                      type="text"
                      value={newTeamName}
                      onChange={(e) => setNewTeamName(e.target.value)}
                      placeholder="Enter team name"
                      className="w-full px-4 py-3 bg-slate-800 border border-slate-600 rounded-lg text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500/50"
                      maxLength={30}
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-slate-300 mb-2">
                      Select Captain <span className="text-red-400">*</span>
                    </label>
                    <select
                      value={selectedCaptain}
                      onChange={(e) => setSelectedCaptain(e.target.value)}
                      className="w-full px-4 py-3 bg-slate-800 border border-slate-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500/50"
                    >
                      <option value="">Choose a captain...</option>
                      {availableCaptains.map((captain) => (
                        <option key={captain.id} value={captain.id}>
                          {captain.nickname} - {captain.currentMedalLabel}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div className="bg-slate-800/50 rounded-lg p-4">
                    <h4 className="text-sm font-semibold text-slate-300 mb-2">Team Details:</h4>
                    <ul className="text-xs text-slate-400 space-y-1">
                      <li>• Starting budget: 🪙1000 Gold</li>
                      <li>• Maximum 5 players per team</li>
                      <li>• Captain cannot be traded</li>
                      <li>• Team name cannot be changed later</li>
                    </ul>
                  </div>

                  <div className="flex gap-3 pt-4">
                    <button
                      onClick={() => setShowTeamCreation(false)}
                      className="flex-1 px-4 py-3 bg-slate-700 hover:bg-slate-600 text-white rounded-lg font-semibold transition-colors cursor-pointer"
                    >
                      Cancel
                    </button>
                    <button
                      onClick={createTeam}
                      disabled={!newTeamName.trim() || !selectedCaptain}
                      className="flex-1 px-4 py-3 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 disabled:from-slate-600 disabled:to-slate-700 disabled:cursor-not-allowed text-white rounded-lg font-semibold transition-all cursor-pointer"
                    >
                      Create Team
                    </button>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Read-Only Auction View for Non-Admin Users */}
          {!isAdmin && (auctionStatus === 'ready' || auctionStatus === 'live' || auctionStatus === 'completed') && (
            <div className="grid grid-cols-1 xl:grid-cols-5 gap-8">
              {/* Jar Display Only */}
              <div className="xl:col-span-2">
                <div className="bg-slate-900/80 border border-slate-600/50 rounded-2xl p-8 backdrop-blur-sm mb-6">
                  <h2 className="text-2xl font-bold text-white mb-6 text-center flex items-center justify-center gap-2">
                    <span className="text-3xl">🏺</span>
                    Magic Player Jar
                  </h2>
                  
                  <div className="relative flex justify-center mb-6">
                    <div className={`relative w-48 h-64 ${jarAnimating ? 'animate-bounce' : ''}`}>
                      <div className="absolute bottom-0 w-full h-48 bg-gradient-to-b from-amber-600/80 to-amber-800/90 rounded-b-full border-4 border-amber-700 shadow-2xl">
                        <div className="absolute -top-8 left-1/2 transform -translate-x-1/2 w-16 h-12 bg-gradient-to-b from-amber-500 to-amber-600 rounded-t-lg border-4 border-amber-700">
                          <div className="absolute -top-2 -left-2 w-20 h-4 bg-gradient-to-r from-yellow-600 to-yellow-700 rounded-full border-2 border-yellow-800 shadow-lg" />
                        </div>
                        <div className="absolute inset-4 bg-gradient-to-t from-blue-500/20 via-purple-500/30 to-cyan-500/20 rounded-b-full animate-pulse" />
                        <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 text-center">
                          <div className="text-white font-bold text-lg">
                            {auctionPlayers.filter(p => p.status === 'in-jar').length}
                          </div>
                          <div className="text-slate-300 text-xs">Players Left</div>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="text-center">
                    <div className="text-slate-400 text-sm">
                      🔒 Auction controlled by administrators
                    </div>
                  </div>
                </div>

                {/* Current Player Display */}
                {currentPlayer && (
                  <div className="bg-slate-900/80 border border-slate-600/50 rounded-2xl p-6 backdrop-blur-sm">
                    <h3 className="text-xl font-bold text-white mb-4 text-center flex items-center justify-center gap-2">
                      <span className="text-2xl">⭐</span>
                      Current Player
                    </h3>
                    
                    <div className="text-center mb-6">
                      <div className="relative w-24 h-24 mx-auto mb-4">
                        <img 
                          src={currentPlayer.avatarUrl} 
                          alt={currentPlayer.nickname}
                          className="w-full h-full rounded-full object-cover border-4 border-yellow-400 shadow-lg"
                          onError={(e) => {
                            e.currentTarget.src = "/avatars/default.jpg";
                          }}
                        />
                        <div className="absolute -top-2 -right-2 w-8 h-8 bg-gradient-to-r from-yellow-400 to-orange-400 rounded-full flex items-center justify-center">
                          <img src={getRoleIcon(currentPlayer.roles)} alt="role" className="w-5 h-5" />
                        </div>
                      </div>
                      
                      <h4 className="text-xl font-bold text-white mb-1">{currentPlayer.nickname}</h4>
                      {currentPlayer.realName && (
                        <p className="text-slate-400 text-sm mb-2">{currentPlayer.realName}</p>
                      )}
                      <div className="flex items-center justify-center gap-2 text-sm">
                        <span className="text-slate-400">🏅</span>
                        <span className="text-blue-400">{currentPlayer.currentMedalLabel}</span>
                        <span className="text-slate-400">•</span>
                        <span className="text-green-400">MMR: {currentPlayer.currentMMR}</span>
                      </div>
                      <div className="mt-2">
                        <span className="px-3 py-1 bg-purple-600/20 border border-purple-500/50 rounded-full text-purple-300 text-sm">
                          {getRoleLabel(currentPlayer.roles)}
                        </span>
                      </div>
                    </div>

                    <div className="space-y-3">
                      <div className="flex justify-between items-center p-3 bg-slate-800/50 rounded-lg">
                        <span className="text-slate-400">Base Price:</span>
                        <span className="text-white font-bold">🪙{currentPlayer.basePrice}</span>
                      </div>
                      <div className="flex justify-between items-center p-3 bg-slate-800/50 rounded-lg">
                        <span className="text-slate-400">Current Bid:</span>
                        <span className="text-green-400 font-bold text-lg">🪙{currentBid}</span>
                      </div>
                      {selectedTeam && (
                        <div className="flex justify-between items-center p-3 bg-blue-900/30 border border-blue-500/50 rounded-lg">
                          <span className="text-slate-400">Leading Team:</span>
                          <span className="text-blue-300 font-bold">
                            {auctionTeams.find(t => t.id === selectedTeam)?.name}
                          </span>
                        </div>
                      )}
                    </div>
                  </div>
                )}
              </div>

              {/* Teams Display Only */}
              <div className="xl:col-span-3">
                <h2 className="text-2xl font-bold text-white mb-6 flex items-center gap-2">
                  <span className="text-3xl">🏆</span>
                  Teams ({auctionTeams.length})
                </h2>
                
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                  {auctionTeams.map((team) => (
                    <div key={team.id} className="bg-slate-900/80 border border-slate-600/50 rounded-2xl p-6 backdrop-blur-sm">
                      {/* Team Header with Captain Message */}
                      <div className={`bg-gradient-to-r ${team.color} p-4 rounded-xl mb-4 relative`}>
                        <h3 className="text-xl font-bold text-white">{team.name}</h3>
                        <p className="text-white/80 text-sm">Captain: {team.captain}</p>
                        
                        {/* Captain Message Display */}
                        {captainMessages[team.id] && (
                          <div className="mt-2 bg-black/20 backdrop-blur-sm rounded-lg p-2 border border-white/20">
                            <div className="text-white/90 text-sm font-medium">
                              💬 "{captainMessages[team.id]}"
                            </div>
                          </div>
                        )}
                      </div>

                      <div className="grid grid-cols-3 gap-3 mb-4 text-center">
                        <div className="bg-slate-800/50 rounded-lg p-3">
                          <div className="text-green-400 font-bold">🪙{team.budget - team.spent}</div>
                          <div className="text-slate-400 text-xs">Gold Left</div>
                        </div>
                        <div className="bg-slate-800/50 rounded-lg p-3">
                          <div className="text-red-400 font-bold">🪙{team.spent}</div>
                          <div className="text-slate-400 text-xs">Spent</div>
                        </div>
                        <div className="bg-slate-800/50 rounded-lg p-3">
                          <div className="text-blue-400 font-bold">{team.players.length}/5</div>
                          <div className="text-slate-400 text-xs">Players</div>
                        </div>
                      </div>

                      {/* Captain Message Input for Read-Only View */}
                      {currentPlayer && auctionStatus === 'live' && isUserCaptain()?.id === team.id && (
                        <div className="mb-4 p-4 bg-slate-800/30 rounded-lg border border-slate-600/30">
                          <div className="space-y-2">
                            <div className="flex gap-2">
                              <input
                                type="text"
                                placeholder="Send message (max 5 words)"
                                value={messageInput}
                                onChange={(e) => setMessageInput(e.target.value)}
                                className="flex-1 px-3 py-2 bg-slate-700 border border-slate-600 rounded-lg text-white text-sm"
                                maxLength={25}
                                onKeyPress={(e) => {
                                  if (e.key === 'Enter') {
                                    sendCaptainMessage(team.id, messageInput);
                                    setMessageInput("");
                                  }
                                }}
                              />
                              <button
                                onClick={() => {
                                  sendCaptainMessage(team.id, messageInput);
                                  setMessageInput("");
                                }}
                                disabled={!messageInput.trim() || messageInput.trim().split(' ').length > 5}
                                className="px-4 py-2 bg-blue-600 hover:bg-blue-700 disabled:bg-slate-600 disabled:cursor-not-allowed text-white rounded-lg font-semibold text-sm transition-colors cursor-pointer"
                              >
                                💬
                              </button>
                            </div>
                            <p className="text-xs text-slate-400">
                              Captain message • Max 5 words • Visible for 10 seconds
                            </p>
                          </div>
                        </div>
                      )}

                      <div className="space-y-2">
                        <h4 className="text-sm font-semibold text-slate-300 mb-2">Team Roster:</h4>
                        {team.players.length === 0 ? (
                          <div className="text-center py-4 text-slate-500 text-sm">
                            No players yet
                          </div>
                        ) : (
                          <div className="space-y-2 max-h-40 overflow-y-auto">
                            {team.players.map((player) => (
                              <div key={player.id} className="flex items-center gap-3 p-2 bg-slate-800/30 rounded-lg">
                                <img 
                                  src={player.avatarUrl} 
                                  alt={player.nickname}
                                  className="w-8 h-8 rounded-full object-cover"
                                  onError={(e) => {
                                    e.currentTarget.src = "/avatars/default.jpg";
                                  }}
                                />
                                <div className="flex-1 min-w-0">
                                  <div className="text-white text-sm font-semibold truncate">{player.nickname}</div>
                                  <div className="text-slate-400 text-xs">{getRoleLabel(player.roles)}</div>
                                </div>
                                <div className="text-green-400 text-sm font-bold">🪙{player.currentBid}</div>
                              </div>
                            ))}
                          </div>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* Admin-Only Auction Interface */}
          {isAdmin && (auctionStatus === 'ready' || auctionStatus === 'live' || auctionStatus === 'completed') && (
            <div className="grid grid-cols-1 xl:grid-cols-5 gap-8">
              {/* Jar and Current Player Section */}
              <div className="xl:col-span-2">
              {/* Magic Jar */}
              <div className="bg-slate-900/80 border border-slate-600/50 rounded-2xl p-8 backdrop-blur-sm mb-6">
                <h2 className="text-2xl font-bold text-white mb-6 text-center flex items-center justify-center gap-2">
                  <span className="text-3xl">🏺</span>
                  Magic Player Jar
                </h2>
                
                <div className="relative flex justify-center mb-6">
                  {/* Jar Animation */}
                  <div className={`relative w-48 h-64 ${jarAnimating ? 'animate-bounce' : ''}`}>
                    {/* Jar Body */}
                    <div className="absolute bottom-0 w-full h-48 bg-gradient-to-b from-amber-600/80 to-amber-800/90 rounded-b-full border-4 border-amber-700 shadow-2xl">
                      {/* Jar Neck */}
                      <div className="absolute -top-8 left-1/2 transform -translate-x-1/2 w-16 h-12 bg-gradient-to-b from-amber-500 to-amber-600 rounded-t-lg border-4 border-amber-700">
                        {/* Jar Lid */}
                        <div className="absolute -top-2 -left-2 w-20 h-4 bg-gradient-to-r from-yellow-600 to-yellow-700 rounded-full border-2 border-yellow-800 shadow-lg" />
                      </div>
                      
                      {/* Mystical Glow */}
                      <div className="absolute inset-4 bg-gradient-to-t from-blue-500/20 via-purple-500/30 to-cyan-500/20 rounded-b-full animate-pulse" />
                      
                      {/* Floating Particles */}
                      {jarAnimating && (
                        <>
                          <div className="absolute top-4 left-8 w-2 h-2 bg-cyan-400 rounded-full animate-ping" />
                          <div className="absolute top-12 right-6 w-1 h-1 bg-purple-400 rounded-full animate-ping delay-300" />
                          <div className="absolute top-20 left-12 w-1.5 h-1.5 bg-blue-400 rounded-full animate-ping delay-700" />
                        </>
                      )}
                      
                      {/* Player Count */}
                      <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 text-center">
                        <div className="text-white font-bold text-lg">
                          {auctionPlayers.filter(p => p.status === 'in-jar').length}
                        </div>
                        <div className="text-slate-300 text-xs">Players Left</div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Draw Button */}
                <div className="text-center">
                  {auctionStatus === 'ready' && (
                    <button
                      onClick={drawNextPlayer}
                      className="px-8 py-4 bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white font-bold rounded-xl text-lg transform hover:scale-105 transition-all duration-300 shadow-lg cursor-pointer"
                    >
                      🎲 Draw Next Player
                    </button>
                  )}
                  {jarAnimating && (
                    <div className="text-yellow-400 font-semibold animate-pulse">
                      ✨ Drawing player from the jar... ✨
                    </div>
                  )}
                </div>
              </div>

              {/* Current Player */}
              {currentPlayer && (
                <div className="bg-slate-900/80 border border-slate-600/50 rounded-2xl p-6 backdrop-blur-sm animate-in fade-in duration-500">
                  <h3 className="text-xl font-bold text-white mb-4 text-center flex items-center justify-center gap-2">
                    <span className="text-2xl">⭐</span>
                    Current Player
                  </h3>
                  
                  <div className="text-center mb-6">
                    <div className="relative w-24 h-24 mx-auto mb-4">
                      <img 
                        src={currentPlayer.avatarUrl} 
                        alt={currentPlayer.nickname}
                        className="w-full h-full rounded-full object-cover border-4 border-yellow-400 shadow-lg"
                        onError={(e) => {
                          e.currentTarget.src = "/avatars/default.jpg";
                        }}
                      />
                      <div className="absolute -top-2 -right-2 w-8 h-8 bg-gradient-to-r from-yellow-400 to-orange-400 rounded-full flex items-center justify-center">
                        <img src={getRoleIcon(currentPlayer.roles)} alt="role" className="w-5 h-5" />
                      </div>
                    </div>
                    
                    <h4 className="text-xl font-bold text-white mb-1">{currentPlayer.nickname}</h4>
                    {currentPlayer.realName && (
                      <p className="text-slate-400 text-sm mb-2">{currentPlayer.realName}</p>
                    )}
                    <div className="flex items-center justify-center gap-2 text-sm">
                      <span className="text-slate-400">🏅</span>
                      <span className="text-blue-400">{currentPlayer.currentMedalLabel}</span>
                      <span className="text-slate-400">•</span>
                      <span className="text-green-400">MMR: {currentPlayer.currentMMR}</span>
                    </div>
                    <div className="mt-2">
                      <span className="px-3 py-1 bg-purple-600/20 border border-purple-500/50 rounded-full text-purple-300 text-sm">
                        {getRoleLabel(currentPlayer.roles)}
                      </span>
                    </div>
                  </div>

                  {/* Bidding Info */}
                  <div className="space-y-3">
                    <div className="flex justify-between items-center p-3 bg-slate-800/50 rounded-lg">
                      <span className="text-slate-400">Base Price:</span>
                      <span className="text-white font-bold">🪙{currentPlayer.basePrice}</span>
                    </div>
                    <div className="flex justify-between items-center p-3 bg-slate-800/50 rounded-lg">
                      <span className="text-slate-400">Current Bid:</span>
                      <span className="text-green-400 font-bold text-lg">🪙{currentBid}</span>
                    </div>
                    {selectedTeam && (
                      <div className="flex justify-between items-center p-3 bg-blue-900/30 border border-blue-500/50 rounded-lg">
                        <span className="text-slate-400">Leading Team:</span>
                        <span className="text-blue-300 font-bold">
                          {auctionTeams.find(t => t.id === selectedTeam)?.name}
                        </span>
                      </div>
                    )}
                  </div>

                  {/* Quick Sell Button */}
                  {selectedTeam && currentBid > 0 && (
                    <button
                      onClick={() => sellPlayer(selectedTeam)}
                      className="w-full mt-4 px-4 py-3 bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 text-white font-bold rounded-lg transition-all duration-300 cursor-pointer"
                    >
                      💰 Sell to {auctionTeams.find(t => t.id === selectedTeam)?.name}
                    </button>
                  )}
                </div>
              )}
            </div>

            {/* Teams Section */}
            <div className="xl:col-span-3">
              <h2 className="text-2xl font-bold text-white mb-6 flex items-center gap-2">
                <span className="text-3xl">🏆</span>
                Teams & Bidding
              </h2>
              
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {auctionTeams.map((team) => (
                  <div key={team.id} className="bg-slate-900/80 border border-slate-600/50 rounded-2xl p-6 backdrop-blur-sm">
                    {/* Team Header with Captain Message */}
                    <div className={`bg-gradient-to-r ${team.color} p-4 rounded-xl mb-4 relative`}>
                      <h3 className="text-xl font-bold text-white">{team.name}</h3>
                      <p className="text-white/80 text-sm">Captain: {team.captain}</p>
                      
                      {/* Captain Message Display */}
                      {captainMessages[team.id] && (
                        <div className="mt-2 bg-black/20 backdrop-blur-sm rounded-lg p-2 border border-white/20">
                          <div className="text-white/90 text-sm font-medium">
                            💬 "{captainMessages[team.id]}"
                          </div>
                        </div>
                      )}
                    </div>

                    {/* Team Stats */}
                    <div className="grid grid-cols-3 gap-3 mb-4 text-center">
                      <div className="bg-slate-800/50 rounded-lg p-3">
                        <div className="text-green-400 font-bold">🪙{team.budget - team.spent}</div>
                        <div className="text-slate-400 text-xs">Gold Left</div>
                      </div>
                      <div className="bg-slate-800/50 rounded-lg p-3">
                        <div className="text-red-400 font-bold">🪙{team.spent}</div>
                        <div className="text-slate-400 text-xs">Spent</div>
                      </div>
                      <div className="bg-slate-800/50 rounded-lg p-3">
                        <div className="text-blue-400 font-bold">{team.players.length}/5</div>
                        <div className="text-slate-400 text-xs">Players</div>
                      </div>
                    </div>

                    {/* Bidding Section */}
                    {currentPlayer && auctionStatus === 'live' && (
                      <div className="mb-4 p-4 bg-slate-800/30 rounded-lg border border-slate-600/30">
                        {/* Admin Bidding */}
                        {isAdmin && (
                          <>
                            <div className="flex gap-2 mb-2">
                              <input
                                type="number"
                                placeholder="Bid amount"
                                value={bidAmount}
                                onChange={(e) => setBidAmount(e.target.value)}
                                className="flex-1 px-3 py-2 bg-slate-700 border border-slate-600 rounded-lg text-white text-sm"
                                min={currentBid + 10}
                              />
                              <button
                                onClick={() => {
                                  const amount = parseInt(bidAmount);
                                  if (amount > currentBid && amount <= (team.budget - team.spent)) {
                                    placeBid(team.id, amount);
                                    setBidAmount("");
                                  }
                                }}
                                disabled={!bidAmount || parseInt(bidAmount) <= currentBid || parseInt(bidAmount) > (team.budget - team.spent)}
                                className="px-4 py-2 bg-yellow-600 hover:bg-yellow-700 disabled:bg-slate-600 disabled:cursor-not-allowed text-white rounded-lg font-semibold text-sm transition-colors cursor-pointer"
                              >
                                Bid
                              </button>
                            </div>
                            <p className="text-xs text-slate-400">
                              Min bid: 🪙{currentBid + 10} | Available: 🪙{team.budget - team.spent}
                            </p>
                          </>
                        )}
                        
                        {/* Captain Message Input */}
                        {!isAdmin && isUserCaptain()?.id === team.id && (
                          <div className="space-y-2">
                            <div className="flex gap-2">
                              <input
                                type="text"
                                placeholder="Send message (max 5 words)"
                                value={messageInput}
                                onChange={(e) => setMessageInput(e.target.value)}
                                className="flex-1 px-3 py-2 bg-slate-700 border border-slate-600 rounded-lg text-white text-sm"
                                maxLength={25}
                                onKeyPress={(e) => {
                                  if (e.key === 'Enter') {
                                    sendCaptainMessage(team.id, messageInput);
                                    setMessageInput("");
                                  }
                                }}
                              />
                              <button
                                onClick={() => {
                                  sendCaptainMessage(team.id, messageInput);
                                  setMessageInput("");
                                }}
                                disabled={!messageInput.trim() || messageInput.trim().split(' ').length > 5}
                                className="px-4 py-2 bg-blue-600 hover:bg-blue-700 disabled:bg-slate-600 disabled:cursor-not-allowed text-white rounded-lg font-semibold text-sm transition-colors cursor-pointer"
                              >
                                💬
                              </button>
                            </div>
                            <p className="text-xs text-slate-400">
                              Captain message • Max 5 words • Visible for 10 seconds
                            </p>
                          </div>
                        )}
                        
                        {/* Non-captain user message */}
                        {!isAdmin && !isUserCaptain() && (
                          <div className="text-center py-2 text-slate-500 text-sm">
                            Only team captains can send messages
                          </div>
                        )}
                      </div>
                    )}

                    {/* Team Players */}
                    <div className="space-y-2">
                      <h4 className="text-sm font-semibold text-slate-300 mb-2">Team Roster:</h4>
                      {team.players.length === 0 ? (
                        <div className="text-center py-4 text-slate-500 text-sm">
                          No players yet
                        </div>
                      ) : (
                        <div className="space-y-2 max-h-40 overflow-y-auto">
                          {team.players.map((player) => (
                            <div key={player.id} className="flex items-center gap-3 p-2 bg-slate-800/30 rounded-lg animate-in slide-in-from-right duration-500">
                              <img 
                                src={player.avatarUrl} 
                                alt={player.nickname}
                                className="w-8 h-8 rounded-full object-cover"
                                onError={(e) => {
                                  e.currentTarget.src = "/avatars/default.jpg";
                                }}
                              />
                              <div className="flex-1 min-w-0">
                                <div className="text-white text-sm font-semibold truncate">{player.nickname}</div>
                                <div className="text-slate-400 text-xs">{getRoleLabel(player.roles)}</div>
                              </div>
                              <div className="text-green-400 text-sm font-bold">🪙{player.currentBid}</div>
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
          )}

          {/* Auction Summary */}
          {auctionStatus === 'completed' && (
            <div className="mt-8 bg-slate-900/80 border border-slate-600/50 rounded-2xl p-8 backdrop-blur-sm text-center">
              <h2 className="text-3xl font-bold text-white mb-4">🎉 Auction Completed! 🎉</h2>
              <p className="text-slate-300 mb-6">All players have been allocated to teams</p>
              
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                {auctionTeams.map((team) => (
                  <div key={team.id} className={`bg-gradient-to-br ${team.color} p-4 rounded-xl text-white`}>
                    <h3 className="font-bold text-lg mb-2">{team.name}</h3>
                    <div className="text-sm opacity-90">
                      <div>Players: {team.players.length}</div>
                      <div>Total Spent: 🪙{team.spent}</div>
                      <div>Remaining: 🪙{team.budget - team.spent}</div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

        </div>
      </main>

      {/* Ban Player Modal */}
      {showBanModal && selectedPlayerForBan && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50" onClick={() => setShowBanModal(false)}>
          <div className="bg-slate-900 border border-slate-600 rounded-2xl p-8 max-w-md w-full" onClick={e => e.stopPropagation()}>
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-2xl font-bold text-red-400 flex items-center gap-2">
                🚫 Ban Player
              </h3>
              <button 
                onClick={() => setShowBanModal(false)}
                className="text-slate-400 hover:text-white text-2xl cursor-pointer"
              >
                ✕
              </button>
            </div>
            
            <div className="text-center mb-6">
              <img 
                src={selectedPlayerForBan.avatarUrl} 
                alt={selectedPlayerForBan.nickname}
                className="w-16 h-16 rounded-full object-cover border-4 border-red-500 mx-auto mb-2"
                onError={(e) => {
                  e.currentTarget.src = "/avatars/default.jpg";
                }}
              />
              <h4 className="text-white font-bold">{selectedPlayerForBan.nickname}</h4>
              <p className="text-slate-400 text-sm">{selectedPlayerForBan.currentMedalLabel}</p>
            </div>

            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-slate-300 mb-2">
                  Ban Reason <span className="text-red-400">*</span>
                </label>
                <textarea
                  value={banReason}
                  onChange={(e) => setBanReason(e.target.value)}
                  placeholder="Enter reason for banning this player..."
                  className="w-full px-4 py-3 bg-slate-800 border border-slate-600 rounded-lg text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-red-500/50 focus:border-red-500/50 resize-none"
                  rows={3}
                  maxLength={200}
                />
                <p className="text-xs text-slate-400 mt-1">{banReason.length}/200 characters</p>
              </div>

              <div className="bg-red-900/20 border border-red-500/30 rounded-lg p-4">
                <h4 className="text-sm font-semibold text-red-300 mb-2">⚠️ Warning:</h4>
                <ul className="text-xs text-red-400 space-y-1">
                  <li>• Player will be removed from auction</li>
                  <li>• Cannot participate until unbanned</li>
                  <li>• Ban reason will be logged</li>
                  <li>• Action cannot be undone easily</li>
                </ul>
              </div>

              <div className="flex gap-3 pt-4">
                <button
                  onClick={() => setShowBanModal(false)}
                  className="flex-1 px-4 py-3 bg-slate-700 hover:bg-slate-600 text-white rounded-lg font-semibold transition-colors cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  onClick={confirmBanPlayer}
                  disabled={!banReason.trim()}
                  className="flex-1 px-4 py-3 bg-gradient-to-r from-red-600 to-red-700 hover:from-red-700 hover:to-red-800 disabled:from-slate-600 disabled:to-slate-700 disabled:cursor-not-allowed text-white rounded-lg font-semibold transition-all cursor-pointer"
                >
                  Ban Player
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Unban Player Modal */}
      {showUnbanModal && selectedPlayerForBan && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50" onClick={() => setShowUnbanModal(false)}>
          <div className="bg-slate-900 border border-slate-600 rounded-2xl p-8 max-w-md w-full" onClick={e => e.stopPropagation()}>
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-2xl font-bold text-green-400 flex items-center gap-2">
                ✅ Unban Player
              </h3>
              <button 
                onClick={() => setShowUnbanModal(false)}
                className="text-slate-400 hover:text-white text-2xl cursor-pointer"
              >
                ✕
              </button>
            </div>
            
            <div className="text-center mb-6">
              <img 
                src={selectedPlayerForBan.avatarUrl} 
                alt={selectedPlayerForBan.nickname}
                className="w-16 h-16 rounded-full object-cover border-4 border-green-500 mx-auto mb-2"
                onError={(e) => {
                  e.currentTarget.src = "/avatars/default.jpg";
                }}
              />
              <h4 className="text-white font-bold">{selectedPlayerForBan.nickname}</h4>
              <p className="text-slate-400 text-sm">{selectedPlayerForBan.currentMedalLabel}</p>
            </div>

            {selectedPlayerForBan.banReason && (
              <div className="bg-red-900/20 border border-red-500/30 rounded-lg p-4 mb-6">
                <h4 className="text-sm font-semibold text-red-300 mb-2">Current Ban Reason:</h4>
                <p className="text-red-400 text-sm">{selectedPlayerForBan.banReason}</p>
              </div>
            )}

            <div className="bg-green-900/20 border border-green-500/30 rounded-lg p-4 mb-6">
              <h4 className="text-sm font-semibold text-green-300 mb-2">✅ Unbanning will:</h4>
              <ul className="text-xs text-green-400 space-y-1">
                <li>• Restore player to auction pool</li>
                <li>• Allow participation in future auctions</li>
                <li>• Clear ban reason from record</li>
                <li>• Player can be selected as captain</li>
              </ul>
            </div>

            <div className="flex gap-3 pt-4">
              <button
                onClick={() => setShowUnbanModal(false)}
                className="flex-1 px-4 py-3 bg-slate-700 hover:bg-slate-600 text-white rounded-lg font-semibold transition-colors cursor-pointer"
              >
                Cancel
              </button>
              <button
                onClick={confirmUnbanPlayer}
                className="flex-1 px-4 py-3 bg-gradient-to-r from-green-600 to-green-700 hover:from-green-700 hover:to-green-800 text-white rounded-lg font-semibold transition-all cursor-pointer"
              >
                Unban Player
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Captain Selection Modal */}
      {showCaptainSelectionModal && selectedPlayerForCaptain && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50" onClick={() => setShowCaptainSelectionModal(false)}>
          <div className="bg-slate-900 border border-slate-600 rounded-2xl p-8 max-w-md w-full" onClick={e => e.stopPropagation()}>
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-2xl font-bold text-yellow-400 flex items-center gap-2">
                👑 Make Captain
              </h3>
              <button 
                onClick={() => setShowCaptainSelectionModal(false)}
                className="text-slate-400 hover:text-white text-2xl cursor-pointer"
              >
                ✕
              </button>
            </div>
            
            <div className="text-center mb-6">
              <img 
                src={selectedPlayerForCaptain.avatarUrl} 
                alt={selectedPlayerForCaptain.nickname}
                className="w-16 h-16 rounded-full object-cover border-4 border-yellow-500 mx-auto mb-2"
                onError={(e) => {
                  e.currentTarget.src = "/avatars/default.jpg";
                }}
              />
              <h4 className="text-white font-bold">{selectedPlayerForCaptain.nickname}</h4>
              <p className="text-slate-400 text-sm">{selectedPlayerForCaptain.currentMedalLabel}</p>
            </div>

            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-slate-300 mb-2">
                  Team Name <span className="text-red-400">*</span>
                </label>
                <input
                  type="text"
                  value={newCaptainTeamName}
                  onChange={(e) => setNewCaptainTeamName(e.target.value)}
                  placeholder="Enter team name for this captain"
                  className="w-full px-4 py-3 bg-slate-800 border border-slate-600 rounded-lg text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-yellow-500/50 focus:border-yellow-500/50"
                  maxLength={30}
                />
              </div>

              <div className="bg-yellow-900/20 border border-yellow-500/30 rounded-lg p-4">
                <h4 className="text-sm font-semibold text-yellow-300 mb-2">👑 Captain Benefits:</h4>
                <ul className="text-xs text-yellow-400 space-y-1">
                  <li>• Gets their own team automatically</li>
                  <li>• Can send messages during auction</li>
                  <li>• Starting budget: 🪙1000 Gold</li>
                  <li>• Cannot be traded to other teams</li>
                </ul>
              </div>

              <div className="flex gap-3 pt-4">
                <button
                  onClick={() => setShowCaptainSelectionModal(false)}
                  className="flex-1 px-4 py-3 bg-slate-700 hover:bg-slate-600 text-white rounded-lg font-semibold transition-colors cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  onClick={confirmCaptainSelection}
                  disabled={!newCaptainTeamName.trim() || auctionTeams.length >= 32}
                  className="flex-1 px-4 py-3 bg-gradient-to-r from-yellow-600 to-orange-600 hover:from-yellow-700 hover:to-orange-700 disabled:from-slate-600 disabled:to-slate-700 disabled:cursor-not-allowed text-white rounded-lg font-semibold transition-all cursor-pointer"
                >
                  Make Captain
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Enhanced Player Cards Modal */}
      {showEnhancedPlayerCards && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50" onClick={() => setShowEnhancedPlayerCards(false)}>
          <div className="bg-slate-900 border border-slate-600 rounded-2xl p-8 max-w-6xl w-full max-h-[90vh] overflow-y-auto" onClick={e => e.stopPropagation()}>
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-2xl font-bold text-white flex items-center gap-2">
                👥 All Players ({auctionPlayers.length})
              </h3>
              <button 
                onClick={() => setShowEnhancedPlayerCards(false)}
                className="text-slate-400 hover:text-white text-2xl cursor-pointer"
              >
                ✕
              </button>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
              {auctionPlayers.map((player) => (
                <div key={player.id} className={`bg-slate-800/50 border rounded-xl p-4 relative group transition-all duration-300 hover:scale-105 ${
                  player.isBanned 
                    ? 'border-red-500/50 bg-red-900/20' 
                    : player.status === 'sold' 
                    ? 'border-green-500/50 bg-green-900/20'
                    : 'border-slate-600/50 hover:border-blue-500/50'
                }`}>
                  {/* Status Badge */}
                  <div className="absolute top-2 right-2">
                    {player.isBanned ? (
                      <span className="px-2 py-1 bg-red-600 text-white text-xs rounded-full">BANNED</span>
                    ) : player.status === 'sold' ? (
                      <span className="px-2 py-1 bg-green-600 text-white text-xs rounded-full">SOLD</span>
                    ) : player.status === 'current' ? (
                      <span className="px-2 py-1 bg-yellow-600 text-white text-xs rounded-full animate-pulse">LIVE</span>
                    ) : (
                      <span className="px-2 py-1 bg-blue-600 text-white text-xs rounded-full">AVAILABLE</span>
                    )}
                  </div>

                  {/* Player Avatar and Info */}
                  <div className="text-center mb-4">
                    <div className="relative w-16 h-16 mx-auto mb-2">
                      <img 
                        src={player.avatarUrl} 
                        alt={player.nickname}
                        className="w-full h-full rounded-full object-cover border-2 border-slate-500"
                        onError={(e) => {
                          e.currentTarget.src = "/avatars/default.jpg";
                        }}
                      />
                      <div className="absolute -top-1 -right-1 w-6 h-6 bg-gradient-to-r from-yellow-400 to-orange-400 rounded-full flex items-center justify-center">
                        <img src={getRoleIcon(player.roles)} alt="role" className="w-4 h-4" />
                      </div>
                    </div>
                    
                    <h4 className="text-white font-bold text-sm truncate">{player.nickname}</h4>
                    {player.realName && (
                      <p className="text-slate-400 text-xs truncate">{player.realName}</p>
                    )}
                  </div>

                  {/* Player Stats */}
                  <div className="space-y-2 mb-4">
                    <div className="flex justify-between items-center text-xs">
                      <span className="text-slate-400">🏅 Medal • MMR:</span>
                      <div className="flex items-center gap-2">
                        <span className="text-blue-400 font-semibold">{player.currentMedalLabel}</span>
                        <span className="text-green-400 font-semibold">{player.currentMMR}</span>
                      </div>
                    </div>
                    <div className="flex justify-between items-center text-xs">
                      <span className="text-slate-400">📡 Ping:</span>
                      <span className={`font-semibold ${player.ping && player.ping < 50 ? 'text-green-400' : player.ping && player.ping < 100 ? 'text-yellow-400' : 'text-red-400'}`}>
                        {player.ping}ms
                      </span>
                    </div>
                    <div className="flex justify-between items-center text-xs">
                      <span className="text-slate-400">🎯 Role:</span>
                      <span className="text-purple-400 font-semibold">
                        {getRoleLabel(player.roles) === 'Carry' && '⚔️ Carry'}
                        {getRoleLabel(player.roles) === 'Mid' && '🔮 Mid'}
                        {getRoleLabel(player.roles) === 'Offlane' && '🛡️ Offlane'}
                        {getRoleLabel(player.roles) === 'Soft Support' && '💊 Soft Support'}
                        {getRoleLabel(player.roles) === 'Hard Support' && '🌟 Hard Support'}
                        {!['Carry', 'Mid', 'Offlane', 'Soft Support', 'Hard Support'].includes(getRoleLabel(player.roles)) && `🎮 ${getRoleLabel(player.roles)}`}
                      </span>
                    </div>
                  </div>

                  {/* Price Info */}
                  <div className="space-y-2 mb-4">
                    <div className="flex justify-between items-center p-2 bg-slate-700/50 rounded text-xs">
                      <span className="text-slate-400">💰 Base Price:</span>
                      <span className="text-white font-bold">🪙{player.basePrice}</span>
                    </div>
                    {player.currentBid > 0 && (
                      <div className="flex justify-between items-center p-2 bg-green-900/30 border border-green-500/50 rounded text-xs">
                        <span className="text-slate-400">Current Bid:</span>
                        <span className="text-green-400 font-bold">🪙{player.currentBid}</span>
                      </div>
                    )}
                    {player.team && (
                      <div className="flex justify-between items-center p-2 bg-blue-900/30 border border-blue-500/50 rounded text-xs">
                        <span className="text-slate-400">Team:</span>
                        <span className="text-blue-300 font-bold truncate">{player.team}</span>
                      </div>
                    )}
                  </div>

                  {/* Ban Reason */}
                  {player.isBanned && player.banReason && (
                    <div className="mb-4 p-2 bg-red-900/30 border border-red-500/50 rounded">
                      <h5 className="text-xs font-semibold text-red-300 mb-1">Ban Reason:</h5>
                      <p className="text-red-400 text-xs">{player.banReason}</p>
                    </div>
                  )}

                  {/* Admin Controls */}
                  {isAdmin && (
                    <div className="flex gap-2">
                      {!player.isBanned ? (
                        <>
                          <button
                            onClick={() => handleBanPlayer(player)}
                            className="flex-1 px-2 py-1 bg-red-600/20 hover:bg-red-600/30 border border-red-500/50 text-red-300 rounded text-xs transition-colors cursor-pointer"
                          >
                            🚫 Ban
                          </button>
                          {player.status === 'in-jar' && (
                            <button
                              onClick={() => handleSelectCaptain(player)}
                              className="flex-1 px-2 py-1 bg-yellow-600/20 hover:bg-yellow-600/30 border border-yellow-500/50 text-yellow-300 rounded text-xs transition-colors cursor-pointer"
                            >
                              👑 Captain
                            </button>
                          )}
                        </>
                      ) : (
                        <button
                          onClick={() => handleUnbanPlayer(player)}
                          className="flex-1 px-2 py-1 bg-green-600/20 hover:bg-green-600/30 border border-green-500/50 text-green-300 rounded text-xs transition-colors cursor-pointer"
                        >
                          ✅ Unban
                        </button>
                      )}
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </>
  );
}
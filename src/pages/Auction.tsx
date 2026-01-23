import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { players } from "../data/players";
import { AuthService } from "../services/auth";
import { DOTA_HEROES } from "../data/heroes";

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
      // Get random top 3 heroes for each player
      const shuffledHeroes = [...DOTA_HEROES].sort(() => 0.5 - Math.random());
      const top3Heroes = shuffledHeroes.slice(0, 3);
      
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
        favoriteHeroes: top3Heroes.map(hero => ({ name: hero.name, videoSrc: hero.videoSrc })),
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

      <main className="relative h-screen overflow-hidden flex flex-col w-full px-4 md:px-8 z-10" style={{ paddingTop: '100px' }}>
        <div className="w-full max-w-6xl mx-auto">
          {/* Login Section - Captain on Left, Admin on Right - Close to navbar */}
          {!isAdmin && !currentPlayerSession && (
            <div className="mb-6 flex flex-col lg:flex-row gap-4 max-w-5xl mx-auto">
              {/* Captain Login - Left Side */}
              <div className="flex-1 bg-gradient-to-r from-yellow-900/50 to-orange-900/50 border border-yellow-500/30 rounded-xl p-5 backdrop-blur-sm">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-6 h-6 bg-yellow-500/30 rounded-lg flex items-center justify-center">
                      <svg className="w-4 h-4 text-yellow-300" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M6.267 3.455a3.066 3.066 0 001.745-.723 3.066 3.066 0 013.976 0 3.066 3.066 0 001.745.723 3.066 3.066 0 012.812 2.812c.051.643.304 1.254.723 1.745a3.066 3.066 0 010 3.976 3.066 3.066 0 00-.723 1.745 3.066 3.066 0 01-2.812 2.812 3.066 3.066 0 00-1.745.723 3.066 3.066 0 01-3.976 0 3.066 3.066 0 00-1.745-.723 3.066 3.066 0 01-2.812-2.812 3.066 3.066 0 00-.723-1.745 3.066 3.066 0 010-3.976 3.066 3.066 0 00.723-1.745 3.066 3.066 0 012.812-2.812zm7.44 5.252a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                      </svg>
                    </div>
                    <div>
                      <h3 className="text-yellow-300 font-bold">Are you a captain?</h3>
                      <p className="text-yellow-400/80 text-sm">Login to participate</p>
                    </div>
                  </div>
                  <button
                    onClick={() => setShowCaptainLogin(true)}
                    className="px-4 py-2 bg-yellow-600/20 hover:bg-yellow-600/30 border border-yellow-500/50 text-yellow-300 rounded-lg text-sm transition-colors cursor-pointer"
                  >
                    Captain Login
                  </button>
                </div>
              </div>

              {/* Admin Login - Right Side */}
              <div className="flex-1 bg-slate-900/80 border border-slate-600/50 rounded-xl p-5 backdrop-blur-sm">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-6 h-6 bg-slate-500/30 rounded-lg flex items-center justify-center">
                      <svg className="w-4 h-4 text-slate-300" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M5 9V7a5 5 0 0110 0v2a2 2 0 012 2v5a2 2 0 01-2 2H5a2 2 0 01-2-2v-5a2 2 0 012-2zm8-2v2H7V7a3 3 0 016 0z" clipRule="evenodd" />
                      </svg>
                    </div>
                    <div>
                      <h3 className="text-slate-300 font-bold">Admin Access</h3>
                      <p className="text-slate-400/80 text-sm">Manage auction controls</p>
                    </div>
                  </div>
                  <Link 
                    to="/admin-login"
                    className="inline-flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white rounded-lg text-sm font-semibold transition-all cursor-pointer"
                  >
                    <svg className="w-4 h-4 text-white" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M18 8a6 6 0 01-7.743 5.743L10 14l-1 1-1 1H6v2H2v-4l4.257-4.257A6 6 0 1118 8zm-6-4a1 1 0 100 2 2 2 0 012 2 1 1 0 102 0 4 4 0 00-4-4z" clipRule="evenodd" />
                    </svg> Admin Login
                  </Link>
                </div>
              </div>
            </div>
          )}

          {/* Header */}
          <div className="text-center mb-6">
            <h1 className="text-3xl md:text-5xl font-black bg-gradient-to-r from-yellow-400 via-orange-400 to-red-400 bg-clip-text text-transparent mb-3 flex items-center justify-center gap-4">
              <svg className="w-12 h-12 text-yellow-400" fill="currentColor" viewBox="0 0 20 20">
                <path d="M3 4a1 1 0 011-1h12a1 1 0 011 1v2a1 1 0 01-1 1H4a1 1 0 01-1-1V4zM3 10a1 1 0 011-1h6a1 1 0 011 1v6a1 1 0 01-1 1H4a1 1 0 01-1-1v-6zM14 9a1 1 0 00-1 1v6a1 1 0 001 1h2a1 1 0 001-1v-6a1 1 0 00-1-1h-2z" />
              </svg>
              Player Auction
              <svg className="w-12 h-12 text-yellow-400" fill="currentColor" viewBox="0 0 20 20">
                <path d="M3 4a1 1 0 011-1h12a1 1 0 011 1v2a1 1 0 01-1 1H4a1 1 0 01-1-1V4zM3 10a1 1 0 011-1h6a1 1 0 011 1v6a1 1 0 01-1 1H4a1 1 0 01-1-1v-6zM14 9a1 1 0 00-1 1v6a1 1 0 001 1h2a1 1 0 001-1v-6a1 1 0 00-1-1h-2z" />
              </svg>
            </h1>
            <p className="text-sm md:text-base lg:text-lg text-gray-400 max-w-xl mx-auto">
              India's premier amateur league auction system.
            </p>
          </div>

          {/* No Auction Running - Non-Admin View */}
          {!isAdmin && auctionStatus === 'setup' && (
            <div className="text-center">
              <div className="bg-slate-900/80 border border-slate-600/50 rounded-xl p-6 backdrop-blur-sm max-w-md mx-auto">
                <div className="flex items-center justify-center mb-3">
                  <svg className="w-16 h-16 text-slate-400" fill="currentColor" viewBox="0 0 20 20">
                    <path d="M3 4a1 1 0 011-1h12a1 1 0 011 1v2a1 1 0 01-1 1H4a1 1 0 01-1-1V4zM3 10a1 1 0 011-1h6a1 1 0 011 1v6a1 1 0 01-1 1H4a1 1 0 01-1-1v-6zM14 9a1 1 0 00-1 1v6a1 1 0 001 1h2a1 1 0 001-1v-6a1 1 0 00-1-1h-2z" />
                  </svg>
                </div>
                <h2 className="text-xl font-bold text-white mb-2">Auction Not Started</h2>
                <p className="text-slate-300 text-sm">
                  Administrators are setting up teams.
                </p>
              </div>
            </div>
          )}

          {/* Admin Welcome */}
          {isAdmin && (
            <div className="mb-6 bg-gradient-to-r from-green-900/50 to-emerald-900/50 border border-green-500/30 rounded-xl p-4 backdrop-blur-sm">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="text-2xl">👑</div>
                  <div>
                    <h3 className="text-green-300 font-bold">Admin Access Granted</h3>
                    <p className="text-green-400/80 text-sm">Welcome, {adminSession?.username} ({adminSession?.role})</p>
                  </div>
                </div>
                <div className="flex gap-2">
                  <button
                    onClick={() => setShowEnhancedPlayerCards(true)}
                    className="px-4 py-2 bg-blue-600/20 hover:bg-blue-600/30 border border-blue-500/50 text-blue-300 rounded-lg text-sm transition-colors cursor-pointer"
                  >
                    👥 View All Players
                  </button>
                  <button
                    onClick={() => {
                      AuthService.clearAdminSession();
                      setIsAdmin(false);
                      setAdminSession(null);
                    }}
                    className="px-4 py-2 bg-red-600/20 hover:bg-red-600/30 border border-red-500/50 text-red-300 rounded-lg text-sm transition-colors cursor-pointer"
                  >
                    Logout
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* Captain Welcome */}
          {!isAdmin && currentPlayerSession && (
            <div className="mb-6 bg-gradient-to-r from-blue-900/50 to-purple-900/50 border border-blue-500/30 rounded-xl p-4 backdrop-blur-sm">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <img 
                    src={currentPlayerSession.avatarUrl} 
                    alt={currentPlayerSession.nickname}
                    className="w-10 h-10 rounded-full object-cover border-2 border-blue-400"
                    onError={(e) => {
                      e.currentTarget.src = "/avatars/default.jpg";
                    }}
                  />
                  <div>
                    <h3 className="text-blue-300 font-bold">Captain Logged In</h3>
                    <p className="text-blue-400/80 text-sm">Welcome, Captain {currentPlayerSession.nickname}</p>
                  </div>
                </div>
                <button
                  onClick={handleCaptainLogout}
                  className="px-4 py-2 bg-red-600/20 hover:bg-red-600/30 border border-red-500/50 text-red-300 rounded-lg text-sm transition-colors cursor-pointer"
                >
                  Logout
                </button>
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
                      <div className="flex items-center justify-center gap-4 text-sm">
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
                    <div className="flex items-center justify-center gap-4 text-sm">
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
                      <span className="text-slate-400">Medal:</span>
                      <span className="text-blue-400 font-semibold">{player.currentMedalLabel}</span>
                    </div>
                    <div className="flex justify-between items-center text-xs">
                      <span className="text-slate-400">MMR:</span>
                      <span className="text-green-400 font-semibold">{player.currentMMR}</span>
                    </div>
                    <div className="flex justify-between items-center text-xs">
                      <span className="text-slate-400">Ping:</span>
                      <span className={`font-semibold ${player.ping && player.ping < 50 ? 'text-green-400' : player.ping && player.ping < 100 ? 'text-yellow-400' : 'text-red-400'}`}>
                        {player.ping}ms
                      </span>
                    </div>
                    <div className="flex justify-between items-center text-xs">
                      <span className="text-slate-400">Gold:</span>
                      <span className="text-yellow-400 font-semibold">🪙{player.gold}</span>
                    </div>
                    <div className="flex justify-between items-center text-xs">
                      <span className="text-slate-400">Role:</span>
                      <span className="text-purple-400 font-semibold">{getRoleLabel(player.roles)}</span>
                    </div>
                  </div>

                  {/* Top 3 Heroes */}
                  <div className="mb-4">
                    <h5 className="text-xs font-semibold text-slate-300 mb-2">Top Heroes:</h5>
                    <div className="flex gap-1">
                      {player.favoriteHeroes?.slice(0, 3).map((hero, index) => (
                        <div key={index} className="flex-1 text-center">
                          <div className="w-8 h-8 mx-auto mb-1 bg-slate-700 rounded border overflow-hidden">
                            <video 
                              className="w-full h-full object-cover"
                              muted
                              loop
                              onMouseEnter={(e) => e.currentTarget.play()}
                              onMouseLeave={(e) => e.currentTarget.pause()}
                            >
                              <source src={hero.videoSrc} type="video/webm" />
                            </video>
                          </div>
                          <span className="text-xs text-slate-400 truncate block">{hero.name}</span>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Price Info */}
                  <div className="space-y-2 mb-4">
                    <div className="flex justify-between items-center p-2 bg-slate-700/50 rounded text-xs">
                      <span className="text-slate-400">Base Price:</span>
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
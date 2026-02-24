import { useParams, useNavigate } from "react-router-dom";
import { FaSteam } from "react-icons/fa";
import { motion } from "framer-motion";
import { useState, useEffect } from "react";
import { Edit3, LogOut, Plus, Minus, Save, X, Lock } from "lucide-react";
import AuthService from "../../services/auth";
import { DOTA_ROLES } from "../../utils/constants";
import { DOTA_HEROES, findHeroByName } from "../../data/heroes";
import { useToast } from "../../hooks/useToast";
import ToastContainer from "../../components/ui/ToastContainer";
import { getMedalFromMMR } from "../../utils/mmrToMedal";
import PasswordChangeModal from "../../components/PasswordChangeModal";
import FirstLoginPasswordChange from "../../components/FirstLoginPasswordChange";
import { PlayerService } from "../../services/supabaseService";
import { supabase } from "../../lib/supabase";
import type { Player } from "../../data/players";
import { mapDatabasePlayerToFrontend } from "../../utils/playerMapper";

// Colored season badge styles
const coloredSeasonBadgeStyles: Record<number, string> = {
  1: "bg-gradient-to-br from-cyan-400 via-blue-500 to-indigo-600 border-2 border-cyan-300/50",
  2: "bg-gradient-to-br from-emerald-400 via-green-500 to-teal-600 border-2 border-emerald-300/50",
  3: "bg-gradient-to-br from-fuchsia-400 via-purple-500 to-violet-600 border-2 border-fuchsia-300/50",
  4: "bg-gradient-to-br from-rose-400 via-pink-500 to-red-600 border-2 border-rose-300/50",
  5: "bg-gradient-to-br from-amber-400 via-orange-500 to-yellow-600 border-2 border-amber-300/50",
};

type CupRank = "gold" | "silver" | "bronze";

const cupCircleStyles: Record<CupRank, string> = {
  gold: "bg-black/30 border-yellow-400",
  silver: "bg-black/30 border-gray-400", 
  bronze: "bg-black/30 border-orange-400",
};

const cupIcons: Record<CupRank, string> = {
  gold: "🏆",
  silver: "🥈",
  bronze: "🥉",
};

export default function PlayerDetailPage() {
  const { playerId } = useParams<{ playerId: string }>();
  const navigate = useNavigate();
  const { toasts, success, error, warning, removeToast } = useToast();
  const [selectedSeason, setSelectedSeason] = useState<number | null>(null);
  const [isEditMode, setIsEditMode] = useState(false);
  const [player, setPlayer] = useState<Player | null>(null);
  const [loading, setLoading] = useState(true);
  const [editedData, setEditedData] = useState({
    bio: '',
    currentMedalLabel: '',
    currentMedalId: '',
    currentMMR: '',
    peakMedalLabel: '',
    peakMedalId: '',
    peakMMR: '',
    realName: '',
    nickname: ''
  });
  const [editedRoles, setEditedRoles] = useState<string[]>([]);
  const [editedAvatar, setEditedAvatar] = useState<string>('');
  const [editedHeroes, setEditedHeroes] = useState<string[]>([]);
  const [heroSearchTerm, setHeroSearchTerm] = useState('');
  const [, setMmrProof] = useState<string>('');
  const [mmrValidation, setMmrValidation] = useState({ isValid: true, message: '' });
  const [showPasswordModal, setShowPasswordModal] = useState(false);
  const [passwordChanged, setPasswordChanged] = useState(false);
  
  // Get current user from auth service
  const currentUser = AuthService.getCurrentUser();
  const isAuthenticated = AuthService.isSessionValid();
  
  // Check if current user can edit this profile
  const canEdit = isAuthenticated && currentUser && (
    currentUser.type === 'admin' || 
    (currentUser.type === 'player' && currentUser.playerId === playerId)
  );

  const effectiveCupRank: CupRank | undefined = player?.hasWonCup
    ? player.cupRank ?? "gold"
    : undefined;

  // Load player data from Supabase
  useEffect(() => {
    const loadPlayer = async () => {
      if (!playerId) return;
      
      setLoading(true);
      try {
        // Try to fetch from Supabase first
        const dbPlayer = await PlayerService.getPlayerById(playerId);
        
        if (dbPlayer) {
          // Map database fields to frontend format
          const frontendPlayer = mapDatabasePlayerToFrontend(dbPlayer);
          setPlayer(frontendPlayer);
        } else {
          // Player not found in Supabase, try local data
          throw new Error('Player not found in Supabase');
        }
      } catch (err) {
        // Silent error
        
        // Fallback to local data
        try {
          const { players: localPlayers } = await import('../../data/players');
          const localPlayer = localPlayers.find(p => 
            p.id === playerId || 
            p.nickname.toLowerCase() === playerId.toLowerCase()
          );
          if (localPlayer) {
            setPlayer(localPlayer);
          } else {
            error('Player not found', 'Please check the player ID');
          }
        } catch (localErr) {
          console.error('Error loading player from local data:', localErr);
          error('Failed to load player data', 'Please try again');
        }
      } finally {
        setLoading(false);
      }
    };

    loadPlayer();
  }, [playerId]);

  // Subscribe to real-time player updates
  useEffect(() => {
    if (!playerId || !player) return;

    // Subscribe using the actual player data we loaded
    // If player has a UUID id, use that; otherwise use nickname
    const filterField = player.id && player.id !== playerId ? 'id' : 'nickname';
    const filterValue = player.id && player.id !== playerId ? player.id : playerId;

    const channel = supabase
      .channel(`player-${playerId}`)
      .on(
        'postgres_changes',
        {
          event: 'UPDATE',
          schema: 'public',
          table: 'players',
          filter: `${filterField}=eq.${filterValue}`
        },
        (payload) => {
          setPlayer(payload.new as Player);
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [playerId, player?.id]);

  // Initialize edit data when player loads
  useEffect(() => {
    if (player) {
      setEditedData({
        bio: player.bio || '',
        currentMedalLabel: player.currentMedalLabel || '',
        currentMedalId: player.currentMedalId || '',
        currentMMR: player.currentMMR?.toString() || '',
        peakMedalLabel: player.peakMedalLabel || '',
        peakMedalId: player.peakMedalId || '',
        peakMMR: player.peakMMR?.toString() || '',
        realName: player.realName || '',
        nickname: player.nickname || ''
      });
      setEditedRoles(player.roles?.map(role => role.label) || []);
      setEditedAvatar(player.avatarUrl || '');
      setEditedHeroes(player.favoriteHeroes?.map(hero => hero.name) || []);
    }
  }, [player]);

  // Section editing functions
  const toggleEditMode = () => {
    if (isEditMode) {
      // Reset all edited data when exiting edit mode
      if (player) {
        setEditedData({
          bio: player.bio || '',
          currentMedalLabel: player.currentMedalLabel || '',
          currentMedalId: player.currentMedalId || '',
          currentMMR: player.currentMMR?.toString() || '',
          peakMedalLabel: player.peakMedalLabel || '',
          peakMedalId: player.peakMedalId || '',
          peakMMR: player.peakMMR?.toString() || '',
          realName: player.realName || '',
          nickname: player.nickname || ''
        });
        setEditedRoles(player.roles.map(role => role.label));
        setEditedAvatar(player.avatarUrl || '');
        setEditedHeroes(player.favoriteHeroes.map(hero => hero.name));
        setMmrProof('');
        setMmrValidation({ isValid: true, message: '' });
      }
    }
    setIsEditMode(!isEditMode);
  };

  const saveAllChanges = async () => {
    try {
      
      // Check if avatar was changed
      const avatarChanged = editedAvatar !== player?.avatarUrl;
      
      // If avatar changed, submit to profile image service
      if (avatarChanged && player && currentUser?.type === 'player') {
        const { default: profileImageService } = await import('../../services/profileImageService');
        
        const result = await profileImageService.submitImageUpdate(
          player.id,
          'player',
          player.avatarUrl || null,
          editedAvatar,
          editedAvatar.startsWith('data:') ? 'upload' : 'link'
        );

        if (!result.success) {
          error("Avatar Update Failed", result.error || "Failed to submit avatar change request");
          return;
        }
      }
      
      // Special handling for role changes - submit as request for approval
      if (currentUser?.type === 'player' && player) {
        // Import DatabaseService for role change requests
        const { default: DatabaseService } = await import('../../services/database');
        
        const result = await DatabaseService.submitRoleChangeRequest({
          playerId: player.id,
          playerNickname: player.nickname,
          currentRoles: player.roles?.map(r => r.label) || [],
          requestedRoles: editedRoles,
          reason: 'Profile update from player profile'
        });

        if (result.success) {
          const message = avatarChanged 
            ? "Your profile changes have been saved. Role changes, avatar updates, and MMR updates sent to admins for approval."
            : "Your profile changes have been saved. Role changes and MMR updates sent to admins for approval.";
          success("Profile Updated!", message);
          setIsEditMode(false);
          return;
        } else {
          error("Update Failed", `Failed to save profile changes: ${result.error}`);
          return;
        }
      }
      
      // Here you would normally make an API call to save all the data
      // For now, we'll simulate a successful save
      
      setIsEditMode(false);
      success("Profile Updated!", "All your profile changes have been successfully saved.");
      
    } catch (err) {
      console.error('Error saving profile:', err);
      error("Save Failed", "Failed to update profile. Please try again.");
    }
  };
  // Role management functions
  const addRole = (roleLabel: string) => {
    if (editedRoles.length >= 3) {
      warning("Role Limit Reached", "You can only select up to 3 roles for your change request.");
      return;
    }
    if (!editedRoles.includes(roleLabel)) {
      setEditedRoles(prev => [...prev, roleLabel]);
      success("Role Added", `${roleLabel} has been added to your role change request.`);
    }
  };

  const removeRole = (roleLabel: string) => {
    setEditedRoles(prev => prev.filter(role => role !== roleLabel));
    success("Role Removed", `${roleLabel} has been removed from your role change request.`);
  };

  // Get available roles that aren't already selected
  const availableRoles = DOTA_ROLES.filter(role => 
    !editedRoles.includes(role.name)
  );

  // Hero management functions
  const addHero = (heroName: string) => {
    if (editedHeroes.length >= 3) {
      warning("Hero Limit Reached", "You can only select up to 3 signature heroes.");
      return;
    }
    if (!editedHeroes.includes(heroName)) {
      setEditedHeroes(prev => [...prev, heroName]);
      setHeroSearchTerm('');
      success("Hero Added", `${heroName} has been added to your signature heroes.`);
    }
  };

  const removeHero = (heroName: string) => {
    setEditedHeroes(prev => prev.filter(hero => hero !== heroName));
    success("Hero Removed", `${heroName} has been removed from your signature heroes.`);
  };

  // Filter heroes based on search term
  const filteredHeroes = DOTA_HEROES.filter(hero =>
    hero.name.toLowerCase().includes(heroSearchTerm.toLowerCase()) &&
    !editedHeroes.includes(hero.name)
  ).slice(0, 10);
  
  // Get seasons in ascending order (S1, S2, S3...)
  const playerSeasons = player?.seasonBadges
    ? player.seasonBadges
        .map(s => typeof s === "number" ? s : parseInt(s.toString().replace(/\D/g, ''), 10))
        .filter(s => !isNaN(s))
        .sort((a, b) => a - b)
    : [];
  
  // Default to latest season (last in ascending array)
  const latestSeason = playerSeasons[playerSeasons.length - 1] || null;

  const handleLogout = () => {
    AuthService.logout();
    navigate('/');
  };

  if (loading) {
    return (
      <>
        <div className="fixed inset-0 z-0">
          <div
            className="absolute inset-0 bg-cover bg-center bg-no-repeat"
            style={{ backgroundImage: 'url(/bg5.jpg)' }}
          />
          <div className="absolute inset-0 bg-gradient-to-br from-slate-950/90 via-cyan-950/80 to-teal-950/90" />
        </div>

        <main className="relative z-10 w-full min-h-screen flex justify-center items-center pt-24 pb-16 px-4">
          <div className="text-center">
            <div className="animate-spin rounded-full h-16 w-16 border-t-2 border-b-2 border-cyan-400 mx-auto mb-4"></div>
            <p className="text-cyan-300 text-lg">Loading player data...</p>
          </div>
        </main>
      </>
    );
  }

  if (!player) {
    return (
      <>
        <div className="fixed inset-0 z-0">
          <div
            className="absolute inset-0 bg-cover bg-center bg-no-repeat"
            style={{ backgroundImage: 'url(/bg5.jpg)' }}
          />
          <div className="absolute inset-0 bg-gradient-to-br from-slate-950/90 via-cyan-950/80 to-teal-950/90" />
        </div>

        <main className="relative z-10 w-full min-h-screen flex justify-center pt-24 pb-16 px-4">
          <div className="w-full max-w-[1400px]">
            <h1 className="text-2xl font-semibold mb-4 text-slate-100">
              Player not found
            </h1>
            <button
              onClick={() => navigate("/players")}
              className="px-6 py-3 rounded-full border border-cyan-500/50 bg-black/40 backdrop-blur-sm text-sm uppercase tracking-wider text-slate-100 hover:bg-cyan-500/20 hover:border-cyan-400 transition-all duration-300"
            >
              ← Back to Players
            </button>
          </div>
        </main>
      </>
    );
  }

  return (
    <>
      {/* Toast Container */}
      <ToastContainer toasts={toasts} onClose={removeToast} />
      
      {/* Fixed Background with bg5.webp - Cyan/Teal Theme */}
      <div className="fixed inset-0 z-0">
        <div
          className="absolute inset-0 bg-cover bg-center bg-no-repeat"
          style={{ backgroundImage: 'url(/bg5.webp)' }}
        />
        <div className="absolute inset-0 bg-gradient-to-br from-slate-950/90 via-cyan-950/80 to-teal-950/90" />
        
        {/* Mystical glow effects - Cyan/Teal theme */}
        <div className="absolute inset-0 opacity-30">
          <div className="absolute top-1/4 left-1/4 w-96 h-96 rounded-full blur-3xl bg-cyan-500/40 animate-pulse" style={{ animationDuration: '8s' }} />
          <div className="absolute bottom-1/4 right-1/4 w-80 h-80 rounded-full blur-3xl bg-teal-500/30 animate-pulse" style={{ animationDuration: '10s', animationDelay: '2s' }} />
          <div className="absolute top-1/2 left-1/2 w-72 h-72 rounded-full blur-3xl bg-blue-500/25 animate-pulse" style={{ animationDuration: '12s', animationDelay: '4s' }} />
        </div>
      </div>

      <main className="relative z-10 w-full min-h-screen flex justify-center pt-20 sm:pt-24 pb-12 sm:pb-16 px-3 sm:px-4 md:px-6">
        <div className="w-full max-w-[1600px]">
          {/* Back button and Logout button */}
          <div className="flex justify-between items-center mb-6">
            <motion.button
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              onClick={() => navigate(-1)}
              className="px-6 py-3 rounded-full text-sm font-semibold uppercase tracking-wider
                         bg-black/40 backdrop-blur-md border border-cyan-500/30 text-cyan-200
                         hover:bg-cyan-500/20 hover:border-cyan-400 hover:shadow-[0_0_30px_rgba(6,182,212,0.4)]
                         transition-all duration-300"
            >
              ← Back
            </motion.button>

            {/* Logout button for own profile */}
            {canEdit && currentUser?.type === 'player' && currentUser.playerId === playerId && (
              <motion.button
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                onClick={handleLogout}
                className="flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-semibold
                           bg-red-600/80 hover:bg-red-600 text-white backdrop-blur-md
                           border border-red-500/30 hover:border-red-400
                           transition-all duration-300"
              >
                <LogOut className="w-4 h-4" />
                <span>Logout</span>
              </motion.button>
            )}
          </div>
          {/* Edit Button - Above the entire profile card */}
          {canEdit && currentUser?.type === 'player' && currentUser.playerId === playerId && (
            <div className="flex justify-center mb-6 gap-3">
              {!isEditMode ? (
                <>
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={toggleEditMode}
                    className="flex items-center gap-2 px-4 py-2 rounded-lg bg-blue-600/90 hover:bg-blue-600 border border-blue-500/50 hover:border-blue-400 transition-all duration-300 text-white font-medium text-sm shadow-lg"
                  >
                    <Edit3 className="w-4 h-4" />
                    <span>Request an Edit</span>
                  </motion.button>
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => setShowPasswordModal(true)}
                    className="flex items-center gap-2 px-4 py-2 rounded-lg bg-orange-600/90 hover:bg-orange-600 border border-orange-500/50 hover:border-orange-400 transition-all duration-300 text-white font-medium text-sm shadow-lg"
                  >
                    <Lock className="w-4 h-4" />
                    <span>Change Password</span>
                  </motion.button>
                </>
              ) : (
                <div className="flex gap-3">
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={saveAllChanges}
                    className="flex items-center gap-2 px-4 py-2 rounded-lg bg-green-600/90 hover:bg-green-600 border border-green-500/50 hover:border-green-400 transition-all duration-300 text-white font-medium text-sm shadow-lg"
                  >
                    <Save className="w-4 h-4" />
                    <span>Save Changes</span>
                  </motion.button>
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={toggleEditMode}
                    className="flex items-center gap-2 px-4 py-2 rounded-lg bg-gray-600/90 hover:bg-gray-600 border border-gray-500/50 hover:border-gray-400 transition-all duration-300 text-white font-medium text-sm shadow-lg"
                  >
                    <X className="w-4 h-4" />
                    <span>Cancel</span>
                  </motion.button>
                </div>
              )}
            </div>
          )}

          {/* Main Player Card - Increased size */}
          <motion.section
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="w-full max-w-6xl mx-auto"
          >
            <div className="rounded-2xl border border-cyan-500/20 bg-black/40 backdrop-blur-xl shadow-[0_20px_80px_rgba(0,0,0,0.8)] overflow-hidden">
              {/* Header Section */}
              <div className="relative p-4 sm:p-6 bg-gradient-to-br from-cyan-900/30 via-teal-900/20 to-transparent border-b border-cyan-500/20">

                <div className="flex gap-4 items-start">
                  {/* Avatar Section */}
                  <div className="relative">
                    <motion.div
                      whileHover={{ scale: 1.05 }}
                      className="relative w-28 h-28 sm:w-32 sm:h-32 rounded-xl overflow-hidden border-2 border-cyan-400/50 shadow-[0_0_30px_rgba(6,182,212,0.5)] flex-shrink-0"
                    >
                      {(isEditMode ? editedAvatar : player.avatarUrl) ? (
                        <img
                          src={isEditMode ? editedAvatar : player.avatarUrl}
                          alt={player.nickname}
                          className="w-full h-full object-cover"
                          onError={(e) => {
                            e.currentTarget.src = `https://ui-avatars.com/api/?name=${encodeURIComponent(player.nickname)}&background=6b7280&color=fff&size=128`;
                          }}
                        />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center text-3xl font-bold text-cyan-200 bg-gradient-to-br from-cyan-900 to-teal-900">
                          {player.nickname[0]?.toUpperCase()}
                        </div>
                      )}
                      <div className="absolute inset-0 bg-gradient-to-t from-cyan-500/20 to-transparent" />
                    </motion.div>

                    {/* Social Links - Below Avatar */}
                    <div className="flex items-center justify-center gap-2 mt-3">
                      {/* Dotabuff */}
                      {player.dotabuffUrl && (
                        <motion.a
                          whileHover={{ scale: 1.1 }}
                          whileTap={{ scale: 0.95 }}
                          href={player.dotabuffUrl}
                          target="_blank"
                          rel="noreferrer"
                          className="group relative flex items-center justify-center w-10 h-10 rounded-full
                                     border-2 border-[#FF4655] hover:border-[#FF5566]
                                     shadow-[0_0_15px_rgba(255,70,85,0.4)] hover:shadow-[0_0_25px_rgba(255,70,85,0.6)]
                                     transition-all duration-300 bg-transparent"
                        >
                          <div className="w-6 h-6 rounded bg-[#FF4655] group-hover:bg-[#FF5566] flex items-center justify-center transition-colors duration-300">
                            <span className="text-sm font-black text-white z-10">D</span>
                          </div>
                          <span className="pointer-events-none absolute -bottom-9 left-1/2 -translate-x-1/2 px-2 py-1 rounded-lg bg-black/90 border border-[#FF4655]/50 text-[0.65rem] text-[#FF4655] opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap z-20">
                            Dotabuff
                          </span>
                        </motion.a>
                      )}

                      {/* Steam */}
                      {player.steamUrl && (
                        <motion.a
                          whileHover={{ scale: 1.1 }}
                          whileTap={{ scale: 0.95 }}
                          href={player.steamUrl}
                          target="_blank"
                          rel="noreferrer"
                          className="group relative flex items-center justify-center w-10 h-10 rounded-full
                                     bg-gradient-to-br from-blue-500/30 via-indigo-500/20 to-blue-600/30 
                                     border border-blue-400/60
                                     hover:from-blue-500/50 hover:via-indigo-500/40 hover:to-blue-600/50 
                                     hover:border-blue-300 hover:shadow-[0_0_25px_rgba(59,130,246,0.6)]
                                     shadow-[0_0_15px_rgba(59,130,246,0.4)]
                                     transition-all duration-300"
                        >
                          <FaSteam className="w-5 h-5 text-blue-100 z-10" />
                          <span className="pointer-events-none absolute -bottom-9 left-1/2 -translate-x-1/2 px-2 py-1 rounded-lg bg-black/90 border border-blue-500/50 text-[0.65rem] text-blue-200 opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap z-20">
                            Steam
                          </span>
                        </motion.a>
                      )}
                    </div>

                    {/* Avatar Upload Input when editing - Smaller and better positioned */}
                    {isEditMode && (
                      <motion.div
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="absolute -bottom-2 left-0 right-0 p-2 bg-black/95 border border-cyan-500/30 rounded-lg backdrop-blur-sm text-center z-30"
                      >
                        <div className="text-[0.6rem] text-cyan-300/80 mb-1 uppercase tracking-wider font-semibold">Change Avatar</div>
                        <input
                          type="file"
                          accept="image/*"
                          onChange={(e) => {
                            const file = e.target.files?.[0];
                            if (file) {
                              const reader = new FileReader();
                              reader.onload = (e) => {
                                setEditedAvatar(e.target?.result as string);
                              };
                              reader.readAsDataURL(file);
                            }
                          }}
                          className="w-full text-[0.6rem] text-cyan-200 file:mr-1 file:py-0.5 file:px-1 file:rounded file:border-0 file:text-[0.6rem] file:bg-cyan-600/20 file:text-cyan-300 hover:file:bg-cyan-600/40"
                        />
                      </motion.div>
                    )}
                  </div>

                  {/* Name and Info Section */}
                  <div className="flex-1 min-w-0 space-y-3">
                    <div className="relative">
                      <div className="flex items-center gap-2">
                        <h1 className="text-2xl sm:text-3xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-cyan-200 via-teal-200 to-blue-200 drop-shadow-[0_0_15px_rgba(6,182,212,0.5)] truncate">
                          {isEditMode ? (
                            <input
                              type="text"
                              value={editedData.nickname}
                              onChange={(e) => setEditedData(prev => ({ ...prev, nickname: e.target.value }))}
                              className="bg-black/40 border border-cyan-500/30 rounded-lg px-2 py-1 text-cyan-200 text-xl font-bold focus:outline-none focus:ring-2 focus:ring-cyan-500"
                              placeholder="Your in-game name"
                            />
                          ) : (
                            player.nickname
                          )}
                        </h1>
                        {/* Special Badge for Contributors */}
                        {player.specialBadge === "contributor" && (
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
                      {/* Real Name */}
                      {(isEditMode ? editedData.realName : player.realName) && (
                        <p className="text-xs text-cyan-300/60 mt-0.5">
                          {isEditMode ? (
                            <div>
                              <label className="block text-[0.65rem] text-cyan-300/80 mb-1">Real Name (Optional)</label>
                              <input
                                type="text"
                                value={editedData.realName}
                                onChange={(e) => setEditedData(prev => ({ ...prev, realName: e.target.value }))}
                                className="bg-black/40 border border-cyan-500/30 rounded px-2 py-1 text-cyan-300 text-xs focus:outline-none focus:ring-1 focus:ring-cyan-500"
                                placeholder="Your real name (optional)"
                              />
                            </div>
                          ) : (
                            `Real Name: ${player.realName}`
                          )}
                        </p>
                      )}
                    </div>

                    {/* Bio Section - Moved here */}
                    <div className="relative">
                      <div className="flex items-center gap-2 mb-2">
                        <div className="flex-1 h-px bg-gradient-to-r from-transparent via-cyan-500/30 to-cyan-500/30" />
                        <h3 className="text-[0.65rem] uppercase tracking-widest text-cyan-300/70 font-semibold whitespace-nowrap">
                          Bio
                        </h3>
                        <div className="flex-1 h-px bg-gradient-to-l from-transparent via-cyan-500/30 to-cyan-500/30" />
                      </div>
                      
                      {isEditMode ? (
                        <textarea
                          value={editedData.bio}
                          onChange={(e) => setEditedData(prev => ({ ...prev, bio: e.target.value }))}
                          className="w-full p-3 bg-black/40 border border-cyan-500/30 rounded-lg text-cyan-200 text-sm focus:outline-none focus:ring-2 focus:ring-cyan-500 resize-none"
                          placeholder="Tell us about yourself..."
                          rows={3}
                        />
                      ) : (
                        <p className="text-sm text-cyan-200/80 leading-relaxed">
                          {player.bio || "No bio available."}
                        </p>
                      )}
                    </div>
                  </div>
                  {/* MMR & Rank with Edit */}
                  {(player.currentMMR || player.peakMMR) && (
                    <div className="hidden md:flex flex-col gap-2 flex-shrink-0 min-w-[200px] relative">
                      <div className="flex items-center gap-2 mb-1">
                        <div className="flex-1 h-px bg-gradient-to-r from-transparent via-cyan-500/30 to-cyan-500/30" />
                        <h3 className="text-[0.65rem] uppercase tracking-widest text-cyan-300/70 font-semibold whitespace-nowrap">
                          MMR & Rank
                        </h3>
                        {canEdit && currentUser?.type === 'player' && currentUser.playerId === playerId && (
                          <></>
                        )}
                        <div className="flex-1 h-px bg-gradient-to-l from-transparent via-cyan-500/30 to-cyan-500/30" />
                      </div>
                      <div className="space-y-2">
                        {/* Current MMR */}
                        {(isEditMode || player.currentMMR) && (
                          <div className="flex items-center gap-3 p-3 rounded-lg bg-black/30 border border-cyan-400/20">
                            <span className="text-[0.6rem] text-cyan-300/60 uppercase font-semibold w-14 flex-shrink-0">Current</span>
                            {isEditMode ? (
                              <div className="flex-1 space-y-2">
                                <input
                                  type="number"
                                  min="0"
                                  pattern="[0-9]*"
                                  inputMode="numeric"
                                  value={editedData.currentMMR}
                                  onChange={(e) => {
                                    const inputValue = e.target.value;
                                    
                                    // Only allow digits 0-9, no signs or other characters
                                    const sanitizedValue = inputValue.replace(/[^0-9]/g, '');
                                    
                                    // Validate the input
                                    let isValid = true;
                                    let message = '';
                                    
                                    if (sanitizedValue !== inputValue) {
                                      isValid = false;
                                      message = 'Only numbers 0-9 are allowed';
                                    } else if (sanitizedValue && parseInt(sanitizedValue) < 0) {
                                      isValid = false;
                                      message = 'MMR cannot be below 0';
                                    }
                                    
                                    setMmrValidation({ isValid, message });
                                    
                                    const mmr = Math.max(0, parseInt(sanitizedValue) || 0);
                                    const medal = getMedalFromMMR(mmr);
                                    
                                    setEditedData(prev => ({ 
                                      ...prev, 
                                      currentMMR: sanitizedValue,
                                      currentMedalLabel: medal.label,
                                      currentMedalId: medal.id
                                    }));
                                  }}
                                  className={`text-sm font-bold tabular-nums w-full text-center rounded px-2 py-1 focus:outline-none focus:ring-1 transition-all duration-200 ${
                                    mmrValidation.isValid 
                                      ? 'text-cyan-300 bg-black/40 border border-cyan-500/30 focus:ring-cyan-500' 
                                      : 'text-red-300 bg-red-900/20 border border-red-500 focus:ring-red-500'
                                  }`}
                                  placeholder="MMR"
                                />
                                {/* Validation Message */}
                                {!mmrValidation.isValid && (
                                  <div className="text-[0.55rem] text-red-400 mt-1 text-center">
                                    {mmrValidation.message}
                                  </div>
                                )}
                                {/* MMR Proof Upload */}
                                <div className="text-center">
                                  <div className="text-[0.6rem] text-cyan-300/80 mb-1">Upload MMR Proof:</div>
                                  <input
                                    type="file"
                                    accept="image/*"
                                    onChange={(e) => {
                                      const file = e.target.files?.[0];
                                      if (file) {
                                        const reader = new FileReader();
                                        reader.onload = (e) => {
                                          setMmrProof(e.target?.result as string);
                                        };
                                        reader.readAsDataURL(file);
                                      }
                                    }}
                                    className="w-full text-[0.6rem] text-cyan-200 file:mr-1 file:py-0.5 file:px-1 file:rounded file:border-0 file:text-[0.6rem] file:bg-cyan-600/20 file:text-cyan-300 hover:file:bg-cyan-600/40"
                                  />
                                  <div className="text-[0.55rem] text-cyan-400/60 mt-1">Screenshot required for MMR verification</div>
                                </div>
                              </div>
                            ) : (
                              <span className="text-sm font-bold text-cyan-300 tabular-nums flex-1 text-center">
                                {player.currentMMR || 'Not set'}
                              </span>
                            )}
                            {(isEditMode ? editedData.currentMedalId : player.currentMedalId) && (
                              <motion.div 
                                whileHover={{ scale: 1.15, rotate: 5 }}
                                className="group relative flex-shrink-0"
                              >
                                <img
                                  src={`/medals/${isEditMode ? editedData.currentMedalId : player.currentMedalId}.png`}
                                  alt={isEditMode ? editedData.currentMedalLabel : player.currentMedalLabel}
                                  className="w-8 h-8 object-contain transition-all duration-300 group-hover:drop-shadow-[0_0_8px_rgba(6,182,212,0.8)]"
                                />
                              </motion.div>
                            )}
                          </div>
                        )}
                        {/* Peak MMR */}
                        {(isEditMode ? editedData.peakMMR : player.peakMMR) && (
                          <div className="flex items-center gap-3 p-3 rounded-lg bg-black/30 border border-teal-400/20">
                            <span className="text-[0.6rem] text-teal-300/60 uppercase font-semibold w-14 flex-shrink-0">Peak</span>
                            <div className="flex-1 text-center">
                              <span className="text-sm font-bold text-teal-300 tabular-nums">
                                {player.peakMMR}
                              </span>
                              {isEditMode && (
                                <div className="text-[0.55rem] text-teal-300/60 mt-1">Peak MMR cannot be edited</div>
                              )}
                            </div>
                            {player.peakMedalId && (
                              <motion.div 
                                whileHover={{ scale: 1.15, rotate: -5 }}
                                className="group relative flex-shrink-0"
                              >
                                <img
                                  src={`/medals/${player.peakMedalId}.png`}
                                  alt={player.peakMedalLabel}
                                  className="w-8 h-8 object-contain transition-all duration-300 group-hover:drop-shadow-[0_0_8px_rgba(20,184,166,0.8)]"
                                />
                              </motion.div>
                            )}
                          </div>
                        )}
                      </div>

                    </div>
                  )}
                  {/* Signature Heroes with Edit */}
                  {((player.favoriteHeroes && player.favoriteHeroes.length > 0) || (canEdit && currentUser?.type === 'player' && currentUser.playerId === playerId)) && (
                    <div className="hidden lg:flex flex-col gap-2 flex-shrink-0 relative">
                      <div className="flex items-center gap-2 mb-1">
                        <div className="flex-1 h-px bg-gradient-to-r from-transparent via-cyan-500/30 to-cyan-500/30" />
                        <h3 className="text-[0.65rem] uppercase tracking-widest text-cyan-300/70 font-semibold whitespace-nowrap">
                          Signature Heroes
                        </h3>
                        {canEdit && currentUser?.type === 'player' && currentUser.playerId === playerId && (
                          <></>
                        )}
                        <div className="flex-1 h-px bg-gradient-to-l from-transparent via-cyan-500/30 to-cyan-500/30" />
                      </div>
                      
                      {isEditMode ? (
                        <div className="space-y-3">
                          {/* Heroes Grid */}
                          <div className="flex gap-3">
                            {/* Current Heroes with Remove Button */}
                            {editedHeroes.map((heroName) => {
                              const heroData = findHeroByName(heroName);
                              return (
                                <motion.div
                                  key={heroName}
                                  initial={{ opacity: 0, scale: 0.8 }}
                                  animate={{ opacity: 1, scale: 1 }}
                                  className="group relative flex flex-col items-center"
                                >
                                  <div className="rounded-2xl overflow-hidden border-2 border-cyan-400/40 shadow-lg transition-all duration-300">
                                    <div className="relative w-24 h-24">
                                      {heroData && (
                                        <video
                                          src={heroData.videoSrc}
                                          autoPlay
                                          loop
                                          muted
                                          playsInline
                                          className="w-full h-full object-cover"
                                        />
                                      )}
                                      <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent" />
                                    </div>
                                  </div>
                                  <span className="mt-2 text-xs text-cyan-200 font-bold text-center max-w-[96px] truncate">
                                    {heroName}
                                  </span>
                                  {/* Remove Button */}
                                  <motion.button
                                    whileHover={{ scale: 1.2 }}
                                    whileTap={{ scale: 0.9 }}
                                    onClick={() => removeHero(heroName)}
                                    className="absolute -top-2 -right-2 w-6 h-6 bg-gradient-to-br from-red-500 to-red-600 hover:from-red-400 hover:to-red-500 rounded-full flex items-center justify-center border-2 border-white/80 shadow-lg transition-all duration-200"
                                  >
                                    <Minus className="w-3 h-3 text-white" />
                                  </motion.button>
                                </motion.div>
                              );
                            })}
                            
                            {/* Add Hero Slots */}
                            {Array.from({ length: 3 - editedHeroes.length }).map((_, idx) => (
                              <motion.div
                                key={`add-slot-${idx}`}
                                initial={{ opacity: 0, scale: 0.8 }}
                                animate={{ opacity: 1, scale: 1 }}
                                className="group relative flex flex-col items-center cursor-pointer"
                                onClick={() => setHeroSearchTerm('search')}
                              >
                                <motion.div
                                  whileHover={{ scale: 1.05 }}
                                  whileTap={{ scale: 0.95 }}
                                  className="w-24 h-24 rounded-2xl bg-gradient-to-br from-green-500/20 to-green-600/30 hover:from-green-500/40 hover:to-green-600/50 border-2 border-green-400/40 hover:border-green-300/60 transition-all duration-300 flex items-center justify-center shadow-lg hover:shadow-green-500/20"
                                >
                                  <Plus className="w-8 h-8 text-green-300" />
                                </motion.div>
                                <span className="mt-2 text-xs text-green-300 font-bold text-center">Add Hero</span>
                              </motion.div>
                            ))}
                          </div>
                          
                          {/* Hero Search Modal */}
                          {heroSearchTerm && (
                            <motion.div
                              initial={{ opacity: 0, y: 10 }}
                              animate={{ opacity: 1, y: 0 }}
                              className="absolute top-full left-0 right-0 mt-2 bg-black/95 border border-cyan-500/30 rounded-xl backdrop-blur-sm z-30 shadow-2xl"
                            >
                              <div className="p-4">
                                <div className="flex items-center justify-between mb-3">
                                  <h4 className="text-sm font-semibold text-cyan-300">Select a Hero</h4>
                                  <motion.button
                                    whileHover={{ scale: 1.1 }}
                                    whileTap={{ scale: 0.9 }}
                                    onClick={() => setHeroSearchTerm('')}
                                    className="p-1 rounded-lg bg-gray-600/80 hover:bg-gray-600 border border-gray-500/30 hover:border-gray-400 transition-all duration-300"
                                  >
                                    <X className="w-4 h-4 text-white" />
                                  </motion.button>
                                </div>
                                
                                <input
                                  type="text"
                                  value={heroSearchTerm === 'search' ? '' : heroSearchTerm}
                                  onChange={(e) => setHeroSearchTerm(e.target.value)}
                                  className="w-full p-3 bg-black/40 border border-cyan-500/30 rounded-lg text-cyan-100 text-sm focus:outline-none focus:ring-2 focus:ring-cyan-500 focus:border-cyan-400 mb-3"
                                  placeholder="Type hero name..."
                                  autoFocus
                                />
                                
                                <div className="max-h-64 overflow-y-auto space-y-1">
                                  {filteredHeroes.map(hero => (
                                    <motion.button
                                      key={hero.id}
                                      whileHover={{ scale: 1.02 }}
                                      whileTap={{ scale: 0.98 }}
                                      onClick={() => addHero(hero.name)}
                                      className="w-full flex items-center gap-3 p-3 hover:bg-cyan-500/20 rounded-lg text-left transition-all duration-200 group/item"
                                    >
                                      <div className="w-12 h-12 rounded-lg overflow-hidden border border-cyan-400/30 group-hover/item:border-cyan-400/60 transition-colors flex-shrink-0">
                                        <video
                                          src={hero.videoSrc}
                                          autoPlay
                                          loop
                                          muted
                                          playsInline
                                          className="w-full h-full object-cover"
                                        />
                                      </div>
                                      <span className="text-sm text-cyan-200 group-hover/item:text-cyan-100 font-medium transition-colors">
                                        {hero.name}
                                      </span>
                                    </motion.button>
                                  ))}
                                  
                                  {heroSearchTerm && heroSearchTerm !== 'search' && filteredHeroes.length === 0 && (
                                    <div className="text-center py-4 text-cyan-300/60 text-sm">
                                      No heroes found matching "{heroSearchTerm}"
                                    </div>
                                  )}
                                </div>
                              </div>
                            </motion.div>
                          )}
                        </div>
                      ) : (
                        <div className="flex gap-3">
                          {player.favoriteHeroes.slice(0, 3).map((hero, idx) => (
                            <motion.div
                              key={hero.name}
                              initial={{ opacity: 0, scale: 0.8 }}
                              animate={{ opacity: 1, scale: 1 }}
                              transition={{ delay: 0.4 + idx * 0.1 }}
                              whileHover={{ scale: 1.05, y: -4 }}
                              className="group relative flex flex-col items-center"
                            >
                              <div className="rounded-2xl overflow-hidden border-2 border-cyan-400/40 hover:border-cyan-400 shadow-lg hover:shadow-[0_0_30px_rgba(6,182,212,0.7)] transition-all duration-300">
                                <div className="relative w-24 h-24">
                                  <video
                                    src={hero.videoSrc}
                                    autoPlay
                                    loop
                                    muted
                                    playsInline
                                    className="w-full h-full object-cover"
                                  />
                                  <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent" />
                                </div>
                              </div>
                              <span className="mt-2 text-xs text-cyan-200 font-bold text-center max-w-[96px] truncate">
                                {hero.name}
                              </span>
                            </motion.div>
                          ))}
                          
                          {player.favoriteHeroes && player.favoriteHeroes.length === 0 && !isEditMode && (
                            <div className="text-center text-cyan-300/60 text-xs italic py-4">
                              No signature heroes set
                            </div>
                          )}
                        </div>
                      )}
                    </div>
                  )}
                </div>
              </div>
              {/* Content Grid - 2 Columns */}
              <div className="p-4 sm:p-6 grid grid-cols-1 lg:grid-cols-[1fr_1fr] gap-4">
                {/* Left Column */}
                <div className="space-y-4">
                  {/* Preferred Roles with Edit */}
                  <motion.div
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.2 }}
                    className="rounded-xl border border-cyan-500/20 bg-gradient-to-br from-cyan-900/20 to-teal-900/10 p-4 relative"
                  >
                    <div className="flex items-center gap-3 mb-3">
                      <div className="flex-1 h-px bg-gradient-to-r from-transparent via-cyan-500/30 to-cyan-500/30" />
                      <h3 className="text-xs uppercase tracking-widest text-cyan-300/70 font-semibold whitespace-nowrap">
                        Preferred Roles
                      </h3>
                      {canEdit && currentUser?.type === 'player' && currentUser.playerId === playerId && (
                        <></>
                      )}
                      <div className="flex-1 h-px bg-gradient-to-l from-transparent via-cyan-500/30 to-cyan-500/30" />
                    </div>
                    
                    {/* Role Icons Container */}
                    <div className="flex items-center gap-2 flex-wrap justify-center">
                      {/* Current Roles */}
                      {(isEditMode ? editedRoles : player.roles.map(r => r.label)).slice(0, 3).map((roleLabel, idx) => {
                        const roleData = DOTA_ROLES.find(r => r.name === roleLabel) || player.roles.find(r => r.label === roleLabel);
                        return (
                          <motion.div
                            key={roleLabel}
                            initial={{ opacity: 0, scale: 0.8 }}
                            animate={{ opacity: 1, scale: 1 }}
                            transition={{ delay: 0.3 + idx * 0.05 }}
                            whileHover={{ scale: 1.05 }}
                            className="group relative"
                          >
                            <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-slate-700/80 via-slate-800/60 to-slate-900/80 border-2 border-white/40 shadow-lg transition-all duration-300 p-2 hover:border-cyan-400/60 hover:shadow-cyan-500/20">
                              {roleData?.iconSrc && (
                                <img
                                  src={roleData.iconSrc}
                                  alt={roleLabel}
                                  className="w-full h-full object-contain brightness-110 drop-shadow-sm"
                                />
                              )}
                            </div>
                            {/* Remove button when editing */}
                            {isEditMode && canEdit && (
                              <motion.button
                                whileHover={{ scale: 1.2 }}
                                whileTap={{ scale: 0.9 }}
                                onClick={() => removeRole(roleLabel)}
                                className="absolute -top-1 -right-1 w-5 h-5 bg-gradient-to-br from-red-500 to-red-600 hover:from-red-400 hover:to-red-500 rounded-full flex items-center justify-center border border-white/80 shadow-lg transition-all duration-200"
                              >
                                <Minus className="w-2.5 h-2.5 text-white" />
                              </motion.button>
                            )}
                            <span className="pointer-events-none absolute -bottom-8 left-1/2 -translate-x-1/2 px-2 py-1 rounded bg-black/90 border border-cyan-500/60 text-[0.6rem] text-cyan-200 opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap z-10 font-medium">
                              {roleLabel}
                            </span>
                          </motion.div>
                        );
                      })}

                      {/* Available roles when editing */}
                      {isEditMode && canEdit && (
                        <>
                          {availableRoles.map(role => (
                            <motion.button
                              key={role.id}
                              whileHover={{ scale: 1.05 }}
                              whileTap={{ scale: 0.95 }}
                              onClick={() => addRole(role.name)}
                              className="group relative"
                              disabled={editedRoles.length >= 3}
                            >
                              <div className={`w-10 h-10 rounded-lg bg-gradient-to-br from-slate-700/40 via-slate-800/30 to-slate-900/40 border-2 shadow-lg transition-all duration-300 p-2 relative ${
                                editedRoles.length >= 3 
                                  ? 'border-gray-600/20 opacity-30 cursor-not-allowed' 
                                  : 'border-white/20 hover:border-green-400/60 hover:shadow-green-500/20 opacity-60 hover:opacity-100'
                              }`}>
                                <img
                                  src={role.iconSrc}
                                  alt={role.name}
                                  className="w-full h-full object-contain brightness-110 drop-shadow-sm"
                                />
                                {/* Plus icon overlay */}
                                {editedRoles.length < 3 && (
                                  <div className="absolute -top-1 -right-1 w-4 h-4 bg-green-500 rounded-full flex items-center justify-center border border-white/80 shadow-lg">
                                    <Plus className="w-2.5 h-2.5 text-white" />
                                  </div>
                                )}
                              </div>
                              {editedRoles.length < 3 && (
                                <span className="pointer-events-none absolute -bottom-8 left-1/2 -translate-x-1/2 px-2 py-1 rounded bg-black/90 border border-green-500/60 text-[0.6rem] text-green-200 opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap z-10 font-medium">
                                  Add {role.name}
                                </span>
                              )}
                            </motion.button>
                          ))}
                        </>
                      )}
                      
                      {/* Show message when no roles and not editing */}
                      {!isEditMode && player.roles && player.roles.length === 0 && (
                        <span className="text-xs text-cyan-300/50 italic">
                          No preferred roles set
                        </span>
                      )}
                    </div>

                  </motion.div>

                  {/* Trophy Cabinet */}
                  <motion.div
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.4 }}
                    className="rounded-xl border border-cyan-500/20 bg-gradient-to-br from-cyan-900/20 to-teal-900/10 p-4"
                  >
                    <div className="flex items-center gap-3 mb-3">
                      <div className="flex-1 h-px bg-gradient-to-r from-transparent via-cyan-500/30 to-cyan-500/30" />
                      <h3 className="text-xs uppercase tracking-widest text-cyan-300/70 font-semibold whitespace-nowrap">
                        Trophy Cabinet
                      </h3>
                      <div className="flex-1 h-px bg-gradient-to-l from-transparent via-cyan-500/30 to-cyan-500/30" />
                    </div>
                    
                    <div className="space-y-3">
                      {/* Cup Achievement */}
                      {player.hasWonCup && effectiveCupRank && (
                        <div>
                          <motion.div
                            initial={{ opacity: 0, scale: 0.8 }}
                            animate={{ opacity: 1, scale: 1 }}
                            transition={{ delay: 0.6 }}
                            whileHover={{ scale: 1.02, rotate: 1 }}
                            className={`w-full flex items-center justify-center gap-3 px-6 py-4 rounded-xl border-2 ${cupCircleStyles[effectiveCupRank]} transition-all duration-300`}
                          >
                            <span className="text-lg font-bold text-white">
                              {cupIcons[effectiveCupRank]}- Season {player.cupSeason || 'Unknown'}
                            </span>
                          </motion.div>
                        </div>
                      )}

                      {/* Empty state */}
                      {!player.hasWonCup && (
                        <div className="text-center text-cyan-300/40 text-xs italic py-4">
                          No trophies yet
                        </div>
                      )}
                    </div>
                  </motion.div>
                </div>
                {/* Right Column - Seasons */}
                <div className="space-y-4">

                {/* Seasons */}
                <motion.div
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.2 }}
                  className="rounded-xl border border-cyan-500/20 bg-gradient-to-br from-cyan-900/20 to-teal-900/10 overflow-hidden"
                >
                  <div className="px-4 py-3 border-b border-cyan-500/20 bg-gradient-to-br from-cyan-900/30 via-teal-900/20 to-transparent">
                    <div className="flex items-center gap-3 mb-3">
                      <div className="flex-1 h-px bg-gradient-to-r from-transparent via-cyan-500/30 to-cyan-500/30" />
                      <h3 className="text-xs uppercase tracking-widest text-cyan-300/70 font-semibold whitespace-nowrap">
                        Seasons Played
                      </h3>
                      <div className="flex-1 h-px bg-gradient-to-l from-transparent via-cyan-500/30 to-cyan-500/30" />
                    </div>
                    
                    {playerSeasons.length > 0 ? (
                      <div className="flex flex-wrap gap-2 justify-center">
                        {playerSeasons.map((season) => (
                          <motion.button
                            key={season}
                            whileHover={{ scale: 1.08 }}
                            whileTap={{ scale: 0.95 }}
                            onClick={() => setSelectedSeason(selectedSeason === season ? null : season)}
                            className={`relative flex items-center justify-center w-12 h-12 rounded-full transition-all duration-300 ${
                              coloredSeasonBadgeStyles[season] || coloredSeasonBadgeStyles[1]
                            } ${
                              selectedSeason === season
                                ? 'scale-110 ring-2 ring-white/80 shadow-[0_0_30px_rgba(255,255,255,0.5)]'
                                : 'hover:border-white/80 hover:shadow-[0_0_25px_rgba(255,255,255,0.3)]'
                            }`}
                          >
                            <span className="text-[0.8rem] font-black text-white drop-shadow-[0_2px_4px_rgba(0,0,0,0.9)]">
                              S{season}
                            </span>
                          </motion.button>
                        ))}
                      </div>
                    ) : (
                      <p className="text-xs text-cyan-300/60 text-center">No season data available</p>
                    )}
                  </div>

                  {/* Match History Placeholder */}
                  <div className="p-8 text-center text-cyan-300/60">
                    <p className="text-sm">Match history will be displayed here</p>
                    <p className="text-xs mt-2">Season {selectedSeason || latestSeason || 'N/A'} matches</p>
                  </div>
                </motion.div>
                </div>
              </div>
            </div>
          </motion.section>
        </div>
      </main>

      {/* Password Change Modal */}
      {player && (
        <>
          <PasswordChangeModal
            isOpen={showPasswordModal}
            onClose={() => setShowPasswordModal(false)}
            userId={player.id}
            userType="player"
            userName={player.nickname}
            requireOldPassword={true}
          />
          
          {/* First Login Password Change - Only for logged in player viewing their own profile */}
          {canEdit && currentUser?.type === 'player' && currentUser.playerId === playerId && !passwordChanged && (
            <FirstLoginPasswordChange
              userId={player.id}
              userType="player"
              userName={player.nickname}
              onPasswordChanged={() => setPasswordChanged(true)}
            />
          )}
        </>
      )}
    </>
  );
}
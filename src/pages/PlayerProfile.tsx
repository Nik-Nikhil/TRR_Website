import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { User, Edit3, Save, X, Camera, Shield, Trophy, Star, LogOut, AlertTriangle } from 'lucide-react';
import { motion } from 'framer-motion';
import { getPlayerById, type Player } from '../data/players';
import AuthService from '../services/auth';
import DatabaseService from '../services/database';
import playerBanService from '../services/playerBanService';
import { getMedalFromMMR, type MedalInfo } from '../utils/mmrToMedal';

export const PlayerProfile: React.FC = () => {
  const { playerId } = useParams<{ playerId: string }>();
  const navigate = useNavigate();
  const [player, setPlayer] = useState<Player | null>(null);
  const [isEditing, setIsEditing] = useState(false);
  const [editedData, setEditedData] = useState({
    bio: '',
    currentMedalLabel: '',
    currentMMR: '',
    peakMedalLabel: '',
    peakMMR: '',
    realName: '',
    roles: [] as string[]
  });
  const [roleChangeRequest, setRoleChangeRequest] = useState<string[]>([]);
  const [showRoleChangeModal, setShowRoleChangeModal] = useState(false);

  const availableRoles = [
    { id: 'carry', label: 'Carry', iconSrc: '/icons/pos_1.png' },
    { id: 'mid', label: 'Mid', iconSrc: '/icons/pos_2.png' },
    { id: 'offlane', label: 'Offlane', iconSrc: '/icons/pos_3.png' },
    { id: 'soft_support', label: 'Soft Support', iconSrc: '/icons/pos_4.png' },
    { id: 'hard_support', label: 'Hard Support', iconSrc: '/icons/pos_5.png' }
  ];

  // Medal Display Component
  const MedalDisplay = ({ mmr, label, type }: { mmr?: number; label?: string; type: 'current' | 'peak' }) => {
    if (!mmr) {
      return (
        <div className="flex items-center gap-3 p-4 bg-gray-700/30 rounded-xl border border-gray-600/30">
          <div className="w-16 h-16 bg-gray-600/50 rounded-full flex items-center justify-center">
            <img src="/medals/Uncalibrated.png" alt="Uncalibrated" className="w-12 h-12 opacity-60" />
          </div>
          <div>
            <p className="text-gray-400 text-sm font-medium">{type === 'current' ? 'Current Rank' : 'Peak Rank'}</p>
            <p className="text-gray-500 text-lg font-bold">Uncalibrated</p>
            <p className="text-gray-600 text-sm">No MMR data</p>
          </div>
        </div>
      );
    }

    const medalInfo = getMedalFromMMR(mmr);
    const medalImagePath = `/medals/${medalInfo.id}.png`;
    
    // Color scheme based on medal tier
    const getColorScheme = (medalId: string) => {
      if (medalId.includes('Herald')) return { bg: 'from-orange-900/20 to-red-900/20', border: 'border-orange-500/30', text: 'text-orange-300', glow: 'shadow-orange-500/20' };
      if (medalId.includes('Guardian')) return { bg: 'from-green-900/20 to-emerald-900/20', border: 'border-green-500/30', text: 'text-green-300', glow: 'shadow-green-500/20' };
      if (medalId.includes('Crusader')) return { bg: 'from-yellow-900/20 to-amber-900/20', border: 'border-yellow-500/30', text: 'text-yellow-300', glow: 'shadow-yellow-500/20' };
      if (medalId.includes('Archon')) return { bg: 'from-blue-900/20 to-cyan-900/20', border: 'border-blue-500/30', text: 'text-blue-300', glow: 'shadow-blue-500/20' };
      if (medalId.includes('Legend')) return { bg: 'from-purple-900/20 to-violet-900/20', border: 'border-purple-500/30', text: 'text-purple-300', glow: 'shadow-purple-500/20' };
      if (medalId.includes('Ancient')) return { bg: 'from-pink-900/20 to-rose-900/20', border: 'border-pink-500/30', text: 'text-pink-300', glow: 'shadow-pink-500/20' };
      if (medalId.includes('Divine')) return { bg: 'from-indigo-900/20 to-blue-900/20', border: 'border-indigo-500/30', text: 'text-indigo-300', glow: 'shadow-indigo-500/20' };
      if (medalId.includes('Immortal')) return { bg: 'from-red-900/20 to-orange-900/20', border: 'border-red-500/30', text: 'text-red-300', glow: 'shadow-red-500/20' };
      return { bg: 'from-gray-900/20 to-slate-900/20', border: 'border-gray-500/30', text: 'text-gray-300', glow: 'shadow-gray-500/20' };
    };

    const colors = getColorScheme(medalInfo.id);

    return (
      <div className={`relative flex items-center gap-4 p-4 bg-gradient-to-r ${colors.bg} rounded-xl border ${colors.border} backdrop-blur-sm hover:scale-[1.02] transition-all duration-300 ${colors.glow} hover:shadow-lg`}>
        <div className="relative">
          <div className="w-16 h-16 rounded-full bg-black/20 flex items-center justify-center p-1">
            <img 
              src={medalImagePath} 
              alt={medalInfo.label} 
              className="w-14 h-14 object-contain"
              onError={(e) => {
                e.currentTarget.src = "/medals/Uncalibrated.png";
              }}
            />
          </div>
          {type === 'peak' && (
            <div className="absolute -top-1 -right-1 w-6 h-6 bg-yellow-500 rounded-full flex items-center justify-center">
              <Star className="w-3 h-3 text-yellow-900" />
            </div>
          )}
        </div>
        <div className="flex-1">
          <p className="text-gray-400 text-sm font-medium">{type === 'current' ? 'Current Rank' : 'Peak Rank'}</p>
          <p className={`${colors.text} text-lg font-bold`}>{medalInfo.label}</p>
          <p className="text-gray-300 text-sm font-semibold">{mmr.toLocaleString()} MMR</p>
        </div>
        <div className="text-right">
          <div className={`px-3 py-1 ${colors.bg} rounded-full border ${colors.border}`}>
            <span className={`text-xs font-bold ${colors.text}`}>
              {medalInfo.id.includes('Immortal') ? 'TOP TIER' : `${medalInfo.minMMR}-${medalInfo.maxMMR}`}
            </span>
          </div>
        </div>
      </div>
    );
  };

  // Get current user from auth service
  const currentUser = AuthService.getCurrentUser();
  const isAuthenticated = AuthService.isSessionValid();

  useEffect(() => {
    // Check if user is logged in
    if (!isAuthenticated || !currentUser || currentUser.type !== 'player') {
      navigate('/player-login');
      return;
    }

    if (playerId) {
      const foundPlayer = getPlayerById(playerId);
      if (!foundPlayer) {
        navigate('/player-login');
        return;
      }
      
      // Check if user can access this profile
      if (currentUser.playerId !== playerId) {
        navigate(`/profile/${currentUser.playerId}`);
        return;
      }

      setPlayer(foundPlayer);
      setEditedData({
        bio: foundPlayer.bio || '',
        currentMedalLabel: foundPlayer.currentMedalLabel || '',
        currentMMR: foundPlayer.currentMMR?.toString() || '',
        peakMedalLabel: foundPlayer.peakMedalLabel || '',
        peakMMR: foundPlayer.peakMMR?.toString() || '',
        realName: foundPlayer.realName || '',
        roles: foundPlayer.roles?.map(role => role.label) || []
      });
    }
  }, [playerId, isAuthenticated, currentUser, navigate]);

  if (!player) {
    return (
      <div className="min-h-screen bg-gray-900 flex items-center justify-center">
        <div className="text-white text-xl">Loading...</div>
      </div>
    );
  }

  const handleSave = () => {
    // In a real implementation, this would update the database
    const updatedPlayer = {
      ...player,
      bio: editedData.bio,
      currentMedalLabel: editedData.currentMedalLabel,
      currentMMR: editedData.currentMMR ? parseInt(editedData.currentMMR) : undefined,
      peakMedalLabel: editedData.peakMedalLabel,
      peakMMR: editedData.peakMMR ? parseInt(editedData.peakMMR) : undefined,
      realName: editedData.realName
    };
    
    setPlayer(updatedPlayer);
    setIsEditing(false);
    
    // Show success message
    alert('Profile updated successfully! Changes will be saved to the database.');
  };

  const handleRoleChangeRequest = async () => {
    if (roleChangeRequest.length === 0) {
      alert('Please select at least one role to request a change.');
      return;
    }

    if (roleChangeRequest.length > 3) {
      alert('You can select a maximum of 3 roles.');
      return;
    }

    try {
      const result = await DatabaseService.submitRoleChangeRequest({
        playerId: player.id,
        playerNickname: player.nickname,
        currentRoles: player.roles?.map(r => r.label) || [],
        requestedRoles: roleChangeRequest,
        reason: 'Role preference update'
      });

      if (result.success) {
        alert(`Role change request submitted successfully! Your request for roles: ${roleChangeRequest.join(', ')} has been sent to admins for approval.`);
        setShowRoleChangeModal(false);
        setRoleChangeRequest([]);
      } else {
        alert(`Failed to submit role change request: ${result.error}`);
      }
    } catch (error) {
      console.error('Error submitting role change request:', error);
      alert('An error occurred while submitting your request. Please try again.');
    }
  };

  const toggleRoleSelection = (roleLabel: string) => {
    setRoleChangeRequest(prev => {
      if (prev.includes(roleLabel)) {
        return prev.filter(r => r !== roleLabel);
      } else if (prev.length < 3) {
        return [...prev, roleLabel];
      } else {
        alert('You can select a maximum of 3 roles.');
        return prev;
      }
    });
  };

  const handleLogout = () => {
    AuthService.logout();
    navigate('/');
  };

  return (
    <>
      {/* Background */}
      <div className="fixed inset-0 z-0">
        <div className="absolute inset-0 bg-[url('https://cdn.cloudflare.steamstatic.com/apps/dota2/images/dota_react/blog/play/dota_heroes.jpg')] bg-cover bg-center" />
        <div 
          className="absolute inset-0"
          style={{
            background: "radial-gradient(circle at 0% 0%, rgba(192,192,192,0.15), transparent 60%), radial-gradient(circle at 100% 100%, rgba(136,144,150,0.12), transparent 60%), rgba(5,7,10,0.94)"
          }}
        />
        <div className="absolute inset-0 bg-gradient-to-br from-gray-800/30 via-slate-900/40 to-gray-900/50" />
      </div>

      <main className="relative z-10 min-h-screen pt-24 pb-12">
        <div className="max-w-4xl mx-auto px-4">
          {/* Header */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex items-center justify-between mb-8"
          >
            <div>
              <h1 className="text-3xl font-bold text-white mb-2">My Profile</h1>
              <p className="text-gray-400">Manage your tournament profile</p>
            </div>
            <button
              onClick={handleLogout}
              className="flex items-center gap-2 px-4 py-2 bg-red-600/80 hover:bg-red-600 text-white rounded-lg transition-colors backdrop-blur-sm"
            >
              <LogOut className="w-4 h-4" />
              <span>Logout</span>
            </button>
          </motion.div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Avatar Section */}
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              className="lg:col-span-1"
            >
              <div className="bg-gradient-to-br from-gray-800/60 to-gray-900/60 backdrop-blur-xl border border-gray-600/30 rounded-2xl p-6 shadow-2xl">
                <h2 className="text-xl font-semibold mb-6 flex items-center text-white">
                  <Camera className="w-5 h-5 mr-2" />
                  Profile Picture
                </h2>
                
                <div className="text-center">
                  <div className="relative w-32 h-32 mx-auto mb-4">
                    <div className="w-full h-full rounded-full overflow-hidden bg-gradient-to-br from-blue-500/20 to-purple-500/20 border-4 border-gray-600/50 shadow-xl">
                      <img 
                        src={player.avatarUrl || '/avatars/default.png'} 
                        alt={player.nickname}
                        className="w-full h-full object-cover"
                      />
                    </div>
                    {/* Online indicator */}
                    <div className="absolute bottom-2 right-2 w-6 h-6 bg-green-500 rounded-full border-3 border-gray-800 shadow-lg flex items-center justify-center">
                      <div className="w-3 h-3 bg-green-400 rounded-full animate-pulse"></div>
                    </div>
                  </div>
                  <p className="text-gray-400 text-sm">Avatar upload feature temporarily disabled</p>
                </div>

                {/* Player Stats Summary */}
                <div className="mt-6 space-y-4">
                  <div className="text-center">
                    <h3 className="text-xl font-bold text-white mb-2 bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">
                      {player.nickname}
                    </h3>
                    {player.realName && (
                      <p className="text-gray-400 text-sm font-medium">{player.realName}</p>
                    )}
                    
                    {/* Banned Status */}
                    {playerBanService.isPlayerBanned(player.id) && (
                      <div className="mt-4 p-4 bg-red-900/40 border border-red-500/60 rounded-xl backdrop-blur-sm">
                        <div className="flex items-center justify-center gap-2 text-red-300 mb-2">
                          <AlertTriangle className="w-5 h-5" />
                          <span className="font-bold">Account Disabled</span>
                        </div>
                        {(() => {
                          const banDetails = playerBanService.getBanDetails(player.id);
                          return banDetails && (
                            <div className="text-xs text-red-400 text-center space-y-1">
                              <p className="font-medium">Reason: {banDetails.reason}</p>
                              <p>Date: {new Date(banDetails.bannedAt).toLocaleDateString()}</p>
                            </div>
                          );
                        })()}
                      </div>
                    )}
                  </div>

                  {/* Enhanced Badges */}
                  <div className="flex flex-wrap gap-2 justify-center">
                    {player.hasWonCup && (
                      <div className="flex items-center gap-2 px-3 py-2 bg-gradient-to-r from-yellow-600/20 to-amber-600/20 border border-yellow-500/40 rounded-xl backdrop-blur-sm">
                        <Trophy className="w-4 h-4 text-yellow-400" />
                        <span className="text-sm text-yellow-300 font-semibold">Champion</span>
                      </div>
                    )}
                    {player.specialBadge && (
                      <div className="flex items-center gap-2 px-3 py-2 bg-gradient-to-r from-purple-600/20 to-pink-600/20 border border-purple-500/40 rounded-xl backdrop-blur-sm">
                        <Star className="w-4 h-4 text-purple-400" />
                        <span className="text-sm text-purple-300 font-semibold capitalize">{player.specialBadge}</span>
                      </div>
                    )}
                    <div className="flex items-center gap-2 px-3 py-2 bg-gradient-to-r from-blue-600/20 to-cyan-600/20 border border-blue-500/40 rounded-xl backdrop-blur-sm">
                      <Shield className="w-4 h-4 text-blue-400" />
                      <span className="text-sm text-blue-300 font-semibold">Season {player.seasonBadges.length}</span>
                    </div>
                  </div>

                  {/* Quick Stats */}
                  <div className="grid grid-cols-2 gap-3 mt-6">
                    <div className="text-center p-3 bg-gray-700/30 rounded-xl border border-gray-600/30">
                      <p className="text-2xl font-bold text-green-400">{player.currentMMR || '?'}</p>
                      <p className="text-xs text-gray-400">Current MMR</p>
                    </div>
                    <div className="text-center p-3 bg-gray-700/30 rounded-xl border border-gray-600/30">
                      <p className="text-2xl font-bold text-yellow-400">{player.peakMMR || '?'}</p>
                      <p className="text-xs text-gray-400">Peak MMR</p>
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>

            {/* Profile Information */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              className="lg:col-span-2"
            >
              <div className="bg-gray-800/40 backdrop-blur-xl border border-gray-600/30 rounded-2xl p-6">
                <div className="flex items-center justify-between mb-6">
                  <h2 className="text-xl font-semibold flex items-center text-white">
                    <User className="w-5 h-5 mr-2" />
                    Profile Information
                  </h2>
                  {!isEditing ? (
                    <button
                      onClick={() => setIsEditing(true)}
                      className="flex items-center space-x-2 px-4 py-2 bg-blue-600/80 hover:bg-blue-600 text-white rounded-lg transition-colors backdrop-blur-sm"
                    >
                      <Edit3 className="w-4 h-4" />
                      <span>Edit Profile</span>
                    </button>
                  ) : (
                    <div className="flex space-x-2">
                      <button
                        onClick={handleSave}
                        className="flex items-center space-x-2 px-4 py-2 bg-green-600/80 hover:bg-green-600 text-white rounded-lg transition-colors backdrop-blur-sm"
                      >
                        <Save className="w-4 h-4" />
                        <span>Save</span>
                      </button>
                      <button
                        onClick={() => {
                          setIsEditing(false);
                          setEditedData({
                            bio: player.bio || '',
                            currentMedalLabel: player.currentMedalLabel || '',
                            currentMMR: player.currentMMR?.toString() || '',
                            peakMedalLabel: player.peakMedalLabel || '',
                            peakMMR: player.peakMMR?.toString() || '',
                            realName: player.realName || '',
                            roles: player.roles?.map(role => role.label) || []
                          });
                        }}
                        className="flex items-center space-x-2 px-4 py-2 bg-gray-600/80 hover:bg-gray-600 text-white rounded-lg transition-colors backdrop-blur-sm"
                      >
                        <X className="w-4 h-4" />
                        <span>Cancel</span>
                      </button>
                    </div>
                  )}
                </div>

                <div className="space-y-6">
                  {/* Basic Info */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-300 mb-2">
                        Nickname
                      </label>
                      <div className="text-lg font-semibold text-white bg-gray-700/50 p-3 rounded-lg">
                        {player.nickname}
                      </div>
                      <p className="text-xs text-gray-500 mt-1">Cannot be changed</p>
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium text-gray-300 mb-2">
                        Real Name
                      </label>
                      {isEditing ? (
                        <input
                          type="text"
                          value={editedData.realName}
                          onChange={(e) => setEditedData(prev => ({ ...prev, realName: e.target.value }))}
                          className="w-full p-3 bg-gray-700/50 border border-gray-600/40 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                          placeholder="Enter your real name"
                        />
                      ) : (
                        <div className="text-lg text-white bg-gray-700/50 p-3 rounded-lg">
                          {player.realName || 'Not provided'}
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Bio Section */}
                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-2">
                      Bio
                    </label>
                    {isEditing ? (
                      <textarea
                        value={editedData.bio}
                        onChange={(e) => setEditedData(prev => ({ ...prev, bio: e.target.value }))}
                        className="w-full p-3 bg-gray-700/50 border border-gray-600/40 rounded-lg text-white resize-none focus:outline-none focus:ring-2 focus:ring-blue-500"
                        rows={4}
                        placeholder="Tell us about yourself..."
                      />
                    ) : (
                      <div className="text-gray-300 bg-gray-700/50 p-3 rounded-lg min-h-[100px]">
                        {player.bio || 'No bio provided yet.'}
                      </div>
                    )}
                  </div>

                  {/* Game Stats */}
                  <div>
                    <h3 className="text-lg font-semibold text-white mb-6 flex items-center gap-2">
                      <Trophy className="w-5 h-5 text-yellow-400" />
                      Game Statistics
                    </h3>
                    
                    {/* Medal Displays */}
                    <div className="space-y-4 mb-6">
                      <MedalDisplay 
                        mmr={player.currentMMR} 
                        label={player.currentMedalLabel} 
                        type="current" 
                      />
                      <MedalDisplay 
                        mmr={player.peakMMR} 
                        label={player.peakMedalLabel} 
                        type="peak" 
                      />
                    </div>

                    {/* Editable MMR Fields */}
                    {isEditing && (
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 p-4 bg-blue-900/10 border border-blue-500/20 rounded-xl">
                        <div>
                          <label className="block text-sm font-medium text-blue-300 mb-2">
                            Update Current MMR
                          </label>
                          <input
                            type="number"
                            value={editedData.currentMMR}
                            onChange={(e) => setEditedData(prev => ({ ...prev, currentMMR: e.target.value }))}
                            className="w-full p-3 bg-gray-700/50 border border-gray-600/40 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                            placeholder="e.g., 4500"
                          />
                          <p className="text-xs text-blue-400 mt-1">Medal will be calculated automatically</p>
                        </div>
                        
                        <div>
                          <label className="block text-sm font-medium text-blue-300 mb-2">
                            Update Peak MMR
                          </label>
                          <input
                            type="number"
                            value={editedData.peakMMR}
                            onChange={(e) => setEditedData(prev => ({ ...prev, peakMMR: e.target.value }))}
                            className="w-full p-3 bg-gray-700/50 border border-gray-600/40 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                            placeholder="e.g., 5200"
                          />
                          <p className="text-xs text-blue-400 mt-1">Medal will be calculated automatically</p>
                        </div>
                      </div>
                    )}
                  </div>

                  {/* Roles Section */}
                  <div>
                    <div className="flex items-center justify-between mb-6">
                      <h3 className="text-lg font-semibold text-white flex items-center gap-2">
                        <User className="w-5 h-5 text-blue-400" />
                        Preferred Roles
                      </h3>
                      <button
                        onClick={() => setShowRoleChangeModal(true)}
                        className="px-4 py-2 bg-gradient-to-r from-orange-600/80 to-red-600/80 hover:from-orange-600 hover:to-red-600 text-white text-sm rounded-xl transition-all duration-300 backdrop-blur-sm shadow-lg hover:shadow-orange-500/20 transform hover:scale-105"
                      >
                        Request Role Change
                      </button>
                    </div>
                    
                    <div className="bg-gradient-to-br from-gray-700/30 to-gray-800/30 p-6 rounded-xl border border-gray-600/30 backdrop-blur-sm">
                      {player.roles && player.roles.length > 0 ? (
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          {player.roles.map((role, index) => (
                            <div key={index} className="flex items-center gap-4 p-4 bg-gradient-to-r from-blue-600/10 to-purple-600/10 border border-blue-500/20 rounded-xl hover:from-blue-600/20 hover:to-purple-600/20 transition-all duration-300">
                              <div className="relative">
                                <div className="w-12 h-12 bg-gradient-to-br from-blue-500/20 to-purple-500/20 rounded-xl flex items-center justify-center border border-blue-500/30">
                                  <img 
                                    src={role.iconSrc} 
                                    alt={role.label}
                                    className="w-8 h-8"
                                  />
                                </div>
                                <div className="absolute -top-1 -right-1 w-6 h-6 bg-blue-500 rounded-full flex items-center justify-center text-white text-xs font-bold">
                                  {index + 1}
                                </div>
                              </div>
                              <div className="flex-1">
                                <p className="text-white font-semibold">{role.label}</p>
                                <p className="text-gray-400 text-sm">
                                  {index === 0 ? 'Primary Role' : index === 1 ? 'Secondary Role' : 'Alternative Role'}
                                </p>
                              </div>
                            </div>
                          ))}
                        </div>
                      ) : (
                        <div className="text-center py-8">
                          <div className="w-16 h-16 bg-gray-600/30 rounded-full flex items-center justify-center mx-auto mb-4">
                            <User className="w-8 h-8 text-gray-400" />
                          </div>
                          <p className="text-gray-400 font-medium">No roles assigned yet</p>
                          <p className="text-gray-500 text-sm mt-2">Request role assignment from admins</p>
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Favorite Heroes */}
                  {player.favoriteHeroes && player.favoriteHeroes.length > 0 && (
                    <div>
                      <h3 className="text-lg font-semibold text-white mb-4">Favorite Heroes</h3>
                      <div className="grid grid-cols-3 gap-4">
                        {player.favoriteHeroes.slice(0, 3).map((hero, index) => (
                          <div key={index} className="text-center">
                            <div className="bg-gray-700/50 p-3 rounded-lg">
                              <p className="text-sm text-white font-medium">{hero.name}</p>
                            </div>
                          </div>
                        ))}
                      </div>
                      <p className="text-xs text-gray-500 mt-2">Contact an admin to update your favorite heroes</p>
                    </div>
                  )}
                </div>
              </div>
            </motion.div>
          </div>

          {/* Note about match history */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="mt-8 bg-blue-900/20 border border-blue-500/30 rounded-2xl p-6 backdrop-blur-xl"
          >
            <h3 className="text-lg font-semibold text-blue-300 mb-2">
              Match History
            </h3>
            <p className="text-blue-200 text-sm">
              Your match history and tournament participation records are managed by tournament admins and cannot be edited. 
              This ensures the integrity of competitive data.
            </p>
          </motion.div>
        </div>
      </main>

      {/* Role Change Modal */}
      {showRoleChangeModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" onClick={() => setShowRoleChangeModal(false)} />
          
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="relative bg-gray-800/90 backdrop-blur-xl border border-gray-600/30 rounded-2xl p-6 w-full max-w-md"
          >
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-xl font-semibold text-white">Request Role Change</h3>
              <button
                onClick={() => setShowRoleChangeModal(false)}
                className="text-gray-400 hover:text-white transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="mb-6">
              <p className="text-gray-300 text-sm mb-4">
                Select up to 3 roles in order of preference. Your request will be sent to admins for approval.
              </p>
              
              <div className="space-y-3">
                {availableRoles.map((role) => (
                  <button
                    key={role.id}
                    onClick={() => toggleRoleSelection(role.label)}
                    className={`w-full flex items-center gap-3 p-3 rounded-lg border transition-all ${
                      roleChangeRequest.includes(role.label)
                        ? 'bg-blue-600/20 border-blue-500/50 text-blue-300'
                        : 'bg-gray-700/50 border-gray-600/30 text-gray-300 hover:bg-gray-600/50'
                    }`}
                  >
                    <img src={role.iconSrc} alt={role.label} className="w-6 h-6" />
                    <span className="flex-1 text-left">{role.label}</span>
                    {roleChangeRequest.includes(role.label) && (
                      <span className="text-xs bg-blue-500 text-white px-2 py-1 rounded-full">
                        #{roleChangeRequest.indexOf(role.label) + 1}
                      </span>
                    )}
                  </button>
                ))}
              </div>
            </div>

            <div className="mb-4">
              <p className="text-xs text-gray-400">
                Current roles: {player.roles?.map(r => r.label).join(', ') || 'None assigned'}
              </p>
              <p className="text-xs text-gray-400 mt-1">
                Selected: {roleChangeRequest.length}/3 roles
              </p>
            </div>

            <div className="flex gap-3">
              <button
                onClick={() => setShowRoleChangeModal(false)}
                className="flex-1 px-4 py-2 bg-gray-600/80 hover:bg-gray-600 text-white rounded-lg transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={handleRoleChangeRequest}
                disabled={roleChangeRequest.length === 0}
                className="flex-1 px-4 py-2 bg-blue-600/80 hover:bg-blue-600 disabled:bg-gray-600/50 disabled:cursor-not-allowed text-white rounded-lg transition-colors"
              >
                Submit Request
              </button>
            </div>
          </motion.div>
        </div>
      )}
    </>
  );
};

export default PlayerProfile;
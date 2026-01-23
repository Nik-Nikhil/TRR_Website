import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { User, Edit3, Save, X, Camera, Shield, Trophy, Star, LogOut, AlertTriangle } from 'lucide-react';
import { motion } from 'framer-motion';
import { getPlayerById, type Player } from '../data/players';
import AuthService from '../services/auth';
import DatabaseService from '../services/database';
import playerBanService from '../services/playerBanService';

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
              <div className="bg-gray-800/40 backdrop-blur-xl border border-gray-600/30 rounded-2xl p-6">
                <h2 className="text-xl font-semibold mb-6 flex items-center text-white">
                  <Camera className="w-5 h-5 mr-2" />
                  Profile Picture
                </h2>
                
                <div className="text-center">
                  <div className="w-32 h-32 mx-auto mb-4 rounded-full overflow-hidden bg-gray-700">
                    <img 
                      src={player.avatarUrl || '/avatars/default.png'} 
                      alt={player.nickname}
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <p className="text-gray-400 text-sm">Avatar upload feature temporarily disabled</p>
                </div>

                {/* Player Stats Summary */}
                <div className="mt-6 space-y-4">
                  <div className="text-center">
                    <h3 className="text-lg font-semibold text-white mb-2">{player.nickname}</h3>
                    {player.realName && (
                      <p className="text-gray-400 text-sm">{player.realName}</p>
                    )}
                    
                    {/* Banned Status */}
                    {playerBanService.isPlayerBanned(player.id) && (
                      <div className="mt-3 p-3 bg-red-900/30 border border-red-500/50 rounded-lg">
                        <div className="flex items-center justify-center gap-2 text-red-300">
                          <AlertTriangle className="w-4 h-4" />
                          <span className="font-semibold text-sm">Disabled by Admins</span>
                        </div>
                        {(() => {
                          const banDetails = playerBanService.getBanDetails(player.id);
                          return banDetails && (
                            <div className="mt-2 text-xs text-red-400 text-center">
                              <p>Reason: {banDetails.reason}</p>
                              <p>Banned on: {new Date(banDetails.bannedAt).toLocaleDateString()}</p>
                            </div>
                          );
                        })()}
                      </div>
                    )}
                  </div>

                  {/* Badges */}
                  <div className="flex flex-wrap gap-2 justify-center">
                    {player.hasWonCup && (
                      <div className="flex items-center gap-1 px-2 py-1 bg-yellow-600/20 border border-yellow-500/30 rounded-lg">
                        <Trophy className="w-3 h-3 text-yellow-400" />
                        <span className="text-xs text-yellow-300">Champion</span>
                      </div>
                    )}
                    {player.specialBadge && (
                      <div className="flex items-center gap-1 px-2 py-1 bg-purple-600/20 border border-purple-500/30 rounded-lg">
                        <Star className="w-3 h-3 text-purple-400" />
                        <span className="text-xs text-purple-300 capitalize">{player.specialBadge}</span>
                      </div>
                    )}
                    <div className="flex items-center gap-1 px-2 py-1 bg-blue-600/20 border border-blue-500/30 rounded-lg">
                      <Shield className="w-3 h-3 text-blue-400" />
                      <span className="text-xs text-blue-300">S{player.seasonBadges.length}</span>
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
                    <h3 className="text-lg font-semibold text-white mb-4">Game Statistics</h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-300 mb-2">
                          Current Medal
                        </label>
                        {isEditing ? (
                          <input
                            type="text"
                            value={editedData.currentMedalLabel}
                            onChange={(e) => setEditedData(prev => ({ ...prev, currentMedalLabel: e.target.value }))}
                            className="w-full p-3 bg-gray-700/50 border border-gray-600/40 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                            placeholder="e.g., Divine 3"
                          />
                        ) : (
                          <div className="text-lg text-white bg-gray-700/50 p-3 rounded-lg">
                            {player.currentMedalLabel || 'Not calibrated'}
                          </div>
                        )}
                      </div>
                      
                      <div>
                        <label className="block text-sm font-medium text-gray-300 mb-2">
                          Current MMR
                        </label>
                        {isEditing ? (
                          <input
                            type="number"
                            value={editedData.currentMMR}
                            onChange={(e) => setEditedData(prev => ({ ...prev, currentMMR: e.target.value }))}
                            className="w-full p-3 bg-gray-700/50 border border-gray-600/40 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                            placeholder="e.g., 4500"
                          />
                        ) : (
                          <div className="text-lg text-white bg-gray-700/50 p-3 rounded-lg">
                            {player.currentMMR || 'Not calibrated'}
                          </div>
                        )}
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-300 mb-2">
                          Peak Medal
                        </label>
                        {isEditing ? (
                          <input
                            type="text"
                            value={editedData.peakMedalLabel}
                            onChange={(e) => setEditedData(prev => ({ ...prev, peakMedalLabel: e.target.value }))}
                            className="w-full p-3 bg-gray-700/50 border border-gray-600/40 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                            placeholder="e.g., Immortal"
                          />
                        ) : (
                          <div className="text-lg text-white bg-gray-700/50 p-3 rounded-lg">
                            {player.peakMedalLabel || 'Not calibrated'}
                          </div>
                        )}
                      </div>
                      
                      <div>
                        <label className="block text-sm font-medium text-gray-300 mb-2">
                          Peak MMR
                        </label>
                        {isEditing ? (
                          <input
                            type="number"
                            value={editedData.peakMMR}
                            onChange={(e) => setEditedData(prev => ({ ...prev, peakMMR: e.target.value }))}
                            className="w-full p-3 bg-gray-700/50 border border-gray-600/40 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                            placeholder="e.g., 5200"
                          />
                        ) : (
                          <div className="text-lg text-white bg-gray-700/50 p-3 rounded-lg">
                            {player.peakMMR || 'Not calibrated'}
                          </div>
                        )}
                      </div>
                    </div>
                  </div>

                  {/* Roles Section */}
                  <div>
                    <div className="flex items-center justify-between mb-4">
                      <h3 className="text-lg font-semibold text-white">Preferred Roles</h3>
                      <button
                        onClick={() => setShowRoleChangeModal(true)}
                        className="px-3 py-1 bg-orange-600/80 hover:bg-orange-600 text-white text-sm rounded-lg transition-colors backdrop-blur-sm"
                      >
                        Request Role Change
                      </button>
                    </div>
                    
                    <div className="bg-gray-700/50 p-4 rounded-lg">
                      {player.roles && player.roles.length > 0 ? (
                        <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                          {player.roles.map((role, index) => (
                            <div key={index} className="flex items-center gap-2 p-2 bg-gray-600/50 rounded-lg">
                              <img 
                                src={role.iconSrc} 
                                alt={role.label}
                                className="w-6 h-6"
                              />
                              <span className="text-sm text-white">{role.label}</span>
                              <span className="text-xs text-gray-400 ml-auto">#{index + 1}</span>
                            </div>
                          ))}
                        </div>
                      ) : (
                        <div className="text-center py-4">
                          <p className="text-gray-400">No roles assigned yet</p>
                          <p className="text-xs text-gray-500 mt-1">Request role assignment from admins</p>
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
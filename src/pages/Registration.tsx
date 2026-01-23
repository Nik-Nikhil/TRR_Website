import { useState } from "react";
import { Search, User, UserPlus, CheckCircle, Star, ArrowLeft, Upload } from "lucide-react";
import { players } from "../data/players";

// Define the Player type locally based on the structure we saw
type Player = {
  id: string;
  nickname: string;
  realName?: string;
  avatarUrl: string;
  seasonBadges: string[];
  hasWonCup: boolean;
  cupRank?: "gold" | "silver" | "bronze";
  cupTooltip?: string;
  cupSeason?: number;
  currentMedalLabel: string;
  currentMedalId: string;
  currentMMR?: number;
  peakMedalLabel: string;
  peakMedalId: string;
  peakMMR?: number;
  bio: string;
  roles: Array<{ iconSrc: string; label: string }>;
  steamUrl: string;
  dotabuffUrl: string;
  favoriteHeroes: Array<{ videoSrc: string; name: string }>;
  behaviorScore?: {
    mechanicalSkill?: number;
    teamwork?: number;
    communication?: number;
    consistency?: number;
  };
  specialBadge?: "contributor" | "founder" | "mvp";
};

export default function Registration() {
  const [searchTerm, setSearchTerm] = useState('');
  const [showNewPlayerForm, setShowNewPlayerForm] = useState(false);
  const [selectedPlayer, setSelectedPlayer] = useState<Player | null>(null);
  const [currentMMR, setCurrentMMR] = useState('');
  const [inGameName, setInGameName] = useState('');
  const [showMMRUpload, setShowMMRUpload] = useState(false);
  const [selectedRoles, setSelectedRoles] = useState<string[]>([]);
  const [currentStep, setCurrentStep] = useState(1);
  const totalSteps = 8;

  const handlePlayerSelect = (player: Player) => {
    setSelectedPlayer(player);
    setCurrentMMR(player.currentMMR?.toString() || '');
    setInGameName(player.nickname);
    // Initialize selected roles as empty (don't pre-fill from player data)
    setSelectedRoles([]);
  };

  const handleBackToSelection = () => {
    setSelectedPlayer(null);
    setSearchTerm('');
    setCurrentMMR('');
    setInGameName('');
    setShowMMRUpload(false);
    setSelectedRoles([]);
    setCurrentStep(1);
  };

  const handleNextStep = () => {
    if (currentStep < totalSteps) {
      setCurrentStep(prev => prev + 1);
    }
  };

  const handlePrevStep = () => {
    if (currentStep > 1) {
      setCurrentStep(prev => prev - 1);
    }
  };

  const canProceedToNext = () => {
    switch (currentStep) {
      case 3: // Roles step
        return selectedRoles.length === 3;
      default:
        return true;
    }
  };

  const handleMMRChange = (value: string) => {
    // If empty, revert to original value
    if (value === '') {
      setCurrentMMR(selectedPlayer?.currentMMR?.toString() || '');
      setShowMMRUpload(false);
    } else {
      setCurrentMMR(value);
      const originalMMR = selectedPlayer?.currentMMR?.toString() || '';
      setShowMMRUpload(value !== originalMMR);
    }
  };

  const handleInGameNameChange = (value: string) => {
    // If empty, revert to original value
    if (value === '') {
      setInGameName(selectedPlayer?.nickname || '');
    } else {
      setInGameName(value);
    }
  };

  const handleRoleToggle = (roleId: string) => {
    setSelectedRoles(prev => {
      if (prev.includes(roleId)) {
        // Remove role if already selected
        return prev.filter(id => id !== roleId);
      } else {
        // Add role if less than 3 are selected
        if (prev.length < 3) {
          return [...prev, roleId];
        }
        return prev;
      }
    });
  };

  const getRolePriority = (roleId: string) => {
    const index = selectedRoles.indexOf(roleId);
    return index !== -1 ? index + 1 : null;
  };

  const getPriorityText = (priority: number) => {
    switch (priority) {
      case 1: return "Highest Priority";
      case 2: return "Second Priority"; 
      case 3: return "Last Priority";
      default: return "";
    }
  };

  return (
    <>
      {/* Fixed Background */}
      <div className="absolute inset-0 z-0" style={{ top: '64px', bottom: '60px' }}>
        <div 
          className="absolute inset-0 bg-cover bg-center bg-no-repeat"
          style={{
            backgroundImage: `url('/bg6.webp')`,
          }}
        />
        {/* Dark overlay for better text readability */}
        <div className="absolute inset-0 bg-black/50"></div>
      </div>

      {/* Animated Background Elements */}
      <div className="absolute inset-0 z-0" style={{ top: '64px', bottom: '60px' }}>
        <div className="absolute top-20 left-20 w-32 h-32 bg-blue-500/10 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute bottom-20 right-20 w-40 h-40 bg-purple-500/10 rounded-full blur-3xl animate-pulse delay-1000"></div>
      </div>

      <main className="registration-page relative flex items-center justify-center" style={{ minHeight: 'calc(100vh - 140px)' }}>
        <div className="relative z-10 w-full py-4">
          <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
            
            {/* Header - Only show when not in form mode */}
            {!selectedPlayer && !showNewPlayerForm && (
              <>
                <div className="text-center mb-3 relative pt-1">
                    Join The Roshan Rumble
                  <h1 className="text-3xl font-black bg-gradient-to-r from-blue-400 via-purple-400 to-cyan-400 bg-clip-text text-transparent mb-2">
                  </h1>
                  <p className="text-sm text-slate-300 max-w-2xl mx-auto">
                    Register now to compete in the ultimate Dota 2 tournament experience
                  </p>
                </div>

                {/* Registration Status */}
                <div className="text-center mb-4">
                  <div className="inline-flex items-center gap-2 bg-slate-900/85 backdrop-blur-xl border border-slate-700/50 rounded-full px-3 py-1 mb-1">
                    <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                    <span className="text-green-400 font-semibold text-sm">Registration is currently OPEN</span>
                  </div>
                  <p className="text-slate-300 text-sm">
                    Don't miss your chance to compete in India's premier amateur Dota 2 league!
                  </p>
                </div>
              </>
            )}

            {/* Main Content */}
            <div className="w-full flex justify-center">
              <div className="w-full max-w-8xl px-2 sm:px-4 lg:px-6">
                
                {selectedPlayer ? (
                  /* Player Registration Form */
                  <div className="w-full flex justify-center">
                    <div className="w-full max-w-5xl px-2 sm:px-3 md:px-4 relative">
                      <div className="bg-slate-900/30 backdrop-blur-xl border border-slate-600/30 rounded-2xl p-3 shadow-2xl shadow-slate-900/20">
                      
                      {/* Player Avatar - Moved above header */}
                      <div className="text-center mb-4">
                        <div className="relative w-16 h-16 mx-auto mb-2">
                          <div className="absolute inset-0 bg-gradient-to-br from-blue-400/30 to-cyan-400/30 rounded-full opacity-40 animate-pulse" />
                          <img 
                            src={selectedPlayer.avatarUrl} 
                            alt={selectedPlayer.nickname}
                            className="w-full h-full rounded-full object-cover border-2 border-blue-400/50 relative z-10 shadow-lg"
                            onError={(e) => {
                              e.currentTarget.src = "/avatars/default.jpg";
                            }}
                          />
                        </div>
                        <h2 className="text-sm font-bold bg-gradient-to-r from-blue-200 to-cyan-200 bg-clip-text text-transparent mb-1">{selectedPlayer.nickname}</h2>
                        {selectedPlayer.realName && (
                          <p className="text-sm text-slate-300 mb-1">{selectedPlayer.realName}</p>
                        )}
                        <p className="text-blue-400 font-semibold text-sm mb-1">{selectedPlayer.currentMedalLabel}</p>
                      </div>

                      {/* Form Title and Progress */}
                      <div className="text-center mb-2">
                        <h3 className="text-sm font-bold text-white mb-1">Registration Form</h3>
                        <div className="flex items-center justify-center gap-2 mb-1">
                          <span className="text-slate-400 text-sm">Step {currentStep} of {totalSteps}</span>
                          <div className="flex gap-1 ml-2">
                            {Array.from({ length: totalSteps }, (_, i) => (
                              <div
                                key={i}
                                className={`w-1.5 h-1.5 rounded-full ${
                                  i + 1 <= currentStep ? 'bg-blue-500' : 'bg-slate-600'
                                }`}
                              />
                            ))}
                          </div>
                        </div>
                      </div>

                      {/* Registration Form */}
                      <form className="space-y-2">
                        {/* Step 1: Player Information */}
                        {currentStep === 1 && (
                          <div className="bg-slate-800/50 border border-slate-600/50 rounded-lg p-2">
                            <div className="text-center mb-2">
                              <div className="inline-flex items-center gap-2 px-3 py-1 bg-gradient-to-r from-blue-600/20 to-cyan-600/20 border border-blue-500/30 rounded-full">
                                <div className="w-1.5 h-1.5 bg-blue-400 rounded-full"></div>
                                <h3 className="text-sm font-bold bg-gradient-to-r from-blue-400 to-cyan-400 bg-clip-text text-transparent">
                                  Player Information
                                </h3>
                                <div className="w-1.5 h-1.5 bg-cyan-400 rounded-full"></div>
                              </div>
                            </div>
                            <div className="grid md:grid-cols-2 gap-2">
                              <div>
                                <label className="block text-sm font-medium text-slate-300 mb-1">
                                  In-Game Name <span className="text-red-400">*</span>
                                </label>
                                <input
                                  type="text"
                                  value={inGameName}
                                  onChange={(e) => handleInGameNameChange(e.target.value)}
                                  className="w-full px-3 py-1.5 bg-slate-800/70 border border-slate-600/50 rounded-lg text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500/50 transition-all text-sm"
                                  placeholder="Enter your in-game name"
                                  required
                                />
                              </div>
                              <div>
                                <label className="block text-sm font-medium text-slate-300 mb-1">
                                  Name <span className="text-slate-500">(optional)</span>
                                </label>
                                <input
                                  type="text"
                                  defaultValue={selectedPlayer.realName || ''}
                                  className="w-full px-3 py-1.5 bg-slate-800/70 border border-slate-600/50 rounded-lg text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500/50 transition-all text-sm"
                                  placeholder="Enter your real name"
                                />
                              </div>
                              <div>
                                <label className="block text-sm font-medium text-slate-300 mb-1">
                                  Discord Username <span className="text-red-400">*</span>
                                </label>
                                <input
                                  type="text"
                                  className="w-full px-3 py-1.5 bg-slate-800/70 border border-slate-600/50 rounded-lg text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500/50 transition-all text-sm"
                                  placeholder="Enter your Discord username"
                                  required
                                />
                              </div>
                              <div>
                                <label className="block text-sm font-medium text-slate-300 mb-1">
                                  WhatsApp Number <span className="text-slate-500">(optional)</span>
                                </label>
                                <input
                                  type="tel"
                                  className="w-full px-3 py-1.5 bg-slate-800/70 border border-slate-600/50 rounded-lg text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500/50 transition-all text-sm"
                                  placeholder="Enter your WhatsApp number"
                                />
                              </div>
                              <div>
                                <label className="block text-sm font-medium text-slate-300 mb-1">
                                  Steam Profile URL <span className="text-red-400">*</span>
                                </label>
                                <input
                                  type="url"
                                  defaultValue={selectedPlayer.steamUrl || ''}
                                  className="w-full px-3 py-1.5 bg-slate-800/70 border border-slate-600/50 rounded-lg text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500/50 transition-all text-sm"
                                  placeholder="Enter your Steam profile URL"
                                  required
                                />
                              </div>
                              <div>
                                <label className="block text-sm font-medium text-slate-300 mb-1">
                                  Dotabuff Profile URL <span className="text-red-400">*</span>
                                </label>
                                <input
                                  type="url"
                                  defaultValue={selectedPlayer.dotabuffUrl || ''}
                                  className="w-full px-3 py-1.5 bg-slate-800/70 border border-slate-600/50 rounded-lg text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500/50 transition-all text-sm"
                                  placeholder="Enter your Dotabuff profile URL"
                                  required
                                />
                              </div>
                            </div>
                          </div>
                        )}

                        {/* Step 2: MMR Information */}
                        {currentStep === 2 && (
                          <div className="bg-slate-800/50 border border-slate-600/50 rounded-lg p-6">
                            <div className="text-center mb-6">
                              <div className="inline-flex items-center gap-3 px-4 py-2 bg-gradient-to-r from-purple-600/20 to-pink-600/20 border border-purple-500/30 rounded-full">
                                <div className="w-2 h-2 bg-purple-400 rounded-full"></div>
                                <h3 className="text-lg font-bold bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent">
                                  MMR Information
                                </h3>
                                <div className="w-2 h-2 bg-pink-400 rounded-full"></div>
                              </div>
                            </div>
                            <div className="grid md:grid-cols-2 gap-4">
                              <div>
                                <label className="block text-sm font-medium text-slate-300 mb-2">
                                  Current MMR
                                </label>
                                <input
                                  type="number"
                                  value={currentMMR}
                                  onChange={(e) => handleMMRChange(e.target.value)}
                                  className="w-full px-4 py-2 bg-slate-800/70 border border-slate-600/50 rounded-lg text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500/50 transition-all text-sm"
                                  placeholder="Enter your current MMR"
                                />
                                {showMMRUpload && (
                                  <div className="mt-2 p-3 bg-orange-900/30 border border-orange-500/50 rounded-lg">
                                    <p className="text-orange-300 text-xs mb-2">Upload a screenshot of your MMR</p>
                                    <p className="text-red-300 text-xs mb-2">* Without image the value will be denied to the user</p>
                                    <div className="flex items-center gap-2">
                                      <input
                                        type="file"
                                        accept="image/*"
                                        className="hidden"
                                        id="mmr-proof"
                                      />
                                      <label
                                        htmlFor="mmr-proof"
                                        className="flex items-center justify-center w-8 h-8 bg-orange-600 hover:bg-orange-700 text-white rounded cursor-pointer transition-colors"
                                      >
                                        <Upload className="w-4 h-4" />
                                      </label>
                                    </div>
                                  </div>
                                )}
                              </div>
                              <div>
                                <label className="block text-sm font-medium text-slate-300 mb-2">
                                  Peak MMR
                                </label>
                                <input
                                  type="number"
                                  value={selectedPlayer.peakMMR || ''}
                                  readOnly
                                  className="w-full px-4 py-2 bg-slate-700/50 border border-slate-600/50 rounded-lg text-white text-sm"
                                />
                              </div>
                            </div>
                          </div>
                        )}

                        {/* Step 3: Preferred Roles */}
                        {currentStep === 3 && (
                          <div className="bg-slate-800/50 border border-slate-600/50 rounded-lg p-6">
                            <div className="text-center mb-6">
                              <div className="inline-flex items-center gap-3 px-4 py-2 bg-gradient-to-r from-orange-600/20 to-yellow-600/20 border border-orange-500/30 rounded-full">
                                <div className="w-2 h-2 bg-orange-400 rounded-full"></div>
                                <h3 className="text-lg font-bold bg-gradient-to-r from-orange-400 to-yellow-400 bg-clip-text text-transparent">
                                  Preferred Roles <span className="text-red-400">*</span>
                                  <span className="text-sm text-slate-400 ml-2">({selectedRoles.length}/3 required)</span>
                                </h3>
                                <div className="w-2 h-2 bg-yellow-400 rounded-full"></div>
                              </div>
                            </div>
                            
                            {selectedRoles.length < 3 && (
                              <div className="text-center mb-4 p-3 bg-blue-900/20 border border-blue-500/30 rounded-lg">
                                <p className="text-blue-300 text-sm font-medium">
                                  ℹ️ Please select exactly 3 roles in order of preference
                                </p>
                              </div>
                            )}
                            
                            <div className="flex flex-col items-center gap-2">
                              {/* Top row: Carry, Mid, Offlane */}
                              <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 w-full max-w-3xl">
                                {[
                                  { id: 'carry', label: 'Carry', icon: '/icons/pos_1.png' },
                                  { id: 'mid', label: 'Mid', icon: '/icons/pos_2.png' },
                                  { id: 'offlane', label: 'Offlane', icon: '/icons/pos_3.png' }
                                ].map((role) => (
                                  <div key={role.id} className="space-y-2">
                                    <label className="relative block">
                                      <input
                                        type="checkbox"
                                        checked={selectedRoles.includes(role.id)}
                                        onChange={() => handleRoleToggle(role.id)}
                                        className="sr-only peer"
                                      />
                                      <div className={`relative flex items-center justify-center gap-2 p-2 border rounded-lg cursor-pointer transition-all ${
                                        selectedRoles.includes(role.id)
                                          ? 'bg-blue-600/20 border-blue-500/50 text-blue-300 shadow-lg shadow-blue-500/20'
                                          : selectedRoles.length >= 3
                                          ? 'bg-slate-800/30 border-slate-600/30 text-slate-500 cursor-not-allowed'
                                          : 'bg-slate-800/50 border-slate-600/50 text-slate-300 hover:bg-slate-700/50 hover:border-slate-500/50 hover:shadow-lg'
                                      }`}>
                                        <img src={role.icon} alt={role.label} className="w-4 h-4" />
                                        <span className="text-sm font-bold">{role.label}</span>
                                        {selectedRoles.includes(role.id) && (
                                          <div className="absolute -top-1 -right-1 w-5 h-5 bg-blue-500 text-white text-xs font-bold rounded-full flex items-center justify-center">
                                            {getRolePriority(role.id)}
                                          </div>
                                        )}
                                      </div>
                                    </label>
                                    
                                    {/* Priority indicator for selected roles */}
                                    {selectedRoles.includes(role.id) && (
                                      <div className="text-center">
                                        <div className="inline-flex items-center gap-1 px-2 py-1 bg-blue-600/20 border border-blue-500/30 rounded-full">
                                          <span className="text-blue-300 text-xs font-medium">
                                            {getPriorityText(getRolePriority(role.id)!)}
                                          </span>
                                        </div>
                                      </div>
                                    )}
                                  </div>
                                ))}
                              </div>
                              
                              {/* Bottom row: Support roles centered */}
                              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 w-full max-w-xl">
                                {[
                                  { id: 'support', label: 'Soft Support', icon: '/icons/pos_4.png' },
                                  { id: 'hard-support', label: 'Hard Support', icon: '/icons/pos_5.png' }
                                ].map((role) => (
                                  <div key={role.id} className="space-y-2">
                                    <label className="relative block">
                                      <input
                                        type="checkbox"
                                        checked={selectedRoles.includes(role.id)}
                                        onChange={() => handleRoleToggle(role.id)}
                                        className="sr-only peer"
                                      />
                                      <div className={`relative flex items-center justify-center gap-2 p-2 border rounded-lg cursor-pointer transition-all ${
                                        selectedRoles.includes(role.id)
                                          ? 'bg-blue-600/20 border-blue-500/50 text-blue-300 shadow-lg shadow-blue-500/20'
                                          : selectedRoles.length >= 3
                                          ? 'bg-slate-800/30 border-slate-600/30 text-slate-500 cursor-not-allowed'
                                          : 'bg-slate-800/50 border-slate-600/50 text-slate-300 hover:bg-slate-700/50 hover:border-slate-500/50 hover:shadow-lg'
                                      }`}>
                                        <img src={role.icon} alt={role.label} className="w-4 h-4" />
                                        <span className="text-sm font-bold">{role.label}</span>
                                        {selectedRoles.includes(role.id) && (
                                          <div className="absolute -top-1 -right-1 w-5 h-5 bg-blue-500 text-white text-xs font-bold rounded-full flex items-center justify-center">
                                            {getRolePriority(role.id)}
                                          </div>
                                        )}
                                      </div>
                                    </label>
                                    
                                    {/* Priority indicator for selected roles */}
                                    {selectedRoles.includes(role.id) && (
                                      <div className="text-center">
                                        <div className="inline-flex items-center gap-1 px-2 py-1 bg-blue-600/20 border border-blue-500/30 rounded-full">
                                          <span className="text-blue-300 text-xs font-medium">
                                            {getPriorityText(getRolePriority(role.id)!)}
                                          </span>
                                        </div>
                                      </div>
                                    )}
                                  </div>
                                ))}
                              </div>
                              
                              {selectedRoles.length >= 3 && (
                                <div className="text-center p-2 bg-green-900/20 border border-green-500/30 rounded-lg">
                                  <p className="text-green-300 text-sm font-medium">
                                    ✅ All 3 roles selected
                                  </p>
                                </div>
                              )}
                            </div>
                          </div>
                        )}

                        {/* Step 4: Captain Availability */}
                        {currentStep === 4 && (
                          <div className="bg-slate-800/50 border border-slate-600/50 rounded-lg p-6">
                            <div className="text-center mb-6">
                              <div className="inline-flex items-center gap-3 px-4 py-2 bg-gradient-to-r from-green-600/20 to-emerald-600/20 border border-green-500/30 rounded-full">
                                <div className="w-2 h-2 bg-green-400 rounded-full"></div>
                                <h3 className="text-lg font-bold bg-gradient-to-r from-green-400 to-emerald-400 bg-clip-text text-transparent">
                                  Captain Availability
                                </h3>
                                <div className="w-2 h-2 bg-emerald-400 rounded-full"></div>
                              </div>
                            </div>
                            <p className="text-slate-400 text-sm mb-4">
                              Are you willing to be the captain? As a captain, you will be bidding in the player auction and serving as the primary contact point for your team.
                            </p>
                            <div className="space-y-3">
                              <label className="flex items-center p-3 bg-slate-700/30 rounded-lg hover:bg-slate-700/50 transition-colors cursor-pointer">
                                <input
                                  type="radio"
                                  name="captain"
                                  value="yes"
                                  className="mr-3 text-green-500"
                                />
                                <div>
                                  <span className="text-slate-300 font-medium">Yes, I'm willing to be a captain</span>
                                  <p className="text-slate-500 text-xs mt-1">I want to lead a team and participate in the auction</p>
                                </div>
                              </label>
                              <label className="flex items-center p-3 bg-slate-700/30 rounded-lg hover:bg-slate-700/50 transition-colors cursor-pointer">
                                <input
                                  type="radio"
                                  name="captain"
                                  value="no"
                                  defaultChecked
                                  className="mr-3 text-red-500"
                                />
                                <div>
                                  <span className="text-slate-300 font-medium">No, I prefer to be a regular player</span>
                                  <p className="text-slate-500 text-xs mt-1">I want to focus on playing and let others handle team management</p>
                                </div>
                              </label>
                              <label className="flex items-center p-3 bg-slate-700/30 rounded-lg hover:bg-slate-700/50 transition-colors cursor-pointer">
                                <input
                                  type="radio"
                                  name="captain"
                                  value="if-necessary"
                                  className="mr-3 text-yellow-500"
                                />
                                <div>
                                  <span className="text-slate-300 font-medium">Only if necessary</span>
                                  <p className="text-slate-500 text-xs mt-1">I can captain if needed, but prefer to be a regular player</p>
                                </div>
                              </label>
                            </div>
                            <div className="mt-4 p-3 bg-amber-900/20 border border-amber-500/30 rounded-lg">
                              <p className="text-amber-300 text-xs">
                                ⚠️ <strong>Note:</strong> We may assign captaincy based on tournament needs and volunteer availability.
                              </p>
                            </div>
                          </div>
                        )}

                        {/* Step 5: Notes for Captain */}
                        {currentStep === 5 && (
                          <div className="bg-slate-800/50 border border-slate-600/50 rounded-lg p-6">
                            <div className="text-center mb-6">
                              <div className="inline-flex items-center gap-3 px-4 py-2 bg-gradient-to-r from-indigo-600/20 to-purple-600/20 border border-indigo-500/30 rounded-full">
                                <div className="w-2 h-2 bg-indigo-400 rounded-full"></div>
                                <h3 className="text-lg font-bold bg-gradient-to-r from-indigo-400 to-purple-400 bg-clip-text text-transparent">
                                  Notes for Captain
                                </h3>
                                <div className="w-2 h-2 bg-purple-400 rounded-full"></div>
                              </div>
                            </div>
                            <p className="text-slate-400 text-sm mb-4">
                              Please do not write something like "I only want to be under his/her team" as it may affect the auction.
                            </p>
                            <textarea
                              rows={4}
                              className="w-full px-4 py-3 bg-slate-800/70 border border-slate-600/50 rounded-lg text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500/50 transition-all text-sm resize-none"
                              placeholder="Share any relevant information for your future captain (playstyle, availability, preferences, etc.)"
                            />
                          </div>
                        )}

                        {/* Step 6: Connection Info */}
                        {currentStep === 6 && (
                          <div className="bg-slate-800/50 border border-slate-600/50 rounded-lg p-6">
                            <div className="text-center mb-6">
                              <div className="inline-flex items-center gap-3 px-4 py-2 bg-gradient-to-r from-red-600/20 to-orange-600/20 border border-red-500/30 rounded-full">
                                <div className="w-2 h-2 bg-red-400 rounded-full"></div>
                                <h3 className="text-lg font-bold bg-gradient-to-r from-red-400 to-orange-400 bg-clip-text text-transparent">
                                  Connection Information
                                </h3>
                                <div className="w-2 h-2 bg-orange-400 rounded-full"></div>
                              </div>
                            </div>
                            <div>
                              <label className="block text-sm font-medium text-slate-300 mb-3">
                                What is your ping for games played in SEA (Singapore) Server? <span className="text-red-400">*</span>
                              </label>
                              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                                <label className="flex items-center p-3 bg-slate-700/30 rounded-lg hover:bg-slate-700/50 transition-colors cursor-pointer">
                                  <input
                                    type="radio"
                                    name="ping"
                                    value="0-50"
                                    className="mr-3 text-green-500"
                                    required
                                  />
                                  <div>
                                    <span className="text-slate-300 font-medium">0-50ms</span>
                                    <p className="text-green-400 text-xs">Excellent</p>
                                  </div>
                                </label>
                                <label className="flex items-center p-3 bg-slate-700/30 rounded-lg hover:bg-slate-700/50 transition-colors cursor-pointer">
                                  <input
                                    type="radio"
                                    name="ping"
                                    value="51-100"
                                    className="mr-3 text-yellow-500"
                                    required
                                  />
                                  <div>
                                    <span className="text-slate-300 font-medium">51-100ms</span>
                                    <p className="text-yellow-400 text-xs">Good</p>
                                  </div>
                                </label>
                                <label className="flex items-center p-3 bg-slate-700/30 rounded-lg hover:bg-slate-700/50 transition-colors cursor-pointer">
                                  <input
                                    type="radio"
                                    name="ping"
                                    value="101-150"
                                    className="mr-3 text-orange-500"
                                    required
                                  />
                                  <div>
                                    <span className="text-slate-300 font-medium">101-199ms</span>
                                    <p className="text-orange-400 text-xs">Playable</p>
                                  </div>
                                </label>
                                <label className="flex items-center p-3 bg-slate-700/30 rounded-lg hover:bg-slate-700/50 transition-colors cursor-pointer">
                                  <input
                                    type="radio"
                                    name="ping"
                                    value="150+"
                                    className="mr-3 text-red-500"
                                    required
                                  />
                                  <div>
                                    <span className="text-slate-300 font-medium">200+ms</span>
                                    <p className="text-red-400 text-xs">High Latency</p>
                                  </div>
                                </label>
                              </div>
                            </div>
                          </div>
                        )}

                        {/* Step 7: Payment */}
                        {currentStep === 7 && (
                          <div className="bg-slate-800/50 border border-slate-600/50 rounded-lg p-6">
                            <div className="text-center mb-6">
                              <div className="inline-flex items-center gap-3 px-4 py-2 bg-gradient-to-r from-yellow-600/20 to-orange-600/20 border border-yellow-500/30 rounded-full">
                                <div className="w-2 h-2 bg-yellow-400 rounded-full"></div>
                                <h3 className="text-lg font-bold bg-gradient-to-r from-yellow-400 to-orange-400 bg-clip-text text-transparent">
                                  Payment Information
                                </h3>
                                <div className="w-2 h-2 bg-orange-400 rounded-full"></div>
                              </div>
                            </div>
                            <div className="space-y-6">
                              {/* Entry Fee Notice */}
                              <div className="text-center p-4 bg-gradient-to-r from-yellow-900/20 to-orange-900/20 border border-yellow-500/30 rounded-lg">
                                <h4 className="text-2xl font-bold text-yellow-300 mb-2">₹250</h4>
                                <p className="text-slate-300 text-sm">Entry Fee (Non-refundable)</p>
                              </div>

                              {/* Payment Methods */}
                              <div className="grid md:grid-cols-2 gap-6">
                                {/* PayTM Payment */}
                                <div className="bg-slate-700/30 border border-slate-600/30 rounded-lg p-4">
                                  <div className="text-center mb-4">
                                    <h4 className="text-lg font-semibold text-slate-300 mb-2">PayTM</h4>
                                    <p className="text-slate-400 text-sm">Scan QR code for instant payment</p>
                                  </div>
                                  <div className="flex justify-center mb-4">
                                    <div className="bg-white p-4 rounded-lg shadow-lg">
                                      <img 
                                        src="/Payment/Paytm.jpg" 
                                        alt="PayTM QR Code"
                                        className="w-48 h-48 object-contain"
                                      />
                                    </div>
                                  </div>
                                  <div className="text-center">
                                    <p className="text-slate-400 text-xs mb-2">UPI ID:</p>
                                    <p className="text-slate-300 text-sm font-mono bg-slate-800/50 px-3 py-2 rounded">
                                      9004862493@pthdfc
                                    </p>
                                  </div>
                                </div>

                                {/* PayPal Payment */}
                                <div className="bg-slate-700/30 border border-slate-600/30 rounded-lg p-4">
                                  <div className="text-center mb-4">
                                    <h4 className="text-lg font-semibold text-slate-300 mb-2">PayPal</h4>
                                    <p className="text-slate-400 text-sm">Scan QR code for international payments</p>
                                  </div>
                                  <div className="flex justify-center mb-4">
                                    <div className="bg-white p-4 rounded-lg shadow-lg">
                                      <img 
                                        src="/Payment/Paypal.jpg" 
                                        alt="PayPal QR Code"
                                        className="w-48 h-48 object-contain"
                                      />
                                    </div>
                                  </div>
                                  <div className="text-center">
                                    <p className="text-slate-400 text-xs mb-2">PayPal ID:</p>
                                    <p className="text-slate-300 text-sm font-mono bg-slate-800/50 px-3 py-2 rounded">
                                      @keyur4393
                                    </p>
                                  </div>
                                </div>
                              </div>

                              {/* Payment Proof Upload */}
                              <div className="bg-orange-900/20 border border-orange-500/30 rounded-lg p-4">
                                <h4 className="text-lg font-semibold text-orange-300 mb-3">Upload Payment Proof <span className="text-red-400">*</span></h4>
                                <p className="text-slate-300 text-sm mb-4">
                                  Please upload a screenshot of your payment confirmation. Include transaction ID and amount.
                                </p>
                                <div className="space-y-3">
                                  <input
                                    type="file"
                                    accept="image/*"
                                    className="w-full px-4 py-3 bg-slate-800/70 border border-slate-600/50 rounded-lg text-white file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-sm file:font-semibold file:bg-orange-600 file:text-white hover:file:bg-orange-700 transition-all"
                                    required
                                  />
                                  <div className="grid md:grid-cols-2 gap-3">
                                    <div>
                                      <label className="block text-sm font-medium text-slate-300 mb-2">
                                        Transaction ID <span className="text-red-400">*</span>
                                      </label>
                                      <input
                                        type="text"
                                        className="w-full px-4 py-2 bg-slate-800/70 border border-slate-600/50 rounded-lg text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-orange-500/50 focus:border-orange-500/50 transition-all text-sm"
                                        placeholder="Enter transaction ID"
                                        required
                                      />
                                    </div>
                                    <div>
                                      <label className="block text-sm font-medium text-slate-300 mb-2">
                                        Payment Method Used <span className="text-red-400">*</span>
                                      </label>
                                      <select
                                        className="w-full px-4 py-2 bg-slate-800/70 border border-slate-600/50 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-orange-500/50 focus:border-orange-500/50 transition-all text-sm"
                                        required
                                      >
                                        <option value="">Select payment method</option>
                                        <option value="paytm">PayTM</option>
                                        <option value="paypal">PayPal</option>
                                        <option value="upi">Other UPI</option>
                                        <option value="bank">Bank Transfer</option>
                                      </select>
                                    </div>
                                  </div>
                                </div>
                              </div>

                              {/* Important Notice */}
                              <div className="bg-red-900/20 border border-red-500/30 rounded-lg p-4">
                                <h4 className="text-red-300 font-semibold mb-2">⚠️ Important Payment Instructions</h4>
                                <ul className="text-slate-300 text-sm space-y-1">
                                  <li>• Registration is only confirmed after payment verification</li>
                                  <li>• Please mention your Discord name or in-game name in payment reference</li>
                                  <li>• Payment verification may take 24-48 hours</li>
                                  <li>• Entry fee is non-refundable once tournament starts</li>
                                  <li>• Contact support if payment issues occur</li>
                                </ul>
                              </div>
                            </div>
                          </div>
                        )}

                        {/* Step 8: Terms & Conditions and Feedback */}
                        {currentStep === 8 && (
                          <>
                            {/* Terms and Conditions Section */}
                            <div className="bg-slate-800/50 border border-slate-600/50 rounded-lg p-6">
                              <div className="text-center mb-6">
                                <div className="inline-flex items-center gap-3 px-4 py-2 bg-gradient-to-r from-slate-600/20 to-gray-600/20 border border-slate-500/30 rounded-full">
                                  <div className="w-2 h-2 bg-slate-400 rounded-full"></div>
                                  <h3 className="text-lg font-bold bg-gradient-to-r from-slate-400 to-gray-400 bg-clip-text text-transparent">
                                    Terms & Conditions
                                  </h3>
                                  <div className="w-2 h-2 bg-gray-400 rounded-full"></div>
                                </div>
                              </div>
                              <div className="space-y-4">
                                <div className="p-4 bg-slate-700/30 border border-slate-600/30 rounded-lg">
                                  <p className="text-slate-300 text-sm leading-relaxed">
                                    Do you confirm that the information provided is accurate to the best of your knowledge and understand that any false or misleading details may result in disqualification, removal from the tournament, or a ban from the server and further events?
                                  </p>
                                  <br />
                                  <p className="text-slate-300 text-sm leading-relaxed">
                                    Additionally, your gameplay videos and footage may be used at our discretion for promotional, streaming, or content-related purposes.
                                  </p>
                                  <br />
                                  <p className="text-slate-300 text-sm leading-relaxed">
                                    By submitting, you also confirm that you have joined the TRR Discord server and accepted the server conditions (mandatory for participation).
                                  </p>
                                </div>
                                <label className="flex items-start gap-3 p-4 bg-slate-700/20 rounded-lg cursor-pointer hover:bg-slate-700/30 transition-colors">
                                  <input
                                    type="checkbox"
                                    className="mt-1 text-blue-500"
                                    required
                                  />
                                  <div>
                                    <span className="text-slate-300 font-medium">I agree to all terms and conditions <span className="text-red-400">*</span></span>
                                    <p className="text-slate-500 text-xs mt-1">
                                      By checking this box, you confirm your agreement to all the above terms
                                    </p>
                                  </div>
                                </label>
                              </div>
                            </div>

                            {/* Feedback Section */}
                            <div className="bg-slate-800/50 border border-slate-600/50 rounded-lg p-6">
                              <div className="text-center mb-6">
                                <div className="inline-flex items-center gap-3 px-4 py-2 bg-gradient-to-r from-teal-600/20 to-cyan-600/20 border border-teal-500/30 rounded-full">
                                  <div className="w-2 h-2 bg-teal-400 rounded-full"></div>
                                  <h3 className="text-lg font-bold bg-gradient-to-r from-teal-400 to-cyan-400 bg-clip-text text-transparent">
                                    Feedback
                                  </h3>
                                  <div className="w-2 h-2 bg-cyan-400 rounded-full"></div>
                                </div>
                              </div>
                              <div className="space-y-6">
                                {/* Feedback Text */}
                                <div>
                                  <label className="block text-sm font-medium text-slate-300 mb-3">
                                    Please give your honest opinions
                                  </label>
                                  <textarea
                                    rows={4}
                                    className="w-full px-4 py-3 bg-slate-800/70 border border-slate-600/50 rounded-lg text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-teal-500/50 focus:border-teal-500/50 transition-all text-sm resize-none"
                                    placeholder="Share your thoughts about TRR, suggestions for improvement, or any feedback you'd like to give..."
                                  />
                                </div>

                                {/* Rating Section */}
                                <div>
                                  <label className="block text-sm font-medium text-slate-300 mb-3">
                                    Please rate your Roshan Rumble experience
                                  </label>
                                  <div className="flex justify-center items-center gap-4">
                                    {[1, 2, 3, 4, 5].map((rating) => (
                                      <label key={rating} className="flex flex-col items-center gap-2 cursor-pointer group">
                                        <input
                                          type="radio"
                                          name="rating"
                                          value={rating}
                                          className="sr-only peer"
                                        />
                                        <div className="text-3xl transition-all duration-200 peer-checked:text-yellow-400 text-slate-600 group-hover:text-yellow-300 group-hover:scale-110">
                                          ⭐
                                        </div>
                                        <span className="text-xs text-slate-400 peer-checked:text-yellow-300 group-hover:text-slate-300">
                                          {rating}
                                        </span>
                                      </label>
                                    ))}
                                  </div>
                                </div>

                                {/* Suggestions */}
                                <div>
                                  <label className="block text-sm font-medium text-slate-300 mb-3">
                                    How can we improve your experience?
                                  </label>
                                  <textarea
                                    rows={3}
                                    className="w-full px-4 py-3 bg-slate-800/70 border border-slate-600/50 rounded-lg text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-teal-500/50 focus:border-teal-500/50 transition-all text-sm resize-none"
                                    placeholder="Suggestions for tournaments, features, community improvements, etc..."
                                  />
                                </div>
                              </div>
                            </div>
                          </>
                        )}

                        {/* Navigation Buttons */}
                        <div className="flex justify-between pt-2">
                          <button
                            type="button"
                            onClick={currentStep === 1 ? handleBackToSelection : handlePrevStep}
                            className="flex items-center gap-1 bg-slate-700 hover:bg-slate-600 text-white font-bold py-2 px-4 rounded-lg transition-all duration-300 text-sm cursor-pointer"
                          >
                            <ArrowLeft className="w-3 h-3" />
                            {currentStep === 1 ? 'Back to Selection' : 'Previous'}
                          </button>
                          
                          {currentStep < totalSteps ? (
                            <button
                              type="button"
                              onClick={handleNextStep}
                              disabled={!canProceedToNext()}
                              className={`flex items-center gap-1 font-bold py-2 px-4 rounded-lg transition-all duration-300 text-sm cursor-pointer ${
                                canProceedToNext()
                                  ? 'bg-gradient-to-r from-blue-500 to-cyan-500 hover:from-blue-600 hover:to-cyan-600 text-white'
                                  : 'bg-slate-600 text-slate-400 cursor-not-allowed'
                              }`}
                            >
                              Next
                              <ArrowLeft className="w-3 h-3 rotate-180" />
                            </button>
                          ) : (
                            <button
                              type="submit"
                              className="flex items-center gap-1 bg-gradient-to-r from-green-500 to-emerald-500 hover:from-green-600 hover:to-emerald-600 text-white font-bold py-2 px-4 rounded-lg transition-all duration-300 transform hover:scale-105 shadow-lg hover:shadow-xl text-sm cursor-pointer"
                            >
                              Complete Registration
                              <CheckCircle className="w-3 h-3" />
                            </button>
                          )}
                        </div>
                      </form>
                      </div>
                    </div>
                  </div>
                ) : !showNewPlayerForm ? (
                  <div className="grid md:grid-cols-2 gap-10 max-w-8xl mx-auto">
                    
                    {/* Existing Player Card */}
                    <div className="group relative h-full">
                      <div className="absolute inset-0 bg-gradient-to-r from-blue-500/20 to-cyan-500/20 rounded-xl blur-xl group-hover:blur-2xl transition-all duration-500"></div>
                      <div className="relative bg-slate-900/85 backdrop-blur-xl border border-slate-700/50 rounded-xl p-6 hover:border-blue-500/50 transition-all duration-300 h-full flex flex-col">
                        
                        <div className="text-center mb-4 flex-shrink-0">
                          <div className="w-12 h-12 bg-gradient-to-r from-blue-500/20 to-cyan-500/20 rounded-full flex items-center justify-center mx-auto mb-3 group-hover:scale-110 transition-transform duration-300">
                            <User className="w-6 h-6 text-blue-400" />
                          </div>
                          <h2 className="text-lg font-bold text-white mb-1">Existing Player</h2>
                          <p className="text-slate-300 text-sm">
                            Already participated in TRR? Register with your existing profile
                          </p>
                        </div>

                        <div className="space-y-3 flex-1 flex flex-col">
                          <div className="relative">
                            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400 w-4 h-4" />
                            <input
                              type="text"
                              placeholder="Search by nickname or real name..."
                              value={searchTerm}
                              onChange={(e) => setSearchTerm(e.target.value)}
                              className="w-full pl-10 pr-4 py-2 bg-slate-800/70 border border-slate-600/50 rounded-lg text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500/50 transition-all text-sm"
                            />
                          </div>
                          
                          {!searchTerm && (
                            <div className="text-center text-slate-400 text-sm bg-slate-800/30 rounded-lg p-2">
                              <p>Start typing to search for your existing profile</p>
                            </div>
                          )}
                          
                          {searchTerm && (
                            <div className="space-y-2 max-h-32 overflow-y-auto">
                              {(() => {
                                // Filter players from actual database
                                const filteredPlayers = players.filter(player => 
                                  player.nickname.toLowerCase().includes(searchTerm.toLowerCase()) ||
                                  (player.realName && player.realName.toLowerCase().includes(searchTerm.toLowerCase()))
                                );
                                
                                return filteredPlayers.length > 0 ? filteredPlayers.slice(0, 10).map((player) => (
                                  <div key={player.id} className="bg-slate-800/50 border border-slate-600/30 rounded-lg p-2 animate-in fade-in duration-300">
                                    <div className="flex items-center gap-3">
                                      <img 
                                        src={player.avatarUrl} 
                                        alt={player.nickname}
                                        className="w-8 h-8 rounded-full object-cover border-2 border-blue-400"
                                        onError={(e) => {
                                          e.currentTarget.src = "/avatars/default.jpg";
                                        }}
                                      />
                                      <div className="flex-1">
                                        <h3 className="text-white font-bold text-sm">{player.nickname}</h3>
                                        {player.realName && (
                                          <p className="text-slate-400 text-xs">{player.realName}</p>
                                        )}
                                      </div>
                                      <button 
                                        onClick={() => handlePlayerSelect(player)}
                                        className="bg-gradient-to-r from-blue-500 to-cyan-500 text-white px-3 py-1 rounded-md font-semibold hover:from-blue-600 hover:to-cyan-600 transition-all transform hover:scale-105 text-xs cursor-pointer"
                                      >
                                        Select
                                      </button>
                                    </div>
                                  </div>
                                )) : (
                                  <div className="text-center text-slate-400 text-sm bg-slate-800/30 rounded-lg p-2">
                                    <p>No players found matching "{searchTerm}"</p>
                                  </div>
                                );
                              })()}
                            </div>
                          )}
                          
                          <div className="flex-1"></div>
                        </div>
                      </div>
                    </div>

                    {/* New Player Card */}
                    <div className="group relative h-full">
                      <div className="absolute inset-0 bg-gradient-to-r from-green-500/20 to-emerald-500/20 rounded-xl blur-xl group-hover:blur-2xl transition-all duration-500"></div>
                      <div className="relative bg-slate-900/85 backdrop-blur-xl border border-slate-700/50 rounded-xl p-6 hover:border-green-500/50 transition-all duration-300 h-full flex flex-col">
                        
                        <div className="text-center mb-4 flex-shrink-0">
                          <div className="w-12 h-12 bg-gradient-to-r from-green-500/20 to-emerald-500/20 rounded-full flex items-center justify-center mx-auto mb-3 group-hover:scale-110 transition-transform duration-300">
                            <UserPlus className="w-6 h-6 text-green-400" />
                          </div>
                          <h2 className="text-lg font-bold text-white mb-1">New Player</h2>
                          <p className="text-slate-300 text-sm">
                            First time joining TRR? Create a new profile and register
                          </p>
                        </div>

                        <div className="space-y-3 flex-1 flex flex-col">
                          <div className="bg-slate-800/50 rounded-lg p-3 flex-1">
                            <h3 className="text-sm font-semibold text-white mb-2 flex items-center">
                              <Star className="w-4 h-4 mr-2 text-green-400" />
                              What you'll need:
                            </h3>
                            <ul className="space-y-1 text-slate-300 text-xs">
                              <li className="flex items-center">
                                <CheckCircle className="w-3 h-3 text-green-400 mr-2 flex-shrink-0" />
                                <span>Your Dota 2 in-game name</span>
                              </li>
                              <li className="flex items-center">
                                <CheckCircle className="w-3 h-3 text-green-400 mr-2 flex-shrink-0" />
                                <span>Real name (optional)</span>
                              </li>
                              <li className="flex items-center">
                                <CheckCircle className="w-3 h-3 text-green-400 mr-2 flex-shrink-0" />
                                <span>Steam profile URL</span>
                              </li>
                              <li className="flex items-center">
                                <CheckCircle className="w-3 h-3 text-green-400 mr-2 flex-shrink-0" />
                                <span>Preferred playing roles</span>
                              </li>
                              <li className="flex items-center">
                                <CheckCircle className="w-3 h-3 text-green-400 mr-2 flex-shrink-0" />
                                <span>Connection ping information</span>
                              </li>
                            </ul>
                          </div>

                          <button
                            onClick={() => setShowNewPlayerForm(true)}
                            className="w-full bg-gradient-to-r from-green-500 to-emerald-500 hover:from-green-600 hover:to-emerald-600 text-white font-bold py-2 px-4 rounded-lg transition-all duration-300 transform hover:scale-105 shadow-lg hover:shadow-xl text-sm flex-shrink-0 cursor-pointer"
                          >
                            Create New Profile
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                ) : (
                  /* New Player Form Modal */
                  <div className="max-w-xl mx-auto">
                    <div className="bg-slate-900/90 backdrop-blur-xl border border-slate-700/50 rounded-xl p-5">
                      <div className="flex justify-between items-center mb-4">
                        <h2 className="text-lg font-bold text-white">Create New Profile</h2>
                        <button
                          onClick={() => setShowNewPlayerForm(false)}
                          className="text-slate-400 hover:text-white text-xl transition-colors cursor-pointer"
                        >
                          ×
                        </button>
                      </div>
                      
                      <div className="text-center py-4">
                        <div className="w-12 h-12 bg-gradient-to-r from-green-500/20 to-emerald-500/20 rounded-full flex items-center justify-center mx-auto mb-4">
                          <UserPlus className="w-6 h-6 text-green-400" />
                        </div>
                        <h3 className="text-lg font-bold text-white mb-3">Registration Form Coming Soon</h3>
                        <p className="text-slate-300 text-sm mb-4">
                          The full registration system is being prepared by our tournament administrators.
                        </p>
                        <p className="text-slate-400 text-xs">
                          Please check back later or contact administrators for assistance with registration.
                        </p>
                      </div>
                    </div>
                  </div>
                )}
            </div>
          </div>
        </div>
      
      </div>
      </main>
    </>
  );
}


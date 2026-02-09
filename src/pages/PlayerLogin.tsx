import React, { useState, useMemo, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Search, Lock, Eye, EyeOff, User, LogIn } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import DatabaseService from '../services/database';
import AuthService from '../services/auth';

export default function PlayerLogin() {
  const [selectedPlayer, setSelectedPlayer] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [players, setPlayers] = useState<any[]>([]);
  const [searchResults, setSearchResults] = useState<any[]>([]);
  const navigate = useNavigate();

  // Load players from database
  useEffect(() => {
    const loadPlayers = async () => {
      const result = await DatabaseService.getAllPlayers();
      if (result.success && result.data) {
        setPlayers(result.data);
      } else {
        console.error('Failed to load players:', result.error);
        setPlayers([]);
      }
    };
    
    loadPlayers();
  }, []);

  // Search players when query changes
  useEffect(() => {
    const searchPlayers = async () => {
      if (!searchQuery.trim()) {
        setSearchResults([]);
        return;
      }

      const result = await DatabaseService.searchPlayers(searchQuery);
      if (result.success && result.data) {
        setSearchResults(result.data);
      } else {
        console.error('Search failed:', result.error);
        setSearchResults([]);
      }
    };

    const debounceTimer = setTimeout(searchPlayers, 300);
    return () => clearTimeout(debounceTimer);
  }, [searchQuery]);

  // Filter players based on search query (fallback for offline mode)
  const filteredPlayers = useMemo(() => {
    if (searchResults.length > 0) {
      return searchResults;
    }
    
    if (!searchQuery.trim()) return players;
    
    const query = searchQuery.toLowerCase();
    return players.filter(player => 
      player.nickname.toLowerCase().includes(query) ||
      (player.realName && player.realName.toLowerCase().includes(query))
    );
  }, [searchQuery, players, searchResults]);

  const handlePlayerSelect = (playerId: string) => {
    setSelectedPlayer(playerId);
    setPassword('');
    setError('');
    setSearchQuery('');
  };

  const handlePasswordSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedPlayer) return;

    setIsLoading(true);
    setError('');

    try {
      // Find the selected player
      const player = players.find(p => p.id === selectedPlayer);
      if (!player) {
        setError('Player not found');
        setIsLoading(false);
        return;
      }

      // Authenticate with database
      const result = await AuthService.loginPlayer(player.nickname, password);
      
      if (!result.success) {
        setError(result.error || 'Login failed');
        setIsLoading(false);
        return;
      }

      // Navigate to player detail page (which will show as editable for own profile)
      navigate(`/players/${player.id}`);
    } catch (error) {
      console.error('Login error:', error);
      setError('Login failed. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const selectedPlayerData = players.find(p => p.id === selectedPlayer);

  return (
    <>
      {/* Fixed Background matching AdminLogin */}
      <div className="fixed inset-0 z-0">
        <div className="absolute inset-0 bg-[url('https://cdn.cloudflare.steamstatic.com/apps/dota2/images/dota_react/blog/play/dota_heroes.jpg')] bg-cover bg-center" />
        {/* Navbar-inspired gradient overlay */}
        <div 
          className="absolute inset-0"
          style={{
            background: "radial-gradient(circle at 0% 0%, rgba(192,192,192,0.15), transparent 60%), radial-gradient(circle at 100% 100%, rgba(136,144,150,0.12), transparent 60%), rgba(5,7,10,0.94)"
          }}
        />
        <div className="absolute inset-0 bg-gradient-to-br from-gray-800/30 via-slate-900/40 to-gray-900/50" />
        {/* Subtle animated orbs matching navbar theme */}
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-gradient-to-r from-gray-400/10 to-slate-400/10 rounded-full blur-3xl animate-pulse" />
        <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-gradient-to-r from-slate-500/10 to-gray-500/10 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '1s' }} />
      </div>

      <main className="player-login-page relative py-1 pt-24">
        <div className="relative z-10 min-h-0">
          <div className="max-w-5xl mx-auto px-2 sm:px-4 lg:px-6">
            {/* Header */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="text-center mb-6 relative pt-4"
            >
              <p className="text-sm text-gray-400">Select your account to continue</p>
            </motion.div>

            {!selectedPlayer ? (
              /* Player Selection */
              <div className="w-full flex justify-center pb-4">
                <div className="w-full max-w-2xl px-3 sm:px-4 md:px-6 relative">
                  {/* Global Error Message */}
                  {error && (
                    <motion.div 
                      initial={{ opacity: 0, y: -10 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="mb-6 p-4 bg-red-900/40 border border-red-500/60 rounded-xl backdrop-blur-sm"
                    >
                      <p className="text-red-200 text-sm text-center">{error}</p>
                    </motion.div>
                  )}
                  
                  {/* Player Selection Card */}
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="bg-gray-800/20 backdrop-blur-xl border border-gray-600/30 rounded-2xl p-6 shadow-2xl shadow-gray-900/20 overflow-hidden"
                  >
                    <div className="text-center mb-6">
                      <div className="inline-flex items-center justify-center w-12 h-12 bg-gradient-to-r from-gray-600 to-slate-600 rounded-full mb-4">
                        <User className="w-6 h-6 text-white" />
                      </div>
                      <h2 className="text-xl font-bold text-white mb-2">Player Login</h2>
                      <p className="text-gray-400 text-sm">Search for your player profile</p>
                    </div>

                    {/* Search Bar */}
                    <div className="relative mb-6">
                      <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                      <input
                        type="text"
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className="w-full pl-12 pr-4 py-3 bg-black/30 border border-gray-600/40 rounded-xl text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-gray-500 focus:border-gray-500 transition-all duration-300 backdrop-blur-sm text-base"
                        placeholder="Search by nickname or real name..."
                        autoFocus
                      />
                    </div>

                    {/* Search Results */}
                    {searchQuery && (
                      <div className="max-h-80 overflow-y-auto space-y-3 border-t border-gray-600/30 pt-6">
                        {filteredPlayers.slice(0, 10).map((player) => (
                          <motion.button
                            key={player.id}
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            whileHover={{ scale: 1.02 }}
                            whileTap={{ scale: 0.98 }}
                            onClick={() => handlePlayerSelect(player.id)}
                            className="w-full flex items-center gap-3 p-3 bg-gray-800/30 hover:bg-gray-700/40 border border-gray-600/20 hover:border-gray-400/50 rounded-xl transition-all duration-300 group cursor-pointer backdrop-blur-sm overflow-hidden"
                          >
                            <div className="relative flex-shrink-0">
                              <img
                                src={player.avatarUrl}
                                alt={player.nickname}
                                className="w-10 h-10 rounded-full border-2 border-gray-500/50 group-hover:border-gray-400 transition-colors object-cover"
                                onError={(e) => {
                                  e.currentTarget.src = `https://ui-avatars.com/api/?name=${encodeURIComponent(player.nickname)}&background=6b7280&color=fff&size=40`;
                                }}
                              />
                            </div>
                            <div className="flex-1 min-w-0 text-left">
                              <p className="text-white font-semibold group-hover:text-gray-200 transition-colors truncate text-sm">{player.nickname}</p>
                              {player.realName && (
                                <p className="text-xs text-gray-400 group-hover:text-gray-300 transition-colors truncate">{player.realName}</p>
                              )}
                              {player.currentMedalLabel && (
                                <p className="text-xs text-gray-500 group-hover:text-gray-400 transition-colors truncate">{player.currentMedalLabel}</p>
                              )}
                            </div>
                            <LogIn className="w-4 h-4 text-gray-400 group-hover:text-gray-300 transition-colors flex-shrink-0" />
                          </motion.button>
                        ))}
                        {filteredPlayers.length === 0 && (
                          <div className="text-center py-6">
                            <User className="w-10 h-10 text-gray-500/50 mx-auto mb-2" />
                            <p className="text-gray-400 font-medium text-sm">No players found</p>
                            <p className="text-gray-500 text-xs">Try searching with a different name</p>
                          </div>
                        )}
                        {filteredPlayers.length > 10 && (
                          <p className="text-gray-400 text-center py-2 text-xs bg-gray-800/20 rounded-lg border border-gray-600/20">
                            Showing first 10 results. Type more to narrow down.
                          </p>
                        )}
                      </div>
                    )}

                    {!searchQuery && (
                      <div className="text-center py-8">
                        <Search className="w-12 h-12 text-gray-500/30 mx-auto mb-3" />
                        <p className="text-gray-400 text-base">Start typing to search for your account</p>
                        <p className="text-gray-500 text-sm mt-1">Enter your nickname or real name</p>
                      </div>
                    )}
                  </motion.div>
                </div>
              </div>
            ) : (
              /* Password Entry Form for Selected Player */
              <div className="w-full flex justify-center pb-4">
                <div className="w-full max-w-md px-3 sm:px-4 md:px-6 relative">
                  <motion.div
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className="w-full"
                  >
                    {/* Selected Player Display */}
                    <div className="text-center mb-6">
                      <div className="relative w-20 h-20 mx-auto mb-4">
                        <div className="absolute inset-0 bg-gradient-to-br from-gray-400/30 to-slate-400/30 rounded-full opacity-30" />
                        <div className="absolute inset-0 bg-gradient-to-br from-gray-400/30 to-slate-400/30 rounded-full blur-xl opacity-40 animate-pulse" />
                        <img
                          src={selectedPlayerData?.avatarUrl}
                          alt={selectedPlayerData?.nickname}
                          className="w-full h-full object-cover rounded-full border-3 border-gray-400/50 relative z-10 shadow-lg"
                          onError={(e) => {
                            e.currentTarget.src = `https://ui-avatars.com/api/?name=${encodeURIComponent(selectedPlayerData?.nickname || '')}&background=6b7280&color=fff&size=80`;
                          }}
                        />
                      </div>
                      <h2 className="text-xl font-bold bg-gradient-to-r from-gray-200 to-white bg-clip-text text-transparent mb-2">
                        {selectedPlayerData?.nickname}
                      </h2>
                      {selectedPlayerData?.realName && (
                        <p className="text-gray-300 text-sm mb-2 truncate">{selectedPlayerData.realName}</p>
                      )}
                      {selectedPlayerData?.currentMedalLabel && (
                        <p className="text-gray-400 text-xs mb-3 truncate">{selectedPlayerData.currentMedalLabel}</p>
                      )}
                      <button
                        onClick={() => setSelectedPlayer(null)}
                        className="text-gray-400 hover:text-gray-300 text-sm transition-colors duration-300 hover:underline cursor-pointer"
                      >
                        ← Choose different player
                      </button>
                    </div>

                    {/* Password Form */}
                    <form onSubmit={handlePasswordSubmit} className="bg-gray-900/30 backdrop-blur-xl border border-gray-600/30 rounded-2xl p-6 space-y-4 shadow-2xl shadow-gray-900/20">
                      <div>
                        <label className="block text-sm font-medium text-gray-200 mb-2">
                          Enter Your Password
                        </label>
                        <div className="relative">
                          <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                          <input
                            type={showPassword ? 'text' : 'password'}
                            value={password}
                            onChange={(e) => {
                              setPassword(e.target.value);
                              setError('');
                            }}
                            className="w-full pl-10 pr-10 py-3 bg-black/30 border border-gray-600/40 rounded-xl text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-gray-500 focus:border-gray-500 transition-all duration-300 backdrop-blur-sm text-base"
                            placeholder="Enter your password"
                            required
                            autoFocus
                          />
                          <button
                            type="button"
                            onClick={() => setShowPassword(!showPassword)}
                            className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-300 transition-colors duration-300 cursor-pointer"
                          >
                            {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                          </button>
                        </div>
                      </div>

                      {/* Error Message */}
                      {error && (
                        <motion.div 
                          initial={{ opacity: 0, y: -10 }}
                          animate={{ opacity: 1, y: 0 }}
                          className="p-3 bg-red-900/40 border border-red-500/60 rounded-xl backdrop-blur-sm"
                        >
                          <p className="text-red-200 text-sm">{error}</p>
                        </motion.div>
                      )}

                      {/* Submit Button */}
                      <button
                        type="submit"
                        disabled={isLoading}
                        className={`w-full font-semibold py-3 px-6 rounded-xl transition-all duration-300 transform focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2 focus:ring-offset-gray-800 cursor-pointer text-base ${
                          isLoading
                            ? 'bg-gray-600 cursor-not-allowed text-gray-300'
                            : 'bg-gradient-to-r from-gray-700 via-slate-700 to-gray-800 hover:from-gray-600 hover:via-slate-600 hover:to-gray-700 text-white hover:scale-[1.02] shadow-lg shadow-gray-500/20'
                        }`}
                      >
                        {isLoading ? (
                          <div className="flex items-center justify-center gap-2">
                            <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                            <span>Logging in...</span>
                          </div>
                        ) : (
                          <div className="flex items-center justify-center gap-2">
                            <LogIn className="w-4 h-4" />
                            <span>Login</span>
                          </div>
                        )}
                      </button>
                    </form>
                  </motion.div>
                </div>
              </div>
            )}
          </div>
        </div>
      </main>
    </>
  );
}
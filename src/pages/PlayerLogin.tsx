import { useState, useEffect, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Search, Lock, Eye, EyeOff, LogIn, ChevronRight } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import DatabaseService from '../services/database';
import AuthService from '../services/auth';
import SteamAuthService from '../services/steamAuth';
import { mapDatabasePlayerToFrontend } from '../utils/playerMapper';

function SteamIcon({ className = 'w-5 h-5' }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="currentColor">
      <path d="M11.979 0C5.678 0 .511 4.86.022 11.037l6.432 2.658c.545-.371 1.203-.59 1.912-.59.063 0 .125.004.188.006l2.861-4.142V8.91c0-2.495 2.028-4.524 4.524-4.524 2.494 0 4.524 2.031 4.524 4.527s-2.03 4.525-4.524 4.525h-.105l-4.076 2.911c0 .052.004.105.004.159 0 1.875-1.515 3.396-3.39 3.396-1.635 0-3.016-1.173-3.331-2.727L.436 15.27C1.862 20.307 6.486 24 11.979 24c6.627 0 11.999-5.373 11.999-12S18.606 0 11.979 0zM7.54 18.21l-1.473-.61c.262.543.714.999 1.314 1.25 1.297.539 2.793-.076 3.332-1.375.263-.63.264-1.319.005-1.949s-.75-1.121-1.377-1.383c-.624-.26-1.29-.249-1.878-.03l1.523.63c.956.4 1.409 1.5 1.009 2.455-.397.957-1.497 1.41-2.455 1.012H7.54zm11.415-9.303c0-1.662-1.353-3.015-3.015-3.015-1.665 0-3.015 1.353-3.015 3.015 0 1.665 1.35 3.015 3.015 3.015 1.663 0 3.015-1.35 3.015-3.015zm-5.273-.005c0-1.252 1.013-2.266 2.265-2.266 1.249 0 2.266 1.014 2.266 2.266 0 1.251-1.017 2.265-2.266 2.265-1.252 0-2.265-1.014-2.265-2.265z" />
    </svg>
  );
}

function getInitials(name: string) {
  const w = name.trim().split(' ');
  return w.length >= 2 ? (w[0][0] + w[1][0]).toUpperCase() : name.slice(0, 2).toUpperCase();
}

function getColor(name: string) {
  const colors = ['from-blue-500 to-indigo-600', 'from-purple-500 to-pink-600', 'from-orange-500 to-red-600', 'from-teal-500 to-cyan-600', 'from-green-500 to-emerald-600'];
  let h = 0;
  for (let i = 0; i < name.length; i++) h = name.charCodeAt(i) + ((h << 5) - h);
  return colors[Math.abs(h) % colors.length];
}

function PlayerAvatar({ url, name, size }: { url: string; name: string; size: number }) {
  const [err, setErr] = useState(false);
  const cls = `w-${size} h-${size}`;
  if (!url || err) {
    return (
      <div className={`${cls} rounded-full bg-gradient-to-br ${getColor(name)} flex items-center justify-center flex-shrink-0`}>
        <span className="text-white font-bold text-xs">{getInitials(name)}</span>
      </div>
    );
  }
  return <img src={url} alt={name} className={`${cls} rounded-full object-cover flex-shrink-0`} onError={() => setErr(true)} />;
}

export default function PlayerLogin() {
  const navigate = useNavigate();
  const [clickCount, setClickCount] = useState(0);
  const [showLegacy, setShowLegacy] = useState(false);
  const [selectedPlayer, setSelectedPlayer] = useState<any>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [players, setPlayers] = useState<any[]>([]);
  const [searchResults, setSearchResults] = useState<any[]>([]);

  useEffect(() => {
    console.log('🔵 PlayerLogin mount — checking existing session')
    if (SteamAuthService.isLoggedIn()) {
      const s = SteamAuthService.getSession();
      console.log('✅ Already logged in, redirecting to:', s?.playerId)
      if (s) navigate(`/players/${s.playerId}`, { replace: true });
    } else {
      console.log('ℹ️ No session found, showing login page')
    }
  }, [navigate]);

  useEffect(() => {
    if (!showLegacy) return;
    DatabaseService.getAllPlayers().then(r => {
      if (r.success && r.data) setPlayers(r.data.map(mapDatabasePlayerToFrontend));
    });
  }, [showLegacy]);

  useEffect(() => {
    if (!searchQuery.trim()) { setSearchResults([]); return; }
    const t = setTimeout(async () => {
      const r = await DatabaseService.searchPlayers(searchQuery);
      if (r.success && r.data) setSearchResults(r.data.map(mapDatabasePlayerToFrontend));
      else setSearchResults([]);
    }, 300);
    return () => clearTimeout(t);
  }, [searchQuery]);

  const filteredPlayers = useMemo(() => {
    if (searchResults.length) return searchResults;
    if (!searchQuery.trim()) return players;
    const q = searchQuery.toLowerCase();
    return players.filter(p => p.nickname.toLowerCase().includes(q));
  }, [searchQuery, players, searchResults]);

  const handlePasswordSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedPlayer) return;
    setIsLoading(true); setError('');
    try {
      const result = await AuthService.loginPlayer(selectedPlayer.nickname, password);
      if (!result.success) { setError(result.error || 'Login failed'); return; }
      navigate(`/players/${selectedPlayer.id}`);
    } catch { setError('Login failed. Please try again.'); }
    finally { setIsLoading(false); }
  };

  const handleFooterClick = () => {
    const next = clickCount + 1;
    setClickCount(next);
    if (next >= 5) { setShowLegacy(v => !v); setClickCount(0); }
  };

  return (
    <div className="min-h-screen flex flex-col" style={{ paddingTop: '80px', background: '#080b0f' }}>

      {/* Subtle glow */}
      <div className="fixed inset-0 pointer-events-none" style={{
        background: 'radial-gradient(ellipse 60% 40% at 50% 30%, rgba(102,192,244,0.05) 0%, transparent 70%)'
      }} />

      {/* Main content — vertically centered in remaining space */}
      <div className="flex-1 flex flex-col items-center justify-center px-4 py-12">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
          className="flex flex-col items-center gap-7 text-center"
        >
          {/* Subtitle only — navbar already shows the brand */}
          <p className="text-gray-400 text-base tracking-wide">
            Sign in with your Steam account to continue
          </p>

          {/* Steam button */}
          <button
            onClick={() => SteamAuthService.initiateLogin()}
            className="flex items-center gap-2.5 px-8 py-3 rounded-lg font-semibold text-sm tracking-widest uppercase transition-all duration-200 cursor-pointer"
            style={{
              background: 'rgba(102,192,244,0.08)',
              border: '1px solid rgba(102,192,244,0.22)',
              color: '#9dd4ee',
            }}
            onMouseEnter={e => {
              e.currentTarget.style.background = 'rgba(102,192,244,0.15)';
              e.currentTarget.style.borderColor = 'rgba(102,192,244,0.4)';
              e.currentTarget.style.color = '#c2e4f5';
            }}
            onMouseLeave={e => {
              e.currentTarget.style.background = 'rgba(102,192,244,0.08)';
              e.currentTarget.style.borderColor = 'rgba(102,192,244,0.22)';
              e.currentTarget.style.color = '#9dd4ee';
            }}
          >
            <SteamIcon className="w-4 h-4" />
            Sign in with Steam
          </button>

          {/* Legacy login panel */}
          <AnimatePresence>
            {showLegacy && (
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: 10 }}
                className="w-72 rounded-xl p-5 text-left"
                style={{ background: 'rgba(12,15,20,0.95)', border: '1px solid rgba(255,255,255,0.07)' }}
              >
                <p className="text-gray-700 text-[10px] text-center tracking-widest uppercase mb-4">Legacy Login</p>
                <AnimatePresence mode="wait">
                  {!selectedPlayer ? (
                    <motion.div key="search" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="space-y-2">
                      <div className="relative">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-gray-600" />
                        <input type="text" value={searchQuery} onChange={e => setSearchQuery(e.target.value)} placeholder="Search nickname…"
                          className="w-full pl-9 pr-3 py-2.5 text-sm text-gray-200 placeholder-gray-700 rounded-lg focus:outline-none transition-colors"
                          style={{ background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.08)' }}
                          onFocus={e => (e.currentTarget.style.borderColor = 'rgba(255,255,255,0.18)')}
                          onBlur={e => (e.currentTarget.style.borderColor = 'rgba(255,255,255,0.08)')}
                        />
                      </div>
                      {searchQuery && (
                        <div className="space-y-1 max-h-44 overflow-y-auto">
                          {filteredPlayers.slice(0, 6).map(p => (
                            <button key={p.id} onClick={() => { setSelectedPlayer(p); setSearchQuery(''); setError(''); }}
                              className="w-full flex items-center gap-2.5 px-3 py-2 text-left rounded-lg transition-colors cursor-pointer"
                              style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.05)' }}
                              onMouseEnter={e => (e.currentTarget.style.background = 'rgba(255,255,255,0.07)')}
                              onMouseLeave={e => (e.currentTarget.style.background = 'rgba(255,255,255,0.03)')}
                            >
                              <PlayerAvatar url={p.avatarUrl} name={p.nickname} size={7} />
                              <span className="text-gray-200 text-sm font-medium truncate flex-1">{p.nickname}</span>
                              <ChevronRight className="w-3 h-3 text-gray-600" />
                            </button>
                          ))}
                          {filteredPlayers.length === 0 && <p className="text-center text-gray-700 text-xs py-3">No players found</p>}
                        </div>
                      )}
                    </motion.div>
                  ) : (
                    <motion.div key="pass" initial={{ opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} className="space-y-2">
                      <div className="flex items-center gap-2.5 px-3 py-2 rounded-lg" style={{ background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.07)' }}>
                        <PlayerAvatar url={selectedPlayer.avatarUrl} name={selectedPlayer.nickname} size={7} />
                        <span className="text-white font-semibold text-sm flex-1 truncate">{selectedPlayer.nickname}</span>
                        <button onClick={() => { setSelectedPlayer(null); setPassword(''); setError(''); }} className="text-gray-600 hover:text-gray-400 text-xs transition-colors cursor-pointer">✕</button>
                      </div>
                      <form onSubmit={handlePasswordSubmit} className="space-y-2">
                        <div className="relative">
                          <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-gray-600" />
                          <input type={showPassword ? 'text' : 'password'} value={password} onChange={e => { setPassword(e.target.value); setError(''); }}
                            placeholder="Password" required autoFocus
                            className="w-full pl-9 pr-9 py-2.5 text-sm text-gray-200 placeholder-gray-700 rounded-lg focus:outline-none transition-colors"
                            style={{ background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.08)' }}
                            onFocus={e => (e.currentTarget.style.borderColor = 'rgba(255,255,255,0.18)')}
                            onBlur={e => (e.currentTarget.style.borderColor = 'rgba(255,255,255,0.08)')}
                          />
                          <button type="button" onClick={() => setShowPassword(v => !v)} className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-600 hover:text-gray-400 cursor-pointer transition-colors">
                            {showPassword ? <EyeOff className="w-3.5 h-3.5" /> : <Eye className="w-3.5 h-3.5" />}
                          </button>
                        </div>
                        {error && <p className="text-red-400 text-xs text-center">{error}</p>}
                        <button type="submit" disabled={isLoading}
                          className="w-full flex items-center justify-center gap-2 py-2.5 rounded-lg text-sm font-semibold transition-all cursor-pointer disabled:opacity-40"
                          style={{ background: 'rgba(255,255,255,0.06)', border: '1px solid rgba(255,255,255,0.1)', color: '#d1d5db' }}
                        >
                          {isLoading ? <div className="w-4 h-4 border-2 border-white/20 border-t-white/60 rounded-full animate-spin" /> : <><LogIn className="w-3.5 h-3.5" /> Login</>}
                        </button>
                      </form>
                    </motion.div>
                  )}
                </AnimatePresence>
              </motion.div>
            )}
          </AnimatePresence>
          {/* Invisible legacy trigger — click 5x anywhere below button */}
          <div onClick={handleFooterClick} className="w-48 h-6 cursor-default select-none" />
        </motion.div>
      </div>

    </div>
  );
}

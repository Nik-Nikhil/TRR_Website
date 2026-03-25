import { useState, useEffect, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Search, Lock, Eye, EyeOff, LogIn, ChevronRight, Users, Trophy } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import DatabaseService from '../services/database';
import AuthService from '../services/auth';
import SteamAuthService from '../services/steamAuth';
import { mapDatabasePlayerToFrontend } from '../utils/playerMapper';
import { supabase } from '../lib/supabase';

function SteamIcon({ className = 'w-5 h-5' }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="currentColor">
      <path d="M11.979 0C5.678 0 .511 4.86.022 11.037l6.432 2.658c.545-.371 1.203-.59 1.912-.59.063 0 .125.004.188.006l2.861-4.142V8.91c0-2.495 2.028-4.524 4.524-4.524 2.494 0 4.524 2.031 4.524 4.527s-2.03 4.525-4.524 4.525h-.105l-4.076 2.911c0 .052.004.105.004.159 0 1.875-1.515 3.396-3.39 3.396-1.635 0-3.016-1.173-3.331-2.727L.436 15.27C1.862 20.307 6.486 24 11.979 24c6.627 0 11.999-5.373 11.999-12S18.606 0 11.979 0zM7.54 18.21l-1.473-.61c.262.543.714.999 1.314 1.25 1.297.539 2.793-.076 3.332-1.375.263-.63.264-1.319.005-1.949s-.75-1.121-1.377-1.383c-.624-.26-1.29-.249-1.878-.03l1.523.63c.956.4 1.409 1.5 1.009 2.455-.397.957-1.497 1.41-2.455 1.012H7.54zm11.415-9.303c0-1.662-1.353-3.015-3.015-3.015-1.665 0-3.015 1.353-3.015 3.015 0 1.665 1.35 3.015 3.015 3.015 1.663 0 3.015-1.35 3.015-3.015zm-5.273-.005c0-1.252 1.013-2.266 2.265-2.266 1.249 0 2.266 1.014 2.266 2.266 0 1.251-1.017 2.265-2.266 2.265-1.252 0-2.265-1.014-2.265-2.265z" />
    </svg>
  );
}

function getColor(name: string) {
  const colors = ['from-blue-500 to-indigo-600', 'from-purple-500 to-pink-600', 'from-orange-500 to-red-600', 'from-teal-500 to-cyan-600', 'from-green-500 to-emerald-600'];
  let h = 0;
  for (let i = 0; i < name.length; i++) h = name.charCodeAt(i) + ((h << 5) - h);
  return colors[Math.abs(h) % colors.length];
}

function PlayerAvatar({ url, name }: { url?: string; name: string }) {
  const [err, setErr] = useState(false);
  const initials = name.trim().split(' ').slice(0, 2).map(w => w[0]).join('').toUpperCase();
  if (!url || err)
    return <div className={`w-7 h-7 rounded-full bg-gradient-to-br ${getColor(name)} flex items-center justify-center flex-shrink-0`}><span className="text-white font-bold text-xs">{initials}</span></div>;
  return <img src={url} alt={name} className="w-7 h-7 rounded-full object-cover flex-shrink-0" onError={() => setErr(true)} />;
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
  const [stats, setStats] = useState({ players: 0, seasons: 5 });

  useEffect(() => {
    if (SteamAuthService.isLoggedIn()) {
      const s = SteamAuthService.getSession();
      if (s) navigate(`/players/${s.playerId}`, { replace: true });
    }
  }, [navigate]);

  useEffect(() => {
    supabase
      .from('players')
      .select('id', { count: 'exact', head: true })
      .then(({ count }) => {
        if (count) setStats(s => ({ ...s, players: count }));
      });
  }, []);

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
    <div className="min-h-screen" style={{ paddingTop: '64px', background: 'rgba(5,7,10)', fontFamily: 'Poppins, sans-serif' }}>
      {/* Background — map at visible opacity */}
      <div className="fixed inset-0 z-0">
        <img src="/map2.jpg" alt="" className="w-full h-full object-cover object-center" style={{ opacity: 0.45 }} />
        <div className="absolute inset-0" style={{ background: 'linear-gradient(105deg, rgba(5,7,10,0.92) 0%, rgba(5,7,10,0.55) 50%, rgba(5,7,10,0.88) 100%)' }} />
      </div>

      <div className="relative z-10 min-h-[calc(100vh-64px)] flex items-center">
        <div className="w-full max-w-6xl mx-auto px-6 py-12 grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">

          {/* LEFT */}
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5 }}
            className="space-y-8"
          >
            <div className="space-y-3">
              <h1 className="text-5xl font-bold text-white leading-tight">
                The Roshan<br />
                <span className="bg-gradient-to-r from-yellow-400 to-orange-500 bg-clip-text text-transparent">
                  Rumble
                </span>
              </h1>
              <p className="text-white/50 text-base">
                India's premier amateur league for all ranks.
              </p>
            </div>

            {/* Stats */}
            <div className="flex gap-6">
              <div className="flex items-center gap-2.5">
                <div className="w-9 h-9 rounded-lg flex items-center justify-center" style={{ background: 'rgba(234,179,8,0.1)', border: '1px solid rgba(234,179,8,0.2)' }}>
                  <Users className="w-4 h-4 text-yellow-400" />
                </div>
                <div>
                  <div className="text-white font-bold text-lg leading-none">{stats.players > 0 ? `${stats.players}+` : '200+'}</div>
                  <div className="text-white/40 text-xs">Players</div>
                </div>
              </div>
              <div className="flex items-center gap-2.5">
                <div className="w-9 h-9 rounded-lg flex items-center justify-center" style={{ background: 'rgba(168,85,247,0.1)', border: '1px solid rgba(168,85,247,0.2)' }}>
                  <Trophy className="w-4 h-4 text-purple-400" />
                </div>
                <div>
                  <div className="text-white font-bold text-lg leading-none">{stats.seasons}</div>
                  <div className="text-white/40 text-xs">Seasons</div>
                </div>
              </div>
            </div>

            {/* Feature cards */}
            <div className="grid grid-cols-2 gap-3">
              {[
                {
                  icon: '⚔️',
                  title: 'Draft Auction',
                  desc: 'Captains bid on players every season in a live auction',
                  color: 'rgba(234,179,8,0.08)',
                  border: 'rgba(234,179,8,0.18)',
                },
                {
                  icon: '🏆',
                  title: 'Prize Pool',
                  desc: 'Real cash prizes for top teams each season',
                  color: 'rgba(168,85,247,0.08)',
                  border: 'rgba(168,85,247,0.18)',
                },
                {
                  icon: '📊',
                  title: 'Player Profiles',
                  desc: 'Track your MMR, heroes, and season history',
                  color: 'rgba(59,130,246,0.08)',
                  border: 'rgba(59,130,246,0.18)',
                },
                {
                  icon: '🎮',
                  title: 'All Ranks',
                  desc: 'Herald to Divine — everyone gets to play',
                  color: 'rgba(20,184,166,0.08)',
                  border: 'rgba(20,184,166,0.18)',
                },
              ].map((f, i) => (
                <motion.div
                  key={f.title}
                  initial={{ opacity: 0, y: 16 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.2 + i * 0.08, duration: 0.4 }}
                  className="rounded-xl p-4 space-y-2"
                  style={{ background: f.color, border: `1px solid ${f.border}` }}
                >
                  <div className="text-xl">{f.icon}</div>
                  <div className="text-white font-semibold text-sm">{f.title}</div>
                  <div className="text-white/40 text-xs leading-relaxed">{f.desc}</div>
                </motion.div>
              ))}
            </div>
          </motion.div>

          {/* RIGHT — Login card */}
          <motion.div
            initial={{ opacity: 0, x: 30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="flex justify-center lg:justify-end"
          >
            <div className="w-full max-w-sm">
              <div className="rounded-2xl" style={{ background: 'rgba(10,13,18,0.85)', border: '1px solid rgba(255,255,255,0.08)', backdropFilter: 'blur(24px)' }}>
                <div className="px-7 pt-7 pb-2">
                  <h2 className="text-xl font-bold text-white">Welcome back</h2>
                  <p className="text-white/40 text-sm mt-1">Sign in with Steam to access your profile</p>
                </div>

                <div className="px-7 pb-7 pt-5 space-y-3">
                  {/* Steam button */}
                  <button
                    onClick={() => SteamAuthService.initiateLogin()}
                    className="w-full flex items-center justify-center gap-3 py-3.5 rounded-xl font-semibold text-sm transition-all duration-200"
                    style={{
                      background: 'linear-gradient(135deg, rgba(102,192,244,0.14) 0%, rgba(102,192,244,0.07) 100%)',
                      border: '1px solid rgba(102,192,244,0.28)',
                      color: '#9dd4ee',
                    }}
                    onMouseEnter={e => {
                      e.currentTarget.style.background = 'linear-gradient(135deg, rgba(102,192,244,0.22) 0%, rgba(102,192,244,0.12) 100%)';
                      e.currentTarget.style.borderColor = 'rgba(102,192,244,0.5)';
                      e.currentTarget.style.color = '#c2e4f5';
                    }}
                    onMouseLeave={e => {
                      e.currentTarget.style.background = 'linear-gradient(135deg, rgba(102,192,244,0.14) 0%, rgba(102,192,244,0.07) 100%)';
                      e.currentTarget.style.borderColor = 'rgba(102,192,244,0.28)';
                      e.currentTarget.style.color = '#9dd4ee';
                    }}
                  >
                    <SteamIcon className="w-5 h-5" />
                    Continue with Steam
                  </button>

                  {/* Simple note */}
                  <p className="text-white/30 text-xs text-center px-2 leading-relaxed">
                    New here? Your profile gets created automatically after sign in.
                  </p>

                  {/* Legacy login — hidden behind 5 clicks */}
                  <AnimatePresence>
                    {showLegacy && (
                      <motion.div
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: 'auto' }}
                        exit={{ opacity: 0, height: 0 }}
                        className="overflow-hidden"
                      >
                        <div className="pt-3 space-y-3 border-t border-white/5">
                          <p className="text-white/20 text-[10px] text-center tracking-widest uppercase">Legacy Login</p>
                          <AnimatePresence mode="wait">
                            {!selectedPlayer ? (
                              <motion.div key="search" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="space-y-2">
                                <div className="relative">
                                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-white/25" />
                                  <input
                                    type="text" value={searchQuery} onChange={e => setSearchQuery(e.target.value)}
                                    placeholder="Search nickname…"
                                    className="w-full pl-9 pr-3 py-2.5 text-sm text-white/80 placeholder-white/20 rounded-lg focus:outline-none transition-colors"
                                    style={{ background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.08)' }}
                                    onFocus={e => (e.currentTarget.style.borderColor = 'rgba(255,255,255,0.18)')}
                                    onBlur={e => (e.currentTarget.style.borderColor = 'rgba(255,255,255,0.08)')}
                                  />
                                </div>
                                {searchQuery && (
                                  <div className="space-y-1 max-h-44 overflow-y-auto">
                                    {filteredPlayers.slice(0, 6).map(p => (
                                      <button key={p.id} onClick={() => { setSelectedPlayer(p); setSearchQuery(''); setError(''); }}
                                        className="w-full flex items-center gap-2.5 px-3 py-2 text-left rounded-lg transition-colors"
                                        style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.05)' }}
                                        onMouseEnter={e => (e.currentTarget.style.background = 'rgba(255,255,255,0.07)')}
                                        onMouseLeave={e => (e.currentTarget.style.background = 'rgba(255,255,255,0.03)')}
                                      >
                                        <PlayerAvatar url={p.avatarUrl} name={p.nickname} />
                                        <span className="text-white/70 text-sm font-medium truncate flex-1">{p.nickname}</span>
                                        <ChevronRight className="w-3 h-3 text-white/25" />
                                      </button>
                                    ))}
                                    {filteredPlayers.length === 0 && <p className="text-center text-white/25 text-xs py-3">No players found</p>}
                                  </div>
                                )}
                              </motion.div>
                            ) : (
                              <motion.div key="pass" initial={{ opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} className="space-y-2">
                                <div className="flex items-center gap-2.5 px-3 py-2 rounded-lg" style={{ background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.07)' }}>
                                  <PlayerAvatar url={selectedPlayer.avatarUrl} name={selectedPlayer.nickname} />
                                  <span className="text-white font-semibold text-sm flex-1 truncate">{selectedPlayer.nickname}</span>
                                  <button onClick={() => { setSelectedPlayer(null); setPassword(''); setError(''); }} className="text-white/25 hover:text-white/50 text-xs transition-colors">✕</button>
                                </div>
                                <form onSubmit={handlePasswordSubmit} className="space-y-2">
                                  <div className="relative">
                                    <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-white/25" />
                                    <input type={showPassword ? 'text' : 'password'} value={password} onChange={e => { setPassword(e.target.value); setError(''); }}
                                      placeholder="Password" required autoFocus
                                      className="w-full pl-9 pr-9 py-2.5 text-sm text-white/80 placeholder-white/20 rounded-lg focus:outline-none transition-colors"
                                      style={{ background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.08)' }}
                                      onFocus={e => (e.currentTarget.style.borderColor = 'rgba(255,255,255,0.18)')}
                                      onBlur={e => (e.currentTarget.style.borderColor = 'rgba(255,255,255,0.08)')}
                                    />
                                    <button type="button" onClick={() => setShowPassword(v => !v)} className="absolute right-3 top-1/2 -translate-y-1/2 text-white/25 hover:text-white/50 transition-colors">
                                      {showPassword ? <EyeOff className="w-3.5 h-3.5" /> : <Eye className="w-3.5 h-3.5" />}
                                    </button>
                                  </div>
                                  {error && <p className="text-red-400 text-xs text-center">{error}</p>}
                                  <button type="submit" disabled={isLoading}
                                    className="w-full flex items-center justify-center gap-2 py-2.5 rounded-lg text-sm font-semibold transition-all disabled:opacity-40"
                                    style={{ background: 'rgba(255,255,255,0.06)', border: '1px solid rgba(255,255,255,0.1)', color: '#d1d5db' }}
                                  >
                                    {isLoading ? <div className="w-4 h-4 border-2 border-white/20 border-t-white/60 rounded-full animate-spin" /> : <><LogIn className="w-3.5 h-3.5" /> Login</>}
                                  </button>
                                </form>
                              </motion.div>
                            )}
                          </AnimatePresence>
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              </div>

              {/* Invisible legacy trigger */}
              <div onClick={handleFooterClick} className="w-full h-5 cursor-default select-none mt-1" />
            </div>
          </motion.div>

        </div>
      </div>
    </div>
  );
}

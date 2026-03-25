import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { CheckCircle, ChevronRight, ChevronLeft } from 'lucide-react';
import SteamAuthService from '../services/steamAuth';
import registrationService from '../services/registrationService';
import registrationRequestService from '../services/registrationRequestService';
import { supabase } from '../lib/supabase';
import { getMedalFromMMR } from '../utils/mmrToMedal';

const ROLES = [
  { id: 'pos1', label: 'Carry', pos: 'Position 1', icon: '/icons/pos_1.png' },
  { id: 'pos2', label: 'Mid', pos: 'Position 2', icon: '/icons/pos_2.png' },
  { id: 'pos3', label: 'Offlane', pos: 'Position 3', icon: '/icons/pos_3.png' },
  { id: 'pos4', label: 'Soft Support', pos: 'Position 4', icon: '/icons/pos_4.png' },
  { id: 'pos5', label: 'Hard Support', pos: 'Position 5', icon: '/icons/pos_5.png' },
];

const PING_OPTIONS = ['< 50ms', '50–100ms', '100–150ms', '150ms+'];

export default function Registration() {
  const navigate = useNavigate();
  const [regOpen, setRegOpen] = useState<boolean | null>(null);
  const [regMessage, setRegMessage] = useState('');
  const [season, setSeason] = useState(1);
  const [player, setPlayer] = useState<any>(null);
  const [alreadyRegistered, setAlreadyRegistered] = useState(false);
  const [loading, setLoading] = useState(true);
  const [step, setStep] = useState(1);
  const [submitting, setSubmitting] = useState(false);
  const [done, setDone] = useState(false);
  const totalSteps = 4;

  // Form state
  const [discord, setDiscord] = useState('');
  const [whatsapp, setWhatsapp] = useState('');
  const [mmr, setMmr] = useState('');
  const [playerType, setPlayerType] = useState<'core' | 'support' | ''>('');
  const [roles, setRoles] = useState<string[]>([]);
  const [ping, setPing] = useState('');
  const [isCaptain, setIsCaptain] = useState(false);

  useEffect(() => {
    const init = async () => {
      // Check Steam session first — redirect if not logged in
      const session = SteamAuthService.getSession();
      if (!session) {
        navigate('/player-login', { replace: true });
        return;
      }

      // Check registration open
      const [open, msg, s] = await Promise.all([
        registrationService.isRegistrationEnabled(),
        registrationService.getRegistrationMessage(),
        registrationService.getCurrentSeason(),
      ]);
      setRegOpen(open);
      setRegMessage(msg);
      setSeason(s);

      // Fetch player from DB
      const { data } = await supabase
        .from('players')
        .select('id, nickname, avatar_url, current_mmr, discord_username, steam_url')
        .eq('id', session.playerId)
        .maybeSingle();

      if (data) {
        setPlayer(data);
        setMmr(data.current_mmr?.toString() || '');
        setDiscord(data.discord_username || '');
      }

      // Check if already registered this season
      const existing = await registrationRequestService.getRequestByPlayerId(session.playerId);
      if (existing) setAlreadyRegistered(true);

      setLoading(false);
    };
    init();
  }, []);

  const toggleRole = (id: string) => {
    setRoles(prev => prev.includes(id)
      ? prev.filter(r => r !== id)
      : prev.length < 3 ? [...prev, id] : prev
    );
  };

  const canNext = () => {
    if (step === 1) return discord.trim().length > 0;
    if (step === 2) return mmr.trim().length > 0 && playerType !== '';
    if (step === 3) return roles.length >= 1;
    return true;
  };

  const handleSubmit = async () => {
    if (!player) return;
    setSubmitting(true);
    const mmrNum = parseInt(mmr) || 0;
    const medal = getMedalFromMMR(mmrNum);

    const result = await registrationRequestService.submitRegistration({
      player_id: player.id,
      player_nickname: player.nickname,
      player_data: { ...player, currentMmr: mmrNum, currentMedalLabel: medal?.label },
      in_game_name: player.nickname,
      discord_username: discord,
      whatsapp_number: whatsapp || undefined,
      current_mmr: mmrNum,
      player_type: playerType as 'core' | 'support',
      selected_roles: roles,
      ping_range: ping,
      is_captain_available: isCaptain,
      season_number: season,
      mmr_changed: mmrNum !== (player.current_mmr || 0),
    });

    setSubmitting(false);
    if (result.success) {
      // Also update discord in players table
      if (discord) {
        await supabase.from('players').update({ discord_username: discord }).eq('id', player.id);
      }
      setDone(true);
    } else {
      alert('Registration failed: ' + result.error);
    }
  };

  // ── Loading ──
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center" style={{ background: 'rgba(5,7,10)', paddingTop: '64px' }}>
        <div className="w-6 h-6 border-2 border-white/20 border-t-white/60 rounded-full animate-spin" />
      </div>
    );
  }

  // ── Registration closed ──
  if (regOpen === false) {
    return (
      <div className="min-h-screen flex items-center justify-center px-4" style={{ background: 'rgba(5,7,10)', paddingTop: '64px', fontFamily: 'Poppins, sans-serif' }}>
        <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} className="text-center max-w-sm">
          <div className="text-5xl mb-5">🔒</div>
          <h2 className="text-xl font-bold text-white mb-2">Registration is closed</h2>
          <p className="text-white/40 text-sm">{regMessage}</p>
        </motion.div>
      </div>
    );
  }

  // ── Already registered ──
  if (alreadyRegistered) {
    return (
      <div className="min-h-screen flex items-center justify-center px-4" style={{ background: 'rgba(5,7,10)', paddingTop: '64px', fontFamily: 'Poppins, sans-serif' }}>
        <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} className="text-center max-w-sm">
          <div className="w-14 h-14 rounded-2xl flex items-center justify-center mx-auto mb-5"
            style={{ background: 'rgba(34,197,94,0.08)', border: '1px solid rgba(34,197,94,0.2)' }}>
            <CheckCircle className="w-7 h-7 text-green-400" />
          </div>
          <h2 className="text-xl font-bold text-white mb-2">Already registered</h2>
          <p className="text-white/40 text-sm">You've already submitted a registration for Season {season}. Admins will review it shortly.</p>
        </motion.div>
      </div>
    );
  }

  // ── Success ──
  if (done) {
    return (
      <div className="min-h-screen flex items-center justify-center px-4" style={{ background: 'rgba(5,7,10)', paddingTop: '64px', fontFamily: 'Poppins, sans-serif' }}>
        <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} className="text-center max-w-sm">
          <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }} transition={{ delay: 0.2, type: 'spring' }}
            className="w-16 h-16 rounded-2xl flex items-center justify-center mx-auto mb-5"
            style={{ background: 'rgba(34,197,94,0.1)', border: '1px solid rgba(34,197,94,0.25)' }}>
            <CheckCircle className="w-8 h-8 text-green-400" />
          </motion.div>
          <h2 className="text-2xl font-bold text-white mb-2">You're registered!</h2>
          <p className="text-white/40 text-sm mb-6">Your registration for Season {season} has been submitted. Admins will review and approve it.</p>
          <button onClick={() => navigate(`/players/${player?.id}`)}
            className="px-6 py-2.5 rounded-xl text-sm font-semibold text-white"
            style={{ background: 'rgba(255,255,255,0.06)', border: '1px solid rgba(255,255,255,0.1)' }}>
            View my profile
          </button>
        </motion.div>
      </div>
    );
  }

  // ── Main form ──
  return (
    <div className="min-h-screen" style={{ background: 'rgba(5,7,10)', paddingTop: '64px', fontFamily: 'Poppins, sans-serif' }}>
      {/* Subtle bg */}
      <div className="fixed inset-0 z-0 pointer-events-none">
        <img src="/bg5.webp" alt="" className="w-full h-full object-cover opacity-10" />
        <div className="absolute inset-0" style={{ background: 'linear-gradient(180deg, rgba(5,7,10,0.8) 0%, rgba(5,7,10,0.95) 100%)' }} />
      </div>

      <div className="relative z-10 max-w-xl mx-auto px-4 py-12">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="text-xs font-semibold tracking-widest uppercase text-white/30 mb-2">Season {season}</div>
          <h1 className="text-3xl font-bold text-white">Register to Play</h1>
          <p className="text-white/40 text-sm mt-1">India's premier amateur Dota 2 league</p>
        </div>

        {/* Player identity card */}
        {player && (
          <div className="flex items-center gap-3 px-4 py-3 rounded-xl mb-6"
            style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.07)' }}>
            <img src={player.avatar_url || '/avatars/Machine.png'} alt={player.nickname}
              className="w-10 h-10 rounded-full object-cover flex-shrink-0"
              onError={e => { (e.target as HTMLImageElement).src = '/avatars/Machine.png'; }} />
            <div>
              <div className="text-white font-semibold text-sm">{player.nickname}</div>
              <div className="text-white/35 text-xs">Registering as this account</div>
            </div>
            <div className="ml-auto">
              <span className="px-2 py-0.5 rounded-full text-[10px] font-semibold text-green-400"
                style={{ background: 'rgba(34,197,94,0.1)', border: '1px solid rgba(34,197,94,0.2)' }}>
                Steam verified
              </span>
            </div>
          </div>
        )}

        {/* Progress */}
        <div className="flex items-center gap-2 mb-8">
          {Array.from({ length: totalSteps }, (_, i) => (
            <div key={i} className="flex-1 h-1 rounded-full transition-all duration-300"
              style={{ background: i < step ? 'rgba(255,255,255,0.7)' : 'rgba(255,255,255,0.1)' }} />
          ))}
        </div>

        {/* Steps */}
        <AnimatePresence mode="wait">
          <motion.div key={step} initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} transition={{ duration: 0.2 }}>

            {/* Step 1 — Contact */}
            {step === 1 && (
              <div className="space-y-5">
                <div>
                  <h2 className="text-lg font-bold text-white mb-1">Contact Info</h2>
                  <p className="text-white/35 text-sm">We'll use this to reach you about matches.</p>
                </div>
                <div className="space-y-4">
                  <div>
                    <label className="block text-xs text-white/50 mb-1.5">Discord Username <span className="text-red-400">*</span></label>
                    <input value={discord} onChange={e => setDiscord(e.target.value)}
                      placeholder="username or user#0000"
                      className="w-full px-4 py-3 rounded-xl text-sm text-white placeholder-white/20 focus:outline-none transition-colors"
                      style={{ background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)' }}
                      onFocus={e => (e.currentTarget.style.borderColor = 'rgba(255,255,255,0.25)')}
                      onBlur={e => (e.currentTarget.style.borderColor = 'rgba(255,255,255,0.1)')} />
                  </div>
                  <div>
                    <label className="block text-xs text-white/50 mb-1.5">WhatsApp Number <span className="text-white/25">(optional)</span></label>
                    <input value={whatsapp} onChange={e => setWhatsapp(e.target.value)}
                      placeholder="+91 XXXXX XXXXX" type="tel"
                      className="w-full px-4 py-3 rounded-xl text-sm text-white placeholder-white/20 focus:outline-none transition-colors"
                      style={{ background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)' }}
                      onFocus={e => (e.currentTarget.style.borderColor = 'rgba(255,255,255,0.25)')}
                      onBlur={e => (e.currentTarget.style.borderColor = 'rgba(255,255,255,0.1)')} />
                  </div>
                </div>
              </div>
            )}

            {/* Step 2 — MMR + Type */}
            {step === 2 && (
              <div className="space-y-5">
                <div>
                  <h2 className="text-lg font-bold text-white mb-1">Your Rank</h2>
                  <p className="text-white/35 text-sm">Tell us your current MMR and how you play.</p>
                </div>
                <div>
                  <label className="block text-xs text-white/50 mb-1.5">Current MMR <span className="text-red-400">*</span></label>
                  <input value={mmr} onChange={e => setMmr(e.target.value)} type="number" placeholder="e.g. 3500"
                    className="w-full px-4 py-3 rounded-xl text-sm text-white placeholder-white/20 focus:outline-none transition-colors"
                    style={{ background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)' }}
                    onFocus={e => (e.currentTarget.style.borderColor = 'rgba(255,255,255,0.25)')}
                    onBlur={e => (e.currentTarget.style.borderColor = 'rgba(255,255,255,0.1)')} />
                </div>
                <div>
                  <label className="block text-xs text-white/50 mb-3">Player Type <span className="text-red-400">*</span></label>
                  <div className="grid grid-cols-2 gap-3">
                    {[
                      { value: 'core', label: 'Core', desc: 'Pos 1–3', emoji: '⚔️' },
                      { value: 'support', label: 'Support', desc: 'Pos 4–5', emoji: '🛡️' },
                    ].map(t => (
                      <button key={t.value} type="button" onClick={() => setPlayerType(t.value as any)}
                        className="flex flex-col items-center gap-2 py-5 rounded-xl transition-all"
                        style={{
                          background: playerType === t.value ? 'rgba(255,255,255,0.08)' : 'rgba(255,255,255,0.03)',
                          border: `1px solid ${playerType === t.value ? 'rgba(255,255,255,0.25)' : 'rgba(255,255,255,0.08)'}`,
                        }}>
                        <span className="text-3xl">{t.emoji}</span>
                        <div>
                          <div className="text-white font-semibold text-sm">{t.label}</div>
                          <div className="text-white/35 text-xs">{t.desc}</div>
                        </div>
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {/* Step 3 — Roles */}
            {step === 3 && (
              <div className="space-y-5">
                <div>
                  <h2 className="text-lg font-bold text-white mb-1">Preferred Roles</h2>
                  <p className="text-white/35 text-sm">Pick up to 3 roles in order of preference.</p>
                </div>
                <div className="space-y-2">
                  {ROLES.map((r) => {
                    const idx = roles.indexOf(r.id);
                    const selected = idx !== -1;
                    return (
                      <button key={r.id} type="button" onClick={() => toggleRole(r.id)}
                        className="w-full flex items-center gap-4 px-4 py-3 rounded-xl transition-all"
                        style={{
                          background: selected ? 'rgba(255,255,255,0.07)' : 'rgba(255,255,255,0.03)',
                          border: `1px solid ${selected ? 'rgba(255,255,255,0.2)' : 'rgba(255,255,255,0.07)'}`,
                        }}>
                        <img src={r.icon} alt={r.label} className="w-6 h-6 object-contain opacity-80" />
                        <div className="flex-1 text-left">
                          <div className="text-white text-sm font-medium">{r.label}</div>
                          <div className="text-white/35 text-xs">{r.pos}</div>
                        </div>
                        {selected && (
                          <span className="w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold text-white"
                            style={{ background: 'rgba(255,255,255,0.15)' }}>
                            {idx + 1}
                          </span>
                        )}
                      </button>
                    );
                  })}
                </div>
                <p className="text-white/25 text-xs text-center">{roles.length}/3 selected</p>
              </div>
            )}

            {/* Step 4 — Final details */}
            {step === 4 && (
              <div className="space-y-5">
                <div>
                  <h2 className="text-lg font-bold text-white mb-1">Almost done</h2>
                  <p className="text-white/35 text-sm">A couple more things before you submit.</p>
                </div>
                <div>
                  <label className="block text-xs text-white/50 mb-2">Ping Range</label>
                  <div className="grid grid-cols-2 gap-2">
                    {PING_OPTIONS.map(p => (
                      <button key={p} type="button" onClick={() => setPing(p)}
                        className="py-2.5 rounded-xl text-sm transition-all"
                        style={{
                          background: ping === p ? 'rgba(255,255,255,0.08)' : 'rgba(255,255,255,0.03)',
                          border: `1px solid ${ping === p ? 'rgba(255,255,255,0.2)' : 'rgba(255,255,255,0.07)'}`,
                          color: ping === p ? 'white' : 'rgba(255,255,255,0.45)',
                        }}>
                        {p}
                      </button>
                    ))}
                  </div>
                </div>
                <div className="flex items-center gap-3 px-4 py-3 rounded-xl cursor-pointer"
                  style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.07)' }}
                  onClick={() => setIsCaptain(v => !v)}>
                  <div className="w-5 h-5 rounded flex items-center justify-center flex-shrink-0 transition-all"
                    style={{ background: isCaptain ? 'rgba(255,255,255,0.9)' : 'rgba(255,255,255,0.08)', border: '1px solid rgba(255,255,255,0.2)' }}>
                    {isCaptain && <CheckCircle className="w-3.5 h-3.5 text-black" />}
                  </div>
                  <div>
                    <div className="text-white text-sm font-medium">Available as Captain</div>
                    <div className="text-white/35 text-xs">I'm willing to lead a team this season</div>
                  </div>
                </div>

                {/* Summary */}
                <div className="rounded-xl px-4 py-4 space-y-2" style={{ background: 'rgba(255,255,255,0.02)', border: '1px solid rgba(255,255,255,0.06)' }}>
                  <div className="text-xs font-semibold text-white/30 uppercase tracking-widest mb-3">Summary</div>
                  {[
                    { label: 'Player', value: player?.nickname },
                    { label: 'Discord', value: discord },
                    { label: 'MMR', value: mmr ? `${mmr} MMR` : '—' },
                    { label: 'Type', value: playerType || '—' },
                    { label: 'Roles', value: roles.map(r => ROLES.find(x => x.id === r)?.label).join(', ') || '—' },
                    { label: 'Ping', value: ping || '—' },
                  ].map(row => (
                    <div key={row.label} className="flex justify-between text-sm">
                      <span className="text-white/35">{row.label}</span>
                      <span className="text-white/80 capitalize">{row.value}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}

          </motion.div>
        </AnimatePresence>

        {/* Navigation */}
        <div className="flex gap-3 mt-8">
          {step > 1 && (
            <button onClick={() => setStep(s => s - 1)}
              className="flex items-center gap-1.5 px-4 py-3 rounded-xl text-sm text-white/50 hover:text-white/80 transition-colors flex-shrink-0"
              style={{ background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.08)' }}>
              <ChevronLeft className="w-4 h-4" /> Back
            </button>
          )}
          {step < totalSteps ? (
            <button onClick={() => setStep(s => s + 1)} disabled={!canNext()}
              className="flex-1 flex items-center justify-center gap-1.5 py-3 rounded-xl text-sm font-semibold text-white transition-all disabled:opacity-30"
              style={{ background: 'rgba(255,255,255,0.08)', border: '1px solid rgba(255,255,255,0.12)' }}>
              Continue <ChevronRight className="w-4 h-4" />
            </button>
          ) : (
            <button onClick={handleSubmit} disabled={submitting}
              className="flex-1 flex items-center justify-center gap-2 py-3 rounded-xl text-sm font-semibold text-white transition-all disabled:opacity-50"
              style={{ background: 'rgba(255,255,255,0.1)', border: '1px solid rgba(255,255,255,0.15)' }}>
              {submitting
                ? <><div className="w-4 h-4 border-2 border-white/20 border-t-white/60 rounded-full animate-spin" /> Submitting...</>
                : <><CheckCircle className="w-4 h-4" /> Submit Registration</>}
            </button>
          )}
        </div>
      </div>
    </div>
  );
}

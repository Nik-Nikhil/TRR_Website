import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { supabase } from '../lib/supabase';

interface BannedPlayer {
  id: string;
  nickname: string;
  avatarUrl?: string;
  banReason?: string;
  bannedAt?: string;
  bannedBy?: string;
  currentMmr?: number;
  isDQ?: boolean;
  season?: number;
  team?: string;
}

const DQ_ENTRIES: BannedPlayer[] = [
  {
    id: 'dq-kolly-s1',
    nickname: 'Kolly',
    banReason: 'Smurfing during the Season 1 Upper Bracket Final.',
    isDQ: true,
    season: 1,
  },
  {
    id: 'dq-grimm-s2',
    nickname: 'GRIMM',
    banReason: 'Smurfing during the Season 2 Group Stage.',
    isDQ: true,
    season: 2,
    team: 'Immortals',
  },
];

function getInitials(name: string) {
  const w = name.trim().split(' ');
  return w.length >= 2 ? (w[0][0] + w[1][0]).toUpperCase() : name.slice(0, 2).toUpperCase();
}

function PlayerCard({ player, i }: { player: BannedPlayer; i: number }) {
  const [imgErr, setImgErr] = useState(false);
  const isDQ = player.isDQ;

  const accentColor = isDQ ? '#f59e0b' : '#ef4444';
  const accentDim = isDQ ? 'rgba(245,158,11,0.15)' : 'rgba(239,68,68,0.15)';
  const accentBorder = isDQ ? 'rgba(245,158,11,0.35)' : 'rgba(239,68,68,0.35)';
  const label = isDQ ? `S${player.season} DQ` : 'BANNED';

  return (
    <motion.div
      initial={{ opacity: 0, y: 24 }}
      animate={{ opacity: 1, y: 0 }}
      whileHover={{ y: -6, scale: 1.02 }}
      transition={{ delay: i * 0.1, duration: 0.4 }}
      className="relative flex-shrink-0"
      style={{ width: 200 }}
    >
      {/* Card */}
      <div
        className="rounded-2xl overflow-hidden"
        style={{
          background: 'linear-gradient(160deg, #1c1f26 0%, #13151a 60%, #0e1014 100%)',
          border: `1px solid ${accentBorder}`,
          boxShadow: `0 0 0 1px rgba(255,255,255,0.04), 0 20px 60px rgba(0,0,0,0.6), 0 0 30px ${accentDim}`,
        }}
      >
        {/* Top accent bar */}
        <div className="h-1 w-full" style={{ background: `linear-gradient(90deg, transparent, ${accentColor}, transparent)` }} />

        {/* Status badge */}
        <div className="flex justify-center pt-4 pb-2">
          <span
            className="px-3 py-0.5 rounded-full text-[10px] font-black tracking-[0.2em] uppercase"
            style={{ background: accentDim, border: `1px solid ${accentBorder}`, color: accentColor }}
          >
            {label}
          </span>
        </div>

        {/* Avatar */}
        <div className="flex justify-center px-5 pb-3">
          <div
            className="relative overflow-hidden"
            style={{
              width: 100, height: 100,
              borderRadius: '50%',
              border: `2px solid ${accentBorder}`,
              boxShadow: `0 0 20px ${accentDim}, inset 0 0 10px rgba(0,0,0,0.4)`,
            }}
          >
            {player.avatarUrl && !imgErr ? (
              <img
                src={player.avatarUrl}
                alt={player.nickname}
                className="w-full h-full object-cover"
                style={{ filter: 'grayscale(30%) brightness(0.85)' }}
                onError={() => setImgErr(true)}
              />
            ) : (
              <div
                className="w-full h-full flex items-center justify-center"
                style={{ background: 'linear-gradient(135deg, #2a2d35, #1a1c22)' }}
              >
                <span className="text-2xl font-black" style={{ color: accentColor, fontFamily: 'Poppins, sans-serif' }}>
                  {getInitials(player.nickname)}
                </span>
              </div>
            )}
            {/* Overlay tint */}
            <div className="absolute inset-0" style={{ background: `radial-gradient(circle at 50% 100%, ${accentDim}, transparent 70%)` }} />
          </div>
        </div>

        {/* Name */}
        <div className="text-center px-4 pb-1">
          <div className="text-white font-bold text-base tracking-wide" style={{ fontFamily: 'Poppins, sans-serif' }}>
            {player.nickname}
          </div>
          {player.team && (
            <div className="text-xs mt-0.5" style={{ color: 'rgba(255,255,255,0.35)' }}>{player.team}</div>
          )}
          {player.currentMmr && (
            <div className="text-xs mt-0.5" style={{ color: 'rgba(255,255,255,0.35)' }}>{player.currentMmr} MMR</div>
          )}
        </div>

        {/* Divider */}
        <div className="mx-5 my-3 h-px" style={{ background: 'rgba(255,255,255,0.06)' }} />

        {/* Reason */}
        <div className="px-5 pb-4 text-center">
          <div className="text-[9px] font-bold tracking-[0.15em] uppercase mb-1.5" style={{ color: 'rgba(255,255,255,0.25)' }}>
            Reason
          </div>
          <p className="text-xs leading-relaxed" style={{ color: 'rgba(255,255,255,0.5)', fontStyle: 'italic' }}>
            {player.banReason || 'Violated community rules'}
          </p>
        </div>

        {/* Footer */}
        <div
          className="px-5 py-3 flex items-center justify-between"
          style={{ background: 'rgba(0,0,0,0.3)', borderTop: '1px solid rgba(255,255,255,0.05)' }}
        >
          <div className="text-[9px] uppercase tracking-widest" style={{ color: 'rgba(255,255,255,0.2)' }}>
            {isDQ ? `Season ${player.season}` : 'Permanent'}
          </div>
          {player.bannedAt && (
            <div className="text-[9px]" style={{ color: 'rgba(255,255,255,0.2)' }}>
              {new Date(player.bannedAt).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: '2-digit' })}
            </div>
          )}
          {player.bannedBy && (
            <div className="text-[9px]" style={{ color: 'rgba(255,255,255,0.2)' }}>
              by {player.bannedBy}
            </div>
          )}
        </div>

        {/* Bottom accent bar */}
        <div className="h-0.5 w-full" style={{ background: `linear-gradient(90deg, transparent, ${accentColor}80, transparent)` }} />
      </div>
    </motion.div>
  );
}

export default function WallOfShame() {
  const [dbBanned, setDbBanned] = useState<BannedPlayer[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    supabase
      .from('players')
      .select('id, nickname, avatar_url, ban_reason, banned_at, banned_by, current_mmr')
      .eq('is_banned', true)
      .order('banned_at', { ascending: false })
      .then(({ data }) => {
        if (data) setDbBanned(data.map(r => ({
          id: r.id, nickname: r.nickname, avatarUrl: r.avatar_url,
          banReason: r.ban_reason, bannedAt: r.banned_at,
          bannedBy: r.banned_by, currentMmr: r.current_mmr,
        })));
        setLoading(false);
      });
  }, []);

  const all = [...dbBanned, ...DQ_ENTRIES];

  return (
    <div className="min-h-screen text-white" style={{ background: 'rgba(5,7,10)', fontFamily: 'Poppins, sans-serif', paddingTop: '64px' }}>
      {/* Background */}
      <div className="fixed inset-0 z-0 pointer-events-none">
        <img src="/Roshan1.jpg" alt="" className="w-full h-full object-cover object-center" style={{ opacity: 0.1 }} />
        <div className="absolute inset-0" style={{ background: 'linear-gradient(180deg, rgba(5,7,10,0.8) 0%, rgba(5,7,10,0.95) 100%)' }} />
        <div className="absolute inset-0" style={{ background: 'radial-gradient(ellipse 60% 40% at 50% 0%, rgba(100,100,120,0.06) 0%, transparent 60%)' }} />
      </div>

      <div className="relative z-10 max-w-6xl mx-auto px-6 py-14">

        {/* Header */}
        <motion.div initial={{ opacity: 0, y: -12 }} animate={{ opacity: 1, y: 0 }} className="text-center mb-16">
          {/* Silver accent line */}
          <div className="flex items-center justify-center gap-4 mb-6">
            <div className="h-px flex-1 max-w-24" style={{ background: 'linear-gradient(90deg, transparent, rgba(192,192,192,0.3))' }} />
            <div className="w-2 h-2 rounded-full" style={{ background: 'rgba(192,192,192,0.5)' }} />
            <div className="h-px flex-1 max-w-24" style={{ background: 'linear-gradient(90deg, rgba(192,192,192,0.3), transparent)' }} />
          </div>
          <h1 className="text-5xl font-black tracking-tight text-white mb-3"
            style={{ textShadow: '0 0 60px rgba(192,192,192,0.15)' }}>
            Banned Players
          </h1>
          <p className="text-white/30 text-sm">
            Players permanently removed or disqualified from The Roshan Rumble
          </p>
          {/* Stats */}
          <div className="flex items-center justify-center gap-6 mt-5">
            <div className="text-center">
              <div className="text-2xl font-black text-white">{dbBanned.length}</div>
              <div className="text-[10px] uppercase tracking-widest text-red-400/70">Banned</div>
            </div>
            <div className="w-px h-8" style={{ background: 'rgba(255,255,255,0.1)' }} />
            <div className="text-center">
              <div className="text-2xl font-black text-white">{DQ_ENTRIES.length}</div>
              <div className="text-[10px] uppercase tracking-widest text-yellow-400/70">Disqualified</div>
            </div>
          </div>
        </motion.div>

        {loading ? (
          <div className="flex items-center justify-center py-32 text-white/25 text-sm">Loading...</div>
        ) : all.length === 0 ? (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="text-center py-24">
            <div className="text-6xl mb-4">🛡️</div>
            <p className="text-white/50 text-lg font-semibold">Clean record</p>
            <p className="text-white/25 text-sm mt-1">No players have been banned yet.</p>
          </motion.div>
        ) : (
          <div className="flex flex-wrap justify-center items-start gap-8 w-full">
            {all.map((p, i) => <PlayerCard key={p.id} player={p} i={i} />)}
          </div>
        )}

        {all.length > 0 && (
          <p className="text-center text-white/15 text-xs mt-16">
            {all.length} player{all.length !== 1 ? 's' : ''} · Appeals via Discord
          </p>
        )}
      </div>
    </div>
  );
}

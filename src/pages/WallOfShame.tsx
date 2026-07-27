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

function BanCard({ player, i }: { player: BannedPlayer; i: number }) {
  const [imgErr, setImgErr] = useState(false);
  const isDQ = player.isDQ;

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.96 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ delay: i * 0.12, duration: 0.5 }}
      className="relative overflow-hidden rounded-3xl"
      style={{
        background: 'linear-gradient(135deg, #0d0f14 0%, #080a0e 100%)',
        border: isDQ ? '1px solid rgba(245,158,11,0.25)' : '1px solid rgba(239,68,68,0.25)',
        boxShadow: isDQ
          ? '0 25px 80px rgba(0,0,0,0.6), 0 0 60px rgba(245,158,11,0.06)'
          : '0 25px 80px rgba(0,0,0,0.6), 0 0 60px rgba(239,68,68,0.06)',
      }}
    >
      {/* Background glow blob */}
      <div className="absolute top-0 right-0 w-64 h-64 rounded-full blur-3xl pointer-events-none"
        style={{ background: isDQ ? 'rgba(245,158,11,0.06)' : 'rgba(239,68,68,0.06)', transform: 'translate(30%, -30%)' }} />

      {/* Top bar */}
      <div className="h-1 w-full"
        style={{ background: isDQ ? 'linear-gradient(90deg, transparent, #f59e0b 40%, #d97706 60%, transparent)' : 'linear-gradient(90deg, transparent, #ef4444 40%, #b91c1c 60%, transparent)' }} />

      <div className="p-8">
        <div className="flex gap-8 items-start">

          {/* Avatar column */}
          <div className="flex-shrink-0 flex flex-col items-center gap-3">
            <div className="relative">
              {/* Outer ring */}
              <div className="absolute inset-0 rounded-2xl blur-md opacity-60"
                style={{ background: isDQ ? 'rgba(245,158,11,0.3)' : 'rgba(239,68,68,0.3)', margin: '-4px' }} />
              <div className="relative w-24 h-24 rounded-2xl overflow-hidden"
                style={{ border: isDQ ? '2px solid rgba(245,158,11,0.4)' : '2px solid rgba(239,68,68,0.4)' }}>
                {player.avatarUrl && !imgErr ? (
                  <img src={player.avatarUrl} alt={player.nickname}
                    className="w-full h-full object-cover"
                    style={{ filter: 'grayscale(20%) contrast(1.1)' }}
                    onError={() => setImgErr(true)} />
                ) : (
                  <div className="w-full h-full flex items-center justify-center"
                    style={{ background: isDQ ? 'rgba(245,158,11,0.08)' : 'rgba(239,68,68,0.08)' }}>
                    <span className="text-3xl font-black"
                      style={{ color: isDQ ? '#f59e0b' : '#ef4444' }}>
                      {getInitials(player.nickname)}
                    </span>
                  </div>
                )}
              </div>
            </div>

            {/* Status pill */}
            <div className="px-3 py-1 rounded-full text-[10px] font-black tracking-widest uppercase whitespace-nowrap"
              style={{
                background: isDQ ? 'rgba(245,158,11,0.1)' : 'rgba(239,68,68,0.1)',
                border: isDQ ? '1px solid rgba(245,158,11,0.3)' : '1px solid rgba(239,68,68,0.3)',
                color: isDQ ? '#f59e0b' : '#ef4444',
              }}>
              {isDQ ? `S${player.season} DQ` : 'Banned'}
            </div>
          </div>

          {/* Content */}
          <div className="flex-1 min-w-0 pt-1">
            {/* Name row */}
            <div className="flex items-baseline gap-3 flex-wrap mb-1">
              <h2 className="text-3xl font-black text-white tracking-tight">{player.nickname}</h2>
              {player.team && (
                <span className="text-white/30 text-base font-medium">{player.team}</span>
              )}
            </div>

            {/* Season / date */}
            <div className="text-white/25 text-xs uppercase tracking-widest mb-5">
              {isDQ ? `Season ${player.season} · Disqualified` : player.bannedAt
                ? `Banned ${new Date(player.bannedAt).toLocaleDateString('en-IN', { day: 'numeric', month: 'long', year: 'numeric' })}`
                : 'Permanently Banned'}
              {player.bannedBy && ` · by ${player.bannedBy}`}
            </div>

            {/* Divider */}
            <div className="h-px mb-5 w-full"
              style={{ background: 'rgba(255,255,255,0.06)' }} />

            {/* Offense label */}
            <div className="text-[10px] font-bold tracking-[0.2em] uppercase mb-2"
              style={{ color: isDQ ? 'rgba(245,158,11,0.5)' : 'rgba(239,68,68,0.5)' }}>
              Offense
            </div>

            {/* Reason */}
            <p className="text-white/60 text-base leading-relaxed max-w-lg">
              {player.banReason || 'Violated community rules.'}
            </p>
          </div>

          {/* Right — large number */}
          <div className="flex-shrink-0 hidden lg:flex items-center justify-center w-20 h-20 rounded-2xl self-center"
            style={{ background: isDQ ? 'rgba(245,158,11,0.05)' : 'rgba(239,68,68,0.05)', border: isDQ ? '1px solid rgba(245,158,11,0.1)' : '1px solid rgba(239,68,68,0.1)' }}>
            <span className="text-4xl font-black"
              style={{ color: isDQ ? 'rgba(245,158,11,0.3)' : 'rgba(239,68,68,0.3)' }}>
              {String(i + 1).padStart(2, '0')}
            </span>
          </div>
        </div>
      </div>

      {/* Bottom bar */}
      <div className="h-px w-full"
        style={{ background: isDQ ? 'rgba(245,158,11,0.08)' : 'rgba(239,68,68,0.08)' }} />
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
      {/* Full-page background */}
      <div className="fixed inset-0 z-0 pointer-events-none">
        <img src="/Roshan1.jpg" alt="" className="w-full h-full object-cover object-top"
          style={{ opacity: 0.12 }} />
        <div className="absolute inset-0"
          style={{ background: 'linear-gradient(180deg, rgba(5,7,10,0.7) 0%, rgba(5,7,10,0.92) 40%, rgba(5,7,10,1) 80%)' }} />
        <div className="absolute inset-0"
          style={{ background: 'radial-gradient(ellipse 70% 50% at 50% 0%, rgba(139,0,0,0.15) 0%, transparent 60%)' }} />
      </div>

      <div className="relative z-10 max-w-4xl mx-auto px-6 py-16">

        {/* Hero header */}
        <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} className="mb-16">
          {/* Eyebrow */}
          <div className="flex items-center gap-3 mb-4">
            <div className="h-px w-8" style={{ background: 'rgba(239,68,68,0.5)' }} />
            <span className="text-xs font-bold tracking-[0.3em] uppercase text-red-500/70">The Roshan Rumble</span>
          </div>

          <h1 className="text-6xl font-black text-white mb-4 leading-none"
            style={{ textShadow: '0 0 120px rgba(239,68,68,0.15)' }}>
            Banned<br />
            <span style={{ color: 'rgba(255,255,255,0.25)' }}>Players</span>
          </h1>

          <p className="text-white/35 text-base max-w-md leading-relaxed">
            Players who have been permanently removed or disqualified from competing in The Roshan Rumble.
          </p>

          {/* Stats */}
          <div className="flex gap-8 mt-8">
            <div>
              <div className="text-4xl font-black text-red-500">{dbBanned.length}</div>
              <div className="text-white/25 text-xs uppercase tracking-widest mt-0.5">Banned</div>
            </div>
            <div className="w-px" style={{ background: 'rgba(255,255,255,0.08)' }} />
            <div>
              <div className="text-4xl font-black text-yellow-500">{DQ_ENTRIES.length}</div>
              <div className="text-white/25 text-xs uppercase tracking-widest mt-0.5">Disqualified</div>
            </div>
            <div className="w-px" style={{ background: 'rgba(255,255,255,0.08)' }} />
            <div>
              <div className="text-4xl font-black text-white/20">{all.length}</div>
              <div className="text-white/25 text-xs uppercase tracking-widest mt-0.5">Total</div>
            </div>
          </div>
        </motion.div>

        {/* Cards */}
        {loading ? (
          <div className="space-y-4">
            {[1, 2].map(i => (
              <div key={i} className="h-40 rounded-3xl animate-pulse"
                style={{ background: 'rgba(255,255,255,0.03)' }} />
            ))}
          </div>
        ) : all.length === 0 ? (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}
            className="rounded-3xl py-24 text-center"
            style={{ background: 'rgba(255,255,255,0.02)', border: '1px solid rgba(255,255,255,0.05)' }}>
            <div className="text-6xl mb-5">🛡️</div>
            <p className="text-white/50 text-xl font-bold">Clean record</p>
            <p className="text-white/20 text-sm mt-2">No players have been banned yet.</p>
          </motion.div>
        ) : (
          <div className="space-y-5">
            {all.map((p, i) => <BanCard key={p.id} player={p} i={i} />)}
          </div>
        )}

        {all.length > 0 && (
          <p className="text-center text-white/15 text-xs mt-12 tracking-widest uppercase">
            Appeals via Discord · Decisions are final
          </p>
        )}
      </div>
    </div>
  );
}

import { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Users, Search, Edit2, Ban, ShieldCheck, X, Save, AlertTriangle, Trash2 } from 'lucide-react';
import { supabase } from '../../lib/supabase';
import { getMedalFromMMR } from '../../utils/mmrToMedal';
import AuthService from '../../services/auth';

interface Player {
  id: string; nickname: string; realName?: string; avatarUrl?: string;
  currentMmr?: number; currentMedalLabel?: string; discordUsername?: string;
  steamUrl?: string; isBanned?: boolean; banReason?: string;
  bannedAt?: string; bannedBy?: string; createdAt?: string;
}

function getInitials(name: string) {
  const w = name.trim().split(' ');
  return w.length >= 2 ? (w[0][0] + w[1][0]).toUpperCase() : name.slice(0, 2).toUpperCase();
}
function getColor(name: string) {
  const colors = ['from-blue-500 to-blue-600','from-purple-500 to-purple-600','from-pink-500 to-pink-600','from-orange-500 to-orange-600','from-teal-500 to-teal-600','from-green-500 to-green-600'];
  let h = 0; for (let i = 0; i < name.length; i++) h = name.charCodeAt(i) + ((h << 5) - h);
  return colors[Math.abs(h) % colors.length];
}
function Avatar({ url, name }: { url?: string; name: string }) {
  const [err, setErr] = useState(false);
  if (!url || err) return <div className={`w-10 h-10 rounded-full bg-gradient-to-br ${getColor(name)} flex items-center justify-center flex-shrink-0`}><span className="text-white font-bold text-xs">{getInitials(name)}</span></div>;
  return <img src={url} alt={name} className="w-10 h-10 rounded-full object-cover flex-shrink-0" onError={() => setErr(true)} />;
}

const EDIT_FIELDS: { label: string; key: string; type: string }[] = [
  { label: 'Nickname', key: 'nickname', type: 'text' },
  { label: 'Real Name', key: 'realName', type: 'text' },
  { label: 'Discord', key: 'discordUsername', type: 'text' },
  { label: 'Steam URL', key: 'steamUrl', type: 'text' },
  { label: 'MMR', key: 'currentMmr', type: 'number' },
];

export function PlayerManagement() {
  const [players, setPlayers] = useState<Player[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [filter, setFilter] = useState<'all' | 'active' | 'banned'>('all');
  const [editPlayer, setEditPlayer] = useState<Player | null>(null);
  const [banPlayer, setBanPlayer] = useState<Player | null>(null);
  const [banReason, setBanReason] = useState('');
  const [deletePlayer, setDeletePlayer] = useState<Player | null>(null);
  const [saving, setSaving] = useState(false);
  const [msg, setMsg] = useState('');
  const [editForm, setEditForm] = useState({ nickname: '', realName: '', discordUsername: '', steamUrl: '', currentMmr: '' });

  const adminSession = AuthService.getCurrentAdminSession();

  const fetchPlayers = useCallback(async () => {
    setLoading(true);
    const { data, error } = await supabase.from('players')
      .select('id,nickname,real_name,avatar_url,current_mmr,current_medal_label,discord_username,steam_url,is_banned,ban_reason,banned_at,banned_by,created_at')
      .order('nickname', { ascending: true });
    if (!error && data) setPlayers(data.map(r => ({
      id: r.id, nickname: r.nickname, realName: r.real_name, avatarUrl: r.avatar_url,
      currentMmr: r.current_mmr, currentMedalLabel: r.current_medal_label,
      discordUsername: r.discord_username, steamUrl: r.steam_url,
      isBanned: r.is_banned, banReason: r.ban_reason, bannedAt: r.banned_at,
      bannedBy: r.banned_by, createdAt: r.created_at,
    })));
    setLoading(false);
  }, []);

  useEffect(() => { fetchPlayers(); }, [fetchPlayers]);

  const filtered = players.filter(p => {
    const q = search.toLowerCase();
    const matchSearch = p.nickname.toLowerCase().includes(q) || (p.realName?.toLowerCase().includes(q));
    const matchFilter = filter === 'all' || (filter === 'banned' ? p.isBanned : !p.isBanned);
    return matchSearch && matchFilter;
  });

  const flash = (text: string) => { setMsg(text); setTimeout(() => setMsg(''), 3000); };

  const openEdit = (p: Player) => {
    setEditPlayer(p);
    setEditForm({ nickname: p.nickname, realName: p.realName || '', discordUsername: p.discordUsername || '', steamUrl: p.steamUrl || '', currentMmr: p.currentMmr?.toString() || '' });
  };

  const handleSaveEdit = async () => {
    if (!editPlayer) return;
    setSaving(true);
    const mmr = editForm.currentMmr ? parseInt(editForm.currentMmr) : null;
    const medal = mmr ? getMedalFromMMR(mmr) : null;
    const { error } = await supabase.from('players').update({
      nickname: editForm.nickname, real_name: editForm.realName || null,
      discord_username: editForm.discordUsername || null, steam_url: editForm.steamUrl || null,
      current_mmr: mmr, current_medal_label: medal?.label || null, current_medal_id: medal?.id || null,
      updated_at: new Date().toISOString(),
    }).eq('id', editPlayer.id);
    setSaving(false);
    if (error) { flash('Error: ' + error.message); return; }
    setEditPlayer(null); flash('Player updated'); fetchPlayers();
  };

  const handleBan = async () => {
    if (!banPlayer) return;
    setSaving(true);
    const { error } = await supabase.from('players').update({
      is_banned: true, ban_reason: banReason || 'Banned by admin',
      banned_at: new Date().toISOString(), banned_by: adminSession?.username || 'admin',
    }).eq('id', banPlayer.id);
    setSaving(false);
    if (error) { flash('Error: ' + error.message); return; }
    setBanPlayer(null); setBanReason(''); flash(`${banPlayer.nickname} banned`); fetchPlayers();
  };

  const handleUnban = async (p: Player) => {
    const { error } = await supabase.from('players').update({ is_banned: false, ban_reason: null, banned_at: null, banned_by: null }).eq('id', p.id);
    if (error) { flash('Error: ' + error.message); return; }
    flash(`${p.nickname} unbanned`); fetchPlayers();
  };

  const handleDelete = async () => {
    if (!deletePlayer) return;
    setSaving(true);
    const { error } = await supabase.from('players').delete().eq('id', deletePlayer.id);
    setSaving(false);
    if (error) { flash('Error: ' + error.message); return; }
    setDeletePlayer(null); flash('Player deleted'); fetchPlayers();
  };

  return (
    <div className="space-y-5" style={{ fontFamily: 'Poppins, sans-serif' }}>
      <AnimatePresence>
        {msg && <motion.div initial={{ opacity: 0, y: -8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} className="px-4 py-2.5 rounded-xl text-sm text-green-400 border border-green-500/20" style={{ background: 'rgba(34,197,94,0.08)' }}>{msg}</motion.div>}
      </AnimatePresence>

      <div className="flex flex-col sm:flex-row gap-3">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-white/30" />
          <input value={search} onChange={e => setSearch(e.target.value)} placeholder="Search players..."
            className="w-full pl-9 pr-4 py-2.5 rounded-xl text-sm text-white placeholder-white/25 focus:outline-none"
            style={{ background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.08)' }}
            onFocus={e => (e.currentTarget.style.borderColor = 'rgba(255,255,255,0.2)')}
            onBlur={e => (e.currentTarget.style.borderColor = 'rgba(255,255,255,0.08)')} />
        </div>
        <div className="flex gap-1 p-1 rounded-xl" style={{ background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.08)' }}>
          {(['all', 'active', 'banned'] as const).map(f => (
            <button key={f} onClick={() => setFilter(f)} className="px-3 py-1.5 rounded-lg text-xs font-medium capitalize transition-all"
              style={filter === f ? { background: 'rgba(255,255,255,0.1)', color: 'white' } : { color: 'rgba(255,255,255,0.4)' }}>{f}</button>
          ))}
        </div>
      </div>

      <div className="flex items-center gap-2 text-white/40 text-sm">
        <Users className="w-4 h-4" />
        <span>{filtered.length} player{filtered.length !== 1 ? 's' : ''}</span>
      </div>

      <div className="rounded-xl overflow-hidden" style={{ border: '1px solid rgba(255,255,255,0.08)' }}>
        {loading ? (
          <div className="flex items-center justify-center py-16 text-white/30 text-sm">Loading...</div>
        ) : filtered.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-16 text-white/30 gap-2"><Users className="w-8 h-8 opacity-40" /><span className="text-sm">No players found</span></div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr style={{ background: 'rgba(255,255,255,0.03)', borderBottom: '1px solid rgba(255,255,255,0.06)' }}>
                  {['Player', 'MMR / Medal', 'Discord', 'Status', 'Actions'].map(h => (
                    <th key={h} className="px-4 py-3 text-left text-xs font-semibold text-white/40 uppercase tracking-wider">{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {filtered.map((p, i) => (
                  <motion.tr key={p.id} initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: i * 0.02 }}
                    style={{ borderBottom: '1px solid rgba(255,255,255,0.04)', background: p.isBanned ? 'rgba(239,68,68,0.04)' : 'transparent' }}
                    className="hover:bg-white/[0.02] transition-colors">
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-3">
                        <Avatar url={p.avatarUrl} name={p.nickname} />
                        <div><div className="text-white font-medium">{p.nickname}</div>{p.realName && <div className="text-white/35 text-xs">{p.realName}</div>}</div>
                      </div>
                    </td>
                    <td className="px-4 py-3">{p.currentMmr ? <div><div className="text-white/80">{p.currentMmr} MMR</div><div className="text-white/35 text-xs">{p.currentMedalLabel}</div></div> : <span className="text-white/25">—</span>}</td>
                    <td className="px-4 py-3 text-white/50 text-xs">{p.discordUsername || <span className="text-white/20">—</span>}</td>
                    <td className="px-4 py-3">
                      {p.isBanned
                        ? <span className="px-2 py-0.5 rounded-full text-xs font-medium text-red-400 border border-red-500/20" style={{ background: 'rgba(239,68,68,0.1)' }}>Banned</span>
                        : <span className="px-2 py-0.5 rounded-full text-xs font-medium text-green-400 border border-green-500/20" style={{ background: 'rgba(34,197,94,0.1)' }}>Active</span>}
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-1">
                        <button onClick={() => openEdit(p)} title="Edit" className="p-1.5 rounded-lg text-white/40 hover:text-white transition-colors"><Edit2 className="w-3.5 h-3.5" /></button>
                        {p.isBanned
                          ? <button onClick={() => handleUnban(p)} title="Unban" className="p-1.5 rounded-lg text-green-400/60 hover:text-green-400 transition-colors"><ShieldCheck className="w-3.5 h-3.5" /></button>
                          : <button onClick={() => { setBanPlayer(p); setBanReason(''); }} title="Ban" className="p-1.5 rounded-lg text-orange-400/60 hover:text-orange-400 transition-colors"><Ban className="w-3.5 h-3.5" /></button>}
                        <button onClick={() => setDeletePlayer(p)} title="Delete" className="p-1.5 rounded-lg text-red-400/40 hover:text-red-400 transition-colors"><Trash2 className="w-3.5 h-3.5" /></button>
                      </div>
                    </td>
                  </motion.tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      <AnimatePresence>
        {editPlayer && (
          <Modal title="Edit Player" onClose={() => setEditPlayer(null)}>
            <div className="space-y-3">
              {EDIT_FIELDS.map(f => (
                <div key={f.key}>
                  <label className="block text-xs text-white/40 mb-1">{f.label}</label>
                  <input type={f.type} value={(editForm as any)[f.key]}
                    onChange={e => setEditForm(prev => ({ ...prev, [f.key]: e.target.value }))}
                    className="w-full px-3 py-2 rounded-lg text-sm text-white focus:outline-none"
                    style={{ background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)' }}
                    onFocus={e => (e.currentTarget.style.borderColor = 'rgba(255,255,255,0.25)')}
                    onBlur={e => (e.currentTarget.style.borderColor = 'rgba(255,255,255,0.1)')} />
                </div>
              ))}
              <div className="flex gap-2 pt-2">
                <button onClick={() => setEditPlayer(null)} className="flex-1 py-2 rounded-xl text-sm text-white/50 hover:text-white/80" style={{ background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.08)' }}>Cancel</button>
                <button onClick={handleSaveEdit} disabled={saving} className="flex-1 flex items-center justify-center gap-2 py-2 rounded-xl text-sm font-semibold text-white disabled:opacity-50" style={{ background: 'rgba(59,130,246,0.8)' }}>
                  <Save className="w-3.5 h-3.5" />{saving ? 'Saving...' : 'Save'}
                </button>
              </div>
            </div>
          </Modal>
        )}
      </AnimatePresence>

      <AnimatePresence>
        {banPlayer && (
          <Modal title={`Ban ${banPlayer.nickname}`} onClose={() => setBanPlayer(null)}>
            <div className="space-y-3">
              <div className="flex items-center gap-2 px-3 py-2 rounded-lg" style={{ background: 'rgba(239,68,68,0.08)', border: '1px solid rgba(239,68,68,0.2)' }}>
                <AlertTriangle className="w-4 h-4 text-red-400 flex-shrink-0" />
                <p className="text-red-300 text-xs">This player will be banned from the league and their profile will be flagged.</p>
              </div>
              <div>
                <label className="block text-xs text-white/40 mb-1">Reason</label>
                <textarea value={banReason} onChange={e => setBanReason(e.target.value)} rows={3} placeholder="Why is this player being banned?"
                  className="w-full px-3 py-2 rounded-lg text-sm text-white resize-none focus:outline-none"
                  style={{ background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)' }}
                  onFocus={e => (e.currentTarget.style.borderColor = 'rgba(255,255,255,0.25)')}
                  onBlur={e => (e.currentTarget.style.borderColor = 'rgba(255,255,255,0.1)')} />
              </div>
              <div className="flex gap-2 pt-1">
                <button onClick={() => setBanPlayer(null)} className="flex-1 py-2 rounded-xl text-sm text-white/50 hover:text-white/80" style={{ background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.08)' }}>Cancel</button>
                <button onClick={handleBan} disabled={saving} className="flex-1 flex items-center justify-center gap-2 py-2 rounded-xl text-sm font-semibold text-white disabled:opacity-50" style={{ background: 'rgba(239,68,68,0.8)' }}>
                  <Ban className="w-3.5 h-3.5" />{saving ? 'Banning...' : 'Ban Player'}
                </button>
              </div>
            </div>
          </Modal>
        )}
      </AnimatePresence>

      <AnimatePresence>
        {deletePlayer && (
          <Modal title="Delete Player" onClose={() => setDeletePlayer(null)}>
            <div className="space-y-4">
              <p className="text-white/60 text-sm">Permanently delete <span className="text-white font-semibold">{deletePlayer.nickname}</span>? This cannot be undone.</p>
              <div className="flex gap-2">
                <button onClick={() => setDeletePlayer(null)} className="flex-1 py-2 rounded-xl text-sm text-white/50 hover:text-white/80" style={{ background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.08)' }}>Cancel</button>
                <button onClick={handleDelete} disabled={saving} className="flex-1 flex items-center justify-center gap-2 py-2 rounded-xl text-sm font-semibold text-white disabled:opacity-50" style={{ background: 'rgba(239,68,68,0.8)' }}>
                  <Trash2 className="w-3.5 h-3.5" />{saving ? 'Deleting...' : 'Delete'}
                </button>
              </div>
            </div>
          </Modal>
        )}
      </AnimatePresence>
    </div>
  );
}

function Modal({ title, onClose, children }: { title: string; onClose: () => void; children: React.ReactNode }) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center px-4" style={{ background: 'rgba(0,0,0,0.7)', backdropFilter: 'blur(6px)' }}>
      <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.95 }}
        className="w-full max-w-md rounded-2xl overflow-hidden"
        style={{ background: 'rgba(10,13,18,0.98)', border: '1px solid rgba(255,255,255,0.1)', fontFamily: 'Poppins, sans-serif' }}>
        <div className="flex items-center justify-between px-5 py-4" style={{ borderBottom: '1px solid rgba(255,255,255,0.07)' }}>
          <h3 className="text-white font-semibold text-sm">{title}</h3>
          <button onClick={onClose} className="text-white/30 hover:text-white/70 transition-colors"><X className="w-4 h-4" /></button>
        </div>
        <div className="px-5 py-5">{children}</div>
      </motion.div>
    </div>
  );
}

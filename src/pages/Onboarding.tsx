import { useState } from 'react'
import { useNavigate, useSearchParams } from 'react-router-dom'
import { motion } from 'framer-motion'
import { createClient } from '@supabase/supabase-js'

const supabase = createClient(
  import.meta.env.VITE_SUPABASE_URL,
  import.meta.env.VITE_SUPABASE_ANON_KEY
)

const ROLES = ['Carry', 'Mid', 'Offlane', 'Soft Support', 'Hard Support']
const MEDALS = ['Herald', 'Guardian', 'Crusader', 'Archon', 'Legend', 'Ancient', 'Divine', 'Immortal']

export default function Onboarding() {
  const navigate = useNavigate()
  const [params] = useSearchParams()
  const playerId = params.get('playerId') ?? ''

  const [nickname, setNickname] = useState('')
  const [mmr, setMmr] = useState('')
  const [discord, setDiscord] = useState('')
  const [roles, setRoles] = useState<string[]>([])
  const [medal, setMedal] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  const toggleRole = (r: string) =>
    setRoles(prev => prev.includes(r) ? prev.filter(x => x !== r) : prev.length < 2 ? [...prev, r] : prev)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!nickname.trim()) { setError('Nickname is required'); return }
    if (!playerId) { setError('Missing player ID'); return }

    setLoading(true); setError('')
    try {
      // Check nickname uniqueness
      const { data: conflict } = await supabase
        .from('players').select('id').eq('nickname', nickname.trim()).maybeSingle()
      if (conflict && conflict.id !== playerId) {
        setError('That nickname is already taken'); setLoading(false); return
      }

      const { error: updateErr } = await supabase.from('players').update({
        nickname: nickname.trim(),
        discord_username: discord.trim() || null,
        current_mmr: mmr ? parseInt(mmr) : null,
        current_medal_label: medal || null,
        roles: roles.length ? roles : null,
      }).eq('id', playerId)

      if (updateErr) { setError(updateErr.message); setLoading(false); return }

      // Update session nickname
      const raw = localStorage.getItem('steamSession')
      if (raw) {
        const s = JSON.parse(raw)
        localStorage.setItem('steamSession', JSON.stringify({ ...s, nickname: nickname.trim() }))
      }
      const raw2 = localStorage.getItem('playerSession')
      if (raw2) {
        const s = JSON.parse(raw2)
        localStorage.setItem('playerSession', JSON.stringify({ ...s, nickname: nickname.trim() }))
      }

      // Force navbar to refresh by reloading
      window.location.href = `/players/${playerId}`
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Something went wrong')
    } finally { setLoading(false) }
  }

  return (
    <div className="min-h-screen flex items-center justify-center px-4" style={{ paddingTop: '80px', background: '#080b0f' }}>
      <div className="fixed inset-0 pointer-events-none" style={{
        background: 'radial-gradient(ellipse 60% 40% at 50% 30%, rgba(102,192,244,0.05) 0%, transparent 70%)'
      }} />

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-md rounded-2xl p-8 space-y-6"
        style={{ background: 'rgba(12,15,20,0.95)', border: '1px solid rgba(255,255,255,0.08)' }}
      >
        <div className="text-center space-y-1">
          <h1 className="text-white text-2xl font-bold">Set up your TRR profile</h1>
          <p className="text-gray-500 text-sm">Just a few details to get you started</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-5">
          {/* Nickname */}
          <div className="space-y-1.5">
            <label className="text-gray-400 text-xs uppercase tracking-widest">TRR Nickname *</label>
            <input
              value={nickname} onChange={e => setNickname(e.target.value)}
              placeholder="Your in-game name"
              className="w-full px-4 py-2.5 rounded-lg text-sm text-white placeholder-gray-600 focus:outline-none transition-colors"
              style={{ background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)' }}
              onFocus={e => e.currentTarget.style.borderColor = 'rgba(102,192,244,0.4)'}
              onBlur={e => e.currentTarget.style.borderColor = 'rgba(255,255,255,0.1)'}
              maxLength={30}
            />
          </div>

          {/* MMR */}
          <div className="space-y-1.5">
            <label className="text-gray-400 text-xs uppercase tracking-widest">Current MMR</label>
            <input
              type="number" value={mmr} onChange={e => setMmr(e.target.value)}
              placeholder="e.g. 3500"
              className="w-full px-4 py-2.5 rounded-lg text-sm text-white placeholder-gray-600 focus:outline-none transition-colors"
              style={{ background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)' }}
              onFocus={e => e.currentTarget.style.borderColor = 'rgba(102,192,244,0.4)'}
              onBlur={e => e.currentTarget.style.borderColor = 'rgba(255,255,255,0.1)'}
              min={0} max={15000}
            />
          </div>

          {/* Medal */}
          <div className="space-y-1.5">
            <label className="text-gray-400 text-xs uppercase tracking-widest">Medal</label>
            <div className="flex flex-wrap gap-2">
              {MEDALS.map(m => (
                <button key={m} type="button" onClick={() => setMedal(medal === m ? '' : m)}
                  className="px-3 py-1 rounded-full text-xs font-medium transition-all cursor-pointer"
                  style={{
                    background: medal === m ? 'rgba(102,192,244,0.2)' : 'rgba(255,255,255,0.04)',
                    border: `1px solid ${medal === m ? 'rgba(102,192,244,0.5)' : 'rgba(255,255,255,0.08)'}`,
                    color: medal === m ? '#9dd4ee' : '#6b7280',
                  }}>
                  {m}
                </button>
              ))}
            </div>
          </div>

          {/* Roles */}
          <div className="space-y-1.5">
            <label className="text-gray-400 text-xs uppercase tracking-widest">Roles (pick up to 2)</label>
            <div className="flex flex-wrap gap-2">
              {ROLES.map(r => (
                <button key={r} type="button" onClick={() => toggleRole(r)}
                  className="px-3 py-1 rounded-full text-xs font-medium transition-all cursor-pointer"
                  style={{
                    background: roles.includes(r) ? 'rgba(102,192,244,0.2)' : 'rgba(255,255,255,0.04)',
                    border: `1px solid ${roles.includes(r) ? 'rgba(102,192,244,0.5)' : 'rgba(255,255,255,0.08)'}`,
                    color: roles.includes(r) ? '#9dd4ee' : '#6b7280',
                  }}>
                  {r}
                </button>
              ))}
            </div>
          </div>

          {/* Discord */}
          <div className="space-y-1.5">
            <label className="text-gray-400 text-xs uppercase tracking-widest">Discord Username</label>
            <input
              value={discord} onChange={e => setDiscord(e.target.value)}
              placeholder="e.g. username#1234"
              className="w-full px-4 py-2.5 rounded-lg text-sm text-white placeholder-gray-600 focus:outline-none transition-colors"
              style={{ background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)' }}
              onFocus={e => e.currentTarget.style.borderColor = 'rgba(102,192,244,0.4)'}
              onBlur={e => e.currentTarget.style.borderColor = 'rgba(255,255,255,0.1)'}
            />
          </div>

          {error && <p className="text-red-400 text-xs text-center">{error}</p>}

          <div className="flex gap-3 pt-1">
            <button type="button" onClick={() => navigate(`/players/${playerId}`, { replace: true })}
              className="flex-1 py-2.5 rounded-lg text-sm text-gray-500 hover:text-gray-300 transition-colors cursor-pointer"
              style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.06)' }}>
              Skip for now
            </button>
            <button type="submit" disabled={loading}
              className="flex-1 py-2.5 rounded-lg text-sm font-semibold transition-all cursor-pointer disabled:opacity-40"
              style={{ background: 'rgba(102,192,244,0.15)', border: '1px solid rgba(102,192,244,0.3)', color: '#9dd4ee' }}>
              {loading ? <span className="inline-block w-4 h-4 border-2 border-[#66c0f4]/30 border-t-[#66c0f4] rounded-full animate-spin" /> : 'Save & Continue'}
            </button>
          </div>
        </form>
      </motion.div>
    </div>
  )
}

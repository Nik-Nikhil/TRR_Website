import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import SteamAuthService from '../services/steamAuth'
import AuthService from '../services/auth'
import { supabase } from '../lib/supabase'

const SUPABASE_URL = import.meta.env.VITE_SUPABASE_URL as string
const SUPABASE_ANON_KEY = import.meta.env.VITE_SUPABASE_ANON_KEY as string

export default function SteamCallback() {
  const navigate = useNavigate()
  const [status, setStatus] = useState<'loading' | 'error' | 'merge_prompt'>('loading')
  const [errorMsg, setErrorMsg] = useState('')
  const [debugInfo, setDebugInfo] = useState('')
  const [showDebug, setShowDebug] = useState(false)
  // merge state
  const [mergeCandidate, setMergeCandidate] = useState<{ id: string; nickname: string; avatarUrl: string } | null>(null)
  const [pendingSteamId, setPendingSteamId] = useState('')
  const [merging, setMerging] = useState(false)

  useEffect(() => {
    const params = new URLSearchParams(window.location.search)
    const allParams: Record<string, string> = {}
    params.forEach((v, k) => { allParams[k] = v })
    setDebugInfo(JSON.stringify(allParams, null, 2))

    const errorParam = params.get('error')
    if (errorParam) { setErrorMsg(decodeURIComponent(errorParam)); setStatus('error'); return }

    const mode = params.get('openid.mode')
    if (mode === 'cancel') { setErrorMsg('Steam login was cancelled'); setStatus('error'); return }

    if (mode === 'id_res') {
      handleSteamCallback(allParams)
      return
    }

    if (SteamAuthService.isLoggedIn()) {
      const s = SteamAuthService.getSession()
      if (s) { navigate(`/players/${s.playerId}`, { replace: true }); return }
    }

    setErrorMsg('No Steam response. mode=' + mode)
    setStatus('error')
  }, [navigate])

  async function handleSteamCallback(params: Record<string, string>) {
    try {
      const claimedId = params['openid.claimed_id'] ?? ''
      const steamId = claimedId.split('/').pop() ?? ''

      if (!steamId || !/^\d{17}$/.test(steamId)) {
        setErrorMsg('Invalid Steam ID from: ' + claimedId)
        setStatus('error')
        return
      }

      const res = await fetch(
        `${SUPABASE_URL}/functions/v1/steam-auth?action=upsert&steamId=${steamId}&apikey=${SUPABASE_ANON_KEY}`
      )
      const text = await res.text()
      let data: any
      try { data = JSON.parse(text) } catch {
        setErrorMsg('Bad response: ' + text.slice(0, 150))
        setStatus('error')
        return
      }

      if (!res.ok || data.error) {
        setErrorMsg(data.error ?? 'Server error ' + res.status)
        setStatus('error')
        return
      }

      // Edge function detected a pre-existing profile with same steam_url
      if (data.needsMerge) {
        setPendingSteamId(steamId)
        setMergeCandidate({ id: data.playerId, nickname: data.nickname, avatarUrl: data.avatarUrl })
        setStatus('merge_prompt')
        return
      }

      finishLogin(data, steamId)
    } catch (err) {
      const msg = err instanceof Error ? err.message : String(err)
      setErrorMsg('Error: ' + msg)
      setStatus('error')
    }
  }

  // User confirms the existing profile is theirs — link steam_id to it
  async function handleMergeConfirm() {
    if (!mergeCandidate || !pendingSteamId) return
    setMerging(true)
    try {
      // Get their steam profile for avatar/url
      const res = await fetch(
        `${SUPABASE_URL}/functions/v1/steam-auth?action=upsert&steamId=${pendingSteamId}&apikey=${SUPABASE_ANON_KEY}&forceLink=${mergeCandidate.id}`
      )
      // forceLink isn't handled by edge function yet, so we do it directly from client
      const { error } = await supabase
        .from('players')
        .update({
          steam_id: pendingSteamId,
          steam_url: `https://steamcommunity.com/profiles/${pendingSteamId}`,
        })
        .eq('id', mergeCandidate.id)

      if (error) {
        setErrorMsg('Failed to link account: ' + error.message)
        setStatus('error')
        return
      }

      // Session with existing profile
      finishLogin({ playerId: mergeCandidate.id, nickname: mergeCandidate.nickname, avatarUrl: mergeCandidate.avatarUrl, isNewAccount: false }, pendingSteamId)
    } catch (err) {
      setErrorMsg('Merge failed: ' + (err instanceof Error ? err.message : String(err)))
      setStatus('error')
    }
    setMerging(false)
  }

  // User says it's not their profile — create a fresh account
  async function handleMergeDecline() {
    if (!pendingSteamId) return
    setMerging(true)
    try {
      // Call upsert with a flag to skip steam_url match and create new
      const res = await fetch(
        `${SUPABASE_URL}/functions/v1/steam-auth?action=upsert&steamId=${pendingSteamId}&skipUrlMatch=true&apikey=${SUPABASE_ANON_KEY}`
      )
      const text = await res.text()
      let data: any
      try { data = JSON.parse(text) } catch {
        setErrorMsg('Bad response'); setStatus('error'); return
      }
      if (!res.ok || data.error) {
        setErrorMsg(data.error ?? 'Error'); setStatus('error'); return
      }
      finishLogin(data, pendingSteamId)
    } catch (err) {
      setErrorMsg(err instanceof Error ? err.message : String(err))
      setStatus('error')
    }
    setMerging(false)
  }

  function finishLogin(data: any, steamId: string) {
    SteamAuthService.saveSession({
      playerId: data.playerId,
      nickname: data.nickname,
      steamId,
      avatarUrl: data.avatarUrl ?? '',
      isNewAccount: data.isNewAccount,
    })
    AuthService.setPlayerSession({
      playerId: data.playerId,
      nickname: data.nickname,
      steamId,
      isNewAccount: data.isNewAccount,
    })
    navigate(data.isNewAccount ? `/onboarding?playerId=${data.playerId}&steamName=${encodeURIComponent(data.nickname)}` : `/players/${data.playerId}`, { replace: true })
  }

  // ── Merge prompt UI ──
  if (status === 'merge_prompt' && mergeCandidate) {
    return (
      <div className="fixed inset-0 flex items-center justify-center bg-black/90 px-4"
        style={{ fontFamily: 'Poppins, sans-serif' }}>
        <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }}
          className="w-full max-w-sm rounded-2xl overflow-hidden text-center"
          style={{ background: 'rgba(10,13,18,0.98)', border: '1px solid rgba(255,255,255,0.1)' }}>
          {/* Top bar */}
          <div className="h-1 w-full" style={{ background: 'linear-gradient(90deg, #66c0f4, #1b4f72)' }} />

          <div className="px-6 py-7">
            {/* Avatar */}
            <div className="flex justify-center mb-4">
              {mergeCandidate.avatarUrl ? (
                <img src={mergeCandidate.avatarUrl} alt={mergeCandidate.nickname}
                  className="w-16 h-16 rounded-full border-2 border-white/20 object-cover" />
              ) : (
                <div className="w-16 h-16 rounded-full flex items-center justify-center text-2xl font-black text-white/50"
                  style={{ background: 'rgba(255,255,255,0.06)', border: '1px solid rgba(255,255,255,0.1)' }}>
                  {mergeCandidate.nickname.slice(0, 2).toUpperCase()}
                </div>
              )}
            </div>

            <h2 className="text-white font-bold text-lg mb-1">Is this your profile?</h2>
            <p className="text-white/50 text-sm mb-1">
              We found an existing account with the same Steam URL:
            </p>
            <p className="text-white font-semibold text-base mb-5">
              {mergeCandidate.nickname}
            </p>

            <p className="text-white/30 text-xs mb-6">
              If this is you, we'll link your Steam account to it. If not, a new profile will be created.
            </p>

            <div className="flex gap-3">
              <button onClick={handleMergeDecline} disabled={merging}
                className="flex-1 py-3 rounded-xl text-sm font-semibold text-white/60 hover:text-white/90 transition-colors disabled:opacity-40"
                style={{ background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.08)' }}>
                Not me
              </button>
              <button onClick={handleMergeConfirm} disabled={merging}
                className="flex-1 flex items-center justify-center gap-2 py-3 rounded-xl text-sm font-semibold text-white transition-colors disabled:opacity-40"
                style={{ background: 'rgba(102,192,244,0.2)', border: '1px solid rgba(102,192,244,0.35)', color: '#c2e4f5' }}>
                {merging
                  ? <><div className="w-4 h-4 border-2 border-white/20 border-t-white/60 rounded-full animate-spin" /> Linking...</>
                  : 'Yes, that\'s me'}
              </button>
            </div>
          </div>
        </motion.div>
      </div>
    )
  }

  // ── Loading / Error ──
  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black/90">
      {status === 'loading' ? (
        <motion.div initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} className="flex flex-col items-center gap-4">
          <div className="relative w-16 h-16">
            <div className="absolute inset-0 rounded-full border-4 border-[#1b2838] border-t-[#66c0f4] animate-spin" />
            <img src="https://store.steampowered.com/favicon.ico" alt="Steam" className="absolute inset-0 m-auto w-8 h-8" />
          </div>
          <p className="text-[#66c0f4] font-semibold text-lg">Signing in with Steam…</p>
          <p className="text-gray-400 text-sm">Setting up your profile</p>
        </motion.div>
      ) : (
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="flex flex-col items-center gap-4 max-w-lg text-center px-6">
          <div className="text-5xl">⚠️</div>
          <h2 className="text-white text-xl font-bold">Steam Login Failed</h2>
          <p className="text-red-300 text-sm font-mono break-all">{errorMsg}</p>
          <button onClick={() => setShowDebug(v => !v)} className="text-xs text-gray-600 hover:text-gray-400 underline">
            {showDebug ? 'Hide' : 'Show'} debug info
          </button>
          {showDebug && (
            <pre className="w-full text-left rounded-lg p-3 text-xs font-mono text-gray-400 max-h-48 overflow-y-auto"
              style={{ background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.08)' }}>
              {debugInfo}
            </pre>
          )}
          <button onClick={() => navigate('/player-login')}
            className="mt-2 px-6 py-2 bg-[#1b2838] hover:bg-[#2a475e] border border-[#66c0f4]/40 text-[#66c0f4] rounded-lg transition-colors">
            Back to Login
          </button>
        </motion.div>
      )}
    </div>
  )
}

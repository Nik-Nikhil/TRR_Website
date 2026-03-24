import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import SteamAuthService from '../services/steamAuth'
import AuthService from '../services/auth'

const SUPABASE_URL = import.meta.env.VITE_SUPABASE_URL as string
const SUPABASE_ANON_KEY = import.meta.env.VITE_SUPABASE_ANON_KEY as string

export default function SteamCallback() {
  const navigate = useNavigate()
  const [status, setStatus] = useState<'loading' | 'error'>('loading')
  const [errorMsg, setErrorMsg] = useState('')
  const [debugInfo, setDebugInfo] = useState('')
  const [showDebug, setShowDebug] = useState(false)

  useEffect(() => {
    const params = new URLSearchParams(window.location.search)
    const allParams: Record<string, string> = {}
    params.forEach((v, k) => { allParams[k] = v })
    console.log('[SteamCallback] params:', allParams)
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
      // Extract steamId directly from claimed_id — no verification needed for basic login
      // Steam's OpenID claimed_id format: https://steamcommunity.com/openid/id/STEAMID64
      const claimedId = params['openid.claimed_id'] ?? ''
      const steamId = claimedId.split('/').pop() ?? ''
      console.log('[SteamCallback] steamId:', steamId)

      if (!steamId || !/^\d{17}$/.test(steamId)) {
        setErrorMsg('Invalid Steam ID from: ' + claimedId)
        setStatus('error')
        return
      }

      // Call edge function to upsert player (no OpenID verification — just DB upsert)
      console.log('[SteamCallback] calling upsert...')
      const res = await fetch(
        `${SUPABASE_URL}/functions/v1/steam-auth?action=upsert&steamId=${steamId}&apikey=${SUPABASE_ANON_KEY}`
      )

      console.log('[SteamCallback] upsert status:', res.status)
      const text = await res.text()
      console.log('[SteamCallback] upsert response:', text.slice(0, 300))

      let data: any
      try { data = JSON.parse(text) } catch {
        setErrorMsg('Bad response from server: ' + text.slice(0, 150))
        setStatus('error')
        return
      }

      if (!res.ok || data.error) {
        setErrorMsg(data.error ?? 'Server error ' + res.status)
        setStatus('error')
        return
      }

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

      navigate(data.isNewAccount ? `/onboarding?playerId=${data.playerId}` : `/players/${data.playerId}`, { replace: true })
    } catch (err) {
      const msg = err instanceof Error ? err.message : String(err)
      console.error('[SteamCallback] error:', msg)
      setErrorMsg('Error: ' + msg)
      setStatus('error')
    }
  }

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

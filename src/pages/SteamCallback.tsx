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

    console.log('[SteamCallback] URL params:', allParams)
    setDebugInfo(JSON.stringify(allParams, null, 2))

    // If Steam redirected here with OpenID params, verify them
    const openidMode = params.get('openid.mode')
    const errorParam = params.get('error')

    if (errorParam) {
      console.error('[SteamCallback] Error param:', errorParam)
      setErrorMsg(decodeURIComponent(errorParam))
      setStatus('error')
      return
    }

    if (openidMode === 'id_res') {
      // Steam returned successfully — send params to edge function for verification
      console.log('[SteamCallback] Got OpenID response, verifying...')
      verifyWithEdgeFunction(allParams)
      return
    }

    if (openidMode === 'cancel') {
      setErrorMsg('Steam login was cancelled')
      setStatus('error')
      return
    }

    // No OpenID params — check if we already have a session
    if (SteamAuthService.isLoggedIn()) {
      const s = SteamAuthService.getSession()
      if (s) { navigate(`/players/${s.playerId}`, { replace: true }); return }
    }

    setErrorMsg('No Steam response received. Params: ' + JSON.stringify(allParams))
    setStatus('error')
  }, [navigate])

  async function verifyWithEdgeFunction(params: Record<string, string>) {
    try {
      const res = await fetch(`${SUPABASE_URL}/functions/v1/steam-auth?action=verify`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'apikey': SUPABASE_ANON_KEY,
          'Authorization': `Bearer ${SUPABASE_ANON_KEY}`,
        },
        body: JSON.stringify({ params }),
      })

      const data = await res.json()
      console.log('[SteamCallback] Verify response:', data)

      if (!res.ok || data.error) {
        setErrorMsg(data.error ?? 'Verification failed')
        setStatus('error')
        return
      }

      // Save session
      SteamAuthService.saveSession({
        playerId: data.playerId,
        nickname: data.nickname,
        steamId: data.steamId,
        avatarUrl: data.avatarUrl,
        isNewAccount: data.isNewAccount,
      })
      AuthService.setPlayerSession({
        playerId: data.playerId,
        nickname: data.nickname,
        steamId: data.steamId,
        isNewAccount: data.isNewAccount,
      })

      navigate(`/players/${data.playerId}`, { replace: true })
    } catch (err) {
      const msg = err instanceof Error ? err.message : String(err)
      console.error('[SteamCallback] Fetch error:', msg)
      setErrorMsg('Network error: ' + msg)
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

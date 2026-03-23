// src/pages/SteamCallback.tsx
import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import SteamAuthService from '../services/steamAuth'
import AuthService from '../services/auth'

export default function SteamCallback() {
  const navigate = useNavigate()
  const [status, setStatus] = useState<'loading' | 'error'>('loading')
  const [errorMsg, setErrorMsg] = useState('')
  const [debugInfo, setDebugInfo] = useState<Record<string, string>>({})
  const [showDebug, setShowDebug] = useState(false)

  useEffect(() => {
    // Log everything in the URL for debugging
    const params = new URLSearchParams(window.location.search)
    const allParams: Record<string, string> = {}
    params.forEach((v, k) => { allParams[k] = v })

    console.group('🔵 SteamCallback — URL params')
    console.log('Full URL:', window.location.href)
    console.log('Params:', allParams)
    console.groupEnd()

    setDebugInfo({ url: window.location.href, ...allParams })

    const { session, error } = SteamAuthService.parseCallbackUrl()

    if (error || !session) {
      const msg = error ?? 'Unknown error — no session or error param in URL'
      console.error('❌ Steam login error:', msg)
      setErrorMsg(msg)
      setStatus('error')
      return
    }

    console.log('✅ Steam session parsed:', session)

    SteamAuthService.saveSession(session)
    AuthService.setPlayerSession({
      playerId: session.playerId,
      nickname: session.nickname,
      steamId: session.steamId,
      isNewAccount: session.isNewAccount,
    })

    navigate(`/players/${session.playerId}`, { replace: true })
  }, [navigate])

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black/90">
      {status === 'loading' ? (
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="flex flex-col items-center gap-4"
        >
          <div className="relative w-16 h-16">
            <div className="absolute inset-0 rounded-full border-4 border-[#1b2838] border-t-[#66c0f4] animate-spin" />
            <img src="https://store.steampowered.com/favicon.ico" alt="Steam" className="absolute inset-0 m-auto w-8 h-8" />
          </div>
          <p className="text-[#66c0f4] font-semibold text-lg">Signing in with Steam…</p>
          <p className="text-gray-400 text-sm">Setting up your profile</p>
        </motion.div>
      ) : (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex flex-col items-center gap-4 max-w-lg text-center px-6"
        >
          <div className="text-5xl">⚠️</div>
          <h2 className="text-white text-xl font-bold">Steam Login Failed</h2>
          <p className="text-red-300 text-sm font-mono break-all">{errorMsg}</p>

          {/* Debug panel */}
          <button
            onClick={() => setShowDebug(v => !v)}
            className="text-xs text-gray-600 hover:text-gray-400 transition-colors underline"
          >
            {showDebug ? 'Hide' : 'Show'} debug info
          </button>

          {showDebug && (
            <div className="w-full text-left rounded-lg p-3 text-xs font-mono text-gray-400 space-y-1 max-h-48 overflow-y-auto"
              style={{ background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.08)' }}>
              {Object.entries(debugInfo).map(([k, v]) => (
                <div key={k} className="break-all">
                  <span className="text-gray-500">{k}: </span>
                  <span className="text-gray-300">{v}</span>
                </div>
              ))}
            </div>
          )}

          <button
            onClick={() => navigate('/player-login')}
            className="mt-2 px-6 py-2 bg-[#1b2838] hover:bg-[#2a475e] border border-[#66c0f4]/40 text-[#66c0f4] rounded-lg transition-colors"
          >
            Back to Login
          </button>
        </motion.div>
      )}
    </div>
  )
}

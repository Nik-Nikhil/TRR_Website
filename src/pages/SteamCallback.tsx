// src/pages/SteamCallback.tsx
// Steam redirects back to /steam-callback after the edge function processes the login.
// This page reads the session from the URL, saves it, and navigates the user.

import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import SteamAuthService from '../services/steamAuth'
import AuthService from '../services/auth'

export default function SteamCallback() {
  const navigate = useNavigate()
  const [status, setStatus] = useState<'loading' | 'error'>('loading')
  const [errorMsg, setErrorMsg] = useState('')

  useEffect(() => {
    const { session, error } = SteamAuthService.parseCallbackUrl()

    if (error || !session) {
      setErrorMsg(error ?? 'Unknown error')
      setStatus('error')
      return
    }

    // Save Steam session
    SteamAuthService.saveSession(session)

    // Also set the shared AuthService player session so Navbar picks it up
    AuthService.setPlayerSession({
      playerId: session.playerId,
      nickname: session.nickname,
      steamId: session.steamId,
      isNewAccount: session.isNewAccount,
    })

    // New accounts go to their profile to fill in details;
    // returning players go to their profile page
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
          {/* Steam spinner */}
          <div className="relative w-16 h-16">
            <div className="absolute inset-0 rounded-full border-4 border-[#1b2838] border-t-[#66c0f4] animate-spin" />
            <img
              src="https://store.steampowered.com/favicon.ico"
              alt="Steam"
              className="absolute inset-0 m-auto w-8 h-8"
            />
          </div>
          <p className="text-[#66c0f4] font-semibold text-lg">Signing in with Steam…</p>
          <p className="text-gray-400 text-sm">Setting up your profile</p>
        </motion.div>
      ) : (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex flex-col items-center gap-4 max-w-sm text-center px-6"
        >
          <div className="text-5xl">⚠️</div>
          <h2 className="text-white text-xl font-bold">Steam Login Failed</h2>
          <p className="text-red-300 text-sm">{errorMsg}</p>
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

// src/services/steamAuth.ts
// Frontend helpers for Steam OpenID login flow

const SUPABASE_URL = import.meta.env.VITE_SUPABASE_URL as string

export interface SteamSession {
  playerId: string
  nickname: string
  steamId: string
  avatarUrl: string
  isNewAccount: boolean
}

const STEAM_SESSION_KEY = 'steamSession'

export const SteamAuthService = {
  /**
   * Redirect the browser to the Steam login page via the edge function.
   * The edge function handles the OpenID redirect to Steam.
   */
  initiateLogin() {
    const initUrl = `${SUPABASE_URL}/functions/v1/steam-auth/init`
    window.location.href = initUrl
  },

  /**
   * Parse the session data returned in the URL after Steam callback.
   * Called on the /steam-callback page.
   */
  parseCallbackUrl(): { session: SteamSession | null; error: string | null } {
    const params = new URLSearchParams(window.location.search)
    const error = params.get('error')
    if (error) return { session: null, error: decodeURIComponent(error) }

    const raw = params.get('session')
    if (!raw) return { session: null, error: 'No session data received' }

    try {
      const session = JSON.parse(decodeURIComponent(raw)) as SteamSession
      return { session, error: null }
    } catch {
      return { session: null, error: 'Invalid session data' }
    }
  },

  /** Persist the Steam session to localStorage */
  saveSession(session: SteamSession) {
    localStorage.setItem(
      STEAM_SESSION_KEY,
      JSON.stringify({ ...session, loginTime: new Date().toISOString() })
    )
  },

  /** Get the current Steam session (24h expiry) */
  getSession(): SteamSession | null {
    try {
      const raw = localStorage.getItem(STEAM_SESSION_KEY)
      if (!raw) return null
      const parsed = JSON.parse(raw)
      const hours = (Date.now() - new Date(parsed.loginTime).getTime()) / 36e5
      if (hours > 24) {
        this.clearSession()
        return null
      }
      return parsed as SteamSession
    } catch {
      return null
    }
  },

  clearSession() {
    localStorage.removeItem(STEAM_SESSION_KEY)
  },

  isLoggedIn(): boolean {
    return this.getSession() !== null
  },
}

export default SteamAuthService

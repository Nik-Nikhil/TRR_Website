// supabase/functions/steam-auth/index.ts
// Handles Steam OpenID 2.0 login flow
// Deploy with: supabase functions deploy steam-auth

import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'

const STEAM_OPENID_URL = 'https://steamcommunity.com/openid/login'
const STEAM_API_BASE = 'https://api.steampowered.com'

// These come from Supabase secrets (set via CLI):
//   supabase secrets set STEAM_API_KEY=your_key
//   supabase secrets set SITE_URL=https://yoursite.com
//   supabase secrets set SUPABASE_URL=...
//   supabase secrets set SUPABASE_SERVICE_ROLE_KEY=...
const STEAM_API_KEY = Deno.env.get('STEAM_API_KEY') ?? ''
const SITE_URL = Deno.env.get('SITE_URL') ?? 'http://localhost:5173'

// Supabase injects these automatically at runtime
const PROJECT_URL = Deno.env.get('SUPABASE_URL') ?? 'https://qcsdshznxhhwtxdecako.supabase.co'
const SUPABASE_SERVICE_ROLE_KEY = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? Deno.env.get('SERVICE_ROLE_KEY') ?? ''

const CALLBACK_URL = `${PROJECT_URL}/functions/v1/steam-auth/callback`

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
  'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
}

Deno.serve(async (req: Request) => {
  // Handle CORS preflight
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders })
  }

  const url = new URL(req.url)
  const path = url.pathname

  // ── /steam-auth/init ──────────────────────────────────────────────
  if (path.endsWith('/init')) {
    const params = new URLSearchParams({
      'openid.ns': 'http://specs.openid.net/auth/2.0',
      'openid.mode': 'checkid_setup',
      'openid.return_to': CALLBACK_URL,
      'openid.realm': PROJECT_URL,
      'openid.identity': 'http://specs.openid.net/auth/2.0/identifier_select',
      'openid.claimed_id': 'http://specs.openid.net/auth/2.0/identifier_select',
    })

    return Response.redirect(`${STEAM_OPENID_URL}?${params.toString()}`, 302)
  }

  // ── /steam-auth/callback ──────────────────────────────────────────
  // Steam redirects here after login; we verify + upsert player
  if (path.endsWith('/callback')) {
    try {
      const params = url.searchParams

      // 1. Verify the OpenID response with Steam
      const verified = await verifySteamOpenID(params)
      if (!verified) {
        return redirectWithError('Steam verification failed')
      }

      // 2. Extract SteamID64 from claimed_id
      // Format: https://steamcommunity.com/openid/id/76561198XXXXXXXXX
      const claimedId = params.get('openid.claimed_id') ?? ''
      const steamId = claimedId.split('/').pop() ?? ''
      if (!steamId || !/^\d{17}$/.test(steamId)) {
        return redirectWithError('Invalid Steam ID')
      }

      // 3. Fetch Steam profile
      const profile = await fetchSteamProfile(steamId)
      if (!profile) {
        return redirectWithError('Could not fetch Steam profile')
      }

      // 4. Upsert player in Supabase
      const supabase = createClient(PROJECT_URL, SUPABASE_SERVICE_ROLE_KEY)
      const player = await upsertPlayer(supabase, steamId, profile)
      if (!player) {
        return redirectWithError('Database error')
      }

      // 5. Redirect back to frontend with player data encoded in URL
      const sessionData = encodeURIComponent(JSON.stringify({
        playerId: player.id,
        nickname: player.nickname,
        steamId,
        avatarUrl: player.avatar_url,
        isNewAccount: player.is_new,
      }))

      return Response.redirect(`${SITE_URL}/steam-callback?session=${sessionData}`, 302)
    } catch (err) {
      console.error('Steam callback error:', err)
      const msg = err instanceof Error ? err.message : String(err)
      return redirectWithError(`Internal error: ${msg}`)
    }
  }

  return new Response(JSON.stringify({ error: 'Not found' }), {
    status: 404,
    headers: { ...corsHeaders, 'Content-Type': 'application/json' },
  })
})

// ── Helpers ───────────────────────────────────────────────────────────────────

/**
 * Verify the OpenID response by sending it back to Steam for confirmation.
 * This is the critical security step — never skip it.
 */
async function verifySteamOpenID(params: URLSearchParams): Promise<boolean> {
  const verifyParams = new URLSearchParams(params)
  verifyParams.set('openid.mode', 'check_authentication')

  const res = await fetch(STEAM_OPENID_URL, {
    method: 'POST',
    headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
    body: verifyParams.toString(),
  })

  const text = await res.text()
  return text.includes('is_valid:true')
}

/**
 * Fetch public Steam profile via Web API.
 * Requires STEAM_API_KEY secret.
 */
async function fetchSteamProfile(steamId: string) {
  if (!STEAM_API_KEY) {
    // No API key — return minimal profile using community URL
    return {
      nickname: `Steam_${steamId.slice(-6)}`,
      avatar_url: '',
      steam_url: `https://steamcommunity.com/profiles/${steamId}`,
    }
  }

  const res = await fetch(
    `${STEAM_API_BASE}/ISteamUser/GetPlayerSummaries/v0002/?key=${STEAM_API_KEY}&steamids=${steamId}`
  )
  const data = await res.json()
  const player = data?.response?.players?.[0]
  if (!player) return null

  return {
    nickname: player.personaname as string,
    avatar_url: (player.avatarfull ?? player.avatarmedium ?? player.avatar) as string,
    steam_url: `https://steamcommunity.com/profiles/${steamId}`,
  }
}

/**
 * Upsert player — find by steam_id, update profile, or create new record.
 */
async function upsertPlayer(
  supabase: ReturnType<typeof createClient>,
  steamId: string,
  profile: { nickname: string; avatar_url: string; steam_url: string }
) {
  // Check if player already exists by steam_id
  const { data: existing } = await supabase
    .from('players')
    .select('id, nickname, avatar_url')
    .eq('steam_id', steamId)
    .maybeSingle()

  if (existing) {
    // Update avatar/steam data on each login (keeps it fresh)
    await supabase
      .from('players')
      .update({
        avatar_url: profile.avatar_url || existing.avatar_url,
        steam_url: profile.steam_url,
        updated_at: new Date().toISOString(),
      })
      .eq('id', existing.id)

    return { ...existing, is_new: false }
  }

  // New player — create record
  // Handle nickname collisions by appending steamId suffix
  let nickname = profile.nickname
  const { data: nickConflict } = await supabase
    .from('players')
    .select('id')
    .eq('nickname', nickname)
    .maybeSingle()

  if (nickConflict) {
    nickname = `${nickname}_${steamId.slice(-4)}`
  }

  const { data: newPlayer, error } = await supabase
    .from('players')
    .insert({
      nickname,
      steam_id: steamId,
      steam_url: profile.steam_url,
      avatar_url: profile.avatar_url,
    })
    .select('id, nickname, avatar_url')
    .single()

  if (error) {
    console.error('Insert error:', error)
    return null
  }

  return { ...newPlayer, is_new: true }
}

function redirectWithError(msg: string) {
  return Response.redirect(
    `${SITE_URL}/steam-callback?error=${encodeURIComponent(msg)}`,
    302
  )
}

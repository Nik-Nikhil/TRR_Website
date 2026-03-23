import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'

const STEAM_OPENID_URL = 'https://steamcommunity.com/openid/login'
const STEAM_API_BASE = 'https://api.steampowered.com'

const STEAM_API_KEY = Deno.env.get('STEAM_API_KEY') ?? ''
const SITE_URL = Deno.env.get('SITE_URL') ?? 'https://www.trresports.in'
const PROJECT_URL = Deno.env.get('SUPABASE_URL') ?? 'https://qcsdshznxhhwtxdecako.supabase.co'
const SERVICE_KEY = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? Deno.env.get('SERVICE_ROLE_KEY') ?? ''

const CALLBACK_URL = `${PROJECT_URL}/functions/v1/steam-auth/callback`

Deno.serve(async (req: Request) => {
  const url = new URL(req.url)
  const path = url.pathname

  console.log(`[steam-auth] ${req.method} ${path}`)
  console.log(`[steam-auth] SITE_URL=${SITE_URL}, PROJECT_URL=${PROJECT_URL}, HAS_KEY=${!!SERVICE_KEY}, HAS_STEAM_KEY=${!!STEAM_API_KEY}`)

  // ── INIT: redirect to Steam ───────────────────────────────────────
  if (path.endsWith('/init')) {
    const params = new URLSearchParams({
      'openid.ns': 'http://specs.openid.net/auth/2.0',
      'openid.mode': 'checkid_setup',
      'openid.return_to': CALLBACK_URL,
      'openid.realm': SITE_URL,
      'openid.identity': 'http://specs.openid.net/auth/2.0/identifier_select',
      'openid.claimed_id': 'http://specs.openid.net/auth/2.0/identifier_select',
    })
    const redirectTo = `${STEAM_OPENID_URL}?${params.toString()}`
    console.log(`[steam-auth] Redirecting to Steam: ${redirectTo.slice(0, 100)}...`)
    return Response.redirect(redirectTo, 302)
  }

  // ── CALLBACK: Steam returns here ──────────────────────────────────
  if (path.endsWith('/callback')) {
    const params = url.searchParams
    console.log(`[steam-auth] Callback params: mode=${params.get('openid.mode')}, claimed_id=${params.get('openid.claimed_id')}`)

    try {
      // 1. Verify with Steam
      const verified = await verifySteamOpenID(params)
      console.log(`[steam-auth] Verification result: ${verified}`)
      if (!verified) return redirectError('Steam verification failed')

      // 2. Extract SteamID64
      const claimedId = params.get('openid.claimed_id') ?? ''
      const steamId = claimedId.split('/').pop() ?? ''
      console.log(`[steam-auth] SteamID: ${steamId}`)
      if (!steamId || !/^\d{17}$/.test(steamId)) return redirectError('Invalid Steam ID: ' + steamId)

      // 3. Fetch Steam profile
      const profile = await fetchSteamProfile(steamId)
      console.log(`[steam-auth] Profile: ${JSON.stringify(profile)}`)
      if (!profile) return redirectError('Could not fetch Steam profile')

      // 4. Upsert player
      if (!SERVICE_KEY) {
        console.error('[steam-auth] No service key available!')
        return redirectError('Server configuration error: missing service key')
      }

      const supabase = createClient(PROJECT_URL, SERVICE_KEY)
      const player = await upsertPlayer(supabase, steamId, profile)
      console.log(`[steam-auth] Player upsert result: ${JSON.stringify(player)}`)
      if (!player) return redirectError('Database error: could not create/find player')

      // 5. Redirect to frontend with session
      const session = encodeURIComponent(JSON.stringify({
        playerId: player.id,
        nickname: player.nickname,
        steamId,
        avatarUrl: player.avatar_url ?? '',
        isNewAccount: player.is_new,
      }))

      const dest = `${SITE_URL}/steam-callback?session=${session}`
      console.log(`[steam-auth] Success! Redirecting to: ${SITE_URL}/steam-callback`)
      return Response.redirect(dest, 302)

    } catch (err) {
      const msg = err instanceof Error ? `${err.message}\n${err.stack}` : String(err)
      console.error('[steam-auth] Unhandled error:', msg)
      return redirectError('Internal error: ' + (err instanceof Error ? err.message : String(err)))
    }
  }

  return new Response(JSON.stringify({ ok: true, path, SITE_URL, PROJECT_URL, HAS_KEY: !!SERVICE_KEY }), {
    headers: { 'Content-Type': 'application/json' },
  })
})

async function verifySteamOpenID(params: URLSearchParams): Promise<boolean> {
  const body = new URLSearchParams(params)
  body.set('openid.mode', 'check_authentication')
  const res = await fetch(STEAM_OPENID_URL, {
    method: 'POST',
    headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
    body: body.toString(),
  })
  const text = await res.text()
  console.log('[steam-auth] Steam verify response:', text.slice(0, 200))
  return text.includes('is_valid:true')
}

async function fetchSteamProfile(steamId: string) {
  if (!STEAM_API_KEY) {
    console.warn('[steam-auth] No STEAM_API_KEY — using fallback profile')
    return { nickname: `Player_${steamId.slice(-6)}`, avatar_url: '', steam_url: `https://steamcommunity.com/profiles/${steamId}` }
  }
  const res = await fetch(`${STEAM_API_BASE}/ISteamUser/GetPlayerSummaries/v0002/?key=${STEAM_API_KEY}&steamids=${steamId}`)
  const data = await res.json()
  const p = data?.response?.players?.[0]
  if (!p) return null
  return {
    nickname: p.personaname as string,
    avatar_url: (p.avatarfull ?? p.avatarmedium ?? p.avatar ?? '') as string,
    steam_url: `https://steamcommunity.com/profiles/${steamId}`,
  }
}

async function upsertPlayer(supabase: ReturnType<typeof createClient>, steamId: string, profile: { nickname: string; avatar_url: string; steam_url: string }) {
  // Try find existing by steam_id
  const { data: existing, error: findErr } = await supabase
    .from('players')
    .select('id, nickname, avatar_url')
    .eq('steam_id', steamId)
    .maybeSingle()

  if (findErr) console.error('[steam-auth] Find error:', findErr)

  if (existing) {
    await supabase.from('players').update({
      avatar_url: profile.avatar_url || existing.avatar_url,
      steam_url: profile.steam_url,
    }).eq('id', existing.id)
    return { ...existing, is_new: false }
  }

  // Deduplicate nickname
  let nickname = profile.nickname
  const { data: conflict } = await supabase.from('players').select('id').eq('nickname', nickname).maybeSingle()
  if (conflict) nickname = `${nickname}_${steamId.slice(-4)}`

  const { data: created, error: insertErr } = await supabase
    .from('players')
    .insert({ nickname, steam_id: steamId, steam_url: profile.steam_url, avatar_url: profile.avatar_url })
    .select('id, nickname, avatar_url')
    .single()

  if (insertErr) {
    console.error('[steam-auth] Insert error:', JSON.stringify(insertErr))
    return null
  }
  return { ...created, is_new: true }
}

function redirectError(msg: string) {
  console.error('[steam-auth] Redirecting with error:', msg)
  return Response.redirect(`${SITE_URL}/steam-callback?error=${encodeURIComponent(msg)}`, 302)
}

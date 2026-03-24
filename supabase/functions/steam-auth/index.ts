const STEAM_OPENID_URL = 'https://steamcommunity.com/openid/login'
const STEAM_API_BASE = 'https://api.steampowered.com'

const STEAM_API_KEY = Deno.env.get('STEAM_API_KEY') ?? ''
const SITE_URL = Deno.env.get('SITE_URL') ?? 'https://www.trresports.in'
const PROJECT_URL = Deno.env.get('SUPABASE_URL') ?? 'https://qcsdshznxhhwtxdecako.supabase.co'
const SERVICE_KEY = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? Deno.env.get('SERVICE_ROLE_KEY') ?? ''

// return_to MUST be on same domain as realm — so Steam redirects back to our frontend
const CALLBACK_URL = `${SITE_URL}/steam-callback`

const CORS = {
  'Access-Control-Allow-Origin': 'https://www.trresports.in',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
  'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
  'Access-Control-Max-Age': '86400',
}

console.log(`[boot] SITE_URL=${SITE_URL} CALLBACK_URL=${CALLBACK_URL} HAS_KEY=${!!SERVICE_KEY}`)

Deno.serve(async (req: Request) => {
  if (req.method === 'OPTIONS') return new Response(null, { status: 204, headers: CORS })

  const url = new URL(req.url)
  const action = url.searchParams.get('action') ?? url.pathname.split('/').pop()
  console.log(`[req] ${req.method} action=${action}`)

  // ── INIT: redirect browser to Steam ──────────────────────────────
  if (action === 'init') {
    const params = new URLSearchParams({
      'openid.ns': 'http://specs.openid.net/auth/2.0',
      'openid.mode': 'checkid_setup',
      'openid.return_to': CALLBACK_URL,
      'openid.realm': SITE_URL,
      'openid.identity': 'http://specs.openid.net/auth/2.0/identifier_select',
      'openid.claimed_id': 'http://specs.openid.net/auth/2.0/identifier_select',
    })
    console.log('[init] redirecting to Steam, return_to=' + CALLBACK_URL)
    return Response.redirect(`${STEAM_OPENID_URL}?${params}`, 302)
  }

  // ── VERIFY: called by frontend after Steam redirects back ─────────
  // Frontend receives OpenID params at /steam-callback, then POSTs them here
  if (action === 'verify' && req.method === 'POST') {
    console.log('[verify] received')
    try {
      const rawBody = await req.text()
      const body = JSON.parse(rawBody)
      const params = new URLSearchParams(body.params ?? {})
      console.log('[verify] mode=' + params.get('openid.mode') + ' claimed_id=' + params.get('openid.claimed_id'))

      // 1. Verify with Steam
      const verified = await verifySteamOpenID(params)
      console.log('[verify] verified=' + verified)
      if (!verified) return json({ error: 'Steam verification failed' }, 400)

      // 2. Extract SteamID64
      const claimedId = params.get('openid.claimed_id') ?? ''
      const steamId = claimedId.split('/').pop() ?? ''
      if (!steamId || !/^\d{17}$/.test(steamId)) return json({ error: 'Invalid Steam ID: ' + steamId }, 400)
      console.log('[verify] steamId=' + steamId)

      // 3. Fetch Steam profile
      const profile = await fetchSteamProfile(steamId)
      console.log('[verify] profile=' + JSON.stringify(profile))
      if (!profile) return json({ error: 'Could not fetch Steam profile' }, 500)

      // 4. Upsert player
      if (!SERVICE_KEY) return json({ error: 'Missing service key' }, 500)
      const { createClient } = await import('https://esm.sh/@supabase/supabase-js@2')
      const supabase = createClient(PROJECT_URL, SERVICE_KEY)
      const player = await upsertPlayer(supabase, steamId, profile)
      console.log('[verify] player=' + JSON.stringify(player))
      if (!player) return json({ error: 'Database error' }, 500)

      return json({
        playerId: player.id,
        nickname: player.nickname,
        steamId,
        avatarUrl: player.avatar_url ?? '',
        isNewAccount: player.is_new,
      })

    } catch (err) {
      const msg = err instanceof Error ? err.message : String(err)
      console.error('[verify] ERROR: ' + msg)
      return json({ error: 'Internal error: ' + msg }, 500)
    }
  }

  return json({ ok: true, SITE_URL, CALLBACK_URL, HAS_KEY: !!SERVICE_KEY })
})

function json(data: unknown, status = 200) {
  return new Response(JSON.stringify(data), {
    status,
    headers: { ...CORS, 'Content-Type': 'application/json' },
  })
}

async function verifySteamOpenID(params: URLSearchParams): Promise<boolean> {
  const body = new URLSearchParams(params)
  body.set('openid.mode', 'check_authentication')
  const res = await fetch(STEAM_OPENID_URL, {
    method: 'POST',
    headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
    body: body.toString(),
  })
  const text = await res.text()
  console.log('[verify-steam] ' + text.slice(0, 100))
  return text.includes('is_valid:true')
}

async function fetchSteamProfile(steamId: string) {
  if (!STEAM_API_KEY) {
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

// deno-lint-ignore no-explicit-any
async function upsertPlayer(supabase: any, steamId: string, profile: { nickname: string; avatar_url: string; steam_url: string }) {
  const { data: existing, error: findErr } = await supabase
    .from('players').select('id, nickname, avatar_url').eq('steam_id', steamId).maybeSingle()
  if (findErr) console.error('[upsert] find error: ' + JSON.stringify(findErr))

  if (existing) {
    await supabase.from('players').update({ avatar_url: profile.avatar_url || existing.avatar_url, steam_url: profile.steam_url }).eq('id', existing.id)
    return { ...existing, is_new: false }
  }

  let nickname = profile.nickname
  const { data: conflict } = await supabase.from('players').select('id').eq('nickname', nickname).maybeSingle()
  if (conflict) nickname = `${nickname}_${steamId.slice(-4)}`

  const { data: created, error: insertErr } = await supabase
    .from('players')
    .insert({ nickname, steam_id: steamId, steam_url: profile.steam_url, avatar_url: profile.avatar_url })
    .select('id, nickname, avatar_url')
    .single()

  if (insertErr) {
    console.error('[upsert] insert error: ' + JSON.stringify(insertErr))
    return null
  }
  return { ...created, is_new: true }
}

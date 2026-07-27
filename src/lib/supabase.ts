import { createClient } from '@supabase/supabase-js'
import { DATABASE_CONFIG } from '../utils'

// Your Supabase credentials
const supabaseUrl = DATABASE_CONFIG.supabaseUrl
const supabaseAnonKey = DATABASE_CONFIG.supabaseAnonKey

// Use a global singleton to avoid creating multiple GoTrueClient instances
// (which causes the runtime warning when HMR or multiple imports occur).
declare global {
  // Allow attaching to globalThis in TS
  interface Window { __supabase?: ReturnType<typeof createClient> }
  var __supabase: ReturnType<typeof createClient> | undefined
}

const _global = (typeof globalThis !== 'undefined' ? globalThis : window) as any;
if (!_global.__supabase) {
  _global.__supabase = createClient(supabaseUrl, supabaseAnonKey)
}

export const supabase = _global.__supabase as ReturnType<typeof createClient>

// Database types for TypeScript
export interface Player {
  id: string
  nickname: string
  real_name?: string
  discord_username?: string
  steam_url?: string
  avatar_url?: string
  current_mmr?: number
  ping_range?: string
  preferred_roles?: string[]
  created_at?: string
  updated_at?: string
}

export interface Registration {
  id: string
  player_id: string
  tournament_season: string
  status: 'pending' | 'approved' | 'rejected'
  additional_info?: string
  registered_at?: string
}

export interface Team {
  id: string
  name: string
  captain_id: string
  created_at?: string
  updated_at?: string
}

export interface TeamMember {
  id: string
  team_id: string
  player_id: string
  role?: string
  joined_at?: string
}
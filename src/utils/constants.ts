// Application constants
export const APP_CONFIG = {
  name: 'The Roshan Rumble',
  version: '2.0.0',
  description: 'Ultimate Dota 2 Tournament Platform'
};

// Database configuration
export const DATABASE_CONFIG = {
  supabaseUrl: 'https://qcsdshznxhhwtxdecako.supabase.co',
  supabaseAnonKey: 'sb_publishable_UmAag0GJGmffqvCRILpXNA_7bc7Cvtf'
};

// Authentication constants
export const AUTH_CONFIG = {
  playerSessionDuration: 24 * 60 * 60 * 1000, // 24 hours
  adminSessionDuration: 8 * 60 * 60 * 1000,   // 8 hours
  defaultPasswords: {
    player: 'player123',
    founder: 'founder2024',
    admin: 'admin2024',
    miniAdmin: 'mini2024'
  }
};

// Steam OpenID configuration
export const STEAM_CONFIG = {
  apiKey: 'YOUR_STEAM_API_KEY',
  openIdUrl: 'https://steamcommunity.com/openid/login',
  returnUrl: window.location.origin + '/steam-callback'
};

// Dota 2 roles
export const DOTA_ROLES = [
  { id: 'carry', name: 'Carry', iconSrc: '/icons/pos_1.png' },
  { id: 'mid', name: 'Mid', iconSrc: '/icons/pos_2.png' },
  { id: 'offlane', name: 'Offlane', iconSrc: '/icons/pos_3.png' },
  { id: 'support', name: 'Soft Support', iconSrc: '/icons/pos_4.png' },
  { id: 'hard-support', name: 'Hard Support', iconSrc: '/icons/pos_5.png' }
];

// Ping options
export const PING_OPTIONS = [
  { id: 'low', name: 'Low (0-50ms)', description: 'Excellent connection' },
  { id: 'medium', name: 'Medium (50-100ms)', description: 'Good connection' },
  { id: 'high', name: 'High (100-150ms)', description: 'Playable connection' },
  { id: 'very-high', name: 'Very High (150ms+)', description: 'May affect gameplay' }
];

// Admin roles and hierarchy
export const ADMIN_ROLES = {
  FOUNDER: 'Founder',
  ADMIN: 'Admin',
  MINI_ADMIN: 'Mini Admin'
};

export const ROLE_HIERARCHY: Record<string, number> = {
  [ADMIN_ROLES.FOUNDER]: 3,
  [ADMIN_ROLES.ADMIN]: 2,
  [ADMIN_ROLES.MINI_ADMIN]: 1
};

// Tournament seasons
export const TOURNAMENT_SEASONS = [
  'Season 1',
  'Season 2', 
  'Season 3',
  'Season 4',
  'Season 5',
  'Season 6'
];

// API endpoints
export const API_ENDPOINTS = {
  players: '/api/players',
  teams: '/api/teams',
  registrations: '/api/registrations',
  auth: '/api/auth'
};
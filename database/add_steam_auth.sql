-- =====================================================
-- ADD STEAM AUTH SUPPORT TO PLAYERS TABLE
-- Run this in your Supabase SQL editor
-- =====================================================

-- Add steam_id column (unique, nullable — existing players won't have it)
ALTER TABLE players ADD COLUMN IF NOT EXISTS steam_id VARCHAR(20) UNIQUE;

-- Add steam_url column if not already present
ALTER TABLE players ADD COLUMN IF NOT EXISTS steam_url TEXT;

-- Index for fast steam_id lookups on every login
CREATE INDEX IF NOT EXISTS idx_players_steam_id ON players(steam_id);

SELECT 'Steam auth columns added successfully.' AS status;

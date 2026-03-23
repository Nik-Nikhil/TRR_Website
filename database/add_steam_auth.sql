-- =====================================================
-- ADD STEAM AUTH SUPPORT TO PLAYERS TABLE
-- Run this in your Supabase SQL editor
-- =====================================================

-- Add steam_id column (unique, nullable — existing players won't have it)
DO $$
BEGIN
    IF NOT EXISTS (
        SELECT 1 FROM information_schema.columns
        WHERE table_name = 'players' AND column_name = 'steam_id'
    ) THEN
        ALTER TABLE players ADD COLUMN steam_id VARCHAR(20) UNIQUE;
    END IF;
END $$;

-- Index for fast steam_id lookups on every login
CREATE INDEX IF NOT EXISTS idx_players_steam_id ON players(steam_id);

-- Allow the edge function (service role) to bypass RLS
-- The function uses the service role key so this is already handled,
-- but make the policy explicit for clarity:
DROP POLICY IF EXISTS "Service role can upsert players" ON players;

SELECT 'Steam auth columns added successfully.' AS status;

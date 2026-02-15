-- =====================================================
-- VERIFY PLAYERS IN DATABASE
-- Run these queries in Supabase SQL Editor to check player data
-- =====================================================

-- 1. Count total players
SELECT COUNT(*) as total_players FROM players;

-- 2. Check if specific player exists (nikhil)
SELECT * FROM players WHERE nickname = 'nikhil';

-- 3. List first 10 players
SELECT id, nickname, real_name, avatar_url, current_mmr 
FROM players 
ORDER BY nickname 
LIMIT 10;

-- 4. Check for any players with NULL nicknames
SELECT COUNT(*) as null_nicknames FROM players WHERE nickname IS NULL;

-- 5. Check players table structure
SELECT column_name, data_type, is_nullable
FROM information_schema.columns
WHERE table_name = 'players'
ORDER BY ordinal_position;

-- 6. Search for players by partial nickname match
SELECT id, nickname, real_name, avatar_url
FROM players
WHERE nickname ILIKE '%nik%'
ORDER BY nickname;

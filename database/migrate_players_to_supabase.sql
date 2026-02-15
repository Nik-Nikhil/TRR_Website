-- =====================================================
-- MIGRATE PLAYERS FROM LOCAL DATA TO SUPABASE
-- =====================================================
-- This script will insert all players from your local data file
-- Run this in Supabase SQL Editor

-- First, let's make sure the players table has all necessary columns
-- (Run supabase_setup.sql first if you haven't already)

-- Clear existing test data (OPTIONAL - remove this if you want to keep existing data)
-- TRUNCATE TABLE players CASCADE;

-- =====================================================
-- INSERT PLAYERS
-- =====================================================
-- NOTE: You need to manually copy player data from src/data/players.ts
-- and convert it to SQL INSERT statements

-- Example format:
-- INSERT INTO players (
--   id, nickname, real_name, avatar_url, 
--   current_mmr, peak_mmr, current_medal_label, current_medal_id,
--   peak_medal_label, peak_medal_id, bio, steam_url, dotabuff_url,
--   ping_range, preferred_roles, season_badges, has_won_cup
-- ) VALUES (
--   'player-id', 'Nickname', 'Real Name', '/avatars/player.jpg',
--   3500, 4400, 'Legend 3', 'legend_3',
--   'Ancient 4', 'ancient_4', 'Bio text', 'steam-url', 'dotabuff-url',
--   '50-100', ARRAY['Carry', 'Mid'], ARRAY['1', '2', '3'], false
-- );

-- =====================================================
-- AUTOMATED MIGRATION SCRIPT
-- =====================================================
-- Since manually converting is tedious, let's create a TypeScript migration script instead
-- See: utils/migratePlayersToSupabase.ts

-- After running the TypeScript migration, verify with:
SELECT COUNT(*) as total_players FROM players;
SELECT nickname, current_medal_label, avatar_url FROM players LIMIT 10;

-- Check for any missing data:
SELECT 
  COUNT(*) as total,
  COUNT(avatar_url) as has_avatar,
  COUNT(current_mmr) as has_mmr,
  COUNT(bio) as has_bio
FROM players;

-- Debug Avatar Update Issues
-- Run these queries in Supabase SQL Editor to diagnose the problem

-- 1. Check if players table exists
SELECT table_name 
FROM information_schema.tables 
WHERE table_schema = 'public' AND table_name = 'players';

-- 2. Check players table structure
SELECT column_name, data_type, is_nullable
FROM information_schema.columns
WHERE table_name = 'players'
ORDER BY ordinal_position;

-- 3. Check if player 'nikhil' exists
SELECT id, nickname, avatar_url, updated_at
FROM players
WHERE nickname = 'nikhil' OR id = 'nikhil';

-- 4. Check pending profile image requests
SELECT id, user_id, user_type, current_image_url, new_image_url, status
FROM profile_image_updates
WHERE status = 'pending'
ORDER BY requested_at DESC;

-- 5. Try to manually update avatar (TEST)
-- Replace 'PLAYER_ID_HERE' with actual player ID from query #3
-- UPDATE players 
-- SET avatar_url = 'https://example.com/test.jpg', updated_at = NOW()
-- WHERE id = 'PLAYER_ID_HERE';

-- 6. Check if update worked
-- SELECT id, nickname, avatar_url, updated_at
-- FROM players
-- WHERE id = 'PLAYER_ID_HERE';

-- COMMON ISSUES:
-- Issue 1: Player ID mismatch
--   - The request has user_id as TEXT (e.g., 'nikhil')
--   - But players table uses UUID for id
--   - Solution: Match by nickname instead of id

-- Issue 2: Table doesn't exist
--   - Run supabase_setup.sql first

-- Issue 3: Permission denied
--   - Check RLS policies on players table
--   - May need to disable RLS or add policies

-- RECOMMENDED FIX:
-- If player IDs are stored as nicknames in profile_image_updates,
-- update the query to match by nickname:
-- UPDATE players 
-- SET avatar_url = 'new_url', updated_at = NOW()
-- WHERE nickname = 'nikhil';  -- Instead of WHERE id = 'nikhil'

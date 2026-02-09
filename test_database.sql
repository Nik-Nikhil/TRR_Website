-- =====================================================
-- VERIFICATION QUERIES
-- Run these to verify your database setup
-- =====================================================

-- 1. Check all tables exist (should show 12 tables)
SELECT table_name 
FROM information_schema.tables 
WHERE table_schema = 'public' 
ORDER BY table_name;

-- 2. Check admin accounts (should show 10 admins)
SELECT username, display_name, role 
FROM admins 
ORDER BY role, username;

-- 3. Check RLS is enabled (all should show 't')
SELECT tablename, rowsecurity 
FROM pg_tables 
WHERE schemaname = 'public'
ORDER BY tablename;

-- 4. Check players table columns
SELECT column_name, data_type 
FROM information_schema.columns 
WHERE table_name = 'players' 
ORDER BY ordinal_position;

-- 5. Count records in each table
SELECT 
    'players' as table_name, COUNT(*) as count FROM players
UNION ALL
SELECT 'admins', COUNT(*) FROM admins
UNION ALL
SELECT 'captains', COUNT(*) FROM captains
UNION ALL
SELECT 'teams', COUNT(*) FROM teams
UNION ALL
SELECT 'auctions', COUNT(*) FROM auctions
UNION ALL
SELECT 'auction_bids', COUNT(*) FROM auction_bids
UNION ALL
SELECT 'auction_results', COUNT(*) FROM auction_results
UNION ALL
SELECT 'registrations', COUNT(*) FROM registrations;

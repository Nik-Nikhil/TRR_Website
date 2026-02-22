-- =====================================================
-- FORCE SCHEMA RELOAD - Nuclear option
-- This will force PostgREST to completely reload
-- =====================================================

-- Method 1: Send reload signal
SELECT pg_notify('pgrst', 'reload schema');

-- Method 2: Update a dummy setting to trigger reload
-- (This forces PostgREST to detect a change)
DO $$
BEGIN
    -- Create a dummy table and drop it to trigger schema change detection
    CREATE TABLE IF NOT EXISTS _schema_reload_trigger (id INT);
    DROP TABLE IF EXISTS _schema_reload_trigger;
END $$;

-- Method 3: Verify the actual columns in auction_pool
SELECT column_name, data_type, column_default
FROM information_schema.columns
WHERE table_name = 'auction_pool'
ORDER BY ordinal_position;

-- =====================================================
-- DONE!
-- =====================================================
SELECT 'Schema reload forced! Now restart the API from Supabase Dashboard.' as status;

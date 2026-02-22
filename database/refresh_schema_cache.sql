-- =====================================================
-- REFRESH SUPABASE SCHEMA CACHE
-- Forces PostgREST to reload the schema
-- =====================================================

-- Notify PostgREST to reload schema cache
NOTIFY pgrst, 'reload schema';

-- Alternative: You can also restart the PostgREST service
-- from the Supabase dashboard under Settings > API

-- =====================================================
-- DONE!
-- =====================================================
SELECT 'Schema cache refresh requested!' as status;

-- =====================================================
-- CLEAN AUCTION_POOL - Remove old views and constraints
-- Run this FIRST before fix_auction_pool_schema.sql
-- =====================================================

-- Drop the view if it exists (it might reference old columns)
DROP VIEW IF EXISTS available_auction_players CASCADE;

-- Now recreate the view with correct columns
CREATE OR REPLACE VIEW available_auction_players AS
SELECT 
    ap.id,
    ap.player_id,
    ap.base_price,
    ap.player_type,
    ap.player_data,
    ap.auction_id,
    ap.is_sold,
    ap.added_at,
    p.nickname,
    p.avatar_url,
    p.current_mmr,
    p.current_medal_label,
    p.roles
FROM auction_pool ap
LEFT JOIN players p ON ap.player_id = p.id
WHERE ap.is_sold = false
ORDER BY ap.added_at DESC;

-- =====================================================
-- DONE!
-- =====================================================
SELECT 'Auction pool cleaned successfully!' as status;

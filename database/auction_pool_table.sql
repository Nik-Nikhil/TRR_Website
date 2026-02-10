-- =====================================================
-- AUCTION POOL TABLE
-- Stores players available for auction
-- =====================================================

CREATE TABLE IF NOT EXISTS auction_pool (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    player_id UUID REFERENCES players(id) ON DELETE CASCADE,
    auction_id UUID REFERENCES auctions(id) ON DELETE SET NULL,
    base_price INTEGER NOT NULL DEFAULT 50,
    
    -- Status
    is_sold BOOLEAN DEFAULT false,
    sold_for INTEGER,
    sold_to_captain_id UUID REFERENCES players(id) ON DELETE SET NULL,
    
    -- Timestamps
    added_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    sold_at TIMESTAMP WITH TIME ZONE,
    
    -- Ensure player is only in pool once per auction
    UNIQUE(player_id, auction_id)
);

-- Indexes
CREATE INDEX IF NOT EXISTS idx_auction_pool_player ON auction_pool(player_id);
CREATE INDEX IF NOT EXISTS idx_auction_pool_auction ON auction_pool(auction_id);
CREATE INDEX IF NOT EXISTS idx_auction_pool_sold ON auction_pool(is_sold);

-- Enable RLS
ALTER TABLE auction_pool ENABLE ROW LEVEL SECURITY;

-- Policies
DROP POLICY IF EXISTS "Auction pool is viewable by everyone" ON auction_pool;
CREATE POLICY "Auction pool is viewable by everyone" ON auction_pool 
    FOR SELECT USING (true);

DROP POLICY IF EXISTS "Anyone can insert to pool" ON auction_pool;
CREATE POLICY "Anyone can insert to pool" ON auction_pool 
    FOR INSERT WITH CHECK (true);

DROP POLICY IF EXISTS "Anyone can update pool" ON auction_pool;
CREATE POLICY "Anyone can update pool" ON auction_pool 
    FOR UPDATE USING (true);

DROP POLICY IF EXISTS "Anyone can delete from pool" ON auction_pool;
CREATE POLICY "Anyone can delete from pool" ON auction_pool 
    FOR DELETE USING (true);

-- =====================================================
-- VIEW: Available players for auction
-- =====================================================
CREATE OR REPLACE VIEW available_auction_players AS
SELECT 
    ap.*,
    p.nickname,
    p.avatar_url,
    p.current_mmr,
    p.current_medal_label,
    p.roles
FROM auction_pool ap
JOIN players p ON ap.player_id = p.id
WHERE ap.is_sold = false
ORDER BY ap.added_at DESC;

-- =====================================================
-- FUNCTION: Get random player from pool
-- =====================================================
CREATE OR REPLACE FUNCTION get_random_auction_player(p_auction_id UUID DEFAULT NULL)
RETURNS TABLE (
    id UUID,
    player_id UUID,
    base_price INTEGER,
    nickname VARCHAR,
    avatar_url TEXT,
    current_mmr INTEGER,
    roles JSONB
) AS $$
BEGIN
    RETURN QUERY
    SELECT 
        ap.id,
        ap.player_id,
        ap.base_price,
        p.nickname,
        p.avatar_url,
        p.current_mmr,
        p.roles
    FROM auction_pool ap
    JOIN players p ON ap.player_id = p.id
    WHERE ap.is_sold = false
    AND (p_auction_id IS NULL OR ap.auction_id = p_auction_id OR ap.auction_id IS NULL)
    ORDER BY RANDOM()
    LIMIT 1;
END;
$$ LANGUAGE plpgsql;

-- =====================================================
-- FUNCTION: Mark player as sold
-- =====================================================
CREATE OR REPLACE FUNCTION mark_player_sold(
    p_pool_id UUID,
    p_sold_for INTEGER,
    p_captain_id UUID
)
RETURNS BOOLEAN AS $$
BEGIN
    UPDATE auction_pool
    SET 
        is_sold = true,
        sold_for = p_sold_for,
        sold_to_captain_id = p_captain_id,
        sold_at = NOW()
    WHERE id = p_pool_id;
    
    RETURN FOUND;
END;
$$ LANGUAGE plpgsql;

-- =====================================================
-- QUERIES FOR TESTING
-- =====================================================

-- View all players in pool
-- SELECT * FROM available_auction_players;

-- Get random player
-- SELECT * FROM get_random_auction_player();

-- Count available players
-- SELECT COUNT(*) as available_count FROM auction_pool WHERE is_sold = false;

-- =====================================================
-- DONE!
-- =====================================================
SELECT 'Auction pool table created successfully!' as status;

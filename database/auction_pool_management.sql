-- =====================================================
-- AUCTION POOL MANAGEMENT
-- =====================================================
-- This table stores players added to the auction pool
-- Only players in this pool can be auctioned

-- Create auction_pool table if it doesn't exist
DO $$ 
BEGIN
    IF NOT EXISTS (SELECT 1 FROM information_schema.tables WHERE table_name='auction_pool') THEN
        CREATE TABLE auction_pool (
            id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
            auction_id UUID REFERENCES auctions(id) ON DELETE CASCADE,
            player_id UUID NOT NULL,
            player_data JSONB NOT NULL,
            status VARCHAR(20) DEFAULT 'available' CHECK (status IN ('available', 'sold', 'removed')),
            added_by VARCHAR(100),
            added_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
            sold_at TIMESTAMP WITH TIME ZONE,
            UNIQUE(auction_id, player_id)
        );

        -- Create index for faster queries
        CREATE INDEX idx_auction_pool_auction_id ON auction_pool(auction_id);
        CREATE INDEX idx_auction_pool_status ON auction_pool(status);
        CREATE INDEX idx_auction_pool_player_id ON auction_pool(player_id);
    END IF;
END $$;

-- Enable RLS
ALTER TABLE auction_pool ENABLE ROW LEVEL SECURITY;

-- Drop existing policies if they exist
DROP POLICY IF EXISTS "Allow public read access to auction pool" ON auction_pool;
DROP POLICY IF EXISTS "Allow authenticated users to manage auction pool" ON auction_pool;

-- Create policies
CREATE POLICY "Allow public read access to auction pool"
    ON auction_pool FOR SELECT
    USING (true);

CREATE POLICY "Allow authenticated users to manage auction pool"
    ON auction_pool FOR ALL
    USING (true)
    WITH CHECK (true);

-- Grant permissions
GRANT ALL ON auction_pool TO authenticated;
GRANT ALL ON auction_pool TO anon;


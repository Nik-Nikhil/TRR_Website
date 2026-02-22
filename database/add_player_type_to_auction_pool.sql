-- =====================================================
-- ADD PLAYER_TYPE COLUMN TO AUCTION_POOL
-- Allows separating Core and Support players
-- =====================================================

-- Add player_type column if it doesn't exist
DO $$ 
BEGIN
    IF NOT EXISTS (
        SELECT 1 FROM information_schema.columns 
        WHERE table_name = 'auction_pool' 
        AND column_name = 'player_type'
    ) THEN
        ALTER TABLE auction_pool 
        ADD COLUMN player_type VARCHAR(20) DEFAULT 'core' CHECK (player_type IN ('core', 'support'));
        
        -- Create index for faster filtering
        CREATE INDEX IF NOT EXISTS idx_auction_pool_player_type ON auction_pool(player_type);
        
        RAISE NOTICE 'Added player_type column to auction_pool table';
    ELSE
        RAISE NOTICE 'player_type column already exists';
    END IF;
END $$;

-- =====================================================
-- DONE!
-- =====================================================
SELECT 'Player type column added successfully!' as status;

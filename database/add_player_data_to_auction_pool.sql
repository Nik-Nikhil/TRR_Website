-- =====================================================
-- ADD PLAYER_DATA COLUMN TO AUCTION_POOL
-- Stores player information as JSONB for quick access
-- =====================================================

-- Add player_data column if it doesn't exist
DO $$ 
BEGIN
    IF NOT EXISTS (
        SELECT 1 FROM information_schema.columns 
        WHERE table_name = 'auction_pool' 
        AND column_name = 'player_data'
    ) THEN
        ALTER TABLE auction_pool 
        ADD COLUMN player_data JSONB;
        
        -- Create index for faster queries
        CREATE INDEX IF NOT EXISTS idx_auction_pool_player_data ON auction_pool USING GIN (player_data);
        
        RAISE NOTICE 'Added player_data column to auction_pool table';
    ELSE
        RAISE NOTICE 'player_data column already exists';
    END IF;
END $$;

-- =====================================================
-- DONE!
-- =====================================================
SELECT 'Player data column added successfully!' as status;

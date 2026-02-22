-- =====================================================
-- FIX AUCTION_POOL TABLE SCHEMA
-- Adds missing columns and fixes defaults
-- =====================================================

-- Add player_data column (JSONB to store full player info)
ALTER TABLE auction_pool 
ADD COLUMN IF NOT EXISTS player_data JSONB;

-- Add player_type column (core or support)
ALTER TABLE auction_pool 
ADD COLUMN IF NOT EXISTS player_type VARCHAR(20) DEFAULT 'core' 
CHECK (player_type IN ('core', 'support'));

-- Update base_price default to 0
ALTER TABLE auction_pool 
ALTER COLUMN base_price SET DEFAULT 0;

-- Update existing records to have base_price = 0
UPDATE auction_pool 
SET base_price = 0 
WHERE base_price IS NULL OR base_price != 0;

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_auction_pool_player_type ON auction_pool(player_type);
CREATE INDEX IF NOT EXISTS idx_auction_pool_player_data ON auction_pool USING GIN (player_data);

-- =====================================================
-- DONE!
-- =====================================================
SELECT 'Auction pool schema fixed successfully!' as status;

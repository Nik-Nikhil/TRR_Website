-- Add unique constraint to prevent duplicate auction results
-- This ensures a player can only be sold once per auction

-- First, clean up any existing duplicates (run fix_duplicate_auction_results.sql first)

-- Add unique constraint
DO $$ 
BEGIN
    -- Check if constraint already exists
    IF NOT EXISTS (
        SELECT 1 FROM pg_constraint 
        WHERE conname = 'unique_player_per_auction'
    ) THEN
        -- Add the constraint
        ALTER TABLE auction_results
        ADD CONSTRAINT unique_player_per_auction 
        UNIQUE (auction_id, player_id);
        
        RAISE NOTICE 'Unique constraint added successfully';
    ELSE
        RAISE NOTICE 'Unique constraint already exists';
    END IF;
END $$;

-- Verify the constraint
SELECT 
    conname as constraint_name,
    contype as constraint_type,
    pg_get_constraintdef(oid) as definition
FROM pg_constraint
WHERE conname = 'unique_player_per_auction';

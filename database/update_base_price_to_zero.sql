-- =====================================================
-- UPDATE BASE PRICE TO 0 FOR ALL PLAYERS
-- Sets default base price to 0 instead of 50
-- =====================================================

-- Update all existing players to have base_price = 0
UPDATE auction_pool 
SET base_price = 0 
WHERE base_price != 0;

-- Alter the default value for future inserts
ALTER TABLE auction_pool 
ALTER COLUMN base_price SET DEFAULT 0;

-- =====================================================
-- DONE!
-- =====================================================
SELECT 'Base prices updated to 0 successfully!' as status;

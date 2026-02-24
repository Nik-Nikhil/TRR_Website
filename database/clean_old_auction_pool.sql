-- Clean up auction_pool entries that don't belong to the current active auction
-- Run this if you see old players appearing in the pool

-- First, check what auction is currently active
SELECT id, name, status, created_at 
FROM auctions 
WHERE status IN ('live', 'paused')
ORDER BY created_at DESC 
LIMIT 1;

-- Delete auction_pool entries that don't match the current auction
-- Replace 'YOUR_CURRENT_AUCTION_ID' with the ID from the query above
DELETE FROM auction_pool
WHERE auction_id NOT IN (
  SELECT id FROM auctions 
  WHERE status IN ('live', 'paused')
  ORDER BY created_at DESC 
  LIMIT 1
);

-- Or, if you want to clear ALL auction_pool entries and start fresh:
-- DELETE FROM auction_pool;

-- Verify the cleanup
SELECT 
  ap.id,
  ap.auction_id,
  ap.player_data->>'nickname' as player_name,
  ap.player_type,
  a.name as auction_name,
  a.status as auction_status
FROM auction_pool ap
LEFT JOIN auctions a ON ap.auction_id = a.id
ORDER BY ap.added_at DESC;

-- AGGRESSIVE CLEANUP - Remove ALL duplicates and fix auction pool

-- Step 1: Delete ALL duplicate auction results (keep only the first one per player per auction)
DELETE FROM auction_results
WHERE ctid NOT IN (
  SELECT MIN(ctid)
  FROM auction_results
  GROUP BY auction_id, player_id
);

-- Step 2: Delete ALL duplicate chat messages (keep only the first one)
DELETE FROM auction_chat
WHERE ctid NOT IN (
  SELECT MIN(ctid)
  FROM auction_chat
  GROUP BY auction_id, sender_id, message, created_at
);

-- Step 3: Fix auction_pool - mark ALL sold players as sold
UPDATE auction_pool ap
SET 
  is_sold = true,
  sold_at = COALESCE(ap.sold_at, NOW())
FROM auction_results ar
WHERE ap.auction_id = ar.auction_id
  AND ap.player_id::text = ar.player_id::text
  AND ap.is_sold = false;

-- Step 4: Verify results
SELECT 
  'Auction Results' as table_name,
  COUNT(*) as total_rows,
  COUNT(DISTINCT player_id) as unique_players
FROM auction_results;

SELECT 
  'Auction Pool' as table_name,
  COUNT(*) FILTER (WHERE is_sold = true) as sold_count,
  COUNT(*) FILTER (WHERE is_sold = false) as available_count
FROM auction_pool;

SELECT 
  'Chat Messages' as table_name,
  COUNT(*) as total_messages
FROM auction_chat;

-- Step 5: Show any remaining duplicates (should be 0)
SELECT 
  'DUPLICATES IN AUCTION_RESULTS' as issue,
  auction_id,
  player_id,
  COUNT(*) as count
FROM auction_results
GROUP BY auction_id, player_id
HAVING COUNT(*) > 1;

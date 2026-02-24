-- Fix Duplicate Auction Results
-- This script removes duplicate entries where the same player was sold multiple times in the same auction

-- Step 1: Find and delete duplicate auction results, keeping only the earliest one
WITH duplicates AS (
  SELECT 
    id,
    ROW_NUMBER() OVER (
      PARTITION BY auction_id, player_id 
      ORDER BY sold_at ASC
    ) as rn
  FROM auction_results
)
DELETE FROM auction_results
WHERE id IN (
  SELECT id FROM duplicates WHERE rn > 1
);

-- Step 2: Update auction_pool to mark sold players correctly
-- This ensures players marked as sold in auction_results are also marked in auction_pool
UPDATE auction_pool
SET 
  is_sold = true,
  sold_at = COALESCE(sold_at, NOW())
WHERE player_id::text IN (
  SELECT DISTINCT player_id::text
  FROM auction_results 
  WHERE auction_id = auction_pool.auction_id
)
AND is_sold = false;

-- Step 3: Verify the cleanup
SELECT 
  'Duplicate Results Removed' as status,
  COUNT(*) as remaining_results
FROM auction_results;

SELECT 
  'Auction Pool Status' as status,
  COUNT(*) FILTER (WHERE is_sold = true) as sold_count,
  COUNT(*) FILTER (WHERE is_sold = false) as available_count
FROM auction_pool;

-- Step 4: Show any remaining duplicates (should be 0)
SELECT 
  auction_id,
  player_id,
  COUNT(*) as duplicate_count
FROM auction_results
GROUP BY auction_id, player_id
HAVING COUNT(*) > 1;

# Fix Duplicate Auction Results

## Problem
Players appear multiple times in the sold list and still show in the available pool after being sold.

## Solution
Run these SQL scripts in order in your Supabase SQL Editor:

### Step 1: Clean up existing duplicates
Run `fix_duplicate_auction_results.sql`

This will:
- Remove duplicate entries in `auction_results` (keeps only the first sale)
- Update `auction_pool` to mark sold players correctly
- Show you the cleanup results

### Step 2: Add unique constraint to prevent future duplicates
Run `add_unique_constraint_auction_results.sql`

This will:
- Add a unique constraint on (auction_id, player_id)
- Prevent the same player from being sold twice in the same auction

### Step 3: Verify the fix
After running both scripts, check:

```sql
-- Should return 0 rows (no duplicates)
SELECT 
  auction_id,
  player_id,
  COUNT(*) as duplicate_count
FROM auction_results
GROUP BY auction_id, player_id
HAVING COUNT(*) > 1;

-- Check auction pool status
SELECT 
  COUNT(*) FILTER (WHERE is_sold = true) as sold_count,
  COUNT(*) FILTER (WHERE is_sold = false) as available_count
FROM auction_pool;
```

## Code Changes Made

The following code changes have been made to prevent future duplicates:

1. **Added `isSaleInProgress` ref** - Prevents multiple simultaneous sale executions
2. **Early duplicate check** - Checks if player is already sold before processing
3. **Deduplication in UI** - Uses Map to deduplicate players by ID when displaying
4. **Filter by `is_sold` flag** - Only loads unsold players in available tab
5. **Unique player IDs** - Ensures each player appears only once in sold list

## Testing

After applying the fixes:

1. Refresh the auction page
2. Check the "Available" tab - sold players should not appear
3. Check the "Sold" tab - each player should appear only once
4. Try selling a player - should work without duplicates
5. Switch between tabs - counts should remain consistent

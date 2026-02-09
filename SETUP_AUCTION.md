# Setting Up Your First Auction

## Quick Fix for 404 Error

The 404 error happens because there's no auction in the Supabase database yet. Here's how to fix it:

### Option 1: Create Auction via Admin Panel (Recommended)
1. Go to your admin panel
2. Look for "Auction Management" or "Start Auction" button
3. Click "Start Auction" - this will create the first auction in Supabase

### Option 2: Create Auction Manually in Supabase

1. Go to your Supabase dashboard: https://xdecako.supabase.co
2. Click on "Table Editor" in the left sidebar
3. Select the `auctions` table
4. Click "Insert" → "Insert row"
5. Fill in:
   - `name`: "Season 1 Auction"
   - `season`: "1"
   - `status`: "not-started"
   - `created_by`: "admin"
   - `deletion_status`: "active"
6. Click "Save"

### Option 3: Run SQL Query

Go to Supabase SQL Editor and run:

```sql
INSERT INTO auctions (name, season, status, created_by, deletion_status)
VALUES ('Season 1 Auction', '1', 'not-started', 'admin', 'active');
```

## After Creating the Auction

1. Refresh your auction page
2. The 404 error should be gone
3. You should see "Auction Status: Not Started"
4. Admin can now start the auction and set players

## Troubleshooting

### Still getting 404?
- Check browser console for errors (F12 → Console tab)
- Verify Supabase connection in `.env` file
- Make sure the `auctions` table exists in Supabase

### Can't see captains?
- Make sure you've assigned captains in the admin panel
- Check the `captains` table in Supabase

### Bids not showing?
- Make sure the auction status is "live"
- Check that you're logged in as a captain
- Verify the `auction_bids` table exists

## Testing Real-time Sync

1. Open auction page on two different browsers/devices
2. Start the auction from admin panel
3. Place a bid from one browser
4. **You should see it appear instantly on the other browser!**

This confirms the Supabase real-time sync is working correctly.

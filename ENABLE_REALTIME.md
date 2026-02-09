# Enable Supabase Realtime

To make the auction system update instantly without refresh, you need to enable Realtime on your Supabase tables.

## Steps to Enable Realtime:

### 1. Go to Supabase Dashboard
- Visit: https://supabase.com/dashboard
- Select your project: `qcsdshznxhhwtxdecako`

### 2. Enable Realtime for Tables

Go to **Database** → **Replication** in the left sidebar, then enable realtime for these tables:

#### Required Tables:
- ✅ `auctions` - For auction state changes (start/stop/pause/player selection)
- ✅ `auction_bids` - For bid updates
- ✅ `captains` - For captain assignments
- ✅ `auction_results` - For sold players

### 3. How to Enable:

For each table:
1. Find the table in the Replication page
2. Toggle the switch to **ON** for "Realtime"
3. Click **Save**

### 4. Alternative: SQL Command

You can also run this SQL in the SQL Editor:

```sql
-- Enable realtime for auctions table
ALTER PUBLICATION supabase_realtime ADD TABLE auctions;

-- Enable realtime for auction_bids table
ALTER PUBLICATION supabase_realtime ADD TABLE auction_bids;

-- Enable realtime for captains table
ALTER PUBLICATION supabase_realtime ADD TABLE captains;

-- Enable realtime for auction_results table
ALTER PUBLICATION supabase_realtime ADD TABLE auction_results;
```

## Verify It's Working:

1. Open the auction page in two different browsers
2. As admin, change the current player
3. The other browser should update instantly without refresh

## Troubleshooting:

If realtime still doesn't work:

1. **Check browser console** for connection errors
2. **Verify Supabase URL** is correct in `.env`
3. **Check Supabase project status** - make sure it's not paused
4. **Restart dev server** after enabling realtime: `npm run dev`

## Current Status:

The code is already set up for realtime. You just need to enable it in Supabase dashboard!

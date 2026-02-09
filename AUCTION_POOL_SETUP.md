# 🎯 Auction Player Pool Management

## What's New

✅ **Sell button now visible in middle card**  
✅ **Reduced size of base price and current bid**  
✅ **Admin dashboard to manage auction player pool**  
✅ **Only registered players can be added to pool**  
✅ **Only admins can add/remove players from pool**  

---

## Setup Instructions

### Step 1: Create Auction Pool Table (5 min)

Run this in Supabase SQL Editor:

```bash
# Copy and paste auction_pool_table.sql
```

This creates:
- ✅ `auction_pool` table - stores players available for auction
- ✅ View for available players
- ✅ Function to get random player
- ✅ Function to mark player as sold

### Step 2: Add to Admin Dashboard

The component is already created at:
```
src/components/admin/PlayerPoolManagement.tsx
```

Import it in your admin dashboard:

```typescript
import { PlayerPoolManagement } from '../components/admin/PlayerPoolManagement';

// In your admin dashboard render:
<PlayerPoolManagement />
```

---

## How It Works

### Player Flow:
```
Player Registers → Admin Approves → Player in "Registered" list
    ↓
Admin selects player → Sets base price → Adds to Pool
    ↓
Player appears in "Current Pool" → Ready for auction
    ↓
During auction → Player is selected → Bidding starts
    ↓
Player sold → Marked as sold in pool
```

### Admin Features:

1. **View Registered Players**
   - Shows all approved registrations
   - Excludes players already in pool
   - Search by nickname

2. **Add to Pool**
   - Select multiple players
   - Set base price for all
   - Bulk add to pool

3. **Current Pool**
   - View all players in pool
   - See base prices
   - Remove players if needed

4. **During Auction**
   - Select player from pool
   - Player data auto-loaded
   - Base price set automatically

---

## UI Changes

### Middle Card (Auction Page):

**Before:**
- Base Price: text-xl (20px)
- Current Bid: text-2xl (24px)
- Sell button: Hidden or not visible

**After:**
- Base Price: text-base (16px) ✅
- Current Bid: text-lg (18px) ✅
- Sell button: Always visible for admins ✅
- Better spacing and layout ✅

---

## Database Schema

### auction_pool Table:

```sql
- id: UUID (primary key)
- player_id: UUID (references players)
- auction_id: UUID (references auctions, optional)
- base_price: INTEGER (default 50)
- is_sold: BOOLEAN (default false)
- sold_for: INTEGER (nullable)
- sold_to_captain_id: UUID (nullable)
- added_at: TIMESTAMP
- sold_at: TIMESTAMP (nullable)
```

### Key Features:
- ✅ Tracks which players are available
- ✅ Prevents duplicate entries
- ✅ Records sale information
- ✅ Links to specific auctions

---

## Admin Dashboard Integration

### Add to Your Admin Routes:

```typescript
// In your admin routing
{
  path: '/admin/player-pool',
  element: <PlayerPoolManagement />
}
```

### Or Add as Tab:

```typescript
<Tabs>
  <Tab label="Auctions">
    <AuctionManagement />
  </Tab>
  <Tab label="Player Pool">
    <PlayerPoolManagement />
  </Tab>
  <Tab label="Captains">
    <CaptainManagement />
  </Tab>
</Tabs>
```

---

## Usage Guide

### For Admins:

1. **Before Auction:**
   - Go to Player Pool Management
   - Select registered players
   - Set base price (e.g., 50)
   - Click "Add to Pool"

2. **During Auction:**
   - Players in pool are available
   - Select player to auction
   - Base price auto-set
   - Bidding begins

3. **After Sale:**
   - Click "Sell" button
   - Player marked as sold
   - Removed from available pool

### For Superadmins:

Same as admins, plus:
- Can remove players from pool
- Can adjust base prices
- Can view sold history

---

## API Methods

### Get Available Players:

```typescript
const { data } = await supabase
  .from('auction_pool')
  .select(`
    *,
    players (*)
  `)
  .eq('is_sold', false);
```

### Add Player to Pool:

```typescript
const { error } = await supabase
  .from('auction_pool')
  .insert([{
    player_id: playerId,
    base_price: 50
  }]);
```

### Mark as Sold:

```typescript
const { error } = await supabase
  .rpc('mark_player_sold', {
    p_pool_id: poolId,
    p_sold_for: finalPrice,
    p_captain_id: captainId
  });
```

### Get Random Player:

```typescript
const { data } = await supabase
  .rpc('get_random_auction_player');
```

---

## Testing Checklist

- [ ] Auction pool table created in Supabase
- [ ] PlayerPoolManagement component added to admin dashboard
- [ ] Can view registered players
- [ ] Can add players to pool
- [ ] Can remove players from pool
- [ ] Can see current pool
- [ ] Sell button visible in auction middle card
- [ ] Base price and current bid are smaller
- [ ] Players marked as sold after auction

---

## Troubleshooting

### "No registered players found"
- Check that players have approved registrations
- Run: `SELECT * FROM registrations WHERE status = 'approved'`

### "Player already in pool"
- Each player can only be in pool once
- Remove from pool first, then re-add

### "Sell button not showing"
- Make sure you're logged in as admin
- Check that there's a highest bidder
- Verify `AuthService.isAdminLoggedIn()` returns true

### "Base price not set"
- Default is 50 if not specified
- Can be changed in admin panel

---

## Future Enhancements

📝 **Planned Features:**
- Bulk import from CSV
- Player categories (by MMR/role)
- Auction history per player
- Price recommendations based on MMR
- Player statistics in pool view

---

## Summary

✅ **Sell button fixed** - Now visible in middle card  
✅ **UI improved** - Smaller text for prices  
✅ **Player pool system** - Complete management  
✅ **Admin controls** - Add/remove players  
✅ **Database ready** - All tables created  

**Your auction system is now complete with full player pool management!** 🎉

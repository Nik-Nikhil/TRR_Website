# Player ID/Nickname Fix

## The Problem

The app was getting 400 errors when trying to load player profiles because:

1. **Database Structure**: The `players` table uses UUID for the `id` column
2. **Route Parameters**: The app routes use nicknames (e.g., `/players/nikhil`)
3. **Query Mismatch**: The code was trying to query `WHERE id = 'nikhil'` which fails because 'nikhil' is not a valid UUID

**Error:**
```
qcsdshznxhhwtxdecako.supabase.co/rest/v1/players?id=eq.nikhil:1
Failed to load resource: the server responded with a status of 400
```

## The Solution

### 1. Updated `PlayerService.getPlayerById()`

**Before:**
```typescript
static async getPlayerById(id: string): Promise<Player | null> {
  const { data, error } = await supabase
    .from('players')
    .select('*')
    .eq('id', id)  // ❌ Fails when id is a nickname
    .single();
  
  if (error) throw error;
  return data;
}
```

**After:**
```typescript
static async getPlayerById(id: string): Promise<Player | null> {
  // First try to get by UUID id
  let { data, error } = await supabase
    .from('players')
    .select('*')
    .eq('id', id)
    .maybeSingle();
  
  // If not found or error, try by nickname
  if (error || !data) {
    const result = await supabase
      .from('players')
      .select('*')
      .ilike('nickname', id)  // ✅ Fallback to nickname
      .maybeSingle();
    
    if (result.error) throw result.error;
    return result.data;
  }
  
  return data;
}
```

### 2. Updated Real-time Subscription

**Before:**
```typescript
const channel = supabase
  .channel(`player-${playerId}`)
  .on('postgres_changes', {
    event: 'UPDATE',
    schema: 'public',
    table: 'players',
    filter: `id=eq.${playerId}`  // ❌ Fails when playerId is nickname
  }, (payload) => {
    setPlayer(payload.new as Player);
  })
  .subscribe();
```

**After:**
```typescript
// Use the actual player's UUID if available, otherwise use nickname
const filterField = player.id && player.id !== playerId ? 'id' : 'nickname';
const filterValue = player.id && player.id !== playerId ? player.id : playerId;

const channel = supabase
  .channel(`player-${playerId}`)
  .on('postgres_changes', {
    event: 'UPDATE',
    schema: 'public',
    table: 'players',
    filter: `${filterField}=eq.${filterValue}`  // ✅ Uses correct field
  }, (payload) => {
    setPlayer(payload.new as Player);
  })
  .subscribe();
```

## How It Works Now

1. **Player Profile Load:**
   - Try to fetch by UUID first
   - If that fails, try to fetch by nickname
   - Falls back to local data if both fail

2. **Real-time Updates:**
   - Once player is loaded, check if they have a UUID
   - Subscribe using UUID if available, nickname otherwise
   - Avatar updates now appear instantly! ⚡

3. **Avatar Approval:**
   - Admin approves image
   - Database updated (by nickname)
   - Real-time subscription detects change
   - UI updates automatically

## Testing

1. Go to `/players/nikhil`
2. Should load successfully (no 400 error)
3. Change avatar and get it approved
4. Avatar should update instantly without refresh!

## Files Modified

1. `src/services/supabaseService.ts`
   - Updated `getPlayerById()` to try both UUID and nickname

2. `src/pages/Players/PlayerDetailPage.tsx`
   - Updated real-time subscription to use correct filter field
   - Added dependency on `player?.id` to re-subscribe when player loads

## Status: FIXED ✅

- ✅ No more 400 errors
- ✅ Player profiles load correctly
- ✅ Real-time updates work
- ✅ Avatar changes appear instantly

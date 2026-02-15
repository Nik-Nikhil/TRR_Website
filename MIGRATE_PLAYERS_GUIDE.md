# Player Data Migration Guide

## Quick Start

### Step 1: Prepare Database
Run this in Supabase SQL Editor:
```sql
-- Make sure players table exists with all columns
-- Run supabase_setup.sql if you haven't already
```

### Step 2: Run Migration
1. Go to: `http://localhost:5173/migrate-players`
2. Click "Start Migration"
3. Wait for completion
4. Check results

### Step 3: Verify
```sql
-- Check total players
SELECT COUNT(*) FROM players;

-- View sample data
SELECT nickname, avatar_url, current_medal_label 
FROM players 
LIMIT 10;
```

## What Gets Migrated

✅ **Basic Info**
- ID (using nickname as ID for URL compatibility)
- Nickname
- Real Name
- Avatar URL

✅ **MMR & Medals**
- Current MMR & Medal
- Peak MMR & Medal

✅ **Profile**
- Bio
- Steam URL
- Dotabuff URL

✅ **Game Data**
- Season Badges (array)
- Cup Status (has_won_cup, cup_rank, cup_season)
- Preferred Roles (array)
- Favorite Heroes (array)
- Behavior Scores (JSONB)

## Migration Features

- **Upsert**: Won't create duplicates
- **Error Handling**: Shows which players failed
- **Progress**: Real-time migration status
- **Retry**: Can run multiple times safely

## After Migration

### Player Profiles Will:
- ✅ Load from Supabase (no more 400 errors!)
- ✅ Update in real-time when changed
- ✅ Show avatar changes instantly
- ✅ Work with both UUID and nickname IDs

### You Can:
- Delete local player data files (optional)
- Edit players directly in Supabase
- Use real-time subscriptions
- Scale to unlimited players

## Troubleshooting

### Migration Fails?
1. Check Supabase connection
2. Verify `supabase_setup.sql` was run
3. Check browser console for errors
4. Try migrating again (it's safe)

### Players Not Loading?
1. Verify migration completed successfully
2. Check Supabase table has data:
   ```sql
   SELECT * FROM players LIMIT 5;
   ```
3. Clear browser cache and refresh

### Still Getting 400 Errors?
- The first query will show 400 (expected)
- Second query by nickname should succeed
- Check that `nickname` column exists and has data

## Database Schema

```sql
CREATE TABLE players (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  nickname VARCHAR(100) UNIQUE NOT NULL,
  real_name VARCHAR(200),
  avatar_url TEXT,
  current_mmr INTEGER,
  peak_mmr INTEGER,
  current_medal_label VARCHAR(50),
  current_medal_id VARCHAR(50),
  peak_medal_label VARCHAR(50),
  peak_medal_id VARCHAR(50),
  bio TEXT,
  steam_url TEXT,
  dotabuff_url TEXT,
  season_badges JSONB,
  has_won_cup BOOLEAN DEFAULT false,
  cup_rank VARCHAR(20),
  cup_season INTEGER,
  preferred_roles TEXT[],
  favorite_heroes TEXT[],
  behavior_score JSONB,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);
```

## Next Steps

After successful migration:

1. **Test Player Profiles**
   - Visit `/players/nikhil`
   - Should load without errors
   - Try changing avatar

2. **Enable Real-time**
   - Avatar changes update instantly
   - No page refresh needed

3. **Clean Up** (Optional)
   - Can remove local player data files
   - Keep as backup if preferred

## Status

Once migration is complete:
- ✅ All players in Supabase
- ✅ Real-time updates working
- ✅ Avatar approval system functional
- ✅ No more 400 errors
- ✅ Scalable database solution

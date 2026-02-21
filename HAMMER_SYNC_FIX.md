# Hammer Countdown Sync Fix

## Problem
The "Going Once", "Going Twice", and "SOLD!" hammer countdown was only visible to admins, not to captains/players viewing the auction.

## Root Cause
The hammer state (`isHammerActive`, `hammerStage`, `hammerCountdown`) was stored only in local component state, not synchronized across all users through the database.

## Solution
Added hammer state fields to the `auctions` table in Supabase and synchronized them in real-time across all users.

## Changes Made

### 1. Database Schema (`add_hammer_state.sql`)
Added three new columns to the `auctions` table:
- `hammer_active` (BOOLEAN) - Whether hammer countdown is active
- `hammer_stage` (INTEGER 0-3) - Current stage: 0=none, 1=going once, 2=going twice, 3=sold
- `hammer_countdown` (INTEGER) - Countdown timer in seconds

### 2. AuctionState Interface (`auctionService.ts`)
Added hammer fields to the `AuctionState` interface:
```typescript
hammer_active: boolean;
hammer_stage: 0 | 1 | 2 | 3;
hammer_countdown: number;
```

### 3. Auction Service (`auctionService.ts`)
- Updated `getAuctionState()` to include hammer fields
- Added `updateHammerState()` method to update hammer state in database

### 4. Auction Page (`Auction.tsx`)
- Added `useEffect` to sync local hammer state from `auctionState`
- Updated hammer countdown effect to save state to database on each tick
- Updated `handleStartHammer()`, `handleCancelHammer()`, and `executeSale()` to update database

## How It Works

1. **Admin starts hammer**: Clicks "Start Hammer" button
   - Sets `hammer_active=true`, `hammer_stage=1`, `hammer_countdown=5` in database
   
2. **Real-time sync**: All users (admins, captains, players) receive the updated auction state
   - Their local state updates via the `useEffect` hook
   - Hammer overlay appears for everyone
   
3. **Countdown progresses**: Every second, the countdown decrements
   - Database is updated with new countdown value
   - All users see the same countdown
   
4. **Stage transitions**: When countdown reaches 0
   - Stage 1 → Stage 2 (Going Once → Going Twice)
   - Stage 2 → Stage 3 (Going Twice → SOLD!)
   - Stage 3 → Execute sale and reset
   
5. **Cancel hammer**: Admin can cancel at any time
   - Resets hammer state in database
   - All users see the hammer overlay disappear

## Setup Instructions

1. Run the SQL migration:
   ```sql
   -- In Supabase SQL Editor
   -- Run: TRR_Website/database/add_hammer_state.sql
   ```

2. The code changes are already applied

3. Test the feature:
   - Admin: Start an auction and click "Start Hammer"
   - Captain/Player: Open auction page in another browser/tab
   - Both should see "GOING ONCE!", "GOING TWICE!", "SOLD!" simultaneously

## Result
Now all users (admins, captains, and players) see the hammer countdown in real-time, creating a more engaging and synchronized auction experience.

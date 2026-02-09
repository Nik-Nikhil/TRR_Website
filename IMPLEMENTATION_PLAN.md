# Implementation Plan - 3 Major Issues to Fix

## Issue 1: Auction Data in localStorage (Should be in Supabase)
**Current:** All auction data is stored in localStorage
**Problem:** Data is lost when browser clears, not shared across devices
**Solution:** Migrate to Supabase database

### Files to Update:
1. `src/services/auctionDatabaseService.ts` - Replace localStorage with Supabase calls
2. `src/services/auctionService.ts` - Update to use Supabase
3. `src/pages/Auction.tsx` - Update to fetch from Supabase

---

## Issue 2: User Profile Updates & Image Uploads
**Current:** No way for users to update their profile or upload images
**Problem:** Users can't change their avatar, MMR, or other info
**Solution:** Create profile edit page + Supabase Storage for images

### What to Build:
1. Profile edit page (`src/pages/Profile.tsx`)
2. Image upload component
3. Supabase Storage bucket setup
4. Update service methods in `supabaseService.ts`

---

## Issue 3: Admin Sell Button Not Showing
**Current:** Sell button only shows when `adminSession` exists
**Problem:** Admin login might not be setting `adminSession` correctly
**Solution:** Fix admin authentication and session management

### Files to Check:
1. `src/services/auth.ts` - Admin login logic
2. `src/pages/Auction.tsx` - Line with `{adminSession && ...}` condition
3. Admin login component

---

## Priority Order:
1. **Fix Admin Sell Button** (Quick fix - 5 min)
2. **Migrate Auction to Supabase** (Important - 30 min)
3. **Add Profile Updates** (Feature - 1 hour)

---

## Let's Start!
Which issue should we tackle first?

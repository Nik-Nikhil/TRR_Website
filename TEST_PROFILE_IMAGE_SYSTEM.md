# Testing Profile Image Approval System

## Step 1: Create Database Table

**IMPORTANT**: You must run this SQL script in Supabase first!

1. Go to your Supabase Dashboard
2. Click on **SQL Editor** in the left sidebar
3. Click **New Query**
4. Copy and paste the entire contents of `database/profile_image_updates_table.sql`
5. Click **Run** (or press Ctrl+Enter)
6. You should see "Success. No rows returned"

## Step 2: Verify Table Creation

Run this query in Supabase SQL Editor to verify:

```sql
SELECT * FROM profile_image_updates LIMIT 1;
```

You should see the table structure with columns like:
- id
- user_id
- user_type
- current_image_url
- new_image_url
- image_type
- status
- requested_at
- etc.

## Step 3: Test the System

### Test as Player:

1. **Login as a player** (e.g., nikhil player account)
2. Go to your **Player Profile** page
3. Click **Edit Profile** button (top right)
4. In the avatar section, click **"Choose File"** under "Change Avatar"
5. Select a new image file
6. Click **"Save Changes"** button
7. You should see: "Your profile changes have been saved. Role changes, avatar updates, and MMR updates sent to admins for approval."

### Test as SuperAdmin:

1. **Login as superadmin** (reyuk or nikhil superadmin account)
2. Go to **SuperAdmin Dashboard**
3. Click **"Profile Requests"** in the left sidebar
4. You should see TWO sections:
   - **Profile Update Requests** (for role/text changes)
   - **Profile Image Requests** (for avatar changes)
5. In the Profile Image Requests section, you should see:
   - Player name (e.g., "nikhil")
   - Current avatar (left side)
   - New avatar (right side)
   - Buttons: **Approve**, **Reject**, **Delete**
6. Click **Approve** to approve the image
7. The request should disappear from the list

## What Changed

### PlayerDetailPage.tsx
- Updated `saveAllChanges()` function to detect avatar changes
- When avatar is changed, it now calls `profileImageService.submitImageUpdate()`
- Submits the request with:
  - Player ID
  - User type: 'player'
  - Current avatar URL
  - New avatar URL (base64 if uploaded, URL if linked)
  - Image type: 'upload' or 'link'

### SuperAdminDashboard.tsx
- Merged "Profile Updates" and "Profile Images" into single "Profile Requests" section
- Both components now render together in one view
- Real-time updates via Supabase subscriptions

## Troubleshooting

### "No pending requests" message?

**Check 1**: Did you run the SQL script?
```sql
-- Run this to check if table exists
SELECT table_name FROM information_schema.tables 
WHERE table_schema = 'public' AND table_name = 'profile_image_updates';
```

**Check 2**: Did you save the profile changes?
- Make sure you clicked "Save Changes" after selecting a new avatar
- Check browser console for any errors (F12 → Console tab)

**Check 3**: Check if request was created:
```sql
SELECT * FROM profile_image_updates ORDER BY requested_at DESC LIMIT 5;
```

### Request created but not showing in dashboard?

**Check 1**: Refresh the page
- The real-time subscription should work, but try refreshing

**Check 2**: Check browser console for errors
- Press F12 → Console tab
- Look for any red error messages

**Check 3**: Verify you're logged in as superadmin
- Check the profile card in top-right of dashboard
- Should show "Super Admin" or "Founder" role

## Expected Behavior

✅ **Players**: Avatar changes require approval
✅ **Admins/SuperAdmins**: Avatar changes auto-approved
✅ **Real-time**: Requests appear instantly in dashboard
✅ **Side-by-side**: Shows current vs new image
✅ **Approval**: Approve/Reject/Delete buttons work
✅ **Notifications**: Success messages after approval

## Status

🔧 **Database**: Run SQL script first!
✅ **Code**: All integrated and ready
✅ **UI**: Merged into single "Profile Requests" section
✅ **Service**: profileImageService.ts working
✅ **Component**: ProfileImageRequests.tsx working
✅ **Integration**: PlayerDetailPage.tsx updated

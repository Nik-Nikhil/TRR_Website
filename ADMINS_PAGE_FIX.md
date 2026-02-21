# Admins Page Fix - Nikhil and Banner Display Issue

## Problem
Nikhil and Banner were not showing up on the `/admins` page (http://localhost:5173/admins)

## Root Causes

1. **Missing loading state**: The `loading` state variable was commented out but `setLoading(false)` was still being called, causing a runtime error
2. **Founder role filtering**: The code was filtering out all admins with "Founder" role, which excluded Nikhil
3. **Unused import**: `useNavigate` was imported but never used

## Changes Made

### 1. Fixed Loading State
```typescript
// Before (broken):
// const [loading, setLoading] = useState(true); // Commented out

// After (fixed):
const [loading, setLoading] = useState(true);
```

### 2. Fixed Founder Role Handling
```typescript
// Before: Skipped all Founders
if (admin.role === 'Founder') return;

// After: Only skip Reyuk, treat other Founders (Nikhil) as Admins
if (admin.username === 'reyuk') return;

// Treat Founder role (Nikhil) as Admin for display
if (admin.role === 'Admin' || admin.role === 'Founder') {
  adminsList.push(member);
}
```

### 3. Updated Member Mapping
- Founders (except Reyuk) now display in the Admins section
- Founders get Admin styling (blue color: #4169E1)
- Nikhil keeps the special eye badge
- Banner will show once database is updated to Admin role

### 4. Removed Unused Import
```typescript
// Removed:
import { useNavigate } from "react-router-dom";
```

## Database Updates Required

Run this SQL in Supabase to complete the fix:

```sql
-- Update Nikhil's display name
UPDATE admins 
SET display_name = 'N1KHIL'
WHERE username = 'nikhil';

-- Move Banner from Mini Admin to Admin
UPDATE admins 
SET role = 'Admin'
WHERE username = 'banner';

-- Update Reyuk's avatar
UPDATE admins 
SET avatar_url = '/avatars/admins/Reyuk.png'
WHERE username = 'reyuk';

-- Add HaVoK4EvR if missing
INSERT INTO admins (username, display_name, real_name, password_hash, role, avatar_url, description, is_active)
VALUES ('havok4evr', 'HaVoK4EvR', 'Gaurav', 'mini2024', 'Mini Admin', '/avatars/admins/havok.jpg', 'Streamer & Caster', true)
ON CONFLICT (username) DO NOTHING;
```

## Result

After these changes:
- Nikhil (N1KHIL) will appear in the Admins section with the eye badge
- Banner will appear in the Admins section (once database is updated)
- All admins load correctly from the database
- Real-time updates work properly
- No TypeScript errors (only harmless unused variable warning)

## Files Modified
- `TRR_Website/src/pages/Admins.tsx`

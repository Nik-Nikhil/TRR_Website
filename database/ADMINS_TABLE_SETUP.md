# Admins Table Setup Guide

## Error: "new row violates row-level security policy for table 'admins'"

This error occurs when trying to insert data into the `admins` table without proper Row Level Security (RLS) policies.

## Quick Fix

### Step 1: Run the RLS Policy SQL
1. Go to your Supabase Dashboard
2. Navigate to **SQL Editor**
3. Open the file `database/admins_table_rls.sql`
4. Copy and paste the entire SQL content
5. Click **Run** or press `Ctrl+Enter`

### Step 2: Verify the Table Structure
Make sure your `admins` table has the correct structure:

```sql
-- Check if table exists and view structure
SELECT column_name, data_type, is_nullable
FROM information_schema.columns
WHERE table_name = 'admins'
ORDER BY ordinal_position;
```

### Step 3: Create the Table (if it doesn't exist)

```sql
-- Create admins table
CREATE TABLE IF NOT EXISTS admins (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  username TEXT UNIQUE NOT NULL,
  display_name TEXT NOT NULL,
  real_name TEXT,
  password_hash TEXT NOT NULL,
  role TEXT NOT NULL CHECK (role IN ('Founder', 'Admin', 'Mini Admin')),
  avatar_url TEXT,
  description TEXT,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Create index for faster username lookups
CREATE INDEX IF NOT EXISTS idx_admins_username ON admins(username);
CREATE INDEX IF NOT EXISTS idx_admins_role ON admins(role);
CREATE INDEX IF NOT EXISTS idx_admins_is_active ON admins(is_active);
```

## Understanding RLS Policies

The policies created allow:
- **SELECT**: Anyone can read admin data
- **INSERT**: Anyone can create new admins
- **UPDATE**: Anyone can modify admin data
- **DELETE**: Anyone can remove admins

### Production Security (Recommended)

For production, you should restrict these policies based on authentication:

```sql
-- Example: Only authenticated users can manage admins
DROP POLICY IF EXISTS "Enable insert for all users" ON admins;

CREATE POLICY "Enable insert for authenticated users" ON admins
  FOR INSERT
  TO authenticated
  WITH CHECK (true);

-- Example: Only superadmins can delete admins
DROP POLICY IF EXISTS "Enable delete for all users" ON admins;

CREATE POLICY "Enable delete for superadmins only" ON admins
  FOR DELETE
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM admins
      WHERE admins.id = auth.uid()
      AND admins.role = 'Founder'
      AND admins.is_active = true
    )
  );
```

## Troubleshooting

### Error persists after running SQL?
1. **Refresh your browser** - Clear cache and reload
2. **Check Supabase logs** - Go to Logs → Database to see detailed errors
3. **Verify policies** - Run the verification query at the end of `admins_table_rls.sql`

### Can't see the admins table?
1. Go to **Table Editor** in Supabase Dashboard
2. If `admins` table doesn't exist, run the CREATE TABLE SQL above
3. Make sure you're in the correct project

### Still getting errors?
Check the browser console for detailed error messages:
1. Open Developer Tools (F12)
2. Go to Console tab
3. Look for red error messages
4. Share the full error message for more specific help

## Testing

After setup, test by adding an admin:

```typescript
// In your browser console or app
const result = await adminService.addAdmin({
  username: 'testadmin',
  password: 'Test123!',
  displayName: 'Test Admin',
  role: 'Admin',
  isActive: true
});

console.log(result);
```

If successful, you should see `{ success: true }`.

## Files Reference
- `database/admins_table_rls.sql` - RLS policies
- `src/services/adminService.ts` - Admin service implementation
- `src/components/admin/AdminManagement.tsx` - Admin management UI

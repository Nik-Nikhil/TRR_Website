-- Admins Table RLS Policies
-- Run this in Supabase SQL Editor to fix the row-level security policy error

-- First, ensure RLS is enabled on the admins table
ALTER TABLE admins ENABLE ROW LEVEL SECURITY;

-- Drop existing policies if any (to avoid conflicts)
DROP POLICY IF EXISTS "Allow all operations on admins" ON admins;
DROP POLICY IF EXISTS "Enable read access for all users" ON admins;
DROP POLICY IF EXISTS "Enable insert for all users" ON admins;
DROP POLICY IF EXISTS "Enable update for all users" ON admins;
DROP POLICY IF EXISTS "Enable delete for all users" ON admins;

-- Create permissive policies for all operations
-- Note: In production, you should restrict these based on authentication

-- Allow SELECT (read) for everyone
CREATE POLICY "Enable read access for all users" ON admins
  FOR SELECT
  USING (true);

-- Allow INSERT (create) for everyone
CREATE POLICY "Enable insert for all users" ON admins
  FOR INSERT
  WITH CHECK (true);

-- Allow UPDATE (modify) for everyone
CREATE POLICY "Enable update for all users" ON admins
  FOR UPDATE
  USING (true)
  WITH CHECK (true);

-- Allow DELETE (remove) for everyone
CREATE POLICY "Enable delete for all users" ON admins
  FOR DELETE
  USING (true);

-- Verify policies are created
SELECT schemaname, tablename, policyname, permissive, roles, cmd, qual, with_check
FROM pg_policies
WHERE tablename = 'admins';

-- Drop existing table if it exists
DROP TABLE IF EXISTS user_passwords CASCADE;

-- Create user_passwords table for encrypted password storage
CREATE TABLE user_passwords (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id TEXT NOT NULL UNIQUE,
  user_type TEXT NOT NULL CHECK (user_type IN ('player', 'admin', 'superadmin')),
  password_hash TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Enable Row Level Security
ALTER TABLE user_passwords ENABLE ROW LEVEL SECURITY;

-- Drop existing policies if they exist
DROP POLICY IF EXISTS "Enable read access for all users" ON user_passwords;
DROP POLICY IF EXISTS "Enable insert access for all users" ON user_passwords;
DROP POLICY IF EXISTS "Enable update access for all users" ON user_passwords;
DROP POLICY IF EXISTS "Enable delete access for all users" ON user_passwords;

-- Create permissive policies for all operations
CREATE POLICY "Enable read access for all users"
  ON user_passwords FOR SELECT
  USING (true);

CREATE POLICY "Enable insert access for all users"
  ON user_passwords FOR INSERT
  WITH CHECK (true);

CREATE POLICY "Enable update access for all users"
  ON user_passwords FOR UPDATE
  USING (true)
  WITH CHECK (true);

CREATE POLICY "Enable delete access for all users"
  ON user_passwords FOR DELETE
  USING (true);

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_user_passwords_user_id 
  ON user_passwords(user_id);

CREATE INDEX IF NOT EXISTS idx_user_passwords_user_type 
  ON user_passwords(user_type);

-- Add comment
COMMENT ON TABLE user_passwords IS 'Encrypted password storage for players, admins, and superadmins';

-- Grant permissions to anon and authenticated roles
GRANT ALL ON user_passwords TO anon;
GRANT ALL ON user_passwords TO authenticated;
GRANT ALL ON user_passwords TO service_role;

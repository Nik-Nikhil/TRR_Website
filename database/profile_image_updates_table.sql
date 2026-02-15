-- Profile Image Update Requests Table
-- Stores pending profile image change requests that require admin approval

CREATE TABLE IF NOT EXISTS profile_image_updates (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id TEXT NOT NULL,
  user_type TEXT NOT NULL CHECK (user_type IN ('player', 'admin', 'superadmin')),
  current_image_url TEXT,
  new_image_url TEXT NOT NULL,
  image_type TEXT NOT NULL CHECK (image_type IN ('upload', 'link')),
  status TEXT NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'approved', 'rejected')),
  requested_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  reviewed_at TIMESTAMP WITH TIME ZONE,
  reviewed_by TEXT,
  rejection_reason TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create indexes for better query performance
CREATE INDEX IF NOT EXISTS idx_profile_image_updates_user_id ON profile_image_updates(user_id);
CREATE INDEX IF NOT EXISTS idx_profile_image_updates_status ON profile_image_updates(status);
CREATE INDEX IF NOT EXISTS idx_profile_image_updates_user_type ON profile_image_updates(user_type);

-- Enable Row Level Security
ALTER TABLE profile_image_updates ENABLE ROW LEVEL SECURITY;

-- Policy: Allow anyone to read (for displaying requests)
CREATE POLICY "Allow public read access" ON profile_image_updates
  FOR SELECT USING (true);

-- Policy: Allow anyone to insert (for creating requests)
CREATE POLICY "Allow public insert access" ON profile_image_updates
  FOR INSERT WITH CHECK (true);

-- Policy: Allow anyone to update (for admin approval/rejection)
CREATE POLICY "Allow public update access" ON profile_image_updates
  FOR UPDATE USING (true);

-- Policy: Allow anyone to delete (for cleanup)
CREATE POLICY "Allow public delete access" ON profile_image_updates
  FOR DELETE USING (true);

-- Add comment
COMMENT ON TABLE profile_image_updates IS 'Stores profile image change requests requiring admin approval';

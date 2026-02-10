-- Drop existing tables if they exist (to start fresh)
DROP TABLE IF EXISTS admin_messages CASCADE;
DROP TABLE IF EXISTS announcements CASCADE;

-- Create admin_messages table for real-time messaging
CREATE TABLE admin_messages (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  from_player TEXT NOT NULL,
  from_player_nickname TEXT NOT NULL,
  to_admin TEXT NOT NULL,
  subject TEXT NOT NULL,
  content TEXT NOT NULL,
  timestamp TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  is_read BOOLEAN DEFAULT false,
  priority TEXT DEFAULT 'medium' CHECK (priority IN ('low', 'medium', 'high')),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create announcements table for admin-managed announcements
CREATE TABLE announcements (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title TEXT NOT NULL,
  content TEXT NOT NULL,
  author TEXT NOT NULL,
  status TEXT DEFAULT 'draft' CHECK (status IN ('draft', 'published', 'archived')),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  published_at TIMESTAMP WITH TIME ZONE
);

-- Enable Row Level Security
ALTER TABLE admin_messages ENABLE ROW LEVEL SECURITY;
ALTER TABLE announcements ENABLE ROW LEVEL SECURITY;

-- Drop existing policies if they exist (to avoid conflicts)
DROP POLICY IF EXISTS "Anyone can insert messages" ON admin_messages;
DROP POLICY IF EXISTS "Anyone can read messages" ON admin_messages;
DROP POLICY IF EXISTS "Anyone can update messages" ON admin_messages;
DROP POLICY IF EXISTS "Anyone can delete messages" ON admin_messages;

DROP POLICY IF EXISTS "Anyone can read published announcements" ON announcements;
DROP POLICY IF EXISTS "Authenticated users can insert announcements" ON announcements;
DROP POLICY IF EXISTS "Authenticated users can update announcements" ON announcements;
DROP POLICY IF EXISTS "Authenticated users can delete announcements" ON announcements;

-- Policies for admin_messages
CREATE POLICY "Anyone can insert messages"
  ON admin_messages
  FOR INSERT
  WITH CHECK (true);

CREATE POLICY "Anyone can read messages"
  ON admin_messages
  FOR SELECT
  USING (true);

CREATE POLICY "Anyone can update messages"
  ON admin_messages
  FOR UPDATE
  USING (true);

CREATE POLICY "Anyone can delete messages"
  ON admin_messages
  FOR DELETE
  USING (true);

-- Policies for announcements
CREATE POLICY "Anyone can read published announcements"
  ON announcements
  FOR SELECT
  USING (status = 'published' OR true);

CREATE POLICY "Authenticated users can insert announcements"
  ON announcements
  FOR INSERT
  WITH CHECK (true);

CREATE POLICY "Authenticated users can update announcements"
  ON announcements
  FOR UPDATE
  USING (true);

CREATE POLICY "Authenticated users can delete announcements"
  ON announcements
  FOR DELETE
  USING (true);

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_admin_messages_to_admin 
  ON admin_messages(to_admin, timestamp DESC);

CREATE INDEX IF NOT EXISTS idx_admin_messages_is_read 
  ON admin_messages(is_read, timestamp DESC);

CREATE INDEX IF NOT EXISTS idx_announcements_status 
  ON announcements(status, published_at DESC);

CREATE INDEX IF NOT EXISTS idx_announcements_published_at 
  ON announcements(published_at DESC) WHERE status = 'published';

-- Add comments
COMMENT ON TABLE admin_messages IS 'Messages sent from players to admins with real-time sync';
COMMENT ON TABLE announcements IS 'Admin-managed announcements displayed on the announcements page';

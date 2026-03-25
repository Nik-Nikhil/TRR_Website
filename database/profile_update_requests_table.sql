CREATE TABLE IF NOT EXISTS profile_update_requests (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  player_id UUID REFERENCES players(id) ON DELETE CASCADE,
  player_nickname VARCHAR(100) NOT NULL,
  changes JSONB NOT NULL DEFAULT '[]',
  status VARCHAR(20) DEFAULT 'pending' CHECK (status IN ('pending', 'approved', 'rejected')),
  reviewed_by VARCHAR(100),
  reviewed_at TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_profile_update_requests_status ON profile_update_requests(status);
CREATE INDEX IF NOT EXISTS idx_profile_update_requests_player ON profile_update_requests(player_id);

ALTER TABLE profile_update_requests ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "Profile update requests viewable by everyone" ON profile_update_requests;
DROP POLICY IF EXISTS "Anyone can insert profile update requests" ON profile_update_requests;
DROP POLICY IF EXISTS "Anyone can update profile update requests" ON profile_update_requests;
CREATE POLICY "Profile update requests viewable by everyone" ON profile_update_requests FOR SELECT USING (true);
CREATE POLICY "Anyone can insert profile update requests" ON profile_update_requests FOR INSERT WITH CHECK (true);
CREATE POLICY "Anyone can update profile update requests" ON profile_update_requests FOR UPDATE USING (true);

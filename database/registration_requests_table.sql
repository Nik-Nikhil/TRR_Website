-- Registration Requests Table
-- Stores player registration requests that need admin approval

CREATE TABLE IF NOT EXISTS registration_requests (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  
  -- Player Information
  player_id TEXT NOT NULL, -- Store player identifier (can be nickname or ID)
  player_nickname TEXT NOT NULL,
  player_data JSONB NOT NULL, -- Stores all player information
  
  -- Registration Details
  in_game_name TEXT NOT NULL,
  discord_username TEXT,
  whatsapp_number TEXT,
  current_mmr INTEGER,
  player_type TEXT NOT NULL CHECK (player_type IN ('core', 'support')), -- Core or Support player
  selected_roles JSONB NOT NULL, -- Array of role preferences
  ping_range TEXT,
  is_captain_available BOOLEAN DEFAULT false,
  season_number INTEGER NOT NULL, -- Season number for this registration
  
  -- MMR Proof (if MMR changed)
  mmr_proof_url TEXT,
  mmr_changed BOOLEAN DEFAULT false,
  
  -- Status
  status TEXT NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'approved', 'denied')),
  
  -- Denial Information
  denial_reason TEXT,
  denied_at TIMESTAMPTZ,
  denied_by UUID REFERENCES admins(id),
  
  -- Approval Information
  approved_at TIMESTAMPTZ,
  approved_by UUID REFERENCES admins(id),
  
  -- Timestamps
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Create indexes for better query performance
CREATE INDEX IF NOT EXISTS idx_registration_requests_status ON registration_requests(status);
CREATE INDEX IF NOT EXISTS idx_registration_requests_player_id ON registration_requests(player_id);
CREATE INDEX IF NOT EXISTS idx_registration_requests_created_at ON registration_requests(created_at DESC);

-- Enable Row Level Security
ALTER TABLE registration_requests ENABLE ROW LEVEL SECURITY;

-- Policy: Anyone can insert (submit registration)
CREATE POLICY "Anyone can submit registration"
  ON registration_requests
  FOR INSERT
  WITH CHECK (true);

-- Policy: Anyone can view their own registration
CREATE POLICY "Players can view own registration"
  ON registration_requests
  FOR SELECT
  USING (true);

-- Policy: Admins can update (approve/deny)
CREATE POLICY "Admins can update registrations"
  ON registration_requests
  FOR UPDATE
  USING (true);

-- Function to automatically update updated_at timestamp
CREATE OR REPLACE FUNCTION update_registration_requests_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Trigger to update updated_at
CREATE TRIGGER update_registration_requests_updated_at
  BEFORE UPDATE ON registration_requests
  FOR EACH ROW
  EXECUTE FUNCTION update_registration_requests_updated_at();

-- Function to add approved player to auction pool
CREATE OR REPLACE FUNCTION add_approved_player_to_auction_pool()
RETURNS TRIGGER AS $$
DECLARE
  current_auction_id UUID;
BEGIN
  -- Only proceed if status changed to 'approved'
  IF NEW.status = 'approved' AND OLD.status != 'approved' THEN
    
    -- Get the current active auction
    SELECT id INTO current_auction_id
    FROM auction_state
    WHERE status IN ('live', 'paused')
    LIMIT 1;
    
    -- If there's an active auction, add player to pool
    IF current_auction_id IS NOT NULL THEN
      
      -- Insert into auction_pool using the player_type from registration request
      INSERT INTO auction_pool (
        auction_id,
        player_id,
        player_data,
        player_type,
        base_price,
        is_sold
      ) VALUES (
        current_auction_id,
        NEW.player_id,
        NEW.player_data,
        NEW.player_type, -- Use the player_type selected during registration (core or support)
        0, -- Base price 0
        false
      )
      ON CONFLICT (auction_id, player_id) DO NOTHING;
      
    END IF;
  END IF;
  
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Trigger to automatically add approved players to auction pool
CREATE TRIGGER add_to_auction_pool_on_approval
  AFTER UPDATE ON registration_requests
  FOR EACH ROW
  EXECUTE FUNCTION add_approved_player_to_auction_pool();

-- Grant permissions
GRANT ALL ON registration_requests TO authenticated;
GRANT ALL ON registration_requests TO anon;

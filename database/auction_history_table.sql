-- Create auction history table
CREATE TABLE IF NOT EXISTS auction_history (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  auction_name VARCHAR(200) NOT NULL,
  season VARCHAR(100),
  auction_data JSONB,
  captains_data JSONB,
  bids_data JSONB,
  results_data JSONB,
  completed_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  created_by VARCHAR(100),
  notes TEXT
);

-- Add RLS
ALTER TABLE auction_history ENABLE ROW LEVEL SECURITY;

-- Allow everyone to view auction history
CREATE POLICY "Auction history viewable by everyone" 
  ON auction_history FOR SELECT USING (true);

-- Allow anyone to insert auction history
CREATE POLICY "Anyone can insert auction history" 
  ON auction_history FOR INSERT WITH CHECK (true);

-- Allow anyone to delete auction history
CREATE POLICY "Anyone can delete auction history" 
  ON auction_history FOR DELETE USING (true);

-- Create index for faster queries
CREATE INDEX idx_auction_history_completed_at ON auction_history(completed_at DESC);
CREATE INDEX idx_auction_history_season ON auction_history(season);

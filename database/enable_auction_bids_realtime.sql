-- Enable Realtime for auction_bids table
-- Run this in your Supabase SQL Editor

-- Add auction_bids to the realtime publication
ALTER PUBLICATION supabase_realtime ADD TABLE auction_bids;

-- Verify it was added
SELECT schemaname, tablename 
FROM pg_publication_tables 
WHERE pubname = 'supabase_realtime';

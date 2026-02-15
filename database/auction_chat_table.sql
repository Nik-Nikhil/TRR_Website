-- =====================================================
-- AUCTION CHAT TABLE
-- =====================================================
-- This table stores chat messages between captains during auction

-- Create auction_chat table if it doesn't exist
DO $$ 
BEGIN
    IF NOT EXISTS (SELECT 1 FROM information_schema.tables WHERE table_name='auction_chat') THEN
        CREATE TABLE auction_chat (
            id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
            auction_id UUID REFERENCES auctions(id) ON DELETE CASCADE,
            sender_id VARCHAR(255) NOT NULL,
            sender_name VARCHAR(255) NOT NULL,
            sender_team VARCHAR(255),
            message TEXT NOT NULL,
            created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
        );

        -- Create index for faster queries
        CREATE INDEX idx_auction_chat_auction_id ON auction_chat(auction_id);
        CREATE INDEX idx_auction_chat_created_at ON auction_chat(created_at DESC);
    END IF;
END $$;

-- Enable RLS
ALTER TABLE auction_chat ENABLE ROW LEVEL SECURITY;

-- Drop existing policies if they exist
DROP POLICY IF EXISTS "Allow public read access to auction chat" ON auction_chat;
DROP POLICY IF EXISTS "Allow authenticated users to send messages" ON auction_chat;

-- Create policies
CREATE POLICY "Allow public read access to auction chat"
    ON auction_chat FOR SELECT
    USING (true);

CREATE POLICY "Allow authenticated users to send messages"
    ON auction_chat FOR INSERT
    WITH CHECK (true);

-- Grant permissions
GRANT ALL ON auction_chat TO authenticated;
GRANT ALL ON auction_chat TO anon;

-- =====================================================
-- IMPORTANT: ENABLE REAL-TIME IN SUPABASE DASHBOARD
-- =====================================================
-- After running this SQL:
-- 1. Go to Database → Replication in Supabase Dashboard
-- 2. Find 'auction_chat' table
-- 3. Toggle ON real-time replication
-- 4. Enable INSERT events (UPDATE/DELETE optional)
--
-- Note: The chat will work with polling fallback even without
-- real-time enabled, but real-time makes messages instant.
-- =====================================================

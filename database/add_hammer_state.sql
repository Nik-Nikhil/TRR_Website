-- Add hammer countdown state to auctions table
-- Run this in Supabase SQL Editor

-- Add hammer_active column
DO $$ 
BEGIN
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='auctions' AND column_name='hammer_active') THEN
        ALTER TABLE auctions ADD COLUMN hammer_active BOOLEAN DEFAULT false;
    END IF;
END $$;

-- Add hammer_stage column (0=none, 1=going once, 2=going twice, 3=sold)
DO $$ 
BEGIN
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='auctions' AND column_name='hammer_stage') THEN
        ALTER TABLE auctions ADD COLUMN hammer_stage INTEGER DEFAULT 0 CHECK (hammer_stage >= 0 AND hammer_stage <= 3);
    END IF;
END $$;

-- Add hammer_countdown column
DO $$ 
BEGIN
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='auctions' AND column_name='hammer_countdown') THEN
        ALTER TABLE auctions ADD COLUMN hammer_countdown INTEGER DEFAULT 5;
    END IF;
END $$;

-- Verify the columns were added
SELECT column_name, data_type, column_default 
FROM information_schema.columns 
WHERE table_name = 'auctions' 
AND column_name IN ('hammer_active', 'hammer_stage', 'hammer_countdown');

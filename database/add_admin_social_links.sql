-- Add social media link columns to admins table
-- Run this in Supabase SQL Editor

-- Add github_url column if it doesn't exist
DO $$ 
BEGIN
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='admins' AND column_name='github_url') THEN
        ALTER TABLE admins ADD COLUMN github_url TEXT;
    END IF;
END $$;

-- Add twitch_url column if it doesn't exist
DO $$ 
BEGIN
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='admins' AND column_name='twitch_url') THEN
        ALTER TABLE admins ADD COLUMN twitch_url TEXT;
    END IF;
END $$;

-- Update social links for admins
UPDATE admins SET github_url = 'https://github.com/shreejanmishra' WHERE username = 'fatty';
UPDATE admins SET github_url = 'https://github.com/anubhav5079' WHERE username = 'scripter';
UPDATE admins SET twitch_url = 'https://www.twitch.tv/havok4evr' WHERE username = 'havok4evr';

-- Verify
SELECT username, display_name, github_url, twitch_url 
FROM admins 
WHERE github_url IS NOT NULL OR twitch_url IS NOT NULL;

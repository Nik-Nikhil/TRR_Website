-- Update Reyuk's avatar to use Reyuk.png
-- Run this in Supabase SQL Editor

UPDATE admins 
SET avatar_url = '/avatars/admins/Reyuk.png'
WHERE username = 'reyuk';

-- Verify the update
SELECT username, display_name, avatar_url 
FROM admins 
WHERE username = 'reyuk';

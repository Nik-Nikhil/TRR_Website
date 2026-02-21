-- Add HaVoK4EvR admin to database
-- Run this in Supabase SQL Editor

INSERT INTO admins (
  username,
  display_name,
  real_name,
  password_hash,
  role,
  avatar_url,
  description,
  is_active
) VALUES (
  'havok4evr',
  'HaVoK4EvR',
  'Gaurav',
  'mini2024', -- Change this password after first login
  'Mini Admin',
  '/avatars/admins/havok.jpg',
  'Streamer & Caster',
  true
)
ON CONFLICT (username) DO NOTHING;

-- Verify the admin was added
SELECT username, display_name, real_name, role, is_active 
FROM admins 
WHERE username = 'havok4evr';

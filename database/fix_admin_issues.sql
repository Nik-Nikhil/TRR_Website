-- Fix all admin issues for login page
-- Run this in Supabase SQL Editor

-- 1. Update Reyuk's avatar to use Reyuk.png (capital R)
UPDATE admins 
SET avatar_url = '/avatars/admins/Reyuk.png'
WHERE username = 'reyuk';

-- 2. Update Nikhil's display name to N1KHIL
UPDATE admins 
SET display_name = 'N1KHIL'
WHERE username = 'nikhil';

-- 3. Move Banner from Mini Admin to Admin role
UPDATE admins 
SET role = 'Admin'
WHERE username = 'banner';

-- 4. Add HaVoK4EvR if not exists
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
  'mini2024',
  'Mini Admin',
  '/avatars/admins/havok.jpg',
  'Streamer & Caster',
  true
)
ON CONFLICT (username) DO NOTHING;

-- Verify all changes
SELECT username, display_name, role, avatar_url, is_active 
FROM admins 
WHERE username IN ('reyuk', 'nikhil', 'banner', 'havok4evr')
ORDER BY 
  CASE 
    WHEN username = 'reyuk' THEN 1
    WHEN username = 'nikhil' THEN 2
    WHEN username = 'banner' THEN 3
    WHEN username = 'havok4evr' THEN 4
  END;

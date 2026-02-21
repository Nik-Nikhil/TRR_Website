-- Update all admin descriptions and details
-- Run this in Supabase SQL Editor

-- Update R3ciprocal
UPDATE admins 
SET 
  display_name = 'R3ciprocal',
  real_name = 'Darshil Patel',
  description = 'Handles competitive integrity, rules, and match operations.',
  avatar_url = '/avatars/admins/r3ciprocal.jpg'
WHERE username = 'r3ciprocal';

-- Update Godspeed
UPDATE admins 
SET 
  display_name = 'Godspeed',
  real_name = 'Aby Alexander',
  description = 'Manages tournament funds, prize distribution, and financial accuracy.',
  avatar_url = '/avatars/admins/Godspeed.jpg'
WHERE username = 'godspeed';

-- Update Nikhil
UPDATE admins 
SET 
  display_name = 'N1KHIL',
  real_name = 'Nikhil Kumar Singh',
  description = 'Handles Discord server management and website maintenance.',
  avatar_url = '/avatars/admins/Nikhil.jpg'
WHERE username = 'nikhil';

-- Update Machine
UPDATE admins 
SET 
  display_name = 'Machine',
  real_name = 'Nisarg Parikh',
  description = 'Tournament logistics, coordination, and enforcement.',
  avatar_url = '/avatars/admins/Machine.png'
WHERE username = 'machine';

-- Update Frost
UPDATE admins 
SET 
  display_name = 'Frost',
  real_name = 'Clint Mendes',
  description = 'Oversees tournament flow, manages formats, and ensures smooth competition.',
  avatar_url = '/avatars/admins/Frost.png'
WHERE username = 'frost';

-- Update Banner (and change role to Admin)
UPDATE admins 
SET 
  display_name = 'Banner',
  real_name = 'Nav Sharma',
  role = 'Admin',
  description = 'The backbone of match flow, ensuring smooth lobbies and assists with live match casting.',
  avatar_url = '/avatars/admins/banner.png'
WHERE username = 'banner';

-- Update InsaneKid
UPDATE admins 
SET 
  display_name = 'InsaneKid',
  real_name = 'Siddhesh Naringrikar',
  description = 'Keeps matches organized and supports the broadcast behind the scenes.',
  avatar_url = '/avatars/admins/insane.jpg'
WHERE username = 'insanekid';

-- Update Fatty
UPDATE admins 
SET 
  display_name = 'Fatty',
  real_name = 'Shreejan Mishra',
  description = 'Provided consultation and helped in designing the UX and implementing the UI features.',
  avatar_url = '/avatars/admins/fatty.jpg'
WHERE username = 'fatty';

-- Update Scripter
UPDATE admins 
SET 
  display_name = 'Scripter',
  real_name = 'Anubhav Kumar',
  description = 'Manages, organizes, and maintains all data systems.',
  avatar_url = '/avatars/admins/scripter.jpg'
WHERE username = 'scripter';

-- Add/Update HaVoK4EvR
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
  'Handles live commentary, streams, and audience engagement.',
  true
)
ON CONFLICT (username) 
DO UPDATE SET
  display_name = 'HaVoK4EvR',
  real_name = 'Gaurav',
  description = 'Handles live commentary, streams, and audience engagement.',
  avatar_url = '/avatars/admins/havok.jpg';

-- Update Reyuk (Founder)
UPDATE admins 
SET 
  display_name = 'Reyuk',
  real_name = 'Keyur Sankhe',
  description = 'Founder of TRR. Oversees tournaments, systems, and structure.',
  avatar_url = '/avatars/admins/Reyuk.png'
WHERE username = 'reyuk';

-- Verify all updates
SELECT 
  username, 
  display_name, 
  real_name, 
  role, 
  description,
  avatar_url,
  is_active 
FROM admins 
ORDER BY 
  CASE 
    WHEN username = 'reyuk' THEN 0
    WHEN username = 'r3ciprocal' THEN 1
    WHEN username = 'godspeed' THEN 2
    WHEN username = 'nikhil' THEN 3
    WHEN username = 'machine' THEN 4
    WHEN username = 'frost' THEN 5
    WHEN username = 'banner' THEN 6
    WHEN username = 'insanekid' THEN 7
    WHEN username = 'fatty' THEN 8
    WHEN username = 'scripter' THEN 9
    WHEN username = 'havok4evr' THEN 10
    ELSE 99
  END;

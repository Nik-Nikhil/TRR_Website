-- =====================================================
-- COMPLETE DATABASE SETUP FOR ADMINS
-- Run these scripts IN ORDER in Supabase SQL Editor
-- =====================================================

-- STEP 1: Add social media columns
-- =====================================================
DO $$ 
BEGIN
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='admins' AND column_name='github_url') THEN
        ALTER TABLE admins ADD COLUMN github_url TEXT;
    END IF;
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='admins' AND column_name='twitch_url') THEN
        ALTER TABLE admins ADD COLUMN twitch_url TEXT;
    END IF;
END $$;

-- STEP 2: Update all admin information
-- =====================================================

-- Reyuk (Founder)
UPDATE admins 
SET 
  display_name = 'Reyuk',
  real_name = 'Keyur Sankhe',
  description = 'Founder of TRR. Oversees tournaments, systems, and structure.',
  avatar_url = '/avatars/admins/Reyuk.png'
WHERE username = 'reyuk';

-- R3ciprocal (Admin #1)
UPDATE admins 
SET 
  display_name = 'R3ciprocal',
  real_name = 'Darshil Patel',
  role = 'Admin',
  description = 'Handles competitive integrity, rules, and match operations.',
  avatar_url = '/avatars/admins/r3ciprocal.jpg'
WHERE username = 'r3ciprocal';

-- Godspeed (Admin #2)
UPDATE admins 
SET 
  display_name = 'Godspeed',
  real_name = 'Aby Alexander',
  role = 'Admin',
  description = 'Manages tournament funds, prize distribution, and financial accuracy.',
  avatar_url = '/avatars/admins/Godspeed.jpg'
WHERE username = 'godspeed';

-- Nikhil (Admin #3)
UPDATE admins 
SET 
  display_name = 'N1KHIL',
  real_name = 'Nikhil Kumar Singh',
  role = 'Founder',
  description = 'Handles Discord server management and website maintenance.',
  avatar_url = '/avatars/admins/Nikhil.jpg'
WHERE username = 'nikhil';

-- Machine (Admin #4)
UPDATE admins 
SET 
  display_name = 'Machine',
  real_name = 'Nisarg Parikh',
  role = 'Admin',
  description = 'Tournament logistics, coordination, and enforcement.',
  avatar_url = '/avatars/admins/Machine.png'
WHERE username = 'machine';

-- Frost (Admin #5)
UPDATE admins 
SET 
  display_name = 'Frost',
  real_name = 'Clint Mendes',
  role = 'Admin',
  description = 'Oversees tournament flow, manages formats, and ensures smooth competition.',
  avatar_url = '/avatars/admins/Frost.png'
WHERE username = 'frost';

-- Banner (Admin #6) - MOVED FROM MINI ADMIN TO ADMIN
UPDATE admins 
SET 
  display_name = 'Banner',
  real_name = 'Nav Sharma',
  role = 'Admin',
  description = 'The backbone of match flow, ensuring smooth lobbies and assists with live match casting.',
  avatar_url = '/avatars/admins/banner.png'
WHERE username = 'banner';

-- InsaneKid (Mini Admin #1)
UPDATE admins 
SET 
  display_name = 'InsaneKid',
  real_name = 'Siddhesh Naringrikar',
  role = 'Mini Admin',
  description = 'Keeps matches organized and supports the broadcast behind the scenes.',
  avatar_url = '/avatars/admins/insane.jpg'
WHERE username = 'insanekid';

-- Fatty (Mini Admin #2)
UPDATE admins 
SET 
  display_name = 'Fatty',
  real_name = 'Shreejan Mishra',
  role = 'Mini Admin',
  description = 'Provided consultation and helped in designing the UX and implementing the UI features.',
  avatar_url = '/avatars/admins/fatty.jpg',
  github_url = 'https://github.com/shreejanmishra'
WHERE username = 'fatty';

-- Scripter (Mini Admin #3)
UPDATE admins 
SET 
  display_name = 'Scripter',
  real_name = 'Anubhav Kumar',
  role = 'Mini Admin',
  description = 'Manages, organizes, and maintains all data systems.',
  avatar_url = '/avatars/admins/scripter.jpg',
  github_url = 'https://github.com/anubhav5079'
WHERE username = 'scripter';

-- HaVoK4EvR (Mini Admin #4) - ADD IF NOT EXISTS
INSERT INTO admins (
  username,
  display_name,
  real_name,
  password_hash,
  role,
  avatar_url,
  description,
  twitch_url,
  is_active
) VALUES (
  'havok4evr',
  'HaVoK4EvR',
  'Gaurav',
  'mini2024',
  'Mini Admin',
  '/avatars/admins/havok.jpg',
  'Handles live commentary, streams, and audience engagement.',
  'https://www.twitch.tv/havok4evr',
  true
)
ON CONFLICT (username) 
DO UPDATE SET
  display_name = 'HaVoK4EvR',
  real_name = 'Gaurav',
  role = 'Mini Admin',
  description = 'Handles live commentary, streams, and audience engagement.',
  avatar_url = '/avatars/admins/havok.jpg',
  twitch_url = 'https://www.twitch.tv/havok4evr';

-- STEP 3: Verify all changes
-- =====================================================
SELECT 
  username, 
  display_name, 
  real_name, 
  role, 
  description,
  avatar_url,
  github_url,
  twitch_url,
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

-- =====================================================
-- DONE! Your admins are now properly configured.
-- =====================================================

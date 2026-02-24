-- =====================================================
-- FIX CRITICAL ISSUES
-- 1. Change auction_pool.player_id from UUID to TEXT
-- 2. Fix admin authentication
-- =====================================================

-- =====================================================
-- PART 1: Fix auction_pool player_id type
-- =====================================================

-- Drop the foreign key constraint first
ALTER TABLE auction_pool 
DROP CONSTRAINT IF EXISTS auction_pool_player_id_fkey;

-- Drop the sold_to_captain_id constraint too
ALTER TABLE auction_pool 
DROP CONSTRAINT IF EXISTS auction_pool_sold_to_captain_id_fkey;

-- Change player_id from UUID to TEXT
ALTER TABLE auction_pool 
ALTER COLUMN player_id TYPE TEXT USING player_id::TEXT;

-- Change sold_to_captain_id from UUID to TEXT
ALTER TABLE auction_pool 
ALTER COLUMN sold_to_captain_id TYPE TEXT USING sold_to_captain_id::TEXT;

-- Recreate the trigger function with TEXT support
CREATE OR REPLACE FUNCTION add_approved_player_to_auction_pool()
RETURNS TRIGGER AS $$
DECLARE
  current_auction_id UUID;
BEGIN
  -- Only proceed if status changed to 'approved'
  IF NEW.status = 'approved' AND (OLD.status IS NULL OR OLD.status != 'approved') THEN
    
    -- Get the current active auction
    SELECT id INTO current_auction_id
    FROM auction_state
    WHERE status IN ('live', 'paused')
    ORDER BY created_at DESC
    LIMIT 1;
    
    -- If no active auction, create a default one or skip
    IF current_auction_id IS NULL THEN
      -- You can either create a default auction or just skip
      -- For now, we'll skip and log
      RAISE NOTICE 'No active auction found, skipping auction pool insertion';
      RETURN NEW;
    END IF;
    
    -- Insert into auction_pool using the player_type from registration request
    INSERT INTO auction_pool (
      auction_id,
      player_id,
      player_data,
      player_type,
      base_price,
      is_sold
    ) VALUES (
      current_auction_id,
      NEW.player_id, -- This is now TEXT (nickname)
      NEW.player_data,
      NEW.player_type, -- Use the player_type selected during registration (core or support)
      0, -- Base price 0
      false
    )
    ON CONFLICT (auction_id, player_id) DO UPDATE
    SET 
      player_data = EXCLUDED.player_data,
      player_type = EXCLUDED.player_type;
    
    RAISE NOTICE 'Player % added to auction pool', NEW.player_nickname;
    
  END IF;
  
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- =====================================================
-- PART 2: Fix admin authentication
-- =====================================================

-- Check which admins are missing passwords in user_passwords
DO $$
DECLARE
  admin_record RECORD;
  password_exists BOOLEAN;
BEGIN
  FOR admin_record IN 
    SELECT username, password_hash 
    FROM admins 
    WHERE is_active = true AND password_hash IS NOT NULL
  LOOP
    -- Check if password exists in user_passwords
    SELECT EXISTS(
      SELECT 1 FROM user_passwords WHERE user_id = admin_record.username
    ) INTO password_exists;
    
    -- If not exists, copy from admins table
    IF NOT password_exists THEN
      INSERT INTO user_passwords (user_id, password_hash, created_at, updated_at)
      VALUES (
        admin_record.username,
        admin_record.password_hash,
        NOW(),
        NOW()
      )
      ON CONFLICT (user_id) DO UPDATE
      SET 
        password_hash = EXCLUDED.password_hash,
        updated_at = NOW();
      
      RAISE NOTICE 'Copied password for admin: %', admin_record.username;
    END IF;
  END LOOP;
END $$;

-- =====================================================
-- PART 3: Update denied_by and approved_by to TEXT
-- =====================================================

-- Change denied_by from UUID to TEXT (to store admin username)
ALTER TABLE registration_requests 
DROP CONSTRAINT IF EXISTS registration_requests_denied_by_fkey;

ALTER TABLE registration_requests 
ALTER COLUMN denied_by TYPE TEXT USING denied_by::TEXT;

-- Change approved_by from UUID to TEXT (to store admin username)
ALTER TABLE registration_requests 
DROP CONSTRAINT IF EXISTS registration_requests_approved_by_fkey;

ALTER TABLE registration_requests 
ALTER COLUMN approved_by TYPE TEXT USING approved_by::TEXT;

-- =====================================================
-- VERIFICATION QUERIES
-- =====================================================

-- Check auction_pool schema
SELECT 
  column_name, 
  data_type, 
  is_nullable
FROM information_schema.columns
WHERE table_name = 'auction_pool' 
  AND column_name IN ('player_id', 'sold_to_captain_id')
ORDER BY ordinal_position;

-- Check admin password status
SELECT 
    a.username,
    a.display_name,
    a.role,
    a.is_active,
    CASE 
        WHEN up.user_id IS NOT NULL THEN '✓ HAS PASSWORD'
        ELSE '✗ MISSING PASSWORD'
    END as password_status,
    CASE 
        WHEN a.password_hash IS NOT NULL THEN '✓ HAS HASH IN ADMINS'
        ELSE '✗ NO HASH IN ADMINS'
    END as admin_hash_status
FROM admins a
LEFT JOIN user_passwords up ON a.username = up.user_id
WHERE a.is_active = true
ORDER BY a.created_at DESC;

-- Check registration_requests schema
SELECT 
  column_name, 
  data_type, 
  is_nullable
FROM information_schema.columns
WHERE table_name = 'registration_requests' 
  AND column_name IN ('denied_by', 'approved_by')
ORDER BY ordinal_position;

-- =====================================================
-- DONE!
-- =====================================================
SELECT 'Critical issues fixed successfully!' as status;

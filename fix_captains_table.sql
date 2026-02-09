-- Fix captains table to work with local player IDs (strings instead of UUIDs)

-- Drop the foreign key constraint
ALTER TABLE captains DROP CONSTRAINT IF EXISTS captains_player_id_fkey;

-- Change player_id column type from UUID to VARCHAR
ALTER TABLE captains ALTER COLUMN player_id TYPE VARCHAR(100);

-- Make player_id unique
ALTER TABLE captains ADD CONSTRAINT captains_player_id_unique UNIQUE (player_id);

-- Now captains can be assigned using local player IDs like "rocker", "atomic", etc.

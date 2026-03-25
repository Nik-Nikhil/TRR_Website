-- Add contact columns to admins table
ALTER TABLE admins
  ADD COLUMN IF NOT EXISTS discord_username TEXT,
  ADD COLUMN IF NOT EXISTS steam_url TEXT,
  ADD COLUMN IF NOT EXISTS email TEXT;

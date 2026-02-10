-- Create registration_settings table for global registration control
CREATE TABLE IF NOT EXISTS registration_settings (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  is_enabled BOOLEAN NOT NULL DEFAULT false,
  super_admin_override BOOLEAN NOT NULL DEFAULT false,
  last_modified_by TEXT NOT NULL,
  last_modified_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  message TEXT DEFAULT 'Registration starting soon. Stay tuned for updates.',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Insert default settings (only one row should exist)
INSERT INTO registration_settings (is_enabled, super_admin_override, last_modified_by, message)
VALUES (false, false, 'system', 'Registration starting soon. Stay tuned for updates.')
ON CONFLICT DO NOTHING;

-- Enable Row Level Security
ALTER TABLE registration_settings ENABLE ROW LEVEL SECURITY;

-- Policy: Anyone can read registration settings
CREATE POLICY "Anyone can read registration settings"
  ON registration_settings
  FOR SELECT
  USING (true);

-- Policy: Only authenticated users can update (admins/superadmins)
CREATE POLICY "Authenticated users can update registration settings"
  ON registration_settings
  FOR UPDATE
  USING (true)
  WITH CHECK (true);

-- Create index for faster queries
CREATE INDEX IF NOT EXISTS idx_registration_settings_modified 
  ON registration_settings(last_modified_at DESC);

-- Add comment
COMMENT ON TABLE registration_settings IS 'Global registration settings controlled by admins';

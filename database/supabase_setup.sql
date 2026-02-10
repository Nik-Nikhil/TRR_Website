-- =====================================================
-- THE ROSHAN RUMBLE - UNIVERSAL DATABASE SETUP
-- Works on both empty and existing databases
-- Just run this file - it handles everything!
-- =====================================================

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- =====================================================
-- PLAYERS TABLE - Create or update
-- =====================================================
CREATE TABLE IF NOT EXISTS players (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    nickname VARCHAR(100) UNIQUE NOT NULL,
    real_name VARCHAR(200),
    discord_username VARCHAR(100),
    steam_url TEXT,
    avatar_url TEXT,
    current_mmr INTEGER,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Add all missing columns to players table
DO $$ 
BEGIN
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='players' AND column_name='dotabuff_url') THEN
        ALTER TABLE players ADD COLUMN dotabuff_url TEXT;
    END IF;
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='players' AND column_name='current_medal_label') THEN
        ALTER TABLE players ADD COLUMN current_medal_label VARCHAR(50);
    END IF;
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='players' AND column_name='current_medal_id') THEN
        ALTER TABLE players ADD COLUMN current_medal_id VARCHAR(50);
    END IF;
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='players' AND column_name='peak_mmr') THEN
        ALTER TABLE players ADD COLUMN peak_mmr INTEGER;
    END IF;
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='players' AND column_name='peak_medal_label') THEN
        ALTER TABLE players ADD COLUMN peak_medal_label VARCHAR(50);
    END IF;
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='players' AND column_name='peak_medal_id') THEN
        ALTER TABLE players ADD COLUMN peak_medal_id VARCHAR(50);
    END IF;
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='players' AND column_name='bio') THEN
        ALTER TABLE players ADD COLUMN bio TEXT;
    END IF;
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='players' AND column_name='ping_range') THEN
        ALTER TABLE players ADD COLUMN ping_range VARCHAR(50);
    END IF;
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='players' AND column_name='roles') THEN
        ALTER TABLE players ADD COLUMN roles JSONB DEFAULT '[]'::jsonb;
    END IF;
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='players' AND column_name='favorite_heroes') THEN
        ALTER TABLE players ADD COLUMN favorite_heroes JSONB DEFAULT '[]'::jsonb;
    END IF;
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='players' AND column_name='season_badges') THEN
        ALTER TABLE players ADD COLUMN season_badges JSONB DEFAULT '[]'::jsonb;
    END IF;
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='players' AND column_name='has_won_cup') THEN
        ALTER TABLE players ADD COLUMN has_won_cup BOOLEAN DEFAULT false;
    END IF;
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='players' AND column_name='cup_rank') THEN
        ALTER TABLE players ADD COLUMN cup_rank VARCHAR(20);
    END IF;
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='players' AND column_name='cup_tooltip') THEN
        ALTER TABLE players ADD COLUMN cup_tooltip TEXT;
    END IF;
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='players' AND column_name='cup_season') THEN
        ALTER TABLE players ADD COLUMN cup_season INTEGER;
    END IF;
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='players' AND column_name='special_badge') THEN
        ALTER TABLE players ADD COLUMN special_badge VARCHAR(50);
    END IF;
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='players' AND column_name='mechanical_skill') THEN
        ALTER TABLE players ADD COLUMN mechanical_skill INTEGER CHECK (mechanical_skill >= 1 AND mechanical_skill <= 10);
    END IF;
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='players' AND column_name='teamwork') THEN
        ALTER TABLE players ADD COLUMN teamwork INTEGER CHECK (teamwork >= 1 AND teamwork <= 10);
    END IF;
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='players' AND column_name='communication') THEN
        ALTER TABLE players ADD COLUMN communication INTEGER CHECK (communication >= 1 AND communication <= 10);
    END IF;
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='players' AND column_name='consistency') THEN
        ALTER TABLE players ADD COLUMN consistency INTEGER CHECK (consistency >= 1 AND consistency <= 10);
    END IF;
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='players' AND column_name='is_banned') THEN
        ALTER TABLE players ADD COLUMN is_banned BOOLEAN DEFAULT false;
    END IF;
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='players' AND column_name='ban_reason') THEN
        ALTER TABLE players ADD COLUMN ban_reason TEXT;
    END IF;
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='players' AND column_name='banned_at') THEN
        ALTER TABLE players ADD COLUMN banned_at TIMESTAMP WITH TIME ZONE;
    END IF;
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='players' AND column_name='banned_by') THEN
        ALTER TABLE players ADD COLUMN banned_by VARCHAR(100);
    END IF;
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='players' AND column_name='whatsapp_number') THEN
        ALTER TABLE players ADD COLUMN whatsapp_number VARCHAR(20);
    END IF;
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='players' AND column_name='email') THEN
        ALTER TABLE players ADD COLUMN email VARCHAR(255);
    END IF;
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='players' AND column_name='password_hash') THEN
        ALTER TABLE players ADD COLUMN password_hash TEXT;
    END IF;
END $$;

-- =====================================================
-- ADMINS TABLE
-- =====================================================
CREATE TABLE IF NOT EXISTS admins (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    username VARCHAR(100) UNIQUE NOT NULL,
    display_name VARCHAR(100) NOT NULL,
    real_name VARCHAR(200),
    password_hash TEXT NOT NULL,
    role VARCHAR(50) NOT NULL CHECK (role IN ('Founder', 'Admin', 'Mini Admin')),
    avatar_url TEXT,
    description TEXT,
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- =====================================================
-- CAPTAINS TABLE
-- =====================================================
CREATE TABLE IF NOT EXISTS captains (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    player_id UUID REFERENCES players(id) ON DELETE CASCADE,
    player_nickname VARCHAR(100) NOT NULL,
    team_name VARCHAR(200) NOT NULL,
    budget INTEGER DEFAULT 1000,
    assigned_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    assigned_by VARCHAR(100),
    UNIQUE(player_id)
);

-- =====================================================
-- TEAMS TABLE
-- =====================================================
CREATE TABLE IF NOT EXISTS teams (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name VARCHAR(200) UNIQUE NOT NULL,
    captain_id UUID REFERENCES players(id) ON DELETE SET NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Add missing columns to teams table
DO $$ 
BEGIN
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='teams' AND column_name='season') THEN
        ALTER TABLE teams ADD COLUMN season VARCHAR(50);
    END IF;
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='teams' AND column_name='wins') THEN
        ALTER TABLE teams ADD COLUMN wins INTEGER DEFAULT 0;
    END IF;
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='teams' AND column_name='losses') THEN
        ALTER TABLE teams ADD COLUMN losses INTEGER DEFAULT 0;
    END IF;
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='teams' AND column_name='points') THEN
        ALTER TABLE teams ADD COLUMN points INTEGER DEFAULT 0;
    END IF;
END $$;

-- =====================================================
-- TEAM MEMBERS TABLE
-- =====================================================
CREATE TABLE IF NOT EXISTS team_members (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    team_id UUID REFERENCES teams(id) ON DELETE CASCADE,
    player_id UUID REFERENCES players(id) ON DELETE CASCADE,
    joined_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    UNIQUE(team_id, player_id)
);

-- Add missing columns to team_members table
DO $$ 
BEGIN
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='team_members' AND column_name='role') THEN
        ALTER TABLE team_members ADD COLUMN role VARCHAR(50);
    END IF;
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='team_members' AND column_name='bought_for') THEN
        ALTER TABLE team_members ADD COLUMN bought_for INTEGER;
    END IF;
END $$;

-- =====================================================
-- AUCTIONS TABLE
-- =====================================================
CREATE TABLE IF NOT EXISTS auctions (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name VARCHAR(200) NOT NULL,
    season VARCHAR(50) NOT NULL,
    status VARCHAR(50) NOT NULL CHECK (status IN ('not-started', 'live', 'paused', 'completed')),
    current_player_id UUID REFERENCES players(id) ON DELETE SET NULL,
    current_player_data JSONB,
    highest_bid INTEGER,
    highest_bidder_id UUID REFERENCES players(id) ON DELETE SET NULL,
    highest_bidder_name VARCHAR(100),
    highest_bidder_team VARCHAR(200),
    created_by VARCHAR(100) NOT NULL,
    deletion_status VARCHAR(50) DEFAULT 'active' CHECK (deletion_status IN ('active', 'pending_deletion', 'deleted')),
    deleted_at TIMESTAMP WITH TIME ZONE,
    deleted_by VARCHAR(100),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    started_at TIMESTAMP WITH TIME ZONE,
    completed_at TIMESTAMP WITH TIME ZONE
);

-- =====================================================
-- AUCTION BIDS TABLE
-- =====================================================
CREATE TABLE IF NOT EXISTS auction_bids (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    auction_id UUID REFERENCES auctions(id) ON DELETE CASCADE,
    player_id UUID REFERENCES players(id) ON DELETE SET NULL,
    captain_id UUID REFERENCES players(id) ON DELETE CASCADE,
    captain_name VARCHAR(100) NOT NULL,
    team_name VARCHAR(200) NOT NULL,
    amount INTEGER NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- =====================================================
-- AUCTION RESULTS TABLE
-- =====================================================
CREATE TABLE IF NOT EXISTS auction_results (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    auction_id UUID REFERENCES auctions(id) ON DELETE CASCADE,
    player_id UUID REFERENCES players(id) ON DELETE SET NULL,
    player_data JSONB,
    sold_to_captain_id UUID REFERENCES players(id) ON DELETE SET NULL,
    sold_to_captain_name VARCHAR(100),
    sold_to_team_name VARCHAR(200),
    final_price INTEGER NOT NULL,
    sold_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- =====================================================
-- REGISTRATIONS TABLE
-- =====================================================
CREATE TABLE IF NOT EXISTS registrations (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    player_id UUID REFERENCES players(id) ON DELETE CASCADE,
    registered_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Add missing columns to registrations table
DO $$ 
BEGIN
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='registrations' AND column_name='tournament_season') THEN
        ALTER TABLE registrations ADD COLUMN tournament_season VARCHAR(50);
    END IF;
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='registrations' AND column_name='status') THEN
        ALTER TABLE registrations ADD COLUMN status VARCHAR(50) CHECK (status IN ('pending', 'approved', 'rejected'));
    END IF;
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='registrations' AND column_name='additional_info') THEN
        ALTER TABLE registrations ADD COLUMN additional_info TEXT;
    END IF;
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='registrations' AND column_name='reviewed_at') THEN
        ALTER TABLE registrations ADD COLUMN reviewed_at TIMESTAMP WITH TIME ZONE;
    END IF;
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='registrations' AND column_name='reviewed_by') THEN
        ALTER TABLE registrations ADD COLUMN reviewed_by VARCHAR(100);
    END IF;
END $$;

-- =====================================================
-- ROLE CHANGE REQUESTS TABLE
-- =====================================================
CREATE TABLE IF NOT EXISTS role_change_requests (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    player_id UUID REFERENCES players(id) ON DELETE CASCADE,
    player_nickname VARCHAR(100) NOT NULL,
    current_roles JSONB,
    requested_roles JSONB,
    reason TEXT,
    status VARCHAR(50) DEFAULT 'pending' CHECK (status IN ('pending', 'approved', 'rejected')),
    requested_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    reviewed_at TIMESTAMP WITH TIME ZONE,
    reviewed_by VARCHAR(100),
    review_notes TEXT
);

-- =====================================================
-- ADMIN MESSAGES TABLE
-- =====================================================
CREATE TABLE IF NOT EXISTS admin_messages (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    from_admin VARCHAR(100) NOT NULL,
    to_admin VARCHAR(100) NOT NULL,
    message TEXT NOT NULL,
    is_read BOOLEAN DEFAULT false,
    sent_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    read_at TIMESTAMP WITH TIME ZONE
);

-- =====================================================
-- ACTIVITY LOGS TABLE
-- =====================================================
CREATE TABLE IF NOT EXISTS activity_logs (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    action VARCHAR(200) NOT NULL,
    details TEXT,
    user_name VARCHAR(100),
    user_type VARCHAR(50) CHECK (user_type IN ('player', 'admin', 'system')),
    log_type VARCHAR(50) CHECK (log_type IN ('info', 'warning', 'error', 'success')),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- =====================================================
-- INDEXES
-- =====================================================
CREATE INDEX IF NOT EXISTS idx_players_nickname ON players(nickname);
CREATE INDEX IF NOT EXISTS idx_players_is_banned ON players(is_banned);
CREATE INDEX IF NOT EXISTS idx_admins_username ON admins(username);
CREATE INDEX IF NOT EXISTS idx_captains_player_id ON captains(player_id);
CREATE INDEX IF NOT EXISTS idx_teams_season ON teams(season);
CREATE INDEX IF NOT EXISTS idx_team_members_team_id ON team_members(team_id);
CREATE INDEX IF NOT EXISTS idx_team_members_player_id ON team_members(player_id);
CREATE INDEX IF NOT EXISTS idx_auctions_status ON auctions(status);
CREATE INDEX IF NOT EXISTS idx_auctions_deletion_status ON auctions(deletion_status);
CREATE INDEX IF NOT EXISTS idx_auction_bids_auction_id ON auction_bids(auction_id);
CREATE INDEX IF NOT EXISTS idx_auction_bids_captain_id ON auction_bids(captain_id);
CREATE INDEX IF NOT EXISTS idx_auction_results_auction_id ON auction_results(auction_id);
CREATE INDEX IF NOT EXISTS idx_registrations_player_id ON registrations(player_id);
CREATE INDEX IF NOT EXISTS idx_registrations_status ON registrations(status);
CREATE INDEX IF NOT EXISTS idx_role_requests_status ON role_change_requests(status);
CREATE INDEX IF NOT EXISTS idx_messages_to_admin ON admin_messages(to_admin);
CREATE INDEX IF NOT EXISTS idx_messages_is_read ON admin_messages(is_read);
CREATE INDEX IF NOT EXISTS idx_activity_logs_created_at ON activity_logs(created_at);

-- =====================================================
-- ROW LEVEL SECURITY
-- =====================================================
ALTER TABLE players ENABLE ROW LEVEL SECURITY;
ALTER TABLE admins ENABLE ROW LEVEL SECURITY;
ALTER TABLE captains ENABLE ROW LEVEL SECURITY;
ALTER TABLE teams ENABLE ROW LEVEL SECURITY;
ALTER TABLE team_members ENABLE ROW LEVEL SECURITY;
ALTER TABLE auctions ENABLE ROW LEVEL SECURITY;
ALTER TABLE auction_bids ENABLE ROW LEVEL SECURITY;
ALTER TABLE auction_results ENABLE ROW LEVEL SECURITY;
ALTER TABLE registrations ENABLE ROW LEVEL SECURITY;
ALTER TABLE role_change_requests ENABLE ROW LEVEL SECURITY;
ALTER TABLE admin_messages ENABLE ROW LEVEL SECURITY;
ALTER TABLE activity_logs ENABLE ROW LEVEL SECURITY;

-- Drop and recreate policies
DROP POLICY IF EXISTS "Players are viewable by everyone" ON players;
DROP POLICY IF EXISTS "Anyone can insert players" ON players;
DROP POLICY IF EXISTS "Anyone can update players" ON players;
DROP POLICY IF EXISTS "Admins are viewable by everyone" ON admins;
DROP POLICY IF EXISTS "Captains are viewable by everyone" ON captains;
DROP POLICY IF EXISTS "Anyone can insert captains" ON captains;
DROP POLICY IF EXISTS "Anyone can update captains" ON captains;
DROP POLICY IF EXISTS "Anyone can delete captains" ON captains;
DROP POLICY IF EXISTS "Teams are viewable by everyone" ON teams;
DROP POLICY IF EXISTS "Anyone can insert teams" ON teams;
DROP POLICY IF EXISTS "Anyone can update teams" ON teams;
DROP POLICY IF EXISTS "Team members are viewable by everyone" ON team_members;
DROP POLICY IF EXISTS "Anyone can insert team members" ON team_members;
DROP POLICY IF EXISTS "Auctions are viewable by everyone" ON auctions;
DROP POLICY IF EXISTS "Anyone can insert auctions" ON auctions;
DROP POLICY IF EXISTS "Anyone can update auctions" ON auctions;
DROP POLICY IF EXISTS "Auction bids are viewable by everyone" ON auction_bids;
DROP POLICY IF EXISTS "Anyone can place bids" ON auction_bids;
DROP POLICY IF EXISTS "Auction results are viewable by everyone" ON auction_results;
DROP POLICY IF EXISTS "Anyone can insert auction results" ON auction_results;
DROP POLICY IF EXISTS "Registrations are viewable by everyone" ON registrations;
DROP POLICY IF EXISTS "Anyone can insert registrations" ON registrations;
DROP POLICY IF EXISTS "Anyone can update registrations" ON registrations;
DROP POLICY IF EXISTS "Role requests are viewable by everyone" ON role_change_requests;
DROP POLICY IF EXISTS "Anyone can request role changes" ON role_change_requests;
DROP POLICY IF EXISTS "Anyone can update role requests" ON role_change_requests;
DROP POLICY IF EXISTS "Admin messages are viewable by everyone" ON admin_messages;
DROP POLICY IF EXISTS "Anyone can send messages" ON admin_messages;
DROP POLICY IF EXISTS "Anyone can update messages" ON admin_messages;
DROP POLICY IF EXISTS "Activity logs are viewable by everyone" ON activity_logs;
DROP POLICY IF EXISTS "Anyone can insert logs" ON activity_logs;

-- Create policies
CREATE POLICY "Players are viewable by everyone" ON players FOR SELECT USING (true);
CREATE POLICY "Anyone can insert players" ON players FOR INSERT WITH CHECK (true);
CREATE POLICY "Anyone can update players" ON players FOR UPDATE USING (true);

CREATE POLICY "Admins are viewable by everyone" ON admins FOR SELECT USING (true);

CREATE POLICY "Captains are viewable by everyone" ON captains FOR SELECT USING (true);
CREATE POLICY "Anyone can insert captains" ON captains FOR INSERT WITH CHECK (true);
CREATE POLICY "Anyone can update captains" ON captains FOR UPDATE USING (true);
CREATE POLICY "Anyone can delete captains" ON captains FOR DELETE USING (true);

CREATE POLICY "Teams are viewable by everyone" ON teams FOR SELECT USING (true);
CREATE POLICY "Anyone can insert teams" ON teams FOR INSERT WITH CHECK (true);
CREATE POLICY "Anyone can update teams" ON teams FOR UPDATE USING (true);

CREATE POLICY "Team members are viewable by everyone" ON team_members FOR SELECT USING (true);
CREATE POLICY "Anyone can insert team members" ON team_members FOR INSERT WITH CHECK (true);

CREATE POLICY "Auctions are viewable by everyone" ON auctions FOR SELECT USING (deletion_status != 'deleted');
CREATE POLICY "Anyone can insert auctions" ON auctions FOR INSERT WITH CHECK (true);
CREATE POLICY "Anyone can update auctions" ON auctions FOR UPDATE USING (true);

CREATE POLICY "Auction bids are viewable by everyone" ON auction_bids FOR SELECT USING (true);
CREATE POLICY "Anyone can place bids" ON auction_bids FOR INSERT WITH CHECK (true);

CREATE POLICY "Auction results are viewable by everyone" ON auction_results FOR SELECT USING (true);
CREATE POLICY "Anyone can insert auction results" ON auction_results FOR INSERT WITH CHECK (true);

CREATE POLICY "Registrations are viewable by everyone" ON registrations FOR SELECT USING (true);
CREATE POLICY "Anyone can insert registrations" ON registrations FOR INSERT WITH CHECK (true);
CREATE POLICY "Anyone can update registrations" ON registrations FOR UPDATE USING (true);

CREATE POLICY "Role requests are viewable by everyone" ON role_change_requests FOR SELECT USING (true);
CREATE POLICY "Anyone can request role changes" ON role_change_requests FOR INSERT WITH CHECK (true);
CREATE POLICY "Anyone can update role requests" ON role_change_requests FOR UPDATE USING (true);

CREATE POLICY "Admin messages are viewable by everyone" ON admin_messages FOR SELECT USING (true);
CREATE POLICY "Anyone can send messages" ON admin_messages FOR INSERT WITH CHECK (true);
CREATE POLICY "Anyone can update messages" ON admin_messages FOR UPDATE USING (true);

CREATE POLICY "Activity logs are viewable by everyone" ON activity_logs FOR SELECT USING (true);
CREATE POLICY "Anyone can insert logs" ON activity_logs FOR INSERT WITH CHECK (true);

-- =====================================================
-- TRIGGERS
-- =====================================================
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS update_players_updated_at ON players;
CREATE TRIGGER update_players_updated_at BEFORE UPDATE ON players
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

DROP TRIGGER IF EXISTS update_admins_updated_at ON admins;
CREATE TRIGGER update_admins_updated_at BEFORE UPDATE ON admins
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

DROP TRIGGER IF EXISTS update_teams_updated_at ON teams;
CREATE TRIGGER update_teams_updated_at BEFORE UPDATE ON teams
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

DROP TRIGGER IF EXISTS update_auctions_updated_at ON auctions;
CREATE TRIGGER update_auctions_updated_at BEFORE UPDATE ON auctions
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- =====================================================
-- DEFAULT ADMINS
-- =====================================================
INSERT INTO admins (username, display_name, password_hash, role, avatar_url, description) VALUES
('reyuk', 'Reyuk', '12345', 'Founder', '/avatars/admins/Reyuk.jpg', 'Founder & Lead Admin'),
('nikhil', 'Nikhil', 'SuperAdmin2024!', 'Founder', '/avatars/admins/Nikhil.jpg', 'Co-Founder'),
('r3ciprocal', 'R3ciprocal', 'admin2024', 'Admin', '/avatars/admins/r3ciprocal.jpg', 'Senior Admin'),
('frost', 'Frost', 'admin2024', 'Admin', '/avatars/admins/Frost.png', 'Admin'),
('machine', 'Machine', 'admin2024', 'Admin', '/avatars/admins/Machine.png', 'Admin'),
('godspeed', 'Godspeed', 'admin2024', 'Admin', '/avatars/admins/Godspeed.jpg', 'Admin'),
('banner', 'Banner', 'mini2024', 'Mini Admin', '/avatars/admins/Banner.jpg', 'Mini Admin'),
('insanekid', 'InsaneKid', 'mini2024', 'Mini Admin', '/avatars/admins/insane.jpg', 'Mini Admin'),
('fatty', 'Fatty', 'mini2024', 'Mini Admin', '/avatars/admins/fatty.jpg', 'Mini Admin'),
('scripter', 'Scripter', 'mini2024', 'Mini Admin', '/avatars/admins/scripter.jpg', 'Mini Admin')
ON CONFLICT (username) DO NOTHING;

-- =====================================================
-- DONE!
-- =====================================================
SELECT 'Database setup complete! All tables created/updated.' as status;

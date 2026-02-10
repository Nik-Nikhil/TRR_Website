# Database SQL Files

This folder contains all SQL migration and setup files for the TRR Website Supabase database.

## Setup Files

- **supabase_setup.sql** - Main database setup script with all tables and initial configuration

## Table Creation Scripts

- **auction_history_table.sql** - Creates the auction_history table for storing past auction data
- **auction_pool_table.sql** - Creates the auction_pool table for managing player pools
- **image_tracking_table.sql** - Creates the image_tracking table for optimized image management

## Migration Scripts

- **fix_captains_table.sql** - Fixes captain table schema (UUID to VARCHAR conversion)
- **enable_auction_bids_realtime.sql** - Enables real-time subscriptions for auction_bids table

## Test Files

- **test_database.sql** - Database connection and functionality tests

## Usage

Run these SQL files in your Supabase SQL Editor in the following order:

1. `supabase_setup.sql` (first time setup)
2. Table creation scripts as needed
3. Migration scripts as needed
4. Enable real-time features

## Notes

- Always backup your database before running migration scripts
- Test scripts in a development environment first
- Check Supabase dashboard for real-time subscription status after enabling

## New Feature: Global Registration Control

### registration_settings_table.sql

Creates a global registration control system that syncs across all devices in real-time.

**Features:**
- Single source of truth for registration status
- Real-time synchronization across all connected clients
- Admin controls for enabling/disabling registration
- Super Admin override to lock settings
- Custom messages displayed on homepage

**How it works:**
1. Admin/SuperAdmin changes registration settings in their dashboard
2. Settings are saved to Supabase `registration_settings` table
3. All connected clients receive real-time updates via Supabase Realtime
4. Homepage registration button updates automatically on all devices

**Setup:**
Run `registration_settings_table.sql` in your Supabase SQL Editor after running the main setup script.

**No more localStorage** - Registration settings now sync globally across all devices!

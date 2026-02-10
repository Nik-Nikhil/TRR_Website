# The Roshan Rumble - Tournament Website

A comprehensive Dota 2 tournament management platform built with React, TypeScript, and Supabase.

## 🚀 Features

- **Player Registration & Management** - Complete player profile system with medals, roles, and stats
- **Live Auction System** - Real-time player auction with bidding, team management, and budget tracking
- **Admin Dashboard** - Comprehensive admin tools for tournament management
- **Super Admin Panel** - Advanced system administration and user management
- **Tournament Brackets** - Interactive bracket visualization for multiple seasons
- **Team Management** - Team rosters, captain assignments, and player tracking
- **Real-time Updates** - Live auction updates using Supabase real-time subscriptions
- **Message System** - Player-to-admin messaging with recipient-specific routing

## 📁 Project Structure

```
TRR_Website/
├── src/
│   ├── components/      # React components
│   │   ├── admin/      # Admin-specific components
│   │   └── ui/         # Reusable UI components
│   ├── data/           # Static data (players, admins, heroes)
│   ├── hooks/          # Custom React hooks
│   ├── pages/          # Page components
│   ├── services/       # API and business logic services
│   ├── types/          # TypeScript type definitions
│   └── utils/          # Utility functions
├── public/             # Static assets (images, audio)
├── database/           # SQL migration and setup files
├── tests/              # Test files
└── [config files]      # Vite, TypeScript, Tailwind configs
```

## 🛠️ Tech Stack

- **Frontend**: React 18 + TypeScript
- **Styling**: Tailwind CSS
- **Database**: Supabase (PostgreSQL)
- **Real-time**: Supabase Realtime
- **Build Tool**: Vite
- **Animations**: Framer Motion
- **Icons**: Lucide React
- **Excel Export**: xlsx

## 📦 Installation

1. Clone the repository
2. Install dependencies:
   ```bash
   npm install
   ```

3. Set up environment variables in `.env`:
   ```
   VITE_SUPABASE_URL=your_supabase_url
   VITE_SUPABASE_ANON_KEY=your_supabase_anon_key
   ```

4. Run database setup scripts from `database/` folder in Supabase SQL Editor

5. Start development server:
   ```bash
   npm run dev
   ```

## 🗄️ Database Setup

See `database/README.md` for detailed SQL setup instructions.

## 👥 User Roles

- **Players** - Register, view profiles, participate in auctions
- **Captains** - Bid on players during auctions
- **Mini Admins** - Limited administrative access
- **Admins** - Full tournament management capabilities
- **Super Admins** - System administration and user management

## 🎮 Key Features

### Auction System
- Real-time bidding with live updates
- Team budget management
- Player assignment and reassignment
- 5-player team limit enforcement
- Auction history with Excel export

### Admin Tools
- Player ban/unban management
- Captain assignment
- Registration control
- Profile update approvals
- Message management
- Admin account management

### Super Admin Features
- Add/disable/enable admin accounts
- Role management
- System-wide settings
- Activity logs
- Database management

## 🔐 Security

- Role-based access control
- Protected routes
- Session management
- Disabled account checks
- Supabase Row Level Security (RLS)

## 📝 License

© 2026 TRR ESPORTS - All Rights Reserved

## 🤝 Contributing

This is a private tournament management system. For access or contributions, contact the development team.

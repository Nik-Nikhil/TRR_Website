# The Roshan Rumble - Tournament Website

A modern, full-stack Dota 2 tournament platform built with React, TypeScript, and Supabase.

## 🚀 Features

- **Player Management**: Registration, profiles, and authentication
- **Admin Dashboard**: Tournament management and player oversight
- **Steam Integration**: OpenID authentication and profile linking
- **Real-time Database**: Supabase integration with live updates
- **Responsive Design**: Mobile-first approach with Tailwind CSS
- **3D Graphics**: Three.js integration for immersive experiences

## 📁 Project Structure

```
TRR_Website/
├── docs/                          # Documentation
│   └── DATABASE_SETUP.md         # Database setup guide
├── tests/                         # Test files
│   └── database-test.html        # Database connection tests
├── public/                        # Static assets
│   ├── avatars/                  # Player and admin avatars
│   ├── icons/                    # Game icons and medals
│   ├── audio/                    # Sound effects
│   └── Video/                    # Hero videos
├── src/
│   ├── components/               # Reusable UI components
│   │   ├── auth/                # Authentication components
│   │   ├── database/            # Database management UI
│   │   ├── layout/              # Layout components (Navbar, Footer)
│   │   ├── team/                # Team-related components
│   │   ├── tournament/          # Tournament components
│   │   └── 3d/                  # Three.js components
│   ├── data/                    # Static data and configurations
│   │   ├── Bracket/             # Tournament bracket data
│   │   ├── GroupStage/          # Group stage data
│   │   ├── players.ts           # Player database
│   │   └── teams.ts             # Team database
│   ├── hooks/                   # Custom React hooks
│   ├── lib/                     # External library configurations
│   │   └── supabase.ts          # Supabase client setup
│   ├── pages/                   # Page components
│   │   ├── Brackets/            # Tournament bracket pages
│   │   ├── Players/             # Player-related pages
│   │   ├── Seasons/             # Season management pages
│   │   ├── AdminLogin.tsx       # Admin authentication
│   │   ├── PlayerLogin.tsx      # Player authentication
│   │   ├── Registration.tsx     # Tournament registration
│   │   └── ...                  # Other pages
│   ├── scripts/                 # Utility scripts
│   │   └── migrateData.ts       # Database migration tools
│   ├── services/                # Business logic services
│   │   ├── auth.ts              # Authentication service
│   │   └── database.ts          # Database operations
│   ├── store/                   # State management
│   ├── types/                   # TypeScript type definitions
│   ├── utils/                   # Utility functions
│   │   ├── constants.ts         # Application constants
│   │   └── helpers.ts           # Helper functions
│   ├── App.tsx                  # Main application component
│   └── main.tsx                 # Application entry point
├── database_setup.sql           # Database schema
├── package.json                 # Dependencies and scripts
└── vite.config.ts              # Vite configuration
```

## 🛠️ Installation & Setup

### Prerequisites
- Node.js (v18 or higher)
- npm or yarn
- Supabase account

### 1. Clone and Install
```bash
git clone <repository-url>
cd TRR_Website
npm install
```

### 2. Database Setup
1. Create a Supabase project
2. Run the SQL schema from `database_setup.sql`
3. Update database credentials in `src/utils/constants.ts`
4. Visit `/database-init` to migrate existing data

### 3. Start Development Server
```bash
npm run dev
```

### 4. Initialize Database
- Visit `http://localhost:5173/database-init`
- Click "Initialize Database" to migrate player data
- Monitor status with the database indicator (bottom-right)

## 🔐 Authentication System

### Player Authentication
- **Login**: Nickname + password (`player123` for demo)
- **Steam Registration**: OpenID integration for new players
- **Session Duration**: 24 hours

### Admin Authentication
- **Role-Based Access**: Founder > Admin > Mini Admin
- **Default Passwords**:
  - Founder: `founder2024`
  - Admin: `admin2024`
  - Mini Admin: `mini2024`
- **Session Duration**: 8 hours

## 📊 Database Integration

### Connected Features
- ✅ Player login and registration
- ✅ Admin authentication
- ✅ Tournament registration
- ✅ Real-time player search
- ✅ Steam profile integration

### Pending Integration
- ⏳ Hall of Fame data
- ⏳ Season standings
- ⏳ Match results
- ⏳ Team management

## 🎮 Key Components

### Authentication Flow
1. **Player Login** (`/player-login`)
   - Search existing players or register with Steam
   - Password authentication for existing players
   - Steam OpenID for new registrations

2. **Admin Login** (`/admin-login`)
   - Admin card selection interface
   - Role-based password authentication
   - Hierarchical permission system

### Database Management
1. **Database Status** (Development indicator)
   - Real-time connection monitoring
   - Player count display
   - Quick setup access

2. **Database Initialization** (`/database-init`)
   - One-click database setup
   - Data migration from static files
   - Progress tracking and error handling

### Registration System
- Tournament registration with player validation
- Automatic player creation for new users
- Steam profile integration
- Role and ping preference selection

## 🔧 Development Tools

### Database Status Indicator
- Visible in development mode (bottom-right corner)
- Shows connection status and player count
- Quick access to database setup tools

### Migration Scripts
```typescript
// Test database connection
await DatabaseService.testConnection();

// Migrate all player data
await DataMigration.runFullMigration();

// Clear all data (use with caution)
await DataMigration.clearAllData();
```

### Type Safety
- Full TypeScript integration
- Database schema types in `src/lib/supabase.ts`
- Service layer type checking
- Component prop validation

## 📱 Responsive Design

- **Mobile-First**: Optimized for all screen sizes
- **Tailwind CSS**: Utility-first styling approach
- **Framer Motion**: Smooth animations and transitions
- **Accessibility**: WCAG compliant components

## 🎨 Styling System

### Color Scheme
- **Primary**: Blue/Cyan gradients
- **Secondary**: Gray/Slate tones
- **Accents**: Green (success), Red (error), Purple (admin)
- **Background**: Dark theme with Dota 2 imagery

### Components
- **Cards**: Glass morphism with backdrop blur
- **Buttons**: Gradient backgrounds with hover effects
- **Forms**: Floating labels and validation states
- **Navigation**: Animated underlines and active states

## 🚀 Deployment

### Build for Production
```bash
npm run build
```

### Environment Variables
Create `.env` file:
```env
VITE_SUPABASE_URL=your_supabase_url
VITE_SUPABASE_ANON_KEY=your_supabase_anon_key
```

### Security Checklist
- [ ] Update default passwords
- [ ] Configure Supabase RLS policies
- [ ] Set up proper environment variables
- [ ] Enable HTTPS in production
- [ ] Configure CORS policies

## 🧪 Testing

### Database Tests
- Open `tests/database-test.html` in browser
- Test connection, search, and authentication
- Monitor console for detailed logs

### Manual Testing
1. **Player Flow**: Register → Login → Profile
2. **Admin Flow**: Login → Dashboard → Management
3. **Database**: Initialize → Migrate → Verify

## 📚 Documentation

- **Setup Guide**: `docs/DATABASE_SETUP.md`
- **API Reference**: Service layer documentation
- **Component Guide**: Storybook integration (planned)

## 🤝 Contributing

1. Follow the established folder structure
2. Use TypeScript for all new code
3. Add proper error handling
4. Update documentation for new features
5. Test database integration thoroughly

## 📄 License

This project is licensed under the MIT License.

## 🆘 Support

For issues and questions:
1. Check the database status indicator
2. Review browser console logs
3. Visit `/database-init` for diagnostics
4. Consult `docs/DATABASE_SETUP.md`

---

**The Roshan Rumble** - Where legends are forged in the fires of competition! 🏆
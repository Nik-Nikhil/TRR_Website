# TRR Auction System - Complete Guide

## 🎯 Overview

The Roshan Rumble auction system allows admins to conduct live player auctions where team captains bid on players to build their teams.

## ✨ Features

### For Admins:
- ✅ Start/Pause/Resume/Stop auctions
- ✅ Assign captains with team names and budgets
- ✅ Select players for bidding from dropdown (230+ players)
- ✅ Real-time auction monitoring
- ✅ Activity logging

### For Captains:
- ✅ Captain badge in player profile
- ✅ Place bids during live auction
- ✅ View bid history
- ✅ Budget tracking

### For Everyone:
- ✅ View live auction status
- ✅ See current player details
- ✅ Watch real-time bidding
- ✅ View bid history

## 🚀 Quick Start

### 1. Assign Captains
```
Admin Dashboard → Captain Management → Add Captain
- Select player
- Enter team name
- Set budget (default: 1000)
```

### 2. Start Auction
```
Admin Dashboard → Auction Control → Start Auction
```

### 3. Add Players
```
Auction Control → Player Selection
- Select player from dropdown
- Click "Set as Current Player"
```

### 4. Bidding
```
Captains login → Go to Auction page → Place bids
```

## 💾 Data Storage

**Current:** LocalStorage (browser-based)
- Works immediately, no setup
- Perfect for testing
- Single-device only

**Future:** Supabase (optional)
- Multi-device support
- Real-time sync across devices
- Persistent data

## 🎨 New Features

### Avatar Component
- Shows player initials if no profile picture
- Color-coded by name (consistent colors)
- No more broken image icons
- Used throughout auction system

### Player Selection
- Dropdown with all 230+ players
- Shows: Name - MMR - Roles
- Easy player management

## 📁 File Structure

```
src/
├── components/
│   ├── admin/
│   │   ├── AuctionControl.tsx      # Start/stop auction, select players
│   │   └── CaptainManagement.tsx   # Assign/remove captains
│   └── ui/
│       ├── Avatar.tsx               # Smart avatar with fallback
│       └── AnimatedHourglass.tsx    # Auction waiting animation
├── services/
│   ├── auctionService.ts            # Auction logic (LocalStorage)
│   └── captainService.ts            # Captain management
└── pages/
    └── Auction.tsx                  # Public auction page
```

## 🔧 Technical Details

### Avatar Fallback System
- Automatically shows initials if image fails
- Generates consistent colors from name
- Supports multiple sizes (sm, md, lg, xl, 2xl)
- Used in: Auction page, Captain cards, Admin panels

### Real-Time Updates
- Custom browser events for state changes
- Instant updates within same browser
- No external dependencies

### Data Persistence
- LocalStorage for all data
- Survives page refreshes
- Cleared only when browser cache cleared

## 📝 Usage Examples

### Admin: Start Auction
```typescript
1. Login as admin
2. Navigate to Admin Dashboard
3. Click "Auction Control"
4. Click "Start Auction" button
5. Select player from dropdown
6. Click "Set as Current Player"
```

### Captain: Place Bid
```typescript
1. Login as captain (player with captain badge)
2. Navigate to Auction page
3. Enter bid amount (must be > current bid)
4. Click "Bid" button
```

## 🎮 Workflow

```
Admin assigns captains
    ↓
Admin starts auction
    ↓
Admin selects player
    ↓
Player appears on auction page
    ↓
Captains place bids
    ↓
Admin selects next player
    ↓
Repeat until all players sold
    ↓
Admin stops auction
```

## 🐛 Troubleshooting

**Q: Broken images showing**
A: Fixed! Now shows player initials with colored background

**Q: Auction page empty**
A: Start auction and select a player in Auction Control

**Q: Can't place bid**
A: Must be logged in as captain and auction must be "Live"

**Q: Changes not showing**
A: Refresh the page (real-time only works on same device)

## 🔮 Coming Soon

- Sold players tracking
- Team rosters view
- Budget deduction
- Auction history
- Export results
- Mobile optimization

## 📊 Current Status

✅ Captain system - Complete
✅ Auction controls - Complete
✅ Player selection - Complete
✅ Bidding interface - Complete
✅ Avatar fallback - Complete
⏳ Team management - Coming soon
⏳ Auction history - Coming soon

---

**Last Updated:** February 7, 2026
**Version:** 1.0

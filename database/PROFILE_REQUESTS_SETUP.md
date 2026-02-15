# Profile Requests System Setup

## Database Setup

Run this SQL script in Supabase SQL Editor:

```sql
-- Run profile_image_updates_table.sql
```

This creates the `profile_image_updates` table for handling profile image approval requests.

## How It Works

The **Profile Requests** section in SuperAdminDashboard now shows:
1. **Profile Updates** - Text changes (bio, name, etc.)
2. **Profile Images** - Image upload/link requests

Both are displayed in a single unified section for easier management.

### Approval Flow:
- **Players**: All changes require admin approval
- **Admins/SuperAdmins**: Auto-approved instantly

## Testing

1. Run the SQL script in Supabase
2. Login as superadmin
3. Navigate to "Profile Requests" in sidebar
4. Both profile updates and image requests will appear here

## Status: ✅ Ready to Use

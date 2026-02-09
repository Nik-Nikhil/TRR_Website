# 📸 Image Optimization System - Stay Within Free Limits!

## How It Works

### 3-Stage Optimization Process:

```
Upload → Compress (70-80% smaller) → Wait 2 weeks → Ultra-compress (90% smaller)
```

1. **On Upload**: Images are automatically compressed to 70-80% smaller
2. **After 2 Weeks**: Images are ultra-compressed to 90% smaller (lower quality but still usable)
3. **Result**: Massive storage savings while keeping your database free!

---

## Setup Instructions

### Step 1: Create Image Tracking Table

Run this in Supabase SQL Editor:

```bash
# Copy and paste image_tracking_table.sql
```

This creates:
- ✅ `image_uploads` table - tracks all uploaded images
- ✅ Indexes for fast queries
- ✅ Storage statistics view
- ✅ Auto-optimization function

### Step 2: Set Up Cron Job (Automatic Optimization)

#### Option A: GitHub Actions (Recommended - Free!)

Create `.github/workflows/optimize-images.yml`:

```yaml
name: Optimize Old Images

on:
  schedule:
    # Run daily at 2 AM UTC
    - cron: '0 2 * * *'
  workflow_dispatch: # Allow manual trigger

jobs:
  optimize:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      
      - name: Setup Node.js
        uses: actions/setup-node@v3
        with:
          node-version: '18'
      
      - name: Install dependencies
        run: |
          cd TRR_Website
          npm install
      
      - name: Run optimization
        env:
          VITE_SUPABASE_URL: ${{ secrets.VITE_SUPABASE_URL }}
          VITE_SUPABASE_ANON_KEY: ${{ secrets.VITE_SUPABASE_ANON_KEY }}
        run: |
          cd TRR_Website
          npx tsx src/scripts/optimizeImages.ts
```

Add secrets in GitHub:
- Go to Settings → Secrets → Actions
- Add `VITE_SUPABASE_URL` and `VITE_SUPABASE_ANON_KEY`

#### Option B: Supabase Edge Functions (Advanced)

Create a Supabase Edge Function that runs daily.

#### Option C: Manual (Simple)

Run manually when needed:

```bash
cd TRR_Website
npx tsx src/scripts/optimizeImages.ts
```

---

## Storage Savings Example

### Without Optimization:
- 100 users upload 2MB avatars = **200MB**
- After 1 year (500 users) = **1GB** ❌ Over free limit!

### With Optimization:
- Upload: 2MB → Compressed to 400KB (80% saved)
- After 2 weeks: 400KB → Ultra-compressed to 100KB (75% more saved)
- 100 users = **10MB** ✅
- After 1 year (500 users) = **50MB** ✅ Well within free limit!

**Result: 95% storage savings!**

---

## How Images Are Compressed

### Stage 1: On Upload (Automatic)
```typescript
// Original: 2MB
// Compressed: 400KB (80% reduction)
// Quality: High (0.7)
// Max Width: 800px
```

### Stage 2: After 2 Weeks (Automatic via Cron)
```typescript
// Compressed: 400KB
// Ultra-compressed: 100KB (75% reduction)
// Quality: Medium (0.5)
// Max Width: 400px
```

---

## Monitoring Storage Usage

### Check Storage Stats

Run in Supabase SQL Editor:

```sql
-- View storage statistics
SELECT * FROM storage_stats;

-- Find images ready for optimization
SELECT id, user_id, image_url, uploaded_at, 
       compressed_size, is_optimized
FROM image_uploads
WHERE uploaded_at < NOW() - INTERVAL '14 days'
AND is_optimized = false
ORDER BY uploaded_at ASC;

-- Total storage used
SELECT 
    SUM(CASE WHEN is_optimized THEN optimized_size ELSE compressed_size END) / 1024 / 1024 as storage_mb
FROM image_uploads;
```

### View in App (TODO: Add Admin Dashboard)

Create an admin page to show:
- Total storage used
- Images pending optimization
- Storage savings
- Optimization history

---

## Configuration Options

### Adjust Compression Settings

In `imageOptimizationService.ts`:

```typescript
// Initial compression (on upload)
maxWidth: 800,  // Reduce for more savings
quality: 0.7,   // Lower = smaller file (0.5-0.9)

// Ultra compression (after 2 weeks)
maxWidth: 400,  // Reduce for more savings
quality: 0.5,   // Lower = smaller file (0.3-0.7)
```

### Change Optimization Delay

In `image_tracking_table.sql`:

```sql
-- Change from 14 days to 7 days
expires_at: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000)
```

---

## Free Tier Limits

### Supabase Free Tier:
- **Storage**: 1GB
- **Bandwidth**: 2GB/month
- **Database**: 500MB

### With This System:
- ✅ 500 users with avatars = ~50MB (5% of limit)
- ✅ 1000 users with avatars = ~100MB (10% of limit)
- ✅ Room for screenshots, team logos, etc.

---

## Testing

### Test Image Upload:
```bash
1. Go to /profile
2. Upload a large image (2-3MB)
3. Check console for compression stats
4. Verify image is smaller in Supabase Storage
```

### Test Optimization Script:
```bash
cd TRR_Website
npx tsx src/scripts/optimizeImages.ts
```

### Check Database:
```sql
-- View tracked images
SELECT * FROM image_uploads ORDER BY uploaded_at DESC LIMIT 10;

-- Check storage stats
SELECT * FROM storage_stats;
```

---

## Troubleshooting

### Images not compressing?
- Check browser console for errors
- Verify `imageOptimizationService.ts` is imported
- Check file size limits (max 5MB before compression)

### Cron job not running?
- Verify GitHub Actions secrets are set
- Check workflow logs in GitHub Actions tab
- Test manually first: `npx tsx src/scripts/optimizeImages.ts`

### Storage still too high?
- Lower compression quality (0.5 → 0.4)
- Reduce max width (800px → 600px)
- Optimize more frequently (14 days → 7 days)

---

## Advanced: Delete Old Images

If you want to delete images after 6 months:

```sql
-- Add to cron job
DELETE FROM image_uploads 
WHERE uploaded_at < NOW() - INTERVAL '6 months';

-- This will also delete from storage (set up trigger)
```

---

## Summary

✅ **Automatic compression on upload** (70-80% savings)  
✅ **Ultra-compression after 2 weeks** (90% total savings)  
✅ **Cron job for automation** (GitHub Actions)  
✅ **Storage tracking** (monitor usage)  
✅ **Free tier friendly** (stay under 1GB easily)  

**Your database will stay within free limits even with thousands of users!** 🎉

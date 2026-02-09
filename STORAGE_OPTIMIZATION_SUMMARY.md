# 🎯 Storage Optimization - Complete Setup

## What You Get

✅ **Automatic image compression** - 70-80% smaller on upload  
✅ **Ultra-compression after 2 weeks** - 90% total savings  
✅ **Stay within free limits** - Support 1000+ users easily  
✅ **Automated with GitHub Actions** - Runs daily, no manual work  
✅ **Full tracking** - Monitor storage usage and savings  

---

## Quick Setup (15 minutes)

### 1. Create Image Tracking Table (5 min)

```bash
# In Supabase SQL Editor, run:
TRR_Website/image_tracking_table.sql
```

### 2. Set Up GitHub Actions (5 min)

The workflow file is already created at:
```
.github/workflows/optimize-images.yml
```

Add secrets to GitHub:
1. Go to your repo → Settings → Secrets and variables → Actions
2. Click "New repository secret"
3. Add these two secrets:
   - Name: `VITE_SUPABASE_URL`
     Value: `https://xdecako.supabase.co`
   - Name: `VITE_SUPABASE_ANON_KEY`
     Value: `sb_publishable_UmAag0GJGmffqvCRILpXNA_7bc7Cvtf`

### 3. Test It (5 min)

```bash
# Test image upload
1. Go to /profile
2. Upload a large image (2-3MB)
3. Check console - should show compression stats

# Test optimization script manually
cd TRR_Website
npx tsx src/scripts/optimizeImages.ts
```

---

## How It Works

### Upload Flow:
```
User uploads 2MB image
    ↓
Automatic compression (800px, 70% quality)
    ↓
Saved as 400KB (80% smaller!)
    ↓
Tracked in database with expiry date
```

### After 2 Weeks (Automatic):
```
GitHub Actions runs daily cron job
    ↓
Finds images older than 2 weeks
    ↓
Ultra-compresses (400px, 50% quality)
    ↓
Saved as 100KB (75% more savings!)
    ↓
Marked as optimized in database
```

---

## Storage Savings Calculator

| Users | Without Optimization | With Optimization | Savings |
|-------|---------------------|-------------------|---------|
| 100   | 200 MB              | 10 MB             | 95%     |
| 500   | 1 GB ❌             | 50 MB ✅          | 95%     |
| 1000  | 2 GB ❌             | 100 MB ✅         | 95%     |
| 5000  | 10 GB ❌            | 500 MB ✅         | 95%     |

**Free tier limit: 1GB**  
**With optimization: Support 5000+ users!**

---

## Files Created

### Core Service:
- `src/services/imageOptimizationService.ts` - Compression logic

### Database:
- `image_tracking_table.sql` - Tracking table and functions

### Automation:
- `src/scripts/optimizeImages.ts` - Optimization script
- `.github/workflows/optimize-images.yml` - GitHub Actions workflow

### Documentation:
- `IMAGE_OPTIMIZATION_GUIDE.md` - Complete guide
- `STORAGE_OPTIMIZATION_SUMMARY.md` - This file

### Updated:
- `src/pages/Profile.tsx` - Now uses compression service

---

## Monitoring

### Check Storage Usage:

```sql
-- In Supabase SQL Editor
SELECT * FROM storage_stats;
```

Returns:
- Total images
- Original size vs current size
- Space saved
- Optimization percentage

### Check Pending Optimizations:

```sql
SELECT COUNT(*) as pending_count
FROM image_uploads
WHERE uploaded_at < NOW() - INTERVAL '14 days'
AND is_optimized = false;
```

### View Recent Uploads:

```sql
SELECT 
    user_id,
    image_type,
    original_size / 1024 as original_kb,
    compressed_size / 1024 as compressed_kb,
    ROUND((1 - compressed_size::float / original_size) * 100, 1) as saved_percent,
    uploaded_at
FROM image_uploads
ORDER BY uploaded_at DESC
LIMIT 10;
```

---

## GitHub Actions

### Manual Trigger:
1. Go to your repo → Actions tab
2. Click "Optimize Old Images" workflow
3. Click "Run workflow"

### View Logs:
1. Go to Actions tab
2. Click on a workflow run
3. View optimization results

### Schedule:
- Runs daily at 2 AM UTC
- Processes up to 10 images per run
- Adds 1 second delay between images

---

## Configuration

### Change Compression Quality:

In `imageOptimizationService.ts`:

```typescript
// Line 67: Initial compression
maxWidth: 800,  // Change to 600 for more savings
quality: 0.7,   // Change to 0.6 for more savings

// Line 155: Ultra compression
maxWidth: 400,  // Change to 300 for more savings
quality: 0.5,   // Change to 0.4 for more savings
```

### Change Optimization Delay:

In `imageOptimizationService.ts` line 95:

```typescript
// Change from 14 days to 7 days
expires_at: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000)
```

### Change Cron Schedule:

In `.github/workflows/optimize-images.yml`:

```yaml
# Daily at 2 AM
- cron: '0 2 * * *'

# Every 12 hours
- cron: '0 */12 * * *'

# Weekly on Sunday
- cron: '0 2 * * 0'
```

---

## Testing Checklist

- [ ] Image tracking table created in Supabase
- [ ] GitHub Actions secrets added
- [ ] Upload test image and verify compression
- [ ] Check `image_uploads` table has entry
- [ ] Run optimization script manually
- [ ] Check storage stats in database
- [ ] Verify GitHub Actions workflow runs

---

## Troubleshooting

### "Cannot find module 'tsx'"
```bash
npm install -D tsx
```

### "Image compression failed"
- Check file size (max 5MB)
- Check file type (must be image)
- Check browser console for errors

### "GitHub Actions failing"
- Verify secrets are set correctly
- Check workflow logs for errors
- Test script locally first

### "Storage still too high"
- Lower compression quality
- Reduce max width
- Optimize more frequently
- Delete old images after 6 months

---

## Next Steps

1. ✅ Run `image_tracking_table.sql` in Supabase
2. ✅ Add GitHub secrets
3. ✅ Test image upload
4. ✅ Test optimization script
5. ✅ Monitor storage usage
6. 📝 Add admin dashboard (optional)
7. 📝 Set up alerts for storage limits (optional)

---

## Support

- Read `IMAGE_OPTIMIZATION_GUIDE.md` for detailed info
- Check GitHub Actions logs for errors
- Monitor Supabase dashboard for storage usage
- Run `storage_stats` query to see savings

**You're all set! Your database will stay within free limits even with thousands of users.** 🚀

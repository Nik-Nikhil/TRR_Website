# Vercel Deployment Fix - 404 Error on Refresh

## Problem
Getting 404 errors when refreshing pages on Vercel deployment.

## Root Cause
Single Page Applications (SPAs) with client-side routing need special configuration on Vercel to handle direct URL access and page refreshes.

## Solution Applied

### 1. Updated `vercel.json`
Created comprehensive routing configuration that:
- Serves static assets (JS, CSS, images, audio, etc.) directly
- Routes all other requests to `index.html` for React Router to handle
- Explicitly defines asset directories (avatars, audio, icons, medals)

### 2. Created `public/_redirects`
Fallback configuration that redirects all routes to `index.html` with 200 status.

### 3. Updated `vite.config.ts`
Added explicit build configuration:
- Set `base: '/'` for proper path resolution
- Configured `outDir: 'dist'` and `assetsDir: 'assets'`
- Optimized rollup output

## Vercel Project Settings

Make sure these settings are configured in your Vercel project dashboard:

1. **Root Directory**: `TRR_Website`
2. **Build Command**: `npm run build`
3. **Output Directory**: `dist`
4. **Install Command**: `npm install`
5. **Framework Preset**: Vite

## How It Works

1. User visits any URL (e.g., `/auction`, `/admin-login`)
2. Vercel checks the routes in `vercel.json`:
   - If it's a static file (JS, CSS, image), serve it directly
   - If it's a route, serve `index.html`
3. React loads and React Router handles the routing
4. Correct page is displayed

## Testing

After deployment:
1. Visit any page directly (e.g., `https://your-domain.vercel.app/auction`)
2. Refresh the page (F5 or Ctrl+R)
3. Should load correctly without 404 error

## Files Modified
- `TRR_Website/vercel.json` - Main routing configuration
- `TRR_Website/public/_redirects` - Fallback redirect rules
- `TRR_Website/vite.config.ts` - Build configuration

## Deployment Steps
1. Commit all changes
2. Push to your repository
3. Vercel will automatically redeploy
4. Wait for deployment to complete
5. Test by refreshing any page

## Troubleshooting

If still getting 404 errors:
1. Check Vercel deployment logs for errors
2. Verify Root Directory is set to `TRR_Website` in Vercel settings
3. Ensure build completed successfully
4. Clear browser cache and try again
5. Check that `dist` folder is being generated during build

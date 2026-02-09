# Supabase Storage Setup for Image Uploads

## Create Storage Bucket

1. Go to your Supabase Dashboard: https://supabase.com/dashboard
2. Navigate to **Storage** in the left sidebar
3. Click **New Bucket**
4. Create a bucket named: `avatars`
5. Make it **Public** (check the public checkbox)
6. Click **Create Bucket**

## Set Storage Policies

After creating the bucket, set up these policies:

### 1. Allow Public Read Access
```sql
CREATE POLICY "Public Access"
ON storage.objects FOR SELECT
USING ( bucket_id = 'avatars' );
```

### 2. Allow Authenticated Uploads
```sql
CREATE POLICY "Authenticated users can upload avatars"
ON storage.objects FOR INSERT
WITH CHECK ( bucket_id = 'avatars' );
```

### 3. Allow Users to Update Their Own Avatars
```sql
CREATE POLICY "Users can update own avatars"
ON storage.objects FOR UPDATE
USING ( bucket_id = 'avatars' );
```

### 4. Allow Users to Delete Their Own Avatars
```sql
CREATE POLICY "Users can delete own avatars"
ON storage.objects FOR DELETE
USING ( bucket_id = 'avatars' );
```

## Quick Setup (Run in SQL Editor)

Copy and paste this into Supabase SQL Editor:

```sql
-- Create storage bucket
INSERT INTO storage.buckets (id, name, public)
VALUES ('avatars', 'avatars', true)
ON CONFLICT (id) DO NOTHING;

-- Set up policies
CREATE POLICY "Public Access"
ON storage.objects FOR SELECT
USING ( bucket_id = 'avatars' );

CREATE POLICY "Anyone can upload avatars"
ON storage.objects FOR INSERT
WITH CHECK ( bucket_id = 'avatars' );

CREATE POLICY "Anyone can update avatars"
ON storage.objects FOR UPDATE
USING ( bucket_id = 'avatars' );

CREATE POLICY "Anyone can delete avatars"
ON storage.objects FOR DELETE
USING ( bucket_id = 'avatars' );
```

## Test Upload

After setup, test the upload by:
1. Login to your app
2. Go to Profile page
3. Click the upload icon on your avatar
4. Select an image
5. Check if it uploads successfully

## Troubleshooting

### Error: "new row violates row-level security policy"
- Make sure the bucket is set to **Public**
- Check that the policies are created correctly

### Error: "Bucket not found"
- Verify the bucket name is exactly `avatars`
- Check that the bucket was created successfully

### Images not loading
- Verify the bucket is set to **Public**
- Check the public URL format: `https://[project-id].supabase.co/storage/v1/object/public/avatars/[filename]`

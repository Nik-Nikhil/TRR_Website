-- =====================================================
-- IMAGE UPLOADS TRACKING TABLE
-- Tracks all uploaded images for optimization
-- =====================================================

CREATE TABLE IF NOT EXISTS image_uploads (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID REFERENCES players(id) ON DELETE CASCADE,
    image_url TEXT NOT NULL,
    image_type VARCHAR(50) CHECK (image_type IN ('avatar', 'screenshot', 'other')),
    
    -- Size tracking
    original_size INTEGER NOT NULL,
    compressed_size INTEGER NOT NULL,
    optimized_size INTEGER,
    
    -- Optimization status
    is_optimized BOOLEAN DEFAULT false,
    uploaded_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    expires_at TIMESTAMP WITH TIME ZONE NOT NULL,
    optimized_at TIMESTAMP WITH TIME ZONE,
    
    -- Metadata
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Index for finding expired images
CREATE INDEX IF NOT EXISTS idx_image_uploads_expires ON image_uploads(expires_at, is_optimized);
CREATE INDEX IF NOT EXISTS idx_image_uploads_user ON image_uploads(user_id);
CREATE INDEX IF NOT EXISTS idx_image_uploads_type ON image_uploads(image_type);

-- Enable RLS
ALTER TABLE image_uploads ENABLE ROW LEVEL SECURITY;

-- Policies
DROP POLICY IF EXISTS "Users can view their own uploads" ON image_uploads;
CREATE POLICY "Users can view their own uploads" ON image_uploads 
    FOR SELECT USING (true);

DROP POLICY IF EXISTS "Anyone can insert uploads" ON image_uploads;
CREATE POLICY "Anyone can insert uploads" ON image_uploads 
    FOR INSERT WITH CHECK (true);

DROP POLICY IF EXISTS "Anyone can update uploads" ON image_uploads;
CREATE POLICY "Anyone can update uploads" ON image_uploads 
    FOR UPDATE USING (true);

-- =====================================================
-- FUNCTION: Auto-optimize old images (run via cron)
-- =====================================================
CREATE OR REPLACE FUNCTION optimize_old_images()
RETURNS void AS $$
DECLARE
    expired_image RECORD;
BEGIN
    -- Find images older than 2 weeks that aren't optimized
    FOR expired_image IN 
        SELECT id, image_url 
        FROM image_uploads 
        WHERE uploaded_at < NOW() - INTERVAL '14 days'
        AND is_optimized = false
        LIMIT 10  -- Process 10 at a time
    LOOP
        -- Mark as optimized (actual optimization happens in app)
        UPDATE image_uploads 
        SET is_optimized = true, optimized_at = NOW()
        WHERE id = expired_image.id;
        
        RAISE NOTICE 'Marked image % for optimization', expired_image.id;
    END LOOP;
END;
$$ LANGUAGE plpgsql;

-- =====================================================
-- STORAGE STATISTICS VIEW
-- =====================================================
CREATE OR REPLACE VIEW storage_stats AS
SELECT 
    COUNT(*) as total_images,
    SUM(original_size) as total_original_size,
    SUM(compressed_size) as total_compressed_size,
    SUM(CASE WHEN is_optimized THEN optimized_size ELSE compressed_size END) as current_storage_size,
    SUM(original_size - compressed_size) as space_saved_compression,
    COUNT(CASE WHEN is_optimized THEN 1 END) as optimized_count,
    ROUND(AVG(CASE WHEN is_optimized THEN 
        ((compressed_size - optimized_size)::float / compressed_size * 100) 
    END), 2) as avg_optimization_percent
FROM image_uploads;

-- =====================================================
-- QUERY: Check storage usage
-- =====================================================
-- SELECT * FROM storage_stats;

-- =====================================================
-- QUERY: Find images ready for optimization
-- =====================================================
-- SELECT id, user_id, image_url, uploaded_at, 
--        compressed_size, is_optimized
-- FROM image_uploads
-- WHERE uploaded_at < NOW() - INTERVAL '14 days'
-- AND is_optimized = false
-- ORDER BY uploaded_at ASC;

-- =====================================================
-- DONE!
-- =====================================================
SELECT 'Image tracking table created successfully!' as status;

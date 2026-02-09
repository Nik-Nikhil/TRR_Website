// Cron Job Script - Optimize Old Images
// Run this daily to compress images older than 2 weeks
// Usage: npx tsx src/scripts/optimizeImages.ts

import { ImageOptimizationService } from '../services/imageOptimizationService';

async function optimizeOldImages() {
  console.log('🔍 Starting image optimization job...');
  console.log('⏰ Time:', new Date().toISOString());
  
  try {
    // Get images that need optimization
    const expiredImages = await ImageOptimizationService.getExpiredImages();
    
    console.log(`📊 Found ${expiredImages.length} images to optimize`);
    
    if (expiredImages.length === 0) {
      console.log('✅ No images need optimization');
      return;
    }
    
    // Optimize each image
    let successCount = 0;
    let failCount = 0;
    
    for (const image of expiredImages) {
      console.log(`\n🖼️  Processing image ${image.id}...`);
      console.log(`   URL: ${image.image_url}`);
      console.log(`   Uploaded: ${image.uploaded_at}`);
      console.log(`   Size: ${Math.round(image.compressed_size / 1024)}KB`);
      
      const success = await ImageOptimizationService.optimizeOldImage(
        image.id,
        image.image_url
      );
      
      if (success) {
        successCount++;
        console.log(`   ✅ Optimized successfully`);
      } else {
        failCount++;
        console.log(`   ❌ Failed to optimize`);
      }
      
      // Add delay to avoid rate limits
      await new Promise(resolve => setTimeout(resolve, 1000));
    }
    
    console.log('\n📈 Optimization Summary:');
    console.log(`   ✅ Success: ${successCount}`);
    console.log(`   ❌ Failed: ${failCount}`);
    console.log(`   📊 Total: ${expiredImages.length}`);
    
    // Get storage stats
    const stats = await ImageOptimizationService.getStorageStats();
    console.log('\n💾 Storage Statistics:');
    console.log(`   Total Images: ${stats.totalImages}`);
    console.log(`   Original Size: ${Math.round(stats.totalOriginalSize / 1024 / 1024)}MB`);
    console.log(`   Current Size: ${Math.round(stats.totalCompressedSize / 1024 / 1024)}MB`);
    console.log(`   Space Saved: ${Math.round(stats.spaceSaved / 1024 / 1024)}MB (${Math.round((stats.spaceSaved / stats.totalOriginalSize) * 100)}%)`);
    console.log(`   Optimized: ${stats.optimizedCount}/${stats.totalImages}`);
    
    console.log('\n✨ Optimization job completed!');
    
  } catch (error) {
    console.error('❌ Error during optimization:', error);
    process.exit(1);
  }
}

// Run the optimization
optimizeOldImages()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error('Fatal error:', error);
    process.exit(1);
  });

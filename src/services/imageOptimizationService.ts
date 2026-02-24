// Image Optimization Service - Compress images to save storage
import { supabase } from '../lib/supabase';

export class ImageOptimizationService {
  
  /**
   * Compress image before upload
   * Reduces file size by 70-80% while maintaining quality
   */
  static async compressImage(file: File, maxWidth: number = 800, quality: number = 0.7): Promise<Blob> {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      
      reader.onload = (e) => {
        const img = new Image();
        
        img.onload = () => {
          // Create canvas
          const canvas = document.createElement('canvas');
          let width = img.width;
          let height = img.height;
          
          // Calculate new dimensions
          if (width > maxWidth) {
            height = (height * maxWidth) / width;
            width = maxWidth;
          }
          
          canvas.width = width;
          canvas.height = height;
          
          // Draw and compress
          const ctx = canvas.getContext('2d');
          if (!ctx) {
            reject(new Error('Could not get canvas context'));
            return;
          }
          
          ctx.drawImage(img, 0, 0, width, height);
          
          // Convert to blob with compression
          canvas.toBlob(
            (blob) => {
              if (blob) {
                resolve(blob);
              } else {
                reject(new Error('Failed to compress image'));
              }
            },
            'image/jpeg',
            quality
          );
        };
        
        img.onerror = () => reject(new Error('Failed to load image'));
        img.src = e.target?.result as string;
      };
      
      reader.onerror = () => reject(new Error('Failed to read file'));
      reader.readAsDataURL(file);
    });
  }

  /**
   * Upload image with automatic compression
   */
  static async uploadCompressedImage(
    file: File,
    bucket: string,
    path: string,
    options?: {
      maxWidth?: number;
      quality?: number;
    }
  ): Promise<{ url: string; size: number; originalSize: number }> {
    const originalSize = file.size;
    
    // Compress image
    const compressedBlob = await this.compressImage(
      file,
      options?.maxWidth || 800,
      options?.quality || 0.7
    );
    
    const compressedSize = compressedBlob.size;
    
    // Upload compressed version
    const { error: uploadError } = await supabase.storage
      .from(bucket)
      .upload(path, compressedBlob, { 
        upsert: true,
        contentType: 'image/jpeg'
      });
    
    if (uploadError) throw uploadError;
    
    // Get public URL
    const { data: { publicUrl } } = supabase.storage
      .from(bucket)
      .getPublicUrl(path);
    
    return {
      url: publicUrl,
      size: compressedSize,
      originalSize: originalSize
    };
  }

  /**
   * Track image metadata in database
   */
  static async trackImageUpload(
    userId: string,
    imageUrl: string,
    originalSize: number,
    compressedSize: number,
    imageType: 'avatar' | 'screenshot' | 'other'
  ) {
    const { error } = await supabase
      .from('image_uploads')
      .insert([{
        user_id: userId,
        image_url: imageUrl,
        original_size: originalSize,
        compressed_size: compressedSize,
        image_type: imageType,
        uploaded_at: new Date().toISOString(),
        expires_at: new Date(Date.now() + 14 * 24 * 60 * 60 * 1000).toISOString() // 2 weeks
      }]);
    
    if (error) console.error('Failed to track image:', error);
  }

  /**
   * Get images that need optimization (older than 2 weeks)
   */
  static async getExpiredImages() {
    const twoWeeksAgo = new Date(Date.now() - 14 * 24 * 60 * 60 * 1000).toISOString();
    
    const { data, error } = await supabase
      .from('image_uploads')
      .select('*')
      .lt('uploaded_at', twoWeeksAgo)
      .eq('is_optimized', false);
    
    if (error) throw error;
    return data || [];
  }

  /**
   * Convert old image to ultra-compressed version
   * This runs automatically via cron job or manually
   */
  static async optimizeOldImage(imageId: string, imageUrl: string) {
    try {
      // Download the image
      const response = await fetch(imageUrl);
      const blob = await response.blob();
      const file = new File([blob], 'image.jpg', { type: 'image/jpeg' });
      
      // Super compress (smaller size, lower quality)
      const ultraCompressed = await this.compressImage(file, 400, 0.5);
      
      // Extract path from URL
      const urlParts = imageUrl.split('/');
      const path = urlParts.slice(urlParts.indexOf('avatars')).join('/');
      
      // Replace with compressed version
      const { error } = await supabase.storage
        .from('avatars')
        .update(path, ultraCompressed, {
          contentType: 'image/jpeg',
          upsert: true
        });
      
      if (error) throw error;
      
      // Mark as optimized
      await supabase
        .from('image_uploads')
        .update({ 
          is_optimized: true,
          optimized_at: new Date().toISOString(),
          optimized_size: ultraCompressed.size
        })
        .eq('id', imageId);
      
      return true;
    } catch (error) {
      console.error('Failed to optimize image:', error);
      return false;
    }
  }

  /**
   * Get storage usage statistics
   */
  static async getStorageStats() {
    const { data, error } = await supabase
      .from('image_uploads')
      .select('original_size, compressed_size, optimized_size, is_optimized');
    
    if (error) throw error;
    
    const stats = {
      totalImages: data.length,
      totalOriginalSize: 0,
      totalCompressedSize: 0,
      totalOptimizedSize: 0,
      optimizedCount: 0,
      spaceSaved: 0
    };
    
    data.forEach(img => {
      stats.totalOriginalSize += img.original_size || 0;
      stats.totalCompressedSize += img.compressed_size || 0;
      if (img.is_optimized) {
        stats.optimizedCount++;
        stats.totalOptimizedSize += img.optimized_size || 0;
      }
    });
    
    stats.spaceSaved = stats.totalOriginalSize - stats.totalCompressedSize;
    
    return stats;
  }
}

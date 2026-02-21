import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  base: '/',
  build: {
    outDir: 'dist',
    assetsDir: 'assets',
    chunkSizeWarningLimit: 2000,
    rollupOptions: {
      output: {
        manualChunks(id) {
          // Keep all node_modules together to avoid module resolution issues
          if (id.includes('node_modules')) {
            // Separate large libraries
            if (id.includes('framer-motion')) {
              return 'framer-motion';
            }
            if (id.includes('@supabase')) {
              return 'supabase';
            }
            // Everything else in vendor (including react, lucide-react, etc.)
            return 'vendor';
          }
        }
      }
    }
  }
})
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  base: '/',
  build: {
    outDir: 'dist',
    assetsDir: 'assets',
    chunkSizeWarningLimit: 2000, // Increased to 2MB to suppress warnings for large chunks
    rollupOptions: {
      output: {
        manualChunks(id) {
          // Vendor chunks
          if (id.includes('node_modules')) {
            // Keep React ecosystem together
            if (id.includes('react') || id.includes('react-dom') || id.includes('react-router')) {
              return 'react-vendor';
            }
            // Keep framer-motion separate
            if (id.includes('framer-motion')) {
              return 'framer-motion';
            }
            // Keep lucide-react with vendor to avoid tree-shaking issues
            if (id.includes('lucide-react')) {
              return 'vendor';
            }
            // Supabase
            if (id.includes('@supabase')) {
              return 'supabase';
            }
            // Bcrypt
            if (id.includes('bcryptjs')) {
              return 'bcrypt';
            }
            // Other node_modules
            return 'vendor';
          }
          
          // Services
          if (id.includes('/services/auction')) {
            return 'auction-services';
          }
          if (id.includes('/services/') && (id.includes('auth') || id.includes('password') || id.includes('admin'))) {
            return 'auth-services';
          }
          if (id.includes('/services/')) {
            return 'services';
          }
          
          // Pages
          if (id.includes('/pages/Admin') || id.includes('/pages/SuperAdmin')) {
            return 'admin-pages';
          }
          if (id.includes('/pages/Players/') || id.includes('/pages/PlayerProfile') || id.includes('/pages/PlayerLogin')) {
            return 'player-pages';
          }
          if (id.includes('/pages/Auction') || id.includes('/pages/Registration')) {
            return 'auction-pages';
          }
          if (id.includes('/pages/Brackets/') || id.includes('/pages/GroupStage') || id.includes('/pages/Playoff')) {
            return 'brackets';
          }
          
          // Data
          if (id.includes('/data/heroes') || id.includes('/data/players') || id.includes('/data/admins')) {
            return 'game-data';
          }
        }
      }
    }
  }
})
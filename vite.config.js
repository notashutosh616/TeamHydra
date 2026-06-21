import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    host: true,
    open: true,
  },
  build: {
    rollupOptions: {
      output: {
        // Split big libraries into cacheable vendor chunks
        manualChunks: {
          react: ['react', 'react-dom', 'react-router-dom'],
          motion: ['framer-motion'],
          vendor: ['@supabase/supabase-js', 'lenis'],
        },
      },
    },
  },
})

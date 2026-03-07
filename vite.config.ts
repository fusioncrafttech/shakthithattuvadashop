import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

export default defineConfig({
  base: "./",
  plugins: [
    react(), 
    tailwindcss()
  ],
  server: {
    host: true,
    port: 5173,
    fs: {
      strict: false
    }
  },
  build: {
    rollupOptions: {
      output: {
        manualChunks: {
          vendor: ['react', 'react-dom'],
          router: ['react-router-dom'],
          supabase: ['@supabase/supabase-js'],
          html2canvas: ['html2canvas'],
          purify: ['dompurify']
        }
      }
    },
    chunkSizeWarningLimit: 1500
  },
  optimizeDeps: {
    include: ['react', 'react-dom', 'react-router-dom']
  }
})
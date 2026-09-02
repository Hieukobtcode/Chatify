import path from "path"
import tailwindcss from "@tailwindcss/vite"
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react(), tailwindcss()],
  resolve: {
    alias: {
      "@": path.resolve(import.meta.dirname, "./src"),
    },
  },
  build: {
    // Tối ưu chunk size
    chunkSizeWarningLimit: 600,
    rollupOptions: {
      output: {
        // Tách vendor libraries thành các chunk riêng để cache tốt hơn
        manualChunks(id) {
          if (id.includes('node_modules')) {
            if (id.includes('react') || id.includes('react-dom') || id.includes('react-router')) {
              return 'react-vendor';
            }
            if (id.includes('zustand')) {
              return 'state-vendor';
            }
            if (id.includes('lucide-react') || id.includes('@hugeicons')) {
              return 'icons-vendor';
            }
            if (id.includes('socket.io-client')) {
              return 'socket-vendor';
            }
            if (id.includes('react-hook-form') || id.includes('zod') || id.includes('@hookform')) {
              return 'forms-vendor';
            }
            if (id.includes('axios') || id.includes('clsx') || id.includes('tailwind-merge') || id.includes('class-variance-authority')) {
              return 'utils-vendor';
            }
            return 'vendor';
          }
        },
      },
    },
    // Tối ưu CSS
    cssMinify: true,
    // Tăng tốc build
    minify: 'esbuild',
    // Giảm sourcemap trong production
    sourcemap: false,
    // Tối ưu assets
    assetsInlineLimit: 4096,
  },
  // Tối ưu dev server
  server: {
    port: 5173,
    hmr: true,
  },
  // Cache dependencies
  optimizeDeps: {
    include: ['react', 'react-dom', 'react-router', 'zustand', 'axios', 'socket.io-client'],
  },
})
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],

  // 🔥 NEW: Aggressively strip all console.logs and debuggers in production!
  // This makes your Javascript execution significantly faster on mobile phones.
  esbuild: {
    drop: ['console', 'debugger'],
  },

  build: {
    // Target modern browsers — smaller, faster output
    target: 'esnext',

    // Inline assets smaller than 4KB (icons, tiny svgs) directly into JS
    assetsInlineLimit: 4096,

    // Split CSS per chunk — only load styles for the current page
    cssCodeSplit: true,

    // Minify with esbuild (fast + good)
    minify: 'esbuild',

    // Manual code splitting: separate vendor libs from your app code
    // This means browsers can cache React/Router separately from your pages
    rollupOptions: {
      output: {
        manualChunks: {
          // Core React runtime — almost never changes, cached forever
          'vendor-react': ['react', 'react-dom'],

          // Router — changes rarely
          'vendor-router': ['react-router-dom'],

          // Toast — small utility lib
          'vendor-ui': ['react-hot-toast'],
        },

        // Organised asset file names for better caching
        chunkFileNames: 'assets/js/[name]-[hash].js',
        entryFileNames: 'assets/js/[name]-[hash].js',
        assetFileNames: 'assets/[ext]/[name]-[hash].[ext]',
      },
    },

    // Raise the chunk size warning limit (slider images are intentionally large)
    chunkSizeWarningLimit: 600,
  },

  // Pre-bundle dependencies for faster dev startup
  optimizeDeps: {
    include: ['react', 'react-dom', 'react-router-dom', 'react-hot-toast'],
  },
})
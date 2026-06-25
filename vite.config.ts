import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

export default defineConfig({
  plugins: [react(), tailwindcss()],
  build: {
    target: 'es2020',
    cssCodeSplit: true,
    rollupOptions: {
      output: {
        manualChunks(id) {
          if (id.includes('node_modules/firebase/auth')) return 'firebase-auth'
          if (id.includes('node_modules/firebase/firestore')) return 'firebase-firestore'
          if (id.includes('node_modules/firebase')) return 'firebase-core'
          if (id.includes('node_modules/react-dom') || id.includes('node_modules/react/')) return 'react-vendor'
          if (id.includes('node_modules/react-router')) return 'router'
        },
      },
    },
    chunkSizeWarningLimit: 600,
  },
})

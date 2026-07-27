import { defineConfig } from 'vite'
import path from 'node:path'
import tailwindcss from '@tailwindcss/vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  plugins: [
    react(),
    tailwindcss(),
  ],
  resolve: {
    alias: {
      'face-api.js': path.resolve(__dirname, 'node_modules/face-api.js/build/es6/index.js'),
    },
  },
  optimizeDeps: {
    include: ['face-api.js'],
  },
})
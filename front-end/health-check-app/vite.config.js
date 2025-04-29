import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

export default defineConfig({
  plugins: [
    react(),
    tailwindcss()
  ],
  server: {
    host: '0.0.0.0',
    port: 3000,
    hmr: {
      host: '0.0.0.0',
    },
    cors: true,
    allowedHosts: [
      'localhost', 
      '127.0.0.1',
      '3ce2-2406-7400-94-cd72-b808-694b-b2b0-1e44.ngrok-free.app',
      '*.ngrok-free.app',
      '*.ngrok.io'
    ],
    proxy: {
      '/api': {
        target: 'http://localhost:80',
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/api/, '')
      }
    }
  },
  preview: {
    host: '0.0.0.0',
  }
})
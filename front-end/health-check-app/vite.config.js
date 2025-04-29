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
      clientPort: 443, 
      protocol: 'wss' 
    },
    cors: true,
    allowedHosts: [
      'd5c8-2406-7400-94-c711-d3b9-2bb6-1369-f9.ngrok-free.app',
      'localhost', 
      '127.0.0.1',
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
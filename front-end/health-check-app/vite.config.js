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
        'https://1c76-49-34-211-110.ngrok-free.app',
      '*.ngrok-free.app',
      'localhost', 
      '127.0.0.1',
      '*.ngrok.io'
    ],
    proxy: {
      '/api': {
        target: 'https://1c76-49-34-211-110.ngrok-free.app',
        changeOrigin: true,
        secure: false,
        rewrite: path => path.replace(/^\/api/, '')
      }
    }
  },
  preview: {
    host: '0.0.0.0',
  }
})
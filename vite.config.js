import react from '@vitejs/plugin-react'
import { defineConfig } from 'vite'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    port: 5173,
    proxy: {
      '/api': {
        target: 'https://cloud-backend-2-miwe.onrender.com',
        changeOrigin: true,
        secure: false,
      },
    },
  },
})

import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  server: {
    proxy: {
      '/api': {
        target: 'https://prova:9443',
        changeOrigin: true,
        secure: false, // mkcert cert valido solo per "prova", non localhost
      },
    },
  },
})

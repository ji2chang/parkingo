import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  server: {
    proxy: {
      '/api': {
        // Proxy API requests to the backend running on the host at 9443 (HTTPS).
        // Use localhost so the dev server can connect to the container's exposed port.
        target: 'https://localhost:9443',
        changeOrigin: true,
        secure: false, // mkcert cert valido solo per "prova", non localhost
      },
    },
  },
})

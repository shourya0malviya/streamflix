// Vite dev-server configuration.
// The proxy forwards every /api request to the Express server on port 5000,
// so the frontend code can simply fetch('/api/movies') with no CORS worries.
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  server: {
    port: 5173,
    proxy: {
      '/api': {
        target: 'http://localhost:5000',
        changeOrigin: true
      }
    }
  }
});
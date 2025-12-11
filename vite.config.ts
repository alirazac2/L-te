
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  // Explicitly avoid defining process.env to prevent polyfill issues
  define: {}
});

import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import { fileURLToPath, URL } from 'node:url';

export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      components: fileURLToPath(new URL('./src/components', import.meta.url)),
      shared: fileURLToPath(new URL('./src/shared', import.meta.url)),
      assets: fileURLToPath(new URL('./src/assets', import.meta.url)),
      pages: fileURLToPath(new URL('./src/pages', import.meta.url)),
      utils: fileURLToPath(new URL('./src/utils', import.meta.url)),
    },
  },
  server: {
    port: 3000,
    proxy: {
      '/api': {
        target: 'http://localhost:5000',
        changeOrigin: true,
      },
    },
  },
});

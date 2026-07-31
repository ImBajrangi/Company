import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import path from 'path';

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
    },
  },
  optimizeDeps: {
    exclude: [
      '@firebase/app',
      '@firebase/auth',
      '@firebase/firestore',
      '@firebase/database',
      '@firebase/analytics',
      '@xenova/transformers'
    ],
  },
  build: {
    outDir: 'dist',
    sourcemap: false,
    chunkSizeWarningLimit: 2000,
    rollupOptions: {
      external: [/^@firebase\/.*/, '@xenova/transformers'],
    },
  },
  server: {
    port: 3000,
    open: true,
    watch: {
      ignored: ['**/Vrindopnishad Web/**', '**/Projects/**'],
    },
  },
});

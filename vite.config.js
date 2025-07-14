import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  build: {
    target: 'esnext',
    cssCodeSplit: true, // smaller CSS chunks
    minify: 'esbuild', // fast + small
  },
  optimizeDeps: {
    exclude: ['some-heavy-lib'],
  },
});

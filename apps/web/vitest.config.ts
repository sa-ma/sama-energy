import path from 'node:path';
import { defineConfig } from 'vitest/config';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, '.'),
    },
  },
  server: {
    fs: {
      allow: [path.resolve(__dirname, '..', '..')],
    },
  },
  test: {
    clearMocks: true,
    coverage: {
      provider: 'v8',
      reporter: ['text', 'html'],
      reportsDirectory: './coverage',
    },
    environment: 'jsdom',
    exclude: ['e2e/**', 'node_modules/**'],
    restoreMocks: true,
    setupFiles: ['./vitest.setup.tsx'],
  },
});

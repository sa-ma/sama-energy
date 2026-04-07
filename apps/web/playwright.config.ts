import path from 'node:path';
import { defineConfig } from '@playwright/test';

const repoRoot = path.resolve(__dirname, '../..');

export default defineConfig({
  testDir: './e2e',
  fullyParallel: false,
  reporter: 'list',
  retries: process.env.CI ? 2 : 0,
  timeout: 30_000,
  workers: 1,
  use: {
    baseURL: 'http://localhost:3000',
    trace: 'on-first-retry',
  },
  webServer: [
    {
      command: 'pnpm --filter @sama-energy/api dev',
      cwd: repoRoot,
      env: {
        PORT: '3001',
        WEB_ORIGIN: 'http://localhost:3000',
      },
      reuseExistingServer: !process.env.CI,
      timeout: 120_000,
      url: 'http://localhost:3001/markets',
    },
    {
      command: 'pnpm --filter @sama-energy/web dev',
      cwd: repoRoot,
      env: {
        NEXT_PUBLIC_API_BASE_URL: 'http://localhost:3001',
      },
      reuseExistingServer: !process.env.CI,
      timeout: 120_000,
      url: 'http://localhost:3000',
    },
  ],
});

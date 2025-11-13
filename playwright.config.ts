// @ts-nocheck
import { defineConfig } from '@playwright/test';

export default defineConfig({
  testDir: './e2e',
  use: { baseURL: process.env.BASE_URL || process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000' },
});

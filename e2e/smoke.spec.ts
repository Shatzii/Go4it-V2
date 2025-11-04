// @ts-nocheck
import { test, expect } from '@playwright/test';

test.skip('parent-night page loads', async ({ page }) => {
  await page.goto('/parent-night');
  await expect(page).toHaveTitle(/Go4it|GO4IT/i);
});

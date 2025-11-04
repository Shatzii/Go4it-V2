import { test, expect } from '@playwright/test';

test.describe('GAR Upload Flow', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/login');
    // Mock authentication if needed
  });

  test('should display upload page', async ({ page }) => {
    await page.goto('/gar-upload');
    await expect(page.locator('h1')).toContainText('GAR');
  });

  test('should upload video file', async ({ page }) => {
    await page.goto('/gar-upload');
    
    // Wait for upload form
    const fileInput = page.locator('input[type="file"]');
    await expect(fileInput).toBeVisible();
    
    // This would need a test video file
    // await fileInput.setInputFiles('path/to/test-video.mp4');
  });
});

test.describe('Dashboard', () => {
  test('should display main dashboard', async ({ page }) => {
    await page.goto('/dashboard');
    await expect(page).toHaveTitle(/Dashboard|Go4It/);
    await expect(page.locator('h1')).toBeVisible();
  });

  test('should show performance stats', async ({ page }) => {
    await page.goto('/dashboard');
    
    // Check for stat cards
    await expect(page.locator('[data-testid="gar-score"]')).toBeVisible();
  });
});

test.describe('StarPath', () => {
  test('should display starpath page', async ({ page }) => {
    await page.goto('/starpath');
    await expect(page.locator('h1')).toContainText('StarPath');
  });

  test('should show skill categories', async ({ page }) => {
    await page.goto('/starpath');
    
    // Check for skill categories
    await expect(page.locator('text=Technical')).toBeVisible();
    await expect(page.locator('text=Physical')).toBeVisible();
    await expect(page.locator('text=Mental')).toBeVisible();
    await expect(page.locator('text=Tactical')).toBeVisible();
  });
});

test.describe('Recruiting Hub', () => {
  test('should display recruiting hub', async ({ page }) => {
    await page.goto('/recruiting-hub');
    await expect(page.locator('h1')).toContainText('Recruit');
  });

  test('should show tabs', async ({ page }) => {
    await page.goto('/recruiting-hub');
    
    await expect(page.locator('text=Dashboard')).toBeVisible();
    await expect(page.locator('text=Timeline')).toBeVisible();
    await expect(page.locator('text=Communications')).toBeVisible();
  });
});

test.describe('Academy', () => {
  test('should display academy dashboard', async ({ page }) => {
    await page.goto('/academy/dashboard');
    await expect(page).toHaveURL(/academy/);
  });
});

test.describe('Navigation', () => {
  test('should navigate between main pages', async ({ page }) => {
    await page.goto('/');
    
    // Test navigation links
    await page.click('a[href="/dashboard"]');
    await expect(page).toHaveURL(/dashboard/);
    
    await page.click('a[href="/starpath"]');
    await expect(page).toHaveURL(/starpath/);
  });
});

test.describe('API Health Checks', () => {
  test('should return healthy status', async ({ request }) => {
    const response = await request.get('/api/healthz');
    expect(response.status()).toBe(200);
    
    const json = await response.json();
    expect(json.status).toBe('healthy');
  });

  test('should return starpath health', async ({ request }) => {
    const response = await request.get('/api/healthz/starpath');
    expect(response.status()).toBe(200);
  });
});

test.describe('Performance', () => {
  test('dashboard should load in reasonable time', async ({ page }) => {
    const start = Date.now();
    await page.goto('/dashboard');
    const loadTime = Date.now() - start;
    
    expect(loadTime).toBeLessThan(5000); // 5 seconds max
  });
});

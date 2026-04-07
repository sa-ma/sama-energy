import { test, expect } from '@playwright/test';

test('home redirects to the overview dashboard', async ({ page }) => {
  await page.goto('/');

  await expect(page).toHaveURL(/\/dashboard\/overview$/);
  await expect(page.getByRole('heading', { name: 'Market Overview' })).toBeVisible();
});

test('overview deep links load and keep filter changes shareable in the URL', async ({
  page,
}) => {
  await page.goto('/dashboard/overview?market=DE&durationHours=4&dateRange=6M');

  await expect(page.getByRole('heading', { name: 'Market Overview' })).toBeVisible();
  await expect(page.getByText('€58,500')).toBeVisible();

  await page.getByRole('button', { name: '1h' }).click();

  await expect(page).toHaveURL(
    /\/dashboard\/overview\?market=DE&durationHours=1&dateRange=6M$/,
  );
  await expect(page.getByText('€45,200')).toBeVisible();
});

test('comparison deep links load and enforce market selection constraints', async ({
  page,
}) => {
  await page.goto('/dashboard/comparison?markets=GB,DE,ERCOT&durationHours=1&dateRange=12M');

  await expect(page.getByRole('heading', { name: 'Market Comparison' })).toBeVisible();
  await expect(page.getByText('£38,100')).toBeVisible();
  await expect(page.getByLabel('Remove Great Britain')).toBeVisible();

  await page.getByLabel('Remove Germany').click();

  await expect(page).toHaveURL(
    /\/dashboard\/comparison\?durationHours=1&dateRange=12M$/,
  );
  await expect(page.getByLabel('Remove Great Britain')).toHaveCount(0);
});

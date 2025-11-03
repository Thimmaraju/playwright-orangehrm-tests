const { test, expect } = require('@playwright/test');

test.describe('OrangeHRM Login Tests', () => {
  test.beforeEach(async ({ page }) => {
    // Navigate to the login page before each test
    await page.goto('https://opensource-demo.orangehrmlive.com/web/index.php/auth/login');
  });

  test('successful login with valid credentials', async ({ page }) => {
    // Default credentials for demo site
    // Username : Admin
    // Password : admin123

    // Wait for the login form to be visible
    await page.waitForSelector('input[name="username"]');

    // Fill in the username
    await page.fill('input[name="username"]', 'Admin');

    // Fill in the password
    await page.fill('input[name="password"]', 'admin123');

    // Click the login button
    await page.click('button[type="submit"]');

    // Verify successful login by checking if we're redirected to the dashboard
    await expect(page).toHaveURL(/.*\/dashboard/);

    // Verify that the dashboard element is visible
    await expect(page.locator('.oxd-text').filter({ hasText: 'Dashboard' })).toBeVisible();
  });

  test('failed login with invalid credentials', async ({ page }) => {
    // Wait for the login form to be visible
    await page.waitForSelector('input[name="username"]');

    // Fill in an invalid username
    await page.fill('input[name="username"]', 'invalidUser');

    // Fill in an invalid password
    await page.fill('input[name="password"]', 'invalidPassword');

    // Click the login button
    await page.click('button[type="submit"]');

    // Verify that the error message is displayed
    await expect(page.locator('.oxd-text.oxd-text--p.oxd-alert-content-text'))
      .toHaveText('Invalid credentials');
  });
});
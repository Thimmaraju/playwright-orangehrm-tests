const { test, expect } = require('@playwright/test');
const LoginPage = require('../pages/LoginPage');
const AdminPage = require('../pages/AdminPage');
const PIMPage = require('../pages/PIMPage');
const testData = require('../testData/adminData.json');
const employeeData = require('../testData/employeeData.json');

test.describe('Admin Module Tests', () => {
    let loginPage;
    let adminPage;
    let pimPage;
    
    // Configure timeout and retry
    test.setTimeout(120000);
    test.use({ retries: 1 });

    test.beforeEach(async ({ page }) => {
        loginPage = new LoginPage(page);
        adminPage = new AdminPage(page);
        pimPage = new PIMPage(page);

        // Login before each test
        await loginPage.navigate();
        await loginPage.login(testData.loginCredentials.username, testData.loginCredentials.password);
    });

    test('should navigate to Admin page successfully', async ({ page }) => {
        await adminPage.navigateToAdmin();
        const url = page.url();
        expect(url).toContain('/admin/viewSystemUsers');
    });

    test('should add a new ESS user successfully', async ({ page }) => {
        // Navigate to admin and add new user
        await adminPage.navigateToAdmin();
        await adminPage.clickAddUser();
        
        // Add the ESS user (using existing employee)
        const isSuccess = await adminPage.addUser(testData.adminUsers[0]);
        expect(isSuccess).toBeTruthy();
    });

    test('should add a new Admin user successfully', async ({ page }) => {
        // Navigate to admin and add new user
        await adminPage.navigateToAdmin();
        await adminPage.clickAddUser();

        // Now create a user for this employee
        await adminPage.navigateToAdmin();
        await adminPage.clickAddUser();
        const isSuccess = await adminPage.addUser(testData.adminUsers[1]);
        expect(isSuccess).toBeTruthy();
    });

    test('should search and find user with exact criteria', async ({ page }) => {
        await adminPage.navigateToAdmin();
        const results = await adminPage.searchUser(testData.searchCriteria.validSearch);
        expect(results.length).toBeGreaterThan(0);
        expect(results[0].username).toBe(testData.searchCriteria.validSearch.username);
    });

    test('should search with partial criteria', async ({ page }) => {
        await adminPage.navigateToAdmin();
        const results = await adminPage.searchUser(testData.searchCriteria.partialSearch);
        expect(results.length).toBeGreaterThan(0);
        // Verify all results match the search criteria
        for (const result of results) {
            expect(result.userRole).toBe(testData.searchCriteria.partialSearch.userRole);
            expect(result.status).toBe(testData.searchCriteria.partialSearch.status);
        }
    });

    test('should return no results for invalid search', async ({ page }) => {
        await adminPage.navigateToAdmin();
        const results = await adminPage.searchUser(testData.searchCriteria.invalidSearch);
        expect(results.length).toBe(0);
    });

    test('should reset search form successfully', async ({ page }) => {
        await adminPage.navigateToAdmin();
        // First perform a search
        await adminPage.searchUser(testData.searchCriteria.validSearch);
        // Then reset
        await adminPage.resetSearch();
        
        // Verify form is reset by checking if fields are empty
        const usernameValue = await page.$eval(adminPage.searchUsernameInput, el => el.value);
        expect(usernameValue).toBe('');
    });
});
const { test, expect } = require('@playwright/test');
const LoginPage = require('../pages/LoginPage');
const PIMPage = require('../pages/PIMPage');
const testData = require('../testData/employeeData.json');

test.describe('PIM Module - Add Employee Tests', () => {
    let loginPage;
    let pimPage;
    
    // Configure timeout and retry for these tests
    test.setTimeout(120000); // 2 minutes
    test.use({ retries: 2 }); // Retry failed tests up to 2 times

    test.beforeEach(async ({ page }) => {
        loginPage = new LoginPage(page);
        pimPage = new PIMPage(page);

        // Navigate and login before each test
        await loginPage.navigate();
        await loginPage.login(testData.loginCredentials.username, testData.loginCredentials.password);
    });

    test('should add a new employee with all details', async ({ page }) => {
        // Navigate to PIM module
        await pimPage.navigateToPIM();
        
        // Click on Add Employee button
        await pimPage.clickAddEmployee();

        // Add employee using first test data record
        const isSuccess = await pimPage.addEmployee(testData.employeeData[0]);
        
        // Verify employee was added successfully
        expect(isSuccess).toBeTruthy();
    });

    test('should add an employee without middle name', async ({ page }) => {
        // Navigate to PIM module
        await pimPage.navigateToPIM();
        
        // Click on Add Employee button
        await pimPage.clickAddEmployee();

        // Add employee using second test data record
        const isSuccess = await pimPage.addEmployee(testData.employeeData[1]);
        
        // Verify employee was added successfully
        expect(isSuccess).toBeTruthy();
    });
});
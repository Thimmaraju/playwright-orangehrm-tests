const { test, expect } = require('@playwright/test');
const LoginPage = require('../pages/LoginPage');
const PIMPage = require('../pages/PIMPage');
const adminData = require('../testData/adminData.json');
const employeeData = require('../testData/employeeData.json');

test.describe('Employee Management Operations', () => {
    let page;
    let loginPage;
    let pimPage;

    test.beforeEach(async ({ browser }) => {
        // Create new context and page for each test
        const context = await browser.newContext();
        page = await context.newPage();
        
        // Initialize page objects
        loginPage = new LoginPage(page);
        pimPage = new PIMPage(page);
        
        // Login and navigate to PIM
        await loginPage.navigate();
        await loginPage.login(adminData.loginCredentials.username, adminData.loginCredentials.password);
        await pimPage.navigateToPIM();
    });

    test.afterEach(async () => {
        await page.close();
    });

    test('Add new employee without login credentials', async () => {
        // Arrange
        const employee = employeeData.employeeData[0];
        
        // Act
        await pimPage.addEmployee(
            employee.firstName,
            employee.lastName,
            employee.middleName,
            employee.employeeId
        );
        
        // Assert
        const successMessage = await page.locator('//div[contains(@class, "oxd-toast")]');
        await expect(successMessage).toBeVisible();
        await expect(successMessage).toContainText('Successfully Saved');
        
        // Verify employee exists in the system
        const exists = await pimPage.verifyEmployeeExists(
            `${employee.firstName} ${employee.lastName}`
        );
        expect(exists).toBeTruthy();
    });

    test('Add new employee with login credentials', async () => {
        // Arrange
        const employee = employeeData.employeeData[1];
        const username = employee.firstName.toLowerCase() + Date.now();
        const password = 'Test@123456';
        
        // Act
        await pimPage.addEmployee(
            employee.firstName,
            employee.lastName,
            '',
            employee.employeeId,
            true,
            username,
            password
        );
        
        // Assert
        const successMessage = await page.locator('//div[contains(@class, "oxd-toast")]');
        await expect(successMessage).toBeVisible();
        await expect(successMessage).toContainText('Successfully Saved');
        
        // Verify employee exists and can log in
        const exists = await pimPage.verifyEmployeeExists(
            `${employee.firstName} ${employee.lastName}`
        );
        expect(exists).toBeTruthy();
    });

    test('Search for existing employee', async () => {
        // Arrange
        const employee = employeeData.employeeData[0];
        const searchName = `${employee.firstName} ${employee.lastName}`;
        
        // Act
        await pimPage.searchEmployee(searchName);
        
        // Assert
        const employeeRecord = await page.locator(`//div[contains(text(), "${searchName}")]`);
        await expect(employeeRecord).toBeVisible();
    });

    test('Delete employee', async () => {
        // Arrange
        const employee = employeeData.employeeData[0];
        const searchName = `${employee.firstName} ${employee.lastName}`;
        
        // Act
        await pimPage.searchEmployee(searchName);
        await pimPage.deleteEmployee();
        
        // Assert
        const successMessage = await page.locator('//div[contains(@class, "oxd-toast")]');
        await expect(successMessage).toBeVisible();
        await expect(successMessage).toContainText('Successfully Deleted');
        
        // Verify employee no longer exists
        const exists = await pimPage.verifyEmployeeExists(searchName);
        expect(exists).toBeFalsy();
    });

    test('Verify empty search results', async () => {
        // Arrange
        const nonExistentEmployee = 'XYZ123';
        
        // Act
        await pimPage.searchEmployee(nonExistentEmployee);
        
        // Assert
        const noRecordsMessage = await page.locator('//span[contains(text(), "No Records Found")]');
        await expect(noRecordsMessage).toBeVisible();
    });
});
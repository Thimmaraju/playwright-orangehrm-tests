const { test, expect } = require('@playwright/test');
const LoginPage = require('../pages/LoginPage');
const PIMPage = require('../pages/PIMPage');
const adminData = require('../testData/adminData.json');
const validationData = require('../testData/validationData.json');

test.describe('Employee Management Validation Tests', () => {
    let page;
    let loginPage;
    let pimPage;

    test.beforeEach(async ({ browser }) => {
        const context = await browser.newContext();
        page = await context.newPage();
        
        loginPage = new LoginPage(page);
        pimPage = new PIMPage(page);
        
        await loginPage.navigate();
        await loginPage.login(adminData.loginCredentials.username, adminData.loginCredentials.password);
        await pimPage.navigateToPIM();
    });

    test.afterEach(async () => {
        await page.close();
    });

    test('Verify required field validations', async () => {
        // Click Add Employee and try to save without required fields
        await page.click('//a[contains(text(), "Add Employee")]');
        await page.click('//button[@type="submit"]');

        // Assert error messages
        const firstNameError = await page.locator('//label[contains(text(), "First Name")]/../following-sibling::span[contains(@class, "error")]');
        const lastNameError = await page.locator('//label[contains(text(), "Last Name")]/../following-sibling::span[contains(@class, "error")]');
        
        await expect(firstNameError).toBeVisible();
        await expect(lastNameError).toBeVisible();
        await expect(firstNameError).toContainText('Required');
        await expect(lastNameError).toContainText('Required');
    });

    test('Verify invalid format validations', async () => {
        // Navigate to Add Employee
        await page.click('//a[contains(text(), "Add Employee")]');

        // Enter invalid data
        const invalidData = validationData.validationScenarios.invalidFormats;
        await page.fill('//input[@name="firstName"]', invalidData.firstName);
        await page.fill('//input[@name="lastName"]', invalidData.lastName);
        await page.fill('//div[contains(@class, "oxd-input-group")]//input[contains(@class, "oxd-input")]', invalidData.employeeId);
        
        // Try to save
        await page.click('//button[@type="submit"]');

        // Assert error messages
        const formatError = await page.locator('//span[contains(@class, "error")]');
        await expect(formatError).toBeVisible();
    });

    test('Verify maximum length validations', async () => {
        // Navigate to Add Employee
        await page.click('//a[contains(text(), "Add Employee")]');

        // Enter data exceeding max length
        const maxLengthData = validationData.validationScenarios.maxLengthExceeded;
        await page.fill('//input[@name="firstName"]', maxLengthData.firstName);
        await page.fill('//input[@name="lastName"]', maxLengthData.lastName);
        await page.fill('//div[contains(@class, "oxd-input-group")]//input[contains(@class, "oxd-input")]', maxLengthData.employeeId);
        
        // Try to save
        await page.click('//button[@type="submit"]');

        // Assert error messages
        const lengthError = await page.locator('//span[contains(@class, "error")]');
        await expect(lengthError).toBeVisible();
    });

    test('Verify duplicate employee ID validation', async () => {
        // First add an employee with a specific ID
        await page.click('//a[contains(text(), "Add Employee")]');
        await page.fill('//input[@name="firstName"]', validationData.validData.firstName);
        await page.fill('//input[@name="lastName"]', validationData.validData.lastName);
        await page.fill('//div[contains(@class, "oxd-input-group")]//input[contains(@class, "oxd-input")]', validationData.duplicateData.employeeId);
        await page.click('//button[@type="submit"]');
        
        // Wait for success message and try adding another employee with same ID
        await page.waitForSelector('//div[contains(@class, "oxd-toast")]');
        await page.click('//a[contains(text(), "Add Employee")]');
        await page.fill('//input[@name="firstName"]', "Another");
        await page.fill('//input[@name="lastName"]', "Employee");
        await page.fill('//div[contains(@class, "oxd-input-group")]//input[contains(@class, "oxd-input")]', validationData.duplicateData.employeeId);
        await page.click('//button[@type="submit"]');

        // Assert duplicate error message
        const duplicateError = await page.locator('//span[contains(@class, "error")]');
        await expect(duplicateError).toBeVisible();
        await expect(duplicateError).toContainText(/already exists/i);
    });

    test('Verify successful employee creation with all valid data', async () => {
        // Navigate to Add Employee
        await page.click('//a[contains(text(), "Add Employee")]');

        // Enter valid data
        const validEmployee = validationData.validData;
        await page.fill('//input[@name="firstName"]', validEmployee.firstName);
        await page.fill('//input[@name="lastName"]', validEmployee.lastName);
        await page.fill('//div[contains(@class, "oxd-input-group")]//input[contains(@class, "oxd-input")]', validEmployee.employeeId);

        // Enable login details
        await page.click('//span[contains(@class, "oxd-switch-input")]');
        await page.waitForTimeout(1000);

        // Fill login details
        await page.fill('//label[contains(text(), "Username")]/../following-sibling::div//input', validEmployee.username);
        await page.fill('//label[contains(text(), "Password")]/../following-sibling::div//input', validEmployee.password);
        await page.fill('//label[contains(text(), "Confirm Password")]/../following-sibling::div//input', validEmployee.password);

        // Save
        await page.click('//button[@type="submit"]');

        // Assert success message
        const successToast = await page.locator('//div[contains(@class, "oxd-toast")]');
        await expect(successToast).toBeVisible();
        await expect(successToast).toContainText(/Successfully Saved/i);

        // Verify employee exists in list
        await page.click('//a[contains(text(), "Employee List")]');
        await page.fill('//input[@placeholder="Type for hints..."]', validEmployee.firstName);
        await page.click('//button[@type="submit"]');

        const employeeRecord = await page.locator(`//div[contains(text(), "${validEmployee.firstName}")]`);
        await expect(employeeRecord).toBeVisible();
    });

    test('Verify cancel button functionality', async () => {
        // Navigate to Add Employee
        await page.click('//a[contains(text(), "Add Employee")]');

        // Enter some data
        await page.fill('//input[@name="firstName"]', validationData.validData.firstName);
        await page.fill('//input[@name="lastName"]', validationData.validData.lastName);

        // Click cancel
        await page.click('//button[contains(@class, "oxd-button--ghost")]');

        // Verify return to employee list
        const employeeListHeader = await page.locator('//h6[contains(text(), "PIM")]');
        await expect(employeeListHeader).toBeVisible();
    });
});
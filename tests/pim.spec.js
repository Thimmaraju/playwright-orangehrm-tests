const { test, expect } = require('@playwright/test');
const { LoginPage } = require('../pages/LoginPage');
const { PIMPage } = require('../pages/PIMPage');

test.describe('PIM Module Tests', () => {
    let loginPage;
    let pimPage;

    test.beforeEach(async ({ page }) => {
        loginPage = new LoginPage(page);
        pimPage = new PIMPage(page);
        await loginPage.navigate();
        await loginPage.login('Admin', 'admin123');
    });

    test('Navigate to PIM and verify list page elements', async ({ page }) => {
        // Navigate to PIM module
        await pimPage.navigateToPIM();
        
        // Verify employee list page elements
        await expect(page.locator('.orangehrm-employee-list')).toBeVisible();
        await expect(page.locator('.oxd-table-header')).toBeVisible();
        await expect(page.locator('.oxd-form')).toBeVisible();
    });

    test('Search employee by name', async ({ page }) => {
        await pimPage.navigateToPIM();
        await pimPage.searchEmployee({ employeeName: 'John' });
        await expect(page.locator('.oxd-table-body')).toBeVisible();
    });

    test('Add new employee with minimum required fields', async ({ page }) => {
        await pimPage.navigateToPIM();
        await pimPage.clickAddEmployee();
        
        const employeeData = {
            firstName: 'John',
            lastName: 'Doe'
        };
        
        await pimPage.addEmployee(employeeData);
        await expect(page.locator('.oxd-toast')).toContainText('Successfully Saved');
    });

    test('Add employee with all fields', async ({ page }) => {
        await pimPage.navigateToPIM();
        await pimPage.clickAddEmployee();
        
        const employeeData = {
            firstName: 'Jane',
            middleName: 'Marie',
            lastName: 'Smith',
            employeeId: '1234',
            createLoginDetails: true,
            username: 'jsmith',
            password: 'Pass123!@#',
            status: 'Enabled'
        };
        
        await pimPage.addEmployee(employeeData);
        await expect(page.locator('.oxd-toast')).toContainText('Successfully Saved');
    });

    test('Edit employee personal details', async ({ page }) => {
        await pimPage.navigateToPIM();
        await pimPage.searchAndSelectEmployee('John Doe');
        
        const updateData = {
            nationality: 'American',
            maritalStatus: 'Single',
            dateOfBirth: '1990-01-01'
        };
        
        await pimPage.editEmployeePersonalDetails(updateData);
        await expect(page.locator('.oxd-toast')).toContainText('Successfully Updated');
    });

    test('Delete employee', async ({ page }) => {
        await pimPage.navigateToPIM();
        await pimPage.searchAndSelectEmployee('John Doe');
        await pimPage.deleteEmployee();
        await expect(page.locator('.oxd-toast')).toContainText('Successfully Deleted');
    });

    test('Generate and download employee report', async ({ page }) => {
        await pimPage.navigateToPIM();
        await pimPage.navigateToReports();
        await pimPage.generateReport({
            reportName: 'Employee Personal Details',
            criteria: ['Personal', 'Job']
        });
        await expect(page.locator('.oxd-toast')).toContainText('Report Generated');
    });

    test('Validate employee search filters', async ({ page }) => {
        await pimPage.navigateToPIM();
        
        const searchCriteria = {
            employmentStatus: 'Full-Time',
            includeType: 'Current Employees',
            supervisorName: 'Linda Anderson'
        };
        
        await pimPage.searchWithFilters(searchCriteria);
        await expect(page.locator('.oxd-table-body')).toBeVisible();
    });

    test('Verify field validations during employee creation', async ({ page }) => {
        await pimPage.navigateToPIM();
        await pimPage.clickAddEmployee();
        
        // Try to save without required fields
        await page.click('button[type="submit"]');
        await expect(page.locator('.oxd-input-field-error-message')).toBeVisible();
        
        // Try invalid employee ID format
        await pimPage.fillEmployeeId('ABC#123');
        await expect(page.locator('.oxd-input-field-error-message'))
            .toContainText('Invalid');
    });
});
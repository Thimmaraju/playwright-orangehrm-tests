const { test, expect } = require('@playwright/test');
const LoginPage = require('../pages/LoginPage');
const EmployeeSearchPage = require('../pages/EmployeeSearchPage');
const adminData = require('../testData/adminData.json');
const searchData = require('../testData/searchEmployeeData.json');

test.describe('Employee Search Operations', () => {
    let page;
    let loginPage;
    let employeeSearchPage;

    test.beforeEach(async ({ browser }) => {
        // Create new context and page for each test
        const context = await browser.newContext();
        page = await context.newPage();
        
        // Initialize page objects
        loginPage = new LoginPage(page);
        employeeSearchPage = new EmployeeSearchPage(page);
        
        // Login and navigate to Employee List
        await loginPage.navigate();
        await loginPage.login(adminData.loginCredentials.username, adminData.loginCredentials.password);
        await employeeSearchPage.navigateToEmployeeList();
    });

    test.afterEach(async () => {
        await page.close();
    });

    test('Search employee by full name', async () => {
        // Arrange
        const employeeName = searchData.searchScenarios[0].name;
        
        // Act
        await employeeSearchPage.searchByName(employeeName);
        
        // Assert
        const results = await employeeSearchPage.getSearchResults();
        expect(results).toBeGreaterThan(0);
        
        const resultsText = await employeeSearchPage.getResultsText();
        expect(resultsText.some(text => text.includes(employeeName))).toBeTruthy();
    });

    test('Search employee by ID', async () => {
        // Arrange
        const employeeId = searchData.searchScenarios[0].id;
        
        // Act
        await employeeSearchPage.searchById(employeeId);
        
        // Assert
        const results = await employeeSearchPage.getSearchResults();
        expect(results).toBe(1);
        
        const resultsText = await employeeSearchPage.getResultsText();
        expect(resultsText[0]).toContain(employeeId);
    });

    test('Search by employment status', async () => {
        // Arrange
        const status = searchData.searchScenarios[0].employmentStatus;
        
        // Act
        await employeeSearchPage.searchByEmploymentStatus(status);
        
        // Assert
        const results = await employeeSearchPage.getSearchResults();
        expect(results).toBeGreaterThan(0);
    });

    test('Search by supervisor name', async () => {
        // Arrange
        const supervisor = searchData.searchScenarios[0].supervisorName;
        
        // Act
        await employeeSearchPage.searchBySupervisor(supervisor);
        
        // Assert
        const results = await employeeSearchPage.getSearchResults();
        expect(results).toBeGreaterThan(0);
    });

    test('Search by job title', async () => {
        // Arrange
        const jobTitle = searchData.searchScenarios[0].jobTitle;
        
        // Act
        await employeeSearchPage.searchByJobTitle(jobTitle);
        
        // Assert
        const results = await employeeSearchPage.getSearchResults();
        expect(results).toBeGreaterThan(0);
    });

    test('Search with partial name match', async () => {
        // Arrange
        const partialName = searchData.partialSearchData.partialName;
        
        // Act
        await employeeSearchPage.searchByName(partialName);
        
        // Assert
        const results = await employeeSearchPage.getSearchResults();
        expect(results).toBeGreaterThan(0);
        
        const resultsText = await employeeSearchPage.getResultsText();
        expect(resultsText.some(text => text.toLowerCase().includes(partialName.toLowerCase()))).toBeTruthy();
    });

    test('Search with invalid employee ID', async () => {
        // Arrange
        const invalidId = searchData.invalidSearchData.invalidId;
        
        // Act
        await employeeSearchPage.searchById(invalidId);
        
        // Assert
        const noRecordsMessage = await employeeSearchPage.isNoRecordsMessageDisplayed();
        expect(noRecordsMessage).toBeTruthy();
    });

    test('Reset search form', async () => {
        // Arrange
        await employeeSearchPage.searchByName(searchData.searchScenarios[0].name);
        
        // Act
        await employeeSearchPage.resetSearch();
        
        // Assert
        const nameInput = await page.inputValue(employeeSearchPage.employeeNameInput);
        expect(nameInput).toBe('');
        
        const idInput = await page.inputValue(employeeSearchPage.employeeIdInput);
        expect(idInput).toBe('');
    });

    test('Sort search results by ID', async () => {
        // Arrange - Get all employees
        await employeeSearchPage.searchById(searchData.partialSearchData.partialId);
        
        // Act
        await employeeSearchPage.sortByColumn('id');
        
        // Assert
        const results = await employeeSearchPage.getSearchResults();
        expect(results).toBeGreaterThan(1);
    });

    test('Search with special characters', async () => {
        // Arrange
        const specialChars = searchData.invalidSearchData.specialCharacters;
        
        // Act
        await employeeSearchPage.searchByName(specialChars);
        
        // Assert
        const noRecordsMessage = await employeeSearchPage.isNoRecordsMessageDisplayed();
        expect(noRecordsMessage).toBeTruthy();
    });
});
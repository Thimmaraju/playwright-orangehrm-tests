class AdminPage {
    constructor(page) {
        this.page = page;
        // Menu and Navigation
        this.adminMenuLink = '//span[text()="Admin"]';
        
        // Add User elements
        this.addButton = '//button[contains(@class, "oxd-button--secondary")]';
        this.userRoleDropdown = '//label[contains(text(), "User Role")]/../..//div[contains(@class, "oxd-select-text")]';
        this.statusDropdown = '//label[contains(text(), "Status")]/../..//div[contains(@class, "oxd-select-text")]';
        this.employeeNameInput = '//label[contains(text(), "Employee Name")]/../..//input';
        this.usernameInput = '//label[contains(text(), "Username")]/../..//input';
        this.passwordInput = '//label[contains(text(), "Password")]/../..//input';
        this.confirmPasswordInput = '//label[contains(text(), "Confirm Password")]/../..//input';
        this.saveButton = 'button[type="submit"]';
        
        // Search elements
        this.searchUsernameInput = '//label[normalize-space()="Username"]/../..//input';
        this.searchUserRoleDropdown = '//label[normalize-space()="User Role"]/../..//div[contains(@class, "oxd-select-text")]';
        this.searchEmployeeNameInput = '//label[normalize-space()="Employee Name"]/../..//input';
        this.searchStatusDropdown = '//label[normalize-space()="Status"]/../..//div[contains(@class, "oxd-select-text")]';
        this.searchButton = '//button[@type="submit"]';
        this.resetButton = '//button[@type="reset"]';
        
        // Results and messages
        this.successMessage = '//div[contains(@class, "oxd-toast")]';
        this.noRecordsMessage = '//span[normalize-space()="No Records Found"]';
        this.resultsTable = '//div[contains(@class, "oxd-table")]';
    }

    async navigateToAdmin() {
        await this.page.waitForLoadState('networkidle');
        await this.page.waitForSelector(this.adminMenuLink, { state: 'visible' });
        await this.page.click(this.adminMenuLink);
        await this.page.waitForLoadState('networkidle');
    }

    async clickAddUser() {
        await this.page.waitForSelector(this.addButton);
        await this.page.click(this.addButton);
        await this.page.waitForLoadState('networkidle');
    }

    async selectDropdownOption(dropdownSelector, option) {
        await this.page.waitForSelector(dropdownSelector, { state: 'visible' });
        await this.page.click(dropdownSelector);
        await this.page.waitForTimeout(1000); // Wait for dropdown animation
        
        // Use a more specific selector for dropdown options
        const optionXPath = `//div[@role="listbox"]//span[normalize-space()="${option}"]`;
        await this.page.waitForSelector(optionXPath, { state: 'visible' });
        await this.page.click(optionXPath);
        await this.page.waitForTimeout(500); // Wait for dropdown to close
    }

    async addUser(userData) {
        // Wait for the form to be fully loaded
        await this.page.waitForLoadState('networkidle');
        
        // Select User Role
        await this.selectDropdownOption(this.userRoleDropdown, userData.userRole);
        
        // Handle Employee Name with autocomplete
        await this.page.waitForSelector(this.employeeNameInput, { state: 'visible' });
        await this.page.fill(this.employeeNameInput, userData.employeeName);
        await this.page.waitForTimeout(2000); // Wait longer for employee suggestions
        
        // Wait for and click the employee suggestion
        const employeeOption = `//div[@role="listbox"]//span[contains(text(),"${userData.employeeName}")]`;
        try {
            await this.page.waitForSelector(employeeOption, { timeout: 5000 });
            await this.page.click(employeeOption);
        } catch (error) {
            console.log('Employee suggestion not found, trying alternative method...');
            // Alternative: Try to select the first suggestion
            const firstSuggestion = '//div[@role="listbox"]//span';
            await this.page.waitForSelector(firstSuggestion);
            await this.page.click(firstSuggestion);
        }
        
        // Select Status
        await this.selectDropdownOption(this.statusDropdown, userData.status);
        
        // Fill in username and password
        await this.page.fill(this.usernameInput, userData.username);
        await this.page.fill(this.passwordInput, userData.password);
        await this.page.fill(this.confirmPasswordInput, userData.password);
        
        // Save the user
        await this.page.click(this.saveButton);
        
        // Wait for success message
        await this.page.waitForSelector(this.successMessage, { 
            state: 'visible',
            timeout: 10000 
        });
        
        const successText = await this.page.textContent(this.successMessage);
        return successText.includes('Successfully Saved');
    }

    async searchUser(searchCriteria) {
        await this.page.waitForLoadState('networkidle');
        
        // Fill in search criteria
        if (searchCriteria.username) {
            await this.page.waitForSelector(this.searchUsernameInput, { state: 'visible' });
            await this.page.fill(this.searchUsernameInput, searchCriteria.username);
        }
        
        if (searchCriteria.userRole) {
            await this.selectDropdownOption(this.searchUserRoleDropdown, searchCriteria.userRole);
        }
        
        if (searchCriteria.employeeName) {
            await this.page.waitForSelector(this.searchEmployeeNameInput, { state: 'visible' });
            await this.page.fill(this.searchEmployeeNameInput, searchCriteria.employeeName);
            await this.page.waitForTimeout(2000);
            
            try {
                const employeeOption = `//div[@role="listbox"]//span[contains(text(),"${searchCriteria.employeeName}")]`;
                await this.page.waitForSelector(employeeOption, { timeout: 5000 });
                await this.page.click(employeeOption);
            } catch (error) {
                console.log('Employee suggestion not found in search...');
            }
        }
        
        if (searchCriteria.status) {
            await this.selectDropdownOption(this.searchStatusDropdown, searchCriteria.status);
        }
        
        // Click search button
        await this.page.click(this.searchButton);
        await this.page.waitForLoadState('networkidle');
        
        // Check if results exist
        const noRecordsExists = await this.page.$(this.noRecordsMessage);
        if (noRecordsExists) {
            return [];
        }
        
        // Get search results
        await this.page.waitForSelector(this.resultsTable);
        return this.getSearchResults();
    }

    async getSearchResults() {
        const rows = await this.page.$$('//div[contains(@class, "oxd-table-body")]//div[contains(@class, "oxd-table-row")]');
        const results = [];
        
        for (const row of rows) {
            const cells = await row.$$('//div[contains(@class, "oxd-table-cell")]');
            const result = {
                username: await cells[1].textContent(),
                userRole: await cells[2].textContent(),
                employeeName: await cells[3].textContent(),
                status: await cells[4].textContent()
            };
            results.push(result);
        }
        
        return results;
    }

    async resetSearch() {
        await this.page.click(this.resetButton);
        await this.page.waitForLoadState('networkidle');
    }
}

module.exports = AdminPage;
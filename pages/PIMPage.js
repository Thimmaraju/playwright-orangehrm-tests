class PIMPage {
    constructor(page) {
        this.page = page;
        // Navigation
        this.pimMenuLink = '//a[contains(@href, "viewPimModule")]';
        this.addEmployeeButton = '//button[normalize-space()="Add"]';
        
        // Form inputs
        this.firstNameInput = '//input[@name="firstName"]';
        this.middleNameInput = '//input[@name="middleName"]';
        this.lastNameInput = '//input[@name="lastName"]';
        this.employeeIdInput = '//div[contains(@class, "oxd-grid-item")]//input[contains(@class, "oxd-input")]';
        this.saveButton = '//button[@type="submit"]';
        
        // Search form elements
        this.employeeNameSearchInput = '//input[@placeholder="Type for hints..."]';
        this.employeeIdSearchInput = '(//div[contains(@class, "oxd-input-group")]//input)[2]';
        this.searchButton = '//button[@type="submit"]';
        this.resetButton = '//button[normalize-space()="Reset"]';
        
        // Table elements
        this.employeeTable = '.orangehrm-employee-list';
        this.tableHeader = '.oxd-table-header';
        this.tableBody = '.oxd-table-body';
        
        // Messages and notifications
        this.successMessage = '//div[contains(@class, "oxd-toast")]';
        this.errorMessage = '.oxd-input-field-error-message';
        
        // Report elements
        this.reportsTab = '//a[contains(@href, "viewDefinedPredefinedReports")]';
        this.reportNameInput = '.oxd-input--active';
    }

    async navigateToPIM() {
        // Wait for the dashboard to be fully loaded
        await this.page.waitForLoadState('networkidle');
        // Wait for PIM menu and click
        await this.page.waitForSelector(this.pimMenuLink, { state: 'visible' });
        await this.page.click(this.pimMenuLink);
        // Wait for the PIM page to load
        await this.page.waitForLoadState('networkidle');
    }

    async clickAddEmployee() {
        // Wait for the Add button to be visible and clickable
        await this.page.waitForSelector(this.addEmployeeButton, { state: 'visible' });
        await this.page.click(this.addEmployeeButton);
        // Wait for the form to load
        await this.page.waitForLoadState('networkidle');
    }

    async addEmployee(employeeData) {
        try {
            // Wait for the form fields to be visible
            await this.page.waitForSelector(this.firstNameInput, { state: 'visible', timeout: 5000 });
            await this.page.waitForSelector(this.lastNameInput, { state: 'visible', timeout: 5000 });

            // Clear and fill in employee details
            await this.page.fill(this.firstNameInput, employeeData.firstName);
            if (employeeData.middleName) {
                await this.page.fill(this.middleNameInput, employeeData.middleName);
            }
            await this.page.fill(this.lastNameInput, employeeData.lastName);

            if (employeeData.employeeId) {
                await this.page.waitForSelector(this.employeeIdInput, { state: 'visible', timeout: 5000 });
                // Clear the existing employee ID first
                await this.page.click(this.employeeIdInput);
                await this.page.keyboard.press('Control+A');
                await this.page.keyboard.press('Backspace');
                await this.page.fill(this.employeeIdInput, employeeData.employeeId);
            }

            if (employeeData.createLoginDetails) {
                await this.page.click('.oxd-switch-input');
                await this.page.fill('//input[@name="username"]', employeeData.username);
                await this.page.fill('//input[@type="password"]', employeeData.password);
                await this.page.fill('//input[@type="password"]', employeeData.password);
                
                if (employeeData.status) {
                    await this.page.click('.oxd-select-text');
                    await this.page.click(`//span[text()="${employeeData.status}"]`);
                }
            }

            // Save the employee record
            await this.page.waitForSelector(this.saveButton, { state: 'visible', timeout: 5000 });
            await this.page.click(this.saveButton);

            // Wait for success message
            await this.page.waitForSelector(this.successMessage, { 
                state: 'visible',
                timeout: 10000 
            });
            
            const successText = await this.page.textContent(this.successMessage);
            return successText.includes('Successfully Saved');
        } catch (error) {
            console.error('Error adding employee:', error);
            throw error;
        }
    }

    async searchEmployee({ employeeName = '', employeeId = '' }) {
        try {
            if (employeeName) {
                await this.page.fill(this.employeeNameSearchInput, employeeName);
                await this.page.waitForTimeout(1000); // Wait for suggestions
            }
            if (employeeId) {
                await this.page.fill(this.employeeIdSearchInput, employeeId);
            }
            await this.page.click(this.searchButton);
            await this.page.waitForSelector(this.tableBody, { state: 'visible', timeout: 5000 });
        } catch (error) {
            console.error('Error searching employee:', error);
            throw error;
        }
    }

    async searchAndSelectEmployee(employeeName) {
        try {
            await this.searchEmployee({ employeeName });
            await this.page.click(`//div[contains(@class, "oxd-table-cell") and contains(., "${employeeName}")]`);
        } catch (error) {
            console.error('Error selecting employee:', error);
            throw error;
        }
    }

    async editEmployeePersonalDetails(updateData) {
        try {
            await this.page.click('//a[contains(., "Personal Details")]');
            
            if (updateData.nationality) {
                await this.page.click('(//div[contains(@class, "oxd-select-text")])[1]');
                await this.page.click(`//span[text()="${updateData.nationality}"]`);
            }
            
            if (updateData.maritalStatus) {
                await this.page.click('(//div[contains(@class, "oxd-select-text")])[2]');
                await this.page.click(`//span[text()="${updateData.maritalStatus}"]`);
            }
            
            if (updateData.dateOfBirth) {
                const dobInput = await this.page.locator('//input[contains(@placeholder, "yyyy-mm-dd")]');
                await dobInput.fill(updateData.dateOfBirth);
            }
            
            await this.page.click(this.saveButton);
            await this.page.waitForSelector(this.successMessage, { state: 'visible', timeout: 5000 });
        } catch (error) {
            console.error('Error updating employee details:', error);
            throw error;
        }
    }

    async deleteEmployee() {
        try {
            await this.page.click('//button[normalize-space()="Delete"]');
            await this.page.click('//button[normalize-space()="Yes, Delete"]');
            await this.page.waitForSelector(this.successMessage, { state: 'visible', timeout: 5000 });
        } catch (error) {
            console.error('Error deleting employee:', error);
            throw error;
        }
    }

    async navigateToReports() {
        try {
            await this.page.click(this.reportsTab);
            await this.page.waitForLoadState('networkidle');
        } catch (error) {
            console.error('Error navigating to reports:', error);
            throw error;
        }
    }

    async generateReport(reportConfig) {
        try {
            await this.page.click(this.addEmployeeButton);
            await this.page.fill(this.reportNameInput, reportConfig.reportName);
            
            for (const criterion of reportConfig.criteria) {
                await this.page.click(`//span[text()="${criterion}"]`);
            }
            
            await this.page.click(this.saveButton);
            await this.page.waitForSelector(this.successMessage, { state: 'visible', timeout: 5000 });
        } catch (error) {
            console.error('Error generating report:', error);
            throw error;
        }
    }

    async searchWithFilters(searchCriteria) {
        try {
            if (searchCriteria.employmentStatus) {
                await this.page.click('(//div[contains(@class, "oxd-select-text")])[1]');
                await this.page.click(`//span[text()="${searchCriteria.employmentStatus}"]`);
            }
            
            if (searchCriteria.includeType) {
                await this.page.click('(//div[contains(@class, "oxd-select-text")])[2]');
                await this.page.click(`//span[text()="${searchCriteria.includeType}"]`);
            }
            
            if (searchCriteria.supervisorName) {
                const supervisorInput = await this.page.locator(this.employeeNameSearchInput).nth(1);
                await supervisorInput.fill(searchCriteria.supervisorName);
                await this.page.waitForTimeout(1000); // Wait for suggestions
            }
            
            await this.page.click(this.searchButton);
            await this.page.waitForSelector(this.tableBody, { state: 'visible', timeout: 5000 });
        } catch (error) {
            console.error('Error applying search filters:', error);
            throw error;
        }
    }

    async fillEmployeeId(id) {
        try {
            await this.page.click(this.employeeIdInput);
            await this.page.keyboard.press('Control+A');
            await this.page.keyboard.press('Backspace');
            await this.page.fill(this.employeeIdInput, id);
        } catch (error) {
            console.error('Error filling employee ID:', error);
            throw error;
        }
    }
}

module.exports = PIMPage;
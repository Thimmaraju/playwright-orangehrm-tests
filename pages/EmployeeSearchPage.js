class EmployeeSearchPage {
    constructor(page) {
        this.page = page;
        
        // Menu Navigation
        this.pimMenuLink = '//span[text()="PIM"]';
        this.employeeListTab = '//a[contains(text(), "Employee List")]';
        
        // Search Form Elements
        this.employeeNameInput = '//label[contains(text(), "Employee Name")]/../following-sibling::div//input';
        this.employeeIdInput = '//label[contains(text(), "Employee Id")]/../following-sibling::div//input';
        this.employmentStatusDropdown = '//label[contains(text(), "Employment Status")]/../following-sibling::div//div[contains(@class, "select-text")]';
        this.supervisorNameInput = '//label[contains(text(), "Supervisor Name")]/../following-sibling::div//input';
        this.jobTitleDropdown = '//label[contains(text(), "Job Title")]/../following-sibling::div//div[contains(@class, "select-text")]';
        
        // Buttons
        this.searchButton = '//button[@type="submit"]';
        this.resetButton = '//button[@type="reset"]';
        
        // Results Table
        this.resultsTable = '//div[contains(@class, "oxd-table")]';
        this.noRecordsMessage = '//span[contains(text(), "No Records Found")]';
        this.resultRows = '//div[contains(@class, "oxd-table-card")]';
        
        // Column Headers
        this.idHeader = '//div[contains(text(), "Id")]';
        this.nameHeader = '//div[contains(text(), "First") or contains(text(), "Last")]';
    }

    async navigateToEmployeeList() {
        await this.page.click(this.pimMenuLink);
        await this.page.waitForLoadState('networkidle');
        await this.page.click(this.employeeListTab);
        await this.page.waitForLoadState('networkidle');
    }

    async searchByName(employeeName) {
        await this.page.fill(this.employeeNameInput, employeeName);
        await this.page.waitForTimeout(1000); // Wait for auto-suggestions
        await this.page.click(this.searchButton);
        await this.page.waitForLoadState('networkidle');
    }

    async searchById(employeeId) {
        await this.page.fill(this.employeeIdInput, employeeId);
        await this.page.click(this.searchButton);
        await this.page.waitForLoadState('networkidle');
    }

    async searchByEmploymentStatus(status) {
        await this.page.click(this.employmentStatusDropdown);
        await this.page.click(`//span[contains(text(), "${status}")]`);
        await this.page.click(this.searchButton);
        await this.page.waitForLoadState('networkidle');
    }

    async searchBySupervisor(supervisorName) {
        await this.page.fill(this.supervisorNameInput, supervisorName);
        await this.page.waitForTimeout(1000); // Wait for auto-suggestions
        await this.page.click(this.searchButton);
        await this.page.waitForLoadState('networkidle');
    }

    async searchByJobTitle(jobTitle) {
        await this.page.click(this.jobTitleDropdown);
        await this.page.click(`//span[contains(text(), "${jobTitle}")]`);
        await this.page.click(this.searchButton);
        await this.page.waitForLoadState('networkidle');
    }

    async resetSearch() {
        await this.page.click(this.resetButton);
        await this.page.waitForLoadState('networkidle');
    }

    async getSearchResults() {
        try {
            await this.page.waitForSelector(this.resultRows, { timeout: 5000 });
            return await this.page.$$eval(this.resultRows, rows => rows.length);
        } catch {
            return 0;
        }
    }

    async isNoRecordsMessageDisplayed() {
        return await this.page.isVisible(this.noRecordsMessage);
    }

    async sortByColumn(columnType) {
        const header = columnType === 'id' ? this.idHeader : this.nameHeader;
        await this.page.click(header);
        await this.page.waitForLoadState('networkidle');
    }

    async getResultsText() {
        return await this.page.$$eval(this.resultRows, rows => 
            rows.map(row => row.textContent)
        );
    }
}

module.exports = EmployeeSearchPage;
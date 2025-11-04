class PIMPage {
    constructor(page) {
        this.page = page;
        this.pimMenuLink = '//a[contains(@href, "pim")]';
        this.addEmployeeButton = '//button[normalize-space()="Add"]';
        this.firstNameInput = '//input[@name="firstName"]';
        this.middleNameInput = '//input[@name="middleName"]';
        this.lastNameInput = '//input[@name="lastName"]';
        this.employeeIdInput = '//div[contains(@class, "oxd-grid-item")]//input[contains(@class, "oxd-input")]';
        this.saveButton = '//button[@type="submit"]';
        this.successMessage = '//div[contains(@class, "oxd-toast")]';
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
        // Wait for the form fields to be visible
        await this.page.waitForSelector(this.firstNameInput, { state: 'visible' });
        await this.page.waitForSelector(this.lastNameInput, { state: 'visible' });

        // Clear and fill in employee details
        await this.page.fill(this.firstNameInput, employeeData.firstName);
        if (employeeData.middleName) {
            await this.page.fill(this.middleNameInput, employeeData.middleName);
        }
        await this.page.fill(this.lastNameInput, employeeData.lastName);

        if (employeeData.employeeId) {
            await this.page.waitForSelector(this.employeeIdInput, { state: 'visible' });
            // Clear the existing employee ID first
            await this.page.click(this.employeeIdInput);
            await this.page.keyboard.press('Control+A');
            await this.page.keyboard.press('Backspace');
            await this.page.fill(this.employeeIdInput, employeeData.employeeId);
        }

        // Save the employee record
        await this.page.waitForSelector(this.saveButton, { state: 'visible' });
        await this.page.click(this.saveButton);

        // Wait for success message with longer timeout
        await this.page.waitForSelector(this.successMessage, { 
            state: 'visible',
            timeout: 10000 
        });
        
        // Verify success message
        const successText = await this.page.textContent(this.successMessage);
        return successText.includes('Successfully Saved');
    }
}

module.exports = PIMPage;
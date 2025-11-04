class LoginPage {
    constructor(page) {
        this.page = page;
        this.usernameInput = '//input[@name="username"]';
        this.passwordInput = '//input[@name="password"]';
        this.loginButton = '//button[@type="submit"]';
    }

    async navigate() {
        await this.page.goto('https://opensource-demo.orangehrmlive.com/web/index.php/auth/login');
        await this.page.waitForLoadState('networkidle');
    }

    async login(username, password) {
        // Wait for form to be interactive
        await this.page.waitForSelector(this.usernameInput, { state: 'visible' });
        await this.page.waitForSelector(this.passwordInput, { state: 'visible' });
        
        // Fill in credentials
        await this.page.fill(this.usernameInput, username);
        await this.page.fill(this.passwordInput, password);
        
        // Click login and wait for navigation
        await this.page.waitForSelector(this.loginButton, { state: 'visible' });
        await this.page.click(this.loginButton);
        
        // Wait for dashboard to load completely
        await this.page.waitForURL(/.*\/dashboard/);
        await this.page.waitForLoadState('networkidle');
    }
}

module.exports = LoginPage;
# Playwright OrangeHRM Test Framework

This repository contains automated tests for the OrangeHRM demo site using Playwright.

## Prerequisites

- Node.js (Latest LTS version recommended)
- npm (Comes with Node.js)
- A modern web browser (Chrome/Chromium, Firefox, or Safari)

## Installation

1. Clone the repository:
```bash
git clone https://github.com/Thimmaraju/playwright-orangehrm-tests.git
```

2. Navigate to the project directory:
```bash
cd playwright-orangehrm-tests
```

3. Install dependencies:
```bash
npm install
```

4. Install Playwright browsers:
```bash
npx playwright install
```

## Test Structure

- `tests/login.spec.js`: Contains login test scenarios
  - Successful login with valid credentials
  - Failed login with invalid credentials

## Running Tests

### Run all tests
```bash
npx playwright test
```

### Run tests in a specific browser (Chromium only)
```bash
npx playwright test --project=chromium
```

### Run tests in UI mode
```bash
npx playwright test --ui
```

### Run tests in debug mode
```bash
npx playwright test --debug
```

### Run a specific test file
```bash
npx playwright test login.spec.js
```

## Test Reports

After running the tests, you can find the HTML report in the `playwright-report` directory. Open `playwright-report/index.html` in your browser to view the detailed test results.

## Demo Site Information

The tests are configured to run against the OrangeHRM demo site:
- URL: https://opensource-demo.orangehrmlive.com
- Default credentials:
  - Username: Admin
  - Password: admin123

## Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request
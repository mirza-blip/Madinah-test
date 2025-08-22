# Madinah Playwright Test Suite

A comprehensive end-to-end testing suite for the Madinah donation platform using Playwright. This repository contains automated tests for various donation flows, campaign management, and authentication scenarios across different environments.

## 🚀 Features

- **Multi-Environment Support**: Tests can run against staging and production environments
- **Authentication Testing**: Automated login/logout flows with session management
- **Donation Testing**: Complete donation flows including 3DS2 authentication, recurring donations, and payment processing
- **Campaign Management**: End-to-end campaign creation and management testing
- **Cross-Browser Testing**: Support for Chromium, Firefox, and WebKit
- **Parallel Execution**: Optimized test execution with proper dependency management
- **Rich Reporting**: HTML reports with screenshots, videos, and traces on failure

## 📁 Project Structure

```
├── assets/                    # Test assets and images
├── fixtures/                  # Playwright fixtures and page factories
├── helpers/                   # Utility functions and helpers
├── pages/                     # Page Object Model implementation
│   ├── AuthPage.ts           # Authentication page interactions
│   ├── BasePage.ts           # Base page class with common functionality
│   ├── CampaignCreationPage.ts # Campaign creation workflows
│   ├── DashboardPage.ts      # Dashboard interactions
│   ├── DonationPage.ts       # Donation flow handling
│   ├── HomePage.ts           # Home page interactions
│   └── MyDonationPage.ts     # User donation history
├── test-data/                # Test data factories and generators
├── tests/                    # Test specifications
│   ├── auth.setup.ts         # Authentication setup for logged-in tests
│   ├── production/           # Production environment tests
│   └── staging/              # Staging environment tests
│       ├── shared/           # Tests that run in both logged-in and logged-out states
│       └── logged-in/        # Tests requiring authentication
└── types/                    # TypeScript type definitions
```

## 🛠️ Prerequisites

- Node.js (v16 or higher)
- npm or yarn
- Docker (optional, for containerized execution)

## 📦 Installation

1. Clone the repository:
```bash
git clone <repository-url>
cd madinah-playwright-test
```

2. Install dependencies:
```bash
npm install
```

3. Install Playwright browsers:
```bash
npx playwright install
```

4. Set up environment variables:
Create `.env.staging` and `.env.production` files with the required configuration:
```bash
BASE_URL=https://your-staging-url.com
TEST_EMAIL=<Login email>
TEST_PASSWORD=<Login password>
```

## 🎯 Running Tests

### Basic Commands

```bash
# Run all tests
npm test

# Run tests in debug mode
npm run test:debug

# Run tests with UI mode
npm run test:ui

# Show test report
npm run test:report
```

### Environment-Specific Testing

```bash
# Run staging tests
NODE_ENV=staging npm test

# Run production tests
NODE_ENV=production npm test
```

### Targeted Test Execution

```bash
# Run specific test file
npx playwright test tests/staging/shared/donation/3DS2.spec.ts

# Run tests by pattern
npx playwright test --grep "donation"

# Run tests for specific project
npx playwright test --project="logged-in-parallel"
```

## 🐳 Docker Usage

Run tests in a containerized environment:

```bash
# Build and run with Docker Compose
docker-compose up

# Run specific commands in container
docker-compose run playwright npx playwright test
```

## 🧪 Test Categories

### 1. Authentication Tests
- User login/logout flows
- Session management
- Authentication state persistence

### 2. Donation Tests
- **One-time donations**: Standard payment flows
- **Recurring donations**: Subscription-based payments
- **3DS2 Authentication**: Strong Customer Authentication flows
- **Payment failures**: Error handling and validation
- **Upsell/Downsell**: Donation amount modifications

### 3. Campaign Tests
- Campaign creation workflows
- Campaign management operations

## 🔧 Test Configuration

The test suite uses different execution strategies:

### Project Configuration

- **setup**: Handles authentication setup
- **logged-in-parallel**: Tests requiring authentication (parallel execution)
- **logged-in-sequential-recurring**: Recurring payment tests (sequential execution)
- **logged-out**: Tests that don't require authentication

### Test Data Management

Test data is generated using the `TestDataFactory` class which provides:
- Valid personal information
- Various credit card scenarios (3DS2, frictionless, insufficient funds)
- Campaign data
- User profiles

## 📊 Reporting and Debugging

### HTML Reports
- Automatic generation of detailed HTML reports
- Screenshots and videos on test failures
- Execution traces for debugging

### Debugging Features
- `--debug` flag for step-by-step debugging
- `--ui` mode for interactive test development
- Browser DevTools integration

## 🔄 CI/CD Integration

The test suite is optimized for CI/CD environments:
- Automatic retry on failure (2 retries in CI)
- Parallel execution limitations in CI
- Artifact collection (reports, screenshots, videos)

## 📝 Code Quality

The project uses Biome for code formatting and linting:

```bash
# Format code
npm run format

# Lint code
npm run lint

# Check and fix issues
npm run check
```

## 🌐 Page Object Model

The test suite implements the Page Object Model pattern:

```typescript
// Example usage in tests
test('should complete donation', async ({ donationPage }) => {
  await donationPage.goto();
  await donationPage.startDonation();
  await donationPage.selectDonationLevel(0);
  // ... rest of the test
});
```

## 🔒 Environment Variables

Key environment variables:
- `BASE_URL`: Application base URL
- `TEST_EMAIL`: Login email
- `TEST_PASSWORD`: Login password
- `NODE_ENV`: Environment (staging/production)


For more information about Playwright testing, visit the [official documentation](https://playwright.dev/).

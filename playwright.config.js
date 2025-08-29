// @ts-check
import { defineConfig } from "@playwright/test";
import * as dotenv from "dotenv";
import path from "node:path";

const env = process.env.NODE_ENV || "staging";

dotenv.config({ path: path.resolve(__dirname, `.env.${env}`) });

console.log(`Using: env.${env}`);

/**
 * Read environment variables from file.
 * https://github.com/motdotla/dotenv
 */
// import dotenv from 'dotenv';
// import path from 'path';
// dotenv.config({ path: path.resolve(__dirname, '.env') });

/**
 * @see https://playwright.dev/docs/test-configuration
 */
export default defineConfig({
  testDir: "./tests",
  /* Run tests in files in parallel */
  fullyParallel: true,
  /* Fail the build on CI if you accidentally left test.only in the source code. */
  forbidOnly: !!process.env.CI,
  /* Retry on CI only */
  retries: process.env.CI ? 2 : 0,
  /* Opt out of parallel tests on CI. */
  workers: process.env.CI ? 4 : undefined,
  /* Reporter to use. See https://playwright.dev/docs/test-reporters */
  reporter: "html",

  timeout: 60000,
  // expect: {
  //   timeout: 10000,
  // },

  /* Shared settings for all the projects below. See https://playwright.dev/docs/api/class-testoptions. */
  use: {
    /* Base URL to use in actions like `await page.goto('/')`. */
    // baseURL: 'http://localhost:3000',
    baseURL: process.env.BASE_URL || "https://md-user-frontend-stage-bd956a43af2d.herokuapp.com",

    /* Collect trace when retrying the failed test. See https://playwright.dev/docs/trace-viewer */
    trace: "retain-on-failure",
    video: "retain-on-failure",
    screenshot: "only-on-failure",
    // actionTimeout: 10000,
    // navigationTimeout: 30000,
  },

  /* Configure projects for major browsers */
  projects: [
    {
      name: "setup",
      testMatch: /.*\.setup\.ts/,
    },
    {
      name: "logged-in-parallel",
      testMatch: [/.*\/shared\/.*\.spec\.ts/, /.*\/logged-in\/.*\.spec\.ts/],
      testIgnore: /.*\.recurring\.spec\.ts/,
      use: {
        storageState: ".auth/login.json",
      },
      dependencies: ["setup"],
    },
    {
      name: "logged-in-sequential-recurring",
      testMatch: /.*\.recurring\.spec\.ts/,
      workers: 1,
      use: {
        storageState: ".auth/login.json",
      },
      dependencies: ["setup"],
    },
    {
      name: "logged-out",
      testMatch: [/.*\/shared\/.*\.spec\.ts/, /.*\/logged-out\/.*\.spec\.ts/],
      use: {
        storageState: undefined,
      },
    },
  ],

  /* Run your local dev server before starting the tests */
  // webServer: {
  //   command: 'npm run start',
  //   url: 'http://localhost:3000',
  //   reuseExistingServer: !process.env.CI,
  // },
});

import { test as base, type Page } from "@playwright/test";
import { TestDataFactory } from "../test-data/TestDataFactory";

type CampaignFixtures = {
  fundraisingUntilGoal: (page: Page) => Promise<void>;
  login: (page: Page) => Promise<void>;
};

export const test = base.extend<CampaignFixtures>({
  fundraisingUntilGoal: async ({ page }, use) => {
    await use(async () => {
      const campaignData = TestDataFactory.getCampaignData();

      await page.getByRole("button", { name: "Start fundraising" }).click();

      await test.step("Select country, postal code and category", async () => {
        await page.getByRole("button", { name: "Open" }).click();
        await page.getByRole("option", { name: campaignData.country }).click();
        await page.getByRole("textbox", { name: "Postal Code*" }).fill(campaignData.postalCode);
        await page
          .locator("div")
          .filter({
            hasText: new RegExp(`^${campaignData.category}$`),
          })
          .nth(1)
          .click();
        await page.getByRole("button", { name: "Continue" }).click();
      });

      await test.step("Choose recipient", async () => {
        await page
          .locator("div")
          .filter({
            hasText: new RegExp(`^${campaignData.recipientType}$`),
          })
          .nth(1)
          .click();
        await page.getByRole("button", { name: "Continue" }).click();
      });

      await test.step("Select charity", async () => {
        await page
          .locator("div")
          .filter({
            hasText: new RegExp(`^${campaignData.charityIndex}$`),
          })
          .nth(1)
          .click();
        await page.getByRole("button", { name: "Continue" }).click();
      });

      await test.step("Enter campaign goal", async () => {
        await page
          .getByRole("textbox", {
            name: "Enter campaign starting goal",
          })
          .fill(campaignData.goal);
        await page.getByRole("button", { name: "Continue" }).click();
      });
    });
  },

  login: async ({ page }, use) => {
    await use(async () => {
      const credentials = TestDataFactory.getLoginCredentials();

      await test.step("Log in to create campaign", async () => {
        await page.getByRole("textbox", { name: "Email*" }).fill(credentials.email);
        await page.getByRole("textbox", { name: "Password*" }).fill(credentials.password);
        await page.getByRole("button", { name: "Confirm" }).click();
      });
    });
  },
});

export { expect } from "@playwright/test";

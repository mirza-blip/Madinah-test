import { expect, test } from "@/fixtures/pages";
import { TestDataFactory } from "@/test-data/TestDataFactory";

test.describe("Campaign Creation Tests", () => {
  test.beforeEach(async ({ campaignCreationPage }) => {
    await campaignCreationPage.goto();
  });

  test("should show sign in modal on campaign creation", async ({
    campaignCreationPage,
    authPage,
  }) => {
    const campaignData = TestDataFactory.getCampaignData();

    await campaignCreationPage.goToStep4(campaignData);

    await test.step("Verify sign in modal", async () => {
      await expect(authPage.signInModal).toBeVisible();
    });
  });
});

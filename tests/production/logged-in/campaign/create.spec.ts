import { expect, test } from "@/fixtures/pages";
import { TestDataFactory } from "@/test-data/TestDataFactory";

test.describe("Campaign Creation Tests", () => {
  test.beforeEach(async ({ campaignCreationPage }) => {
    await campaignCreationPage.goto();
  });

  test("should complete campaign creation", async ({ page, campaignCreationPage }) => {
    const campaignData = TestDataFactory.getCampaignData();

    await campaignCreationPage.goToStep4(campaignData);

    await campaignCreationPage.continueFromStep4(campaignData);
    await campaignCreationPage.submitCampaign();

    await expect(page.getByText("Campaign Created Successfully")).toBeVisible();
    await expect(page).toHaveURL("/campaign-success");
  });
});

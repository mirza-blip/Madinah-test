import { expect, test } from "@/fixtures/pages";

test.skip();

test.describe("Campaign Deletion Tests", () => {
  test.beforeEach(async ({ homePage }) => {
    await homePage.goto("/dashboard");
  });

  test("should delete all campaigns", async ({ dashboardPage }) => {
    await dashboardPage.deleteAllCampaigns();
    const hasCampaigns = await dashboardPage.hasCampaigns();
    expect(hasCampaigns).toBe(false);
  });
});

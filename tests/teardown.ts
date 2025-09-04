import { expect, test as teardown } from "@/fixtures/pages";

teardown("delete created campaigns", async ({ homePage, dashboardPage }) => {
  await homePage.goto("/dashboard");

  await dashboardPage.deleteAllCampaigns();
  const hasCampaigns = await dashboardPage.hasCampaigns();
  expect(hasCampaigns).toBe(false);
});

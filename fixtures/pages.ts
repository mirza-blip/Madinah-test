import { DashboardPage } from "@/pages/DashboardPage";
import { MyDonationPage } from "@/pages/MyDonationPage";
import { test as base } from "@playwright/test";
import { AuthPage } from "../pages/AuthPage";
import { CampaignCreationPage } from "../pages/CampaignCreationPage";
import { DonationPage } from "../pages/DonationPage";
import { HomePage } from "../pages/HomePage";

type PageFixtures = {
  homePage: HomePage;
  donationPage: DonationPage;
  campaignCreationPage: CampaignCreationPage;
  authPage: AuthPage;
  dashboardPage: DashboardPage;
  myDonationPage: MyDonationPage;
};

export const test = base.extend<PageFixtures>({
  homePage: async ({ page }, use) => {
    const homePage = new HomePage(page);
    await use(homePage);
  },

  donationPage: async ({ page }, use) => {
    const donationPage = new DonationPage(page);
    await use(donationPage);
  },

  campaignCreationPage: async ({ page }, use) => {
    const campaignCreationPage = new CampaignCreationPage(page);
    await use(campaignCreationPage);
  },

  authPage: async ({ page }, use) => {
    const authPage = new AuthPage(page);
    await use(authPage);
  },

  dashboardPage: async ({ page }, use) => {
    const dashboardPage = new DashboardPage(page);
    await use(dashboardPage);
  },
  myDonationPage: async ({ page }, use) => {
    const myDonationPage = new MyDonationPage(page);
    await use(myDonationPage);
  },
});

export { expect } from "@playwright/test";

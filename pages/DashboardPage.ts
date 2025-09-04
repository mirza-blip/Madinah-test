import { expect, type Locator, type Page } from "@playwright/test";
import { BasePage } from "./BasePage";

export class DashboardPage extends BasePage {
  readonly campaignOptionsButtons: Locator;
  readonly deleteCampaignButton: Locator;
  readonly editCampaignButton: Locator;
  readonly duplicateCampaignButton: Locator;
  readonly campaignCards: Locator;
  readonly confirmDeleteButton: Locator;
  readonly paginationNextButton: Locator;
  readonly paginationPreviousButton: Locator;
  readonly paginationNumberButtons: Locator;

  constructor(page: Page) {
    super(page);
    this.campaignOptionsButtons = this.page
      .getByRole("main")
      .getByRole("button", { name: "Options" });
    this.deleteCampaignButton = this.page.getByRole("menuitem", { name: "Delete" });
    this.editCampaignButton = this.page.getByRole("menuitem", { name: "Edit" });
    this.duplicateCampaignButton = this.page.getByRole("menuitem", { name: "Duplicate" });
    this.campaignCards = this.page.getByText("We're in this together,");
    this.confirmDeleteButton = this.page.getByRole("button", { name: "Delete" });
    this.paginationNextButton = this.page.getByRole("button", { name: "Go to next page" });
    this.paginationPreviousButton = this.page.getByRole("button", { name: "Go to previous page" });
    this.paginationNumberButtons = this.page.getByRole("button", { name: "Go to page" });
  }

  async deleteCampaignAtIndex(index: number): Promise<void> {
    const campaignCount = await this.campaignCards.count();
    if (campaignCount === 0 || index >= campaignCount) {
      return;
    }

    await this.campaignOptionsButtons.nth(index).click();

    await this.deleteCampaignButton.click();

    await this.confirmDeleteButton.click();
  }

  async deleteAllCampaigns(): Promise<void> {
    let campaignCount: number;

    await expect(async () => {
      await expect(this.campaignCards.first()).toBeVisible();
      campaignCount = await this.campaignCards.count();
    }).toPass();

    while (campaignCount > 0) {
      await this.deleteCampaignAtIndex(0);

      await this.page.waitForTimeout(1000);

      campaignCount = await this.campaignCards.count();
    }
  }

  async hasCampaigns(): Promise<boolean> {
    const count = await this.campaignCards.count();
    return count > 0;
  }
}

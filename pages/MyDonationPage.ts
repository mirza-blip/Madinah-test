import { expect, type Locator, type Page } from "@playwright/test";
import { BasePage } from "./BasePage";

export class MyDonationPage extends BasePage {
  readonly donationHistoryButton: Locator;
  readonly recurringDonationsButton: Locator;
  readonly goToDonationDetailsButton: Locator;

  constructor(page: Page) {
    super(page);
    this.donationHistoryButton = this.page.getByRole("tab", { name: "Donation history" });
    this.recurringDonationsButton = this.page.getByRole("tab", { name: "Recurring donations" });
    this.goToDonationDetailsButton = this.page
      .getByRole("cell", { name: /Visa\s+\*{4}\d{4}\s+button/ })
      .getByLabel("button");
  }

  async goToDonationDetails(index: number) {
    await this.goToDonationDetailsButton.nth(index).click();
  }

  async cancelAllRecurringDonations() {
    await this.goto("your-donations");
    await this.recurringDonationsButton.click();
    const cancelButton = this.page.getByRole("button", { name: "Cancel subscription" });
    const noDonationsText = this.page.getByText("You have not made any");

    let count: number;
    await expect(async () => {
      const hasNoDonations = await noDonationsText.isVisible();
      if (hasNoDonations) {
        return;
      }
      count = await this.goToDonationDetailsButton.count();
      await expect(this.goToDonationDetailsButton.first()).toBeVisible();
    }).toPass();

    while (count > 0) {
      await this.goToDonationDetailsButton.first().click();
      await cancelButton.nth(0).click();
      await this.page.getByRole("button", { name: "Delete" }).click();
      count--;
      await this.goto("your-donations");
    }
  }
}

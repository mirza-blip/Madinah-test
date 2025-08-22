import type { Locator, Page } from "@playwright/test";
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
      .getByRole("cell", { name: "Visa    ****1111 button" })
      .getByLabel("button");
  }

  async goToDonationDetails(index: number) {
    await this.goToDonationDetailsButton.nth(index).click();
  }

  async cancelAllRecurringDonations() {
    await this.goto("your-donations");
    await this.recurringDonationsButton.click();
    const cancelButton = this.page.getByRole("button", { name: "Cancel subscription" });
    const count = await this.goToDonationDetailsButton.count();
    for (let i = 0; i < count; i++) {
      await this.goToDonationDetails(i);
      await cancelButton.nth(i).click();
      await this.page.getByRole("button", { name: "Delete" }).click();
    }
  }
}

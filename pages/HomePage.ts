import type { Locator, Page } from "@playwright/test";
import { BasePage } from "./BasePage";

export class HomePage extends BasePage {
  readonly signInButton: Locator;
  readonly startFundraisingButton: Locator;
  readonly fundraiserImages: Locator;

  constructor(page: Page) {
    super(page);
    this.signInButton = this.page.getByRole("button", { name: "Sign In" });
    this.startFundraisingButton = this.page.getByRole("button", {
      name: "Start fundraising",
    });
    this.fundraiserImages = this.page.getByRole("img", {
      name: "fundraiser-option",
    });
  }

  async clickSignIn() {
    await this.signInButton.click();
  }

  async startFundraising() {
    await this.startFundraisingButton.click();
  }

  async selectFirstFundraiser() {
    await this.fundraiserImages.first().click();
  }
}

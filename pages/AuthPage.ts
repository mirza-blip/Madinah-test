import type { Locator, Page } from "@playwright/test";
import { BasePage } from "./BasePage";

export class AuthPage extends BasePage {
  readonly emailInput: Locator;
  readonly passwordInput: Locator;
  readonly confirmButton: Locator;
  readonly signInModal: Locator;

  constructor(page: Page) {
    super(page);
    this.emailInput = this.page.getByRole("textbox", { name: "Email*" });
    this.passwordInput = this.page.getByRole("textbox", { name: "Password*" });
    this.confirmButton = this.page.getByRole("button", { name: "Confirm" });
    this.signInModal = this.page.locator(".MuiBox-root.css-1xvcgju");
  }

  async login(email: string, password: string) {
    await this.emailInput.fill(email);
    await this.passwordInput.fill(password);
    await this.confirmButton.click();
  }
}

import { extractNumericAmount } from "@/helpers/utils";
import { expect, type Locator, type Page } from "@playwright/test";
import { BasePage } from "./BasePage";

export class DonationPage extends BasePage {
  readonly donateNowButton: Locator;
  readonly donationLevels: Locator;
  donationAmount: Locator;
  readonly giveOnceTabButton: Locator;
  readonly recurringTabButton: Locator;
  readonly donateButton: Locator;
  readonly chooseFrequencyButton: Locator;
  readonly customDonationInput: Locator;
  readonly keepOneTimeButton: Locator;
  readonly keepRecurringButton1: Locator;
  readonly keepRecurringButton2: Locator;
  readonly firstNameInput: Locator;
  readonly lastNameInput: Locator;
  readonly emailInput: Locator;
  readonly continueButton: Locator;
  readonly creditCardButton: Locator;
  readonly cardNumberInput: Locator;
  readonly expiryDateInput: Locator;
  readonly cvvInput: Locator;
  readonly successMessage: Locator;
  readonly errorMessage: Locator;
  readonly totalAmountDisplay: Locator;
  readonly monthlyRecurringButton: Locator;
  readonly everyFridayRecurringButton: Locator;
  readonly giveOnceRecurringButton: Locator;
  readonly upsellPopup: Locator;
  readonly downsellPopup: Locator;
  readonly confirmUpsellDownsellButton: Locator;
  readonly declineUpsellDownsellButton: Locator;
  readonly closeUpsellDownsellPopupButton: Locator;
  readonly thankYouPageDonationAmount: Locator;
  readonly tipSlider: Locator;
  readonly customTipButton: Locator;
  readonly customTipInput: Locator;
  readonly successful3DS2ChallengeButton: Locator;
  readonly failed3DS2ChallengeButton: Locator;
  readonly failed3DS2ErrorMessage: Locator;
  readonly insufficientFundsErrorMessage: Locator;
  readonly expiredCardErrorMessage: Locator;

  constructor(page: Page) {
    super(page);
    this.donateNowButton = this.page.getByRole("button", { name: "Donate Now" });
    this.donationLevels = this.page.locator(".MuiGrid-root.MuiGrid-container.css-17hm5lv > div");
    this.giveOnceTabButton = this.page.getByRole("button", { name: "Give once" });
    this.recurringTabButton = this.page.getByRole("button", { name: "Recurring" });
    this.chooseFrequencyButton = this.page.getByRole("button", { name: "Choose frequency" });
    this.customDonationInput = this.page.getByPlaceholder("Other amount");
    this.donateButton = this.page.getByRole("button", { name: "Donate" });
    this.keepOneTimeButton = this.page.getByRole("button", { name: "Keep my one-time" });
    this.keepRecurringButton1 = this.page
      .getByRole("button", { name: /Donate \$\d+(\.\d{2})?\/month/ })
      .nth(0);
    this.keepRecurringButton2 = this.page
      .getByRole("button", { name: /Donate \$\d+(\.\d{2})?\/month/ })
      .nth(1);
    this.firstNameInput = this.page.getByRole("textbox", { name: "First name*" });
    this.lastNameInput = this.page.getByRole("textbox", { name: "Last name*" });
    this.emailInput = this.page.getByRole("textbox", { name: "Email address*" });
    this.continueButton = this.page.getByRole("button", { name: "Continue" });
    this.creditCardButton = this.page.getByRole("button", {
      name: "credit card Credit/Debit card",
    });
    this.cardNumberInput = this.page.getByRole("textbox", { name: "Card number*" });
    this.expiryDateInput = this.page.getByRole("textbox", { name: "Expiry date (MM/YY)*" });
    this.cvvInput = this.page.getByRole("textbox", { name: "CVV*" });
    this.successMessage = this.page.getByText("Donation successful");
    this.errorMessage = this.page.getByText("Number is not a valid credit");
    this.totalAmountDisplay = this.page.locator(".MuiBox-root.css-1dfbdfy p").first();
    this.monthlyRecurringButton = this.page.getByRole("button", { name: "Monthly" });
    this.everyFridayRecurringButton = this.page.getByRole("button", { name: "Every Friday" });
    this.giveOnceRecurringButton = this.page.getByRole("button", { name: "Give once" });
    this.upsellPopup = this.page.locator("div").filter({ hasText: "UpsellHelp" }).nth(1);
    this.downsellPopup = this.page.locator("div").filter({ hasText: "DownsellHelp" }).nth(1);
    this.confirmUpsellDownsellButton = this.page.getByRole("button", {
      name: "Yes, would love to get more",
    });
    this.declineUpsellDownsellButton = this.page.getByRole("button", { name: "No, I'm good" });
    this.thankYouPageDonationAmount = this.page.getByText("TotalUSD $");
    this.closeUpsellDownsellPopupButton = this.page.getByRole("button", { name: "Close" });
    this.tipSlider = this.page.locator('.MuiSlider-root input[type="range"]');
    this.customTipButton = this.page.getByText("Custom amount");
    this.customTipInput = this.page.getByPlaceholder("Enter custom tip");
    this.successful3DS2ChallengeButton = this.page
      .locator("#my-container iframe")
      .contentFrame()
      .getByRole("button", { name: "Succeed Test Authentication" });
    this.failed3DS2ChallengeButton = this.page
      .locator("#my-container iframe")
      .contentFrame()
      .getByRole("button", { name: "Fail Test Authentication" });
    this.failed3DS2ErrorMessage = this.page.getByText("We were unable to");
    this.insufficientFundsErrorMessage = this.page.getByText("Your transaction was declined");
    this.expiredCardErrorMessage = this.page.getByText("Your expiration date is invalid");
  }

  async goto() {
    await this.page.goto("/atc");
  }

  async startDonation() {
    await expect(async () => {
      await this.donateNowButton.click();
      await expect(this.donationLevels.first()).toBeVisible();
    }).toPass();
  }

  async selectDonationLevel(index: number = 0) {
    this.donationAmount = this.donationLevels.nth(index);
    const text = await this.donationAmount.locator(".MuiBox-root.css-64aydp").first().innerText();
    await this.donationAmount.click();
    return extractNumericAmount(text);
  }

  async enterCustomDonationAmount(customAmount: number) {
    await this.customDonationInput.fill(customAmount.toString());
  }

  async fillPersonalInfo(firstName: string, lastName: string, email: string) {
    await this.firstNameInput.fill(firstName);
    await this.lastNameInput.fill(lastName);
    await this.emailInput.fill(email);
  }

  async fillCreditCardInfo(cardNumber: string, expiry: string, cvv: string) {
    await this.creditCardButton.click();
    await this.cardNumberInput.fill(cardNumber);
    await this.expiryDateInput.fill(expiry);
    await this.cvvInput.fill(cvv);
    await this.donateButton.click();
  }

  async getTotalAmount() {
    await this.page.waitForTimeout(8000);
    await this.totalAmountDisplay.hover();
    const text = await this.totalAmountDisplay.innerText();
    return extractNumericAmount(text);
  }

  async getThankYouPageDonationAmount() {
    const text = await this.thankYouPageDonationAmount.innerText();
    return extractNumericAmount(text);
  }

  async updateTipSlider(tipValue: number) {
    await this.tipSlider.fill(tipValue.toString());

    await this.tipSlider.evaluate((input: HTMLInputElement, value) => {
      input.value = String(value);
      input.dispatchEvent(new Event("input", { bubbles: true }));
      input.dispatchEvent(new Event("change", { bubbles: true }));
    }, tipValue);
  }

  async enterCustomTip(customTip: number) {
    await this.customTipButton.click();
    await this.customTipInput.fill(customTip.toString());
  }
}

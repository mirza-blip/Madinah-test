import type { CampaignCategory, CampaignData, RecipientType } from "@/types";
import type { Locator, Page } from "@playwright/test";
import { BasePage } from "./BasePage";

export class CampaignCreationPage extends BasePage {
  readonly countryDropdownButton: Locator;
  readonly postalCodeInput: Locator;
  readonly categoryOptions: Locator;
  readonly charityRecipientOptions: Locator;
  readonly charityOptions: Locator;
  readonly goalInput: Locator;
  readonly titleInput: Locator;
  readonly descriptionInput: Locator;
  readonly fileInput: Locator;
  readonly saveButton: Locator;
  readonly submitButton: Locator;
  readonly successMessage: Locator;
  readonly continueButton: Locator;

  constructor(page: Page) {
    super(page);
    this.countryDropdownButton = this.page.getByRole("button", {
      name: "Open",
    });
    this.postalCodeInput = this.page.getByRole("textbox", {
      name: "Postal Code*",
    });
    this.categoryOptions = this.page.locator("div.MuiBox-root.css-1tf4obj");
    this.charityRecipientOptions = this.page.locator("div.MuiBox-root.css-16q1bz6");
    this.continueButton = this.page.getByRole("button", { name: "Continue" });
    this.charityOptions = this.page.locator("div.MuiBox-root.css-1lwfiyn");
    this.goalInput = this.page.getByRole("textbox", {
      name: "Enter campaign starting goal",
    });
    this.titleInput = this.page.getByRole("textbox", {
      name: "Fundraiser title*",
    });
    this.descriptionInput = this.page.locator(".ql-editor");
    this.fileInput = this.page.locator('input[type="file"]');
    this.saveButton = this.page.getByRole("button", { name: "Save" });
    this.submitButton = this.page.getByRole("button", {
      name: "Submit campaign",
    });
    this.successMessage = this.page.getByText("Campaign Created Successfully");
  }

  async goto() {
    await this.page.goto("/create-campaign");
  }

  async selectCountry(countryName: string) {
    await this.countryDropdownButton.click();
    await this.page.getByRole("option", { name: countryName }).click();
  }

  async fillPostalCode(postalCode: string) {
    await this.postalCodeInput.fill(postalCode);
  }

  async selectCategory(categoryName: CampaignCategory) {
    await this.categoryOptions
      .locator("div", { hasText: new RegExp(`^${categoryName}$`) })
      .first()
      .click();
  }

  async selectRecipientType(recipientType: RecipientType) {
    await this.charityRecipientOptions
      .locator("div", { hasText: new RegExp(`^${recipientType}`) })
      .nth(1)
      .click();
  }

  async selectCharity(charityIndex: number) {
    await this.charityOptions.locator("div").nth(charityIndex).click();
  }

  async fillGoal(goal: string) {
    await this.goalInput.fill(goal);
  }

  async fillTitle(title: string) {
    await this.titleInput.fill(title);
  }

  async fillDescription(description: string) {
    await this.descriptionInput.fill(description);
  }

  async uploadImage(filePath: string) {
    await this.fileInput.setInputFiles(filePath);
    await this.saveButton.click();
  }

  async submitCampaign() {
    await this.submitButton.click();
  }

  async clickContinue() {
    await this.continueButton.click();
  }

  async goToStep4(data: CampaignData) {
    await this.selectCountry(data.country);
    await this.fillPostalCode(data.postalCode);
    await this.selectCategory(data.category);
    await this.clickContinue();
    await this.selectRecipientType(data.recipientType);
    await this.clickContinue();
    await this.selectCharity(data.charityIndex);
    await this.clickContinue();
    await this.fillGoal(data.goal);
    await this.clickContinue();
  }

  async continueFromStep4(campaignData: CampaignData) {
    await this.fillTitle(campaignData.title);
    await this.fillDescription(campaignData.description);
    await this.clickContinue();
    await this.uploadImage(campaignData.imagePath);
  }
}

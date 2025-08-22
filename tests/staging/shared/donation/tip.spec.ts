import { expect, test } from "@/fixtures/pages";
import { TestDataFactory } from "@/test-data/TestDataFactory";

test.describe("Tip Tests", () => {
  let isLoggedIn = false;

  test.beforeAll(() => {
    const storageState = test.info().project.use.storageState;
    isLoggedIn = typeof storageState === "string" && storageState.includes("login.json");
  });

  test.beforeEach(async ({ donationPage }) => {
    await donationPage.goto();
  });

  test("should add a 5% tip for a one-time donation", async ({ donationPage }) => {
    const personalInfo = TestDataFactory.getValidPersonalInfo();
    const creditCard = TestDataFactory.getValidCreditCard();
    let donationAmount: number;

    await test.step("Click on donate now button", async () => {
      await donationPage.startDonation();
    });

    await test.step("Select donation amount", async () => {
      donationAmount = await donationPage.selectDonationLevel(0);
      await donationPage.keepOneTimeButton.click();
    });

    if (!isLoggedIn) {
      await test.step("Fill personal information", async () => {
        await donationPage.fillPersonalInfo(
          personalInfo.firstName,
          personalInfo.lastName,
          personalInfo.email,
        );
      });
    }

    await donationPage.continueButton.click();

    await test.step("Update tip slider to 5%", async () => {
      await donationPage.updateTipSlider(5);
    });

    await test.step("Fill credit card information", async () => {
      await donationPage.fillCreditCardInfo(creditCard.number, creditCard.expiry, creditCard.cvv);
    });

    await donationPage.continueButton.click();

    await test.step("Close upsell popup", async () => {
      await donationPage.closeUpsellDownsellPopupButton.click();
    });

    await test.step("Verify tip is added", async () => {
      const expectedTip = donationAmount * 0.05;
      const thankYouAmount = await donationPage.getThankYouPageDonationAmount();
      expect(thankYouAmount).toBeCloseTo(donationAmount + expectedTip, 2);
    });
  });

  test("should add a custom tip for a one-time donation", async ({ donationPage }) => {
    const personalInfo = TestDataFactory.getValidPersonalInfo();
    const creditCard = TestDataFactory.getValidCreditCard();
    let donationAmount: number;
    const customTipAmount = 17;

    await test.step("Click on donate now button", async () => {
      await donationPage.startDonation();
    });

    await test.step("Select donation amount", async () => {
      donationAmount = await donationPage.selectDonationLevel(0);
      await donationPage.keepOneTimeButton.click();
    });

    if (!isLoggedIn) {
      await test.step("Fill personal information", async () => {
        await donationPage.fillPersonalInfo(
          personalInfo.firstName,
          personalInfo.lastName,
          personalInfo.email,
        );
      });
    }

    await donationPage.continueButton.click();

    await test.step("Give a custom tip", async () => {
      await donationPage.enterCustomTip(customTipAmount);
    });

    await test.step("Fill credit card information", async () => {
      await donationPage.fillCreditCardInfo(creditCard.number, creditCard.expiry, creditCard.cvv);
    });

    await donationPage.continueButton.click();

    await test.step("Close upsell popup", async () => {
      await donationPage.closeUpsellDownsellPopupButton.click();
    });

    await test.step("Verify tip is added", async () => {
      const thankYouAmount = await donationPage.getThankYouPageDonationAmount();
      expect(thankYouAmount).toBeCloseTo(donationAmount + customTipAmount, 2);
    });
  });
});

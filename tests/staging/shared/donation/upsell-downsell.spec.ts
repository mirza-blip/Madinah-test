import { expect, test } from "@/fixtures/pages";
import { TestDataFactory } from "@/test-data/TestDataFactory";

test.describe("Upsell/Downsell Tests", () => {
  let isLoggedIn = false;

  test.beforeAll(() => {
    const storageState = test.info().project.use.storageState;
    isLoggedIn = typeof storageState === "string" && storageState.includes("login.json");
  });

  test.beforeEach(async ({ donationPage }) => {
    await donationPage.goto();
  });

  test("should show & accept upsell offer", async ({ donationPage }) => {
    const personalInfo = TestDataFactory.getValidPersonalInfo();
    const creditCard = TestDataFactory.getValidCreditCard();
    const { upsellAmount } = TestDataFactory.getUpsellDownsellAmounts();

    await test.step("Click on donate now button", async () => {
      await donationPage.startDonation();
    });

    await test.step("Select donation amount", async () => {
      await donationPage.selectDonationLevel(0);
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

    await test.step("Fill credit card information", async () => {
      await donationPage.fillCreditCardInfo(creditCard.number, creditCard.expiry, creditCard.cvv);
    });

    await donationPage.continueButton.click();

    await test.step("Verify upsell popup is displayed", async () => {
      await expect(donationPage.upsellPopup).toBeVisible();
    });

    await test.step("Accept upsell offer", async () => {
      await donationPage.confirmUpsellDownsellButton.click();
      await expect(donationPage.successMessage).toBeVisible();
    });

    await test.step("Close default upsell popup", async () => {
      if (await donationPage.closeUpsellDownsellPopupButton.isVisible()) {
        await donationPage.closeUpsellDownsellPopupButton.click();
      }
    });

    await test.step("Verify donation amount on thank you page", async () => {
      await donationPage.page.waitForTimeout(3000);
      await expect(await donationPage.getThankYouPageDonationAmount()).toBeCloseTo(upsellAmount, 0);
    });
  });

  test("should show & accept downsell offer", async ({ donationPage }) => {
    const personalInfo = TestDataFactory.getValidPersonalInfo();
    const creditCard = TestDataFactory.getValidCreditCard();
    const { downsellAmount } = TestDataFactory.getUpsellDownsellAmounts();

    await test.step("Click on donate now button", async () => {
      await donationPage.startDonation();
    });

    await test.step("Select donation amount", async () => {
      await donationPage.selectDonationLevel(0);
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

    await test.step("Fill credit card information", async () => {
      await donationPage.fillCreditCardInfo(creditCard.number, creditCard.expiry, creditCard.cvv);
    });

    await donationPage.continueButton.click();

    await test.step("Decline upsell offer", async () => {
      await donationPage.declineUpsellDownsellButton.click();
    });

    await test.step("Verify downsell popup is displayed", async () => {
      await expect(donationPage.downsellPopup).toBeVisible();
    });

    await test.step("Accept downsell offer", async () => {
      await donationPage.confirmUpsellDownsellButton.click();
      await expect(donationPage.successMessage).toBeVisible();
      await expect(await donationPage.getThankYouPageDonationAmount()).toBeCloseTo(
        downsellAmount,
        0,
      );
    });
  });

  test("should show & decline downsell offer", async ({ donationPage }) => {
    const personalInfo = TestDataFactory.getValidPersonalInfo();
    const creditCard = TestDataFactory.getValidCreditCard();
    const { downsellAmount } = TestDataFactory.getUpsellDownsellAmounts();
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

    await test.step("Fill credit card information", async () => {
      await donationPage.fillCreditCardInfo(creditCard.number, creditCard.expiry, creditCard.cvv);
    });

    await donationPage.continueButton.click();

    await test.step("Decline upsell offer", async () => {
      await donationPage.declineUpsellDownsellButton.click();
    });

    await test.step("Verify downsell popup is displayed", async () => {
      await expect(donationPage.downsellPopup).toBeVisible();
    });

    await test.step("Accept downsell offer", async () => {
      await donationPage.declineUpsellDownsellButton.click();
      await expect(donationAmount).toBeGreaterThan(downsellAmount);
    });
  });
});

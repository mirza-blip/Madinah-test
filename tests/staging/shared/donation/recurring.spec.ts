import { expect, test } from "@/fixtures/pages";
import { TestDataFactory } from "@/test-data/TestDataFactory";

test.describe.configure({ mode: "default" });

test.describe("Recurring Donation Tests", () => {
  let isLoggedIn = false;

  test.beforeAll(() => {
    const storageState = test.info().project.use.storageState;
    isLoggedIn = typeof storageState === "string" && storageState.includes("login.json");
  });

  test.beforeEach(async ({ donationPage, myDonationPage }) => {
    if (isLoggedIn) {
      await myDonationPage.cancelAllRecurringDonations();
    }
    await donationPage.goto();
  });

  test("should allow making a recurring donation with credit card", async ({ donationPage }) => {
    const personalInfo = TestDataFactory.getValidPersonalInfo();
    const creditCard = TestDataFactory.getValidCreditCard();

    await test.step("Click on donate now button", async () => {
      await donationPage.startDonation();
    });

    test.step("Select donation amount", async () => {
      await donationPage.recurringTabButton.click();
      await donationPage.selectDonationLevel(0);
    });

    if (!isLoggedIn) {
      test.step("Fill personal information", async () => {
        await donationPage.fillPersonalInfo(
          personalInfo.firstName,
          personalInfo.lastName,
          personalInfo.email,
        );
      });
    }

    await donationPage.continueButton.click();

    test.step("Fill credit card information", async () => {
      await donationPage.fillCreditCardInfo(creditCard.number, creditCard.expiry, creditCard.cvv);
    });

    await expect(donationPage.successMessage).toBeVisible();
  });

  test("should allow making a custom monthly recurring donation with credit card", async ({
    donationPage,
  }) => {
    const personalInfo = TestDataFactory.getValidPersonalInfo();
    const creditCard = TestDataFactory.getValidCreditCard();
    const customAmount = 50;

    await test.step("Click on donate now button", async () => {
      await donationPage.startDonation();
    });

    await test.step("Enter custom recurring donation amount", async () => {
      await donationPage.recurringTabButton.click();
      await donationPage.enterCustomDonationAmount(customAmount);
      await donationPage.chooseFrequencyButton.click();
    });

    await test.step("Choose monthly donation frequency", async () => {
      await donationPage.monthlyRecurringButton.click();
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

    await expect(donationPage.successMessage).toBeVisible();
  });
});

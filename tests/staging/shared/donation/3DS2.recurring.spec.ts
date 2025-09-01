import { expect, test } from "@/fixtures/pages";
import { TestDataFactory } from "@/test-data/TestDataFactory";

test.describe.configure({ mode: "default" });

test.describe("3DS2 Tests (Recurring)", () => {
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

  test("should successfully complete a 3DS2 challenge for a recurring donation", async ({
    donationPage,
  }) => {
    const personalInfo = TestDataFactory.getValidPersonalInfo();
    const creditCard = TestDataFactory.get3DS2CreditCard();

    await test.step("Click on donate now button", async () => {
      await donationPage.startDonation();
    });

    await test.step("Select donation amount", async () => {
      await donationPage.recurringTabButton.click();
      await donationPage.selectDonationLevel(0);
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

    await test.step("Click on succeed 3DS2 authentication", async () => {
      await donationPage.successful3DS2ChallengeButton.click();
    });

    await test.step("Verify donation success", async () => {
      await expect(donationPage.successMessage).toBeVisible();
    });
  });
});

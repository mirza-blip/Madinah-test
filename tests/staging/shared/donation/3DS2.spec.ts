import { expect, test } from "@/fixtures/pages";
import { TestDataFactory } from "@/test-data/TestDataFactory";

test.describe("3DS2 Tests", () => {
  let isLoggedIn = false;

  test.beforeAll(() => {
    const storageState = test.info().project.use.storageState;
    isLoggedIn = typeof storageState === "string" && storageState.includes("login.json");
  });

  test.beforeEach(async ({ donationPage }) => {
    await donationPage.goto();
  });

  test.skip("should successfully complete a 3DS2 challenge", async ({ donationPage }) => {
    const personalInfo = TestDataFactory.getValidPersonalInfo();
    const creditCard = TestDataFactory.get3DS2CreditCard();

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

    await test.step("Click on succeed 3DS2 authentication", async () => {
      await donationPage.successful3DS2ChallengeButton.click();
    });

    await test.step("Verify donation success", async () => {
      await expect(donationPage.successMessage).toBeVisible();
    });
  });

  test.skip("should fail to complete a 3DS2 challenge", async ({ donationPage }) => {
    const personalInfo = TestDataFactory.getValidPersonalInfo();
    const creditCard = TestDataFactory.get3DS2CreditCard();

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

    await test.step("Click on fail 3DS2 authentication", async () => {
      await donationPage.failed3DS2ChallengeButton.click();
    });

    await test.step("Verify donation failure", async () => {
      await expect(donationPage.failed3DS2ErrorMessage).toBeVisible();
    });
  });

  test("should succeed using frictionless flow (Not 3DS2 authentication)", async ({
    donationPage,
  }) => {
    const personalInfo = TestDataFactory.getValidPersonalInfo();
    const creditCard = TestDataFactory.get3DS2FrictionlessCreditCard();

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

    await test.step("Verify donation success", async () => {
      await expect(donationPage.successMessage).toBeVisible();
    });
  });

  test("should fail because of insufficient funds", async ({ donationPage }) => {
    const personalInfo = TestDataFactory.getValidPersonalInfo();
    const creditCard = TestDataFactory.getInsufficientFundsCreditCard();

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

    await test.step("Verify donation failure", async () => {
      await expect(donationPage.insufficientFundsErrorMessage).toBeVisible();
    });
  });
});

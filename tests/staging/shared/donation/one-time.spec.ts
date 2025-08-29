import { expect, test } from "@/fixtures/pages";
import { TestDataFactory } from "@/test-data/TestDataFactory";

test.describe("One-time Donation Tests", () => {
  let isLoggedIn = false;

  test.beforeAll(() => {
    const storageState = test.info().project.use.storageState;
    isLoggedIn = typeof storageState === "string" && storageState.includes("login.json");
  });

  test.beforeEach(async ({ donationPage }) => {
    await donationPage.goto();
  });

  test("should allow making a one-time donation with credit card", async ({ donationPage }) => {
    const personalInfo = TestDataFactory.getValidPersonalInfo();
    const creditCard = TestDataFactory.getValidCreditCard();

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

  test("should prevent making a one-time donation with invalid credit card", async ({
    donationPage,
  }) => {
    const personalInfo = TestDataFactory.getValidPersonalInfo();
    const invalidCard = TestDataFactory.getInvalidCreditCard();

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
      await donationPage.fillCreditCardInfo(
        invalidCard.number,
        invalidCard.expiry,
        invalidCard.cvv,
      );
    });

    await test.step("Verify donation failure", async () => {
      await expect(donationPage.errorMessage).toBeVisible();
    });
  });

  test("should allow making a one-time custom donation with credit card", async ({
    donationPage,
  }) => {
    const personalInfo = TestDataFactory.getValidPersonalInfo();
    const creditCard = TestDataFactory.getValidCreditCard();
    const customAmount = 50;

    await test.step("Click on donate now button", async () => {
      await donationPage.startDonation();
    });

    await test.step("Select custom donation amount", async () => {
      await donationPage.enterCustomDonationAmount(customAmount);
      await donationPage.donateButton.click();
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

    await expect(donationPage.successMessage).toBeVisible();
  });

  test("should update total donation amount after successful one-time donation with credit card", async ({
    donationPage,
  }) => {
    test.setTimeout(90000);

    const personalInfo = TestDataFactory.getValidPersonalInfo();
    const creditCard = TestDataFactory.getValidCreditCard();

    let initialAmount: number;
    let donationAmount: number;

    await test.step("Get initial total amount", async () => {
      initialAmount = await donationPage.getTotalAmount();
    });

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

    await expect(donationPage.successMessage).toBeVisible();

    await donationPage.goto();

    const finalAmount = await donationPage.getTotalAmount();

    expect(finalAmount).toBeGreaterThan(initialAmount);
    expect(finalAmount).toBe(initialAmount + donationAmount);
  });

  test("should prevent making a one-time donation with expired credit card", async ({
    donationPage,
  }) => {
    const personalInfo = TestDataFactory.getValidPersonalInfo();
    const expiredCard = TestDataFactory.getExpiredCreditCard();

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
      await donationPage.fillCreditCardInfo(
        expiredCard.number,
        expiredCard.expiry,
        expiredCard.cvv,
      );
    });

    await test.step("Verify donation failure", async () => {
      await expect(donationPage.expiredCardErrorMessage).toBeVisible();
    });
  });

  test("should fail due to minimum donation limits", async ({ donationPage }) => {
    const customAmount = 10;

    await test.step("Click on donate now button", async () => {
      await donationPage.startDonation();
    });

    await test.step("Select custom donation amount", async () => {
      await donationPage.enterCustomDonationAmount(customAmount);
    });

    await test.step("Verify minimum donation limits", async () => {
      await expect(donationPage.page.getByText("Amount should be greater than")).toBeVisible();
      await expect(donationPage.donateButton).toBeDisabled();
    });
  });

  test("should fail due to maximum donation limits", async ({ donationPage }) => {
    const personalInfo = TestDataFactory.getValidPersonalInfo();
    const creditCard = TestDataFactory.getValidCreditCard();
    const customAmount = 1_000_000;

    await test.step("Click on donate now button", async () => {
      await donationPage.startDonation();
    });

    await test.step("Select custom donation amount", async () => {
      await donationPage.enterCustomDonationAmount(customAmount);
      await donationPage.donateButton.click();
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
      await expect(
        donationPage.page.getByText(
          "Invoice: Total in cents must have amount less than 1000000 usd for automatic invoice",
        ),
      ).toBeVisible();
    });
  });
});

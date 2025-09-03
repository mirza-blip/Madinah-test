import { expect, test } from "@/fixtures/pages";

test("should convert currencies correctly", async ({ donationPage }) => {
  let initialDonationAmount: number;

  await test.step("Setup: Navigate to donation page and get initial USD amount", async () => {
    await donationPage.page.goto("/Kevser-refugee");
    await donationPage.startDonation();
    initialDonationAmount = await donationPage.getDonationLevelAmount(0);
  });

  const currencyTests = [
    { currency: "EUR", rate: 0.855, name: "USD to EUR" },
    { currency: "AUD", rate: 1.539, name: "USD to AUD" },
    { currency: "CAD", rate: 1.383, name: "USD to CAD" },
  ];

  for (const { currency, rate, name } of currencyTests) {
    await test.step(`Convert ${name}`, async () => {
      await donationPage.currencyConversionOpenBtn.click();
      await donationPage.page.getByRole("option", { name: currency }).click();

      await donationPage.page.waitForTimeout(1000);

      const convertedDonationAmount = await donationPage.getDonationLevelAmount(0);

      const expectedAmount = initialDonationAmount * rate;
      const difference = Math.abs(convertedDonationAmount - expectedAmount);

      await expect(difference).toBeLessThan(5.0);

      // if (currency !== "CAD") {
      //   await donationPage.currencyConversionOpenBtn.click();
      //   await donationPage.page.getByRole("option", { name: "USD" }).click();
      // }
    });
  }
});

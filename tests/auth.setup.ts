import { expect, test as setup } from "@/fixtures/pages";
import { TestDataFactory } from "@/test-data/TestDataFactory";

const AUTH_FILE = ".auth/login.json";

setup("login", async ({ page, context, homePage, authPage }) => {
  const credentials = TestDataFactory.getLoginCredentials();
  await homePage.goto();
  await homePage.clickSignIn();
  await authPage.login(credentials.email, credentials.password);

  await expect(page).toHaveURL(/dashboard/);
  await context.storageState({ path: AUTH_FILE });
});

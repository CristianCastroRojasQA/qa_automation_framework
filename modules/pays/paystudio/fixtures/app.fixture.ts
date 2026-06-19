import { test as base } from "@playwright/test";

import { LoginPage } from "@paystudio/pages/auth/LoginPage";
import { LogoutPage } from "@paystudio/pages/auth/LogoutPage";
import { SessionInvalidPage } from "@paystudio/pages/auth/SessionInvalidPage";
import { Navbar } from "@paystudio/components/navbar/navbar";
import { ChangePasswordPage } from "@paystudio/pages/auth/ChangePasswordPage";
import { BatchConsolePage } from "@paystudio/pages/batches/BatchConsolePage";

/**
 * Fixtures de App (Auth + Navbar)
 */
type AppFixtures = {
  loginPage: LoginPage;
  logoutPage: LogoutPage;
  sessionInvalidPage: SessionInvalidPage;
  navbar: Navbar;
  changePasswordPage: ChangePasswordPage;
  batchConsolePage: BatchConsolePage;
};

export const test = base.extend<AppFixtures>({
  /**
   * Provee LoginPage
   */
  loginPage: async ({ page }, use) => {
    await use(new LoginPage(page));
  },

  /**
   * Provee LogoutPage
   */
  logoutPage: async ({ page }, use) => {
    await use(new LogoutPage(page));
  },

  /**
   * Provee SessionInvalidPage
   */
  sessionInvalidPage: async ({ page }, use) => {
    await use(new SessionInvalidPage(page));
  },

  /**
   * Provee ChangePasswordPage
   */
  changePasswordPage: async ({ page }, use) => {
    await use(new ChangePasswordPage(page));
  },

  /**
   * Provee BatchConsolePage
   */
  batchConsolePage: async ({ page }, use) => {
    await use(new BatchConsolePage(page));
  },

  /**
   * Provee Navbar
   */
  navbar: async ({ page }, use) => {
    await use(new Navbar(page));
  },
});

// Re-export expect
export { expect } from "@playwright/test";

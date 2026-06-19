import { settings } from "@config/settings";
import { expect, test as setup } from "@playwright/test";
import { LoginPage } from "@paystudio/pages/auth/LoginPage";
import fs from "fs";
import path from "path";

const authDir = path.resolve("playwright/.auth");
const authFile = path.join(authDir, "paystudio.json");

/**
 * Setup de autenticación para PayStudio.
 *
 * Limpia cualquier storageState previo, inicia sesión en modo headless
 * y genera un nuevo estado autenticado reutilizable por las suites internas.
 */
setup.use({ headless: true });

setup("Crear sesión autenticada PayStudio", async ({ page }) => {
  fs.mkdirSync(authDir, { recursive: true });

  if (fs.existsSync(authFile)) {
    fs.rmSync(authFile, { force: true });
  }

  const loginPage = new LoginPage(page);

  await loginPage.goto(settings.paystudioUrl);
  await loginPage.login(settings.credentials.user, settings.credentials.pass);

  await expect(page).toHaveURL(/MainPage/);
  await expect(
    page.locator("[id$='HeaderControl1_UserWelcome']"),
  ).toBeVisible();

  await page.context().storageState({
    path: authFile,
  });
});
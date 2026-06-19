import { settings } from "@config/settings";
import { test, expect } from "@playwright/test";

test.describe("HEALTH - PayStudio | Conexión Login", () => {
  test("TC-01: PayStudio - Debe cargar correctamente la pantalla de login", async ({
    page,
  }) => {
    console.log(`[Test] Probando conexión a: ${settings.paystudioUrl}`);
    console.log(`[Test] Usuario configurado: ${settings.credentials.user}`);

    await page.goto(settings.paystudioUrl);

    expect(page.url()).toContain(settings.paystudioUrl);

    await expect(page).toHaveTitle("Log in");
  });
});

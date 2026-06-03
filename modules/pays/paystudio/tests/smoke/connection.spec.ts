// modules/pays/paystudio/tests/connection.spec.ts
import { settings } from "@config/settings";
import { test, expect } from "@playwright/test";


test.describe("Prueba Rápida de Conexión - PayStudio", () => {
  test("Debería cargar la página de login de PayStudio correctamente", async ({
    page,
  }) => {
    console.log(`[Test] Probando conexión a: ${settings.paystudioUrl}`);
    console.log(`[Test] Usuario configurado: ${settings.credentials.user}`);

    // 1. Navegar a la URL base inyectada por el proyecto
    await page.goto("");

    // 2. Verificar que la URL actual coincide con la esperada
    expect(page.url()).toContain(settings.paystudioUrl);

    // 3. Verificar el título de la página devuelto por el servidor
    await expect(page).toHaveTitle("Log in");

    // 4. Verificar elementos del DOM
    const legend = page.locator("#ctl00_CphContent_LoginControl1_LabelLegend");
    await expect(legend).toHaveText("Iniciar Sesión");

    await expect(
      page.locator("#ctl00_CphContent_LoginControl1_TextBoxUser"),
    ).toBeVisible();
    await expect(
      page.locator("#ctl00_CphContent_LoginControl1_ButtonLogInPS"),
    ).toBeVisible();
  });
});

import { test, expect } from "@playwright/test";
import { settings } from "../../../../config/settings";

test.describe("Prueba Rápida de Conexión - Portal de Comercio", () => {
  test("Debería cargar la página de login del Portal de Comercio correctamente", async ({
    page,
  }) => {
    console.log(`[Test] Probando conexión a: ${settings.portalUrl}`);

    // 1. Navegar a la URL base inyectada por el proyecto
    await page.goto(settings.portalUrl, { waitUntil: "domcontentloaded" });

    // 2. Verificar que la URL actual coincide con la esperada
    expect(page.url()).toContain(settings.portalUrl);

    // 3. Verificar el título del portal (título de la aplicación o del tab)
    // Usamos una expresión regular o título parcial si cambia dinámicamente
    await expect(page).toHaveTitle(/.*Portal.*/);

    // 4. Verificar elementos del DOM (campos de usuario y contraseña)
    const usernameInput = page.locator("#username");
    const passwordInput = page.locator("#passwordLogin");
    const loginButton = page.locator("button.custom-btn-xl");

    await expect(usernameInput).toBeVisible();
    await expect(passwordInput).toBeVisible();
    await expect(loginButton).toBeVisible();

    // 5. Verificar que el botón de login dice "Iniciar Sesión"
    await expect(loginButton).toHaveText("Iniciar Sesión");
  });
});

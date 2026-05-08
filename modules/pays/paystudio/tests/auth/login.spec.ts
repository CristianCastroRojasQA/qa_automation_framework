import test, { expect } from "@playwright/test";
import { LoginPage } from "../../pages/auth/LoginPage";
import { settings } from "../../../../../config/settings";
import { logger } from "../../../../../utils/logger";

/**
 * Suite de pruebas para el módulo de Autenticación de PayStudio.
 * Cubre:
 * - flujos exitosos
 * - validaciones funcionales
 * - escenarios negativos
 * - pruebas de seguridad
 */
test.describe("Módulo de Autenticación - PayStudio", () => {
  let loginPage: LoginPage;

  /**
   * Inicializa el Page Object y navega al portal antes de cada prueba.
   */
  test.beforeEach(async ({ page }) => {
    logger.info(`>>> INICIANDO TEST: ${test.info().title} <<<`);

    loginPage = new LoginPage(page);
    await loginPage.navigate(settings.paystudioUrl);
  });

  /**
   * Registra el resultado final de cada prueba.
   * En caso de fallo, captura el motivo principal para facilitar debugging y trazabilidad.
   */
  test.afterEach(async ({}, testInfo) => {
    if (testInfo.status !== testInfo.expectedStatus) {
      logger.error(`TEST FALLIDO: [${testInfo.title}]`);

      if (testInfo.error) {
        const cleanErrorMessage = testInfo.error.message
          ?.replace(/\x1B\[\d+m/g, "")
          .split("\n")[0];
        logger.error(`MOTIVO DEL FALLO: ${cleanErrorMessage}`);
      }
    }

    logger.info(`<<< FINALIZADO TEST: ${testInfo.title} >>>\n`);
  });

  // Smoke Tests

  /**
   * Verifica que la página de login cargue correctamente.
   */
  test("TC-01: @smoke Visualización - Debe cargar el portal de login correctamente", async ({
    page,
  }) => {
    await expect(page).toHaveURL(/LoginPage/);
    expect(await loginPage.isErrorVisible()).toBe(false);

    logger.info("Verificación de carga inicial exitosa.");
  });

  /**
   * Verifica el acceso exitoso utilizando credenciales válidas del entorno.
   */
  test("TC-02: @smoke Login Exitoso - Debe permitir el ingreso con credenciales válidas", async ({
    page,
  }) => {
    const { user, pass } = settings.credentials;

    await loginPage.login(user, pass);
    // Se valida redirección al dashboard principal
    await expect(page).toHaveURL(/MainPage/);

    logger.info(`Login exitoso con usuario: ${user}`);
  });

  // Pruebas Funcionales

  /**
   * Verifica que el sistema rechace credenciales con contraseña incorrecta.
   */
  test("TC-03: @functional Login Fallido - Debe mostrar error con contraseña incorrecta", async () => {
    await loginPage.login(settings.credentials.user, "ClaveFalsa123*");

    await loginPage.waitForErrorMessage();
    const message = await loginPage.getErrorMessage();

    expect(await loginPage.isErrorVisible()).toBe(true);
    expect(message).toContain("Usuario y/o contraseña inválidos");

    logger.info("Validación de contraseña incorrecta confirmada.");
  });

  /**
   * Verifica que el sistema rechace usuarios inexistentes.
   */
  test("TC-04: @functional Login Fallido - Debe mostrar error con usuario inexistente", async () => {
    await loginPage.login("UsuarioFalso", settings.credentials.pass);

    await loginPage.waitForErrorMessage();
    const message = await loginPage.getErrorMessage();

    expect(await loginPage.isErrorVisible()).toBe(true);
    expect(message).toContain("Usuario no encontrado en el sistema");

    logger.info("Validación de usuario inexistente confirmada.");
  });

  /**
   * Verifica que el formulario active validaciones de campos obligatorios.
   */
  test("TC-05: @functional Validación - Debe activar mensajes de campos obligatorios (Vacíos)", async () => {
    await loginPage.login("", "");

    expect(await loginPage.isUsernameErrorVisible()).toBe(true);
    expect(await loginPage.isPasswordErrorVisible()).toBe(true);

    logger.info("Validación de campos obligatorios confirmada.");
  });

  /**
   * Verifica la validación individual del campo usuario.
   */
  test("TC-06: @functional Validación - Debe activar requerimiento solo en campo Usuario", async () => {
    await loginPage.login("", settings.credentials.pass);

    expect(await loginPage.isUsernameErrorVisible()).toBe(true);
    expect(await loginPage.isPasswordErrorVisible()).toBe(false);

    logger.info("Validación de usuario vacio confirmada.");
  });

  /**
   * Verifica la validación individual del campo contraseña.
   */
  test("TC-07: @functional Validación - Debe activar requerimiento solo en campo Contraseña", async () => {
    await loginPage.login(settings.credentials.user, "");

    expect(await loginPage.isUsernameErrorVisible()).toBe(false);
    expect(await loginPage.isPasswordErrorVisible()).toBe(true);

    logger.info("Validación de contraseña vacia confirmada.");
  });

  // Pruebas de Seguridad

  /**
   * Verifica que el sistema rechace intentos de SQL Injection.
   */
  test("TC-08: @security Inyección - No debe permitir SQL Injection en campo usuario", async ({
    page,
  }) => {
    await loginPage.login("' OR 1=1 --", "cualquierCosa");

    await expect(page).toHaveURL(/LoginPage/);

    await loginPage.waitForErrorMessage();
    const message = await loginPage.getErrorMessage();

    expect(message).toContain("Usuario no encontrado en el sistema");

    logger.info("Validación de SQL Injection confirmada.");
  });

  /**
   * Verifica que el sistema rechace scripts maliciosos en los inputs.
   */
  test("TC-09: @security XSS - No debe permitir scripts maliciosos en el formulario", async ({
    page,
  }) => {
    await loginPage.login("<script>alert('xss')</script>", "cualquierCosa");

    await expect(page).toHaveURL(/LoginPage/);

    await loginPage.waitForErrorMessage();
    const message = await loginPage.getErrorMessage();

    expect(message).toContain("Usuario no encontrado en el sistema");

    logger.info("Validación de XSS confirmada.");
  });
});

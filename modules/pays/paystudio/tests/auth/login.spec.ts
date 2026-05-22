import { test, expect } from "@playwright/test";
import { LoginPage } from "../../pages/auth/LoginPage";
import { settings } from "../../../../../config/settings";
import { logger } from "../../../../../utils/logger";
import { attachScreenshot } from "../../../../../utils/screenshot";
import { authData } from "../../../../../data/auth/auth.data";

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
  }, testInfo) => {
    await expect(page).toHaveURL(/LoginPage/);

    expect(await loginPage.isErrorVisible()).toBe(false);

    logger.info("Verificación de carga inicial exitosa.");

    await attachScreenshot(page, testInfo);
  });

  /**
   * Verifica el acceso exitoso utilizando credenciales válidas del entorno.
   */
  test("TC-02: @smoke Login Exitoso - Debe permitir el ingreso con credenciales válidas", async ({
    page,
  }, testInfo) => {
    const { user, pass } = settings.credentials;

    await loginPage.login(user, pass);

    // Se valida redirección al dashboard principal
    await expect(page).toHaveURL(/MainPage/);

    logger.info(`Login exitoso con usuario: ${user}`);

    await attachScreenshot(page, testInfo);
  });

  // Pruebas Funcionales

  /**
   * Verifica que el sistema rechace credenciales con contraseña inválida.
   */
  test("TC-03: @functional Login Fallido - Debe mostrar error con contraseña inválida", async ({
    page,
  }, testInfo) => {
    await loginPage.login(
      settings.credentials.user,
      authData.invalidCredentials.wrongPassword,
    );

    const message = await loginPage.getErrorMessage();

    expect(await loginPage.isErrorVisible()).toBe(true);

    expect(message).toContain("Usuario y/o contraseña inválidos");

    logger.info("Validación de contraseña inválida confirmada.");

    await attachScreenshot(page, testInfo);
  });

  /**
   * Verifica que el sistema rechace usuarios inexistentes.
   */
  test("TC-04: @functional Login Fallido - Debe mostrar error con usuario no encontrado", async ({
    page,
  }, testInfo) => {
    await loginPage.login(
      authData.invalidCredentials.nonExistingUser,
      settings.credentials.pass,
    );

    const message = await loginPage.getErrorMessage();

    expect(await loginPage.isErrorVisible()).toBe(true);

    expect(message).toContain("Usuario no encontrado en el sistema");

    logger.info("Validación de usuario no encontrado confirmada.");

    await attachScreenshot(page, testInfo);
  });

  /**
   * Verifica que el formulario active validaciones de campos obligatorios.
   */
  test("TC-05: @functional Validación - Debe activar mensajes de campos obligatorios (Vacíos)", async ({
    page,
  }, testInfo) => {
    await loginPage.login(authData.emptyFields.user, authData.emptyFields.pass);

    expect(await loginPage.isUsernameErrorVisible()).toBe(true);
    expect(await loginPage.isPasswordErrorVisible()).toBe(true);

    logger.info("Validación de campos obligatorios confirmada.");

    await attachScreenshot(page, testInfo);
  });

  /**
   * Verifica la validación individual del campo usuario.
   */
  test("TC-06: @functional Validación - Debe activar requerimiento solo en campo Usuario", async ({
    page,
  }, testInfo) => {
    await loginPage.login(authData.emptyFields.user, settings.credentials.pass);

    expect(await loginPage.isUsernameErrorVisible()).toBe(true);
    expect(await loginPage.isPasswordErrorVisible()).toBe(false);

    logger.info("Validación de usuario vacio confirmada.");

    await attachScreenshot(page, testInfo);
  });

  /**
   * Verifica la validación individual del campo contraseña.
   */
  test("TC-07: @functional Validación - Debe activar requerimiento solo en campo Contraseña", async ({
    page,
  }, testInfo) => {
    await loginPage.login(settings.credentials.user, authData.emptyFields.pass);

    expect(await loginPage.isUsernameErrorVisible()).toBe(false);
    expect(await loginPage.isPasswordErrorVisible()).toBe(true);

    logger.info("Validación de contraseña vacia confirmada.");
    await attachScreenshot(page, testInfo);
  });

  // Pruebas de Seguridad

  /**
   * Verifica que el sistema rechace intentos de SQL Injection.
   */
  test("TC-08: @security Inyección - No debe permitir SQL Injection en campo usuario", async ({
    page,
  }, testInfo) => {
    await loginPage.login(
      authData.securityPayloads.sqlInjection.user,
      authData.securityPayloads.sqlInjection.pass,
    );

    await expect(page).toHaveURL(/LoginPage/);

    const message = await loginPage.getErrorMessage();

    expect(message).toContain("Usuario no encontrado en el sistema");

    logger.info("Validación de SQL Injection confirmada.");

    await attachScreenshot(page, testInfo);
  });

  /**
   * Verifica que el sistema rechace scripts maliciosos en los inputs.
   */
  test("TC-09: @security XSS - No debe permitir scripts maliciosos en el formulario", async ({
    page,
  }, testInfo) => {
    await loginPage.login(
      authData.securityPayloads.xssAttack.user,
      authData.securityPayloads.xssAttack.pass,
    );

    await expect(page).toHaveURL(/LoginPage/);

    const message = await loginPage.getErrorMessage();

    expect(message).toContain("Usuario no encontrado en el sistema");

    logger.info("Validación de XSS confirmada.");

    await attachScreenshot(page, testInfo);
  });
});

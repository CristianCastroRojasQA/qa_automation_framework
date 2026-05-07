import test, { expect } from "@playwright/test";
import { LoginPage } from "../../pages/auth/LoginPage";
import { settings } from "../../../../../config/settings";

/**
 * Suite de pruebas para el módulo de Autenticación de PayStudio.
 * Cubre flujos de éxito, validaciones de campos obligatorios y pruebas de seguridad.
 */
test.describe("Módulo de Autenticación - PayStudio", () => {
  let loginPage: LoginPage;

  /**
   * Inicializa el Page Object y navega al portal antes de cada caso de prueba.
   */
  test.beforeEach(async ({ page }) => {
    loginPage = new LoginPage(page);
    await loginPage.navigate(settings.paystudioUrl);
  });

  // --------------------------------------------------------------------------------
  // SMOKE TESTS
  // --------------------------------------------------------------------------------

  /**
   * Verifica que la página de inicio de sesión cargue correctamente y la URL sea válida.
   */
  test("TC-01: @smoke Visualización - Debe cargar el portal de login correctamente", async ({
    page,
  }) => {
    await expect(page).toHaveURL(/LoginPage/);
    expect(await loginPage.isErrorVisible()).toBe(false);
  });

  /**
   * Valida el acceso exitoso al sistema utilizando credenciales del entorno configurado.
   */
  test("TC-02: @smoke Login Exitoso - Debe permitir el ingreso con credenciales válidas", async ({
    page,
  }) => {
    const { user, pass } = settings.credentials;

    await loginPage.login(user, pass);

    // Se verifica la redirección a la página principal tras el éxito
    await expect(page).toHaveURL(/MainPage/);
  });

  // --------------------------------------------------------------------------------
  // PRUEBAS FUNCIONALES
  // --------------------------------------------------------------------------------

  /**
   * Valida que el sistema rechace el acceso con una contraseña errónea.
   */
  test("TC-03: @functional Login Fallido - Debe mostrar error con contraseña incorrecta", async () => {
    await loginPage.login(settings.credentials.user, "ClaveFalsa123*");

    await loginPage.waitForErrorMessage();
    const message = await loginPage.getErrorMessage();

    expect(await loginPage.isErrorVisible()).toBe(true);
    expect(message).toContain("Usuario y/o contraseña inválidos");
  });

  /**
   * Valida que el sistema rechace el acceso cuando el usuario no existe.
   */
  test("TC-04: @functional Login Fallido - Debe mostrar error con usuario inexistente", async () => {
    await loginPage.login("UsuarioFalso", settings.credentials.pass);

    await loginPage.waitForErrorMessage();
    const message = await loginPage.getErrorMessage();

    expect(await loginPage.isErrorVisible()).toBe(true);
    expect(message).toContain("Usuario no encontrado en el sistema");
  });

  /**
   * Verifica que se disparen las alertas de campos requeridos al enviar el formulario vacío.
   */
  test("TC-05: @functional Validación - Debe activar mensajes de campos obligatorios (Vacíos)", async () => {
    await loginPage.login("", "");

    expect(await loginPage.isUsernameErrorVisible()).toBe(true);
    expect(await loginPage.isPasswordErrorVisible()).toBe(true);
  });

  /**
   * Verifica la validación individual del campo de usuario.
   */
  test("TC-06: @functional Validación - Debe activar requerimiento solo en campo Usuario", async () => {
    await loginPage.login("", settings.credentials.pass);

    expect(await loginPage.isUsernameErrorVisible()).toBe(true);
    expect(await loginPage.isPasswordErrorVisible()).toBe(false);
  });

  /**
   * Verifica la validación individual del campo de contraseña.
   */
  test("TC-07: @functional Validación - Debe activar requerimiento solo en campo Contraseña", async () => {
    await loginPage.login(settings.credentials.user, "");

    expect(await loginPage.isUsernameErrorVisible()).toBe(false);
    expect(await loginPage.isPasswordErrorVisible()).toBe(true);
  });

  // --------------------------------------------------------------------------------
  // PRUEBAS DE SEGURIDAD
  // --------------------------------------------------------------------------------

  /**
   * Evalúa que el sistema maneje de forma segura intentos de SQL Injection en el login.
   */
  test("TC-08: @security Inyección - No debe permitir SQL Injection en campo usuario", async ({
    page,
  }) => {
    await loginPage.login("' OR 1=1 --", "cualquierCosa");

    await expect(page).toHaveURL(/LoginPage/);

    await loginPage.waitForErrorMessage();
    const message = await loginPage.getErrorMessage();

    expect(message).toContain("Usuario no encontrado en el sistema");
  });

  /**
   * Evalúa que el sistema maneje de forma segura intentos de XSS en los inputs.
   */
  test("TC-09: @security XSS - No debe permitir scripts maliciosos en el formulario", async ({
    page,
  }) => {
    await loginPage.login("<script>alert('xss')</script>", "cualquierCosa");

    await expect(page).toHaveURL(/LoginPage/);

    await loginPage.waitForErrorMessage();
    const message = await loginPage.getErrorMessage();

    expect(message).toContain("Usuario no encontrado en el sistema");
  });
});

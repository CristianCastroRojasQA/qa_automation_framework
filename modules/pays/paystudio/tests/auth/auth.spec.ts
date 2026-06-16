import { settings } from "@config/settings";
import { AuthMessages } from "@paystudio/test-data/auth/auth.constants";
import { authData } from "@paystudio/test-data/auth/auth.data";
import { securityPayloads } from "@paystudio/test-data/security/security.payloads";
import { expect, test } from "@paystudio/fixtures";
import { logger } from "@utils/logger";
import { SecurityPolicyProvider } from "@paystudio/test-data/security/security-policy.provider";
import { UserProvider } from "@paystudio/test-data/user/user.provider";

/**
 * Suite de Autenticación
 */
test.describe("Módulo de Autenticación - PayStudio", () => {
  test("TC-01: Login Page - Debe cargar el portal de autenticación correctamente", async ({
    page,
    loginPage,
  }) => {
    await loginPage.goto(settings.paystudioUrl);

    await expect(page).toHaveURL(/LoginPage/);
    await expect(page.getByText(AuthMessages.BRAND_PAGE)).toBeVisible();

    logger.info(
      `TC-01 validado: se cargó LoginPage correctamente (URL contiene 'LoginPage') y el texto de marca [${AuthMessages.BRAND_PAGE}] es visible en pantalla.`,
    );
  });

  test("TC-02: Login Exitoso - Debe permitir autenticación con credenciales válidas", async ({
    page,
    loginPage,
  }) => {
    const { user, pass } = settings.credentials;

    await loginPage.goto(settings.paystudioUrl);
    await loginPage.login(user, pass);

    await expect(page).toHaveURL(/MainPage/);
    await expect(page.getByText(AuthMessages.BRAND_PAGE)).toBeVisible();

    logger.info(
      `TC-02 validado: autenticación exitosa para [${user}], se redirigió a 'MainPage' y el texto de marca [${AuthMessages.BRAND_PAGE}] es visible tras el login.`,
    );
  });

  test("TC-03: Login Fallido - Debe rechazar contraseña inválida", async ({
    loginPage,
  }) => {
    const invalidPass = authData.invalidCredentials.wrongPassword;

    await loginPage.goto(settings.paystudioUrl);
    await loginPage.login(settings.credentials.user, invalidPass);

    await expect(loginPage.errorMessage).toBeVisible();
    await expect(loginPage.errorMessage).toContainText(
      AuthMessages.INVALID_CREDENTIALS,
    );

    logger.info(
      `TC-03 validado: intento de login con contraseña inválida fue rechazado; el mensaje de error [${AuthMessages.INVALID_CREDENTIALS}] se mostró correctamente.`,
    );
  });

  test("TC-04: Login Fallido - Debe rechazar usuario inexistente", async ({
    loginPage,
  }) => {
    const invalidUser = authData.invalidCredentials.nonExistingUser;

    await loginPage.goto(settings.paystudioUrl);
    await loginPage.login(invalidUser, settings.credentials.pass);

    await expect(loginPage.errorMessage).toBeVisible();
    await expect(loginPage.errorMessage).toContainText(
      AuthMessages.USER_NOT_FOUND,
    );

    logger.info(
      `TC-04 validado: intento de login con usuario inexistente fue rechazado; el mensaje [${AuthMessages.USER_NOT_FOUND}] es visible en pantalla.`,
    );
  });

  test("TC-05: Validación Formulario - Campos obligatorios vacíos", async ({
    loginPage,
  }) => {
    await loginPage.goto(settings.paystudioUrl);

    await loginPage.login(authData.emptyFields.user, authData.emptyFields.pass);

    const userError = await loginPage.usernameError.isVisible();
    const passError = await loginPage.passwordError.isVisible();

    await expect(loginPage.usernameError).toBeVisible();
    await expect(loginPage.passwordError).toBeVisible();

    logger.info(
      `TC-05 validado: al enviar campos vacíos, se activaron ambas validaciones requeridas [${userError} y ${passError}] es visible en pantalla.`,
    );
  });

  test("TC-06: Validación Formulario - Falta usuario", async ({
    loginPage,
  }) => {
    await loginPage.goto(settings.paystudioUrl);

    await loginPage.login(authData.emptyFields.user, settings.credentials.pass);

    const userError = await loginPage.usernameError.isVisible();
    const passError = await loginPage.passwordError.isVisible();

    await expect(loginPage.usernameError).toBeVisible();
    await expect(loginPage.passwordError).not.toBeVisible();

    logger.info(
      `TC-06 validado: al omitir el usuario y enviar contraseña válida, solo se activó la validación de usuario [${userError} y ${passError}] es visible en pantalla.`,
    );
  });

  test("TC-07: Validación Formulario - Falta contraseña", async ({
    loginPage,
  }) => {
    await loginPage.goto(settings.paystudioUrl);

    await loginPage.login(settings.credentials.user, authData.emptyFields.pass);

    const userError = await loginPage.usernameError.isVisible();
    const passError = await loginPage.passwordError.isVisible();

    await expect(loginPage.usernameError).not.toBeVisible();
    await expect(loginPage.passwordError).toBeVisible();

    logger.info(
      `TC-07 validado: al enviar usuario válido y omitir contraseña, solo se activó la validación de contraseña [${userError} y ${passError}] es visible en pantalla.`,
    );
  });

  test("TC-08: Seguridad - Debe rechazar SQL Injection", async ({
    page,
    loginPage,
  }) => {
    const payload = securityPayloads.sqlInjection;

    await loginPage.goto(settings.paystudioUrl);
    await loginPage.login(payload.user, payload.pass);

    await expect(page).toHaveURL(/LoginPage/);
    await expect(loginPage.errorMessage).toBeVisible();
    await expect(loginPage.errorMessage).toContainText(
      AuthMessages.USER_NOT_FOUND,
    );

    logger.info(
      `TC-08 validado: intento de SQL Injection fue bloqueado; el sistema permaneció en LoginPage y el mensaje de error [${AuthMessages.USER_NOT_FOUND}] es visible.`,
    );
  });

  test("TC-09: Seguridad - Debe rechazar XSS", async ({ page, loginPage }) => {
    const payload = securityPayloads.xssAttack;

    await loginPage.goto(settings.paystudioUrl);
    await loginPage.login(payload.user, payload.pass);

    await expect(page).toHaveURL(/LoginPage/);
    await expect(loginPage.errorMessage).toBeVisible();
    await expect(loginPage.errorMessage).toContainText(
      AuthMessages.USER_NOT_FOUND,
    );

    logger.info(
      `TC-09 validado: intento de XSS fue rechazado; no hubo redirección y el mensaje de error [${AuthMessages.USER_NOT_FOUND}] se mostró correctamente en LoginPage.`,
    );
  });

  test("TC-10: Logout - Debe cerrar sesión correctamente", async ({
    page,
    loginPage,
    logoutPage,
    navbar,
  }) => {
    const { user, pass } = settings.credentials;

    await loginPage.goto(settings.paystudioUrl);
    await loginPage.login(user, pass);

    await expect(page).toHaveURL(/MainPage/);

    await navbar.logout();

    await expect(logoutPage.logoutMessage).toBeVisible();
    await expect(logoutPage.logoutMessage).toContainText(
      AuthMessages.LOGOUT_SUCCESS,
    );

    await expect(page).toHaveURL(/LogoutPage/);

    logger.info(
      `TC-10 validado: el usuario [${user}] cerró sesión correctamente; se mostró el mensaje [${AuthMessages.LOGOUT_SUCCESS}] y se redirigió a 'LogoutPage'.`,
    );
  });

  test("TC-11: Login Exitoso - Debe permitir login con tecla Enter", async ({
    page,
    loginPage,
  }) => {
    const { user, pass } = settings.credentials;

    await loginPage.goto(settings.paystudioUrl);
    await loginPage.loginWithEnter(user, pass);

    await expect(page).toHaveURL(/MainPage/);

    logger.info(
      `TC-11 validado: autenticación mediante tecla Enter fue exitosa; se navegó correctamente a 'MainPage'.`,
    );
  });

  test("TC-12: Seguridad - Debe bloquear el usuario al superar la cantidad de intentos fallidos permitidos", async ({
    loginPage,
  }) => {
    const { user } = settings.credentials;
    const invalidPass = authData.invalidCredentials.wrongPassword;

    const policy = await SecurityPolicyProvider.getSecurityPolicy();
    const maxAttempts = policy.attemptsOfLogin;

    await loginPage.goto(settings.paystudioUrl);

    for (let i = 0; i < maxAttempts; i++) {
      logger.info(
        `TC-12 ejecución: intento fallido #${i + 1} de ${maxAttempts} para el usuario [${user}] con contraseña inválida.`,
      );

      await loginPage.login(user, invalidPass);
    }

    await expect(loginPage.errorMessage).toBeVisible();
    await expect(loginPage.errorMessage).toContainText(
      AuthMessages.INVALID_CREDENTIALS,
    );

    logger.info(
      `TC-12 validado: tras ${maxAttempts} intentos fallidos con el usuario [${user}], el sistema bloqueó el acceso mostrando el mensaje [${AuthMessages.INVALID_CREDENTIALS}].`,
    );
  });

  test("TC-13: Seguridad - No debe permitir login cuando el usuario está bloqueado por política de seguridad", async ({
    loginPage,
  }) => {
    const { user, pass } = settings.credentials;

    await loginPage.goto(settings.paystudioUrl);

    await loginPage.login(user, pass);

    await expect(loginPage.errorMessage).toBeVisible();
    await expect(loginPage.errorMessage).toContainText(
      AuthMessages.INVALID_CREDENTIALS,
    );

    const blockedUser = await UserProvider.getUserByUsername(user);

    expect(blockedUser.userStatus).toBe(2);

    logger.info(
      `TC-13 validado: el usuario [${user}] permanece bloqueado por política de seguridad (ACCOUNT_BLOCK_MINUTES = 999999 ≈ bloqueo indefinido), requiriendo desbloqueo manual; el acceso fue rechazado correctamente.`,
    );
  });

  test.skip("TC-14: Seguridad - Debe impedir el acceso a un usuario bloqueado por inactividad", async ({
    loginPage,
  }) => {
    const { user, pass } = settings.credentials;

    await loginPage.goto(settings.paystudioUrl);
    await loginPage.login(user, pass);

    await expect(loginPage.errorMessage).toBeVisible();
    await expect(loginPage.errorMessage).toContainText(
      AuthMessages.INVALID_CREDENTIALS,
    );

    logger.info(
      `TC-14 validado: el usuario [${user}] no pudo iniciar sesión debido a bloqueo por inactividad; el sistema rechazó el acceso mostrando [${AuthMessages.INVALID_CREDENTIALS}].`,
    );
  });

  test.skip("TC-15: Seguridad - Debe exigir cambio de contraseña en el primer ingreso", async () => {});

  test.skip("TC-16: Seguridad - Debe exigir cambio de contraseña cuando la contraseña ha expirado", async () => {});
});
``;

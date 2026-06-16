import { settings } from "@config/settings";
import { AuthMessages } from "@paystudio/test-data/auth/auth.constants";
import { expect, test } from "@paystudio/fixtures";
import { logger } from "@utils/logger";
import { authData } from "@paystudio/test-data/auth/auth.data";
import { SecurityPolicyProvider } from "@paystudio/test-data/security/security-policy.provider";

test.describe("Cambio de Contraseña - PayStudio", () => {
  test("TC-01: Smoke - Debe cargar la página de cambio de contraseña", async ({
    page,
    loginPage,
    navbar,
    changePasswordPage,
  }) => {
    const { user, pass } = settings.credentials;

    await loginPage.goto(settings.paystudioUrl);
    await loginPage.login(user, pass);

    await expect(page).toHaveURL(/MainPage/);

    await navbar.goToChangePassword();

    await expect(page).toHaveURL(/SelfData/);

    await expect(changePasswordPage.title).toBeVisible();
    await expect(changePasswordPage.title).toContainText(
      AuthMessages.CHANGE_PASSWORD_TITLE,
    );

    await expect(changePasswordPage.loginNameValue).toBeVisible();
    await expect(changePasswordPage.loginNameValue).toContainText(
      new RegExp(user, "i"),
    );

    logger.info(
      `TC-01 validado: la página de cambio de contraseña cargó correctamente, la URL contiene [SelfData], el título [${AuthMessages.CHANGE_PASSWORD_TITLE}] es visible y el nombre de login corresponde al usuario autenticado [${user}].`,
    );
  });

  test("TC-02: Validación Formulario - Campos obligatorios vacíos", async ({
    page,
    loginPage,
    navbar,
    changePasswordPage,
  }) => {
    const { user, pass } = settings.credentials;

    await loginPage.goto(settings.paystudioUrl);
    await loginPage.login(user, pass);

    await expect(page).toHaveURL(/MainPage/);

    await navbar.goToChangePassword();

    await expect(page).toHaveURL(/SelfData/);

    await expect(changePasswordPage.title).toBeVisible();
    await expect(changePasswordPage.title).toContainText(
      AuthMessages.CHANGE_PASSWORD_TITLE,
    );

    await changePasswordPage.confirm();

    await expect(changePasswordPage.errorSummaryTitle).toBeVisible();
    await expect(changePasswordPage.errorSummaryTitle).toContainText(
      AuthMessages.CHANGE_PASSWORD_ERROR_SUMMARY_TITLE,
    );

    await expect(changePasswordPage.currentPasswordRequiredError).toBeVisible();
    await expect(changePasswordPage.currentPasswordRequiredError).toContainText(
      AuthMessages.CHANGE_PASSWORD_REQUIRED_FIELD,
    );

    logger.info(
      `TC-02 validado: al confirmar cambio de contraseña con campos vacíos, se mostró el resumen de error [${AuthMessages.CHANGE_PASSWORD_ERROR_SUMMARY_TITLE}] y los mensajes requeridos [${AuthMessages.CHANGE_PASSWORD_REQUIRED_FIELD}] para contraseña actual, nueva contraseña y repetir contraseña.`,
    );
  });

  test("TC-03: Validación Formulario - Falta contraseña actual", async ({
    page,
    loginPage,
    navbar,
    changePasswordPage,
  }) => {
    const { user, pass } = settings.credentials;

    await loginPage.goto(settings.paystudioUrl);
    await loginPage.login(user, pass);

    await expect(page).toHaveURL(/MainPage/);

    await navbar.goToChangePassword();

    await expect(page).toHaveURL(/SelfData/);

    await expect(changePasswordPage.title).toBeVisible();
    await expect(changePasswordPage.title).toContainText(
      AuthMessages.CHANGE_PASSWORD_TITLE,
    );

    await changePasswordPage.submitWithoutCurrentPassword(
      authData.invalidCredentials.wrongPassword,
      authData.invalidCredentials.wrongPassword,
    );

    await expect(changePasswordPage.errorSummaryTitle).toBeVisible();
    await expect(changePasswordPage.errorSummaryTitle).toContainText(
      AuthMessages.CHANGE_PASSWORD_ERROR_SUMMARY_TITLE,
    );

    await expect(changePasswordPage.currentPasswordRequiredError).toBeVisible();
    await expect(changePasswordPage.currentPasswordRequiredError).toContainText(
      AuthMessages.CHANGE_PASSWORD_REQUIRED_FIELD,
    );

    await expect(changePasswordPage.newPasswordRequiredError).toBeVisible();
    await expect(changePasswordPage.repeatPasswordRequiredError).toBeVisible();

    logger.info(
      `TC-03 validado: al omitir la contraseña actual y diligenciar nueva contraseña/repetición, se mostró el resumen [${AuthMessages.CHANGE_PASSWORD_ERROR_SUMMARY_TITLE}] y la validación requerida [${AuthMessages.CHANGE_PASSWORD_REQUIRED_FIELD}] únicamente para la contraseña actual.`,
    );
  });

  test("TC-04: Validación Formulario - Falta nueva contraseña", async ({
    page,
    loginPage,
    navbar,
    changePasswordPage,
  }) => {
    const { user, pass } = settings.credentials;

    await loginPage.goto(settings.paystudioUrl);
    await loginPage.login(user, pass);

    await expect(page).toHaveURL(/MainPage/);

    await navbar.goToChangePassword();

    await changePasswordPage.submitWithoutNewPassword(pass, pass);

    await expect(changePasswordPage.errorSummaryMessages).toContainText(
      AuthMessages.CHANGE_PASSWORD_INVALID_FORMAT,
    );

    logger.info(
      `TC-04 validado: al omitir nueva contraseña, se mostró [${AuthMessages.CHANGE_PASSWORD_REQUIRED_FIELD}] y el error [${AuthMessages.CHANGE_PASSWORD_PASSWORDS_DO_NOT_MATCH}].`,
    );
  });

  test("TC-05: Validación Formulario - Falta repetir contraseña", async ({
    page,
    loginPage,
    navbar,
    changePasswordPage,
  }) => {
    const { user, pass } = settings.credentials;

    await loginPage.goto(settings.paystudioUrl);
    await loginPage.login(user, pass);

    await expect(page).toHaveURL(/MainPage/);

    await navbar.goToChangePassword();

    await changePasswordPage.submitWithoutRepeatPassword(
      pass,
      authData.invalidCredentials.wrongPassword,
    );

    await expect(changePasswordPage.errorSummaryMessages).toContainText(
      AuthMessages.CHANGE_PASSWORD_INVALID_FORMAT,
    );

    logger.info(
      `TC-05 validado: al omitir repetir contraseña, se mostró [${AuthMessages.CHANGE_PASSWORD_REQUIRED_FIELD}] y el error [${AuthMessages.CHANGE_PASSWORD_PASSWORDS_DO_NOT_MATCH}].`,
    );
  });

  test("TC-06: Validación Formulario - Nueva contraseña con formato inválido", async ({
    page,
    loginPage,
    navbar,
    changePasswordPage,
  }) => {
    const { user, pass } = settings.credentials;

    await loginPage.goto(settings.paystudioUrl);
    await loginPage.login(user, pass);

    await expect(page).toHaveURL(/MainPage/);

    await navbar.goToChangePassword();

    await changePasswordPage.fillPasswords(
      pass,
      authData.invalidCredentials.invalidFormatPassword,
      authData.invalidCredentials.invalidFormatPassword,
    );

    await expect(changePasswordPage.errorSummaryMessages).toContainText(
      AuthMessages.CHANGE_PASSWORD_INVALID_FORMAT,
    );

    logger.info(
      `TC-06 validado: al ingresar una nueva contraseña con formato inválido [${authData.invalidCredentials.invalidFormatPassword}], se mostró el error [${AuthMessages.CHANGE_PASSWORD_INVALID_FORMAT}].`,
    );
  });

  test("TC-07: Navegación - Debe redirigir a la página principal al hacer clic en cancelar", async ({
    page,
    loginPage,
    navbar,
    changePasswordPage,
  }) => {
    const { user, pass } = settings.credentials;

    await loginPage.goto(settings.paystudioUrl);
    await loginPage.login(user, pass);

    await navbar.goToChangePassword();

    await changePasswordPage.cancel();

    await expect(page).toHaveURL(/MainPage/);

    logger.info(
      `TC-07 validado: al hacer clic en cancelar desde la página de cambio de contraseña, se redirigió correctamente a la página principal, la URL contiene [MainPage].`,
    );
  });

  test("TC-08: Validación Formulario - Nueva contraseña menor al largo mínimo permitido", async ({
    page,
    loginPage,
    navbar,
    changePasswordPage,
  }) => {
    const { user, pass } = settings.credentials;
    const securityPolicy = await SecurityPolicyProvider.getSecurityPolicy();

    logger.info(
      `TC-08 ejecución: política actual MIN_PASSWORD=[${securityPolicy.minPassword}] y valor de prueba utilizado=[${authData.invalidCredentials.shortPassword.length}] caracteres.`,
    );

    await loginPage.goto(settings.paystudioUrl);
    await loginPage.login(user, pass);

    await navbar.goToChangePassword();

    await changePasswordPage.fillPasswords(
      pass,
      authData.invalidCredentials.shortPassword,
      authData.invalidCredentials.shortPassword,
    );

    await changePasswordPage.confirm();

    await expect(changePasswordPage.errorSummaryMessages).toContainText(
      AuthMessages.CHANGE_PASSWORD_LEN,
    );

    logger.info(
      `TC-08 validado: al ingresar una nueva contraseña menor al largo mínimo permitido [${authData.invalidCredentials.shortPassword}], se mostró el error [${AuthMessages.CHANGE_PASSWORD_LEN}].`,
    );
  });

  test("TC-09: Validación Formulario - Nueva contraseña mayor al largo máximo permitido", async ({
    page,
    loginPage,
    navbar,
    changePasswordPage,
  }) => {
    const { user, pass } = settings.credentials;
    const securityPolicy = await SecurityPolicyProvider.getSecurityPolicy();

    logger.info(
      `TC-09 ejecución: política actual MAX_PASSWORD=[${securityPolicy.maxPassword}] y valor de prueba utilizado=[${authData.invalidCredentials.longPassword.length}] caracteres.`,
    );

    await loginPage.goto(settings.paystudioUrl);
    await loginPage.login(user, pass);

    await navbar.goToChangePassword();

    await changePasswordPage.fillPasswords(
      pass,
      authData.invalidCredentials.longPassword,
      authData.invalidCredentials.longPassword,
    );

    await changePasswordPage.confirm();

    await expect(changePasswordPage.errorSummaryMessages).toContainText(
      AuthMessages.CHANGE_PASSWORD_LEN,
    );

    logger.info(
      `TC-09 validado: al ingresar una nueva contraseña mayor al largo máximo permitido [${authData.invalidCredentials.longPassword}], se mostró el error [${AuthMessages.CHANGE_PASSWORD_LEN}].`,
    );
  });

  test.skip("TC-10: Validación Formulario - No debe permitir reutilizar una contraseña anterior", async () => {});

  test.skip("TC-11: Flujo exitoso - Debe cambiar la contraseña correctamente con datos válidos", async () => {});

  test("TC-12: Validación Formulario - No debe permitir cambiar la contraseña antes del tiempo mínimo configurado", async ({
    page,
    loginPage,
    navbar,
    changePasswordPage,
  }) => {
    const { user, pass } = settings.credentials;
    const securityPolicy = await SecurityPolicyProvider.getSecurityPolicy();

    await loginPage.goto(settings.paystudioUrl);
    await loginPage.login(user, pass);

    await navbar.goToChangePassword();

    await changePasswordPage.fillPasswords(
      pass,
      authData.validCredentials.validNewPassword,
      authData.validCredentials.validNewPassword,
    );

    await changePasswordPage.confirm();

    await expect(changePasswordPage.errorSummaryMessages).toContainText(
      AuthMessages.CHANGE_PASSWORD_MIN_DAYS_RESTRICTION,
    );

    logger.info(
      `TC-12 validado: al intentar cambiar la contraseña antes del tiempo mínimo configurado, usando una contraseña actual válida y una nueva contraseña válida, se mostró el resumen [${AuthMessages.CHANGE_PASSWORD_ERROR_SUMMARY_TITLE}] y el error [${AuthMessages.CHANGE_PASSWORD_MIN_DAYS_RESTRICTION}]. TC-12 ejecución: política actual PASSWORD_CHANGE_DAYS=[${securityPolicy.passwordChangeDays}].`,
    );
  });

  test.skip("TC-13: Validación Formulario - Debe exigir cambio de contraseña cuando ha expirado", async () => {});

  test("TC-14: Validación Formulario - Debe mostrar error al ingresar contraseña actual incorrecta", async ({
    page,
    loginPage,
    navbar,
    changePasswordPage,
  }) => {
    const { user, pass } = settings.credentials;

    await loginPage.goto(settings.paystudioUrl);
    await loginPage.login(user, pass);

    await navbar.goToChangePassword();

    await changePasswordPage.fillPasswords(
      authData.invalidCredentials.wrongPassword,
      authData.validCredentials.validNewPassword,
      authData.validCredentials.validNewPassword,
    );

    await changePasswordPage.confirm();

    await expect(changePasswordPage.errorSummaryMessages).toContainText(
      AuthMessages.CHANGE_PASSWORD_INVALID_CURRENT_PASSWORD,
    );

    logger.info(
      `TC-14 validado: al ingresar una contraseña actual incorrecta [${authData.invalidCredentials.wrongPassword}] y una nueva contraseña válida, se mostró el error [${AuthMessages.CHANGE_PASSWORD_INVALID_CURRENT_PASSWORD}].`,
    );
  });
});

import { settings } from "@config/settings";
import { AuthMessages } from "@paystudio/test-data/auth/auth.constants";
import { expect, test } from "@paystudio/fixtures";
import { logger } from "@utils/logger";
import { authData } from "@paystudio/test-data/auth/auth.data";
import { SecurityPolicyProvider } from "@paystudio/test-data/security/security-policy.provider";
import { PayStudioUrlPatterns } from "@paystudio/test-data/navigation/paystudio-url.constants";

const changePasswordLogger = logger.child({ module: "ChangePasswordSpec" });

/**
 * Suite de Cambio de Contraseña
 */
test.describe("Cambio de Contraseña - PayStudio", () => {
  test.beforeEach(async ({ page, navbar }) => {
    await page.goto(settings.paystudioUrl);
    await navbar.waitForReady();

    await navbar.goToChangePassword();

    await expect(page).toHaveURL(PayStudioUrlPatterns.SelfData);
  });

  test("TC-01: Smoke - Debe cargar la página de cambio de contraseña", async ({
    changePasswordPage,
  }) => {
    const { user } = settings.credentials;

    await expect(changePasswordPage.title).toBeVisible();
    await expect(changePasswordPage.title).toContainText(
      AuthMessages.CHANGE_PASSWORD_TITLE,
    );

    await expect(changePasswordPage.loginNameValue).toBeVisible();
    await expect(changePasswordPage.loginNameValue).toContainText(
      new RegExp(user, "i"),
    );

    changePasswordLogger.info(
      `TC-01 validado: la página de cambio de contraseña cargó correctamente, la URL contiene [SelfData], el título [${AuthMessages.CHANGE_PASSWORD_TITLE}] es visible y el nombre de login corresponde al usuario autenticado [${user}].`,
    );
  });

  test("TC-02: Validación Formulario - Campos obligatorios vacíos", async ({
    changePasswordPage,
  }) => {
    await changePasswordPage.confirm();

    await expect(changePasswordPage.currentPasswordRequiredError).toBeVisible();
    await expect(changePasswordPage.currentPasswordRequiredError).toContainText(
      AuthMessages.CHANGE_PASSWORD_REQUIRED_FIELD,
    );

    changePasswordLogger.info(
      `TC-02 validado: al confirmar cambio de contraseña con campos vacíos, se mostró el resumen de alert [${AuthMessages.CHANGE_PASSWORD_ERROR_SUMMARY_TITLE}] y los mensajes requeridos [${AuthMessages.CHANGE_PASSWORD_REQUIRED_FIELD}] para contraseña actual, nueva contraseña y repetir contraseña.`,
    );
  });

  test("TC-03: Validación Formulario - Falta contraseña actual", async ({
    changePasswordPage,
  }) => {
    await changePasswordPage.submitWithoutCurrentPassword(
      authData.invalidCredentials.wrongPassword,
      authData.invalidCredentials.wrongPassword,
    );

    await expect(changePasswordPage.currentPasswordRequiredError).toBeVisible();
    await expect(changePasswordPage.currentPasswordRequiredError).toContainText(
      AuthMessages.CHANGE_PASSWORD_REQUIRED_FIELD,
    );

    changePasswordLogger.info(
      `TC-03 validado: al omitir la contraseña actual y diligenciar nueva contraseña/repetición, se mostró el resumen [${AuthMessages.CHANGE_PASSWORD_ERROR_SUMMARY_TITLE}] y la validación requerida [${AuthMessages.CHANGE_PASSWORD_REQUIRED_FIELD}] únicamente para la contraseña actual.`,
    );
  });

  test("TC-04: Validación Formulario - Falta nueva contraseña", async ({
    changePasswordPage,
  }) => {
    const { pass } = settings.credentials;

    await changePasswordPage.submitWithoutNewPassword(pass, pass);

    await expect(changePasswordPage.newPasswordRequiredError).toBeVisible();
    await expect(changePasswordPage.newPasswordRequiredError).toContainText(
      AuthMessages.CHANGE_PASSWORD_REQUIRED_FIELD,
    );

    changePasswordLogger.info(
      `TC-04 validado: al omitir nueva contraseña, se mostró la validación requerida [${AuthMessages.CHANGE_PASSWORD_REQUIRED_FIELD}] para el campo nueva contraseña.`,
    );
  });

  test("TC-05: Validación Formulario - Falta repetir contraseña", async ({
    changePasswordPage,
  }) => {
    const { pass } = settings.credentials;

    await changePasswordPage.submitWithoutRepeatPassword(
      pass,
      authData.invalidCredentials.wrongPassword,
    );

    await expect(changePasswordPage.repeatPasswordRequiredError).toBeVisible();
    await expect(changePasswordPage.repeatPasswordRequiredError).toContainText(
      AuthMessages.CHANGE_PASSWORD_REQUIRED_FIELD,
    );

    changePasswordLogger.info(
      `TC-05 validado: al omitir repetir contraseña, se mostró la validación requerida [${AuthMessages.CHANGE_PASSWORD_REQUIRED_FIELD}] para el campo repetir contraseña.`,
    );
  });

  test("TC-06: Validación Formulario - Nueva contraseña con formato inválido", async ({
    changePasswordPage,
  }) => {
    const { pass } = settings.credentials;

    await changePasswordPage.fillPasswords(
      pass,
      authData.invalidCredentials.invalidFormatPassword,
      authData.invalidCredentials.invalidFormatPassword,
    );

    await expect(changePasswordPage.alertSummaryTitle).toBeVisible();
    await expect(changePasswordPage.alertSummaryTitle).toContainText(
      AuthMessages.CHANGE_PASSWORD_ERROR_SUMMARY_TITLE,
    );

    await expect(changePasswordPage.alertSummaryMessages).toBeVisible();
    await expect(changePasswordPage.alertSummaryMessages).toContainText(
      AuthMessages.CHANGE_PASSWORD_INVALID_FORMAT,
    );

    changePasswordLogger.info(
      `TC-06 validado: al ingresar una nueva contraseña con formato inválido [${authData.invalidCredentials.invalidFormatPassword}], se mostró el alert [${AuthMessages.CHANGE_PASSWORD_INVALID_FORMAT}].`,
    );
  });

  test("TC-07: Navegación - Debe redirigir a la página principal al hacer clic en cancelar", async ({
    page,
    changePasswordPage,
  }) => {
    await changePasswordPage.cancel();

    await expect(page).toHaveURL(PayStudioUrlPatterns.MainPage);

    changePasswordLogger.info(
      "TC-07 validado: al hacer clic en cancelar desde la página de cambio de contraseña, se redirigió correctamente a la página principal, la URL contiene [MainPage].",
    );
  });

  test("TC-08: Validación Formulario - Nueva contraseña menor al largo mínimo permitido", async ({
    changePasswordPage,
  }) => {
    const { pass } = settings.credentials;
    const securityPolicy = await SecurityPolicyProvider.getSecurityPolicy();

    changePasswordLogger.info(
      `TC-08 ejecución: política actual MIN_PASSWORD=[${securityPolicy.minPassword}] y valor de prueba utilizado=[${authData.invalidCredentials.shortPassword.length}] caracteres.`,
    );

    await changePasswordPage.fillPasswords(
      pass,
      authData.invalidCredentials.shortPassword,
      authData.invalidCredentials.shortPassword,
    );

    await expect(changePasswordPage.alertSummaryTitle).toBeVisible();
    await expect(changePasswordPage.alertSummaryTitle).toContainText(
      AuthMessages.CHANGE_PASSWORD_ERROR_SUMMARY_TITLE,
    );

    await expect(changePasswordPage.alertSummaryMessages).toBeVisible();
    await expect(changePasswordPage.alertSummaryMessages).toContainText(
      AuthMessages.CHANGE_PASSWORD_LEN,
    );

    changePasswordLogger.info(
      `TC-08 validado: al ingresar una nueva contraseña menor al largo mínimo permitido [${authData.invalidCredentials.shortPassword}], se mostró el alert [${AuthMessages.CHANGE_PASSWORD_LEN}].`,
    );
  });

  test("TC-09: Validación Formulario - Nueva contraseña mayor al largo máximo permitido", async ({
    changePasswordPage,
  }) => {
    const { pass } = settings.credentials;
    const securityPolicy = await SecurityPolicyProvider.getSecurityPolicy();

    changePasswordLogger.info(
      `TC-09 ejecución: política actual MAX_PASSWORD=[${securityPolicy.maxPassword}] y valor de prueba utilizado=[${authData.invalidCredentials.longPassword.length}] caracteres.`,
    );

    await changePasswordPage.fillPasswords(
      pass,
      authData.invalidCredentials.longPassword,
      authData.invalidCredentials.longPassword,
    );

    await expect(changePasswordPage.alertSummaryTitle).toBeVisible();
    await expect(changePasswordPage.alertSummaryTitle).toContainText(
      AuthMessages.CHANGE_PASSWORD_ERROR_SUMMARY_TITLE,
    );

    await expect(changePasswordPage.alertSummaryMessages).toBeVisible();
    await expect(changePasswordPage.alertSummaryMessages).toContainText(
      AuthMessages.CHANGE_PASSWORD_LEN,
    );

    changePasswordLogger.info(
      `TC-09 validado: al ingresar una nueva contraseña mayor al largo máximo permitido [${authData.invalidCredentials.longPassword}], se mostró el alert [${AuthMessages.CHANGE_PASSWORD_LEN}].`,
    );
  });

  test.skip(
    "TC-10: Validación Formulario - No debe permitir reutilizar una contraseña anterior",
    {
      annotation: {
        type: "precondition",
        description:
          "En pruebas de cambio de contraseña, este escenario requiere que la nueva contraseña corresponda a una contraseña previamente utilizada por el usuario y configurada en el .env del ambiente.",
      },
    },
    async ({ changePasswordPage }) => {
      const { pass } = settings.credentials;
      const { reusedPreviousPassword } = settings.authTestData;
      const securityPolicy = await SecurityPolicyProvider.getSecurityPolicy();

      changePasswordLogger.info(
        `TC-10 ejecución: política PASSWORD_NOT_ALLOWED_CNT=[${securityPolicy.passwordsNotAllowedCnt}] activa para validar reutilización de contraseña.`,
      );

      await changePasswordPage.fillPasswords(
        pass,
        reusedPreviousPassword,
        reusedPreviousPassword,
      );

      await expect(changePasswordPage.alertSummaryTitle).toBeVisible();
      await expect(changePasswordPage.alertSummaryTitle).toContainText(
        AuthMessages.CHANGE_PASSWORD_ERROR_SUMMARY_TITLE,
      );

      await expect(changePasswordPage.alertSummaryMessages).toBeVisible();
      await expect(changePasswordPage.alertSummaryMessages).toContainText(
        AuthMessages.CHANGE_PASSWORD_REUSED_PASSWORD_HISTORY,
      );

      await expect(
        changePasswordPage.currentPasswordRequiredError,
      ).not.toBeVisible();
      await expect(
        changePasswordPage.newPasswordRequiredError,
      ).not.toBeVisible();
      await expect(
        changePasswordPage.repeatPasswordRequiredError,
      ).not.toBeVisible();

      changePasswordLogger.info(
        `TC-10 validado: al intentar reutilizar una contraseña anterior, se mostró el resumen [${AuthMessages.CHANGE_PASSWORD_ERROR_SUMMARY_TITLE}] y el alert [${AuthMessages.CHANGE_PASSWORD_REUSED_PASSWORD_HISTORY}].`,
      );
    },
  );

  test.skip(
    "TC-11: Flujo exitoso - Debe cambiar la contraseña correctamente con datos válidos",
    {
      annotation: {
        type: "precondition",
        description:
          "En pruebas de flujo exitoso, este escenario requiere contar con la contraseña actual válida del usuario y una nueva contraseña configurada en el .env del ambiente.",
      },
    },
    async ({ changePasswordPage }) => {
      const { pass } = settings.credentials;
      const { validNewPassword } = settings.authTestData;

      await changePasswordPage.fillPasswords(
        pass,
        validNewPassword,
        validNewPassword,
      );

      await expect(changePasswordPage.alertSummaryTitle).toBeVisible();
      await expect(changePasswordPage.alertSummaryTitle).toContainText(
        AuthMessages.CHANGE_PASSWORD_SUCCESS_SUMMARY_TITLE,
      );

      await expect(changePasswordPage.alertSummaryMessages).toBeVisible();
      await expect(changePasswordPage.alertSummaryMessages).toContainText(
        AuthMessages.CHANGE_PASSWORD_SUCCESS_MESSAGE,
      );

      changePasswordLogger.info(
        `TC-11 validado: al cambiar la contraseña usando una contraseña actual válida y una nueva contraseña válida, se mostró el resumen [${AuthMessages.CHANGE_PASSWORD_SUCCESS_SUMMARY_TITLE}] y el alert [${AuthMessages.CHANGE_PASSWORD_SUCCESS_MESSAGE}].`,
      );
    },
  );

  test.skip(
    "TC-12: Validación Formulario - No debe permitir cambiar la contraseña antes del tiempo mínimo configurado",
    {
      annotation: {
        type: "precondition",
        description:
          "En pruebas de restricción por tiempo mínimo, este escenario requiere que el usuario haya cambiado su contraseña previamente e intente cambiarla nuevamente el mismo día con la nueva contraseña configurada en el .env del ambiente.",
      },
    },
    async ({ changePasswordPage }) => {
      const { pass } = settings.credentials;
      const { validNewPassword } = settings.authTestData;
      const securityPolicy = await SecurityPolicyProvider.getSecurityPolicy();

      changePasswordLogger.info(
        `TC-12 ejecución: política actual PASSWORD_CHANGE_DAYS=[${securityPolicy.passwordChangeDays}].`,
      );

      await changePasswordPage.fillPasswords(
        pass,
        validNewPassword,
        validNewPassword,
      );

      await expect(changePasswordPage.alertSummaryTitle).toBeVisible();
      await expect(changePasswordPage.alertSummaryTitle).toContainText(
        AuthMessages.CHANGE_PASSWORD_ERROR_SUMMARY_TITLE,
      );

      await expect(changePasswordPage.alertSummaryMessages).toBeVisible();
      await expect(changePasswordPage.alertSummaryMessages).toContainText(
        AuthMessages.CHANGE_PASSWORD_MIN_DAYS_RESTRICTION,
      );

      changePasswordLogger.info(
        `TC-12 validado: al intentar cambiar la contraseña antes del tiempo mínimo configurado, usando una contraseña actual válida y una nueva contraseña válida, se mostró el resumen [${AuthMessages.CHANGE_PASSWORD_ERROR_SUMMARY_TITLE}] y el alert [${AuthMessages.CHANGE_PASSWORD_MIN_DAYS_RESTRICTION}].`,
      );
    },
  );

  test("TC-13: Validación Formulario - Debe mostrar alert al ingresar contraseña actual incorrecta", async ({
    changePasswordPage,
  }) => {
    const { validNewPassword } = settings.authTestData;

    await changePasswordPage.fillPasswords(
      authData.invalidCredentials.wrongPassword,
      validNewPassword,
      validNewPassword,
    );

    await expect(changePasswordPage.alertSummaryTitle).toBeVisible();
    await expect(changePasswordPage.alertSummaryTitle).toContainText(
      AuthMessages.CHANGE_PASSWORD_ERROR_SUMMARY_TITLE,
    );

    await expect(changePasswordPage.alertSummaryMessages).toBeVisible();
    await expect(changePasswordPage.alertSummaryMessages).toContainText(
      AuthMessages.CHANGE_PASSWORD_INVALID_CURRENT_PASSWORD,
    );

    changePasswordLogger.info(
      `TC-13 validado: al ingresar una contraseña actual incorrecta [${authData.invalidCredentials.wrongPassword}] y una nueva contraseña válida, se mostró el alert [${AuthMessages.CHANGE_PASSWORD_INVALID_CURRENT_PASSWORD}].`,
    );
  });
});

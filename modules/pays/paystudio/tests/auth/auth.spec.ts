import { settings } from "@config/settings";
import { authData } from "@paystudio/data/auth/auth.data";
import { AuthMessages } from "@paystudio/constants/auth/auth.messages";
import { securityPayloads } from "@paystudio/data/security/security.payloads";
import { test, expect } from "@paystudio/fixtures/auth.fixture";
import { logger } from "@utils/logger";
import { attachScreenshot } from "@utils/screenshot";

/**
 * Suite de pruebas del módulo de Autenticación de PayStudio.
 *
 * Contexto funcional:
 * Esta suite valida el comportamiento del portal en escenarios
 * asociados al acceso de usuarios, validaciones del formulario,
 * controles básicos de seguridad y cierre de sesión.
 *
 * Cobertura principal:
 * - carga inicial del portal de login
 * - autenticación exitosa
 * - autenticación fallida
 * - validaciones de campos requeridos
 * - controles básicos ante payloads maliciosos
 * - cierre de sesión desde el Navbar
 *
 * Criterio de diseño:
 * La suite reutiliza fixtures autenticadas y Page Objects del framework
 * para mantener aislamiento, legibilidad y consistencia entre pruebas.
 */
test.describe(
  "Módulo de Autenticación - PayStudio",
  {
    tag: "@auth",
    annotation: [
      { type: "module", description: "Autenticación" },
      { type: "application", description: "PayStudio" },
    ],
  },
  () => {
    test.beforeEach(async ({}, testInfo) => {
      logger.info(`>>> INICIANDO TEST: ${testInfo.title} <<<`);
    });

    test.afterEach(async ({ page }, testInfo) => {
      if (testInfo.status !== testInfo.expectedStatus) {
        logger.error(`TEST FALLIDO: [${testInfo.title}]`);

        if (testInfo.error) {
          const cleanErrorMessage = testInfo.error.message
            ?.replace(/\x1B\[\d+m/g, "")
            .split("\n")[0];

          logger.error(`MOTIVO DEL FALLO: ${cleanErrorMessage}`);
        }
      }

      await attachScreenshot(page, testInfo);

      logger.info(`<<< FINALIZADO TEST: ${testInfo.title} >>>\n`);
    });

    test.describe(
      "Smoke",
      {
        tag: "@smoke",
        annotation: { type: "category", description: "Smoke" },
      },
      () => {
        test(
          "TC-01: Visualización - Debe cargar el portal de login correctamente",
          {
            tag: ["@login", "@ui"],
            annotation: [
              { type: "case", description: "TC-01" },
              {
                type: "objective",
                description:
                  "Validar la carga inicial del portal de autenticación",
              },
              {
                type: "coverage",
                description:
                  "Navegación al portal configurado, validación de URL esperada y ausencia de error visible al cargar",
              },
              { type: "component", description: "LoginPage" },
            ],
          },
          async ({ page, loginPage }) => {
            await loginPage.navigate(settings.paystudioUrl);

            await expect(page).toHaveURL(/LoginPage/);
            expect(await loginPage.isErrorVisible()).toBe(false);

            logger.info("Verificación de carga inicial exitosa.");
          },
        );

        test(
          "TC-02: Login Exitoso - Debe permitir el ingreso con credenciales válidas",
          {
            tag: ["@login", "@positive"],
            annotation: [
              { type: "case", description: "TC-02" },
              {
                type: "objective",
                description:
                  "Confirmar que un usuario válido puede autenticarse y acceder al sistema",
              },
              {
                type: "coverage",
                description:
                  "Navegación al login, uso de credenciales configuradas del entorno, ejecución del flujo de autenticación y validación de redirección a MainPage",
              },
              { type: "component", description: "LoginPage" },
            ],
          },
          async ({ page, loginPage }) => {
            await loginPage.navigate(settings.paystudioUrl);

            const { user, pass } = settings.credentials;

            await loginPage.login(user, pass);

            await expect(page).toHaveURL(/MainPage/);

            logger.info(`Login exitoso con usuario: ${user}`);
          },
        );
      },
    );

    test.describe(
      "Functional",
      {
        tag: "@functional",
        annotation: { type: "category", description: "Functional" },
      },
      () => {
        test(
          "TC-03: Login Fallido - Debe mostrar error con contraseña inválida",
          {
            tag: ["@login", "@negative"],
            annotation: [
              { type: "case", description: "TC-03" },
              {
                type: "objective",
                description:
                  "Confirmar que el login falla cuando el usuario existe pero la contraseña es incorrecta",
              },
              {
                type: "coverage",
                description:
                  "Autenticación con password inválido, validación de mensaje general de error y verificación de visibilidad del error funcional",
              },
              { type: "component", description: "LoginPage" },
            ],
          },
          async ({ loginPage }) => {
            await loginPage.navigate(settings.paystudioUrl);

            await loginPage.login(
              settings.credentials.user,
              authData.invalidCredentials.wrongPassword,
            );

            const message = await loginPage.getErrorMessage();

            expect(await loginPage.isErrorVisible()).toBe(true);
            expect(message).toContain(AuthMessages.INVALID_CREDENTIALS);

            logger.info("Validación de contraseña inválida confirmada.");
          },
        );

        test(
          "TC-04: Login Fallido - Debe mostrar error con usuario no encontrado",
          {
            tag: ["@login", "@negative"],
            annotation: [
              { type: "case", description: "TC-04" },
              {
                type: "objective",
                description:
                  "Confirmar que el sistema informa correctamente cuando el usuario no existe",
              },
              {
                type: "coverage",
                description:
                  "Autenticación con usuario inexistente, validación del mensaje funcional esperado y verificación de error visible en pantalla",
              },
              { type: "component", description: "LoginPage" },
            ],
          },
          async ({ loginPage }) => {
            await loginPage.navigate(settings.paystudioUrl);

            await loginPage.login(
              authData.invalidCredentials.nonExistingUser,
              settings.credentials.pass,
            );

            const message = await loginPage.getErrorMessage();

            expect(await loginPage.isErrorVisible()).toBe(true);
            expect(message).toContain(AuthMessages.USER_NOT_FOUND);

            logger.info("Validación de usuario no encontrado confirmada.");
          },
        );

        test(
          "TC-05: Validación - Debe activar mensajes de campos obligatorios (Vacíos)",
          {
            tag: ["@validation", "@negative"],
            annotation: [
              { type: "case", description: "TC-05" },
              {
                type: "objective",
                description:
                  "Confirmar que el formulario activa las validaciones requeridas cuando ambos campos se envían vacíos",
              },
              {
                type: "coverage",
                description:
                  "Envío del formulario con campos vacíos, validación de error requerido en usuario y validación de error requerido en contraseña",
              },
              { type: "component", description: "LoginPage" },
            ],
          },
          async ({ loginPage }) => {
            await loginPage.navigate(settings.paystudioUrl);

            await loginPage.login(
              authData.emptyFields.user,
              authData.emptyFields.pass,
            );

            expect(await loginPage.isUsernameErrorVisible()).toBe(true);
            expect(await loginPage.isPasswordErrorVisible()).toBe(true);

            logger.info("Validación de campos obligatorios confirmada.");
          },
        );

        test(
          "TC-06: Validación - Debe activar requerimiento solo en campo Usuario",
          {
            tag: ["@validation", "@negative"],
            annotation: [
              { type: "case", description: "TC-06" },
              {
                type: "objective",
                description:
                  "Confirmar que el formulario solo activa el requerimiento en usuario cuando la contraseña sí fue informada",
              },
              {
                type: "coverage",
                description:
                  "Usuario vacío, contraseña válida y validación de error requerido solo en usuario",
              },
              { type: "component", description: "LoginPage" },
            ],
          },
          async ({ loginPage }) => {
            await loginPage.navigate(settings.paystudioUrl);

            await loginPage.login(
              authData.emptyFields.user,
              settings.credentials.pass,
            );

            expect(await loginPage.isUsernameErrorVisible()).toBe(true);
            expect(await loginPage.isPasswordErrorVisible()).toBe(false);

            logger.info("Validación de usuario vacio confirmada.");
          },
        );

        test(
          "TC-07: Validación - Debe activar requerimiento solo en campo Contraseña",
          {
            tag: ["@validation", "@negative"],
            annotation: [
              { type: "case", description: "TC-07" },
              {
                type: "objective",
                description:
                  "Confirmar que el formulario solo activa el requerimiento en contraseña cuando el usuario sí fue informado",
              },
              {
                type: "coverage",
                description:
                  "Usuario válido, contraseña vacía y validación de error requerido solo en contraseña",
              },
              { type: "component", description: "LoginPage" },
            ],
          },
          async ({ loginPage }) => {
            await loginPage.navigate(settings.paystudioUrl);

            await loginPage.login(
              settings.credentials.user,
              authData.emptyFields.pass,
            );

            expect(await loginPage.isUsernameErrorVisible()).toBe(false);
            expect(await loginPage.isPasswordErrorVisible()).toBe(true);

            logger.info("Validación de contraseña vacia confirmada.");
          },
        );
      },
    );

    test.describe(
      "Security",
      {
        tag: "@security",
        annotation: { type: "category", description: "Security" },
      },
      () => {
        test(
          "TC-08: Inyección - No debe permitir SQL Injection en campo usuario",
          {
            tag: ["@login", "@negative"],
            annotation: [
              { type: "case", description: "TC-08" },
              {
                type: "objective",
                description:
                  "Confirmar que entradas maliciosas no derivan en autenticación exitosa",
              },
              {
                type: "coverage",
                description:
                  "Envío de payload SQL Injection, permanencia en la pantalla de login y validación del mensaje funcional devuelto",
              },
              { type: "component", description: "LoginPage" },
            ],
          },
          async ({ page, loginPage }) => {
            await loginPage.navigate(settings.paystudioUrl);

            await loginPage.login(
              securityPayloads.sqlInjection.user,
              securityPayloads.sqlInjection.pass,
            );

            await expect(page).toHaveURL(/LoginPage/);

            const message = await loginPage.getErrorMessage();
            expect(message).toContain(AuthMessages.USER_NOT_FOUND);

            logger.info("Validación de SQL Injection confirmada.");
          },
        );

        test(
          "TC-09: XSS - No debe permitir scripts maliciosos en el formulario",
          {
            tag: ["@login", "@negative"],
            annotation: [
              { type: "case", description: "TC-09" },
              {
                type: "objective",
                description:
                  "Confirmar que el sistema no procesa contenido malicioso como autenticación válida",
              },
              {
                type: "coverage",
                description:
                  "Envío de payload XSS, permanencia en login y validación del mensaje funcional esperado",
              },
              { type: "component", description: "LoginPage" },
            ],
          },
          async ({ page, loginPage }) => {
            await loginPage.navigate(settings.paystudioUrl);

            await loginPage.login(
              securityPayloads.xssAttack.user,
              securityPayloads.xssAttack.pass,
            );

            await expect(page).toHaveURL(/LoginPage/);

            const message = await loginPage.getErrorMessage();
            expect(message).toContain(AuthMessages.USER_NOT_FOUND);

            logger.info("Validación de XSS confirmada.");
          },
        );
      },
    );

    test.describe(
      "Logout",
      {
        tag: "@logout",
        annotation: { type: "category", description: "Logout" },
      },
      () => {
        test(
          "TC-10: Logout - Debe cerrar sesión correctamente desde el navbar",
          {
            tag: ["@smoke", "@session"],
            annotation: [
              { type: "case", description: "TC-10" },
              {
                type: "objective",
                description:
                  "Confirmar que un usuario autenticado puede cerrar sesión correctamente",
              },
              {
                type: "coverage",
                description:
                  "Autenticación válida, apertura del flujo de logout desde Navbar, confirmación del cierre de sesión y validación de retorno a LoginPage",
              },
              { type: "component", description: "Navbar / LogoutPage" },
            ],
          },
          async ({ page, loginPage, logoutPage, navbar }) => {
            await loginPage.navigate(settings.paystudioUrl);

            await loginPage.login(
              settings.credentials.user,
              settings.credentials.pass,
            );
            await expect(page).toHaveURL(/MainPage/);

            await navbar.logout();
            await logoutPage.confirmLogout();

            await expect(page).toHaveURL(/LoginPage/);

            logger.info("Flujo de logout validado correctamente.");
          },
        );
      },
    );
  },
);

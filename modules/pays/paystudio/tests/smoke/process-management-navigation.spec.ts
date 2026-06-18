import { settings } from "@config/settings";
import { expect, test } from "@paystudio/fixtures";
import { SmokeNavigationHelper } from "@paystudio/helpers/smoke-navigation.helper";
import { ProcessManagementMenuRoutes } from "@paystudio/test-data/navbar/process-management-menu.routes";
import { logger } from "@utils/logger";

const processManagementSmokeLogger = logger.child({
  module: "ProcessManagementSmoke",
});

/**
 * Suite de navegación del módulo Gestor de Procesos
 */
test.describe("SMOKE: Navegación completa Gestor de Procesos", () => {
  test("SMOKE: Navegación completa Gestor de Procesos", async ({
    page,
    loginPage,
    navbar,
  }) => {
    await loginPage.goto(settings.paystudioUrl);
    await loginPage.login(settings.credentials.user, settings.credentials.pass);

    await expect(page).toHaveURL(/MainPage/);

    processManagementSmokeLogger.info(
      "Inicio navegación módulo Gestor de Procesos",
    );

    /**
     * Pantalla: Ejecuciones
     */
    await SmokeNavigationHelper.navigateByMenuPath(
      page,
      navbar,
      ProcessManagementMenuRoutes.main,
      [],
      ProcessManagementMenuRoutes.executions,
      /GridExecutions/,
    );

    /**
     * Pantalla: Agendado
     */
    await SmokeNavigationHelper.navigateByMenuPath(
      page,
      navbar,
      ProcessManagementMenuRoutes.main,
      [],
      ProcessManagementMenuRoutes.definitions,
      /GridDefinitions/,
    );

    processManagementSmokeLogger.info(
      "SMOKE completado: navegación Gestor de Procesos OK",
    );
  });
});

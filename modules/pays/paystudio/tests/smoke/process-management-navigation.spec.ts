import { settings } from "@config/settings";
import { expect, test } from "@paystudio/fixtures";
import {
  ProcessManagementMenuRoutes,
  ProcessManagementMenuUrlPatterns,
} from "@paystudio/test-data/navbar/process-management-menu.routes";
import { logger } from "@utils/logger";

const processManagementSmokeLogger = logger.child({
  module: "ProcessManagementSmoke",
});

const isGetnetCert =
  settings.project === "GETNET" && settings.environment === "CERT";

/**
 * Suite de SMOKE - Módulo Gestor de Procesos
 */
test.describe(
  "SMOKE - Gestor de Procesos | Navegación de pantallas",
  {
    annotation: {
      type: "note",
      description:
        "En pruebas de navegación del módulo Gestor de Procesos, esta suite no aplica para GETNET CERT ya que el módulo no está disponible en ese ambiente.",
    },
  },
  () => {
    test.skip(
      isGetnetCert,
      "La suite de Gestor de Procesos no aplica para GETNET CERT.",
    );

    test.beforeEach(async ({ page, navbar }) => {
      test.setTimeout(120000);

      await page.goto(settings.paystudioUrl);
      await navbar.waitForReady();

      processManagementSmokeLogger.info(
        "Inicio navegación módulo Gestor de Procesos",
      );
    });

    test("TC-01: Gestor de Procesos - Debe navegar a Ejecuciones", async ({
      page,
      navbar,
    }) => {
      await navbar.navigateByMenuPath(
        ProcessManagementMenuRoutes.main,
        [],
        ProcessManagementMenuRoutes.executions,
      );

      await expect(page).toHaveURL(ProcessManagementMenuUrlPatterns.executions);
    });

    test("TC-02: Gestor de Procesos - Debe navegar a Agendado", async ({
      page,
      navbar,
    }) => {
      await navbar.navigateByMenuPath(
        ProcessManagementMenuRoutes.main,
        [],
        ProcessManagementMenuRoutes.definitions,
      );

      await expect(page).toHaveURL(
        ProcessManagementMenuUrlPatterns.definitions,
      );
    });

    test.afterAll(async () => {
      processManagementSmokeLogger.info(
        "SMOKE completado: navegación Gestor de Procesos validada correctamente.",
      );
    });
  },
);

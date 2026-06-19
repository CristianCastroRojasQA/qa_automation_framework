import { settings } from "@config/settings";
import { expect, test } from "@paystudio/fixtures";
import {
  OperationMenuRoutes,
  OperationMenuUrlPatterns,
} from "@paystudio/test-data/navbar/operation-menu.routes";
import { logger } from "@utils/logger";

const operationSmokeLogger = logger.child({ module: "OperationSmoke" });

const isGetnetCert =
  settings.project === "GETNET" && settings.environment === "CERT";

/**
 * Suite de SMOKE - Módulo Operaciones
 */
test.describe("SMOKE - Operaciones | Navegación de pantallas", () => {
  test.beforeEach(async ({ page, navbar }) => {
    test.setTimeout(120000);

    await page.goto(settings.paystudioUrl);
    await navbar.waitForReady();

    operationSmokeLogger.info("Inicio navegación módulo Operaciones");
  });

  test("TC-01: Operaciones - Debe navegar a Consulta de Débitos Automáticos", async ({
    page,
    navbar,
  }) => {
    await navbar.navigateByMenuPath(
      OperationMenuRoutes.main,
      [],
      OperationMenuRoutes.automaticDebitSearch,
    );

    await expect(page).toHaveURL(OperationMenuUrlPatterns.automaticDebitSearch);
  });

  test("TC-02: Operaciones - Debe navegar a Mantenimiento de Fee Collection Adquirente", async ({
    page,
    navbar,
  }) => {
    await navbar.navigateByMenuPath(
      OperationMenuRoutes.main,
      [],
      OperationMenuRoutes.acquirerFeeCollection,
    );

    await expect(page).toHaveURL(
      OperationMenuUrlPatterns.acquirerFeeCollection,
    );
  });

  test("TC-03: Operaciones - Debe navegar a Mantenimiento de Pagos", async ({
    page,
    navbar,
  }) => {
    await navbar.navigateByMenuPath(
      OperationMenuRoutes.main,
      [],
      OperationMenuRoutes.paymentMaintenance,
    );

    await expect(page).toHaveURL(OperationMenuUrlPatterns.paymentMaintenance);
  });

  test("TC-04: Operaciones - Debe navegar a Devolución Manual", async ({
    page,
    navbar,
  }) => {
    await navbar.navigateByMenuPath(
      OperationMenuRoutes.main,
      [],
      OperationMenuRoutes.manualRefund,
    );

    await expect(page).toHaveURL(OperationMenuUrlPatterns.manualRefund);
  });

  test("TC-05: Operaciones - Debe navegar a Administración de Disputas Adquirente", async ({
    page,
    navbar,
  }) => {
    await navbar.navigateByMenuPath(
      OperationMenuRoutes.main,
      [],
      OperationMenuRoutes.acquirerDisputesManagement,
    );

    await expect(page).toHaveURL(
      OperationMenuUrlPatterns.acquirerDisputesManagement,
    );
  });

  test("TC-06: Operaciones - Debe navegar a Devolución de Débitos Automáticos", async ({
    page,
    navbar,
  }) => {
    await navbar.navigateByMenuPath(
      OperationMenuRoutes.main,
      [],
      OperationMenuRoutes.automaticDebitReturn,
    );

    await expect(page).toHaveURL(OperationMenuUrlPatterns.automaticDebitReturn);
  });

  test(
    "TC-07: Operaciones - Debe navegar a Cuadratura",
    {
      annotation: {
        type: "note",
        description:
          "En pruebas de navegación del módulo Operaciones, este escenario no aplica para GETNET CERT ya que la pantalla Cuadratura no está disponible en ese ambiente.",
      },
    },
    async ({ page, navbar }) => {
      test.skip(
        isGetnetCert,
        "TC-07 no aplica para GETNET CERT: Cuadratura no está disponible.",
      );

      await navbar.navigateByMenuPath(
        OperationMenuRoutes.main,
        [],
        OperationMenuRoutes.dailyQuadrature,
      );

      await expect(page).toHaveURL(OperationMenuUrlPatterns.dailyQuadrature);
    },
  );

  test.afterAll(async () => {
    operationSmokeLogger.info(
      "SMOKE completado: navegación Operaciones validada correctamente.",
    );
  });
});

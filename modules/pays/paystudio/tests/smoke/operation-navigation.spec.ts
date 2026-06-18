import { settings } from "@config/settings";
import { expect, test } from "@paystudio/fixtures";
import { SmokeNavigationHelper } from "@paystudio/helpers/smoke-navigation.helper";
import { OperationMenuRoutes } from "@paystudio/test-data/navbar/operation-menu.routes";
import { logger } from "@utils/logger";

const operationSmokeLogger = logger.child({ module: "OperationSmoke" });

/**
 * Suite de navegación del módulo Operaciones
 */
test.describe("SMOKE: Navegación completa Operaciones", () => {
  test("SMOKE: Navegación completa Operaciones", async ({
    page,
    loginPage,
    navbar,
  }) => {
    test.setTimeout(120000);

    await loginPage.goto(settings.paystudioUrl);
    await loginPage.login(settings.credentials.user, settings.credentials.pass);

    await expect(page).toHaveURL(/MainPage/);

    operationSmokeLogger.info("Inicio navegación módulo Operaciones");

    /**
     * Pantalla: Consulta Débitos Automáticos
     */
    await SmokeNavigationHelper.navigateByMenuPath(
      page,
      navbar,
      OperationMenuRoutes.main,
      [],
      OperationMenuRoutes.automaticDebitSearch,
      /ACMUC033_GetAutomaticDebit/,
    );

    /**
     * Pantalla: Mantenimiento Fee Collection Adquirente
     */
    await SmokeNavigationHelper.navigateByMenuPath(
      page,
      navbar,
      OperationMenuRoutes.main,
      [],
      OperationMenuRoutes.acquirerFeeCollection,
      /ATXUC029_FeeCollectionMaintenance/,
    );

    /**
     * Pantalla: Mantenimiento Pagos
     */
    await SmokeNavigationHelper.navigateByMenuPath(
      page,
      navbar,
      OperationMenuRoutes.main,
      [],
      OperationMenuRoutes.paymentMaintenance,
      /ACMUC013_Payment_Maint/,
    );

    /**
     * Pantalla: Devolución Manual
     */
    await SmokeNavigationHelper.navigateByMenuPath(
      page,
      navbar,
      OperationMenuRoutes.main,
      [],
      OperationMenuRoutes.manualRefund,
      /ATXUC014_DevolucionManual/,
    );

    /**
     * Pantalla: Administración Disputas Adquirente
     */
    await SmokeNavigationHelper.navigateByMenuPath(
      page,
      navbar,
      OperationMenuRoutes.main,
      [],
      OperationMenuRoutes.acquirerDisputesManagement,
      /GetControversy/,
    );

    /**
     * Pantalla: Devolución Débitos Automáticos
     */
    await SmokeNavigationHelper.navigateByMenuPath(
      page,
      navbar,
      OperationMenuRoutes.main,
      [],
      OperationMenuRoutes.automaticDebitReturn,
      /ACMUC036_AutomaticDebitReturn/,
    );

    /**
     * Pantalla: Cuadratura
     */
    await SmokeNavigationHelper.navigateByMenuPath(
      page,
      navbar,
      OperationMenuRoutes.main,
      [],
      OperationMenuRoutes.dailyQuadrature,
      /DailyQuadrature/,
    );

    operationSmokeLogger.info("SMOKE completado: navegación Operaciones OK");
  });
});
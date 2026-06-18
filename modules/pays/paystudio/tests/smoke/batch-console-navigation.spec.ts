import { settings } from "@config/settings";
import { expect, test } from "@paystudio/fixtures";
import { SmokeNavigationHelper } from "@paystudio/helpers/smoke-navigation.helper";
import { BatchConsolePage } from "@paystudio/pages/batches/BatchConsolePage";
import { BatchMenuRoutes } from "@paystudio/test-data/navbar/batch-menu.routes";
import { BatchProcessGroups } from "@paystudio/test-data/batches/batch-console.constants";
import { logger } from "@utils/logger";

const batchSmokeLogger = logger.child({ module: "BatchConsoleSmoke" });

/**
 * Suite de Consola Batch (Grupos de Procesos)
 */
test.describe("SMOKE: Navegación entre grupos de procesos en Consola Batch", () => {
  test("SMOKE: Navegación entre grupos de procesos en Consola Batch", async ({
    page,
    loginPage,
    navbar,
  }) => {
    test.setTimeout(120000);

    await loginPage.goto(settings.paystudioUrl);
    await loginPage.login(settings.credentials.user, settings.credentials.pass);

    await expect(page).toHaveURL(/MainPage/);

    batchSmokeLogger.info("Inicio navegación a Consola Batch");

    await SmokeNavigationHelper.navigateByMenuPath(
      page,
      navbar,
      BatchMenuRoutes.main,
      [],
      BatchMenuRoutes.batchConsole,
      /BatchConsole/,
    );

    const batchConsolePage = new BatchConsolePage(page);

    await expect(batchConsolePage.processGroupsTitle).toBeVisible();

    /**
     * Pantalla: Grupo Transacción Adquirente
     */
    await batchConsolePage.selectProcessGroup(
      BatchProcessGroups.acquirerTransaction,
    );

    await expect(batchConsolePage.selectedBatchGroupTitle).toContainText(
      BatchProcessGroups.acquirerTransaction,
    );

    /**
     * Pantalla: Grupo Comercial Adquirente
     */
    await batchConsolePage.selectProcessGroup(
      BatchProcessGroups.acquirerCommercial,
    );

    await expect(batchConsolePage.selectedBatchGroupTitle).toContainText(
      BatchProcessGroups.acquirerCommercial,
    );

    /**
     * Pantalla: Grupo Adquirente
     */
    await batchConsolePage.selectProcessGroup(BatchProcessGroups.acquirer);

    await expect(batchConsolePage.selectedBatchGroupTitle).toContainText(
      BatchProcessGroups.acquirer,
    );

    /**
     * Pantalla: Grupo Comercio Adquirente
     */
    await batchConsolePage.selectProcessGroup(
      BatchProcessGroups.acquirerMerchant,
    );

    await expect(batchConsolePage.selectedBatchGroupTitle).toContainText(
      BatchProcessGroups.acquirerMerchant,
    );

    /**
     * Pantalla: Grupo Común
     */
    await batchConsolePage.selectProcessGroup(BatchProcessGroups.common);

    await expect(batchConsolePage.selectedBatchGroupTitle).toContainText(
      BatchProcessGroups.common,
    );

    /**
     * Pantalla: Grupo Reportes Adquirente
     */
    await batchConsolePage.selectProcessGroup(
      BatchProcessGroups.acquirerReports,
    );

    await expect(batchConsolePage.selectedBatchGroupTitle).toContainText(
      BatchProcessGroups.acquirerReports,
    );

    batchSmokeLogger.info(
      "SMOKE completado: navegación entre grupos de procesos en Consola Batch validada correctamente.",
    );
  });
});

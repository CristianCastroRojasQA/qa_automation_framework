import { settings } from "@config/settings";
import { expect, test } from "@paystudio/fixtures";
import { BatchConsolePage } from "@paystudio/pages/batches/BatchConsolePage";
import { BatchMenuRoutes, BatchMenuUrlPatterns } from "@paystudio/test-data/navbar/batch-menu.routes";
import { BatchProcessGroups } from "@paystudio/test-data/batches/batch-console.constants";
import { logger } from "@utils/logger";

const batchSmokeLogger = logger.child({ module: "BatchConsoleSmoke" });

/**
 * Suite de SMOKE - Consola Batch (Grupos de Procesos)
 */
test.describe("SMOKE - Consola Batch | Navegación entre grupos de procesos", () => {
  test.beforeEach(async ({ page, navbar }) => {
    test.setTimeout(120000);

    await page.goto(settings.paystudioUrl);
    await navbar.waitForReady();

    batchSmokeLogger.info("Inicio navegación a Consola Batch");

    await navbar.navigateByMenuPath(
      BatchMenuRoutes.main,
      [],
      BatchMenuRoutes.batchConsole,
    );

    await expect(page).toHaveURL(BatchMenuUrlPatterns.batchConsole);
  });

  test("TC-01: Consola Batch - Debe permitir seleccionar el grupo Transacción Adquirente", async ({
    page,
  }) => {
    const batchConsolePage = new BatchConsolePage(page);

    await expect(batchConsolePage.processGroupsTitle).toBeVisible();

    await batchConsolePage.selectProcessGroup(
      BatchProcessGroups.acquirerTransaction,
    );

    await expect(batchConsolePage.selectedBatchGroupTitle).toContainText(
      BatchProcessGroups.acquirerTransaction,
    );
  });

  test("TC-02: Consola Batch - Debe permitir seleccionar el grupo Comercial Adquirente", async ({
    page,
  }) => {
    const batchConsolePage = new BatchConsolePage(page);

    await expect(batchConsolePage.processGroupsTitle).toBeVisible();

    await batchConsolePage.selectProcessGroup(
      BatchProcessGroups.acquirerCommercial,
    );

    await expect(batchConsolePage.selectedBatchGroupTitle).toContainText(
      BatchProcessGroups.acquirerCommercial,
    );
  });

  test("TC-03: Consola Batch - Debe permitir seleccionar el grupo Adquirente", async ({
    page,
  }) => {
    const batchConsolePage = new BatchConsolePage(page);

    await expect(batchConsolePage.processGroupsTitle).toBeVisible();

    await batchConsolePage.selectProcessGroup(BatchProcessGroups.acquirer);

    await expect(batchConsolePage.selectedBatchGroupTitle).toContainText(
      BatchProcessGroups.acquirer,
    );
  });

  test("TC-04: Consola Batch - Debe permitir seleccionar el grupo Comercio Adquirente", async ({
    page,
  }) => {
    const batchConsolePage = new BatchConsolePage(page);

    await expect(batchConsolePage.processGroupsTitle).toBeVisible();

    await batchConsolePage.selectProcessGroup(
      BatchProcessGroups.acquirerMerchant,
    );

    await expect(batchConsolePage.selectedBatchGroupTitle).toContainText(
      BatchProcessGroups.acquirerMerchant,
    );
  });

  test("TC-05: Consola Batch - Debe permitir seleccionar el grupo Común", async ({
    page,
  }) => {
    const batchConsolePage = new BatchConsolePage(page);

    await expect(batchConsolePage.processGroupsTitle).toBeVisible();

    await batchConsolePage.selectProcessGroup(BatchProcessGroups.common);

    await expect(batchConsolePage.selectedBatchGroupTitle).toContainText(
      BatchProcessGroups.common,
    );
  });

  test("TC-06: Consola Batch - Debe permitir seleccionar el grupo Reportes Adquirente", async ({
    page,
  }) => {
    const batchConsolePage = new BatchConsolePage(page);

    await expect(batchConsolePage.processGroupsTitle).toBeVisible();

    await batchConsolePage.selectProcessGroup(
      BatchProcessGroups.acquirerReports,
    );

    await expect(batchConsolePage.selectedBatchGroupTitle).toContainText(
      BatchProcessGroups.acquirerReports,
    );
  });

  test.afterAll(async () => {
    batchSmokeLogger.info(
      "SMOKE completado: navegación entre grupos de procesos en Consola Batch validada correctamente.",
    );
  });
});

import { settings } from "@config/settings";
import { expect, test } from "@paystudio/fixtures";
import {
  MerchantMenuRoutes,
  MerchantMenuUrlPatterns,
} from "@paystudio/test-data/navbar/merchant-menu.routes";
import { logger } from "@utils/logger";

const merchantSmokeLogger = logger.child({ module: "MerchantSmoke" });

/**
 * Suite de SMOKE - Módulo Comercios
 */
test.describe("SMOKE - Comercios | Navegación de pantallas", () => {
  test.beforeEach(async ({ page, navbar }) => {
    test.setTimeout(120000);

    await page.goto(settings.paystudioUrl);
    await navbar.waitForReady();

    merchantSmokeLogger.info("Inicio navegación módulo Comercios");
  });

  test("TC-01: Comercios - Debe navegar a Consulta de Comercios y Sucursales", async ({
    page,
    navbar,
  }) => {
    await navbar.navigateByMenuPath(
      MerchantMenuRoutes.main,
      [],
      MerchantMenuRoutes.merchantSearch,
    );

    await expect(page).toHaveURL(MerchantMenuUrlPatterns.merchantSearch);
  });

  test("TC-02: Comercios - Debe navegar a Alta de Comercio", async ({
    page,
    navbar,
  }) => {
    await navbar.navigateByMenuPath(
      MerchantMenuRoutes.main,
      [],
      MerchantMenuRoutes.merchantAdd,
    );

    await expect(page).toHaveURL(MerchantMenuUrlPatterns.merchantAdd);
  });

  test("TC-03: Comercios - Debe navegar a Mantenimiento de Preafiliación de Comercio", async ({
    page,
    navbar,
  }) => {
    await navbar.navigateByMenuPath(
      MerchantMenuRoutes.main,
      [],
      MerchantMenuRoutes.merchantPreAffiliationMaintenance,
    );

    await expect(page).toHaveURL(
      MerchantMenuUrlPatterns.merchantPreAffiliationMaintenance,
    );
  });

  test("TC-04: Comercios - Debe navegar a Consulta de Transacciones", async ({
    page,
    navbar,
  }) => {
    await navbar.navigateByMenuPath(
      MerchantMenuRoutes.main,
      [],
      MerchantMenuRoutes.acquirerTransactionInfo,
    );

    await expect(page).toHaveURL(
      MerchantMenuUrlPatterns.acquirerTransactionInfo,
    );
  });

  test(
    "TC-05: Comercios - Debe navegar a Alta de Preafiliación de Comercio",
    {
      annotation: {
        type: "note",
        description:
          "En pruebas de navegación del módulo Comercios, este escenario se valida al final porque la pantalla Alta Preafiliación Comercio puede cambiar el contexto de navegación.",
      },
    },
    async ({ page, navbar }) => {
      await navbar.navigateByMenuPath(
        MerchantMenuRoutes.main,
        [],
        MerchantMenuRoutes.merchantPreAffiliationAdd,
      );

      await expect(page).toHaveURL(
        MerchantMenuUrlPatterns.merchantPreAffiliationAdd,
      );
    },
  );

  test.afterAll(async () => {
    merchantSmokeLogger.info(
      "SMOKE completado: navegación Comercios validada correctamente.",
    );
  });
});

import { settings } from "@config/settings";
import { expect, test } from "@paystudio/fixtures";
import { SmokeNavigationHelper } from "@paystudio/helpers/smoke-navigation.helper";
import { MerchantMenuRoutes } from "@paystudio/test-data/navbar/merchant-menu.routes";
import { logger } from "@utils/logger";

const merchantSmokeLogger = logger.child({ module: "MerchantSmoke" });

/**
 * Suite de navegación del módulo Comercios
 */
test.describe("SMOKE: Navegación completa Comercios", () => {
  test("SMOKE: Navegación completa Comercios", async ({
    page,
    loginPage,
    navbar,
  }) => {
    test.setTimeout(120000);

    await loginPage.goto(settings.paystudioUrl);
    await loginPage.login(settings.credentials.user, settings.credentials.pass);

    await expect(page).toHaveURL(/MainPage/);

    merchantSmokeLogger.info("Inicio navegación módulo Comercios");

    /**
     * Pantalla: Consulta de Comercios y Sucursales
     */
    await SmokeNavigationHelper.navigateByMenuPath(
      page,
      navbar,
      MerchantMenuRoutes.main,
      [],
      MerchantMenuRoutes.merchantSearch,
      /AMUC008_MerchantSearch/,
    );

    /**
     * Pantalla: Alta de Comercio
     */
    await SmokeNavigationHelper.navigateByMenuPath(
      page,
      navbar,
      MerchantMenuRoutes.main,
      [],
      MerchantMenuRoutes.merchantAdd,
      /AMUC002_MerchantAdd/,
    );

    /**
     * Pantalla: Mantenimiento Preafiliación Comercio
     */
    await SmokeNavigationHelper.navigateByMenuPath(
      page,
      navbar,
      MerchantMenuRoutes.main,
      [],
      MerchantMenuRoutes.merchantPreAffiliationMaintenance,
      /AMDUC002_MerchantDataEntrySearch/,
    );

    /**
     * Pantalla: Consulta de Transacciones
     */
    await SmokeNavigationHelper.navigateByMenuPath(
      page,
      navbar,
      MerchantMenuRoutes.main,
      [],
      MerchantMenuRoutes.acquirerTransactionInfo,
      /ATXUC012_AcquirerTransactionInfo/,
    );

    /**
     * Pantalla: Alta Preafiliación Comercio
     */
    test.info().annotations.push({
      type: "note",
      description:
        "La pantalla Alta Preafiliación Comercio se valida al final porque puede cambiar el contexto de navegación.",
    });

    await SmokeNavigationHelper.navigateByMenuPath(
      page,
      navbar,
      MerchantMenuRoutes.main,
      [],
      MerchantMenuRoutes.merchantPreAffiliationAdd,
      /AMDUC001_MerchantDataEntryAdd/,
    );

    merchantSmokeLogger.info("SMOKE completado: navegación Comercios OK");
  });
});
``;

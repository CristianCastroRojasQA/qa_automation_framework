import { settings } from "@config/settings";
import { expect, test } from "@paystudio/fixtures";
import { SmokeNavigationHelper } from "@paystudio/helpers/smoke-navigation.helper";
import { ConfigurationMenuRoutes } from "@paystudio/test-data/navbar/configuration-menu.routes";
import { logger } from "@utils/logger";

const smokeLogger = logger.child({ module: "ConfigurationSmoke" });

/**
 * Suite de navegación del módulo Configuración
 */
test.describe("SMOKE: Navegación completa configuración", () => {
  test("SMOKE: Navegación completa configuración", async ({
    page,
    loginPage,
    navbar,
  }) => {
    test.setTimeout(120000);

    await loginPage.goto(settings.paystudioUrl);
    await loginPage.login(settings.credentials.user, settings.credentials.pass);

    await expect(page).toHaveURL(/MainPage/);

    smokeLogger.info("Inicio navegación módulo Configuración");

    /**
     * Pantalla: Marcas y Modelos
     */
    await SmokeNavigationHelper.navigateByMenuPath(
      page,
      navbar,
      ConfigurationMenuRoutes.main,
      [ConfigurationMenuRoutes.acquirer.menu],
      ConfigurationMenuRoutes.acquirer.tradeAndModel,
      /ABCUC022_TTradeAndModel/,
    );

    /**
     * Pantalla: Alta de Terminal
     */
    await SmokeNavigationHelper.navigateByMenuPath(
      page,
      navbar,
      ConfigurationMenuRoutes.main,
      [
        ConfigurationMenuRoutes.acquirer.menu,
        ConfigurationMenuRoutes.acquirer.terminal.menu,
      ],
      ConfigurationMenuRoutes.acquirer.terminal.addTerminal,
      /ABCUC023_SaveTerminal/,
    );

    /**
     * Pantalla: Mantenimiento de Terminal
     */
    await SmokeNavigationHelper.navigateByMenuPath(
      page,
      navbar,
      ConfigurationMenuRoutes.main,
      [
        ConfigurationMenuRoutes.acquirer.menu,
        ConfigurationMenuRoutes.acquirer.terminal.menu,
      ],
      ConfigurationMenuRoutes.acquirer.terminal.updateTerminalSearch,
      /ABCUC024_UpdateTerminalSearch/,
    );

    /**
     * Pantalla: Alta Masiva de Terminales
     */
    await SmokeNavigationHelper.navigateByMenuPath(
      page,
      navbar,
      ConfigurationMenuRoutes.main,
      [
        ConfigurationMenuRoutes.acquirer.menu,
        ConfigurationMenuRoutes.acquirer.terminal.menu,
      ],
      ConfigurationMenuRoutes.acquirer.terminal.massiveTerminalAdd,
      /ABCUC039/,
    );

    /**
     * Pantalla: Consulta Stock de Terminales
     */
    await SmokeNavigationHelper.navigateByMenuPath(
      page,
      navbar,
      ConfigurationMenuRoutes.main,
      [
        ConfigurationMenuRoutes.acquirer.menu,
        ConfigurationMenuRoutes.acquirer.terminal.menu,
      ],
      ConfigurationMenuRoutes.acquirer.terminal.terminalStockSearch,
      /Check-Terminal-Stock/,
    );

    /**
     * Pantalla: Alta de Producto
     */
    await SmokeNavigationHelper.navigateByMenuPath(
      page,
      navbar,
      ConfigurationMenuRoutes.main,
      [
        ConfigurationMenuRoutes.acquirer.menu,
        ConfigurationMenuRoutes.acquirer.product.menu,
      ],
      ConfigurationMenuRoutes.acquirer.product.addProduct,
      /ABCUC025_AddProduct/,
    );

    /**
     * Pantalla: Mantenimiento de Producto
     */
    await SmokeNavigationHelper.navigateByMenuPath(
      page,
      navbar,
      ConfigurationMenuRoutes.main,
      [
        ConfigurationMenuRoutes.acquirer.menu,
        ConfigurationMenuRoutes.acquirer.product.menu,
      ],
      ConfigurationMenuRoutes.acquirer.product.modifyProduct,
      /ABCUC025_ModifyProduct/,
    );

    /**
     * Pantalla: Calendario Adquirente
     */
    await SmokeNavigationHelper.navigateByMenuPath(
      page,
      navbar,
      ConfigurationMenuRoutes.main,
      [ConfigurationMenuRoutes.acquirer.menu],
      ConfigurationMenuRoutes.acquirer.acquirerCalendar,
      /ABCUC015_AcqCal_Search/,
    );

    /**
     * Pantalla: Tasa de Cambio
     */
    await SmokeNavigationHelper.navigateByMenuPath(
      page,
      navbar,
      ConfigurationMenuRoutes.main,
      [ConfigurationMenuRoutes.acquirer.menu],
      ConfigurationMenuRoutes.acquirer.exchangeRate,
      /ABCUC016_ExchangeRate/,
    );

    /**
     * Pantalla: Mantenimiento de Condiciones Comerciales
     */
    await SmokeNavigationHelper.navigateByMenuPath(
      page,
      navbar,
      ConfigurationMenuRoutes.main,
      [
        ConfigurationMenuRoutes.acquirer.menu,
        ConfigurationMenuRoutes.acquirer.settlementModel.menu,
      ],
      ConfigurationMenuRoutes.acquirer.settlementModel.commercialConditions,
      /AMUC016/,
    );

    /**
     * Pantalla: Condiciones Comerciales Promocionales
     */
    await SmokeNavigationHelper.navigateByMenuPath(
      page,
      navbar,
      ConfigurationMenuRoutes.main,
      [
        ConfigurationMenuRoutes.acquirer.menu,
        ConfigurationMenuRoutes.acquirer.settlementModel.menu,
      ],
      ConfigurationMenuRoutes.acquirer.settlementModel
        .promotionalCommercialConditions,
      /AMRUC045/,
    );

    /**
     * Pantalla: Reporte de Condiciones Comerciales
     */
    await SmokeNavigationHelper.navigateByMenuPath(
      page,
      navbar,
      ConfigurationMenuRoutes.main,
      [
        ConfigurationMenuRoutes.acquirer.menu,
        ConfigurationMenuRoutes.acquirer.settlementModel.menu,
      ],
      ConfigurationMenuRoutes.acquirer.settlementModel
        .commercialConditionsReport,
      /AMRUC047/,
    );

    /**
     * Pantalla: Grupo Económico
     */
    await SmokeNavigationHelper.navigateByMenuPath(
      page,
      navbar,
      ConfigurationMenuRoutes.main,
      [ConfigurationMenuRoutes.acquirer.menu],
      ConfigurationMenuRoutes.acquirer.economicGroup,
      /ABCUC046/,
    );

    /**
     * Pantalla: Actividad Económica
     */
    await SmokeNavigationHelper.navigateByMenuPath(
      page,
      navbar,
      ConfigurationMenuRoutes.main,
      [ConfigurationMenuRoutes.acquirer.menu],
      ConfigurationMenuRoutes.acquirer.economicActivity,
      /ABCUC047/,
    );

    /**
     * Pantalla: Parámetros Cálculo MDR
     */
    await SmokeNavigationHelper.navigateByMenuPath(
      page,
      navbar,
      ConfigurationMenuRoutes.main,
      [ConfigurationMenuRoutes.acquirer.menu],
      ConfigurationMenuRoutes.acquirer.mdrBrandParameters,
      /mdr-brand-parameters/,
    );

    /**
     * Pantalla: Tasa de Cambio Organizaciones
     */
    await SmokeNavigationHelper.navigateByMenuPath(
      page,
      navbar,
      ConfigurationMenuRoutes.main,
      [ConfigurationMenuRoutes.acquirer.menu],
      ConfigurationMenuRoutes.acquirer.organizationExchangeRate,
      /OrgExchangeRateMaint/,
    );

    smokeLogger.info("SMOKE completado: navegación configuración OK");
  });
});

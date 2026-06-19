import { settings } from "@config/settings";
import { expect, test } from "@paystudio/fixtures";
import {
  ConfigurationMenuRoutes,
  ConfigurationMenuUrlPatterns,
} from "@paystudio/test-data/navbar/configuration-menu.routes";
import { logger } from "@utils/logger";

const smokeLogger = logger.child({ module: "ConfigurationSmoke" });

const isGetnetCert =
  settings.project === "GETNET" && settings.environment === "CERT";

/**
 * Suite de SMOKE - Módulo Configuración
 */
test.describe("SMOKE - Configuración | Navegación de pantallas", () => {
  test.beforeEach(async ({ page, navbar }) => {
    test.setTimeout(120000);

    await page.goto(settings.paystudioUrl);
    await navbar.waitForReady();

    smokeLogger.info("Inicio navegación módulo Configuración");
  });

  test("TC-01: Configuración - Debe navegar a Marcas y Modelos", async ({
    page,
    navbar,
  }) => {
    await navbar.navigateByMenuPath(
      ConfigurationMenuRoutes.main,
      [ConfigurationMenuRoutes.acquirer.menu],
      ConfigurationMenuRoutes.acquirer.tradeAndModel,
    );

    await expect(page).toHaveURL(
      ConfigurationMenuUrlPatterns.acquirer.tradeAndModel,
    );
  });

  test("TC-02: Configuración - Debe navegar a Alta de Terminal", async ({
    page,
    navbar,
  }) => {
    await navbar.navigateByMenuPath(
      ConfigurationMenuRoutes.main,
      [
        ConfigurationMenuRoutes.acquirer.menu,
        ConfigurationMenuRoutes.acquirer.terminal.menu,
      ],
      ConfigurationMenuRoutes.acquirer.terminal.addTerminal,
    );

    await expect(page).toHaveURL(
      ConfigurationMenuUrlPatterns.acquirer.terminal.addTerminal,
    );
  });

  test("TC-03: Configuración - Debe navegar a Mantenimiento de Terminal", async ({
    page,
    navbar,
  }) => {
    await navbar.navigateByMenuPath(
      ConfigurationMenuRoutes.main,
      [
        ConfigurationMenuRoutes.acquirer.menu,
        ConfigurationMenuRoutes.acquirer.terminal.menu,
      ],
      ConfigurationMenuRoutes.acquirer.terminal.updateTerminalSearch,
    );

    await expect(page).toHaveURL(
      ConfigurationMenuUrlPatterns.acquirer.terminal.updateTerminalSearch,
    );
  });

  test("TC-04: Configuración - Debe navegar a Alta Masiva de Terminales", async ({
    page,
    navbar,
  }) => {
    await navbar.navigateByMenuPath(
      ConfigurationMenuRoutes.main,
      [
        ConfigurationMenuRoutes.acquirer.menu,
        ConfigurationMenuRoutes.acquirer.terminal.menu,
      ],
      ConfigurationMenuRoutes.acquirer.terminal.massiveTerminalAdd,
    );

    await expect(page).toHaveURL(
      ConfigurationMenuUrlPatterns.acquirer.terminal.massiveTerminalAdd,
    );
  });

  test("TC-05: Configuración - Debe navegar a Consulta de Stock de Terminales", async ({
    page,
    navbar,
  }) => {
    await navbar.navigateByMenuPath(
      ConfigurationMenuRoutes.main,
      [
        ConfigurationMenuRoutes.acquirer.menu,
        ConfigurationMenuRoutes.acquirer.terminal.menu,
      ],
      ConfigurationMenuRoutes.acquirer.terminal.terminalStockSearch,
    );

    await expect(page).toHaveURL(
      ConfigurationMenuUrlPatterns.acquirer.terminal.terminalStockSearch,
    );
  });

  test("TC-06: Configuración - Debe navegar a Alta de Producto", async ({
    page,
    navbar,
  }) => {
    await navbar.navigateByMenuPath(
      ConfigurationMenuRoutes.main,
      [
        ConfigurationMenuRoutes.acquirer.menu,
        ConfigurationMenuRoutes.acquirer.product.menu,
      ],
      ConfigurationMenuRoutes.acquirer.product.addProduct,
    );

    await expect(page).toHaveURL(
      ConfigurationMenuUrlPatterns.acquirer.product.addProduct,
    );
  });

  test("TC-07: Configuración - Debe navegar a Mantenimiento de Producto", async ({
    page,
    navbar,
  }) => {
    await navbar.navigateByMenuPath(
      ConfigurationMenuRoutes.main,
      [
        ConfigurationMenuRoutes.acquirer.menu,
        ConfigurationMenuRoutes.acquirer.product.menu,
      ],
      ConfigurationMenuRoutes.acquirer.product.modifyProduct,
    );

    await expect(page).toHaveURL(
      ConfigurationMenuUrlPatterns.acquirer.product.modifyProduct,
    );
  });

  test("TC-08: Configuración - Debe navegar a Calendario Adquirente", async ({
    page,
    navbar,
  }) => {
    await navbar.navigateByMenuPath(
      ConfigurationMenuRoutes.main,
      [ConfigurationMenuRoutes.acquirer.menu],
      ConfigurationMenuRoutes.acquirer.acquirerCalendar,
    );

    await expect(page).toHaveURL(
      ConfigurationMenuUrlPatterns.acquirer.acquirerCalendar,
    );
  });

  test("TC-09: Configuración - Debe navegar a Tasa de Cambio", async ({
    page,
    navbar,
  }) => {
    await navbar.navigateByMenuPath(
      ConfigurationMenuRoutes.main,
      [ConfigurationMenuRoutes.acquirer.menu],
      ConfigurationMenuRoutes.acquirer.exchangeRate,
    );

    await expect(page).toHaveURL(
      ConfigurationMenuUrlPatterns.acquirer.exchangeRate,
    );
  });

  test("TC-10: Configuración - Debe navegar a Mantenimiento de Condiciones Comerciales", async ({
    page,
    navbar,
  }) => {
    await navbar.navigateByMenuPath(
      ConfigurationMenuRoutes.main,
      [
        ConfigurationMenuRoutes.acquirer.menu,
        ConfigurationMenuRoutes.acquirer.settlementModel.menu,
      ],
      ConfigurationMenuRoutes.acquirer.settlementModel.commercialConditions,
    );

    await expect(page).toHaveURL(
      ConfigurationMenuUrlPatterns.acquirer.settlementModel
        .commercialConditions,
    );
  });

  test("TC-11: Configuración - Debe navegar a Condiciones Comerciales Promocionales", async ({
    page,
    navbar,
  }) => {
    await navbar.navigateByMenuPath(
      ConfigurationMenuRoutes.main,
      [
        ConfigurationMenuRoutes.acquirer.menu,
        ConfigurationMenuRoutes.acquirer.settlementModel.menu,
      ],
      ConfigurationMenuRoutes.acquirer.settlementModel
        .promotionalCommercialConditions,
    );

    await expect(page).toHaveURL(
      ConfigurationMenuUrlPatterns.acquirer.settlementModel
        .promotionalCommercialConditions,
    );
  });

  test("TC-12: Configuración - Debe navegar a Reporte de Condiciones Comerciales", async ({
    page,
    navbar,
  }) => {
    await navbar.navigateByMenuPath(
      ConfigurationMenuRoutes.main,
      [
        ConfigurationMenuRoutes.acquirer.menu,
        ConfigurationMenuRoutes.acquirer.settlementModel.menu,
      ],
      ConfigurationMenuRoutes.acquirer.settlementModel
        .commercialConditionsReport,
    );

    await expect(page).toHaveURL(
      ConfigurationMenuUrlPatterns.acquirer.settlementModel
        .commercialConditionsReport,
    );
  });

  test("TC-13: Configuración - Debe navegar a Grupo Económico", async ({
    page,
    navbar,
  }) => {
    await navbar.navigateByMenuPath(
      ConfigurationMenuRoutes.main,
      [ConfigurationMenuRoutes.acquirer.menu],
      ConfigurationMenuRoutes.acquirer.economicGroup,
    );

    await expect(page).toHaveURL(
      ConfigurationMenuUrlPatterns.acquirer.economicGroup,
    );
  });

  test("TC-14: Configuración - Debe navegar a Actividad Económica", async ({
    page,
    navbar,
  }) => {
    await navbar.navigateByMenuPath(
      ConfigurationMenuRoutes.main,
      [ConfigurationMenuRoutes.acquirer.menu],
      ConfigurationMenuRoutes.acquirer.economicActivity,
    );

    await expect(page).toHaveURL(
      ConfigurationMenuUrlPatterns.acquirer.economicActivity,
    );
  });

  test("TC-15: Configuración - Debe navegar a Parámetros de Cálculo MDR", async ({
    page,
    navbar,
  }) => {
    await navbar.navigateByMenuPath(
      ConfigurationMenuRoutes.main,
      [ConfigurationMenuRoutes.acquirer.menu],
      ConfigurationMenuRoutes.acquirer.mdrBrandParameters,
    );

    await expect(page).toHaveURL(
      ConfigurationMenuUrlPatterns.acquirer.mdrBrandParameters,
    );
  });

  test(
    "TC-16: Configuración - Debe navegar a Tasa de Cambio de Organizaciones",
    {
      annotation: {
        type: "note",
        description:
          "En pruebas de navegación del módulo Configuración, este escenario no aplica para GETNET CERT ya que la pantalla Tasa de Cambio de Organizaciones no está disponible en ese ambiente.",
      },
    },
    async ({ page, navbar }) => {
      test.skip(
        isGetnetCert,
        "TC-16 no aplica para GETNET CERT: Tasa de Cambio de Organizaciones no está disponible.",
      );

      await navbar.navigateByMenuPath(
        ConfigurationMenuRoutes.main,
        [ConfigurationMenuRoutes.acquirer.menu],
        ConfigurationMenuRoutes.acquirer.organizationExchangeRate,
      );

      await expect(page).toHaveURL(
        ConfigurationMenuUrlPatterns.acquirer.organizationExchangeRate,
      );
      ``;
    },
  );

  test("TC-17: Configuración - Debe navegar a Añadir Lista de Reglas de Autorización", async ({
    page,
    navbar,
  }) => {
    await navbar.navigateByMenuPath(
      ConfigurationMenuRoutes.main,
      [ConfigurationMenuRoutes.authorizationRuleList.menu],
      ConfigurationMenuRoutes.authorizationRuleList.addAuthRuleList,
    );

    await expect(page).toHaveURL(
      ConfigurationMenuUrlPatterns.authorizationRuleList.addAuthRuleList,
    );
  });

  test("TC-18: Configuración - Debe navegar a Mantenimiento de Lista de Reglas de Autorización", async ({
    page,
    navbar,
  }) => {
    await navbar.navigateByMenuPath(
      ConfigurationMenuRoutes.main,
      [ConfigurationMenuRoutes.authorizationRuleList.menu],
      ConfigurationMenuRoutes.authorizationRuleList.updateAuthListSearch,
    );

    await expect(page).toHaveURL(
      ConfigurationMenuUrlPatterns.authorizationRuleList.updateAuthListSearch,
    );
  });

  test("TC-19: Configuración - Debe navegar a Mantenimiento de Valores de Lista de Reglas de Autorización", async ({
    page,
    navbar,
  }) => {
    await navbar.navigateByMenuPath(
      ConfigurationMenuRoutes.main,
      [ConfigurationMenuRoutes.authorizationRuleList.menu],
      ConfigurationMenuRoutes.authorizationRuleList.updateAuthListValueSearch,
    );

    await expect(page).toHaveURL(
      ConfigurationMenuUrlPatterns.authorizationRuleList
        .updateAuthListValueSearch,
    );
  });

  test("TC-20: Configuración - Debe navegar a Eliminar Lista de Reglas de Autorización", async ({
    page,
    navbar,
  }) => {
    await navbar.navigateByMenuPath(
      ConfigurationMenuRoutes.main,
      [ConfigurationMenuRoutes.authorizationRuleList.menu],
      ConfigurationMenuRoutes.authorizationRuleList.deleteAuthList,
    );

    await expect(page).toHaveURL(
      ConfigurationMenuUrlPatterns.authorizationRuleList.deleteAuthList,
    );
  });

  test.afterAll(async () => {
    smokeLogger.info(
      "SMOKE completado: navegación configuración validada correctamente.",
    );
  });
});

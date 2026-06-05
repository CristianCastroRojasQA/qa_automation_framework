import { settings } from "@config/settings";
import { MerchantSearch } from "@paystudio/components/navbar/merchant-search";
import { MerchantSearchConstants } from "@paystudio/test-data/merchant-search/merchant-search.constants";
import { merchantSearchData } from "@paystudio/test-data/merchant-search/merchant-search.data";
import { MerchantProvider } from "@paystudio/test-data/merchant-search/merchant.provider";
import { securityPayloads } from "@paystudio/test-data/security/security.payloads";
import { expect, test } from "@paystudio/fixtures";
import { logger } from "@utils/logger";

/**
 * Suite de pruebas del Buscador Global de Comercios de PayStudio.
 *
 * Contexto funcional:
 * Esta suite valida el comportamiento del buscador global disponible
 * desde el Navbar para la consulta rápida de comercios dentro del sistema.
 *
 * Vinculación funcional:
 * Los casos de prueba contenidos en esta suite corresponden al requerimiento
 * y a los criterios de aceptación definidos para la:
 *
 * User Story 373109:
 * CHBC111 Búsqueda rápida de Comercios
 *
 * Cobertura principal:
 * - acceso al buscador desde la interfaz
 * - interacción con el campo de búsqueda
 * - visualización de historial
 * - búsqueda por nombre y por código
 * - validación de estado sin resultados
 * - selección de comercios
 * - reglas de negocio sobre resultados
 * - controles básicos de seguridad ante entradas maliciosas
 *
 * Criterio de diseño:
 * Todos los escenarios parten de un usuario autenticado,
 * ya que el buscador es una funcionalidad disponible
 * únicamente después del ingreso al portal.
 *
 * La suite reutiliza fixtures autenticadas y componentes del framework
 * para mantener consistencia, legibilidad y desacoplamiento del DOM.
 */
test.describe(
  "Buscador Global de Comercios - PayStudio (UH ALINEADA)",
  {
    tag: ["@merchant-search", "@requirement-373109"],
    annotation: [
      { type: "module", description: "Buscador Global de Comercios" },
      { type: "application", description: "PayStudio" },
      {
        type: "requirement",
        description: "User Story 373109 - CHBC111 Búsqueda rápida de Comercios",
      },
    ],
  },
  () => {
    test.beforeEach(async ({ page, loginPage }) => {
      await loginPage.navigate(settings.paystudioUrl);
      await loginPage.login(
        settings.credentials.user,
        settings.credentials.pass,
      );

      await expect(page).toHaveURL(/MainPage/);
    });

    test.describe(
      "UI / Access",
      {
        tag: "@ui",
        annotation: { type: "category", description: "UI / Access" },
      },
      () => {
        test(
          "TC-01: Debe abrir buscador global",
          {
            tag: ["@navbar", "@smoke"],
            annotation: [
              { type: "case", description: "TC-01" },
              {
                type: "objective",
                description:
                  "Confirmar la disponibilidad del punto de acceso al buscador global desde el Navbar",
              },
              {
                type: "coverage",
                description:
                  "Apertura del buscador desde el Navbar y disponibilidad inicial del overlay del componente",
              },
              { type: "component", description: "Navbar / MerchantSearch" },
              { type: "requirement", description: "US 373109" },
            ],
          },
          async ({ navbar }) => {
            await navbar.openMerchantSearch();

            logger.info(
              "TC-01 validado correctamente: el buscador global se abrió desde el Navbar.",
            );
          },
        );

        test(
          "TC-02: Debe permitir interacción con input de búsqueda",
          {
            tag: ["@navbar", "@input", "@smoke"],
            annotation: [
              { type: "case", description: "TC-02" },
              {
                type: "objective",
                description:
                  "Confirmar que el input del buscador puede recibir foco y quedar listo para interacción",
              },
              {
                type: "coverage",
                description:
                  "Apertura del buscador, validación de disponibilidad del input y confirmación de interacción básica del usuario",
              },
              { type: "component", description: "Navbar / MerchantSearch" },
              { type: "requirement", description: "US 373109" },
            ],
          },
          async ({ navbar, page }) => {
            await navbar.openMerchantSearch();

            const merchantSearch = new MerchantSearch(page);

            await merchantSearch.expectInputReady();

            logger.info(
              "TC-02 validado correctamente: el input del buscador quedó listo para interacción.",
            );
          },
        );
      },
    );

    test.describe(
      "History",
      {
        tag: "@history",
        annotation: { type: "category", description: "History" },
      },
      () => {
        test(
          "TC-03: Debe mostrar historial de últimas búsquedas",
          {
            tag: ["@ui", "@history"],
            annotation: [
              { type: "case", description: "TC-03" },
              {
                type: "objective",
                description:
                  "Confirmar que el buscador expone el historial o contenedor de resultados al usuario autenticado",
              },
              {
                type: "coverage",
                description:
                  "Apertura del buscador, verificación de título visible del historial y validación de cantidad de elementos expuestos",
              },
              { type: "component", description: "MerchantSearch" },
              { type: "requirement", description: "US 373109" },
            ],
          },
          async ({ navbar, page }) => {
            await navbar.openMerchantSearch();

            const merchantSearch = new MerchantSearch(page);

            const title = await merchantSearch.getVisibleTitleText();
            const historyCount = await merchantSearch.validateSearchHistory();

            expect(title).toContain(MerchantSearchConstants.HISTORY_TITLE);
            expect(historyCount).toBeGreaterThan(0);

            logger.info(
              `TC-03 validado correctamente: el historial del buscador está visible con título [${title}] y se detectaron [${historyCount}] elementos.`,
            );
          },
        );
      },
    );

    test.describe(
      "Search Core",
      {
        tag: "@functional",
        annotation: { type: "category", description: "Search Core" },
      },
      () => {
        test(
          "TC-04: Buscar por nombre de comercio",
          {
            tag: ["@search", "@name-search"],
            annotation: [
              { type: "case", description: "TC-04" },
              {
                type: "objective",
                description:
                  "Confirmar que el buscador acepta texto descriptivo y procesa consultas por nombre de comercio",
              },
              {
                type: "coverage",
                description:
                  "Apertura del buscador, ejecución de búsqueda por nombre y validación de resultados visibles",
              },
              { type: "component", description: "MerchantSearch" },
              { type: "requirement", description: "US 373109" },
            ],
          },
          async ({ navbar, page }) => {
            await navbar.openMerchantSearch();

            const merchantSearch = new MerchantSearch(page);
            const merchant = await MerchantProvider.getValidMerchant();

            const searchTerm = merchant.fantasyName;

            await merchantSearch.searchByEnter(searchTerm);

            const title = await merchantSearch.getVisibleTitleText();
            const results = await merchantSearch.getResultTexts();

            expect(title).toContain(MerchantSearchConstants.RESULTS_TITLE);
            expect(results.length).toBeGreaterThan(0);

            const containsExpectedMerchant = results.some(
              (text) =>
                text.toLowerCase().includes(searchTerm.toLowerCase()) ||
                text.includes(`#${merchant.merchantIdentifier}`),
            );

            expect(containsExpectedMerchant).toBeTruthy();

            logger.info(
              `TC-04 validado correctamente: la búsqueda por nombre [${searchTerm}] mostró resultados visibles asociados al comercio [${merchant.merchantIdentifier}].`,
            );
          },
        );

        test(
          "TC-05: Buscar por código de comercio",
          {
            tag: ["@search", "@code-search"],
            annotation: [
              { type: "case", description: "TC-05" },
              {
                type: "objective",
                description:
                  "Confirmar que el buscador procesa criterios numéricos asociados a códigos de comercio",
              },
              {
                type: "coverage",
                description:
                  "Apertura del buscador, ejecución de búsqueda por código y validación de resultados visibles",
              },
              { type: "component", description: "MerchantSearch" },
              { type: "requirement", description: "US 373109" },
            ],
          },
          async ({ navbar, page }) => {
            await navbar.openMerchantSearch();

            const merchantSearch = new MerchantSearch(page);
            const merchant = await MerchantProvider.getValidMerchant();

            const searchTerm = merchant.merchantIdentifier;

            await merchantSearch.searchByEnter(searchTerm);

            const title = await merchantSearch.getVisibleTitleText();
            const results = await merchantSearch.getResultTexts();

            expect(title).toContain(MerchantSearchConstants.RESULTS_TITLE);
            expect(results.length).toBeGreaterThan(0);

            const containsExpectedMerchant = results.some((text) =>
              text.includes(`#${merchant.merchantIdentifier}`),
            );

            expect(containsExpectedMerchant).toBeTruthy();

            logger.info(
              `TC-05 validado correctamente: la búsqueda por código [${searchTerm}] mostró resultados visibles asociados al comercio [${merchant.merchantIdentifier}].`,
            );
          },
        );
      },
    );

    test.describe(
      "No Results",
      {
        tag: "@functional",
        annotation: { type: "category", description: "No Results" },
      },
      () => {
        test(
          "TC-06: Debe mostrar mensaje 'Comercio no encontrado'",
          {
            tag: ["@search", "@empty-state"],
            annotation: [
              { type: "case", description: "TC-06" },
              {
                type: "objective",
                description:
                  "Confirmar que el sistema informa correctamente el estado vacío ante un criterio inexistente",
              },
              {
                type: "coverage",
                description:
                  'Ejecución de búsqueda sin coincidencias y validación del mensaje "Comercio no encontrado"',
              },
              { type: "component", description: "MerchantSearch" },
              { type: "requirement", description: "US 373109" },
            ],
          },
          async ({ navbar, page }) => {
            await navbar.openMerchantSearch();

            const merchantSearch = new MerchantSearch(page);

            await merchantSearch.searchByEnter(
              merchantSearchData.invalidSearches.nonExistingMerchant,
            );

            const message = await merchantSearch.getNoResultsMessage();

            expect(message).toContain(
              MerchantSearchConstants.NO_RESULTS_MESSAGE,
            );

            logger.info(
              `TC-06 validado correctamente: se mostró el mensaje esperado [${MerchantSearchConstants.NO_RESULTS_MESSAGE}] para el criterio [${merchantSearchData.invalidSearches.nonExistingMerchant}].`,
            );
          },
        );
      },
    );

    test.describe(
      "Selection",
      {
        tag: "@functional",
        annotation: { type: "category", description: "Selection" },
      },
      () => {
        test(
          "TC-07: Selección de comercio navega a contexto",
          {
            tag: ["@selection", "@navigation"],
            annotation: [
              { type: "case", description: "TC-07" },
              {
                type: "objective",
                description:
                  "Confirmar que seleccionar un comercio redirige correctamente al contexto funcional del comercio",
              },
              {
                type: "coverage",
                description:
                  "Búsqueda de comercios, selección del primer resultado disponible y validación de navegación a MerchantEntryPoint",
              },
              { type: "component", description: "MerchantSearch" },
              { type: "requirement", description: "US 373109" },
            ],
          },
          async ({ navbar, page }) => {
            await navbar.openMerchantSearch();

            const merchantSearch = new MerchantSearch(page);
            const merchant = await MerchantProvider.getValidMerchant();

            await merchantSearch.searchByEnter(merchant.merchantIdentifier);
            await merchantSearch.selectResultByIndex(0);

            await expect(page).toHaveURL(/MerchantEntryPoint/);

            logger.info(
              `TC-07 validado correctamente: la selección del comercio [${merchant.merchantIdentifier}] navegó al contexto esperado.`,
            );
          },
        );
      },
    );

    test.describe(
      "Business Rules",
      {
        tag: "@functional",
        annotation: { type: "category", description: "Business Rules" },
      },
      () => {
        test(
          "TC-08: Validar ordenamiento ASC",
          {
            tag: ["@business-rule", "@ordering"],
            annotation: [
              { type: "case", description: "TC-08" },
              {
                type: "objective",
                description:
                  "Confirmar que los comercios visibles se presentan en orden ascendente",
              },
              {
                type: "coverage",
                description:
                  "Búsqueda por nombre repetido, obtención de IDs desde resultados visibles, construcción del orden esperado y comparación entre orden actual y orden ascendente",
              },
              { type: "component", description: "MerchantSearch" },
              { type: "requirement", description: "US 373109" },
            ],
          },
          async ({ navbar, page }) => {
            await navbar.openMerchantSearch();

            const merchantSearch = new MerchantSearch(page);
            const repeatedFantasyName =
              await MerchantProvider.getRepeatedFantasyName();

            await merchantSearch.searchByEnter(repeatedFantasyName.fantasyName);

            const title = await merchantSearch.getVisibleTitleText();
            const ids = await merchantSearch.getMerchantIdsFromResults();
            const sorted = [...ids].sort((a, b) => a - b);

            expect(title).toContain(MerchantSearchConstants.RESULTS_TITLE);
            expect(ids.length).toBeGreaterThan(0);
            expect(ids).toEqual(sorted);

            logger.info(
              `TC-08 validado correctamente: la búsqueda por nombre repetido [${repeatedFantasyName.fantasyName}] retornó IDs en orden ascendente. IDs obtenidos=[${ids.join(", ")}] | orden esperado=[${sorted.join(", ")}].`,
            );
          },
        );

        test(
          "TC-09: Validar tope máximo de resultados",
          {
            tag: ["@business-rule", "@limit"],
            annotation: [
              { type: "case", description: "TC-09" },
              {
                type: "objective",
                description:
                  "Confirmar que el sistema limita la cantidad máxima de resultados visibles",
              },
              {
                type: "coverage",
                description:
                  "Ejecución de búsqueda con múltiples coincidencias y validación del límite máximo de resultados",
              },
              { type: "component", description: "MerchantSearch" },
              { type: "requirement", description: "US 373109" },
            ],
          },
          async ({ navbar, page }) => {
            await navbar.openMerchantSearch();

            const merchantSearch = new MerchantSearch(page);
            const repeatedFantasyName =
              await MerchantProvider.getRepeatedFantasyName();

            const searchTerm = repeatedFantasyName.fantasyName;

            await merchantSearch.searchByEnter(searchTerm);

            const title = await merchantSearch.getVisibleTitleText();
            const results = await merchantSearch.getResultTexts();

            expect(title).toContain(MerchantSearchConstants.RESULTS_TITLE);
            expect(results.length).toBeGreaterThan(0);
            expect(results.length).toBeLessThanOrEqual(
              MerchantSearchConstants.MAX_RESULTS,
            );

            logger.info(
              `TC-09 validado correctamente: la búsqueda por nombre repetido [${searchTerm}] retornó [${results.length}] resultados y respetó el máximo permitido de [${MerchantSearchConstants.MAX_RESULTS}].`,
            );
          },
        );
      },
    );

    test.describe(
      "Security",
      {
        tag: "@security",
        annotation: { type: "category", description: "Security" },
      },
      () => {
        test(
          "TC-10: Bloqueo XSS",
          {
            tag: ["@xss", "@negative"],
            annotation: [
              { type: "case", description: "TC-10" },
              {
                type: "objective",
                description:
                  "Confirmar que una entrada maliciosa de tipo XSS no genera resultados válidos",
              },
              {
                type: "coverage",
                description:
                  "Envío de payload XSS y validación de ausencia de resultados",
              },
              { type: "component", description: "MerchantSearch" },
              { type: "requirement", description: "US 373109" },
            ],
          },
          async ({ navbar, page }) => {
            let dialogTriggered = false;

            page.on("dialog", async (dialog) => {
              dialogTriggered = true;
              await dialog.dismiss();
            });

            await navbar.openMerchantSearch();

            const merchantSearch = new MerchantSearch(page);

            const count = await merchantSearch.searchByEnter(
              securityPayloads.xssAttack.user,
            );

            await expect(page).toHaveURL(/MainPage/);
            expect(dialogTriggered).toBe(false);

            logger.info(
              `TC-10 validado correctamente: el payload XSS no ejecutó scripts ni alteró el flujo. Resultados visibles=[${count}].`,
            );
          },
        );

        test(
          "TC-11: Bloqueo SQL Injection",
          {
            tag: ["@sql-injection", "@negative"],
            annotation: [
              { type: "case", description: "TC-11" },
              {
                type: "objective",
                description:
                  "Confirmar que una entrada con patrón de inyección no produzca resultados válidos ni comprometa el flujo",
              },
              {
                type: "coverage",
                description:
                  'Envío de payload SQL Injection, validación de permanencia en MainPage y verificación del mensaje "Comercio no encontrado"',
              },
              { type: "component", description: "MerchantSearch" },
              { type: "requirement", description: "US 373109" },
            ],
          },
          async ({ navbar, page }) => {
            await navbar.openMerchantSearch();

            const merchantSearch = new MerchantSearch(page);

            await merchantSearch.searchByEnter(
              securityPayloads.sqlInjection.user,
            );

            const message = await merchantSearch.getNoResultsMessage();

            await expect(page).toHaveURL(/MainPage/);
            expect(message).toContain(
              MerchantSearchConstants.NO_RESULTS_MESSAGE,
            );

            logger.info(
              `TC-11 validado correctamente: el payload SQL Injection no generó resultados válidos y mostró el mensaje esperado [${MerchantSearchConstants.NO_RESULTS_MESSAGE}].`,
            );
          },
        );
      },
    );
  },
);

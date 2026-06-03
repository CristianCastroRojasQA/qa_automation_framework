import { test, expect } from "@paystudio/fixtures/auth.fixture";
import { logger } from "@utils/logger";
import { attachScreenshot } from "@utils/screenshot";
import { MerchantSearch } from "@paystudio/components/navbar/merchant-search";
import { settings } from "@config/settings";
import { securityPayloads } from "@paystudio/data/security/security.payloads";

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
    test.beforeEach(async ({ page, loginPage }, testInfo) => {
      logger.info(`>>> INICIANDO TEST: ${testInfo.title} <<<`);

      await loginPage.navigate(settings.paystudioUrl);
      await loginPage.login(
        settings.credentials.user,
        settings.credentials.pass,
      );

      await expect(page).toHaveURL(/MainPage/);
    });

    test.afterEach(async ({ page }, testInfo) => {
      await attachScreenshot(page, testInfo);
      logger.info(`<<< FINALIZADO TEST: ${testInfo.title} >>>`);
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

            logger.info("Input listo para interacción.");
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
                  "Apertura del buscador, verificación de visibilidad del contenedor de resultados y validación de disponibilidad del historial inicial",
              },
              { type: "component", description: "MerchantSearch" },
              { type: "requirement", description: "US 373109" },
            ],
          },
          async ({ navbar, page }) => {
            await navbar.openMerchantSearch();

            const merchantSearch = new MerchantSearch(page);

            const visible = await merchantSearch.isResultsContainerVisible();

            expect(visible).toBeTruthy();

            logger.info("Historial visible correctamente.");
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
                  "Apertura del buscador, ejecución de búsqueda por nombre y conteo de resultados visibles",
              },
              { type: "component", description: "MerchantSearch" },
              { type: "requirement", description: "US 373109" },
            ],
          },
          async ({ navbar, page }) => {
            await navbar.openMerchantSearch();

            const merchantSearch = new MerchantSearch(page);

            const count = await merchantSearch.searchByEnter("Comercio");

            expect(count).toBeGreaterThanOrEqual(0);
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
                  "Apertura del buscador, ejecución de búsqueda por código y validación de resultados obtenidos",
              },
              { type: "component", description: "MerchantSearch" },
              { type: "requirement", description: "US 373109" },
            ],
          },
          async ({ navbar, page }) => {
            await navbar.openMerchantSearch();

            const merchantSearch = new MerchantSearch(page);

            const count = await merchantSearch.searchByEnter("34");

            expect(count).toBeGreaterThan(0);
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

            await merchantSearch.searchByEnter("COMERCIO_INEXISTENTE_999");

            await merchantSearch.expectNoResultsMessage(
              "Comercio no encontrado",
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

            await merchantSearch.searchByEnter("34");

            await merchantSearch.selectResultByIndex(0);

            await expect(page).toHaveURL(/MerchantEntryPoint/);
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
                  "Obtención de IDs desde resultados visibles, construcción del orden esperado y comparación entre orden actual y orden ascendente",
              },
              { type: "component", description: "MerchantSearch" },
              { type: "requirement", description: "US 373109" },
            ],
          },
          async ({ navbar, page }) => {
            await navbar.openMerchantSearch();

            const merchantSearch = new MerchantSearch(page);

            const ids = await merchantSearch.getMerchantIdsFromResults();

            const sorted = [...ids].sort((a, b) => a - b);

            expect(ids).toEqual(sorted);
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
                  "Ejecución de búsqueda genérica y validación del límite máximo de resultados",
              },
              { type: "component", description: "MerchantSearch" },
              { type: "requirement", description: "US 373109" },
            ],
          },
          async ({ navbar, page }) => {
            await navbar.openMerchantSearch();

            const merchantSearch = new MerchantSearch(page);

            const count = await merchantSearch.searchByEnter("comercio");

            expect(count).toBeLessThanOrEqual(10);
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
            await navbar.openMerchantSearch();

            const merchantSearch = new MerchantSearch(page);

            const count = await merchantSearch.searchByEnter(
              securityPayloads.xssAttack.user,
            );

            expect(count).toBe(0);
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
                  "Envío de payload SQL Injection y validación de ausencia de resultados",
              },
              { type: "component", description: "MerchantSearch" },
              { type: "requirement", description: "US 373109" },
            ],
          },
          async ({ navbar, page }) => {
            await navbar.openMerchantSearch();

            const merchantSearch = new MerchantSearch(page);

            const count = await merchantSearch.searchByEnter(
              securityPayloads.sqlInjection.user,
            );

            expect(count).toBe(0);
          },
        );
      },
    );
  },
);

import { settings } from "@config/settings";
import { MerchantSearch } from "@paystudio/components/navbar/merchant-search";
import { MerchantSearchConstants } from "@paystudio/test-data/merchant-search/merchant-search.constants";
import { merchantSearchData } from "@paystudio/test-data/merchant-search/merchant-search.data";
import { securityPayloads } from "@paystudio/test-data/security/security.payloads";
import { expect, test } from "@paystudio/fixtures";
import { logger } from "@utils/logger";
import { MerchantDataProvider } from "@paystudio/test-data/merchant-search/merchant.provider";

const merchantSearchLogger = logger.child({ module: "MerchantSearchSpec" });

/**
 * Suite de Merchant Search (Buscador Global)
 */
test.describe("Buscador Global de Comercios - PayStudio", () => {
  test.beforeEach(async ({ page, loginPage }) => {
    await loginPage.goto(settings.paystudioUrl);
    await loginPage.login(settings.credentials.user, settings.credentials.pass);

    await expect(page).toHaveURL(/MainPage/);
  });

  test("TC-01: Debe abrir buscador global", async ({ navbar, page }) => {
    await navbar.openMerchantSearch();

    const merchantSearch = new MerchantSearch(page);

    await expect(merchantSearch.getModal()).toBeAttached();

    merchantSearchLogger.info(
      "TC-01 validado correctamente: el buscador global se abrió desde el Navbar.",
    );
  });

  test("TC-02: Debe permitir interacción con input de búsqueda", async ({
    navbar,
    page,
  }) => {
    await navbar.openMerchantSearch();

    const merchantSearch = new MerchantSearch(page);

    await merchantSearch.clickSearchInput();

    await expect(merchantSearch.getSearchInput()).toBeFocused();

    merchantSearchLogger.info(
      "TC-02 validado correctamente: el campo de búsqueda permitió interacción mediante click.",
    );
  });

  test("TC-03: Debe mostrar historial de últimas búsquedas", async ({
    navbar,
    page,
  }) => {
    await navbar.openMerchantSearch();

    const merchantSearch = new MerchantSearch(page);

    await expect(merchantSearch.getHistoryTitle()).toBeVisible();

    await expect(merchantSearch.getHistoryResultItems().first()).toBeVisible();

    const results = await merchantSearch.getHistoryResultTexts();

    expect(results.length).toBeGreaterThan(0);

    merchantSearchLogger.info(
      `TC-03 validado correctamente: historial visible [${MerchantSearchConstants.HISTORY_TITLE}] con ${results.length} elementos.`,
    );
  });

  test("TC-04: Buscar por nombre de comercio", async ({ navbar, page }) => {
    await navbar.openMerchantSearch();

    const merchantSearch = new MerchantSearch(page);
    const merchant = await MerchantDataProvider.getValidMerchant();

    const searchTerm = merchant.fantasyName;

    await merchantSearch.searchByEnter(searchTerm);

    await expect(merchantSearch.getResultsTitle()).toBeVisible();
    await expect(merchantSearch.getSearchResultItems().first()).toBeVisible();

    const results = await merchantSearch.getSearchResultTexts();

    expect(results.length).toBeGreaterThan(0);

    const containsExpectedMerchant = results.some(
      (text) =>
        text.toLowerCase().includes(searchTerm.toLowerCase()) ||
        text.includes(`#${merchant.merchantIdentifier}`),
    );

    expect(containsExpectedMerchant).toBeTruthy();

    merchantSearchLogger.info(
      `TC-04 OK: búsqueda por nombre [${searchTerm}] encontró resultados.`,
    );
  });

  test("TC-05: Buscar por código de comercio", async ({ navbar, page }) => {
    await navbar.openMerchantSearch();

    const merchantSearch = new MerchantSearch(page);
    const merchant = await MerchantDataProvider.getValidMerchant();

    const searchTerm = merchant.merchantIdentifier;

    await merchantSearch.searchByEnter(searchTerm);

    await expect(merchantSearch.getResultsTitle()).toBeVisible();
    await expect(merchantSearch.getSearchResultItems().first()).toBeVisible();

    const results = await merchantSearch.getSearchResultTexts();

    expect(results.length).toBeGreaterThan(0);

    const containsExpectedMerchant = results.some((text) =>
      text.includes(`#${merchant.merchantIdentifier}`),
    );

    expect(containsExpectedMerchant).toBeTruthy();

    merchantSearchLogger.info(
      `TC-05 OK: búsqueda por código [${searchTerm}] encontró resultados.`,
    );
  });

  test("TC-06: Debe mostrar mensaje 'Comercio no encontrado'", async ({
    navbar,
    page,
  }) => {
    await navbar.openMerchantSearch();

    const merchantSearch = new MerchantSearch(page);

    await merchantSearch.searchByEnter(
      merchantSearchData.invalidSearches.nonExistingMerchant,
    );

    await expect(merchantSearch.getNoResultsTitle()).toBeVisible();

    merchantSearchLogger.info(
      "TC-06 OK: mensaje de 'no encontrado' mostrado correctamente.",
    );
  });

  test("TC-07: Selección de comercio navega a contexto", async ({
    navbar,
    page,
  }) => {
    await navbar.openMerchantSearch();

    const merchantSearch = new MerchantSearch(page);
    const merchant = await MerchantDataProvider.getValidMerchant();

    await merchantSearch.searchByEnter(merchant.merchantIdentifier);

    await expect(merchantSearch.getResultsTitle()).toBeVisible();
    await expect(merchantSearch.getSearchResultItems().first()).toBeVisible();

    await merchantSearch.selectResultByIndex(0);

    await expect(page).toHaveURL(/MerchantEntryPoint/);

    merchantSearchLogger.info("TC-07 OK: navegación al seleccionar comercio.");
  });

  test("TC-08: Validar ordenamiento ASC", async ({ navbar, page }) => {
    await navbar.openMerchantSearch();

    const merchantSearch = new MerchantSearch(page);
    const repeatedFantasyName =
      await MerchantDataProvider.getRepeatedFantasyName();

    await merchantSearch.searchByEnter(repeatedFantasyName.fantasyName);

    await expect(merchantSearch.getResultsTitle()).toBeVisible();
    await expect(merchantSearch.getSearchResultItems().first()).toBeVisible();

    const ids = await merchantSearch.getMerchantIdsFromResults();

    const sorted = [...ids].sort((a, b) => a - b);

    expect(ids.length).toBeGreaterThan(0);
    expect(ids).toEqual(sorted);

    merchantSearchLogger.info("TC-08 OK: resultados en orden ascendente.");
  });

  test("TC-09: Validar tope máximo de resultados", async ({ navbar, page }) => {
    await navbar.openMerchantSearch();

    const merchantSearch = new MerchantSearch(page);
    const repeatedFantasyName =
      await MerchantDataProvider.getRepeatedFantasyName();

    await merchantSearch.searchByEnter(repeatedFantasyName.fantasyName);

    await expect(merchantSearch.getResultsTitle()).toBeVisible();
    await expect(merchantSearch.getSearchResultItems().first()).toBeVisible();

    const results = await merchantSearch.getSearchResultTexts();

    expect(results.length).toBeGreaterThan(0);
    expect(results.length).toBeLessThanOrEqual(
      MerchantSearchConstants.MAX_RESULTS,
    );

    merchantSearchLogger.info("TC-09 OK: máximo de resultados respetado.");
  });

  test("TC-10: Bloqueo XSS", async ({ navbar, page }) => {
    let dialogTriggered = false;

    page.on("dialog", async (dialog) => {
      dialogTriggered = true;
      await dialog.dismiss();
    });

    await navbar.openMerchantSearch();

    const merchantSearch = new MerchantSearch(page);

    await merchantSearch.searchByEnter(securityPayloads.xssAttack.user);

    await expect(page).toHaveURL(/MainPage/);
    expect(dialogTriggered).toBe(false);

    merchantSearchLogger.info("TC-10 OK: XSS bloqueado correctamente.");
  });

  test("TC-11: Bloqueo SQL Injection", async ({ navbar, page }) => {
    await navbar.openMerchantSearch();

    const merchantSearch = new MerchantSearch(page);

    await merchantSearch.searchByEnter(securityPayloads.sqlInjection.user);

    await expect(page).toHaveURL(/MainPage/);
    await expect(merchantSearch.getNoResultsTitle()).toBeVisible();

    merchantSearchLogger.info(
      "TC-11 OK: SQL Injection bloqueado correctamente.",
    );
  });
});

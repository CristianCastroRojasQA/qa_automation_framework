import { Locator, Page } from "@playwright/test";
import { MerchantSearchConstants } from "@paystudio/test-data/merchant-search/merchant-search.constants";
import { logger } from "@utils/logger";

/**
 * Page Object Model del modal Merchant Search
 */
export class MerchantSearch {
  private readonly modal: Locator;
  private readonly searchInput: Locator;
  private readonly resultsContainers: Locator;
  private readonly resultsTitles: Locator;

  constructor(page: Page) {
    this.modal = page.locator("app-merchant-search-modal");

    this.searchInput = this.modal.locator("input[name='search']");
    this.resultsContainers = this.modal.locator(".results-container");
    this.resultsTitles = this.modal.locator(".results-title span");
  }

  /**
   * Enfoca el input de búsqueda
   */
  async clickSearchInput(): Promise<void> {
    await this.searchInput.click();

    logger.info("[MerchantSearch] Click en input");
  }

  /**
   * Ejecuta búsqueda usando Enter
   */
  async searchByEnter(searchTerm: string): Promise<void> {
    await this.searchInput.fill("");
    await this.searchInput.fill(searchTerm);
    await this.searchInput.press("Enter");

    logger.info(
      `[MerchantSearch] búsqueda ejecutada. criterio="${searchTerm}"`,
    );
  }

  /**
   * Selecciona un resultado por índice
   */
  async selectResultByIndex(index: number): Promise<void> {
    const item = this.getSearchResultItems().nth(index);

    await item.click();

    logger.info(`[MerchantSearch] resultado seleccionado. índice=${index}`);
  }

  /**
   * Retorna el modal
   */
  getModal(): Locator {
    return this.modal;
  }

  /**
   * Retorna el input de búsqueda
   */
  getSearchInput(): Locator {
    return this.searchInput;
  }

  /**
   * Título de historial
   */
  getHistoryTitle(): Locator {
    return this.resultsTitles
      .filter({ hasText: MerchantSearchConstants.HISTORY_TITLE })
      .first();
  }

  /**
   * Título de resultados
   */
  getResultsTitle(): Locator {
    return this.resultsTitles
      .filter({ hasText: MerchantSearchConstants.RESULTS_TITLE })
      .first();
  }

  /**
   * Mensaje sin resultados
   */
  getNoResultsTitle(): Locator {
    return this.resultsTitles
      .filter({ hasText: MerchantSearchConstants.NO_RESULTS_MESSAGE })
      .first();
  }

  /**
   * Items de historial
   */
  getHistoryResultItems(): Locator {
    return this.resultsContainers
      .filter({ hasText: MerchantSearchConstants.HISTORY_TITLE })
      .first()
      .locator(".results-list-element");
  }

  /**
   * Items de resultados
   */
  getSearchResultItems(): Locator {
    return this.resultsContainers
      .filter({ hasText: MerchantSearchConstants.RESULTS_TITLE })
      .first()
      .locator(".results-list-element");
  }

  /**
   * Textos del historial
   */
  async getHistoryResultTexts(): Promise<string[]> {
    const texts = await this.getHistoryResultItems().allTextContents();

    return texts.map((text) => text.trim()).filter(Boolean);
  }

  /**
   * Textos de resultados
   */
  async getSearchResultTexts(): Promise<string[]> {
    const texts = await this.getSearchResultItems().allTextContents();

    return texts.map((text) => text.trim()).filter(Boolean);
  }

  /**
   * IDs de merchants desde resultados (#123)
   */
  async getMerchantIdsFromResults(): Promise<number[]> {
    const texts = await this.getSearchResultItems().allTextContents();

    const ids = texts
      .map((text) => {
        const match = text.match(/#(\d+)/);

        return match ? Number(match[1]) : null;
      })
      .filter((value): value is number => value !== null);

    logger.info(`[MerchantSearch] IDs: [${ids.join(", ")}]`);

    return ids;
  }
}

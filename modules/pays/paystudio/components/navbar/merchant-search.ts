import { expect, Locator, Page } from "@playwright/test";
import { logger } from "@utils/logger";

/**
 * Componente del buscador global de comercios dentro de PayStudio.
 *
 * Contexto funcional:
 * Este componente implementa la capacidad de búsqueda rápida de comercios
 * disponible desde la interfaz principal del sistema.
 *
 * Vinculación funcional:
 * Relacionado con la User Story 373109:
 * CHBC111 Búsqueda rápida de Comercios.
 *
 * Responsabilidades encapsuladas:
 * - apertura del buscador global
 * - ingreso de criterios de búsqueda por código o nombre
 * - consulta y validación de resultados
 * - validación del historial de búsquedas visibles
 * - verificación del mensaje de estado vacío
 * - selección de comercios desde la lista de resultados
 *
 * Su objetivo es desacoplar los tests de la estructura interna del overlay
 * y exponer una API reutilizable, clara y mantenible para los flujos
 * funcionales asociados a búsqueda rápida de comercios.
 */
export class MerchantSearch {
  private readonly page: Page;
  private readonly searchButton: Locator;
  private readonly searchInput: Locator;
  private readonly resultItems: Locator;
  private readonly resultsContainer: Locator;
  private readonly resultsTitle: Locator;
  private readonly noResultsMessage: Locator;

  constructor(page: Page) {
    this.page = page;
    this.searchButton = page.locator(".custom-dropdown-button");

    const modal = page.locator("app-merchant-search-modal");

    this.searchInput = modal.locator("input[name='search']");
    this.resultsContainer = modal.locator(".results-container");
    this.resultsTitle = modal.locator(".results-title span");
    this.resultItems = this.resultsContainer.locator(".results-list-element");
    this.noResultsMessage = modal.locator(".results-title span");
  }

  async open(): Promise<void> {
    logger.info("[MerchantSearch] Abriendo buscador global de comercios.");

    await this.searchButton.click();
    await expect(this.searchInput).toBeVisible();

    logger.info("[MerchantSearch] Buscador global abierto correctamente.");
  }

  async expectInputReady(): Promise<void> {
    await expect(this.searchInput).toBeVisible();
    await expect(this.searchInput).toBeEnabled();

    await this.searchInput.click();

    logger.info(
      "[MerchantSearch] Input de búsqueda visible, habilitado y listo para interacción.",
    );
  }

  async searchByEnter(value: string): Promise<number> {
    logger.info(
      `[MerchantSearch] Ejecutando búsqueda con criterio: [${value}]`,
    );

    await this.searchInput.fill("");
    await this.searchInput.fill(value);
    await this.searchInput.press("Enter");

    await expect(this.resultsContainer).toBeVisible();

    const count = await this.resultItems.count();

    logger.info(
      `[MerchantSearch] Búsqueda ejecutada correctamente. Resultados obtenidos: [${count}]`,
    );

    return count;
  }

  /**
   * Valida el historial de búsquedas recientes visible en el buscador.
   *
   * Comportamiento:
   * - espera a que el contenedor esté visible
   * - valida que el título corresponda a "Búsquedas recientes:"
   * - espera a que al menos un elemento del historial esté visible
   * - cuenta los elementos renderizados
   *
   * @returns Número de elementos visibles en el historial
   */
  async validateSearchHistory(): Promise<number> {
    await expect(this.resultsContainer).toBeVisible();
    await expect(this.resultsTitle).toContainText("Búsquedas recientes:");

    await expect(this.resultItems.first()).toBeVisible();

    const count = await this.resultItems.count();

    logger.info(
      `[MerchantSearch] Historial de búsqueda visible. Elementos detectados: [${count}]`,
    );

    return count;
  }

  async expectNoResultsMessage(text: string): Promise<void> {
    await expect(this.resultsContainer).toBeVisible();

    const msg = this.noResultsMessage;

    await expect(msg).toBeVisible();
    await expect(msg).toContainText(text);

    logger.info(
      `[MerchantSearch] Mensaje de no resultados validado correctamente: [${text}]`,
    );
  }

  async selectResultByIndex(index: number): Promise<void> {
    const item = this.resultItems.nth(index);

    await expect(item).toBeVisible();
    await item.click();

    logger.info(
      `[MerchantSearch] Resultado seleccionado correctamente en el índice [${index}].`,
    );
  }

  async getMerchantIdsFromResults(): Promise<number[]> {
    const items = await this.resultItems.allTextContents();

    const ids = items
      .map((t) => {
        const match = t.match(/#(\d+)/);
        return match ? Number(match[1]) : null;
      })
      .filter((x): x is number => x !== null);

    logger.info(
      `[MerchantSearch] IDs de comercios extraídos desde resultados: [${ids.join(", ")}]`,
    );

    return ids;
  }

  async isResultsContainerVisible(): Promise<boolean> {
    return await this.resultsContainer.isVisible();
  }
}

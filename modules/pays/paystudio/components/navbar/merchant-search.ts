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
 * - consulta de resultados visibles
 * - consulta de estados visibles del componente
 * - selección de comercios desde la lista de resultados
 * - extracción de identificadores de comercios visibles
 *
 * Su objetivo es desacoplar los tests de la estructura interna del overlay
 * y exponer una API reutilizable, clara y mantenible para los flujos
 * funcionales asociados a búsqueda rápida de comercios.
 */
export class MerchantSearch {
  /**
   * Referencia a la página activa de Playwright.
   *
   * Se utiliza para:
   * - sincronización del render después de una búsqueda
   * - estabilización visual del componente
   */
  private readonly page: Page;

  /**
   * Locators internos del buscador.
   *
   * Criterio de diseño:
   * - se utiliza el modal como scope raíz del componente
   * - se encapsulan locators técnicos del DOM
   * - no se acopla el componente a textos funcionales esperados
   *
   * La validación de mensajes y textos visibles debe realizarse en los specs.
   */
  private readonly modal: Locator;
  private readonly searchButton: Locator;
  private readonly searchInput: Locator;
  private readonly resultsContainers: Locator;
  private readonly resultsTitles: Locator;

  /**
   * Inicializa los selectores asociados al buscador global de comercios.
   *
   * Se utiliza `app-merchant-search-modal` como contenedor raíz
   * para acotar la búsqueda de elementos al contexto del componente.
   *
   * @param page Instancia activa de Playwright Page.
   */
  constructor(page: Page) {
    this.page = page;
    this.searchButton = page.locator(".custom-dropdown-button");
    this.modal = page.locator("app-merchant-search-modal");

    // Campo de texto principal del buscador
    this.searchInput = this.modal.locator("input[name='search']");

    // Contenedores y títulos visibles del componente
    this.resultsContainers = this.modal.locator(".results-container");
    this.resultsTitles = this.modal.locator(".results-title span");
  }

  /**
   * Abre el buscador global de comercios desde la interfaz principal.
   *
   * Flujo:
   * 1. Ejecuta click sobre el disparador del buscador
   * 2. Espera a que el campo de búsqueda quede visible
   * 3. Registra trazabilidad básica del evento
   */
  async open(): Promise<void> {
    logger.info("[MerchantSearch] Abriendo buscador global de comercios.");

    await this.searchButton.click();
    await expect(this.searchInput).toBeVisible();

    logger.info("[MerchantSearch] Buscador global abierto correctamente.");
  }

  /**
   * Valida que el input de búsqueda esté listo para interacción.
   *
   * Comportamiento:
   * - verifica visibilidad del campo
   * - verifica que el input esté habilitado
   * - aplica foco para asegurar disponibilidad de escritura
   */
  async expectInputReady(): Promise<void> {
    await expect(this.searchInput).toBeVisible();
    await expect(this.searchInput).toBeEnabled();

    await this.searchInput.click();

    logger.info(
      "[MerchantSearch] Input de búsqueda visible, habilitado y listo para interacción.",
    );
  }

  /**
   * Ejecuta una búsqueda utilizando ENTER como disparador.
   *
   * Comportamiento:
   * - limpia el campo antes de escribir
   * - ingresa el criterio indicado
   * - ejecuta ENTER como acción de búsqueda
   * - espera estabilización del render
   * - retorna la cantidad de resultados visibles en el estado activo
   *
   * Nota:
   * Este método no valida textos esperados de negocio.
   *
   * @param value Criterio de búsqueda ingresado por el usuario
   * @returns Cantidad de resultados visibles del estado actual
   */
  async searchByEnter(value: string): Promise<number> {
    logger.info(
      `[MerchantSearch] Ejecutando búsqueda con criterio: [${value}]`,
    );

    await this.searchInput.fill("");
    await this.searchInput.fill(value);
    await this.searchInput.press("Enter");

    await this.page.waitForTimeout(500);

    const count = await this.getVisibleResultItems().count();

    logger.info(
      `[MerchantSearch] Búsqueda ejecutada correctamente. Resultados obtenidos: [${count}]`,
    );

    return count;
  }

  /**
   * Valida la disponibilidad del historial visible del buscador.
   *
   * Comportamiento:
   * - obtiene el contenedor visible del estado actual
   * - verifica visibilidad del título
   * - valida existencia de al menos un elemento visible
   * - retorna la cantidad de elementos expuestos
   *
   * Nota:
   * El texto del título debe validarse desde el spec.
   *
   * @returns Número de elementos visibles en la lista activa del componente
   */
  async validateSearchHistory(): Promise<number> {
    const container = this.getVisibleResultsContainer();
    const title = this.getVisibleTitle();
    const items = this.getVisibleResultItems();

    await expect(container).toBeVisible();
    await expect(title).toBeVisible();
    await expect(items.first()).toBeVisible();

    const count = await items.count();

    logger.info(
      `[MerchantSearch] Historial de búsqueda visible. Elementos detectados: [${count}]`,
    );

    return count;
  }

  /**
   * Obtiene el texto visible actual del título del buscador.
   *
   * Este método permite al spec decidir si el estado corresponde a:
   * - historial
   * - resultados
   * - estado vacío
   *
   * @returns Texto limpio del título visible
   */
  async getVisibleTitleText(): Promise<string> {
    const title = this.getVisibleTitle();

    await expect(title).toBeVisible();

    const rawText = (await title.textContent()) ?? "";
    const cleanText = rawText.trim();

    logger.info(
      `[MerchantSearch] Título visible detectado en el componente: [${cleanText}]`,
    );

    return cleanText;
  }

  /**
   * Obtiene el mensaje visible del estado actual del componente.
   *
   * Este método no valida negocio; únicamente devuelve
   * el texto visible asociado al estado actual del buscador.
   *
   * @returns Texto limpio visible en el encabezado del estado actual
   */
  async getNoResultsMessage(): Promise<string> {
    const title = this.getVisibleTitle();

    await expect(title).toBeVisible();

    const rawText = (await title.textContent()) ?? "";
    const cleanText = rawText.trim();

    logger.info(
      `[MerchantSearch] Mensaje visible detectado en estado actual: [${cleanText}]`,
    );

    return cleanText;
  }

  /**
   * Indica si existe un título visible en el estado actual del buscador.
   *
   * @returns `true` si el título visible está presente; de lo contrario `false`
   */
  async isTitleVisible(): Promise<boolean> {
    return await this.getVisibleTitle().isVisible();
  }

  /**
   * Obtiene los textos visibles de los resultados actuales del buscador.
   *
   * @returns Lista de textos visibles en los resultados activos
   */
  async getResultTexts(): Promise<string[]> {
    const container = this.getVisibleResultsContainer();
    const items = this.getVisibleResultItems();

    await expect(container).toBeVisible();

    const texts = await items.allTextContents();

    return texts.map((text) => text.trim()).filter(Boolean);
  }

  /**
   * Selecciona un comercio de la lista de resultados según su posición.
   *
   * @param index Posición del resultado a seleccionar
   */
  async selectResultByIndex(index: number): Promise<void> {
    const item = this.getVisibleResultItems().nth(index);

    await expect(item).toBeVisible();
    await item.click();

    logger.info(
      `[MerchantSearch] Resultado seleccionado correctamente en el índice [${index}].`,
    );
  }

  /**
   * Extrae los identificadores de comercio desde los resultados visibles.
   *
   * @returns Lista de identificadores detectados en resultados actuales
   */
  async getMerchantIdsFromResults(): Promise<number[]> {
    const items = await this.getVisibleResultItems().allTextContents();

    const ids = items
      .map((text) => {
        const match = text.match(/#(\d+)/);
        return match ? Number(match[1]) : null;
      })
      .filter((value): value is number => value !== null);

    logger.info(
      `[MerchantSearch] IDs de comercios extraídos desde resultados activos: [${ids.join(", ")}]`,
    );

    return ids;
  }

  /**
   * Indica si el contenedor de resultados activo se encuentra visible.
   *
   * @returns `true` si el contenedor visible está presente; de lo contrario `false`
   */
  async isResultsContainerVisible(): Promise<boolean> {
    return await this.getVisibleResultsContainer().isVisible();
  }

  /**
   * Obtiene el primer contenedor visible del componente.
   *
   * Nota:
   * El buscador puede mostrar distintos estados en distintos contenedores.
   * Este helper retorna el primero que realmente se encuentra visible.
   */
  private getVisibleResultsContainer(): Locator {
    return this.resultsContainers.filter({ visible: true }).first();
  }

  /**
   * Obtiene el primer título visible dentro del buscador.
   *
   * Este helper permite al spec validar el estado funcional
   * sin acoplar el POM a mensajes esperados de negocio.
   */
  private getVisibleTitle(): Locator {
    return this.resultsTitles.filter({ visible: true }).first();
  }

  /**
   * Obtiene los elementos visibles de la lista activa del buscador.
   *
   * El cálculo siempre se deriva del contenedor actualmente visible.
   */
  private getVisibleResultItems(): Locator {
    return this.getVisibleResultsContainer().locator(".results-list-element");
  }
}

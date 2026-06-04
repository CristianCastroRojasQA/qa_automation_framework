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
  /**
   * Locators internos del componente.
   *
   * Criterio de diseño:
   * Los elementos interactivos del buscador se resuelven utilizando
   * como contexto principal el contenedor `app-merchant-search-modal`,
   * con el fin de:
   * - aislar el componente del DOM global
   * - reducir riesgo de colisiones con otros overlays
   * - mantener estabilidad frente a cambios estructurales externos
   */
  private readonly searchButton: Locator;
  private readonly searchInput: Locator;
  private readonly resultItems: Locator;
  private readonly resultsContainer: Locator;
  private readonly noResultsMessage: Locator;

  /**
   * Inicializa los selectores del buscador global de comercios.
   *
   * Se utiliza el modal del buscador como scope lógico del componente,
   * permitiendo encapsular toda la interacción dentro del overlay Angular
   * sin depender de la estructura general de la página.
   *
   * @param page Instancia activa de Playwright Page.
   */
  constructor(page: Page) {
    this.searchButton = page.locator(".custom-dropdown-button");
    const modal = page.locator("app-merchant-search-modal");
    this.searchInput = modal.locator("input[name='search']");
    this.resultsContainer = modal.locator(".results-container");
    this.resultItems = modal.locator(".results-list-element");
    this.noResultsMessage = modal.locator(".results-title span");
  }

  /**
   * Abre el buscador global de comercios desde la interfaz principal.
   *
   * Flujo:
   * 1. Ejecuta click sobre el disparador del buscador
   * 2. Espera a que el campo de búsqueda quede visible
   *
   * Resultado esperado:
   * El componente queda disponible para iniciar interacción del usuario
   * y ejecutar búsquedas dentro del contexto de la funcionalidad
   * de búsqueda rápida de comercios.
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
   *
   * Este método es útil cuando el flujo requiere garantizar
   * que el buscador quedó correctamente preparado antes de ejecutar
   * acciones de búsqueda o validaciones posteriores.
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
   * Vinculación funcional:
   * Este método representa el flujo principal asociado a la
   * User Story 373109 - CHBC111 Búsqueda rápida de Comercios.
   *
   * Comportamiento:
   * - registra en logs el criterio de búsqueda utilizado
   * - ingresa el valor en el campo del buscador
   * - dispara la búsqueda mediante la tecla ENTER
   * - espera a que el contenedor de resultados esté disponible
   * - retorna la cantidad de resultados visibles obtenidos
   *
   * @param value Criterio de búsqueda ingresado por el usuario
   * @returns Número de resultados encontrados y visibles en pantalla
   */
  async searchByEnter(value: string): Promise<number> {
    logger.info(
      `[MerchantSearch] Ejecutando búsqueda con criterio: [${value}]`,
    );

    await this.searchInput.fill(value);
    await this.searchInput.press("Enter");

    await this.resultsContainer.waitFor();

    const count = await this.resultItems.count();

    logger.info(
      `[MerchantSearch] Búsqueda ejecutada correctamente. Resultados obtenidos: [${count}]`,
    );

    return count;
  }

  /**
   * Valida la disponibilidad del historial de búsquedas del usuario.
   *
   * Comportamiento:
   * - verifica que el contenedor de resultados esté visible
   * - cuenta los elementos actualmente expuestos en pantalla
   * - registra en logs la cantidad detectada
   *
   * Este método permite validar que el buscador conserva
   * y expone información previa relevante para la experiencia de usuario.
   *
   * @returns Número de elementos visibles en el historial de búsqueda
   */
  async validateSearchHistory(): Promise<number> {
    await expect(this.resultsContainer).toBeVisible();

    const count = await this.resultItems.count();

    logger.info(
      `[MerchantSearch] Historial de búsqueda visible. Elementos detectados: [${count}]`,
    );

    return count;
  }

  /**
   * Valida el mensaje de estado vacío cuando la búsqueda
   * no retorna coincidencias.
   *
   * Flujo:
   * 1. Verifica que el contenedor de resultados esté visible
   * 2. Valida la presencia del mensaje de "Comercio no encontrado"
   * 3. Comprueba que el texto mostrado coincida con el esperado
   *
   * Este método cubre el comportamiento esperado del componente
   * ante escenarios donde no existen resultados para el criterio ingresado.
   *
   * @param text Texto esperado del mensaje de no resultados
   */
  async expectNoResultsMessage(text: string): Promise<void> {
    await expect(this.resultsContainer).toBeVisible();

    const msg = this.noResultsMessage;

    await expect(msg).toBeVisible();
    await expect(msg).toContainText(text);

    logger.info(
      `[MerchantSearch] Mensaje de no resultados validado correctamente: [${text}]`,
    );
  }

  /**
   * Selecciona un comercio de la lista de resultados según su posición.
   *
   * Flujo:
   * 1. Resuelve el elemento correspondiente al índice recibido
   * 2. Verifica que el resultado sea visible
   * 3. Ejecuta click sobre el comercio seleccionado
   *
   * Este método abstrae la interacción directa con la lista
   * y permite a los tests seleccionar resultados sin depender
   * de detalles del DOM o de la estructura visual del overlay.
   *
   * @param index Posición del resultado a seleccionar
   */
  async selectResultByIndex(index: number): Promise<void> {
    const item = this.resultItems.nth(index);

    await expect(item).toBeVisible();
    await item.click();

    logger.info(
      `[MerchantSearch] Resultado seleccionado correctamente en el índice [${index}].`,
    );
  }

  /**
   * Extrae los identificadores de comercio desde los resultados visibles.
   *
   * Comportamiento:
   * - obtiene el texto completo de cada resultado expuesto
   * - aplica parsing para identificar patrones con formato `#<id>`
   * - transforma los valores detectados a tipo numérico
   * - retorna únicamente IDs válidos
   *
   * Este helper facilita validaciones funcionales o comparaciones
   * posteriores sobre los comercios retornados por la búsqueda.
   *
   * @returns Lista de identificadores de comercio detectados en resultados
   */
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

  /**
   * Indica si el contenedor de resultados se encuentra visible.
   *
   * Este helper permite realizar validaciones rápidas sobre el estado
   * general del buscador sin depender del contenido puntual devuelto
   * por la búsqueda o el historial.
   *
   * @returns `true` si el contenedor de resultados está visible;
   * de lo contrario, `false`
   */
  async isResultsContainerVisible(): Promise<boolean> {
    return await this.resultsContainer.isVisible();
  }
}

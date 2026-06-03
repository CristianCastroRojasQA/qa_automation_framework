import { NavbarMessages } from "@paystudio/constants/navbar/navbar.messages";
import { expect, Locator, Page } from "@playwright/test";
import { logger } from "@utils/logger";

/**
 * Componente del modal de Fechas de Negocio de PayStudio.
 *
 * Encapsula la interacción con el modal y centraliza sus acciones principales:
 * - consulta de la fecha de negocio expuesta en la grilla
 * - cierre controlado del modal
 *
 * Su objetivo es desacoplar los tests de los selectores específicos
 * y garantizar una interacción consistente con este componente del sistema.
 */
export class BusinessDateModal {
  /**
   * Locators internos del modal.
   *
   * Todos los elementos se resuelven a partir del contenedor raíz
   * para mantener aislamiento de contexto y evitar colisiones
   * con otros modales o estructuras similares.
   */
  private readonly root: Locator;
  private readonly dateCell: Locator;
  private readonly closeButton: Locator;

  /**
   * Inicializa los selectores asociados al modal de Fechas de Negocio.
   *
   * Se utiliza `#businessDateControl` como contenedor raíz
   * para acotar la búsqueda de elementos al contexto del modal.
   *
   * @param page Instancia activa de Playwright Page.
   */
  constructor(page: Page) {
    this.root = page.locator("#businessDateControl");

    // Celda que contiene la fecha de negocio (fila de datos relevante en la tabla)
    this.dateCell = this.root
      .locator("[id$='businessDatesTable'] tbody tr")
      .nth(1)
      .locator("td")
      .nth(1);

    // Botón de cierre del modal (footer)
    this.closeButton = this.root.locator(".modal-footer a.btn", {
      hasText: NavbarMessages.MODAL_CLOSE_BUTTON,
    });
  }

  /**
   * Obtiene la fecha de negocio mostrada en el modal.
   *
   * Comportamiento:
   * - valida que la celda sea visible antes de interactuar
   * - extrae y normaliza el texto de la fecha
   * - registra la fecha obtenida en logs
   * - valida que el valor exista (fail-fast)
   * - compara con la fecha actual para detectar posibles desfases
   *
   * @returns Fecha de negocio en formato `dd/MM/yyyy`
   * @example "03/06/2026"
   *
   * @throws Error si no se encuentra valor en la celda
   */
  async getBusinessDate(): Promise<string> {
    await expect(this.dateCell).toBeVisible();

    const rawText = (await this.dateCell.textContent()) ?? "";
    const cleanText = rawText.trim();

    logger.info(`Fecha de negocio detectada: [${cleanText}]`);

    if (!cleanText) {
      throw new Error("No se encontró la fecha de negocio.");
    }

    const today = new Date().toLocaleDateString("es-CO");

    if (cleanText !== today) {
      logger.warn(
        `La fecha de negocio (${cleanText}) es diferente a la fecha actual (${today}).`,
      );
    }

    return cleanText;
  }

  /**
   * Ejecuta el cierre controlado del modal de Fechas de Negocio.
   *
   * Flujo:
   * 1. Verifica disponibilidad del botón de cierre
   * 2. Ejecuta el click en el footer del modal
   * 3. Registra trazabilidad de la acción
   */
  async close(): Promise<void> {
    logger.info("Cerrando modal de Fechas de Negocio.");

    await expect(this.closeButton).toBeVisible();
    await this.closeButton.click();

    logger.debug("Click en botón Cerrar ejecutado.");
  }
}
``;

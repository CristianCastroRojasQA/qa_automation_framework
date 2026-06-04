import { NavbarMessages } from "@paystudio/test-data/navbar/navbar.constants";
import { expect, Locator, Page } from "@playwright/test";
import { logger } from "@utils/logger";

/**
 * Componente del modal "Acerca de la versión" disponible desde el navbar de PayStudio.
 *
 * Centraliza la interacción con el modal y encapsula sus acciones principales:
 * - consultar la versión del assembly visible en pantalla
 * - ejecutar el cierre del modal desde su footer
 *
 * Su objetivo es evitar que los tests consuman selectores directos
 * y mantener la lógica del modal desacoplada del flujo de prueba.
 */
export class AboutModal {
  /**
   * Locators internos del modal.
   *
   * Todos los elementos se resuelven a partir del contenedor raíz
   * para mantener el scope aislado y reducir riesgo de colisiones
   * con otros modales o elementos similares en la página.
   */
  private readonly root: Locator;
  private readonly assemblyVersion: Locator;
  private readonly closeButton: Locator;

  /**
   * Inicializa los selectores asociados al modal.
   *
   * Se utiliza `#about` como contenedor raíz para acotar
   * todas las búsquedas al contexto específico del modal.
   *
   * @param page Instancia activa de Playwright Page.
   */
  constructor(page: Page) {
    this.root = page.locator("#about");

    this.assemblyVersion = this.root.locator(
      "[id$='AssemblyFileVersionAttribute']",
    );

    this.closeButton = this.root.locator(".modal-footer a.btn", {
      hasText: NavbarMessages.MODAL_CLOSE_BUTTON,
    });
  }

  /**
   * Obtiene la versión del assembly mostrada en el modal.
   *
   * Comportamiento:
   * - valida que el campo de versión sea visible
   * - extrae el texto mostrado en pantalla
   * - normaliza espacios en blanco antes de retornarlo
   * - registra el valor detectado en logs
   *
   * @returns Versión del sistema en formato esperado `X.Y.Z.W`
   * @example "23.0.1.0"
   */
  async getVersion(): Promise<string> {
    await expect(this.assemblyVersion).toBeVisible();

    const rawText = (await this.assemblyVersion.textContent()) ?? "";
    const cleanText = rawText.trim();

    logger.info(`[AboutModal] Versión del Assembly detectada: [${cleanText}]`);

    return cleanText;
  }

  /**
   * Ejecuta el cierre controlado del modal "Acerca de la versión".
   *
   * Flujo:
   * 1. Verifica disponibilidad del botón de cierre
   * 2. Ejecuta la acción de cierre sobre el footer del modal
   * 3. Registra trazabilidad básica del evento
   */
  async close(): Promise<void> {
    logger.info('[AboutModal] Cerrando modal "Acerca de la versión".');

    await expect(this.closeButton).toBeVisible();
    await this.closeButton.click();

    logger.debug("[AboutModal] Click en botón Cerrar ejecutado.");
  }
}

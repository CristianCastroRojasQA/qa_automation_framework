import { AuthMessages } from "@paystudio/constants/auth/auth.messages";
import { expect, Locator, Page } from "@playwright/test";
import { logger } from "@utils/logger";

/**
 * Page Object de la pantalla de cierre de sesión de PayStudio.
 *
 * Contexto funcional:
 * Esta página representa el paso final del flujo de logout una vez
 * que el usuario decide cerrar su sesión dentro del sistema.
 *
 * Responsabilidades encapsuladas:
 * - validación del mensaje informativo de cierre de sesión
 * - confirmación explícita del logout mediante la acción correspondiente
 *
 * Su propósito es desacoplar los tests de la pantalla de confirmación
 * y proporcionar una API clara y mantenible para validar el cierre
 * controlado de sesión dentro del flujo de autenticación.
 */
export class LogoutPage {
  /**
   * Locators internos de la pantalla de logout.
   *
   * Criterio de diseño:
   * - se utilizan selectores por sufijo (`[id$='...']`) para elementos ASP.NET
   * - se evita dependencia de IDs absolutos generados dinámicamente
   * - se utiliza selector accesible por rol para el botón de confirmación
   *
   * Este enfoque mejora la estabilidad del framework frente a cambios
   * estructurales del layout o de la jerarquía de MasterPages.
   */
  private readonly logoutMessage: Locator;
  private readonly confirmButton: Locator;

  /**
   * Inicializa los selectores de la pantalla de logout.
   *
   * Consideraciones:
   * - el mensaje principal permite validar el estado funcional del cierre de sesión
   * - el botón de confirmación completa la salida del usuario del sistema
   *
   * @param page Instancia activa de Playwright Page.
   */
  constructor(page: Page) {
    this.logoutMessage = page.locator("[id$='LogoutControl1_LabelLogout']");
    this.confirmButton = page.getByRole("button", { name: "Aceptar" }).first();
  }

  /**
   * Indica si la pantalla de logout se encuentra visible.
   *
   * Este helper permite validar rápidamente que el flujo de cierre de sesión
   * redirigió correctamente a la pantalla de confirmación correspondiente.
   *
   * @returns `true` si el mensaje principal de logout está visible;
   * de lo contrario, `false`
   */
  async isVisible(): Promise<boolean> {
    return await this.logoutMessage.isVisible();
  }

  /**
   * Obtiene el mensaje mostrado durante el flujo de cierre de sesión.
   *
   * Comportamiento:
   * - espera a que el mensaje esté visible antes de leerlo
   * - normaliza espacios en blanco del contenido obtenido
   * - registra en logs el texto detectado para trazabilidad
   *
   * Este método permite validar el contenido funcional presentado
   * al usuario como parte del proceso de logout.
   *
   * @returns Texto limpio del mensaje de cierre de sesión
   */
  async getLogoutMessage(): Promise<string> {
    await this.logoutMessage.waitFor({ state: "visible" });

    const rawText = (await this.logoutMessage.textContent()) ?? "";
    const cleanText = rawText.trim();

    logger.info(`Mensaje logout detectado: "${cleanText}"`);

    return cleanText;
  }

  /**
   * Ejecuta el flujo completo de confirmación de logout.
   *
   * Flujo:
   * 1. Obtiene el mensaje visible de cierre de sesión
   * 2. Valida que el contenido corresponda al mensaje esperado
   * 3. Ejecuta la confirmación mediante el botón "Aceptar"
   *
   * Este método consolida la validación funcional del logout exitoso
   * y la acción final requerida para completar la salida del sistema.
   */
  async confirmLogout(): Promise<void> {
    const message = await this.getLogoutMessage();

    expect(message).toContain(AuthMessages.LOGOUT_SUCCESS);

    await this.confirmButton.click();

    logger.debug("Logout confirmado y botón Aceptar clickeado.");
  }
}

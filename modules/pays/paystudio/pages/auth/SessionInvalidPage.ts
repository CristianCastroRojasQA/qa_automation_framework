import { AuthMessages } from "@paystudio/constants/auth/auth.messages";
import { expect, Locator, Page } from "@playwright/test";
import { logger } from "@utils/logger";

/**
 * Page Object de la pantalla de sesión inválida de PayStudio.
 *
 * Contexto funcional:
 * Esta página representa el estado mostrado por el sistema cuando
 * la sesión del usuario deja de ser válida, ya sea por expiración
 * o por intento de interacción sin autenticación vigente.
 *
 * Responsabilidades encapsuladas:
 * - validación del mensaje informativo de sesión inválida
 * - confirmación de la acción requerida por el usuario
 * - soporte a escenarios de expiración o invalidación de sesión
 *
 * Su propósito es desacoplar los tests de esta pantalla transicional
 * y proporcionar una API clara y mantenible para validar el comportamiento
 * del sistema ante estados de sesión no válida.
 */
export class SessionInvalidPage {
  /**
   * Locators internos de la pantalla de sesión inválida.
   *
   * Criterio de diseño:
   * - se utilizan selectores por sufijo (`[id$='...']`) para elementos ASP.NET
   * - se evita dependencia de IDs absolutos generados dinámicamente
   * - se utiliza selector accesible por rol para el botón de confirmación
   *
   * Este enfoque mejora la resiliencia del framework frente a cambios
   * estructurales del layout o de la jerarquía de MasterPages.
   */
  private readonly invalidSessionMessage: Locator;
  private readonly acceptButton: Locator;

  /**
   * Inicializa los selectores de la pantalla de sesión inválida.
   *
   * Consideraciones:
   * - el mensaje principal permite validar el estado funcional expuesto por el sistema
   * - el botón de aceptación completa la interacción requerida por el usuario
   *   para continuar después del evento de sesión inválida
   *
   * @param page Instancia activa de Playwright Page.
   */
  constructor(page: Page) {
    this.invalidSessionMessage = page.locator("[id$='Control_LabelLogout']");
    this.acceptButton = page.getByRole("button", { name: "Aceptar" }).first();
  }

  /**
   * Indica si la pantalla de sesión inválida se encuentra visible.
   *
   * Este helper permite validar rápidamente que el sistema redirigió
   * al usuario al estado esperado cuando la sesión ya no es válida.
   *
   * @returns `true` si el mensaje de sesión inválida está visible;
   * de lo contrario, `false`
   */
  async isVisible(): Promise<boolean> {
    return await this.invalidSessionMessage.isVisible();
  }

  /**
   * Obtiene el mensaje de sesión inválida mostrado en pantalla.
   *
   * Comportamiento:
   * - espera a que el mensaje esté visible antes de leerlo
   * - normaliza espacios en blanco del contenido obtenido
   * - registra en logs el texto detectado para trazabilidad
   *
   * Este método permite validar el contenido funcional expuesto
   * al usuario cuando el sistema detecta una sesión no válida.
   *
   * @returns Texto limpio del mensaje de sesión inválida
   */
  async getInvalidSessionMessage(): Promise<string> {
    await this.invalidSessionMessage.waitFor({ state: "visible" });

    const rawText = (await this.invalidSessionMessage.textContent()) ?? "";
    const cleanText = rawText.trim();

    logger.info(`Mensaje de sesión inválida detectado: "${cleanText}"`);

    return cleanText;
  }

  /**
   * Valida que el mensaje funcional de sesión inválida
   * corresponda al texto esperado por el sistema.
   *
   * Comportamiento:
   * - verifica que el contenido visible contenga el mensaje configurado
   * - registra en logs la validación exitosa
   *
   * Este método permite asegurar la consistencia del mensaje
   * presentado al usuario en escenarios de sesión expirada o inválida.
   */
  async validateInvalidSessionMessage(): Promise<void> {
    await expect(this.invalidSessionMessage).toContainText(
      AuthMessages.SESSION_INVALID,
    );

    logger.info("Mensaje de sesión inválida validado correctamente.");
  }

  /**
   * Ejecuta el flujo completo de aceptación de sesión inválida.
   *
   * Flujo:
   * 1. Valida el mensaje funcional mostrado por el sistema
   * 2. Ejecuta la confirmación mediante el botón "Aceptar"
   *
   * Este método consolida la validación del estado de sesión inválida
   * y la acción final requerida para cerrar o aceptar dicho mensaje.
   */
  async acceptInvalidSession(): Promise<void> {
    await this.validateInvalidSessionMessage();

    await this.acceptButton.click();

    logger.debug("Sesión inválida confirmada y botón Aceptar clickeado.");
  }
}

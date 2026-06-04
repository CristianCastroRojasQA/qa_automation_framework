import { Locator, Page } from "@playwright/test";
import { logger } from "@utils/logger";

/**
 * Page Object de la pantalla de autenticación de PayStudio.
 *
 * Contexto funcional:
 * Esta página representa el punto de entrada al sistema para usuarios autenticados
 * y centraliza la interacción con el formulario de acceso.
 *
 * Responsabilidades encapsuladas:
 * - navegación hacia la URL del portal
 * - ingreso de credenciales
 * - ejecución del flujo de autenticación
 * - consulta de mensajes de error generales
 * - validación de errores requeridos por campo
 *
 * Su propósito es desacoplar los tests de los detalles del formulario de login
 * y exponer una API clara, reutilizable y mantenible para escenarios
 * de autenticación positiva y negativa.
 */
export class LoginPage {
  /**
   * Referencia a la página activa de Playwright.
   *
   * Se utiliza para:
   * - navegación al portal
   * - sincronización con el documento cargado
   */
  private readonly page: Page;

  /**
   * Locators internos de la pantalla de login.
   *
   * Criterio de diseño:
   * - se utilizan selectores por sufijo (`[id$='...']`) para elementos ASP.NET
   * - se evita dependencia de IDs completos generados dinámicamente
   * - se aprovecha el identificador estable del UserControl (`LoginControl1`)
   *
   * Este enfoque mejora la resiliencia de la automatización frente a cambios
   * en la jerarquía de MasterPage / ContentPlaceHolder.
   */
  private readonly usernameInput: Locator;
  private readonly passwordInput: Locator;
  private readonly loginButton: Locator;
  private readonly errorMessage: Locator;
  private readonly errorMessageUsernameInput: Locator;
  private readonly errorMessagePasswordInput: Locator;

  /**
   * Inicializa los selectores de la página de login.
   *
   * Consideraciones:
   * - los campos y validaciones se resuelven con selectores estables
   * - se separa el mensaje general de autenticación de las validaciones
   *   requeridas por campo para facilitar escenarios positivos y negativos
   *
   * @param page Instancia activa de Playwright Page.
   */
  constructor(page: Page) {
    this.page = page;

    // Campos de entrada de credenciales
    this.usernameInput = page.locator("[id$='LoginControl1_TextBoxUser']");
    this.passwordInput = page.locator("[id$='LoginControl1_TextBoxPassword']");
    this.loginButton = page.getByRole("button", { name: "Ingresar" }).first();

    // Mensaje general de error y validaciones requeridas por campo
    this.errorMessage = page.locator("[id$='LoginControl1_LabelError']");
    this.errorMessageUsernameInput = page.locator(
      "[id$='LoginControl1_RequiredFieldValidatorUser']",
    );
    this.errorMessagePasswordInput = page.locator(
      "[id$='LoginControl1_RequiredFieldValidatorPassword']",
    );
  }

  /**
   * Navega hacia la URL del portal configurado para el entorno actual.
   *
   * Comportamiento:
   * - registra en logs la URL objetivo
   * - ejecuta la navegación al portal
   * - espera la carga base del documento (`domcontentloaded`)
   *
   * Este método actúa como punto de entrada para cualquier flujo
   * de autenticación iniciado desde la página de login.
   *
   * @param url URL destino del portal.
   */
  async navigate(url: string): Promise<void> {
    logger.info(`[LoginPage] Navegando a la URL: [${url}]`);

    await this.page.goto(url, { waitUntil: "domcontentloaded" });
  }

  /**
   * Ejecuta el flujo completo de autenticación con credenciales explícitas.
   *
   * Flujo:
   * 1. Completa el campo de usuario
   * 2. Completa el campo de contraseña
   * 3. Ejecuta la acción de ingreso
   *
   * Comportamiento:
   * - registra en logs el usuario utilizado para trazabilidad
   * - delega en la página el proceso de autenticación
   *
   * Este método cubre el escenario funcional principal de acceso al sistema.
   *
   * @param username Usuario del sistema.
   * @param password Contraseña del usuario.
   */
  async login(username: string, password: string): Promise<void> {
    logger.info(
      `[LoginPage] Intentando autenticación con usuario: [${username}]`,
    );

    await this.usernameInput.fill(username);
    await this.passwordInput.fill(password);
    await this.loginButton.click();

    logger.debug("[LoginPage] Click en botón de ingreso ejecutado.");
  }

  /**
   * Ejecuta el flujo de autenticación utilizando la tecla Enter en lugar del botón de ingreso.
   * * Flujo:
   * 1. Completa el campo de usuario
   * 2. Completa el campo de contraseña
   * 3. Presiona la tecla Enter sobre el campo de contraseña para activar el Default Button del HTML
   *
   * @param username Usuario del sistema.
   * @param password Contraseña del usuario.
   */
  async loginWithEnter(username: string, password: string): Promise<void> {
    logger.info(
      `[LoginPage] Intentando autenticación mediante tecla Enter con usuario: [${username}]`,
    );

    await this.usernameInput.fill(username);
    await this.passwordInput.fill(password);

    // Presionamos Enter directamente en el input de contraseña para disparar el evento nativo
    await this.passwordInput.press("Enter");

    logger.debug(
      "[LoginPage] Evento de teclado 'Enter' enviado al campo Password.",
    );
  }

  /**
   * Obtiene el mensaje general de error mostrado durante la autenticación.
   *
   * Comportamiento:
   * - espera a que el mensaje esté visible antes de leerlo
   * - normaliza espacios en blanco del contenido obtenido
   * - registra en logs el mensaje cuando existe contenido
   *
   * Este método permite validar errores funcionales devueltos
   * por el backend o por la lógica general de autenticación.
   *
   * @returns Texto limpio del mensaje de error detectado
   */
  async getErrorMessage(): Promise<string> {
    await this.errorMessage.waitFor({ state: "visible" });

    const rawText = (await this.errorMessage.textContent()) ?? "";
    const cleanText = rawText.trim();

    if (cleanText) {
      logger.warn(
        `[LoginPage] Error de autenticación detectado: "${cleanText}"`,
      );
    }

    return cleanText;
  }

  /**
   * Indica si el mensaje general de error de autenticación está visible.
   *
   * Este helper permite validar de forma rápida si el proceso
   * de login expuso un error general al usuario.
   *
   * @returns `true` si el mensaje existe y está visible; de lo contrario `false`
   */
  async isErrorVisible(): Promise<boolean> {
    return await this.errorMessage.isVisible();
  }

  /**
   * Indica si la validación requerida del campo usuario se encuentra visible.
   *
   * Este helper cubre escenarios de validación de formulario
   * donde el campo usuario es obligatorio y no fue completado.
   *
   * @returns `true` si la validación del campo usuario está visible; de lo contrario `false`
   */
  async isUsernameErrorVisible(): Promise<boolean> {
    return await this.errorMessageUsernameInput.isVisible();
  }

  /**
   * Indica si la validación requerida del campo contraseña se encuentra visible.
   *
   * Este helper cubre escenarios de validación de formulario
   * donde el campo contraseña es obligatorio y no fue completado.
   *
   * @returns `true` si la validación del campo contraseña está visible; de lo contrario `false`
   */
  async isPasswordErrorVisible(): Promise<boolean> {
    return await this.errorMessagePasswordInput.isVisible();
  }
}

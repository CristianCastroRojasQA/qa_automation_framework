import { Locator, Page } from "@playwright/test";
import { logger } from "../../../../../utils/logger";

/**
 * Representa la página de autenticación de PayStudio.
 * Implementa el patrón Page Object Model (POM)
 * para encapsular la interacción con:
 * - campos de login
 * - botones
 * - validaciones
 * - mensajes de error
 */
export class LoginPage {
  private readonly page: Page;

  // Elementos de la página (Locators)
  private readonly usernameInput: Locator;
  private readonly passwordInput: Locator;
  private readonly loginButton: Locator;
  private readonly errorMessage: Locator;
  private readonly errorMessageUsernameInput: Locator;
  private readonly errorMessagePasswordInput: Locator;

  /**
   * Inicializa los selectores de la página de login.
   * Nota: Se utilizan selectores basados en ID dinámicos de ASP.NET.
   * @param page - Instancia de la página de Playwright.
   */
  constructor(page: Page) {
    this.page = page;

    // Campos de entrada de credenciales
    this.usernameInput = page.locator(
      "#ctl00_CphContent_LoginControl1_TextBoxUser",
    );
    this.passwordInput = page.locator(
      "#ctl00_CphContent_LoginControl1_TextBoxPassword",
    );
    this.loginButton = page.getByRole("button", { name: "Ingresar" }).first();

    // Selectores para mensajes de validación y errores de backend
    this.errorMessage = page.locator(
      "#ctl00_CphContent_LoginControl1_LabelError",
    );
    this.errorMessageUsernameInput = page.locator(
      "#ctl00_CphContent_LoginControl1_RequiredFieldValidatorUser",
    );
    this.errorMessagePasswordInput = page.locator(
      "#ctl00_CphContent_LoginControl1_RequiredFieldValidatorPassword",
    );
  }

  /**
   * Navega hacia la URL del entorno configurado.
   * @param url URL destino del portal.
   */
  async navigate(url: string): Promise<void> {
    logger.info(`Navegando a la URL: [${url}]`);

    await this.page.goto(url);
  }

  /**
   * Ejecuta el flujo completo de autenticación.
   *
   * Flujo:
   * 1. Completa usuario
   * 2. Completa contraseña
   * 3. Ejecuta click de ingreso
   *
   * @param username Usuario del sistema.
   * @param password Contraseña del usuario.
   */
  async login(username: string, password: string): Promise<void> {
    logger.info(`Intentando autenticación con usuario: [${username}]`);

    await this.usernameInput.fill(username);
    await this.passwordInput.fill(password);
    await this.loginButton.click();

    logger.debug("Click en botón de ingreso ejecutado.");
  }

  /**
   * Obtiene el mensaje de error mostrado durante el proceso de autenticación.
   * @returns Texto del mensaje detectado.
   */
  async getErrorMessage(): Promise<string> {
    const errorText = await this.errorMessage.innerText();

    if (errorText) {
      logger.warn(`Error de autenticación detectado: "${errorText}"`);
    }

    return errorText;
  }

  /**
   * Espera hasta que el mensaje de error principal sea visible en pantalla.
   */
  async waitForErrorMessage(): Promise<void> {
    await this.errorMessage.waitFor({ state: "visible" });
  }

  /**
   * Verifica si el mensaje general de error está visible.
   * @returns True si el error existe y es visible.
   */
  async isErrorVisible(): Promise<boolean> {
    return await this.errorMessage.isVisible();
  }

  /**
   * Verifica si la validación requerida del campo usuario está activa.
   * @returns True si la validación es visible.
   */
  async isUsernameErrorVisible(): Promise<boolean> {
    return await this.errorMessageUsernameInput.isVisible();
  }

  /**
   * Verifica si la validación requerida del campo contraseña está activa.
   * @returns True si la validación es visible.
   */
  async isPasswordErrorVisible(): Promise<boolean> {
    return await this.errorMessagePasswordInput.isVisible();
  }
}

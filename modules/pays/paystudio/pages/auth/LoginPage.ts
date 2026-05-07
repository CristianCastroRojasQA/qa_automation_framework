import { Locator, Page } from "@playwright/test";

/**
 * Representa la página de inicio de sesión de PayStudio.
 * Proporciona métodos para interactuar con los inputs de credenciales y mensajes de error.
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

  constructor(page: Page) {
    this.page = page;

    // Nota: Se utilizan selectores basados en ID de ASP.NET
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
   * Navega a la URL especificada para el portal.
   * @param url - Dirección del entorno (obtenida usualmente desde settings)
   */
  async navigate(url: string): Promise<void> {
    await this.page.goto(url);
  }

  /**
   * Realiza el flujo completo de autenticación.
   * @param username - Nombre de usuario
   * @param password - Contraseña
   */
  async login(username: string, password: string): Promise<void> {
    await this.usernameInput.fill(username);
    await this.passwordInput.fill(password);
    await this.loginButton.click();
  }

  /**
   * Espera a que el mensaje de error principal sea visible en la pantalla.
   */
  async waitForErrorMessage(): Promise<void> {
    await this.errorMessage.waitFor({ state: "visible" });
  }

  /**
   * Obtiene el texto del mensaje de error mostrado por el servidor.
   */
  async getErrorMessage(): Promise<string> {
    return await this.errorMessage.innerText();
  }

  /**
   * Verifica si el mensaje de error general es visible.
   */
  async isErrorVisible(): Promise<boolean> {
    return await this.errorMessage.isVisible();
  }

  /**
   * Valida si el mensaje de campo obligatorio del usuario está presente.
   */
  async isUsernameErrorVisible(): Promise<boolean> {
    return await this.errorMessageUsernameInput.isVisible();
  }

  /**
   * Valida si el mensaje de campo obligatorio de la contraseña está presente.
   */
  async isPasswordErrorVisible(): Promise<boolean> {
    return await this.errorMessagePasswordInput.isVisible();
  }
}

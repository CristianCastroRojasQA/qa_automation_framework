import { Locator, Page } from "@playwright/test";
import { logger } from "@utils/logger";

/**
 * Page Object Model de LoginPage
 */
export class LoginPage {
  private readonly page: Page;

  private readonly passwordInput: Locator;
  private readonly usernameInput: Locator;
  private readonly loginButton: Locator;

  readonly errorMessage: Locator;
  readonly usernameError: Locator;
  readonly passwordError: Locator;

  constructor(page: Page) {
    this.page = page;

    this.usernameInput = page.locator("[id$='LoginControl1_TextBoxUser']");

    this.passwordInput = page.locator("[id$='LoginControl1_TextBoxPassword']");

    this.loginButton = page.getByRole("button", { name: "Ingresar" });

    this.errorMessage = page.locator("[id$='LoginControl1_LabelError']");

    this.usernameError = page.locator(
      "[id$='LoginControl1_RequiredFieldValidatorUser']",
    );
    
    this.passwordError = page.locator(
      "[id$='LoginControl1_RequiredFieldValidatorPassword']",
    );
  }

  /**
   * Llena credenciales de usuario
   */
  private async fillCredentials(
    username: string,
    password: string,
  ): Promise<void> {
    await this.usernameInput.fill(username);
    await this.passwordInput.fill(password);
  }

  /**
   * Navega a la página de login
   */
  async goto(url: string): Promise<void> {
    logger.info(`[LoginPage] Navegando a ${url}`);
    await this.page.goto(url, { waitUntil: "domcontentloaded" });
  }

  /**
   * Login con botón Ingresar
   */
  async login(username: string, password: string): Promise<void> {
    logger.info(
      `[LoginPage] Login iniciado (user=${username ? "informado" : "empty"})`,
    );

    await this.fillCredentials(username, password);
    await this.loginButton.click();

    logger.info(
      "[LoginPage] Formulario de login enviado (click en 'Ingresar')",
    );
  }

  /**
   * Login usando tecla Enter
   */
  async loginWithEnter(username: string, password: string): Promise<void> {
    logger.info(
      `[LoginPage] Login iniciado (user=${username ? "informado" : "empty"})`,
    );

    await this.fillCredentials(username, password);
    await this.passwordInput.press("Enter");

    logger.info("[LoginPage] Formulario enviado mediante tecla Enter");
  }
}

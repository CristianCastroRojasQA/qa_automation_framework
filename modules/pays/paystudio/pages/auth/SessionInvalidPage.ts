import { Locator, Page } from "@playwright/test";
import { logger } from "@utils/logger";

const sessionInvalidPageLogger = logger.child({
  module: "SessionInvalidPage",
});

/**
 * Page Object Model de SessionInvalidPage
 */
export class SessionInvalidPage {
  readonly invalidSessionMessage: Locator;
  readonly acceptButton: Locator;

  constructor(page: Page) {
    this.invalidSessionMessage = page.locator("[id$='Control_LabelLogout']");

    this.acceptButton = page.getByRole("button", { name: "Aceptar" });
  }

  /**
   * Confirma la alerta de sesión inválida
   */
  async clickAccept(): Promise<void> {
    sessionInvalidPageLogger.info(
      "Click en botón 'Aceptar' (confirmar sesión inválida)",
    );

    await this.acceptButton.click();
  }
}

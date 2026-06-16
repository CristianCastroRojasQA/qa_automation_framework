import { Locator, Page } from "@playwright/test";
import { logger } from "@utils/logger";

/**
 * Page Object Model de LogoutPage
 */
export class LogoutPage {
  readonly logoutMessage: Locator;
  readonly confirmButton: Locator;

  constructor(page: Page) {
    this.logoutMessage = page.locator("[id$='LogoutControl1_LabelLogout']");

    this.confirmButton = page.getByRole("button", { name: "Aceptar" });
  }

  /**
   * Confirma el logout haciendo click en el botón Aceptar
   */
  async clickConfirmLogout(): Promise<void> {
    logger.info("[LogoutPage] Click en botón 'Aceptar' para confirmar logout");

    await this.confirmButton.click();
  }
}

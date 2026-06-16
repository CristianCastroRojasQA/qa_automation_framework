import { Locator, Page } from "@playwright/test";
import { NavbarMessages } from "@paystudio/test-data/navbar/navbar.constants";
import { logger } from "@utils/logger";

/**
 * Page Object Model del modal Business Date
 */
export class BusinessDateModal {
  private readonly root: Locator;
  private readonly dateCell: Locator;
  private readonly closeButton: Locator;

  constructor(page: Page) {
    this.root = page.locator("#businessDateControl");

    this.dateCell = this.root.getByRole("row").nth(1).getByRole("cell").nth(1);

    this.closeButton = this.root.getByRole("link", {
      name: NavbarMessages.MODAL_CLOSE_BUTTON,
    });
  }

  /**
   * Obtiene la fecha de negocio
   */
  async getBusinessDate(): Promise<string> {
    const text = await this.dateCell.textContent();
    const clean = (text ?? "").trim();

    logger.info(`[BusinessDateModal] fecha: "${clean}"`);

    return clean;
  }

  /**
   * Cierra el modal
   */
  async close(): Promise<void> {
    await this.closeButton.click();

    logger.debug("[BusinessDateModal] modal cerrado");
  }
}

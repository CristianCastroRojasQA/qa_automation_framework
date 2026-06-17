import { Locator, Page } from "@playwright/test";
import { NavbarMessages } from "@paystudio/test-data/navbar/navbar.constants";
import { logger } from "@utils/logger";

const aboutModalLogger = logger.child({ module: "AboutModal" });

/**
 * Page Object Model del modal About
 */
export class AboutModal {
  private readonly root: Locator;
  private readonly assemblyVersion: Locator;
  private readonly closeButton: Locator;

  constructor(page: Page) {
    this.root = page.locator("#about");

    this.assemblyVersion = this.root.locator(
      "[id$='AssemblyFileVersionAttribute']",
    );

    this.closeButton = this.root.getByRole("link", {
      name: NavbarMessages.MODAL_CLOSE_BUTTON,
    });
  }

  /**
   * Obtiene la versión de la aplicación
   */
  async getVersion(): Promise<string> {
    const text = await this.assemblyVersion.textContent();
    const clean = (text ?? "").trim();

    logger.info(`Versión capturada: "${clean}"`);

    return clean;
  }

  /**
   * Cierra el modal
   */
  async close(): Promise<void> {
    await this.closeButton.click();

    logger.info("Modal cerrado");
  }
}

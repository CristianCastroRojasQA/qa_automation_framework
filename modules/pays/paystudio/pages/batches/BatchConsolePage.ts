import { Locator, Page } from "@playwright/test";
import { logger } from "@utils/logger";

const batchConsoleLogger = logger.child({ module: "BatchConsolePage" });

/**
 * Page Object Model de la pantalla Consola Batch.
 */
export class BatchConsolePage {
  private readonly page: Page;

  readonly processGroupsTitle: Locator;
  readonly selectedBatchGroupTitle: Locator;

  constructor(page: Page) {
    this.page = page;

    this.processGroupsTitle = page.locator("[id$='batchListTitle']");
    this.selectedBatchGroupTitle = page.locator(
      "[id$='selectedBatchGroupTitle']",
    );
  }

  /**
   * Retorna el enlace de un grupo de procesos por nombre exacto.
   */
  getProcessGroupByName(groupName: string): Locator {
    return this.page.locator("ul.nav.nav-list").getByRole("link", {
      name: groupName,
      exact: true,
    });
  }

  /**
   * Selecciona un grupo de procesos en la Consola Batch.
   */
  async selectProcessGroup(groupName: string): Promise<void> {
    await this.getProcessGroupByName(groupName).click();

    batchConsoleLogger.info(`Grupo de procesos seleccionado: [${groupName}]`);
  }

  /**
   * Obtiene el texto del grupo de procesos activo.
   */
  async getSelectedBatchGroupTitleText(): Promise<string> {
    const title =
      (await this.selectedBatchGroupTitle.textContent())?.trim() ?? "";

    batchConsoleLogger.info(`Grupo de procesos activo leído: [${title}]`);

    return title;
  }
}

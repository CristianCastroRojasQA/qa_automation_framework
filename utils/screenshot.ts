import { Page, Locator, TestInfo } from "@playwright/test";
import { logger } from "./logger";

/**
 * Captura una evidencia visual del estado actual de la aplicación.
 * La evidencia se adjunta al reporte de Playwright como screenshot.
 *
 * Puede capturar:
 * - Página completa (Page)
 * - Elemento específico (Locator)
 *
 * Además registra un log de trazabilidad en consola.
 */
export async function attachScreenshot(
  target: Page | Locator,
  testInfo: TestInfo,
  name?: string,
  fullPage: boolean = false,
): Promise<void> {
  const buffer = await target.screenshot(
    "viewport" in target ? { fullPage } : undefined,
  );

  /**
   * Define el nombre de la evidencia.
   * Si no se proporciona un nombre, se utiliza el título del test.
   * Se limpia y limita para mantener consistencia en el reporte.
   */
  const screenshotName =
    name ?? testInfo.title.replace(/[@:]/g, "").slice(0, 60);

  await testInfo.attach(screenshotName, {
    body: buffer,
    contentType: "image/png",
  });

  logger.info(`[CAPTURA] Evidencia capturada - ${screenshotName}`);
}

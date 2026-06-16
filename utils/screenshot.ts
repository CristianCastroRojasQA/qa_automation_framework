import { Page, Locator, TestInfo } from "@playwright/test";
import { logger } from "@utils/logger";

// Type guard: Page vs Locator
function isPage(target: Page | Locator): target is Page {
  return "goto" in target;
}

// Adjunta screenshot al reporte
export async function attachScreenshot(
  target: Page | Locator,
  testInfo: TestInfo,
  name?: string,
  fullPage: boolean = false,
): Promise<void> {
  const screenshotName =
    name ?? testInfo.title.replace(/[@:]/g, "").slice(0, 60);

  try {
    const buffer = await target.screenshot(
      isPage(target) ? { fullPage } : undefined,
    );

    await testInfo.attach(screenshotName, {
      body: buffer,
      contentType: "image/png",
    });

    logger.info(`[CAPTURA] Evidencia capturada - ${screenshotName}`);
  } catch (err) {
    const message = err instanceof Error ? err.message : String(err);

    logger.warn(
      `[CAPTURA] No se pudo capturar "${screenshotName}": ${message}`,
    );
  }
}

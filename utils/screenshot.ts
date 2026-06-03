import { Page, Locator, TestInfo } from "@playwright/test";
import { logger } from "@utils/logger";

/**
 * Type guard para distinguir si el objetivo recibido corresponde
 * a una instancia de `Page` o a un `Locator`.
 *
 * Contexto:
 * Ambos tipos exponen `screenshot()`, pero solo `Page` permite
 * opciones específicas como `fullPage`.
 *
 * Propósito:
 * Este discriminador permite a TypeScript inferir correctamente
 * el tipo del argumento y habilitar un uso seguro de opciones
 * exclusivas de `Page`.
 *
 * @param target Objeto objetivo de la captura (`Page` o `Locator`)
 * @returns `true` si el objetivo es una instancia de `Page`
 */
function isPage(target: Page | Locator): target is Page {
  return "goto" in target;
}

/**
 * Captura una evidencia visual del estado actual de la aplicación
 * y la adjunta al reporte de Playwright.
 *
 * Capacidades:
 * - capturar la página completa (`Page`)
 * - capturar un elemento específico (`Locator`)
 * - registrar trazabilidad de la captura en logs
 *
 * Comportamiento:
 * - genera un nombre de evidencia reutilizable y legible
 * - adjunta la imagen al `testInfo`
 * - si ocurre un error durante la captura, registra warning
 *   sin interrumpir la ejecución del test
 *
 * Este enfoque permite preservar evidencia diagnóstica
 * sin convertir una falla de screenshot en una falla adicional del flujo.
 *
 * @param target Objetivo a capturar (`Page` o `Locator`)
 * @param testInfo Contexto del test actual provisto por Playwright
 * @param name Nombre opcional de la evidencia
 * @param fullPage Indica si la captura debe abarcar toda la página (solo aplica para `Page`)
 */
export async function attachScreenshot(
  target: Page | Locator,
  testInfo: TestInfo,
  name?: string,
  fullPage: boolean = false,
): Promise<void> {
  /**
   * Nombre final de la evidencia adjunta.
   *
   * Criterio:
   * - utiliza el nombre recibido si existe
   * - en caso contrario, parte del título del test
   * - limpia caracteres problemáticos para el reporte
   * - limita longitud para mantener legibilidad y consistencia
   */
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
      `[CAPTURA] No se pudo capturar evidencia "${screenshotName}": ${message}`,
    );
  }
}

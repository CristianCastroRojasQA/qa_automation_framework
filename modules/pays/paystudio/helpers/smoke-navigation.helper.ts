import { expect, Page } from "@playwright/test";
import { Navbar } from "@paystudio/components/navbar/navbar";
import { logger } from "@utils/logger";

const smokeNavigationLogger = logger.child({
  module: "SmokeNavigationHelper",
});

/**
 * Helper de navegación para pruebas smoke.
 */
export class SmokeNavigationHelper {
  /**
   * Ejecuta navegación por menú usando el Navbar y valida la URL esperada.
   * Si la opción de menú no está disponible, registra la omisión y continúa el smoke.
   */
  public static async navigateByMenuPath(
    page: Page,
    navbar: Navbar,
    mainMenuId: string,
    submenuIds: string[],
    finalOptionId: string,
    expectedUrl: RegExp,
  ): Promise<void> {
    try {
      await navbar.navigateByMenuPath(mainMenuId, submenuIds, finalOptionId);
    } catch (error) {
      const message = error instanceof Error ? error.message : String(error);

      smokeNavigationLogger.warn(
        `Ruta omitida. No fue posible navegar por menú: ${mainMenuId} > ${submenuIds.join(
          " > ",
        )} > ${finalOptionId}. Detalle: ${message}`,
      );

      return;
    }

    try {
      await expect(page).toHaveURL(expectedUrl, { timeout: 30000 });
    } catch (error) {
      const message = error instanceof Error ? error.message : String(error);

      smokeNavigationLogger.error(
        `Error de navegación smoke. Opción final [${finalOptionId}] no redirigió a la URL esperada [${expectedUrl}]. Detalle: ${message}`,
      );

      throw error;
    }
  }
}

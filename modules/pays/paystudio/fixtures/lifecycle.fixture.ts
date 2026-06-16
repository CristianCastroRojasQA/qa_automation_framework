import { logger } from "@utils/logger";
import { test as appTest } from "./app.fixture";
import { attachScreenshot } from "@utils/screenshot";

/**
 * Fixture de ciclo de vida por test
 */
type LifecycleFixtures = {
  testLifecycle: void;
};

export const test = appTest.extend<LifecycleFixtures>({
  /**
   * Ejecuta ciclo común:
   * inicio → ejecución → validación → screenshot → cierre
   */
  testLifecycle: [
    async ({ page }, use, testInfo) => {
      logger.info(`[Lifecycle] >>> INICIO: ${testInfo.title} <<<`);

      await use();

      if (testInfo.status !== testInfo.expectedStatus) {
        logger.error(`[Lifecycle] FALLÓ: ${testInfo.title}`);

        const errorMessage = testInfo.error?.message
          ?.replace(/\x1B\[\d+m/g, "")
          .split("\n")[0];

        logger.error(`[Lifecycle] ERROR: ${errorMessage}`);
      }

      // Captura evidencia
      await attachScreenshot(page, testInfo);

      logger.info(`[Lifecycle] <<< FIN: ${testInfo.title} >>>`);
    },
    {
      auto: true,
    },
  ],
});

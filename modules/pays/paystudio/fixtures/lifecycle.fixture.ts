import { logger } from "@utils/logger";
import { test as appTest } from "./app.fixture";
import { attachScreenshot } from "@utils/screenshot";

const lifecycleLogger = logger.child({ module: "Lifecycle" });

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
      lifecycleLogger.info(`>>> INICIO: ${testInfo.title} <<<`);

      await use();

      if (testInfo.status !== testInfo.expectedStatus) {
        lifecycleLogger.error(`FALLÓ: ${testInfo.title}`);

        const errorMessage = testInfo.error?.message
          ?.replace(/\x1B\[\d+m/g, "")
          .split("\n")[0];

        lifecycleLogger.error(`ERROR: ${errorMessage}`);
      }

      // Captura evidencia
      await attachScreenshot(page, testInfo);

      lifecycleLogger.info(`<<< FIN: ${testInfo.title} >>>`);
    },
    {
      auto: true,
    },
  ],
});

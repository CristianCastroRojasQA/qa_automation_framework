import { logger } from "@utils/logger";
import { test as authTest } from "./auth.fixture";
import { attachScreenshot } from "@utils/screenshot";

/**
 * Fixtures de ciclo de vida compartido para suites basadas en autenticación.
 *
 * Contexto:
 * Este fixture extiende `auth.fixture` para centralizar comportamiento
 * transversal que debe ejecutarse automáticamente en cada test, evitando
 * duplicación de hooks `beforeEach` / `afterEach` en múltiples specs.
 *
 * Responsabilidades:
 * - registrar inicio de ejecución del test
 * - registrar fallos cuando el resultado difiere del esperado
 * - adjuntar screenshot como evidencia de ejecución
 * - registrar cierre formal del test
 *
 * Beneficios:
 * - reduce repetición de lógica común en suites de prueba
 * - mejora consistencia de observabilidad y evidencia
 * - mantiene los specs enfocados en comportamiento funcional
 *
 * Escalabilidad:
 * Este fixture debe ser el punto central para agregar futuras capacidades
 * transversales del framework. Si mañana se requiere incorporar nuevas
 * evidencias o integraciones globales, el cambio debe realizarse aquí
 * y no repetirse en múltiples specs.
 *
 * Ejemplos de evolución esperada:
 * - adjuntar video
 * - adjuntar logs de ejecución
 * - adjuntar HAR
 * - integrar evidencia o resultados con Azure DevOps
 *
 * Regla de mantenimiento:
 * cualquier necesidad transversal que aplique a múltiples suites debe
 * implementarse en `lifecycle.fixture.ts`, evitando modificar test files
 * individuales cuando el comportamiento pueda resolverse de forma centralizada.
 */
type LifecycleFixtures = {
  /**
   * Fixture automático de ciclo de vida por test.
   *
   * No expone datos de negocio al test; su finalidad es ejecutar
   * comportamiento transversal antes y después de cada caso.
   */
  testLifecycle: void;
};

export const test = authTest.extend<LifecycleFixtures>({
  /**
   * Fixture automático que encapsula el ciclo de vida común de ejecución.
   *
   * Flujo:
   * 1. Registra el inicio del test
   * 2. Ejecuta el cuerpo del test mediante `use()`
   * 3. Si el resultado no coincide con el esperado, registra el fallo
   * 4. Adjunta screenshot como evidencia
   * 5. Registra el cierre del test
   *
   * Consideraciones:
   * - `auto: true` permite ejecutar este fixture sin declararlo explícitamente en cada test
   * - el screenshot se adjunta independientemente del resultado para mantener trazabilidad
   * - el mensaje de error se limpia para hacer el log más legible
   *
   * Extensión futura:
   * Si en el futuro se requiere adjuntar nuevas evidencias o ejecutar
   * integraciones globales por test (por ejemplo: video, HAR, logs o
   * sincronización con herramientas externas), este es el lugar correcto
   * para incorporarlo sin tocar múltiples specs.
   */
  testLifecycle: [
    async ({ page }, use, testInfo) => {
      logger.info(`>>> [INICIANDO TEST]: ${testInfo.title} <<<`);

      await use();

      if (testInfo.status !== testInfo.expectedStatus) {
        logger.error(`[TEST FALLIDO]: [${testInfo.title}]`);

        const errorMessage = testInfo.error?.message
          ?.replace(/\x1B\[\d+m/g, "")
          .split("\n")[0];

        logger.error(`[MOTIVO DEL FALLO]: ${errorMessage}`);
      }

      await attachScreenshot(page, testInfo);

      logger.info(`<<< [FINALIZADO TEST]: ${testInfo.title} >>>`);
    },
    {
      auto: true,
    },
  ],
});

import { defineConfig } from "@playwright/test";
import { settings } from "./config/settings";

/**
 * Variables de entorno para configurar el comportamiento del framework.
 * - ENV: Define el entorno de ejecución (por ejemplo, CERT, PROD).
 * - PROJECT: Especifica el proyecto o módulo a ejecutar (por ejemplo, BPAGOS).
 */
const ENV = process.env.ENV || "CERT";
const PROJECT = process.env.PROJECT || "BPAGOS";

/**
 * Variable auxiliar para identificar si la ejecución ocurre en CI/CD.
 *
 * Centralizar esta validación:
 * - evita repetir process.env.CI
 * - mejora legibilidad
 * - facilita mantenimiento futuro
 */
const IS_CI = !!process.env.CI;

/**
 * Configuración de ejecución de Playwright
 * resuelta a través del flujo:
 * .env -> settings -> playwright config
 */
const PLAYWRIGHT_CONFIG = settings.playwrightConfig;

/**
 * Opciones compartidas de lanzamiento utilizadas por todos los proyectos.
 */
const sharedLaunchOptions = {
  // En CI evita maximización innecesaria y mantiene idioma español.
  // Localmente inicia navegador maximizado para facilitar debugging visual.
  args: IS_CI ? ["--lang=es"] : ["--start-maximized", "--lang=es"],
};

/**
 * Configuración base reutilizable para los proyectos del framework.
 *
 * Centralizar esta configuración:
 * - evita duplicación
 * - facilita mantenimiento
 * - mantiene consistencia entre módulos
 */
const sharedProjectConfig = {
  // En CI utiliza resolución fija para reducir diferencias visuales.
  // Localmente usa dimensiones reales de ventana.
  viewport: IS_CI ? { width: 1920, height: 1080 } : null,

  launchOptions: sharedLaunchOptions,
};

/**
 * Configuración principal de Playwright.
 * Define:
 * - comportamiento global
 * - reporters
 * - ejecución
 * - proyectos
 * - configuración del navegador
 */
export default defineConfig({
  // Directorio raíz de pruebas automatizadas
  testDir: "./modules",

  // Ejecuta pruebas en paralelo solo si está habilitado desde .env
  fullyParallel: PLAYWRIGHT_CONFIG.parallel,

  // Previene commits accidentales con pruebas marcadas como .only
  forbidOnly: IS_CI,

  // Reintenta pruebas fallidas únicamente en entorno CI.
  retries: IS_CI ? 2 : 0,

  // En CI se fuerza 1 worker por estabilidad.
  // Fuera de CI:
  // - si hay paralelismo, usa workers configurados
  // - si no, ejecuta secuencialmente con 1 worker
  workers: IS_CI
    ? 1
    : PLAYWRIGHT_CONFIG.parallel
      ? PLAYWRIGHT_CONFIG.workers
      : 1,

  // Tiempo máximo para cada prueba individual.
  timeout: 60_000,

  expect: {
    timeout: 10_000,
  },

  // Genera reporte visual y archivos de resultados en múltiples formatos.
  reporter: [
    ["list", { printSteps: true }],
    [
      "html",
      {
        title: `PayStudio QA Report — ${ENV} | ${PROJECT}`,
        outputFolder: "playwright-report",
      },
    ],
    ["json", { outputFile: "test-results/results.json" }],
    ["junit", { outputFile: "test-results/results.xml" }],
  ],

  // Configuración global de ejecución
  use: {
    // Captura pantallas únicamente cuando la prueba falla.
    screenshot: {
      mode: "only-on-failure",
      fullPage: true,
    },

    // Captura trazas completas solo cuando la prueba falla para facilitar diagnóstico.
    trace: "retain-on-failure",

    // Conserva video únicamente cuando la prueba falla.
    video: {
      mode: "retain-on-failure",
      size: {
        width: 1920,
        height: 1080,
      },
    },

    // En CI siempre se fuerza headless por estabilidad.
    // Fuera de CI se controla desde `.env`.
    headless: IS_CI ? true : PLAYWRIGHT_CONFIG.headless,

    // Configuración regional en español.
    locale: "es-ES",

    // Zona horaria estándar del framework.
    timezoneId: "America/Bogota",

    // Ignora errores HTTPS en ambientes internos o certificados no válidos.
    ignoreHTTPSErrors: true,

    // Configuración de tiempo de espera para acciones y navegación.
    actionTimeout: 15_000,
    navigationTimeout: 30_000,
  },

  // Definición de proyectos del framework
  projects: [
    {
      name: "PayStudio",

      use: {
        ...sharedProjectConfig,
        browserName: PLAYWRIGHT_CONFIG.browser,

        // URL principal obtenida dinámicamente desde el sistema de configuración.
        baseURL: settings.paystudioUrl,
      },

      // Ejecuta únicamente pruebas asociadas al módulo PayStudio.
      testMatch: "**/paystudio/tests/**/*.spec.ts",
    },

    {
      name: "Portal de Comercio",

      use: {
        ...sharedProjectConfig,
        browserName: PLAYWRIGHT_CONFIG.browser,

        // URL principal del Portal de Comercio.
        baseURL: settings.portalUrl,
      },

      // Ejecuta únicamente pruebas asociadas al Portal de Comercio.
      testMatch: "**/portalcomercio/tests/**/*.spec.ts",
    },
  ],
});
``;

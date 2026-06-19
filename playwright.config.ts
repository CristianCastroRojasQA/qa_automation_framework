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
 * Archivo de sesión autenticada de PayStudio.
 *
 * Este storageState es generado por el proyecto setup y reutilizado por
 * las suites que requieren acceso autenticado a funcionalidades internas.
 */
const PAYSTUDIO_AUTH_STATE = "playwright/.auth/paystudio.json";

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
  // Directorio raíz de pruebas automatizadas.
  testDir: "./modules",

  // Ejecuta pruebas en paralelo solo si está habilitado desde .env.
  fullyParallel: PLAYWRIGHT_CONFIG.parallel,

  // Previene commits accidentales con pruebas marcadas como .only.
  forbidOnly: IS_CI,

  // Reintenta pruebas fallidas únicamente en entorno CI.
  retries: IS_CI ? 2 : 0,

  // En CI se fuerza 1 worker por estabilidad.
  // Fuera de CI:
  // - si hay paralelismo, usa workers configurados
  // - si no, ejecuta secuencialmente con 1 worker.
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

  // Configuración global de ejecución.
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

  // Definición de proyectos del framework.
  projects: [
    {
      name: "setup",

      use: {
        ...sharedProjectConfig,
        browserName: PLAYWRIGHT_CONFIG.browser,

        // URL principal de PayStudio obtenida desde settings.
        baseURL: settings.paystudioUrl,
      },

      // Ejecuta el setup encargado de crear el storageState autenticado de PayStudio.
      testMatch: "**/paystudio/setup/**/*.setup.ts",
    },

    {
      name: "PayStudio",

      // Ejecuta primero el proyecto setup para generar la sesión autenticada.
      dependencies: ["setup"],

      use: {
        ...sharedProjectConfig,
        browserName: PLAYWRIGHT_CONFIG.browser,

        // Reutiliza la sesión autenticada generada por auth.setup.ts.
        storageState: PAYSTUDIO_AUTH_STATE,

        // URL principal de PayStudio obtenida desde settings.
        baseURL: settings.paystudioUrl,
      },

      // Ejecuta pruebas de PayStudio que requieren usuario autenticado.
      testMatch: [
        "**/paystudio/tests/smoke/**/*.spec.ts",
        "**/paystudio/tests/regression/**/*.spec.ts",
        "**/paystudio/tests/customization/**/*.spec.ts",
        "**/paystudio/tests/merchant-search/**/*.spec.ts",
        "**/paystudio/tests/auth/change-password.spec.ts",
      ],
    },

    {
      name: "PayStudio Auth",

      use: {
        ...sharedProjectConfig,
        browserName: PLAYWRIGHT_CONFIG.browser,

        // URL principal del login de PayStudio.
        baseURL: settings.paystudioUrl,

        // Ejecuta sin sesión autenticada para validar login, logout y seguridad de autenticación.
        storageState: { cookies: [], origins: [] },
      },

      // Ejecuta únicamente pruebas de autenticación que deben iniciar sin sesión.
      testMatch: "**/paystudio/tests/auth/auth.spec.ts",
    },

    {
      name: "PayStudio Health",

      use: {
        ...sharedProjectConfig,
        browserName: PLAYWRIGHT_CONFIG.browser,

        // URL principal del login de PayStudio.
        baseURL: settings.paystudioUrl,

        // Ejecuta sin sesión autenticada para validar disponibilidad de la pantalla de login.
        storageState: { cookies: [], origins: [] },
      },

      // Ejecuta únicamente pruebas health de PayStudio.
      testMatch: "**/paystudio/tests/health/**/*.spec.ts",
    },

    {
      name: "PayStudio Infrastructure",

      use: {
        ...sharedProjectConfig,
        browserName: PLAYWRIGHT_CONFIG.browser,

        // URL principal de PayStudio, disponible si alguna prueba de infraestructura la requiere.
        baseURL: settings.paystudioUrl,

        // Ejecuta sin sesión autenticada porque las pruebas de infraestructura no dependen del login UI.
        storageState: { cookies: [], origins: [] },
      },

      // Ejecuta únicamente pruebas de infraestructura de PayStudio.
      testMatch: "**/paystudio/tests/infrastructure/**/*.spec.ts",
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

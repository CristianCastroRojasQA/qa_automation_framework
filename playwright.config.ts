import { defineConfig } from "@playwright/test";
import { settings } from "./config/settings";

/**
 * Opciones compartidas de lanzamiento utilizadas por todos los proyectos.
 */
const sharedLaunchOptions = {
  // Inicia el navegador maximizado y configurado en español.
  args: ["--start-maximized", "--lang=es"],
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
  // Navegador principal utilizado por el framework
  channel: "chromium",
  // Desactiva viewport fijo para usar dimensiones reales de la ventana.
  viewport: null,
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
  // Ejecuta pruebas secuencialmente para evitar conflictos entre ambientes.
  fullyParallel: false,
  // Previene commits accidentales con pruebas marcadas como .only
  forbidOnly: !!process.env.CI,
  // Reintenta pruebas fallidas únicamente en entorno CI.
  retries: process.env.CI ? 2 : 0,
  // Limita workers en CI para mejorar estabilidad.
  workers: process.env.CI ? 1 : undefined,
  // Genera reporte visual HTML posterior a la ejecución.
  reporter: "html",

  // Configuración global de ejecución
  use: {
    // Captura trazas únicamente cuando ocurre un retry.
    trace: "on-first-retry",
    // Conserva video únicamente cuando la prueba falla.
    video: "retain-on-failure",
    // Ejecuta pruebas en modo visual.
    headless: false,
    // Configuración regional en español.
    locale: "es-ES",
    // Zona horaria estándar del framework.
    timezoneId: "America/Bogota",
    // Ignora errores HTTPS en ambientes internos o certificados no válidos.
    ignoreHTTPSErrors: true,
  },

  // Definición de proyectos del framework
  projects: [
    {
      name: "PayStudio",
      use: {
        ...sharedProjectConfig,
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
        // URL principal del Portal de Comercio.
        baseURL: settings.portalUrl,
      },
      // Ejecuta únicamente pruebas asociadas al Portal de Comercio.
      testMatch: "**/portalcomercio/tests/**/*.spec.ts",
    },
  ],
});

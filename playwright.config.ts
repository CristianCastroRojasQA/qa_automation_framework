import { defineConfig } from "@playwright/test";
import { settings } from "./config/settings";

// ==============================================================================
// CONFIGURACIONES COMPARTIDAS (DRY - Don't Repeat Yourself)
// ==============================================================================

/**
 * Opciones de lanzamiento del navegador
 */
const sharedLaunchOptions = {
  args: ["--start-maximized", "--lang=es"], // Inicia en pantalla completa y lenguaje español
};

/**
 * Configuración base para los proyectos
 */
const sharedProjectConfig = {
  channel: "chromium", // Navegador por defecto
  viewport: null, // Desactiva el tamaño fijo para usar el máximo de la ventana
  launchOptions: sharedLaunchOptions,
};

// ==============================================================================
// CONFIGURACIÓN PRINCIPAL DE PLAYWRIGHT
// ==============================================================================

export default defineConfig({
  testDir: "./modules", // Directorio raíz donde residen las pruebas
  fullyParallel: true, // Ejecuta pruebas en paralelo para ahorrar tiempo
  forbidOnly: !!process.env.CI, // Evita subir pruebas con .only al servidor (CI)
  retries: process.env.CI ? 2 : 0, // Reintenta fallos solo en CI (2 veces)
  workers: process.env.CI ? 1 : undefined, // Limita hilos en CI para estabilidad
  reporter: "html", // Genera reporte visual en HTML

  /* --- Configuración Global de Ejecución --- */
  use: {
    trace: "on-first-retry", // Graba trazas solo cuando una prueba falla al primer intento
    video: "retain-on-failure", // Guarda video solo si la prueba falla
    headless: false, // Muestra el navegador durante la ejecución
    locale: "es-ES", // Regionalización en español
    timezoneId: "America/Bogota", // Zona horaria de referencia
    ignoreHTTPSErrors: true, // Ignora problemas de certificados en entornos CERT
  },

  /* --- Definición de Proyectos (Módulos del Sistema) --- */
  projects: [
    {
      name: "PayStudio",
      use: {
        ...sharedProjectConfig,
        baseURL: settings.paystudioUrl, // URL cargada desde tu archivo de settings/env
      },
      testMatch: "**/paystudio/tests/*.spec.ts", // Filtra solo pruebas de PayStudio
    },
    {
      name: "Portal de Comercio",
      use: {
        ...sharedProjectConfig,
        baseURL: settings.portalUrl, // URL específica para el Portal
      },
      testMatch: "**/portalcomercio/tests/*.spec.ts", // Filtra solo pruebas del Portal
    },
  ],
});

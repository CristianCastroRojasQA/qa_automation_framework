/**
 * Roles permitidos dentro del framework.
 *
 * Restringir los valores posibles mejora:
 * - la seguridad de tipos
 * - el autocompletado
 * - la validación en tiempo de compilación
 */
export type UserRole = "superadmin" | "admin" | "local";

/**
 * Representa un par estándar de credenciales
 * utilizado por el framework.
 *
 * Centralizar esta estructura evita duplicación
 * y mantiene consistencia entre módulos.
 */
export interface ProjectCredentials {
  user: string;
  pass: string;
}

/**
 * Contrato base para la configuración del sistema de logs.
 *
 * Esta abstracción desacopla la configuración
 * del logger de su implementación concreta
 */
export interface LoggerConfig {
  level: string;
  maxSize: string;
  maxFiles: string;
  dir: string;
}

/**
 * Configuración de conexión a SQL Server.
 *
 * Representa los parámetros mínimos requeridos
 * para establecer conexión desde el framework.
 */
export interface DatabaseConfig {
  server: string;
  database: string;
  user: string;
  password: string;
}

/**
 * Navegadores soportados por Playwright
 * dentro del framework.
 *
 * Se restringe a los motores provistos
 * directamente por Playwright:
 * - chromium
 * - firefox
 * - webkit
 */
export type PlaywrightBrowser = "chromium" | "firefox" | "webkit";

/**
 * Configuración de ejecución de Playwright.
 *
 * Centraliza las opciones principales
 * controladas desde variables de entorno:
 * - paralelismo
 * - cantidad de workers
 * - ejecución headless
 * - navegador a utilizar
 *
 * Este contrato permite mantener tipado fuerte
 * entre `.env`, `settings.ts` y `playwright.config.ts`.
 */
export interface PlaywrightExecutionConfig {
  parallel: boolean;
  workers?: number;
  headless: boolean;
  browser: PlaywrightBrowser;
}

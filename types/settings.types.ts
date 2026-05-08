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
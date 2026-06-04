/**
 * Payloads de seguridad reutilizables en múltiples módulos del sistema.
 *
 * Este archivo contiene entradas maliciosas diseñadas para pruebas de:
 * - SQL Injection
 * - Cross-Site Scripting (XSS)
 * - validaciones de sanitización de inputs
 *
 * Nota:
 * Estos payloads son reutilizables en cualquier flujo del sistema
 * que procese inputs de usuario (login, forms, APIs, etc.).
 */
export const securityPayloads = {
  /**
   * Payload de SQL Injection utilizado para pruebas de seguridad.
   *
   * Objetivo:
   * Validar que el sistema no permita manipulación de queries
   * a través del campo de usuario o contraseña.
   */
  sqlInjection: {
    user: "' OR 1=1 --",
    pass: "cualquierCosa",
  },

  /**
   * Payload de Cross-Site Scripting (XSS).
   *
   * Objetivo:
   * Validar que el sistema no ejecute scripts maliciosos
   * ingresados en campos de texto.
   */
  xssAttack: {
    user: "<script>alert('xss')</script>",
    pass: "cualquierCosa",
  },
} as const;

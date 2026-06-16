/**
 * Payloads de seguridad
 */
export const securityPayloads = {
  /**
   * SQL Injection
   */
  sqlInjection: {
    user: "' OR 1=1 --",
    pass: "cualquierCosa",
  },

  /**
   * XSS
   */
  xssAttack: {
    user: "<script>alert('xss')</script>",
    pass: "cualquierCosa",
  },
} as const;

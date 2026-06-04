/**
 * Catálogo de consultas SQL del dominio Merchant.
 *
 * Contexto:
 * Este archivo centraliza queries reutilizables relacionadas
 * con comercios dentro del framework.
 *
 * Beneficios:
 * - desacopla SQL del repository
 * - mejora mantenibilidad
 * - facilita reutilización de consultas
 * - simplifica lectura de la capa de acceso a datos
 */
export const MerchantQueries = {
  /**
   * Obtiene el primer comercio válido disponible.
   *
   * Criterio:
   * - requiere identificador y nombre legal no nulos
   * - ordena por `MERCHANT_IDENTIFIER`
   */
  getFirstValidMerchant: `
    SELECT TOP 1
        MERCHANT_IDENTIFIER AS merchantIdentifier,
        LEGAL_NAME AS legalName
    FROM AMR_MERCHANT
    WHERE MERCHANT_IDENTIFIER IS NOT NULL
      AND LEGAL_NAME IS NOT NULL
    ORDER BY MERCHANT_IDENTIFIER
  `,
} as const;

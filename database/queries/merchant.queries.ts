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

  /**
   * Obtiene un nombre de fantasía repetido para pruebas
   * de búsqueda con múltiples resultados.
   *
   * Criterio:
   * - requiere `FANTASY_NAME` no nulo ni vacío
   * - agrupa por nombre de fantasía
   * - retorna solo nombres repetidos
   *
   * Uso típico:
   * - pruebas de ordenamiento ASC
   * - validación de reglas de negocio sobre múltiples resultados
   */
  getRepeatedFantasyName: `
    SELECT TOP 1
        FANTASY_NAME AS fantasyName
    FROM AMR_MERCHANT
    WHERE FANTASY_NAME IS NOT NULL
      AND LTRIM(RTRIM(FANTASY_NAME)) <> ''
    GROUP BY FANTASY_NAME
    HAVING COUNT(*) > 1
    ORDER BY FANTASY_NAME
  `,
} as const;
/**
 * Datos de prueba del Buscador Global de Comercios.
 *
 * Contexto:
 * Este archivo centraliza criterios de entrada utilizados
 * por escenarios funcionales y negativos del módulo Merchant Search.
 *
 * Uso:
 * - búsquedas sin resultados
 * - escenarios controlados de validación funcional
 *
 * Consideraciones:
 * - debe contener únicamente datos consumidos por pruebas
 *   del módulo Merchant Search
 * - no debe incluir lógica de negocio ni acceso a infraestructura
 */
export const merchantSearchData = {
  /**
   * Criterios utilizados para validar
   * escenarios sin coincidencias.
   */
  invalidSearches: {
    nonExistingMerchant: "COMERCIO_INEXISTENTE_999",
  },
} as const;

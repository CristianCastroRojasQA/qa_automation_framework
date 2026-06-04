/**
 * Constantes funcionales del Buscador Global de Comercios.
 *
 * Contexto:
 * Este archivo centraliza mensajes y reglas de negocio
 * utilizadas por el módulo Merchant Search.
 *
 * Beneficios:
 * - evita duplicación de valores funcionales
 * - desacopla validaciones de cambios directos en UI
 * - centraliza reglas de negocio conocidas
 * - mejora mantenibilidad de tests, componentes y helpers
 *
 * Nota:
 * Estos valores representan comportamiento esperado
 * definido por negocio y criterios de aceptación.
 */
export const MerchantSearchConstants = {
  /**
   * Mensaje mostrado cuando la búsqueda
   * no retorna coincidencias.
   */
  NO_RESULTS_MESSAGE: "Comercio no encontrado",

  /**
   * Límite máximo de resultados permitido
   * por la regla funcional del buscador.
   */
  MAX_RESULTS: 10,
} as const;

/**
 * Representa un comercio consumido por el módulo Merchant Search.
 *
 * Este tipo modela la estructura mínima requerida por el framework
 * para consultar, transportar y validar datos de comercios
 * obtenidos desde base de datos u otras fuentes del dominio.
 */
export interface Merchant {
  merchantIdentifier: string;
  legalName: string;
  fantasyName: string;
}

/**
 * Representa un nombre de fantasía repetido utilizado
 * para pruebas de búsqueda con múltiples resultados.
 *
 * Este tipo permite abastecer escenarios donde se requiere
 * validar reglas de negocio asociadas a listados,
 * como ordenamiento ascendente o tope máximo.
 */
export interface RepeatedFantasyName {
  fantasyName: string;
}

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
}
``;

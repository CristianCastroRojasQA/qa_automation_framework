/**
 * Tipo Merchant
 * Representa un comercio
 */
export interface Merchant {
  merchantIdentifier: string;
  legalName: string;
  fantasyName: string;
}

/**
 * Nombre de fantasía repetido
 */
export interface RepeatedFantasyName {
  fantasyName: string;
}

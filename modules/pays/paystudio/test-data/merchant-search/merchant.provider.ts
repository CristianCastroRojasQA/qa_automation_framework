import { MerchantRepository } from "@paystudio/repositories/merchant.repository";
import { Merchant, RepeatedFantasyName } from "@paystudio/types/merchant.types";

/**
 * Provider de datos dinámicos para Merchant Search.
 *
 * Contexto:
 * Esta clase abstrae la obtención de datos válidos
 * para pruebas funcionales del módulo Merchant Search.
 *
 * Responsabilidades:
 * - solicitar datos válidos al repository
 * - exponer una interfaz simple para consumo desde tests o helpers
 *
 * Consideraciones:
 * - no contiene lógica de acceso técnico a base de datos
 * - delega la consulta real al `MerchantRepository`
 */
export class MerchantProvider {
  /**
   * Repository del dominio Merchant utilizado
   * para obtener datos válidos desde base de datos.
   */
  private static readonly repository = new MerchantRepository();

  /**
   * Obtiene un comercio válido disponible
   * para ejecución de pruebas funcionales.
   *
   * @returns Un comercio válido consumible por Merchant Search
   */
  public static async getValidMerchant(): Promise<Merchant> {
    return this.repository.getMerchant();
  }

  /**
   * Obtiene un nombre de fantasía repetido
   * para pruebas de búsqueda con múltiples resultados.
   *
   * @returns Un nombre de fantasía repetido consumible por Merchant Search
   */
  public static async getRepeatedFantasyName(): Promise<RepeatedFantasyName> {
    return this.repository.getRepeatedFantasyName();
  }
}

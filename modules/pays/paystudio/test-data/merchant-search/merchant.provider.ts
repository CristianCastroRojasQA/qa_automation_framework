import { MerchantRepository } from "@paystudio/repositories/merchant.repository";
import { Merchant, RepeatedFantasyName } from "@paystudio/types/merchant.types";

/**
 * Provider Merchant
 */
export class MerchantDataProvider {
  private static readonly repository = new MerchantRepository();

  /**
   * Obtiene un comercio válido
   */
  public static async getValidMerchant(): Promise<Merchant> {
    return this.repository.getMerchant();
  }

  /**
   * Obtiene nombre de fantasía repetido
   */
  public static async getRepeatedFantasyName(): Promise<RepeatedFantasyName> {
    return this.repository.getRepeatedFantasyName();
  }
}

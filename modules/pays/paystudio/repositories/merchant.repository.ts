import { MerchantQueries } from "@database/queries/merchant.queries";
import { SqlServerClient } from "@database/sqlserver.client";
import { Merchant, RepeatedFantasyName } from "@paystudio/types/merchant.types";
import { logger } from "@utils/logger";

const merchantRepositoryLogger = logger.child({ module: "MerchantRepository" });

/**
 * Repository Merchant
 */
export class MerchantRepository {
  private readonly db = new SqlServerClient();

  /**
   * Obtiene un comercio válido
   */
  public async getMerchant(): Promise<Merchant> {
    merchantRepositoryLogger.info("Consultando comercio disponible.");

    const result = await this.db.query<Merchant>(
      MerchantQueries.getFirstValidMerchant,
    );

    const merchant = result[0];

    if (!merchant) {
      merchantRepositoryLogger.error(
        "No se encontró un comercio válido en la base de datos.",
      );

      throw new Error(
        "No se encontró un comercio disponible en la base de datos.",
      );
    }

    merchantRepositoryLogger.info(
      `Comercio obtenido correctamente: [${merchant.merchantIdentifier}]`,
    );

    return merchant;
  }

  /**
   * Obtiene un nombre de fantasía repetido
   */
  public async getRepeatedFantasyName(): Promise<RepeatedFantasyName> {
    merchantRepositoryLogger.info(
      "Consultando nombre de fantasía repetido para búsqueda múltiple.",
    );

    const result = await this.db.query<RepeatedFantasyName>(
      MerchantQueries.getRepeatedFantasyName,
    );

    const repeatedFantasyName = result[0];

    if (!repeatedFantasyName) {
      merchantRepositoryLogger.error(
        "No se encontró un nombre de fantasía repetido en la base de datos.",
      );

      throw new Error(
        "No se encontró un nombre de fantasía repetido en la base de datos.",
      );
    }

    merchantRepositoryLogger.info(
      `Nombre de fantasía repetido obtenido correctamente: [${repeatedFantasyName.fantasyName}]`,
    );

    return repeatedFantasyName;
  }
}

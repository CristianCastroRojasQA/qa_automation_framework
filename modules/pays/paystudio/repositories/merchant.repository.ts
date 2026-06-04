import { MerchantQueries } from "@database/queries/merchant.queries";
import { SqlServerClient } from "@database/sqlserver.client";
import { Merchant } from "@paystudio/types/merchant.types";
import { logger } from "@utils/logger";

/**
 * Repository de acceso a datos del dominio Merchant.
 *
 * Contexto:
 * Esta clase encapsula consultas relacionadas con comercios
 * dentro de PayStudio y desacopla el acceso a base de datos
 * del resto de capas del framework.
 *
 * Responsabilidades:
 * - ejecutar consultas del dominio Merchant
 * - mapear resultados al tipo `Merchant`
 * - exponer métodos reutilizables para providers o tests
 *
 * Consideraciones:
 * - no contiene lógica de UI
 * - no contiene validaciones funcionales de negocio complejas
 * - delega la conexión técnica al `SqlServerClient`
 * - delega el SQL reutilizable al catálogo `MerchantQueries`
 */
export class MerchantRepository {
  /**
   * Cliente técnico de acceso a SQL Server.
   */
  private readonly db = new SqlServerClient();

  /**
   * Obtiene un comercio válido y disponible desde la base de datos.
   *
   * @returns Un comercio válido para consumo del framework
   * @throws Error si no se encuentra ningún comercio disponible
   */
  public async getMerchant(): Promise<Merchant> {
    logger.info("[MerchantRepository] Consultando comercio disponible.");

    const result = await this.db.query<Merchant>(
      MerchantQueries.getFirstValidMerchant,
    );

    const merchant = result[0];

    if (!merchant) {
      logger.error(
        "[MerchantRepository] No se encontró un comercio válido en la base de datos.",
      );

      throw new Error(
        "No se encontró un comercio disponible en la base de datos.",
      );
    }

    logger.info(
      `[MerchantRepository] Comercio obtenido correctamente: [${merchant.merchantIdentifier}]`,
    );

    return merchant;
  }
}

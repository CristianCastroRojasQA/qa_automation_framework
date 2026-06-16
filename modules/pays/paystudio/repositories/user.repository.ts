import { UserQueries } from "@database/queries/user.queries";
import { SqlServerClient } from "@database/sqlserver.client";
import { User } from "@paystudio/types/user.types";
import { logger } from "@utils/logger";

/**
 * Repository User
 */
export class UserRepository {
  private readonly db = new SqlServerClient();

  /**
   * Obtiene un usuario por username
   */
  public async getUserByUsername(username: string): Promise<User> {
    logger.info(
      `[UserRepository] Consultando usuario por username [${username}].`,
    );

    const result = await this.db.query<User>(
      UserQueries.getUserByUsername(username),
    );

    const userResult = result[0];

    if (!userResult) {
      logger.error(
        `[UserRepository] No se encontró el usuario [${username}] en la base de datos.`,
      );

      throw new Error(
        `No se encontró el usuario [${username}] en la base de datos.`,
      );
    }

    logger.info(
      `[UserRepository] Usuario obtenido correctamente: [${userResult.username}] con estado [${userResult.userStatus}].`,
    );

    return userResult;
  }
}

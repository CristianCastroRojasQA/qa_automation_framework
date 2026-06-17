import { UserQueries } from "@database/queries/user.queries";
import { SqlServerClient } from "@database/sqlserver.client";
import { User } from "@paystudio/types/user.types";
import { logger } from "@utils/logger";

const userRepositoryLogger = logger.child({ module: "UserRepository" });

/**
 * Repository User
 */
export class UserRepository {
  private readonly db = new SqlServerClient();

  /**
   * Obtiene un usuario por username
   */
  public async getUserByUsername(username: string): Promise<User> {
    userRepositoryLogger.info(
      `Consultando usuario por username [${username}].`,
    );

    const result = await this.db.query<User>(
      UserQueries.getUserByUsername(username),
    );

    const userResult = result[0];

    if (!userResult) {
      userRepositoryLogger.error(
        `No se encontró el usuario [${username}] en la base de datos.`,
      );

      throw new Error(
        `No se encontró el usuario [${username}] en la base de datos.`,
      );
    }

    userRepositoryLogger.info(
      `Usuario obtenido correctamente: [${userResult.username}] con estado [${userResult.userStatus}].`,
    );

    return userResult;
  }

  /**
   * Desbloquea un usuario específico por username.
   */
  public async unlockUserByUsername(username: string): Promise<void> {
    userRepositoryLogger.info(
      `Desbloqueando usuario [${username}] con USER_STATUS=[2].`,
    );

    await this.db.execute(UserQueries.unlockUserByUsername(username));

    userRepositoryLogger.info(
      `Solicitud de desbloqueo ejecutada para el usuario [${username}].`,
    );
  }
}

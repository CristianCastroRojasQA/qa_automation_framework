import sql from "mssql";

import { settings } from "@config/settings";
import { logger } from "@utils/logger";

/**
 * Cliente SQL Server: conexión y ejecución de queries.
 */
export class SqlServerClient {
  private pool?: sql.ConnectionPool;

  // Obtiene o crea conexión
  private async getPool(): Promise<sql.ConnectionPool> {
    if (this.pool?.connected) {
      return this.pool;
    }

    logger.info(
      `[SQL] Conectando a [${settings.database.database}] en [${settings.database.server}]`,
    );

    this.pool = await sql.connect({
      server: settings.database.server,
      database: settings.database.database,
      user: settings.database.user,
      password: settings.database.password,
      options: {
        trustServerCertificate: true,
      },
    });

    logger.info("[SQL] Conexión OK.");

    return this.pool;
  }

  // Ejecuta query con retorno de registros (SELECT)
  public async query<T>(queryText: string): Promise<T[]> {
    try {
      logger.debug("[SQL] Ejecutando query.");

      const pool = await this.getPool();
      const result = await pool.request().query(queryText);

      logger.info(`[SQL] OK. Registros: ${result.recordset.length}`);

      return result.recordset as T[];
    } catch (error) {
      const message = error instanceof Error ? error.message : String(error);

      logger.error(`[SQL] Error: ${message}`);

      throw error;
    }
  }

  // Ejecuta sentencia sin retorno de registros (UPDATE, INSERT, DELETE)
  public async execute(queryText: string): Promise<void> {
    try {
      logger.debug("[SQL] Ejecutando sentencia sin retorno.");

      const pool = await this.getPool();
      const result = await pool.request().query(queryText);

      const affectedRows = result.rowsAffected.reduce(
        (total, current) => total + current,
        0,
      );

      logger.info(`[SQL] OK. Filas afectadas: ${affectedRows}`);
    } catch (error) {
      const message = error instanceof Error ? error.message : String(error);

      logger.error(`[SQL] Error: ${message}`);

      throw error;
    }
  }

  // Cerrar conexión
  public async close(): Promise<void> {
    if (!this.pool) return;

    await this.pool.close();
    this.pool = undefined;

    logger.info("[SQL] Conexión cerrada.");
  }
}

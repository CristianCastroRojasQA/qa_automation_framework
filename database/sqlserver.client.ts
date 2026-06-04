import sql from "mssql";

import { settings } from "@config/settings";
import { logger } from "@utils/logger";

/**
 * Cliente centralizado para SQL Server.
 *
 * Contexto:
 * Esta clase encapsula el acceso técnico a base de datos
 * y actúa como punto único de conexión para consultas reutilizables
 * dentro del framework.
 *
 * Responsabilidades:
 * - abrir y reutilizar la conexión a SQL Server
 * - ejecutar consultas SQL
 * - devolver resultados tipados
 *
 * Consideraciones:
 * - no contiene lógica de negocio
 * - no interpreta reglas funcionales del dominio
 * - su responsabilidad se limita al acceso técnico a datos
 *
 * Escalabilidad:
 * Si en el futuro se requiere agregar trazabilidad adicional,
 * métricas, timeouts, retries o centralización de errores de base de datos,
 * este es el lugar correcto para implementarlo sin afectar repositories
 * ni tests consumidores.
 */
export class SqlServerClient {
  /**
   * Pool compartido de conexión.
   *
   * Se reutiliza para evitar abrir una nueva conexión por cada consulta
   * y centralizar el ciclo de vida técnico del cliente SQL.
   */
  private pool?: sql.ConnectionPool;

  /**
   * Retorna un pool activo de SQL Server.
   *
   * Comportamiento:
   * - reutiliza el pool existente si ya está conectado
   * - crea una nueva conexión si aún no existe
   * - registra trazabilidad técnica sin exponer credenciales sensibles
   *
   * @returns Pool de conexión listo para ejecutar consultas
   */
  private async getPool(): Promise<sql.ConnectionPool> {
    if (this.pool?.connected) {
      return this.pool;
    }

    logger.info(
      `[SQL] Inicializando conexión a base de datos [${settings.database.database}] en servidor [${settings.database.server}]`,
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

    logger.info("[SQL] Conexión establecida correctamente.");

    return this.pool;
  }

  /**
   * Ejecuta una consulta SQL y retorna el recordset tipado.
   *
   * Comportamiento:
   * - obtiene un pool activo de conexión
   * - ejecuta la consulta recibida
   * - retorna los resultados como arreglo tipado
   * - registra trazabilidad básica del proceso
   * - propaga el error si ocurre una falla (fail-fast)
   *
   * Nota:
   * cualquier transformación, filtrado o interpretación funcional
   * de los datos debe implementarse en capas superiores
   * (por ejemplo: repositories o providers).
   *
   * @param queryText Consulta SQL a ejecutar
   * @returns Resultados tipados del recordset
   * @throws Error si la conexión o la consulta fallan
   */
  public async query<T>(queryText: string): Promise<T[]> {
    try {
      logger.debug("[SQL] Ejecutando consulta.");

      const pool = await this.getPool();
      const result = await pool.request().query(queryText);

      logger.info(
        `[SQL] Consulta ejecutada correctamente. Registros obtenidos: ${result.recordset.length}`,
      );

      return result.recordset as T[];
    } catch (error) {
      const message = error instanceof Error ? error.message : String(error);

      logger.error(`[SQL] Error ejecutando consulta: ${message}`);

      throw error;
    }
  }

  /**
   * Cierra el pool de conexión activo si existe.
   *
   * Uso recomendado:
   * invocar este método cuando se requiera liberar explícitamente
   * recursos de base de datos al finalizar un flujo o una ejecución prolongada.
   */
  public async close(): Promise<void> {
    if (!this.pool) {
      return;
    }

    await this.pool.close();
    this.pool = undefined;

    logger.info("[SQL] Conexión cerrada correctamente.");
  }
}
``;

import { SqlServerClient } from "@database/sqlserver.client";
import { logger } from "@utils/logger";
import { test, expect } from "@playwright/test";


/**
 * Suite de Infraestructura - Base de Datos
 */
test.describe("Database Connection", () => {
  test("TC-01: Debe conectarse correctamente a SQL Server", async () => {
    const db = new SqlServerClient();

    const result = await db.query<{
      databaseName: string;
    }>(`
      SELECT DB_NAME() AS databaseName
    `);

    expect(result).toHaveLength(1);
    expect(result[0].databaseName).toBeTruthy();

    logger.info(
      `TC-01 validado correctamente: la conexión a SQL Server fue exitosa y la base de datos activa es [${result[0].databaseName}].`,
    );
  });

  test("TC-02: Debe obtener tablas disponibles en la base de datos", async () => {
    const db = new SqlServerClient();

    const tables = await db.query<{
      TABLE_NAME: string;
    }>(`
      SELECT TABLE_NAME
      FROM INFORMATION_SCHEMA.TABLES
      WHERE TABLE_TYPE = 'BASE TABLE'
      ORDER BY TABLE_NAME
    `);

    expect(tables.length).toBeGreaterThan(0);

    logger.info(
      `TC-02 validado correctamente: se obtuvieron [${tables.length}] tablas desde SQL Server.`,
    );
  });
});

import { SecurityPolicyQueries } from "@database/queries/security-policy.queries";
import { SqlServerClient } from "@database/sqlserver.client";
import { SecurityPolicy } from "@paystudio/types/security-policy.types";
import { logger } from "@utils/logger";

const securityPolicyRepositoryLogger = logger.child({
  module: "SecurityPolicyRepository",
});

/**
 * Repository Security Policy
 */
export class SecurityPolicyRepository {
  private readonly db = new SqlServerClient();

  /**
   * Obtiene la política de seguridad
   */
  public async getSecurityPolicy(): Promise<SecurityPolicy> {
    securityPolicyRepositoryLogger.info(
      "Consultando política de seguridad disponible.",
    );

    const result = await this.db.query<SecurityPolicy>(
      SecurityPolicyQueries.getSecurityPolicy,
    );

    const policy = result[0];

    if (!policy) {
      securityPolicyRepositoryLogger.error(
        "No se encontró una política de seguridad en la base de datos.",
      );

      throw new Error(
        "No se encontró una política de seguridad en la base de datos.",
      );
    }

    securityPolicyRepositoryLogger.info(
      `Política de seguridad obtenida correctamente: [${policy.idSecurityPolicy}]`,
    );

    return policy;
  }
}

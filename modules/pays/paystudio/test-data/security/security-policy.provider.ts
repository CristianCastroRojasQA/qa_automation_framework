import { SecurityPolicyRepository } from "@paystudio/repositories/security-policy.repository";

import { SecurityPolicy } from "@paystudio/types/security-policy.types";

/**
 * Provider Security Policy
 */
export class SecurityPolicyProvider {
  private static readonly repository = new SecurityPolicyRepository();

  /**
   * Obtiene la política de seguridad
   */
  public static async getSecurityPolicy(): Promise<SecurityPolicy> {
    return this.repository.getSecurityPolicy();
  }
}

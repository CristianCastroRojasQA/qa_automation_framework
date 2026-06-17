import { UserRepository } from "@paystudio/repositories/user.repository";
import { User } from "@paystudio/types/user.types";

/**
 * Provider User
 */
export class UserProvider {
  private static readonly repository = new UserRepository();

  /**
   * Obtiene un usuario por username
   */
  public static async getUserByUsername(username: string): Promise<User> {
    return this.repository.getUserByUsername(username);
  }

  /**
   * Desbloquea un usuario por username
   */
  public static async unlockUserByUsername(username: string): Promise<void> {
    await this.repository.unlockUserByUsername(username);
  }
}

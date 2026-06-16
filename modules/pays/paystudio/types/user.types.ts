/**
 * Tipo User
 */
export interface User {
  idUser: number;
  username: string;
  firstName: string;
  surname: string;
  userStatus: number;
  attemptsOfLogin: number;
  lastLoginDate: string | null;
  mfaRequired: number;
  authenticationType: number;
}

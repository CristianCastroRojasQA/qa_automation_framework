/**
 * Tipo Security Policy
 */
export interface SecurityPolicy {
  idSecurityPolicy: number;
  minLogin: number;
  maxLogin: number;
  minPassword: number;
  maxPassword: number;
  passwordRegExp: string;
  passwordMgtModel: number;
  passwordDaysExp: number;
  attemptsOfLogin: number;
  accountBlockMinutes: number;
  firstLoginPasswordChange: number;
  inactivityBlockDays: number;
  passwordChangeDays: number;
  passwordsNotAllowedCnt: number;
}

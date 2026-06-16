/**
 * Queries del dominio Security Policy.
 */
export const SecurityPolicyQueries = {
  // Configuración actual de seguridad
  getSecurityPolicy: `
    SELECT TOP 1
        ID_SECURITY_POLICY AS idSecurityPolicy,
        MIN_LOGIN AS minLogin,
        MAX_LOGIN AS maxLogin,
        MIN_PASSWORD AS minPassword,
        MAX_PASSWORD AS maxPassword,
        PASSWORD_REG_EXP AS passwordRegExp,
        PASSWORD_MGT_MODEL AS passwordMgtModel,
        PASSWORD_DAYS_EXP AS passwordDaysExp,
        ATTEMPTS_OF_LOGIN AS attemptsOfLogin,
        ACCOUNT_BLOCK_MINUTES AS accountBlockMinutes,
        FIRST_LOGIN_PASSWORD_CHANGE AS firstLoginPasswordChange,
        INACTIVITY_BLOCK_DAYS AS inactivityBlockDays,
        PASSWORD_CHANGE_DAYS AS passwordChangeDays,
        PASSWORDS_NOT_ALLOWED_CNT AS passwordsNotAllowedCnt
    FROM TRD_SECURTY_POLICY
    ORDER BY ID_SECURITY_POLICY
  `,
} as const;

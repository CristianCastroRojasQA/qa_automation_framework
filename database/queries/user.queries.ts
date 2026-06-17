/**
 * Queries del dominio User.
 */
export const UserQueries = {
  // Usuario por username
  getUserByUsername: (username: string) => `
    SELECT TOP 1
        ID_USER AS idUser,
        LTRIM(RTRIM(USERNAME)) AS username,
        LTRIM(RTRIM(FIRST_NAME)) AS firstName,
        LTRIM(RTRIM(SURNAME)) AS surname,
        USER_STATUS AS userStatus,
        ATTEMPTS_OF_LOGIN AS attemptsOfLogin,
        LAST_LOGIN_DATE AS lastLoginDate,
        MFA_REQUIRED AS mfaRequired,
        ID_AUTHENTICATION_TYPE AS authenticationType
    FROM TRD_USER
    WHERE LTRIM(RTRIM(USERNAME)) = '${username}'
  `,

  // Desbloquea un usuario específico por username
  unlockUserByUsername: (username: string) => `
    UPDATE TRD_USER
    SET USER_STATUS = 1
    WHERE LTRIM(RTRIM(USERNAME)) = '${username}'
      AND USER_STATUS = 2
  `,
} as const;

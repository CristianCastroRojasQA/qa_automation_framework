/**
 * Queries del dominio User.
 */
export const UserQueries = {
  // Usuario por username
  getUserByUsername: (username: string) => `
    SELECT TOP 1
        ID_USER AS idUser,
        USERNAME AS username,
        FIRST_NAME AS firstName,
        SURNAME AS surname,
        USER_STATUS AS userStatus,
        ATTEMPTS_OF_LOGIN AS attemptsOfLogin,
        LAST_LOGIN_DATE AS lastLoginDate,
        MFA_REQUIRED AS mfaRequired,
        ID_AUTHENTICATION_TYPE AS authenticationType
    FROM TRD_USER
    WHERE USERNAME = '${username}'
  `,
} as const;

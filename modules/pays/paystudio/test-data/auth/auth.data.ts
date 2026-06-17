/**
 * Datos de prueba de autenticación
 */
export const authData = {
  /**
   * Credenciales inválidas
   */
  invalidCredentials: {
    wrongPassword: "ClaveFalsa123*",
    nonExistingUser: "UsuarioFalso",
    invalidFormatPassword: "claveinvalida",
    shortPassword: "Ab1$",
    longPassword: "Abc12345$Abc12345$Abc12345$Abc12345$Abc12345$",
  },

  /**
   * Campos vacíos
   */
  emptyFields: {
    user: "",
    pass: "",
  },
} as const;

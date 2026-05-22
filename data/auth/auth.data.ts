/**
 * Datos de prueba utilizados en el módulo de Autenticación.
 * Contiene escenarios negativos y casos de seguridad
 * para validaciones funcionales del login.
 */
export const authData = {
  invalidCredentials: {
    wrongPassword: "ClaveFalsa123*",
    nonExistingUser: "UsuarioFalso",
  },

  securityPayloads: {
    sqlInjection: {
      user: "' OR 1=1 --",
      pass: "cualquierCosa",
    },

    xssAttack: {
      user: "<script>alert('xss')</script>",
      pass: "cualquierCosa",
    },
  },

  emptyFields: {
    user: "",
    pass: "",
  },
} as const;

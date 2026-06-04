/**
 * Datos de prueba del módulo de Autenticación de PayStudio.
 *
 * Contiene escenarios específicos del dominio de autenticación:
 * - credenciales inválidas
 * - validación de login
 * - campos obligatorios
 *
 * Nota:
 * Este archivo debe contener únicamente datos relacionados
 * exclusivamente con el flujo de autenticación.
 */
export const authData = {
  /**
   * Credenciales inválidas utilizadas en pruebas funcionales negativas.
   *
   * Usadas para validar comportamiento del sistema ante:
   * - usuarios inexistentes
   * - contraseñas incorrectas
   */
  invalidCredentials: {
    wrongPassword: "ClaveFalsa123*",
    nonExistingUser: "UsuarioFalso",
  },

  /**
   * Datos vacíos utilizados para validación de campos obligatorios.
   *
   * Permiten validar reglas de negocio del formulario de login
   * cuando el usuario no ingresa información.
   */
  emptyFields: {
    user: "",
    pass: "",
  },
} as const;

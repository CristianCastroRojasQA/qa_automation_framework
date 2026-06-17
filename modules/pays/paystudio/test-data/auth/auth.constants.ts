/**
 * Mensajes de autenticación
 */
export const AuthMessages = {
  BRAND_PAGE: "PayStudio Web",

  INVALID_CREDENTIALS: "Usuario y/o contraseña inválidos",
  USER_NOT_FOUND: "Usuario no encontrado en el sistema",
  USER_EMPTY: "Debe ingresar el nombre de usuario",

  /**
   * Mensajes de: "Debe ingresar la contraseña"
   */
  PASSWORD_EMPTY: "Debe ingresar la contraseña",

  /**
   * Mensajes de autenticación
   */
  LOGOUT_SUCCESS: "ha cerrado la sesión con éxito.",
  SESSION_INVALID: "La sesión actual no es válida.",

  CHANGE_PASSWORD_TITLE: "Cambiar la contraseña",
  CHANGE_PASSWORD_LOGIN_NAME_LABEL: "Nombre de Login:",
  CHANGE_PASSWORD_FULL_NAME_LABEL: "Nombre Completo:",

  CHANGE_PASSWORD_ERROR_SUMMARY_TITLE: "Han ocurrido errores!",
  CHANGE_PASSWORD_REQUIRED_FIELD: "Dato requerido",

  CHANGE_PASSWORD_SUCCESS_SUMMARY_TITLE: "Notificación!",
  CHANGE_PASSWORD_SUCCESS_MESSAGE:
    "La modificación ha sido realizada con éxito",

  CHANGE_PASSWORD_INVALID_CURRENT_PASSWORD:
    "La contraseña suministrada no es correcta",

  CHANGE_PASSWORD_PASSWORDS_DO_NOT_MATCH:
    "Las contraseñas ingresadas no coinciden",

  CHANGE_PASSWORD_INVALID_FORMAT:
    "La nueva contraseña tiene un formato invalido",

  CHANGE_PASSWORD_LEN:
    "El largo de la contraseña debe estar entre 8 y 18 caracteres",

  CHANGE_PASSWORD_REUSED_PASSWORD:
    "No puede reutilizar una contraseña anterior",

  CHANGE_PASSWORD_MIN_DAYS_RESTRICTION:
    "Ya has cambiado tu contraseña en los úlimos 1 días",

  CHANGE_PASSWORD_REUSED_PASSWORD_HISTORY:
    "La nueva contraseña ya fue utilizada en los últimos 12 cambios de contraseña.",
} as const;

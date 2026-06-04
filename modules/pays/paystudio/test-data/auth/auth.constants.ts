/**
 * Mensajes esperados en los flujos de autenticación de PayStudio.
 *
 * Centraliza los textos utilizados en validaciones de UI y backend:
 * - reduce duplicación en Page Objects y tests
 * - facilita mantenimiento cuando el backend cambia copy
 * - asegura consistencia entre specs y validaciones
 *
 * Nota:
 * Estos valores representan el comportamiento esperado del sistema,
 * no deben ser modificados sin validación del equipo funcional.
 */
export const AuthMessages = {
  /** Mensaje mostrado al cerrar sesión exitosamente. */
  LOGOUT_SUCCESS: "ha cerrado la sesión con éxito.",

  /** Mensaje mostrado cuando la sesión actual ya no es válida. */
  SESSION_INVALID: "La sesión actual no es válida.",

  /** Mensaje mostrado cuando las credenciales son inválidas. */
  INVALID_CREDENTIALS: "Usuario y/o contraseña inválidos",

  /** Mensaje mostrado cuando el usuario no existe en el sistema. */
  USER_NOT_FOUND: "Usuario no encontrado en el sistema",
} as const;

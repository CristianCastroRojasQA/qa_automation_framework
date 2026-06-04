/**
 * Textos utilizados en el navbar y sus modales asociados en PayStudio.
 *
 * Centraliza los labels de UI para:
 * - evitar hardcoding en Page Objects
 * - facilitar mantenimiento de cambios de copy UI
 * - mantener consistencia con el módulo de autenticación (AuthMessages)
 *
 * Incluye:
 * - opciones del menú de usuario
 * - acciones de navegación
 * - textos compartidos en modales
 */
export const NavbarMessages = {
  // =========================
  // USER MENU OPTIONS
  // =========================

  /** Opción de menú para cerrar sesión. */
  LOGOUT_LINK: "Salir",

  /** Opción de menú para cambiar contraseña. */
  CHANGE_PASSWORD_LINK: "Cambiar Contraseña",

  /** Opción de menú que abre el modal "Acerca De". */
  ABOUT_LINK: "Acerca De",

  // =========================
  // MODAL COMMON ACTIONS
  // =========================

  /** Botón estándar de cierre en modales. */
  MODAL_CLOSE_BUTTON: "Cerrar",
} as const;

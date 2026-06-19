/**
 * IDs de navegación del menú Gestor de Procesos en PayStudio.
 */
export const ProcessManagementMenuRoutes = {
  main: "PROCESS_MANAGEMENT_KEY",

  executions: "GridExecutions",
  definitions: "GridDefinitions",
} as const;

/**
 * Patrones esperados de URL para pantallas del menú Gestor de Procesos.
 */
export const ProcessManagementMenuUrlPatterns = {
  executions: /GridExecutions/,
  definitions: /GridDefinitions/,
} as const;

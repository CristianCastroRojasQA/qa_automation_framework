/**
 * IDs de navegación del menú Batches en PayStudio.
 */
export const BatchMenuRoutes = {
  main: "BATCH_KEY",

  batchConsole: "BatchConsole",
} as const;

/**
 * Patrones esperados de URL para pantallas del menú Batches.
 */
export const BatchMenuUrlPatterns = {
  batchConsole: /BatchConsole/,
} as const;

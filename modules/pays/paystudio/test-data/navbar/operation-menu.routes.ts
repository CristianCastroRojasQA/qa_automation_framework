/**
 * IDs de navegación del menú Operaciones en PayStudio.
 */
export const OperationMenuRoutes = {
  main: "OPERATION_KEY",

  automaticDebitSearch: "ACMUC033_GetAutomaticDebit",
  acquirerFeeCollection: "AcquirerFeeCollection",
  paymentMaintenance: "ANG_SC_ACMUC013_Payment_Maint",
  manualRefund: "ATXUC014_DevolucionManual",
  acquirerDisputesManagement: "GetAcquirerControversy",
  automaticDebitReturn: "ACMUC036_AutomaticDebitReturn",
  dailyQuadrature: "ANG_SC_DailyQuadrature",
} as const;

/**
 * Patrones esperados de URL para pantallas del menú Operaciones.
 */
export const OperationMenuUrlPatterns = {
  automaticDebitSearch: /ACMUC033_GetAutomaticDebit/,
  acquirerFeeCollection: /ATXUC029_FeeCollectionMaintenance/,
  paymentMaintenance: /ACMUC013_Payment_Maint/,
  manualRefund: /ATXUC014_DevolucionManual/,
  acquirerDisputesManagement: /GetControversy/,
  automaticDebitReturn: /ACMUC036_AutomaticDebitReturn/,
  dailyQuadrature: /DailyQuadrature/,
} as const;

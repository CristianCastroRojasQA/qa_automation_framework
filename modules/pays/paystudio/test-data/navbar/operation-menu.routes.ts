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

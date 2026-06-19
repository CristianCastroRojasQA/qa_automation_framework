/**
 * IDs de navegación del menú Comercios en PayStudio.
 */
export const MerchantMenuRoutes = {
  main: "MERCHANT_KEY",

  merchantSearch: "AMUC008_MerchantSearch",
  merchantAdd: "AMUC002_MerchantAdd",
  merchantPreAffiliationMaintenance: "AMDUC002_MerchantEntrySearch",
  merchantPreAffiliationAdd: "AMDUC001_MerchantDataEntryAdd",
  acquirerTransactionInfo: "ATXUC012_AcquirerTransInfo",
} as const;

/**
 * Patrones esperados de URL para pantallas del menú Comercios.
 */
export const MerchantMenuUrlPatterns = {
  merchantSearch: /AMUC008_MerchantSearch/,
  merchantAdd: /AMUC002_MerchantAdd/,
  merchantPreAffiliationMaintenance: /AMDUC002_MerchantDataEntrySearch/,
  merchantPreAffiliationAdd: /AMDUC001_MerchantDataEntryAdd/,
  acquirerTransactionInfo: /ATXUC012_AcquirerTransactionInfo/,
} as const;

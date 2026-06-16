/**
 * Queries del dominio Merchant.
 * Centraliza SQL reutilizable.
 */
export const MerchantQueries = {
  // Primer comercio válido
  getFirstValidMerchant: `
    SELECT TOP 1
        MERCHANT_IDENTIFIER AS merchantIdentifier,
        LEGAL_NAME AS legalName,
        FANTASY_NAME AS fantasyName
    FROM AMR_MERCHANT
    WHERE MERCHANT_IDENTIFIER IS NOT NULL
      AND LEGAL_NAME IS NOT NULL
      AND FANTASY_NAME IS NOT NULL
      AND LTRIM(RTRIM(FANTASY_NAME)) <> ''
    ORDER BY MERCHANT_IDENTIFIER
  `,

  // Nombre de fantasía repetido
  getRepeatedFantasyName: `
    SELECT TOP 1
        FANTASY_NAME AS fantasyName
    FROM AMR_MERCHANT
    WHERE FANTASY_NAME IS NOT NULL
      AND LTRIM(RTRIM(FANTASY_NAME)) <> ''
    GROUP BY FANTASY_NAME
    HAVING COUNT(*) > 1
    ORDER BY FANTASY_NAME
  `,
} as const;

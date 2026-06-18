/**
 * IDs de navegación del menú Configuración en PayStudio.
 */
export const ConfigurationMenuRoutes = {
  main: "CONFIGURATION_KEY",

  acquirer: {
    menu: "ACQUIRER_CONFIGURATION_KEY",

    tradeAndModel: "ANG_SC_ABCUC022_TTradeAndModel",

    terminal: {
      menu: "TERMINAL_MENU_KEY",
      addTerminal: "ABCUC023_SaveTerminal",
      updateTerminalSearch: "ABCUC024_UpdateTerminalSearch",
      massiveTerminalAdd: "ANG_SC_ABCUC039",
      terminalStockSearch: "ANG_SC_Check-Terminal-Stock",
    },

    product: {
      menu: "PRODUCT_KEY",
      addProduct: "ABCUC025_AddProduct",
      modifyProduct: "ABCUC025_ModifyProduct",
    },

    acquirerCalendar: "ANG_SC_ABCUC015_AcqCal_Search",
    exchangeRate: "ABCUC016_ExchangeRate",

    settlementModel: {
      menu: "SETTLEMENT_MODEL_KEY",
      commercialConditions: "ANG_SC_AMUC016",
      promotionalCommercialConditions: "ANG_SC_AMRUC045",
      commercialConditionsReport: "ANG_SC_AMRUC047",
    },

    economicGroup: "ANG_SC_ABCUC046",
    economicActivity: "ANG_SC_ABCUC047",
    mdrBrandParameters: "ANG_SC_mdr-brand-parameters",
    organizationExchangeRate: "ANG_SC_OrgExchangeRateMaint",
  },

  authorizationRuleList: {
    menu: "AUTHORIZATION_RULE_LIST_KEY",
    addAuthRuleList: "MIUC001_AddAuthRuleList",
    updateAuthListSearch: "MIUC002_UpdateAuthListSearch",
    updateAuthListValueSearch: "MIUC003_UpdtAuthListValSearch",
    deleteAuthList: "MIUC004_DeleteAuthList",
  },
} as const;

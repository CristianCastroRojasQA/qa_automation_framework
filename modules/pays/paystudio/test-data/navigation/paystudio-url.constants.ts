/**
 * Patrones esperados en URLs principales de PayStudio.
 *
 * No representan URLs completas ni rutas absolutas.
 * Se usan para validar navegación en ambientes donde host, puerto o base URL pueden cambiar.
 */
export const PayStudioUrlPatterns = {
  LoginPage: /LoginPage/,
  MainPage: /MainPage/,
  SelfData: /SelfData/,
  LogoutPage: /LogoutPage/,
  SessionInvalid: /SessionInvalid/,
  MerchantEntryPoint: /MerchantEntryPoint/,
  ErrorPage: /ErrorPage/,
} as const;

/**
 * Rutas relativas principales de PayStudio.
 *
 * No incluyen host ni puerto porque el framework es multiambiente.
 * El host se resuelve usando settings.paystudioUrl.
 */
export const PayStudioUrlPaths = {
  MainPage: "/PayStudioBO/View/Main/MainPage.aspx",
} as const;
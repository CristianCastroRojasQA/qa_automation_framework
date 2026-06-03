import { test as base } from "@playwright/test";

import { LoginPage } from "@paystudio/pages/auth/LoginPage";
import { LogoutPage } from "@paystudio/pages/auth/LogoutPage";
import { SessionInvalidPage } from "@paystudio/pages/auth/SessionInvalidPage";
import { Navbar } from "@paystudio/components/navbar/navbar";

/**
 * Fixtures del módulo de Autenticación de PayStudio.
 *
 * Contexto funcional:
 * Este fixture centraliza la creación e inyección de Page Objects y componentes
 * relacionados con el ciclo de autenticación del sistema.
 *
 * Responsabilidades:
 * - proveer instancias de Page Objects reutilizables por test
 * - encapsular la construcción de dependencias basadas en `page`
 * - garantizar consistencia en la inicialización de componentes
 * - asegurar aislamiento entre pruebas (una instancia por test)
 *
 * Componentes incluidos:
 * - LoginPage: flujo de autenticación del usuario
 * - LogoutPage: flujo de cierre de sesión
 * - SessionInvalidPage: manejo de sesión inválida o expirada
 * - Navbar: acceso a funcionalidades globales del sistema
 *
 * Beneficios del diseño:
 * - evita instanciación repetida en cada test
 * - mejora la legibilidad de los test cases
 * - desacopla la construcción de objetos del flujo de prueba
 * - facilita la escalabilidad del framework (extensión por módulos)
 */
type AuthFixtures = {
  loginPage: LoginPage;
  logoutPage: LogoutPage;
  sessionInvalidPage: SessionInvalidPage;
  navbar: Navbar;
};

export const test = base.extend<AuthFixtures>({
  /**
   * Fixture del Page Object de Login.
   *
   * Provee una instancia de LoginPage por cada test,
   * permitiendo encapsular la interacción con la pantalla
   * de autenticación del sistema.
   *
   * Alcance:
   * - navegación al portal
   * - ingreso de credenciales
   * - validación de errores
   */
  loginPage: async ({ page }, use) => {
    await use(new LoginPage(page));
  },

  /**
   * Fixture del Page Object de Logout.
   *
   * Provee una instancia de LogoutPage para manejar
   * el flujo de cierre de sesión del sistema.
   *
   * Alcance:
   * - validación del mensaje de cierre de sesión
   * - confirmación de logout
   */
  logoutPage: async ({ page }, use) => {
    await use(new LogoutPage(page));
  },

  /**
   * Fixture del Page Object de Sesión Inválida.
   *
   * Provee una instancia de SessionInvalidPage para escenarios
   * donde la sesión del usuario no es válida o ha expirado.
   *
   * Alcance:
   * - validación de mensaje de sesión inválida
   * - confirmación de aceptación del estado
   */
  sessionInvalidPage: async ({ page }, use) => {
    await use(new SessionInvalidPage(page));
  },

  /**
   * Fixture del componente Navbar.
   *
   * Provee acceso a las acciones globales del sistema
   * disponibles para usuarios autenticados.
   *
   * Alcance:
   * - navegación global
   * - apertura de modales
   * - acceso al buscador de comercios
   * - ejecución de logout
   */
  navbar: async ({ page }, use) => {
    await use(new Navbar(page));
  },
});

/**
 * Re-export de `expect` desde Playwright.
 *
 * Propósito:
 * - mantener consistencia en los imports de los test files
 * - centralizar la dependencia de Playwright en el fixture
 *
 * Esto permite que los tests importen:
 * `test` y `expect` desde una única fuente del framework.
 */
export { expect } from "@playwright/test";
``;

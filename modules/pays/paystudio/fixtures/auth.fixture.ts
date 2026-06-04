import { test as base } from "@playwright/test";

import { LoginPage } from "@paystudio/pages/auth/LoginPage";
import { LogoutPage } from "@paystudio/pages/auth/LogoutPage";
import { SessionInvalidPage } from "@paystudio/pages/auth/SessionInvalidPage";
import { Navbar } from "@paystudio/components/navbar/navbar";

/**
 * Fixtures del módulo de Autenticación de PayStudio.
 *
 * Contexto:
 * Este fixture centraliza la creación e inyección de Page Objects
 * y componentes asociados al ciclo de autenticación del sistema.
 *
 * Responsabilidades:
 * - proveer instancias reutilizables de Page Objects por test
 * - encapsular la construcción de dependencias basadas en `page`
 * - asegurar consistencia en la inicialización de componentes
 * - mantener aislamiento entre pruebas (una instancia por test)
 *
 * Cobertura:
 * - LoginPage: flujo de autenticación del usuario
 * - LogoutPage: flujo de cierre de sesión
 * - SessionInvalidPage: manejo de sesión inválida o expirada
 * - Navbar: acceso a funcionalidades globales disponibles tras autenticación
 *
 * Beneficios del diseño:
 * - evita instanciación repetida en los specs
 * - mejora legibilidad de los test cases
 * - desacopla la construcción de objetos del flujo de prueba
 * - facilita la escalabilidad del framework por módulos
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
   * Provee una instancia de `LoginPage` por cada test,
   * permitiendo encapsular la interacción con la pantalla
   * de autenticación del sistema.
   */
  loginPage: async ({ page }, use) => {
    await use(new LoginPage(page));
  },

  /**
   * Fixture del Page Object de Logout.
   *
   * Provee una instancia de `LogoutPage` para manejar
   * el flujo de cierre de sesión del sistema.
   */
  logoutPage: async ({ page }, use) => {
    await use(new LogoutPage(page));
  },

  /**
   * Fixture del Page Object de Sesión Inválida.
   *
   * Provee una instancia de `SessionInvalidPage` para escenarios
   * donde la sesión del usuario no es válida o ha expirado.
   */
  sessionInvalidPage: async ({ page }, use) => {
    await use(new SessionInvalidPage(page));
  },

  /**
   * Fixture del componente Navbar.
   *
   * Provee acceso a las acciones globales del sistema
   * disponibles para usuarios autenticados.
   */
  navbar: async ({ page }, use) => {
    await use(new Navbar(page));
  },
});

/**
 * Re-export de `expect` desde Playwright.
 *
 * Propósito:
 * - mantener consistencia en los imports de los specs
 * - centralizar el punto de acceso a `test` y `expect`
 * - simplificar el consumo del fixture dentro del framework
 */
export { expect } from "@playwright/test";

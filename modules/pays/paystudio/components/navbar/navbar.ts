import { expect, Locator, Page } from "@playwright/test";
import { NavbarMessages } from "@paystudio/constants/navbar/navbar.messages";
import { logger } from "@utils/logger";

/**
 * Componente del Navbar principal de PayStudio.
 *
 * Contexto funcional:
 * El Navbar actúa como punto central de navegación y acceso
 * a funcionalidades globales del sistema una vez autenticado el usuario.
 *
 * Responsabilidades encapsuladas:
 * - gestión del menú de usuario
 * - acceso a funcionalidades globales (cambiar contraseña, logout, etc.)
 * - disparo de modales del sistema (Business Date, About)
 * - acceso al buscador global de comercios
 *
 * Este componente desacopla a los tests del layout principal
 * y centraliza todas las interacciones relacionadas con navegación superior,
 * proporcionando una API consistente y reutilizable.
 */
export class Navbar {
  /**
   * Referencia a la página activa de Playwright.
   *
   * Se utiliza para:
   * - sincronización de estado general
   * - validación de render del layout
   */
  private readonly page: Page;

  /**
   * Locators internos del Navbar.
   *
   * Criterio de diseño:
   * - Uso de selectores por sufijo (`[id$='...']`) para elementos ASP.NET
   * - Uso de roles accesibles cuando es posible (getByRole)
   * - Uso de selectores específicos para overlays/modales relacionados
   *
   * Este enfoque mejora:
   * - resiliencia ante cambios de layout
   * - mantenibilidad del framework
   */
  private readonly userWelcome: Locator;
  private readonly userMenuTrigger: Locator;

  private readonly businessDateLink: Locator;
  private readonly changePasswordLink: Locator;
  private readonly aboutLink: Locator;
  private readonly logoutLink: Locator;

  private readonly merchantSearchButton: Locator;
  private readonly merchantSearchModal: Locator;

  /**
   * Inicializa los selectores del Navbar.
   *
   * Consideraciones:
   * - Se evita el uso de IDs completos generados por ASP.NET
   *   para prevenir fragilidad ante cambios de MasterPage
   * - Se agrupan accesos globales del sistema en este componente
   *
   * @param page Instancia activa de Playwright Page.
   */
  constructor(page: Page) {
    this.page = page;

    // Header autenticado
    this.userWelcome = page.locator("[id$='HeaderControl1_UserWelcome']");

    // Disparador del menú de usuario
    this.userMenuTrigger = page.locator(
      "ul.user_menu li.dropdown a.dropdown-toggle",
    );

    // Opciones del menú de usuario
    this.businessDateLink = page.locator("a[href='#businessDateControl']");
    this.changePasswordLink = page.getByRole("link", {
      name: NavbarMessages.CHANGE_PASSWORD_LINK,
    });
    this.aboutLink = page.getByRole("link", {
      name: NavbarMessages.ABOUT_LINK,
    });
    this.logoutLink = page.getByRole("link", {
      name: NavbarMessages.LOGOUT_LINK,
    });

    // Buscador global de comercios
    this.merchantSearchButton = page.locator(".custom-dropdown-button");
    this.merchantSearchModal = page.locator("app-merchant-search-modal");
  }

  /**
   * Espera a que el Navbar esté completamente listo para interacción.
   *
   * Comportamiento:
   * - espera a que el DOM principal haya sido cargado
   * - valida la visibilidad del header autenticado
   *
   * Este método actúa como punto de sincronización base
   * para cualquier acción que dependa del estado del layout principal.
   */
  async waitForReady(): Promise<void> {
    await this.page.waitForLoadState("domcontentloaded");
    await expect(this.userWelcome).toBeVisible();

    logger.debug("Navbar listo para interacción.");
  }

  /**
   * Abre el menú de usuario del Navbar.
   *
   * Flujo:
   * 1. Garantiza que el Navbar esté listo
   * 2. Verifica visibilidad del disparador del menú
   * 3. Ejecuta el click para desplegar las opciones
   *
   * Este método es requisito previo para cualquier acción
   * que dependa de las opciones del menú de usuario.
   */
  async openUserMenu(): Promise<void> {
    await this.waitForReady();

    await expect(this.userMenuTrigger).toBeVisible();
    await this.userMenuTrigger.click();

    logger.debug("Menú de usuario abierto.");
  }

  /**
   * Abre el buscador global de comercios desde el Navbar.
   *
   * Contexto funcional:
   * Acceso directo a la funcionalidad de búsqueda rápida de comercios.
   *
   * Flujo:
   * 1. Verifica que el Navbar esté listo
   * 2. Ejecuta click sobre el icono del buscador
   * 3. Espera a que el modal del buscador esté presente en el DOM
   *
   * Resultado esperado:
   * El overlay del buscador queda disponible para interacción.
   */
  async openMerchantSearch(): Promise<void> {
    logger.info("Abriendo buscador global de comercios.");

    await this.waitForReady();

    await expect(this.merchantSearchButton).toBeVisible();
    await this.merchantSearchButton.click();

    await expect(this.merchantSearchModal).toBeAttached();

    logger.debug("Buscador global abierto correctamente.");
  }

  /**
   * Abre el modal de Fecha de Negocio desde el menú de usuario.
   *
   * Flujo:
   * 1. Abre el menú de usuario
   * 2. Verifica disponibilidad de la opción
   * 3. Ejecuta la acción sobre el enlace correspondiente
   *
   * Este método dispara el modal utilizado para consulta de fechas operativas.
   */
  async openBusinessDateModal(): Promise<void> {
    logger.info("Abriendo modal de Fecha de Negocio.");

    await this.openUserMenu();

    await expect(this.businessDateLink).toBeVisible();
    await this.businessDateLink.click();

    logger.debug("Click en opción de Fecha de Negocio ejecutado.");
  }

  /**
   * Navega hacia la opción de cambio de contraseña.
   *
   * Flujo:
   * 1. Abre el menú de usuario
   * 2. Verifica que la opción esté visible
   * 3. Ejecuta la navegación mediante click
   *
   * Este método permite validar flujos de seguridad asociados
   * a gestión de credenciales del usuario.
   */
  async goToChangePassword(): Promise<void> {
    logger.info("Navegando a Cambiar Contraseña.");

    await this.openUserMenu();

    await expect(this.changePasswordLink).toBeVisible();
    await this.changePasswordLink.click();

    logger.debug("Click en opción de Cambiar Contraseña ejecutado.");
  }

  /**
   * Abre el modal "Acerca De" desde el menú de usuario.
   *
   * Flujo:
   * 1. Abre el menú de usuario
   * 2. Verifica visibilidad de la opción
   * 3. Ejecuta click para disparar el modal
   *
   * Este modal expone información de versión del sistema.
   */
  async openAboutModal(): Promise<void> {
    logger.info("Abriendo modal Acerca De.");

    await this.openUserMenu();

    await expect(this.aboutLink).toBeVisible();
    await this.aboutLink.click();

    logger.debug("Click en opción Acerca De ejecutado.");
  }

  /**
   * Ejecuta el cierre de sesión del usuario autenticado.
   *
   * Flujo:
   * 1. Abre el menú de usuario
   * 2. Verifica disponibilidad de la opción logout
   * 3. Ejecuta la acción de cierre de sesión
   *
   * Este método es crítico para validaciones de seguridad,
   * gestión de sesión y limpieza de estado entre pruebas.
   */
  async logout(): Promise<void> {
    logger.info("Ejecutando logout desde Navbar.");

    await this.openUserMenu();

    await expect(this.logoutLink).toBeVisible();
    await this.logoutLink.click();

    logger.debug("Click en opción de logout ejecutado.");
  }
}

import { expect, Locator, Page } from "@playwright/test";
import { NavbarMessages } from "@paystudio/test-data/navbar/navbar.constants";
import { logger } from "@utils/logger";

const navbarLogger = logger.child({ module: "Navbar" });

/**
 * Page Object Model del Navbar
 */
export class Navbar {
  private readonly page: Page;

  private readonly userWelcome: Locator;
  private readonly userMenuTrigger: Locator;

  private readonly businessDateLink: Locator;
  private readonly changePasswordLink: Locator;
  private readonly aboutLink: Locator;
  private readonly logoutLink: Locator;

  private readonly merchantSearchButton: Locator;
  private readonly merchantSearchModal: Locator;

  constructor(page: Page) {
    this.page = page;

    this.userWelcome = page.locator("[id$='HeaderControl1_UserWelcome']");

    this.userMenuTrigger = page.locator(
      "ul.user_menu li.dropdown a.dropdown-toggle",
    );

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

    this.merchantSearchButton = page.locator(".custom-dropdown-button");
    this.merchantSearchModal = page.locator("app-merchant-search-modal");
  }

  /**
   * Espera a que el Navbar esté disponible para interacción.
   */
  async waitForReady(): Promise<void> {
    await this.page.waitForLoadState("networkidle");
    await expect(this.userWelcome).toBeVisible();
  }

  /**
   * Navega por el menú principal usando click en el menú raíz,
   * hover en los submenús y click en la opción final.
   */
  async navigateByMenuPath(
    mainMenuId: string,
    submenuIds: string[],
    finalOptionId: string,
  ): Promise<void> {
    await this.waitForReady();

    const mainMenu = this.page.locator(`#${mainMenuId}`);
    await expect(mainMenu).toBeVisible();
    await mainMenu.click();

    if (submenuIds.length > 0) {
      const firstSubmenu = this.page.locator(`#${submenuIds[0]}`);

      if (!(await firstSubmenu.isVisible())) {
        await mainMenu.hover();
      }
    }

    for (const submenuId of submenuIds) {
      const submenu = this.page.locator(`#${submenuId}`);
      await expect(submenu).toBeVisible();
      await submenu.hover();
    }

    const finalOption = this.page.locator(`#${finalOptionId}`);
    await expect(finalOption).toBeVisible();
    await finalOption.click({ noWaitAfter: true });

    navbarLogger.info(
      `Navegación ejecutada por menú: ${mainMenuId} > ${submenuIds.join(" > ")} > ${finalOptionId}`,
    );
  }

  /**
   * Abre el menú desplegable del usuario autenticado.
   */
  async openUserMenu(): Promise<void> {
    await this.waitForReady();

    await expect(this.userMenuTrigger).toBeVisible();
    await this.userMenuTrigger.click();

    await expect(this.businessDateLink).toBeVisible();
  }

  /**
   * Abre el buscador de comercios desde el Navbar.
   */
  async openMerchantSearch(): Promise<void> {
    await this.waitForReady();

    await expect(this.merchantSearchButton).toBeVisible();
    await this.merchantSearchButton.click();

    await expect(this.merchantSearchModal).toBeAttached();

    navbarLogger.info("Buscador abierto");
  }

  /**
   * Abre el modal de fecha de negocio desde el menú de usuario.
   */
  async openBusinessDateModal(): Promise<void> {
    await this.openUserMenu();
    await this.businessDateLink.click();

    navbarLogger.info("Business Date abierto");
  }

  /**
   * Navega a la pantalla de cambio de contraseña desde el menú de usuario.
   */
  async goToChangePassword(): Promise<void> {
    await this.openUserMenu();
    await this.changePasswordLink.click({ noWaitAfter: true });

    navbarLogger.info("Cambio contraseña");
  }

  /**
   * Abre el modal About desde el menú de usuario.
   */
  async openAboutModal(): Promise<void> {
    await this.openUserMenu();
    await this.aboutLink.click();

    navbarLogger.info("About abierto");
  }

  /**
   * Ejecuta la opción de logout desde el menú de usuario.
   */
  async logout(): Promise<void> {
    await this.openUserMenu();
    await this.logoutLink.click();

    navbarLogger.info("Logout ejecutado");
  }
}

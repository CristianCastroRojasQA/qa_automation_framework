import { Locator, Page } from "@playwright/test";
import { logger } from "@utils/logger";

/**
 * Page Object Model de Change Password Page
 */
export class ChangePasswordPage {
  readonly title: Locator;

  readonly loginNameLabel: Locator;
  readonly loginNameValue: Locator;

  readonly fullNameLabel: Locator;
  readonly userNameValue: Locator;
  readonly userSurnameValue: Locator;

  readonly currentPasswordInput: Locator;
  readonly newPasswordInput: Locator;
  readonly repeatPasswordInput: Locator;

  readonly currentPasswordRequiredError: Locator;
  readonly newPasswordRequiredError: Locator;
  readonly repeatPasswordRequiredError: Locator;

  readonly errorSummary: Locator;
  readonly errorSummaryTitle: Locator;
  readonly errorSummaryMessages: Locator;

  readonly confirmButton: Locator;
  readonly cancelButton: Locator;

  constructor(page: Page) {
    this.title = page.locator("[id$='SelfDataControl1_label1']");

    this.loginNameLabel = page.locator("[id$='SelfDataControl1_lblLoginName']");
    this.loginNameValue = page.locator(
      "[id$='SelfDataControl1_UserDataLoginTextBox']",
    );

    this.fullNameLabel = page.locator(
      "[id$='SelfDataControl1_lblCompleteName']",
    );
    this.userNameValue = page.locator(
      "[id$='SelfDataControl1_UserDataNameTextBox']",
    );
    this.userSurnameValue = page.locator(
      "[id$='SelfDataControl1_UserDataSurnameTextBox']",
    );

    this.currentPasswordInput = page.locator(
      "[id$='SelfDataControl1_CPCurrentPasswordTextBox']",
    );
    this.newPasswordInput = page.locator(
      "[id$='SelfDataControl1_CPNewPasswordTextBox']",
    );
    this.repeatPasswordInput = page.locator(
      "[id$='SelfDataControl1_CPRepeatPasswordTextBox']",
    );

    this.currentPasswordRequiredError = page.locator(
      "[id$='SelfDataControl1_CPCurrentPasswordTextBoxValidator']",
    );
    this.newPasswordRequiredError = page.locator(
      "[id$='SelfDataControl1_CPNewPasswordTextBoxValidator']",
    );
    this.repeatPasswordRequiredError = page.locator(
      "[id$='SelfDataControl1_CPRepeatPasswordTextBoxValidator']",
    );

    this.errorSummary = page.locator("#ctl00_alertSection");
    this.errorSummaryTitle = page.locator("#ctl00_lblSummaryTitle");
    this.errorSummaryMessages = page.locator("#ctl00_alertSection ul li span");

    this.confirmButton = page.getByRole("button", { name: "Confirmar" });
    this.cancelButton = page.getByRole("button", { name: "Cancelar" });
  }

  /**
   * Diligencia los campos de contraseña y envía el formulario
   */
  async fillPasswords(
    currentPassword: string,
    newPassword: string,
    repeatPassword: string,
  ): Promise<void> {
    await this.currentPasswordInput.fill(currentPassword);
    await this.newPasswordInput.fill(newPassword);
    await this.repeatPasswordInput.fill(repeatPassword);
    await this.confirm();

    logger.info("[ChangePasswordPage] Campos de contraseña diligenciados");
  }

  /**
   * Intenta enviar sin contraseña actual
   */
  async submitWithoutCurrentPassword(
    newPassword: string,
    repeatPassword: string,
  ): Promise<void> {
    await this.fillPasswords("", newPassword, repeatPassword);
    await this.confirm();

    logger.info(
      "[ChangePasswordPage] Se confirmó el formulario sin diligenciar la contraseña actual",
    );
  }

  /**
   * Intenta enviar sin nueva contraseña
   */
  async submitWithoutNewPassword(
    currentPassword: string,
    repeatPassword: string,
  ): Promise<void> {
    await this.fillPasswords(currentPassword, "", repeatPassword);
    await this.confirm();

    logger.info(
      "[ChangePasswordPage] Se confirmó el formulario sin diligenciar la nueva contraseña",
    );
  }

  /**
   * Intenta enviar sin repetir contraseña
   */
  async submitWithoutRepeatPassword(
    currentPassword: string,
    newPassword: string,
  ): Promise<void> {
    await this.fillPasswords(currentPassword, newPassword, "");
    await this.confirm();

    logger.info(
      "[ChangePasswordPage] Se confirmó el formulario sin diligenciar la repetición de la nueva contraseña",
    );
  }

  /**
   * Click en botón confirmar
   */
  async confirm(): Promise<void> {
    await this.confirmButton.click();

    logger.info("[ChangePasswordPage] Click en botón Confirmar");
  }

  /**
   * Click en botón cancelar
   */
  async cancel(): Promise<void> {
    await this.cancelButton.click();

    logger.info("[ChangePasswordPage] Click en botón Cancelar");
  }
}

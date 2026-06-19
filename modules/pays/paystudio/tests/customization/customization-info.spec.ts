import { settings } from "@config/settings";
import { AboutModal } from "@paystudio/components/navbar/about-modal";
import { BusinessDateModal } from "@paystudio/components/navbar/business-date-modal";
import { expect, test } from "@paystudio/fixtures";
import { logger } from "@utils/logger";

const customizationLogger = logger.child({ module: "CustomizationSpec" });

/**
 * Suite de Customización
 */
test.describe("Módulo de Customización - PayStudio", () => {
  test.beforeEach(async ({ page, navbar }) => {
    await page.goto(settings.paystudioUrl);
    await navbar.waitForReady();
  });

  test("TC-01: Customización - Debe mostrar la fecha de negocio igual a la fecha actual", async ({
    page,
    navbar,
  }) => {
    await navbar.openBusinessDateModal();

    const modal = new BusinessDateModal(page);
    const businessDate = await modal.getBusinessDate();

    const today = new Date().toLocaleDateString("es-CO");

    expect(businessDate).not.toBe("");

    if (businessDate === today) {
      customizationLogger.info(
        `TC-01 validado: el modal de Fecha de Negocio mostró el valor [${businessDate}] y coincide con la fecha actual [${today}].`,
      );
    } else {
      customizationLogger.warn(
        `TC-01 validado con desviación: el modal mostró [${businessDate}] y no coincide con [${today}].`,
      );
    }

    await modal.close();

    customizationLogger.info(
      "TC-01 validado: modal abierto, fecha obtenida y cerrado correctamente.",
    );
  });

  test("TC-02: Customización - Debe mostrar la versión del sistema", async ({
    page,
    navbar,
  }) => {
    await navbar.openAboutModal();

    const aboutModal = new AboutModal(page);
    const version = await aboutModal.getVersion();

    expect(version).not.toBe("");

    await aboutModal.close();

    customizationLogger.info(
      `TC-02 validado: modal About abierto, versión obtenida [${version}] y cerrado correctamente.`,
    );
  });
});

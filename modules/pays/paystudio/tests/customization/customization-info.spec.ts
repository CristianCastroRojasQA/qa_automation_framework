import { settings } from "@config/settings";
import { AboutModal } from "@paystudio/components/navbar/about-modal";
import { BusinessDateModal } from "@paystudio/components/navbar/business-date-modal";
import { expect, test } from "@paystudio/fixtures";
import { logger } from "@utils/logger";

/**
 * Suite de pruebas del módulo de Customización de PayStudio.
 *
 * Contexto funcional:
 * Esta suite valida funcionalidades visibles desde el Navbar
 * relacionadas con información operativa y metadatos del sistema.
 *
 * Cobertura principal:
 * - consulta de la fecha de negocio
 * - consulta de la versión del sistema
 *
 * Criterio de diseño:
 * Todos los escenarios parten de un usuario autenticado,
 * ya que las funcionalidades cubiertas forman parte del
 * layout principal disponible después del login.
 *
 * La suite reutiliza Page Objects y componentes del framework
 * para mantener consistencia, aislamiento y legibilidad.
 */
test.describe(
  "Módulo de Customización - PayStudio",
  {
    tag: "@customization",
    annotation: [
      { type: "module", description: "Customización" },
      { type: "application", description: "PayStudio" },
    ],
  },
  () => {
    test.beforeEach(async ({ page, loginPage }) => {
      await loginPage.navigate(settings.paystudioUrl);

      await loginPage.login(
        settings.credentials.user,
        settings.credentials.pass,
      );

      await expect(page).toHaveURL(/MainPage/);
    });

    test.describe(
      "Business Date",
      {
        tag: "@smoke",
        annotation: { type: "category", description: "Business Date" },
      },
      () => {
        test(
          "TC-01: Customización - Debe mostrar la fecha de negocio",
          {
            tag: ["@navbar", "@modal", "@business-date"],
            annotation: [
              { type: "case", description: "TC-01" },
              {
                type: "objective",
                description:
                  "Confirmar que el modal de Fecha de Negocio se abre correctamente y muestra un valor visible y no vacío",
              },
              {
                type: "coverage",
                description:
                  "Apertura del modal desde el Navbar, lectura del valor de fecha de negocio, validación de contenido no vacío y cierre del modal",
              },
              { type: "component", description: "Navbar / BusinessDateModal" },
            ],
          },
          async ({ page, navbar }) => {
            await navbar.openBusinessDateModal();

            const businessDateModal = new BusinessDateModal(page);
            const businessDate = await businessDateModal.getBusinessDate();

            expect(businessDate).not.toBe("");

            logger.info(`Fecha de negocio validada: ${businessDate}`);

            await businessDateModal.close();

            logger.info("Validación de fecha de negocio confirmada.");
          },
        );
      },
    );

    test.describe(
      "System Version",
      {
        tag: "@smoke",
        annotation: { type: "category", description: "System Version" },
      },
      () => {
        test(
          "TC-02: Customización - Debe mostrar la versión del sistema",
          {
            tag: ["@navbar", "@modal", "@about"],
            annotation: [
              { type: "case", description: "TC-02" },
              {
                type: "objective",
                description:
                  'Confirmar que el modal "Acerca de" se abre correctamente y presenta la versión actual del sistema',
              },
              {
                type: "coverage",
                description:
                  'Apertura del modal "Acerca de", lectura de la versión expuesta en pantalla, validación de contenido no vacío y cierre del modal',
              },
              { type: "component", description: "Navbar / AboutModal" },
            ],
          },
          async ({ page, navbar }) => {
            await navbar.openAboutModal();

            const aboutModal = new AboutModal(page);
            const version = await aboutModal.getVersion();

            expect(version).not.toBe("");

            logger.info(`Versión del sistema validada: ${version}`);

            await aboutModal.close();

            logger.info("Validación de versión del sistema confirmada.");
          },
        );
      },
    );
  },
);

import { settings } from "@config/settings";
import { expect, test } from "@paystudio/fixtures";
import {
  SecurityMenuRoutes,
  SecurityMenuUrlPatterns,
} from "@paystudio/test-data/navbar/security-menu.routes";
import { logger } from "@utils/logger";

const securitySmokeLogger = logger.child({ module: "SecuritySmoke" });

/**
 * Suite de SMOKE - Módulo Seguridad
 */
test.describe("SMOKE - Seguridad | Navegación de pantallas", () => {
  test.beforeEach(async ({ page, navbar }) => {
    test.setTimeout(180000);

    await page.goto(settings.paystudioUrl);
    await navbar.waitForReady();

    securitySmokeLogger.info("Inicio navegación módulo Seguridad");
  });

  test("TC-01: Seguridad - Debe navegar a Mantenimiento de Usuario", async ({
    page,
    navbar,
  }) => {
    await navbar.navigateByMenuPath(
      SecurityMenuRoutes.main,
      [SecurityMenuRoutes.users.menu],
      SecurityMenuRoutes.users.userMaintenance,
    );

    await expect(page).toHaveURL(SecurityMenuUrlPatterns.users.userMaintenance);
  });

  test("TC-02: Seguridad - Debe navegar a Alta de Usuario", async ({
    page,
    navbar,
  }) => {
    await navbar.navigateByMenuPath(
      SecurityMenuRoutes.main,
      [SecurityMenuRoutes.users.menu],
      SecurityMenuRoutes.users.userAdd,
    );

    await expect(page).toHaveURL(SecurityMenuUrlPatterns.users.userAdd);
  });

  test("TC-03: Seguridad - Debe navegar a Habilitación de Usuario Portal Comercio", async ({
    page,
    navbar,
  }) => {
    await navbar.navigateByMenuPath(
      SecurityMenuRoutes.main,
      [SecurityMenuRoutes.users.menu],
      SecurityMenuRoutes.users.enablePortalUser,
    );

    await expect(page).toHaveURL(
      SecurityMenuUrlPatterns.users.enablePortalUser,
    );
  });

  test("TC-04: Seguridad - Debe navegar a Baja de Usuario", async ({
    page,
    navbar,
  }) => {
    await navbar.navigateByMenuPath(
      SecurityMenuRoutes.main,
      [SecurityMenuRoutes.users.menu],
      SecurityMenuRoutes.users.unsubscribePortalUser,
    );

    await expect(page).toHaveURL(
      SecurityMenuUrlPatterns.users.unsubscribePortalUser,
    );
  });

  test("TC-05: Seguridad - Debe navegar a Alta de Perfil", async ({
    page,
    navbar,
  }) => {
    await navbar.navigateByMenuPath(
      SecurityMenuRoutes.main,
      [SecurityMenuRoutes.roles.menu],
      SecurityMenuRoutes.roles.addRole,
    );

    await expect(page).toHaveURL(SecurityMenuUrlPatterns.roles.addRole);
  });

  test("TC-06: Seguridad - Debe navegar a Mantenimiento de Perfil", async ({
    page,
    navbar,
  }) => {
    await navbar.navigateByMenuPath(
      SecurityMenuRoutes.main,
      [SecurityMenuRoutes.roles.menu],
      SecurityMenuRoutes.roles.modifyRole,
    );

    await expect(page).toHaveURL(SecurityMenuUrlPatterns.roles.modifyRole);
  });

  test("TC-07: Seguridad - Debe navegar a Baja de Perfil", async ({
    page,
    navbar,
  }) => {
    await navbar.navigateByMenuPath(
      SecurityMenuRoutes.main,
      [SecurityMenuRoutes.roles.menu],
      SecurityMenuRoutes.roles.deleteRole,
    );

    await expect(page).toHaveURL(SecurityMenuUrlPatterns.roles.deleteRole);
  });

  test("TC-08: Seguridad - Debe navegar a Alta de Nivel", async ({
    page,
    navbar,
  }) => {
    await navbar.navigateByMenuPath(
      SecurityMenuRoutes.main,
      [
        SecurityMenuRoutes.controlValidation.menu,
        SecurityMenuRoutes.controlValidation.maintainLevel.menu,
      ],
      SecurityMenuRoutes.controlValidation.maintainLevel.addLevel,
    );

    await expect(page).toHaveURL(
      SecurityMenuUrlPatterns.controlValidation.maintainLevel.addLevel,
    );
  });

  test("TC-09: Seguridad - Debe navegar a Mantenimiento de Nivel", async ({
    page,
    navbar,
  }) => {
    await navbar.navigateByMenuPath(
      SecurityMenuRoutes.main,
      [
        SecurityMenuRoutes.controlValidation.menu,
        SecurityMenuRoutes.controlValidation.maintainLevel.menu,
      ],
      SecurityMenuRoutes.controlValidation.maintainLevel.modifyLevel,
    );

    await expect(page).toHaveURL(
      SecurityMenuUrlPatterns.controlValidation.maintainLevel.modifyLevel,
    );
  });

  test("TC-10: Seguridad - Debe navegar a Baja de Nivel", async ({
    page,
    navbar,
  }) => {
    await navbar.navigateByMenuPath(
      SecurityMenuRoutes.main,
      [
        SecurityMenuRoutes.controlValidation.menu,
        SecurityMenuRoutes.controlValidation.maintainLevel.menu,
      ],
      SecurityMenuRoutes.controlValidation.maintainLevel.deleteLevel,
    );

    await expect(page).toHaveURL(
      SecurityMenuUrlPatterns.controlValidation.maintainLevel.deleteLevel,
    );
  });

  test("TC-11: Seguridad - Debe navegar a Reporte de Usuarios y Accesos", async ({
    page,
    navbar,
  }) => {
    await navbar.navigateByMenuPath(
      SecurityMenuRoutes.main,
      [SecurityMenuRoutes.reports.menu],
      SecurityMenuRoutes.reports.userAccessReport,
    );

    await expect(page).toHaveURL(
      SecurityMenuUrlPatterns.reports.userAccessReport,
    );
  });

  test("TC-12: Seguridad - Debe navegar a Reporte de Perfiles", async ({
    page,
    navbar,
  }) => {
    await navbar.navigateByMenuPath(
      SecurityMenuRoutes.main,
      [SecurityMenuRoutes.reports.menu],
      SecurityMenuRoutes.reports.profilesReport,
    );

    await expect(page).toHaveURL(
      SecurityMenuUrlPatterns.reports.profilesReport,
    );
  });

  test("TC-13: Seguridad - Debe navegar a Reporte de Intentos de Acceso", async ({
    page,
    navbar,
  }) => {
    await navbar.navigateByMenuPath(
      SecurityMenuRoutes.main,
      [SecurityMenuRoutes.reports.menu],
      SecurityMenuRoutes.reports.accessAttemptsReport,
    );

    await expect(page).toHaveURL(
      SecurityMenuUrlPatterns.reports.accessAttemptsReport,
    );
  });

  test("TC-14: Seguridad - Debe navegar a Mantenimiento de Funcionalidad", async ({
    page,
    navbar,
  }) => {
    await navbar.navigateByMenuPath(
      SecurityMenuRoutes.main,
      [],
      SecurityMenuRoutes.functionalityMaintenance,
    );

    await expect(page).toHaveURL(
      SecurityMenuUrlPatterns.functionalityMaintenance,
    );
  });

  test("TC-15: Seguridad - Debe navegar a Configuración de Políticas de Seguridad", async ({
    page,
    navbar,
  }) => {
    await navbar.navigateByMenuPath(
      SecurityMenuRoutes.main,
      [],
      SecurityMenuRoutes.securityPolicyConfig,
    );

    await expect(page).toHaveURL(SecurityMenuUrlPatterns.securityPolicyConfig);
  });

  test("TC-16: Seguridad - Debe navegar a Log de Auditoría", async ({
    page,
    navbar,
  }) => {
    await navbar.navigateByMenuPath(
      SecurityMenuRoutes.main,
      [],
      SecurityMenuRoutes.auditLog,
    );

    await expect(page).toHaveURL(SecurityMenuUrlPatterns.auditLog);
  });

  test.afterAll(async () => {
    securitySmokeLogger.info(
      "SMOKE completado: navegación Seguridad validada correctamente.",
    );
  });
});

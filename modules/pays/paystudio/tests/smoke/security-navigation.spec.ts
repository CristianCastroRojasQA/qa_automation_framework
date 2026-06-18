import { settings } from "@config/settings";
import { expect, test } from "@paystudio/fixtures";
import { SmokeNavigationHelper } from "@paystudio/helpers/smoke-navigation.helper";
import { SecurityMenuRoutes } from "@paystudio/test-data/navbar/security-menu.routes";
import { logger } from "@utils/logger";

const securitySmokeLogger = logger.child({ module: "SecuritySmoke" });

/**
 * Suite de navegación del módulo Seguridad
 */
test.describe("SMOKE: Navegación completa Seguridad", () => {
  test("SMOKE: Navegación completa Seguridad", async ({
    page,
    loginPage,
    navbar,
  }) => {
    test.setTimeout(180000);

    await loginPage.goto(settings.paystudioUrl);
    await loginPage.login(settings.credentials.user, settings.credentials.pass);

    await expect(page).toHaveURL(/MainPage/);

    securitySmokeLogger.info("Inicio navegación módulo Seguridad");

    /**
     * Pantalla: Mantenimiento de Usuario
     */
    await SmokeNavigationHelper.navigateByMenuPath(
      page,
      navbar,
      SecurityMenuRoutes.main,
      [SecurityMenuRoutes.users.menu],
      SecurityMenuRoutes.users.userMaintenance,
      /P14CU7101_02Page/,
    );

    /**
     * Pantalla: Alta de Usuario
     */
    await SmokeNavigationHelper.navigateByMenuPath(
      page,
      navbar,
      SecurityMenuRoutes.main,
      [SecurityMenuRoutes.users.menu],
      SecurityMenuRoutes.users.userAdd,
      /P14CU7101_02Page/,
    );

    /**
     * Pantalla: Habilitar Usuario Portal Comercio
     */
    await SmokeNavigationHelper.navigateByMenuPath(
      page,
      navbar,
      SecurityMenuRoutes.main,
      [SecurityMenuRoutes.users.menu],
      SecurityMenuRoutes.users.enablePortalUser,
      /EnablePortalUser/,
    );

    /**
     * Pantalla: Baja de Usuario
     */
    await SmokeNavigationHelper.navigateByMenuPath(
      page,
      navbar,
      SecurityMenuRoutes.main,
      [SecurityMenuRoutes.users.menu],
      SecurityMenuRoutes.users.unsubscribePortalUser,
      /UnsubscribePortalUser/,
    );

    /**
     * Pantalla: Alta de Perfil
     */
    await SmokeNavigationHelper.navigateByMenuPath(
      page,
      navbar,
      SecurityMenuRoutes.main,
      [SecurityMenuRoutes.roles.menu],
      SecurityMenuRoutes.roles.addRole,
      /RoleAdministration/,
    );

    /**
     * Pantalla: Mantenimiento de Perfil
     */
    await SmokeNavigationHelper.navigateByMenuPath(
      page,
      navbar,
      SecurityMenuRoutes.main,
      [SecurityMenuRoutes.roles.menu],
      SecurityMenuRoutes.roles.modifyRole,
      /RoleAdministration/,
    );

    /**
     * Pantalla: Baja de Perfil
     */
    await SmokeNavigationHelper.navigateByMenuPath(
      page,
      navbar,
      SecurityMenuRoutes.main,
      [SecurityMenuRoutes.roles.menu],
      SecurityMenuRoutes.roles.deleteRole,
      /RoleAdministration/,
    );

    /**
     * Pantalla: Alta de Nivel
     */
    await SmokeNavigationHelper.navigateByMenuPath(
      page,
      navbar,
      SecurityMenuRoutes.main,
      [
        SecurityMenuRoutes.controlValidation.menu,
        SecurityMenuRoutes.controlValidation.maintainLevel.menu,
      ],
      SecurityMenuRoutes.controlValidation.maintainLevel.addLevel,
      /SECUC009_LevelControlMainteinance/,
    );

    /**
     * Pantalla: Mantenimiento de Nivel
     */
    await SmokeNavigationHelper.navigateByMenuPath(
      page,
      navbar,
      SecurityMenuRoutes.main,
      [
        SecurityMenuRoutes.controlValidation.menu,
        SecurityMenuRoutes.controlValidation.maintainLevel.menu,
      ],
      SecurityMenuRoutes.controlValidation.maintainLevel.modifyLevel,
      /SECUC009_LevelControlMainteinance/,
    );

    /**
     * Pantalla: Baja de Nivel
     */
    await SmokeNavigationHelper.navigateByMenuPath(
      page,
      navbar,
      SecurityMenuRoutes.main,
      [
        SecurityMenuRoutes.controlValidation.menu,
        SecurityMenuRoutes.controlValidation.maintainLevel.menu,
      ],
      SecurityMenuRoutes.controlValidation.maintainLevel.deleteLevel,
      /SECUC009_LevelControlMainteinance/,
    );

    /**
     * Pantalla: Reporte de Usuarios y Accesos
     */
    await SmokeNavigationHelper.navigateByMenuPath(
      page,
      navbar,
      SecurityMenuRoutes.main,
      [SecurityMenuRoutes.reports.menu],
      SecurityMenuRoutes.reports.userAccessReport,
      /SERUC001_UserAccessReport/,
    );

    /**
     * Pantalla: Reporte de Perfiles
     */
    await SmokeNavigationHelper.navigateByMenuPath(
      page,
      navbar,
      SecurityMenuRoutes.main,
      [SecurityMenuRoutes.reports.menu],
      SecurityMenuRoutes.reports.profilesReport,
      /SERUC002_ProfilesReport/,
    );

    /**
     * Pantalla: Reporte Intento de Accesos
     */
    await SmokeNavigationHelper.navigateByMenuPath(
      page,
      navbar,
      SecurityMenuRoutes.main,
      [SecurityMenuRoutes.reports.menu],
      SecurityMenuRoutes.reports.accessAttemptsReport,
      /SERUC003_AccessAttemptsReport/,
    );

    /**
     * Pantalla: Mantenimiento de Funcionalidad
     */
    await SmokeNavigationHelper.navigateByMenuPath(
      page,
      navbar,
      SecurityMenuRoutes.main,
      [],
      SecurityMenuRoutes.functionalityMaintenance,
      /SECUC008_AdminFuncionality/,
    );

    /**
     * Pantalla: Configuración Políticas Seguridad
     */
    await SmokeNavigationHelper.navigateByMenuPath(
      page,
      navbar,
      SecurityMenuRoutes.main,
      [],
      SecurityMenuRoutes.securityPolicyConfig,
      /SECUC002_SecurityPolicyConfiguration/,
    );

    /**
     * Pantalla: Log de Auditoría
     */
    await SmokeNavigationHelper.navigateByMenuPath(
      page,
      navbar,
      SecurityMenuRoutes.main,
      [],
      SecurityMenuRoutes.auditLog,
      /AUDUC001_GetEntityLog/,
    );

    securitySmokeLogger.info("SMOKE completado: navegación Seguridad OK");
  });
});

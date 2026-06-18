/**
 * IDs de navegación del menú Seguridad en PayStudio.
 */
export const SecurityMenuRoutes = {
  main: "SECURITY_KEY",

  users: {
    menu: "USERS_KEY",
    userMaintenance: "UserAdministration_02",
    userAdd: "UserAdministration_01",
    enablePortalUser: "ANG_SC_EnablePortalUser",
    unsubscribePortalUser: "ANG_SC_UnsubscribePortalUser",
  },

  roles: {
    menu: "ROLES_KEY",
    addRole: "AddRole",
    modifyRole: "ModifyRole",
    deleteRole: "DeleteRole",
  },

  controlValidation: {
    menu: "CONTROLVALIDATION_KEY",

    maintainLevel: {
      menu: "CONTROLVALIDATION_MAINTAIN_LEVEL_KEY",
      addLevel: "SECUC009_AddLevel",
      modifyLevel: "SECUC009_ModifyLevel",
      deleteLevel: "SECUC009_DeleteLevel",
    },
  },

  reports: {
    menu: "REPORTS_KEY",
    userAccessReport: "SERUC001_UserAccessReport",
    profilesReport: "SERUC002_ProfilesReport",
    accessAttemptsReport: "SERUC003_AccessAttemptsReport",
  },

  functionalityMaintenance: "SECUC008_AdminFuncionality",
  securityPolicyConfig: "SECUC002_SecurityPolicyConfig",
  auditLog: "AUDUC001_GetEntityLog",
} as const;

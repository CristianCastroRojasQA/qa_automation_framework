import * as dotenv from "dotenv";
import {
  AuthTestData,
  DatabaseConfig,
  LoggerConfig,
  PlaywrightBrowser,
  PlaywrightExecutionConfig,
  ProjectCredentials,
  UserRole,
} from "@types-fw/settings.types";

// Cargar variables de entorno
dotenv.config();

/**
 * Configuración central del framework (Singleton).
 */
class Settings {
  // Prefijo dinámico: DOMAIN_PROJECT_ENV
  private readonly PREFIX: string;
  private readonly PROJECT: string;
  private readonly ENVIRONMENT: string;

  // Instancia única
  private static _instance: Settings;

  private constructor() {
    const domain = (process.env.DOMAIN || "PAYS").toUpperCase();
    const project = (process.env.PROJECT || "BPAGOS").toUpperCase();
    const env = (process.env.ENV || "CERT").toUpperCase();

    this.PROJECT = project;
    this.ENVIRONMENT = env;
    this.PREFIX = `${domain}_${project}_${env}`;

    console.log("---------------------------------------------------------");
    console.log("FRAMEWORK QA: Configuración cargada con éxito");
    console.log(`Proyecto Actual: [${project}] | Ambiente: [${env}]`);
    console.log(`Prefijo de Variables: ${this.PREFIX}`);
    console.log("---------------------------------------------------------");
  }

  // Acceso global
  public static get instance(): Settings {
    if (!Settings._instance) {
      Settings._instance = new Settings();
    }
    return Settings._instance;
  }

  // Proyecto activo
  get project(): string {
    return this.PROJECT;
  }

  // Ambiente activo
  get environment(): string {
    return this.ENVIRONMENT;
  }

  // URL PayStudio
  get paystudioUrl(): string {
    return this.getEnvVar("URL");
  }

  // URL Portal
  get portalUrl(): string {
    return this.getEnvVar("PORTAL_URL");
  }

  // Credenciales principales
  get credentials(): ProjectCredentials {
    return {
      user: this.getEnvVar("USER"),
      pass: this.getEnvVar("PASS"),
    };
  }

  // Datos de autenticación para pruebas
  get authTestData(): AuthTestData {
    return {
      reusedPreviousPassword: this.getEnvVar("REUSED_PREVIOUS_PASSWORD"),
      validNewPassword: this.getEnvVar("VALID_NEW_PASSWORD"),
    };
  }

  // Credenciales para pruebas de inactividad
  // get authInactivityCredentials(): ProjectCredentials {
  //   return {
  //     user: this.getEnvVar("AUTH_INACTIVITY_USER"),
  //     pass: this.getEnvVar("AUTH_INACTIVITY_PASS"),
  //   };
  // }

  // Configuración de logs
  get loggerConfig(): LoggerConfig {
    return {
      level: process.env.LOG_LEVEL || "info",
      maxSize: process.env.LOG_MAX_SIZE || "10m",
      maxFiles: process.env.LOG_MAX_FILES || "14d",
      dir: process.env.LOG_DIR || "Logs",
    };
  }

  // Configuración DB
  get database(): DatabaseConfig {
    return {
      server: this.getEnvVar("DB_SERVER"),
      database: this.getEnvVar("DB_NAME"),
      user: this.getEnvVar("DB_USER"),
      password: this.getEnvVar("DB_PASS"),
    };
  }

  // Configuración Playwright
  get playwrightConfig(): PlaywrightExecutionConfig {
    const rawBrowser = (process.env.PLAYWRIGHT_BROWSER || "chromium")
      .trim()
      .toLowerCase();

    const browser: PlaywrightBrowser =
      rawBrowser === "firefox" || rawBrowser === "webkit"
        ? rawBrowser
        : "chromium";

    const rawWorkers = process.env.PLAYWRIGHT_WORKERS;
    const parsedWorkers = rawWorkers ? Number(rawWorkers) : undefined;

    return {
      parallel:
        (process.env.PLAYWRIGHT_PARALLEL || "false").trim().toLowerCase() ===
        "true",

      workers:
        parsedWorkers !== undefined && !Number.isNaN(parsedWorkers)
          ? parsedWorkers
          : undefined,

      headless:
        (process.env.PLAYWRIGHT_HEADLESS || "false").trim().toLowerCase() ===
        "true",

      browser,
    };
  }

  // Credenciales Portal por rol
  public getPortalCredentials(
    role: UserRole = "superadmin",
  ): ProjectCredentials {
    const roleKey = role.toUpperCase();

    return {
      user: this.getEnvVar(`PORTAL_${roleKey}_USER`),
      pass: this.getEnvVar(`PORTAL_${roleKey}_PASS`),
    };
  }

  // Resolver variable dinámica
  private getEnvVar(suffix: string): string {
    const key = `${this.PREFIX}_${suffix}`;
    const value = process.env[key];

    if (!value) {
      throw new Error(
        `ERROR DE CONFIGURACIÓN: Falta la clave [${key}] en .env`,
      );
    }

    return value;
  }
}

// Instancia global
export const settings = Settings.instance;

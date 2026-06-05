import * as dotenv from "dotenv";
import {
  DatabaseConfig,
  LoggerConfig,
  PlaywrightBrowser,
  PlaywrightExecutionConfig,
  ProjectCredentials,
  UserRole,
} from "@types-fw/settings.types";

// Carga inicial de variables de entorno desde el archivo .env
dotenv.config();

/**
 * Punto central de acceso a la configuración del framework.
 *
 * Responsabilidades:
 * - Resolver variables de entorno de forma dinámica
 * - Estandarizar la convención de nombres basada en entorno
 * - Proveer acceso tipado a configuraciones críticas
 *
 * Convención utilizada para las variables:
 * DOMAIN_PROJECT_ENV_VARIABLE
 *
 * Ejemplo real:
 * PAYS_BPAGOS_CERT_URL
 *
 * Este diseño permite:
 * - Soporte multi-proyecto
 * - Soporte multi-ambiente
 * - Evitar hardcoding de configuraciones
 */
class Settings {
  /**
   * Prefijo dinámico utilizado para resolver variables de entorno.
   *
   * Se construye en base a:
   * DOMAIN + PROJECT + ENV
   *
   * Ejemplo:
   * PAYS_BPAGOS_CERT
   */
  private readonly PREFIX: string;

  /**
   * Instancia única (patrón Singleton).
   *
   * Garantiza un único punto de acceso consistente
   * a la configuración durante el ciclo de vida del framework.
   */
  private static _instance: Settings;

  /**
   * Inicializa la configuración base del framework.
   *
   * Orígenes:
   * - DOMAIN  -> Dominio funcional (ej: PAYS)
   * - PROJECT -> Proyecto (ej: BPAGOS)
   * - ENV     -> Ambiente (ej: CERT, QA, PROD)
   *
   * Comportamiento:
   * - Aplica valores por defecto si no existen variables
   * - Normaliza a mayúsculas para evitar inconsistencias
   * - Construye el prefijo dinámico de resolución
   * - Emite log inicial para trazabilidad
   */
  private constructor() {
    const domain = (process.env.DOMAIN || "PAYS").toUpperCase();
    const project = (process.env.PROJECT || "BPAGOS").toUpperCase();
    const env = (process.env.ENV || "CERT").toUpperCase();

    this.PREFIX = `${domain}_${project}_${env}`;

    console.log("---------------------------------------------------------");
    console.log("FRAMEWORK QA: Configuración cargada con éxito");
    console.log(`Proyecto Actual: [${project}] | Ambiente: [${env}]`);
    console.log(`Prefijo de Variables: ${this.PREFIX}`);
    console.log("---------------------------------------------------------");
  }

  /**
   * Acceso global a la instancia de configuración.
   *
   * Implementa inicialización lazy (lazy loading),
   * creando la instancia solo cuando es requerida.
   */
  public static get instance(): Settings {
    if (!Settings._instance) {
      Settings._instance = new Settings();
    }
    return Settings._instance;
  }

  /**
   * URL principal de PayStudio (BackOffice).
   *
   * Fuente:
   * VARIABLE: <PREFIX>_URL
   */
  get paystudioUrl(): string {
    return this.getEnvVar("URL");
  }

  /**
   * URL del portal de comercio.
   *
   * Fuente:
   * VARIABLE: <PREFIX>_PORTAL_URL
   */
  get portalUrl(): string {
    return this.getEnvVar("PORTAL_URL");
  }

  /**
   * Credenciales principales asociadas al proyecto actual.
   *
   * Fuente:
   * - <PREFIX>_USER
   * - <PREFIX>_PASS
   *
   * Uso típico:
   * Autenticación en BackOffice (PayStudio)
   */
  get credentials(): ProjectCredentials {
    return {
      user: this.getEnvVar("USER"),
      pass: this.getEnvVar("PASS"),
    };
  }

  /**
   * Configuración consolidada del sistema de logging.
   *
   * Consideraciones:
   * - Utiliza valores de entorno cuando están disponibles
   * - Define valores por defecto para evitar fallos por configuración incompleta
   *
   * No depende del prefijo dinámico, ya que aplica a nivel global del framework.
   */
  get loggerConfig(): LoggerConfig {
    return {
      level: process.env.LOG_LEVEL || "info",
      maxSize: process.env.LOG_MAX_SIZE || "10m",
      maxFiles: process.env.LOG_MAX_FILES || "14d",
      dir: process.env.LOG_DIR || "Logs",
    };
  }

  /**
   * Configuración de conexión a base de datos
   * asociada al proyecto y ambiente activos.
   *
   * Fuente:
   * - <PREFIX>_DB_SERVER
   * - <PREFIX>_DB_NAME
   * - <PREFIX>_DB_USER
   * - <PREFIX>_DB_PASS
   */
  get database(): DatabaseConfig {
    return {
      server: this.getEnvVar("DB_SERVER"),
      database: this.getEnvVar("DB_NAME"),
      user: this.getEnvVar("DB_USER"),
      password: this.getEnvVar("DB_PASS"),
    };
  }

  /**
   * Configuración de ejecución de Playwright.
   *
   * Fuente:
   * - PLAYWRIGHT_PARALLEL
   * - PLAYWRIGHT_WORKERS
   * - PLAYWRIGHT_HEADLESS
   * - PLAYWRIGHT_BROWSER
   *
   * Este getter centraliza la lectura de variables
   * de entorno relacionadas con la ejecución del runner,
   * manteniendo un contrato tipado único hacia `playwright.config.ts`.
   */
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

  /**
   * Obtiene credenciales del portal según el rol especificado.
   *
   * @param role Rol funcional del usuario (default: superadmin)
   *
   * Resolución dinámica:
   * - <PREFIX>_PORTAL_<ROLE>_USER
   * - <PREFIX>_PORTAL_<ROLE>_PASS
   */
  public getPortalCredentials(
    role: UserRole = "superadmin",
  ): ProjectCredentials {
    const roleKey = role.toUpperCase();

    return {
      user: this.getEnvVar(`PORTAL_${roleKey}_USER`),
      pass: this.getEnvVar(`PORTAL_${roleKey}_PASS`),
    };
  }

  /**
   * Resuelve una variable de entorno basada en el prefijo dinámico.
   *
   * @param suffix Sufijo de la variable a resolver
   * @throws Error Si la variable no está definida
   */
  private getEnvVar(suffix: string): string {
    const key = `${this.PREFIX}_${suffix}`;
    const value = process.env[key];

    if (!value) {
      throw new Error(
        `ERROR DE CONFIGURACIÓN: La clave [${key}] no está definida en el archivo .env. ` +
          `Verifica DOMAIN, PROJECT y ENV.`,
      );
    }

    return value;
  }
}

/**
 * Instancia única expuesta para consumo global.
 *
 * Debe ser utilizada como única fuente de configuración
 * en todo el framework para garantizar consistencia.
 */
export const settings = Settings.instance;

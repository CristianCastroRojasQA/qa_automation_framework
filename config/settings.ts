import * as dotenv from "dotenv";
import {
  LoggerConfig,
  ProjectCredentials,
  UserRole,
} from "../types/settings.types";

// Carga variables de entorno desde el archivo .env
dotenv.config();

/**
 * Centraliza el acceso a variables de entorno del framework.
 *
 * Las variables se resuelven dinámicamente usando
 * la siguiente convención:
 *
 * DOMAIN_PROJECT_ENV_VARIABLE
 *
 * Ejemplo:
 * PAYS_BPAGOS_CERT_URL
 */
class Settings {
  /**
   * Prefijo dinámico utilizado para construir
   * claves específicas del proyecto y ambiente.
   *
   * Ejemplo:
   * PAYS_BPAGOS_CERT
   */
  private readonly PREFIX: string;

  /**
   * Instancia única de Settings (Singleton).
   */
  private static _instance: Settings;

  /**
   * Inicializa la configuración principal del framework.
   *
   * DOMAIN  -> Dominio funcional
   * PROJECT -> Proyecto actual
   * ENV     -> Ambiente de ejecución
   */
  private constructor() {
    // Normaliza valores para evitar inconsistencias
    const domain = (process.env.DOMAIN || "PAYS").toUpperCase();
    const project = (process.env.PROJECT || "BPAGOS").toUpperCase();
    const env = (process.env.ENV || "CERT").toUpperCase();

    // Construye prefijo dinámico:
    // PAYS_BPAGOS_CERT
    this.PREFIX = `${domain}_${project}_${env}`;

    // Log inicial del framework
    console.log("---------------------------------------------------------");
    console.log("FRAMEWORK QA: Configuración cargada con éxito");
    console.log(`Proyecto Actual: [${project}] | Ambiente: [${env}]`);
    console.log(`Prefijo de Variables: ${this.PREFIX}`);
    console.log("---------------------------------------------------------");
  }

  /**
   * Retorna la instancia única de configuración.
   */
  public static get instance(): Settings {
    if (!Settings._instance) {
      Settings._instance = new Settings();
    }
    return Settings._instance;
  }

  /**
   * URL principal de PayStudio (BackOffice).
   */
  get paystudioUrl(): string {
    return this.getEnvVar("URL");
  }

  /**
   * URL del portal de comercio.
   */
  get portalUrl(): string {
    return this.getEnvVar("PORTAL_URL");
  }

  /**
   * Credenciales principales del proyecto actual.
   */
  get credentials(): ProjectCredentials {
    return {
      user: this.getEnvVar("USER"),
      pass: this.getEnvVar("PASS"),
    };
  }

  /**
   * Configuración tipada del sistema de logs.
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
   * Obtiene credenciales del portal según el rol solicitado.
   *
   * @param role Rol de usuario del portal.
   * @example
   * getPortalCredentials("superadmin")
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
   * Resuelve variables de entorno usando
   * el prefijo dinámico configurado.
   *
   * @param suffix Sufijo de la variable.
   * @example
   * getEnvVar("URL")
   * -> PAYS_BPAGOS_CERT_URL
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
 * Instancia global reutilizable del sistema de configuración.
 */
export const settings = Settings.instance;

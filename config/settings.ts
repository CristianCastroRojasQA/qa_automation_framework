import * as dotenv from "dotenv";

// Carga las variables de entorno desde el archivo .env a process.env
dotenv.config();

class Settings {
  private readonly PREFIX: string;

  // ==============================================================================
  // CONSTRUCTOR Y LÓGICA DE PREFIJOS
  // ==============================================================================

  /**
   * Construye la jerarquía dinámica: DOMINIO_PROYECTO_AMBIENTE
   * Ejemplo: PAYS_BPAGOS_CERT
   */
  private constructor() {
    const domain = (process.env.DOMAIN || "PAYS").toUpperCase();
    const project = (process.env.PROJECT || "BPAGOS").toUpperCase();
    const env = (process.env.ENV || "CERT").toUpperCase();

    // El prefijo se usará para buscar variables específicas en el .env
    this.PREFIX = `${domain}_${project}_${env}`;
  }

  // ==============================================================================
  // PATRÓN SINGLETON (Instancia única)
  // ==============================================================================

  private static _instance: Settings;

  /**
   * Asegura que solo exista una instancia de Settings en toda la ejecución
   */
  public static get instance(): Settings {
    if (!Settings._instance) {
      Settings._instance = new Settings();
    }
    return Settings._instance;
  }

  // ==============================================================================
  // MÉTODOS DE ACCESO (GETTERS)
  // ==============================================================================

  /** @returns URL principal de PayStudio (BackOffice) */
  get paystudioUrl(): string {
    return this.getEnvVar("URL");
  }

  /** @returns URL del Portal de Comercio */
  get portalUrl(): string {
    return this.getEnvVar("PORTAL_URL");
  }

  /** @returns Credenciales estándar del proyecto actual */
  get credentials() {
    return {
      user: this.getEnvVar("USER"),
      pass: this.getEnvVar("PASS"),
    };
  }

  /**
   * Recupera credenciales del portal basadas en un rol específico
   * @param role Tipo de usuario (ej. 'superadmin')
   */
  public getPortalCredentials(
    role: "superadmin" | "admin" | "local" = "admin",
  ) {
    const roleKey = role.toUpperCase();
    return {
      user: this.getEnvVar(`PORTAL_${roleKey}_USER`),
      pass: this.getEnvVar(`PORTAL_${roleKey}_PASS`),
    };
  }

  // ==============================================================================
  // UTILIDADES PRIVADAS
  // ==============================================================================

  /**
   * Construye la llave completa y busca su valor en process.env
   * @example getEnvVar("URL") -> Retorna valor de PAYS_BPAGOS_CERT_URL
   */
  private getEnvVar(suffix: string): string {
    const key = `${this.PREFIX}_${suffix}`;
    const value = process.env[key];

    if (!value) {
      console.warn(
        `⚠️ Advertencia: La clave [${key}] no está definida en el .env`,
      );
      return "";
    }
    return value;
  }
}

// Exporta la instancia única para ser usada en todo el framework
export const settings = Settings.instance;

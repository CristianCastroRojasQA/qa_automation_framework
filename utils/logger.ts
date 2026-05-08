import winston from "winston";
import DailyRotateFile from "winston-daily-rotate-file";
import path from "path";
import { settings } from "../config/settings";
import { LoggerConfig } from "../types/settings.types";

/**
 * Formato estándar utilizado por el sistema de logs.
 *
 * Estructura:
 * YYYY-MM-DD HH:mm:ss [LEVEL]: mensaje
 *
 * Si el error contiene stack trace, se prioriza
 * su visualización para facilitar debugging.
 */
const customFormat = winston.format.printf(
  ({ timestamp, level, message, stack }) => {
    return `${timestamp} [${level.toUpperCase()}]: ${stack || message}`;
  },
);

/**
 * Crea una instancia configurable del logger.
 *
 * Implementa el patrón Factory para desacoplar
 * la creación del logger de la configuración global.
 *
 * Beneficios:
 * - facilita testing
 * - permite reutilización
 * - evita dependencias globales directas
 */
const createLoggerInstance = (config: LoggerConfig) => {
  /**
   * Directorio raíz donde se almacenarán
   * los archivos de logs rotativos.
   */
  const logDir = path.join(process.cwd(), config.dir);

  /**
   * Crea un transporte rotativo basado en fecha.
   *
   * Cada archivo se genera diariamente
   * usando el patrón:
   *
   * application-YYYY-MM-DD.log
   */
  const rotateTransport = (filename: string, level?: string) =>
    new DailyRotateFile({
      dirname: logDir,
      filename: `${filename}-%DATE%.log`,
      datePattern: "YYYY-MM-DD",
      maxSize: config.maxSize,
      maxFiles: config.maxFiles,
      level: level || config.level,
      auditFile: path.join(logDir, ".audit.json"),
    });

  /**
   * Configuración principal del logger.
   */
  return winston.createLogger({
    level: config.level,
    format: winston.format.combine(
      winston.format.timestamp({ format: "YYYY-MM-DD HH:mm:ss" }),
      // Permite serializar stack traces automáticamente.
      winston.format.errors({ stack: true }),
      customFormat,
    ),
    transports: [
      /**
       * Logs principales de aplicación.
       */
      rotateTransport("application"),

      /**
       * Salida por consola para desarrollo
       * y debugging en tiempo real.
       */
      new winston.transports.Console({
        format: winston.format.combine(
          winston.format.colorize({ all: true }),
          customFormat,
        ),
      }),
    ],

    /**
     * Manejo centralizado de excepciones no controladas.
     */
    exceptionHandlers: [rotateTransport("exceptions")],

    /**
     * Manejo centralizado de promesas rechazadas.
     */
    rejectionHandlers: [rotateTransport("rejections")],

    // Evita finalizar automáticamente la aplicación
    // ante errores controlados por Winston.
    exitOnError: false,
  });
};

/**
 * Instancia global reutilizable del sistema de logs.
 */
export const logger = createLoggerInstance(settings.loggerConfig);

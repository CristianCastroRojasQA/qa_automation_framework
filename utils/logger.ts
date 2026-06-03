import winston from "winston";
import DailyRotateFile from "winston-daily-rotate-file";
import path from "path";
import { settings } from "@config/settings";
import { LoggerConfig } from "@types-fw/settings.types";

/**
 * Formato estándar utilizado por el sistema de logs.
 *
 * Estructura:
 * YYYY-MM-DD HH:mm:ss [LEVEL]: mensaje
 *
 * Comportamiento:
 * - prioriza el stack trace cuando existe (errores)
 * - fallback al mensaje simple si no hay stack
 *
 * Este formato garantiza:
 * - consistencia en todos los transportes
 * - facilidad de lectura
 * - soporte claro para debugging
 */
const customFormat = winston.format.printf(
  ({ timestamp, level, message, stack }) => {
    return `${timestamp} [${level.toUpperCase()}]: ${stack || message}`;
  },
);

/**
 * Factory para la creación de instancias de logger configurables.
 *
 * Contexto:
 * Permite desacoplar la construcción del logger de la configuración global
 * y habilita la reutilización del mismo patrón en distintos entornos.
 *
 * Beneficios:
 * - encapsula la configuración de Winston
 * - facilita testing (posible mock)
 * - soporta múltiples configuraciones si se requiere
 * - evita dependencia directa en variables globales
 *
 * @param config Configuración tipada del logger (proveniente de settings)
 */
const createLoggerInstance = (config: LoggerConfig) => {
  /**
   * Directorio base donde se almacenan los archivos de log.
   *
   * Se construye en base al root del proyecto para:
   * - mantener consistencia entre entornos
   * - evitar rutas relativas frágiles
   */
  const logDir = path.join(process.cwd(), config.dir);

  /**
   * Factory interna para crear transportes rotativos por archivo.
   *
   * Comportamiento:
   * - genera un archivo diario
   * - controla tamaño máximo de archivo
   * - limita cantidad de historiales almacenados
   *
   * Patrón de nombre:
   * <filename>-YYYY-MM-DD.log
   *
   * @param filename Prefijo del archivo
   * @param level Nivel de log opcional (override)
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
   * Configuración principal del logger Winston.
   *
   * Características:
   * - formato global unificado
   * - múltiples transportes (archivo + consola)
   * - manejo centralizado de errores no controlados
   * - configuración basada en entorno
   */
  return winston.createLogger({
    /**
     * Nivel base de logging (info, warn, error, etc.)
     */
    level: config.level,

    /**
     * Pipeline de formateo aplicado a todos los logs.
     */
    format: winston.format.combine(
      winston.format.timestamp({ format: "YYYY-MM-DD HH:mm:ss" }),

      // Permite serializar automáticamente errores con stack trace
      winston.format.errors({ stack: true }),

      customFormat,
    ),

    transports: [
      /**
       * Transporte principal a archivo:
       * Registra logs de la aplicación en archivos rotativos diarios.
       */
      rotateTransport("application"),

      /**
       * Transporte de consola:
       *
       * Uso:
       * - debugging en tiempo real
       * - desarrollo local
       *
       * Nota importante:
       * Winston no hereda el format global cuando un transport define uno propio,
       * por lo que se replica el mismo pipeline para mantener consistencia.
       */
      new winston.transports.Console({
        format: winston.format.combine(
          winston.format.timestamp({ format: "YYYY-MM-DD HH:mm:ss" }),
          winston.format.errors({ stack: true }),
          winston.format.colorize({ all: true }),
          customFormat,
        ),
      }),
    ],

    /**
     * Manejo centralizado de excepciones no controladas.
     *
     * Permite capturar errores críticos que no fueron manejados
     * explícitamente dentro de la aplicación.
     */
    exceptionHandlers: [rotateTransport("exceptions")],

    /**
     * Manejo centralizado de promesas rechazadas (unhandled rejections).
     *
     * Permite capturar errores asincrónicos no controlados.
     */
    rejectionHandlers: [rotateTransport("rejections")],

    /**
     * Configuración de comportamiento ante errores.
     *
     * - false: evita que la aplicación termine automáticamente
     * - delega el control al flujo de la aplicación
     */
    exitOnError: false,
  });
};

/**
 * Instancia global del logger del framework.
 *
 * Contexto:
 * - se construye usando la configuración dinámica de settings
 * - actúa como punto único de logging en toda la aplicación
 *
 * Uso recomendado:
 * - importar directamente `logger` en lugar de crear nuevas instancias
 * - mantener consistencia y trazabilidad global
 */
export const logger = createLoggerInstance(settings.loggerConfig);

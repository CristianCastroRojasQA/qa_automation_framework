import winston from "winston";
import DailyRotateFile from "winston-daily-rotate-file";
import path from "path";
import { settings } from "@config/settings";
import { LoggerConfig } from "@types-fw/settings.types";

// Formato de salida estándar
const customFormat = winston.format.printf(
  ({ timestamp, level, message, stack }) =>
    `${timestamp} [${level.toUpperCase()}]: ${stack || message}`,
);

// Crear instancia de logger
const createLoggerInstance = (config: LoggerConfig) => {
  const logDir = path.join(process.cwd(), config.dir);

  // Transporte de archivos rotativos
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

  return winston.createLogger({
    level: config.level,

    format: winston.format.combine(
      winston.format.timestamp({ format: "YYYY-MM-DD HH:mm:ss" }),
      winston.format.errors({ stack: true }),
      customFormat,
    ),

    transports: [
      // Archivo
      rotateTransport("application"),

      // Consola
      new winston.transports.Console({
        format: winston.format.combine(
          winston.format.timestamp({ format: "YYYY-MM-DD HH:mm:ss" }),
          winston.format.errors({ stack: true }),
          winston.format.colorize({ all: true }),
          customFormat,
        ),
      }),
    ],

    // Manejo global de errores
    exceptionHandlers: [rotateTransport("exceptions")],
    rejectionHandlers: [rotateTransport("rejections")],

    exitOnError: false,
  });
};

// Logger global del framework
export const logger = createLoggerInstance(settings.loggerConfig);

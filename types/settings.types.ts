// Roles soportados en el framework
export type UserRole = "superadmin" | "admin" | "local";

// Credenciales estándar
export interface ProjectCredentials {
  user: string;
  pass: string;
}

// Configuración de logs
export interface LoggerConfig {
  level: string;
  maxSize: string;
  maxFiles: string;
  dir: string;
}

// Configuración DB
export interface DatabaseConfig {
  server: string;
  database: string;
  user: string;
  password: string;
}

// Navegadores soportados
export type PlaywrightBrowser = "chromium" | "firefox" | "webkit";

// Configuración Playwright
export interface PlaywrightExecutionConfig {
  parallel: boolean;
  workers?: number;
  headless: boolean;
  browser: PlaywrightBrowser;
}
``;

import "dotenv/config";

function required(key: string): string {
  const value = process.env[key];
  if (value === undefined) throw new Error(`Falta la variable de entorno requerida: ${key}`);
  return value;
}

export const NODE_ENV = (process.env.NODE_ENV ?? "dev") as "dev" | "prod";
export const DEBUG = NODE_ENV === "dev";
export const PORT = Number(process.env.PORT) || 3000;
export const DB_HOSTNAME = process.env.DB_HOSTNAME ?? "localhost";
export const DB_PORT = Number(process.env.DB_PORT) || 5432;
export const DB_USERNAME = process.env.DB_USERNAME ?? "postgres";
export const DB_PASSWORD = process.env.DB_PASSWORD ?? "";
export const DB_DATABASE = required("DB_DATABASE");
export const JWT_SECRET = required("JWT_SECRET");

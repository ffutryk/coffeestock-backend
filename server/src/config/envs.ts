import "dotenv/config";

function required(key: string): string {
  const value = process.env[key];
  if (value === undefined) throw new Error(`Falta la variable de entorno requerida: ${key}`);
  return value;
}

export const NODE_ENV = (process.env.NODE_ENV ?? "dev") as "dev" | "prod";
export const DEBUG = NODE_ENV === "dev";
export const PORT = Number(process.env.BACKEND_PORT) || 3000;
export const DB_HOSTNAME = process.env.POSTGRES_HOSTNAME ?? "localhost";
export const DB_PORT = Number(process.env.POSTGRES_PORT) || 5432;
export const DB_USERNAME = process.env.POSTGRES_USER ?? "postgres";
export const DB_PASSWORD = process.env.POSTGRES_PASSWORD ?? "root";
export const DB_DATABASE = "coffeestock";
export const JWT_SECRET = "x2ZxRWjGVavFfV2MCGCFWhdXULKyZCN11dST0Ul2Jtw";

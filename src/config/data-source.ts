import "reflect-metadata";
import { DataSource } from "typeorm";
import { DB_DATABASE, DB_HOSTNAME, DB_PASSWORD, DB_PORT, DB_USERNAME, DEBUG } from "./envs.js";
import { ItemVenta } from "../models/ItemVenta.js";
import { Venta } from "../models/Venta.js";

export const AppDataSource = new DataSource({
  type: "postgres",
  host: DB_HOSTNAME,
  port: DB_PORT,
  username: DB_USERNAME,
  password: DB_PASSWORD,
  database: DB_DATABASE,
  synchronize: DEBUG,
  logging: DEBUG,
  entities: [Venta, ItemVenta],
  subscribers: [],
  migrations: [],
});

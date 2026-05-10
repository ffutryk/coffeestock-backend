import "reflect-metadata";
import { DataSource } from "typeorm";
import { DB_DATABASE, DB_HOSTNAME, DB_PASSWORD, DB_PORT, DB_USERNAME, DEBUG } from "./envs";
import { Producto } from "../models/Producto";
import { ItemVenta } from "../models/ItemVenta";
import { Venta } from "../models/Venta";

export const AppDataSource = new DataSource({
  type: "postgres",
  host: DB_HOSTNAME,
  port: DB_PORT,
  username: DB_USERNAME,
  password: DB_PASSWORD,
  database: DB_DATABASE,
  synchronize: DEBUG,
  logging: DEBUG,
  entities: [Producto, Venta, ItemVenta],
  subscribers: [],
  migrations: [],
});

import "reflect-metadata";
import { DataSource } from "typeorm";
import { DB_DATABASE, DB_HOSTNAME, DB_PASSWORD, DB_PORT, DB_USERNAME, DEBUG } from "./envs";
import { Producto } from "../models/entities/producto";
import { ItemVenta } from "../models/entities/item-venta";
import { Venta } from "../models/entities/venta";
import { Usuario } from "../models/entities/usuario";
import { MateriaPrima } from "../models/entities/materiaPrima";
import { Inventario } from "../models/entities/inventario";
import { MovimientoInventario } from "../models/entities/movimiento-inventario";

export const AppDataSource = new DataSource({
  type: "postgres",
  host: DB_HOSTNAME,
  port: DB_PORT,
  username: DB_USERNAME,
  password: DB_PASSWORD,
  database: DB_DATABASE,
  synchronize: DEBUG,
  logging: DEBUG,
  entities: [Producto, Venta, ItemVenta, Usuario, MateriaPrima, Inventario, MovimientoInventario],
  subscribers: [],
  migrations: [],
});

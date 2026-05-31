import { Producto } from "../../models/entities/producto";
import { BaseRepository } from "./base.interface";

export interface ProductoRepository extends BaseRepository<Producto> {
  findByIds(ids: number[]): Promise<Producto[]>;
  findWithInventarios(ids: number[]): Promise<Producto[]>;
}

import { Receta } from "../../models/entities/receta";
import { BaseRepository } from "./base.interface";

export interface RecetaRepository extends BaseRepository<Receta> {
  findByProductoId(idProducto: number): Promise<Receta[]>;
}

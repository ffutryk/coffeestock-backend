import { MovimientoInventario } from "../../models/entities/movimiento-inventario";
import { BaseRepository } from "./base.interface";

export interface MovimientoInventarioRepository extends BaseRepository<MovimientoInventario> {
  save(movimiento: MovimientoInventario): Promise<MovimientoInventario>;
}

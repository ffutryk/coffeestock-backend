import { MovimientoInventario } from "../../models/entities/movimiento-inventario";

export interface MovimientoInventarioDao {
  save(movimiento: MovimientoInventario): Promise<MovimientoInventario>;
}

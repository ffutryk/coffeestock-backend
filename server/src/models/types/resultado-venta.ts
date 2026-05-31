import { Inventario } from "../entities/inventario";
import { MovimientoInventario } from "../entities/movimiento-inventario";

export type ResultadoVenta = {
  inventariosModificados: Inventario[];
  movimientosGenerados: MovimientoInventario[];
};

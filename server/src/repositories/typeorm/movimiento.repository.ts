import { MovimientoInventarioRepository } from "../interfaces/movimiento.interface";
import { MovimientoInventario } from "../../models/entities/movimiento-inventario";
import { TypeOrmBaseRepository } from "./base.repository";

export class TypeORMMovimientoRepository
  extends TypeOrmBaseRepository<MovimientoInventario>
  implements MovimientoInventarioRepository
{
  constructor() {
    super(MovimientoInventario);
  }
}

import { MovimientoInventarioRepository } from "../interfaces/movimiento.interface";
import { AppDataSource } from "../../config/data-source";
import { MovimientoInventario } from "../../models/entities/movimiento-inventario";
import { TypeOrmBaseRepository } from "./base.repository";

export class TypeORMMovimientoRepository
  extends TypeOrmBaseRepository<MovimientoInventario>
  implements MovimientoInventarioRepository
{
  constructor() {
    super(MovimientoInventario);
  }
  async save(movimiento: MovimientoInventario): Promise<MovimientoInventario> {
    const repository = AppDataSource.getRepository(MovimientoInventario);

    return await repository.save(movimiento);
  }
}

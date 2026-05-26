import { MovimientoInventarioDao } from "../interfaces/movimiento.interface";
import { AppDataSource } from "../../config/data-source";
import { MovimientoInventario } from "../../models/entities/movimiento-inventario";

export class TypeORMMovimientoRepository implements MovimientoInventarioDao {

  async save(movimiento: MovimientoInventario): Promise<MovimientoInventario> {
    const repository = AppDataSource.getRepository(MovimientoInventario);

    return await repository.save(movimiento);
  }

}
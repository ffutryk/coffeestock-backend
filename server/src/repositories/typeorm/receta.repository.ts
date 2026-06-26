import { Receta } from "../../models/entities/receta";
import { RecetaRepository } from "../interfaces/receta.interface";
import { TypeOrmBaseRepository } from "./base.repository";

export class TypeOrmRecetaRepository
  extends TypeOrmBaseRepository<Receta>
  implements RecetaRepository
{
  constructor() {
    super(Receta);
  }

  async findByProductoId(idProducto: number): Promise<Receta[]> {
    return await this.repository.find({ where: { producto: { id: idProducto } } });
  }
}

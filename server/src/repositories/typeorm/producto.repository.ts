import { Producto } from "../../models/entities/producto";
import { ProductoRepository } from "../interfaces/producto.interface";
import { TypeOrmBaseRepository } from "./base.repository";
import { In } from "typeorm";

export class TypeOrmProductoRepository
  extends TypeOrmBaseRepository<Producto>
  implements ProductoRepository
{
  constructor() {
    super(Producto);
  }

  async findByIds(ids: number[]): Promise<Producto[]> {
    return await this.repository.findBy({ id: In(ids) });
  }
}

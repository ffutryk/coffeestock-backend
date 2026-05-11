import { Venta } from "../../models/entities/venta";
import { VentaRepository } from "../interfaces/venta.interface";
import { TypeOrmBaseRepository } from "./base.repository";
import { Paginacion } from "../../models/types/paginacion";
import { ResultadoPaginado } from "../../models/types/resultado-paginado";

export class TypeOrmVentaRepository
  extends TypeOrmBaseRepository<Venta>
  implements VentaRepository
{
  constructor() {
    super(Venta);
  }

  async findById(id: number): Promise<Venta | null> {
    return await this.repository.findOne({
      where: { id },
      relations: ["items"],
    });
  }

  async findManyWithItems({ page, limit }: Paginacion): Promise<ResultadoPaginado<Venta>> {
    const [data, total] = await this.repository.findAndCount({
      skip: (page - 1) * limit,
      take: limit,
      order: { createdAt: "DESC" },
      relations: ["items"],
    });
    return { data, total };
  }
}

import { AppDataSource } from "../config/data-source";
import { Venta } from "../models/Venta";
import type { VentaDao } from "../daos/VentaDao";
import { Paginacion } from "../models/Paginacion";
import { ResultadoPaginado } from "../models/ResultadoPaginado";

export class TypeOrmVentaDao implements VentaDao {
  private repository = AppDataSource.getRepository(Venta);

  async save(venta: Venta): Promise<Venta> {
    return await this.repository.save(venta);
  }

  async findById(id: number): Promise<Venta | null> {
    return await this.repository.findOne({
      where: { id },
      relations: ["items"]
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

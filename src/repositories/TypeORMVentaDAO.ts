import { AppDataSource } from "../config/data-source";
import { Venta } from "../models/entities/venta";
import type { VentaDao } from "../daos/VentaDao";
import { Paginacion } from "../models/types/paginacion";
import { ResultadoPaginado } from "../models/types/resultado-paginado";

export class TypeOrmVentaDao implements VentaDao {
  private repository = AppDataSource.getRepository(Venta);

  async save(venta: Venta): Promise<Venta> {
    return await this.repository.save(venta);
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

  async delete(id: number): Promise<boolean> {
    const result = await this.repository.softDelete(id);

    return (result.affected ?? 0) > 0;
  }
}

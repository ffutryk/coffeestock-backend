import { Venta } from "../../models/entities/venta";
import { VentaRepository } from "../interfaces/venta.interface";
import { TypeOrmBaseRepository } from "./base.repository";
import { Paginacion } from "../../models/types/paginacion";
import { ResultadoPaginado } from "../../models/types/resultado-paginado";
import { MoreThanOrEqual } from "typeorm";

export class TypeOrmVentaRepository extends TypeOrmBaseRepository<Venta>implements VentaRepository {
  constructor() {
    super(Venta);
  }

  async findById(id: number): Promise<Venta | null> {
    return await this.repository.findOne({
      where: { id },
      relations: ["items"],
    });
  }

  async findManyWithItems({ page, limit }: Paginacion, fechaDesde?: Date): Promise<ResultadoPaginado<Venta>> {
    const options: any = {
      skip: (page - 1) * limit,
      take: limit,
      order: { createdAt: "DESC" },
      relations: ["items"],
    };
    if (fechaDesde) {
      options.where = {createdAt: MoreThanOrEqual(fechaDesde)};
    }
    const [data, total] = await this.repository.findAndCount(options);
    return { data, total };
  }

  async findByIdWithInventories(id: number): Promise<Venta | null> {
    return await this.repository.findOne({
      where: { id },
      relations: [
        "items",
        "items.producto",
        "items.producto.recetas",
        "items.producto.recetas.materiaPrima",
        "items.producto.recetas.materiaPrima.inventario",
      ],
    });
  }

  async deleteItems(ventaId: number): Promise<void> {
    await this.repository.manager.delete("item_venta", { ventaId });
  }
}
